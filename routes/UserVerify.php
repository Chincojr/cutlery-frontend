<?php   

function handleVerifyEndpoint (){

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = json_decode(file_get_contents('php://input'), true);

            if ( !$requestBody["verifyId"] ) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $code = oneTimeCode();
            $verifyId = $requestBody["verifyId"];

            $db = getDBConnection();
            $stmt = $db->prepare("INSERT INTO Verify ( verifyId,code ) VALUES ('$verifyId','$code') ");
            $stmt->execute();

            

            print_r("verfication sent");
            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500); // Internal Server Error
            echo 'Failed';
            return;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        try {
            $requestBody = json_decode(file_get_contents('php://input'), true);

            print_r($requestBody);

            if ( !$requestBody["verifyId"] || !$requestBody["code"] ) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $code = $requestBody["code"];
            $verifyId = $requestBody["verifyId"];

            $db = getDBConnection();
            $stmt = $db->prepare("DELETE FROM Verify WHERE verifyId = '$verifyId' AND code = '$code'");
            $stmt->execute();
            $rowCount = $stmt->rowCount();

            if ($rowCount) {
                print_r("verified and deleted ");
                return;
            }

            echo "Failed1";
            http_response_code(404);

            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500); // Internal Server Error
            echo 'Failed';
            return;
        }
    }




}