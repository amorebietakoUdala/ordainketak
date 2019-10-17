<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Exam.
 *
 * @ORM\Table(name="concept")
 * @ORM\Entity(repositoryClass="App\Repository\ConceptRepository")
 */
class Concept
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="name_eu", type="string", length=255, nullable=true)
     */
    private $nameEu;

    /**
     * @var string
     *
     * @ORM\Column(name="unitaryPrice", type="decimal", precision=6, scale=2)
     */
    private $unitaryPrice;

    /**
     * @var string
     * @Assert\NotBlank
     * @ORM\Column(name="entity", type="string", length=6, nullable=false)
     */
    private $entity;

    /**
     * @var string
     * @Assert\NotBlank
     * @ORM\Column(name="suffix", type="string", length=3, nullable=false)
     */
    private $suffix;

    /**
     * @var string
     * @Assert\NotBlank
     * @ORM\Column(name="acc_concept", type="string", length=5, nullable=false)
     */
    private $accountingConcept;

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name.
     *
     * @param string $name
     *
     * @return Exam
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    public function getNameEu()
    {
        return $this->nameEu;
    }

    public function setNameEu($nameEu)
    {
        $this->nameEu = $nameEu;

        return $this;
    }

    /**
     * Set unitaryPrice.
     *
     * @param string $unitaryPrice
     *
     * @return Exam
     */
    public function setUnitaryPrice($unitaryPrice)
    {
        $this->unitaryPrice = $unitaryPrice;

        return $this;
    }

    /**
     * Get unitaryPrice.
     *
     * @return string
     */
    public function getUnitaryPrice()
    {
        return $this->unitaryPrice;
    }

    public function getSuffix()
    {
        return $this->suffix;
    }

    public function setSuffix($suffix)
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function getEntity()
    {
        return $this->entity;
    }

    public function setEntity($entity)
    {
        $this->entity = $entity;

        return $this;
    }

    public function getAccountingConcept()
    {
        return $this->accountingConcept;
    }

    public function setAccountingConcept($accountingConcept)
    {
        $this->accountingConcept = $accountingConcept;

        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }
}
