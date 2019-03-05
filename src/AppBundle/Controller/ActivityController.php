<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Activity;
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
    public function newActivityAction(Request $request, LoggerInterface $logger) {
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$logger->debug('-->newIbiliakAction: Start');
	$em = $this->getDoctrine()->getManager();
	$activity = new Activity();
	$form = $this->createForm(ActivityTypeForm::class, new Activity(), [
	    'readonly' => false,
	    'new' => true,
	    'locale' => $request->getLocale(),
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
	    'new' => true
	]);
    }

    /**
     * @Route("/", name="activity_list", methods={"GET"})
     */
    public function listAction(Request $request, LoggerInterface $logger) {
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$em = $this->getDoctrine()->getManager();
	$activities = $em->getRepository(Activity::class)->findAll();
	return $this->render('/activity/list.html.twig', [
		'activities' => $activities,
	    ]);
    }

    /**
     * @Route("/{id}", name="activity_show", methods={"GET"})
     */
    public function showAction(Request $request, Activity $id, LoggerInterface $logger) {
	$logger->debug('-->showAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$form = $this->createForm(ActivityTypeForm::class, $id, [
	    'readonly' => true,
    	    'locale' => $request->getLocale(),
	]);	
	$logger->debug('<--showAction: End OK');
	return $this->render('/activity/show.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => true,
	]);
    }

    /**
     * @Route("/{id}/edit", name="activity_edit", methods={"GET","POST"})
     */
    public function editAction(Request $request, Activity $id, LoggerInterface $logger) {
	$logger->debug('-->editAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$form = $this->createForm(ActivityTypeForm::class, $id, [
	    'readonly' => false,
	    'locale' => $request->getLocale(),
	    'new' => false,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $activity = $form->getData();
	    $em = $this->getDoctrine()->getManager();
	    $em->persist($activity);
	    $em->flush();
	    $this->addFlash('success', 'message.activity_modified');
	}
	$logger->debug('<--editAction: End OK');
	return $this->render('/activity/edit.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	    'new' => false,
	]);
    }

     /**
     * @Route("/{id}/delete", name="activity_delete", methods={"GET"})
     */
    public function deleteAction(Request $request, Activity $id, LoggerInterface $logger) {
	$logger->debug('-->deleteAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$em = $this->getDoctrine()->getManager();
	$em->remove($id);
	$em->flush();
	$this->addFlash('success','La actividad se ha eliminado correctamente.');
	$logger->debug('<--deleteAction: End OK');
	return $this->redirectToRoute('activity_list');
    }

}
