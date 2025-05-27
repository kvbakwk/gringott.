"use server";

import { getTradeById } from "@app/utils/db-actions/trade";

export async function deleteTradeAPI(
  tradeId: number,
  userId: number
) {
  const tradeIdErr = !(await getTradeById(tradeId)) || (await getTradeById(tradeId)).user_id !== userId
  const isValid = !tradeIdErr

  return {
    deleteTrade: isValid,
    tradeIdErr: tradeIdErr
  };
}
