import { useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { App, Collapse, Empty, Flex, Progress, Spin, Table } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import dayjs from 'dayjs';
import clsx from 'clsx';
import Input from '../FormItem/Input';
import Select from '../FormItem/Select';
import { useLocale } from '../../hooks/useLocale';
import { DarkThemeContext } from '../../hooks/useDarkTheme';
import { tronWeb } from '../../utils/tronWeb';
import ExpandIcon from '../../assets/expand-icon.png';
import RefreshIcon from '../../assets/refresh-icon.png';
import ToggleIcon from '../../assets/toggle-icon.png';
import ToggleDarkIcon from '../../assets/toggle-dark-icon.png';
import EmptyImage from '../../assets/empty-image.png';
import EmptyImageDark from '../../assets/empty-image-dark.png';
import styles from './Delegate.module.scss';

import type { AnyObject } from 'antd/es/_util/type';
import type { Types } from 'tronweb';
import type { CollapseProps } from 'antd';
import type { FC, SyntheticEvent, TransitionStartFunction } from 'react';

const AccountInfo: FC = () => {
    const { address } = useWallet();
    const { t } = useLocale();
    const { notification } = App.useApp();
    const [balance, setBalance] = useState<number>(0);
    const [energy, setEnergy] = useState<number>(0);
    const [energyLimit, setEnergyLimit] = useState<number>(0);
    const [bandwidth, setBandWidth] = useState<number>(0);
    const [bandwidthLimit, setBandWidthLimit] = useState<number>(0);

    const [isLoading, startTransition] = useTransition();

    const getInfo = useCallback(async () => {
        if (!address) return;
        startTransition(async () => {
            const [
                balance = 0,
                { NetLimit = 0, freeNetLimit = 0, NetUsed = 0, freeNetUsed = 0, EnergyLimit = 0, EnergyUsed = 0 },
            ] = await Promise.all([tronWeb.trx.getBalance(address), tronWeb.trx.getAccountResources(address)]).catch(
                (err) => {
                    notification.error({
                        message: t('sentence_gaif'),
                        description: err instanceof Error ? err.message : String(err),
                    });
                    return [0, {} as Types.AccountResourceMessage] as const;
                }
            );
            startTransition(() => {
                setBalance(balance / 1e6);
                setBandWidth(NetLimit + freeNetLimit - NetUsed - freeNetUsed);
                setBandWidthLimit(NetLimit + freeNetLimit);
                setEnergy(EnergyLimit - EnergyUsed);
                setEnergyLimit(EnergyLimit);
            });
        });
    }, [address, notification, t]);

    const onRefresh = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            getInfo();
        },
        [getInfo]
    );

    const infoContent = useMemo(() => {
        if (!address) {
            return <div className={styles['accountInfo-noAddress']}>{t('sentence_pcywf')}</div>;
        }
        if (isLoading) {
            return <Spin className={styles['accountInfo-spin']} />;
        }
        return (
            <>
                <div className={styles['accountInfo-balance-title']}>{t('TRX Balance')}</div>
                <div className={styles['accountInfo-balance-value']}>
                    {balance} <span className={styles['accountInfo-balance-unit']}>TRX</span>
                </div>
                <div className={styles['accountInfo-resources']}>
                    <div className={styles['accountInfo-resource']}>
                        <Flex justify="space-between">
                            <span>{t('Energy')}</span>
                            <span>
                                {energy}
                                <span className={styles['accountInfo-resource-total']}>/{energyLimit}</span>
                            </span>
                        </Flex>
                        <Progress
                            percent={energyLimit ? (energy / energyLimit) * 100 : 0}
                            showInfo={false}
                            strokeColor="#D1F400"
                            trailColor="#FFFFFF33"
                            size={['100%', 5]}
                        ></Progress>
                    </div>
                    <div className={styles['accountInfo-resource']}>
                        <Flex justify="space-between">
                            <span>{t('Bandwidth')}</span>
                            <span>
                                {bandwidth}
                                <span className={styles['accountInfo-resource-total']}>/{bandwidthLimit}</span>
                            </span>
                        </Flex>
                        <Progress
                            percent={bandwidthLimit ? (bandwidth / bandwidthLimit) * 100 : 0}
                            showInfo={false}
                            strokeColor="#FF7D2F"
                            trailColor="#FFFFFF33"
                            size={['100%', 5]}
                        ></Progress>
                    </div>
                </div>
            </>
        );
    }, [address, balance, bandwidth, bandwidthLimit, energy, energyLimit, isLoading, t]);

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <div className={styles['accountInfo-title']}>{t('Account Info')}</div>,
            children: infoContent,
            extra: (
                <>
                    <img src={RefreshIcon} alt="" className={styles['refreshIcon']} onClick={onRefresh} />
                </>
            ),
        },
    ];

    useEffect(() => {
        getInfo();
    }, [getInfo]);

    return (
        <div className={styles.accountInfo}>
            <Collapse
                expandIconPosition="end"
                items={items}
                ghost
                expandIcon={() => <img src={ExpandIcon} className={styles['expandIcon']}></img>}
            ></Collapse>
        </div>
    );
};

