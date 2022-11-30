import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import AboutMe from '../components/about-me'
import { useEffect, useState } from 'react'

export default function Home() {
    const [data, setData] = useState([]);

    async function getPhotos() {
        const req = await fetch('/api/getPhotos');
        const photoData = (await req.json());
        photoData.length = 6;
        setData(photoData);
    }

    useEffect(() => {
        getPhotos();
    }, [])

  return (
    <Layout>

        <section>
            <div className="row">
                {data.map((d) => (<PhotoPreview id={d.data.id} title={d.data.title} imgurl={d.data.imgurl}/>))}
            </div>
            <div>
                <AboutMe />
            </div>
        </section>

    </Layout>
  )
}
