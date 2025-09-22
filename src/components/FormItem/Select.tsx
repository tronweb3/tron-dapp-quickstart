import { Select as AntdSelect } from 'antd';
import clsx from 'clsx';
import SelectDropdownIcon from '../../assets/select-dropdown-icon.png';
import styles from './FormItem.module.scss';

interface SelectProps<OptionsType extends { label: string; value: string }[]> {
    name: string;
    description?: string;
    placeholder?: string;
    unit?: string;
    className?: string;
    options: OptionsType;
    onChange?: (value: OptionsType[number]['value']) => void;
    required?: boolean;
    size?: 'small' | 'normal';
}

function Select<OptionsType extends { label: string; value: string }[]>(props: SelectProps<OptionsType>) {
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
                <AntdSelect
                    className={styles['select-antdSelect']}
                    variant="borderless"
                    style={{ width: '100%' }}
                    suffixIcon={<img src={SelectDropdownIcon} className={styles['select-dropdownIcon']} />}
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                    options={props.options}
                ></AntdSelect>
            </div>
        </div>
    );
}

export default Select;
