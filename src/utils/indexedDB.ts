export const DB_NAME = "GringottDB";
export const DB_VERSION = 7;

export const STORES = {
    TRANSACTIONS: "transactions",
    TRANSACTION_TYPES: "transaction_types",
    WALLETS: "wallets",
    WALLET_TYPES: "wallet_types",
    WALLET_BANK_DETAILS: "wallet_bank_details",
    WALLET_GOAL_DETAILS: "wallet_goal_details",
    TRADES: "trades",
    TRANSFERS: "transfers",
    SUBJECTS: "subjects",
    SUBJECT_TYPES: "subject_types",
    METHODS: "methods",
    CATEGORIES: "categories",
    CATEGORY_TYPES: "category_types",
    LOANS: "loans",
    META: "meta",
    ASSETS: "assets",
    ASSET_TYPES: "asset_types",
};

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            reject("IndexedDB error: " + (event.target as any).error);
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
                db.createObjectStore(STORES.TRANSACTIONS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.TRANSACTION_TYPES)) {
                db.createObjectStore(STORES.TRANSACTION_TYPES, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.WALLETS)) {
                db.createObjectStore(STORES.WALLETS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.WALLET_TYPES)) {
                db.createObjectStore(STORES.WALLET_TYPES, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.WALLET_BANK_DETAILS)) {
                db.createObjectStore(STORES.WALLET_BANK_DETAILS, { keyPath: "wallet_id" });
            }
            if (!db.objectStoreNames.contains(STORES.WALLET_GOAL_DETAILS)) {
                db.createObjectStore(STORES.WALLET_GOAL_DETAILS, { keyPath: "wallet_id" });
            }
            if (!db.objectStoreNames.contains(STORES.TRADES)) {
                db.createObjectStore(STORES.TRADES, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.TRANSFERS)) {
                db.createObjectStore(STORES.TRANSFERS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.SUBJECTS)) {
                db.createObjectStore(STORES.SUBJECTS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.SUBJECT_TYPES)) {
                db.createObjectStore(STORES.SUBJECT_TYPES, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.METHODS)) {
                db.createObjectStore(STORES.METHODS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
                db.createObjectStore(STORES.CATEGORIES, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.CATEGORY_TYPES)) {
                db.createObjectStore(STORES.CATEGORY_TYPES, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.LOANS)) {
                db.createObjectStore(STORES.LOANS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.META)) {
                db.createObjectStore(STORES.META, { keyPath: "key" });
            }
            if (!db.objectStoreNames.contains(STORES.ASSETS)) {
                db.createObjectStore(STORES.ASSETS, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(STORES.ASSET_TYPES)) {
                db.createObjectStore(STORES.ASSET_TYPES, { keyPath: "id" });
            }
        };
    });
}

export function putItems(storeName: string, items: any[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);

            items.forEach((item) => {
                store.put(item);
            });

            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = (event) => {
                reject("Put error: " + (event.target as any).error);
            };
        } catch (e) {
            reject(e);
        }
    });
}

export function deleteItems(storeName: string, ids: number[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);

            ids.forEach((id) => {
                store.delete(id);
            });

            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = (event) => {
                reject("Delete error: " + (event.target as any).error);
            };
        } catch (e) {
            reject(e);
        }
    });
}

export function getAllItems<T>(storeName: string): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as T[]);
            };
            request.onerror = (event) => {
                reject("GetAll error: " + (event.target as any).error);
            };
        } catch (e) {
            reject(e);
        }
    });
}

export function getLastSyncTime(): Promise<Date | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([STORES.META], "readonly");
            const store = transaction.objectStore(STORES.META);
            const request = store.get("lastSync");

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };
            request.onerror = (event) => {
                reject("GetLastSync error: " + (event.target as any).error);
            };
        } catch (e) {
            reject(e);
        }
    });
}

export function setLastSyncTime(date: Date): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([STORES.META], "readwrite");
            const store = transaction.objectStore(STORES.META);
            store.put({ key: "lastSync", value: date });

            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = (event) => {
                reject("SetLastSync error: " + (event.target as any).error);
            };
        } catch (e) {
            reject(e);
        }
    });
}
