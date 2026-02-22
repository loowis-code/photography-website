import { createFileRoute } from '@tanstack/react-router'
import Layout from '~/components/Layout/Layout'
import CollectionForm from '~/components/CollectionForm/CollectionForm'
import { createCollection } from '~/lib/server/admin-collections'
import styles from '~/styles/admin/new-collection.module.css'

export const Route = createFileRoute('/admin/new/collection')({
    component: NewCollection,
})

function NewCollection() {
    const handleSubmit = async (data: Record<string, unknown>) => {
        await createCollection({
            data: {
                image: data.image as string,
                name: data.name as string,
                width: data.width as number,
                height: data.height as number,
                description: data.description as string,
            },
        })
        alert('Collection created successfully!')
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Create New Collection</h1>
                <CollectionForm mode="create" onSubmit={handleSubmit} />
            </section>
        </Layout>
    )
}
