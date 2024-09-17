import { DexieUpdateAdmin, DexieUpdateUserInformation} from "./DexieDb";
var socket

export function WSConnect(cookies,setConnectivityState,setRefreshCount,setPendingMessages,setOnlineUsers) {
    /*
        Retrieve user information
        And authorize based on the user data
        IF error while authenticating or connection error 
            do not authorize
        Disable the loading screen
    */

    let uid = cookies ? cookies.uid : null;
    let type = cookies ? cookies.type : null;
    let token = localStorage.getItem("token")


    socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET}?uid=${uid}&token=${token}&type=${type}`);
    

    socket.onopen = async function(event) { // Handle connection success                       
        console.log('WebSocket connected');
        setConnectivityState(true);
        WSMessage(setRefreshCount,setPendingMessages,setOnlineUsers);        
    };

    WSError(setConnectivityState) // Handle Connection Error
                
}

export function WSError (setConnectivityState){
    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
        socket.close();
        setConnectivityState(false)
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

export function WSMessage(setRefreshCount,setPendingMessages,setOnlineUsers) {
    socket.onmessage = async function(event) {        

        let data = JSON.parse(event.data);            

        switch (data.type) {
            case "Contact":
                /*
                    Update user object
                    delete message from localstorage
                    re-render
                */

                try {

                    // update
                    if (data.message.admin) {
                        console.log("user object updating");
                        let {clientID, chat } = data.message
                        await DexieUpdateUserInformation(clientID,"messages",JSON.parse(chat))
                        console.log("user object updated");
                    } else {
                        console.log("admin object");
                        let { chat } = data.message
                        await DexieUpdateAdmin("messages",JSON.parse(chat))
                        console.log("admin object updated");
                    }     
                    
                    // delete from localstorage
                    if (data.message.messageID) {
                        // await DeleteMessageFromLocalStorage("Admin",data.message.messageID)
                        setPendingMessages(prevPendingMessages => {
                            const newPendingMessages = { ...prevPendingMessages }; 
                            delete newPendingMessages[data.message.messageID];
                            return newPendingMessages;
                        });
                        
                        console.log("messsage deleted");
                    } 

                    // refresh
                    setRefreshCount(prevRefreshCount => prevRefreshCount + 1);
                    
                    
                } catch (error) {
                    console.log(error);
                }

                break;
            case "OnlineUsers":
                setOnlineUsers(data.message.users)                                
                break;
            default:
                break;
        }

        // Handle incoming messages
    };
}

export async function WSSend (obj){
    // console.log("WSSend: ", obj,socket);            
    try {
        if (socket) {
            await socket.send(JSON.stringify(obj))
            // console.log("WSSend 2: ", obj,socket);        
                
        } else {
            throw new Error("Chat capabilities is down")
        }
        return true
    } catch (error) {
        console.log(error);
        return false
    }


}







