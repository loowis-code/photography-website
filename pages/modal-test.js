import Layout from '../components/Layout'
import styles from './css-modules/modal-test.module.css'
import BootstrapModal from '../components/BootstrapModal'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from "react-xmasonry";

function ModalTest() {

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
                <title>Modal Test | Lewis Inches - Photography</title>
            </Head>
            <section id="pageContainer" className={styles.container}>
                <h1 className={styles.header}>Modal Test</h1>
                <XMasonry maxColumns="3" targetBlockWidth="500">
                    {photos.map((d) => (
                        <XBlock>
                            <BootstrapModal
                                data={d.data}
                                key={d.data.url_id}
                            />
                        </XBlock>
                    ))}
                </XMasonry>   
            </section>
        </Layout>
    )
}

export default ModalTest
