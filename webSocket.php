<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Psr\Http\Message\RequestInterface;

require __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;

// Load the .env file
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
error_reporting(E_ALL & ~E_DEPRECATED);

include 'webSocketFunctions.php';
include 'notifications.php';
include __DIR__ . '/JWT/decodeJWT.php';



class Chat implements MessageComponentInterface {

    /*
        On connection
            Retrieve the type, uid and token from the uri
            Authenticate the type, uid, and token
            If user's SplObjectStorage exist 
                - Attach conn to the object
            Else
                - Create a SplObjectStorage 
                - attach connection to SplObjectStorage 
                - store user's SplObjectStorage in $this->clients an associative format where the systemID is the key                
        On Message 
            Retrieve the connection systemID and the type of the connection from the request manage accordingly
            - Admin
                Determine who is the user
                    IF isAdmin is true
                        recipient is user
                    ELSE
                        sender is user
                Retrieve recipient notify column
                Save the msg sent in the user Chat record (messages column)
                Retrieve updated Chat record
                Send the msg to the admin and user if they are online
                Send notification to recipient 
        On Close 
            Retrieve the systemID from the connection, 
            Delete the specific connection from the users SplObjectStorage
            If after deleting the connection the user's SplObjectStorage is empty remove the user's object from the clients array 
        On Error 
    */

    protected $clients;

    /**
     * Initializes a new instance of the Chat class.
     * Sets up an empty associative array to store client connections.
     */
    public function __construct() {
        $this->clients = [];
    }

    /**
     * On connection
     *
     * @param ConnectionInterface $conn
     * 
     * This function is called whenever a new connection is established.
     * It retrieves the type, uid and token from the uri and authenticates the user.
     * If the user is authenticated, it checks if the user's SplObjectStorage exist 
     * If it does, it attaches the new connection to the user's SplObjectStorage 
     * If it doesn't, it creates a new SplObjectStorage and attaches the connection to the object
     * It then stores the user's SplObjectStorage in $this->clients an associative format where the systemID is the key
     * It also notifies all users of the new connection
     */
    public function onOpen(ConnectionInterface $conn) {
        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);

        // Retrieve user credentials if returns false exit the function
        if (
            !isset($queryParams["type"]) ||
            !isset($queryParams["uid"]) ||
            !isset($queryParams["token"]) ||
            !is_string($queryParams["type"]) ||
            !is_string($queryParams["uid"]) ||
            !is_string($queryParams["token"])             
        ) {
            var_dump("Bad Request",$queryParams);
            $conn->close();
            return;
        }

        // authenticate 
        $token = $queryParams["token"];
        $uid = $queryParams["uid"];
        $type = $queryParams["type"];

        $userAuth = decode_jwt_token($token,$type,$uid);
        if (
            !isset($userAuth)
        ){
            echo "UnAuthorized\n";
            var_dump($userAuth);
            $conn->close();
            return;
        }    


        // Create a new SplObjectStorage for the systemID and store each of the user's connection inside
        if (
            isset($this->clients[$uid]) &&
            $this->clients[$uid] instanceof \SplObjectStorage
        ) {
            // attach the new user connection to the user's SplObjectStorage
            $this->clients[$uid]->attach($conn);
            echo "New connection! ({$conn->resourceId}) uid: {$uid} Joined Channel, Number of Connections (" . count($this->clients[$uid]) . ") \n";
        } else {
            // create a new SplObjectStorage for the user and attach connection to the object
            $this->clients[$uid] = new \SplObjectStorage;
            $this->clients[$uid]->attach($conn);
            echo "New connection! ({$conn->resourceId}) uid: {$uid} Channel Created, Number of Connections (" . count($this->clients[$uid]) . ") \n";   
        }
        
