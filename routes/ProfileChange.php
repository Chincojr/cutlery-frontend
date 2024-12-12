<?php

function handleProfileChangeEndpoint ($userAuth, $testModeData = false){
    /*
        Type of endpoint: POST
            required data: 
                    user Auth   
                    image   
                    name                                  
        
        What it does:
            Saves users new profile picture
            And updates the following in the users record 
                imageID with the name of the saved picture
                name 
                    
        How it does it                
            Retrieve user image and name
            if both of the input are not specified or are null flag as bad request
            if userImage is not null
                Generate random string
                Save the user Image and set the name to the random string generated
            if the name is not null
            Update the users record  
                imageID with the name of the saved picture
                name             

        Succes
            Ouputs                        
                http code 200
        Failure 
            400
                Bad Request => the image does not exist
            500
                server could not save the image
                 
    */
    if (isset($testModeData) || $_SERVER["REQUEST_METHOD"] === "POST") {
        try {            
            $type = $userAuth["data"]->type;   
            $uid = $userAuth["data"]->uid;   
            $DB = DBList[$type];
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);            

            if (
                !isset($requestBody)  ||                                
                !isset($requestBody["name"])                       
            ) {
                throw new Error("Bad Request",400);
            }
                        
            $imageName = NULL;

            // handle image
            if (
                isset($requestBody["image"]) &&
                is_string($requestBody["image"])
            ) {                
                $generated_id = generateRandomString();
                $imageName = handleSavingImage($requestBody["image"],$generated_id);
                if (
                    !$imageName
                ) {
                    throw new Error("Image Saving Failed", 500);
                }                
            }

                                     
            $updateRecord = handleQuery("
                UPDATE $DB 
                SET  
                    name = '{$requestBody["name"]}',
                    imageID = '{$imageName}'
                WHERE 
                    systemID = '$uid'
            ");

            if ( $updateRecord->rowCount() !== 1 ) {
                throw new Error("Update Failed",500);
            }

            return true;                        
        } catch (\Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error
            return false;
        }
    }
}