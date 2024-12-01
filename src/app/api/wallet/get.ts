import {
  WalletT,
  getWalletsByUserId,
} from "@app/utils/db-actions/wallet";

export async function getWallets(user_id: number): Promise<WalletT[]> {
  return await getWalletsByUserId(user_id);
}
