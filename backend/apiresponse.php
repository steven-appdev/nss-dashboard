<?php
class APIResponse
{
    private $response;
    protected function setResponse($response){
        //Set the response
        $this->response = $response;
    }

    protected function getResponse(){
        //Return the response
        return $this->response;
    }

    protected function showError($errorCode){
        //Set the response code and return appropriate error message
        switch($errorCode){

            //No Content error
            case 204:
                http_response_code($errorCode);
                return null;
                
            //Incorrect Parameter error
            case 400:
                http_response_code($errorCode);
                return array("Message" => "Incorrect parameters");
            
            //Not Authorised error
            case 401:
                http_response_code($errorCode);
                return array("Message" => "Not authorised!");

            //Method not Allowed error
            case 405:
                http_response_code($errorCode);
                return array("Message" => "Sorry! Method not allowed!");

            //Internal Server error
            case 500:
                http_response_code($errorCode);
                return array("Message" => "Internal Server Error!");


            //Request Method Not Available error
            case 501:
                http_response_code($errorCode);
                return array("Message" => "Sorry! Request method not found");

            //No row affected
            case 404:
                http_response_code($errorCode);
                return array("message" => "Something went wrong! No row has been affected!");
        }
    }
}