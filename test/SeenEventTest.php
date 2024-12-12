<?php
require __DIR__ . DIRECTORY_SEPARATOR . 'EventTest.php';

class SeenEventTest extends EventTest
{
    // Test Seen Event Endpoint
    /**
     * @depends testCreateEventEndpoint
     */
    public function testSeenEventEndpoint($event_data) {
        $seen_data = [
            "seenType" => "Event",
            "id" => $event_data["systemID"]
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
