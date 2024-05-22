<?php

function handleSignUpEndpoint (){
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = json_decode(file_get_contents('php://input'), true);

            if (!$requestBody ) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $requestBody;
            $userName = $requestBody["userName"];
            $imageUpload = "";

            // if user profile picture is set create its file in the uploads dir
            if (!empty($requestBody["image"])) {
                $image = $requestBody["image"];
                $imageUpload = handleSavingImage($image,$userName);

                // if their is an error while creating the file send code 500
                if (!$imageUpload) {
                    http_response_code(500); // Internal server Error
                    echo 'Invalid Image Upload';
                    return;
                }
    
            }



            unset($requestBody['image']);   // remove the image key


            // handle groupCode
            $groupCode = $requestBody["groupCode"];
            unset($requestBody['groupCode']);   // remove the image key


            // check if username or email already exist in the database
            $checkEmailandUserNameQuery = "SELECT * FROM Users WHERE userName = '{$requestBody["userName"]}' OR email = '{$requestBody["email"]}'";
            $checkEmailandUserName = handleQuery($checkEmailandUserNameQuery);
            $results = $checkEmailandUserName->fetchAll();

            if (count($results) > 0) {
                http_response_code(409); // conflict username or email
                return;
            }



            // Add new user record
            $password = HashText($requestBody["password"]); //hash the password
            $requestBody = array_merge($requestBody, ['password' => $password]); //merge the new password

            $identifierArray = ["imageID"];
            $valueArray = ["'$imageUpload'"];            
            $existVal = false;

            foreach ($requestBody as $key => $value) {

                if ( isset($value) && $value != "") {
                    array_push($identifierArray, $key );
                    $varType = gettype($value);

                    if ($varType == "string") {
                        $value = "'$value'"; 
                        $existVal = true;
                    }
                    array_push($valueArray, "$value" );

                }

            }

            $identifier = join(',',$identifierArray);
            $value = join(',',$valueArray);

            $AddUserQuery = "INSERT INTO Users " . " (". $identifier . ") VALUES (". $value .")";

            if ($existVal) {
                $AddUser = handleQuery($AddUserQuery);
                
                if ($AddUser->rowCount() < 1) {
                    http_response_code(204); // User record is not inserted
                }

            } else {
                http_response_code(400); // Bad Request
                return;
            }

            $logged = HashText("Logged"); // cookie logged

            $outputObj = [
                'log' => $logged,
                'id' => $requestBody["userName"]
            ];            

            print_r(json_encode($outputObj));

            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500);
            echo 'Failed';
            return;
        }
    }
}
