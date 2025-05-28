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
  user_method: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
  subject_method: {
    id: number;
    name: string;
  };
}
export interface TradeIdT {
  id: number;
}

export async function getTradeById(id: number): Promise<TradeT> {
  const res: QueryResult = await pool.query(
    `${BASE_TRADE_QUERY} WHERE public.trade.id = $1;`,
    [id]
  );
  if (res.rows.length) return mapRowToTrade(res.rows[0]);
  return null;
}
export async function getTradesByWalletId(id: number): Promise<TradeT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRADE_QUERY} WHERE public.trade.wallet_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTrade);
}
export async function getTradesByUserId(id: number): Promise<TradeT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRADE_QUERY} WHERE public.trade.user_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTrade);
}
export async function getTradesIdsByWalletId(id: number): Promise<TradeIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.trade WHERE public.trade.wallet_id = $1;",
    [id]
  );
  return res.rows.map(mapRowToTradeId);
}
export async function getTradesIdsBySubjectId(id: number): Promise<TradeIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.trade WHERE public.trade.subject_id = $1;",
    [id]
  );
  return res.rows.map(mapRowToTradeId);
}
export async function getTradeAmount(id: number): Promise<number> {
  const res: QueryResult = await pool.query(
    "SELECT amount FROM public.trade WHERE id = $1;",
    [id]
  );
  return res.rows[0].amount;
}

export async function createTrade(
  date: Date,
  amount: number,
  deposit: boolean,
  atm: boolean,
  userId: number,
  walletId: number,
  userMethodId: number,
  subjectId: number,
  subjectMethodId: number
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO public.trade
      (date, amount, deposit, atm, user_id, wallet_id, user_method_id, subject_id, subject_method_id) 
     VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
    [
      date,
      amount,
      deposit,
      atm,
      userId,
      walletId,
      userMethodId,
      subjectId,
      subjectMethodId,
    ]
  );
  return res.rowCount;
}
export async function editTrade(
  date: Date,
  amount: number,
  deposit: boolean,
  atm: boolean,
  walletId: number,
  userMethodId: number,
  subjectId: number,
  subjectMethodId: number,
  tradeId: number
): Promise<number> {
  const res = await pool.query(
    `UPDATE public.trade 
    SET 
      date = $1, amount = $2, deposit = $3, atm = $4, 
      wallet_id = $5, user_method_id = $6, subject_id = $7, 
      subject_method_id = $8
    WHERE id = $9;`,
    [
      date,
      amount,
      deposit,
      atm,
      walletId,
      userMethodId,
      subjectId,
      subjectMethodId,
      tradeId,
    ]
  );
  return res.rowCount;
}
export async function deleteTrade(
  tradeId: number
): Promise<number> {
  const res = await pool.query(
    `DELETE FROM public.trade WHERE id = $1;`,
    [tradeId]
  );
  return res.rowCount;
}

const BASE_TRADE_QUERY = `
    SELECT 
      public.trade.id, date, amount, 
      public.subject.id as subject_id, 
      public.subject.name as subject_name, 
      public.trade.deposit, public.trade.atm, 
      public.trade.user_id, public.trade.wallet_id, 
      user_method.id as user_method_id, 
      user_method.name as user_method_name,
      subject_method.id as subject_method_id, 
      subject_method.name as subject_method_name 
      FROM public.trade 
      JOIN public.wallet 
        ON public.trade.wallet_id = public.wallet.id 
      JOIN public.subject 
        ON public.trade.subject_id = public.subject.id 
      JOIN public.method AS user_method 
        ON public.trade.user_method_id = user_method.id 
      JOIN public.method AS subject_method 
        ON public.trade.subject_method_id = subject_method.id
`;

function mapRowToTrade(row: any): TradeT {
  return {
    id: parseInt(row.id),
    date: new Date(row.date),
    amount: parseFloat(row.amount),
    deposit: Boolean(row.deposit),
    atm: Boolean(row.atm),
    user_id: parseInt(row.user_id),
    wallet_id: parseInt(row.wallet_id),
    user_method: {
      id: parseInt(row.user_method_id),
      name: row.user_method_name,
    },
    subject: {
      id: parseInt(row.subject_id),
      name: row.subject_name,
    },
    subject_method: {
      id: parseInt(row.subject_method_id),
      name: row.subject_method_name,
    },
  };
}
function mapRowToTradeId(row: any): TradeIdT {
  return {
    id: parseInt(row.id),
  };
}
