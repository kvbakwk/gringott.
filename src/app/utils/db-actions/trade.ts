"use server";

import { Pool, QueryResult } from "pg";

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
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      public.trade.id, date, amount, 
      public.subject.id as subject_id, 
      public.subject.name as subject_name, 
      public.trade.deposit, atm, user_id, wallet_id, 
      deposit_method.id as deposit_method_id, 
      deposit_method.name as deposit_method_name,
      withdraw_method.id as withdraw_method_id, 
      withdraw_method.name as withdraw_method_name 
      FROM public.trade 
      JOIN public.subject 
        ON public.trade.subject_id = public.subject.id 
      JOIN public.method AS deposit_method 
        ON public.trade.deposit_method_id = public.method.id 
      JOIN public.method AS withdraw_method 
        ON public.trade.withdraw_method_id = public.method.id 
      WHERE public.trade.id = $1;`,
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    date: new Date(res.rows[0].date),
    amount: parseFloat(res.rows[0].amount),
    subject: {
      id: parseInt(res.rows[0].subject_id),
      name: res.rows[0].subject_name,
    },
    deposit: Boolean(res.rows[0].deposit),
    atm: Boolean(res.rows[0].atm),
    user_id: parseInt(res.rows[0].user_id),
    wallet_id: parseInt(res.rows[0].wallet_id),
    deposit_method: {
      id: parseInt(res.rows[0].withdraw_method_id),
      name: res.rows[0].deposit_method_name,
    },
    withdraw_method: {
      id: parseInt(res.rows[0].withdraw_method_id),
      name: res.rows[0].withdraw_method_name,
    },
  };
}

export async function getTradesByWalletId(
  id: number
): Promise<TradeT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      public.trade.id, date, amount, 
      public.subject.id as subject_id, 
      public.subject.name as subject_name, 
      public.trade.deposit, atm, user_id, wallet_id, 
      deposit_method.id as deposit_method_id, 
      deposit_method.name as deposit_method_name,
      withdraw_method.id as withdraw_method_id, 
      withdraw_method.name as withdraw_method_name 
      FROM public.trade 
      JOIN public.subject 
        ON public.trade.subject_id = public.subject.id 
      JOIN public.method AS deposit_method 
        ON public.trade.deposit_method_id = public.method.id 
      JOIN public.method AS withdraw_method 
        ON public.trade.withdraw_method_id = public.method.id 
      WHERE wallet_id = $1;`,
    [id]
  );
  await client.end();
  return res.rows.map((trade) => ({
    id: parseInt(trade.id),
    date: new Date(trade.date),
    amount: parseFloat(trade.amount),
    subject: {
      id: parseInt(trade.subject_id),
      name: trade.subject_name,
    },
    deposit: Boolean(trade.deposit),
    atm: Boolean(trade.atm),
    user_id: parseInt(trade.user_id),
    wallet_id: parseInt(trade.wallet_id),
    deposit_method: {
      id: parseInt(trade.deposit_method_id),
      name: trade.deposit_method_name,
    },
    withdraw_method: {
      id: parseInt(trade.withdraw_method_id),
      name: trade.withdraw_method_name,
    },
  }));
}

export async function getTradesByUserId(
  id: number
): Promise<TradeT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      public.trade.id, date, amount, 
      public.subject.id as subject_id, 
      public.subject.name as subject_name, 
      public.trade.deposit, atm, user_id, wallet_id, 
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
        ON public.trade.deposit_method_id = public.method.id 
      JOIN public.method AS withdraw_method 
        ON public.trade.withdraw_method_id = public.method.id 
    WHERE public.wallet.user_id = $1;`,
    [id]
  );
  await client.end();
  return res.rows.map((trade) => ({
    id: parseInt(trade.id),
    date: new Date(trade.date),
    amount: parseFloat(trade.amount),
    subject: {
      id: parseInt(trade.subject_id),
      name: trade.subject_name,
    },
    deposit: Boolean(trade.deposit),
    atm: Boolean(trade.atm),
    user_id: parseInt(trade.user_id),
    wallet_id: parseInt(trade.wallet_id),
    deposit_method: {
      id: parseInt(trade.deposit_method_id),
      name: trade.deposit_method_name,
    },
    withdraw_method: {
      id: parseInt(trade.withdraw_method_id),
      name: trade.withdraw_method_name,
    },
  }));
}

export async function getTradesIdsByWalletId(
  id: number
): Promise<TradeIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.trade WHERE wallet_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
  }));
}

export async function getTradesIdsBySubjectId(
  id: number
): Promise<TradeIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.trade WHERE subject_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
  }));
}
