import { Pool, QueryResult } from "pg";

interface UserDeviceDateT {
  expireDate: Date;
}

export async function getUserDeviceByDeviceId(
  id: string
): Promise<UserDeviceDateT[]> {
  const client: Pool = new Pool();
  const res: QueryResult<UserDeviceDateT> = await client.query(
    "SELECT expire_date FROM public.user_device WHERE device_id = $1;",
    [id]
  );
  await client.end();
  return res.rows;
}

export async function createUserDevice(
  userId: number,
  deviceId: string,
  expireDate: Date
): Promise<void> {
  const client: Pool = new Pool();
  await client.query("INSERT INTO public.user_device VALUES ($1, $2, $3);", [
    userId,
    deviceId,
    expireDate,
  ]);
  await client.end();
}

export async function deleteUserDeviceByDeviceId(id: string): Promise<void> {
  const client: Pool = new Pool();
  await client.query("DELETE FROM public.user_device WHERE device_id = $1;", [
    id,
  ]);
  await client.end();
}

