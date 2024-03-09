import styles from './CollectionSummary.module.css'

export default function CollectionSummary({ data }) {
    return (
        <tr className={styles.row}>
            <td className={styles.titleField}>
                <h5>{data.name}</h5>
            </td>
            <td className={styles.linkField}>
                <a href={`management/update/collection/${data.id}`}>Edit</a>
            </td>
        </tr>
    )
}
