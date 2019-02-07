<?php

namespace MiPago\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use MiPago\Bundle\Services\MiPagoService;
use Psr\Log\LoggerInterface;
use Exception;

class PaymentController extends Controller
{
    /**
     * @Route("/sendRequest", name="mipago_sendRequest", methods={"GET","POST"})
     */
    public function sendRequestAction(Request $request, MiPagoService $miPagoService, LoggerInterface $logger)
    {
	$logger->debug('-->sendRequestAction: Start');
	$reference_number = str_pad($request->get('reference_number'), 10, "0", STR_PAD_LEFT);
	$payment_limit_date = new \DateTime($request->get('payment_limit_date'));
	$quantity = $request->get('quantity');
	$suffix = $request->get('suffix');
	$extra = $request->get('extra');
	try {
	    $result = $miPagoService->make_payment_request($reference_number, $payment_limit_date, $suffix, $quantity, $extra);
	} catch ( Exception $e ) {
	    $logger->debug($e);
	    $logger->debug('<--sendRequestAction: Exception: ' . $e->getMessage());
	    return $this->render('@MiPago/default/error.html.twig', [
		'exception' => $e,
	    ]);
	}
	$logger->debug('<--sendRequestAction: End OK');
	return $this->render('@MiPago/default/request.html.twig', $result );
    }

    /**
     * @Route("/thanks", name="mipago_thanks" , methods={"GET"})
     */
    public function thanksAction()
    {
	$logger->debug('-->thanksAction: Start');
	$logger->debug('<--thanksAction: End');
	return $this->render('@MiPago/default/thanks.html.twig');
    }
    
     /**
     * @Route("/confirmation", name="mipago_confirmation", methods={"POST"})
     */
    public function confirmationAction(Request $request, MiPagoService $miPagoService, LoggerInterface $logger)
    {
	$logger->debug('-->confirmationAction: Start');
	$payment = $miPagoService->process_payment_confirmation($request->getContent());
	$logger->debug('-->confirmationAction: End OK');
	$forwardController = $this->getParameter("mipago.forwardController");
	if ($forwardController != null ) {
	    return $this->forward($forwardController,[
		'payment' => $payment
	    ]);
	} else {
	    return new JsonResponse ("OK");
	}
	    
//	return $this->render('@MiPago/default/confirmation.html.twig',[
//	    'payment' => $payment
//	]);
    }
    
}