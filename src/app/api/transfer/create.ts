"use server";

import z from "zod";

import { verifySession } from "@app/utils/session";
import { NewTransferFormSchema } from "@app/utils/definitions";
import {
  decreaseWalletBalance,
  increaseWalletBalance,
} from "@app/utils/db-actions/wallet";
import { createTransfer } from "@app/utils/db-actions/transfer";

export default async function createTransferAPI(
  formData: FormData
): Promise<{ errors?: Record<string, string[]> }> {
  if (!(await verifySession()).isAuth) return null;

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

  if (!validatedFields.success)
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };

  const userId = (await verifySession()).userId;
  const { fromWalletId, amount, methodId, toWalletId } = validatedFields.data;
  const date = new Date();

  await createTransfer(
    date,
    amount,
    userId,
    fromWalletId,
    methodId,
    toWalletId
  );
  increaseWalletBalance(toWalletId, amount);
  decreaseWalletBalance(fromWalletId, amount);
}
