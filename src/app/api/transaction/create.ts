"use server";

import {
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateTransactionReceiver,
  validateTransactionWalletId,
  validateTransactionMethodId,
  validateTransactionCategoryId,
} from "@app/utils/validator";
import { Pool } from "pg";

export async function createTransaction(
  walletId: number,
  income: boolean,
  methodId: number,
  date: string,
  amount: number,
  description: string,
  categoryId: number,
  receiver: string,
  important: boolean,
  userId: number
) {
  const isValid: boolean =
    (await validateTransactionWalletId(walletId, userId)) &&
    (await validateTransactionMethodId(methodId, walletId)) &&
    validateTransactionDate(date) &&
    validateTransactionAmount(amount) &&
    validateTransactionDescription(description) &&
    (await validateTransactionCategoryId(categoryId, income)) &&
    validateTransactionReceiver(receiver);

  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      `INSERT INTO public.transaction (date, amount, description, category_id, income, important, wallet_id, method_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        date,
        amount,
        description,
        categoryId,
        income,
        important,
        walletId,
        methodId,
      ]
    );
    await client.query(
      "UPDATE public.wallet SET balance = balance + $1 WHERE id = $2",
      [amount, walletId]
    );
    await client.end();
  }

  return {
    createTransaction: isValid,
    walletIdErr: !(await validateTransactionWalletId(walletId, userId)),
    methodIdErr: !(await validateTransactionMethodId(methodId, walletId)),
    dateErr: !validateTransactionDate(date),
    amountErr: !validateTransactionAmount(amount),
    descriptionErr: !validateTransactionDescription(description),
    categoryIdErr: !(await validateTransactionCategoryId(categoryId, income)),
    receiverErr: !validateTransactionReceiver(receiver),
  };
}
