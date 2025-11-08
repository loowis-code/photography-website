import Layout from '../components/Layout'
import CollectionPreview from '../components/CollectionPreview'
import styles from './css-modules/collections.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { neon } from '@neondatabase/serverless'

export async function getStaticProps() {
    const sql = neon(process.env.DATABASE_URL)
    const collections = await sql`SELECT * FROM collections ORDER BY collection_name ASC`
    return {
        props: {
            data: collections,
        },
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
                <div className={styles.grid}>
                    {collections.map((d) => (
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

export default Collections
