"use server";

import { QueryResult } from "pg";

import pool from "@/utils/db";
import { CategoryT, CategoryTypeT } from "@/types/category";

// CATEGORIES

interface CategoryRow {
  id: string | number;
  name: string;
  income: boolean;
  outcome: boolean;
  category_type_id: string | number;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getCategories(since?: Date): Promise<CategoryT[]> {
  try {
    const query = since
      ? "SELECT id, name, income, outcome, category_type_id, updated_at, deleted_at FROM public.categories WHERE updated_at > $1"
      : "SELECT id, name, income, outcome, category_type_id, updated_at, deleted_at FROM public.categories WHERE deleted_at IS NULL;";

    const params = since ? [since] : [];
    const res: QueryResult<CategoryRow> = await pool.query(query, params);

    return res.rows.map(mapRowToCategory);
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

function mapRowToCategory(row: CategoryRow): CategoryT {
  return {
    id: Number(row.id),
    name: row.name,
    income: Boolean(row.income),
    outcome: Boolean(row.outcome),
    category_type_id: Number(row.category_type_id),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

// CATEGORY TYPES

interface CategoryTypeRow {
  id: string | number;
  name: string;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getCategoryTypes(since?: Date): Promise<CategoryTypeT[]> {
  try {
    const query = since
      ? "SELECT id, name, updated_at, deleted_at FROM public.category_types WHERE updated_at > $1 ORDER BY id ASC"
      : "SELECT id, name, updated_at, deleted_at FROM public.category_types WHERE deleted_at IS NULL ORDER BY id ASC;";

    const params = since ? [since] : [];
    const res: QueryResult<CategoryTypeRow> = await pool.query(query, params);
    return res.rows.map(mapRowToCategoryType);
  } catch (error) {
    console.error("Error in getCategoryTypes:", error);
    return [];
  }
}

function mapRowToCategoryType(row: CategoryTypeRow): CategoryTypeT {
  return {
    id: Number(row.id),
    name: row.name,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
