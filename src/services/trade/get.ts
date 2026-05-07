"use server";

import { TradeT } from "@utils/db-actions/trade";

import { getTradeById, getTradesByUserId } from "@utils/db-actions/trade";
import { verifySession } from "@utils/session";

export async function getTrade(tradeId: number): Promise<TradeT> {
  if (!(await verifySession()).isAuth) return null;
  return await getTradeById(tradeId);
}

export async function getTrades(userId: number): Promise<TradeT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getTradesByUserId(userId);
}
