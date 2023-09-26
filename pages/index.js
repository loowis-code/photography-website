import Layout from '../components/Layout'
import styles from './css-modules/index.module.css'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../components/ImageModal'
import prisma from '../prisma/prisma'

export async function getStaticProps() {
    const res = await prisma.images.findMany()
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

function Home({ data }) {
    const [featured, setFeatured] = useState([])

    async function filterFeatured() {
        data.sort((a, b) => {
            return b.date.localeCompare(a.date)
        })
        let featured = []
        data.forEach(function (photo) {
            if (photo.featured === true) {
                featured.push(photo)
            }
        })
        featured.length = 9
        setFeatured(featured)
    }

    useEffect(() => {
        filterFeatured()
    }, [])

    return (
        <Layout>
            <section>
                <div className={styles.container}>
                    <XMasonry maxColumns="4" targetBlockWidth="500">
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
