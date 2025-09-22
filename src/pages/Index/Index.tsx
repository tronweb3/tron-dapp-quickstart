import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Container from '../../components/Container/Container';
import Transfer from '../../components/Transfer/Transfer';
import styles from './Index.module.scss';

export default function Index() {
    return (
        <>
            <Header></Header>
            <Container className={styles.container}>
                <Transfer></Transfer>
                <Footer></Footer>
            </Container>
        </>
    );
}
