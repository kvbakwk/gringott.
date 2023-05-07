import axios from 'axios';
import { useEffect, useState } from 'react';
import { TextField, Button, InputAdornment, Switch, MenuItem } from '@mui/material';
import styles from '../../styles/layout.module.css';
import { useRouter } from 'next/router';

export default function LayoutTransaction({ userData, walletsData, transactionOpen, setTransactionOpen }) {

    const router = useRouter()
    const [transactionTitle, setTransactionTitle] = useState('')
    const [transactionDescription, setTransactionDescription] = useState('')
    const [transactionWalletId, setTransactionWalletId] = useState('')
    const [transactionAmount, setTransactionAmount] = useState('')
    const [transactionDeposit, setTransactionDeposit] = useState('')
    const [transactionError, setTransactionError] = useState(0)

    useEffect(() => {
        setTransactionTitle(document.getElementById('transactionTitle').value)
        setTransactionDescription(document.getElementById('transactionDescription').value)
        setTransactionAmount(document.getElementById('transactionAmount').value)
        setTransactionDeposit(!document.getElementById('transactionDeposit').checked)
    }, [])

    const handleClick = () => {
        if (transactionTitle == "" || transactionAmount == 0 || transactionWalletId == undefined) {
            setTransactionError(1)
            return
        } else
            setTransactionError(0)
        axios({
            url: 'http://localhost:8080/api/newTransaction',
            method: 'put',
            data: {
                title: transactionTitle,
                description: transactionDescription,
                amount: transactionAmount,
                walletId: transactionWalletId,
                userId: userData.userId.toString(),
                deposit: transactionDeposit
            },
            withCredentials: true
        }).then(() => {
            setTransactionOpen(false)
            router.push(router.asPath)
        }).catch(() => {

        })
    }


    return (
        <div className={styles.container} style={transactionOpen ? { display: 'flex', zIndex: 100, opacity: 1 } : { display: 'none', zIndex: -100, opacity: 0 }}>
            <div className={styles.dialog}>
                <div className={styles.title}>
                    New Transaction
                </div>
                <div className={styles.form}>
                    <TextField
                        fullWidth
                        error={transactionError != 0 ? true : false}
                        id='transactionTitle'
                        label="Title"
                        variant="standard"
                        color='success'
                        onChange={c => setTransactionTitle(c.target.value)}
                    />
                    <TextField
                        fullWidth
                        error={transactionError != 0 ? true : false}
                        id='transactionDescription'
                        label="Description"
                        variant="standard"
                        color='success'
                        onChange={c => setTransactionDescription(c.target.value)}
                    />
                    <TextField
                        fullWidth
                        id="transactionWalletId"
                        error={transactionError != 0 ? true : false}
                        select
                        label="Wallet"
                        color='success'
                        variant="standard"
                        sx={{ width: 'calc(60% - 20px)' }}
                        onChange={c => { setTransactionWalletId(c.target.value) }}
                    >
                        {walletsData.map(wallet => (
                            <MenuItem key={wallet.id} value={wallet.walletId}>
                                {wallet.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        error={transactionError != 0 ? true : false}
                        id='transactionAmount'
                        label="Amount"
                        variant="standard"
                        color='success'
                        InputProps={{
                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                        }}
                        onChange={c => setTransactionAmount(c.target.value)}
                        type='number'
                        sx={{ width: '40%' }}
                    />
                    <div className="switch">
                        Deposit
                        <Switch
                            id='transactionDeposit'
                            color='success'
                            onChange={c => { setTransactionDeposit(!c.target.checked) }}
                        />
                        Withdraw
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Button onClick={() => setTransactionOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleClick('transaction')}>Submit</Button>
                </div>
            </div>
        </div>
    )
}