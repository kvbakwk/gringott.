import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import styles from '../../styles/layout.module.css';

export default function LayoutTopbar({ userData, site, setSite }) {

    const router = useRouter()

    const handleLogout = () => {
        axios({
            url: 'http://localhost:8080/logout',
            method: 'post',
            withCredentials: true
        }).then(() => {
            router.push('/')
        })
    }

    const links = [
        { name: 'Home', href: `/home/${userData.username}`, site: 1 },
        { name: 'Wallets', href: `/home/wallets`, site: 2 },
        { name: 'Savings', href: `/home/savings`, site: 3 },
        { name: 'Statistics', href: `/home/statistics`, site: 4 },
    ]

    return (
        <div className={styles.top_bar}>
            <div className={styles.title}>
                Gringott
            </div>
            <div className={styles.menu}>
                {links.map(link => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setSite(link.site)}
                        className={styles.element}
                        id={site == link.site ? styles.active : ``}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
            <div className={styles.options}>
                <div className={styles.username}>
                    {userData.fullname}
                </div>
                <IconButton sx={{ color: '#e8b219' }} onClick={() => handleLogout()}>
                    <LogoutIcon />
                </IconButton>
            </div>
        </div>
    );
}