function useOnFinishCallback<Values>({
    startTransition,
    createTx,
}: {
    startTransition: TransitionStartFunction;
    createTx: (values: Values) => Promise<Types.Transaction>;
}) {
    const { t } = useLocale();
    const { address, signTransaction } = useWallet();
    const { message, notification } = App.useApp();

    return (values: Values) => {
        if (!address) {
            message.error(t('sentence_pcywf'));
            return;
        }
        startTransition(async () => {
            try {
                const tx = await createTx(values);
                const signedTx = await signTransaction(tx);
                const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
                if (receipt.result) {
                    notification.success({
                        message: t('sentence_ts'),
                    });
                } else {
                    notification.error({
                        message: t('sentence_tf'),
                        description: tronWeb.toUtf8(receipt.message),
                    });
                }
            } catch (error) {
                notification.error({
                    message: t('sentence_tf'),
                    description: error instanceof Error ? error.message : String(error),
                });
            }
        });
    };
}

const FreezeOperation: FC = () => {
    type Values = {
        amount: number;
        type: 'BANDWIDTH' | 'ENERGY';
    };
    const { t } = useLocale();
    const { address } = useWallet();
    const [isSubmiting, startTransition] = useTransition();
    const amount = useRef<Values['amount']>(0);
    const type = useRef<Values['type']>('BANDWIDTH');
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        amount.current = value;
    }, []);
    const onChangeType = useCallback((value: Values['type']) => {
        type.current = value;
    }, []);
    const onFinish = useOnFinishCallback({
        startTransition,
        createTx: ({ amount, type }: Values) => {
            return tronWeb.transactionBuilder.freezeBalanceV2(amount, type, address!);
        },
    });
    const onClickSubmit = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            onFinish({ amount: amount.current, type: type.current });
        },
        [onFinish]
    );
    return (
        <>
            <Input
                name={t('inputLabel_fa2')}
                placeholder={t('placeholder_ea')}
                required
                unit="SUN"
                onChange={onChangeAmount}
                size="small"
            ></Input>
            <Select
                className={styles['freezeOperation-formItem']}
                name={t('inputLabel_rt')}
                placeholder={t('placeholder_srt')}
                required
                options={
                    [
                        {
                            label: t('BANDWIDTH'),
                            value: 'BANDWIDTH',
                        },
                        {
                            label: t('ENERGY'),
                            value: 'ENERGY',
                        },
                    ] as const
                }
                onChange={onChangeType}
                size="small"
            ></Select>
            <button className={styles['freezeOperation-submitButton']} disabled={isSubmiting} onClick={onClickSubmit}>
                {t('Freeze')}
            </button>
        </>
    );
};

const DelegateOperation: FC = () => {
    type Values = {
        receiver: string;
        type: 'BANDWIDTH' | 'ENERGY';
        amount: number;
        lockPeriod: number;
    };
    const { t } = useLocale();
    const { address } = useWallet();
    const [isSubmiting, startTransition] = useTransition();
    const receiver = useRef<Values['receiver']>('');
    const type = useRef<Values['type']>('BANDWIDTH');
    const amount = useRef<Values['amount']>(0);
    const lockPeriod = useRef<Values['lockPeriod']>(0);
    const onChangeReceiverAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        receiver.current = e.target.value;
    }, []);
    const onChangeType = useCallback((value: Values['type']) => {
        type.current = value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        amount.current = value;
    }, []);
    const onChangeLockPeriod = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        lockPeriod.current = value;
    }, []);
    const onFinish = useOnFinishCallback({
        startTransition,
        createTx: ({ amount, type, receiver, lockPeriod }: Values) => {
            return tronWeb.transactionBuilder.delegateResource(
                amount,
                receiver,
                type,
                address!,
                lockPeriod > 0,
                lockPeriod
            );
        },
    });
    const onClickSubmit = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            onFinish({
                receiver: receiver.current,
                type: type.current,
                amount: amount.current,
                lockPeriod: lockPeriod.current,
            });
        },
        [onFinish]
    );

    return (
        <>
            <Input
                name={t('inputLabel_ra2')}
                placeholder={t('placeholder_era')}
                required
                onChange={onChangeReceiverAddress}
                size="small"
            ></Input>
            <Select
                className={styles['freezeOperation-formItem']}
                required
                name={t('inputLabel_rt')}
                placeholder={t('placeholder_srt')}
                options={
                    [
                        {
                            label: t('BANDWIDTH'),
                            value: 'BANDWIDTH',
                        },
                        {
                            label: t('ENERGY'),
                            value: 'ENERGY',
                        },
                    ] as const
                }
                onChange={onChangeType}
                size="small"
            ></Select>
            <Input
                className={styles['freezeOperation-formItem']}
                name={t('inputLabel_da')}
                placeholder={t('placeholder_ea')}
                required
                unit="SUN"
                onChange={onChangeAmount}
                size="small"
            ></Input>
            <Input
                className={styles['freezeOperation-formItem']}
                name={t('inputLabel_lp')}
                placeholder={t('placeholder_elp')}
                unit={t('inputUnit_bt')}
                onChange={onChangeLockPeriod}
                size="small"
            ></Input>
            <button className={styles['freezeOperation-submitButton']} disabled={isSubmiting} onClick={onClickSubmit}>
                {t('Delegate')}
            </button>
        </>
    );
};

