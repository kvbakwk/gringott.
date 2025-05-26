"use server";

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
  const isValid: boolean =
    validateSubjectName(name) &&
    validateSubjectAddress(address) &&
    validateSubjectNormal(normal) &&
    validateSubjectAtm(atm);

  if (isValid) await createSubject(name, userId, address, normal, atm);

  return {
    createSubject: isValid,
    nameErr: !validateSubjectName(name),
    addressErr: !validateSubjectAddress(address),
    normalErr: !validateSubjectNormal(normal),
    atmErr: !validateSubjectAtm(atm),
  };
}
