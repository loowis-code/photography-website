import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'
import { usePathname } from 'next/navigation'

export default function Header() {
    let pathname = usePathname()
    let pathnameRegex
    if (pathname != '/') {
        pathnameRegex = new RegExp(pathname)
    } else {
        pathnameRegex = new RegExp('homepage')
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <Link className={styles.title} href="/">
                    <Image
                        src="/logo-text.png"
                        alt="website logo"
                        width="2981"
                        height="1020"
                        sizes="100vw"
                        className={styles.title}
                    />
                    <p className={styles.tagline}>Photography</p>
                </Link>
            </div>

            <div className={styles.navs}>
                <Link
                    className={
                        pathnameRegex.test('/all-images')
                            ? styles.allActive
                            : styles.allLink
                    }
                    href="/all-images"
                >
                    All Images
                </Link>
                <Link
                    className={
                        pathnameRegex.test('/collections')
                            ? styles.collActive
                            : styles.collLink
                    }
                    href="/collections"
                >
                    Collections
                </Link>
                <Link
                    className={
                        pathnameRegex.test('/image-map')
                            ? styles.mapActive
                            : styles.mapLink
                    }
                    href="/image-map"
                >
                    Image Map
                </Link>
            </div>
            <div className={styles.links}>
                <div className={styles.link}>
                    <a href="https://www.instagram.com/loowis.pictures/">
                        <Image
                            src="/instagram.svg"
                            alt="link to instagram"
                            width="1200"
                            height="1200"
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </a>
                </div>
                <div className={styles.link}>
                    <a href="https://github.com/LewisI224">
                        <Image
                            src="/github.svg"
                            alt="link to github"
                            width="1200"
                            height="1200"
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </a>
                </div>
            </div>
        </div>
    )
}
