"use server";

import { verifySession } from "@app/utils/session";
import { createSubject } from "@app/utils/db-actions/subject";
import {
  validateSubjectAddress,
  validateSubjectAtm,
  validateSubjectName,
  validateSubjectNormal,
} from "@app/utils/validator";

export async function createSubjectAPI(
  name: string,
  userId: number,
  address: string,
  normal: boolean,
  atm: boolean
) {
  if (!(await verifySession()).isAuth) return null;
  const nameErr = !validateSubjectName(name);
  const addressErr = !validateSubjectAddress(name);
  const normalErr = !validateSubjectNormal(normal);
  const atmErr = !validateSubjectAtm(atm);

  const isValid: boolean = !nameErr && !addressErr && !normalErr && !atmErr;

  if (isValid) await createSubject(name, userId, address, normal, atm);

  return {
    createSubject: isValid,
    nameErr: nameErr,
    addressErr: addressErr,
    normalErr: normalErr,
    atmErr: atmErr,
  };
}
