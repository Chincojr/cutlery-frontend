<?php

function handleLoggedEndpoint (){
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = json_decode(file_get_contents('php://input'), true);

            if (!$requestBody || !$requestBody['log'] || !$requestBody['uid'] ) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $uid = $requestBody['uid'];

            // check if user id exist
            $checkIfUidIsValid = handleQuery("SELECT * from Users WHERE userName = '{$uid}'");
            $uidRecord = $checkIfUidIsValid->fetchAll(PDO::FETCH_ASSOC) ;
            if ( count($uidRecord) !== 1 ) {
                http_response_code(401); // Unauthorized
                echo 'Unauthorized';
                return;
            }

            // check if the logged hash is valid
            $log = $requestBody['log'];
            if ( !password_verify("Logged", $log) ) {
                http_response_code(401); // Unauthorized
                echo 'Unauthorized';
                return;
            }


            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500);
            echo 'Failed';
            return;
        }
    }
}