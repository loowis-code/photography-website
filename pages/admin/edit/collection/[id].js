import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CollectionForm from '../../../../components/CollectionForm/CollectionForm'

export default function EditCollection() {
    const [collectionData, setCollectionData] = useState(null)
    const [id, setId] = useState(null)
    const router = useRouter()

    const getCollectionData = async () => {
        const res = await fetch(`/api/admin/read/collection/${id}`)
        const collectionData = await res.json()
        const req = await fetch('/api/admin/read/images')
        const imageData = await req.json()
        const combinedData = {
            ...collectionData,
            allImages: imageData,
        }
        setCollectionData(combinedData)
    }

    const handleSubmit = async (data) => {
        const res = await fetch(`/api/admin/update/collection/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        await res.json()
        alert('Collection updated successfully!')
        getCollectionData()
    }

    useEffect(() => {
        if (!router.isReady) return
        const { id } = router.query
        setId(id)
    }, [router])

    useEffect(() => {
        if (id) {
            getCollectionData()
        }
    }, [id])

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Edit Collection</h1>
                <AdminNavbar />
                <CollectionForm
                    mode="edit"
                    initialData={collectionData}
                    onSubmit={handleSubmit}
                />
            </section>
        </Layout>
    )
}
