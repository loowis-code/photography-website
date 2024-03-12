import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styles from '../css-modules/search.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ImageModal from '../../components/ImageModal'
import { XMasonry, XBlock } from 'react-xmasonry'

function Search() {
    const [searchResults, setSearchResults] = useState([])
    const router = useRouter()

    async function getSearchResults() {
        const req = await fetch(`/api/search/${router.query.query}`)
        const searchData = await req.json()
        setSearchResults(searchData)
        
    }

    useEffect(() => {
        getSearchResults()
        console.log(searchResults)
    }, [router.query.query])

    return (
        <Layout>
            <Head>
                <title>Search Results | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Search Results</h1>
                <XMasonry maxColumns="3" targetBlockWidth="550">
                    {Array.isArray(searchResults) && searchResults.map((d) => (
                        <XBlock key={d.id}>
                            <ImageModal data={d} key={d.id} page="All" />
                        </XBlock>
                    ))}
                </XMasonry>
            </section>
        </Layout>
    )
}

export default Search
