<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . 'LoginTest.php';


class EventTest extends LoginTest
{
    // Test create Event endpoint
    /**
     * @depends testLoginEndpoint
     */
    public function testCreateEventEndpoint()
    {                
        $image_path = __DIR__ . DIRECTORY_SEPARATOR . 'testImage.jpg';
        $image_data = convert_image_to_base64($image_path);
        $event_data = [
            ...$this->test_event_data,
            "image" => $image_data
        ];     

        ob_start();
        $admin_output = $this->GetReturnValue("handleCreateEventEndpoint", [ self::$adminAuth, $event_data ]);        
        $client_output = $this->GetReturnValue("handleCreateEventEndpoint", [ self::$clientAuth, $event_data ]);        
        ob_end_clean();
    
        $this->assertIsArray($admin_output,"Admin cannot create event");
        $this->assertFalse($client_output,"Client can create event");   
                
        return $admin_output; 
    }


    // Test Edit Event endpoint

    /**
     * @depends testCreateEventEndpoint
     */
    public function testEditEventEndpoint($event_data)
    {
        // $image_path = __DIR__ . DIRECTORY_SEPARATOR . 'testImage.jpg';
        // $image_data = convert_image_to_base64($image_path);
        $event_data["title"] = "Lorem 2";   

        ob_start();
        $admin_output = $this->GetReturnValue("handleEditEventEndpoint", [ self::$adminAuth, $event_data ]);        
        $client_output = $this->GetReturnValue("handleEditEventEndpoint", [ self::$clientAuth, $event_data ]);        
        ob_end_clean();

        $this->assertTrue($admin_output,"Admin cannot edit event");
        $this->assertFalse($client_output,"Client can edit event"); 
    }





}

