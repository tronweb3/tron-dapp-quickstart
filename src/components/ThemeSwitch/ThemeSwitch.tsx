import { useContext } from 'react';
import clsx from 'clsx';
import { DarkThemeContext } from '../../hooks/useDarkTheme';
import LightThemeIcon from '../../assets/light-theme.png';
import DarkThemeIcon from '../../assets/dark-theme.png';
import styles from './ThemeSwitch.module.scss';

import type { FC } from 'react';

const ThemeSwitch: FC<{ className?: string }> = ({ className }) => {
    const { isDarkMode, setDarkMode } = useContext(DarkThemeContext);
    return (
        <div
            className={clsx([
                styles['themeSwitch'],
                isDarkMode ? styles['themeSwitch-dark'] : styles['themeSwitch-light'],
                className,
            ])}
            onClick={() => setDarkMode(!isDarkMode)}
        >
            <img src={DarkThemeIcon} className={styles['themeSwitch-darkIcon']} />
            <img src={LightThemeIcon} className={styles['themeSwitch-lightIcon']} />
        </div>
    );
};

export default ThemeSwitch;
