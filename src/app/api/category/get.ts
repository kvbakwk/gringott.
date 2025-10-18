"use server";

import { verifySession } from "@app/utils/session";
import { CategoryT, getCategories } from "@app/utils/db-actions/category";

export async function getCategoriessAPI(): Promise<CategoryT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getCategories();
}
