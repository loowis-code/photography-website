import Head from 'next/head'
import Header from '../Header'

export default function Layout({ children }) {
    return (
        <div>
            <div className="">
                <Head>
                    <title>Loowis Photography</title>

                    <meta
                        name="description"
                        content="A photography portfolio website featuring images taken by Lewis Inches, mainly in Edinburgh using an Olympus OM40 and Canon EOS 550D."
                    />
                    <meta
                        property="og:image"
                        content="https://photography-website.s3.eu-west-2.amazonaws.com/images/2023-09-05/Kodak Pro Image 100/05-09-23_Kodak_Pro_Image_100_3.jpg"
                    />
                    <meta
                        property="og:url"
                        content="https://lewisinches.pictures"
                    />
                    <meta property="og:title" content="Loowis Photography" />
                    <meta
                        property="og:description"
                        content="A photography portfolio website featuring images taken by Lewis Inches, mainly in Edinburgh using an Olympus OM40 and Canon EOS 550D."
                    />
                    <meta
                        property="og:image"
                        content="https://photography-website.s3.eu-west-2.amazonaws.com/images/2023-09-05/Kodak Pro Image 100/05-09-23_Kodak_Pro_Image_100_3.jpg"
                    />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta
                        property="twitter:domain"
                        content="lewisinches.pictures"
                    />
                    <meta
                        property="twitter:url"
                        content="https://lewisinches.pictures"
                    />
                    <meta name="twitter:title" content="Loowis Photography" />
                    <meta
                        name="twitter:description"
                        content="A photography portfolio website featuring images taken by Lewis Inches, mainly in Edinburgh using an Olympus OM40 and Canon EOS 550D."
                    />
                    <meta
                        name="twitter:image"
                        content="https://photography-website.s3.eu-west-2.amazonaws.com/images/2023-09-05/Kodak Pro Image 100/05-09-23_Kodak_Pro_Image_100_3.jpg"
                    />
                    <link rel="icon" href="favicon/favicon.ico" sizes="any" />
                </Head>
                <Header />
                {children}
            </div>
        </div>
    )
}
