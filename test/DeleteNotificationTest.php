<?php

require __DIR__ . DIRECTORY_SEPARATOR . 'NotificationTest.php';

class DeleteNotificationTest extends NotificationTest
{
    // Test Delete Notify endpoint
    /**
     * @depends testCreateNotifyEndpoint
     */
    public function testDeleteNotifyEndpoint($notify_data)
    {

        $delete_data = [
            "deleteType" => "Notify",
            "ids" => [ $notify_data["systemID"] ]
        ];
        
        ob_start();
        $admin_output = $this->GetReturnValue("handleDeleteEventOrNotifyEndpoint", [ self::$adminAuth, $delete_data ]);        
        $client_output = $this->GetReturnValue("handleDeleteEventOrNotifyEndpoint", [ self::$clientAuth, $delete_data ]);        
        ob_end_clean();

        // var_dump("Admin Output: " , $admin_output);
        // var_dump("Client Output: " , $client_output);
        
        $this->assertTrue($admin_output,"Admin cannot delete notify");
        $this->assertFalse($client_output,"Client can delete notify"); 
    }

}