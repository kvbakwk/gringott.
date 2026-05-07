"use server";

import { updateWallet } from "@utils/db-actions/wallet";
import { validateWalletName } from "@utils/validator";
import { verifySession } from "@utils/session";

export async function updateWalletAPI(
  walletId: number,
  name: string,
  icon?: string,
  targetAmount?: number
) {
  if (!(await verifySession()).isAuth) return null;
  
  const nameErr = !validateWalletName(name);

  if (!nameErr) {
    const success = await updateWallet(walletId, name, icon, targetAmount);
    return {
      success,
      nameErr: false,
    };
  }

  return {
    success: false,
    nameErr: true,
  };
}
