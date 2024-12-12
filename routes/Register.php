<?php

function handleRegisterEndpoint ($testModeData = false){

    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            if (
                !isset( $requestBody ) || 
                !isset( $requestBody["code"] ) || 
                !isset( $requestBody["verifyId"] )
            ) {
                throw new Error("Invalid request data",400);                
            }                  

            // verify users OTP            
            $verifyOTP = handleQuery("DELETE FROM Verify WHERE verifyId = '{$requestBody["verifyId"]}' AND code = '{$requestBody["code"]}'");
            if ($verifyOTP->rowCount() !== 1) {
                throw new Error("This request OTP and verifyId is invalid",401);                
            }             

            // check if email already exist in the database            
            $checkEmailandUserName = handleQuery("SELECT * FROM Users WHERE email = '{$requestBody["email"]}'");
            $results = $checkEmailandUserName->fetchAll();
            if (count($results) !== 0) {
                throw new Error("This email as already been used",409);
            }

            // Create new user record
            $password = HashText($requestBody["password"]); //hash the password            
            $generated_id = generateRandomString();         
            
            $columns = [
                "name",
                "email",
                "phoneNumber",            
            ]; 
            $userData = [];
            foreach ($columns as $column) {
                if (isset($requestBody[$column])) {
                    $userData[$column] = $requestBody[$column];
                } else{
                    throw new Error("Invalid request data",400);
                }
            }
            
            $userData = [
                ...$userData,
                'systemID' => $generated_id,
                'password' => $password
            ];           
            


            DBInsert("Users", $userData, "Error while inserting user info",204);
            DBInsert("Chat", ["systemID" => $generated_id], "Error while inserting user chat record",204);        
            
                    
            $type = "Client";
            $userAuthToken = create_jwt_token($type,$generated_id);

            print_r(json_encode([
                'token' => $userAuthToken,
                'type' => $type,
                'uid' => $generated_id
            ]));              
                        
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error                        
        }
    }
}
