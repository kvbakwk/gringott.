import { Pool, QueryResult } from "pg";

export async function getUserByUuid(uuid: string) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      "SELECT id, name, email FROM public.user JOIN public.user_device ON public.user.id = public.user_device.user_id WHERE public.user_device.device_id = $1",
      [uuid]
    );
    await client.end();
    return res.rows[0];
}