"use server";

import { TransactionT } from "@utils/db-actions/transaction";

import {
  getTransactionById,
  getTransactionsByUserId,
} from "@utils/db-actions/transaction";
import { verifySession } from "@utils/session";

export async function getTransaction(
  transactionId: number
): Promise<TransactionT> {
  if (!(await verifySession()).isAuth) return null;
  return await getTransactionById(transactionId);
}

export async function getTransactions(userId: number): Promise<TransactionT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getTransactionsByUserId(userId);
}
