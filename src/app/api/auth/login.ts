"use server";

import { z } from "zod";

import { redirect } from "next/navigation";

import { validateUser } from "@app/utils/db-actions/user";
import { FormState, LoginFormSchema } from "@app/utils/definitions";
import { createSession } from "@app/utils/session";
import { RouteSegments } from "@app/utils/routes";

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email, password, remember } = validatedFields.data;

  const userId = await validateUser(email, password);

  if (userId === 0) {
    return {
      message: "wpisany email lub hasło są niepoprawne",
    };
  }

  await createSession(userId, remember);
  redirect(`/${RouteSegments.HomePage}`);
}
