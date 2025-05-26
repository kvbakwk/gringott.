"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface SuperCategoryT {
  id: number;
  name: string;
  income: boolean;
  outcome: boolean;
}

export async function getSuperCategories(): Promise<SuperCategoryT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id, name, income, outcome FROM public.super_category;"
  );
  return res.rows.map(mapRowToSuperCategory);
}

function mapRowToSuperCategory(row: any): SuperCategoryT {
  return {
    id: parseInt(row.id),
    name: row.name,
    income: Boolean(row.income),
    outcome: Boolean(row.outcome),
  };
}
