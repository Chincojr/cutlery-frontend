<?php

function handleSeenEndpoint ($userAuth, $testModeData = false){
    /*
        Type of endpoint: POST
            required data: 
                    user Auth
                    seenType
                    id
        
        What it does:
            Determine the seenType either Event or Notify
            Using the id specified 
            Identify the records and 
            Add the userID to the JSON seen column
        
        How it does it
            Identify the seentType,id
            if seenType is not Event or Notify 
                throw error 400
            If id is not a string 
                throw error 400
            Store time of the request
            Update the seenType 
                if the seen column is a valid json 
                    merge it with this new object (uid, time of request)
                else
                    create a json object (uid, time of request)
            Ensure the update was successful by getting the row count
            If the row count is equals to 1 
                then it is successful
            else
                throw erro 500
                
        Succes
            Outputs 
                http code 200
        Failure 
            400
                Bad request the the request body is not valid
            500
                Update was not succesful
                or
                Server Error while making update                
            Any other http code                 
    */
    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            
            if (
                !isset($requestBody) || 
                !isset($requestBody["seenType"]) || 
                !isset($requestBody["id"])  ||
                !is_string($requestBody["seenType"]) || 
                !is_string($requestBody["id"])
            ) {
                throw new Error("Bad Request 1",400);
            }
            $seenType = $requestBody["seenType"];
            $id = $requestBody["id"];

            if (
                $seenType !== "Event" &&
                $seenType !== "Notify"
            ) {
                throw new Error("Bad Request 2",400);                
            }

            $uid = $userAuth["data"]->uid;                           
            $time =  date('Y-m-d H:i');
            $updateSeenRecord = handleQuery("
                UPDATE $seenType
                SET seen = 
                    CASE 
                        WHEN JSON_VALID(seen) THEN 
                            JSON_MERGE_PATCH(seen, JSON_OBJECT('$uid', '$time'))
                        ELSE 
                            JSON_OBJECT('$uid', '$time')
                    END
                WHERE
                    systemID = '$id'
            ");

            if ( $updateSeenRecord->rowCount() !== 1 ) {
                throw new Error("Update Failed",500);
            }   
            
            return true;
            
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error
            return false;
        }
    }
}

