"use server";

import { getUserById, UserT } from "@app/utils/db-actions/user";

import { verifySession } from "@app/utils/session";

export async function getUser(): Promise<UserT> {
  const session = await verifySession();
  if (!session.isAuth) return null;
  return await getUserById(session.userId.toString());
}
