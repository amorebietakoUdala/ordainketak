<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Exam;
use AppBundle\Entity\Receipt;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Forms\ExamTypeForm;

/**
 * @Route("/{_locale}/exam", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class ExamController extends Controller
{
    /**
     * @Route("/new", name="exam_new")
     */
    public function newExamAction(Request $request, LoggerInterface $logger) {
	$logger->debug('-->newInscriptionAction: Start');
	$em = $this->getDoctrine()->getManager();
	$form = $this->createForm(ExamTypeForm::class, new Exam(), [
	    'readonly' => false,
	    'locale' => $request->getLocale(),
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    $exam = $form->getData();
	    $concept = $exam->getCategory()->getConcept();
	    $receipt = $this->createReceiptFromInscriptionData($exam);
	    $receipt->setImporte($concept->getUnitaryPrice());
	    $receipt->setConcepto($concept->getName());
	    $receipt->setEntidad($concept->getEntity());
	    $receipt->setSufijo($concept->getSuffix());
	    $date = new \DateTime();
	    $receipt->setUltimoDiaPago($date);
	    $em->persist($receipt);
	    $em->flush();
	    $receipt->setNumeroReferenciaGTWIN($receipt->getId());
	    $em->persist($receipt);
	    $em->flush();
	    return $this->forward("AppBundle:Receipt:payForwaredeReceipt", [
		'receipt' => $receipt,
	    ]);
	}
        return $this->render('/exam/new.html.twig', [
	    'form' => $form->createView(),
	    'readonly' => false,
	]);
    }
    
    private function createReceiptFromInscriptionData ( Exam $exam ) {
	$receipt = new Receipt();
	$receipt->setDni($exam->getDni());
	$receipt->setNombre($exam->getNombre());
	$receipt->setApellido1($exam->getApellido1());
	$receipt->setApellido2($exam->getApellido2());
	$receipt->setEmail($exam->getEmail());
	$receipt->setTelefono($exam->getTelefono());
	return $receipt;
    }
}
