"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface SuperCategoryT {
  id: number;
  name: string;
  income: boolean;
  outcome: boolean;
  updated_at: Date;
  deleted_at: Date | null;
}

interface SuperCategoryRow {
  id: string | number;
  name: string;
  income: boolean;
  outcome: boolean;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getSuperCategories(since?: Date): Promise<SuperCategoryT[]> {
  try {
    const query = since
      ? "SELECT id, name, income, outcome, updated_at, deleted_at FROM public.super_categories WHERE updated_at > $1"
      : "SELECT id, name, income, outcome, updated_at, deleted_at FROM public.super_categories WHERE deleted_at IS NULL;";

    const params = since ? [since] : [];
    const res: QueryResult<SuperCategoryRow> = await pool.query(query, params);
    return res.rows.map(mapRowToSuperCategory);
  } catch (error) {
    console.error("Error in getSuperCategories:", error);
    return [];
  }
}

function mapRowToSuperCategory(row: SuperCategoryRow): SuperCategoryT {
  return {
    id: Number(row.id),
    name: row.name,
    income: Boolean(row.income),
    outcome: Boolean(row.outcome),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
