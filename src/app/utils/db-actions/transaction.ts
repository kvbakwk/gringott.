import { Pool, QueryResult } from "pg";
import { getWalletsIdsByUserId } from "./wallet";

export interface TransactionT {
  id: number;
  description: string;
  income: boolean;
  amount: number;
  date: Date;
  important: boolean;
  wallet_id: number;
  super_category: string;
  category: string;
  method: string;
}

export interface TransactionIdT {
  id: number;
}

export async function getTransactionById(id: number): Promise<TransactionT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, description, income, amount, date, important, wallet_id, public.super_category.name as super_category, public.category.name as categorypublic.category.name as category, public.method.name as method FROM public.transaction JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id  WHERE public.transaction.id = $1;",
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    description: res.rows[0].description,
    income: Boolean(res.rows[0].income),
    amount: parseInt(res.rows[0].amount),
    date: new Date(res.rows[0].date),
    important: Boolean(res.rows[0].important),
    wallet_id: parseInt(res.rows[0].wallet_id),
    super_category: res.rows[0].super_category,
    category: res.rows[0].category,
    method: res.rows[0].method
  };
}

export async function getTransactionsByWalletId(
  id: number
): Promise<TransactionT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, public.transaction.description, public.transaction.income, public.transaction.amount, public.transaction.date, public.transaction.important, public.transaction.wallet_id, public.super_category.name as super_category, public.category.name as category, public.method.name as method FROM public.transaction JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE wallet_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
    description: wallet.description,
    income: Boolean(wallet.income),
    amount: parseInt(wallet.amount),
    date: new Date(wallet.date),
    important: Boolean(wallet.important),
    wallet_id: parseInt(wallet.wallet_id),
    super_category: wallet.super_category,
    category: wallet.category,
    method: wallet.method
  }));
}

export async function getTransactionsByUserId(
  id: number
): Promise<TransactionT[]> {
  const walletsIds = await getWalletsIdsByUserId(id);
  const transactions: TransactionT[] = [];
  for (const walletId of walletsIds)
    transactions.push(...(await getTransactionsByWalletId(walletId.id)));
  return transactions;
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

