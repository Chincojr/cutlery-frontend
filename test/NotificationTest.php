<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . 'LoginTest.php';


class NotificationTest extends LoginTest
{
    
    // Test Create Notify endpoint   
    /**
     * @depends testLoginEndpoint
     */     
    public function testCreateNotifyEndpoint()
    {
        $notify_data = $this->test_notify_data;

        ob_start();
        $admin_output = $this->GetReturnValue("handleCreateNotifyEndpoint", [ self::$adminAuth, $notify_data ]);        
        $client_output = $this->GetReturnValue("handleCreateNotifyEndpoint", [ self::$clientAuth, $notify_data ]);        
        ob_end_clean();

        // var_dump("Admin Output" , $admin_output);
        // var_dump("Client Output" , $client_output);
    
        $this->assertIsArray($admin_output,"Admin cannot create notify");
        $this->assertFalse($client_output,"Client can create notify");

        return $admin_output;
    }


    // Test Create Notify endpoint

    /**
     * @depends testCreateNotifyEndpoint
     */
    public function testEditNotifyEndpoint($notify_data)
    {
        $notify_data["title"] = "Lorem";

        ob_start();
        $admin_output = $this->GetReturnValue("handleEditNotifyEndpoint", [ self::$adminAuth, $notify_data ]);        
        $client_output = $this->GetReturnValue("handleEditNotifyEndpoint", [ self::$clientAuth, $notify_data ]);        
        ob_end_clean();

        // var_dump( "Admin Output" , $admin_output);
        // var_dump( "Client Output" , $client_output);

        $this->assertTrue($admin_output,"Admin cannot edit notify");
        $this->assertFalse($client_output,"Client can edit notify"); 
    }


    

}

