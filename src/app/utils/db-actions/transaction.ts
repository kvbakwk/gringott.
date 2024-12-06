import { Pool, QueryResult } from "pg";
import { getWalletsIdsByUserId } from "./wallet";

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
}

export interface TransactionIdT {
  id: number;
}

export async function getTransactionById(id: number): Promise<TransactionT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, date, amount, description, public.super_category.name as super_category, public.category.name as category, counterparty, income, important, wallet_id, public.method.name as method FROM public.transaction JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id  WHERE public.transaction.id = $1;",
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    date: new Date(res.rows[0].date),
    amount: parseInt(res.rows[0].amount),
    description: res.rows[0].description,
    super_category: res.rows[0].super_category,
    category: res.rows[0].category,
    counterparty: res.rows[0].counterparty,
    income: Boolean(res.rows[0].income),
    important: Boolean(res.rows[0].important),
    wallet_id: parseInt(res.rows[0].wallet_id),
    method: res.rows[0].method
  };
}

export async function getTransactionsByWalletId(
  id: number
): Promise<TransactionT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.transaction.id, public.transaction.date, public.transaction.amount, public.transaction.description, public.super_category.name as super_category, public.category.name as category, public.transaction.counterparty, public.transaction.income, public.transaction.important, public.transaction.wallet_id, public.method.name as method FROM public.transaction JOIN public.category ON public.transaction.category_id = public.category.id JOIN public.method ON public.transaction.method_id = public.method.id JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE wallet_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
    date: new Date(wallet.date),
    amount: parseInt(wallet.amount),
    description: wallet.description,
    super_category: wallet.super_category,
    category: wallet.category,
    counterparty: wallet.counterparty,
    income: Boolean(wallet.income),
    important: Boolean(wallet.important),
    wallet_id: parseInt(wallet.wallet_id),
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

