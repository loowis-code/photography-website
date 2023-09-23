import Layout from '../../components/Layout'
import styles from '../css-modules/all-images.module.css'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../../components/ImageModal'

function Collection() {
    const [collectionInfo, setCollectionInfo] = useState({})
    const [photoData, setPhotoData] = useState([])
    const router = useRouter()

    async function getCollectionData() {
        const req = await fetch(`/api/collection/${router.query.id}`)
        const data = await req.json()
        setCollectionInfo(data[0])
        const photoData = data.slice(1)
        photoData.sort((a, b) => {
            return b.date.localeCompare(
                a.date,
            )
        })
        setPhotoData(photoData)
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
                <XMasonry maxColumns="3" targetBlockWidth="550">
                    {photoData?.map((d) => (
                        <XBlock key={d.id}>
                            <ImageModal data={d} key={d.id} />
                        </XBlock>
                    ))}
                </XMasonry>
            </section>
        </Layout>
    )
}

export default Collection
