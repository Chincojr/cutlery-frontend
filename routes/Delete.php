<?php

function handleDeleteEventOrNotifyEndpoint ($userAuth, $testModeData = false){
    /*
        Type of endpoint: POST
            required data: 
                    user Auth
                    ids
                    deletetype
        
        What it does:
            Delete From DB table based of the system_ids provided
            Once succesful return http code 200
        
        How it does it
            Retrieve all the ids
            Ensure the deleteType is either Event or Notify
            Delete the event record from the DB
            Retreive the number of deleted records
            If the number of deleted records is 0 
                throw an error with code 500 
                and Exit
            Provided all above operations are successful
            Return code 200

        Succes
            Outputs http code 200
        Failure 
            Any other http code                 
    */
    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);
            $type = $userAuth["data"]->type;               
            
            // error_log(var_export($requestBody, true));
            if (
                !isset($requestBody) || 
                !isset($requestBody["ids"]) ||
                !isset($requestBody["deleteType"]) ||
                !is_string($requestBody["deleteType"]) ||
                !is_array($requestBody["ids"]) ||
                count($requestBody["ids"]) === 0 ||
                in_array($requestBody["deleteType"], ["Event", "Notify"]) === false ||
                $type !== "Admin"

            ) {
                throw new Error("Bad request 1",400);
            }

            $ids = $requestBody["ids"];
            $deleteType = $requestBody["deleteType"];            
            $records_to_delete = [];

            foreach ($ids as $id) {
                $records_to_delete = [
                    ...$records_to_delete,
                    "'$id'"
                ];
            }

            $records_to_delete = implode(",", $records_to_delete);

            $deleteRecordsRequest = handleQuery ("DELETE FROM $deleteType WHERE systemID IN ($records_to_delete)");            

            if ($deleteRecordsRequest->rowCount() === 0) {
                throw new Error("Delete Failed",400);                
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