import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';


export default function Index() {

  const router = useRouter()

  const [siteData, setSiteData] = useState({ title: "Loading..." })
  const [userData, setUserData] = useState({ userId: 0, username: "", fullname: "" })
  const [session, setSession] = useState(true)

  useEffect(() => {
    axios({
      url: 'http://localhost:8080/api/users/session',
      method: "get",
      withCredentials: true
    }).then(res => {
      if (res.data == false) setSession(false)
      else
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
  }, [])

  useEffect(() => {
    router.push(`/home/${userData.username}`)
  }, [userData])

  return (
    <>
      <Head>
        <title>{siteData.title}</title>
      </Head>
    </>
  );
}