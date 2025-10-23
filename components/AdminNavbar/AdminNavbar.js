import styles from './AdminNavbar.module.css'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AdminNavbar() {
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <Link className={styles.link} href="/admin">
                    Edit Images
                </Link>
                <Link className={styles.link} href="/admin/new/image">
                    Upload New Image
                </Link>
                <Link className={styles.link} href="/admin/new/collection">
                    Create New Collection
                </Link>
                <Link className={styles.link} href="/admin/edit/collection">
                    Edit Collections
                </Link>
                <button className={styles.link} onClick={signOut}>
                    Sign Out
                </button>
            </nav>
        </div>
    )
}
