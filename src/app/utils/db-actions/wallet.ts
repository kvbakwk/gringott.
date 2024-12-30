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
  userId: number
): Promise<WalletT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id, name, balance, wallet_type_id FROM public.wallet WHERE user_id = $1",
    [userId]
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
  userId: number
): Promise<WalletIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.wallet WHERE user_id = $1;",
    [userId]
  );
  await client.end();
  return res.rows.map((wallet) => ({
    id: parseInt(wallet.id),
  }));
}

export async function isCashWallet(walletId: number) {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.wallet WHERE id = $1 AND wallet_type_id = 1;",
    [walletId]
  );
  await client.end();
  return res.rows.length > 0;
}
