import { useCallback, useMemo, type FC } from 'react';
import { App, Dropdown } from 'antd';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';
import { useLocale } from '../../hooks/useLocale';
import TronLinkLogo from '../../assets/tronlink-logo.png';
import styles from './WalletActionButton.module.scss';
import './modal.css';

const ChangeWalletActionButton: FC = () => {
    const { t } = useLocale();
    const { setVisible } = useWalletModal();
    return (
        <button className={styles['changeWalletActionButton']} onClick={() => setVisible(true)}>
            {t('label_sw')}
        </button>
    );
};

const ConnectButton: FC = () => {
    const { t } = useLocale();
    const { connect } = useWallet();
    return (
        <button className={styles['connectButton']} onClick={connect}>
            {t('label_cw2')}
        </button>
    );
};

const LoginedButton: FC = () => {
    const { address, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const { message } = App.useApp();
    const { t } = useLocale();
    const onCopyAddress = useCallback(async () => {
        if (!address) return;
        await navigator.clipboard.writeText(address);
        message.success(t('sentence_actc'));
    }, [t, address, message]);
    const onChangeWallet = useCallback(() => {
        setVisible(true);
    }, [setVisible]);
    const onDisconnect = useCallback(() => {
        disconnect();
    }, [disconnect]);
    const items = useMemo(
        () => [
            {
                label: (
                    <div className={styles['dropdown-item']} onClick={onCopyAddress}>
                        {t('label_ca')}
                    </div>
                ),
                key: 'copy',
            },
            {
                label: (
                    <div className={styles['dropdown-item']} onClick={onChangeWallet}>
                        {t('label_cw')}
                    </div>
                ),
                key: 'change',
            },
            {
                label: (
                    <div className={styles['dropdown-item']} onClick={onDisconnect}>
                        {t('label_d')}
                    </div>
                ),
                key: 'disconnect',
            },
        ],
        [onChangeWallet, onCopyAddress, onDisconnect, t]
    );
    if (!address) return null;
    return (
        <Dropdown menu={{ items }}>
            <button className={styles['loginedButton']}>
                <img src={TronLinkLogo} className={styles['tronLink-logo']} />
                <span>{address.slice(0, 4) + '...' + address.slice(-4)}</span>
            </button>
        </Dropdown>
    );
};

const WalletActionButton: FC = () => {
    const { address, wallet } = useWallet();
    if (address) return <LoginedButton />;
    if (wallet) return <ConnectButton />;
    return <ChangeWalletActionButton />;
};

export default WalletActionButton;
