import { useContext, useMemo } from 'react';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import {
    BitKeepAdapter,
    GateWalletAdapter,
    LedgerAdapter,
    OkxWalletAdapter,
    TokenPocketAdapter,
    TronLinkAdapter,
    TrustAdapter,
    BybitWalletAdapter,
} from '@tronweb3/tronwallet-adapters';
import Routes from './router';
import { useDarkTheme, DarkThemeContext } from './hooks/useDarkTheme';
import { useLocale } from './hooks/useLocale';
import zh_TW from 'antd/es/locale/zh_TW';
import en_US from 'antd/es/locale/en_US';
import './App.css';

import type { FC, PropsWithChildren } from 'react';

export const DarkThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    const { isDarkMode, setDarkMode } = useDarkTheme();

    return <DarkThemeContext value={{ isDarkMode, setDarkMode }}>{children}</DarkThemeContext>;
};

const AntdProvider: FC<PropsWithChildren> = ({ children }) => {
    const { isDarkMode } = useContext(DarkThemeContext);
    const algo = isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm;
    const { currentLocale } = useLocale();
    const locale = currentLocale === 'zh_TW' ? zh_TW : en_US;

    return (
        <ConfigProvider
            theme={{
                algorithm: algo,
            }}
            locale={locale}
        >
            {children}
        </ConfigProvider>
    );
};

function App() {
    const adapters = useMemo(() => {
        return [
            new TronLinkAdapter(),
            new TokenPocketAdapter(),
            new OkxWalletAdapter(),
            new BitKeepAdapter(),
            new TrustAdapter(),
            new GateWalletAdapter(),
            new BybitWalletAdapter(),
            new LedgerAdapter(),
        ];
    }, []);
    return (
        <>
            <DarkThemeProvider>
                <AntdProvider>
                    <AntdApp>
                        <WalletProvider adapters={adapters}>
                            <WalletModalProvider>
                                <Routes></Routes>
                            </WalletModalProvider>
                        </WalletProvider>
                    </AntdApp>
                </AntdProvider>
            </DarkThemeProvider>
        </>
    );
}

export default App;
