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
class Exam extends Inscription {
    
    private $category;
    
    public function getCategory() {
	return $this->category;
    }

    public function setCategory($category) {
	$this->category = $category;
	return $this;
    }
}
