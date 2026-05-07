"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface CategoryT {
  id: number;
  name: string;
  super_category_id: number;
  updated_at: Date;
  deleted_at: Date | null;
}

interface CategoryRow {
  id: string | number;
  name: string;
  super_category_id: string | number;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getCategories(since?: Date): Promise<CategoryT[]> {
  try {
    const query = since
      ? "SELECT id, name, super_category_id, updated_at, deleted_at FROM public.categories WHERE updated_at > $1"
      : "SELECT id, name, super_category_id, updated_at, deleted_at FROM public.categories WHERE deleted_at IS NULL;";

    const params = since ? [since] : [];
    const res: QueryResult<CategoryRow> = await pool.query(query, params);

    return res.rows.map(mapRowToCategory);
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

export async function isCategoryIncome(id: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `SELECT sc.income 
       FROM public.categories c
       JOIN public.super_categories sc ON c.super_category_id = sc.id 
       WHERE c.id = $1 AND c.deleted_at IS NULL AND sc.deleted_at IS NULL;`,
      [id]
    );
    return res.rows[0]?.income ? Boolean(res.rows[0].income) : false;
  } catch (error) {
    console.error(`Error in isCategoryIncome for ${id}:`, error);
    return false;
  }
}

export async function isCategoryOutcome(id: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `SELECT sc.outcome 
       FROM public.categories c
       JOIN public.super_categories sc ON c.super_category_id = sc.id 
       WHERE c.id = $1 AND c.deleted_at IS NULL AND sc.deleted_at IS NULL;`,
      [id]
    );
    return res.rows[0]?.outcome ? Boolean(res.rows[0].outcome) : false;
  } catch (error) {
    console.error(`Error in isCategoryOutcome for ${id}:`, error);
    return false;
  }
}

function mapRowToCategory(row: CategoryRow): CategoryT {
  return {
    id: Number(row.id),
    name: row.name,
    super_category_id: Number(row.super_category_id),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
