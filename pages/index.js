import { useEffect, useState } from 'react'
import styles from '../styles/index.module.css'
import { CircularProgress } from '@mui/material'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Index() {

    const router = useRouter()

    const [show, setShow] = useState(true)
    const [url, setUrl] = useState('/login')


    useEffect(() => {
        let session = false;
        axios({
            url: 'http://localhost:8080/api/users/session',
            method: 'get',
            withCredentials: true,
        })
            .then((res) => {
                if (res.data !== false) session = true;
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                if (session) setUrl('/home');
                setTimeout(() => setShow(false), 992);
            });
    }, []);

    useEffect(() => {
        if (show === false) {
            setTimeout(() => (router.push(url)), 1000);
        }
    }, [show]);

    return (
        <>
            <Head>
                <title>Gringott | Loading...</title>
            </Head>
            <div className={styles.progress} style={show ? { opacity: 1 } : { opacity: 0 }}>
                <CircularProgress sx={{ color: '#e8b219' }} />
            </div>
        </>
    )
}