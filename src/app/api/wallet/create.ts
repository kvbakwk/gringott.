"use server";

import { createWallet } from "@app/utils/db-actions/wallet";
import { createTransaction } from "@app/utils/db-actions/transaction";
import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";
import { verifySession } from "@app/utils/session";

export async function createWalletAPI(
  name: string | null,
  balance: number,
  userId: number,
  walletTypeId: number
) {
  if (!(await verifySession()).isAuth) return null;
  const nameErr = !validateWalletName(name);
  const balanceErr = !validateWalletBalance(balance);

  const isValid: boolean = !nameErr && !balanceErr;

  if (isValid) {
    const walletId = await createWallet(name, balance, userId, walletTypeId);

    if (balance > 0)
      await createTransaction(
        new Date(new Date().getTime()),
        balance,
        "-",
        59,
        5,
        true,
        true,
        userId,
        walletId,
        8,
        5
      );
  }

  return {
    createWallet: isValid,
    nameErr: nameErr,
    balanceErr: balanceErr,
  };
}
