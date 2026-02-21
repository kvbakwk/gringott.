"use server";

import { updateWallet } from "@app/utils/db-actions/wallet";
import { validateWalletName } from "@app/utils/validator";
import { verifySession } from "@app/utils/session";

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
