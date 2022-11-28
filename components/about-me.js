import styles from './css-modules/about-me.module.css'

export default function AboutMe({}) {
    return (
        <div>


        <div className={styles.header}>
            <p>About Me</p>
        </div>
        <div className={styles.mainabouttext}>
            <p>
                My name is Lewis Inches, a software engineer from Edinburgh.
            </p>
        </div>
            
        </div>
    );
}