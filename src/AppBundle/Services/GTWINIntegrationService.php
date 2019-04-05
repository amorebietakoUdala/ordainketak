<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Services;

use AppBundle\Entity\GTWIN\ReciboGTWIN;
use AppBundle\Entity\GTWIN\TipoIngreso;
use AppBundle\Entity\GTWIN\OperacionesExternas;
use AppBundle\Entity\Receipt;
use DateTime;
use Doctrine\ORM\EntityManager;
use Psr\Log\LoggerInterface;
use AppBundle\Utils\Validaciones;

/**
 * Description of MiPagoConstants.
 *
 * @author ibilbao
 */
class GTWINIntegrationService
{
    const INSTITUCIONES = [
    '480034' => 'AMOREBIE',
    '481166' => 'AMETX',
    ];

    private $em = null;
    private $logger = null;

    public function __construct(EntityManager $em, LoggerInterface $logger)
    {
        $this->em = $em;
        $this->logger = $logger;
    }

    public function findByNumReciboDni($numRecibo, $dni)
    {
        $em = $this->em;
        $numero = substr($dni, 0, -1);
        $letra = substr($dni, -1);
        $numero = $this->__fixDniNumber($numero);
        $reciboGTWIN = $em->getRepository(ReciboGTWIN::class)->findByNumReciboDni($numRecibo, $numero, $letra);

        return $reciboGTWIN;
    }

    private function __fixDniNumber($numero)
    {
        if (is_numeric($numero)) {
            $numero = str_pad($numero, 9, '0', STR_PAD_LEFT);
        }

        return $numero;
    }

    public function paidWithCreditCard($numRecibo, $fraccion, $importe, $timestamp, $registeredPaymentId)
    {
        $insert_template = 'INSERT INTO EXTCALL (DBOID, ACTIONCODE, INPUTPARS, OUTPUTPARS, OUTPARSMEMO, CALLTYPE, NUMRETRIES, QUEUE, PRIORITY, CALLSTATUS, CALLTIME, PROCTIME, CONFTIME, ORIGINOBJ, DESTOBJ, USERBW, MSGERROR, URLOK, URLOKPARAM, CONFSTATUS) VALUES '.
                                   "('{DBOID}','OPERACION_PAGO_TAR','<NUMREC>{NUMREC}</NUMREC><NUMFRA>{NUMFRA}</NUMFRA><FECOPE>{FECOPE}</FECOPE><IMPORT>{IMPORT}</IMPORT><RECARG>0</RECARG><INTERE>0</INTERE><COSTAS>0</COSTAS><CAJCOB>9</CAJCOB><NUMAUT>{NUMAUT}</NUMAUT><USERBW>{USERBW}</USERBW>',null, null,0,0,0,0,0,TO_DATE('{CALLTIME}','DD/MM/YYYY HH24:MI:SS'),TO_DATE('{PROCTIME}','DD/MM/YYYY HH24:MI:SS'),null,null,null,'{USERBW}',null,null,null,0)";
        $time_start = substr(''.floatval(microtime(true)) * 10000, 0, 12);
        $dboid = str_pad('1235'.$time_start, 21, '0', STR_PAD_RIGHT);
        $now = new DateTime();

        $params = [
            '{DBOID}' => $dboid,
            '{NUMREC}' => $numRecibo,
            '{NUMFRA}' => $fraccion,
            '{FECOPE}' => $timestamp->format('d/m/Y H:i:s'),
            '{IMPORT}' => $importe,
            '{NUMAUT}' => $registeredPaymentId,
            '{CALLTIME}' => $now->format('d/m/Y H:i:s'),
            '{PROCTIME}' => $now->format('d/m/Y H:i:s'),
            '{USERBW}' => 'INT',
        ];
        $sql = str_replace(array_keys($params), $params, $insert_template);
        $statement = $this->em->getConnection()->prepare($sql);

        return $statement->execute();
    }

    /**
     * Crear Recibo en GTWIN con los datos de ordaindu.
     *
     * @abstract
     *
     * @param Receipt $receipt Recibo de ordaindu
     *
     * @return ReciboGTWIN|null
     *
     * @throws Exception Si la operaciónExterna devuelve un error
     */
    public function createReciboOpt(Receipt $receipt): ?ReciboGTWIN
    {
        $tipoIngreso = $this->em->getRepository(TipoIngreso::class)->findOneBy([
            'conceptoC60' => $receipt->getSufijo(),
        ]);
        $inputparams = $this->createReciboParams(
            $receipt->getId(),
            $receipt->getId(),
            $tipoIngreso->getCodigo(),
            self::INSTITUCIONES[$receipt->getEntidad()],
            $receipt->getApellido1().'*'.$receipt->getApellido2().','.$receipt->getNombre(),
            substr($receipt->getDni(), 0, -1),
            substr($receipt->getDni(), -1),
            (Validaciones::validar_dni($receipt->getDni()) ? 'ES' : 'EX'),
            str_pad($receipt->getImporte(), '80', ' ', STR_PAD_RIGHT).str_pad($receipt->getConcepto(), '80', ' ', STR_PAD_RIGHT),
            $tipoIngreso->getTipoDefecto(),
            'P',
            'V',
            'F',
            $receipt->getConceptoRenta(),
            $receipt->getImporte());

        $dboid = $this->__insertExternalOperation('CREA_RECIBO', $inputparams);
        $operacionExterna = $this->__waitUntilProcessed($dboid);
        $result = null;
        if ($operacionExterna->procesadaOk()) {
            $em = $this->em;
            $result = $em->getRepository(ReciboGTWIN::class)->findOneBy(['numeroReferenciaExterna' => $receipt->getId()]);
        } else {
            throw new \Exception($operacionExterna->getMensajeError()->getDescripcion());
        }

        return $result;
    }

