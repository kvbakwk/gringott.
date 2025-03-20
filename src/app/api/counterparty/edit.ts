"use server";

import { validateTransactionCounterparty } from "@app/utils/validator";
import { Pool } from "pg";

export async function editCounterparty(counterpartyId: number, name: string, userId: number) {
  const isValid: boolean = validateTransactionCounterparty(name);

  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      `UPDATE public.counterparty SET name = $1 WHERE id = $2;`,
      [name, counterpartyId]
    );
    await client.end();
  }

  return {
    createCounterparty: isValid,
    nameErr: !validateTransactionCounterparty(name),
  };
}
