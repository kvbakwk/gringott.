"use server";

import { WalletT } from "@app/utils/db-actions/wallet";

import { getWalletsByUserId } from "@app/utils/db-actions/wallet";

export async function getWallets(userId: number): Promise<WalletT[]> {
  return await getWalletsByUserId(userId);
}
