import Layout from '../components/Layout/layout'
import CollectionPreview from '../components/CollectionPreview'
import styles from './css-modules/collections.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

function Collections() {
    const [collections, setCollections] = useState([])

    async function getCollections() {
        const req = await fetch('/api/collections')
        const collectionData = await req.json()
        setCollections(collectionData)
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <Layout>
            <Head>
                <title>Collections | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Collections</h1>
                <div className={styles.collections}>
                    {collections.map((d) => (
                        <CollectionPreview
                            name={d.data.collection_name}
                            cover_image={d.data.collection_cover_image}
                            id={d.data.collection_id}
                            key={d.data.collection_id}
                        />
                    ))}
                </div>
            </section>
        </Layout>
    )
}

export default Collections
