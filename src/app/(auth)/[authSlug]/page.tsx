"use client";

import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState<"logowanie" | "rejestracja">("logowanie");

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full h-full px-2">
      {page === "logowanie" ? <LoginForm /> : <RegisterForm />}
      <button
        className="text-base-text text-primary underline cursor-pointer"
        onClick={() =>
          setPage(page === "logowanie" ? "rejestracja" : "logowanie")
        }
      >
        {page === "logowanie"
          ? "nie masz konta? zarejestruj się"
          : "masz już konto? zaloguj się"}
      </button>
    </div>
  );
}
