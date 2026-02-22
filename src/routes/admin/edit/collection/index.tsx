import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import {
    getAdminCollections,
    deleteCollection,
} from '~/lib/server/admin-collections'
import styles from '~/styles/admin/edit-collection.module.css'

export const Route = createFileRoute('/admin/edit/collection/')({
    loader: () => getAdminCollections(),
    component: EditCollections,
})

function EditCollections() {
    const initialCollections = Route.useLoaderData()
    const [collections, setCollections] = useState(initialCollections)

    useEffect(() => {
        setCollections(initialCollections)
    }, [initialCollections])

    const refreshCollections = async () => {
        const data = await getAdminCollections()
        setCollections(data)
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Edit Collections</h1>
                <div className={styles.collectionsContainer}>
                    {collections.map((collection) => (
                        <div key={collection.collection_id}>
                            <Link
                                className={styles.collectionPreview}
                                to="/admin/edit/collection/$id"
                                params={{
                                    id: String(collection.collection_id),
                                }}
                            >
                                <img
                                    src={collection.cover_url}
                                    width={collection.width}
                                    height={collection.height}
                                    className={styles.image}
                                />
                            </Link>
                            <div>
                                <h2 className={styles.previewTitle}>
                                    {collection.collection_name}
                                </h2>
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={async () => {
                                    await deleteCollection({
                                        data: {
                                            id: String(
                                                collection.collection_id,
                                            ),
                                            url: collection.cover_url,
                                        },
                                    })
                                    refreshCollections()
                                }}
                            >
                                Delete Collection
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    )
}
