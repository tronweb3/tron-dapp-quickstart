import { useMemo, useCallback } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { TDQ_LOCALSTORAGE_KEY_LANGUAGE } from '../utils/constants';
import en_US from '../locale/en_US';
import zh_TW from '../locale/zh_TW';

const resources = {
    en_US,
    zh_TW,
};

i18n.use(initReactI18next).init({
    resources: {
        en_US: { translation: resources.en_US },
        zh_TW: { translation: resources.zh_TW },
    },
    lng: localStorage.getItem(TDQ_LOCALSTORAGE_KEY_LANGUAGE) || undefined,
    fallbackLng: 'en_US',
});

export const useLocale = () => {
    const { t, i18n } = useTranslation();
    const locales = useMemo(() => Object.keys(resources), []);
    const changeLocale = useCallback(
        (lng: string) => {
            i18n.changeLanguage(lng);
            localStorage.setItem(TDQ_LOCALSTORAGE_KEY_LANGUAGE, lng);
        },
        [i18n]
    );

    return {
        t,
        locales,
        currentLocale: i18n.language,
        changeLocale,
    };
};
