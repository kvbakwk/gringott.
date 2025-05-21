"use server";

import { validateSubjectAddress, validateSubjectAtm, validateSubjectName, validateSubjectNormal } from "@app/utils/validator";
import { Pool } from "pg";

export async function editSubject(subjectId: number, name: string, userId: number, address: string, normal: boolean, atm: boolean) {
  const isValid: boolean = validateSubjectName(name);

  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      `UPDATE public.subject SET name = $1, address = $3, normal = $4, atm = $5 WHERE id = $2;`,
      [name, subjectId, address, normal, atm]
    );
    await client.end();
  }

  return {
    editSubject: isValid,
    nameErr: !validateSubjectName(name),
    addressErr: !validateSubjectAddress(address),
    normalErr: !validateSubjectNormal(normal),
    atmErr: !validateSubjectAtm(atm),
  };
}
