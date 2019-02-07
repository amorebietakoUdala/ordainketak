<?php

namespace AppBundle\Repository;

use AppBundle\Entity\Receipt;

/**
 * PaymentRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ReceiptRepository extends \Doctrine\ORM\EntityRepository
{
     /**
     * @return Array
     */
    public function findReceiptByExample (Receipt $receipt) {
	$criteria = $this->__remove_blank_filters($receipt->toArray());
	return $this->findBy($criteria);
    }
    
    private function __remove_blank_filters ($criteria) {
	$new_criteria = [];
	foreach ($criteria as $key => $value) {
	    if (!empty($value))
		$new_criteria[$key] = $value;
	}
	return $new_criteria;
    }

}
