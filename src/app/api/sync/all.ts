"use server";

import { verifySession } from "@app/utils/session";
import { getWalletsByUserId, getWalletTypes } from "@app/utils/db-actions/wallet";
import { getTransactionsByUserId } from "@app/utils/db-actions/transaction";
import { getTradesByUserId } from "@app/utils/db-actions/trade";
import { getTransfersByUserId } from "@app/utils/db-actions/transfer";
import { getSubjectsByUserId } from "@app/utils/db-actions/subject";
import { getMethods } from "@app/utils/db-actions/method";
import { getCategories } from "@app/utils/db-actions/category";
import { getSuperCategories } from "@app/utils/db-actions/super_category";
import { getLoansByUserId } from "@app/utils/db-actions/loan";
import { getAssetsByUserId } from "@app/utils/db-actions/asset";

export async function syncAllAction(userId: number, since?: Date | null) {
  const session = await verifySession();
  if (!session.isAuth || session.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const resolvedSince = since ? new Date(since) : undefined;
  
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
    getWalletsByUserId(userId, resolvedSince),
    resolvedSince ? Promise.resolve([]) : getWalletTypes(),
    getTransactionsByUserId(userId),
    getTradesByUserId(userId),
    getTransfersByUserId(userId),
    getSubjectsByUserId(userId),
    resolvedSince ? Promise.resolve([]) : getMethods(),
    resolvedSince ? Promise.resolve([]) : getCategories(),
    resolvedSince ? Promise.resolve([]) : getSuperCategories(),
    getLoansByUserId(userId, resolvedSince),
    getAssetsByUserId(userId)
  ]);

  return {
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
  };
}
