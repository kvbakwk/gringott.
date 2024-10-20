"use client"

import { useRouter } from "next/navigation";

import { logout } from "@app/api/auth/login";

export default async function Logout() {
    const router = useRouter();
    return <input onClick={async () => {await logout(); router.refresh()}} type="button" value="wyloguj się" />
}