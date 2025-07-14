import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styles from '../css-modules/search.module.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ImageModal from '../../components/ImageModal'

function sanitizeQuery(query) {
    return /^[a-zA-Z0-9 _-]+$/.test(query) ? query : null;
}

function Search() {
    const router = useRouter()
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!router.query.query) return;
        setLoading(true);
        async function getSearchResults() {
            const sanitizedQuery = sanitizeQuery(router.query.query);
            if (!sanitizedQuery) {
                setSearchResults([]);
                setLoading(false);
                return;
            }
            const req = await fetch(`/api/search/${sanitizedQuery}`);
            const searchData = await req.json();
            setSearchResults(searchData);
            setLoading(false);
        }
        getSearchResults();
    }, [router.query.query]);

    return (
        <Layout>
            <Head>
                <title>Search Results | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Search Results</h1>
                {loading && (
                    <div className={styles.loader}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                )}
                {!loading && searchResults.length === 0 && (
                    <h2 className={styles.noResults}>💀 No images found</h2>
                )}
                <div className={styles.grid}>
                    {!loading && searchResults.length > 0 && (
                        searchResults.map((d) => (
                                <ImageModal data={d} key={d.id} page="All" />
                        ))
                    )}
                </div>

            </section>
        </Layout>
    )
}

export default Search
