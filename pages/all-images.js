import Layout from '../components/Layout'
import styles from './css-modules/all-images.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import ImageModal from '../components/ImageModal'
import SortingButtons from '../components/SortingButtons'
import { neon } from '@neondatabase/serverless'
import Pagination from '../components/Pagination/Pagination'

export async function getStaticProps() {
    const sql = neon(process.env.DATABASE_URL)
    const images =
        await sql`SELECT image_id, url, width, height, title, description, alt_text, date_taken, location, visible, featured, digital, latitude, longitude, film, camera FROM images`
    let filteredImages = images.filter((image) => image.url !== null)
    filteredImages = filteredImages.filter((image) => image.visible === true)
    const cameras = await sql`SELECT * FROM cameras`
    const films = await sql`SELECT * FROM films`
    filteredImages.forEach((image) => {
        const camera = cameras.find(
            (camera) => camera.camera_id === image.camera,
        )
        const film = films.find((film) => film.film_id === image.film)
        image.camera = camera ? `${camera.brand + ' ' + camera.model}` : null
        image.film = film ? `${film.brand + ' ' + film.name}` : null
    })

    return {
        props: {
            data: filteredImages,
        },
    }
}

function AllImages({ data }) {
    const [filteredPhotos, setFilteredPhotos] = useState(data)
    const [currentPhotos, setCurrentPhotos] = useState(filteredPhotos)
    const [currentPage, setCurrentPage] = useState(1)
    const [displayPage, setDisplayPage] = useState(1)
    const photosPerPage = 9
    const maxPage = Math.ceil(filteredPhotos.length / photosPerPage)

    const paginatePhotos = (photos, page) => {
        const startIndex = (page - 1) * photosPerPage
        const endIndex = startIndex + photosPerPage
        return photos.slice(startIndex, endIndex)
    }
    useEffect(() => {
        let validPage = currentPage
        if (currentPage < 1) {
            validPage = 1
        } else if (currentPage > maxPage) {
            validPage = maxPage
        }
        if (validPage !== currentPage) {
            setCurrentPage(validPage)
            return
        }
        setCurrentPhotos(paginatePhotos(filteredPhotos, validPage))
        setDisplayPage(validPage)
    }, [currentPage, filteredPhotos, maxPage])

    return (
        <Layout>
            <Head>
                <title>All Images | Loowis Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>All Images</h1>
                <SortingButtons photos={data} setPhotos={setFilteredPhotos} />

                <div className={styles.grid}>
                    {currentPhotos.map((d) => (
                        <ImageModal data={d} key={d.image_id} page="All" />
                    ))}
                </div>

                <Pagination
                    setCurrentPage={setCurrentPage}
                    displayPage={displayPage}
                    maxPage={maxPage}
                />
            </section>
        </Layout>
    )
}

export default AllImages
