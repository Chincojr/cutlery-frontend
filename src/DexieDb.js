import Dexie from "dexie";

const indexedDBName = "UserInfo";

export const db = new Dexie(indexedDBName);

// Define the schema for the database
db.version(1).stores({
    User: '++id, *data', 
});

export async function DexieUpdateUserObject(data) {
    /*
        Clear the DB 
        Insert the new userObject as the first record in the IndexedDB User Table
    */
   console.log(data,"This is the data");
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
        console.log(`UserObject retrieved:`, schedule.data);
        return schedule.data;
    } catch (error) {
        console.error(`Error retrieving userObject:`, error);
        return false;
    }
}

export async function DexieGet(table) {
    try {
        const schedule = await db.User.get(1);
        console.log(`All ${table} schedules retrieved successfully:`, schedule.data[table]);
        return schedule.data[table];
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


export async function DexieUpdateUserInformation(updateUserID,updateKey,updateValues) {

    /*
        Retrieve the user Object
        Select the corresponding object for the updateUserID from the Users Information
        Replace the corresponding value of the updatekey from the updateUserID object to the updateValues
        Replace the old user Object with the new
    */

    try {
        console.log("Updating user information");
        const userObject = await db.User.get(1);

        let newUserObject = {
            ...userObject.data,
            UsersInformation : {
                ...userObject.data.UsersInformation,
                [updateUserID]: {
                    ...userObject.data.UsersInformation[updateUserID], 
                    [updateKey]:updateValues
                }
            }
        }
        console.log({newUserObject});
        await db.User.put({id: 1, data:newUserObject});
        console.log(`User Object updated`, newUserObject );
        return true;
    } catch (error) {
        console.error(`Error updating userObject ${updateUserID} :`, error);
        return false;
    }
}


export async function DexieUpdateAdmin(updateKey,updateValues) {

    /*
        Retrieve the user Object
        Select the corresponding object for the updateUserID from the Users Information
        Replace the corresponding value of the updatekey from the updateUserID object to the updateValues
        Replace the old user Object with the new
    */

    try {
        const userObject = await db.User.get(1);

        let newUserObject = {
            ...userObject.data,
            Admin: {
                ...userObject.data.Admin, 
                [updateKey]:updateValues
            }
        }
        await db.User.put({id: 1, data:newUserObject});
        console.log(`Admin Object updated`, newUserObject );
        return true;
    } catch (error) {
        console.error(`Error updating admin object `, error);
        return false;
    }
}













