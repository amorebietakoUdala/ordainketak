<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Receipt;
use AppBundle\Entity\Concept;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Forms\InscriptionTypeForm;

/**
 * @Route("/{_locale}/inscription", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class InscriptionController extends Controller
{
    /**
     * @Route("/{concept}/new", name="inscription_new")
     */
    public function newInscriptionAction(Request $request, LoggerInterface $logger, Concept $concept) {
	$logger->debug('-->newInscriptionAction: Start');
	$em = $this->getDoctrine()->getManager();
	$form = $this->createForm(InscriptionTypeForm::class, new Receipt(), [
	    'search' => false,
	    'readonly' => false,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $receipt = $form->getData();
	    $receipt->setImporte($concept->getUnitaryPrice());
	    $receipt->setConcepto($concept->getName());
	    $receipt->setSufijo($concept->getSuffix());
	    $date = new \DateTime();
	    $receipt->setUltimoDiaPago($date);
	    $em->persist($receipt);
	    $em->flush();
	    return $this->forward("AppBundle:Receipt:payForwaredeReceipt", [
		'receipt' => $receipt,
	    ]);
	}
        return $this->render('/inscription/new.html.twig', [
	    'form' => $form->createView(),
	    'search' => false,
//	    'search' => false,
	]);
    }

}
