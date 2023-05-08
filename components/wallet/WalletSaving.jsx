import { IconButton, CircularProgress } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import HailIcon from '@mui/icons-material/Hail';

import styles from '../../styles/walletsaving.module.css'

export default function WalletSaving({ saving, toDate, setToSavingOpen, setFromSavingOpen }) {
    return (
        <div className={styles.saving} >
            <div className={styles.progress}>
                <CircularProgress
                    variant="determinate"
                    value={saving.amount / saving.goal * 100 > 100 ? 100 : saving.amount / saving.goal * 100}
                    size={150} color='warning' />
                <HailIcon />
            </div>
            <div className={styles.info}>
                <span className={styles.name}>
                    {saving.name}
                </span>
                <span className={styles.goal}>
                    <span className={styles.label}>Do celu brakuje</span>
                    <span className={styles.value}>{saving.goal - saving.amount} zł</span>
                </span>
                <span>
                    <IconButton onClick={() => setToSavingOpen(true)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                    <IconButton onClick={() => setFromSavingOpen(true)}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                </span>
            </div>
        </div>
    )
}