<?php

trait TestFunctions {
    
    public $admin_login_info = [
        "email" => "admin@cutlery.4imidev.com",
        "password" => "EbhS@123!",
        "type" => "Admin"
    ];

    public $client_data = [
        "name" => "Test User",
        "phoneNumber" => "+44879000000",        
        "email" => "user@localhost.local",
        "password" => "123456",
        "type" => "Client"
    ];

    public $test_event_data = [
        "title" => "Test Event",
        "content" => "This is a test event",
        "image" => ""
    ];

    public $test_notify_data = [
        "title" => "Test Notification",
        "caption" => "This is a test notification",
        "link" => ""
    ];


    // Capture function output
    public function GetLogOutput(callable $function_to_call, $args)
    {
        ob_start();
        if (
            is_array($args)
        ) {            
            $function_to_call(...$args);
        } else {            
            $function_to_call();
        }                
        return ob_get_clean();
    }

    // Capture function return value
    public function GetReturnValue(callable $function_to_call, $args)
    {
        if (
            is_array($args)
        ) {            
            return $function_to_call(...$args);
        } else {            
            return $function_to_call();
        }                
    }
}


function convert_image_to_base64($image_path) {
    
    $image_data = file_get_contents($image_path);

    // Encode the image data to Base64
    $base64_image = base64_encode($image_data);

    // Prepare the Base64 string with MIME type
    $image_mime_type = mime_content_type($image_path); // Get MIME type of the image
    $base64_image_with_prefix = "data:$image_mime_type;base64,$base64_image";
    
    return $base64_image_with_prefix;
}
