<?php

class Router
{
    private $routes;

    public function __construct()
    {
        $routesPath = ROOT.'/config/routes.php';
        $this->routes = include($routesPath);
    }

    private function getUri()
    {
        if (!empty($_SERVER['REQUEST_URI']))
            return trim($_SERVER['REQUEST_URI'], '/');
    }

    public function run()
    {
        $uri = $this->getUri();
        foreach ($this->routes as $uriPattern=>$path)
        {
            if (preg_match("~$uriPattern~", $uri))
            {
                $internPath = preg_replace("~$uriPattern~", $path, $uri);
                $internalPath = explode('/', $internPath);
                $controllerName = ucfirst(array_shift($internalPath))."Controller";
                $actionName = 'action'.array_shift($internalPath);
                $filePath = ROOT.'/controllers/'.$controllerName.".php";
                if (file_exists($filePath)) {
                    include ($filePath);
                }
                $parameters = $internalPath;
                $objectController = new $controllerName;
                $result = call_user_func_array([$objectController, $actionName], $parameters);
                if ($result){
                    return true;
                }
            }
        }
    }
}