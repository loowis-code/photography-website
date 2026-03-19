import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { BASE_URL } from '~/lib/constants'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import SortingButtons from '~/components/SortingButtons/SortingButtons'
import Pagination from '~/components/Pagination/Pagination'
import { getCollectionWithImages } from '~/lib/server/collections'
import { validateImageSearch } from '~/lib/search-params'
import styles from '~/styles/pages/all-images.module.css'

export const Route = createFileRoute('/collection/$id')({
    validateSearch: validateImageSearch,
    loaderDeps: ({ search }) => search,
    loader: async ({ params: { id }, deps: { page, sort, filter } }) => {
        const result = await getCollectionWithImages({
            data: { id, page, sort, filter },
        })
        if (!result) throw notFound()
        return result
    },
    head: ({ loaderData, match }) => ({
        meta: [
            {
                title: `${loaderData?.collection?.collection_name ?? 'Collection'} | Loowis Photography`,
            },
        ],
        links: [{ rel: 'canonical', href: `${BASE_URL}${match.pathname}` }],
    }),
    component: Collection,
})

function Collection() {
    const { collection, images, page, totalPages } = Route.useLoaderData()
    const search = Route.useSearch()
    const navigate = useNavigate({ from: Route.fullPath })

    const updateSearch = (updates: Partial<typeof search>) => {
        navigate({
            search: (prev) => ({ ...prev, ...updates }),
        })
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.header}>{collection?.collection_name}</h1>
                <SortingButtons
                    filter={search.filter}
                    onSortChange={(sort) => updateSearch({ sort, page: 1 })}
                    onFilterChange={(filter) =>
                        updateSearch({ filter, page: 1 })
                    }
                    page="Collections"
                />
                <div className={styles.grid}>
                    {images.map((d) => (
                        <ImageModal data={d} key={d.image_id} />
                    ))}
                </div>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) =>
                            updateSearch({ page: newPage })
                        }
                    />
                )}
            </section>
        </Layout>
    )
}
