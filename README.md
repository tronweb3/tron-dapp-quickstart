# TRON DApp Quickstart

A modern **TRON DApp starter template** that helps developers quickly build decentralized applications on the **TRON blockchain**.  
It demonstrates **wallet integration**, **sending transactions**, and **interacting with smart contracts** — core features most TRON DApps require.

Any questions, feedback or feture requests are welcome [here](https://github.com/tronweb3/tron-dapp-quickstart/issues/new).

---

## Tech Stack

- **TronWeb** – TRON blockchain SDK
- **TronWalletAdapter** – Wallet connection & signing
- **React 19 + TypeScript 5.8.3** – Frontend framework
- **Vite 7.1.2** – Fast build tool

---

## Quick Start

```bash
# 1. Clone this repo
git clone https://github.com/tronweb3/tron-dapp-quickstart.git

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Environment requirements:

- Node.js 22+
- npm 10.5.0+

---

## Project Structure

```
tron-dapp-quickstart
├── src
│   ├── assets         # Static assets (images, etc.)
│   ├── components     # Reusable UI components
│   ├── hooks          # Custom React hooks
│   ├── pages          # Page-level components
│   ├── router         # Route configuration
│   ├── utils          # Utility functions
│   ├── App.tsx        # App root (providers + router)
│   ├── constants.ts   # Constants
│   ├── locale         # i18n resources
│   └── main.tsx       # Entry file
├── .env               # Environment variables
├── index.html
├── tsconfig.json
└── vite.config.ts
```

**Focus on the `src/` folder** when developing — add new pages, components, hooks, or utilities here.

---

## Core Features

### 1. Wallet Integration

- Built-in TRON wallet connection with `TronWalletAdapter`
- Secure signing of transactions
- Docs: [TronWalletAdapter](https://walletadapter.org/)

---

### 2. Transaction Templates

#### a) Sending TRX

File: `src/components/Transfer/components/TransferTRX.tsx`

Steps:

1. Build transaction → transfer TRX
2. Sign transaction → connect to a wallet via `TronWalletAdapter`
3. Broadcast transaction → to TRON blockchain

> TronWeb supports **36 transaction types**. Replace the transaction in Step 1 to send other types.

#### b) TRC20 Token Transfer

File: `src/components/Transfer/components/TransferTRC20.tsx`

- Uses `tronWeb.transactionBuilder.triggerSmartContract`
- Example of interacting with TRC20 smart contracts

#### c) Delegate Workflow

File: `src/components/Delegate/Delegate.tsx`

Covers:

- Fetch account info (`tronWeb.trx.getBalance`)
- Query and show delegation details
- Send `freezeBalanceV2` + `delegateResource` transactions

---

### 3. Environment Config

- Managed via **Vite `.env` file**
- Default prefix: `TDQ_`
- Docs: [Vite env config](https://vite.dev/guide/env-and-mode)

---

### 4. Theme Switch (Light/Dark)

- Located in `src/components/ThemeSwitch/ThemeSwitch.tsx`
- Prevents flickering by setting `data-theme` early in entry file(`main.tsx`)
- To disable: remove initialization in `main.tsx` + remove component in `Header.tsx`

---

### 5. Localization (i18n)

- Powered by **i18next**
- Language definitions in `src/locale`

Add a new language:

1. Add locale file in `src/locale`
2. Configure in `useLocale.ts`
3. Import Antd locale in `App.tsx`
4. Update each language object with new language code

Remove i18n:

- Delete `src/components/LocaleDropdown`, `src/locale` and `src/hooks/useLocale.ts`
- Remove related imports

## License

This project is licensed under the [MIT License](./LICENSE).
