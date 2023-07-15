import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import styles from './css-modules/all-photos.module.css';
import { useState, useEffect } from 'react';

function AllPhotos() {

    const [photos, setPhotos] = useState([]);

    async function getAllPhotos() {
        const req = await fetch('/api/getPhotos');
        const photoData = await req.json();
        photoData.sort((a, b) => {
            return b.data.photo_data.date_taken.localeCompare(a.data.photo_data.date_taken);
        });
        setPhotos(photoData);
    }

    useEffect(() => {
        getAllPhotos();
    },[])

    return (
        <Layout>
            <section>
                <div className={styles.photos}>
                    {photos.map((d) => (<PhotoPreview title={d.data.title} filename={d.data.filename} id={d.data.url_id}/>))}
                </div>
            </section>
        </Layout>
    )
}

export default AllPhotos