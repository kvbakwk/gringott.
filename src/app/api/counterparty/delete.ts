"use server";

import { getTransactionsIdsByCounterpartyId } from "@app/utils/db-actions/transaction";
import { Pool } from "pg";

export async function deleteCounterparty(
  counterpartyId: number,
  userId: number
): Promise<{ success: boolean; transactionErr: boolean }> {
  const client: Pool = new Pool();

  const transactionErr =
    (await getTransactionsIdsByCounterpartyId(counterpartyId)).length !== 0;
  const isValid = !transactionErr;

  if (isValid) {
    await client.query(
      `DELETE FROM public.counterparty WHERE id = $1 AND user_id = $2;`,
      [counterpartyId, userId]
    );
  }
  await client.end();

  return {
    success: isValid,
    transactionErr: transactionErr,
  };
}
