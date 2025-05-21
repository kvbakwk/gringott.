"use server";

import { getTradesIdsBySubjectId } from "@app/utils/db-actions/trade";
import { getTransactionsIdsBySubjectId } from "@app/utils/db-actions/transaction";
import { Pool } from "pg";

export async function deleteSubject(
  subjectId: number,
  userId: number
): Promise<{ success: boolean; transactionErr: boolean; tradeErr: boolean }> {
  const client: Pool = new Pool();

  const transactionErr =
    (await getTransactionsIdsBySubjectId(subjectId)).length !== 0;
  const tradeErr = (await getTradesIdsBySubjectId(subjectId)).length !== 0;
  const isValid = !transactionErr && !tradeErr;

  if (isValid) {
    await client.query(
      `DELETE FROM public.subject WHERE id = $1 AND user_id = $2;`,
      [subjectId, userId]
    );
  }
  await client.end();

  return {
    success: isValid,
    transactionErr: transactionErr,
    tradeErr: tradeErr,
  };
}
