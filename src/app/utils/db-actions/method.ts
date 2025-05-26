"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface MethodT {
  id: number;
  name: string;
  cash: boolean;
  bank: boolean;
}

export async function getMethods(): Promise<MethodT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id, name, cash, bank FROM public.method;"
  );
  return res.rows.map(mapRowToMethod);
}

export async function isMethodCash(id: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT cash FROM public.method WHERE id = $1;",
    [id]
  );
  return Boolean(res.rows[0].cash);
}
export async function isMethodBank(id: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT bank FROM public.method WHERE id = $1;",
    [id]
  );
  return Boolean(res.rows[0].bank);
}

function mapRowToMethod(row: any): MethodT {
  return {
    id: parseInt(row.id),
    name: row.name,
    cash: Boolean(row.cash),
    bank: Boolean(row.bank),
  };
}
