<?php

namespace App\Entity\API;

use App\Entity\GTWIN\ReciboGTWIN;

/**
 * This class holds the ApiResponse when.
 *
 * @author ibilbao
 */
class ApiResponse
{
    private $status = null;
    private $message = null;
    private $data = null;

    public function __construct($status, $message, $data)
    {
        $this->status = $status;
        $this->message = $message;
        $this->data = $this->convertEncodingToUTF8($data);
    }

    private function convertEncodingToUTF8($data)
    {
        if (is_array($data)) {
            foreach ($data as $element) {
                if ($element instanceof ReciboGTWIN) {
                    /* @var $element ReciboGTWIN */
                    $element->setNumeroReferenciaExterna(mb_convert_encoding($element->getNumeroReferenciaExterna(), 'UTF-8'));
                    $element->setNombreCompleto(mb_convert_encoding($element->getNombreCompleto(), 'UTF-8'));
                    $element->getTipoIngreso()->setDescripcion(mb_convert_encoding($element->getTipoIngreso()->getDescripcion(), 'UTF-8'));
                }
            }
        }

        return $data;
    }
}
