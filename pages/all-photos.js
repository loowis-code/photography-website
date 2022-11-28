import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import { useEffect, useState } from 'react'

export default function AllPhotos() {
    const [data, setData] = useState([]);

    async function getPhotos() {
        const req = await fetch('/api/getPhotos');
        const photoData = (await req.json());
        setData(photoData);
    }

    useEffect(() => {
        getPhotos();
    }, [])

  return (
    <Layout>

        <section>
            <div className="row">
                {data.map((d) => (<PhotoPreview id={d.data.id} title={d.data.title} imgurl={d.data.img_url}/>))}
            </div>
        </section>

    </Layout>
  )
}