import Layout from '../components/Layout'
import styles from './css-modules/all-images.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../components/ImageModal'

function AllImages() {
    const [photos, setPhotos] = useState([])
    const [sortKey, setSortKey] = useState(0)

    async function getAllImages() {
        const req = await fetch('/api/getPhotos')
        const photoData = await req.json()
        photoData.sort((a, b) => {
            return b.date.localeCompare(a.date)
        })
        setPhotos(photoData)
    }

    function SortBy(type) {
        setSortKey((prevSortKey) => prevSortKey + 1)
        if (type === 'date-o-n') {
            const sortedPhotos = [...photos]
            sortedPhotos.sort((a, b) => {
                return a.date.localeCompare(b.date)
            })
            setPhotos(sortedPhotos)
        } else if (type === 'date-n-o') {
            const sortedPhotos = [...photos]
            sortedPhotos.sort((a, b) => {
                return b.date.localeCompare(a.date)
            })
            setPhotos(sortedPhotos)
        } else if (type === 'title-a-z') {
            const sortedPhotos = [...photos]
            sortedPhotos.sort((a, b) => {
                return a.title.localeCompare(b.title)
            })
            setPhotos(sortedPhotos)
        } else if (type === 'title-z-a') {
            const sortedPhotos = [...photos]
            sortedPhotos.sort((a, b) => {
                return b.title.localeCompare(a.title)
            })
            setPhotos(sortedPhotos)
        }
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
                <div className={styles.sortingButtons}>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => SortBy('date-o-n')}
                    >
                        Sort By Date (Oldest to Newest)
                    </button>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => SortBy('date-n-o')}
                    >
                        Sort By Date (Newest to Oldest)
                    </button>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => SortBy('title-a-z')}
                    >
                        Sort By Title (A-Z)
                    </button>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => SortBy('title-z-a')}
                    >
                        Sort By Title (Z-A)
                    </button>
                </div>
                <XMasonry key={sortKey} maxColumns="3" targetBlockWidth="550">
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
