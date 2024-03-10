import styles from './CollectionSummary.module.css'

export default function CollectionSummary({ data, setter, switcher }) {
    function switchForm() {
        setter(data.id)
        switcher('editPhoto')
    }

    return (
        <tr className={styles.row}>
            <td className={styles.titleField}>
                <h5>{data.name}</h5>
            </td>
            <td className={styles.linkField}>
                <button onClick={() => switchForm()}>Edit</button>
            </td>
        </tr>
    )
}
