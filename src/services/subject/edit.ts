"use server";

import { editSubject } from "@utils/db-actions/subject";
import { verifySession } from "@utils/session";
import {
  validateSubjectAddress,
  validateSubjectAtm,
  validateSubjectName,
  validateSubjectNormal,
} from "@utils/validator";

export async function editSubjectAPI(
  subjectId: number,
  name: string,
  address: string,
  normal: boolean,
  atm: boolean
) {
  if (!(await verifySession()).isAuth) return null;
  const isValid: boolean =
    validateSubjectName(name) &&
    validateSubjectAddress(address) &&
    validateSubjectNormal(normal) &&
    validateSubjectAtm(atm);

  if (isValid) await editSubject(subjectId, name, address, normal, atm);

  return {
    editSubject: isValid,
    nameErr: !validateSubjectName(name),
    addressErr: !validateSubjectAddress(address),
    normalErr: !validateSubjectNormal(normal),
    atmErr: !validateSubjectAtm(atm),
  };
}
