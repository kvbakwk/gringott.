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
import { verifySession } from "@app/utils/session";

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
  if (!(await verifySession()).isAuth) return null;
  const walletIdErr = !(await validateTransactionWalletId(walletId, userId));
  const methodIdErr = !(await validateTransactionMethodId(methodId, walletId));
  const dateErr = !validateTransactionDate(date);
  const amountErr = !validateTransactionAmount(amount);
  const descriptionErr = !validateTransactionDescription(description);
  const categoryIdErr = !(await validateTransactionCategoryId(
    categoryId,
    income
  ));
  const subjectIdErr = !(await validateTransactionSubjectId(subjectId, userId));

  const isValid: boolean =
    !walletIdErr &&
    !methodIdErr &&
    !dateErr &&
    !amountErr &&
    !descriptionErr &&
    !categoryIdErr &&
    !subjectIdErr;

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
    walletIdErr: walletIdErr,
    methodIdErr: methodIdErr,
    dateErr: dateErr,
    amountErr: amountErr,
    descriptionErr: descriptionErr,
    categoryIdErr: categoryIdErr,
    subjectIdErr: subjectIdErr,
  };
}
