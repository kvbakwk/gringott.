"use server";

import { Pool, QueryResult } from "pg";

export interface SuperCategoryT {
  id: number;
  name: string;
  income: boolean;
  outcome: boolean;
}

export async function getSuperCategories(): Promise<SuperCategoryT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id, name, income, outcome FROM public.super_category;"
  );
  await client.end();

  return res.rows.map((super_category) => ({
    id: parseInt(super_category.id),
    name: super_category.name,
    income: Boolean(super_category.income),
    outcome: Boolean(super_category.outcome),
  }));
}
