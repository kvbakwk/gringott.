"use server";

import { cookies } from "next/headers";

import { validateUser } from "@utils/db-actions/user";
import { FormState, LoginFormSchema } from "@utils/definitions";
import { createSession, deleteSession } from "@utils/session";
import { redirect } from "next/navigation";
import z from "zod";

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      values: { email: formData.get("email") as string }
    };
  }

  const { email, password } = validatedFields.data;

  const userId = await validateUser(email, password);

  if (userId === 0)
    return {
      message: "wpisany email lub hasło są niepoprawne",
      values: { email }
    };


  await createSession(userId);
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/logowanie");
}
