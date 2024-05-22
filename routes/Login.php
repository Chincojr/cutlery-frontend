<?php

function handleLoginEndpoint (){
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = json_decode(file_get_contents('php://input'), true);

            if ( !$requestBody["userName"] || !$requestBody["password"]) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $username = $requestBody['userName'];
            $password = $requestBody['password'];


            // Read user data from the database
            $userRecord = handleQuery("SELECT * FROM Users WHERE userName = '$username'");
            $user = $userRecord->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401); // Unauthorized
                echo 'Invalid username or password';
                return;
            }

            $logged = HashText("Logged"); // 
            $obj = [
                'log' => $logged,
                'uid' => $user['userName']
            ];            

            print_r(json_encode($obj));
            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500); // Internal Server Error
            echo 'Failed';
            return;
        }
    }
}