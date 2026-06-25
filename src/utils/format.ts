/**
 * Amount conversion helpers. On-chain token amounts are integers in the token's
 * smallest unit; UI shows human-readable decimals. Use BigNumber to avoid the
 * floating-point precision loss you'd get with plain Number math.
 */
import { BigNumber } from './tronWeb';

/**
 * Convert a human-readable amount (e.g. "1.5") to base units as a bigint (e.g. 1500000n for 6 decimals).
 * Uses ROUND_DOWN (truncation) on purpose: if a user types more fractional digits than the token
 * supports, we never send more than they entered.
 */
export function toTokenUnits(amount: string | number, decimals: number): bigint {
    const units = BigNumber(amount)
        .multipliedBy(BigNumber(10).pow(decimals))
        .integerValue(BigNumber.ROUND_DOWN)
        .toFixed(0);
    return BigInt(units);
}

/** Convert base units back to a human-readable string (e.g. 1500000 + 6 decimals -> "1.5"). */
export function fromTokenUnits(units: string | number | bigint, decimals: number): string {
    return BigNumber(units.toString())
        .dividedBy(BigNumber(10).pow(decimals))
        .toFixed();
}
