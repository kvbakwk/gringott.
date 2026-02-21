import { getAllItems, putItems, getLastSyncTime, setLastSyncTime, STORES } from "./indexedDB";
import { syncAllAction } from "@app/api/sync/all"; 

export const syncData = async (userId: number) => {
    try {
        const lastSync = await getLastSyncTime();
        
        const data = await syncAllAction(userId, lastSync);

        if (data.wallets && data.wallets.length > 0) await putItems(STORES.WALLETS, data.wallets);
        if (data.walletTypes && data.walletTypes.length > 0) await putItems(STORES.WALLET_TYPES, data.walletTypes);
        if (data.transactions && data.transactions.length > 0) await putItems(STORES.TRANSACTIONS, data.transactions);
        if (data.trades && data.trades.length > 0) await putItems(STORES.TRADES, data.trades);
        if (data.transfers && data.transfers.length > 0) await putItems(STORES.TRANSFERS, data.transfers);
        if (data.subjects && data.subjects.length > 0) await putItems(STORES.SUBJECTS, data.subjects);
        if (data.methods && data.methods.length > 0) await putItems(STORES.METHODS, data.methods);
        if (data.categories && data.categories.length > 0) await putItems(STORES.CATEGORIES, data.categories);
        if (data.superCategories && data.superCategories.length > 0) await putItems(STORES.SUPER_CATEGORIES, data.superCategories);
        if (data.loans && data.loans.length > 0) await putItems(STORES.LOANS, data.loans);
        if (data.assets && data.assets.length > 0) await putItems(STORES.ASSETS, data.assets);

        await setLastSyncTime(new Date());
    } catch (e) {
        console.error("sync error:", e);
    }
};
