import axios from 'axios';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Layout from '../../components/layout/Layout'
import Home from '../../components/home/Home'
import Wallet from '../../components/wallet/Wallet'
import NotFound from '../../components/NotFound'
import Wallets from '../../components/wallets/Wallets'
import Savings from '../../components/savings/Savings'
import Statistics from '../../components/statistics/Statistics'

import styles from '../../styles/home.module.css'


export default function Start() {

  const router = useRouter()
  const slug = router.query.slug || []

  const [walletOpen, setWalletOpen] = useState(false)
  const [transactionOpen, setTransactionOpen] = useState(false)
  const [savingOpen, setSavingOpen] = useState(false)
  const [toSavingOpen, setToSavingOpen] = useState(false)
  const [fromSavingOpen, setFromSavingOpen] = useState(false)

  const [userData, setUserData] = useState({ userId: 0, username: "", fullname: "" })
  const [walletsData, setWalletsData] = useState([])
  const [show, setShow] = useState(false)
  const [session, setSession] = useState(true)
  const [site, setSite] = useState(1)

  useEffect(() => {
    axios({
      url: 'http://localhost:8080/api/user/',
      method: "get",
      withCredentials: true
    }).then(res => {
      if (res.data == false) setSession(false)
      setUserData({
        userId: res.data.userId,
        username: res.data.username,
        fullname: res.data.fullname
      })
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      if (!session) router.push('/')
    })
  }, [slug])

  useEffect(() => {
    if (userData.userId == undefined)
      return

    axios({
      url: `http://localhost:8080/api/wallets/${userData.userId}`,
      method: "get",
      withCredentials: true
    }).then(res => {
      setWalletsData(res.data)
      setShow(true)
    }).catch(err => {
      console.error(err)
    }).finally(() => {
    })
  }, [userData])

  return (
    <div className={styles.container} style={show ? { opacity: 1 } : { opacity: 0 }}>
      <Layout
        userData={userData}
        walletsData={walletsData}
        site={site}
        setSite={setSite}
        walletOpen={walletOpen}
        setWalletOpen={setWalletOpen}
        transactionOpen={transactionOpen}
        setTransactionOpen={setTransactionOpen}
        savingOpen={savingOpen}
        setSavingOpen={setSavingOpen}
        toSavingOpen={toSavingOpen}
        setToSavingOpen={setToSavingOpen}
        fromSavingOpen={fromSavingOpen}
        setFromSavingOpen={setFromSavingOpen}
      >
        {
          slug.length == 1 && slug[0] == userData.username
          &&
          <Home />
        }{
          slug.length == 1 && slug[0] == 'wallets'
          &&
          <Wallets />
        }{
          slug.length == 2 && slug[0] == 'wallets'
          &&
          show
          &&
          <Wallet userData={userData} walletsData={walletsData} slug={slug[1]} setToSavingOpen={setToSavingOpen} setFromSavingOpen={setFromSavingOpen} />
        }{
          slug.length == 1 && slug[0] == 'savings'
          &&
          <Savings />
        }{
          slug.length == 1 && slug[0] == 'statistics'
          &&
          <Statistics />
        }{
          slug.length == 1 && slug[0] != userData.username && slug[0] != 'wallets' && slug[0] != 'savings' && slug[0] != 'statistics'
          &&
          <NotFound urls={1} slug={slug[0]} />
        }{
          slug.length == 2 && slug[0] != 'wallets'
          &&
          <NotFound urls={2} slug={slug[0]} />
        }{
          slug.length > 2
          &&
          <NotFound urls={2} slug={slug[1]} />
        }
      </Layout>
    </div >
  );
}