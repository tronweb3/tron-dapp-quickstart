import { useCallback, useRef } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { useSendTransaction } from '../../../hooks/useSendTransaction';
import { tronWeb } from '../../../utils/tronWeb';
import { buildContractCall } from '../../../utils/contract';
import styles from './Transfers.module.scss';

export default function TransferTRC721() {
    const { t } = useLocale();
    const { message } = App.useApp();
    const { send, isPending } = useSendTransaction();
    const fromAddress = useRef<string>('');
    const toAddress = useRef<string>('');
    // Kept as a string: TRC721 token ids are uint256 and can exceed JS Number's safe range.
    const tokenId = useRef<string>('');
    const { address: walletAddress } = useWallet();
    const contractAddress = useRef<string>('');
    const onChangeContractAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        contractAddress.current = e.target.value;
    }, []);
    const onChangeFromAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        fromAddress.current = e.target.value;
    }, []);
    const onChangeToAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        toAddress.current = e.target.value;
    }, []);
    const onChangeTokenId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        tokenId.current = e.target.value;
    }, []);
    const onSubmit = useCallback(() => {
        if (
            !tronWeb.isAddress(fromAddress.current) ||
            !tronWeb.isAddress(toAddress.current) ||
            !tronWeb.isAddress(contractAddress.current) ||
            !/^[0-9]+$/.test(tokenId.current)
        ) {
            message.error(t('sentence_peavcafa'));
            return;
        }
        send(() =>
            buildContractCall(
                contractAddress.current,
                'transferFrom(address,address,uint256)',
                [
                    { type: 'address', value: fromAddress.current },
                    { type: 'address', value: toAddress.current },
                    { type: 'uint256', value: tokenId.current },
                ],
                walletAddress!
            )
        );
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
                placeholder={t('placeholder_efa')}
                onChange={onChangeFromAddress}
                name={t('inputLabel_fa')}
            />
            <Input
                className={styles.input}
                placeholder={t('placeholder_eta')}
                onChange={onChangeToAddress}
                name={t('inputLabel_ta')}
            />
            <Input
                className={styles.input}
                placeholder={t('placeholder_eti')}
                onChange={onChangeTokenId}
                name="Token ID"
            />
            <button className={styles.submit} disabled={isPending} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
