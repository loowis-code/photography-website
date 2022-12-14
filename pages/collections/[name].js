import Layout from '../../components/layout';
import PhotoPreview from '../../components/photo-preview';
import styles from '../css-modules/all-photos.module.css';

import Head from 'next/head';

export async function getServerSideProps(context) {
    const {name} = context.query
    const req = await fetch(`https://www.lewisinches.pictures/api/collection/${name}`);
    const collectionData = (await req.json());
    var ids = collectionData[0]
    
    if (ids != undefined) {
        ids = ids.data.photo_ids
        var photos = []
        for (const id of ids) {
            const req = await fetch(`https://www.lewisinches.pictures/api/photo/${id}`);
            const photoData = (await req.json());
            photos.push(photoData[0]);
        }
        photos.sort((a, b) => {
            return b.data.date_taken.localeCompare(a.data.date_taken);
        });
    }

    return { props: {photos, name} }
}

function Collection({ photos, name }) {


    return (
        <Layout>
          
        <Head>
            <title>{name} | Lewis</title>
        </Head>
        
        <section>
            <div className={styles.photos}>
                {photos.map((d) => (<PhotoPreview title={d.data.title} imgurl={d.data.imgurl}/>))}
            </div>
        </section>

        </Layout>
    );
}

export default Collection