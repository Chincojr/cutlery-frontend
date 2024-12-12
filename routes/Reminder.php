<?php



function handleReminderEndpoint ($userAuth,$testModeData = false){

    /*
        Type of endpoint: POST
            required data: 
                    user Auth
                    repeatType
                    repeatValue
        
        What it does:
            Updates a user nextReminder  repeatType and repeatValue
            Once succesful return http code 200
        
        How it does it
            Retrieve all the repeatType and repeatValue             
            Genereate the nextReminder
            Provided they are all valid
            Update the user's record                    
            Return code 200

        Succes
            Outputs 
                http code 200
        Failure 
            400
                Bad request body
                OR
                Update failure (i.e update row count is zero or more than 1)                
            Any other http code                 
    */

    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $allTypesArray = ["day","week","month","year"];            
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            if (
                !isset($requestBody) ||
                !isset($requestBody['repeatValue']) ||
                !isset($requestBody["repeatType"])  ||
                !is_numeric($requestBody['repeatValue']) ||
                !is_string($requestBody["repeatType"])  ||
                !in_array($requestBody['repeatType'],$allTypesArray,true)                
            ) {
                throw new Error("Bad Request",400);
            }
            
            $uid = $userAuth["data"]->uid;               
            $type = $userAuth["data"]->type;               
            $DB = DBList[$type] ;
            $repeatType = $requestBody['repeatType'];
            $repeatValue = $requestBody['repeatValue'];            
            $reminderDate = date('Y-m-d');
            $nextReminder = getNextReminder($reminderDate,$repeatValue,$repeatType);

            if (
                !isset($nextReminder)
            ) {
                throw new Error("Bad request",400);
            }
            
            $updateRecord = handleQuery("
                UPDATE $DB 
                SET 
                    repeatValue = $repeatValue, 
                    repeatType = '$repeatType', 
                    nextReminder = '$nextReminder' 
                WHERE 
                    systemID = '$uid' 
            ");

            if ( $updateRecord->rowCount() !== 1 ) {
                throw new Error("", 401);
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