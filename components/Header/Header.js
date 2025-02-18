import Link from 'next/link';
import styles from './Header.module.css'
import { useEffect } from 'react';

export default function Header() {

    useEffect(() => {
        let name = document.getElementById('name');
        if (!name) return;
        let letters = Array.from(name.children);
        let colors = ['#d95d5d', '#db8525', '#e8c43c', '#bed649', '#9ecbdb', '#c771a1'];
        letters.forEach(function (letter, index) {
            letter.style.backgroundColor = colors[index];

        });
    }, []);

    return (
        <div className={styles.headerContainer}>
            <div className={styles.name} id='name'>
                <Link className={styles.letter} href='/'>L</Link>
                <Link className={styles.letter} href='/'>O</Link>
                <Link className={styles.letter} href='/'>O</Link>
                <Link className={styles.letter} href='/'>W</Link>
                <Link className={styles.letter} href='/'>I</Link>
                <Link className={styles.letter} href='/'>S</Link>
            </div>
            <div className={styles.navTabs}>
                <Link href='/all-images' className={styles.navTab}>ALL IMAGES</Link>
                <Link href='/collections' className={styles.navTab}>COLLECTIONS</Link>
                <Link href='/image-map' className={styles.navTab}>IMAGE MAP</Link>
            </div>
        </div>
    )
}
