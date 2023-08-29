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
        const photoData = await req.json()
        setPhoto(photoData)
        console.log(photoData)
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
                    {photo[0]?.data.title} | Lewis Inches - Photography
                </title>
            </Head>

            <section>
                {photo.map((d) => (
                    <PhotoBody
                        data={d.data}
                        id={router.query.id}
                        key={d.data.title}
                    />
                ))}
            </section>
        </Layout>
    )
}

export default Photo
