import { useCallback, useRef } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { useSendTransaction } from '../../../hooks/useSendTransaction';
import { tronWeb } from '../../../utils/tronWeb';
import { buildContractCall, getTRC20ContractDecimals } from '../../../utils/contract';
import { toTokenUnits } from '../../../utils/format';
import styles from './Transfers.module.scss';

export default function TransferTRC20() {
    const { t } = useLocale();
    const { message } = App.useApp();
    const { send, isPending } = useSendTransaction();
    const address = useRef<string>('');
    const amount = useRef<string>('');
    const { address: walletAddress } = useWallet();
    const contractAddress = useRef<string>('');
    const onChangeContractAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        contractAddress.current = e.target.value;
    }, []);
    const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        address.current = e.target.value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        amount.current = e.target.value;
    }, []);
    const onSubmit = useCallback(() => {
        if (
            !tronWeb.isAddress(address.current) ||
            !tronWeb.isAddress(contractAddress.current) ||
            !/^[0-9.]+$/.test(amount.current)
        ) {
            message.error(t('sentence_peavcara'));
            return;
        }
        send(async () => {
            // TRC20 amounts are scaled by the token's on-chain decimals.
            const decimals = await getTRC20ContractDecimals(contractAddress.current, walletAddress!);
            return buildContractCall(
                contractAddress.current,
                'transfer(address,uint256)',
                [
                    { type: 'address', value: address.current },
                    { type: 'uint256', value: toTokenUnits(amount.current, decimals) },
                ],
                walletAddress!
            );
        });
    }, [send, walletAddress, message, t]);
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
            <button className={styles.submit} disabled={isPending} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
