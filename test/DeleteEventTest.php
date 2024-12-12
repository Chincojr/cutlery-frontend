<?php
require __DIR__ . DIRECTORY_SEPARATOR . 'EventTest.php';

class DeleteEventTest extends EventTest
{
    // Test Delete Event endpoint   

    /**
     * @depends testCreateEventEndpoint
     */
    public function testDeleteEventEndpoint($event_data)
    {
        $delete_data = [
            "deleteType" => "Event",
            "ids" => [ $event_data["systemID"] ]
        ];        
        
        ob_start();
        $admin_output = $this->GetReturnValue("handleDeleteEventOrNotifyEndpoint", [ self::$adminAuth, $delete_data ]);        
        $client_output = $this->GetReturnValue("handleDeleteEventOrNotifyEndpoint", [ self::$clientAuth, $delete_data ]);        
        ob_end_clean();

        // var_dump("Admin Output: " , $admin_output);
        // var_dump("Client Output: " , $client_output);
        
        $this->assertTrue($admin_output,"Admin cannot delete event");
        $this->assertFalse($client_output,"Client can delete event"); 
    }
}
