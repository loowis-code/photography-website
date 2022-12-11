import Layout from '../components/layout';
import PhotoPreview from '../components/photo-preview';
import AboutMe from '../components/about-me'

export async function getServerSideProps() {
    const req = await fetch('https://www.lewisinches.pictures/api/getPhotos');
    const photoData = await req.json();
    photoData.sort((a, b) => {
        return b.data.date_taken.localeCompare(a.data.date_taken);
    });
    photoData.length = 3;
    return { props: {photoData} }

}

function Home({ photoData }) {
    

  return (
    <Layout>

        <section>
            <div className="row">
                {photoData.map((d) => (<PhotoPreview id={d.data.id} title={d.data.title} imgurl={d.data.imgurl}/>))}
            </div>
            <div>
                <AboutMe />
            </div>
        </section>

    </Layout>
  )
}

export default Home
