import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import ImageModal from '~/components/ImageModal/ImageModal'
import SortingButtons from '~/components/SortingButtons/SortingButtons'
import Pagination from '~/components/Pagination/Pagination'
import { getAllImages } from '~/lib/server/images'
import styles from '~/styles/pages/all-images.module.css'

export const Route = createFileRoute('/all-images')({
    loader: () => getAllImages(),
    head: () => ({
        meta: [{ title: 'All Images | Loowis Photography' }],
    }),
    component: AllImages,
})

function AllImages() {
    const data = Route.useLoaderData()
    const [filteredPhotos, setFilteredPhotos] = useState(data)
    const [currentPhotos, setCurrentPhotos] = useState(filteredPhotos)
    const [currentPage, setCurrentPage] = useState(1)
    const [displayPage, setDisplayPage] = useState(1)
    const photosPerPage = 9
    const maxPage = Math.ceil(filteredPhotos.length / photosPerPage)

    const paginatePhotos = (
        photos: typeof data,
        page: number,
    ) => {
        const startIndex = (page - 1) * photosPerPage
        const endIndex = startIndex + photosPerPage
        return photos.slice(startIndex, endIndex)
    }

    useEffect(() => {
        let validPage = currentPage
        if (currentPage < 1) {
            validPage = 1
        } else if (currentPage > maxPage) {
            validPage = maxPage
        }
        if (validPage !== currentPage) {
            setCurrentPage(validPage)
            return
        }
        setCurrentPhotos(paginatePhotos(filteredPhotos, validPage))
        setDisplayPage(validPage)
    }, [currentPage, filteredPhotos, maxPage])

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.header}>All Images</h1>
                <SortingButtons photos={data} setPhotos={setFilteredPhotos} />
                <div className={styles.grid}>
                    {currentPhotos.map((d) => (
                        <ImageModal data={d} key={d.image_id} />
                    ))}
                </div>
                <Pagination
                    setCurrentPage={setCurrentPage}
                    displayPage={displayPage}
                    maxPage={maxPage}
                />
            </section>
        </Layout>
    )
}
