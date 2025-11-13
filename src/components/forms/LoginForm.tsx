"use client";

import { useActionState } from "react";

import { login } from "@app/api/auth/login";

import { TextFieldOutlined } from "@components/material/TextField";
import { Checkbox } from "@components/material/Checkbox";
import { FilledButton } from "@components/material/Button";
import { CircularProgress } from "@components/material/CircularProgress";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form
      className="flex flex-col justify-center items-center gap-[16px] w-[500px] h-fit py-[60px] bg-surface rounded-2xl shadow-md"
      action={action}>
      <div className="flex flex-col justify-center items-center gap-[25px] w-[320px] px-[10px] py-[20px]">
        <TextFieldOutlined
          className="w-full"
          label="twój e-mail"
          name="email"
          error={state?.errors?.email ? true : false}
          errorText={state?.errors?.email ? state.errors.email[0] : ""}
        />
        <TextFieldOutlined
          className="w-full"
          label="twoje hasło"
          name="password"
          type="password"
          error={state?.errors?.password || state?.message ? true : false}
          errorText={
            state?.errors?.password
              ? state.errors.password[0]
              : state?.message
              ? state.message
              : ""
          }
        />
      </div>
      <div className="flex justify-center items-center gap-[70px] pr-[10px]">
        <label
          className="flex justify-center items-center text-[14px] text-outline tracking-wider"
          htmlFor="remember">
          <Checkbox className="m-[15px]" name="remember" id="remember" />
          zapamiętaj
        </label>
        <FilledButton className="w-[125px] h-[40px]" disabled={pending}>
          {pending ? <CircularProgress /> : "zaloguj się"}
        </FilledButton>
      </div>
    </form>
  );
}
