<?php

return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Symfony\Bundle\SecurityBundle\SecurityBundle::class => ['all' => true],
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],
    FR3D\LdapBundle\FR3DLdapBundle::class => ['all' => true],
    FOS\JsRoutingBundle\FOSJsRoutingBundle::class => ['all' => true],
    FOS\RestBundle\FOSRestBundle::class => ['all' => true],
    FOS\UserBundle\FOSUserBundle::class => ['all' => true],
    JMS\SerializerBundle\JMSSerializerBundle::class => ['all' => true],
    Nelmio\ApiDocBundle\NelmioApiDocBundle::class => ['all' => true],
    Doctrine\Bundle\DoctrineCacheBundle\DoctrineCacheBundle::class => ['all' => true],
    Nelmio\Alice\Bridge\Symfony\NelmioAliceBundle::class => ['dev' => true, 'test' => true],
    Fidry\AliceDataFixtures\Bridge\Symfony\FidryAliceDataFixturesBundle::class => ['dev' => true, 'test' => true],
    Doctrine\Bundle\DoctrineBundle\DoctrineBundle::class => ['all' => true],
    MiPago\Bundle\MiPagoBundle::class => ['all' => true],
    Hautelook\AliceBundle\HautelookAliceBundle::class => ['dev' => true, 'test' => true],
    Symfony\Bundle\MonologBundle\MonologBundle::class => ['all' => true],
    Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle::class => ['all' => true],
    Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle::class => ['all' => true],
    Symfony\Bundle\DebugBundle\DebugBundle::class => ['dev' => true, 'test' => true],
    Symfony\Bundle\WebProfilerBundle\WebProfilerBundle::class => ['dev' => true, 'test' => true],
    Symfony\Bundle\WebServerBundle\WebServerBundle::class => ['dev' => true],
    Symfony\WebpackEncoreBundle\WebpackEncoreBundle::class => ['all' => true],
    Bazinga\Bundle\JsTranslationBundle\BazingaJsTranslationBundle::class => ['all' => true],
    Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle::class => ['all' => true],
];
