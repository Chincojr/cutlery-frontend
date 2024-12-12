<?php
require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

function decode_jwt_token ($jwt,$type,$uid) {
    $key = $_ENV["SECRET_KEY"]; 

    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256')); 
        $decoded_array = (array) $decoded;   
        $decoded_uid = $decoded_array["data"]->uid;               
        $decoded_type = $decoded_array["data"]->type;    

        if (
            $decoded_type === $type &&
            $decoded_uid === $uid
        ) {
            return $decoded_array;
        }else {
            throw new Error("Backend and Frontend values do not match");
        }                             
    } catch (Throwable $th) {
        error_log($th->getMessage());
        return null;
    }  
    
}

