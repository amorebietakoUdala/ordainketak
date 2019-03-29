<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Services;

use AppBundle\Entity\GTWIN\TipoIngreso;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\GTWIN\ReciboGTWIN;
/**
 * Description of MiPagoConstants
 *
 * @author ibilbao
 */
class GTWINIntegrationService {
    
    private $em = null;
	private $logger = null;
    
    public function __construct(EntityManager $em, LoggerInterface $logger) {
        $this->em = $em;
		$this->logger = $logger;
    }
    
    public function findByNumReciboDni ($numRecibo, $dni) {
		$em = $this->em;
		$numero = substr($dni,0,-1);
		$letra = substr($dni,-1);
		$numero = $this->__fixDniNumber($numero);
		$results = $em->getRepository(ReciboGTWIN::class)->findByNumReciboDni($numRecibo, $numero, $letra);
		return $results;
	}
	
	private function __fixDniNumber($numero) {
		if (is_numeric($numero) ) {
			$numero = str_pad($numero, 9, "0", STR_PAD_LEFT);
		}
		return $numero;
	}
	
	public function paidWithCreditCard ($numRecibo, $importe, $timestamp, $registeredPaymentId) {
		$insert_template = "INSERT INTO EXTCALL (DBOID, ACTIONCODE, INPUTPARS, OUTPUTPARS, OUTPARSMEMO, CALLTYPE, NUMRETRIES, QUEUE, PRIORITY, CALLSTATUS, CALLTIME, PROCTIME, CONFTIME, ORIGINOBJ, DESTOBJ, USERBW, MSGERROR, URLOK, URLOKPARAM, CONFSTATUS) VALUES ".
								   "('{DBOID}','OPERACION_PAGO_TAR','<NUMREC>{NUMREC}</NUMREC><NUMFRA>{NUMFRA}</NUMFRA><FECOPE>{FECOPE}</FECOPE><IMPORT>{IMPORT}</IMPORT><RECARG>0</RECARG><INTERE>0</INTERE><COSTAS>0</COSTAS><CAJCOB>9</CAJCOB><NUMAUT>{NUMAUT}</NUMAUT><USERBW>{USERBW}</USERBW>',null, null,0,0,0,0,0,TO_DATE('{CALLTIME}','DD/MM/YYYY HH24:MI:SS'),TO_DATE('{PROCTIME}','DD/MM/YYYY HH24:MI:SS'),null,null,null,'{USERBW}',null,null,null,0)";
		$time_start = substr(''.floatval(microtime(true))*10000,0,12);
		$dboid = str_pad('1235'.$time_start, 21, "0", STR_PAD_RIGHT);
		$now = new \DateTime();

		$params = [
			'{DBOID}' => $dboid,
			'{NUMREC}'=> $numRecibo,
			'{NUMFRA}' => 0,
			'{FECOPE}' => $timestamp->format('d/m/Y H:i:s'),
			'{IMPORT}' => $importe,
			'{NUMAUT}' => $registeredPaymentId,
			'{CALLTIME}' => $now->format('d/m/Y H:i:s'),
			'{PROCTIME}' => $now->format('d/m/Y H:i:s'),
			'{USERBW}' => 'INT',
		];
		$sql = str_replace(array_keys($params), $params, $insert_template);
		$statement = $this->em->getConnection()->prepare( $sql );
		$statement->execute();
		return;
    }
}
