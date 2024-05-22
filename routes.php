<?php

include __DIR__ . '/routes/Login.php';
include __DIR__ . '/routes/SignUp.php';
include __DIR__ . '/routes/UserVerify.php';
include __DIR__ . '/routes/UserLogged.php';
include __DIR__ . '/routes/ServiceWorker.php';
include __DIR__ . '/routes/PushNotification.php';


function handleDefaultEndpoint() {
    header("HTTP/1.0 404 Not Found");
    echo "404 Not Found";
}
