import Dexie from "dexie";

const indexedDBName = "UserInfo";

export const db = new Dexie(indexedDBName);

// Define the schema for the database
db.version(1).stores({
    Event: '++id, *data', 
    Notify: '++id, *data', 
    Reminders: '++id, *data', 
    Seen: '++id, *data'
});

export async function DexieGet(table) {
    try {
        const schedule = await db[table].toArray();
        console.log(`All ${table} schedules retrieved successfully:`, schedule);
        return schedule;
    } catch (error) {
        console.error(`Error retrieving ${table} schedules:`, error);
        return false;
    }
}


export async function DexieGetGroups() {
    try {
        const groups = await db.Groups.toArray();
        console.log(`All groups 123 retrieved successfully:`, groups);
        return groups;
    } catch (error) {
        console.error('Error 123 retrieving groups:', error);
        return false;
    }
}


export async function DexieSpecificGet(table, systemID) {
    try {
        const tableInfo = await db[table].filter(obj => {
            if (obj.systemID === systemID) {
                return obj
            }
            
        }).toArray();

        console.log(`All ${table} schedules retrieved successfully:`, tableInfo);
        return tableInfo;
    } catch (error) {
        console.error(`Error retrieving ${table} schedules:`, error);
        return false;
    }
}




