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
                    $result = $this->RetrieveAllProviders($db, $_REQUEST['year']);
                }else if(isset($_REQUEST['questions'])){
                    $result = $this->RetrieveAllQuestions($db);
                }else if(isset($_REQUEST['years'])){
                    $result = $this->RetrieveAllYears($db);
                }else if(isset($_REQUEST['subjects'])){
                    $result = $this->RetrieveAllSubjects($db, $_REQUEST['year'], $_REQUEST['provider']);
                }else if(isset($_REQUEST['modes'])){
                    $result = $this->RetrieveAllModes($db, $_REQUEST['year'], $_REQUEST['provider'], $_REQUEST['subject']);
                }else if(isset($_REQUEST['levels'])){
                    $result = $this->RetrieveAllLevels($db, $_REQUEST['year'], $_REQUEST['provider'], $_REQUEST['subject']);
                }else if(isset($_REQUEST['populations'])){
                    $result = $this->RetrieveAllPopulations($db, $_REQUEST['year'], $_REQUEST['provider'], $_REQUEST['subject']);
                }else if(isset($_REQUEST['positives'])){
                    $result = $this->RetrievePositives($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level'], $_REQUEST['year'],$_REQUEST['subject']);
                }else if(isset($_REQUEST['quartdiff'])){
                    $result = $this->RetrieveQuartileDiff($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level'], $_REQUEST['q'], $_REQUEST['year'],$_REQUEST['subject']);
                }else if(isset($_REQUEST['resprate'])){
                    $result = $this->RetrieveResponseRate($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level'], $_REQUEST['q'], $_REQUEST['year'],$_REQUEST['subject']);
                }else if(isset($_REQUEST['gauge'])){
                    $result = $this->RetrieveGauge($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level'], $_REQUEST['q'], $_REQUEST['year'],$_REQUEST['subject']);
                }else if(isset($_REQUEST['history'])){
                    $result = $this->RetrieveHistory($db, $_REQUEST['population'], $_REQUEST['mode'], $_REQUEST['level'], $_REQUEST['q'], $_REQUEST['provider'],$_REQUEST['subject']);
                }else if(isset($_REQUEST['compare'])){
                    $result = $this->RetrieveCompare($db, $_REQUEST['yearx'], $_REQUEST['populationx'], $_REQUEST['modex'], $_REQUEST['levelx'], $_REQUEST['providerx'],$_REQUEST['subjectx'],
                                                     $_REQUEST['yeary'], $_REQUEST['populationy'], $_REQUEST['modey'], $_REQUEST['levely'], $_REQUEST['providery'],$_REQUEST['subjecty']);
                }else if(isset($_REQUEST['integration'])){
                    $result = $this->RetrieveIntegration($db, $_REQUEST['year']);
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
                    (YEAR, NUM, POPULATION, UKPRN, PROVIDER_NAME, MODE_OF_STUDY, LEVEL_OF_STUDY, SUBJECT_LEVEL, 
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
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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

    private function RetrieveAllProviders($db, $year)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT PROVIDER_NAME FROM nss_data WHERE YEAR = :year";
        $parameter = ["year" => $year];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr,["provider" => $data['PROVIDER_NAME']]);
            }
            return $resultArr;
        }
    }

    private function RetrieveAllQuestions($db)
    {
        $resultArr = [];
        $query = "SELECT tq.tid, tq.qid, q.qtext
                    FROM nss_themequestions AS tq, nss_question AS q
                    WHERE tq.qid = q.qid
                    UNION
                    SELECT t.tid, t.tid AS qid, t.ttext AS qtext
                    FROM nss_theme AS t
                    ORDER BY CASE WHEN tid IS NULL THEN 1 ELSE 0 END, tid, qid;";
        $result = $db->executeSQL($query)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr,[
                    "id" => $data['qid'],
                    "question" => ($data['qid'][0] == "T") ? "--- ".$data['qid'].": ".$data['qtext']." ---" : $data['qid'].": ".$data['qtext']
                ]);
            }
            return $resultArr;
        }
        else
        {
            throw new Exception("No content found!");
        }
    }

    private function RetrieveAllYears($db)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT YEAR FROM nss_data";
        $result = $db->executeSQL($query)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, ["year" => $data["YEAR"]]);
            }
            return $resultArr;
        }
    }

    private function RetrieveAllSubjects($db, $year, $provider)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT CAH_NAME FROM nss_data WHERE YEAR = :year AND PROVIDER_NAME = :provider";
        $parameter = ["year" => $year, "provider" => $provider];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, ["subject" => $data["CAH_NAME"]]);
            }
            return $resultArr;
        }
    }

    private function RetrieveAllModes($db, $year, $provider, $subject)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT MODE_OF_STUDY FROM nss_data WHERE YEAR = :year AND PROVIDER_NAME = :provider AND CAH_NAME = :subject";
        $parameter = ["year" => $year, "provider" => $provider, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, ["mode" => $data["MODE_OF_STUDY"]]);
            }
            return $resultArr;
        }
    }

    private function RetrieveAllPopulations($db, $year, $provider, $subject)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT POPULATION FROM nss_data WHERE YEAR = :year AND PROVIDER_NAME = :provider AND CAH_NAME = :subject";
        $parameter = ["year" => $year, "provider" => $provider, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, ["population" => $data["POPULATION"]]);
            }
            return $resultArr;
        }
    }

    private function RetrieveAllLevels($db, $year, $provider, $subject)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT LEVEL_OF_STUDY FROM nss_data WHERE YEAR = :year AND PROVIDER_NAME = :provider AND CAH_NAME = :subject";
        $parameter = ["year" => $year, "provider" => $provider, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, ["level" => $data["LEVEL_OF_STUDY"]]);
            }
            return $resultArr;
        }
    }

    private function RetrievePositives($db, $population, $mode, $level, $year, $subject)
    {
        $resultArr = [];
        $query = "WITH
                    QUESTIONS AS (
                        SELECT tq.tid, tq.qid, q.qtext
                        FROM nss_themequestions AS tq, nss_question AS q
                        WHERE tq.qid = q.qid
                        UNION
                        SELECT t.tid, t.tid AS qid, t.ttext AS qtext
                        FROM nss_theme AS t
                    ),
                    POSITIVE_RANK AS (
                        SELECT *, ROUND(100-((RANKING * 100)/TOTAL_PROVIDER)) AS RANK_PERCENTAGE FROM
                        (SELECT  POPULATION, PROVIDER_NAME, MODE_OF_STUDY, LEVEL_OF_STUDY, QUESTION_NUMBER, POSITIVITY_MEASURE, NUMBER_RESPONSES, BENCHMARK,
                                RANK() OVER (PARTITION BY QUESTION_NUMBER ORDER BY POSITIVITY_MEASURE DESC) AS RANKING,
                                COUNT(*) OVER (PARTITION BY QUESTION_NUMBER) AS TOTAL_PROVIDER
                        FROM    nss_data
                        WHERE   POPULATION = :population
                        AND     MODE_OF_STUDY = :mode
                        AND     LEVEL_OF_STUDY = :level
                        AND     YEAR = :year
                        AND     CAH_NAME = :subject
                        AND     PROVIDER_NAME IN (SELECT uname FROM times_uni)) AS UNIVERSITY_RANK
                        WHERE   PROVIDER_NAME = 'University of Northumbria at Newcastle'
                    )
                    SELECT  pr.POPULATION, pr.MODE_OF_STUDY, pr.LEVEL_OF_STUDY, q.*, NUMBER_RESPONSES, pr.POSITIVITY_MEASURE AS POSITIVITY, pr.RANKING AS POSITIVITY_RANK, RANK_PERCENTAGE, pr.BENCHMARK
                    FROM    QUESTIONS q, POSITIVE_RANK pr
                    WHERE   q.qid = pr.QUESTION_NUMBER
                    ORDER BY CASE WHEN tid IS NULL THEN 1 ELSE 0 END, tid, qid";

        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level), "year" => $year, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, [
                    "qid" => $data['qid'],
                    "qtext" => $data['qtext'],
                    "tid" => $data['tid'],
                    "resp_count" => $data['NUMBER_RESPONSES'],
                    "positivity" => $data['POSITIVITY'],
                    "benchmark" => $data['BENCHMARK'],
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
    }

    private function RetrieveQuartileDiff($db, $population, $mode, $level, $question, $year, $subject)
    {
        $query = "WITH 
                    QUESTIONS AS (
                        SELECT tq.tid, tq.qid, q.qtext
                        FROM nss_themequestions AS tq, nss_question AS q
                        WHERE tq.qid = q.qid
                        UNION
                        SELECT t.tid, t.tid AS qid, t.ttext AS qtext
                        FROM nss_theme AS t
                    ),
                    POSITIVE_RANK AS (
                        SELECT *, ROUND(100-((RANKING * 100)/TOTAL_PROVIDER)) AS RANK_PERCENTAGE FROM
                        (
                            SELECT  POPULATION, PROVIDER_NAME, MODE_OF_STUDY, LEVEL_OF_STUDY, QUESTION_NUMBER, POSITIVITY_MEASURE, NUMBER_RESPONSES,
                                    RANK() OVER (PARTITION BY QUESTION_NUMBER ORDER BY POSITIVITY_MEASURE DESC) AS RANKING,
                                    COUNT(*) OVER (PARTITION BY QUESTION_NUMBER) AS TOTAL_PROVIDER
                            FROM    nss_data
                            WHERE   POPULATION = :population
                            AND     MODE_OF_STUDY = :mode
                            AND     LEVEL_OF_STUDY = :level
                            AND     YEAR = :year
                            AND     CAH_NAME = :subject
                            AND     PROVIDER_NAME IN (SELECT uname FROM times_uni)
                        ) AS UNIVERSITY_RANK
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
                    SELECT  q.*, pq.POSITIVITY_MEASURE, pq.QUARTILE, pq.NUMBER_RESPONSES,
                            (SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '1') AS DIFFERENCE_Q1_MIN,
                            (SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '2') AS DIFFERENCE_Q2_MIN,
                            (SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '3') AS DIFFERENCE_Q3_MIN,
                            (SELECT MIN(POSITIVITY_MEASURE) FROM POSITIVE_QUARTILE WHERE QUARTILE = '4') AS DIFFERENCE_Q4_MIN
                    FROM    POSITIVE_QUARTILE pq,
                            QUESTIONS q
                    WHERE   pq.QUESTION_NUMBER = q.qid
                    AND		pq.PROVIDER_NAME = 'University of Northumbria at Newcastle';";

        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level), "question" => $question, "year" => $year, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetch(PDO::FETCH_ASSOC);
        if(!empty($result))
        {
            $diffArr = [
                [
                    "label" => "Quartile ". $result['QUARTILE'],
                    "data" => [$result['POSITIVITY_MEASURE']],
                    "abs_data" => [round($result['NUMBER_RESPONSES'] * ($result['POSITIVITY_MEASURE']/100))],
                    "colorCode" => $result['QUARTILE']-1,
                    "current" => true
                ]
            ];

            $i = $result['QUARTILE'];
            while($i > 1)
            {
                if($i == $result['QUARTILE'])
                {
                    $nextQuart = round($result['NUMBER_RESPONSES'] * (($result['DIFFERENCE_Q'.($i-1).'_MIN']-$result['POSITIVITY_MEASURE'])/100));
                    array_push($diffArr, [
                        "label" => "Quartile ".($i-1),
                        "data" => [round($result['DIFFERENCE_Q'.($i-1).'_MIN']-$result['POSITIVITY_MEASURE'],2)],
                        "abs_data" => [($nextQuart < 0.5)?1:$nextQuart],
                        "colorCode" => $i-2,
                        "current" => false
                    ]);
                }
                else
                {
                    array_push($diffArr, [
                        "label" => "Quartile ".($i-1),
                        "data" => [round($result['DIFFERENCE_Q'.($i-1).'_MIN']-$result['DIFFERENCE_Q'.($i).'_MIN'],2)],
                        "abs_data" => [round($result['NUMBER_RESPONSES'] * (($result['DIFFERENCE_Q'.($i-1).'_MIN']-$result['DIFFERENCE_Q'.($i).'_MIN'])/100))],
                        "colorCode" => $i-2,
                        "current" => false
                    ]);
                }
                $i--;
            }

            return [
                "qid" => $result['qid'],
                "qtext" => $result['qtext'],
                "resp_count" => $result['NUMBER_RESPONSES'],
                "positive" => $result['POSITIVITY_MEASURE'],
                "quartile" => $result['QUARTILE'],
                "differences" => $diffArr
            ];
        }
    }

    private function RetrieveResponseRate($db, $population, $mode, $level, $question, $year, $subject)
    {
        $query = "SELECT QUESTION_NUMBER,NUMBER_RESPONSES, NUMBER_POPULATION, PUB_RESPONSE_HEADCOUNT, PUB_RESPRATE, NOT_APPLICABLE
                    FROM nss_data
                    WHERE PROVIDER_NAME = 'University of Northumbria at Newcastle'
                    AND POPULATION = :population
                    AND MODE_OF_STUDY = :mode
                    AND LEVEL_OF_STUDY = :level
                    AND YEAR = :year
                    AND CAH_NAME = :subject
                    AND QUESTION_NUMBER = :question;";

        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level), "question" => $question, "year" => $year, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetch(PDO::FETCH_ASSOC);
        if(!empty($result))
        {
            $detailArr = [];
            $notParticipate = $result['NUMBER_POPULATION']-$result['PUB_RESPONSE_HEADCOUNT'];

            if($result['NUMBER_RESPONSES'] > 0)
            {
                array_push($detailArr, [
                    "label" => "Responded",
                    "data" => $result['NUMBER_RESPONSES'],
                    "colorCode" => 0
                ]);
            }

            if($result['NOT_APPLICABLE'] > 0)
            {
                array_push($detailArr, [
                    "label" => "Not Applicable",
                    "data" => $result['NOT_APPLICABLE'],
                    "colorCode" => 1
                ]);
            }

            if($notParticipate > 0)
            {
                array_push($detailArr, [
                    "label" => "Not Participate",
                    "data" => $notParticipate,
                    "colorCode" => 2
                ]);
            }

            return [
                "qid" => $result['QUESTION_NUMBER'],
                "num_pop" => $result['NUMBER_POPULATION'],
                "resp_rate" => $result['PUB_RESPRATE'],
                "detail" => $detailArr
            ];
        }
    }

    private function RetrieveGauge($db, $population, $mode, $level, $question, $year, $subject)
    {
        $query = "SELECT POSITIVITY_MEASURE, BENCHMARK 
                    FROM    nss_data
                    WHERE   POPULATION = :population
                    AND     MODE_OF_STUDY = :mode
                    AND     LEVEL_OF_STUDY = :level
                    AND     YEAR = :year
                    AND     CAH_NAME = :subject
                    AND     QUESTION_NUMBER = :question
                    AND     PROVIDER_NAME = 'University of Northumbria at Newcastle'";

        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level), "question" => $question, "year" => $year, "subject" => $subject];
        $result = $db->executeSQL($query, $parameter)->fetch(PDO::FETCH_ASSOC);
        if(!empty($result))
        {
            return [
                "positivity" => $result["POSITIVITY_MEASURE"],
                "benchmark" => $result["BENCHMARK"]
            ];
        }
    }

    private function RetrieveHistory($db, $population, $mode, $level, $question, $provider, $subject)
    {
        $resultArr = [];
        $query = "SELECT YEAR, POSITIVITY_MEASURE, BENCHMARK FROM nss_data 
                    WHERE POPULATION = :population 
                    AND MODE_OF_STUDY = :mode 
                    AND LEVEL_OF_STUDY = :level
                    AND CAH_NAME = :subject
                    AND QUESTION_NUMBER = :question
                    AND PROVIDER_NAME = :provider";
        $parameter = ["population" => $population, "mode" => $this->CheckMode($mode), "level" => $this->CheckLevel($level), "subject" => $subject, "question" => $question, "provider" => $provider];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, [
                    "year" => $data["YEAR"],
                    "positivity" => $data["POSITIVITY_MEASURE"],
                    "benchmark" => $data["BENCHMARK"]
                ]);
            }
            return $resultArr;
        }
    }

    private function RetrieveCompare($db, $yearx, $populationx, $modex, $levelx, $providerx, $subjectx, $yeary, $populationy, $modey, $levely, $providery, $subjecty)
    {
        $resultArr = [];
        $query = "WITH
                    QUESTIONS AS (
                        SELECT tq.tid, tq.qid, q.qtext
                        FROM nss_themequestions AS tq, nss_question AS q
                        WHERE tq.qid = q.qid
                        UNION
                        SELECT t.tid, t.tid AS qid, t.ttext AS qtext
                        FROM nss_theme AS t
                    ),
                    DATAX AS (
                        SELECT YEAR, QUESTION_NUMBER, PROVIDER_NAME, POSITIVITY_MEASURE, BENCHMARK
                        FROM nss_data
                        WHERE YEAR = :yearx 
                        AND PROVIDER_NAME = :providerx
                        AND CAH_NAME = :subjectx
                        AND POPULATION = :populationx
                        AND MODE_OF_STUDY = :modex
                        AND LEVEL_OF_STUDY = :levelx
                    ),
                    DATAY AS (
                        SELECT YEAR, QUESTION_NUMBER, PROVIDER_NAME, POSITIVITY_MEASURE, BENCHMARK
                        FROM nss_data
                        WHERE YEAR = :yeary 
                        AND PROVIDER_NAME = :providery
                        AND CAH_NAME = :subjecty
                        AND POPULATION = :populationy
                        AND MODE_OF_STUDY = :modey
                        AND LEVEL_OF_STUDY = :levely
                    )
                    SELECT q.*, x.YEAR AS YEAR_X, x.PROVIDER_NAME AS PROVIDER_X, x.POSITIVITY_MEASURE AS POSITIVE_X, x.BENCHMARK AS BENCHMARK_X, y.YEAR AS YEAR_Y, y.PROVIDER_NAME AS PROVIDER_Y, y.POSITIVITY_MEASURE AS POSITIVE_Y, y.BENCHMARK AS BENCHMARK_Y
                    FROM QUESTIONS q
                    LEFT JOIN DATAX AS x ON q.qid = x.QUESTION_NUMBER
                    LEFT JOIN DATAY as y on q.qid = y.QUESTION_NUMBER
                    ORDER BY CASE WHEN tid IS NULL THEN 1 ELSE 0 END, tid, qid;";
        $parameter = ["yearx" => $yearx, "providerx" => $providerx, "subjectx" => $subjectx, "populationx" => $populationx, "modex" => $modex, "levelx" => $levelx,
                      "yeary" => $yeary, "providery" => $providery, "subjecty" => $subjecty, "populationy" => $populationy, "modey" => $modey, "levely" => $levely];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, [
                    "qid" => $data["qid"],
                    "qtext" => $data["qtext"],
                    "positive_x" => $data["POSITIVE_X"],
                    "positive_y" => $data["POSITIVE_Y"],
                    "benchmark_x" => $data["BENCHMARK_X"],
                    "benchmark_y" => $data["BENCHMARK_Y"]
                ]);
            }
            return [
                "provider_x" => $result[0]["PROVIDER_X"],
                "year_x" => $result[0]["YEAR_X"],
                "provider_y" => $result[0]["PROVIDER_Y"],
                "year_y" => $result[0]["YEAR_Y"],
                "result" => $resultArr
            ];
        }
    }

    private function RetrieveIntegration($db, $year)
    {
        $resultArr = [];
        $query = "SELECT DISTINCT CAH_NAME FROM test_data WHERE year = :year";
        $parameter = ["year" => $year];
        $result = $db->executeSQL($query, $parameter)->fetchAll();
        if(!empty($result))
        {
            foreach($result as $data){
                array_push($resultArr, [$data["CAH_NAME"]]);
            }
            return $resultArr;
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