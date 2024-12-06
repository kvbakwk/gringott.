"use client";

import { useRouter } from "next/navigation";

import { logout } from "@app/api/auth/login";
import { TextButton } from "./Button";

export default function Logout() {
  const router = useRouter();
  return (
    <TextButton
      onClick={() => {
        logout().finally(() => router.refresh());
      }}
      type="button"
      value="wyloguj się"
    >wyloguj się</TextButton>
  );
}
