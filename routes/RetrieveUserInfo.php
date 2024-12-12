<?php

/**
 * Handles the retrieval of user information based on user authentication.
 *
 * This endpoint is of type POST and requires user authentication data.
 * It retrieves and returns all user data associated with the user's UID,
 * including events, chats, and additional user information.
 *
 * The function performs the following steps:
 * - Retrieves the user record from the database.
 * - Validates that exactly one user record is found, otherwise throws an error with code 401.
 * - Extracts user details such as name, imageID, email, repeatType, and others.
 * - Determines if notifications are enabled based on the notify column.
 * - Depending on the user type (Admin or Client), additional data is extracted.
 * - Retrieves all associated events and notifications.
 * - For Admin users, gathers comprehensive chat information of all users.
 * - For non-Admin users, retrieves chat records with Admin and Admin's details.
 *
 * On success, outputs HTTP code 200 and returns the user data object containing:
 * - User details
 * - Events
 * - Notifications
 * - Either UsersInformation (for Admin) or Admin details (for non-Admin)
 *
 * On failure, outputs HTTP code 401 if user record issues, or other codes for different errors.
 */
function handleRetrieveUserEndpoint ($userAuth , $testModeData = false) {
    if ( $testModeData || $_SERVER["REQUEST_METHOD"] === "POST") {
        try {            
            $type = $userAuth["data"]->type;   
            $uid = $userAuth["data"]->uid;   
            $DB = DBList[$type];

            $userRecord = handleQuery("SELECT * FROM $DB WHERE systemID = '$uid'");
            $userRecord = $userRecord->fetchAll();

            // if the number of user record is not 1 invalidate request
            if (count($userRecord) !== 1) {
                throw new Error("Invalid credentials",401);
            }

            $userRecord = $userRecord[0];

            $userData = [
                "name" => $userRecord["name"],
                "imageID" => $userRecord["imageID"],
                "email" => $userRecord["email"],
                "repeatType" => $userRecord["repeatType"],
                "repeatValue" => $userRecord["repeatValue"],
                "nextReminder" => $userRecord["nextReminder"],
                "notify" => $userRecord["notify"] ? true : false,
            ];
        
            
            if ($type === "Client") {
                $userData = [
                    ...$userData,
                    "phoneNumber" => $userRecord["phoneNumber"],
                ];
            }

            // Retrieve associated information
            $TableList = [
                "Event" => [],
                "Notify" => []
            ];
            foreach ($TableList as $Table => $value) {

                if ($type == "Admin") {
                    $query = "
                        SELECT *
                        FROM $Table        
                    ";                                
                } else {
                    $query = "
                        SELECT     
                            *,
                            JSON_UNQUOTE(JSON_EXTRACT(seen, '$.$uid')) AS seen
                        FROM $Table        
                    ";                
                }
                    
                
                $getUserRecordRequst = handleQuery($query);
                $usersRecords = $getUserRecordRequst->fetchAll(PDO::FETCH_ASSOC);

                if (count($usersRecords) > 0) {
                    $userData[$Table] = $usersRecords;
                }
            }

            if ($type === "Admin") {

                $usersInformation = [];
        
                $allUsersRecord = handleQuery("SELECT 
                        CONCAT(
                            '{', 
                            GROUP_CONCAT(
                                CONCAT(
                                    '\"', Users.systemID, '\": ', 
                                    JSON_OBJECT(
                                        'name', Users.name, 
                                        'email', Users.email, 
                                        'phoneNumber', Users.phoneNumber, 
                                        'systemID', Users.systemID, 
                                        'imageID', Users.ImageID,
                                        'messages', Chat.messages
                                    )
                                )
                                SEPARATOR ','
                            ), 
                            '}'
                        ) AS userChatData
                    FROM 
                        Users
                    INNER JOIN 
                        Chat 
                    ON 
                        Users.systemID = Chat.systemID
                ");
            
            
                $allUsersRecord = $allUsersRecord->fetchAll(PDO::FETCH_COLUMN);
                
                if (
                    isset($allUsersRecord) &&
                    isset($allUsersRecord[0]) &&
                    is_array(json_decode($allUsersRecord[0],true))
                ) {
                    $usersInformation = json_decode($allUsersRecord[0],true);
                }     
                
                $userData = [
                    ...$userData,
                    "UsersInformation" => $usersInformation
                ];
        
        
            } else {
                // Chat with Admin
                $chatWithAdminRecord = handleQuery("SELECT messages FROM Chat WHERE systemID = '$uid'");
                $chatWithAdminRecord = $chatWithAdminRecord->fetchAll(PDO::FETCH_ASSOC);
                                
                // Admin data 
                $adminData = handleQuery("SELECT name,systemID,imageID FROM Admin");
                $adminData = $adminData->fetchAll(PDO::FETCH_ASSOC);                
        
                $userData = [
                    ...$userData,
                    "Admin" => [
                        "messages" => isset($chatWithAdminRecord[0]["messages"]) ? json_decode($chatWithAdminRecord[0]["messages"],true) : [],
                        ...$adminData[0]
                    ]
                ];
                
            }
        
            
            echo json_encode($userData);
        } catch (\Throwable $th) {
            $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();
            echo $th->getMessage();
            http_response_code($responseCode); // Internal Server Error
            return;
        }
    }
}