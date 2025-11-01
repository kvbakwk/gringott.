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
  editTransfer,
  getTransferById,
} from "@app/utils/db-actions/transfer";

export default async function editTransferAPI(
  id: number,
  formData: FormData,
  date: Date
): Promise<{ errors?: Record<string, string[]> }> {
  if (!(await verifySession()).isAuth) return null;

  const transfer = await getTransferById(id);

  const validatedFields = NewTransferFormSchema.safeParse({
    fromWalletId: formData.get("fromWalletId")
      ? parseInt(formData.get("fromWalletId").toString())
      : NaN,
    amount: formData.get("amount")
      ? parseFloat(formData.get("amount").toString())
      : NaN,
    methodId: formData.get("methodId")
      ? parseInt(formData.get("methodId").toString())
      : NaN,
    toWalletId: formData.get("toWalletId")
      ? parseInt(formData.get("toWalletId").toString())
      : NaN,
  });

  console.log(validatedFields);

  if (!validatedFields.success)
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };

  const userId = (await verifySession()).userId;
  const { fromWalletId, amount, methodId, toWalletId } = validatedFields.data;

  await editTransfer(id, date, amount, fromWalletId, methodId, toWalletId);
  if (transfer.from_wallet_id === fromWalletId)
    decreaseWalletBalance(fromWalletId, amount - transfer.amount);
  else {
    increaseWalletBalance(transfer.from_wallet_id, transfer.amount);
    decreaseWalletBalance(fromWalletId, amount);
  }
  if (transfer.to_wallet_id === toWalletId)
    increaseWalletBalance(toWalletId, amount - transfer.amount);
  else {
    decreaseWalletBalance(transfer.to_wallet_id, transfer.amount);
    increaseWalletBalance(toWalletId, amount);
  }
}
