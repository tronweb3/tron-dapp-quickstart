/**
 * Generic smart-contract helpers so you don't re-implement the build/sign/broadcast
 * dance for every contract. Pair `buildContractCall` (write) with the
 * `useSendTransaction` hook, and use `readContract` / `getContract` for view calls.
 */
import { tronWeb } from './tronWeb';
import { TRC20_ABI } from '../abis/trc20';

import type { Types } from 'tronweb';

export interface ContractParam {
    /** Solidity type, e.g. 'address' | 'uint256' | 'bool'. */
    type: string;
    value: unknown;
}

type TriggerArgs = Parameters<typeof tronWeb.transactionBuilder.triggerSmartContract>;

/** A contract handle whose ABI methods return a `.call()`-able read. */
type ReadableContract = Record<
    string,
    (...args: unknown[]) => { call: (options?: { from?: string }) => Promise<unknown> }
>;

/**
 * Get a typed contract handle. Equivalent to `tronWeb.contract(abi, address)`, e.g.
 * `await getContract(addr, MY_ABI).balanceOf(owner).call()`.
 */
export function getContract(address: string, abi: readonly unknown[] = TRC20_ABI) {
    return tronWeb.contract(abi as never, address);
}

/**
 * Read a constant (view/pure) contract function. No wallet/signing needed; the result
 * is ABI-decoded for you.
 *
 * @example const bal = await readContract<bigint>(usdt, TRC20_ABI, 'balanceOf', [owner], { from: owner });
 */
export async function readContract<T = unknown>(
    address: string,
    abi: readonly unknown[],
    method: string,
    args: unknown[] = [],
    options: { from?: string } = {}
): Promise<T> {
    const contract = tronWeb.contract(abi as never, address) as unknown as ReadableContract;
    const fn = contract[method];
    if (typeof fn !== 'function') {
        throw new Error(`readContract: method "${method}" not found in the provided ABI`);
    }
    return (await fn(...args).call(options)) as T;
}

/**
 * Build a state-changing (write) contract transaction. The returned unsigned tx should
 * be passed to `useSendTransaction().send(...)`, which signs and broadcasts it.
 *
 * @example
 * send(() => buildContractCall(usdt, 'transfer(address,uint256)', [
 *   { type: 'address', value: to },
 *   { type: 'uint256', value: amount },
 * ], myAddress));
 */
export async function buildContractCall(
    address: string,
    functionSelector: string,
    params: ContractParam[],
    issuerAddress: string,
    options: Record<string, unknown> = {}
): Promise<Types.Transaction> {
    const res = await tronWeb.transactionBuilder.triggerSmartContract(
        address,
        functionSelector,
        { txLocal: true, ...options } as TriggerArgs[2],
        params as TriggerArgs[3],
        issuerAddress
    );
    if (res.result?.result === false) {
        throw new Error('buildContractCall: node rejected the contract call while building the transaction');
    }
    return res.transaction;
}

/** Read a TRC20 token's `decimals()`. */
export async function getTRC20ContractDecimals(address: string, from: string): Promise<number> {
    const decimals = await readContract<number | bigint>(address, TRC20_ABI, 'decimals', [], { from });
    return Number(decimals);
}
