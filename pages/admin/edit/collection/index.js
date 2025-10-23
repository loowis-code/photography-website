import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function EditCollections() {
    const [collections, setCollections] = useState([])
    const { data: session } = useSession()

    const getCollectionData = async () => {
        const req = await fetch('/api/admin/read/collections')
        const collectionData = await req.json()
        setCollections(collectionData)
    }

    useEffect(() => {
        if (session) {
            getCollectionData()
        }
    }, [session])

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Edit Collections</h1>
                <AdminNavbar />
                <div className={styles.collectionsContainer}>
                    {collections.map((collection) => (
                        <div key={collection.collection_id}>
                            <Link
                                className={styles.collectionPreview}
                                href={`/admin/edit/collection/${collection.collection_id}`}
                            >
                                <Image
                                    src={collection.cover_url}
                                    width={collection.width}
                                    height={collection.height}
                                    className={styles.image}
                                    quality={25}
                                />
                            </Link>
                            <div>
                                <h2 className={styles.previewTitle}>
                                    {collection.collection_name}
                                </h2>
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={async () => {
                                    const res = await fetch(
                                        `/api/admin/delete/collection/${collection.collection_id}`,
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                            },
                                            body: JSON.stringify({
                                                url: collection.cover_url,
                                            }),
                                        },
                                    )
                                    if (res.ok) {
                                        getCollectionData()
                                    }
                                }}
                            >
                                Delete Collection
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    )
}
