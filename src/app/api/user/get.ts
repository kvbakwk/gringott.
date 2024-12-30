"use server";

import { UserT } from "@app/utils/db-actions/user";

import { cookies } from "next/headers";

import { getUserByUuid } from "@app/utils/db-actions/user";

export async function getUser(): Promise<UserT> {
  return await getUserByUuid((await cookies()).get("device_id").value);
}
