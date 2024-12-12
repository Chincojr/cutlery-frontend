<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . 'LoginTest.php';

class ProfileChangeTest extends LoginTest
{
    // Test Profile Change endpoint
    public function testProfileChangeEndpoint()
    {
        $image_path = __DIR__ . DIRECTORY_SEPARATOR . 'testImage.jpg';
        $image_data = convert_image_to_base64($image_path);
        $profile_data = [
            "name" => "Changed Name",
            "image" => $image_data 
        ];

        ob_start();
        $admin_output = $this->GetReturnValue("handleProfileChangeEndpoint", [ self::$adminAuth, $profile_data ]);
        $client_output = $this->GetReturnValue("handleProfileChangeEndpoint", [ self::$clientAuth, $profile_data ]);
        ob_end_clean();

        $this->assertTrue($admin_output,"Admin cannot change profile");
        $this->assertTrue($client_output,"Client cannot change profile");

        // var_dump("Admin Output" , $admin_output);
        // var_dump("Client Output" , $client_output);
    }
}