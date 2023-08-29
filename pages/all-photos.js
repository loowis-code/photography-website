import Layout from '../components/Layout'
import PhotoPreview from '../components/PhotoPreview'
import styles from './css-modules/all-photos.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

function AllPhotos() {
    const [photos, setPhotos] = useState([])

    async function getAllPhotos() {
        const req = await fetch('/api/getPhotos')
        const photoData = await req.json()
        photoData.sort((a, b) => {
            return b.data.photo_data.date_taken.localeCompare(
                a.data.photo_data.date_taken,
            )
        })
        setPhotos(photoData)
    }

    useEffect(() => {
        getAllPhotos()
    }, [])

    return (
        <Layout>
            <Head>
                <title>All Photos | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>All Photos</h1>
                <div className={styles.photos}>
                    {photos.map((d) => (
                        <PhotoPreview
                            title={d.data.title}
                            filename={d.data.filename}
                            id={d.data.url_id}
                            key={d.data.url_id}
                        />
                    ))}
                </div>
            </section>
        </Layout>
    )
}

export default AllPhotos
