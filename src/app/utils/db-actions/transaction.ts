import { Pool, QueryResult } from "pg";

export interface TransactionT {
  id: number;
  date: Date;
  amount: number;
  description: string;
  super_category: string;
  category: string;
  counterparty: string;
  income: boolean;
  important: boolean;
  wallet_id: number;
  method: string;
  transaction_type_id: number;
}

export interface TransactionIdT {
  id: number;
}

export async function getTransactionById(id: number): Promise<TransactionT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, date, amount, description, public.super_category.name as super_category, public.category.name as category, counterparty, income, important, wallet_id, public.method.name as method, transaction_type_id FROM public.transaction JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id  WHERE public.transaction.id = $1;",
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    date: new Date(res.rows[0].date),
    amount: parseFloat(res.rows[0].amount),
    description: res.rows[0].description,
    super_category: res.rows[0].super_category,
    category: res.rows[0].category,
    counterparty: res.rows[0].counterparty,
    income: Boolean(res.rows[0].income),
    important: Boolean(res.rows[0].important),
    wallet_id: parseInt(res.rows[0].wallet_id),
    method: res.rows[0].method,
    transaction_type_id: parseInt(res.rows[0].transaction_type_id),
  };
}

export async function getTransactionsByWalletId(
  id: number
): Promise<TransactionT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, public.transaction.date, public.transaction.amount, public.transaction.description, public.super_category.name as super_category, public.category.name as category, public.transaction.counterparty, public.transaction.income, public.transaction.important, public.transaction.wallet_id, public.method.name as method, transaction_type_id FROM public.transaction JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE wallet_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
    date: new Date(wallet.date),
    amount: parseFloat(wallet.amount),
    description: wallet.description,
    super_category: wallet.super_category,
    category: wallet.category,
    counterparty: wallet.counterparty,
    income: Boolean(wallet.income),
    important: Boolean(wallet.important),
    wallet_id: parseInt(wallet.wallet_id),
    method: wallet.method,
    transaction_type_id: parseInt(wallet.transaction_type_id),
  }));
}

export async function getTransactionsByUserId(
  id: number
): Promise<TransactionT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, public.transaction.date, public.transaction.amount, public.transaction.description, public.super_category.name as super_category, public.category.name as category, public.transaction.counterparty, public.transaction.income, public.transaction.important, public.transaction.wallet_id, public.method.name as method, transaction_type_id FROM public.transaction JOIN public.wallet ON public.transaction.wallet_id = public.wallet.id JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE public.wallet.user_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((row) => ({
    id: parseInt(row.id),
    date: new Date(row.date),
    amount: parseFloat(row.amount),
    description: row.description,
    super_category: row.super_category,
    category: row.category,
    counterparty: row.counterparty,
    income: Boolean(row.income),
    important: Boolean(row.important),
    wallet_id: parseInt(row.wallet_id),
    method: row.method,
    transaction_type_id: parseInt(row.transaction_type_id),
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
