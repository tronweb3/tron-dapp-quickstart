import { useCallback, useRef, useTransition } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { tronWeb, getTokenPrecision, BigNumber } from '../../../utils/tronWeb';
import styles from './Transfers.module.scss';

export default function TransferTRC10() {
    const { t } = useLocale();
    const { message, notification } = App.useApp();
    const [isTransfering, startTransition] = useTransition();
    const address = useRef<string>('');
    const tokenId = useRef<string>('');
    const amount = useRef<string>('');
    const { address: walletAddress, signTransaction } = useWallet();
    const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        address.current = e.target.value;
    }, []);
    const onChangeTokenId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        tokenId.current = e.target.value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        amount.current = value;
    }, []);
    const onSubmit = useCallback(() => {
        console.log('Transfer TRC10', address.current, tokenId.current, amount.current, walletAddress);
        if (!tronWeb.isAddress(address.current) || tokenId.current.length === 0 || !/^[0-9.]+$/.test(amount.current)) {
            message.error(t('sentence_peavatia'));
            return;
        }
        if (!walletAddress) {
            message.error(t('sentence_pcywf'));
            return;
        }
        startTransition(async () => {
            try {
                const decimals = await getTokenPrecision(tokenId.current);
                const tx = await tronWeb.transactionBuilder.sendToken(
                    address.current,
                    BigNumber(amount.current)
                        .multipliedBy(BigNumber(10).pow(decimals))
                        .integerValue(BigNumber.ROUND_DOWN)
                        .toNumber(),
                    tokenId.current,
                    walletAddress
                );
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
                placeholder={t('placeholder_eti')}
                onChange={onChangeTokenId}
                name="Token ID"
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
