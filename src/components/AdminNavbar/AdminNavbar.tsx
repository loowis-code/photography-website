import styles from './AdminNavbar.module.css'
import { Link } from '@tanstack/react-router'

export default function AdminNavbar() {
    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <Link className={styles.link} to="/admin">
                    Edit Images
                </Link>
                <Link className={styles.link} to="/admin/new/image">
                    Upload New Image
                </Link>
                <Link className={styles.link} to="/admin/new/collection">
                    Create New Collection
                </Link>
                <Link className={styles.link} to="/admin/edit/collection">
                    Edit Collections
                </Link>
                <a className={styles.link} href="/api/auth/signout">
                    Sign Out
                </a>
            </nav>
        </div>
    )
}
