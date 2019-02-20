<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Forms;

use AppBundle\Entity\Activity;
use AppBundle\Entity\BuyTickets;
use AppBundle\Forms\InscriptionTypeForm;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * Description of InscriptionTypeForm
 *
 * @author ibilbao
 */
class BuyTicketsTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$readonly = $options['readonly'];
	$builder->add('inscription', InscriptionTypeForm::class,[
	    'data_class' => BuyTickets::class,
	])
	->add('activity',EntityType::class,[
	    'class' => Activity::class,
	    'disabled' => true,
	    'label'=>'label.activity',
	])
	->add('quantity',null,[
	    'label'=>'buyTickets.quantity',
	    'constraints' => [
		new NotBlank(),
	    ],
	    'data' => 1,
//	    'choices' => [
//		'1' => 1,
//		'2' => 2,
//		'3' => 3,
//		'4' => 4,
//	    ],
	]);

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
//	    'search' => false,
	]);
    }
}
