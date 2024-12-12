<?php

include 'utilityFunctions.php';

function HandleUpdateChat(
        $clientID,
        $recipientID,
        $type,
        $recipient,
        $from,
        $images,
        $text,
        $messageID,
        $replyTo
    ){

    /*
        Update Client Chat
        Retrieve Client Chat
        Retrieve Recipeints Notification

        Run procedure
            IF sentByAdmin
                retrieve user record (notify column) and confirm it has a chat record
            ElSE
                retrieve ad in record (notify column) 
            
            IF record exist
                upate the user chat record (messages)
                retrieve the updated user chat record
                Log the user chat record into the Temproray Table and change error value to false
            
            Return all Values of the Temporary Table
            Drop all Temporary Tables
        Return procedure response

        

    */

    try {
        // Update Chat
        // retrieve the updated chat
        // Retrieve the Reciepeints notify  column
        $time = date('Y-m-d H:i:s');        
        $updateChat = handleQuery("
            UPDATE Chat
            SET messages =
                CASE
                    WHEN JSON_VALID(messages) AND JSON_TYPE(messages) = 'ARRAY' 
                        THEN JSON_ARRAY_APPEND(
                                messages, 
                                '$', 
                                JSON_OBJECT(
                                    'recipient','$recipient',
                                    'from','$from',
                                    'images','$images',
                                    'text','$text',
                                    'seen',NULL,
                                    'messageID','$messageID',
                                    'time','$time',
                                    'replyTo','$replyTo'
                                )
                            )
                    ELSE 
                        JSON_ARRAY(
                            JSON_OBJECT(
                                'recipient','$recipient',
                                'from','$from',
                                'images','$images',
                                'text','$text',
                                'seen',NULL,
                                'messageID','$messageID',
                                'time','$time',
                                'replyTo','$replyTo'
                            )
                        )
                END
            WHERE systemID = '$clientID'
        ");

        if ( $updateChat->rowCount() !== 1 ) {
            throw new Error("Error Updating Chat");
        }
        
        // retrieve the recipient notify
        $DB = $type === "Admin" ? "Users" : 'Admin' ;
        $retrieveRecipientRecord = handleQuery("
            SELECT name,notify
            FROM $DB
            WHERE systemID = '$recipientID'
        ");
        $retrieveRecipientRecord = $retrieveRecipientRecord->fetchAll(PDO::FETCH_ASSOC);
        if (count($retrieveRecipientRecord) !== 1) {            
            throw new Error("Error while retrieving recipient infor");
        }
        $retrieveRecipientRecord = $retrieveRecipientRecord[0];

        // retrieve the updated chat
        $updatedChatRecord = handleQuery("
            SELECT messages
            FROM Chat         
            WHERE systemID = '$clientID';
        ");
        $updatedChatRecord = $updatedChatRecord->fetchAll(PDO::FETCH_ASSOC);
        if (count($updatedChatRecord) !== 1) {            
            throw new Error("Error while retrieving recipient infor");
        }
        $updatedChatRecord = $updatedChatRecord[0];
        return [
            "recipient" => $retrieveRecipientRecord,
            "chat" => $updatedChatRecord
        ];        

    } catch (\Throwable $th) {
        echo "Error: " . $th->getMessage();
        return false;
    }

}

