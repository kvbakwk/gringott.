"use server";

import { verifySession } from "@utils/session";
import { getWalletsByUserId, getWalletTypes } from "@utils/db-actions/wallet";
import { getTransactionsByUserId, getTransactionTypes } from "@utils/db-actions/transaction";
import { getTradesByUserId } from "@utils/db-actions/trade";
import { getTransfersByUserId } from "@utils/db-actions/transfer";
import { getSubjectsByUserId, getSubjectTypes } from "@utils/db-actions/subject";
import { getMethods } from "@utils/db-actions/method";
import { getCategories, getCategoryTypes } from "@utils/db-actions/category";
import { getLoansByUserId } from "@utils/db-actions/loan";
import { getAssetsByUserId, getAssetTypes } from "@utils/db-actions/asset";

export async function syncAllAction(lastSync?: Date | null) {
  const session = await verifySession();
  if (!session.isAuth) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.userId);
  const since = lastSync ? lastSync : undefined;
  const currentSyncTimestamp = new Date().toISOString();

  try {
    const [
      wallets,
      walletTypes,
      transactions,
      transactionTypes,
      trades,
      transfers,
      subjects,
      subjectTypes,
      methods,
      categories,
      categoryTypes,
      loans,
      assets,
      assetTypes
    ] = await Promise.all([
      getWalletsByUserId(userId, since),
      getWalletTypes(since),
      getTransactionsByUserId(userId, since),
      getTransactionTypes(since),
      getTradesByUserId(userId, since),
      getTransfersByUserId(userId, since),
      getSubjectsByUserId(userId, since),
      getSubjectTypes(since),
      getMethods(since),
      getCategories(since),
      getCategoryTypes(since),
      getLoansByUserId(userId, since),
      getAssetsByUserId(userId, since),
      getAssetTypes(since)
    ]);

    return {
      success: true,
      data: {
        wallets,
        walletTypes,
        transactions,
        transactionTypes,
        trades,
        transfers,
        subjects,
        subjectTypes,
        methods,
        categories,
        categoryTypes,
        loans,
        assets,
        assetTypes,
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
