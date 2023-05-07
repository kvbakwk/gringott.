
import styles from '../styles/wallet.module.css'

export default function NotFound({ urls, slug }) {

    if (urls == 1)
        return (
            <div className={styles.notfound}>
                There is no page named <span>{slug}</span>.
            </div>
        )
    else
        return (
            <div className={styles.notfound}>
                There are no pages at <span>{slug}</span>.
            </div>
        )
}