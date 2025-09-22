import { useState, useLayoutEffect, createContext, useMemo, useCallback } from 'react';
import { TDQ_LOCALSTORAGE_KEY_DARK_MODE } from '../utils/constants';

const getLocalStorageDarkMode = () => {
    const storedValue = localStorage.getItem(TDQ_LOCALSTORAGE_KEY_DARK_MODE);
    return storedValue ? JSON.parse(storedValue) : undefined;
};

const getUserSettingDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme:dark)').matches;
};

export const getInitialDarkMode = () => {
    return getLocalStorageDarkMode() ?? getUserSettingDarkMode();
};

export const DarkThemeContext = createContext({
    isDarkMode: getInitialDarkMode(),
    setDarkMode: (_: boolean) => {},
});

export const useDarkTheme = () => {
    const initialDarkMode = useMemo(getInitialDarkMode, []);
    const [isDarkMode, setDarkMode] = useState(initialDarkMode);

    const externalSetDarkMode = useCallback((value: boolean) => {
        setDarkMode(value);
        localStorage.setItem(TDQ_LOCALSTORAGE_KEY_DARK_MODE, JSON.stringify(value));
    }, []);

    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return { isDarkMode, setDarkMode: externalSetDarkMode };
};
