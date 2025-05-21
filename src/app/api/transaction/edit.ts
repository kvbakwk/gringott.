"use server";

import {
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateTransactionSubjectId,
  validateTransactionWalletId,
  validateTransactionMethodId,
  validateTransactionCategoryId,
} from "@app/utils/validator";
import { Pool } from "pg";

export async function editTransaction(
  transactionId: number,
  walletId: number,
  income: boolean,
  methodId: number,
  date: Date,
  amount: number,
  description: string,
  categoryId: number,
  subjectId: number,
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
    validateTransactionSubjectId(subjectId);

  if (isValid) {
    const client: Pool = new Pool();
    const oldAmount = (await client.query(
      "SELECT amount FROM public.transaction WHERE id = $1",
      [transactionId]
    )).rows[0].amount;
    await client.query(
      `UPDATE public.transaction 
      SET 
        date = $1, amount = $2, description = $3, category_id = $4, 
        subject_id = $5, important = $6, method_id = $7, 
        transaction_type_id = $8 
      WHERE id = $9;`,
      [
        date,
        amount,
        description,
        categoryId,
        subjectId,
        important,
        methodId,
        transactionTypeId,
        transactionId,
      ]
    );
    if (income)
      await client.query(
        "UPDATE public.wallet SET balance = balance + $1 WHERE id = $2",
        [amount - oldAmount, walletId]
      );
    else
      await client.query(
        "UPDATE public.wallet SET balance = balance - $1 WHERE id = $2",
        [amount - oldAmount, walletId]
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
    subjectErr: !validateTransactionSubjectId(subjectId),
  };
}
