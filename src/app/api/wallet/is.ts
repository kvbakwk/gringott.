import { isUserHaveWalletByUserId } from "@app/utils/db-actions/wallet";

export async function isUserHaveWallet(user_id: number, cash: boolean) {
    return await isUserHaveWalletByUserId(user_id, cash);
}
