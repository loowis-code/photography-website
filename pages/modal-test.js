import Layout from '../components/Layout'
import styles from './css-modules/modal-test.module.css'
import BootstrapModal from '../components/BootstrapModal'
import Head from 'next/head'

function ModalTest() {

    return (
        <Layout>
            <Head>
                <title>Modal Test | Lewis Inches - Photography</title>
            </Head>
            <section id="pageContainer" className={styles.container}>
                <h1 className={styles.header}>Modal Test</h1>
                <div className={styles.photos}>
                    <BootstrapModal id={1}/>
                    <BootstrapModal id={2}/>
                    <BootstrapModal id={3}/>
                    <BootstrapModal id={4}/>
                    <BootstrapModal id={5}/>
                    <BootstrapModal id={6}/>
                    <BootstrapModal id={7}/>
                    <BootstrapModal id={8}/>
                    <BootstrapModal id={9}/>

                </div>
                
            </section>
        </Layout>
    )
}

export default ModalTest
