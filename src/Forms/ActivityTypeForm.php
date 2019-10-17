<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Forms;

use App\Entity\Activity;
use App\Entity\Concept;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Description of InscriptionTypeForm.
 *
 * @author ibilbao
 */
class ActivityTypeForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $readonly = $options['readonly'];
        $locale = $options['locale'];
        $new = $options['new'];
        $builder->add('name', null, [
        'label' => 'activity.name',
        'disabled' => $readonly,
    ])
    ->add('nameEu', null, [
        'label' => 'activity.name_eu',
        'disabled' => $readonly,
    ])
    ->add('concept', EntityType::class, [
        'label' => 'activity.concept',
        'class' => Concept::class,
        'choice_label' => function ($concept) use ($locale) {
            if ('es' === $locale) {
                return $concept->getName();
            } else {
                return $concept->getNameEu();
            }
        },
//	    'query_builder' => function (ConceptRepository $repo, $locale) {
//
//		return $repo->createOrderedQueryBuilder($locale);
//	    },
        'disabled' => $readonly,
    ])
    ->add('totalTickets', null, [
        'label' => 'activity.totalTickets',
        'disabled' => $readonly,
    ]);
        if (!$new) {
            $builder->add('remainingTickets', null, [
        'label' => 'activity.ticketsRemaining',
        'disabled' => $readonly,
        ]);
        }
        $builder->add('maxTickets', null, [
        'label' => 'activity.maxTickets',
        'disabled' => $readonly,
    ])
    ->add('enabled', CheckboxType::class, [
        'label' => 'activity.enabled',
        'disabled' => $readonly,
    ]);

        if (!$readonly) {
            $builder->add('save', SubmitType::class, [
        'label' => 'btn.save',
        ]);
        }
        $builder->add('back', ButtonType::class, [
            'label' => 'btn.back',
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
        'csrf_protection' => true,
        'data_class' => Activity::class,
        'readonly' => false,
        'locale' => 'es',
        'new' => false,
//	    'search' => false,
    ]);
    }
}
