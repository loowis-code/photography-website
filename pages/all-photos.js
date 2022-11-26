import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import { useEffect, useState } from 'react'

export default function AllPhotos() {
    const [photos, setPhotos] = useState([]);

    async function getPhotos() {
        const req = await fetch('https://jsonplaceholder.typicode.com/photos');
        const photoData = (await req.json());
        photoData.length = 25;
        setPhotos(photoData);
    }

    useEffect(() => {
        getPhotos();
    }, [])

  return (
    <Layout>

        <section>
            <h1>All Photos</h1>
            <div>
                {photos.map((photo) => (<PhotoPreview id={photo.id} title={photo.title} imgurl={photo.url}/>))}
            </div>

        </section>

    </Layout>
  )
}