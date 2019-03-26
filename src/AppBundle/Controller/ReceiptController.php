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
use AppBundle\Entity\Activity;
use AppBundle\Forms\ReceiptTypeForm;
use Swift_Message;

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
	/* It uses id as referenceNumber */
	$id = $request->get('idRecibo');
	$dni = $request->get('dni');
	$receipt->setDni($dni);
	$receipt->setId($id);
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
	    if ( $user === "anon." &&  ( $data->getDni() === null || $data->getId() === null ) ) {
		$this->addFlash('error','El dni y el número de recibo son obligatorios');
	    } else {
//		$results = $em->getRepository(Receipt::class)->findReceiptByExample($data, Payment::PAYMENT_STATUS_OK);
		$results = $em->getRepository(Receipt::class)->findReceiptByExample($data);
		return $this->render('receipt/list.html.twig', [
		    'form' => $form->createView(),
		    'receipts' => $results,
		    'search' => true,
		    'readonly' => false,
		]);
	    }
	}
	if ( $user === "anon." &&  ( $dni === null || $id === null ) ) {
	    $results = [];
	} else {
	    $receipt = new Receipt();
	    $receipt->setDni($dni);
	    $receipt->setId($id);
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
		'sender' =>  $receipt->getEntidad(),
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
     * @Route("/pay/{id}/{dni}", name="receipt_pay", methods={"GET","POST"})
     */
    public function payReceiptAction(Request $request, $id, $dni, LoggerInterface $logger)
    {	$logger->debug('-->payReceiptAction: Start');
	$user = $this->get('security.token_storage')->getToken()->getUser();
	$roles = ($user === "anon.") ? ["IS_AUTHENTICATED_ANONYMOUSLY"] : $user->getRoles();
	$form = $this->createForm(ReceiptTypeForm::class, new Receipt(), [
	    'roles' => $roles,
    	    'locale' => $request->getLocale(),
	    'search' => true,
	]);
	if ( $user === "anon." &&  ( $dni === null || $id === null ) ) {
	    $this->addFlash('error','El dni y el número de recibo son obligatorios');
	    $logger->debug('<--payReceiptAction: End El dni y el número de recibo son obligatorios');
	    return $this->render('receipt/list.html.twig', [
		'form' => $form->createView(),
		'receipts' => $results,
	    ]);
	} else {
	    $em = $this->getDoctrine()->getManager();
	    $receipt = $em->getRepository(Receipt::class)->findOneBy([
		'dni' => $dni,
		'id' => $id,
	    ]);
	    if ( $receipt != null ) {
		$logger->debug('<--payReceiptAction: End Forwarded to sendRequest');
		return $this->forward("MiPagoBundle:Payment:sendRequest",[
		    'reference_number' => $receipt->getId(), 
		    'payment_limit_date' => $receipt->getUltimoDiaPago()->format('Ymd'),
		    'sender' =>  $receipt->getEntidad(),
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
	$this->__updateRemainingTickets($receipt, $logger);
	$this->__sendConfirmationEmails($receipt);
	$this->__updateGTWINPayment($receipt, $logger);
	$logger->debug('<--ReceiptConfirmationAction: End OK');
	return new JsonResponse("OK");
    }
    
    private function __updateRemainingTickets (Receipt $receipt, LoggerInterface $logger ) {
	$tickets = $receipt->getTickets();
	$logger->debug($tickets);
	$payment = $receipt->getPayment();
	if ($tickets !== null) {
	    $activity = $tickets->getActivity();
	    $logger->debug($activity);
	    $em = $this->getDoctrine()->getManager();
//	    $activity = $em->getRepository(Activity::class)->find($activity->getId());
//	    $payment = $em->getRepository(Payment::class)->find($payment->getId());
	    $remainingTickets = $activity->getRemainingTickets();
	    $logger->debug('Remaining Tickets:'. $remainingTickets);
	    if ( $remainingTickets !== null ) {
		/* If payment was not OK we add to remaining tickets, because we substracted previously before the payment */
		$logger->debug('Payment status: '.$payment->getStatus());
		if ( $payment->getStatus() === Payment::PAYMENT_STATUS_NOK) {
		    $activity->setRemainingTickets($remainingTickets+$tickets->getQuantity());
		    $em->persist($activity);
		    $em->flush();
		}
	    }
	}
	return;
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

    private function __sendConfirmationEmails ($receipt) {
	if ( $this->getParameter("mailer_sendConfirmation") === true ) {
	    $emails = [$receipt->getEmail()];
	    $this->__sendMessage("Confirmación del Pago / Ordainketaren konfirmazioa", $receipt, $emails);
	}
	if ( $this->getParameter("mailer_sendBCC") === true ) {
	    $bccs = $this->getParameter('mailer_BCC_email');
	    $this->__sendMessage("Confirmación del Pago / Ordainketaren konfirmazioa", $receipt, $bccs);
	}
    }
    
    private function __sendMessage ($subject, $receipt, $emails) {
	$from = $this->getParameter('mailer_from');
	$mailer = $this->get('mailer');
	$message = new Swift_Message($subject);
	$message->setFrom($from);
	$message->setTo($emails);
	$message->setBody(
	    $this->renderView('/receipt/mail.html.twig', [
		    'receipt' => $receipt
		])
	);
	$message->setContentType('text/html');
	$mailer->send($message);
    }
    
    /**
     * @Route("/oracle", name="receipt_oracle", methods={"GET","POST"})
     */
    public function oracleAction(Request $request, LoggerInterface $logger) {
//	// No need to update
//	if ($receipt->getNumeroReferenciaGTWIN() === null ) {
//	    return;
//	}
//	if ($receipt->getPayment() === null ) {
//	    return;
//	}
	
	$em = $this->getDoctrine()->getManager();
	$receipt = $em->getRepository(Receipt::class)->find(100000098);
	// Update record in GTWIN
	$insert_template = "INSERT INTO EXTCALL (DBOID, ACTIONCODE, INPUTPARS, OUTPUTPARS, OUTPARSMEMO, CALLTYPE, NUMRETRIES, QUEUE, PRIORITY, CALLSTATUS, CALLTIME, PROCTIME, CONFTIME, ORIGINOBJ, DESTOBJ, USERBW, MSGERROR, URLOK, URLOKPARAM, CONFSTATUS) VALUES ".
						       "('{DBOID}','OPERACION_PAGO_TAR','<NUMREC>{NUMREC}</NUMREC><NUMFRA>{NUMFRA}</NUMFRA><FECOPE>{FECOPE}</FECOPE><IMPORT>{IMPORT}</IMPORT><RECARG>0.00</RECARG><INTERE>0.00</INTERE><COSTAS>0.00</COSTAS><CAJCOB>9</CAJCOB><NUMAUT>{NUMAUT}</NUMAUT>',null, null,0,1,0,0,2,TO_DATE('{CALLTIME}','YYYY-MM-DD HH24:MI:SS'),TO_DATE('{PROCTIME}','YYYY-MM-DD HH24:MI:SS'),null,null,null,'{USERBW}',null,null,null,0)";
	$time_start = floatval(microtime(true))*10000;
	$dboid = str_pad('124'.$time_start, 22, "0", STR_PAD_RIGHT);
	$payment = $receipt->getPayment();
	$now = new \DateTime();
	
	$params = [
	    '{DBOID}' => $dboid,
	    '{NUMREC}'=> $receipt->getNumeroReferenciaGTWIN(),
	    '{NUMFRA}' => 0,
	    '{FECOPE}' => $payment->getTimestamp()->format('Y-m-d H:i:s'),
	    '{IMPORT}' => $receipt->getImporte(),
	    '{NUMAUT}' => $payment->getRegistered_payment_id(),
	    '{CALLTIME}' => $now->format('Y-m-d H:i:s'),
	    '{PROCTIME}' => $now->format('Y-m-d H:i:s'),
	    '{USERBW}' => 'INT',
	];
	$sql = str_replace(array_keys($params), $params, $insert_template);
	$em2 = $this->getDoctrine()->getManager("oracle");
	$statement = $em2->getConnection()->prepare( $sql );
//	$statement->execute();
	return;
    }

    private function __updateGTWINPayment(Receipt $receipt, LoggerInterface $logger) {
	// No need to update
	if ($receipt->getNumeroReferenciaGTWIN() === null ) {
	    $logger->debug('No GTWIN reference to update');
	    return;
	}
	if ($receipt->getPayment() === null ) {
	    $logger->debug('No payment to update status in GTWIN');
	    return;
	}
	if ( !$payment->isPaymentSuccessfull() ) {
	    $logger->debug('Payment not successfull no need to update payment in GTWIN');
	    return;
	}
	$sql = $this->__createGTWINUpdateStatement($receipt);
	$em2 = $this->getDoctrine()->getManager("oracle");
	$statement = $em2->getConnection()->prepare( $sql );
//	$statement->execute();
	return;
    }

    private function __createGTWINUpdateStatement ($receipt){
	// Update record in GTWIN
	$insert_template = "INSERT INTO EXTCALL (DBOID, ACTIONCODE, INPUTPARS, OUTPUTPARS, OUTPARSMEMO, CALLTYPE, NUMRETRIES, QUEUE, PRIORITY, CALLSTATUS, CALLTIME, PROCTIME, CONFTIME, ORIGINOBJ, DESTOBJ, USERBW, MSGERROR, URLOK, URLOKPARAM, CONFSTATUS) VALUES ".
						       "('{DBOID}','OPERACION_PAGO_TAR','<NUMREC>{NUMREC}</NUMREC><NUMFRA>{NUMFRA}</NUMFRA><FECOPE>{FECOPE}</FECOPE><IMPORT>{IMPORT}</IMPORT><RECARG>0.00</RECARG><INTERE>0.00</INTERE><COSTAS>0.00</COSTAS><CAJCOB>9</CAJCOB><NUMAUT>{NUMAUT}</NUMAUT>',null, null,0,1,0,0,2,TO_DATE('{CALLTIME}','YYYY-MM-DD HH24:MI:SS'),TO_DATE('{PROCTIME}','YYYY-MM-DD HH24:MI:SS'),null,null,null,'{USERBW}',null,null,null,0)";
	$time_start = floatval(microtime(true))*10000;
	$dboid = str_pad('124'.$time_start, 22, "0", STR_PAD_RIGHT);
	$now = new \DateTime();
	$payment = $receipt->getPayment();
	$params = [
	    '{DBOID}' => $dboid,
	    '{NUMREC}'=> $receipt->getNumeroReferenciaGTWIN(),
	    '{NUMFRA}' => 0,
	    '{FECOPE}' => $payment->getTimestamp()->format('Y-m-d H:i:s'),
	    '{IMPORT}' => $receipt->getImporte(),
	    '{NUMAUT}' => $payment->getRegistered_payment_id(),
	    '{CALLTIME}' => $now->format('Y-m-d H:i:s'),
	    '{PROCTIME}' => $now->format('Y-m-d H:i:s'),
	    '{USERBW}' => 'INT',
	];
	$sql = str_replace(array_keys($params), $params, $insert_template);
	return $sql;
    }
    
}
