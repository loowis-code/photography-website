import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import CollectionForm from '../../../../components/CollectionForm/CollectionForm'

export default function NewCollection() {
    const handleSubmit = async (data) => {
        const res = await fetch('/api/admin/create/collection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        await res.json()
        alert('Collection created successfully!')
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Create New Collection</h1>
                <AdminNavbar />
                <CollectionForm mode="create" onSubmit={handleSubmit} />
            </section>
        </Layout>
    )
}
