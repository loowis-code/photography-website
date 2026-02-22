import { createFileRoute } from '@tanstack/react-router'
import Layout from '~/components/Layout/Layout'
import PhotoForm from '~/components/PhotoForm/PhotoForm'
import { createImage } from '~/lib/server/admin-images'
import styles from '~/styles/admin/new-image.module.css'

export const Route = createFileRoute('/admin/new/image')({
    component: NewImage,
})

function NewImage() {
    const handleSubmit = async (data: Record<string, unknown>) => {
        await createImage({
            data: {
                image: data.image as string,
                title: data.title as string,
                width: data.width as number,
                height: data.height as number,
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
        })
        alert('Image uploaded successfully!')
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>Upload New Image</h1>
                <PhotoForm mode="create" onSubmit={handleSubmit} />
            </section>
        </Layout>
    )
}
