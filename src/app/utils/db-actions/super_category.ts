"use server";

import { Pool } from "pg";

export async function getSuperCategories() {
  const client = new Pool();
  const res = await client.query(
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
