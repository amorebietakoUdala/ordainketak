<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Exam
 *
 * @ORM\Table(name="concept")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ConceptRepository")
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
     *
     * @ORM\Column(name="entity", type="string", length=6, nullable=false)
     */
    private $entity;

    /**
     * @var string
     *
     * @ORM\Column(name="suffix", type="string", length=3, nullable=false)
     */
    private $suffix;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
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
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    public function getNameEu() {
	return $this->nameEu;
    }

    public function setNameEu($nameEu) {
	$this->nameEu = $nameEu;
	return $this;
    }

    /**
     * Set unitaryPrice
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
     * Get unitaryPrice
     *
     * @return string
     */
    public function getUnitaryPrice()
    {
        return $this->unitaryPrice;
    }
    
    public function getSuffix() {
	return $this->suffix;
    }

    public function setSuffix($suffix) {
	$this->suffix = $suffix;
	return $this;
    }

    public function getEntity() {
	return $this->entity;
    }

    public function setEntity($entity) {
	$this->entity = $entity;
	return $this;
    }

    public function __toString() {
	return $this->name;
    }
    

}

