"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface TradeT {
  id: number;
  date: Date;
  amount: number;
  deposit: boolean;
  atm: boolean;
  user_id: number;
  wallet_id: number;
  user_method_id: number;
  user_method_name: string;
  subject_id: number;
  subject_name: string;
  subject_method_id: number;
  subject_method_name: string;
  updated_at: Date;
  deleted_at: Date | null;
}

interface TradeRow {
  id: string | number;
  date: string | Date;
  amount: string | number;
  deposit: boolean;
  atm: boolean;
  user_id: string | number;
  wallet_id: string | number;
  user_method_id: string | number;
  user_method_name: string;
  subject_id: string | number;
  subject_name: string;
  subject_method_id: string | number;
  subject_method_name: string;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

const BASE_TRADE_QUERY = `
    SELECT 
      t.id, t.date, t.amount, t.deposit, t.atm, t.user_id, t.wallet_id, t.updated_at, t.deleted_at,
      s.id as subject_id, s.name as subject_name, 
      um.id as user_method_id, um.name as user_method_name,
      sm.id as subject_method_id, sm.name as subject_method_name
    FROM public.trades t
    JOIN public.wallets w ON t.wallet_id = w.id 
    JOIN public.subjects s ON t.subject_id = s.id 
    JOIN public.methods um ON t.user_method_id = um.id 
    JOIN public.methods sm ON t.subject_method_id = sm.id
`;

export async function getTradesByUserId(userId: number, since?: Date): Promise<TradeT[]> {
  try {
    const query = since
      ? `${BASE_TRADE_QUERY} WHERE t.user_id = $1 AND t.updated_at > $2`
      : `${BASE_TRADE_QUERY} WHERE t.user_id = $1 AND t.deleted_at IS NULL;`;

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<TradeRow> = await pool.query(query, params);
    return res.rows.map(mapRowToTrade);
  } catch (error) {
    console.error(`Error in getTradesByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function createTrade(
  data: Omit<TradeT, 'id' | 'updated_at' | 'deleted_at' | 'user_method_name' | 'subject_name' | 'subject_method_name'>
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.trades
        (date, amount, deposit, atm, user_id, wallet_id, user_method_id, subject_id, subject_method_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;`,
      [
        data.date, data.amount, data.deposit, data.atm, data.user_id, 
        data.wallet_id, data.user_method_id, data.subject_id, data.subject_method_id
      ]
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createTrade:", error);
    return null;
  }
}

export async function deleteTrade(tradeId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.trades SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;`,
      [tradeId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteTrade ${tradeId}:`, error);
    return false;
  }
}

function mapRowToTrade(row: TradeRow): TradeT {
  return {
    id: Number(row.id),
    date: new Date(row.date),
    amount: Number(row.amount),
    deposit: Boolean(row.deposit),
    atm: Boolean(row.atm),
    user_id: Number(row.user_id),
    wallet_id: Number(row.wallet_id),
    user_method_id: Number(row.user_method_id),
    user_method_name: row.user_method_name,
    subject_id: Number(row.subject_id),
    subject_name: row.subject_name,
    subject_method_id: Number(row.subject_method_id),
    subject_method_name: row.subject_method_name,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
