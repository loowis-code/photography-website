import Layout from '../../components/layout';
import PhotoBody from '../../components/photo-body';

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Head from 'next/head';

export default function Photo() {
    const router = useRouter()
    const {id} = router.query
    
    const [data, setData] = useState([]);

    async function getPhotos() {
        const req = await fetch(`/api/photo/${id}`);
        const photoData = (await req.json());
        setData(photoData);
    }

    useEffect(() => {
        if (router.isReady) {
            const {id} = router.query
        }
        getPhotos();
    },[router.isReady])

    return (
        <Layout>
          
        <Head>
            {data.map((d) => ( <title>{d.data.title} | Lewis</title> ))}
        </Head>
        
        <section>
            {data.map((d) => (<PhotoBody data={d.data}/>))}
        </section>

        </Layout>
    );
}