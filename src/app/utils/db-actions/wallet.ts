'use server'

import { Pool, QueryResult } from "pg";

export interface WalletIdT {
  id: number;
}

export interface WalletT {
  id: number;
  name: string;
  balance: number;
  wallet_type_id: number;
}

export async function getWalletsByUserId(
  user_id: number
): Promise<WalletT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id, name, balance, wallet_type_id FROM public.wallet WHERE user_id = $1",
    [user_id]
  );
  await client.end();

  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
    name: wallet.name,
    balance: parseFloat(wallet.balance),
    wallet_type_id: parseInt(wallet.wallet_type_id)
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
