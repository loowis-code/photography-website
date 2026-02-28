import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import CollectionForm from '~/components/CollectionForm/CollectionForm'
import {
    getAdminCollection,
    updateCollection,
} from '~/lib/server/admin-collections'
import { getAdminImages } from '~/lib/server/admin-images'
import styles from '~/styles/admin/edit-collection.module.css'

export const Route = createFileRoute('/admin/edit/collection/$id')({
    loader: async ({ params: { id } }) => {
        const [collection, allImages] = await Promise.all([
            getAdminCollection({ data: id }),
            getAdminImages(),
        ])
        return { collection, allImages }
    },
    component: EditCollection,
})

function EditCollection() {
    const { collection: initialCollection, allImages } = Route.useLoaderData()
    const { id } = Route.useParams()
    const [collectionData, setCollectionData] = useState(
        initialCollection ? { ...initialCollection, allImages } : null,
    )

    useEffect(() => {
        if (initialCollection) {
            setCollectionData({ ...initialCollection, allImages })
        }
    }, [initialCollection, allImages])

    const handleSubmit = async (data: Record<string, unknown>) => {
        await updateCollection({
            data: {
                id,
                data: {
                    image: data.image as string | undefined,
                    url: data.cover_url as string | undefined,
                    name: data.name as string,
                    description: data.description as string,
                    width: data.width as number | undefined,
                    height: data.height as number | undefined,
                    images: data.images as number[] | undefined,
                },
            },
        })
        const refreshed = await getAdminCollection({ data: id })
        if (refreshed) {
            setCollectionData({ ...refreshed, allImages })
        }
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Edit Collection</h1>
                <CollectionForm
                    mode="edit"
                    initialData={
                        collectionData as Record<string, unknown> | null
                    }
                    onSubmit={handleSubmit}
                />
            </section>
        </Layout>
    )
}
