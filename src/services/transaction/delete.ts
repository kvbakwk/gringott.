"use server";

import {
  decreaseWalletBalance,
  increaseWalletBalance,
} from "@utils/db-actions/wallet";
import { deleteTransaction } from "@utils/db-actions/transaction";
import { verifySession } from "@utils/session";

export async function deleteTransactionAPI(
  transactionId: number,
  walletId: number,
  amount: number,
  income: boolean,
  userId: number
) {
  if (!(await verifySession()).isAuth) return null;
  await deleteTransaction(transactionId);
  if (income) decreaseWalletBalance(walletId, amount);
  else increaseWalletBalance(walletId, amount);

  return {
    createTransaction: true,
  };
}
