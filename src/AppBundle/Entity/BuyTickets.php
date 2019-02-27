<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Entity\Activity;

/**
 * BuyTickets
 *
 * @ORM\Table(name="buyTickets")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\BuyTicketsRepository")
 */

class BuyTickets extends Inscription {

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
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Activity")
     * @ORM\JoinColumn(name="activity_id", referencedColumnName="id", nullable=true)
     */
    private $activity;
    
    /**
     * @var string
     * @Assert\GreaterThan(0)
     * @ORM\Column(name="quantity", type="integer", nullable=true)
     */
    private $quantity;

    public function getActivity(): Activity {
	return $this->activity;
    }

    public function getQuantity() {
	return $this->quantity;
    }

    public function setActivity($activity) {
	$this->activity = $activity;
	return $this;
    }

    public function setQuantity($quantity) {
	$this->quantity = $quantity;
	return $this;
    }

    public function __toString() {
	return "{ Id: ". $this->id. ", actividad: " . $this->activity->getName() . ", quantity: ". $this->quantity. "}";
    }
}
