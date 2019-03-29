<?php

namespace AppBundle\Entity\GTWIN;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tipo Ingreso
 *
 * @ORM\Table(name="SP_TRB_TIPING")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TipoIngresoRepository",readOnly=true)
 */
class TipoIngreso
{
    /**
     * @var integer
     *
     * @ORM\Column(name="TINDBOIDE", type="bigint", nullable=false)
     * @ORM\Id
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="TINCODTIN", type="string", nullable=false)
     */
    private $codigo;

    /**
     * @var string
     *
     * @ORM\Column(name="TINNOMTIN", type="string", nullable=false)
     */
    private $descripcion;

    /**
     * @var string
     *
     * @ORM\Column(name="TINDEFECT", type="string", nullable=false)
     */
    private $tipoDefecto;

    /**
     * @var string
     *
     * @ORM\Column(name="TINCC60ID", type="string", nullable=false)
     */
    private $conceptoC60ID;

    /**
     * @var string
     *
     * @ORM\Column(name="TINCC60AU", type="string", nullable=false)
     */
    private $conceptoC60AU;

    /**
     * @var string
     *
     * @ORM\Column(name="TINCC60SC", type="string", nullable=false)
     */
    private $conceptoC60SC;

    /**
     * @var string
     *
     * @ORM\Column(name="TINCODO60", type="string", nullable=false)
     */
    private $conceptoC60;

    public function __toString() {
	return $this->nombre;
    }
    
    public function getId() {
	return $this->id;
    }

    public function getNombre() {
	return $this->nombre;
    }

    public function getDescripcion() {
	return $this->descripcion;
    }

    public function setId($id) {
	$this->id = $id;
	return $this;
    }

    public function setNombre($nombre) {
	$this->nombre = $nombre;
	return $this;
    }

    public function setDescripcion($descripcion) {
	$this->descripcion = $descripcion;
	return $this;
    }

    public function getTipoDefecto() {
	return $this->tipoDefecto;
    }

    public function getConceptoC60ID() {
	return $this->conceptoC60ID;
    }

    public function getConceptoC60AU() {
	return $this->conceptoC60AU;
    }

    public function getConceptoC60SC() {
	return $this->conceptoC60SC;
    }

    public function getConceptoC60() {
	return $this->conceptoC60;
    }

    public function setTipoDefecto($tipoDefecto) {
	$this->tipoDefecto = $tipoDefecto;
	return $this;
    }

    public function setConceptoC60ID($conceptoC60ID) {
	$this->conceptoC60ID = $conceptoC60ID;
	return $this;
    }

    public function setConceptoC60AU($conceptoC60AU) {
	$this->conceptoC60AU = $conceptoC60AU;
	return $this;
    }

    public function setConceptoC60SC($conceptoC60SC) {
	$this->conceptoC60SC = $conceptoC60SC;
	return $this;
    }

    public function setConceptoC60($conceptoC60) {
	$this->conceptoC60 = $conceptoC60;
	return $this;
    }

}

