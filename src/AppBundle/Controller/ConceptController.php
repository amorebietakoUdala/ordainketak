<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Concept;
use AppBundle\Forms\ConceptTypeForm;

/**
 * @Route("/{_locale}/admin", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class ConceptController extends Controller {

    /**
     * @Route("/concept/new", name="concept_new", methods={"GET","POST"})
     */
    public function newAction(Request $request, LoggerInterface $logger) {
	$logger->debug('-->newAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$user = $this->get('security.token_storage')->getToken()->getUser();
	$em = $this->getDoctrine()->getManager();
	$form = $this->createForm(ConceptTypeForm::class, new Concept(), [
	    'readonly' => false,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $concept = $form->getData();
	    $em->persist($concept);
	    $em->flush();
	    $this->addFlash('success','message.concept_created');
	    return $this->redirectToRoute('concept_list');
	}
	$logger->debug('<--newAction: End OK');
	return $this->render('/concept/new.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	]);
	
    }

    /**
     * @Route("/concept", name="concept_list", methods={"GET"})
     */
    public function listAction(Request $request, LoggerInterface $logger) {
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$em = $this->getDoctrine()->getManager();
	$concepts = $em->getRepository(Concept::class)->findAll();
	return $this->render('/concept/list.html.twig', [
		'concepts' => $concepts,
	    ]);
    }

    /**
     * @Route("/concept/{id}", name="concept_show", methods={"GET"})
     */
    public function showAction(Concept $id, LoggerInterface $logger) {
	$logger->debug('-->showAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$form = $this->createForm(ConceptTypeForm::class, $id, [
	    'readonly' => true,
	]);	
	$logger->debug('<--showAction: End OK');
	return $this->render('/concept/show.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => true,
	]);
	
    }
    
    /**
     * @Route("/concept/{id}/edit", name="concept_edit", methods={"GET","POST"})
     */
    public function editAction(Request $request, Concept $id, LoggerInterface $logger) {
	$logger->debug('-->ConceptEditAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$form = $this->createForm(ConceptTypeForm::class, $id, [
	    'readonly' => false,
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $concept = $form->getData();
	    $em = $this->getDoctrine()->getManager();
	    $em->persist($concept);
	    $em->flush();
	    $this->addFlash('success', 'message.concept_saved');
	}
	$logger->debug('<--ConceptEditAction: End OK');
	return $this->render('/concept/edit.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	    'new' => false,
	]);
	
    }

    
     /**
     * @Route("/concept/{id}/delete", name="concept_delete", methods={"GET"})
     */
    public function deleteAction(Concept $id, LoggerInterface $logger) {
	$logger->debug('-->deleteAction: Start');
	$this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
	$em = $this->getDoctrine()->getManager();
	$em->remove($id);
	$em->flush();
	$this->addFlash('success','El concepto se ha eliminado correctamente.');
	$logger->debug('<--deleteAction: End OK');
	return $this->redirectToRoute('concept_list');
    }

}
