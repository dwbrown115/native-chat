export default async function indexedDBStoreData(
  databaseName: string,
  storeName: string,
  indexName: string,
  data: any
) {
  const request = indexedDB.open(databaseName, 1);

  request.onerror = (event: Event) => {
    console.log(
      "Error opening indexedDB:",
      (event.target as IDBOpenDBRequest).error
    );
  };

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBOpenDBRequest).result;

    // Create an object store (similar to a table) to store data.
    const objectStore = db.createObjectStore(storeName, {
      keyPath: "id",
      autoIncrement: true,
    });

    // Define an index for efficient querying.
    objectStore.createIndex(indexName, indexName, { unique: false });
  };

  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBOpenDBRequest).result;

    // Start a transaction and get the object store.
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    // Add data to the object store.
    data.forEach((item: any) => {
      objectStore.add(item);
    });

    transaction.oncomplete = () => {
      console.log("Data stored successfully!");
      db.close();
    };
  };
}
