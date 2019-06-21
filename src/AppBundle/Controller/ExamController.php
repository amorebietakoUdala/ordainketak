<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Exam;
use AppBundle\Entity\Receipt;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Forms\ExamTypeForm;
use AppBundle\Services\GTWINIntegrationService;
use AppBundle\Utils\Validaciones;

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
    public function newExamAction(Request $request, LoggerInterface $logger, GTWINIntegrationService $gts)
    {
        $logger->debug('-->newExamAction: Start');
        $em = $this->getDoctrine()->getManager();
        $form = $this->createForm(ExamTypeForm::class, new Exam(), [
        'readonly' => false,
        'locale' => $request->getLocale(),
    ]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $exam = $form->getData();
            if (Validaciones::valida_nif_cif_nie($exam->getDni()) <= 0) {
                $this->addFlash('error', 'EL DNI no es correcto');

                return $this->render('/exam/new.html.twig', [
                'form' => $form->createView(),
                'readonly' => false,
            ]);
            }
            $concept = $exam->getCategory()->getConcept();
            $receipt = $this->createReceiptFromInscriptionData($exam);
            $receipt->setImporte($concept->getUnitaryPrice());
            $receipt->setConcepto($concept->getName());
            $receipt->setEntidad($concept->getEntity());
            $receipt->setSufijo($concept->getSuffix());
            $receipt->setConceptoRenta($concept->getAccountingConcept());
            $date = new \DateTime();
            $receipt->setUltimoDiaPago($date);
            try {
                $logger->debug('-->newExamAction: Create GTWIN Receipt');
                $em->persist($receipt);
                $em->flush();
                $reciboGTWIN = $gts->createReciboOpt($receipt);
                $logger->debug('-->newExamAction: GTWIN Receipt Created successfully');
                $receipt->setNumeroReferenciaGTWIN($reciboGTWIN->getNumeroRecibo());
                $logger->debug('-->newExamAction: Numero ReferenciaGTWIN: '.$reciboGTWIN->getId());
                $em->persist($receipt);
                $em->flush();
                $logger->debug('-->newExamAction: End forwarded to payForwaredeReceipt');

                return $this->forward('AppBundle:Receipt:payForwaredeReceipt', [
                    'receipt' => $receipt,
                ]);
            } catch (Exception $e) {
                $logger->debug('-->newExamAction: Error: '.$e->getMessage());
                $this->addFlash('error', $e->getMessage());
                $em->remove($receipt);
                $em->flush();
            }
        }
        $logger->debug('-->newExamAction: End');

        return $this->render('/exam/new.html.twig', [
        'form' => $form->createView(),
        'readonly' => false,
    ]);
    }

    private function createReceiptFromInscriptionData(Exam $exam)
    {
        $receipt = new Receipt();
        $receipt->setDni(strtoupper($exam->getDni()));
        $receipt->setNombre(strtoupper($exam->getNombre()));
        $receipt->setApellido1(strtoupper($exam->getApellido1()));
        $receipt->setApellido2(strtoupper($exam->getApellido2()));
        $receipt->setEmail($exam->getEmail());
        $receipt->setTelefono($exam->getTelefono());

        return $receipt;
    }
}
