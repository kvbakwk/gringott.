"use server";

import {
  decreaseWalletBalance,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import { deleteTransaction } from "@app/utils/db-actions/transaction";

export async function deleteTransactionAPI(
  transactionId: number,
  walletId: number,
  amount: number,
  income: boolean,
  userId: number
) {
  deleteTransaction(transactionId);
  if (income) decreaseWalletBalance(walletId, amount);
  else increaseWalletBalance(walletId, amount);

  return {
    createTransaction: true,
  };
}
