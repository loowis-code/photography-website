import Layout from '../../components/layout';
import PhotoBody from '../../components/photo-body';

import Head from 'next/head';

export async function getServerSideProps(context) {
    const {imgurl} = context.query
    const req = await fetch(`https://www.lewisinches.pictures/api/photo/${imgurl}`);
    const photoData = (await req.json());

    return { props: {photoData} }
}

function Photo({photoData}) {
    return (
        <Layout>
            <Head>
                {photoData.map((d) => ( <title>{d.data.title} | Lewis</title> ))}
            </Head>
        
            <section>
                {photoData.map((d) => (<PhotoBody data={d.data}/>))}
            </section>
        </Layout>
    );
}

export default Photo