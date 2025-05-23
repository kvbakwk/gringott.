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
  subject: {
    id: number;
    name: string;
  };
  deposit_method: {
    id: number;
    name: string;
  };
  withdraw_method: {
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
  return mapRowToTrade(res.rows[0]);
}

export async function getTradesByWalletId(
  id: number
): Promise<TradeT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRADE_QUERY} WHERE public.trade.wallet_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTrade);
}

export async function getTradesByUserId(
  id: number
): Promise<TradeT[]> {
  const res: QueryResult = await pool.query(
    `${BASE_TRADE_QUERY} WHERE public.trade.user_id = $1;`,
    [id]
  );
  return res.rows.map(mapRowToTrade);
}

export async function getTradesIdsByWalletId(
  id: number
): Promise<TradeIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.trade WHERE public.trade.wallet_id = $1;",
    [id]
  );
  return res.rows.map(mapRowToTradeId);
}

export async function getTradesIdsBySubjectId(
  id: number
): Promise<TradeIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.trade WHERE public.trade.subject_id = $1;",
    [id]
  );
  return res.rows.map(mapRowToTradeId);
}


const BASE_TRADE_QUERY = `
    SELECT 
      public.trade.id, date, amount, 
      public.subject.id as subject_id, 
      public.subject.name as subject_name, 
      public.trade.deposit, public.trade.atm, 
      public.trade.user_id, public.trade.wallet_id, 
      deposit_method.id as deposit_method_id, 
      deposit_method.name as deposit_method_name,
      withdraw_method.id as withdraw_method_id, 
      withdraw_method.name as withdraw_method_name 
      FROM public.trade 
      JOIN public.wallet 
        ON public.trade.wallet_id = public.wallet.id 
      JOIN public.subject 
        ON public.trade.subject_id = public.subject.id 
      JOIN public.method AS deposit_method 
        ON public.trade.deposit_method_id = deposit_method.id 
      JOIN public.method AS withdraw_method 
        ON public.trade.withdraw_method_id = withdraw_method.id
`;


function mapRowToTrade(row: any): TradeT {
  return {
    id: parseInt(row.id),
    date: new Date(row.date),
    amount: parseFloat(row.amount),
    subject: {
      id: parseInt(row.subject_id),
      name: row.subject_name,
    },
    deposit: Boolean(row.deposit),
    atm: Boolean(row.atm),
    user_id: parseInt(row.user_id),
    wallet_id: parseInt(row.wallet_id),
    deposit_method: {
      id: parseInt(row.deposit_method_id),
      name: row.deposit_method_name,
    },
    withdraw_method: {
      id: parseInt(row.withdraw_method_id),
      name: row.withdraw_method_name,
    },
  };
}

function mapRowToTradeId(row: any): TradeIdT {
  return {
    id: parseInt(row.id),
  };
}
