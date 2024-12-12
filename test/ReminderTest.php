<?php 

require_once __DIR__ . DIRECTORY_SEPARATOR . 'LoginTest.php';


class ReminderTest extends LoginTest
{
    // Test Reminder endpoint   
    public function testReminderEndpoint()
    {                

        $reminder_data = [
            "repeatType" => "day",
            "repeatValue" => 2
        ];

        ob_start();
        $admin_output = $this->GetReturnValue("handleReminderEndpoint", [ self::$adminAuth, $reminder_data ]);
        $client_output = $this->GetReturnValue("handleReminderEndpoint", [ self::$clientAuth, $reminder_data ]);
        ob_end_clean();

        $this->assertTrue($admin_output,"Admin cannot create reminder");
        $this->assertTrue($client_output,"Client can create reminder");


        // var_dump("Admin Output" , $admin_output);
        // var_dump("Client Output" , $client_output);


    }
}