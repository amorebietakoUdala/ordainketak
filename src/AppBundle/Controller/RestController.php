<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\Routing\Annotation\Route;
use FOS\RestBundle\View\View;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations;
use AppBundle\Entity\Activity;

/**
 * Description of RestController
 *
 * @author ibilbao
 */

/**
 * @Route("/api")
 */
class RestController extends FOSRestController {

    
     /**
     * List enabled activities.
     *
     * @Get("/activity/")
     */
    public function getActivitiesAction(ParamFetcherInterface $paramFetcher)
    {
	$data = $this->getDoctrine()->getRepository(Activity::class)->getEnabledActivities();
        $view = new View($data);
//        $view->setTemplate('LiipHelloBundle:Rest:getArticles.html.twig');
        return $this->get('fos_rest.view_handler')->handle($view);
    }
    
}
