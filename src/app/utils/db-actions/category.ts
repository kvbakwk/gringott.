'use server'

import { Pool, QueryResult } from "pg";

export async function getCategories() {
  const client = new Pool();
  const res = await client.query(
    "SELECT id, name, super_category_id FROM public.category;"
  );
  await client.end();

  return res.rows.map((category) => ({
    id: parseInt(category.id),
    name: category.name,
    super_category_id: parseInt(category.super_category_id),
  }));
}


export async function isIncomeCategory(id: number) {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.category.id FROM public.category JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE public.category.id = $1 AND public.super_category.income = TRUE;",
    [id]
  );
  await client.end();
  return res.rows.length > 0;
}

export async function isOutcomeCategory(id: number) {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT public.category.id FROM public.category JOIN public.super_category ON public.category.super_category_id = public.super_category.id WHERE public.category.id = $1 AND public.super_category.outcome = TRUE;",
    [id]
  );
  await client.end();
  return res.rows.length > 0;
}
