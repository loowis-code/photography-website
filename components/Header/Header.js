import Link from 'next/link'
import styles from './Header.module.css'
import { usePathname} from 'next/navigation';
import { use } from 'react';

export default function Header() {
    let pathname = new RegExp();
    if (usePathname() != "/") {
        pathname = new RegExp(usePathname());
    } else {
        pathname = new RegExp("homepage");
    }


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
                <Link className={pathname.test("/all-images") ? (styles.active) : styles.navlink} href="/all-images">
                    All Images
                </Link>
                <Link className={pathname.test("/collections") ? (styles.active) : styles.navlink} href="/collections">
                    Collections
                </Link>
                <Link className={pathname.test("/image-map") ? (styles.active) : styles.navlink} href="/image-map">
                    Image Map
                </Link>
            </div>
            <div className={styles.links}>
                <div className={styles.link}>
                    <a href="https://www.instagram.com/lewisi.photos/">
                        <img src="/instagram.svg"></img>
                    </a>
                </div>
                <div className={styles.link}>
                    <a href="https://github.com/LewisI224">
                        <img src="/github.svg"></img>
                    </a>
                </div>
            </div>
        </div>
    )
}
