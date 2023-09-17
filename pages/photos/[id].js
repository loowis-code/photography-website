import Layout from '../../components/Layout'
import PhotoBody from '../../components/PhotoBody'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

function Photo() {
    const [photo, setPhoto] = useState([])
    const router = useRouter()

    async function getPhoto() {
        const req = await fetch(`/api/photo/${router.query.id}`)
        setPhoto(await req.json())
        console.log(photo)
    }

    useEffect(() => {
        if (router.query.id) {
            getPhoto()
        }
    }, [router.query.id])

    return (
        <Layout>
            <Head>
                <title>
                    {photo.title} | Lewis Inches - Photography
                </title>
            </Head>

            <section>
                <PhotoBody
                    data={photo}
                    key={photo.id}
                />
            </section>
        </Layout>
    )
}

export default Photo
