import { useCallback, useRef } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { useSendTransaction } from '../../../hooks/useSendTransaction';
import { tronWeb } from '../../../utils/tronWeb';
import styles from './Transfers.module.scss';

export default function TransferTRX() {
    const { t } = useLocale();
    const { message } = App.useApp();
    const { send, isPending } = useSendTransaction();
    const address = useRef<string>('');
    const amount = useRef<number>(0);
    const { address: walletAddress } = useWallet();
    const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        address.current = e.target.value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        amount.current = value;
    }, []);
    const onSubmit = useCallback(() => {
        if (!tronWeb.isAddress(address.current) || amount.current <= 0) {
            message.error(t('sentence_peavaaa'));
            return;
        }
        // Build the transaction; useSendTransaction handles sign -> broadcast -> confirm -> notify.
        send(() => tronWeb.transactionBuilder.sendTrx(address.current, amount.current, walletAddress!));
    }, [send, walletAddress, message, t]);
    return (
        <div className={styles.transferContainer}>
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
                unit="SUN"
                description="1 TRX = 1,000,000 sun"
                onChange={onChangeAmount}
            />
            <button className={styles.submit} disabled={isPending} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
