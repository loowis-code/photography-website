import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import PhotoForm from '~/components/PhotoForm/PhotoForm'
import { getAdminImage, updateImage } from '~/lib/server/admin-images'
import styles from '~/styles/admin/edit-image.module.css'

export const Route = createFileRoute('/admin/edit/image/$id')({
    loader: ({ params: { id } }) => getAdminImage({ data: id }),
    component: EditImage,
})

function EditImage() {
    const initialData = Route.useLoaderData()
    const { id } = Route.useParams()
    const [imageData, setImageData] = useState(initialData)

    useEffect(() => {
        setImageData(initialData)
    }, [initialData])

    const handleSubmit = async (data: Record<string, unknown>) => {
        await updateImage({
            data: {
                id,
                data: {
                    image: data.image as string | undefined,
                    url: data.url as string | undefined,
                    title: data.title as string,
                    width: data.width as number | undefined,
                    height: data.height as number | undefined,
                    description: data.description as string,
                    alt_text: data.alt_text as string,
                    date: data.date as string,
                    location: data.location as string,
                    featured: data.featured as boolean,
                    digital: data.digital as boolean,
                    visible: data.visible as boolean,
                    gps_lat: (data.gps_lat as number) ?? null,
                    gps_long: (data.gps_long as number) ?? null,
                    camera: (data.camera as number) ?? null,
                    film: (data.film as number) ?? null,
                },
            },
        })
        const refreshed = await getAdminImage({ data: id })
        if (refreshed) setImageData(refreshed)
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>Edit Image</h1>
                {!imageData ? (
                    <div>Loading...</div>
                ) : (
                    <PhotoForm
                        mode="edit"
                        onSubmit={handleSubmit}
                        initialData={imageData as Record<string, unknown>}
                    />
                )}
            </section>
        </Layout>
    )
}
