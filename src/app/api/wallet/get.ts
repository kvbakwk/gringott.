import {
  BankWalletT,
  CashWalletT,
  getBankWalletsByUserId,
  getCashWalletByUserId,
} from "@app/utils/db-actions/wallet";

export async function getCashWallet(user_id: number): Promise<CashWalletT> {
  return await getCashWalletByUserId(user_id);
}

export async function getBankWallets(user_id: number): Promise<BankWalletT[]> {
  return await getBankWalletsByUserId(user_id);
}