        foreach ($this->clients as $clientSockets) {
            foreach ($clientSockets as $clientSocket) {
                $clientSocket->send(
                    json_encode([
                        "action" => "online_users",
                        "message" => array_keys($this->clients),
                    ])
                );                
            }            
        }
        
        
    }

    public function onMessage(ConnectionInterface $conn, $data) {

        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);
        $uid = $queryParams["uid"];
        $type = $queryParams["type"];

        $dataJSON = json_decode($data,true);

        if (
            !isset($dataJSON) &&
            !is_string($dataJSON["type"]) &&
            !isset($dataJSON["message"]) 
        ) {
            var_dump("Invalid request");
            return;
        } 

        
        $messageAction = $dataJSON["action"];
        $message = $dataJSON["message"];

        switch ($messageAction) {
            case 'Contact':
                try {
                    // confirm it as a recipent and an admin State
                    if (
                        isset($message["recipient"]) &&
                        isset($message["from"]) &&
                        isset($dataJSON["link"]) &&
                        isset($dataJSON["messageID"]) &&
                        is_string($message["recipient"]) &&
                        is_string($message["from"]) &&
                        is_string($dataJSON["link"]) &&
                        is_string($dataJSON["messageID"]) 
                    ) {                        
                        $from = $message["from"];
                        $messageID = $dataJSON["messageID"];

                        if ($from != $uid) {
                            echo "Error websocket profile and sender does not match";
                            throw new Error($messageID);
                        }                    
                        $sender = $uid;                        
                        $savedImages = [];
                        $recipient = $message["recipient"];

                        // determine who is the user
                        if ( $type === "Admin") {
                            $client = $recipient;
                            $admin = $sender;
                        } else {
                            $admin = $recipient;
                            $client = $sender;
                        }
                        
                        // handle Images 
                        if (
                            isset($message["images"]) &&
                            is_array($message["images"])
                        ) {
                            foreach ($message["images"] as $image) {
                                $imageID = generateRandomString();
                                $imageName = handleSavingImage($image,$imageID);
                                if (
                                    $imageName
                                ) {
                                    array_push($savedImages,$imageName);
                                } else {
                                    echo "Error websocket: while saving image";
                                    throw new Error($messageID);
                                }
                            }
                        }

                        $text = $message["text"];                        
                        $replyTo = $message["replyTo"];
                        $savedImages = json_encode($savedImages);
                        $chatRecord = HandleUpdateChat($client,$recipient,$type,$recipient,$from,$savedImages,$text,$messageID,$replyTo);

                        if (
                            !$chatRecord
                        ) {
                            echo "Error handling message";
                            throw new Error($messageID);
                        }
                        $link = $dataJSON["link"];
                        
                        // remove message from sender pending messages
                        $conn->send(
                            json_encode([
                                "action" => "remove_pending",
                                "message" => [
                                    "recipient" => $recipient,
                                    "messageID" => $messageID
                                ]
                            ])
                        );

                        $updatedChat = json_encode([
                            "action" => "contact",
                            "message" => [                                
                                "messageID" => $messageID,
                                "clientID" => $client,
                                "chat" => $chatRecord["chat"]["messages"],                                            
                            ]                            
                        ]);
                        // Sending to recipient 
                        if (
                            isset($this->clients[$recipient]) 
                        ) {                    
                            foreach ($this->clients[$recipient] as $clientSocket) {
                                $clientSocket->send($updatedChat);
                            }
                        } 

                        // Sending to sender
                        if (
                            isset($this->clients[$sender]) 
                        ) {                    
                            foreach ($this->clients[$sender] as $clientSocket) {
                                $clientSocket->send($updatedChat);
                            }
                        }                        

                        // notify recipient
                        $notifyObj = $chatRecord["recipient"]["notify"];
                        if (
                            isset($notifyObj)
                        ) {                                                        

                            $sendNotifications = SendPushNotification(
                                [
                                    [
                                        "notify" => $notifyObj
                                    ]
                                ],
                                [
                                    "title" => $chatRecord["recipient"]["name"],
                                    "body" => "New message",
                                    "link" => $link ,
                                ]
                            );
                            var_dump("Send notifications state ". $sendNotifications);
                            if ($sendNotifications) {
                                var_dump("Recipient notified");
                            } else {
                                var_dump("Error: Recipient was not notified");
                            }
                            
                        }                                            

                    } else {
                        var_dump("Invalid data");
                    }                    
                } catch (\Throwable $th) {
                    $messageID = $th->getMessage();
                    $sender = $uid;
                    foreach ($this->clients[$sender] as $senderSocket) {
                        $senderSocket->send(
                            json_encode([
                                "type" => "Error",
                                "message" => [
                                    "messageID" => $messageID,                                        
                                ]
                            ])
                        );
                    }
                }


                break;
            default:
                # code...
                break;
        }

    }

    public function onClose(ConnectionInterface $conn) {

        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);

        if (
            !isset($queryParams['uid'])
        ) {
            return;
        }

        $uid = $queryParams['uid'] ;

        // check if the connection was stored and delete the connection from the channel else exit function
        if (
            isset($this->clients[$uid])
        ) {
            $this->clients[$uid]->detach($conn);
            echo "Connection {$conn->resourceId} has disconnected. Uid: {$uid}\n";
        } else {
            var_dump("Connection does not exist");
            return;
        }

        // check if the connection is empty 
        if (count($this->clients[$uid]) === 0) {
            unset($this->clients[$uid]);
            echo "This channel {$uid} has been disconnected\n";
        }

        foreach ($this->clients as $clientSockets) {
            foreach ($clientSockets as $clientSocket) {
                $clientSocket->send(
                    json_encode([
                        "type" => "OnlineUsers",
                        "message" => [
                            "users" => array_keys($this->clients),
                        ]
                    ])
                );                
            }            
        }


    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}



// Set up the WebSocket server with the session provider
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
                new Chat()
        )
    ),
    8080
);

$server->run();
