import Layout from '../components/Layout'
import styles from './css-modules/management.module.css'
import Head from 'next/head'
// import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import PhotoSummary from '../components/Management/PhotoSummary'
import CollectionSummary from '../components/Management/CollectionSummary'
import PhotoCreator from '../components/Management/PhotoCreator'
import CollectionCreator from '../components/Management/CollectionCreator'
import PhotoEditor from '../components/Management/PhotoEditor'
import CollectionEditor from '../components/Management/CollectionEditor'

function Management() {
    const { data: session } = useSession()
    const [currentForm, setCurrentForm] = useState('seePhotos')
    const [photoData, setPhotoData] = useState([])
    const [collectionData, setCollectionData] = useState([])

    const [selectedPhoto, setSelectedPhoto] = useState('')
    const [selectedCollection, setSelectedCollection] = useState('')

    async function getPhotos() {
        const req = await fetch('/api/management/read/photos')
        const photoData = await req.json()
        setPhotoData(photoData)
    }

    async function getCollections() {
        const req = await fetch('/api/management/read/collections')
        const collectionData = await req.json()
        setCollectionData(collectionData)
    }

    useEffect(() => {
        getPhotos()
        getCollections()
    }, [])

    if (session) {
        return (
            <Layout>
                <Head>
                    <title>Management | Lewis Inches - Photography</title>
                </Head>
                <section className={styles.container}>
                    <div className={styles.profileInfo}>
                        {/* <Image
                            className={styles.profilePicture}
                            src={session.user.image}
                            alt="Profile Picture"
                            width={50}
                            height={50}
                        /> */}
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
                                className={
                                    currentForm === 'createPhoto'
                                        ? styles.listItemActive
                                        : styles.listItem
                                }
                            >
                                <p>Create Photo</p>
                            </div>
                            <div
                                onClick={() =>
                                    setCurrentForm('createCollection')
                                }
                                className={
                                    currentForm === 'createCollection'
                                        ? styles.listItemActive
                                        : styles.listItem
                                }
                            >
                                <p>Create Collection</p>
                            </div>
                            <div
                                onClick={() => setCurrentForm('seePhotos')}
                                className={
                                    currentForm === 'seePhotos' ||
                                    currentForm === 'editPhoto'
                                        ? styles.listItemActive
                                        : styles.listItem
                                }
                            >
                                <p>Edit Photo</p>
                            </div>
                            <div
                                onClick={() => setCurrentForm('seeCollections')}
                                className={
                                    currentForm === 'seeCollections' ||
                                    currentForm === 'editCollection'
                                        ? styles.listItemActive
                                        : styles.listItem
                                }
                            >
                                <p>Edit Collection</p>
                            </div>
                        </div>

                        <div className={styles.form}>
                            {currentForm === 'createPhoto' && <PhotoCreator />}
                            {currentForm === 'createCollection' && (
                                <CollectionCreator />
                            )}
                            {currentForm === 'seePhotos' && (
                                <table>
                                    {photoData.map((d) => (
                                        <PhotoSummary
                                            key={d.id}
                                            data={d}
                                            setter={setSelectedPhoto}
                                            switcher={setCurrentForm}
                                        />
                                    ))}
                                </table>
                            )}
                            {currentForm === 'seeCollections' && (
                                <table>
                                    {collectionData.map((d) => (
                                        <CollectionSummary
                                            key={d.id}
                                            data={d}
                                            setter={setSelectedCollection}
                                            switcher={setCurrentForm}
                                        />
                                    ))}
                                </table>
                            )}
                            {currentForm === 'editPhoto' && (
                                <PhotoEditor id={selectedPhoto} />
                            )}
                            {currentForm === 'editCollection' && (
                                <CollectionEditor id={selectedCollection} />
                            )}
                        </div>
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
