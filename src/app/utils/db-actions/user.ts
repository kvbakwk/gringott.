import { Pool, QueryResult } from "pg";

export interface UserT {
  id: number;
  name: string;
  email: string;
}

export interface UserIdT {
  id: number;
}

export async function getUserByUuid(uuid: string): Promise<UserT> {
  const client: Pool = new Pool();
  const res: QueryResult<UserT> = await client.query(
    "SELECT id, name, email FROM public.user JOIN public.user_device ON public.user.id = public.user_device.user_id WHERE public.user_device.device_id = $1",
    [uuid]
  );
  await client.end();
  return res.rows[0];
}

export async function validateUser(
  email: string,
  password: string
): Promise<number> {
  const client: Pool = new Pool();
  const res: QueryResult<UserIdT> = await client.query(
    "SELECT id FROM public.user WHERE email = $1 AND password = $2;",
    [email, password]
  );
  await client.end();
  if (res.rowCount === 1) return res.rows[0].id;
  return 0;
}

export async function isUserByEmail(email: string): Promise<boolean> {
  const client: Pool = new Pool();
  const res: QueryResult<UserIdT> = await client.query(
    "SELECT id FROM public.user WHERE name = $1;",
    [name]
  );
  await client.end();
  return res.rowCount === 1;
}

export async function createUser(name: string, email: string, password: string): Promise<void> {
  const client: Pool = new Pool();
  await client.query(
    "INSERT INTO public.user (name, email, password) VALUES ($1, $2, $3);",
    [name, email, password]
  );
  await client.end();
}
