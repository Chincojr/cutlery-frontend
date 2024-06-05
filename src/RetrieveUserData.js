import { db } from "./DexieDb";
import Dexie from "dexie";

export const DexieGetUserInfo = async(uid,adminUid) => {
    try {
      const params = new URLSearchParams({
        uid,
        adminUid
      });
      let userRecords = await fetch(`${process.env.REACT_APP_API_URL}/sw?${params}`)
  
      if(!userRecords.ok) {
        console.log("Error while retriviing user info from backend");
        return false;
      }
      let userRecordsJson = await userRecords.json()
      
      console.log(userRecordsJson);
      const DBToUpdate = ["Event","Reminders","Notify","Seen"];
      const updateDB = DBToUpdate.map(async (dbName) => {
          try {
              console.log(dbName,userRecordsJson[dbName]);
              await db[dbName].clear()
              await db[dbName].bulkPut(userRecordsJson[dbName]);
              return true
          } catch (error) {
              if (error instanceof Dexie.BulkError) {
              console.error(`Some ${dbName} were not added: ${error.failures.length} failures.` , error);
              } else {
                  console.error('Unexpected error:', error);
              }
              return false
          }
      });
  
      // Await all promises using Promise.all
      const updateValue = await Promise.all(updateDB);
      console.log("Retrieve user info and store in DB response : ",updateValue);
      return true
    } catch (error) {
      console.error('Error adding events to the database:', error);
      return false
    }
  }