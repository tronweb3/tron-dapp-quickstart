import { TronWeb } from 'tronweb';
import { config } from '../config/env';

export { BigNumber } from 'tronweb';

/**
 * Shared read/build TronWeb instance. Signing is done by the connected wallet via
 * the tronwallet-adapter (`useWallet().signTransaction`), not by this instance.
 *
 * The TRON-PRO-API-KEY header is attached when an API key is configured, which lifts
 * TronGrid's aggressive rate limits on public endpoints.
 */
export const tronWeb = new TronWeb({
    fullHost: config.fullHost,
    headers: config.apiKey ? { 'TRON-PRO-API-KEY': config.apiKey } : undefined,
});

/** Read a TRC10 token's precision via `trx.getTokenByID`. */
export const getTokenPrecision = async (tokenId: string) => {
    const token = await tronWeb.trx.getTokenByID(tokenId);
    return token.precision;
};
