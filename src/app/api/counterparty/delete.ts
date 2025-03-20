"use server";

import { Pool } from "pg";

export async function deleteCounterparty(
  counterpartyId: number,
  userId: number
) {
  const client: Pool = new Pool();
  await client.query(`DELETE FROM public.counterparty WHERE id = $1;`, [
    counterpartyId,
  ]);
  await client.end();

  return {
    createTransaction: true,
  };
}
