import Head from 'next/head';
import axios from 'axios';
import { Alert, Snackbar, TextField, Button } from '@mui/material';

import styles from '../styles/login.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login({ show, fail, handleFail, handleClose, failMessage, setShow }) {

    const router = useRouter();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        setUsername(document.getElementById("username").value)
        setPassword(document.getElementById("password").value)
    }, [])

    const handleClick = (click) => {
        switch (click) {
            case 0:
                setShow(false)
                setTimeout(() => {
                    router.push('/register')
                }, 500)
                break;
            case 1:
                axios({
                    url: 'http://localhost:8080/login',
                    method: "post",
                    params: {
                        username: username,
                        password: password
                    },
                    withCredentials: true
                }).then(res => {
                    switch (res.data) {
                        case 1:
                            setShow(false)
                            setTimeout(() => {
                                router.push('/home')
                            }, 500)
                            break;
                        default:
                            handleFail(res.data)
                            break;
                    }
                }).catch(err => {
                    handleFail(99)
                })
                break;
        }
    }

    return (
        <div className={styles.container} style={show ? { opacity: 1 } : { opacity: 0 }}>
            <Head>
                <title>Gringott | Login</title>
            </Head>
            <div className={styles.title}>
                <span className={styles.name}>Gringott</span>
                <span className={styles.description}>Very useful monetary aplication.</span>
            </div>
            <div className={styles.login}>
                <div className={styles.header}>Login</div>
                <div className={styles.form}>
                    <TextField
                        color='success'
                        fullWidth
                        id="username"
                        name='username'
                        variant='standard'
                        label='Username'
                        onChange={e => setUsername(e.target.value)}
                    />
                    <TextField
                        color='success'
                        fullWidth
                        id="password"
                        name='password'
                        variant='standard'
                        label='Password'
                        onChange={e => setPassword(e.target.value)}
                        type='password'
                    />
                    <div className={styles.buttons}>
                        <Button
                            variant='text'
                            className={styles.signup}
                            onClick={() => handleClick(0)}
                            disableElevation
                        >
                            Sign Up
                        </Button>
                        <Button
                            variant='contained'
                            className={styles.signin}
                            onClick={() => handleClick(1)}
                            disableElevation
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
            <Snackbar open={fail != 0} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {failMessage}
                </Alert>
            </Snackbar>
        </div >
    )
}