"use server";

import { Pool, QueryResult } from "pg";

export interface SubjectT {
  id: number;
  user_id: number;
  name: string;
  address: string;
  normal: boolean;
  atm: boolean;
}
export interface SubjectIdT {
  id: number;
}

export async function getSubjectById(id: number): Promise<SubjectT> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      id, user_id, name, address, normal, atm
      FROM public.subject 
      WHERE id = $1;`,
    [id]
  );
  await client.end();
  return {
    id: parseInt(res.rows[0].id),
    user_id: parseInt(res.rows[0].user_id),
    name: res.rows[0].name,
    address: res.rows[0].address,
    normal: Boolean(res.rows[0].normal),
    atm: Boolean(res.rows[0].atm),
  };
}

export async function getSubjectsByUserId(
  id: number
): Promise<SubjectT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    `SELECT 
      id, user_id, name, address, normal, atm
      FROM public.subject 
      WHERE user_id = $1;`,
    [id]
  );
  await client.end();
  return res.rows.map((subject) => ({
    id: parseInt(subject.id),
    user_id: parseInt(subject.user_id),
    name: subject.name,
    address: subject.address,
    normal: Boolean(subject.normal),
    atm: Boolean(subject.atm),
  }));
}

export async function getSubjectsIdsByUserId(
  id: number,
): Promise<SubjectIdT[]> {
  const client: Pool = new Pool();
  const res: QueryResult = await client.query(
    "SELECT id FROM public.subject WHERE user_id = $1;",
    [id]
  );
  await client.end();
  return res.rows.map((subject) => ({
    id: parseInt(subject.id),
  }));
}
