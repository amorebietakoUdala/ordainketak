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

/**
 * Description of InscriptionTypeForm
 *
 * @author ibilbao
 */
class ExamTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$readonly = $options['readonly'];
	$builder->add('inscription', InscriptionTypeForm::class,[
	    'data_class' => Exam::class,
	])
	->add('category',EntityType::class,[
	    'class' => Category::class,
	    'label'=>'exam.category',
	])
	->add('save', SubmitType::class,[
	    'label'=>'btn.save',
	]);
    }

    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => Exam::class, 
	    'readonly' => false,
//	    'search' => false,
	]);
    }
}
