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

import { TextFieldOutlined } from "../material/TextField";
import { Checkbox } from "../material/Checkbox";
import { FilledButton } from "../material/Button";
import { RouteSegments } from "@app/utils/routes";

export default function RegisterForm() {
  const router = useRouter();

  const [fullnameErr, setFullnameErr] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);
  const [passwordsErr, setPasswordsErr] = useState<boolean>(false);
  const [rulesErr, setRulesErr] = useState<boolean>(false);
  const [accountErr, setAccountErr] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

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
        router.push(`/${RouteSegments.Login}`);
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
    <form
      className="flex flex-col justify-center items-center gap-[40px] w-[540px] h-fit py-[70px] bg-surface rounded-2xl shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[25px] w-[360px] px-[10px] py-[20px]">
        <TextFieldOutlined
          className="w-full"
          label="twoje imię i nazwisko"
          name="fullname"
          error={fullnameErr}
          errorText="wpisane imię i nazwisko są niepoprawne"
        />
        <TextFieldOutlined
          className="w-full"
          label="twój e-mail"
          name="email"
          error={emailErr || accountErr}
          errorText="wpisany adres e-mail jest niepoprawny lub zajęty"
        />
        <TextFieldOutlined
          className="w-full"
          label="twoje hasło"
          name="password"
          type="password"
          error={passwordErr}
          errorText="wymagane: 8+ znaków, duża litera, liczba i znak"
        />
        <TextFieldOutlined
          className="w-full"
          label="powtórz hasło"
          name="passwordValid"
          type="password"
          error={passwordsErr}
          errorText="wpisane hasła nie są identyczne"
        />
      </div>
      <div className="flex justify-center items-center gap-[40px] pr-[10px]">
        <label
          className="flex justify-center items-center text-[14px] text-outline tracking-wider"
          htmlFor="rules"
        >
          <Checkbox className="m-[15px]" name="rules" id="rules" required />
          akceptuję regulamin
        </label>
        <FilledButton>zarejestuj się</FilledButton>
      </div>
    </form>
  );
}
