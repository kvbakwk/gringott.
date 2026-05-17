"use server";

import { UserT } from "@/types/user";

import { getUserById } from "@utils/db-actions/user";
import { verifySession } from "@utils/session";

export async function getUser(): Promise<UserT> {
  const session = await verifySession();
  if (!session.isAuth) return null;
  return await getUserById(session.userId.toString());
}
