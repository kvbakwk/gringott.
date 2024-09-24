"use server";

import { Pool, QueryResult } from "pg";

import { v4 as uuid } from "uuid";
import { cookies } from "next/headers";

import {
  validateEmail,
  validateFullname,
  validatePassword,
  validatePasswords,
} from "@app/utils/validator";

interface loginAPIResponse {
  login: boolean;
  emailErr: boolean;
  passwordErr: boolean;
  accountErr: boolean;
}

export default async function loginAPI(
  email: string,
  password: string,
  remember: boolean
): Promise<loginAPIResponse> {
  const validateAccount = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      "SELECT id FROM public.user WHERE email = $1 AND password = $2;",
      [email, password]
    );
    await client.end();
    return res.rowCount === 1;
  };

  const isValid: boolean =
    validateEmail(email) &&
    validatePassword(password) &&
    (await validateAccount(email, password));

  if (isValid) {
    const client: Pool = new Pool();
    if (!cookies().has("device_id"))
      cookies().set("device_id", uuid(), { secure: true, path: "/" });

    const res: QueryResult = await client.query(
      "SELECT id FROM public.user WHERE email = $1 AND password = $2;",
      [email, password]
    );

    const expireDate: Date = new Date();
    remember
      ? expireDate.setMonth(expireDate.getMonth() + 3)
      : expireDate.setHours(expireDate.getHours() + 6);

    await client.query("INSERT INTO public.user_device VALUES ($1, $2, $3);", [
      res.rows[0].id,
      cookies().get("device_id").value,
      expireDate,
    ]);
    await client.end();
  }

  return {
    login: isValid,
    emailErr: !validateEmail(email),
    passwordErr: !validatePassword(password),
    accountErr:
      validateEmail(email) &&
      validatePassword(password) &&
      !(await validateAccount(email, password)),
  };
}

export async function loginCheck(): Promise<boolean> {
  const client: Pool = new Pool();
  if (cookies().has("device_id")) {
    const res: QueryResult = await client.query(
      "SELECT user_id, expire_date FROM public.user_device WHERE device_id = $1;",
      [cookies().get("device_id").value]
    );
    if (res.rowCount > 0) {
      if (new Date(res.rows[0].expire_date) < new Date()) {
        await client.query(
          "DELETE FROM public.user_device WHERE device_id = $1;",
          [cookies().get("device_id").value]
        );
        await client.end();
        return false;
      } else await client.end();
      return true;
    }
    return false;
  }
  return false;
}

export async function logout(): Promise<void> {
  const client: Pool = new Pool();
  if (cookies().has("device_id")) {
    await client.query("DELETE FROM user_device WHERE device_id = $1;", [
      cookies().get("device_id").value,
    ]);
  }
  await client.end();
}

interface registerAPIResponse {
  register: boolean;
  fullnameErr: boolean;
  emailErr: boolean;
  passwordErr: boolean;
  passwordsErr: boolean;
  rulesErr: boolean;
  accountErr: boolean;
}

export async function registerAPI(
  fullname: string,
  email: string,
  password: string,
  passwordValid: string,
  rules: boolean
): Promise<registerAPIResponse> {
  const validateAccount = async (email: string): Promise<boolean> => {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      "SELECT id FROM public.user WHERE email = $1;",
      [email]
    );
    await client.end();
    return res.rowCount === 1;
  };

  const isValid =
    validateFullname(fullname) &&
    validateEmail(email) &&
    validatePassword(password) &&
    validatePasswords(password, passwordValid) &&
    rules &&
    !(await validateAccount(email));

  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      "INSERT INTO public.user (name, email, password) VALUES ($1, $2, $3);",
      [fullname, email, password]
    );
    await client.end();
  }

  return {
    register: isValid,
    fullnameErr: !validateFullname(fullname),
    emailErr: !validateEmail(email),
    passwordErr: !validatePassword(password),
    passwordsErr: !validatePasswords(password, passwordValid),
    rulesErr: !rules,
    accountErr: !validateEmail(email) || (await validateAccount(email)),
  };
}
