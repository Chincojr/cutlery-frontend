<?php
require 'vendor/autoload.php';

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

function SendPushNotification ($notifyObjArr, $notifyInfo){
    /*
        Loop through the the notifyObjArr
        Send notification to each notify Obj with notifyInfo parameter
    */

    try {
        $publicKey = "BGEVwvlGirueMXIvZf1c-8QdzqxCdWfoHyOXy1tAzrRK45YnnkNxndHPS_GkKuaOe8HlkR2AKWKbQzMOP0AmOyU";
        $privateKey = "bJLT2aS5BvQBjAn14R5DCP0leuR1K95StYhuVFVgqkE";


        $auth = [
            'VAPID' => [
                'subject' => 'mailto:YOUR_EMAIL@example.com',
                'publicKey' => $publicKey,
                'privateKey' => $privateKey,
            ],
        ];
        
        $webPush = new WebPush($auth);

        foreach ($notifyObjArr as $notifyObj) {
            $subscription = Subscription::create(json_decode($notifyObj["notify"], true));
            $webPush->queueNotification(
                $subscription,
                json_encode($notifyInfo)
            );
        }

        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();
            if ($report->isSuccess()) {
                echo "Notification sent . \n";
            } else {
                echo "Notification failed. \n";
            }
        }       
        return  true; 
    } catch (\Throwable $th) {
        echo "Error while sending notifications. \n" . $th->getMessage();
        return false ;
    }

}




