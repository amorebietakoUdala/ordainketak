<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Forms;

use App\Entity\Activity;
use App\Entity\BuyTickets;
use App\Forms\InscriptionTypeForm;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\LessThanOrEqual;

/**
 * Description of InscriptionTypeForm
 *
 * @author ibilbao
 */
class BuyTicketsTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$readonly = $options['readonly'];
	$quantityLimit = $options['quantity_limit'];
	$builder->add('inscription', InscriptionTypeForm::class,[
	    'data_class' => BuyTickets::class,
	])
	->add('activity',EntityType::class,[
	    'class' => Activity::class,
	    'disabled' => true,
	    'label'=>'label.activity',
	]);
	if ($quantityLimit === null ) {
	    $builder->add('quantity',null,[
		'label'=>'buyTickets.quantity',
		'constraints' => [
		    new NotBlank(),
		],
		'data' => 1,
	    ]);
	} else {
	    if  ( $quantityLimit === 1 ) {
		$builder->add('quantity', null,[
		    'label'=>'buyTickets.quantity',
		    'disabled' => true,
		    'constraints' => [
			new NotBlank(),
		    ],
		    'data' => $quantityLimit,
		]);
	    } else {
		$builder->add('quantity', null,[
		    'label'=>'buyTickets.quantity',
		    'disabled' => false,
		    'constraints' => [
			new NotBlank(),
			new LessThanOrEqual($quantityLimit),
		    ],
		]);
	    }
	}
	if (!$readonly) {
	    $builder->add('buy', SubmitType::class,[
		'label'=>'btn.buy',
	    ]);
	}
	$builder->add('back', ButtonType::class,[
		    'label'=>'btn.back',
	    ]);
    }

    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => BuyTickets::class, 
	    'readonly' => false,
	    'quantity_limit' => null,
//	    'search' => false,
	]);
    }
}
