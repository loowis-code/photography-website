import Layout from '../components/Layout'
import styles from './css-modules/modal-test.module.css'
import PhotoModal from '../components/PhotoModal'
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
                    <PhotoModal id={1} maxID={18}/>
                    <PhotoModal id={2} maxID={18}/>
                    <PhotoModal id={3} maxID={18}/>
                    <PhotoModal id={4} maxID={18}/>
                    <PhotoModal id={5} maxID={18}/>
                    <PhotoModal id={6} maxID={18}/>
                    <PhotoModal id={7} maxID={18}/>
                    <PhotoModal id={8} maxID={18}/>
                    <PhotoModal id={9} maxID={18}/>
                    <PhotoModal id={10} maxID={18}/>
                    <PhotoModal id={11} maxID={18}/>
                    <PhotoModal id={12} maxID={18}/>
                    <PhotoModal id={13} maxID={18}/>
                    <PhotoModal id={14} maxID={18}/>
                    <PhotoModal id={15} maxID={18}/>
                    <PhotoModal id={16} maxID={18}/>
                    <PhotoModal id={17} maxID={18}/>
                    <PhotoModal id={18} maxID={18}/>
                </div>
                
            </section>
        </Layout>
    )
}

export default ModalTest
