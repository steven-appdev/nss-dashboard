<?php
class Database
{
    private $connection;

    public function __construct(){
        //Set the connection
        $this->setConnection();
    }

    public function setConnection(){
        try{
            //Start connecting to database using PDO
            $this->connection = new PDO("mysql:host=nuwebspace_db;dbname=w20003691", "w20003691", "gfA@UP#41fKG");
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        }catch(PDOException $e){
            //Exit with error if PDOException has been caught
            echo "Database Connection Error: " . $e->getMessage();
            exit();
        }
    }

    public function executeSQL($sql, $params=[]){
        try{
            //Prepare the SQL
            $stmt = $this->connection->prepare($sql);

            //Bind and execute the query
            $stmt->execute($params);

            //Return the result
            return $stmt;

        }catch(PDOException $pdo){
            //Return false if PDOException are caught
            return false;
        }
    }
}