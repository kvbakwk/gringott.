"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  validateEmail,
  validateFullname,
  validatePassword,
  validatePasswords,
} from "@app/utils/validator";
import { register } from "@app/api/auth/register";

import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [fullnameErr, setFullnameErr] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);
  const [passwordsErr, setPasswordsErr] = useState<boolean>(false);
  const [rulesErr, setRulesErr] = useState<boolean>(false);
  const [accountErr, setAccountErr] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData): Promise<void> => {
    if (
      validateFullname(formData.get("fullname").toString()) &&
      validateEmail(formData.get("email").toString()) &&
      validatePassword(formData.get("password").toString()) &&
      validatePasswords(
        formData.get("password").toString(),
        formData.get("passwordValid").toString()
      ) &&
      formData.get("rules")
        ? true
        : false
    ) {
      const response = await register(
        formData.get("fullname").toString(),
        formData.get("email").toString(),
        formData.get("password").toString(),
        formData.get("passwordValid").toString(),
        formData.get("rules") ? true : false
      );
      if (!response.register) {
        setFullnameErr(response.fullnameErr);
        setEmailErr(response.emailErr);
        setPasswordErr(response.passwordErr);
        setPasswordsErr(response.passwordsErr);
        setRulesErr(response.rulesErr);
        setAccountErr(response.accountErr);
      } else {
        router.push("/logowanie");
      }
    } else {
      setFullnameErr(!validateFullname(formData.get("fullname").toString()));
      setEmailErr(!validateEmail(formData.get("email").toString()));
      setPasswordErr(!validatePassword(formData.get("password").toString()));
      setPasswordsErr(
        !validatePasswords(
          formData.get("password").toString(),
          formData.get("passwordValid").toString()
        )
      );
      setRulesErr(!formData.get("rules"));
    }
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input
          type="text"
          name="fullname"
          id="fullname"
          placeholder="twoje imię i nazwisko"
        />
        <br />
        {fullnameErr ? (
          <>
            <span>wpisz swoje poprawne imię i nazwisko</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input type="text" name="email" id="email" placeholder="twój e-mail" />{" "}
        <br />
        {emailErr ? (
          <>
            <span>wpisz poprawny adres e-mail</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input
          type="password"
          name="password"
          id="password"
          placeholder="twoje hasło"
        />
        <br />
        {passwordErr ? (
          <>
            <span>wpisz hasło spełniające wymogi bezpieczeństwa</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input
          type="password"
          name="passwordValid"
          id="passwordValid"
          placeholder="powtórz hasło"
        />
        <br />
        {passwordsErr ? (
          <>
            <span>wpisz hasło takie samo jak wyżej</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input type="checkbox" name="rules" id="rules" />{" "}
        <label htmlFor="rules">regulamin</label> <br />
        {rulesErr ? (
          <>
            <span>przeczytaj i zaakceptuj regulamin</span>
            <br />
          </>
        ) : (
          <></>
        )}
        <input type="submit" value="zarejestruj się" /> <br />
        {accountErr ? (
          <>
            <span>konto z podanym adresem e-mail już istnieje</span>
            <br />
          </>
        ) : (
          <></>
        )}
      </form>
      <br />
      <Link href="/logowanie">zaloguj się</Link>
    </div>
  );
}
