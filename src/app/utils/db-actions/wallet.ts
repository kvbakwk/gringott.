'use server'

import { Pool, QueryResult } from "pg";

export interface WalletIdT {
  id: number;
}

export interface CashWalletT {
  id: number;
  balance: number;
}

export interface BankWalletT {
  id: number;
  name: string;
  balance: number;
}

export async function isWalletByUserId(
  user_id: number,
  cash: boolean
): Promise<boolean> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.wallet WHERE user_id = $1 AND cash = $2;",
    [user_id, cash]
  );
  await client.end();

  return res.rows.length > 0;
}

export async function getCashWalletByUserId(
  user_id: number
): Promise<CashWalletT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id, balance FROM public.wallet WHERE user_id = $1 AND cash = TRUE;",
    [user_id]
  );
  await client.end();

  return {
    id: parseInt(res.rows[0].id),
    balance: parseFloat(res.rows[0].balance),
  };
}

export async function getBankWalletsByUserId(
  user_id: number
): Promise<BankWalletT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id, name, balance FROM public.wallet WHERE user_id = $1 AND cash = FALSE;",
    [user_id]
  );
  await client.end();

  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
    name: wallet.name,
    balance: parseFloat(wallet.balance),
  }));
}

export async function getWalletsIdsByUserId(
  user_id: number
): Promise<WalletIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.wallet WHERE user_id = $1;",
    [user_id]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
  }));
}

export async function isCashWallet(id: number) {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.wallet WHERE id = $1 AND cash = TRUE;",
    [id]
  );
  await client.end();
  return res.rows.length > 0;
}
