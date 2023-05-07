
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, InputAdornment, MenuItem } from '@mui/material';
import styles from '../../styles/layout.module.css';
import { useRouter } from 'next/router';

export default function LayoutFromSaving({ fromSavingOpen, setFromSavingOpen, walletsData }) {

    const router = useRouter()
    const [savingId, setSavingId] = useState('')
    const [amount, setAmount] = useState('')
    const [error, setError] = useState(0)

    useEffect(() => {
        setSavingId(document.getElementById('savingId').value)
        setAmount(document.getElementById('amount').value)
    }, [])

    const handleClick = () => {
        if (savingId == undefined || amount == 0) {
            setError(1)
            return
        } else
            setError(0)
        axios({
            url: 'http://localhost:8080/api/fromSaving',
            method: 'put',
            data: {
                savingId: savingId,
                amount: amount
            },
            withCredentials: true
        }).then(() => {
            setFromSavingOpen(false)
            router.push(router.asPath)
        }).catch(() => {

        })
    }


    return (
        <div className={styles.container} style={fromSavingOpen ? { display: 'flex', zIndex: 100, opacity: 1 } : { display: 'none', zIndex: -100, opacity: 0 }}>
            <div className={styles.dialog}>
                <div className={styles.title}>
                    From Saving
                </div>
                <div className={styles.form}>
                    <TextField
                        fullWidth
                        id="savingId"
                        error={error != 0 ? true : false}
                        select
                        label="Saving"
                        color='success'
                        variant="standard"
                        sx={{ width: 'calc(40% - 20px)' }}
                        onChange={c => { setSavingId(c.target.value) }}
                    >
                        {walletsData.map(wallet => (
                            wallet.savings.map(saving => (
                                <MenuItem key={saving.id} value={saving.savingId}>
                                    {saving.name} | {wallet.name}
                                </MenuItem>
                            ))
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        error={error != 0 ? true : false}
                        id='amount'
                        label="Amount"
                        variant="standard"
                        color='success'
                        InputProps={{
                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                        }}
                        onChange={c => setAmount(c.target.value)}
                        type='number'
                        sx={{ width: '60%' }}
                    />
                </div>
                <div className={styles.buttons}>
                    <Button onClick={() => setFromSavingOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleClick()}>Submit</Button>
                </div>
            </div>
        </div>
    )
}