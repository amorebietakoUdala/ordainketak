<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use MiPago\Bundle\Entity\Payment;
use AppBundle\Entity\GTWIN\ReciboGTWIN;

/**
 * Auditoria.
 *
 * @ORM\Table(name="Receipts")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ReceiptRepository")
 */
class Receipt
{
    const INSTITUCIONES = [
    'AMOREBIE' => '480034',
    'AMETX' => '481166',
    ];
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="numero_referencia_gtwin", type="integer", nullable=true)
     */
    private $numeroReferenciaGTWIN;

    /**
     * @var int
     *
     * @ORM\Column(name="fraccion", type="integer", nullable=true)
     */
    private $fraccion;

    /**
     * @var string
     *
     * @ORM\Column(name="concepto", type="string", length=255, nullable=true)
     */
    private $concepto;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre", type="string", length=255, nullable=true)
     */
    private $nombre;

    /**
     * @var string
     *
     * @ORM\Column(name="apellido1", type="string", length=255, nullable=true)
     */
    private $apellido1;

    /**
     * @var string
     *
     * @ORM\Column(name="apellido2", type="string", length=255, nullable=true)
     */
    private $apellido2;

    /**
     * @var string
     *
     * @ORM\Column(name="dni", type="string", length=15, nullable=true)
     */
    private $dni;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255, nullable=true)
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(name="telefono", type="string", length=20, nullable=true)
     */
    private $telefono;

    /**
     * @var float
     *
     * @ORM\Column(name="importe", type="decimal", precision=6, scale=2, nullable=true )
     */
    private $importe;

    /**
     * @ORM\Column(name="ultimo_dia_pago", type="datetime", nullable=true)
     */
    private $ultimoDiaPago;

    /**
     * @var string
     *
     * @ORM\Column(name="entidad", type="string", length=6, nullable=true)
     */
    private $entidad;

    /**
     * @var string
     *
     * @ORM\Column(name="sufijo", type="string", length=3, nullable=true)
     */
    private $sufijo;

    /**
     * @var string
     *
     * @ORM\Column(name="concepto_renta", type="string", length=3, nullable=true)
     */
    private $conceptoRenta;

    /**
     * @var string
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\BuyTickets", cascade={"persist", "remove"})
     * @ORM\JoinColumn(name="tickets_id", referencedColumnName="id", nullable=true)
     */
    private $tickets;

    /**
     * @var string
     *
     * @ORM\OneToOne(targetEntity="MiPago\Bundle\Entity\Payment")
     * @ORM\JoinColumn(name="payment_id", referencedColumnName="id", nullable=true)
     */
    private $payment;

//    public function __construct($inscription = null) {
    //	$instance = new self();
    //	if ( $inscription != null ) {
    //	    $instance->setDni($inscription->getDni());
    //	    $instance->setNombre($inscription->getNombre());
    //	    $instance->setApellido1($inscription->setApellido1());
    //	    $instance->setApellido2($inscription->setApellido2());
    //	    $instance->setEmail($inscription->setEmail());
    //	    $instance->setTelefono($inscription->setTelefono());
    //	}
    //	return $instance;
