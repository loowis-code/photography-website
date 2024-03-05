import Layout from '../components/Layout'
import styles from './css-modules/all-images.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../components/ImageModal'
import SortingButtons from '../components/SortingButtons'
import prisma from '../prisma/prisma'

export async function getStaticProps() {
    const res = await prisma.images.findMany()
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

function AllImages({ data }) {
    const [photos, setPhotos] = useState([])
    const [filteredPhotos, setFilteredPhotos] = useState([])
    const [sortKey, setSortKey] = useState(0)

    function filterHidden(data) {
        const hiddenPhotos = data.filter((photo) => {
            return photo.hidden === false
        })
        setPhotos(hiddenPhotos)
        setFilteredPhotos(hiddenPhotos)
    }

    useEffect(() => {
        filterHidden(data)
        
    }, [data])

    return (
        <Layout>
            <Head>
                <title>All Images | Loowis Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>All Images</h1>
                <SortingButtons
                    photos={photos}
                    setPhotos={setFilteredPhotos}
                    setKey={setSortKey}
                />
                <XMasonry key={sortKey} maxColumns="3" targetBlockWidth="550">
                    {filteredPhotos.map((d) => (
                        <XBlock key={d.id}>
                            <ImageModal data={d} key={d.id} page="All" />
                        </XBlock>
                    ))}
                </XMasonry>
            </section>
        </Layout>
    )
}

export default AllImages
