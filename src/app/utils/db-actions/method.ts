"use server";

import { Pool, QueryResult } from "pg";

import pool from "../db";

export interface MethodT {
  id: number;
  name: string;
  cash: boolean;
  bank: boolean;
}

export async function getMethods(): Promise<MethodT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id, name, cash, bank FROM public.method;"
  );
  await client.end();

  return res.rows.map((method) => ({
    id: parseInt(method.id),
    name: method.name,
    cash: Boolean(method.cash),
    bank: Boolean(method.bank),
  }));
}

export async function isCashMethod(id: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.method WHERE id = $1 AND cash = TRUE;",
    [id]
  );
  return res.rows.length > 0;
}

export async function isBankMethod(id: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.method WHERE id = $1 AND bank = TRUE;",
    [id]
  );
  return res.rows.length > 0;
}
