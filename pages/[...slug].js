import axios from 'axios';
import { useEffect, useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

import { useRouter } from 'next/router';

export default function Start() {

    const router = useRouter();
    const slug = router.query.slug || []

    const [show, setShow] = useState(false)
    const [fail, setFail] = useState(false)
    const [failMessage, setFailMessage] = useState("")
    const [session, setSession] = useState(false);

    useEffect(() => {
        axios({
            url: 'http://localhost:8080/api/users/session',
            method: "get",
            withCredentials: true
        }).then(res => {
            if (res.data != false) setSession(true)
        }).catch(err => {
            handleFail(99)
        }).finally(() => {
            if (session) router.push('/home')
            else {
                setTimeout(() => {
                    setShow(true)
                }, 1000)
            }
        })
    }, [slug])

    const handleClose = (e, r) => {
        setFail(false);
    };

    const handleFail = (number) => {
        switch (number) {
            case 1:
                setFailMessage("You have unfilled fields.")
                setFail(number)
                break;
            case 2:
                setFailMessage("Username must be at least 4 characters long.")
                setFail(number)
                break;
            case 3:
                setFailMessage("Fullname must be at least 4 characters long.")
                setFail(number)
                break;
            case 4:
                setFailMessage("Password must be at least 8 characters long.")
                setFail(number)
                break;
            case 5:
                setFailMessage("The PIN must consist of 4 numbers.")
                setFail(number)
                break;
            case 6:
                setFailMessage("The PIN must consist of numbers only.")
                setFail(number)
                break;
            case 7:
                setFailMessage("The passwords provided are not identical.")
                setFail(number)
                break;
            case 8:
                setFailMessage("User with given name already exists, please choose another one.")
                setFail(number)
                break;
            case 9:
                setFailMessage("The given username or password is incorrect.")
                setFail(number)
                break;
            default:
                setFailMessage("Something went wrong, try again later.")
                setFail(number)
                break;
        }
    }

    return (
        <>
            {
                slug == "login"
                &&
                <Login
                    show={show}
                    setShow={setShow}
                    fail={fail}
                    failMessage={failMessage}
                    handleFail={handleFail}
                    handleClose={handleClose}
                />
            }
            {
                slug == "register"
                &&
                <Register
                    show={show}
                    setShow={setShow}
                    fail={fail}
                    failMessage={failMessage}
                    handleFail={handleFail}
                    handleClose={handleClose}
                />
            }
        </>
    )
}