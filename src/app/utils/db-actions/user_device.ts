import { QueryResult } from "pg";

import pool from "../db";

interface UserDeviceDateT {
  expireDate: Date;
}

export async function getUserDeviceDateByDeviceId(
  id: string
): Promise<UserDeviceDateT[]> {
  const res: QueryResult = await pool.query(
    "SELECT expire_date FROM public.user_device WHERE device_id = $1;",
    [id]
  );
  return res.rows.map(mapToUserDeviceDate);
}

export async function createUserDevice(
  userId: number,
  deviceId: string,
  expireDate: Date
): Promise<void> {
  await pool.query("INSERT INTO public.user_device VALUES ($1, $2, $3);", [
    userId,
    deviceId,
    expireDate,
  ]);
}
export async function deleteUserDevice(id: string): Promise<void> {
  await pool.query("DELETE FROM public.user_device WHERE device_id = $1;", [
    id,
  ]);
}

const mapToUserDeviceDate = (row: any): UserDeviceDateT => {
  return {
    expireDate: new Date(row.expire_date),
  };
};

