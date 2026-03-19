import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import SortingButtons from '~/components/SortingButtons/SortingButtons'
import Pagination from '~/components/Pagination/Pagination'
import { getAllImages } from '~/lib/server/images'
import { validateImageSearch } from '~/lib/search-params'
import styles from '~/styles/pages/all-images.module.css'

export const Route = createFileRoute('/all-images')({
    validateSearch: validateImageSearch,
    loaderDeps: ({ search }) => search,
    loader: ({ deps: { page, sort, filter } }) =>
        getAllImages({ data: { page, sort, filter } }),
    head: () => ({
        meta: [{ title: 'All Images | Loowis Photography' }],
    }),
    component: AllImages,
})

function AllImages() {
    const { items, page, totalPages } = Route.useLoaderData()
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
                <h1 className={styles.header}>All Images</h1>
                <SortingButtons
                    filter={search.filter}
                    onSortChange={(sort) => updateSearch({ sort, page: 1 })}
                    onFilterChange={(filter) =>
                        updateSearch({ filter, page: 1 })
                    }
                />
                <div className={styles.grid}>
                    {items.map((d) => (
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
