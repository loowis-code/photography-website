import Layout from '../components/Layout'
import styles from './css-modules/index.module.css'
import { useState } from 'react'
import ImageModal from '../components/ImageModal'
import prisma from '../prisma/prisma'

export async function getStaticProps() {
    const res = await prisma.images.findMany()
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

function Home({ data }) {
    const [dFeatured] =  useState(data.filter(photo => photo.featured === true && photo.digital === true && photo.hidden === false))
    const [aFeatured] = useState(data.filter(photo => photo.featured === true && photo.digital === false && photo.hidden === false))
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
                            <ImageModal
                                data={d}
                                key={d.id}
                                page="Home"
                            />
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
                            <ImageModal
                            data={d}
                            key={d.id}
                            page="Home"
                        />
                            ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
