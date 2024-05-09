export default function deleteDataFromIndexedDB(
  databaseName: string,
  storeName: string,
  propertyName: string,
  valueToDelete: any
) {
  const request = indexedDB.open(databaseName, 1);

  request.onerror = (event: Event) => {
    console.error(
      "Error opening IndexedDB:",
      (event.target as IDBOpenDBRequest).error
    );
  };

  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;

    // Start a read-write transaction and get the object store.
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    // Create an index (if not already created) on the specified property.
    const index = objectStore.index(propertyName);

    // Use the index to find the record(s) with the specified value.
    const cursorRequest = index.openCursor(IDBKeyRange.only(valueToDelete));

    cursorRequest.onsuccess = (cursorEvent: Event) => {
      const cursor = (cursorEvent.target as IDBRequest<IDBCursorWithValue>)
        .result;
      if (cursor) {
        // Delete the record.
        cursor.delete();
        cursor.continue();
      } else {
        console.log(
          `Data with ${propertyName} "${valueToDelete}" deleted successfully!`
        );
        db.close();
      }
    };

    // Delete data based on the provided identifier.
    // const deleteRequest = objectStore.delete(identifier);

    // deleteRequest.onsuccess = () => {
    //   console.log(`Data with ID ${identifier} deleted successfully!`);
    //   db.close();
    // };

    // deleteRequest.onerror = (deleteEvent) => {
    //   if (deleteEvent.target instanceof IDBRequest) {
    //     console.error("Error deleting data:", deleteEvent.target.error);
    //   }
    // };
  };
}
