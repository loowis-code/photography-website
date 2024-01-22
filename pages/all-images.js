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
    const [sortKey, setSortKey] = useState(0)

    function SortBy(type) {
        setSortKey((prevSortKey) => prevSortKey + 1)
        const sortedPhotos = [...photos]
        switch (type) {
            case 'date-o-n':
                sortedPhotos.sort((a, b) => {
                    if (a.date != null && b.date != null) {
                        return a.date.localeCompare(b.date)
                    } else if (a.date != null && b.date == null) {
                        return 1
                    } else if (a.date == null && b.date != null) {
                        return -1
                    }
                })
                break
            case 'date-n-o':
                sortedPhotos.sort((a, b) => {
                    if (a.date != null && b.date != null) {
                        return b.date.localeCompare(a.date)
                    } else if (a.date != null && b.date == null) {
                        return -1
                    } else if (a.date == null && b.date != null) {
                        return 1
                    }
                })
                break
            case 'title-a-z':
                sortedPhotos.sort((a, b) => {
                    return a.title.localeCompare(b.title)
                })
                break
            case 'title-z-a':
                sortedPhotos.sort((a, b) => {
                    return b.title.localeCompare(a.title)
                })
                break
        }
        setPhotos(sortedPhotos)
    }

    function filterHidden(data) {
        const hiddenPhotos = data.filter((photo) => {
            return photo.hidden === false
        })
        setPhotos(hiddenPhotos)
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
                <SortingButtons SortBy={SortBy} />
                <XMasonry key={sortKey} maxColumns="3" targetBlockWidth="550">
                    {photos.map((d) => (
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
