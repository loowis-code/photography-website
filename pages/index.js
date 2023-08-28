import Layout from '../components/layout'
import ImageCarousel from '../components/ImageCarousel'
import styles from './css-modules/index.module.css'
import { useState, useEffect } from 'react'

function Home() {
    const [recent, setRecent] = useState([])
    const [featured, setFeatured] = useState([])

    async function getLatestPhotos() {
        const req = await fetch('/api/getPhotos')
        const photoData = await req.json()
        photoData.sort((a, b) => {
            return b.data.photo_data.date_taken.localeCompare(
                a.data.photo_data.date_taken,
            )
        })
        let featured = []
        photoData.forEach(function (photo) {
            if (photo.data.featured === 'on') {
                featured.push({
                    filename: photo.data.filename,
                    url_id: photo.data.url_id,
                    title: photo.data.title,
                })
            }
        })

        setFeatured(featured)

        photoData.length = 4
        let recent = []
        photoData.forEach(function (photo) {
            recent.push({
                filename: photo.data.filename,
                url_id: photo.data.url_id,
                title: photo.data.title,
            })
        })
        setRecent(recent)
    }

    useEffect(() => {
        getLatestPhotos()
    }, [])

    return (
        <Layout>
            <section>
                <div className={styles.carousels}>
                    <div className={styles.recentCarousel}>
                        <p className={styles.title}>Recent Images</p>
                        <ImageCarousel images={recent} />
                    </div>
                    <div className={styles.featuredCarousel}>
                        <p className={styles.title}>Featured Images</p>
                        <ImageCarousel images={featured} />
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
