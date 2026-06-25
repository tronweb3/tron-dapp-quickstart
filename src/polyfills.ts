// tronweb / ethers expect a global `Buffer` (and a `global` fallback) in the browser.
// This lightweight shim replaces `vite-plugin-node-polyfills` (which only polyfilled
// 'buffer' but dragged in the whole crypto-browserify/elliptic chain as dependencies).
// Must be imported first — before any module that touches Buffer at evaluation time.
import { Buffer } from 'buffer';

const g = globalThis as unknown as { Buffer?: typeof Buffer; global?: typeof globalThis };
g.Buffer = g.Buffer ?? Buffer;
g.global = g.global ?? globalThis;
