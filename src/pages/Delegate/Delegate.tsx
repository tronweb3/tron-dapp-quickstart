import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Container from '../../components/Container/Container';
import Delegate from '../../components/Delegate/Delegate';
import styles from './Delegate.module.scss';

export default function DelegatePage() {
    return (
        <>
            <Header></Header>
            <Container className={styles.container}>
                <Delegate></Delegate>
                <Footer></Footer>
            </Container>
        </>
    );
}
