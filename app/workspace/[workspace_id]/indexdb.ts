import { FabricObject } from "fabric";

interface IDBInterface {
   db: IDBDatabase;
}
class IndexDB {
   storename = "records";
   db: IDBDatabase;

   constructor({ db }: IDBInterface) {
      this.db = db;
   }

   _start_transaction() {
      const transation = this.db.transaction(this.storename, "readwrite");
      const store = transation.objectStore(this.storename);
      return store;
   }

   newShape(pageId: string, obj: FabricObject) {
      const transation = this.db.transaction(this.storename, "readwrite");
      const store = transation.objectStore(this.storename);

      const req = store.put({
         ...obj,
         page_id: pageId,
      });
      req.onerror = (e) => {
         console.log(e);
         // throw new Error()
      };
   }

   newPage(pageId: string, name: string) {
      const store = this._start_transaction();

      // Request to get the page by pageId
      const request = store.get(pageId);

      request.onsuccess = () => {
         // If the page does not exist (result is undefined), add it
         if (request.result === undefined) {
            store.put({
               id: pageId,
               name,
            });
            console.log(`Page ${pageId} created with name ${name}`);
         } else {
            console.log(`Page ${pageId} already exists`);
         }
      };

      request.onerror = (e) => {
         console.error("Error occurred while checking the page:", e);
      };
   }

   getAllPages() {
      const store = this._start_transaction();

      const range = IDBKeyRange.bound("page:", "page:" + "\uFFFF");
      const request = store.openCursor(range);

      request.onsuccess = (e) => {
         const cursor = (e.target as IDBRequest).result;
         // If there are matching records
         if (cursor) {
            const page = cursor.value; // The record for this cursor iteration
            console.log(`Found page:`, page); // You can do anything with the page here

            // Move to the next record
            cursor.continue();
         } else {
            console.log("No more pages found.");
         }

         request.onerror = (e) => {
            console.error("Error occurred while retrieving pages:", e);
         };
      };
   }
}

export default IndexDB;
