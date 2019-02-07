<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use MiPago\Bundle\Entity\Payment;


/**
 * Auditoria
 *
 * @ORM\Table(name="Receipts")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ReceiptRepository")
 */
class Receipt
{
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
     * @ORM\Column(name="numero_referencia", type="integer")
     */
    private $numeroReferencia;

    /**
     * @var string
     *
     * @ORM\Column(name="concepto", type="string", length=255)
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
     * @ORM\Column(name="importe", type="decimal", precision=6, scale=2 )
     */
    private $importe;

    /**
     * @ORM\Column(name="ultimo_dia_pago", type="datetime", nullable=true)
    */
    private $ultimoDiaPago;
    
    /**
     * @var string
     *
     * @ORM\Column(name="sufijo", type="string", length=3, nullable=true)
     */
    private $sufijo;
    
    /**
     * @var string
     *
     * @ORM\OneToOne(targetEntity="MiPago\Bundle\Entity\Payment")
     * @ORM\JoinColumn(name="payment_id", referencedColumnName="id", nullable=true)
     */
    private $payment;
    
    public function getId() {
	return $this->id;
    }

    public function getNumeroReferencia() {
	return $this->numeroReferencia;
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

        public function getSufijo() {
	return $this->sufijo;
    }

    public function getEmail() {
	return $this->email;
    }

    public function getPayment() {
	return $this->payment;
    }

    public function setNumeroReferencia($numeroReferencia) {
	$this->numeroReferencia = $numeroReferencia;
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

    public function setSufijo($sufijo) {
	$this->sufijo = $sufijo;
    }

    public function setEmail($email) {
	$this->email = $email;
    }

    public function setPayment($payment) {
	$this->payment = $payment;
    }

    public function __toString() {
	return json_encode($this->toArray());
    }
    
    public function toArray() {
	return [
	    'id' => $this->id,
	    'numeroReferencia' => $this->numeroReferencia,
	    'concepto' => $this->concepto,
	    'nombre' => $this->nombre,
	    'apellido1' => $this->apellido1,
	    'apellido2' => $this->apellido2,
	    'dni' => $this->dni,
	    'nombre' => $this->nombre,
	    'telefono' => $this->telefono,
	    'importe' => $this->importe,
	    'sufijo' => $this->sufijo,
	    'ultimoDiaPago' => $this->ultimoDiaPago,
	];
    }
}

