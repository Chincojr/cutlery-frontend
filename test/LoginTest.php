<?php

use Dotenv\Dotenv;
use PHPUnit\Framework\TestCase;


// Load the .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();
$basename = dirname(__DIR__);


require_once $basename . DIRECTORY_SEPARATOR . 'utilityFunctions.php';
require_once $basename . DIRECTORY_SEPARATOR . 'routes.php';
require_once $basename . DIRECTORY_SEPARATOR . 'notifications.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'testFunctions.php';



class LoginTest extends TestCase
{
    use TestFunctions;

    public static $adminAuth;
    public static $clientAuth;
    
    // Test login endpoint
    public function testLoginEndpoint()
    {                

        $adminLogin = $this->admin_login_info;
        $clientLogin = [
            "email" => $this->client_data["email"],
            "password" => $this->client_data["password"],
            "type" => $this->client_data["type"]
        ];

        $admin_frontend_auth = json_decode($this->GetLogOutput("handleLoginEndpoint", [$adminLogin]),true);
        $client_frontend_auth = json_decode($this->GetLogOutput("handleLoginEndpoint", [$clientLogin]),true);

        var_dump("Admin Auth: " , $admin_frontend_auth);
        var_dump("Client Auth: " , $client_frontend_auth);

        $this->assertIsArray($admin_frontend_auth, "Admin login failed");
        $this->assertArrayHasKey('token', $admin_frontend_auth);
        $this->assertArrayHasKey('type', $admin_frontend_auth);
        $this->assertArrayHasKey('uid', $admin_frontend_auth);

        $this->assertIsArray($client_frontend_auth, "Client login failed");
        $this->assertArrayHasKey('token', $client_frontend_auth);
        $this->assertArrayHasKey('type', $client_frontend_auth);
        $this->assertArrayHasKey('uid', $client_frontend_auth);

        self::$adminAuth = decode_jwt_token($admin_frontend_auth['token'], $admin_frontend_auth['type'], $admin_frontend_auth['uid']);
        self::$clientAuth = decode_jwt_token($client_frontend_auth['token'], $client_frontend_auth['type'], $client_frontend_auth['uid']);

        $this->assertIsArray(self::$adminAuth, "Admin auth data is missing");
        $this->assertIsArray(self::$clientAuth, "Client auth data is missing");
        
    }

    
}

