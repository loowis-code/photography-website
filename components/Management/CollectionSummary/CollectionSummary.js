import styles from './CollectionSummary.module.css'

export default function CollectionSummary({ data, setter, switcher }) {
    function switchForm() {
        setter(data.id)
        switcher('editCollection')
    }

    return (
        <div className={styles.row}>
            <div className={styles.titleField}>
                <h5>{data.name}</h5>
            </div>
            <div className={styles.linkField}>
                <button onClick={() => switchForm()} className={styles.button}>Edit</button>
            </div>
        </div>
    )
}