//    }

    public function getId()
    {
        return $this->id;
    }

    public function getNumeroReferenciaGTWIN()
    {
        return $this->numeroReferenciaGTWIN;
    }

    public function getConcepto()
    {
        return $this->concepto;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getApellido1()
    {
        return $this->apellido1;
    }

    public function getApellido2()
    {
        return $this->apellido2;
    }

    public function getDni()
    {
        return $this->dni;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getImporte()
    {
        return $this->importe;
    }

    public function getUltimoDiaPago()
    {
        return $this->ultimoDiaPago;
    }

    public function getEntidad()
    {
        return $this->entidad;
    }

    public function getSufijo()
    {
        return $this->sufijo;
    }

    public function getConceptoRenta()
    {
        return $this->conceptoRenta;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getPayment(): ?Payment
    {
        return $this->payment;
    }

    public function getTickets()
    {
        return $this->tickets;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function setNumeroReferenciaGTWIN($numeroReferenciaGTWIN)
    {
        $this->numeroReferenciaGTWIN = $numeroReferenciaGTWIN;

        return $this;
    }

    public function setConcepto($concepto)
    {
        $this->concepto = $concepto;

        return $this;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function setApellido1($apellido1)
    {
        $this->apellido1 = $apellido1;

        return $this;
    }

    public function setApellido2($apellido2)
    {
        $this->apellido2 = $apellido2;

        return $this;
    }

    public function setDni($dni)
    {
        $this->dni = $dni;

        return $this;
    }

    public function setTelefono($telefono)
    {
        $this->telefono = $telefono;

        return $this;
    }

    public function setImporte($importe)
    {
        $this->importe = $importe;

        return $this;
    }

    public function setUltimoDiaPago($ultimoDiaPago)
    {
        $this->ultimoDiaPago = $ultimoDiaPago;

        return $this;
    }

    public function setEntidad($entidad)
    {
        $this->entidad = $entidad;

        return $this;
    }

    public function setSufijo($sufijo)
    {
        $this->sufijo = $sufijo;

        return $this;
    }

    public function setConceptoRenta($conceptoRenta)
    {
        $this->conceptoRenta = $conceptoRenta;

        return $this;
    }

    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    public function setPayment($payment)
    {
        $this->payment = $payment;

        return $this;
    }

    public function setTickets($tickets)
    {
        $this->tickets = $tickets;

        return $this;
    }

    public function getFraccion()
    {
        return $this->fraccion;
    }

    public function setFraccion($fraccion = 0)
    {
        $this->fraccion = $fraccion;

        return $this;
    }

    public function __toString()
    {
        return json_encode($this->toArray());
    }

    public function toArray()
    {
        return [
        'id' => $this->id,
        'numeroReferenciaGTWIN' => $this->numeroReferenciaGTWIN,
        'fraccion' => $this->fraccion,
        'concepto' => $this->concepto,
        'nombre' => $this->nombre,
        'apellido1' => $this->apellido1,
        'apellido2' => $this->apellido2,
        'dni' => $this->dni,
        'email' => $this->email,
        'telefono' => $this->telefono,
        'importe' => $this->importe,
        'entidad' => $this->entidad,
        'sufijo' => $this->sufijo,
        'ultimoDiaPago' => $this->ultimoDiaPago,
    ];
    }

    public static function createFromGTWINReceipt(ReciboGTWIN $receiptGTWIN)
    {
        $receipt = new self();
        $nombreCompleto = $receiptGTWIN->getNombreCompleto();
        $trozos = preg_split("/[\*\,]/", $nombreCompleto);
        $apellido1 = null;
        $apellido2 = null;
        if (3 === sizeof($trozos)) {
            $apellido1 = $trozos[0];
            $apellido2 = $trozos[1];
            $nombre = $trozos[2];
        } else {
            $nombre = $trozos[0];
        }
        $receipt->setNumeroReferenciaGTWIN($receiptGTWIN->getNumeroRecibo());
        $receipt->setFraccion($receiptGTWIN->getFraccion());
        $concepto = $receiptGTWIN->getTipoIngreso()->getDescripcion().': '.$receiptGTWIN->getNumeroReferenciaExterna();
        $receipt->setConcepto($concepto);
        $receipt->setNombre($nombre);
        $receipt->setApellido1($apellido1);
        $receipt->setApellido2($apellido2);
        $receipt->setDni($receiptGTWIN->getDni().$receiptGTWIN->getLetra());
        $receipt->setTelefono('');
        $receipt->setImporte($receiptGTWIN->getImporteTotal());
        $receipt->setUltimoDiaPago($receiptGTWIN->getFechaFinVoluntaria());
        $receipt->setEntidad(self::INSTITUCIONES[$receiptGTWIN->getCodInstitucion()]);
        $tipoIngreso = $receiptGTWIN->getTipoIngreso();
        $tipoExaccion = $receiptGTWIN->getTipoExaccion();
        if ('AU' === $tipoExaccion || null === $tipoExaccion) {
            $sufijo = $tipoIngreso->getConceptoC60AU();
        } elseif ('ID' === $tipoExaccion) {
            $sufijo = $tipoIngreso->getConceptoC60ID();
        } elseif ('SC' === $tipoExaccion) {
            $sufijo = $tipoIngreso->getConceptoC60SC();
        } else {
            $sufijo = $tipoIngreso->getConceptoC60();
        }
        $receipt->setSufijo($sufijo);

        return $receipt;
    }

    private function __fixEncoding($string)
    {
        $check = mb_check_encoding($string, 'ISO-8859-1');
        if ($check) {
            return mb_convert_encoding($string, 'UTF-8', 'ISO-8859-1');
        }

        return $string;
    }

    //	private static function __splitFullName ($nombreCompleto) {
//		$trozos = preg_split("/[\*\,]/", $nombreCompleto);
//		$apellido1 = null;
//		$apellido2 = null;
//		if (sizeof($trozos) === 3 ) {
//			$apellido1 = $trozos[0];
//			$apellido2 = $trozos[1];
//			$nombre = $trozos[2];
//		} else {
//			$nombre = $trozos[0];
//		}
//		return [
//			'nombre' => $nombre,
//			'apellido1' => $apellido1,
//			'apellido2' => $apellido2,
//		];
//	}
}
