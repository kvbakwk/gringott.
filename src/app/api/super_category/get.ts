"use server";

import { verifySession } from "@app/utils/session";
import {
  SuperCategoryT,
  getSuperCategories,
} from "@app/utils/db-actions/super_category";

export async function getSuperCategoriesAPI(): Promise<SuperCategoryT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getSuperCategories();
}
