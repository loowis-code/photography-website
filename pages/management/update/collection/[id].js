import Layout from '../../../../components/Layout'
import Multiselect from 'multiselect-react-dropdown'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../../css-modules/management/edit-photo.module.css'
import Link from 'next/link'

export default function Post() {
    const [collectionData, setCollectionData] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [photoData, setPhotoData] = useState([])
    const router = useRouter()
    const { id } = router.query

    async function getLookups() {
        const req = await fetch(`/api/management/read/lookups`)
        var lookups = await req.json()
        filterLookups(lookups)
    }

    async function filterLookups(lookups) {
        var filteredLookups = []
        for (const lookup of lookups) {
            if (lookup.collectionsId === id) {
                filteredLookups.push(lookup)
            }
        }
        getPhotosInCollection(filteredLookups)
    }

    async function getPhotoData() {
        const req = await fetch(`/api/management/read/photos`)
        var photos = await req.json()
        setPhotoData(photos)
    }

    async function getPhotosInCollection(filteredLookups) {
        var photos = []
        for (const lookup of filteredLookups) {
            const req = await fetch(
                `/api/management/read/photo/${lookup.imagesId}`,
            )

            var data = await req.json()
            photos.push({ lookupId: lookup.id, title: data.title })
        }
        setSelectedOptions(photos)
    }

    async function getCollectionData() {
        const req = await fetch(`/api/management/read/collection/${id}`)
        var collection = await req.json()
        setCollectionData(collection)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            name: event.target.name.value,
            subtitle: event.target.subtitle.value,
            cover_url: event.target.cover_url.value,
            description: event.target.description.value,
        }

        const endpoint = `/api/Edit/EditCollection/${id}`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const response = await fetch(endpoint, options)
        await response.json()
        if (confirm('Collection edited successfully!')) {
            window.location.href = '/ViewExistingCollections'
        }
    }

    const handleDelete = async (removedItem) => {
        const endpoint = `/api/Delete/DeletePhotoFromCollection/${removedItem.lookupId}`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await fetch(endpoint, options)
        await response.json()
    }

    const handleAdd = async (selectedOptions) => {
        const data = {
            collectionsId: id,
            imagesId: selectedOptions[selectedOptions.length - 1].id,
        }

        const endpoint = `/api/Create/AddPhotoToCollection`

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        const response = await fetch(endpoint, options)
        await response.json()
    }

    useEffect(() => {
        if (router.isReady) {
            getPhotoData()
            getLookups()
            getCollectionData()
        }
    }, [router.isReady])

    return (
        <Layout>
            <section>
                <div className={styles.header}>
                    <Link href="/management" className={styles.backButton}>
                        Back to Management
                    </Link>
                    <h1 className={styles.title}>Edit Photo</h1>
                </div>
                <form
                    onSubmit={handleSubmit}
                    method="post"
                    className={styles.form}
                >
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={collectionData.name}
                        required
                    />

                    <label htmlFor="subtitle">Subtitle:</label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        defaultValue={collectionData.subtitle}
                    />

                    <label htmlFor="cover_url">Cover URL:</label>
                    <input
                        type="text"
                        id="cover_url"
                        name="cover_url"
                        defaultValue={collectionData.cover_url}
                    />

                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        defaultValue={collectionData.description}
                    />

                    <label htmlFor="collection_photo_ids">Photo IDs:</label>
                    <Multiselect
                        options={photoData}
                        selectedValues={selectedOptions}
                        displayValue="title"
                        id="collection_photo_ids"
                        onKeyPressFn={() => void 0}
                        onRemove={(selectedOptions, removedItem) => {
                            setSelectedOptions(selectedOptions)
                            handleDelete(removedItem)
                        }}
                        onSearch={() => void 0}
                        onSelect={(selectedOptions) => {
                            setSelectedOptions(selectedOptions)
                            handleAdd(selectedOptions)
                        }}
                    />
                    <button type="submit">Submit</button>
                </form>
            </section>
        </Layout>
    )
}
