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



class RegistrationTest extends TestCase
{  
    use TestFunctions;
    // Verify Email Endpoint
    public function testVerifyEmailEnpoint (){
        $verify_data = [
            "email" => $this->client_data["email"]
        ];        

        ob_start();
        $verification_state = $this->GetReturnValue("handleVerifyEmailEndpoint", [ $verify_data ]);
        ob_end_clean();
        
        $this->assertTrue($verification_state,"User email verification failed");                
    }

    // Send OTP Enpoint
    /**
     * @depends testVerifyEmailEnpoint
     *  
     */
    public function testSendOTPEndpoint(){
        $verify_id = generateRandomString();
        $send_data = [
            "email" => $this->client_data["email"],
            "verifyId" => $verify_id
        ];

        ob_start();
        $otp = $this->GetReturnValue("handleSendOTPEndpoint", [ $send_data ]);
        ob_end_clean();        

        $this->assertIsNumeric($otp,"User email verification failed");        

        return [
            "verifyId" => $verify_id,
            "code" => $otp,
            "email" => $this->client_data["email"]
        ];
    }

    // Register Endpoint
    /**
     * @depends testSendOTPEndpoint
     */

    public function testRegisterEndpoint($verify_object){
        $register_data = [
            ...$verify_object,
            ...$this->client_data,            
        ];        

        ob_start();
        $user_auth = $this->GetLogOutput("handleRegisterEndpoint", [ $register_data ]);
        $user_auth = json_decode($user_auth, true);
        ob_get_clean();

        $this->assertIsArray($user_auth, "Admin login failed");
        $this->assertArrayHasKey('token', $user_auth);
        $this->assertArrayHasKey('type', $user_auth);
        $this->assertArrayHasKey('uid', $user_auth);

        var_dump("User auth" , $user_auth);
    }

}

