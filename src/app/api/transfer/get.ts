"use server";

import { TransferT } from "@app/utils/db-actions/transfer";

import { verifySession } from "@app/utils/session";
import { getTransfersByUserId } from "@app/utils/db-actions/transfer";


export async function getTransfers(userId: number): Promise<TransferT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getTransfersByUserId(userId);
}
