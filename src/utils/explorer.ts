/**
 * Tronscan deep-link helpers. The base URL is per-network and comes from
 * TDQ_EXPLORER_BASE (see src/config/env.ts). Returns an empty string when no
 * explorer base is configured, so callers can conditionally render the link.
 */
import { config } from '../config/env';

function link(path: string): string {
    // Current Tronscan SPA uses plain paths (e.g. /transaction/<id>), not the legacy /#/ hash route.
    return config.explorerBase ? `${config.explorerBase}/${path}` : '';
}

export const explorerTxUrl = (txID: string) => link(`transaction/${txID}`);
export const explorerAddressUrl = (address: string) => link(`address/${address}`);
export const explorerContractUrl = (address: string) => link(`contract/${address}`);
