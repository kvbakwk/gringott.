import { useState } from 'react';
import Head from 'next/head';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AbcIcon from '@mui/icons-material/Abc';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

import styles from '../../styles/wallet.module.css'
import WalletSaving from './WalletSaving';
import WalletTransaction from './WalletTransaction';
import WalletGraph from './WalletGraph';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';


export default function Wallet({ walletsData, slug, setToSavingOpen, setFromSavingOpen }) {

    const [sortT, setSortT] = useState(0)
    const [sortS, setSortS] = useState(0)

    const handleChangeT = (event, newAlignment) => {
        if (newAlignment != null) {
            setSortT(newAlignment);
        }
    }
    const handleChangeS = (event, newAlignment) => {
        if (newAlignment != null) {
            setSortS(newAlignment);
        }
    }

    const sort = (type, array) => {
        if (type == 'transactions')
            switch (sortT) {
                case 0:
                    return array.sort((a, b) => new Date(b.date) - new Date(a.date))
                case 1:
                    return array.sort((a, b) => new Date(a.date) - new Date(b.date))
                case 2:
                    return array.sort((a, b) => a.amount - b.amount)
                case 3:
                    return array.sort((a, b) => b.amount - a.amount)
                case 4:
                    return array.sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1)
            }
        if (type == 'savings')
            switch (sortS) {
                case 0:
                    return array.sort((a, b) => new Date(b.date) - new Date(a.date))
                case 1:
                    return array.sort((a, b) => new Date(a.date) - new Date(b.date))
                case 2:
                    return array.sort((a, b) => (a.goal - a.amount) - (b.goal - b.amount))
                case 3:
                    return array.sort((a, b) => (b.goal - b.amount) - (a.goal - a.amount))
                case 4:
                    return array.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
            }
    }

    const toDate = data => {
        const date = new Date(data)
        const day = date.getDay() > 9 ? date.getDay() : '0' + date.getDay()
        const month = date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()
        const year = date.getFullYear()
        const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
        const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
        const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()

        return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}r.`
    }

    return (
        <>
            <Head>
                <title>Gringott | Wallet {slug}</title>
            </Head>
            {(walletsData.filter(wallet => wallet.name == slug)).length != 0 ? (
                <div>
                    {walletsData.filter(wallet => wallet.name == slug).map(wallet => (
                        <div className={styles.wallet} key={wallet.walletId}>
                            <div className={styles.header}>
                                <div className={styles.name}>
                                    {wallet.name}
                                </div>
                                <div className={styles.balance}>
                                    {wallet.balance} zł
                                </div>
                                <div className={styles.incomes}>
                                    <div className={styles.title}>
                                        Incomes
                                        <TrendingUpIcon
                                            sx={{ color: '#3ec539' }}
                                        />
                                    </div>
                                    <div className={styles.value}>
                                        {wallet.incomes} zł
                                    </div>
                                </div>
                                <div className={styles.expenses}>
                                    <div className={styles.title}>
                                        Expenses
                                        <TrendingDownIcon
                                            sx={{ color: '#c53939' }}
                                        />
                                    </div>
                                    <div className={styles.value}>
                                        {wallet.expenses} zł
                                    </div>
                                </div>
                                <div className={styles.statistics}>
                                    <WalletGraph
                                        wallet={wallet}
                                        slug={slug}
                                    />
                                </div>
                            </div>
                            <div className={styles.transactions}>
                                <div className={styles.title}>
                                    Transactions
                                    <ToggleButtonGroup
                                        size="small"
                                        value={sortT}
                                        onChange={handleChangeT}
                                        exclusive={true}
                                        aria-label="Transactions Sort"
                                        color='warning'
                                    >
                                        <ToggleButton value={0} key="center">
                                            <CalendarMonthIcon />
                                        </ToggleButton>
                                        <ToggleButton value={1} key="right">
                                            <EventRepeatIcon />
                                        </ToggleButton>
                                        <ToggleButton value={2} key="justify">
                                            <KeyboardDoubleArrowUpIcon />
                                        </ToggleButton>
                                        <ToggleButton value={3} key="justify">
                                            <KeyboardDoubleArrowDownIcon />
                                        </ToggleButton>
                                        <ToggleButton value={4} key="left">
                                            <AbcIcon />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                {sort('transactions', wallet.transactions).map(transaction => (
                                    <WalletTransaction
                                        transaction={transaction}
                                        toDate={toDate}
                                        key={transaction.transactionId}
                                    />
                                ))}
                            </div>
                            <div className={styles.savings}>
                                <div className={styles.title}>
                                    Savings
                                    <ToggleButtonGroup
                                        size="small"
                                        value={sortS}
                                        onChange={handleChangeS}
                                        exclusive={true}
                                        aria-label="Savings Sort"
                                        color='warning'
                                    >
                                        <ToggleButton value={0} key="center">
                                            <CalendarMonthIcon />
                                        </ToggleButton>
                                        <ToggleButton value={1} key="right">
                                            <EventRepeatIcon />
                                        </ToggleButton>
                                        <ToggleButton value={2} key="justify">
                                            <KeyboardDoubleArrowUpIcon />
                                        </ToggleButton>
                                        <ToggleButton value={3} key="justify">
                                            <KeyboardDoubleArrowDownIcon />
                                        </ToggleButton>
                                        <ToggleButton value={4} key="left">
                                            <AbcIcon />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                                {sort('savings', wallet.savings).map(saving => (
                                    <WalletSaving
                                        saving={saving}
                                        key={saving.savingId}
                                        setToSavingOpen={setToSavingOpen}
                                        setFromSavingOpen={setFromSavingOpen}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.notfound}>The wallet named <span>{slug}</span> was not found for you.</div>
            )}
        </>
    )
}