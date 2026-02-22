import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import { getAdminImages, deleteImage } from '~/lib/server/admin-images'
import styles from '~/styles/pages/dashboard.module.css'

export const Route = createFileRoute('/admin/')({
    loader: () => getAdminImages(),
    component: Dashboard,
})

function Dashboard() {
    const initialImages = Route.useLoaderData()
    const [images, setImages] = useState(initialImages)

    useEffect(() => {
        setImages(initialImages)
    }, [initialImages])

    const refreshImages = async () => {
        const data = await getAdminImages()
        const sorted = [...data].sort((a, b) => {
            return (
                new Date(b.created_at ?? 0).getTime() -
                new Date(a.created_at ?? 0).getTime()
            )
        })
        setImages(sorted)
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Edit Images</h1>
                <div className={styles.imagesContainer}>
                    {images.map((image) => (
                        <div key={image.image_id}>
                            <Link
                                className={styles.imagePreview}
                                to="/admin/edit/image/$id"
                                params={{
                                    id: String(image.image_id),
                                }}
                            >
                                <img
                                    src={image.url}
                                    alt={image.alt_text ?? ''}
                                    width={image.width}
                                    height={image.height}
                                    className={styles.image}
                                />
                            </Link>
                            <div>
                                <h2 className={styles.previewTitle}>
                                    {image.title}
                                </h2>
                                <h3 className={styles.previewDetail}>
                                    Visible: {String(image.visible)}
                                </h3>
                                <h3 className={styles.previewDetail}>
                                    Featured: {String(image.featured)}
                                </h3>
                                <button
                                    className={styles.deleteButton}
                                    onClick={async () => {
                                        await deleteImage({
                                            data: {
                                                id: String(image.image_id),
                                                url: image.url,
                                            },
                                        })
                                        refreshImages()
                                    }}
                                >
                                    Delete Image
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    )
}
