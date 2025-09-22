import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>
                TRON DApp Quickstart ·{' '}
                <a href="https://github.com/tronweb3/tron-dapp-quickstart.git" className={styles.githubLink}>
                    GitHub
                </a>
            </p>
        </footer>
    );
}
