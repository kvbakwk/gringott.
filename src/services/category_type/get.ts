"use server";

import { verifySession } from "@utils/session";
import {
  CategoryTypeT,
  getCategoryTypes,
} from "@utils/db-actions/category";

export async function getCategoryTypesAPI(): Promise<CategoryTypeT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getCategoryTypes();
}
