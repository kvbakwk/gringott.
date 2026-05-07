"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  validateEmail,
  validateFullname,
  validatePassword,
  validatePasswords,
} from "@utils/validator";
import { register } from "@services/auth/register";

import { TextFieldOutlined } from "../material/TextField";
import { Checkbox } from "../material/Checkbox";
import { FilledButton } from "../material/Button";
import { RouteSegments } from "@utils/routes";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.currentTarget.closest("form")?.requestSubmit();
    }
  };

  return (
    <form
      className="flex flex-col w-full max-w-[540px] h-fit px-24 py-20 bg-surface rounded-[32px] shadow-lg border border-black/5 select-none transition-shadow hover:shadow-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6 w-full">
        <TextFieldOutlined
          className="w-full"
          label="twoje imię i nazwisko"
          name="fullname"
          onKeyDown={handleKeyDown}
          error={fullnameErr}
          errorText="wpisane imię i nazwisko są niepoprawne"
        />
        <TextFieldOutlined
          className="w-full"
          label="twój e-mail"
          name="email"
          onKeyDown={handleKeyDown}
          error={emailErr || accountErr}
          errorText="wpisany adres e-mail jest niepoprawny lub zajęty"
        />
        <TextFieldOutlined
          className="w-full"
          label="twoje hasło"
          name="password"
          type="password"
          onKeyDown={handleKeyDown}
          error={passwordErr}
          errorText="wymagane: 8+ znaków, duża litera, liczba i znak"
        />
        <TextFieldOutlined
          className="w-full"
          label="powtórz hasło"
          name="passwordValid"
          type="password"
          onKeyDown={handleKeyDown}
          error={passwordsErr}
          errorText="wpisane hasła nie są identyczne"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 w-full mt-8">
        <label
          className="flex items-center gap-3 text-[14px] text-outline tracking-wider cursor-pointer group"
          htmlFor="rules"
        >
          <Checkbox className="flex-shrink-0 transition-transform group-hover:scale-105" name="rules" id="rules" required />
          <span className="leading-snug">
            akceptuję{" "}
            <Link
              href="/regulamin"
              className="underline hover:text-primary transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              regulamin
            </Link>
          </span>
        </label>
        <FilledButton type="submit">zarejestruj się</FilledButton>
        <button type="submit" className="hidden" aria-hidden="true" />
      </div>
    </form>
  );
}
