import Link from 'next/link';
import styles from './css-modules/header-sidebar.module.css'
import { useEffect, useState } from 'react'
import Head from 'next/head';

export default function HeaderSidebar () {
    const [data, setCollections] = useState([]);

    async function getCollections() {
        const req = await fetch('/api/collections');
        const collectionData = (await req.json());
        setCollections(collectionData);
    }

    useEffect(() => {
        getCollections();
    }, [])

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.titleblock}>
                    <div className={styles.title}>
                        <Link className={styles.titlelink} href="/">Lewis Inches</Link>
                    </div>
                    <div>
                        <p className={styles.tagline}>Photography</p>
                    </div>
                </div>
                <div className={styles.navs}>
                    <Link className={styles.navlink} href="/all-photos" >View All Images</Link>
                    <div className={styles.navlink}>
                        <div className="dropdown">
                            <div className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bs-toggle="dropdown">
                                Collections
                            </div>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {data.map((d) => (<a className="dropdown-item" href={`/collections/${d.data.collection_id}`}>{d.data.collection_name}</a>))}
                            </div>
                        </div>
                    </div>
                    {/* <Link className={styles.navlink} href="/about">About</Link> */}
                </div>
            </div>
        </div>
    );
}
