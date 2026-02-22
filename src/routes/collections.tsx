import { createFileRoute } from '@tanstack/react-router'
import Layout from '~/components/Layout/Layout'
import CollectionPreview from '~/components/CollectionPreview/CollectionPreview'
import { getAllCollections } from '~/lib/server/collections'
import styles from '~/styles/pages/collections.module.css'

export const Route = createFileRoute('/collections')({
    loader: () => getAllCollections(),
    head: () => ({
        meta: [{ title: 'Collections | Loowis Photography' }],
    }),
    component: Collections,
})

function Collections() {
    const data = Route.useLoaderData()

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.header}>Collections</h1>
                <div className={styles.grid}>
                    {data.map((d) => (
                        <CollectionPreview
                            name={d.collection_name}
                            cover_url={d.cover_url}
                            id={d.collection_id}
                            key={d.collection_id}
                            width={d.width}
                            height={d.height}
                        />
                    ))}
                </div>
            </section>
        </Layout>
    )
}
