import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'

export default function NewCollection() {

    return (
        <Layout>
        <section className={styles.container}>
            <h1>Create New Collection</h1>
            <AdminNavbar />
            <form encType="multipart/form-data">

                <button type="submit">Create</button>
            </form>
        </section>
        </Layout>
    );
}