import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BASE_URL } from '~/lib/constants'
import { useMemo } from 'react'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import { getFeaturedImages } from '~/lib/server/images'
import { validateHomeSearch } from '~/lib/search-params'
import styles from '~/styles/pages/index.module.css'

export const Route = createFileRoute('/')({
    validateSearch: validateHomeSearch,
    loader: () => getFeaturedImages(),
    head: ({ match }) => ({
        meta: [{ title: 'Loowis Photography' }],
        links: [{ rel: 'canonical', href: `${BASE_URL}${match.pathname}` }],
    }),
    component: Home,
})

function Home() {
    const data = Route.useLoaderData()
    const { format } = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const images = useMemo(
        () => data.filter((photo) => photo.digital === (format === 'digital')),
        [data, format],
    )

    return (
        <Layout>
            <section>
                <div className={styles.container}>
                    <div className={styles.formatSelection}>
                        <button
                            type="button"
                            onClick={() =>
                                navigate({ search: { format: 'film' } })
                            }
                            className={
                                format === 'film'
                                    ? styles.formatTitleActive
                                    : styles.formatTitle
                            }
                        >
                            Film
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                navigate({ search: { format: 'digital' } })
                            }
                            className={
                                format === 'digital'
                                    ? styles.formatTitleActive
                                    : styles.formatTitle
                            }
                        >
                            Digital
                        </button>
                    </div>
                    <div className={styles.gallery}>
                        {images.map((d) => (
                            <ImageModal data={d} key={d.image_id} />
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}
