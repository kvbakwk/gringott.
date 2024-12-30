"use server";

import { TransactionT } from "@app/utils/db-actions/transaction";

import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";

export async function getTransactions(userId: number): Promise<TransactionT[]> {
  return await getTransactionsByUserId(userId);
}
