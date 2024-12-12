<?php

$allowed_origins = [
    'https://imaginative-lollipop-0aa1ab.netlify.app/',
    'http://localhost:3000'
];


if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: *');
}


ob_start();
require 'vendor/autoload.php';
use Dotenv\Dotenv;


// Load the .env file
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

include 'utilityFunctions.php';
include 'routes.php';
include 'notifications.php';



// Extract the path from the requested URI
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));
$requestPath =  "/" .end($path_parts);

$userAuth = null ;

function getAuthToken() {
    $result = null;
    
    if (isset($_GET['auth_token']) && isset($_GET['type']) && isset($_GET['uid'])) {
        $result = [
            'auth_token' => $_GET['auth_token'],
            'type' => $_GET['type'],
            'uid' => $_GET['uid']
        ];
    }

    return $result;
}

$excludePaths = [
    '/login',
    "/verify-email",
    "/send-otp",
    "/register",
    "/admin-forget-password",
    "/forget-password",
    "/admin-change-password",
    "/change-password",
];

if (!in_array($requestPath, $excludePaths)) {
    
    $authToken = getAuthToken();

    if (
        !isset($authToken)
    ) {
        echo "Auth does not exist";
        http_response_code(401);
        return;
    }

    $token = $authToken["auth_token"];
    $uid = $authToken["uid"];
    $type = $authToken["type"];

    $userAuth = decode_jwt_token($token,$type,$uid);    

    if (
        !isset($userAuth)
    ){
        echo "Auth does not exist";
        http_response_code(401);
        return;
    }    
}



// Determine the endpoint based on the path
switch ($requestPath) {
    case '/register':
        handleRegisterEndpoint();
        break;
    case '/login':
        handleLoginEndpoint();        
        break;
    case '/send-otp':
        handleSendOTPEndpoint();
        break;
    case '/verify-email':
        handleVerifyEmailEndpoint();
        break;
    case '/subscribe-notify':
        handleSubscribeNotifyEndpoint($userAuth);
        break;
    case '/create-notify':
        handleCreateNotifyEndpoint($userAuth);
        break;
    case '/edit-notify':
        handleEditNotifyEndpoint($userAuth);        
        break;        
    case '/create-event':
        handleCreateEventEndpoint($userAuth);
        break;        
    case '/edit-event':
        handleEditEventEndpoint($userAuth);
        break;
    case '/reminder':        
        handleReminderEndpoint($userAuth);
        break;
    case '/delete':
        handleDeleteEventOrNotifyEndpoint($userAuth);
        break;
    case '/seen':
        handleSeenEndpoint($userAuth);
        break;
    case '/admin-forget-password':
        handleForgetPasswordOTPEndpoint(true);
        break;
    case '/forget-password':
        handleForgetPasswordOTPEndpoint(false);
        break;
    case '/admin-change-password':
        handleChangePasswordEndpoint(true);
        break;
    case '/change-password':
        handleChangePasswordEndpoint(false);
        break;        
    case '/user-info':
        handleRetrieveUserEndpoint($userAuth);
        break;        
    case '/profile-change':
        handleProfileChangeEndpoint($userAuth);
        break;            
    default:
        handleDefaultEndpoint();
        break;
}

ob_end_flush();