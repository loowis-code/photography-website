import Layout from '../components/Layout'
import styles from './css-modules/index.module.css'
import { useState } from 'react'
import ImageModal from '../components/ImageModal'
import { neon } from '@neondatabase/serverless'

export async function getStaticProps() {
    const sql = neon(process.env.LOOWIS_DATABASE_URL)
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

function Home({ data }) {
    const [dFeatured] = useState(
        data.filter(
            (photo) =>
                photo.featured === true &&
                photo.digital === true &&
                photo.visible === true,
        ),
    )
    const [aFeatured] = useState(
        data.filter(
            (photo) =>
                photo.featured === true &&
                photo.digital === false &&
                photo.visible === true,
        ),
    )
    const [format, setFormat] = useState('film')

    return (
        <Layout>
            <section>
                <div className={styles.container}>
                    <div className={styles.formatSelection}>
                        <div
                            onClick={() => setFormat('film')}
                            className={
                                format === 'film'
                                    ? styles.formatTitleActive
                                    : styles.formatTitle
                            }
                        >
                            Film
                        </div>
                        <div
                            onClick={() => setFormat('digital')}
                            className={
                                format === 'digital'
                                    ? styles.formatTitleActive
                                    : styles.formatTitle
                            }
                        >
                            Digital
                        </div>
                    </div>
                    <div
                        className={
                            format === 'digital'
                                ? styles.digitalShow
                                : styles.digitalHide
                        }
                    >
                        {dFeatured.map((d) => (
                            <ImageModal data={d} key={d.image_id} page="Home" />
                        ))}
                    </div>
                    <div
                        className={
                            format === 'film'
                                ? styles.filmShow
                                : styles.filmHide
                        }
                    >
                        {aFeatured.map((d) => (
                            <ImageModal data={d} key={d.image_id} page="Home" />
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
