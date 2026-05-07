"use server";

import { verifySession } from "@utils/session";
import { CategoryT, getCategories } from "@utils/db-actions/category";

export async function getCategoriessAPI(): Promise<CategoryT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getCategories();
}
