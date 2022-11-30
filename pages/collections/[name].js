import Layout from '../../components/layout';
import PhotoPreview from '../../components/photo-preview';

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Head from 'next/head';

export default function Collection() {
    const router = useRouter()
    const {name} = router.query
    
    const [photos, setPhotos] = useState([]);

    async function getPhotoData() {
        const req = await fetch(`/api/collection/${name}`);
        const collectionData = (await req.json());
        var ids = collectionData[0]
        console.log(ids)
        if (ids != undefined) {
            ids = ids.data.photo_ids
            var photos = []
            for (const id of ids) {
                const req = await fetch(`/api/photo/${id}`);
                const photoData = (await req.json());
                photos.push(photoData);
                
            }
            setPhotos(photos[0]);
        }

    }

    useEffect(() => {
        getPhotoData();
    },[router.isReady])

    return (
        <Layout>
          
        <Head>
            <title>Collection | Lewis</title>
        </Head>
        
        <section>
            <div className="row">
                {photos.map((d) => (<PhotoPreview id={d.data.id} title={d.data.title} imgurl={d.data.img_url}/>))}
            </div>
        </section>

        </Layout>
    );
}