import Head from 'next/head'
import Header from '../Header'

export default function Layout({ children }) {
    return (
        <div>
            <div className="">
                <Head>
                    <title>Lewis Inches - Photography</title>
                    <meta
                        name="description"
                        content="Exhibition of photos taken by me. Mainly taken in Edinburgh"
                    />
                    <link
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
                        rel="stylesheet"
                        integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
                        crossOrigin="anonymous"
                    ></link>
                    <script
                        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
                        crossOrigin="anonymous"
                    ></script>
                    <link rel="icon" href="favicon/favicon.ico" sizes="any" />
                </Head>
                <Header />

                {children}
            </div>
        </div>
    )
}
