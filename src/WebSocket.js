var socket

export function WSConnect(
        cookies,
        setConnectivityState,
        HandleRemovePending,
        HandleUpdateChat,
        setOnlineUsers,
    ) {
        

    let uid = cookies ? cookies.uid : null;
    let type = cookies ? cookies.type : null;
    let token = localStorage.getItem("token")

    socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET}?uid=${uid}&token=${token}&type=${type}`);
    
    socket.onopen = async function(event) { // Handle connection success                       
        console.log('WebSocket connected');
        setConnectivityState(true);             
    };
    socket.onerror = function(error) {
        console.error('WebSocket Connection Error:', error);
        socket.close();        
        setConnectivityState(false)
    };

    socket.onmessage = async function(event) {        
        let data = JSON.parse(event.data);          
        console.log("WebSocket Data: ",data);
          
        switch (data.action) {
            case "remove_pending":
                HandleRemovePending(data.message.recipient,data.message.messageID);
                console.log("Remove Pending: ",data,data.message);  
                break;      
            case "contact":
                HandleUpdateChat(data.message);
                console.log("Contact Updated Chat: ",data,data.message);                           
                break;  
            case "online_users":                
                setOnlineUsers(data.message)   
                break      
            default:
                break;
        }
        
    };   

    socket.onclose = function(event) {
        console.log('WebSocket closed:', event);        
    };
                
}

export function WSClose () {
    if (socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
}




export async function WSSend (obj) {
    
    if (socket.readyState === WebSocket.OPEN) {
        await socket.send(JSON.stringify(obj))        
    } else {
        console.warn("WebSocket is not open.");
    }           
}