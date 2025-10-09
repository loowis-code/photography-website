import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'

export default function EditCollection() {

    return (
        <Layout>
        <section className={styles.container}>
            <h1>Edit Collection</h1>
            <AdminNavbar />
            <form onSubmit={handleSubmit} encType="multipart/form-data">

                <button type="submit">Create</button>
            </form>
        </section>
        </Layout>
    );
}