import Layout from '../components/Layout'
import styles from './css-modules/four-oh-four.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Image from 'next/image'

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
                    {photo.url && (
                        <Image
                            title={photo.title}
                            className={styles.image}
                            src={photo.url}
                            alt={photo.alt_text}
                            width={photo.width}
                            height={photo.height}
                            sizes="25vw"
                            quality={100}
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default Custom404
