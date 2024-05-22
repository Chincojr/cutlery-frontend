<?php

function handlePushNotifyEndpoint (){
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $requestBody = json_decode(file_get_contents('php://input'), true);

            if (!$requestBody || !$requestBody['uid'] || !$requestBody['subscription'] ) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $uid = $requestBody["uid"];
            $subscription = $requestBody["subscription"];
            $endpoint = $subscription['endpoint'];
            $p256dh = $subscription['keys']['p256dh'];
            $auth = $subscription['keys']['auth'];

            $userNotifyInfo = [
                "endpoint"=>$endpoint,
                'publicKey' => $p256dh,
                'authToken' => $auth,
            ];

            $userNotifyInfoJSON = json_encode($userNotifyInfo);
            $updateUserNotifyQuery = "UPDATE Users SET notify = '$userNotifyInfoJSON' WHERE userName = '$uid'";
            
            $updateUserNotifyRequest = handleQuery($updateUserNotifyQuery);

            if ($updateUserNotifyRequest->rowCount() !== 1) {
                http_response_code(304); // No Change
                echo 'No change in user record ' ;
                return;
            }


            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500); // Internal Server Error
            echo '\nFailed';
            return;
        }
    }
}