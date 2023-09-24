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
        const photoData = await req.json()
        photoData.sort((a, b) => {
            return b.date.localeCompare(a.date)
        })
        setPhotos(photoData)
    }


    function SortBy(type) {
        if (type === 'date') {
            photos.sort((a, b) => {
                return b.date.localeCompare(a.date)
            })
            setPhotos([...photos])
        } else if (type === 'title') {
            photos.sort((a, b) => {
                return a.title.localeCompare(b.title)
            })
            setPhotos([...photos])
        }
    }

    useEffect(() => {
        getAllImages()
        // const photoData = require('../test_data.json')
        // setPhotos(photoData)
    }, [])

    return (
        <Layout>
            <Head>
                <title>All Images | Lewis Inches Photography</title>
            </Head>
            <section className={styles.container}>
                <button onClick={() => SortBy('date')}>Sort By Date</button>
                <button onClick={() => SortBy('title')}>Sort By Title</button>
                <XMasonry maxColumns="3" targetBlockWidth="550">
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
