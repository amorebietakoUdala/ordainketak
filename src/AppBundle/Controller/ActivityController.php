<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Activity;
use AppBundle\Entity\Receipt;
use AppBundle\Entity\Concept;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Forms\ActivityTypeForm;

/**
 * @Route("/{_locale}/activity", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class ActivityController extends Controller
{
    /**
     * @Route("/new", name="activity_new")
     */
    public function newIbiliakAction(Request $request, LoggerInterface $logger) {
	$logger->debug('-->newIbiliakAction: Start');
	$em = $this->getDoctrine()->getManager();
	$activity = new Activity();
	$form = $this->createForm(ActivityTypeForm::class, new Activity(), [
	    'readonly' => false,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $activity = $form->getData();
	    $activity->setRemainingTickets($activity->getTotalTickets());
	    $em->persist($activity);
	    $em->flush();
	    $this->addFlash('success', 'message.activity_created');
	}
        return $this->render('/activity/new.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	]);
    }

}
