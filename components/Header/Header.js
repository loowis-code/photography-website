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
                <a className={styles.letter} href='/'>L</a>
                <a className={styles.letter} href='/'>O</a>
                <a className={styles.letter} href='/'>O</a>
                <a className={styles.letter} href='/'>W</a>
                <a className={styles.letter} href='/'>I</a>
                <a className={styles.letter} href='/'>S</a>
            </div>
            <div className={styles.navTabs}>
                <a href='/all-images' className={styles.navTab}>ALL IMAGES</a>
                <a href='/collections' className={styles.navTab}>COLLECTIONS</a>
                <a href='/image-map' className={styles.navTab}>IMAGE MAP</a>
            </div>
        </div>
    )
}
