import Layout from '../../components/Layout'
import styles from '../css-modules/all-images.module.css'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../../components/ImageModal'
import SortingButtons from '../../components/SortingButtons'

function Collection() {
    const [collectionInfo, setCollectionInfo] = useState({})
    const [photos, setPhotos] = useState([])
    const [sortKey, setSortKey] = useState(0)
    const router = useRouter()

    async function getCollectionData() {
        const req = await fetch(`/api/collection/${router.query.id}`)
        const data = await req.json()
        setCollectionInfo(data[0])
        const photoData = data.slice(1)
        photoData.sort((a, b) => {
            return b.date.localeCompare(a.date)
        })
        setPhotos(photoData)
    }

    function SortBy(type) {
        setSortKey((prevSortKey) => prevSortKey + 1)
        const sortedPhotos = [...photos]
        switch (type) {  
            case 'date-o-n':
                sortedPhotos.sort((a, b) => {
                    return a.date.localeCompare(b.date)
                })
                break;
            case 'date-n-o':
                sortedPhotos.sort((a, b) => {
                    return b.date.localeCompare(a.date)
                })
                break;
            case 'title-a-z':
                sortedPhotos.sort((a, b) => {
                    return a.title.localeCompare(b.title)
                })
                break;
            case 'title-z-a':
                sortedPhotos.sort((a, b) => {
                    return b.title.localeCompare(a.title)
                })
                break;
        }
        setPhotos(sortedPhotos)
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
                <SortingButtons SortBy={SortBy} />
                <XMasonry key={sortKey} maxColumns="3" targetBlockWidth="550">
                    {photos?.map((d) => (
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
