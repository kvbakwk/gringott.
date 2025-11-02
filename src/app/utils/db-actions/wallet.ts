"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface WalletT {
  id: number;
  name: string;
  balance: number;
  wallet_type_id: number;
}
export interface WalletIdT {
  id: number;
}

export async function getWalletsByUserId(userId: number): Promise<WalletT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id, name, balance, wallet_type_id FROM public.wallet WHERE user_id = $1",
    [userId]
  );

  return res.rows.map(mapRowToWallet);
}
export async function getWalletsIdsByUserId(
  userId: number
): Promise<WalletIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.wallet WHERE user_id = $1;",
    [userId]
  );
  return res.rows.map(mapRowToWalletId);
}

export async function isWalletCash(walletId: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT wallet_type_id FROM public.wallet WHERE id = $1;",
    [walletId]
  );
  return Boolean(res.rows[0].wallet_type_id === 1);
}

export async function createWallet(
  name: string,
  balance: number,
  userId: number,
  walletTypeId: number
): Promise<number> {
  const res: QueryResult = await pool.query(
    `INSERT INTO wallet 
      (name, balance, user_id, wallet_type_id) 
     VALUES 
      ($1, $2, $3, $4) 
     RETURNING 
      id;`,
    [name, balance, userId, walletTypeId]
  );
  return res.rows[0].id;
}

export async function increaseWalletBalance(
  walletId: number,
  amount: number
): Promise<number> {
  const res = await pool.query(
    "UPDATE public.wallet SET balance = balance + $1 WHERE id = $2",
    [amount, walletId]
  );
  return res.rowCount;
}
export async function decreaseWalletBalance(
  walletId: number,
  amount: number
): Promise<number> {
  const res = await pool.query(
    "UPDATE public.wallet SET balance = balance - $1 WHERE id = $2",
    [amount, walletId]
  );
  return res.rowCount;
}

function mapRowToWallet(row: any): WalletT {
  return {
    id: parseInt(row.id),
    name:
      row.wallet_type_id === 1
        ? "gotówka"
        : row.wallet_type_id === 3
        ? "oszczędności"
        : row.name,
    balance: parseFloat(row.balance),
    wallet_type_id: parseInt(row.wallet_type_id),
  };
}
function mapRowToWalletId(row: any): WalletIdT {
  return {
    id: parseInt(row.id),
  };
}
