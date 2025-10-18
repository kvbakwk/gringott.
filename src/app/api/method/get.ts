"use server";

import { verifySession } from "@app/utils/session";

import { MethodT } from "@app/utils/db-actions/method";

import { getMethods } from "@app/utils/db-actions/method";

export async function getMethodsAPI(): Promise<MethodT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getMethods();
}
