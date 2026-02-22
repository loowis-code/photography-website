import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import { getAllImages } from '~/lib/server/images'
import styles from '~/styles/pages/index.module.css'

export const Route = createFileRoute('/')({
    loader: () => getAllImages(),
    head: () => ({
        meta: [{ title: 'Loowis Photography' }],
    }),
    component: Home,
})

function Home() {
    const data = Route.useLoaderData()
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
                            <ImageModal data={d} key={d.image_id} />
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
                            <ImageModal data={d} key={d.image_id} />
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}
