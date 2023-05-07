import Link from 'next/link';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import styles from '../../styles/layout.module.css';

export default function LayoutLeftbar({ walletsData, setSite, setWalletOpen }) {
    return (
        <div className={styles.left_bar}>
            {walletsData.map(wallet => (
                <Link href={`/home/wallets/${wallet.name}`} onClick={() => setSite(2)} className={styles.wallet} key={wallet.walletId}>
                    <div className={styles.title}>
                        {wallet.name}
                    </div>
                    <div className={styles.balance}>
                        {wallet.balance} zł
                    </div>
                </Link>
            ))}
            <div className={styles.newWallet} >
                <Button onClick={() => setWalletOpen(true)}>
                    <AddIcon />
                </Button>
            </div>
        </div>
    )
}