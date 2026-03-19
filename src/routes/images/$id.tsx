import { createFileRoute, notFound } from '@tanstack/react-router'
import { BASE_URL } from '~/lib/constants'
import Layout from '~/components/Layout/Layout'
import ImagePage from '~/components/ImagePage/ImagePage'
import { getImageById } from '~/lib/server/images'
import styles from '~/styles/pages/image.module.css'

export const Route = createFileRoute('/images/$id')({
    loader: async ({ params: { id } }) => {
        const image = await getImageById({ data: id })
        if (!image) throw notFound()
        return image
    },
    head: ({ loaderData, match }) => ({
        meta: [
            {
                title: `${loaderData?.title ?? 'Image'} | Loowis Photography`,
            },
            {
                name: 'og:title',
                content: `${loaderData?.title ?? 'Image'} | Loowis Photography`,
            },
            {
                name: 'og:description',
                content: loaderData?.description || 'Photography by Loowis',
            },
            { name: 'og:image', content: loaderData?.url ?? '' },
            { name: 'og:url', content: `${BASE_URL}${match.pathname}` },
            { name: 'og:type', content: 'website' },
        ],
        links: [{ rel: 'canonical', href: `${BASE_URL}${match.pathname}` }],
    }),
    component: Photo,
})

function Photo() {
    const data = Route.useLoaderData()

    return (
        <Layout>
            <section className={styles.imagecontainer}>
                <ImagePage data={data} key={data.image_id} />
            </section>
        </Layout>
    )
}
