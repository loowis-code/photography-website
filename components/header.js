import Link from 'next/link';
import styles from './css-modules/header.module.css'
import { useEffect, useState } from 'react'

export default function Header () {
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
        <div className={styles.header}>
            <div className={styles.titleblock}>
                <div className={styles.title}>
                    <Link className={styles.titlelink} href="/">Lewis Inches</Link>
                </div>
                <div>
                    <p className={styles.tagline}>Photography in Edinburgh</p>
                </div>
            </div>
            <div className={styles.navs}>
                <Link className={styles.navlink} href="/all-photos" >View All Images</Link>
                <div className={styles.navlink}>
                    <div class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Collections</div>
                    <ul class="dropdown-menu">
                        {data.map((d) => (<li><a class="dropdown-item" href={`/collections/${d.data.name}`}>{d.data.name}</a></li>))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
