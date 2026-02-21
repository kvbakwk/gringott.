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

export async function getAssetsByWalletId(walletId: number): Promise<AssetT[]> {
  const res: QueryResult = await pool.query(
    "SELECT * FROM public.asset WHERE wallet_id = $1 AND deleted_at IS NULL ORDER BY name ASC",
    [walletId]
  );
  return res.rows.map(mapRowToAsset);
}

export async function getAssetsByUserId(userId: number): Promise<AssetT[]> {
  const res: QueryResult = await pool.query(
    `SELECT a.* 
     FROM public.asset a
     JOIN public.wallet w ON a.wallet_id = w.id
     WHERE w.user_id = $1 AND a.deleted_at IS NULL 
     ORDER BY a.name ASC`,
    [userId]
  );
  return res.rows.map(mapRowToAsset);
}

export async function createAsset(
  walletId: number,
  name: string,
  type: string,
  quantity: number,
  currency: string,
  avgBuyPrice?: number,
  currentPrice?: number,
  ticker?: string,
  icon?: string
): Promise<number> {
  const res: QueryResult = await pool.query(
    `INSERT INTO public.asset 
      (wallet_id, name, type, quantity, currency, avg_buy_price, current_price, ticker, icon) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     RETURNING id;`,
    [
      walletId,
      name,
      type,
      quantity,
      currency,
      avgBuyPrice || null,
      currentPrice || null,
      ticker || null,
      icon || null,
    ]
  );
  return res.rows[0].id;
}

export async function updateAsset(
  assetId: number,
  updates: Partial<Omit<AssetT, "id" | "wallet_id" | "updated_at" | "deleted_at">>
): Promise<boolean> {
  const fields = Object.keys(updates);
  if (fields.length === 0) return false;

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");
  const values = Object.values(updates);

  const res = await pool.query(
    `UPDATE public.asset SET ${setClause}, updated_at = NOW() WHERE id = $1`,
    [assetId, ...values]
  );
  return (res.rowCount ?? 0) > 0;
}

export async function deleteAsset(assetId: number): Promise<boolean> {
  const res = await pool.query(
    "UPDATE public.asset SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1",
    [assetId]
  );
  return (res.rowCount ?? 0) > 0;
}

function mapRowToAsset(row: any): AssetT {
  return {
    id: parseInt(row.id),
    wallet_id: parseInt(row.wallet_id),
    name: row.name,
    ticker: row.ticker || null,
    type: row.type,
    quantity: parseFloat(row.quantity),
    currency: row.currency,
    avg_buy_price: row.avg_buy_price ? parseFloat(row.avg_buy_price) : null,
    current_price: row.current_price ? parseFloat(row.current_price) : null,
    icon: row.icon || null,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
