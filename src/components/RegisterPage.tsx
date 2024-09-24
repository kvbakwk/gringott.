'use client'

import { useState } from "react";

import { validateEmail, validateFullname, validatePassword, validatePasswords } from "@app/utils/validator";

export default function RegisterPage() {
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
      validatePasswords(formData.get("password").toString(), formData.get("passwordValid").toString()) &&
      formData.get("rules")
    ) {
      console.log('allright')
    } else {
      setFullnameErr(!validateFullname(formData.get("fullname").toString()))
      setEmailErr(!validateEmail(formData.get("email").toString()));
      setPasswordErr(!validatePassword(formData.get("password").toString()));
      setPasswordsErr(!validatePasswords(formData.get("password").toString(), formData.get("passwordValid").toString()));
      setRulesErr(!formData.get("rules"));
    }
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input type="text" name="fullname" id="fullname" placeholder="twoje imię i nazwisko" /> <br />
        {fullnameErr ? <><span>wpisz swoje poprawne imię i nazwisko</span><br /></> : <></>} 
        <input type="text" name="email" id="email" placeholder="twój e-mail" /> <br />
        {emailErr ? <><span>wpisz poprawny adres e-mail</span><br /></> : <></>} 
        <input type="password" name="password" id="password" placeholder="twoje hasło" /> <br />
        {passwordErr ? <><span>wpisz haslo spelniajace wymogi bezpieczenstwa</span><br /></> : <></>} 
        <input type="password" name="passwordValid" id="passwordValid" placeholder="powtórz hasło" /> <br />
        {passwordsErr ? <><span>wpisz haslo takie samo jak wyzej</span><br /></> : <></>} 
        <input type="checkbox" name="rules" id="rules" /> <label htmlFor="rules">regulamin</label> <br />
        {rulesErr ? <><span>przeczytaj i zaakceptuj regulamin</span><br /></> : <></>} 
        <input type="submit" value="zarejestruj się" /> <br />
        {accountErr ? <><span>konto z podanym adresem e-mailem juz istnieje</span><br /></> : <></>} 
      </form>
    </div>
  );
}
