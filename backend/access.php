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
        $resultArr = [];
        $query = "WITH POSITIVE_RANK AS (
                        SELECT  POPULATION, PROVIDER_NAME, MODE_OF_STUDY, LEVEL_OF_STUDY, QUESTION_NUMBER, POSITIVITY_MEASURE,
                                RANK() OVER (PARTITION BY QUESTION_NUMBER ORDER BY POSITIVITY_MEASURE DESC) AS RANKING,
                                COUNT(*) OVER (PARTITION BY QUESTION_NUMBER) AS TOTAL_PROVIDER
                        FROM    nss_data
                        WHERE   POPULATION = :population
                        AND     MODE_OF_STUDY = :mode
                        AND     LEVEL_OF_STUDY = :level
                        AND     PROVIDER_NAME NOT IN ('UK','England','Northern Ireland','Scotland','Wales')
                    )
                    SELECT  pr.POPULATION, pr.MODE_OF_STUDY, pr.LEVEL_OF_STUDY, pr.QUESTION_NUMBER, q.qtext AS QUESTION_TEXT,
                            pr.POSITIVITY_MEASURE AS POSITIVITY,
                            pr.RANKING AS POSITIVITY_RANK,
                            ROUND(100-((pr.RANKING * 100)/pr.TOTAL_PROVIDER)) AS RANK_PERCENTAGE
                    FROM    POSITIVE_RANK pr,
                            nss_question q
                    WHERE   pr.QUESTION_NUMBER = q.qid
                    AND     PROVIDER_NAME = 'University of Northumbria at Newcastle'";

        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level)];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, [
                    "qid" => $data['QUESTION_NUMBER'],
                    "qtext" => $data['QUESTION_TEXT'],
                    "positivity" => $data['POSITIVITY'],
                    "rank" =>$data['POSITIVITY_RANK'],
                    "rank_percentage" => $data['RANK_PERCENTAGE']
                ]);
            }
            return [
                "population" => $result[0]['POPULATION'],
                "mode" => $result[0]['MODE_OF_STUDY'],
                "level" => $result[0]['LEVEL_OF_STUDY'],
                "results" => $resultArr
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