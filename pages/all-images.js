import Layout from '../components/Layout'
import styles from './css-modules/all-images.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../components/ImageModal'

function AllImages() {
    const [photos, setPhotos] = useState([])

    async function getAllImages() {
        const req = await fetch('/api/getPhotos')
        setPhotos(await req.json())
    }

    useEffect(() => {
        getAllImages()
    }, [])

    return (
        <Layout>
            <Head>
                <title>All Images | Lewis Inches Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>All Images</h1>
                <XMasonry maxColumns="3" targetBlockWidth="500">
                    {photos.map((d) => (
                        <XBlock key={d.id}>
                            <ImageModal data={d} key={d.id} />
                        </XBlock>
                    ))}
                </XMasonry>
            </section>
        </Layout>
    )
}

export default AllImages
