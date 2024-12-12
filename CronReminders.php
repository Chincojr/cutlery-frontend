<?php

require __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

// Load the .env file
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

include 'utilityFunctions.php';
include 'notifications.php';



function SendNotification($notifyObj) {

    $notifyInfo = [
        "title" => "Reminder",
        "body" => "Knife sharpening",
    ];
    $sendToUser = SendPushNotification([
        [
            "notify" => $notifyObj
        ]
    ], $notifyInfo);

    echo "Reminder Notification has been sent $sendToUser \n";
}

function UpdateNextReminderDate($nextReminder,$type,$systemID){
    global $DBList;
    $DB = $DBList[$type];
    $updateUsersQuery = handleQuery("
        UPDATE $DB SET nextReminder = '$nextReminder' WHERE systemID = '$systemID';
    ");
    (int)$updateUsersQuery->rowCount();
    

}

function getNextDate($lastReminderDate,$interval,$frequency) {
    $today = date('Y-m-d');   

    do {
        $returnedDate = getNextReminder($lastReminderDate, $interval, $frequency);
        $lastReminderDate = $returnedDate;
        echo $returnedDate . "\n";
    } while ($returnedDate <= $today);
    
    return $returnedDate;
}


try {
    $todaysDate = date('Y-m-d');
    $allReminders = handleQuery("
        SELECT notify, systemID, repeatType, repeatValue, nextReminder,'Client' AS type
        FROM Users
        WHERE 
            repeatType IS NOT NULL 
            AND repeatValue IS NOT NULL 
            AND nextReminder <= '$todaysDate' 
            AND systemID IS NOT NULL

        UNION

        SELECT notify, systemID , repeatType, repeatValue, nextReminder, 'Admin' AS type
        FROM Admin
        WHERE  
            repeatType IS NOT NULL 
            AND repeatValue IS NOT NULL 
            AND nextReminder <= '$todaysDate'
            AND systemID IS NOT NULL;
    ");
    $allReminders = $allReminders->fetchAll(PDO::FETCH_ASSOC);
    

    foreach ($allReminders as $reminder) {
        $nextReminder = $reminder["nextReminder"];
        $frequency = $reminder["repeatType"];
        $interval = $reminder["repeatValue"];
        $notify = $reminder["notify"];
        $systemID = $reminder["systemID"];
        $type = $reminder["type"];

        if (
            $nextReminder === $todaysDate &&
            isset($notify) &&
            !empty($notify)
        ){
            SendNotification($notify);        
        }

        $futureReminder = getNextDate($nextReminder,$interval,$frequency);
        UpdateNextReminderDate($futureReminder,$type,$systemID);

        var_dump($reminder);
        var_dump($futureReminder);
        echo "\n\n\n";
    }

    
} catch (\Throwable $th) {
    echo "Error: " . $th->getMessage();    
}

