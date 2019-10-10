<?php

namespace App\Entity\GTWIN;

use Doctrine\ORM\Mapping as ORM;
use DateTime;
use JMS\Serializer\Annotation as Serializer;

/**
 * Tipo Ingreso.
 *
 * @ORM\Table(name="SP_TRB_RECIBO")
 * @ORM\Entity(repositoryClass="App\Repository\GTWIN\ReciboGTWINRepository",readOnly=true)
 * @Serializer\ExclusionPolicy("all")
 */
class ReciboGTWIN
{
    public const SITUACION_VOLUNTARIA = 'V';
    public const ESTADO_PENDIENTE = 'P';
    public const ESTADO_COBRADO = 'C';
    /**
     * @var int
     *
     * @ORM\Column(name="RECDBOIDE", type="bigint")
     * @ORM\Id
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="RECNUMREC", type="integer", nullable=false)
     * @Serializer\Expose
     */
    private $numeroRecibo;

    /**
     * @var string
     *
     * @ORM\Column(name="RECCODINS", type="string", nullable=false)
     */
    private $codInstitucion;

    /**
     * @var string
     *
     * @ORM\Column(name="RECREFERE", type="string", nullable=false)
     * @Serializer\Expose
     */
    private $numeroReferenciaExterna;

    /**
     * @var string
     *
     * @ORM\Column(name="RECCLACOB", type="string", nullable=false)
     */
    private $claveCobro;

    /**
     * @var int
     *
     * @ORM\Column(name="RECANYCON", type="integer", nullable=false)
     */
    private $anyoContable;

    /**
     * @var int
     *
     * @ORM\Column(name="RECTIPEXA", type="integer", nullable=false)
     */
    private $tipoExaccion;

    /**
     * @var string
     *
     * @ORM\Column(name="RECCODREM", type="string", length=10, nullable=false)
     */
    private $codigoRemesa;

    /**
     * @var string
     *
     * @ORM\Column(name="RECCUERPO", type="string", nullable=false)
     */
    private $cuerpo;

    /**
     * @var float
     *
     * @ORM\Column(name="RECIMPORT", type="decimal", precision=11, scale=2, nullable=false)
     */
    private $importe;

    /**
     * @var float
     *
     * @ORM\Column(name="RECIMPTOT", type="decimal", precision=11, scale=2, nullable=false)
     * @Serializer\Expose
     */
    private $importeTotal;

    /**
     * @var int
     *
     * @ORM\Column(name="RECNUMFRA", type="integer", nullable=false)
     */
    private $fraccion;

    /**
     * @var string
     *
     * @ORM\Column(name="RECESTADO", type="string", length=1, nullable=false)
     */
    private $estado;

    /**
     * @var string
     *
     * @ORM\Column(name="RECSITUAC", type="string", length=1, nullable=false)
     */
    private $situacion;

