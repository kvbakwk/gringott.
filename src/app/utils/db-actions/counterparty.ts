"use server";

import { Pool, QueryResult } from "pg";

export interface CounterpartyT {
  id: number;
  user_id: number;
  name: string;
}
export interface CounterpartyIdT {
  id: number;
}

export async function getCounterpartyById(id: number): Promise<CounterpartyT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      id, user_id, name 
      FROM public.counterparty 
      WHERE id = $1;`,
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    user_id: parseInt(res.rows[0].user_id),
    name: res.rows[0].name,
  };
}

export async function getCounterpartiesByUserId(
  id: number
): Promise<CounterpartyT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      id, user_id, name
      FROM public.counterparty 
      WHERE user_id = $1;`,
    [id]
  );
  await client.end();
  return res.rows.map((counterparty) => ({
    id: parseInt(counterparty.id),
    user_id: parseInt(counterparty.user_id),
    name: counterparty.name,
  }));
}

export async function getCounterpartiesIdsByUserId(
  id: number,
): Promise<CounterpartyIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.counterparty WHERE user_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((counterparty) => ({
    id: parseInt(counterparty.id),
  }));
}
