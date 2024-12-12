<?php

$uploadImageDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
define('uploadImageDir', $uploadImageDir);
$domain = "/";


$DBList = [
    "Admin" => "Admin",
    "Client" => "Users"
];
define('DBList', $DBList);

function generateRandomString() {
    $currentTime = date("YmdHis"); // Get current time and date in YYYYMMDDHHMMSS format
    $remainingLength = 40 - strlen($currentTime); // Calculate remaining length for random characters
    
    $randomString = $currentTime; // Start with current time and date
    
    // Generate random characters to fill the remaining length
    for ($i = 0; $i < $remainingLength; $i++) {
        $randomString .= chr(rand(97, 122)); // Append a random lowercase ASCII character
    }
    
    $characters = str_split($randomString);

    // Shuffle the array randomly
    shuffle($characters);

    // Convert the array of characters back to a string
    $randomizedString = implode('', $characters);
    return $randomizedString;
}

// Function to establish a database connection
function getDBConnection() {
    $host = $_ENV["HOST"];
    $dbname = $_ENV["DBNAME"];
    $username = $_ENV["USER_NAME"];
    $password = $_ENV["PASSWORD"];


    try {
        $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (Throwable $th) {
        $responseCode = strlen($th->getCode()) !== 3 ? 500 : $th->getCode();        
        echo 'Connection failed: ' . $th->getMessage();
        http_response_code($responseCode); // Internal Server Error
        exit;
    }
}

function oneTimeCode() {
    $min = 1000000; // Minimum 7-digit number (inclusive)
    $max = 9999999; // Maximum 7-digit number (inclusive)
    return rand($min, $max);
}

function HashText($text) {
    $saltRounds = 10;
    $hash = password_hash($text, PASSWORD_BCRYPT, ['cost' => $saltRounds]);
    return $hash;
}

function handleSavingImage($base64_image,$systemId) {
    try {

        if ( file_exists( uploadImageDir . $base64_image  ) ){
            return $base64_image;
        }

        if (            
            !isset($systemId) || 
            !isset($base64_image) ||
            !is_string($systemId) || 
            !is_string($base64_image) ||
            strpos($base64_image, ";") === false ||
            strpos($base64_image, ",") === false ||
            !preg_match('/^data:image\/(png|jpeg|jpg|bmp|webp);base64,/', $base64_image)
        ) {
            return false;
        }
            
        list($type, $data) = explode(';', $base64_image);
        list(, $data)      = explode(',', $data);            
        $image_data = base64_decode($data);   

        if ($image_data === false) {
            return false;
        } 
        $image_format = substr($type, strpos($type, '/') + 1);
        $filename = uploadImageDir . $systemId . "." . $image_format;         
        
        if (  file_put_contents($filename, $image_data) ) {
            return $systemId . "." . $image_format;
        } else {
            throw new Error("Error while saving image");
        }    

    } catch (\Throwable $th) {        
        throw new Error ($th->getMessage());
    }
     
}

function handleQuery($query){
    // echo $query ."\n";
    $db = getDBConnection();
    $stmt = $db->prepare($query);
    $stmt->execute();

    return $stmt;
}

function SendNotifyToAll ($notifyInfo){

    if (!isset($notifyInfo)) {
        echo "To send notification notification info is required";
        return;
    }

    $retrieveAllUsersNotifObjQuery = "SELECT notify FROM Users WHERE notify IS NOT NULL";
    $allUsersNotifyObjRequest = handleQuery($retrieveAllUsersNotifObjQuery);
    $allUsersNotifyObj = $allUsersNotifyObjRequest->fetchAll();

    if (count($allUsersNotifyObj) > 0) {
        $sendToAllRequest =  SendPushNotification($allUsersNotifyObj,
        $notifyInfo);    

        if (!$sendToAllRequest) {
            echo "Error while sending notification to all users";
            return false;
        }
        
    }


    return true;

}

function ConvertObjForUpdate($obj){
    $updateColumnsAndValuesList = [];
    
    foreach ($obj as $key => $value) {
        if ( isset($value) && $value != "") {
            $varType = gettype($value);

            if ($varType == "array") {
                $tempValueArry = [];
                $jsonObj = json_encode($value);
                $value = "'$jsonObj'";
            }

            if ($varType == "string") {
                $value = "'$value'"; 
                $checkValues = true;
            }
            $valueToUpdate = "$key = $value";
            array_push($updateColumnsAndValuesList, $valueToUpdate);
        }
    }

    return $updateColumnsAndValuesList;
}

function SendEmail($emailInfo) {

    try {
        if (!isset($emailInfo['to']) || !is_string($emailInfo['to']) ||
            !isset($emailInfo['subject']) || !is_string($emailInfo['subject']) ||
            !isset($emailInfo['message']) || !is_string($emailInfo['message'])) {
            throw new Exception("Invalid emailInfo");
        }

        $to = $emailInfo['to'];
        $subject = $emailInfo['subject'];
        $message = $emailInfo['message'];
        

        if (mail($to, $subject, $message)) {
            echo "Email sent successfully!";
            return true;
        } else {
            throw new Error("Error while sending email");
        }
    } catch (\Throwable $th) {
        throw new Error ($th->getMessage());
    }
    
}

function getNextReminder($lastReminderDate, $interval, $frequency) {
    // Convert reminderDate string to a DateTime object
    $interval = (int)$interval;
    $date = new DateTime($lastReminderDate);

    switch (strtolower($frequency)) {
        case 'day':
            $date->modify("+$interval days");
            break;

        case 'week':
            $date->modify("+" . ($interval * 7) . " days");
            break;

        case 'month':
            $monthSum = (int)$date->format('m') + $interval;
            $quotient = floor($monthSum / 12); // Get the quotient
            $remainder = $monthSum % 12;       // Get the remainder
            $nextReminderYear = (int)$date->format('Y') + $quotient;
            $nextReminderMonth = $remainder;   // [1-12]
            $nextReminderDay = getDaysInMonth($nextReminderYear, $nextReminderMonth) > (int)$date->format('d') 
                ? (int)$date->format('d') 
                : getDaysInMonth($nextReminderYear, $nextReminderMonth);

            $date->setDate($nextReminderYear, $nextReminderMonth, $nextReminderDay);
            break;

        case 'year':
            $nextReminderYear = (int)$date->format('Y') + $interval;
            $nextReminderMonth = (int)$date->format('m'); // [1-12]
            $nextReminderDay = getDaysInMonth($nextReminderYear, $nextReminderMonth) > (int)$date->format('d') 
                ? (int)$date->format('d') 
                : getDaysInMonth($nextReminderYear, $nextReminderMonth);

            $date->setDate($nextReminderYear, $nextReminderMonth, $nextReminderDay);
            break;

        default:
            echo 'Invalid interval';
            return null;
    }

    return $date->format('Y-m-d');
}

function getDaysInMonth($year, $month) {
    return cal_days_in_month(CAL_GREGORIAN, $month, $year);
}

// function DBInsert($tableName, $insertArray, $errorMesssage, $errorCode = 500) {
//     try {
//         if (
//             isset($tableName) &&
//             isset($insertArray) &&
//             isset($errorMesssage) &&
//             is_string($tableName) &&     
//             is_string($errorMesssage) &&            
//             is_array($insertArray)
//         ) {
//             $columns = implode(",", array_keys($insertArray) );
//             $values = implode(",", array_values($insertArray) );
            
//             $insertQuery = handleQuery("INSERT INTO $tableName ($columns) VALUES ($values)" );

//             if ($insertQuery->rowCount() !== 1) {
//                 throw new Error($errorMesssage, $errorCode);
//             }
//             return $insertQuery;        
//         }        
//     } catch (\Throwable $th) {
//         throw new Error ($th->getMessage(), $errorCode);
//     }

// }

function DBInsert(string $table, array $data, $errorMesssage, $errorCode = 500) {

    try {
        $columns = implode(", ", array_keys($data));
        $placeholders = implode(", ", array_map(fn($col) => ":$col", array_keys($data)));
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";

        $db = getDBConnection();
        $stmt = $db->prepare($sql);

        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        $stmt->execute();

        if ($stmt->rowCount() !== 1) {
            throw new Error($errorMesssage, $errorCode);
        }
        return $stmt;        
    } catch (\Throwable $th) {
        throw new Error ($th->getMessage(), $errorCode);
    }

}