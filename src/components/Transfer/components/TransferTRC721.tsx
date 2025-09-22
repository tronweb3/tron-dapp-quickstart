import { useCallback, useRef, useTransition } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import Input from '../../FormItem/Input';
import { useLocale } from '../../../hooks/useLocale';
import { tronWeb } from '../../../utils/tronWeb';
import styles from './Transfers.module.scss';

export default function TransferTRC721() {
    const { t } = useLocale();
    const { message, notification } = App.useApp();
    const [isTransfering, startTransition] = useTransition();
    const fromAddress = useRef<string>('');
    const toAddress = useRef<string>('');
    const tokenId = useRef<number>(0);
    const { address: walletAddress, signTransaction } = useWallet();
    // Replace with your TRC721 contract address
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
        const value = Number(e.target.value);
        if (isNaN(value)) return;
        tokenId.current = value;
    }, []);
    const onSubmit = useCallback(async () => {
        console.log(
            'Transfer TRC721',
            contractAddress.current,
            fromAddress.current,
            toAddress.current,
            tokenId.current,
            walletAddress
        );
        if (
            !tronWeb.isAddress(fromAddress.current) ||
            !tronWeb.isAddress(toAddress.current) ||
            !tronWeb.isAddress(contractAddress.current) ||
            tokenId.current <= 0
        ) {
            message.error(t('sentence_peavcafa'));
            return;
        }
        if (!walletAddress) {
            message.error(t('sentence_pcywf'));
            return;
        }
        startTransition(async () => {
            try {
                const tx = await tronWeb.transactionBuilder.triggerSmartContract(
                    contractAddress.current,
                    'transferFrom(address,address,uint256)',
                    {
                        txLocal: true,
                    },
                    [
                        {
                            type: 'address',
                            value: fromAddress.current,
                        },
                        {
                            type: 'address',
                            value: toAddress.current,
                        },
                        {
                            type: 'uint256',
                            value: tokenId.current,
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
            <button className={styles.submit} disabled={isTransfering} onClick={onSubmit}>
                {t('Transfer')}
            </button>
        </div>
    );
}
