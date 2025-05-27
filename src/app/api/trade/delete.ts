"use server";

import { deleteTrade, getTradeById } from "@app/utils/db-actions/trade";
import {
  decreaseWalletBalance,
  getWalletsByUserId,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";

export async function deleteTradeAPI(tradeId: number, userId: number) {
  const trade = await getTradeById(tradeId);
  const cashWalletId = (await getWalletsByUserId(userId))
    .filter((wallet) => (wallet.wallet_type_id === 1))
    .at(0).id;

  const tradeIdErr = !trade || trade.user_id !== userId;
  const isValid = !tradeIdErr;

  if (isValid) {
    await deleteTrade(tradeId);
    increaseWalletBalance(
      trade.deposit ? cashWalletId : trade.wallet_id,
      trade.amount
    );
    decreaseWalletBalance(
      trade.deposit ? trade.wallet_id : cashWalletId,
      trade.amount
    );
  }

  return {
    deleteTrade: isValid,
    tradeIdErr: tradeIdErr,
  };
}
