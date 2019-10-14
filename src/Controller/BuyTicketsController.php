<?php

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\BuyTickets;
use App\Entity\Receipt;
use App\Forms\BuyTicketsTypeForm;
use DateTime;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/{_locale}/tickets", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class BuyTicketsController extends AbstractController
{
    /**
     * @Route("/{activity}/buy", name="buyTickets_activity", options={"expose"=true})
     */
    public function buyTicketsAction(Request $request, Activity $activity, LoggerInterface $logger)
    {
        $logger->debug('-->buyTicketsAction: Start');
        $em = $this->getDoctrine()->getManager();
        $tickets = new BuyTickets();
        /* If we initialize them, it posted them even if the field is disabled */
        $tickets->setActivity($activity);
        $tickets->setQuantity(1);
        $maxTickets = $activity->getMaxTickets();
        $form = $this->createForm(BuyTicketsTypeForm::class, $tickets, [
        'readonly' => false,
        'quantity_limit' => $maxTickets,
    ]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $tickets = $form->getData();
            $activity = $tickets->getActivity();
            $concept = $activity->getConcept();
            $receipt = $this->createReceiptFromTicketsData($tickets);
            $receipt->setImporte($concept->getUnitaryPrice() * $tickets->getQuantity());
            $receipt->setConcepto($concept->getName());
            $receipt->setEntidad($concept->getEntity());
            $receipt->setSufijo($concept->getSuffix());
            $date = new DateTime();
            $receipt->setUltimoDiaPago($date);
            $em->persist($receipt);
            if (null !== $activity->getRemainingTickets() && ($activity->getRemainingTickets() - $tickets->getQuantity()) >= 0) {
                $activity->setRemainingTickets($activity->getRemainingTickets() - $tickets->getQuantity());
                $em->persist($activity);
            } elseif (null !== $activity->getRemainingTickets() && ($activity->getRemainingTickets() - $tickets->getQuantity()) < 0) {
                $this->addFlash('error', 'No enough tickets');

                return $this->render('/tickets/buy.html.twig', [
            'form' => $form->createView(),
            'readonly' => false,
        ]);
            } elseif (null !== $activity->getRemainingTickets() && 0 == $activity->getRemainingTickets()) {
                $this->addFlash('error', 'No more tickets available');

                return $this->render('/tickets/buy.html.twig', [
            'form' => $form->createView(),
            'readonly' => false,
        ]);
            }
            $em->flush();
            $receipt->setNumeroReferenciaGTWIN($receipt->getId());
            $em->persist($receipt);
            $em->flush();

            return $this->forward('App\Controller\ReceiptController::payForwardedReceiptAction', [
                'receipt' => $receipt,
                ]);
        }

        return $this->render('/tickets/buy.html.twig', [
        'form' => $form->createView(),
        'readonly' => false,
    ]);
    }

    private function createReceiptFromTicketsData(BuyTickets $buyTickets)
    {
        $receipt = new Receipt();
        $receipt->setDni($buyTickets->getDni());
        $receipt->setNombre($buyTickets->getNombre());
        $receipt->setApellido1($buyTickets->getApellido1());
        $receipt->setApellido2($buyTickets->getApellido2());
        $receipt->setEmail($buyTickets->getEmail());
        $receipt->setTelefono($buyTickets->getTelefono());
        $receipt->setTickets($buyTickets);

        return $receipt;
    }
}
