"use server";

import {
  decreaseWalletBalance,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import { createTransaction } from "@app/utils/db-actions/transaction";
import {
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateTransactionSubjectId,
  validateTransactionWalletId,
  validateTransactionMethodId,
  validateTransactionCategoryId,
} from "@app/utils/validator";

export async function createTransactionAPI(
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
    (await validateTransactionSubjectId(subjectId, userId));

  if (isValid) {
    await createTransaction(
      date,
      amount,
      description,
      categoryId,
      subjectId,
      income,
      important,
      userId,
      walletId,
      methodId,
      transactionTypeId
    );
    if (income) increaseWalletBalance(walletId, amount);
    else decreaseWalletBalance(walletId, amount);
  }

  return {
    createTransaction: isValid,
    walletIdErr: !(await validateTransactionWalletId(walletId, userId)),
    methodIdErr: !(await validateTransactionMethodId(methodId, walletId)),
    dateErr: !validateTransactionDate(date),
    amountErr: !validateTransactionAmount(amount),
    descriptionErr: !validateTransactionDescription(description),
    categoryIdErr: !(await validateTransactionCategoryId(categoryId, income)),
    subjectIdErr: !(await validateTransactionSubjectId(subjectId, userId)),
  };
}
