"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface AssetT {
  id: number;
  wallet_id: number;
  name: string;
  ticker: string | null;
  type: string;
  quantity: number;
  currency: string;
  avg_buy_price: number | null;
  current_price: number | null;
  icon: string | null;
  updated_at: Date;
  deleted_at: Date | null;
}

interface AssetRow {
  id: string | number;
  wallet_id: string | number;
  name: string;
  ticker: string | null;
  type: string;
  quantity: string | number;
  currency: string;
  avg_buy_price: string | number | null;
  current_price: string | number | null;
  icon: string | null;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getAssetsByUserId(userId: number, since?: Date): Promise<AssetT[]> {
  try {
    const query = since
      ? `SELECT a.* 
         FROM public.assets a
         JOIN public.wallets w ON a.wallet_id = w.id
         WHERE w.user_id = $1 AND a.updated_at > $2 AND w.deleted_at IS NULL 
         ORDER BY a.name ASC`
      : `SELECT a.* 
         FROM public.assets a
         JOIN public.wallets w ON a.wallet_id = w.id
         WHERE w.user_id = $1 AND a.deleted_at IS NULL AND w.deleted_at IS NULL 
         ORDER BY a.name ASC`;

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<AssetRow> = await pool.query(query, params);
    return res.rows.map(mapRowToAsset);
  } catch (error) {
    console.error(`Error in getAssetsByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function createAsset(
  data: Omit<AssetT, 'id' | 'updated_at' | 'deleted_at'>
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.assets 
        (wallet_id, name, type, quantity, currency, avg_buy_price, current_price, ticker, icon) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;`,
      [
        data.wallet_id, data.name, data.type, data.quantity, data.currency, 
        data.avg_buy_price || null, data.current_price || null, data.ticker || null, data.icon || null
      ]
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createAsset:", error);
    return null;
  }
}

export async function deleteAsset(assetId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      "UPDATE public.assets SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
      [assetId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteAsset ${assetId}:`, error);
    return false;
  }
}

function mapRowToAsset(row: AssetRow): AssetT {
  return {
    id: Number(row.id),
    wallet_id: Number(row.wallet_id),
    name: row.name,
    ticker: row.ticker || null,
    type: row.type,
    quantity: Number(row.quantity),
    currency: row.currency,
    avg_buy_price: row.avg_buy_price ? Number(row.avg_buy_price) : null,
    current_price: row.current_price ? Number(row.current_price) : null,
    icon: row.icon || null,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
