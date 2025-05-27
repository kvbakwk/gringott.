"use server";

import { createTrade } from "@app/utils/db-actions/trade";
import { decreaseWalletBalance, getWalletsByUserId, increaseWalletBalance } from "@app/utils/db-actions/wallet";
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
  const isValid: boolean =
    validateTradeAtm(atm) &&
    (await validateTradeWalletId(walletId, userId)) &&
    validateTradeDeposit(deposit) &&
    (atm || (await validateTradeUserMethodId(userMethodId, deposit))) &&
    validateTradeDate(date) &&
    validateTradeAmount(amount) &&
    (await validateTradeSubjectId(subjectId, userId)) &&
    (atm || (await validateTradeSubjectMethodId(subjectMethodId, deposit)));

  const cashWalletId = (await getWalletsByUserId(userId)).filter(wallet => wallet.wallet_type_id === 1).at(0).id

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
    atmErr: !validateTradeAtm(atm),
    walletIdErr: !(await validateTradeWalletId(walletId, userId)),
    depositErr: !validateTradeDeposit(deposit),
    userMethodIdErr:
      !atm && !(await validateTradeUserMethodId(userMethodId, deposit)),
    dateErr: !validateTradeDate(date),
    amountErr: !validateTradeAmount(amount),
    subjectIdErr: !(await validateTradeSubjectId(subjectId, userId)),
    subjectMethodIdErr:
      !atm && !(await validateTradeSubjectMethodId(subjectMethodId, deposit)),
  };
}
