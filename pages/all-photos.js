import Layout from '../components/Layout'
import styles from './css-modules/all-photos.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { XMasonry, XBlock } from 'react-xmasonry'
import PhotoModal from '../components/PhotoModal'

function AllPhotos() {
    const [photos, setPhotos] = useState([])

    async function getAllPhotos() {
        const req = await fetch('/api/getPhotos')
        setPhotos(await req.json())
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
                <XMasonry maxColumns="3" targetBlockWidth="500">
                    {photos.map((d) => (
                        <XBlock key={d.id}>
                            <PhotoModal data={d} key={d.id} />
                        </XBlock>
                    ))}
                </XMasonry>
            </section>
        </Layout>
    )
}

export default AllPhotos
