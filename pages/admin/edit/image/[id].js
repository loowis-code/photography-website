import { useEffect, useState } from 'react'
import Layout from '../../../../components/Layout'
import styles from './image.module.css'
import { useRouter } from 'next/router'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import PhotoForm from '../../../../components/PhotoForm/PhotoForm'

export default function EditImage() {
    const [imageData, setImageData] = useState()
    const [id, setId] = useState(null)
    const router = useRouter()

    const getImageData = async (id) => {
        const res = await fetch(`/api/admin/read/image/${id}`)
        const data = await res.json()
        setImageData(data)
    }

    const handleSubmit = async (data) => {
    const res = await fetch(`/api/admin/update/image/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    await res.json()
    alert('Image updated successfully!')
}

    useEffect(() => {
        if (!router.isReady) return
        const { id } = router.query
        setId(id)
    }, [router.isReady])

    useEffect(() => {
        if (id) {
            getImageData(id)
        }
    }, [id])

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>Edit Image</h1>
                <AdminNavbar />
                {!imageData ? <div>Loading...</div> : (
                    <PhotoForm mode="edit" onSubmit={handleSubmit} initialData={imageData} />
                )}
            </section>
        </Layout>
    )
}
