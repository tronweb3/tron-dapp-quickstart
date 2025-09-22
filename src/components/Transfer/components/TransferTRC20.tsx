import { useCallback, useRef, useTransition } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { tronWeb, BigNumber, getTRC20ContractDecimals } from '../../../utils/tronWeb';
import styles from './Transfers.module.scss';

export default function TransferTRC20() {
    const { t } = useLocale();
    const { message, notification } = App.useApp();
    const [isTransfering, startTransition] = useTransition();
    const address = useRef<string>('');
    const amount = useRef<string>('');
    const { address: walletAddress, signTransaction } = useWallet();
    // Replace with your TRC20 contract address
    const contractAddress = useRef<string>('');
    const onChangeContractAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        contractAddress.current = e.target.value;
    }, []);
    const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        address.current = e.target.value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        amount.current = value;
    }, []);
    const onSubmit = useCallback(async () => {
        console.log('Transfer TRC20', contractAddress.current, address.current, amount.current, walletAddress);
        if (
            !tronWeb.isAddress(address.current) ||
            !tronWeb.isAddress(contractAddress.current) ||
            !/^[0-9.]+$/.test(amount.current)
        ) {
            message.error(t('sentence_peavcara'));
            return;
        }
        if (!walletAddress) {
            message.error(t('sentence_pcywf'));
            return;
        }
        startTransition(async () => {
            try {
                const decimals = await getTRC20ContractDecimals(contractAddress.current, walletAddress);
                const tx = await tronWeb.transactionBuilder.triggerSmartContract(
                    contractAddress.current,
                    'transfer(address,uint256)',
                    {
                        txLocal: true,
                    },
                    [
                        {
                            type: 'address',
                            value: address.current,
                        },
                        {
                            type: 'uint256',
                            value: BigInt(
                                BigNumber(amount.current)
                                    .multipliedBy(BigNumber(10).pow(decimals.toString()))
                                    .integerValue()
                                    .toString(10)
                            ),
                        },
                    ],
                    walletAddress
                );
                // Sign the transaction using the tronwallet-adapter hook.
                const signedTx = await signTransaction(tx.transaction);
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
    }, [walletAddress, signTransaction, message, notification, t]);
    return (
        <div className={styles.transferContainer}>
            <Input
                className={styles.input}
                placeholder={t('placeholder_eca')}
                onChange={onChangeContractAddress}
                name={t('inputLabel_ca')}
            />
            <Input
                className={styles.input}
                placeholder={t('placeholder_era')}
                onChange={onChangeAddress}
                name={t('inputLabel_ra')}
            />
            <Input
                className={styles.input}
                placeholder={t('placeholder_ea')}
                name={t('inputLabel_a')}
                onChange={onChangeAmount}
            />
            <button className={styles.submit} disabled={isTransfering} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
