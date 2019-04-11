<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Receipt;
use AppBundle\Forms\ReceiptTypeForm;
use AppBundle\Services\GTWINIntegrationService;
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
    public function homeAction(Request $request, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        $locale = $request->attributes->get('_locale');
        if (null !== $locale) {
            $request->getSession()->set('_locale', $locale);
        } else {
            $request->setLocale($request->getSession()->get('_locale'));
        }

        return $this->findReceiptsAction($request, $logger, $gts);
    }

    /**
     * @Route("/receipts", name="receipt_find", methods={"GET","POST"})
     */
    public function findReceiptsAction(Request $request, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        $logger->debug('-->findReceiptsAction: Start');
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $roles = ('anon.' === $user) ? ['IS_AUTHENTICATED_ANONYMOUSLY'] : $user->getRoles();
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
        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            if ('anon.' === $user && (null === $data->getDni() || null === $data->getId())) {
                $this->addFlash('error', 'El dni y el número de recibo son obligatorios');
            } else {
                //		$results = $em->getRepository(Receipt::class)->findReceiptByExample($data, Payment::PAYMENT_STATUS_OK);
                $results = $em->getRepository(Receipt::class)->findReceiptByNumeroReferenciaGTWIN($data);
                if (0 === sizeof($results)) {
                    $result = $gts->findByNumReciboDni($data->getId(), $data->getDni());
                    $receipts = [];
                    if (null !== $result) {
                        $errores = $result->comprobarCondicionesPago();
                        foreach ($errores as $error) {
                            $this->addFlash('error', $error);
                        }
                        if (0 === sizeof($errores)) {
                            $receipt = Receipt::createFromGTWINReceipt($result);
                            $em = $this->getDoctrine()->getManager();
                            $em->persist($receipt);
                            $em->flush();
                            $receipts[] = $receipt;
                        }
                    } else {
                        $this->addFlash('error', 'Recibo no encontrado');
                    }
                    $results = $receipts;
                }
            }

            return $this->render('receipt/list.html.twig', [
                'form' => $form->createView(),
                'receipts' => $results,
                'search' => true,
                'readonly' => false,
            ]);
        }
        if ('anon.' === $user && (null === $dni || null === $id)) {
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
        $logger->debug('<--findReceiptsAction: Results: '.count($results));
        $logger->debug('<--findReceiptsAction: End OK');

        return $this->render('receipt/list.html.twig', [
            'form' => $form->createView(),
            'receipts' => $results,
            'search' => true,
            'readonly' => false,
        ]);
    }

    private function __createMiPagoParametersArray(Receipt $receipt)
    {
        return [
            'reference_number' => $receipt->getNumeroReferenciaGTWIN(),
            'payment_limit_date' => $receipt->getUltimoDiaPago()->format('Ymd'),
            'sender' => $receipt->getEntidad(),
            'suffix' => $receipt->getSufijo(),
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
        ];
    }

    /**
     * @Route("/pay/{receipt}", name="receipt_forwarded_pay", methods={"POST"})
     */
    public function payForwaredeReceiptAction(Request $request, Receipt $receipt, LoggerInterface $logger)
    {
        $logger->debug('-->payForwardedReceiptAction: Start');
        if (null != $receipt) {
            $logger->debug('<--payForwardedReceiptAction: End Forwarded to MiPagoBundle:Payment:sendRequest');

            return $this->forward('MiPagoBundle:Payment:sendRequest', $this->__createMiPagoParametersArray($receipt));
        } else {
            $this->addFlash('error', 'Recibo no encontrado');
            $logger->debug('<--payForwardedReceiptAction: End Recibo no encontrado');

            return $this->render('receipt/list.html.twig', [
            'form' => $form->createView(),
            'receipts' => [],
            ]);
        }
        $logger->debug('-->payForwardedReceiptAction: End OK');
    }

    /**
     * @Route("/pay/{numeroReferenciaGTWIN}/{dni}", name="receipt_pay", methods={"GET","POST"})
     */
    public function payReceiptAction(Request $request, $numeroReferenciaGTWIN, $dni, LoggerInterface $logger)
    {
        $logger->debug('-->payReceiptAction: Start');
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $roles = ('anon.' === $user) ? ['IS_AUTHENTICATED_ANONYMOUSLY'] : $user->getRoles();
        $form = $this->createForm(ReceiptTypeForm::class, new Receipt(), [
            'roles' => $roles,
            'locale' => $request->getLocale(),
            'search' => true,
        ]);
        if ('anon.' === $user && (null === $dni || null === $numeroReferenciaGTWIN)) {
            $this->addFlash('error', 'El dni y el número de recibo son obligatorios');
            $logger->debug('<--payReceiptAction: End El dni y el número de recibo son obligatorios');

            return $this->render('receipt/list.html.twig', [
                'form' => $form->createView(),
                'search' => true,
                'receipts' => $results,
            ]);
        }
        $em = $this->getDoctrine()->getManager();
        $receipt = $em->getRepository(Receipt::class)->findOneBy([
            'dni' => $dni,
            'numeroReferenciaGTWIN' => $numeroReferenciaGTWIN,
        ]);
        if (null === $receipt) {
            $this->addFlash('error', 'Recibo no encontrado');
            $logger->debug('<--payReceiptAction: End Recibo no encontrado');

            return $this->render('receipt/list.html.twig', [
                'form' => $form->createView(),
                'search' => true,
                'receipts' => [],
            ]);
        }
        $logger->debug('<--payReceiptAction: End Forwarded to sendRequest');

        return $this->forward('MiPagoBundle:Payment:sendRequest', $this->__createMiPagoParametersArray($receipt));
    }

    /**
     * @Route("/receiptConfirmation", name="receipt_confirmation", methods={"GET","POST"})
     */
    public function receiptConfirmationAction(Request $request, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        $logger->debug('-->ReceiptConfirmationAction: Start');
        $payment = $request->get('payment');
        $reference_number = intval($payment->getReference_number());
        $em = $this->getDoctrine()->getManager();
        $logger->info('ReferenceNumber: '.$reference_number.', Status: '.$payment->getStatus().', PaymentId: '.$payment->getId());
        $receipt = $em->getRepository(Receipt::class)->findOneBy(['numeroReferenciaGTWIN' => intval($reference_number)]);
        if (null === $receipt) {
            $receiptGTWIN = $gts->findByNumRecibo($reference_number);
            $receipt = Receipt::createFromGTWINReceipt($receiptGTWIN);
        }
        $receipt->setPayment($payment);
        $em->persist($receipt);
        $em->flush();
        $this->__updateRemainingTickets($receipt, $logger);
        $this->__sendConfirmationEmails($receipt);
        $this->__updatePayment($receipt, $logger, $gts);
        $logger->debug('<--ReceiptConfirmationAction: End OK');

        return new JsonResponse('OK');
    }

    private function __updateRemainingTickets(Receipt $receipt, LoggerInterface $logger)
    {
        $tickets = $receipt->getTickets();
        $logger->debug($tickets);
        $payment = $receipt->getPayment();
        if (null !== $tickets) {
            $activity = $tickets->getActivity();
            $logger->debug($activity);
            $em = $this->getDoctrine()->getManager();
            //	    $activity = $em->getRepository(Activity::class)->find($activity->getId());
            //	    $payment = $em->getRepository(Payment::class)->find($payment->getId());
            $remainingTickets = $activity->getRemainingTickets();
            $logger->debug('Remaining Tickets:'.$remainingTickets);
            if (null !== $remainingTickets) {
                /* If payment was not OK we add to remaining tickets, because we substracted previously before the payment */
                $logger->debug('Payment status: '.$payment->getStatus());
                if (!$payment->isPaymentSuccessfull()) {
                    $activity->setRemainingTickets($remainingTickets + $tickets->getQuantity());
                    $em->persist($activity);
                    $em->flush();
                }
            }
        }
    }

    private function __sendConfirmationEmails($receipt)
    {
        if (true === $this->getParameter('mailer_sendConfirmation') && !empty($receipt->getEmail())) {
            $emails = [$receipt->getEmail()];
            $this->__sendMessage('Confirmación del Pago / Ordainketaren konfirmazioa', $receipt, $emails);
        }
        if (true === $this->getParameter('mailer_sendBCC')) {
            $bccs = $this->getParameter('mailer_BCC_email');
            $this->__sendMessage('Confirmación del Pago / Ordainketaren konfirmazioa', $receipt, $bccs);
        }
    }

    private function __sendMessage($subject, $receipt, $emails)
    {
        $from = $this->getParameter('mailer_from');
        $mailer = $this->get('mailer');
        $message = new Swift_Message($subject);
        $message->setFrom($from);
        $message->setTo($emails);
        $message->setBody(
            $this->renderView('/receipt/mail.html.twig', [
                'receipt' => $receipt,
            ])
        );
        $message->setContentType('text/html');
        $mailer->send($message);
    }

    /**
     * @Route("/oracle", name="receipt_oracle", methods={"GET","POST"})
     */
    public function oracleAction(Request $request, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        $em = $this->getDoctrine()->getManager();
        $receipt = $em->getRepository(Receipt::class)->find(100000125);
        $gts->createReciboOpt($receipt);
        die;
//        $this->updatePayment($receipt, $logger, $gts);
    }

    private function __updatePayment(Receipt $receipt, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        // No need to update
        if (null === $receipt->getNumeroReferenciaGTWIN()) {
            $logger->info('No GTWIN reference to update');

            return;
        }
        if (null === $receipt->getPayment()) {
            $logger->info('No payment to update status in GTWIN');

            return;
        }
        $payment = $receipt->getPayment();
        if (!$payment->isPaymentSuccessfull()) {
            $logger->info('Payment not successfull no need to update payment in GTWIN');

            return;
        }
        $gts->paidWithCreditCard($receipt->getNumeroReferenciaGTWIN(), $receipt->getFraccion(), $payment->getQuantity(), $payment->getTimestamp(), $payment->getRegistered_payment_id());
    }
}
