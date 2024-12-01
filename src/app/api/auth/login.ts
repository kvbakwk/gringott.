"use server";

import { cookies } from "next/headers";

import { v4 as uuid } from "uuid";

import { validateEmail, validatePassword } from "@app/utils/validator";
import { validateUser } from "@app/utils/db-actions/user";
import {
  createUserDevice,
  deleteUserDeviceByDeviceId,
  getUserDeviceByDeviceId,
} from "@app/utils/db-actions/user_device";

interface LoginResponseT {
  login: boolean;
  emailErr: boolean;
  passwordErr: boolean;
  accountErr: boolean;
}

export async function login(
  email: string,
  password: string,
  remember: boolean
): Promise<LoginResponseT> {
  const userId = await validateUser(email, password);

  const isValid: boolean =
    validateEmail(email) &&
    validatePassword(password) &&
    (userId !== 0 ? true : false);

  if (isValid) {
    if (!(await cookies()).has("device_id"))
      (await cookies()).set("device_id", uuid(), { secure: true, path: "/" });

    const expireDate: Date = new Date();
    remember
      ? expireDate.setMonth(expireDate.getMonth() + 3)
      : expireDate.setHours(expireDate.getHours() + 6);

    await createUserDevice(
      userId,
      (await cookies()).get("device_id").value,
      expireDate
    );
  }

  return {
    login: isValid,
    emailErr: !validateEmail(email),
    passwordErr: !validatePassword(password),
    accountErr:
      validateEmail(email) &&
      validatePassword(password) &&
      !(userId !== 0 ? true : false),
  };
}

export async function loginCheck(): Promise<boolean> {
  if ((await cookies()).has("device_id")) {
    const userDevicesDates = await getUserDeviceByDeviceId(
      (await cookies()).get("device_id").value
    );
    if (userDevicesDates.length > 0) {
      if (new Date(userDevicesDates[0].expireDate) < new Date()) {
        await deleteUserDeviceByDeviceId((await cookies()).get("device_id").value);
        return false;
      }
      return true;
    }
  }
  return false;
}

export async function logout(): Promise<void> {
  if ((await cookies()).has("device_id"))
    await deleteUserDeviceByDeviceId((await cookies()).get("device_id").value);
}
