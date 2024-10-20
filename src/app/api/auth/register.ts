"use server";

import {
  validateEmail,
  validateFullname,
  validatePassword,
  validatePasswords,
} from "@app/utils/validator";
import { createUser, isUserByEmail } from "@app/utils/db-actions/user";

interface RegisterResponseT {
  register: boolean;
  fullnameErr: boolean;
  emailErr: boolean;
  passwordErr: boolean;
  passwordsErr: boolean;
  rulesErr: boolean;
  accountErr: boolean;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordValid: string,
  rules: boolean
): Promise<RegisterResponseT> {
  const isValid =
    validateFullname(name) &&
    validateEmail(email) &&
    validatePassword(password) &&
    validatePasswords(password, passwordValid) &&
    rules &&
    !(await isUserByEmail(email));

  if (isValid) 
    await createUser(name, email, password);

  return {
    register: isValid,
    fullnameErr: !validateFullname(name),
    emailErr: !validateEmail(email),
    passwordErr: !validatePassword(password),
    passwordsErr: !validatePasswords(password, passwordValid),
    rulesErr: !rules,
    accountErr: !validateEmail(email) || (await isUserByEmail(email)),
  };
}
