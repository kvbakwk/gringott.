import styles from '../../styles/wallettransaction.module.css'

export default function WalletTransaction({ transaction, toDate }) {

    return (
        <div id={transaction.deposit ? styles.deposit : styles.withdraw} className={styles.transaction} key={transaction.transactionId}>
            <div className={styles.name}>
                {transaction.title}
            </div>
            <div className={styles.date}>
                {toDate(transaction.date)}
            </div>
            <div className={styles.description}>
                {transaction.description}
            </div>
            <div className={styles.amount}>
                {transaction.amount} zł
            </div>
        </div>)
}