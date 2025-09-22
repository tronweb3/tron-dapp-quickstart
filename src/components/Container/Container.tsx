import clsx from 'clsx';
import styles from './Container.module.scss';

import type { PropsWithChildren, FC } from 'react';

const Container: FC<{ className?: string } & PropsWithChildren> = ({ className, children }) => {
    return <div className={clsx([styles.container, className])}>{children}</div>;
};

export default Container;
