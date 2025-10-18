"use server";

import {
  editTrade,
  getTradeAmount,
  getTradeById,
} from "@app/utils/db-actions/trade";
import {
  decreaseWalletBalance,
  getWalletsByUserId,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import { verifySession } from "@app/utils/session";
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
  tradeId: number,
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
  tradeIdErr: boolean;
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
  const trade = await getTradeById(tradeId);
  const cashWalletId = (await getWalletsByUserId(userId))
    .filter((wallet) => wallet.wallet_type_id === 1)
    .at(0).id;

  const tradeIdErr = !trade || trade.user_id !== userId;
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
    !tradeIdErr &&
    !atmErr &&
    !walletIdErr &&
    !depositErr &&
    !userMethodIdErr &&
    !dateErr &&
    !amountErr &&
    !subjectIdErr &&
    !subjectMethodIdErr;

  if (isValid) {
    const oldAmount = await getTradeAmount(tradeId);
    await editTrade(
      date,
      amount,
      deposit,
      atm,
      walletId,
      atm ? 8 : userMethodId,
      subjectId,
      atm ? 8 : subjectMethodId,
      tradeId
    );
    if (trade.wallet_id === walletId) {
      if (trade.deposit === deposit) {
        increaseWalletBalance(
          deposit ? walletId : cashWalletId,
          amount - oldAmount
        );
        decreaseWalletBalance(
          deposit ? cashWalletId : walletId,
          amount - oldAmount
        );
      } else {
        increaseWalletBalance(
          deposit ? walletId : cashWalletId,
          2 * amount + (amount - oldAmount)
        );
        decreaseWalletBalance(
          deposit ? cashWalletId : walletId,
          2 * amount + (amount - oldAmount)
        );
      }
    } else {
      increaseWalletBalance(
        trade.deposit ? cashWalletId : trade.wallet_id,
        oldAmount
      );
      decreaseWalletBalance(
        trade.deposit ? trade.wallet_id : cashWalletId,
        oldAmount
      );
      increaseWalletBalance(deposit ? walletId : cashWalletId, amount);
      decreaseWalletBalance(deposit ? cashWalletId : walletId, amount);
    }
  }

  return {
    editTrade: isValid,
    tradeIdErr: tradeIdErr,
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
