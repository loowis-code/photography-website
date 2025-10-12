import Layout from '../components/Layout'
import styles from './css-modules/management.module.css'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import PhotoSummary from '../components/Management/PhotoSummary'
import CollectionSummary from '../components/Management/CollectionSummary'
import PhotoCreator from '../components/Management/PhotoCreator'
import CollectionCreator from '../components/Management/CollectionCreator'
import PhotoEditor from '../components/Management/PhotoEditor'
import CollectionEditor from '../components/Management/CollectionEditor'
import { Button } from 'loowis-component-library'

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
                <section className={styles.container}>
                    <h1>Management</h1>

                    <div className={styles.managementContainer}>
                        <div className={styles.secondaryNav}>
                            <div
                                onClick={() => setCurrentForm('createPhoto')}
                                className={
                                    currentForm === 'createPhoto'
                                        ? styles.secondaryNavItemActive
                                        : styles.secondaryNavItem
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
                                        ? styles.secondaryNavItemActive
                                        : styles.secondaryNavItem
                                }
                            >
                                <p>Create Collection</p>
                            </div>
                            <div
                                onClick={() => setCurrentForm('seePhotos')}
                                className={
                                    currentForm === 'seePhotos' ||
                                    currentForm === 'editPhoto'
                                        ? styles.secondaryNavItemActive
                                        : styles.secondaryNavItem
                                }
                            >
                                <p>Edit Photo</p>
                            </div>
                            <div
                                onClick={() => setCurrentForm('seeCollections')}
                                className={
                                    currentForm === 'seeCollections' ||
                                    currentForm === 'editCollection'
                                        ? styles.secondaryNavItemActive
                                        : styles.secondaryNavItem
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
                                <div>
                                    {photoData.map((d) => (
                                        <PhotoSummary
                                            key={d.id}
                                            data={d}
                                            setter={setSelectedPhoto}
                                            switcher={setCurrentForm}
                                        />
                                    ))}
                                </div>
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
                        <div className={styles.profileInfo}>
                            <p className={styles.email}>
                                {session.user.email}{' '}
                            </p>
                            <Button
                                buttonText={'Sign Out'}
                                clickHandler={signOut}
                            />
                        </div>
                    </div>
                </section>
            </Layout>
        )
    }
    return (
        <Layout>
            <section className={styles.container}>
                <h1>Management</h1>
                <Button buttonText={'Sign In'} clickHandler={signIn} />
            </section>
        </Layout>
    )
}

export default Management
