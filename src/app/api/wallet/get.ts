"use server";

import { WalletT } from "@app/utils/db-actions/wallet";

import { getWalletsByUserId } from "@app/utils/db-actions/wallet";
import { verifySession } from "@app/utils/session";

export async function getWallets(userId: number): Promise<WalletT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getWalletsByUserId(userId);
}
