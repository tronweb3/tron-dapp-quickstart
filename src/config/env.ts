/**
 * Centralized, validated app configuration sourced from Vite env vars (TDQ_* prefix).
 *
 * Why this exists: reading import.meta.env.* directly scatters untyped, unvalidated
 * access across the codebase. A missing var would silently become `undefined` and
 * blow up deep inside an SDK call. This module validates required vars once, at load,
 * and throws a single clear error so misconfiguration is obvious.
 *
 * Put public defaults in `.env` (committed) and secrets like the API key in
 * `.env.local` (git-ignored via `*.local`). See `.env.example`.
 */

function required(value: string | undefined, name: string): string {
    if (!value) {
        throw new Error(
            `[config] Missing required env var "${name}". ` +
                `Copy .env.example to .env (or .env.local) and set it. See README.`
        );
    }
    return value;
}

export interface AppConfig {
    /** TronGrid / full node endpoint used to build & broadcast transactions and read state. */
    fullHost: string;
    /** Optional TRON-PRO-API-KEY for TronGrid. Without it, public endpoints are heavily rate-limited. */
    apiKey?: string;
    /** Human-readable network label shown in the header (e.g. "Nile Testnet"). */
    chainName: string;
    /** Tronscan base URL for this network, used to build explorer deep links (no trailing slash). */
    explorerBase: string;
}

export const config: AppConfig = {
    fullHost: required(import.meta.env.TDQ_FULL_HOST, 'TDQ_FULL_HOST'),
    apiKey: import.meta.env.TDQ_API_KEY || undefined,
    chainName: import.meta.env.TDQ_CURRENT_CHAIN ?? 'Unknown Network',
    explorerBase: (import.meta.env.TDQ_EXPLORER_BASE ?? '').replace(/\/+$/, ''),
};
