"use server";

import { WalletT } from "@/types/wallet";

import { getWalletsByUserId } from "@utils/db-actions/wallet";
import { verifySession } from "@utils/session";

export async function getWallets(userId: number): Promise<WalletT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getWalletsByUserId(userId);
}
