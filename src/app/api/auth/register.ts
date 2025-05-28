"use server";

import {
  validateEmail,
  validateFullname,
  validatePassword,
  validatePasswords,
} from "@app/utils/validator";
import { createUser, getUsersIdsByEmail } from "@app/utils/db-actions/user";
import { createWallet } from "@app/utils/db-actions/wallet";

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
  const accountErr =
    !validateEmail(email) || (await getUsersIdsByEmail(email)).length > 0;
  const isValid =
    validateFullname(name) &&
    !accountErr &&
    validatePassword(password) &&
    validatePasswords(password, passwordValid) &&
    rules;

  if (isValid) {
    const user = await createUser(name, email, password);
    await createWallet(null, 0, user.id, 1);
    await createWallet(null, 0, user.id, 3);
    await createWallet(null, 0, user.id, 4);
  }

  return {
    register: isValid,
    fullnameErr: !validateFullname(name),
    emailErr: !validateEmail(email),
    passwordErr: !validatePassword(password),
    passwordsErr: !validatePasswords(password, passwordValid),
    rulesErr: !rules,
    accountErr: accountErr,
  };
}
