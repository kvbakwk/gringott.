"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@app/api/auth/login";
import { validateEmail, validatePassword } from "@app/utils/validator";

import { TextFieldOutlined } from "@components/TextField";
import { Checkbox } from "@components/Checkbox";
import { Button } from "@components/Button";

export default function LoginForm() {
  const router = useRouter();

  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);
  const [accountErr, setAccountErr] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (
      validateEmail(formData.get("email").toString()) &&
      validatePassword(formData.get("password").toString())
    ) {
      const response = await login(
        formData.get("email").toString(),
        formData.get("password").toString(),
        formData.get("remember") ? true : false
      );
      if (!response.login) {
        setEmailErr(response.emailErr);
        setPasswordErr(response.passwordErr);
        setAccountErr(response.accountErr);
      } else {
        router.push("/");
      }
    } else {
      setEmailErr(!validateEmail(formData.get("email").toString()));
      setPasswordErr(!validatePassword(formData.get("password").toString()));
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[16px] w-[500px] h-fit py-[60px] bg-surface rounded-2xl shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[20px]">
        <TextFieldOutlined
          className="w-full"
          label="twój e-mail"
          name="email"
          error={emailErr}
          errorText="wpisany adres e-mail jest niepoprawny"
        />
        <TextFieldOutlined
          className="w-full"
          label="twoje hasło"
          name="password"
          type="password"
          error={passwordErr || accountErr}
          errorText="wpisane hasło jest niepoprawne"
        />
      </div>
      <div className="flex justify-center items-center gap-[70px] pr-[10px]">
        <label
          className="flex justify-center items-center text-[16px] text-outline tracking-wider"
          htmlFor="remember"
        >
          <Checkbox className="m-[15px]" name="remember" id="remember" />
          zapamiętaj
        </label>
        <Button>zaloguj się</Button>
      </div>
    </form>
  );
}
