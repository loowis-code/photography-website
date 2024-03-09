import Layout from '../components/Layout'
import styles from './css-modules/management.module.css'
import Head from 'next/head'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import prisma from '../prisma/prisma'
import PhotoSummary from '../components/Management/PhotoSummary'
import CollectionSummary from '../components/Management/CollectionSummary'

export async function getStaticProps() {
    const photoRes = await prisma.images.findMany()
    const collectionRes = await prisma.collections.findMany()
    return {
        props: {
            photoData: JSON.parse(JSON.stringify(photoRes)),
            collectionData: JSON.parse(JSON.stringify(collectionRes)),
        },
    }
}

function Management({ photoData, collectionData }) {
    const { data: session } = useSession()
    const [currentForm, setCurrentForm] = useState('editPhotos')

    if (session) {
        return (
            <Layout>
                <Head>
                    <title>Management | Lewis Inches - Photography</title>
                </Head>
                <section className={styles.container}>
                    <div className={styles.profileInfo}>
                        <Image
                            className={styles.profilePicture}
                            src={session.user.image}
                            alt="Profile Picture"
                            width={50}
                            height={50}
                        />
                        <p className={styles.text}>{session.user.email} </p>
                        <button
                            className={styles.signOut}
                            onClick={() => signOut()}
                        >
                            Sign out
                        </button>
                    </div>
                    <div className={styles.managementContainer}>
                        <div className={styles.list}>
                            <div
                                onClick={() => setCurrentForm('createPhoto')}
                                className={styles.listItem}
                            >
                                <p>Create Photo</p>
                            </div>
                            <div
                                onClick={() =>
                                    setCurrentForm('createCollection')
                                }
                                className={styles.listItem}
                            >
                                <p>Create Collection</p>
                            </div>
                            <div
                                onClick={() => setCurrentForm('editPhoto')}
                                className={styles.listItem}
                            >
                                <p>Edit Photo</p>
                            </div>
                            <div
                                onClick={() => setCurrentForm('editCollection')}
                                className={styles.listItem}
                            >
                                <p>Edit Collection</p>
                            </div>
                        </div>

                        <table className={styles.form}>
                            {currentForm === 'editPhoto' &&
                                photoData.map((d) => (
                                    <PhotoSummary key={d.id} data={d} />
                                ))}
                            {currentForm === 'editCollection' &&
                                collectionData.map((d) => (
                                    <CollectionSummary key={d.id} data={d} />
                                ))}
                        </table>
                    </div>
                </section>
            </Layout>
        )
    }
    return (
        <Layout>
            <Head>
                <title>Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <button className={styles.signIn} onClick={() => signIn()}>
                    Sign in
                </button>
            </section>
        </Layout>
    )
}

export default Management
