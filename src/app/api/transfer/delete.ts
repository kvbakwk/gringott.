"use server";

import { verifySession } from "@app/utils/session";
import {
  decreaseWalletBalance,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import {
  deleteTransfer,
  getTransferById,
} from "@app/utils/db-actions/transfer";

export default async function deleteTransferAPI(
  id: number
): Promise<{ errors?: Record<string, string[]> }> {
  if (!(await verifySession()).isAuth) return null;

  const transfer = await getTransferById(id);

  await deleteTransfer(id);
  increaseWalletBalance(transfer.from_wallet_id, transfer.amount);
  decreaseWalletBalance(transfer.to_wallet_id, transfer.amount);
}
