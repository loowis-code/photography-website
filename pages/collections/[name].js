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
        if (ids != undefined) {
            ids = ids.data.photo_ids
            var photos = []
            for (const id of ids) {
                const req = await fetch(`/api/photo/${id}`);
                const photoData = (await req.json());
                photos.push(photoData[0]);
                
            }
            console.log(photos)
            setPhotos(photos);
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
                {photos.map((d) => (<PhotoPreview title={d.data.title} imgurl={d.data.imgurl}/>))}
            </div>
        </section>

        </Layout>
    );
}