<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Forms;

use App\Entity\Egoera;
use App\Entity\Enpresa;
use App\Entity\Zerbitzua;
use App\Entity\Eskakizuna;
use App\Repository\EgoeraRepository;
use App\Repository\EnpresaRepository;
use App\Repository\ZerbitzuaRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use App\Entity\Receipt;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
/**
 * Description of ReceiptBilatzaileaForm
 *
 * @author ibilbao
 */
class ReceiptTypeForm extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
			$roles = $options['roles'];
			$search = $options['search'];
			$readonly = $options['readonly'];
			$newReceipt = $options['newReceipt'];
			if (!$newReceipt ) {
					$builder->add('id',TextType::class,[
				'label'=>'receipt.id',
					]);
			}
			$builder->add('dni',null,[
					'label'=>'receipt.dni',
					]);
			if (in_array('ROLE_ADMIN', $roles) ) {
					if ( !$newReceipt ) {
				$builder->add('concepto',null,[
					'label'=>'receipt.concepto',
					'disabled' => $readonly,
				])
				->add('numeroReferenciaGTWIN',TextType::class,[
						'label'=>'receipt.numeroReferenciaGTWIN',
				]);
					}
					$builder->add('nombre',null,[
						'label'=>'receipt.nombre',
						'disabled' => $readonly,
				])
				->add('apellido1',null,[
						'label'=>'receipt.apellido1',
						'disabled' => $readonly,
				])
				->add('apellido2',null,[
						'label'=>'receipt.apellido2',
						'disabled' => $readonly,
				])
				->add('email',null,[
						'label'=>'receipt.email',
						'disabled' => $readonly,
				])
				->add('telefono',null,[
						'label'=>'receipt.telefono',
						'disabled' => $readonly,
				]);
			}
			if ( $search ) {
					$builder->add('search', SubmitType::class,[
				'label'=>'receipt.search',
					]);
			} else {
					$builder->add('save', SubmitType::class,[
				'label'=>'receipt.save',

					]);
					$builder->add('back', ButtonType::class,[
				'label'=>'receipt.back',
					]);
			}
			;
    } 

    public function configureOptions(OptionsResolver $resolver) {
	$resolver->setDefaults([
	    'csrf_protection' => true,
	    'data_class' => Receipt::class, 
	    'locale' => null,
	    'roles' => null,
	    'search' => false,
	    'readonly' => false,
	    'newReceipt' => false,
	]);
    }
}
