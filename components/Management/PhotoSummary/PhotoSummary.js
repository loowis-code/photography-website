import styles from './PhotoSummary.module.css'

export default function PhotoSummary({ data, setter, switcher }) {
    function switchForm() {
        setter(data.id)
        switcher('editPhoto')
    }

    return (
        <tr className={styles.row}>
            <td className={styles.titleField}>
                <h5>{data.title}</h5>
            </td>
            <td className={styles.dateField}>
                <h6>{new Date(data.date).toISOString().substring(0, 10)}</h6>
            </td>
            <td className={styles.urlField}>
                <h6>{data.url}</h6>
            </td>
            <td className={styles.linkField}>
                <button onClick={() => switchForm()}>Edit</button>
            </td>
        </tr>
    )
}
