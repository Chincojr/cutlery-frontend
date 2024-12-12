<?php

function handleCreateNotifyEndpoint ($userAuth, $testModeData = false){
    /*
        Type of endpoint: POST
            required data: 
                    user Auth
                    title
                    caption
                    link
        
        What it does:
            Create a new Notify Record   
            And Notify all the Users         
        
        How it does it
            Extract title,caption,link
            Generate the systemID for Notify
            Insert the 
                title
                caption
                link
                systemID
            into the Event Table


        Succes
            Outputs 
                http code 200
        Failure 
            304
                Insertion failed
            400
                Bad request body
                Invalid request body
            500
                Server Error
            Any other http code                 
    */
    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST'  ) {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);
            $type = $userAuth["data"]->type;

            if (
                !isset($requestBody) ||
                !isset($requestBody["title"]) ||
                !is_string($requestBody["title"]) ||
                $type !== "Admin"
            ) {
                throw new Error("Bad request",400);                
            }
                                    
            $generated_ID = generateRandomString();
            $insertObject = [
                "title" => "{$requestBody["title"]}",
                "caption" => isset($requestBody["caption"]) ? "{$requestBody["caption"]}"  : NULL,
                "link" => isset($requestBody["link"]) ? "{$requestBody["link"]}" : NULL,
                "systemID" => "$generated_ID"
            ];

            DBInsert("Notify", $insertObject, "Bad request",304);

            // Send Notifications to all users
            SendNotifyToAll([
                "title" => $requestBody["title"],
                "body" => $requestBody["caption"],
                "link" => $requestBody["link"],
            ]);
            return $insertObject;
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error
            return false;
        }
    }

}


function handleEditNotifyEndpoint ($userAuth, $testModeData = false){
    /*
        Type of endpoint: POST
            required data: 
                    user Auth
                    title
                    caption
                    link
        
        What it does:
            Update an Notify Record   
            And Notify all the Users         
        
        How it does it
            Extract title,caption,link,systemID
            Update the 
                title
                content
                image
                WHERE systemID = systemID
            into the Notidy Table

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
    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);
            $type = $userAuth["data"]->type;               

            if (
                !isset($requestBody) ||
                !isset($requestBody["title"]) ||
                !isset($requestBody["systemID"]) ||
                !is_string($requestBody["systemID"])  ||
                $type !== "Admin"
            ) {
                throw new Error("Bad request",400);                
            }

            $title = $requestBody["title"];
            $caption = isset($requestBody["caption"]) ? $requestBody["caption"] : NULL;
            $link = isset($requestBody["link"]) ? $requestBody["link"] : NULL;
            $systemID = $requestBody["systemID"];
                        

            $updateEvent = handleQuery("
                UPDATE Notify 
                SET                
                    title = '$title',
                    caption = '$caption',
                    link= '$link'                    
                WHERE systemID = '$systemID'
                "                
            );

            // if record was not inserted in the Db
            if ($updateEvent->rowCount() !== 1) {
                throw new Error("No change or record update into",304);
            }

            SendNotifyToAll([
                "title" => $requestBody["title"],
                "body" => $requestBody["caption"],
                "link" => $requestBody["link"],
            ]);

            
            return true;
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error
            return false;
        }
    }

}