<?php

namespace MiPago\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use MiPago\Bundle\Services\MiPagoService;
use Psr\Log\LoggerInterface;
use Exception;

class DefaultController extends Controller
{
    /**
     * @Route("/sendRequest")
     * @Method("GET")
     */
    public function sendRequestAction(Request $request, MiPagoService $miPagoService, LoggerInterface $logger)
    {
	$reference_number = '2234567890';
	$payment_limit_date = new \DateTime();
	$quantity = 10.52;
	$suffix = '002';
	$extra = [];
	try {
	    $result = $miPagoService->make_payment_request($reference_number, $payment_limit_date, $suffix, $quantity, $extra);
	} catch ( Exception $e ) {
	    $logger->debug($e);
	    return $this->render('@MiPago/default/error.html.twig', [
		'exception' => $e,
	    ]);
	}
//	dump($result);die;
	return $this->render('@MiPago/default/request.html.twig', $result );
    }

    /**
     * @Route("/thanks")
     * @Method("GET")
     */
    public function thanksAction()
    {
	return $this->render('@MiPago/default/thanks.html.twig');
    }
    
     /**
     * @Route("/confirmation")
     * @Method("POST")
     */
    public function confirmationAction(Request $request, MiPagoService $miPagoService, LoggerInterface $logger)
    {
	$logger->debug('Confirmation called!!!');
	$result = $miPagoService->process_payment_confirmation($request->getContent());
	return $this->render('@MiPago/default/confirmation.html.twig',[
	    'payment' => $result
	]);
    }
    
}
