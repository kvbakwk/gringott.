"use server";

import {
  decreaseWalletBalance,
  getWalletsByUserId,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import { createTrade } from "@app/utils/db-actions/trade";
import {
  validateTradeAmount,
  validateTradeAtm,
  validateTradeDate,
  validateTradeDeposit,
  validateTradeSubjectId,
  validateTradeSubjectMethodId,
  validateTradeUserMethodId,
  validateTradeWalletId,
} from "@app/utils/validator";
import { verifySession } from "@app/utils/session";
import { FormState, NewTransferFormSchema } from "@app/utils/definitions";
import z from "zod";
import {
  createTransfer,
  deleteTransfer,
  editTransfer,
  getTransferById,
} from "@app/utils/db-actions/transfer";

export default async function deleteTransferAPI(
  id: number
): Promise<{ errors?: Record<string, string[]> }> {
  if (!(await verifySession()).isAuth) return null;

  const transfer = await getTransferById(id);

  const userId = (await verifySession()).userId;

  await deleteTransfer(id);
  increaseWalletBalance(transfer.from_wallet_id, transfer.amount);
  decreaseWalletBalance(transfer.to_wallet_id, transfer.amount);
}
