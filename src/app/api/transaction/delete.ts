"use server";

import { Pool } from "pg";

export async function deleteTransaction(
  transactionId: number,
  walletId: number,
  amount: number,
  income: boolean,
  userId: number
) {
  const client: Pool = new Pool();
  await client.query(`DELETE FROM public.transaction WHERE id = $1;`, [
    transactionId,
  ]);
  if (income)
    await client.query(
      "UPDATE public.wallet SET balance = balance - $1 WHERE id = $2",
      [amount, walletId]
    );
  else
    await client.query(
      "UPDATE public.wallet SET balance = balance + $1 WHERE id = $2",
      [amount, walletId]
    );
  await client.end();

  return {
    createTransaction: true,
  };
}
