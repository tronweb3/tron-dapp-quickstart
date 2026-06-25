import { useCallback, useRef } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { useSendTransaction } from '../../../hooks/useSendTransaction';
import { tronWeb, getTokenPrecision, BigNumber } from '../../../utils/tronWeb';
import styles from './Transfers.module.scss';

export default function TransferTRC10() {
    const { t } = useLocale();
    const { message } = App.useApp();
    const { send, isPending } = useSendTransaction();
    const address = useRef<string>('');
    const tokenId = useRef<string>('');
    const amount = useRef<string>('');
    const { address: walletAddress } = useWallet();
    const onChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        address.current = e.target.value;
    }, []);
    const onChangeTokenId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        tokenId.current = e.target.value;
    }, []);
    const onChangeAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        amount.current = e.target.value;
    }, []);
    const onSubmit = useCallback(() => {
        if (!tronWeb.isAddress(address.current) || tokenId.current.length === 0 || !/^[0-9.]+$/.test(amount.current)) {
            message.error(t('sentence_peavatia'));
            return;
        }
        send(async () => {
            const decimals = await getTokenPrecision(tokenId.current);
            const value = BigNumber(amount.current)
                .multipliedBy(BigNumber(10).pow(decimals))
                .integerValue(BigNumber.ROUND_DOWN)
                .toNumber();
            return tronWeb.transactionBuilder.sendToken(address.current, value, tokenId.current, walletAddress!);
        });
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
            <button className={styles.submit} disabled={isPending} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
