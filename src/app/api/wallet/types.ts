"use server";

import { WalletTypeT, getWalletTypes as getWalletTypesAction } from "@app/utils/db-actions/wallet";
import { verifySession } from "@app/utils/session";

export async function getWalletTypes(): Promise<WalletTypeT[]> {
  if (!(await verifySession()).isAuth) return [];
  return await getWalletTypesAction();
}
