<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Forms;

use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * Description of ReceiptUploadTypeForm
 *
 * @author ibilbao
 */
class ReceiptUploadTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
	$readonly = $options['readonly'];
	$builder->add('file', FileType::class,[
		'label'=>'receiptUpload.file',
		'attr' => [
		    'class' => 'custom-file',
		],
		'constraints' => [
		    new NotBlank(),
		],
		'disabled' => $readonly,
	])->add('send', SubmitType::class, [
	    'label' => 'btn.send'
	])
	;
    }
    
    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => null, 
	    'readonly' => false,
	]);
    }    
}
