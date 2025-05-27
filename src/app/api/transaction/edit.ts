"use server";

import {
  decreaseWalletBalance,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import {
  editTransaction,
  getTransactionAmount,
} from "@app/utils/db-actions/transaction";
import {
  validateTransactionDate,
  validateTransactionAmount,
  validateTransactionDescription,
  validateTransactionSubjectId,
  validateTransactionWalletId,
  validateTransactionMethodId,
  validateTransactionCategoryId,
} from "@app/utils/validator";

export async function editTransactionAPI(
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
  const walletIdErr = !(await validateTransactionWalletId(walletId, userId));
  const methodIdErr = !(await validateTransactionMethodId(methodId, walletId));
  console.log(methodId, walletId, methodIdErr)
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
    const oldAmount = await getTransactionAmount(transactionId);
    await editTransaction(
      date,
      amount,
      description,
      categoryId,
      subjectId,
      important,
      methodId,
      transactionTypeId,
      transactionId
    );
    if (income) increaseWalletBalance(walletId, amount - oldAmount);
    else decreaseWalletBalance(walletId, amount - oldAmount);
  }

  return {
    createTransaction: isValid,
    walletIdErr: walletIdErr,
    methodIdErr: methodIdErr,
    dateErr: dateErr,
    amountErr: amountErr,
    descriptionErr: descriptionErr,
    categoryIdErr: categoryIdErr,
    subjectErr: subjectIdErr,
  };
}
