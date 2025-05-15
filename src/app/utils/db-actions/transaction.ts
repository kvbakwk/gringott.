"use server";

import { Pool, QueryResult } from "pg";

export interface TransactionT {
  id: number;
  date: Date;
  amount: number;
  description: string;
  super_category: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  counterparty: {
    id: number;
    name: string;
  };
  income: boolean;
  important: boolean;
  wallet_id: number;
  method: {
    id: number;
    name: string;
  };
  transaction_type_id: number;
}

export interface TransactionIdT {
  id: number;
}

export async function getTransactionById(id: number): Promise<TransactionT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      public.transaction.id, date, amount, description, 
      public.super_category.id as super_category_id, 
      public.super_category.name as super_category_name, 
      public.category.id as category_id, 
      public.category.name as category_name, 
      public.counterparty.id as counterparty_id, 
      public.counterparty.name as counterparty_name, 
      public.transaction.income, important, wallet_id, 
      public.method.id as method_id, 
      public.method.name as method_name, transaction_type_id 
      FROM public.transaction 
      JOIN public.category 
        ON public.transaction.category_id = public.category.id 
      JOIN public.counterparty 
        ON public.transaction.counterparty_id = public.counterparty.id 
      JOIN public.method 
        ON public.transaction.method_id = public.method.id 
      JOIN public.super_category 
        ON public.category.super_category_id = public.super_category.id 
      WHERE public.transaction.id = $1;`,
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    date: new Date(res.rows[0].date),
    amount: parseFloat(res.rows[0].amount),
    description: res.rows[0].description,
    super_category: {
      id: parseInt(res.rows[0].super_category_id),
      name: res.rows[0].super_category_name,
    },
    category: {
      id: parseInt(res.rows[0].category_id),
      name: res.rows[0].category_name,
    },
    counterparty: {
      id: parseInt(res.rows[0].counterparty_id),
      name: res.rows[0].counterparty_name,
    },
    income: Boolean(res.rows[0].income),
    important: Boolean(res.rows[0].important),
    wallet_id: parseInt(res.rows[0].wallet_id),
    method: {
      id: parseInt(res.rows[0].method_id),
      name: res.rows[0].method_name,
    },
    transaction_type_id: parseInt(res.rows[0].transaction_type_id),
  };
}

export async function getTransactionsByWalletId(
  id: number
): Promise<TransactionT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      public.transaction.id, date, amount, description, 
      public.super_category.id as super_category_id, 
      public.super_category.name as super_category_name, 
      public.category.id as category_id, 
      public.category.name as category_name, 
      public.counterparty.id as counterparty_id, 
      public.counterparty.name as counterparty_name, 
      public.transaction.income, important, wallet_id, 
      public.method.id as method_id, 
      public.method.name as method_name, transaction_type_id 
      FROM public.transaction 
      JOIN public.category 
        ON public.transaction.category_id = public.category.id 
      JOIN public.counterparty 
        ON public.transaction.counterparty_id = public.counterparty.id 
      JOIN public.method 
        ON public.transaction.method_id = public.method.id 
      JOIN public.super_category 
        ON public.category.super_category_id = public.super_category.id 
      WHERE wallet_id = $1;`,
    [id]
  );
  await client.end();
  return res.rows.map((transaction) => ({
    id: parseInt(transaction.id),
    date: new Date(transaction.date),
    amount: parseFloat(transaction.amount),
    description: transaction.description,
    super_category: {
      id: parseInt(transaction.super_category_id),
      name: transaction.super_category_name,
    },
    category: {
      id: parseInt(transaction.category_id),
      name: transaction.category_name,
    },
    counterparty: {
      id: parseInt(transaction.counterparty_id),
      name: transaction.counterparty_name,
    },
    income: Boolean(transaction.income),
    important: Boolean(transaction.important),
    wallet_id: parseInt(transaction.wallet_id),
    method: {
      id: parseInt(transaction.method_id),
      name: transaction.method_name,
    },
    transaction_type_id: parseInt(transaction.transaction_type_id),
  }));
}

export async function getTransactionsByUserId(
  id: number
): Promise<TransactionT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      public.transaction.id, date, amount, description, 
      public.super_category.id as super_category_id, 
      public.super_category.name as super_category_name, 
      public.category.id as category_id, 
      public.category.name as category_name, 
      public.counterparty.id as counterparty_id, 
      public.counterparty.name as counterparty_name, 
      public.transaction.income, important, wallet_id, 
      public.method.id as method_id, 
      public.method.name as method_name, transaction_type_id 
    FROM public.transaction 
    JOIN public.wallet 
      ON public.transaction.wallet_id = public.wallet.id 
    JOIN public.category 
      ON public.transaction.category_id = public.category.id 
    JOIN public.counterparty 
      ON public.transaction.counterparty_id = public.counterparty.id 
    JOIN public.method 
      ON public.transaction.method_id = public.method.id 
    JOIN public.super_category 
      ON public.category.super_category_id = public.super_category.id 
    WHERE public.wallet.user_id = $1;`,
    [id]
  );
  await client.end();
  return res.rows.map((transaction) => ({
    id: parseInt(transaction.id),
    date: new Date(transaction.date),
    amount: parseFloat(transaction.amount),
    description: transaction.description,
    super_category: {
      id: parseInt(transaction.super_category_id),
      name: transaction.super_category_name,
    },
    category: {
      id: parseInt(transaction.category_id),
      name: transaction.category_name,
    },
    counterparty: {
      id: parseInt(transaction.counterparty_id),
      name: transaction.counterparty_name,
    },
    income: Boolean(transaction.income),
    important: Boolean(transaction.important),
    wallet_id: parseInt(transaction.wallet_id),
    method: {
      id: parseInt(transaction.method_id),
      name: transaction.method_name,
    },
    transaction_type_id: parseInt(transaction.transaction_type_id),
  }));
}

export async function getTransactionsIdsByWalletId(
  id: number
): Promise<TransactionIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.transaction WHERE wallet_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
  }));
}

export async function getTransactionsIdsByCounterpartyId(
  id: number
): Promise<TransactionIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.transaction WHERE counterparty_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
  }));
}
