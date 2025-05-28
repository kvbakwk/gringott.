"use server";

import {
  validateTradeAmount,
  validateTradeAtm,
  validateTradeDate,
  validateTradeDeposit,
  validateTradeSubjectId,
  validateTradeSubjectMethodId,
  validateTradeUserMethodId,
  validateTradeWalletId,
} from "@app/utils/validator";

export async function editTradeAPI(
  atm: boolean,
  walletId: number,
  deposit: boolean,
  userMethodId: number,
  date: Date,
  amount: number,
  subjectId: number,
  subjectMethodId: number,
  userId: number
): Promise<{
  editTrade: boolean;
  atmErr: boolean;
  walletIdErr: boolean;
  depositErr: boolean;
  userMethodIdErr: boolean;
  dateErr: boolean;
  amountErr: boolean;
  subjectIdErr: boolean;
  subjectMethodIdErr: boolean;
}> {
  const atmErr = !validateTradeAtm(atm);
  const walletIdErr = !(await validateTradeWalletId(walletId, userId));
  const depositErr = !validateTradeDeposit(deposit);
  const userMethodIdErr =
    !atm && !(await validateTradeUserMethodId(userMethodId, deposit));
  const dateErr = !validateTradeDate(date);
  const amountErr = !validateTradeAmount(amount);
  const subjectIdErr = !(await validateTradeSubjectId(subjectId, userId));
  const subjectMethodIdErr =
    !atm && !(await validateTradeSubjectMethodId(subjectMethodId, deposit));

  const isValid: boolean =
    !atmErr &&
    !walletIdErr &&
    !depositErr &&
    !userMethodIdErr &&
    !dateErr &&
    !amountErr &&
    !subjectIdErr &&
    !subjectMethodIdErr;

  return {
    editTrade: isValid,
    atmErr: atmErr,
    walletIdErr: walletIdErr,
    depositErr: depositErr,
    userMethodIdErr: userMethodIdErr,
    dateErr: dateErr,
    amountErr: amountErr,
    subjectIdErr: subjectIdErr,
    subjectMethodIdErr: subjectMethodIdErr,
  };
}
