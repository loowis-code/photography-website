import Layout from '../../components/layout';
import PhotoPreview from '../../components/photo-preview';
import styles from '../css-modules/all-photos.module.css';
import Head from 'next/head';
import { useRouter } from 'next/router'

import { useState, useEffect } from 'react';

function Collection() {
    const [collectionsData, setCollectionsData] = useState([]);
    const router = useRouter()

    async function getCollectionData() {
        const req = await fetch(`/api/collection/${router.query.id}`);
        const collectionData = await req.json();
        setCollectionsData(collectionData)

    }

    useEffect(() => {
        if(router.isReady) {
            getCollectionData();
        }
    },[router.isReady])

    return (
        <Layout>
        
        <section className={styles.container}>
            <h1>Collection</h1>
            <div className={styles.photos}>
                {collectionsData.map((d) => (<PhotoPreview title={d.data.title} id={d.data.url_id} filename={d.data.filename} className={styles.photo}/>))}
            </div>
        </section>

        </Layout>
    );
}

export default Collection