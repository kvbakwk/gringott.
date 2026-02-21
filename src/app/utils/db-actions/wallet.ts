"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface WalletT {
  id: number;
  name: string;
  balance: number;
  wallet_type_id: number;
  icon: string | null;
  target_amount: number | null;
  updated_at: Date;
  deleted_at: Date | null;
}
export interface WalletTypeT {
  id: number;
  name: string;
}

export async function getWalletTypes(): Promise<WalletTypeT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id, name FROM public.wallet_type ORDER BY id ASC;"
  );
  return res.rows.map((row) => ({
    id: parseInt(row.id),
    name: row.name,
  }));
}
export interface WalletIdT {
  id: number;
}

export async function getWalletsByUserId(
  userId: number,
  since?: Date
): Promise<WalletT[]> {
  const query = since
    ? "SELECT id, name, balance, wallet_type_id, icon, target_amount, updated_at, deleted_at FROM public.wallet WHERE user_id = $1 AND updated_at > $2"
    : "SELECT id, name, balance, wallet_type_id, icon, target_amount, updated_at, deleted_at FROM public.wallet WHERE user_id = $1 AND deleted_at IS NULL";

  const params = since ? [userId, since] : [userId];

  const res: QueryResult = await pool.query(query, params);

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
  walletTypeId: number,
  icon?: string,
  targetAmount?: number
): Promise<number> {
  const res: QueryResult = await pool.query(
    `INSERT INTO wallet 
      (name, balance, user_id, wallet_type_id, icon, target_amount) 
     VALUES 
      ($1, $2, $3, $4, $5, $6) 
     RETURNING 
      id;`,
    [name, balance, userId, walletTypeId, icon || null, targetAmount || null]
  );
  return res.rows[0].id;
}

export async function increaseWalletBalance(
  walletId: number,
  amount: number
): Promise<number> {
  const res = await pool.query(
    "UPDATE public.wallet SET balance = balance + $1, updated_at = NOW() WHERE id = $2",
    [amount, walletId]
  );
  return res.rowCount;
}
export async function decreaseWalletBalance(
  walletId: number,
  amount: number
): Promise<number> {
  const res = await pool.query(
    "UPDATE public.wallet SET balance = balance - $1, updated_at = NOW() WHERE id = $2",
    [amount, walletId]
  );
  return res.rowCount;
}

export async function deleteWallet(walletId: number): Promise<boolean> {
  const res = await pool.query(
    "UPDATE public.wallet SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1",
    [walletId]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function updateWallet(
  walletId: number,
  name: string,
  icon?: string,
  targetAmount?: number
): Promise<boolean> {
  const res = await pool.query(
    "UPDATE public.wallet SET name = $1, icon = $2, target_amount = $3, updated_at = NOW() WHERE id = $4",
    [name, icon || null, targetAmount || null, walletId]
  );
  return (res.rowCount ?? 0) > 0;
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
    icon: row.icon || null,
    target_amount: row.target_amount ? parseFloat(row.target_amount) : null,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
function mapRowToWalletId(row: any): WalletIdT {
  return {
    id: parseInt(row.id),
  };
}
