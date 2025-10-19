import Layout from '../../../../components/Layout'
import styles from './image.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import PhotoForm from '../../../../components/PhotoForm/PhotoForm'

export default function NewImage() {

    const handleSubmit = async (data) => {
        const res = await fetch('/api/admin/create/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        await res.json()
        alert('Image uploaded successfully!')
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>Upload New Image</h1>
                <AdminNavbar />
                <PhotoForm mode="create" onSubmit={handleSubmit} />
            </section>
        </Layout>
    )
}
