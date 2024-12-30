"use server";

import {
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateTransactionCounterparty,
  validateTransactionWalletId,
  validateTransactionMethodId,
  validateTransactionCategoryId,
} from "@app/utils/validator";
import { Pool } from "pg";

export async function createTransaction(
  walletId: number,
  income: boolean,
  methodId: number,
  date: Date,
  amount: number,
  description: string,
  categoryId: number,
  counterparty: string,
  important: boolean,
  userId: number,
  transactionTypeId: number
) {
  const isValid: boolean =
    (await validateTransactionWalletId(walletId, userId)) &&
    (await validateTransactionMethodId(methodId, walletId)) &&
    validateTransactionDate(date) &&
    validateTransactionAmount(amount) &&
    validateTransactionDescription(description) &&
    (await validateTransactionCategoryId(categoryId, income)) &&
    validateTransactionCounterparty(counterparty);

  if (isValid) {
    const client: Pool = new Pool();
    await client.query(
      `INSERT INTO public.transaction (date, amount, description, category_id, counterparty, income, important, wallet_id, method_id, transaction_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      [
        date,
        amount,
        description,
        categoryId,
        counterparty,
        income,
        important,
        walletId,
        methodId,
        transactionTypeId,
      ]
    );
    if (income)
      await client.query(
        "UPDATE public.wallet SET balance = balance + $1 WHERE id = $2",
        [amount, walletId]
      );
    else
      await client.query(
        "UPDATE public.wallet SET balance = balance - $1 WHERE id = $2",
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
    counterpartyErr: !validateTransactionCounterparty(counterparty),
  };
}
