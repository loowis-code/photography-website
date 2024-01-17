import Layout from '../components/Layout'
import styles from './css-modules/index.module.css'
import { useState, useEffect } from 'react'
import { XMasonry, XBlock } from 'react-xmasonry'
import ImageModal from '../components/ImageModal'
import prisma from '../prisma/prisma'

export async function getStaticProps() {
    const res = await prisma.images.findMany()
    return {
        props: { data: JSON.parse(JSON.stringify(res)) },
    }
}

function Home({ data }) {
    const [dFeatured, setDFeatured] = useState([])
    const [aFeatured, setAFeatured] = useState([])
    const [format, setFormat] = useState('film')

    async function filterFeatured() {
        data.sort((a, b) => {
            return b.date.localeCompare(a.date)
        })
        let dFeatured = []
        let aFeatured = []
        data.forEach(function (photo) {
            console.log(photo)
            if (photo.featured === true && photo.digital === true && photo.hidden === false) {
                dFeatured.push(photo)
            }
            if (photo.featured === true && photo.digital === false && photo.hidden === false) {
                aFeatured.push(photo)
            }
        })
        dFeatured.length = 9
        setDFeatured(dFeatured)
        aFeatured.length = 9
        setAFeatured(aFeatured)
    }

    useEffect(() => {
        filterFeatured()
    }, [])  

    return (
        <Layout>
            <section>
                <div className={styles.container}>
                    <div className={styles.formatSelection}>
                        <div onClick={() => setFormat('film')}  className={
                        format === 'film'
                            ? styles.formatTitleActive
                            : styles.formatTitle
                        }>
                            Film
                        </div>
                        <div onClick={() => setFormat('digital')}  className={
                        format === 'digital'
                            ? styles.formatTitleActive
                            : styles.formatTitle
                        }>
                            Digital
                        </div>
                    </div>
                    <div className={
                        format === 'digital'
                            ? styles.digitalShow
                            : styles.digitalHide
                        }>
                            <XMasonry maxColumns="4" targetBlockWidth="500">
                                {dFeatured.map((d) => (
                                    <XBlock key={d.id}>
                                        <ImageModal data={d} key={d.id} page="Home"/>
                                    </XBlock>
                                ))}
                            </XMasonry>
                    </div>
                    <div className={
                        format === 'film'
                            ? styles.filmShow
                            : styles.filmHide
                        }>
                            <XMasonry maxColumns="4" targetBlockWidth="500">
                                {aFeatured.map((d) => (
                                    <XBlock key={d.id}>
                                        <ImageModal data={d} key={d.id} page="Home"/>
                                    </XBlock>
                                ))}
                            </XMasonry>
                    </div>

                </div>
            </section>
        </Layout>
    )
}

export default Home
