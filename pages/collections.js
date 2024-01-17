import Layout from '../components/Layout'
import CollectionPreview from '../components/CollectionPreview'
import styles from './css-modules/collections.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { XMasonry, XBlock } from 'react-xmasonry'
import prisma from '../prisma/prisma'

export async function getStaticProps() {
    const res = await prisma.collections.findMany()
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

function Collections({ data }) {
    const [collections, setCollections] = useState([])

    useEffect(() => {
        setCollections(data)
    }, [data])

    return (
        <Layout>
            <Head>
                <title>Collections | Loowis Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Collections</h1>
                <XMasonry maxColumns="3" targetBlockWidth="550">
                    {collections.map((d) => (
                        <XBlock key={d.id}>
                            <CollectionPreview
                                name={d.name}
                                cover_image={d.cover_url}
                                id={d.id}
                                key={d.id}
                            />
                        </XBlock>
                    ))}
                </XMasonry>
            </section>
        </Layout>
    )
}

export default Collections