const DelegateOperations: FC = () => {
    const { t } = useLocale();
    const { isDarkMode } = useContext(DarkThemeContext);
    const items1: CollapseProps['items'] = [
        {
            key: 'freezeBalance',
            label: <div className={styles['delegateOperation-title']}>{t('Freeze Balance')}</div>,
            children: <FreezeOperation></FreezeOperation>,
        },
    ];
    const items2: CollapseProps['items'] = [
        {
            key: 'delegateResource',
            label: <div className={styles['delegateOperation-title']}>{t('Delegate Resource')}</div>,
            children: <DelegateOperation></DelegateOperation>,
        },
    ];
    return (
        <>
            <Collapse
                expandIconPosition="end"
                items={items1}
                className={styles.delegateOperation}
                ghost
                expandIcon={() => (
                    <img src={isDarkMode ? ToggleDarkIcon : ToggleIcon} className={styles['expandIcon']}></img>
                )}
            ></Collapse>
            <Collapse
                expandIconPosition="end"
                items={items2}
                className={clsx([styles.delegateOperation, styles['delegateOperation-last']])}
                ghost
                expandIcon={() => (
                    <img src={isDarkMode ? ToggleDarkIcon : ToggleIcon} className={styles['expandIcon']}></img>
                )}
            ></Collapse>
        </>
    );
};

const DelegateContent: FC = () => {
    const { t } = useLocale();
    const { address } = useWallet();
    const { notification } = App.useApp();
    const [dataSource, setDataSource] = useState<AnyObject[] | undefined>(undefined);
    const [isLoading, startTransition] = useTransition();
    const { isDarkMode } = useContext(DarkThemeContext);
    const columns = useMemo(() => {
        return [
            {
                title: t('inputLabel_fa'),
                dataIndex: 'fromAddress',
                key: 'fromAddress',
            },
            {
                title: t('inputLabel_ta'),
                dataIndex: 'toAddress',
                key: 'toAddress',
            },
            {
                title: t('inputLabel_a'),
                dataIndex: 'amount',
                key: 'amount',
            },
            {
                title: t('inputLabel_type'),
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: t('inputLabel_ut'),
                dataIndex: 'unlockTime',
                key: 'unlockTime',
            },
        ];
    }, [t]);

    const getDelegatedResourceV2 = useCallback(async () => {
        if (!address) return [];
        try {
            const { fromAccounts = [], toAccounts = [] } =
                await tronWeb.trx.getDelegatedResourceAccountIndexV2(address);
            const data = await Promise.all([
                ...fromAccounts.map((account) => {
                    return tronWeb.trx.getDelegatedResourceV2(account, address);
                }),
                ...toAccounts.map((account) => {
                    return tronWeb.trx.getDelegatedResourceV2(address, account);
                }),
            ]);
            return data;
        } catch (err) {
            notification.error({
                message: t('sentence_gdrf'),
                description: err instanceof Error ? err.message : String(err),
            });
            return [];
        }
    }, [address, notification, t]);

    const fetchData = useCallback(async () => {
        startTransition(async () => {
            const data = await getDelegatedResourceV2();
            startTransition(() => {
                setDataSource(
                    data
                        .map(({ delegatedResource }) => delegatedResource)
                        .flat()
                        .map((item) => {
                            let type = 'BANDWIDTH';
                            let amount = item.frozen_balance_for_bandwidth;
                            let unlockTime = item.expire_time_for_bandwidth;
                            if (item.frozen_balance_for_energy) {
                                type = 'ENERGY';
                                amount = item.frozen_balance_for_energy;
                                unlockTime = item.expire_time_for_energy;
                            }
                            return {
                                key: item.from + item.to,
                                fromAddress: tronWeb.address.fromHex(item.from),
                                toAddress: tronWeb.address.fromHex(item.to),
                                amount: amount / 1e6,
                                type: type,
                                unlockTime: unlockTime ? dayjs(unlockTime).format('YYYY-MM-DD HH:mm:ss') : '-',
                            };
                        })
                );
            });
        });
    }, [getDelegatedResourceV2]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={styles.delegateContent}>
            <Table
                className={styles['delegateContent-table']}
                dataSource={dataSource}
                columns={columns}
                loading={isLoading}
                rowClassName={styles['delegateContent-tableRow']}
                pagination={false}
                locale={{
                    emptyText: <Empty image={isDarkMode ? EmptyImageDark : EmptyImage} description="" />,
                }}
            ></Table>
        </div>
    );
};

const Delegate: FC = () => {
    return (
        <Flex gap="middle" className={styles.delegate}>
            <aside className={styles['delegate-aside']}>
                <AccountInfo />
                <DelegateOperations />
            </aside>
            <section className={styles['delegate-content']}>
                <DelegateContent />
            </section>
        </Flex>
    );
};

export default Delegate;
