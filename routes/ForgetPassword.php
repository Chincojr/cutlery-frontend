<?php

function handleForgetPasswordOTPEndpoint ($admin, $testModeData = false){
    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {

            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            if ( 
                !isset($requestBody) || 
                !isset($requestBody["verifyId"]) ||
                !is_string($requestBody["verifyId"]) || 
                !isset($requestBody["email"]) ||
                !is_string($requestBody["email"]) 
            ) {
                throw new Error("Invalid request data",400);
            }     

            $email = $requestBody["email"];

            if ($admin === true) {
                $query = "SELECT email FROM Admin where email = '$email'";
            } else {
                $query = "SELECT email FROM Users where email = '$email'";
            }

            $checkEmailExistRequest = handleQuery($query);
            $numOfEmail = $checkEmailExistRequest->fetchAll(PDO::FETCH_COLUMN);

            if (count($numOfEmail) !== 1) {
                throw new Error("Invalid email",404);
            }

            // if the user email is unique
            $code = oneTimeCode();
            $verifyId = $requestBody["verifyId"];
            $insertObject = [
                "verifyId" => $verifyId, 
                "code" => $code
            ];                        

            DBInsert("Verify", $insertObject, "Error while generating OTP",400);      
            
            $emailInfo = [
                'to' => $email,
                'subject' => "Forget OTP ",
                'message' => "
                    Hello $email,

                    The OTP for your Cutlery account.
                    
                    Your code is: $code
                "
            ];

            SendEmail($emailInfo);
               
            return $code;
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();                                        
            http_response_code($responseCode); // Internal Server Error
            return false;
        }
    }
}

function handleChangePasswordEndpoint ($admin, $testModeData = false){

    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {

            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            if ( 
                !isset($requestBody["email"]) || 
                !isset($requestBody["verifyId"]) || 
                !isset($requestBody["password"]) || 
                !isset($requestBody["code"]) ||
                !is_string($requestBody["email"]) || 
                !is_string($requestBody["verifyId"]) || 
                !is_string($requestBody["password"])              
            ) {
                throw new Error("Invalid request data",400);
            }     

            $email = $requestBody["email"];                        

            // handle user verify OTP            
            $verifyOTP = handleQuery("DELETE FROM Verify WHERE verifyId = '{$requestBody["verifyId"]}' AND code = '{$requestBody["code"]}'");
            if ($verifyOTP->rowCount() !== 1) {
                throw new Error("This request OTP and verifyId is invalid",401);
            } 


            // modify user record 
            $password = HashText($requestBody["password"]); //hash the password
            $DB = $admin === true ? "Admin" : "Users";
            $recordUpdateRequest = handleQuery( "
                UPDATE $DB 
                SET password = '$password' 
                WHERE email = '$email'
                " 
            );            

            if ( $recordUpdateRequest->rowCount() !== 1) {
                throw new Error("Invalid email",404);
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
