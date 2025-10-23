import Layout from '../../components/Layout'
import PhotoBody from '../../components/ImagePage'
import Head from 'next/head'
import { neon } from '@neondatabase/serverless'
import styles from '../css-modules/image.module.css'

export async function getStaticProps(context) {
    const sql = neon(process.env.DATABASE_URL)
    const image =
        await sql`SELECT image_id, url, width, height, title, description, alt_text, date_taken, location, visible, featured, digital, latitude, longitude, film, camera FROM images WHERE image_id = ${context.params.id}`
    const cameras = await sql`SELECT * FROM cameras`
    const films = await sql`SELECT * FROM films`
    image.forEach((img) => {
        const camera = cameras.find((camera) => camera.camera_id === img.camera)
        const film = films.find((film) => film.film_id === img.film)
        img.camera = camera ? `${camera.brand + ' ' + camera.model}` : null
        img.film = film ? `${film.brand + ' ' + film.name}` : null
    })

    return {
        props: { data: image[0] },
    }
}

export async function getStaticPaths() {
    const sql = neon(process.env.DATABASE_URL)
    const response = await sql`SELECT * FROM images`
    const paths = response.map((d) => {
        return {
            params: { id: d.image_id.toString() },
        }
    })
    return {
        paths,
        fallback: false,
    }
}

function Photo({ data }) {
    return (
        <Layout>
            <Head>
                <title>{`${data.title} | Loowis Photography`}</title>
            </Head>

            <section className={styles.imagecontainer}>
                <PhotoBody data={data} key={data.image_id} />
            </section>
        </Layout>
    )
}

export default Photo
