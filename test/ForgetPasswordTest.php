<?php

use Dotenv\Dotenv;
use PHPUnit\Framework\TestCase;


// Load the .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();
$basename = dirname(__DIR__);


require $basename . DIRECTORY_SEPARATOR . 'utilityFunctions.php';
require $basename . DIRECTORY_SEPARATOR . 'routes.php';
require $basename . DIRECTORY_SEPARATOR . 'notifications.php';
require __DIR__ . DIRECTORY_SEPARATOR . 'testFunctions.php';



class ForgetPasswordTest extends TestCase
{
    use TestFunctions;

    // Test Forget Password
    public function testForgetPasswordEndpoint() {
        $verify_id = generateRandomString();
        $send_data = [
            "email" => $this->client_data["email"],
            "verifyId" => $verify_id
        ];

        ob_start();
        $otp = $this->GetReturnValue("handleForgetPasswordOTPEndpoint", [ false, $send_data ]);
        ob_end_clean();

        $this->assertIsNumeric($otp,"User email verification failed");
        // var_dump("OTP: " , $otp);

        return [
            "verifyId" => $verify_id,
            "code" => $otp
        ];
    }

    // Test Change Password
    /**
     * @depends testForgetPasswordEndpoint
     */
    public function testChangePasswordEndpoint($forget_data) {
        $change_data = [
            ...$forget_data,
            "email" => $this->client_data["email"],                      
            "password" => "123456"
        ];

        // var_dump("Change Data: " , $change_data);
        ob_start();
        $password_change_state = $this->GetReturnValue("handleChangePasswordEndpoint", [ false, $change_data ]);
        ob_end_clean();

        var_dump("Password Change State: " , $password_change_state);

    }

    
    

}

