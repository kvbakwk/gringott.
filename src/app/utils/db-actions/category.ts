"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface CategoryT {
  id: number;
  name: string;
  super_category_id: number;
}

export async function getCategories(): Promise<CategoryT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id, name, super_category_id FROM public.category;"
  );

  return res.rows.map(mapRowToCategory);
}

export async function isCategoryIncome(id: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT public.super_category.income FROM public.category JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE public.category.id = $1;",
    [id]
  );
  return Boolean(res.rows[0].income);
}
export async function isCategoryOutcome(id: number): Promise<boolean> {
  const res: QueryResult = await pool.query(
    "SELECT public.super_category.outcome FROM public.category JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE public.category.id = $1;",
    [id]
  );
  return Boolean(res.rows[0].outcome);
}

function mapRowToCategory(row: any): CategoryT {
  return {
    id: parseInt(row.id),
    name: row.name,
    super_category_id: parseInt(row.super_category_id),
  };
}
