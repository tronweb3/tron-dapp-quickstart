import { useCallback, useRef, useTransition } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { tronWeb } from '../../../utils/tronWeb';
import styles from './Transfers.module.scss';

export default function TransferTRX() {
    const { t } = useLocale();
    const { message, notification } = App.useApp();
    const [isTransfering, startTransition] = useTransition();
    const address = useRef<string>('');
    const amount = useRef<number>(0);
    const { address: walletAddress, signTransaction } = useWallet();
    const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        address.current = e.target.value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        amount.current = value;
    }, []);
    const onSubmit = useCallback(async () => {
        console.log('Transfer TRX', address.current, amount.current, walletAddress);
        if (!tronWeb.isAddress(address.current) || amount.current <= 0) {
            message.error(t('sentence_peavaaa'));
            return;
        }
        if (!walletAddress) {
            message.error(t('sentence_pcywf'));
            return;
        }
        startTransition(async () => {
            try {
                const tx = await tronWeb.transactionBuilder.sendTrx(address.current, amount.current, walletAddress);
                // Sign the transaction using the tronwallet-adapter hook.
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
    }, [walletAddress, signTransaction, message, notification, t]);
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
            <button className={styles.submit} disabled={isTransfering} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
