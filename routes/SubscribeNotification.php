<?php

function handleSubscribeNotifyEndpoint ($userAuth){
        /*
        Type of endpoint: POST
            required data: 
                    user Auth    
                    subscription                                    
        
        What it does:
            Update an User's notify attribute   
        
        How it does it
            Retrieve the subscription object
            Extract endpoint,p256dh,auth
            Determine the DB based of the userAuth type
            Update the 
                notify
                WHERE sysetmID = uid
            into the DB Table

        Succes
            Outputs 
                http code 200
        Failure 
            304
                Update Failed
            400
                Bad request body
                Invalid request body
            500
                Server Error
            Any other http code                 
    */    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            global $DBList;
            $requestBody = json_decode(file_get_contents('php://input'), true);
            $type = $userAuth["data"]->type;   
            $uid = $userAuth["data"]->uid;   
            $DB = $DBList[$type];

            if (
                !isset($requestBody) || 
                !isset($requestBody['subscription'])
            ){
                throw new Error ("Bad request",400);
            }

            $subscription = $requestBody["subscription"];
            $endpoint = $subscription['endpoint'];
            $p256dh = $subscription['keys']['p256dh'];
            $auth = $subscription['keys']['auth'];

            $userNotifyInfo = [
                "endpoint"=>$endpoint,
                'publicKey' => $p256dh,
                'authToken' => $auth,
            ];

            $userNotifyInfoJSON = json_encode($userNotifyInfo);

            
            $updateUserNotifyRequest = handleQuery("UPDATE $DB SET notify = '$userNotifyInfoJSON' WHERE systemID = '$uid'");

            if ($updateUserNotifyRequest->rowCount() !== 1) {
                throw new Error("Update failed",304);                                
            }
            
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error
            return;
        }
    }
}

