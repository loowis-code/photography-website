import Layout from '../../components/Layout'
import styles from '../css-modules/all-photos.module.css'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from "react-xmasonry";
import PhotoModal from '../components/PhotoModal'

function Collection() {
    const [collectionInfo, setCollectionInfo] = useState([])
    const [photoData, setPhotoData] = useState([])
    const router = useRouter()

    async function getCollectionData() {
        const req = await fetch(`/api/collection/${router.query.id}`)
        const collectionData = await req.json()
        setCollectionInfo(collectionData[0])
        if (Array.isArray(collectionData)) {
            setPhotoData(collectionData.slice(1))
        }
    }

    useEffect(() => {
        getCollectionData()
    }, [router.asPath])

    return (
        <Layout>
            <Head>
                <title>
                    {collectionInfo?.name} | Lewis Inches - Photography
                </title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>{collectionInfo?.name}</h1>
                <XMasonry maxColumns="3" targetBlockWidth="500">
                        {photos.map((d) => (
                            <XBlock key={d.data.url_id}>
                                <PhotoModal
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

export default Collection
