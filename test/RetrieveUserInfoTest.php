<?php
require __DIR__ . DIRECTORY_SEPARATOR . 'LoginTest.php';


class RetrieveUserInfoTest extends LoginTest
{
    public function testRetrieveUserInfoEndpoint() {
        ob_start();
        $admin_data = json_decode($this->GetLogOutput("handleRetrieveUserEndpoint", [ self::$adminAuth, true ]),true);
        $client_data = json_decode($this->GetLogOutput("handleRetrieveUserEndpoint", [ self::$clientAuth, true ]),true);
        ob_end_clean();

        var_dump("Admin Data: " , $admin_data);
        var_dump("Client Data: " , $client_data);
    }
}