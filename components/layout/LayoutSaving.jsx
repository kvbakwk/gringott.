
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, InputAdornment, Switch, MenuItem } from '@mui/material';
import styles from '../../styles/layout.module.css';
import { useRouter } from 'next/router';

export default function LayoutSaving({ savingOpen, setSavingOpen, walletsData }) {

    const router = useRouter()
    const [savingName, setSavingName] = useState('')
    const [savingWalletId, setSavingWalletId] = useState('')
    const [savingGoal, setSavingGoal] = useState('')
    const [savingDate, setSavingDate] = useState('')
    const [savingError, setSavingError] = useState(0)

    useEffect(() => {
        setSavingName(document.getElementById('savingName').value)
        setSavingWalletId(document.getElementById('savingWalletId').value)
        setSavingGoal(document.getElementById('savingGoal').value)
        setSavingDate(document.getElementById('savingDate').value.replace('T', ' '))
    }, [])

    const handleClick = () => {
        if (savingName == "" || savingGoal == 0 || savingWalletId == undefined || savingDate == '') {
            setSavingError(1)
            return
        } else
            setSavingError(0)
        axios({
            url: 'http://localhost:8080/api/newSaving',
            method: 'put',
            data: {
                name: savingName,
                goal: savingGoal,
                walletId: savingWalletId,
                date: savingDate
            },
            withCredentials: true
        }).then(() => {
            setSavingOpen(false)
            router.push(router.asPath)
        }).catch(() => {

        })
    }


    return (
        <div className={styles.container} style={savingOpen ? { display: 'flex', zIndex: 100, opacity: 1 } : { display: 'none', zIndex: -100, opacity: 0 }}>
            <div className={styles.dialog}>
                <div className={styles.title}>
                    New Saving
                </div>
                <div className={styles.form}>
                    <TextField
                        fullWidth
                        error={savingError != 0 ? true : false}
                        id='savingName'
                        label="Name"
                        variant="standard"
                        color='success'
                        onChange={c => setSavingName(c.target.value)}
                    />
                    <TextField
                        fullWidth
                        id="savingWalletId"
                        error={savingError != 0 ? true : false}
                        select
                        label="Wallet"
                        color='success'
                        variant="standard"
                        sx={{ width: 'calc(60% - 20px)' }}
                        onChange={c => { setSavingWalletId(c.target.value) }}
                    >
                        {walletsData.map(wallet => (
                            <MenuItem key={wallet.id} value={wallet.walletId}>
                                {wallet.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        error={savingError != 0 ? true : false}
                        id='savingGoal'
                        label="Goal"
                        variant="standard"
                        color='success'
                        InputProps={{
                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                        }}
                        onChange={c => setSavingGoal(c.target.value)}
                        type='number'
                        sx={{ width: '40%' }}
                    />
                    <TextField
                        fullWidth
                        error={savingError != 0 ? true : false}
                        id='savingDate'
                        variant="standard"
                        color='success'
                        onChange={c => setSavingDate(c.target.value.replace('T', ' '))}
                        type='datetime-local'
                    />
                </div>
                <div className={styles.buttons}>
                    <Button onClick={() => setSavingOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleClick('saving')}>Submit</Button>
                </div>
            </div>
        </div>
    )
}