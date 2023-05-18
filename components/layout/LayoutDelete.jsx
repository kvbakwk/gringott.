
import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Autocomplete } from '@mui/material';
import styles from '../../styles/layout.module.css';
import { useRouter } from 'next/router';

export default function LayoutDelete({ deleteOpen, setDeleteOpen, walletsData }) {

    const router = useRouter()
    const [elements, setElements] = useState([]);
    const [whitch, setWhitch] = useState(undefined)
    const [id, setId] = useState(undefined)
    const [error, setError] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setWhitch(document.getElementById('whitch').value)
        setId(document.getElementById('id').value)
    }, [])
    useEffect(() => {
        let array = []

        if (whitch == 'wallet')
            walletsData.forEach(wallet => {
                array.push({ label: wallet.name, value: wallet.walletId })
            })
        else if (whitch == 'transaction')
            walletsData.forEach(wallet => {
                wallet.transactions.forEach(transaction => {
                    array.push({ label: `${transaction.title} | ${transaction.description}`, value: transaction.transactionId })
                })
            })
        else if (whitch == 'saving')
            walletsData.forEach(wallet => {
                wallet.savings.forEach(saving => {
                    array.push({ label: `${saving.name}`, value: saving.savingId })
                })
            })

        setElements(array)
        setId('')
    }, [whitch])
    useEffect(() => {
        if (error != 0)
            setError(0)
    }, [whitch, id]);

    const handleClick = () => {
        if (whitch == undefined) {
            setError(1)
            setErrorMessage('Select this.')
            return
        } else if (id == '') {
            setError(2)
            setErrorMessage('Select this.')
            return
        } else {
            setError(0)
        }
        axios({
            url: `http://localhost:8080/api/${whitch}s/delete/${id}`,
            method: 'delete',
            withCredentials: true
        }).then(data => {
            if (!data.data) {
                setError(3)
                setErrorMessage('Something went wrong :(')
            } else {
                router.push(router.asPath)
            }
        }).catch(() => {

        })
    }


    return (
        <div className={styles.container} style={deleteOpen ? { display: 'flex', zIndex: 100, opacity: 1 } : { display: 'none', zIndex: -100, opacity: 0 }}>
            <div className={styles.dialog}>
                <div className={styles.title}>
                    Delete
                </div>
                <div className={styles.form}>
                    <TextField
                        fullWidth
                        id="whitch"
                        error={error == 1 ? true : false}
                        helperText={error == 1 ? errorMessage : ' '}
                        select
                        label="I delete..."
                        color='success'
                        variant="standard"
                        sx={{ width: 'calc(40% - 20px)' }}
                        onChange={c => { setWhitch(c.target.value) }}
                    >
                        <MenuItem value='wallet'>
                            Wallet
                        </MenuItem>
                        <MenuItem value='transaction'>
                            Transaction
                        </MenuItem>
                        <MenuItem value='saving'>
                            Saving
                        </MenuItem>
                    </TextField>
                    <Autocomplete
                        autoHighlight
                        options={elements}
                        error={error == 2 && error == 3 ? true : false}
                        helperText={error == 2 && error == 3 ? errorMessage : ' '}
                        id="id"
                        sx={{ width: '60%' }}
                        onChange={(c, x) => setId(x.value)}
                        renderInput={(params) =>
                            <TextField
                                fullWidth
                                id="id"
                                error={error == 2 || error == 3 ? true : false}
                                helperText={error == 2 || error == 3 ? errorMessage : ' '}
                                label="whitch?"
                                color='success'
                                variant="standard"
                                {...params}
                            />
                        }
                    />
                </div>
                <div className={styles.buttons}>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleClick()}>Submit</Button>
                </div>
            </div>
        </div>
    )
}