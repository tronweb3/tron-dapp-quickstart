/**
 * Minimal standard TRC20 ABI. TRON ABIs are EVM-style JSON, so this is the same
 * shape you'd hand to `tronWeb.contract(abi, address)`.
 *
 * Drop your own contract's ABI next to this file and import it the same way to get
 * a typed handle via `getContract(address, MY_ABI)` (see ../utils/contract.ts).
 */
export const TRC20_ABI = [
    { constant: true, inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { constant: true, inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
    { constant: true, inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
    { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;
