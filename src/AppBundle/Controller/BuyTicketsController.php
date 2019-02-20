<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Activity;
use AppBundle\Entity\BuyTickets;
use AppBundle\Entity\Receipt;
use AppBundle\Forms\BuyTicketsTypeForm;
use DateTime;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/{_locale}/tickets", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class BuyTicketsController extends Controller
{
    /**
     * @Route("/{activity}/buy", name="buyTickets_activity")
     */
    public function buyTicketsAction(Request $request, Activity $activity, LoggerInterface $logger) {
	$logger->debug('-->buyTicketsAction: Start');
	$em = $this->getDoctrine()->getManager();
	$tickets = new BuyTickets();
	$tickets->setActivity($activity);
	$form = $this->createForm(BuyTicketsTypeForm::class, $tickets, [
	    'readonly' => false,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $tickets = $form->getData();
	    $concept = $tickets->getActivity()->getConcept();
	    $receipt = $this->createReceiptFromTicketsData($tickets);
	    $receipt->setImporte($concept->getUnitaryPrice()*$tickets->getQuantity());
	    $receipt->setConcepto($concept->getName());
	    $receipt->setEntidad($concept->getEntity());
	    $receipt->setSufijo($concept->getSuffix());
	    $date = new DateTime();
	    $receipt->setUltimoDiaPago($date);
	    dump($tickets,$concept,$receipt);die;
	    $em->persist($receipt);
	    $em->flush();
	    return $this->forward("AppBundle:Receipt:payForwaredeReceipt", [
		'receipt' => $receipt,
	    ]);
	}
        return $this->render('/tickets/buy.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	]);
    }
    
    private function createReceiptFromTicketsData (BuyTickets $buyTickets ) {
	$receipt = new Receipt();
	$receipt->setDni($buyTickets->getDni());
	$receipt->setNombre($buyTickets->getNombre());
	$receipt->setApellido1($buyTickets->getApellido1());
	$receipt->setApellido2($buyTickets->getApellido2());
	$receipt->setEmail($buyTickets->getEmail());
	$receipt->setTelefono($buyTickets->getTelefono());
	$receipt->setActividad($buyTickets->getActivity());
	return $receipt;
    }
}
