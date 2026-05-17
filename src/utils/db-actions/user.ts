"use server";

import bcrypt from "bcryptjs";
import { QueryResult } from "pg";

import pool from "@/utils/db";
import { UserT, UserIdT } from "@/types/user";

interface UserRow {
  id: string | number;
  name: string;
  email: string;
  password?: string;
}

export async function getUserById(id: string | number): Promise<UserT | null> {
  try {
    const res: QueryResult<UserRow> = await pool.query(
      "SELECT id, name, email FROM public.users WHERE public.users.id = $1 AND deleted_at IS NULL",
      [id],
    );
    return res.rows[0] ? mapRowToUser(res.rows[0]) : null;
  } catch (error) {
    console.error(`Error in getUserById for id ${id}:`, error);
    return null;
  }
}

export async function getUsersIdsByEmail(email: string): Promise<UserIdT[]> {
  try {
    const res: QueryResult<{ id: string | number }> = await pool.query(
      "SELECT id FROM public.users WHERE email = $1 AND deleted_at IS NULL;",
      [email],
    );
    return res.rows.map((row) => ({ id: Number(row.id) }));
  } catch (error) {
    console.error(`Error in getUsersIdsByEmail for email ${email}:`, error);
    return [];
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<UserIdT | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res: QueryResult<{ id: string | number }> = await pool.query(
      "INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3) RETURNING id;",
      [name, email, hashedPassword],
    );
    return res.rows[0] ? { id: Number(res.rows[0].id) } : null;
  } catch (error) {
    console.error("Error in createUser:", error);
    return null;
  }
}

export async function validateUser(
  email: string,
  password: string,
): Promise<number> {
  try {
    const res: QueryResult<UserRow> = await pool.query(
      "SELECT id, password FROM public.users WHERE email = $1 AND deleted_at IS NULL;",
      [email],
    );
    if (res.rowCount === 1) {
      const user = res.rows[0];
      if (user.password) {
        const match = await bcrypt.compare(password, user.password);
        if (match) return Number(user.id);
      }
    }
    return 0;
  } catch (error) {
    console.error(`Error in validateUser for email ${email}:`, error);
    return 0;
  }
}

export async function deleteUser(id: number): Promise<number> {
  try {
    const res = await pool.query(
      "UPDATE public.users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;",
      [id],
    );
    return res.rowCount ?? 0;
  } catch (error) {
    console.error(`Error in deleteUser for id ${id}:`, error);
    return 0;
  }
}

function mapRowToUser(row: UserRow): UserT {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
  };
}
