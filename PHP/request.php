<?php
class Request
{
    private $path;
    private $basepath = "api/";

    public function __construct()
    {
        //Set the path
        $this->setPath();
    }

    private function setPath(){
        //Retrieving the path of the URL
        $this->path = parse_url($_SERVER["REQUEST_URI"])['path'];

        //Sanitising the URL
        $this->path = str_replace($this->basepath, "", $this->path);
        $this->path = trim($this->path,"/");
        $this->path = strtolower($this->path);
    }

    public function getPath(){
        //Return the path variable
        return $this->path;
    }
}