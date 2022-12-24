<?php

class SiteController
{
    public function actionIndex(): void
    {
        require_once ROOT.'/views/site/index.php';
    }
}