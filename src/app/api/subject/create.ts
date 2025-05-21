"use server";

import {
  validateSubjectAddress,
  validateSubjectAtm,
  validateSubjectName,
  validateSubjectNormal,
} from "@app/utils/validator";
import { Pool } from "pg";

export async function createSubject(
  name: string,
  userId: number,
  address: string,
  normal: boolean,
  atm: boolean
) {
  const isValid: boolean = validateSubjectName(name);

  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      `INSERT INTO public.subject (name, user_id, address, normal, atm) VALUES ($1, $2, $3, $4, $5);`,
      [name, userId, address, normal, atm]
    );
    await client.end();
  }

  return {
    createSubject: isValid,
    nameErr: !validateSubjectName(name),
    addressErr: !validateSubjectAddress(address),
    normalErr: !validateSubjectNormal(normal),
    atmErr: !validateSubjectAtm(atm),
  };
}
