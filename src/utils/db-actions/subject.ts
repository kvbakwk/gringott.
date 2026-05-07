"use server";

import { QueryResult } from "pg";
import pool from "../db";

export interface SubjectT {
  id: number;
  user_id: number;
  name: string;
  address: string;
  normal: boolean;
  atm: boolean;
  updated_at: Date;
  deleted_at: Date | null;
}

interface SubjectRow {
  id: string | number;
  user_id: string | number;
  name: string;
  address: string;
  normal: boolean;
  atm: boolean;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getSubjectsByUserId(userId: number, since?: Date): Promise<SubjectT[]> {
  try {
    const query = since
      ? `SELECT id, user_id, name, address, normal, atm, updated_at, deleted_at FROM public.subjects WHERE user_id = $1 AND updated_at > $2`
      : `SELECT id, user_id, name, address, normal, atm, updated_at, deleted_at FROM public.subjects WHERE user_id = $1 AND deleted_at IS NULL`;

    const params = since ? [userId, since] : [userId];
    const res: QueryResult<SubjectRow> = await pool.query(query, params);

    return res.rows.map(mapRowToSubject);
  } catch (error) {
    console.error(`Error in getSubjectsByUserId for user ${userId}:`, error);
    return [];
  }
}

export async function createSubject(
  name: string,
  userId: number,
  address: string,
  normal: boolean,
  atm: boolean
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.subjects 
        (name, user_id, address, normal, atm) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
      [name, userId, address, normal, atm]
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createSubject:", error);
    return null;
  }
}

export async function editSubject(subjectId: number, name: string, address: string, normal: boolean, atm: boolean): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.subjects SET name = $1, address = $2, normal = $3, atm = $4 WHERE id = $5 AND deleted_at IS NULL;`,
      [name, address, normal, atm, subjectId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in editSubject ${subjectId}:`, error);
    return false;
  }
}

export async function deleteSubject(subjectId: number): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.subjects SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;`,
      [subjectId]
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteSubject ${subjectId}:`, error);
    return false;
  }
}

function mapRowToSubject(row: SubjectRow): SubjectT {
  return {
    id: Number(row.id),
    user_id: Number(row.user_id),
    name: row.name,
    address: row.address,
    normal: Boolean(row.normal),
    atm: Boolean(row.atm),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
