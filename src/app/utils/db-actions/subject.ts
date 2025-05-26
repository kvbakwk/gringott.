"use server";

import { Pool, QueryResult } from "pg";
import pool from "../db";

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
export async function getSubjectsByUserId(id: number): Promise<SubjectT[]> {
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
  id: number
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

export async function createSubject(
  name: string,
  userId: number,
  address: string,
  normal: boolean,
  atm: boolean
): Promise<number> {
  const res = await pool.query(
    `INSERT INTO public.subject 
      (name, user_id, address, normal, atm) 
     VALUES 
      ($1, $2, $3, $4, $5);`,
    [name, userId, address, normal, atm]
  );
  return res.rowCount;
}
export async function editSubject(name: string, subjectId: number, address: string, normal: boolean, atm: boolean) {
  await pool.query(
    `UPDATE public.subject SET name = $1, address = $3, normal = $4, atm = $5 WHERE id = $2;`,
    [name, subjectId, address, normal, atm]
  );
}
export async function deleteSubject(subjectId: number): Promise<number> {
  const res = await pool.query(`DELETE FROM public.subject WHERE id = $1;`, [
    subjectId,
  ]);
  return res.rowCount;
}
