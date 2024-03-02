<?php

include "apiresponse.php";
include "database.php";

class Access extends APIResponse
{
    private $db;

    public function __construct()
    {
        $db = new Database();
        if($_SERVER['REQUEST_METHOD'] === 'GET'){
            try{
                $resultArr = [];
                $query = "SELECT DISTINCT PROVIDER_NAME FROM nss_data";
                $result = $db->executeSQL($query)->fetchAll();

                if(!empty($result)){
                    foreach($result as $data){
                        array_push($resultArr,["provider" => $data['PROVIDER_NAME']]);
                    }
                }
                $this->setResponse($resultArr);
            }
            catch (Exception $e){
                $this->setResponse($this->show_error(500));
            }
        }

        //Display the response in JSON format
        echo json_encode($this->getResponse());
    }
}