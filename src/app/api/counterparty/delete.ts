"use server";

import { Pool } from "pg";

export async function deleteCounterparty(
  counterpartyId: number,
  userId: number
): Promise<{ success: boolean }> {
  const client: Pool = new Pool();
  const res = await client.query(`DELETE FROM public.counterparty WHERE id = $1 & user_id = $2;`, [
    counterpartyId, userId
  ]);
  await client.end();

  return {
    success: true,
  };
}
