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
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Validator\Constraints\Regex;

/**
 * Description of InscriptionTypeForm.
 *
 * @author ibilbao
 */
class InscriptionTypeForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        //	$locale = $options['data']['locale'];
        //	$readonly = $options['readonly'];
        $builder->add('dni', TextType::class, [
        'label' => 'receipt.dni',
        'constraints' => [
        new NotBlank(),
//        new Regex('/^[XYZ]?([0-9]{7,8})([A-Z])$/i'),
        ],
    ])
    ->add('nombre', TextType::class, [
        'label' => 'receipt.nombre',
        'constraints' => [
            new NotBlank(),
        ],
    ])
    ->add('apellido1', TextType::class, [
        'label' => 'receipt.apellido1',
        'constraints' => [
            new NotBlank(),
        ],
    ])
    ->add('apellido2', TextType::class, [
        'label' => 'receipt.apellido2',
        'constraints' => [
            new NotBlank(),
        ],
    ])
    ->add('email', TextType::class, [
        'label' => 'receipt.email',
        'constraints' => [
            new NotBlank(),
        ],
    ])
    ->add('telefono', TextType::class, [
        'label' => 'receipt.telefono',
        'constraints' => [
        ],
    ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'inherit_data' => true,
    ]);
    }

    public function validar_dni($dni)
    {
        $letra = substr($dni, -1);
        $numeros = substr($dni, 0, -1);
        if (substr('TRWAGMYFPDXBNJZSQVHLCKE', $numeros % 23, 1) == $letra && 1 == strlen($letra) && 8 == strlen($numeros)) {
            return true;
        } else {
            return false;
        }
    }

    public function is_valid_dni_nie($string)
    {
        if (9 != strlen($string) ||
        1 !== preg_match('/^[XYZ]?([0-9]{7,8})([A-Z])$/i', $string, $matches)) {
            return false;
        }

        $map = 'TRWAGMYFPDXBNJZSQVHLCKE';

        list(, $number, $letter) = $matches;

        return strtoupper($letter) === $map[((int) $number) % 23];
    }
}
