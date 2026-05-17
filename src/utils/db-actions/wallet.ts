"use server";

import { QueryResult } from "pg";
import pool from "../db";

import {
  WalletT,
  WalletBankDetailsT,
  WalletGoalDetailsT,
  WalletTypeT,
  WalletIdT,
} from "@/types/wallet";

interface WalletRow {
  id: string | number;
  name: string;
  balance: string | number;
  wallet_type_id: string | number;
  icon: string | null;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

interface WalletBankDetailsRow {
  wallet_id: string | number;
  bank_name: string | null;
  account_number: string | null;
  bic_swift: string | null;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

interface WalletGoalDetailsRow {
  wallet_id: string | number;
  target_amount: string | number;
  status: string;
  deadline: string | Date | null;
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

export async function getWalletsByUserId(
  userId: number,
  since?: Date,
): Promise<WalletT[]> {
  try {
    const query = since
      ? "SELECT id, name, balance, wallet_type_id, icon, updated_at, deleted_at FROM public.wallets WHERE user_id = $1 AND updated_at > $2"
      : "SELECT id, name, balance, wallet_type_id, icon, updated_at, deleted_at FROM public.wallets WHERE user_id = $1 AND deleted_at IS NULL";

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<WalletRow> = await pool.query(query, params);

    return res.rows.map(mapRowToWallet);
  } catch (error) {
    console.error(`Error in getWalletsByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function getBankDetailsByWalletId(
  walletId: number,
): Promise<WalletBankDetailsT | null> {
  try {
    const res: QueryResult<WalletBankDetailsRow> = await pool.query(
      "SELECT wallet_id, bank_name, account_number, bic_swift, updated_at, deleted_at FROM public.wallet_bank_details WHERE wallet_id = $1 AND deleted_at IS NULL",
      [walletId],
    );
    if (res.rows.length === 0) return null;
    return mapRowToBankDetails(res.rows[0]);
  } catch (error) {
    console.error(`Error in getBankDetailsByWalletId ${walletId}:`, error);
    return null;
  }
}

export async function getGoalDetailsByWalletId(
  walletId: number,
): Promise<WalletGoalDetailsT | null> {
  try {
    const res: QueryResult<WalletGoalDetailsRow> = await pool.query(
      "SELECT wallet_id, target_amount, status, deadline, updated_at, deleted_at FROM public.wallet_goal_details WHERE wallet_id = $1 AND deleted_at IS NULL",
      [walletId],
    );
    if (res.rows.length === 0) return null;
    return mapRowToGoalDetails(res.rows[0]);
  } catch (error) {
    console.error(`Error in getGoalDetailsByWalletId ${walletId}:`, error);
    return null;
  }
}

export async function getWalletsIdsByUserId(
  userId: number,
): Promise<WalletIdT[]> {
  try {
    const res: QueryResult = await pool.query(
      "SELECT id FROM public.wallets WHERE user_id = $1 AND deleted_at IS NULL;",
      [userId],
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
      [walletId],
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
): Promise<number | null> {
  try {
    const res: QueryResult = await pool.query(
      `INSERT INTO public.wallets 
        (name, balance, user_id, wallet_type_id, icon) 
       VALUES 
        ($1, $2, $3, $4, $5) 
       RETURNING 
        id;`,
      [name, balance, userId, walletTypeId, icon || null],
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createWallet:", error);
    return null;
  }
}

export async function createBankDetails(
  data: Omit<WalletBankDetailsT, "updated_at" | "deleted_at">,
): Promise<boolean> {
  try {
    await pool.query(
      "INSERT INTO public.wallet_bank_details (wallet_id, bank_name, account_number, bic_swift) VALUES ($1, $2, $3, $4)",
      [data.wallet_id, data.bank_name, data.account_number, data.bic_swift],
    );
    return true;
  } catch (error) {
    console.error("Error in createBankDetails:", error);
    return false;
  }
}

export async function createGoalDetails(
  data: Omit<WalletGoalDetailsT, "updated_at" | "deleted_at">,
): Promise<boolean> {
  try {
    await pool.query(
      "INSERT INTO public.wallet_goal_details (wallet_id, target_amount, status, deadline) VALUES ($1, $2, $3, $4)",
      [data.wallet_id, data.target_amount, data.status, data.deadline],
    );
    return true;
  } catch (error) {
    console.error("Error in createGoalDetails:", error);
    return false;
  }
}

export async function increaseWalletBalance(
  walletId: number,
  amount: number,
): Promise<number> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET balance = balance + $1 WHERE id = $2 AND deleted_at IS NULL",
      [amount, walletId],
    );
    return res.rowCount ?? 0;
  } catch (error) {
    console.error("Error in increaseWalletBalance:", error);
    return 0;
  }
}

export async function decreaseWalletBalance(
  walletId: number,
  amount: number,
): Promise<number> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET balance = balance - $1 WHERE id = $2 AND deleted_at IS NULL",
      [amount, walletId],
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
      [walletId],
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
): Promise<boolean> {
  try {
    const res = await pool.query(
      "UPDATE public.wallets SET name = $1, icon = $2 WHERE id = $3 AND deleted_at IS NULL",
      [name, icon || null, walletId],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error in updateWallet:", error);
    return false;
  }
}

export async function updateBankDetails(
  data: Omit<WalletBankDetailsT, "updated_at" | "deleted_at">,
): Promise<boolean> {
  try {
    const res = await pool.query(
      "UPDATE public.wallet_bank_details SET bank_name = $1, account_number = $2, bic_swift = $3 WHERE wallet_id = $4 AND deleted_at IS NULL",
      [data.bank_name, data.account_number, data.bic_swift, data.wallet_id],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error in updateBankDetails:", error);
    return false;
  }
}

export async function updateGoalDetails(
  data: Omit<WalletGoalDetailsT, "updated_at" | "deleted_at">,
): Promise<boolean> {
  try {
    const res = await pool.query(
      "UPDATE public.wallet_goal_details SET target_amount = $1, status = $2, deadline = $3 WHERE wallet_id = $4 AND deleted_at IS NULL",
      [data.target_amount, data.status, data.deadline, data.wallet_id],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Error in updateGoalDetails:", error);
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
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

function mapRowToBankDetails(row: WalletBankDetailsRow): WalletBankDetailsT {
  return {
    wallet_id: Number(row.wallet_id),
    bank_name: row.bank_name,
    account_number: row.account_number,
    bic_swift: row.bic_swift,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

function mapRowToGoalDetails(row: WalletGoalDetailsRow): WalletGoalDetailsT {
  return {
    wallet_id: Number(row.wallet_id),
    target_amount: Number(row.target_amount),
    status: row.status,
    deadline: row.deadline ? new Date(row.deadline) : null,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