    public function createReciboParams($numRecibo, $reference, $codtin, $codins, $nomcom, $dninif, $carcon, $sigpai, $cuerpo, $tipexa, $estado, $situacion, $indpar = 'F', $codcon = '107', $importe)
    {
        $createReciboParamsTemplate = '
			<CODTIN>{CODTIN}</CODTIN>
			<CODINS>{CODINS}</CODINS>
			<REFERE>{REFERE}</REFERE>
			<FECCRE>{FECCRE}</FECCRE>
			<FECINI>{FECINI}</FECINI>
			<FECFIN>{FECFIN}</FECFIN>
			<NOMCOM>{NOMCOM}</NOMCOM>
			<DNINIF>{DNINIF}</DNINIF>
			<CARCON>{CARCON}</CARCON>
			<SIGPAI>{SIGPAI}</SIGPAI>
			<CUERPO>{CUERPO}</CUERPO>
			<TIPEXA>{TIPEXA}</TIPEXA>
			<ESTADO>{ESTADO}</ESTADO>
			<SITUAC>{SITUAC}</SITUAC>
			<INDPAR>{INDPAR}</INDPAR>
			<linea>
				<CODCON>{CODCON}</CODCON>
				<IMPORT>{IMPORT}</IMPORT>
			</linea>';
        $now = new DateTime();
        $params = [
            '{NUMREC}' => $numRecibo,
            '{CODTIN}' => $codtin,
            '{CODINS}' => $codins,
            '{NUMFRA}' => '0',
            '{REFERE}' => $reference,
            '{FECCRE}' => $now->format('d/m/Y H:i:s'),
            '{FECINI}' => $now->format('d/m/Y H:i:s'),
            '{FECFIN}' => $now->format('d/m/Y H:i:s'),
            '{NOMCOM}' => $nomcom,
            '{DNINIF}' => $dninif,
            '{CARCON}' => $carcon,
            '{SIGPAI}' => $sigpai,
            '{CUERPO}' => $cuerpo,
            '{TIPEXA}' => $tipexa,
            '{ESTADO}' => $estado,
            '{SITUAC}' => $situacion,
            '{INDPAR}' => $indpar,
            '{CODCON}' => $codcon,
            '{IMPORT}' => $importe,
        ];
        $params_string = str_replace(array_keys($params), $params, $createReciboParamsTemplate);

        return $params_string;
    }

    private function __insertExternalOperation($operation, $inputparams)
    {
        $time_start = substr(''.floatval(microtime(true)) * 10000, 0, 12);
        $dboid = str_pad('1235'.$time_start, 21, '0', STR_PAD_RIGHT);
        $now = new DateTime();
        $insert_template = "INSERT INTO EXTCALL (DBOID, ACTIONCODE, INPUTPARS, OUTPUTPARS, OUTPARSMEMO, CALLTYPE, NUMRETRIES, QUEUE, PRIORITY, CALLSTATUS, CALLTIME, PROCTIME, CONFTIME, ORIGINOBJ, DESTOBJ, USERBW, MSGERROR, URLOK, URLOKPARAM, CONFSTATUS) VALUES ('{DBOID}','{OPERATION}','{INPUTPARAMS}',null, null,0,0,0,0,0,TO_DATE('{CALLTIME}','DD/MM/YYYY HH24:MI:SS'),TO_DATE('{PROCTIME}','DD/MM/YYYY HH24:MI:SS'),null,null,null,'{USERBW}',null,null,null,0)";
        $params = [
            '{DBOID}' => $dboid,
            '{OPERATION}' => $operation,
            '{INPUTPARAMS}' => $inputparams,
            '{CALLTIME}' => $now->format('d/m/Y H:i:s'),
            '{PROCTIME}' => $now->format('d/m/Y H:i:s'),
            '{USERBW}' => 'INT',
        ];
        $sql = str_replace(array_keys($params), $params, $insert_template);
        $statement = $this->em->getConnection()->prepare($sql);
        $statement->execute();

        return $dboid;
    }

    private function __waitUntilProcessed($dboid)
    {
        $em = $this->em;
        $operationExterna = $em->getRepository(OperacionesExternas::class)->find($dboid);
        $status = $operationExterna->getEstado();
        $retries = 0;
        while (0 === $status && $retries < 5) {
            sleep(7);
            // Borrar la caché para que vuelva a forzar la lectura de base de datos
            $em->clear();
            $operationExterna = $em->getRepository(OperacionesExternas::class)->find($dboid);
            $status = $operationExterna->getEstado();
            ++$retries;
        }

        return $operationExterna;
    }
}
