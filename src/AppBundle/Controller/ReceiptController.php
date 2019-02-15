<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Psr\Log\LoggerInterface;
use Exception;
use AppBundle\Entity\Receipt;
use MiPago\Bundle\Entity\Payment;
use AppBundle\Forms\ReceiptTypeForm;

/**
 * @Route("/{_locale}", requirements={
 *	    "_locale": "es|eu|en"
 * })
 */
class ReceiptController extends Controller
{
    
    /**
     * @Route("/", name="receipt_home", methods={"GET","POST"})
     */
    public function homeAction(Request $request, LoggerInterface $logger) {
	$locale = $request->attributes->get('_locale');
	if ( $locale !== null ) {
	    $request->getSession()->set('_locale', $locale);
	} else {
	    $request->setLocale($request->getSession()->get('_locale'));
	}
	return $this->findReceiptsAction($request, $logger);
    }

    /**
     * @Route("/receipts", name="receipt_find", methods={"GET","POST"})
     */
    public function findReceiptsAction(Request $request, LoggerInterface $logger)
    {
	$logger->debug('-->findReceiptsAction: Start');
	$user = $this->get('security.token_storage')->getToken()->getUser();
	$roles = ($user === "anon.") ? ["IS_AUTHENTICATED_ANONYMOUSLY"] : $user->getRoles();
	$em = $this->getDoctrine()->getManager();
	$receipt = new Receipt();
	$numeroReferencia = $request->get('numeroReferencia');
	$dni = $request->get('dni');
	$receipt->setDni($dni);
	$receipt->setNumeroReferencia($numeroReferencia);
	$form = $this->createForm(ReceiptTypeForm::class, $receipt, [
//	    'editatzen' => false,
	    'roles' => $roles,
    	    'locale' => $request->getLocale(),
	    'search' => true,
	    'readonly' => false,
	    
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $data = $form->getData();
	    if ( $user === "anon." &&  ( $data->getDni() === null || $data->getNumeroReferencia() === null ) ) {
		$this->addFlash('error','El dni y el número de inscripción son obligatorios');
	    } else {	    
		$results = $em->getRepository(Receipt::class)->findReceiptByExample($data);
		return $this->render('receipt/list.html.twig', [
		    'form' => $form->createView(),
		    'receipts' => $results,
		    'search' => true,
		    'readonly' => false,
		]);
	    }
	}
	if ( $user === "anon." &&  ( $dni === null || $numeroReferencia === null ) ) {
	    $results = [];
	} else {
	    $receipt = new Receipt();
	    $receipt->setDni($dni);
	    $receipt->setNumeroReferencia($numeroReferencia);
	    $results = $em->getRepository(Receipt::class)->findReceiptByExample($receipt);
	    return $this->render('receipt/list.html.twig', [
		'form' => $form->createView(),
		'receipts' => $results,
		'search' => true,
		'readonly' => false,
	    ]);
	}
	$logger->debug('<--findReceiptsAction: Results: '. count($results));
	$logger->debug('<--findReceiptsAction: End OK');
	return $this->render('receipt/list.html.twig', [
	    'form' => $form->createView(),
	    'receipts' => $results,
	    'search' => true,
	    'readonly' => false,
	]);
    }
    
    /**
     * @Route("/pay/{receipt}", name="receipt_forwarded_pay", methods={"POST"})
     */
    public function payForwaredeReceiptAction (Request $request, Receipt $receipt, LoggerInterface $logger) {
	$logger->debug('-->payForwardedReceiptAction: Start');
	if ( $receipt != null ) {
	    $logger->debug('<--payForwardedReceiptAction: End Forwarded to MiPagoBundle:Payment:sendRequest');
	    $referencia = $receipt->getId();
	    return $this->forward("MiPagoBundle:Payment:sendRequest",[
		'reference_number' => $referencia, 
		'payment_limit_date' => $receipt->getUltimoDiaPago()->format('Ymd'),
		'suffix' =>  $receipt->getSufijo(),
		'quantity' => $receipt->getImporte(),
		'extra' => [ 
		    'citizen_name' => $receipt->getNombre(),
		    'citizen_surname_1' => $receipt->getApellido1(),
		    'citizen_surname_2' => $receipt->getApellido2(),
		    'citizen_nif' => $receipt->getDni(),
		    'citizen_phone' => $receipt->getTelefono(),
		    'citizen_email' => $receipt->getEmail(),
		],
		'receipt' => $receipt,
	    ]);
	} else {
	    $this->addFlash('error','Recibo no encontrado');
	    $logger->debug('<--payForwardedReceiptAction: End Recibo no encontrado');
	    return $this->render('receipt/list.html.twig', [
		'form' => $form->createView(),
		'receipts' => [],
	    ]);
	}
	$logger->debug('-->payForwardedReceiptAction: End OK');
    }
    
    /**
     * @Route("/pay/{numeroReferencia}/{dni}", name="receipt_pay", methods={"GET","POST"})
     */
    public function payReceiptAction(Request $request, $numeroReferencia, $dni, LoggerInterface $logger)
    {	$logger->debug('-->payReceiptAction: Start');
	$user = $this->get('security.token_storage')->getToken()->getUser();
	$roles = ($user === "anon.") ? ["IS_AUTHENTICATED_ANONYMOUSLY"] : $user->getRoles();
	$form = $this->createForm(ReceiptTypeForm::class, new Receipt(), [
	    'roles' => $roles,
    	    'locale' => $request->getLocale(),
	]);
	if ( $user === "anon." &&  ( $dni === null || $numeroReferencia === null ) ) {
	    $this->addFlash('error','El dni y el número de inscripción son obligatorios');
	    $logger->debug('<--payReceiptAction: End El dni y el número de inscripción son obligatorios');
	    return $this->render('receipt/list.html.twig', [
		'form' => $form->createView(),
		'receipts' => $results,
	    ]);
	} else {
	    $em = $this->getDoctrine()->getManager();
	    $receipt = $em->getRepository(Receipt::class)->findOneBy([
		'dni' => $dni,
		'numeroReferencia' => $numeroReferencia,
	    ]);
	    if ( $receipt != null ) {
		$logger->debug('<--payReceiptAction: End Forwarded to sendRequest');
		return $this->forward("MiPagoBundle:Payment:sendRequest",[
		    'reference_number' => $receipt->getId(), 
		    'payment_limit_date' => $receipt->getUltimoDiaPago()->format('Ymd'),
		    'suffix' =>  $receipt->getSufijo(),
		    'quantity' => $receipt->getImporte(),
		    'extra' => [ 
			'citizen_name' => $receipt->getNombre(),
			'citizen_surname_1' => $receipt->getApellido1(),
			'citizen_surname_2' => $receipt->getApellido2(),
			'citizen_nif' => $receipt->getDni(),
			'citizen_phone' => $receipt->getTelefono(),
			'citizen_email' => $receipt->getEmail(),
		    ],
		    'receipt' => $receipt,
		]);
	    } else {
		$this->addFlash('error','Recibo no encontrado');
		$logger->debug('<--payReceiptAction: End Recibo no encontrado');
		return $this->render('receipt/list.html.twig', [
		    'form' => $form->createView(),
		    'receipts' => [],
		]);
	    }
	}
    }

    /**
     * @Route("/receiptConfirmation", name="receipt_confirmation", methods={"GET","POST"})
     */
    public function receiptConfirmationAction(Request $request, LoggerInterface $logger) {
	// TODO Begiratu ea nola egiten dugun erreferentzi zenbakiarena
	$logger->debug('-->ReceiptConfirmationAction: Start');
	$payment = $request->get('payment');
	$reference_number = intval($payment->getReference_number());
	$em = $this->getDoctrine()->getManager();
	$logger->debug('ReferenceNumber: '.$reference_number.', Status: '.$payment->getStatus().', PaymentId: '.$payment->getId());
	$receipt = $em->getRepository(Receipt::class)->find(intval($reference_number));
	$receipt->setPayment($payment);
	$em->persist($receipt);
	$em->flush();
	$logger->debug('<--ReceiptConfirmationAction: End OK');
	return new JsonResponse("OK");
    }
    
    /**
     * @Route("/receipts/new", name="receipt_new", methods={"GET","POST"})
     */
    public function newAction(Request $request, LoggerInterface $logger) {
	$logger->debug('-->newAction: Start');
	$user = $this->get('security.token_storage')->getToken()->getUser();
	$form = $this->createForm(ReceiptTypeForm::class, new Receipt(), [
	    'roles' => $user->getRoles(),
    	    'locale' => $request->getLocale(),
	    'readonly' => false,
	    'search' => false,
	    'newReceipt' => true,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $em = $this->getDoctrine()->getManager();
	    $receipt = $form->getData();
	    $em->persist($receipt);
	    $em->flush();
	    return $this->forward("MiPagoBundle:Payment:sendRequest",[
		    'reference_number' => $receipt->getNumeroReferencia(), 
		    'payment_limit_date' => $receipt->getUltimoDiaPago()->format('Ymd'),
		    'suffix' =>  $receipt->getSufijo(),
		    'quantity' => $receipt->getImporte(),
		    'extra' => [ 
			'citizen_name' => $receipt->getNombre(),
			'citizen_surname_1' => $receipt->getApellido1(),
			'citizen_surname_2' => $receipt->getApellido2(),
			'citizen_nif' => $receipt->getDni(),
			'citizen_phone' => $receipt->getTelefono(),
			'citizen_email' => $receipt->getEmail(),
		    ],
		    'receipt' => $receipt,
	    ]);
	}
//	dump($form);die;
	return $this->render('/receipt/new.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	    'search' => false,
	]);
	
	$logger->debug('<--newAction: End OK');
	return new JsonResponse("OK");
    }

}

