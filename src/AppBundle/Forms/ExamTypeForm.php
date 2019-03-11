<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Forms;

use AppBundle\Entity\Category;
use AppBundle\Entity\Exam;
use AppBundle\Forms\InscriptionTypeForm;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;

/**
 * Description of InscriptionTypeForm
 *
 * @author ibilbao
 */
class ExamTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$readonly = $options['readonly'];
	$locale = $options['locale'];
	$builder->add('inscription', InscriptionTypeForm::class,[
	    'data_class' => Exam::class,
	])
	->add('category',EntityType::class,[
	    'class' => Category::class,
	    'label'=>'exam.category',
	    'choice_label' => function ($category) use ($locale) {
		if ($locale === 'es') {
		    return $category->getName();
		} else {
		    return $category->getNameEu();
		}
	    }
	]);
	if (!$readonly) {
	    $builder->add('pay', SubmitType::class,[
		'label'=>'btn.pay',
	    ]);
	}
	$builder->add('back', ButtonType::class,[
		    'label'=>'btn.back',
	    ]);
    }

    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => Exam::class, 
	    'readonly' => false,
	    'locale' => 'es'
//	    'search' => false,
	]);
    }
}
