<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Entity;

/**
 * Description of Exam
 *
 * @author ibilbao
 */
class BuyTickets extends Inscription {
    
    private $activity;
    
    private $quantity;

    public function getActivity() {
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

}
