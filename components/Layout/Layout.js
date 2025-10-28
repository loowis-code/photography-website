import Head from 'next/head'
import { Header } from 'loowis-component-library'
import Script from 'next/script'

export default function Layout({ children }) {
    function handleSearchEvent(term) {
        if (!term) {
            return
        } else {
            window.location.href = `/search/${term}`
        }
    }
    return (
        <>
            <Head>
                <title>Loowis Photography</title>

                <meta
                    name="description"
                    content="A photography portfolio website featuring images taken by Lewis Inches, mainly in Edinburgh using an Olympus OM40 and Canon EOS 550D."
                />
                <link rel="icon" href="/favicon/favicon.png" sizes="any" />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
            </Head>
            <Header
                navTabs={['ALL IMAGES', 'COLLECTIONS', 'IMAGE MAP']}
                navLinks={['/all-images', '/collections', '/image-map']}
                handleSearch={handleSearchEvent}
            />
            <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />
            {children}
        </>
    )
}
