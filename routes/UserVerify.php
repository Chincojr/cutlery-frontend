<?php

use PHPUnit\Framework\TestStatus\Error;

function handleSendOTPEndpoint ($testModeData = false){

    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            if (
                !isset($requestBody) || 
                !isset($requestBody["verifyId"]) ||
                !is_string($requestBody["verifyId"]) || 
                !isset($requestBody["email"]) ||
                !is_string($requestBody["email"]) 
            ){
                throw new Error("Invalid request data",400);
            }

            $code = oneTimeCode();
            $verifyId = $requestBody["verifyId"];
            $email = $requestBody["email"];      
            $insertObject = [
                "verifyId" => $verifyId, 
                "code" => $code
            ];

            DBInsert("Verify", $insertObject, "Error while generating OTP",400);
            
            $emailInfo = [
                'to' => $email,
                'subject' => "Sign-up OTP ",
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

function handleVerifyEmailEndpoint ($testModeData = false){

    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);

            if ( 
                !isset($requestBody) || 
                !isset($requestBody["email"]) || 
                !is_string($requestBody["email"])
            ) {                
                throw new Error("Invalid request data",400);
            }

            $email = $requestBody["email"];                    
            $verifyEmail = handleQuery("SELECT * FROM Users WHERE email = '$email'");

            if (count($verifyEmail->fetchAll()) !== 0) {
                throw new Error("This email as already been used",409);                
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