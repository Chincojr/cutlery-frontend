<?php

function handleCreateEventEndpoint ($userAuth, $testModeData = false){

    /*
        Type of endpoint: POST
            required data: 
                    user Auth
                    title
                    content
                    image
        
        What it does:
            Create a new Event Record   
            And Notify all the Users         
        
        How it does it
            Extract title,content,image
            Generate the systemID for Event
            Check if Image Exist 
                if image exist
                    save and return the image name
            Insert the 
                title
                content
                image
                sysetmID
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
                Error Saving Image
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
                !isset($requestBody["content"]) ||
                !is_string($requestBody["title"]) ||
                !is_string($requestBody["content"])  ||
                $type !== "Admin"
            ) {
                throw new Error("Bad Request",400);
            }                                                           
            $systemID = generateRandomString();
            $insertObject = [
                "title" => "{$requestBody["title"]}",
                "content" => "{$requestBody["content"]}",
                "systemID" => "$systemID",
            ];


            if (
                isset($requestBody["image"])                 
            ){
                $generated_ID = generateRandomString();                
                $imageID = handleSavingImage($requestBody["image"],$generated_ID);

                if ($imageID) {
                    $insertObject["imageID"] = "$imageID";
                }
            }
            

            DBInsert("Event",$insertObject,"No change or record inserted into",304);
           
            // Send Notifications to all users
            SendNotifyToAll([
                "title" => $requestBody["title"],
                "body" => $requestBody["content"],
                "link" => "/event/$systemID",
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
function handleEditEventEndpoint ($userAuth,$testModeData = false){

    /*
        Type of endpoint: POST
            required data: 
                    user Auth                                        
        
        What it does:
            Update an Event Record   
            And Notify all the Users         
        
        How it does it
            Extract title,content,image,systemID
            Check if Image Exist 
                if image exist
                    save and return the image name
            Update the 
                title
                content
                image
                WHERE sysetmID = systemID
            into the Event Table

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
                Error Saving Image
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
                !isset($requestBody["content"]) ||
                !isset($requestBody["systemID"]) ||
                !is_string($requestBody["title"]) ||
                !is_string($requestBody["content"])  ||
                !is_string($requestBody["systemID"])  ||
                $type !== "Admin"
            ) {                
                throw new Error("Bad Request ",400);
            }                       
            $title = $requestBody["title"];
            $content = $requestBody["content"];
            $imageID = $requestBody["imageID"];
            $systemID = $requestBody["systemID"];


            if (
                isset($requestBody["image"])                 
            ){
                $generated_ID = generateRandomString();                
                $imageID = handleSavingImage($requestBody["imageID"],$generated_ID);
            }            


            $updateEvent = handleQuery("
                UPDATE Event 
                SET                
                    title = '$title',
                    content = '$content',
                    imageID= '$imageID'                    
                WHERE systemID = '$systemID'
                "                
            );


            // if record was not inserted in the Db
            if ($updateEvent->rowCount() !== 1) {
                throw new Error("No change or record update into",304);
            }
            
            // Send Notifications to all users            
            SendNotifyToAll([
                "title" => $requestBody["title"],
                "body" => $requestBody["content"],
                "link" => "/event/$systemID",
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
