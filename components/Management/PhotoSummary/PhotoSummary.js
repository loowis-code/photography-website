import styles from './PhotoSummary.module.css'

export default function PhotoSummary({ data, setter, switcher }) {
    function switchForm() {
        setter(data.id)
        switcher('editPhoto')
    }

    return (
        <div className={styles.row}>
            <div className={styles.titleField}>
                <h5>{data.title}</h5>
            </div>
            <div className={styles.dateField}>
                <h6>{new Date(data.date).toISOString().substring(0, 10)}</h6>
            </div>
            <div className={styles.urlField}>
                <h6>{data.url}</h6>
            </div>
            <div className={styles.linkField}>
                <button onClick={() => switchForm()} className={styles.button}>
                    Edit
                </button>
            </div>
        </div>
    )
}
