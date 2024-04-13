import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'

export default function Header() {
    const router = useRouter()
    let pathname = usePathname()
    let pathnameRegex
    if (pathname != '/') {
        pathnameRegex = new RegExp(pathname)
    } else {
        pathnameRegex = new RegExp('homepage')
    }

    function handleSearch(e) {
        e.preventDefault()
        const searchQuery = e.target.search.value
        router.push('/search/' + sanitizeString(searchQuery))
    }

    function sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü.,_-]/gim, '')
        return str.trim()
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

                <form className={styles.searchBar} onSubmit={handleSearch}>
                    <input
                        required
                        type="text"
                        id="search"
                        name="search"
                        className={styles.searchBox}
                        placeholder="Search..."
                    ></input>
                    <button type="submit" className={styles.searchButton}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-play"
                        >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                </form>
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
