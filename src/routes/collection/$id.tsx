import { createFileRoute, notFound } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import SortingButtons from '~/components/SortingButtons/SortingButtons'
import { getCollectionWithImages } from '~/lib/server/collections'
import styles from '~/styles/pages/all-images.module.css'

export const Route = createFileRoute('/collection/$id')({
    loader: async ({ params: { id } }) => {
        const result = await getCollectionWithImages({ data: id })
        if (!result) throw notFound()
        return result
    },
    head: ({ loaderData }) => ({
        meta: [
            {
                title: `${loaderData?.collection?.collection_name ?? 'Collection'} | Loowis Photography`,
            },
        ],
    }),
    component: Collection,
})

function Collection() {
    const { collection, images } = Route.useLoaderData()
    const [photos, setPhotos] = useState(images)
    const [filteredPhotos, setFilteredPhotos] = useState(images)

    useEffect(() => {
        setPhotos(images)
        setFilteredPhotos(images)
    }, [images])

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.header}>
                    {collection?.collection_name}
                </h1>
                <SortingButtons
                    photos={photos}
                    setPhotos={setFilteredPhotos}
                    page="Collections"
                />
                <div className={styles.grid}>
                    {filteredPhotos?.map((d) => (
                        <ImageModal data={d} key={d.image_id} />
                    ))}
                </div>
            </section>
        </Layout>
    )
}
