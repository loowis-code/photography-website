import Layout from '../components/Layout'
import CollectionPreview from '../components/CollectionPreview'
import styles from './css-modules/collections.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

function Collections() {
    const [collections, setCollections] = useState([])

    async function getCollections() {
        const req = await fetch('/api/collections')
        setCollections(await req.json())
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
                            name={d.name}
                            cover_image={d.cover_url}
                            id={d.id}
                            key={d.id}
                        />
                    ))}
                </div>
            </section>
        </Layout>
    )
}

export default Collections
