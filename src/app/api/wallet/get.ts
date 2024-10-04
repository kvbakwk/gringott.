import { getBankWalletsByUserId, getCashWalletByUserId } from "@app/utils/db-actions/wallet";

export async function getCashWallet(user_id: number) {
    return await getCashWalletByUserId(user_id);
}

export async function getBankWallets(user_id: number) {
    return await getBankWalletsByUserId(user_id);
}
