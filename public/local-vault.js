/* Local-first durable store. localStorage remains a compatibility mirror while
 * existing synchronous UI code is progressively moved to IndexedDB. */
(function attachLocalVault(global) {
  const DB_NAME = "khoan-da-local-vault";
  const STORE = "records";
  const MIGRATION_KEY = "khoan-da:local-vault-migrated-v1";
  let dbPromise;

  function open() {
    if (!global.indexedDB) return Promise.resolve(null);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = global.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: "key" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function write(key, value) {
    const db = await open();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).put({ key, value, updatedAt: new Date().toISOString() });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function remove(key) {
    const db = await open();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).delete(key);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function migrate(keys) {
    if (!global.indexedDB || global.localStorage.getItem(MIGRATION_KEY) === "1") return;
    for (const key of keys) {
      const value = global.localStorage.getItem(key);
      if (value !== null) await write(key, value);
    }
    global.localStorage.setItem(MIGRATION_KEY, "1");
  }

  global.KhoanDaLocalVault = { write, remove, migrate, version: 1 };
})(window);
