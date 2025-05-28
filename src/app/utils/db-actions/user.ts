"use server";

import { QueryResult } from "pg";

import pool from "../db";

export interface UserT {
  id: number;
  name: string;
  email: string;
}

export interface UserIdT {
  id: number;
}

export async function getUserByUuid(uuid: string): Promise<UserT> {
  const res: QueryResult = await pool.query(
    "SELECT id, name, email FROM public.user JOIN public.user_device ON public.user.id = public.user_device.user_id WHERE public.user_device.device_id = $1",
    [uuid]
  );
  return mapRowToUser(res.rows[0]);
}
export async function getUsersIdsByEmail(email: string): Promise<UserIdT[]> {
  const res: QueryResult = await pool.query(
    "SELECT id FROM public.user WHERE email = $1;",
    [email]
  );
  return res.rows.map(mapRowToUserId);
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<UserIdT> {
  const res: QueryResult = await pool.query(
    "INSERT INTO public.user (name, email, password) VALUES ($1, $2, $3) RETURNING id;",
    [name, email, password]
  );
  return mapRowToUserId(res.rows[0]);
}

export async function validateUser(
  email: string,
  password: string
): Promise<number> {
  const res: QueryResult<UserIdT> = await pool.query(
    "SELECT id FROM public.user WHERE email = $1 AND password = $2;",
    [email, password]
  );
  if (res.rowCount === 1) return res.rows[0].id;
  return 0;
}

function mapRowToUser(row: any): UserT {
  return {
    id: parseInt(row.id),
    name: row.name,
    email: row.email,
  };
}
function mapRowToUserId(row: any): UserIdT {
  return {
    id: parseInt(row.id),
  };
}
