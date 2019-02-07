<?php

require_once 'vendor/autoload.php';

use GuzzleHttp\Client;

$client = new Client([
    // Base URI is used with relative requests
    'base_uri' => 'http://192.168.18.115:8000',
    // You can set any number of default request options.
    'timeout'  => 2.0,
]);

$promise = $client->request('POST','/es/receiptConfirmation', [
    'form_params' => [
	'reference_number' => trim('88195041'),
	'status' => trim('73142347'),
	'payment_id' => trim(4)
    ]
]);

var_dump($promise->getState());
