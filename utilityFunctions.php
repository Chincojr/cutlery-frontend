<?php

$uploadImageDir = 'uploads/';
$url = "http://localhost:3001/index.php/";

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
    $host = '192.249.120.197';
    $dbname = 'nimide5_cutlery_web_app';
    $username = 'nimide5_david';
    $password = '6342oyo!';

    try {
        $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        echo 'Connection failed: ' . $e->getMessage();
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

    if (!$systemId) {
        return false;
    }

    global $uploadImageDir;

    // Extract the base64 image data
    list($type, $data) = explode(';', $base64_image);
    list(, $data)      = explode(',', $data);

    // Extract the image format from the data URI
    $image_format = substr($type, strpos($type, '/') + 1);

    // Decode the base64 data
    $image_data = base64_decode($data);

    // Specify the file name and extension
    $filename = $uploadImageDir . $systemId . "." . $image_format; // Append the appropriate image format as the file extension

    // Save the image data to a file
    

    if ( file_put_contents($filename, $image_data) ) {
        return $systemId . "." . $image_format;
    }

    return false;

}

function handleQuery($query){
    // echo $query ."\n";
    $db = getDBConnection();
    $stmt = $db->prepare($query);
    $stmt->execute();

    return $stmt;
}