<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Description of DefaultController
 *
 * @author ibilbao
 */
class DefaultController extends Controller {
    
     /**
     * @Route("/", name="home", methods={"GET"})
     */
    public function homeAction(Request $request, LoggerInterface $logger) {
	return $this->forward("AppBundle:Receipt:Home",[
	    'request' => $request,
	    'logger' => $logger,
	]);
    }
}
