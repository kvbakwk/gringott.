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

export async function createTrade(
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
  createTrade: boolean;
  atmErr: boolean;
  walletIdErr: boolean;
  depositErr: boolean;
  userMethodIdErr: boolean;
  dateErr: boolean;
  amountErr: boolean;
  subjectIdErr: boolean;
  subjectMethodIdErr: boolean;
}> {
  const isValid: boolean =
    validateTradeAtm(atm) &&
    (await validateTradeWalletId(walletId, userId)) &&
    validateTradeDeposit(deposit) &&
    (!atm && (await validateTradeUserMethodId(userMethodId, deposit))) &&
    validateTradeDate(date) &&
    validateTradeAmount(amount) &&
    (await validateTradeSubjectId(subjectId, userId)) &&
    (!atm && (await validateTradeSubjectMethodId(subjectMethodId, deposit)));

  return {
    createTrade: isValid,
    atmErr: !validateTradeAtm(atm),
    walletIdErr: !(await validateTradeWalletId(walletId, userId)),
    depositErr: !validateTradeDeposit(deposit),
    userMethodIdErr: !atm && !(await validateTradeUserMethodId(userMethodId, deposit)),
    dateErr: !validateTradeDate(date),
    amountErr: !validateTradeAmount(amount),
    subjectIdErr: !(await validateTradeSubjectId(subjectId, userId)),
    subjectMethodIdErr: !atm && !(await validateTradeSubjectMethodId(
      subjectMethodId,
      deposit
    )),
  };
}
