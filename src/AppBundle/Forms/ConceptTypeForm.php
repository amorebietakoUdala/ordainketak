<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Forms;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use AppBundle\Entity\Concept;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;

/**
 * Description of ConceptTypeForm
 *
 * @author ibilbao
 */
class ConceptTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
//	$roles = $options['roles'];
	$readonly = $options['readonly'];
	$builder->add('name',null,[
		'label'=>'concept.name',
		'disabled' => $readonly,
	])
	->add('unitaryPrice',null,[
		'label'=>'concept.unitaryPrice',
		'disabled' => $readonly,
	])
	->add('suffix',null,[
		'label'=>'concept.suffix',
		'disabled' => $readonly,
	]);
	if (!$readonly ) {
	    $builder->add('save', SubmitType::class,[
		    'label'=>'btn.save',
	    ]);
	} else {
	    $builder->add('back', ButtonType::class,[
		    'label'=>'btn.back',
	    ]);
	}
    }

    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => Concept::class, 
//	    'roles' => null,
	    'readonly' => false,
	]);
    }
}
