<?php

namespace App\Repository\GTWIN;

use App\Entity\GTWIN\ReciboGTWIN;
use Doctrine\ORM\EntityRepository;

/**
 * ReciboGTWINRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ReciboGTWINRepository extends EntityRepository
{
    //	public function findBy ($numRecibo, $dni) {
    //		$em = $this->em;
    //		$select_template = "SELECT * FROM SP_TRB_RECIBO R, SP_TRB_TIPING T WHERE R.RECCODTIN=T.TINCODTIN AND RECESTADO='P' AND RECSITUAC='V' AND RECNUMREC='{RECNUMREC}' AND RECDNINIF='{RECDNINIF}'";
    //		$params = [
    //			'{RECNUMREC}' => $numRecibo,
    //			'{RECDNINIF}' => substr(
    //					str_pad($dni, 10, "0", STR_PAD_LEFT)
    //					 , 0,-1),
    //		];
    //		$sql = str_replace(array_keys($params), $params, $select_template);
    //		$statement = $em->getConnection()->prepare( $sql );
    //		$statement->execute();
    //		$results = $statement->fetchAll();
    //		return $results;
    //	}

    public function findByNumReciboDni($numRecibo, $dni, $letra): ?ReciboGTWIN
    {
        $qb = $this->createQueryBuilder('r')
        ->andWhere('r.numeroRecibo = :numeroRecibo')
        ->andWhere('r.dni= :dni')
        ->andWhere('r.letra= :letra')
        ->andWhere('r.situacion = :situacion')
        ->andWhere('r.estado = :estado')
        ->setParameter('numeroRecibo', $numRecibo)
        ->setParameter('dni', $dni)
        ->setParameter('letra', $letra)
        ->setParameter('situacion', 'V')
        ->setParameter('estado', 'P');
        $result = $qb->getQuery()->getOneOrNullResult();

        return $result;
    }

    public function findByRecibosPendientesByDni($dni, $letra)
    {
        return $this->findByRecibosDni($dni, $letra, ReciboGTWIN::ESTADO_PENDIENTE, ReciboGTWIN::SITUACION_VOLUNTARIA);
    }

    public function findByRecibosDni($dni, $letra, $estado = ReciboGTWIN::ESTADO_PENDIENTE, $situacion = ReciboGTWIN::SITUACION_VOLUNTARIA)
    {
        $qb = $this->createQueryBuilder('r')
        ->andWhere('r.dni= :dni')
        ->andWhere('r.letra= :letra')
        ->andWhere('r.situacion = :situacion')
        ->andWhere('r.estado = :estado')
        ->setParameter('dni', $dni)
        ->setParameter('letra', $letra)
        ->setParameter('situacion', $situacion)
        ->setParameter('estado', $estado);
        $result = $qb->getQuery()->getResult();

        return $result;
    }

    private function __remove_blank_filters($criteria)
    {
        $new_criteria = [];
        foreach ($criteria as $key => $value) {
            if (!empty($value)) {
                $new_criteria[$key] = $value;
            }
        }

        return $new_criteria;
    }
}
