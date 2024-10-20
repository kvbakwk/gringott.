import { cookies } from "next/headers";

import { UserT, getUserByUuid } from "@app/utils/db-actions/user";

export async function getUser(): Promise<UserT> {
  return await getUserByUuid(cookies().get("device_id").value);
}
