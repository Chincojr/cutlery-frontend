<?php

function handleServiceWorkerEndpoint (){
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {

            if ( !$_GET["uid"] ) {
                http_response_code(400); // Bad Request
                echo 'Invalid request data';
                return;
            }

            $uid = $_GET["uid"];
            $TableList = ["Events","Matches","Polls","Posts","Groups"];
            $result = [
                "Events" => [],
                "Matches" => [],
                "Polls" => [],
                "Posts" => [],
                "Groups" => []
            ];

            foreach ($TableList as $Table) {
                
                if($Table  === "Groups"){
                    $query = "
                    SELECT * 
                    FROM $Table
                    WHERE admin = '$uid' OR members LIKE '%$uid%' OR coAdmins LIKE '%$uid%' 
                    ";
                }else {
                    $query = "
                    SELECT * 
                    FROM $Table
                    WHERE admin = '$uid' OR members LIKE '%$uid%'        
                    ";
                }

                // echo $query . "\n";
                $getUserRecordRequst = handleQuery($query);
                $userRecords = $getUserRecordRequst->fetchAll(PDO::FETCH_ASSOC);

                if (count($userRecords) > 0) {
                    $result[$Table] = $userRecords;
                }

            }

            print_r(json_encode($result));


            return;
        } catch (Exception $error) {
            error_log($error);
            http_response_code(500); // Internal Server Error
            echo 'Failed';
            return;
        }
    }
}