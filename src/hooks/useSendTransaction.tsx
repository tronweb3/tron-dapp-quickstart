import { useCallback, useRef, useState, useTransition } from 'react';
import { App } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useLocale } from './useLocale';
import { tronWeb } from '../utils/tronWeb';
import { explorerTxUrl } from '../utils/explorer';

import type { Types } from 'tronweb';

/**
 * One hook for the entire write path: it checks the wallet is connected, signs the
 * transaction with the connected adapter, broadcasts it, optionally polls the chain
 * for real confirmation (so contract REVERTs are surfaced, not mistaken for success),
 * and shows a localized toast with a Tronscan link.
 *
 * Adding a new transaction type then only means writing the `transactionBuilder.*`
 * call passed to `send`.
 *
 * @example
 * const { send, isPending } = useSendTransaction();
 * send(() => tronWeb.transactionBuilder.sendTrx(to, amountSun, from));
 */
export interface UseSendTransactionOptions {
    /** Poll getTransactionInfo until the tx is confirmed on-chain. Default: true. */
    waitForReceipt?: boolean;
    /** Override the success toast title. */
    successMessage?: string;
    /** Override the error toast title. */
    errorMessage?: string;
    /** Called after on-chain confirmation (or broadcast, if waitForReceipt is false). */
    onSuccess?: (txID: string) => void;
    /** Called when building/signing/broadcasting/confirmation fails. */
    onError?: (error: unknown) => void;
}

interface TxInfo {
    id?: string;
    result?: string;
    resMessage?: string;
    receipt?: { result?: string };
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Poll the full node until the tx is packed into a block. Returns 'pending' if it
 * doesn't appear in time. Uses getUnconfirmedTransactionInfo (full node,
 * wallet/gettransactioninfobyid) which returns within ~3s — unlike getTransactionInfo,
 * which hits the solidity node and only responds after irreversibility (~57s+), too
 * slow to surface a REVERT to the user.
 */
async function waitForConfirmation(txID: string, tries = 10, interval = 3000): Promise<'confirmed' | 'pending'> {
    for (let i = 0; i < tries; i++) {
        await sleep(interval);
        let info: TxInfo | undefined;
        try {
            info = (await tronWeb.trx.getUnconfirmedTransactionInfo(txID)) as unknown as TxInfo;
        } catch {
            info = undefined;
        }
        if (info?.id) {
            const status = info.receipt?.result;
            if (info.result === 'FAILED' || (status && status !== 'SUCCESS')) {
                const reason = info.resMessage ? tronWeb.toUtf8(info.resMessage) : (status ?? 'FAILED');
                throw new Error(reason);
            }
            return 'confirmed';
        }
    }
    return 'pending';
}

export function useSendTransaction(options: UseSendTransactionOptions = {}) {
    const { t } = useLocale();
    const { address, signTransaction } = useWallet();
    const { message, notification } = App.useApp();
    const [isPending, startTransition] = useTransition();
    const [txID, setTxID] = useState<string>();
    const [error, setError] = useState<unknown>();

    // Keep latest options without forcing `send` to change identity every render.
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const send = useCallback(
        (buildTx: () => Promise<Types.Transaction>) => {
            const opts = optionsRef.current;
            if (!address) {
                message.error(t('sentence_pcywf'));
                return;
            }
            startTransition(async () => {
                setError(undefined);
                try {
                    const tx = await buildTx();
                    const signedTx = await signTransaction(tx);
                    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
                    if (!receipt.result) {
                        throw new Error(receipt.message ? tronWeb.toUtf8(receipt.message) : t('sentence_tf'));
                    }
                    const id = signedTx.txID;
                    setTxID(id);

                    let status: 'confirmed' | 'pending' = 'confirmed';
                    if (opts.waitForReceipt !== false) {
                        status = await waitForConfirmation(id);
                    }

                    const url = explorerTxUrl(id);
                    notification.success({
                        message:
                            opts.successMessage ?? (status === 'pending' ? t('sentence_tp') : t('sentence_ts')),
                        description: url ? (
                            <a href={url} target="_blank" rel="noreferrer">
                                {t('label_vot')}
                            </a>
                        ) : (
                            id
                        ),
                    });
                    opts.onSuccess?.(id);
                } catch (err) {
                    setError(err);
                    notification.error({
                        message: opts.errorMessage ?? t('sentence_tf'),
                        description: err instanceof Error ? err.message : String(err),
                    });
                    opts.onError?.(err);
                }
            });
        },
        [address, signTransaction, message, notification, t]
    );

    return { send, isPending, txID, error };
}
