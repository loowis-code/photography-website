import Layout from '../../components/layout';
import PhotoPreview from '../../components/photo-preview';
import styles from '../css-modules/all-photos.module.css';
import { useRouter } from 'next/router'

import { useState, useEffect } from 'react';

function Collection() {
    const [collectionInfo, setCollectionInfo] = useState([]);
    const [photoData ,setPhotoData] = useState([]);
    const router = useRouter()

    async function getCollectionData() {
        const req = await fetch(`/api/collection/${router.query.id}`);
        const collectionData = await req.json();
        setCollectionInfo(collectionData[0])
        if (Array.isArray(collectionData)) {
            setPhotoData(collectionData.slice(1))
        }
    }

    useEffect(() => {
        getCollectionData();
    },[router.asPath])

    return (
        <Layout>
        
        <section className={styles.container}>
            <h1 className={styles.header}>{collectionInfo?.name}</h1>
            <div className={styles.photos}>
                {photoData?.map((d) => (<PhotoPreview title={d.data.title} key={d.data.url_id} id={d.data.url_id} filename={d.data.filename} className={styles.photo}/>))}
            </div>
        </section>

        </Layout>
    );
}

export default Collection