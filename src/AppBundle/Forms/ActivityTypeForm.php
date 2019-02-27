<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Forms;

use AppBundle\Entity\Activity;
use AppBundle\Entity\Concept;
use AppBundle\Forms\InscriptionTypeForm;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * Description of InscriptionTypeForm
 *
 * @author ibilbao
 */
class ActivityTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$readonly = $options['readonly'];
	$new = $options['new'];
	$builder->add('name', null,[
	    'label' => 'activity.name',
	    'disabled' => $readonly,
	])
	->add('concept', EntityType::class, [
	    'class' => Concept::class,
	    'disabled' => $readonly,
	])
	->add('totalTickets', null, [
	    'label' => 'activity.totalTickets',
	    'disabled' => $readonly,
	]);
	if (!$new) {
	    $builder->add('remainingTickets', null,[
		'label'=>'activity.ticketsRemaining',
		'disabled' => $readonly,
	    ]);
	}
	if (!$readonly) {
	    $builder->add('save', SubmitType::class,[
		'label'=>'btn.save',
	    ]);
	}
	$builder->add('back', ButtonType::class,[
		    'label'=>'btn.back',
	    ]);
    }

    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => Activity::class, 
	    'readonly' => false,
	    'new' => false,
//	    'search' => false,
	]);
    }
}
