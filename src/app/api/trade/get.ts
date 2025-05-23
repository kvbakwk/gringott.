"use server";

import { TradeT } from "@app/utils/db-actions/trade";

import { getTradeById, getTradesByUserId } from "@app/utils/db-actions/trade";


export async function getTrade(tradeId: number): Promise<TradeT> {
  return await getTradeById(tradeId);
}

export async function getTrades(userId: number): Promise<TradeT[]> {
  return await getTradesByUserId(userId);
}
