"use server";

import { verifySession } from "@utils/session";
import { getWalletsByUserId, getWalletTypes } from "@utils/db-actions/wallet";
import { getTransactionsByUserId } from "@utils/db-actions/transaction";
import { getTradesByUserId } from "@utils/db-actions/trade";
import { getTransfersByUserId } from "@utils/db-actions/transfer";
import { getSubjectsByUserId } from "@utils/db-actions/subject";
import { getMethods } from "@utils/db-actions/method";
import { getCategories } from "@utils/db-actions/category";
import { getSuperCategories } from "@utils/db-actions/super_category";
import { getLoansByUserId } from "@utils/db-actions/loan";
import { getAssetsByUserId } from "@utils/db-actions/asset";

export async function syncAllAction(lastSync?: string | null) {
  const session = await verifySession();
  if (!session.isAuth) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.userId);
  const since = lastSync ? new Date(lastSync) : undefined;
  const currentSyncTimestamp = new Date().toISOString();

  try {
    const [
      wallets,
      walletTypes,
      transactions,
      trades,
      transfers,
      subjects,
      methods,
      categories,
      superCategories,
      loans,
      assets
    ] = await Promise.all([
      getWalletsByUserId(userId, since),
      getWalletTypes(since),
      getTransactionsByUserId(userId, since),
      getTradesByUserId(userId, since),
      getTransfersByUserId(userId, since),
      getSubjectsByUserId(userId, since),
      getMethods(since),
      getCategories(since),
      getSuperCategories(since),
      getLoansByUserId(userId, since),
      getAssetsByUserId(userId, since)
    ]);

    return {
      success: true,
      data: {
        wallets,
        walletTypes,
        transactions,
        trades,
        transfers,
        subjects,
        methods,
        categories,
        superCategories,
        loans,
        assets,
        timestamp: currentSyncTimestamp
      }
    };
  } catch (error) {
    console.error("Critical Sync Error:", error);
    return {
      success: false,
      error: "Failed to synchronize data with server"
    };
  }
}
