import Layout from '../components/layout';
import ImageCarousel from '../components/ImageCarousel';
import styles from './css-modules/index.module.css';
import { useState, useEffect } from 'react';

function Home() {
    const [photos, setPhotos] = useState([]);
    const [featured, setFeatured] = useState([]);

    async function getLatestPhotos() {
        const req = await fetch('/api/getPhotos');
        const photoData = await req.json();
        photoData.sort((a, b) => {
            return b.data.photo_data.date_taken.localeCompare(a.data.photo_data.date_taken);
        });
        let featured = [];
        photoData.forEach(function (photo) {
            if (photo.data.featured === "on") {
                featured.push(photo.data.filename);
            }
        });
        setFeatured(featured);
        photoData.length = 4;
        let photoUrls = photoData.map((d) => d.data.filename);
        setPhotos(photoUrls);
    }

    useEffect(() => {
        getLatestPhotos();
    },[])

    return (
        <Layout>
            <section>
                <div className={styles.imageCarousels}>
                    <p className={styles.title}>Recent Images</p>
                    <div className={styles.carousel}>
                        <ImageCarousel images={photos} />
                    </div>
                    <p className={styles.title}>Featured Images</p>
                    <div className={styles.carousel}>
                        <ImageCarousel images={featured} />
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
