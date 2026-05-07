"use server";

import { TransferT } from "@utils/db-actions/transfer";

import { verifySession } from "@utils/session";
import { getTransfersByUserId } from "@utils/db-actions/transfer";

export async function getTransfers(userId: number): Promise<TransferT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getTransfersByUserId(userId);
}
