import { DexieUpdateAdmin, DexieUpdateAdminAndUserObject, DexieUpdateUserInformation, DexieUpdateUserObject } from "./DexieDb";
import { DeleteMessageFromLocalStorage } from "./UtilityFunctions";

var socket

export function WSConnect(log,isAdmin,id,HandleLogged, HandleAdmin, HandleLoading, setUpdateCount, setUserID, setOnlineUsers) {
    /*
        Retrieve user information
        And authorize based on the user data
        IF error while authenticating or connection error 
            do not authorize
        Disable the loading screen
    */

    if (!id) {
        console.log("Error invalid parameters");
        return
    }

    socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET}?systemID=${id}&admin=${isAdmin}&log=${log}`);

    socket.onopen = async function(event) { // Handle connection success
        console.log('WebSocket connected');
        WSMessage(HandleLogged,HandleAdmin,HandleLoading,isAdmin, setUpdateCount, setUserID, id,setOnlineUsers);
        window.addEventListener('beforeunload', WSClose);

    };

    WSError(HandleLoading) // Handle Connection Error
                
}

export function WSError (HandleLoading){
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
        socket.close();
        HandleLoading(false);
    };
}


export function WSClose () {
    if (socket) {
        socket.onclose = function(event) {
            console.log('WebSocket closed:', event);
            socket.close();
        };
    }

}

export function WSMessage(HandleLogged,HandleAdmin,HandleLoading,isAdmin, setUpdateCount,setUserID,id,setOnlineUsers) {
    socket.onmessage = async function(event) {
        // console.log('Message received:', event.data, typeof event.data, JSON.parse(event.data));

        let data = JSON.parse(event.data);

        console.log(data, data.type);
        console.log(data.message)

        switch (data.type) {
            case "UnAuthourized":
                socket.close();
                console.log("Socket Closed");
                break;
            case "Bad Request":
                socket.close();
                console.log("Socket Closed");
                break;
            case "Succesful":
                try {
                    if (await DexieUpdateUserObject(data.message)) {
                        HandleLogged(true)
                        if (isAdmin) {
                            HandleAdmin(true)
                        }
                        setUserID(id)
                        HandleLoading(false)
                    } else {
                        throw new Error("Update failed");
                    }
                    
                } catch (error) {
                    HandleLoading(false)
                    console.log(error);
                }
                break;
            case "Admin":
                /*
                    Update user object
                    delete message from localstorage
                    re-render
                */

                try {

                    // update
                    if (isAdmin && data.message.userID) {
                        console.log("user object updating");
                        let {userID, chat } = data.message
                        await DexieUpdateUserInformation(userID,"messages",chat)
                        console.log("user object updated");
                    } else {
                        console.log("admin object");
                        let { chat } = data.message
                        await DexieUpdateAdmin("messages",chat)
                        console.log("admin object updated");
                    }     
                    
                    // delete from localstorage
                    if (data.message.messageID) {
                        await DeleteMessageFromLocalStorage("Admin",data.message.messageID)
                        console.log("messsage deleted");
                    } 

                    // re-rendering
                    setUpdateCount(prevUpdateCount => prevUpdateCount + 1);
                    console.log("Re-rendering");

                    
                } catch (error) {
                    console.log(error);
                }



                break;
            case "Ping":
                // update online users
                setOnlineUsers(data.message)
                break;
            case "Reminder":
                DexieUpdateAdminAndUserObject(data.message)
                break;
            default:
                break;
        }

        // Handle incoming messages
    };
}

export async function WSSend (obj){
    try {
        if (socket) {
            await socket.send(JSON.stringify(obj))
        } else {
            throw new Error("Chat capabilities is down")
        }
        return true
    } catch (error) {
        console.log(error);
        return false
    }


}







