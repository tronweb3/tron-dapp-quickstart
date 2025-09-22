import clsx from 'clsx';
import styles from './FormItem.module.scss';

import type { FC } from 'react';

interface InputProps {
    name: string;
    description?: string;
    placeholder?: string;
    unit?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    size?: 'small' | 'normal';
}

const Input: FC<InputProps> = (props) => {
    return (
        <div
            className={clsx([
                styles.input,
                props.className,
                {
                    [styles['input-small']]: props.size === 'small',
                },
            ])}
        >
            <div className={styles['input-line']}>
                <div className={styles['input-name']}>
                    {props.name}
                    {props.required && <span className={styles.required}>*</span>}
                </div>
                {props.description && <div className={styles['input-desc']}>{props.description}</div>}
            </div>
            <div className={styles['input-line']}>
                <input className={styles['input-input']} placeholder={props.placeholder} onChange={props.onChange} />
                {props.unit && <div className={styles['input-unit']}>{props.unit}</div>}
            </div>
        </div>
    );
};

export default Input;
