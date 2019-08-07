<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Activity;
use AppBundle\Services\GTWINIntegrationService;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use AppBundle\Entity\API\ApiResponse;

/**
 * Description of RestController.
 *
 * @author ibilbao
 */

/**
 * @Route("/api")
 */
class RestController extends AbstractFOSRestController
{
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

    /**
     * Check the existance of the person by DNI.
     *
     * @Get("/person/{dni}")
     */
    public function getCheckPersonAction(Request $request, GTWINIntegrationService $gts)
    {
        $dni = strtoupper($request->get('dni'));
        $exists = $gts->personExists($dni);
        if ($exists) {
            $data = new ApiResponse('OK', 'Found', null);
        } else {
            $data = new ApiResponse('KO', 'Not Found', null);
        }
        $view = new View($data);

        return $this->get('fos_rest.view_handler')->handle($view);
    }

    /**
     * Returns a list of receipt types.
     *
     * @Get("/receipts/types")
     */
    public function getReceiptTypesAction(GTWINIntegrationService $gts)
    {
        $types = $gts->getReceiptTypes();
        $view = new View($types);

        return $this->get('fos_rest.view_handler')->handle($view);
    }

    /**
     * Returns a list of unpayd receipts for the DNI.
     *
     * @Get("/receipts/{dni}")
     */
    public function getPersonReceiptsAction(Request $request, GTWINIntegrationService $gts)
    {
        $dni = strtoupper($request->get('dni'));
        $exists = $gts->personExists($dni);
        if ($exists) {
            $recibos = $gts->findByRecibosPendientesByDni($dni);
            $data = new ApiResponse('OK', 'Found', $recibos);
        } else {
            $data = new ApiResponse('KO', 'Not Found', null);
            $recibos = [];
        }
        $view = new View($data);

        return $this->get('fos_rest.view_handler')->handle($view);
    }
}
