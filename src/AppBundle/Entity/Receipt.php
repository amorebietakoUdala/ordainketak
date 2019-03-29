<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use MiPago\Bundle\Entity\Payment;
use AppBundle\Entity\Activity;
use AppBundle\Entity\GTWIN\ReciboGTWIN;


/**
 * Auditoria
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
    
    public function getId() {
	return $this->id;
    }

    public function getNumeroReferenciaGTWIN() {
	return $this->numeroReferenciaGTWIN;
    }

    public function getConcepto() {
	return $this->concepto;
    }

    public function getNombre() {
	return $this->nombre;
    }

    public function getApellido1() {
	return $this->apellido1;
    }

    public function getApellido2() {
	return $this->apellido2;
    }

    public function getDni() {
	return $this->dni;
    }

    public function getTelefono() {
	return $this->telefono;
    }

    public function getImporte() {
	return $this->importe;
    }

    public function getUltimoDiaPago() {
	return $this->ultimoDiaPago;
    }

    public function getEntidad() {
	return $this->entidad;
    }

    public function getSufijo() {
	return $this->sufijo;
    }

    public function getEmail() {
	return $this->email;
    }

    public function getPayment(): ?Payment {
	return $this->payment;
    }

    public function getTickets() {
	return $this->tickets;
    }

    public function setId($id) {
	$this->id = $id;
    }

    public function setNumeroReferenciaGTWIN($numeroReferenciaGTWIN) {
	$this->numeroReferenciaGTWIN = $numeroReferenciaGTWIN;
    }

    public function setConcepto($concepto) {
	$this->concepto = $concepto;
    }

    public function setNombre($nombre) {
	$this->nombre = $nombre;
    }

    public function setApellido1($apellido1) {
	$this->apellido1 = $apellido1;
    }

    public function setApellido2($apellido2) {
	$this->apellido2 = $apellido2;
    }

    public function setDni($dni) {
	$this->dni = $dni;
    }

    public function setTelefono($telefono) {
	$this->telefono = $telefono;
    }

    public function setImporte($importe) {
	$this->importe = $importe;
    }

    public function setUltimoDiaPago($ultimoDiaPago) {
	$this->ultimoDiaPago = $ultimoDiaPago;
    }

    public function setEntidad($entidad) {
	$this->entidad = $entidad;
	return $this;
    }

    public function setSufijo($sufijo) {
	$this->sufijo = $sufijo;
    }

    public function setEmail($email) {
	$this->email = $email;
    }

    public function setPayment($payment) {
	$this->payment = $payment;
    }

    public function setTickets($tickets) {
	$this->tickets = $tickets;
	return $this;
    }

    public function __toString() {
	return json_encode($this->toArray());
    }
    
    public function toArray() {
	return [
	    'id' => $this->id,
	    'numeroReferenciaGTWIN' => $this->numeroReferenciaGTWIN,
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
    
    public static function createFromGTWINReceipt ( ReciboGTWIN $receiptGTWIN) {
		$receipt = new Receipt();
		$nombreCompleto = $receiptGTWIN->getNombreCompleto();
		$trozos = preg_split("/[\*\,]/", $nombreCompleto);
		$apellido1 = null;
		$apellido2 = null;
		if (sizeof($trozos) === 3 ) {
			$apellido1 = $trozos[0];
			$apellido2 = $trozos[1];
			$nombre = $trozos[2];
		} else {
			$nombre = $trozos[0];
		}
		$receipt->setNumeroReferenciaGTWIN($receiptGTWIN->getNumeroRecibo());
		$receipt->setConcepto($receiptGTWIN->getTipoIngreso()->getDescripcion().': '.$receiptGTWIN->getNumeroReferenciaExterna());
		$receipt->setNombre($nombre);
		$receipt->setApellido1($apellido1);
		$receipt->setApellido2($apellido2);
		$receipt->setDni($receiptGTWIN->getDni().$receiptGTWIN->getLetra());
		$receipt->setTelefono('');
		$receipt->setImporte($receiptGTWIN->getImporteTotal());
		$receipt->setUltimoDiaPago($receiptGTWIN->getFechaFinVoluntaria());
		$receipt->setEntidad(self::INSTITUCIONES[$receiptGTWIN->getCodInstitucion()]);
//		$receipt->setSufijo($receiptGTWIN->getTipoIngreso()->getConceptoC60());
//		dump($receiptGTWIN,$receipt);die;
		return $receipt;
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

