<?php

include __DIR__ . '/routes/Login.php';
include __DIR__ . '/routes/Register.php';
include __DIR__ . '/routes/UserVerify.php';
include __DIR__ . '/routes/SubscribeNotification.php';
include __DIR__ . '/routes/Notification.php';
include __DIR__ . '/routes/Event.php';
include __DIR__ . '/routes/Reminder.php';
include __DIR__ . '/routes/Delete.php'; // handleDeleteEventEndpoint
include __DIR__ . '/routes/Seen.php';
include __DIR__ . '/routes/ForgetPassword.php';
include __DIR__ . '/routes/RetrieveUserInfo.php'; // handleRetrieveUserEndpoint
include __DIR__ . '/routes/ProfileChange.php'; // handleRetrieveUserEndpoint




include __DIR__ . '/JWT/createJWT.php';
include __DIR__ . '/JWT/decodeJWT.php';




function handleDefaultEndpoint() {
    header("HTTP/1.0 404 Not Found");
    echo "404 Not Found";
}


