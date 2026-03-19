import { createFileRoute } from '@tanstack/react-router'
import { BASE_URL } from '~/lib/constants'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import { searchImages } from '~/lib/server/search'
import styles from '~/styles/pages/search.module.css'

export const Route = createFileRoute('/search/$query')({
    loader: ({ params: { query } }) => searchImages({ data: query }),
    head: ({ match }) => ({
        meta: [{ title: 'Search Results | Lewis Inches - Photography' }],
        links: [{ rel: 'canonical', href: `${BASE_URL}${match.pathname}` }],
    }),
    component: Search,
})

function Search() {
    const searchResults = Route.useLoaderData()

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.header}>Search Results</h1>
                {searchResults.length === 0 && (
                    <h2 className={styles.noResults}>No images found</h2>
                )}
                <div className={styles.grid}>
                    {searchResults.length > 0 &&
                        searchResults.map((d) => (
                            <ImageModal data={d} key={d.image_id} />
                        ))}
                </div>
            </section>
        </Layout>
    )
}
