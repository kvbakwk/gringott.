"use client";

import { useRouter } from "next/navigation";

import { logout } from "@app/api/auth/login";

export default function Logout() {
  const router = useRouter();
  return (
    <input
      onClick={() => {
        logout().finally(() => router.refresh());
      }}
      type="button"
      value="wyloguj się"
    />
  );
}
