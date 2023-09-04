import Link from 'next/link'
import styles from './Header.module.css'
import { useEffect, useState } from 'react'

export default function Header() {
    const [data, setCollections] = useState([])

    async function getCollections() {
        const req = await fetch('/api/collections')
        const collectionData = await req.json()
        setCollections(collectionData)
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <Link className={styles.title} href="/">
                    Lewis Inches
                </Link>
                <div>
                    <p className={styles.tagline}>Photography</p>
                </div>
            </div>
            <div className={styles.navs}>
                <Link className={styles.navlink} href="/all-photos">
                    All Images
                </Link>
                <Link className={styles.navlink} href="/collections">
                    Collections
                </Link>
                <Link className={styles.navlink} href="/photo-map">
                    GPS Map
                </Link>
            </div>
            <div className={styles.links}>
                <div className={styles.link}><a href='https://www.instagram.com/lewisi.photos/'><img src='/instagram.svg'></img></a></div>
                <div className={styles.link}><a href='https://github.com/LewisI224'><img src='/github.svg'></img></a></div>

            </div>
        </div>
    )
}
