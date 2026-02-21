"use server";

import { deleteWallet } from "@app/utils/db-actions/wallet";

export async function deleteWalletAPI(walletId: number) {
  try {
    const success = await deleteWallet(walletId);
    return { success };
  } catch (error) {
    console.error("Failed to delete wallet:", error);
    return { success: false, error: "Database error" };
  }
}
