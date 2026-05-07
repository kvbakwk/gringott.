import { putItems, deleteItems, getLastSyncTime, setLastSyncTime, STORES } from "./indexedDB";
import { syncAllAction } from "@services/sync/all"; 

const processStoreSync = async (storeName: string, items: any[]) => {
    if (!items || items.length === 0) return;
    
    // items with deleted_at are removed from IndexedDB
    const toPut = items.filter(i => !i.deleted_at);
    const toDeleteIds = items.filter(i => i.deleted_at).map(i => i.id);

    if (toPut.length > 0) await putItems(storeName, toPut);
    if (toDeleteIds.length > 0) await deleteItems(storeName, toDeleteIds);
};

export const syncData = async () => {
    try {
        const lastSync = await getLastSyncTime();
        
        // Call the server action. It handles auth via session internally.
        const response = await syncAllAction(lastSync);

        if (!response.success || !response.data) {
            console.error("Sync failed:", response.error);
            return;
        }

        const { data } = response;

        // Process all stores in parallel
        await Promise.all([
            processStoreSync(STORES.WALLETS, data.wallets),
            processStoreSync(STORES.WALLET_TYPES, data.walletTypes),
            processStoreSync(STORES.TRANSACTIONS, data.transactions),
            processStoreSync(STORES.TRADES, data.trades),
            processStoreSync(STORES.TRANSFERS, data.transfers),
            processStoreSync(STORES.SUBJECTS, data.subjects),
            processStoreSync(STORES.METHODS, data.methods),
            processStoreSync(STORES.CATEGORIES, data.categories),
            processStoreSync(STORES.SUPER_CATEGORIES, data.superCategories),
            processStoreSync(STORES.LOANS, data.loans),
            processStoreSync(STORES.ASSETS, data.assets)
        ]);

        // Save the timestamp returned by the server as the new lastSync point
        await setLastSyncTime(data.timestamp);
    } catch (e) {
        console.error("sync error:", e);
    }
};
