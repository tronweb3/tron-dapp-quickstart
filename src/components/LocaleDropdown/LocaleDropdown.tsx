import { useCallback, useContext, type FC } from 'react';
import { Dropdown, type MenuProps } from 'antd';
import clsx from 'clsx';
import { useLocale } from '../../hooks/useLocale';
import { DarkThemeContext } from '../../hooks/useDarkTheme';
import LocaleIcon from '../../assets/locale-icon.png';
import LocaleDarkIcon from '../../assets/locale-dark-icon.png';
import styles from './LocaleDropdown.module.scss';

const LocaleDropdown: FC<{ className?: string }> = ({ className }) => {
    const { t, locales, currentLocale, changeLocale } = useLocale();
    const { isDarkMode } = useContext(DarkThemeContext);
    const menuItems: MenuProps['items'] = locales.map((locale) => ({
        key: locale,
        label: <div className={styles['localeOption']}>{t(locale)}</div>,
    }));

    const onClick: MenuProps['onClick'] = useCallback(
        (e: Parameters<NonNullable<MenuProps['onClick']>>[0]) => {
            changeLocale(e.key);
        },
        [changeLocale]
    );

    const menu: MenuProps = {
        items: menuItems,
        onClick,
    };

    return (
        <div className={clsx(className)}>
            <Dropdown placement="bottom" menu={menu}>
                <div className={styles.localeButton}>
                    <img src={isDarkMode ? LocaleDarkIcon : LocaleIcon} alt="locale" className={styles.localeIcon} />{' '}
                    {t(currentLocale)}
                </div>
            </Dropdown>
        </div>
    );
};

export default LocaleDropdown;
