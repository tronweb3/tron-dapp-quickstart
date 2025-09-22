import { TronWeb } from 'tronweb';

export { BigNumber } from 'tronweb';

export const tronWeb = new TronWeb({
    fullHost: import.meta.env.TDQ_NILE_TEST_NET,
});

export const getTRC20ContractDecimals = async (contractAddress: string, from: string) => {
    // TRC20 contract should implement decimals function.
    const abi = [
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    name: '',
                    type: 'uint8',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ] as const;
    const contract = tronWeb.contract(abi, contractAddress);
    return contract.decimals().call({ from });
};

export const getTokenPrecision = async (tokenId: string) => {
    const token = await tronWeb.trx.getTokenByID(tokenId);
    return token.precision;
};
