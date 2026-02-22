import { createFileRoute } from '@tanstack/react-router'
import Layout from '~/components/Layout/Layout'
import { getRandomVisibleImage } from '~/lib/server/images'
import styles from '~/styles/pages/four-oh-four.module.css'

export const Route = createFileRoute('/$')({
    loader: () => getRandomVisibleImage(),
    head: () => ({
        meta: [{ title: '404 | Loowis Photography' }],
    }),
    component: Custom404,
})

function Custom404() {
    const photo = Route.useLoaderData()

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>This page does not exist :/</h1>
                <div className={styles.photoContainer}>
                    {photo?.url && (
                        <img
                            title={photo.title}
                            className={styles.image}
                            src={photo.url}
                            alt={photo.alt_text ?? ''}
                            width={photo.width}
                            height={photo.height}
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    )}
                </div>
            </section>
        </Layout>
    )
}
