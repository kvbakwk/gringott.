"use server";

import { MethodT } from "@app/utils/db-actions/method";

import { getMethods} from "@app/utils/db-actions/method";

export async function getMethodsAPI(): Promise<MethodT[]> {
  return await getMethods();
}