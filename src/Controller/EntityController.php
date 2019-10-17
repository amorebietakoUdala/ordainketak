<?php

namespace App\Controller;

use App\Entity\Entidad;
use App\Forms\EntidadTypeForm;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/{_locale}/admin", requirements={
 *	    "_locale": "es|eu"
 * })
 */
class EntityController extends AbstractController
{
    /**
     * @Route("/entity/new", name="entity_new")
     */
    public function newAction(Request $request, LoggerInterface $logger)
    {
        $em = $this->getDoctrine()->getManager();
//        $this->denyAccessUnlessGranted('ROLE_ADMIN', null, 'Unable to access this page!');
        $form = $this->createForm(EntidadTypeForm::class, new Entidad(), [
            'readonly' => false,
        ]);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $entidad = $form->getData();
            $em->persist($entidad);
            $em->flush();
            $this->addFlash('success', 'La nueva entidad se ha guardado correctamente.');

            return $this->redirectToRoute('entity_list');
        }
        $logger->debug('<--newAction: End OK');

        return $this->render('/entidad/new.html.twig', [
                'form' => $form->createView(),
                'readonly' => false,
            ]);
    }

    /**
     * @Route("/entity/{id}/edit", name="entity_edit")
     */
    public function editAction(Entidad $id, Request $request, LoggerInterface $logger)
    {
        $em = $this->getDoctrine()->getManager();
        $form = $this->createForm(EntidadTypeForm::class, $id, []);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $entidad = $form->getData();
            $em->persist($entidad);
            $em->flush();
            $this->addFlash('success', 'La nueva entidad se ha guardado correctamente.');

            return $this->redirectToRoute('entity_list');
        }

        return $this->render('/entidad/edit.html.twig', [
            'form' => $form->createView(),
            'entity' => $id,
            'new' => false,
            'readonly' => false,
        ]);
    }

    /**
     * @Route("/entity/{id}/delete", name="entity_delete", methods={"GET"})
     */
    public function deleteAction(Entidad $id, LoggerInterface $logger)
    {
        $logger->debug('-->deleteAction: Start');
        $em = $this->getDoctrine()->getManager();
        $em->remove($id);
        $em->flush();
        $this->addFlash('success', 'La entidad se ha eliminado correctamente.');
        $logger->debug('<--deleteAction: End OK');

        return $this->redirectToRoute('entity_list');
    }

    /**
     * @Route("/entity", name="entity_list")
     */
    public function listAction(LoggerInterface $logger)
    {
        $em = $this->getDoctrine()->getManager();
        $entities = $em->getRepository(Entidad::class)->findAll();

        return $this->render('/entidad/list.html.twig', [
            'entities' => $entities,
        ]);
    }
}
