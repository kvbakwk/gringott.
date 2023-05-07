import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import styles from '../../styles/layout.module.css';
import { useRouter } from 'next/router';

export default function LayoutWallet({ userData, walletOpen, setWalletOpen }) {

    const router = useRouter()
    const [walletName, setWalletName] = useState('')
    const [walletError, setWalletError] = useState(0)

    useEffect(() => {
        setWalletName(document.getElementById('walletName').value)
    }, [])

    const handleClick = () => {
        if (walletName == "") {
            setWalletError(1)
            return
        } else
            setWalletError(0)
        axios({
            url: 'http://localhost:8080/api/newWallet',
            method: 'put',
            data: {
                name: walletName,
                userId: userData.userId.toString()
            },
            withCredentials: true
        }).then(() => {
            setWalletOpen(false)
            router.push(router.asPath)
        }).catch(() => {

        })
    }


    return (
        <div className={styles.container} style={walletOpen ? { display: 'flex', zIndex: 100, opacity: 1 } : { display: 'none', zIndex: -100, opacity: 0 }}>
            <div className={styles.dialog}>
                <div className={styles.title}>
                    New Wallet
                </div>
                <div className="form">
                    <TextField
                        fullWidth
                        error={walletError != 0 ? true : false}
                        id='walletName'
                        label="Name"
                        variant="standard"
                        color='success'
                        onChange={c => setWalletName(c.target.value)}
                    />
                </div>
                <div className={styles.buttons}>
                    <Button onClick={() => setWalletOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleClick()}>Submit</Button>
                </div>
            </div>
        </div>
    )
}