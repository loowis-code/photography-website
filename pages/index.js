import Layout from '../components/Layout'
import styles from './css-modules/index.module.css'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../components/ImageModal'

function Home() {
    const [featured, setFeatured] = useState([])

    async function getFeaturedImages() {
        const req = await fetch('/api/getPhotos')
        const photoData = await req.json()
        photoData.sort((a, b) => {
            return b.date.localeCompare(
                a.date,
            )
        })
        let featured = []
        photoData.forEach(function (photo) {
            if (photo.featured === true) {
                featured.push(photo)
            }
        })

        setFeatured(featured)
    }

    useEffect(() => {
        getFeaturedImages()
    }, [])

    return (
        <Layout>
            <section>
                <div className={styles.carousels}>
                    <h1>Featured Images</h1>
                <XMasonry maxColumns="3" targetBlockWidth="550">
                    {featured.map((d) => (
                        <XBlock key={d.id}>
                            <ImageModal data={d} key={d.id} />
                        </XBlock>
                    ))}
                </XMasonry>
                </div>
            </section>
        </Layout>
    )
}

export default Home
