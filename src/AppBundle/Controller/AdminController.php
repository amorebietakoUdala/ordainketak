<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Receipt;
use AppBundle\Forms\ReceiptBilatzaileaForm;

    /**
     * @Route("/{_locale}/admin", requirements={
     *	    "_locale": "es|eu"
     * })
     */
class AdminController extends Controller
{
    /**
     * @Route("/receipts", name="admin_receipts", requirements={
     *	    "_locale": "es|eu"
     * })
     */
    public function listReceiptsAction(Request $request, LoggerInterface $logger)
    {
	$logger->debug('-->listReceiptsAction: Start');
//	$user = $this->get('security.token_storage')->getToken()->getUser();
	$form = $this->createForm(ReceiptBilatzaileaForm::class, null, [
//	    'editatzen' => false,
//	    'role' => $user->getRoles(),
    	    'locale' => $request->getLocale(),
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $em = $this->getDoctrine()->getManager();
	    $criteria = $this->__remove_blank_filters($form->getData());
	    $results = $em->getRepository(Receipt::class)->findBy($criteria);
	    return $this->render('default/index.html.twig', [
		'form' => $form->createView(),
		'receipts' => $results,
	    ]);
	}
	
	$logger->debug('<--listReceiptsAction: End OK');
	return $this->render('default/index.html.twig', [
	    'form' => $form->createView(),
	]);
	
	
    }
    

    private function __remove_blank_filters ($criteria) {
	$new_criteria = [];
	foreach ($criteria as $key => $value) {
	    if (!empty($value))
		$new_criteria[$key] = $value;
	}
	return $new_criteria;
    }
}
