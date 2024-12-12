<?php
require __DIR__ . DIRECTORY_SEPARATOR . 'NotificationTest.php';


class SeenNotifyTest extends NotificationTest
{

    // Test Seen Notification Endpoint
    /**
     * @depends testCreateNotifyEndpoint
     */
    public function testSeenNotifyEndpoint($notify_data) {

        $seen_data = [
            "seenType" => "Notify",
            "id" => $notify_data["systemID"]
        ];

        ob_start();
        $admin_output = $this->GetReturnValue("handleSeenEndpoint", [ self::$adminAuth, $seen_data ]);        
        $client_output = $this->GetReturnValue("handleSeenEndpoint", [ self::$clientAuth, $seen_data ]);        
        ob_end_clean();

        $this->assertTrue($admin_output,"Admin seen time not recorded");
        $this->assertTrue($client_output,"Client seen time not recorded");
        
        // var_dump("Admin Output" , $admin_output);
        // var_dump("Client Output" , $client_output);
        
    }
}