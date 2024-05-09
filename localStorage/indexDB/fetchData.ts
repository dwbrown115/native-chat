export default function fetchData(
  databaseName: string,
  storeName: string,
  indexName: string,
  valueToFetch: string
  // callback: (data: any[]) => void
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);

    request.onerror = (event: Event) => {
      reject(
        `Error opening database: ${(event.target as IDBOpenDBRequest).error}`
      );
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // console.log("db", db);

      // Start a read-only transaction and get the object store.
      const transaction = db.transaction(storeName, "readonly");
      // console.log("transaction", transaction);
      const objectStore = transaction.objectStore(storeName);
      // console.log("objectStore", objectStore);

      // Retrieve all data using the specified index.
      // const data: any[] = [];
      const index = objectStore.index(indexName);
      // console.log("index", index);

      //   const searchRequest = index.getAll(valueToFetch);
      //   console.log("searchRequest", searchRequest);

      //   searchRequest.onsuccess = (event: Event) => {
      //     const result = (event.target as IDBRequest).result;
      //     console.log("result", result);
      //     //   callback(result);
      //     resolve(result);
      //     db.close();
      //   };

      //   searchRequest.onerror = (event: Event) => {
      //     reject(
      //       `Error fetching data: ${(event.target as IDBOpenDBRequest).error}`
      //     );
      //     db.close();
      //   };

      // const cursorRequest = index.openCursor();
      // console.log("cursorRequest", cursorRequest);

      // cursorRequest.onsuccess = (cursorEvent: Event) => {
      //   const cursor = (cursorEvent.target as IDBRequest<IDBCursorWithValue>)
      //     .result;
      //   console.log("cursor", cursor);
      //   if (cursor) {
      //     data.push(cursor.value);
      //     cursor.continue();
      //   } else {
      //     // All matching data fetched.
      //     //   callback(data);
      //     callback(data);
      //     db.close();
      //   }
      // };

      //   cursorRequest.onerror = (event: Event) => {
      //     reject(
      //       `Error fetching data: ${(event.target as IDBOpenDBRequest).error}`
      //     );
      //     db.close();
      //   };

      const cursorRequest = index.openCursor(IDBKeyRange.only(valueToFetch));
      cursorRequest.onsuccess = (cursorEvent: Event) => {
        const cursor = (cursorEvent.target as IDBRequest<IDBCursorWithValue>)
          .result;
        //   console.log("cursor", cursor);
        if (cursor) {
          // data.push(cursor.value);
          const data = cursor.value;
          resolve(data);
          db.close();
          // return cursor.value;
          // console.log("cursor.value", cursor.value);
          // cursor.continue();
        } else if (!cursor) {
          // console.log("No data found");
          // callback(null);
          reject("No data found");
          db.close();
        }
        //   else {
        //     // All data fetched.
        //     // console.log(callback(data));
        //     callback(data);
        //     db.close();
        //   }
      };
    };
  });
}
