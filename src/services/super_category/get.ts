"use server";

import { verifySession } from "@utils/session";
import {
  SuperCategoryT,
  getSuperCategories,
} from "@utils/db-actions/super_category";

export async function getSuperCategoriesAPI(): Promise<SuperCategoryT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getSuperCategories();
}
