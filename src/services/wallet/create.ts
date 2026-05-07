"use server";

import { createWallet } from "@utils/db-actions/wallet";
import { createTransaction } from "@utils/db-actions/transaction";
import {
  validateWalletBalance,
  validateWalletName,
} from "@utils/validator";
import { verifySession } from "@utils/session";

export async function createWalletAPI(
  name: string | null,
  balance: number,
  userId: number,
  walletTypeId: number,
  icon?: string,
  targetAmount?: number
) {
  if (!(await verifySession()).isAuth) return null;
  const nameErr = !validateWalletName(name);
  const balanceErr = !validateWalletBalance(balance);

  const isValid: boolean = !nameErr && !balanceErr;

  if (isValid) {
    const walletId = await createWallet(
      name || "Konto", 
      balance, 
      userId, 
      walletTypeId, 
      icon, 
      targetAmount
    );

    if (balance > 0)
      await createTransaction({
        date: new Date(new Date().getTime()),
        amount: balance,
        description: "-",
        category_id: 59,
        subject_id: 5,
        income: true,
        important: true,
        user_id: userId,
        wallet_id: walletId,
        method_id: 8,
        transaction_type_id: 5,
      });
  }

  return {
    createWallet: isValid,
    nameErr: nameErr,
    balanceErr: balanceErr,
  };
}
