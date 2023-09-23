import Layout from '../components/Layout'
import CollectionPreview from '../components/CollectionPreview'
import styles from './css-modules/collections.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { XMasonry, XBlock } from 'react-xmasonry'

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
