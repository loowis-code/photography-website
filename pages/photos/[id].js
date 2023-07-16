import Layout from '../../components/layout';
import PhotoBody from '../../components/photo-body';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/router'
import Head from 'next/head';

function Photo() {
    const [photo, setPhoto] = useState([]);
    const router = useRouter()
    async function getPhoto() {
        const req = await fetch(`/api/photo/${router.query.id}`);
        const photoData = await req.json();
        setPhoto(photoData);
    }

    useEffect(() => {
        if (router.query.id) {
            getPhoto();
        }
    },[router.query.id])

    return (
        <Layout>
            <Head>
                {photo.map((d) => ( <title>{d.data.title} | Lewis</title> ))}
            </Head>
        
            <section>
                {photo.map((d) => (<PhotoBody data={d.data}/>))}
            </section>
        </Layout>
    );
}

export default Photo