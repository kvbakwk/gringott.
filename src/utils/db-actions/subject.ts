"use server";

import { QueryResult } from "pg";

import pool from "@/utils/db";
import { SubjectT, SubjectTypeT } from "@/types/subject";

interface SubjectRow {
  id: string | number;
  user_id: string | number;
  name: string;
  address: string;
  subject_type_id: string | number;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getSubjectsByUserId(
  userId: number,
  since?: Date,
): Promise<SubjectT[]> {
  try {
    const query = since
      ? `SELECT id, user_id, name, address, subject_type_id, updated_at, deleted_at FROM public.subjects WHERE user_id = $1 AND updated_at > $2`
      : `SELECT id, user_id, name, address, subject_type_id, updated_at, deleted_at FROM public.subjects WHERE user_id = $1 AND deleted_at IS NULL`;

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
  subjectTypeId: number,
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO public.subjects 
        (name, user_id, address, subject_type_id) 
       VALUES ($1, $2, $3, $4) RETURNING id;`,
      [name, userId, address, subjectTypeId],
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  } catch (error) {
    console.error("Error in createSubject:", error);
    return null;
  }
}

export async function editSubject(
  subjectId: number,
  name: string,
  address: string,
  subjectTypeId: number,
): Promise<boolean> {
  try {
    const res = await pool.query(
      `UPDATE public.subjects SET name = $1, address = $2, subject_type_id = $3 WHERE id = $4 AND deleted_at IS NULL;`,
      [name, address, subjectTypeId, subjectId],
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
      [subjectId],
    );
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    console.error(`Error in deleteSubject ${subjectId}:`, error);
    return false;
  }
}

export async function getSubjectById(id: number): Promise<SubjectT | null> {
  try {
    const res: QueryResult<SubjectRow> = await pool.query(
      "SELECT id, user_id, name, address, subject_type_id, updated_at, deleted_at FROM public.subjects WHERE id = $1 AND deleted_at IS NULL LIMIT 1;",
      [id],
    );
    return res.rows[0] ? mapRowToSubject(res.rows[0]) : null;
  } catch (error) {
    console.error(`Error in getSubjectById ${id}:`, error);
    return null;
  }
}

function mapRowToSubject(row: SubjectRow): SubjectT {
  return {
    id: Number(row.id),
    user_id: Number(row.user_id),
    name: row.name,
    address: row.address,
    subject_type_id: Number(row.subject_type_id),
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}

// SUBJECT TYPES

interface SubjectTypeRow {
  id: string | number;
  name: string;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}

export async function getSubjectTypes(since?: Date): Promise<SubjectTypeT[]> {
  try {
    const query = since
      ? "SELECT id, name, updated_at, deleted_at FROM public.subject_types WHERE updated_at > $1 ORDER BY id ASC"
      : "SELECT id, name, updated_at, deleted_at FROM public.subject_types WHERE deleted_at IS NULL ORDER BY id ASC;";

    const params = since ? [since] : [];
    const res: QueryResult<SubjectTypeRow> = await pool.query(query, params);
    return res.rows.map(mapRowToSubjectType);
  } catch (error) {
    console.error("Error in getSubjectTypes:", error);
    return [];
  }
}

function mapRowToSubjectType(row: SubjectTypeRow): SubjectTypeT {
  return {
    id: Number(row.id),
    name: row.name,
    updated_at: new Date(row.updated_at),
    deleted_at: row.deleted_at ? new Date(row.deleted_at) : null,
  };
}
