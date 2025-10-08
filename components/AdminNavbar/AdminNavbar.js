import styles from './AdminNavbar.module.css'
import { signOut } from 'next-auth/react'
import { Button } from 'loowis-component-library'

export default function AdminNavbar(){
    return (
        <>
            <nav className={styles.navbar}>
                <a href="/admin">Dashboard</a>
                <a href="/admin/new/image">Upload New Image</a>
                <a href="/admin/new/collection">Create New Collection</a>
                <a href="/admin/edit/collections">Edit Collections</a>
                <Button buttonText={'Sign Out'} clickHandler={signOut}/>
            </nav>
        </>
    )
}
