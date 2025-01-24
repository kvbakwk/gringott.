"use server";

import { TransactionT } from "@app/utils/db-actions/transaction";

import { getTransactionById, getTransactionsByUserId } from "@app/utils/db-actions/transaction";

export async function getTransaction(transactionId: number): Promise<TransactionT> {
  return await getTransactionById(transactionId);
}

export async function getTransactions(userId: number): Promise<TransactionT[]> {
  return await getTransactionsByUserId(userId);
}
