<?php

namespace AppBundle\Entity\API;

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
        $this->data = $data;
    }
}
