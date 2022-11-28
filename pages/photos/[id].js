import Layout from '../../components/layout';
import PhotoBody from '../../components/photo-body';

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Head from 'next/head';

export default function Photo() {
    const [photo, setPhoto] = useState([]);
    const router = useRouter()
    const {id} = router.query
    
    async function getPhoto() {
        const req = await fetch(`/api/post/${id}`);
        // const req = await fetch(`/api/post/${id}`);
        const photoData = await req.json();
        setPhoto(photoData);
    }

    useEffect(() => {
        if (router.isReady) {
            const {id} = router.query
        }
        getPhoto();
    },[router.isReady])

    return (
        <Layout>
          
        <Head>
            <title>{photo.title}</title>
        </Head>
        
        <section>
            <PhotoBody title={photo.title} imgurl={photo.url}/>
        </section>

        </Layout>
    );
}