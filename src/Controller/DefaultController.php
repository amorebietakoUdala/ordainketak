<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Description of DefaultController
 *
 * @author ibilbao
 */
class DefaultController extends AbstractController {
    
     /**
     * @Route("/", name="home", methods={"GET"})
     */
    public function homeAction(Request $request, LoggerInterface $logger) {
	return $this->redirectToRoute('receipt_home',[
	    'request' => $request,
	    'logger' => $logger,
	]);
    }
}
