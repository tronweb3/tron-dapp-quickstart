import { Tabs } from 'antd';
import TransferTRX from './components/TransferTRX';
import TransferTRC20 from './components/TransferTRC20';
import TransferTRC721 from './components/TransferTRC721';
import TransferTRC10 from './components/TransferTRC10';
import { useLocale } from '../../hooks/useLocale';
import styles from './Transfer.module.scss';

import type { FC } from 'react';
import type { TabsProps } from 'antd';
import type { RenderTabBar } from 'rc-tabs/lib/interface';

const TabBar: FC<Parameters<RenderTabBar>[0] & { items: TabsProps['items'] }> = (props) => {
    if (!props.items) return null;
    return (
        <div className={styles.tabBar}>
            {props.items.map((item) => (
                <div
                    key={item.key}
                    className={`${styles.tabBarItem} ${props.activeKey === item.key ? styles.tabBarItemActive : ''}`}
                    onClick={(e) => props.onTabClick(item.key, e)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default function Transfer() {
    const { t } = useLocale();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t('Transfer') + ' TRX',
            children: <TransferTRX />,
        },
        {
            key: '2',
            label: t('Transfer') + ' TRC20',
            children: <TransferTRC20 />,
        },
        {
            key: '3',
            label: t('Transfer') + ' TRC721',
            children: <TransferTRC721 />,
        },
        {
            key: '4',
            label: t('Transfer') + ' TRC10',
            children: <TransferTRC10 />,
        },
    ];

    return (
        <div className={styles.transfer}>
            <Tabs
                items={items}
                animated={false}
                indicator={{ size: 0 }}
                renderTabBar={(props) => {
                    return <TabBar {...props} items={items} />;
                }}
            ></Tabs>
        </div>
    );
}
