<?php


function handleLoginEndpoint ($testModeData = false) {
    /*
        Type of endpoint: POST
        required data: 
                email (email)
                password (string)
                type ("Admin" || "Client")
        
        What it does:
            Verify the provided credentials 
            By retrieve the record based of the email
            Comparing the hash password record retrieved with the provided password
            if it is valid 
                set auth_toke Cookie
                return 
                    [
                        uid  => (string)
                        type => ("Admin" || "Client")
                    ]                    
        
        How it does it
            Retrieve the user Record from the corresponding Database
            If no record with the email could be found or there are more than one 
                throw an error with code 401
                and Exit
            Provided the user record can be found and there is only one user record
            Verify the provided user password with the saved hash in the user record
            IF the verification fails
                throw an error with code 401
                and Exit
            Provided all above operations are successful
            Generate JWT token for the user
            Set cookies for the user with the name auth_token and the value is the genereated jwt token
            Set cookies for the user with the name type and the value is type input
            Set cookies for the user with the name uid and the value is uid input

            Return 
                this object [
                    uid => (string)
                    type => ("Admin" || "Client")                
                ]
                And code 200

        Succes
            Outputs 
                Cookie in the request browser auth_token
                [
                    uid => (string)
                    type => ("Admin" || "Client")
                ]
                http code 200
        Failure 
            Outputs
                400
                    Bad Request => All required input were not provided
                401
                    Un Authorized => the user credentials are invalid
            Any other http code excluding 200
    */
    if ( isset($testModeData) || $_SERVER['REQUEST_METHOD'] === 'POST'  ) {
        try {                                    
            $requestBody = $testModeData ? $testModeData : json_decode(file_get_contents('php://input'), true);            
            
            if ( 
                !isset($requestBody) ||
                !isset($requestBody["email"] ) || 
                !isset($requestBody["password"] ) ||
                !isset($requestBody["type"]) ||
                !isset(DBList[$requestBody["type"]]) ||
                !is_string($requestBody["email"] ) || 
                !is_string($requestBody["password"] ) 
            ) {
                throw new Error("Invalid request data", 400);
            }

            $email = $requestBody['email'];
            $password = $requestBody['password'];
            $type = $requestBody["type"];
            $DB = DBList[$type];


            // Retreive the user Record
            $userRecord = handleQuery("SELECT * FROM $DB WHERE email = '$email'");
            $user = $userRecord->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password'])) {
                throw new Error("Invalid email or password", 401);
            }

            $uid = $user["systemID"] ;

            $userAuthToken = create_jwt_token($type,$uid);


            print_r(json_encode([
                'token' => $userAuthToken,
                'type' => $type,
                'uid' => $uid
            ]));            
        } catch (Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();                                        
            http_response_code($responseCode); // Internal Server Error                 
        }
    }
}