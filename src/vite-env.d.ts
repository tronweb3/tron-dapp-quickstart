/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** TronGrid / full node endpoint, e.g. https://nile.trongrid.io */
    readonly TDQ_FULL_HOST: string;
    /** Optional TronGrid TRON-PRO-API-KEY (recommended; put in .env.local). */
    readonly TDQ_API_KEY?: string;
    /** Human-readable network label shown in the header. */
    readonly TDQ_CURRENT_CHAIN?: string;
    /** Tronscan base URL for explorer deep links, e.g. https://nile.tronscan.org */
    readonly TDQ_EXPLORER_BASE?: string;
}
