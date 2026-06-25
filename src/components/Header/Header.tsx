import { useMemo, type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import LocaleDropdown from '../LocaleDropdown/LocaleDropdown';
import WalletActionButton from '../WalletActionButton/WalletActionButton';
import { useLocale } from '../../hooks/useLocale';
import { config } from '../../config/env';
import Logo from '../../assets/Transfer.png';
import styles from './Header.module.scss';

const HeaderNav: FC = () => {
    const { t } = useLocale();
    const location = useLocation();
    const activeIndex = useMemo(() => {
        const path = location.pathname;
        switch (path) {
            case '/':
            case '/transfer':
                return 0;
            case '/delegate':
                return 1;
        }
    }, [location]);
    return (
        <div className={styles.headerNav}>
            <Link
                to="/transfer"
                className={clsx(styles.headerNavItem, {
                    [styles.headerNavItemActive]: activeIndex === 0,
                })}
            >
                {t('Transfer')}
            </Link>
            <Link
                to="/delegate"
                className={clsx(styles.headerNavItem, {
                    [styles.headerNavItemActive]: activeIndex === 1,
                })}
            >
                {t('Delegate')}
            </Link>
        </div>
    );
};

export default function Header() {
    const currentChain = config.chainName;
    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <h1 className={styles.headerTitle}>
                    <img src={Logo} alt="logo" className={styles.headerLogo} />
                    <span className={styles['headerTitle--text']}>
                        <span className={styles['headerTitle--textOrange']}>TRON</span> DApp Quickstart
                    </span>
                </h1>
                <div className={styles['headerChain']} data-chain={currentChain}>
                    {currentChain}
                </div>
            </div>
            <HeaderNav></HeaderNav>
            <div className={styles.headerRight}>
                <WalletActionButton />
                <ThemeSwitch className={styles.themeSwitch} />
                <LocaleDropdown className={styles.localeDropdown} />
            </div>
        </header>
    );
}
