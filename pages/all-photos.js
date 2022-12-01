import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import { useEffect, useState } from 'react'

export default function AllPhotos() {
    const [data, setData] = useState([]);

    async function getPhotos() {
        const req = await fetch('/api/getPhotos');
        const photoData = (await req.json());
        photoData.sort((a, b) => {
            return b.data.date_taken.localeCompare(a.data.date_taken);
        });
        setData(photoData);
    }

    useEffect(() => {
        getPhotos();
    }, [])

  return (
    <Layout>

        <section>
            <div className="row">
                {data.map((d) => (<PhotoPreview title={d.data.title} imgurl={d.data.imgurl}/>))}
            </div>
        </section>

    </Layout>
  )
}