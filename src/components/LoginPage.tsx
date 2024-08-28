"use client";

import { validateEmail, validatePassword } from "@app/utils/validator";
import { useState } from "react";

export default function LoginPage() {
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);

  const handleSubmit = (formData: FormData): void => {
    setEmailErr(!validateEmail(formData.get("email").toString()));
    setPasswordErr(!validatePassword(formData.get("password").toString()));
    if (
      validateEmail(formData.get("email").toString()) &&
      validatePassword(formData.get("password").toString())
    ) {
      console.log("poprawne dane");
    }
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input type="text" name="email" id="email" />
        {
          emailErr ? <span>niepoprawny email</span> : <></>
        }
        <input type="password" name="password" id="password" />
        {
          passwordErr ? <span>niepoprawne hasło</span> : <></>
        }
        <input type="submit" value="zaloguj się" />
      </form>
    </div>
  );
}
