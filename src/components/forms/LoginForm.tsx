"use client";

import { useActionState } from "react";

import { login } from "@services/auth/login";

import { TextFieldOutlined } from "@components/material/TextField";
import { FilledButton } from "@components/material/Button";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.currentTarget.closest("form")?.requestSubmit();
    }
  };

  return (
    <form
      className="flex flex-col w-full max-w-[540px] h-fit px-24 py-20 bg-surface rounded-[32px] shadow-lg border border-black/5 transition-shadow hover:shadow-xl"
      action={action}
    >
      <div className="flex flex-col gap-6 w-full">
        <TextFieldOutlined
          className="w-full"
          label="twój e-mail"
          name="email"
          defaultValue={state?.values?.email}
          onKeyDown={handleKeyDown}
          error={state?.errors?.email ? true : false}
          errorText={state?.errors?.email ? state.errors.email[0] : ""}
        />

        <TextFieldOutlined
          className="w-full"
          label="twoje hasło"
          name="password"
          type="password"
          onKeyDown={handleKeyDown}
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
      <div className="flex justify-end items-center w-full mt-8">
        <FilledButton type="submit" disabled={pending}>
          zaloguj się
        </FilledButton>
      </div>
    </form>
  );
}
