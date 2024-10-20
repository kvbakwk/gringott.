import { isWalletByUserId } from "@app/utils/db-actions/wallet";

export async function isWallet(user_id: number, cash: boolean) {
    return await isWalletByUserId(user_id, cash);
}

export async function isCashWallet(wallet_id: number) {
    return await isCashWallet(wallet_id);
}
