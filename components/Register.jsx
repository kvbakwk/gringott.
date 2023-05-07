import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Snackbar, TextField, Button } from '@mui/material';

import styles from '../styles/register.module.css'

export default function Register({ show, fail, failMessage, handleFail, handleClose, setShow }) {

    const router = useRouter();
    const [username, setUsername] = useState("")
    const [fullname, setFullname] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [pin, setPin] = useState("")

    useEffect(() => {
        setUsername(document.getElementById("username").value)
        setFullname(document.getElementById("fullname").value)
        setPassword(document.getElementById("password").value)
        setPassword2(document.getElementById("password2").value)
        setPin(document.getElementById("pin").value)
    }, [])

    const handleClick = (click) => {
        switch (click) {
            case 0:
                setShow(false)
                setTimeout(() => {
                    router.push('/login')
                }, 500)
                break;
            case 1:
                axios({
                    url: 'http://localhost:8080/register',
                    method: "post",
                    params: {
                        username: username,
                        fullname: fullname,
                        password: password,
                        password2: password2,
                        pin: pin
                    },
                    withCredentials: true
                }).then(res => {
                    switch (res.data) {
                        case 0:
                            setShow(false)
                            setTimeout(() => {
                                router.push('/login')
                            }, 500)
                            break
                        default:
                            handleFail(res.data)
                            break
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
                <title>Gringott | Registration</title>
            </Head>
            <div className={styles.title}>
                <span className={styles.name}>Gringott</span>
                <span className={styles.description}>Very useful monetary aplication.</span>
            </div>
            <div className={styles.register}>
                <div className={styles.header}>Registration</div>
                <div className={styles.form}>
                    <TextField
                        fullWidth
                        color='success'
                        id="username"
                        name='username'
                        variant='standard'
                        label='Username'
                        onChange={e => setUsername(e.target.value)}
                        sx={{ width: 'calc(60% - 20px)' }}
                    />
                    <TextField
                        fullWidth
                        color='success'
                        id="pin"
                        name='pin'
                        variant='standard'
                        label='PIN (0000)'
                        onChange={e => setPin(e.target.value)}
                        sx={{ width: '40%' }}
                    />
                    <TextField
                        fullWidth
                        color='success'
                        id="fullname"
                        name='fullname'
                        variant='standard'
                        label='Your name (John Smith)'
                        onChange={e => setFullname(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        color='success'
                        id="password"
                        name='password'
                        variant='standard'
                        label='Password'
                        onChange={e => setPassword(e.target.value)}
                        type='password'
                    />
                    <TextField
                        fullWidth
                        color='success'
                        id="password2"
                        name='password2'
                        variant='standard'
                        label='Password confirm'
                        onChange={e => setPassword2(e.target.value)}
                        type='password'
                    />
                    <div className={styles.buttons}>
                        <Button
                            className={styles.signin}
                            onClick={() => handleClick(0)}
                        >
                            Sign In
                        </Button>
                        <Button
                            className={styles.signup}
                            onClick={() => handleClick(1)}
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
        </div>
    )
}