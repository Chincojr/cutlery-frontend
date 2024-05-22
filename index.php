<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: *");


include 'utilityFunctions.php';

include 'routes.php';

// Extract the path from the requested URI
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove any leading slashes and explode the path by slashes
$path_parts = explode('/', trim($path, '/'));

// Get the last part of the path
$requestPath =  "/" .end($path_parts);


//   Determine the endpoint based on the path
switch ($requestPath) {
    case '/sign-up':
        handleSignUpEndpoint();
        break;
    case '/login':
        handleLoginEndpoint();
        break;
    case '/verify':
        handleVerifyEndpoint();
        break;
    case '/logged':
        handleLoggedEndpoint();
        break;
    case '/sw':
        handleServiceWorkerEndpoint();
        break;
    case '/push-notify':
        handlePushNotifyEndpoint();
        break;
    default:
        handleDefaultEndpoint();
        break;
}
