import Layout from '../components/Layout'
import styles from './css-modules/all-images.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import ImageModal from '../components/ImageModal'
import SortingButtons from '../components/SortingButtons'
import prisma from '../prisma/prisma'
import Pagination from '../components/Pagination/Pagination'

export async function getStaticProps() {
    const res = await prisma.images.findMany()
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

function AllImages({ data }) {
    const [filteredPhotos, setFilteredPhotos] = useState(data)
    const [currentPhotos, setCurrentPhotos] = useState(filteredPhotos)
    const [currentPage, setCurrentPage] = useState(1)
    const [displayPage, setDisplayPage] = useState(1)
    const photosPerPage = 9
    const maxPage = Math.ceil(filteredPhotos.length / photosPerPage)

    const paginatePhotos = (photos, page) => {

        const startIndex = (page - 1) * photosPerPage
        const endIndex = startIndex + photosPerPage
        return photos.slice(startIndex, endIndex)
    }
    useEffect(() => {
        let validPage = currentPage;
        if (currentPage < 1) {
            validPage = 1;
        } else if (currentPage > maxPage) {
            validPage = maxPage;
        }
        if (validPage !== currentPage) {
            setCurrentPage(validPage);
            return;
        }
        setCurrentPhotos(paginatePhotos(filteredPhotos, validPage));
        setDisplayPage(validPage);
    }, [currentPage, filteredPhotos, maxPage]);

    return (
        <Layout>
            <Head>
                <title>All Images | Loowis Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>All Images</h1>
                <SortingButtons
                    photos={data}
                    setPhotos={setFilteredPhotos}
                />

                <div className={styles.grid}>
                    {currentPhotos.map((d) => (
                        <ImageModal data={d} key={d.id} page="All" />
                    ))}
                </div>

                <Pagination setCurrentPage={setCurrentPage} displayPage={displayPage} maxPage={maxPage}/>

            </section>
        </Layout>
    )
}

export default AllImages
