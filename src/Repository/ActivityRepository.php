<?php

namespace App\Repository;

/**
 * ExamRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ActivityRepository extends \Doctrine\ORM\EntityRepository
{
    
    public function getEnabledActivities() {
	$criteria = [
	    'enabled' => true,
	    ];
	return $this->findBy($criteria);
    }
}
