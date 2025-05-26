"use server";

import { createWallet } from "@app/utils/db-actions/wallet";
import { createTransaction } from "@app/utils/db-actions/transaction";
import {
  validateWalletBalance,
  validateWalletName,
} from "@app/utils/validator";

export async function createWalletAPI(
  name: string | null,
  balance: number,
  userId: number,
  walletTypeId: number
) {
  const isValid: boolean =
    name !== null && validateWalletName(name) && validateWalletBalance(balance);

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
    nameErr: !(name !== null && validateWalletName(name)),
    balanceErr: !validateWalletBalance(balance),
  };
}
