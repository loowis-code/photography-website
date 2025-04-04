import Layout from '../../components/Layout'
import PhotoBody from '../../components/ImagePage'
import Head from 'next/head'
import prisma from '../../prisma/prisma'
import styles from '../css-modules/image.module.css'

export async function getStaticProps(context) {
    const res = await prisma.images.findUnique({
        where: { id: context.params.id },
    })
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

export async function getStaticPaths() {
    const res = await prisma.images.findMany()
    const paths = res.map((d) => {
        return {
            params: { id: d.id.toString() },
        }
    })
    return {
        paths,
        fallback: false,
    }
}

function Photo({ data }) {
    return (
        <Layout>
            <Head>
                <title>{`${data.title} | Loowis Photography`}</title>
                {/* <link rel="icon" href="favicon/favicon.ico" sizes="any" /> */}
            </Head>

            <section className={styles.imagecontainer}>
                <PhotoBody data={data} key={data.id} />
            </section>
        </Layout>
    )
}

export default Photo
