import { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SavingsIcon from '@mui/icons-material/Savings';
import DeleteIcon from '@mui/icons-material/Delete';

import LayoutTopbar from './LayoutTopbar';
import LayoutLeftbar from './LayoutLeftbar';
import LayoutWallet from './LayoutWallet';

import styles from '../../styles/layout.module.css';
import LayoutTransaction from './LayoutTransaction';
import LayoutSaving from './LayoutSaving';
import LayoutToSaving from './LayoutToSaving';
import LayoutFromSaving from './LayoutFromSaving';
import LayoutDelete from './LayoutDelete';

export default function Layout(
    { children,
        userData,
        walletsData,
        site, setSite,
        walletOpen, setWalletOpen,
        transactionOpen, setTransactionOpen,
        savingOpen, setSavingOpen,
        toSavingOpen, setToSavingOpen,
        fromSavingOpen, setFromSavingOpen,
        deleteOpen, setDeleteOpen }
) {

    const actions = [
        { icon: <DeleteIcon />, name: 'Delete something' },
        { icon: <SavingsIcon />, name: 'New Saving' },
        { icon: <ReceiptLongIcon />, name: 'New Transaction' },
        { icon: <WalletIcon />, name: 'New Wallet' },
    ];

    const closeAll = () => {
        walletOpen ? setWalletOpen(false) : null
        transactionOpen ? setTransactionOpen(false) : null
        savingOpen ? setSavingOpen(false) : null
        toSavingOpen ? setToSavingOpen(false) : null
        fromSavingOpen ? setFromSavingOpen(false) : null
        deleteOpen ? setDeleteOpen(false) : null
    }

    const handleClick = variant => {
        switch (variant) {
            case 0:
                closeAll()
                setDeleteOpen(true)
                break
            case 1:
                closeAll()
                setSavingOpen(true)
                break
            case 2:
                closeAll()
                setTransactionOpen(true)
                break
            case 3:
                closeAll()
                setWalletOpen(true)
                break
        }
    }

    return (
        <div className={styles.container}>
            <LayoutTopbar
                userData={userData}
                site={site}
                setSite={setSite}
            />
            <LayoutLeftbar
                walletsData={walletsData}
                setSite={setSite}
                setWalletOpen={setWalletOpen}
            />
            <LayoutWallet
                userData={userData}
                walletOpen={walletOpen}
                setWalletOpen={setWalletOpen}
            />
            <LayoutTransaction
                userData={userData}
                walletsData={walletsData}
                transactionOpen={transactionOpen}
                setTransactionOpen={setTransactionOpen}
            />
            <LayoutSaving
                savingOpen={savingOpen}
                setSavingOpen={setSavingOpen}
                walletsData={walletsData}
            />
            <LayoutToSaving
                toSavingOpen={toSavingOpen}
                setToSavingOpen={setToSavingOpen}
                walletsData={walletsData}
            />
            <LayoutFromSaving
                fromSavingOpen={fromSavingOpen}
                setFromSavingOpen={setFromSavingOpen}
                walletsData={walletsData}
            />
            <LayoutDelete
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
                walletsData={walletsData}
            />
            <SpeedDial
                className={styles.fab}
                ariaLabel="Basic Actions"
                sx={{ position: 'absolute', bottom: 30, right: 30 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action, index) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </SpeedDial>
            <div className={styles.main}>
                {children}
            </div>
        </div >
    );
}