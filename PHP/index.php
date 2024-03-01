<?php

include "request.php";
include "access.php";

//Initialise Request
$request = new Request();

//Set the header depending on the request type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//Generate the appropriate webpage depending on the path requested
switch($request->getPath()){
    case 'test':
        $access = new Access();
        break;
}
