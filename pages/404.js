import Layout from '../components/Layout'
import styles from './css-modules/four-oh-four.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react'

function Custom404() {
    const [photo, setPhoto] = useState([])

    async function getAllImages() {
        const req = await fetch('/api/admin/read/images')
        const photoData = await req.json()
        const randomPhoto =
            photoData[Math.floor(Math.random() * photoData.length)]

        setPhoto(randomPhoto)
    }

    useEffect(() => {
        getAllImages()
    }, [])

    return (
        <Layout>
            <Head>
                <title>404 | Loowis Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.heading}>This page does not exist :/</h1>
                <div className={styles.photoContainer}>
                    {photo && photo.url && (
                        <img
                            src={photo.url}
                            alt={photo.title || 'Random Photo'}
                            className={styles.photo}
                        />
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default Custom404