    /**
     * @var string
     *
     * @ORM\Column(name="RECINDPAR", type="string", length=1, nullable=false)
     */
    private $paralizado;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="RECFECCRE", type="datetime", nullable=false)
     */
    private $fechaCreacion;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="RECFECINI", type="datetime", nullable=false)
     */
    private $fechaInicioVoluntaria;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="RECFECFIN", type="datetime", nullable=false)
     */
    private $fechaFinVoluntaria;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="RECFECCOB", type="datetime", nullable=false)
     */
    private $fechaCobro;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="RECCOSTAS", type="decimal", precision=11, scale=2, nullable=false)
     */
    private $costas;

    /**
     * @var string
     *
     * @ORM\Column(name="RECDNINIF", type="string", nullable=false)
     */
    private $dni;

    /**
     * @var string
     *
     * @ORM\Column(name="RECCARCON", type="string", nullable=false)
     */
    private $letra;

    /**
     * @var string
     *
     * @ORM\Column(name="RECNOMCOM", type="string", nullable=false)
     */
    private $nombreCompleto;

    /**
     * @var string
     *
     * @ORM\Column(name="RECTRASPA", type="string", nullable=false)
     */
    private $traspasado;

    /**
     * @var string
     *
     * @ORM\Column(name="CUEIBANCO", type="string", length=30, nullable=false)
     */
    private $codigoIBAN;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\GTWIN\TipoIngreso")
     * @ORM\JoinColumn(name="RECTIPING", referencedColumnName="TINDBOIDE")
     */
    private $tipoIngreso;

    public function getId()
    {
        return $this->id;
    }

    public function getNumeroRecibo()
    {
        return $this->numeroRecibo;
    }

    public function getClaveCobro()
    {
        return $this->claveCobro;
    }

    public function getAnyoContable()
    {
        return $this->anyoContable;
    }

    public function getTipoExaccion()
    {
        return $this->tipoExaccion;
    }

    public function getCodigoRemesa()
    {
        return $this->codigoRemesa;
    }

    public function getCuerpo()
    {
        return $this->cuerpo;
    }

    public function getImporte()
    {
        return $this->importe;
    }

    public function getImporteTotal()
    {
        return $this->importeTotal;
    }

    public function getFraccion()
    {
        return $this->fraccion;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getSituacion()
    {
        return $this->situacion;
    }

    public function getParalizado()
    {
        return $this->paralizado;
    }

    public function getFechaCreacion(): DateTime
    {
        return $this->fechaCreacion;
    }

    public function getFechaInicioVoluntaria(): DateTime
    {
        return $this->fechaInicioVoluntaria;
    }

    public function getFechaFinVoluntaria(): DateTime
    {
        return $this->fechaFinVoluntaria;
    }

    public function getFechaCobro(): DateTime
    {
        return $this->fechaCobro;
    }

    public function getCostas(): DateTime
    {
        return $this->costas;
    }

    public function getNombreCompleto()
    {
        return $this->nombreCompleto;
    }

    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    public function setNumeroRecibo($numeroRecibo)
    {
        $this->numeroRecibo = $numeroRecibo;

        return $this;
    }

    public function setClaveCobro($claveCobro)
    {
        $this->claveCobro = $claveCobro;

        return $this;
    }

    public function setAnyoContable($anyoContable)
    {
        $this->anyoContable = $anyoContable;

        return $this;
    }

    public function setTipoExaccion($tipoExaccion)
    {
        $this->tipoExaccion = $tipoExaccion;

        return $this;
    }

    public function setCodigoRemesa($codigoRemesa)
    {
        $this->codigoRemesa = $codigoRemesa;

        return $this;
    }

    public function setCuerpo($cuerpo)
    {
        $check = mb_check_encoding($cuerpo, 'UTF-8');
        if ($check) {
            $this->cuerpo = mb_convert_encoding($cuerpo, 'ISO-8859-1', 'UTF-8');
        }

        $this->cuerpo = $cuerpo;

        return $this;
    }

    public function setImporte($importe)
    {
        $this->importe = $importe;

        return $this;
    }

    public function setImporteTotal($importeTotal)
    {
        $this->importeTotal = $importeTotal;

        return $this;
    }

    public function setFraccion($fraccion)
    {
        $this->fraccion = $fraccion;

        return $this;
    }

    public function setEstado($estado)
    {
        $this->estado = $estado;

        return $this;
    }

    public function setSituacion($situacion)
    {
        $this->situacion = $situacion;

        return $this;
    }

    public function setParalizado($paralizado)
    {
        $this->paralizado = $paralizado;

        return $this;
    }

    public function setFechaCreacion(DateTime $fechaCreacion)
    {
        $this->fechaCreacion = $fechaCreacion;

        return $this;
    }

    public function setFechaInicioVoluntaria(DateTime $fechaInicioVoluntaria)
    {
        $this->fechaInicioVoluntaria = $fechaInicioVoluntaria;

        return $this;
    }

    public function setFechaFinVoluntaria(DateTime $fechaFinVoluntaria)
    {
        $this->fechaFinVoluntaria = $fechaFinVoluntaria;

        return $this;
    }

    public function setFechaCobro(DateTime $fechaCobro)
    {
        $this->fechaCobro = $fechaCobro;

        return $this;
    }

    public function setCostas(DateTime $costas)
    {
        $this->costas = $costas;

        return $this;
    }

    public function setNombreCompleto($nombreCompleto)
    {
        $this->nombreCompleto = $nombreCompleto;

        return $this;
    }

    public function getTipoIngreso(): ?TipoIngreso
    {
        return $this->tipoIngreso;
    }

    public function setTipoIngreso(TipoIngreso $tipoIngreso = null)
    {
        $this->tipoIngreso = $tipoIngreso;

        return $this;
    }

    public function getNumeroReferenciaExterna()
    {
        return $this->numeroReferenciaExterna;
    }

    public function setNumeroReferenciaExterna($numeroReferenciaExterna)
    {
        $this->numeroReferenciaExterna = $numeroReferenciaExterna;

        return $this;
    }

    public function getDni()
    {
        return $this->dni;
    }

    public function getLetra()
    {
        return $this->letra;
    }

    public function setDni($dni)
    {
        $this->dni = $dni;

        return $this;
    }

    public function setLetra($letra)
    {
        $this->letra = $letra;

        return $this;
    }

    public function getCodInstitucion()
    {
        return $this->codInstitucion;
    }

    public function setCodInstitucion($codInstitucion)
    {
        $this->codInstitucion = $codInstitucion;

        return $this;
    }

    public function getTraspasado()
    {
        return $this->traspasado;
    }

    public function setTraspasado($traspasado)
    {
        $this->traspasado = $traspasado;

        return $this;
    }

    public function getCodigoIBAN()
    {
        return $this->codigoIBAN;
    }

    public function setCodigoIBAN($codigoIBAN)
    {
        $this->codigoIBAN = $codigoIBAN;

        return $this;
    }

    public function estaParalizado()
    {
        return 'T' === $this->getParalizado();
    }

    public function estaTraspasado()
    {
        return 'T' === $this->getTraspasado();
    }

    public function estaDomiciliado()
    {
        return null !== $this->getCodigoIBAN();
    }

    public function periodoPagoVoluntarioVencido()
    {
        $fechaVencimiento = clone $this->fechaFinVoluntaria;
        if ($fechaVencimiento->modify('+1 day') < new \DateTime()) {
            return true;
        }

        return false;
    }

    public function __toString()
    {
        return ''.$this->$numeroRecibo;
    }

    public function esPagable()
    {
        return empty($this->comprobarCondicionesPago());
    }

    public function comprobarCondicionesPago()
    {
        $errores = [];
        if ($this->periodoPagoVoluntarioVencido()) {
            $errores[] = 'El periodo de pago voluntario vencido.';
        }
        if ($this->estaParalizado()) {
            $errores[] = 'El recibo está paralizado.';
        }
        if ($this->estaTraspasado()) {
            $errores[] = 'El recibo está traspasado.';
        }
        if ($this->estaDomiciliado()) {
            $errores[] = 'El recibo está domiciliado.';
        }
        if (null !== $this->tipoIngreso && $this->tipoIngreso->esPlanPlago()) {
            $errores[] = 'El recibo es un plan de pago.';
        }

        return $errores;
    }
}
