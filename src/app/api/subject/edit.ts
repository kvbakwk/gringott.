"use server";

import { editSubject } from "@app/utils/db-actions/subject";
import {
  validateSubjectAddress,
  validateSubjectAtm,
  validateSubjectName,
  validateSubjectNormal,
} from "@app/utils/validator";

export async function editSubjectAPI(
  subjectId: number,
  name: string,
  address: string,
  normal: boolean,
  atm: boolean
) {
  const isValid: boolean =
    validateSubjectName(name) &&
    validateSubjectAddress(address) &&
    validateSubjectNormal(normal) &&
    validateSubjectAtm(atm);

  if (isValid) await editSubject(name, subjectId, address, normal, atm);

  return {
    editSubject: isValid,
    nameErr: !validateSubjectName(name),
    addressErr: !validateSubjectAddress(address),
    normalErr: !validateSubjectNormal(normal),
    atmErr: !validateSubjectAtm(atm),
  };
}
