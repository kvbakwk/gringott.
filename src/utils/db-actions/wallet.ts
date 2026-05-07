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
  updated_at: Date;
  deleted_at: Date | null;
}

interface WalletRow {
  id: string | number;
  name: string;
  balance: string | number;
  wallet_type_id: string | number;
  icon: string | null;
  target_amount: string | number | null;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getWalletTypes(since?: Date): Promise<WalletTypeT[]> {
  try {
    const query = since
      ? "SELECT id, name, updated_at, deleted_at FROM public.wallet_types WHERE updated_at > $1 ORDER BY id ASC"
      : "SELECT id, name, updated_at, deleted_at FROM public.wallet_types WHERE deleted_at IS NULL ORDER BY id ASC;";

    const params = since ? [since] : [];
    const res: QueryResult = await pool.query(query, params);
    return res.rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      updated_at: new Date(row.updated_at),
      deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
    }));
  } catch (error) {
    console.error("Error in getWalletTypes:", error);
    return [];
  }
}

export interface WalletIdT {
  id: number;
}

export async function getWalletsByUserId(
  userId: number,
  since?: Date
): Promise<WalletT[]> {
  try {
    const query = since
      ? "SELECT id, name, balance, wallet_type_id, icon, target_amount, updated_at, deleted_at FROM public.wallets WHERE user_id = $1 AND updated_at > $2"
      : "SELECT id, name, balance, wallet_type_id, icon, target_amount, updated_at, deleted_at FROM public.wallets WHERE user_id = $1 AND deleted_at IS NULL";

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<WalletRow> = await pool.query(query, params);

    return res.rows.map(mapRowToWallet);
  } catch (error) {
    console.error(`Error in getWalletsByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function getWalletsIdsByUserId(
  userId: number
): Promise<WalletIdT[]> {
  try {
    const res: QueryResult = await pool.query(
      "SELECT id FROM public.wallets WHERE user_id = $1 AND deleted_at IS NULL;",
      [userId]
    );
    return res.rows.map((row) => ({ id: Number(row.id) }));
  } catch (error) {
    console.error("Error in getWalletsIdsByUserId:", error);
    return [];
  }
}

export async function isWalletCash(walletId: number): Promise<boolean> {
  try {
    const res: QueryResult = await pool.query(
      "SELECT wallet_type_id FROM public.wallets WHERE id = $1 AND deleted_at IS NULL LIMIT 1;",
      [walletId]
    );
    if (res.rows.length === 0) return false;
    return Number(res.rows[0].wallet_type_id) === 1;
  } catch (error) {
    console.error(`Error checking if wallet ${walletId} is cash:`, error);
    return false;
  }
}

export async function createWallet(
  name: string,
  balance: number,
  userId: number,
  walletTypeId: number,
  icon?: string,
  targetAmount?: number
): Promise<number | null> {
  try {
    const res: QueryResult = await pool.query(
      `INSERT INTO public.wallets 
        (name, balance, user_id, wallet_type_id, icon, target_amount) 
       VALUES 
        ($1, $2, $3, $4, $5, $6) 
       RETURNING 
        id;`,
      [name, balance, userId, walletTypeId, icon || null, targetAmount || null]
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createWallet:", error);
    return null;
  }
}

export async function increaseWalletBalance(
  walletId: number,
  amount: number
): Promise<number> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET balance = balance + $1 WHERE id = $2 AND deleted_at IS NULL",
      [amount, walletId]
    );
    return res.rowCount ?? 0;
  } catch (error) {
    console.error("Error in increaseWalletBalance:", error);
    return 0;
  }
}

export async function decreaseWalletBalance(
  walletId: number,
  amount: number
): Promise<number> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET balance = balance - $1 WHERE id = $2 AND deleted_at IS NULL",
      [amount, walletId]
    );
    return res.rowCount ?? 0;
  } catch (error) {
    console.error("Error in decreaseWalletBalance:", error);
    return 0;
  }
}

export async function deleteWallet(walletId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
      [walletId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error in deleteWallet:", error);
    return false;
  }
}

export async function updateWallet(
  walletId: number,
  name: string,
  icon?: string,
  targetAmount?: number
): Promise<boolean> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET name = $1, icon = $2, target_amount = $3 WHERE id = $4 AND deleted_at IS NULL",
      [name, icon || null, targetAmount || null, walletId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error in updateWallet:", error);
    return false;
  }
}

function mapRowToWallet(row: WalletRow): WalletT {
  return {
    id: Number(row.id),
    name:
      Number(row.wallet_type_id) === 1
        ? "gotówka"
        : Number(row.wallet_type_id) === 3
          ? "oszczędności"
          : row.name,
    balance: Number(row.balance),
    wallet_type_id: Number(row.wallet_type_id),
    icon: row.icon || null,
    target_amount: row.target_amount ? Number(row.target_amount) : null,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
