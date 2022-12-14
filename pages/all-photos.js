import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import styles from './css-modules/all-photos.module.css';

export async function getServerSideProps() {
    const req = await fetch('https://www.lewisinches.pictures/api/getPhotos');
    const photoData = await req.json();
    photoData.sort((a, b) => {
        return b.data.date_taken.localeCompare(a.data.date_taken);
    });
    return { props: {photoData} }
}

function AllPhotos({ photoData }) {
    return (
        <Layout>
            <section>
                <div className={styles.photos}>
                    {photoData.map((d) => (<PhotoPreview title={d.data.title} imgurl={d.data.imgurl}/>))}
                </div>
            </section>
        </Layout>
    )
}

export default AllPhotos