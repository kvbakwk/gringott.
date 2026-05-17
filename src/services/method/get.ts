"use server";

import { verifySession } from "@utils/session";

import { MethodT } from "@/types/method";

import { getMethods } from "@utils/db-actions/method";

export async function getMethodsAPI(): Promise<MethodT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getMethods();
}
