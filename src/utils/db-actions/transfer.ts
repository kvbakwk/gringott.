"use server";

import { QueryResult } from "pg";

import pool from "@/utils/db";
import { TransferT } from "@/types/transfer";

interface TransferRow {
  id: string | number;
  date: string | Date;
  amount: string | number;
  user_id: string | number;
  method_id: string | number;
  method_name: string;
  from_wallet_id: string | number;
  to_wallet_id: string | number;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

const BASE_TRANSFER_QUERY = `
    SELECT 
      t.id, t.date, t.amount, t.user_id, t.from_wallet_id, t.to_wallet_id, t.updated_at, t.deleted_at,
      m.id as method_id, m.name as method_name
    FROM public.transfers t
    JOIN public.methods m ON t.method_id = m.id
`;

export async function getTransfersByUserId(
  userId: number,
  since?: Date,
): Promise<TransferT[]> {
  try {
    const query = since
      ? `${BASE_TRANSFER_QUERY} WHERE t.user_id = $1 AND t.updated_at > $2`
      : `${BASE_TRANSFER_QUERY} WHERE t.user_id = $1 AND t.deleted_at IS NULL;`;

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<TransferRow> = await pool.query(query, params);
    return res.rows.map(mapRowToTransfer);
  } catch (error) {
    console.error(`Error in getTransfersByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function createTransfer(
  data: Omit<TransferT, "id" | "updated_at" | "deleted_at" | "method_name">,
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.transfers (date, amount, user_id, method_id, from_wallet_id, to_wallet_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`,
      [
        data.date,
        data.amount,
        data.user_id,
        data.method_id,
        data.from_wallet_id,
        data.to_wallet_id,
      ],
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createTransfer:", error);
    return null;
  }
}

export async function getTransferById(id: number): Promise<TransferT | null> {
  try {
    const res: QueryResult<TransferRow> = await pool.query(
      `${BASE_TRANSFER_QUERY} WHERE t.id = $1 AND t.deleted_at IS NULL LIMIT 1;`,
      [id],
    );
    return res.rows[0] ? mapRowToTransfer(res.rows[0]) : null;
  } catch (error) {
    console.error(`Error in getTransferById ${id}:`, error);
    return null;
  }
}

export async function editTransfer(
  id: number,
  data: Partial<
    Omit<TransferT, "id" | "updated_at" | "deleted_at" | "method_name">
  >,
): Promise<boolean> {
  try {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }

    if (fields.length === 0) return true;

    values.push(id);
    const query = `UPDATE public.transfers SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${i} AND deleted_at IS NULL;`;
    const res = await pool.query(query, values);
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in editTransfer ${id}:`, error);
    return false;
  }
}

export async function deleteTransfer(id: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.transfers SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;`,
      [id],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteTransfer ${id}:`, error);
    return false;
  }
}

function mapRowToTransfer(row: TransferRow): TransferT {
  return {
    id: Number(row.id),
    date: new Date(row.date),
    amount: Number(row.amount),
    user_id: Number(row.user_id),
    method_id: Number(row.method_id),
    method_name: row.method_name,
    from_wallet_id: Number(row.from_wallet_id),
    to_wallet_id: Number(row.to_wallet_id),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
