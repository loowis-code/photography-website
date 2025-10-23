import Layout from '../components/Layout'
import styles from './css-modules/image-map.module.css'
import { useEffect } from 'react'
import Head from 'next/head'
import { neon } from '@neondatabase/serverless'

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

function ImageMap({ data }) {
    function initaliseMap() {
        var map
        if (window.innerWidth < 600) {
            map = L.map('map').setView([54.12, 4.97], 4)
        } else {
            map = L.map('map').setView([54.12, 4.97], 6)
        }
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(map)

        for (var i = 0; i < data.length; i++) {
            if (
                data[i].latitude != undefined &&
                data[i].longitude != undefined
            ) {
                var marker = L.marker([
                    data[i].latitude,
                    data[i].longitude,
                ]).addTo(map)
                marker.bindPopup(
                    '<a href=/images/' +
                        data[i].image_id +
                        '>' +
                        data[i].title +
                        '</a>',
                )
            }
        }
    }

    useEffect(() => {
        function tryInitMap() {
            if (
                typeof window !== 'undefined' &&
                window.L !== undefined &&
                document.getElementById('map') &&
                !window._imageMapInitialized
            ) {
                initaliseMap()
                window._imageMapInitialized = true
            }
        }
        const timeout = setTimeout(tryInitMap, 100)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <Layout>
            <Head>
                <title>Image Map | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <div className={styles.mapContainer}>
                    <div id="map" className={styles.map}></div>
                </div>
            </section>
        </Layout>
    )
}

export default ImageMap
