import Layout from '../../components/Layout'
import styles from '../css-modules/all-images.module.css'
import { neon } from '@neondatabase/serverless'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import ImageModal from '../../components/ImageModal'
import SortingButtons from '../../components/SortingButtons'

export async function getStaticProps(context) {
    const sql = neon(process.env.LOOWIS_DATABASE_URL)
    const collection =
        await sql`SELECT * FROM collections WHERE collection_id = ${context.params.id}`

    const imagesInCollection =
        await sql`SELECT * FROM collections_lookup WHERE collection = ${context.params.id}`
    const imageData =
        await sql`SELECT image_id, url, width, height, title, description, alt_text, date_taken, location, visible, featured, digital, latitude, longitude, film, camera FROM images`
    const cameras = await sql`SELECT * FROM cameras`
    const films = await sql`SELECT * FROM films`

    const imagesWithData = imagesInCollection.map((img) => {
        const imageDetails = imageData.find(
            (image) => image.image_id === img.image,
        )
        if (imageDetails) {
            const camera = cameras.find(
                (camera) => camera.camera_id === imageDetails.camera,
            )
            const film = films.find(
                (film) => film.film_id === imageDetails.film,
            )
            imageDetails.camera = camera
                ? `${camera.brand + ' ' + camera.model}`
                : null
            imageDetails.film = film ? `${film.brand + ' ' + film.name}` : null
            return { ...img, ...imageDetails }
        }
        return img
    })
    return {
        props: {
            images_data: imagesWithData,
            collection_data: collection[0],
        },
    }
}

export async function getStaticPaths() {
    const sql = neon(process.env.LOOWIS_DATABASE_URL)
    const response = await sql`SELECT * FROM collections`
    const paths = response.map((d) => {
        return {
            params: { id: d.collection_id.toString() },
        }
    })
    return {
        paths,
        fallback: false,
    }
}

function Collection({ images_data, collection_data }) {
    const [photos, setPhotos] = useState([])
    const [filteredPhotos, setFilteredPhotos] = useState([])

    function filterHidden(images_data) {
        const hiddenPhotos = images_data.filter((photo) => {
            return photo.visible === true
        })
        setPhotos(hiddenPhotos)
        setFilteredPhotos(hiddenPhotos)
    }

    useEffect(() => {
        filterHidden(images_data)
    }, [images_data])

    return (
        <Layout>
            <Head>
                <title>{collection_data?.name} | Loowis Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>{collection_data?.name}</h1>
                <SortingButtons
                    photos={photos}
                    setPhotos={setFilteredPhotos}
                    page="Collections"
                />
                <div className={styles.grid}>
                    {filteredPhotos?.map((d) => (
                        <ImageModal
                            data={d}
                            key={d.image_id}
                            page="Collections"
                        />
                    ))}
                </div>
            </section>
        </Layout>
    )
}

export default Collection
