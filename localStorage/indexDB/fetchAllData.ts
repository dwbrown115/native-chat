export default function fetchAllData(
  databaseName: string,
  storeName: string,
  indexName: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    console.log(request, "Request");

    request.onerror = (event: Event) => {
      reject(
        `Error opening database: ${(event.target as IDBOpenDBRequest).error}`
      );
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log(db, "DB");

      // Start a read-only transaction and get the object store.
      try {
        const transaction = db.transaction(storeName, "readonly");
        console.log("Transaction: ", transaction);
        if (!transaction) {
          reject("Transaction not created");
          db.close();
          return;
        }
        const objectStore = transaction.objectStore(storeName);

        // Retrieve all data using the specified index.
        const data: any[] = [];
        const index = objectStore.index(indexName);

        const cursorRequest = index.openCursor();

        cursorRequest.onsuccess = (cursorEvent: Event) => {
          const cursor = (cursorEvent.target as IDBRequest<IDBCursorWithValue>)
            .result;
          if (cursor) {
            data.push(cursor.value);
            cursor.continue();
          } else {
            resolve(data);
            db.close();
          }
        };

        cursorRequest.onerror = (event: Event) => {
          reject(
            `Error fetching data: ${(event.target as IDBOpenDBRequest).error}`
          );
          db.close();
        };
      } catch (error) {
        reject(error);
        db.close();
      }
    };
  });
}
