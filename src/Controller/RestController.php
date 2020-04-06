<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\API\ApiResponse;
use App\Entity\Payment;
use App\Services\GTWINIntegrationService;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\View\View;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

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
     * @Get("/activity/", options={"expose"=true})
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
            $recibosNoPagados = $this->removeAlreadyPaid($recibos);
            $data = new ApiResponse('OK', 'Found', $recibosNoPagados);
        } else {
            $data = new ApiResponse('KO', 'Not Found', null);
        }
        $view = new View($data);

        return $this->get('fos_rest.view_handler')->handle($view);
    }

    /**
     * @Route("/receipts/confirmation", methods={"POST"})
     */
    public function receiptsConfirmation(Request $request, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        $logger->debug($request->getContent());
        $payment = Payment::createPaymentFromJson($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $existingPayment = $em->getRepository(\MiPago\Bundle\Entity\Payment::class)->findOneBy([
            'reference_number' => $payment->getReference_number(),
            'status' => Payment::PAYMENT_STATUS_OK,
        ]);
        if ($existingPayment) {
            return new ApiResponse('OK', 'Receipt already payd', null);
        }

        $recibo = $gts->findByNumReciboDni($payment->getReference_number(), $payment->getNif());
        if (null !== $recibo) {
            try {
                $gts->paidWithCreditCard($recibo->getNumeroRecibo(), $recibo->getFraccion(), $payment->getQuantity(), $payment->getTimeStamp(), '', 'APP');
                $em->persist($payment);
                $em->flush();
                $logger->debug('Receipt number '.$payment->getReference_number().' successfully paid');

                return new ApiResponse('OK', 'Receipt succesfully payd', null);
            } catch (\Exception $e) {
                return new ApiResponse('NOK', 'There was and error during the request: '.$e->getMessage(), null);
            }
        }

        $logger->debug('Receipt number '.$payment->getReference_number().' not found.');

        return new ApiResponse('NOK', 'Receipt Not Found', null);
    }

    public function removeAlreadyPaid($recibos)
    {
        $em = $this->getDoctrine()->getManager();
        $recibosNoPagados = [];
        foreach ($recibos as $recibo) {
            $payment = $em->getRepository(\MiPago\Bundle\Entity\Payment::class)->findOneBy([
                'reference_number' => str_pad($recibo->getNumeroRecibo(), 10, '0', STR_PAD_LEFT),
                'status' => Payment::PAYMENT_STATUS_OK,
            ]);
            if (null === $payment) {
                $recibosNoPagados[] = $recibo;
            }
        }

        return $recibosNoPagados;
    }
}
