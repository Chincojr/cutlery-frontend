import Dexie from "dexie";

const indexedDBName = "UserInfo";

export const db = new Dexie(indexedDBName);

// Define the schema for the database
db.version(1).stores({
    User: '++id, *data', 
    PendingMessages: '++id, *data',
});

export async function DexieUpdateUserObject(data) {
    /*
        Clear the DB 
        Insert the new userObject as the first record in the IndexedDB User Table
    */
//    console.log(data,"This is the data");
    try {
        await db.User.clear()
        await db.User.put({id: 1, data});
        return true;
    } catch (error) {
        console.error(`Error updating user object :`, error);
        return false;
    }
}

export async function DexieGetUserObject() {
    try {
        const schedule = await db.User.get(1);
        // console.log(`UserObject retrieved:`, schedule.data);
        return schedule.data;
    } catch (error) {
        console.error(`Error retrieving userObject:`, error);
        return false;
    }
}





