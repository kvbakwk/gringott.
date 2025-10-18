"use server";

import {
  decreaseWalletBalance,
  getWalletsByUserId,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import { createTrade } from "@app/utils/db-actions/trade";
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
import { verifySession } from "@app/utils/session";

export async function createTradeAPI(
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
  if (!(await verifySession()).isAuth) return null;
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

  const cashWalletId = (await getWalletsByUserId(userId))
    .filter((wallet) => wallet.wallet_type_id === 1)
    .at(0).id;

  if (isValid) {
    await createTrade(
      date,
      amount,
      deposit,
      atm,
      userId,
      walletId,
      atm ? 8 : userMethodId,
      subjectId,
      atm ? 8 : subjectMethodId
    );
    increaseWalletBalance(deposit ? walletId : cashWalletId, amount);
    decreaseWalletBalance(deposit ? cashWalletId : walletId, amount);
  }

  return {
    createTrade: isValid,
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
