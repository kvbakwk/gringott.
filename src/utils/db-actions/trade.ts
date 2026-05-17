"use server";

import { QueryResult } from "pg";
import pool from "@/utils/db";
import { SubjectT } from "@/types/subject";
import { TradeT } from "@/types/trade";

interface TradeRow {
  id: string | number;
  date: string | Date;
  amount: string | number;
  deposit: boolean;
  user_id: string | number;
  wallet_id: string | number;
  user_method_id: string | number;
  user_method_name: string;
  subject_id: string | number;
  subject_name: string;
  subject_user_id: string | number;
  subject_address: string;
  subject_type_id: string | number;
  subject_updated_at: string | Date;
  subject_deleted_at: string | Date | null;
  subject_method_id: string | number;
  subject_method_name: string;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

const BASE_TRADE_QUERY = `
    SELECT 
      t.id, t.date, t.amount, t.deposit, t.user_id, t.wallet_id, t.updated_at, t.deleted_at,
      s.id as subject_id, s.name as subject_name, s.user_id as subject_user_id, s.address as subject_address, 
      s.subject_type_id, s.updated_at as subject_updated_at, s.deleted_at as subject_deleted_at,
      um.id as user_method_id, um.name as user_method_name,
      sm.id as subject_method_id, sm.name as subject_method_name
    FROM public.trades t
    JOIN public.wallets w ON t.wallet_id = w.id 
    JOIN public.subjects s ON t.subject_id = s.id 
    JOIN public.methods um ON t.user_method_id = um.id 
    JOIN public.methods sm ON t.subject_method_id = sm.id
`;

export async function getTradesByUserId(
  userId: number,
  since?: Date,
): Promise<TradeT[]> {
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
  data: Omit<
    TradeT,
    | "id"
    | "updated_at"
    | "deleted_at"
    | "user_method_name"
    | "subject"
    | "subject_method_name"
  >,
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.trades
        (date, amount, deposit, user_id, wallet_id, user_method_id, subject_id, subject_method_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
      [
        data.date,
        data.amount,
        data.deposit,
        data.user_id,
        data.wallet_id,
        data.user_method_id,
        data.subject_id,
        data.subject_method_id,
      ],
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createTrade:", error);
    return null;
  }
}

export async function getTradesIdsBySubjectId(
  subjectId: number,
): Promise<{ id: number }[]> {
  try {
    const res = await pool.query(
      "SELECT id FROM public.trades WHERE subject_id = $1 AND deleted_at IS NULL;",
      [subjectId],
    );
    return res.rows.map((row) => ({ id: Number(row.id) }));
  } catch (error) {
    console.error(
      `Error in getTradesIdsBySubjectId for subject ${subjectId}:`,
      error,
    );
    return [];
  }
}

export async function getTradeById(id: number): Promise<TradeT | null> {
  try {
    const res: QueryResult<TradeRow> = await pool.query(
      `${BASE_TRADE_QUERY} WHERE t.id = $1 AND t.deleted_at IS NULL LIMIT 1;`,
      [id],
    );
    return res.rows[0] ? mapRowToTrade(res.rows[0]) : null;
  } catch (error) {
    console.error(`Error in getTradeById ${id}:`, error);
    return null;
  }
}

export async function getTradeAmount(id: number): Promise<number> {
  try {
    const res = await pool.query(
      "SELECT amount FROM public.trades WHERE id = $1 AND deleted_at IS NULL LIMIT 1;",
      [id],
    );
    return res.rows[0] ? Number(res.rows[0].amount) : 0;
  } catch (error) {
    console.error(`Error in getTradeAmount ${id}:`, error);
    return 0;
  }
}

export async function editTrade(
  date: Date,
  amount: number,
  deposit: boolean,
  walletId: number,
  userMethodId: number,
  subjectId: number,
  subjectMethodId: number,
  id: number,
): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.trades SET 
        date = $1, amount = $2, deposit = $3, wallet_id = $4, 
        user_method_id = $5, subject_id = $6, subject_method_id = $7, updated_at = NOW() 
      WHERE id = $8 AND deleted_at IS NULL;`,
      [
        date,
        amount,
        deposit,
        walletId,
        userMethodId,
        subjectId,
        subjectMethodId,
        id,
      ],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in editTrade ${id}:`, error);
    return false;
  }
}

export async function deleteTrade(tradeId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.trades SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;`,
      [tradeId],
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
    user_id: Number(row.user_id),
    wallet_id: Number(row.wallet_id),
    user_method_id: Number(row.user_method_id),
    user_method_name: row.user_method_name,
    subject_id: Number(row.subject_id),
    subject: {
      id: Number(row.subject_id),
      user_id: Number(row.subject_user_id),
      name: row.subject_name,
      address: row.subject_address,
      subject_type_id: Number(row.subject_type_id),
      updated_at: new Date(row.subject_updated_at),
      deleted_at: row.subject_deleted_at
        ? new Date(row.subject_deleted_at)
        : null,
    },
    subject_method_id: Number(row.subject_method_id),
    subject_method_name: row.subject_method_name,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
