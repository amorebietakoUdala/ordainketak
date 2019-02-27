<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Actividad
 *
 * @ORM\Table(name="activities")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ActivityRepository")
 */
class Activity {

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
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity="Concept")
     * @ORM\JoinColumn(name="concept_id", referencedColumnName="id")
     */
    private $concept;
    
    /**
     * @var string
     *
     * @ORM\Column(name="totalTickets", type="integer", nullable=true)
     */
    private $totalTickets;

    /**
     * @var string
     *
     * @ORM\Column(name="remainingTickets", type="integer", nullable=true)
     */
    private $remainingTickets;

    /**
     * @var string
     *
     * @ORM\Column(name="maxTickets", type="integer", nullable=true)
     */
    private $maxTickets;

    public function getId() {
	return $this->id;
    }

    public function getConcept() {
	return $this->concept;
    }

    public function setConcept(Concept $concept) {
	$this->concept = $concept;
	return $this;
    }
    
    public function getName() {
	return $this->name;
    }

    public function getTotalTickets() {
	return $this->totalTickets;
    }

    public function getMaxTickets() {
	return $this->maxTickets;
    }
    
    public function setName($name) {
	$this->name = $name;
	return $this;
    }

    public function setTotalTickets($totalTickets) {
	$this->totalTickets = $totalTickets;
	return $this;
    }
    
    public function getRemainingTickets() {
	return $this->remainingTickets;
    }

    public function setRemainingTickets($remainingTickets) {
	$this->remainingTickets = $remainingTickets;
	return $this;
    }
    
    public function setMaxTickets($maxTickets) {
	$this->maxTickets = $maxTickets;
	return $this;
    }

    public function __toDebug() {
	return "{id: ".$this->id. ", name: ". $this->name. ", TotalTickets: ".$this->totalTickets. ", remainingTickets: ". $this->remainingTickets. "}";
    }

    public function __toString() {
	return $this->name;
    }
}
