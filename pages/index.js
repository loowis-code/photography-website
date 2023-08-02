import Layout from '../components/layout';
import ImageCarousel from '../components/ImageCarousel';
import About from '../components/about-me';
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
        let photoInfo = photoData.map((d) => d.data.filename)
        setPhotos(photoInfo);
    }

    useEffect(() => {
        getLatestPhotos();
    },[])

    return (
        <Layout>
            <section>
                <div className={styles.carousels}>
                    <div className={styles.recentCarousel}>
                        <p className={styles.title}>Recent Images</p>
                        <ImageCarousel images={photos} />
                    </div>
                    <div className={styles.featuredCarousel}>
                        <p className={styles.title}>Featured Images</p>
                        <ImageCarousel images={featured} />
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Home
