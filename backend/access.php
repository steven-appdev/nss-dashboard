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
                }else if(isset($_REQUEST['quartdiff'])){
                    $result = $this->RetrieveQuartileDiff($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level'], $_REQUEST['q']);   
                }else if(isset($_REQUEST['test'])){
                    $upload_max_size = ini_get('upload_max_filesize');
                    $result = ["result" => $upload_max_size];
                }
                $this->setResponse($result);
            }
            catch(Exception $e)
            {
                $this->setResponse(["err" => $e]);
            }
        }else if ($_SERVER['REQUEST_METHOD'] === 'POST'){
            try{
                if(isset($_REQUEST['upload'])){
                    $result = $this->UploadFile($db, $_FILES["file"]["tmp_name"]);
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

    private function UploadFile($db, $file)
    {
        $result = "";
        $file = fopen($file,"r");
        $query = "INSERT INTO test_data 
                    (NUM, POPULATION, UKPRN, PROVIDER_NAME, MODE_OF_STUDY, LEVEL_OF_STUDY, SUBJECT_LEVEL, 
                    CAH_CODE, CAH_NAME, QUESTION_NUMBER, NUMBER_RESPONSES, NUMBER_POPULATION, SUPPRESSION_REASON, 
                    OPTION1, OPTION2, OPTION3, OPTION4, OPTION5, NOT_APPLICABLE, POSITIVITY_MEASURE, STANDARD_DEVIATION, 
                    BENCHMARK, DIFFERENCE, contr_benchmark, MATERIALLY_BELOW_BENCH, INLINE_WITH_BENCH, MATERIALLY_ABOVE_BENCH, 
                    DIFFERENCE_LOWERCI99, DIFFERENCE_LOWERCI97, DIFFERENCE_LOWERCI95, DIFFERENCE_LOWERCI92, DIFFERENCE_LOWERCI90, 
                    DIFFERENCE_LOWERCI87, DIFFERENCE_LOWERCI85, DIFFERENCE_LOWERCI82, DIFFERENCE_LOWERCI80, DIFFERENCE_LOWERCI77, 
                    DIFFERENCE_LOWERCI75, DIFFERENCE_UPPERCI99, DIFFERENCE_UPPERCI97, DIFFERENCE_UPPERCI95, DIFFERENCE_UPPERCI92, 
                    DIFFERENCE_UPPERCI90, DIFFERENCE_UPPERCI87, DIFFERENCE_UPPERCI85, DIFFERENCE_UPPERCI82, DIFFERENCE_UPPERCI80, 
                    DIFFERENCE_UPPERCI77, DIFFERENCE_UPPERCI75, INDICATOR_LOWERCI99, INDICATOR_LOWERCI97, INDICATOR_LOWERCI95, 
                    INDICATOR_LOWERCI92, INDICATOR_LOWERCI90, INDICATOR_LOWERCI87, INDICATOR_LOWERCI85, INDICATOR_LOWERCI82, 
                    INDICATOR_LOWERCI80, INDICATOR_LOWERCI77, INDICATOR_LOWERCI75, INDICATOR_UPPERCI99, INDICATOR_UPPERCI97, 
                    INDICATOR_UPPERCI95, INDICATOR_UPPERCI92, INDICATOR_UPPERCI90, INDICATOR_UPPERCI87, INDICATOR_UPPERCI85, 
                    INDICATOR_UPPERCI82, INDICATOR_UPPERCI80, INDICATOR_UPPERCI77, INDICATOR_UPPERCI75, PUB_RESPONSE_HEADCOUNT, PUB_RESPRATE)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        while(($line = fgetcsv($file))!== FALSE){
            foreach($line as $key => $value){
                if($value === "NULL")
                {
                    $line[$key] = null;
                }
            }
            $result = $db->executeSQL($query, $line);
        }
        fclose($file);
        return $result;      
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

    private function RetrieveQuartileDiff($db, $population, $mode, $level, $question)
    {
        $query = "WITH 
                    POSITIVE_RANK AS (
                        SELECT  POPULATION, PROVIDER_NAME, MODE_OF_STUDY, LEVEL_OF_STUDY, QUESTION_NUMBER, POSITIVITY_MEASURE,
                        ROUND(100-((RANK() OVER (PARTITION BY QUESTION_NUMBER ORDER BY POSITIVITY_MEASURE DESC) * 100)/COUNT(*) OVER (PARTITION BY QUESTION_NUMBER))) AS 	
                        RANK_PERCENTAGE
                        FROM    nss_data
                        WHERE   POPULATION = :population
                        AND     MODE_OF_STUDY = :mode
                        AND     LEVEL_OF_STUDY = :level
                        AND     PROVIDER_NAME NOT IN ('UK','England','Northern Ireland','Scotland','Wales')
                    ),
                    POSITIVE_QUARTILE AS (
                        SELECT 	*,
                                CASE
                                    WHEN RANK_PERCENTAGE >= 75 THEN 1
                                    WHEN RANK_PERCENTAGE >= 50 THEN 2
                                    WHEN RANK_PERCENTAGE >= 24 THEN 3
                                    ELSE 4
                                END AS QUARTILE
                        FROM POSITIVE_RANK
                        WHERE QUESTION_NUMBER = :question
                    )
                    SELECT  pq.QUESTION_NUMBER, q.qtext, pq.POSITIVITY_MEASURE, pq.QUARTILE,
                            pq.POSITIVITY_MEASURE - ( SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '1' ) AS DIFFERENCE_Q1_MIN,
                            pq.POSITIVITY_MEASURE - ( SELECT MAX(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '1' ) AS DIFFERENCE_Q1_MAX,
                            pq.POSITIVITY_MEASURE - ( SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '2' ) AS DIFFERENCE_Q2_MIN,
                            pq.POSITIVITY_MEASURE - ( SELECT MAX(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '2' ) AS DIFFERENCE_Q2_MAX,
                            pq.POSITIVITY_MEASURE - ( SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '3' ) AS DIFFERENCE_Q3_MIN,
                            pq.POSITIVITY_MEASURE - ( SELECT MAX(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '3' ) AS DIFFERENCE_Q3_MAX,
                            pq.POSITIVITY_MEASURE - ( SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '4' ) AS DIFFERENCE_Q4_MIN,
                            pq.POSITIVITY_MEASURE - ( SELECT MAX(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '4' ) AS DIFFERENCE_Q4_MAX
                    FROM    POSITIVE_QUARTILE pq,
                            nss_question q
                    WHERE   pq.QUESTION_NUMBER = q.qid
                    AND		pq.PROVIDER_NAME = 'University of Northumbria at Newcastle';";

        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level), "question" => $question];
        $result = $db->executeSQL($query, $parameter)->fetch(PDO::FETCH_ASSOC);
        if(!empty($result))
        {
            $diffArr = [[
                "label" => "Q".$result['QUARTILE'],
                "data" => [$result['POSITIVITY_MEASURE']],
                "current" => true
            ]];

            if($result['QUARTILE'] == 1)
            {
                array_push($diffArr, [
                    "label" => "Q1 Maximum",
                    "data" => [abs($result['DIFFERENCE_Q1_MAX'])],
                    "current" => false
                ]);
            }
            else
            {
                $i = $result['QUARTILE']-1;
                while($i != 0)
                {
                    array_push($diffArr, [
                        "label" => "Value till Q".$i,
                        "data" => [abs($result['DIFFERENCE_Q'.$i.'_MIN'])],
                        "current" => false
                    ]);
                    array_push($diffArr, [
                        "label" => "Q".$i." Maximum",
                        "data" => [round(abs($result['DIFFERENCE_Q'.$i.'_MAX'])-abs($result['DIFFERENCE_Q'.$i.'_MIN']),2)],
                        "current" => false
                    ]);
                    $i--;
                }
            }

            return [
                "qid" => $result['QUESTION_NUMBER'],
                "qtext" => $result['qtext'],
                "positive" => $result['POSITIVITY_MEASURE'],
                "quartile" => $result['QUARTILE'],
                "differences" => $diffArr
            ];
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