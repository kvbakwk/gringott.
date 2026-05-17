"use server";

import { QueryResult } from "pg";

import pool from "@/utils/db";
import { MethodT } from "@/types/method";

interface MethodRow {
  id: string | number;
  name: string;
  cash: boolean;
  bank: boolean;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getMethods(since?: Date): Promise<MethodT[]> {
  try {
    const query = since
      ? "SELECT id, name, cash, bank, updated_at, deleted_at FROM public.methods WHERE updated_at > $1"
      : "SELECT id, name, cash, bank, updated_at, deleted_at FROM public.methods WHERE deleted_at IS NULL;";

    const params = since ? [since] : [];
    const res: QueryResult<MethodRow> = await pool.query(query, params);
    return res.rows.map(mapRowToMethod);
  } catch (error) {
    console.error("Error in getMethods:", error);
    return [];
  }
}

export async function isMethodCash(id: number): Promise<boolean> {
  try {
    const res = await pool.query(
      "SELECT cash FROM public.methods WHERE id = $1 AND deleted_at IS NULL LIMIT 1;",
      [id],
    );
    return res.rows[0]?.cash ? Boolean(res.rows[0].cash) : false;
  } catch (error) {
    console.error(`Error in isMethodCash for ${id}:`, error);
    return false;
  }
}

export async function isMethodBank(id: number): Promise<boolean> {
  try {
    const res = await pool.query(
      "SELECT bank FROM public.methods WHERE id = $1 AND deleted_at IS NULL LIMIT 1;",
      [id],
    );
    return res.rows[0]?.bank ? Boolean(res.rows[0].bank) : false;
  } catch (error) {
    console.error(`Error in isMethodBank for ${id}:`, error);
    return false;
  }
}

function mapRowToMethod(row: MethodRow): MethodT {
  return {
    id: Number(row.id),
    name: row.name,
    cash: Boolean(row.cash),
    bank: Boolean(row.bank),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
