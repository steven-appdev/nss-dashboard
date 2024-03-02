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
                if(isset($_REQUEST['providers'])){
                    $result = $this->RetrieveAllProviders($db);
                }else if(isset($_REQUEST['questions'])){
                    $result = $this->RetrieveAllQuestions($db);
                }else if(isset($_REQUEST['positives'])){
                    $result = $this->RetrievePositives($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level']);
                }
                $this->setResponse($result);
            }
            catch(Exception $e)
            {
                $this->setResponse(["err" => $e]);
            }
        }

        //Display the response in JSON format
        echo json_encode($this->getResponse());
    }

    private function RetrieveAllProviders($db)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT PROVIDER_NAME FROM nss_data";
        $result = $db->executeSQL($query)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr,["provider" => $data['PROVIDER_NAME']]);
            }
            return $resultArr;
        }
        else
        {
            throw new Exception("No content found!");
        }
    }

    private function RetrieveAllQuestions($db)
    {
        $resultArr = [];
        $query = "SELECT * FROM nss_question";
        $result = $db->executeSQL($query)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr,[
                    "id" => $data['qid'],
                    "question" => $data['qtext']
                ]);
            }
            return $resultArr;
        }
        else
        {
            throw new Exception("No content found!");
        }
    }

    private function RetrievePositives($db, $population, $mode, $level)
    {
        $query = "SELECT POPULATION, MODE_OF_STUDY, LEVEL_OF_STUDY, GROUP_CONCAT(POSITIVITY_MEASURE) as POSITIVITY  
                  FROM nss_data 
                  WHERE PROVIDER_NAME ='University of Northumbria at Newcastle' 
                  AND POPULATION = :population
                  AND MODE_OF_STUDY = :mode
                  AND LEVEL_OF_STUDY = :level
                  GROUP BY POPULATION, MODE_OF_STUDY, LEVEL_OF_STUDY";
        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level)];
        $result = $db->executeSQL($query, $parameter)->fetch(PDO::FETCH_ASSOC);
        if(!empty($result))
        {
            return [
                "population" => $result['POPULATION'],
                "mode" => $result['MODE_OF_STUDY'],
                "level" => $result['LEVEL_OF_STUDY'],
                "percentage" => explode(",",$result['POSITIVITY'])
            ];
        }
        else
        {
            throw new Exception("No content found!");
        }
    }

    private function CheckMode($mode)
    {
        switch($mode){
            case "all":
                return "All modes";
            case "full":
                return "Full-time";
        }
    }

    private function CheckLevel($level)
    {
        switch($level){
            case "all":
                return "All undergraduates";
            case "first":
                return "First degree";
        }
    }
}