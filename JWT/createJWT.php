<?php
require 'vendor/autoload.php';

use \Firebase\JWT\JWT;

function create_jwt_token ($type,$userID) {
    $key = $_ENV["SECRET_KEY"]; 
    $payload = [
        "iss" => "your-domain.com",  // Issuer
        "aud" => "your-domain.com",  // Audience
        "iat" => time(),             // Issued at
        "nbf" => time(),             // Not before
        "exp" => time() + 864000,      // Expiration time (10 day from now)
        "data" => [
            "uid" => $userID,  // User Email
            "type" => $type
        ]
    ];

    $jwt = JWT::encode($payload, $key, 'HS256'); // Encode the payload with the secret key using HS256 algorithm
    return $jwt;
}



