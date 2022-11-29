import Link from 'next/link';
import styles from './css-modules/header.module.css'

export default function Header () {
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
                        <li><a class="dropdown-item" href="/collections/Edinburgh">Edinburgh</a></li>
                        <li><a class="dropdown-item" href="/collections/Paris">Paris</a></li>
                        <li><a class="dropdown-item" href="/collections/Rome">Rome</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );

}
