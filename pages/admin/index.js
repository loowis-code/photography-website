import { useSession, signIn } from 'next-auth/react'
import Layout from '../../components/Layout'
import styles from './dashboard.module.css'
import { Button } from 'loowis-component-library'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'
import Link from 'next/link'

function Dashboard() {
    const [images, setImages] = useState([])
    const { data: session } = useSession()

    const getImageData = async () => {
        const req = await fetch('/api/admin/read/images')
        var imageData = await req.json()
        imageData.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at)
        })
        setImages(imageData)
    }

    useEffect(() => {
        if (session) {
            getImageData()
        }
    }, [session])

    if (session) {
        return (
            <Layout>
                <section className={styles.container}>
                    <h1>Edit Images</h1>
                    <AdminNavbar />
                    <div className={styles.imagesContainer}>
                        {images.map((image) => (
                            <div key={image.image_id}>
                                <Link
                                    className={styles.imagePreview}
                                    href={`/admin/edit/image/${image.image_id}`}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt_text}
                                        width={image.width}
                                        height={image.height}
                                        className={styles.image}
                                        quality={25}
                                    />
                                </Link>
                                <div>
                                    <h2 className={styles.previewTitle}>
                                        {image.title}
                                    </h2>
                                    <h3 className={styles.previewDetail}>
                                        Visible: {String(image.visible)}
                                    </h3>
                                    <h3 className={styles.previewDetail}>
                                        Featured: {String(image.featured)}
                                    </h3>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={async () => {
                                            const res = await fetch(
                                                `/api/admin/delete/image/${image.image_id}`,
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type':
                                                            'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        url: image.url,
                                                    }),
                                                },
                                            )
                                            if (res.ok) {
                                                getImageData()
                                            }
                                        }}
                                    >
                                        Delete Image
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </Layout>
        )
    }
    return (
        <Layout>
            <section className={styles.container}>
                <h1>Management</h1>
                <Button buttonText={'Sign In'} clickHandler={signIn} />
            </section>
        </Layout>
    )
}

export default Dashboard
