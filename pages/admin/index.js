import { useSession, signIn } from 'next-auth/react'
import Layout from '../../components/Layout'
import styles from './dashboard.module.css'
import { Button } from 'loowis-component-library'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'



function Dashboard() {
    const [images, setImages] = useState([]);
    const { data: session } = useSession()

    const getImageData = async () => {
        const req = await fetch('/api/admin/read/images')
        const imageData = await req.json()
        setImages(imageData)
    }

    useEffect(() => {
        if (session) {
            getImageData()
        }
    }, [session])

    if (session) {
        return(
            <Layout>
                <section className={styles.container}>
                    <h1>Dashboard</h1>
                    <AdminNavbar/>
                    <div className={styles.imagesContainer}>
                        {images.map((image) => (
                            <a className={styles.imagePreview} href={`/admin/edit/image/${image.image_id}`} key={image.image_id}>
                                <Image
                                    src={image.url}
                                    alt={image.alt_text}
                                    width={image.width}
                                    height={image.height}
                                    className={styles.image}
                                />
                                <h5 className={styles.previewTitle}>{image.title}</h5>
                            </a>
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
                <Button buttonText={'Sign In'} clickHandler={signIn}/>
            </section>
        </Layout>
    )
}

export default Dashboard;