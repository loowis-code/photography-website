import { createFileRoute, notFound } from '@tanstack/react-router'
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
    head: ({ loaderData }) => ({
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
                content:
                    loaderData?.description || 'Photography by Loowis',
            },
            { name: 'og:image', content: loaderData?.url ?? '' },
            { name: 'og:url', content: 'pictures.loowis.co.uk' },
            { name: 'og:type', content: 'website' },
        ],
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
