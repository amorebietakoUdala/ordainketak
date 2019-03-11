<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Receipt;
use AppBundle\Forms\ReceiptUploadTypeForm;
use League\Csv\Reader;
use League\Csv\Statement;
use League\Csv\CharsetConverter;
use League\Csv\ByteSequence;
use SplFileObject;
use Exception;

    /**
     * @Route("/{_locale}/admin", requirements={
     *	    "_locale": "es|eu"
     * })
     */
class AdminController extends Controller
{
    /**
     * @Route("/receiptUpload", name="admin_receipt_upload", requirements={
     *	    "_locale": "es|eu"
     * })
     */
    public function receiptsUploadAction(Request $request, LoggerInterface $logger)
    {
	$logger->debug('-->receiptsUploadAction: Start');
//	$user = $this->get('security.token_storage')->getToken()->getUser();
	$form = $this->createForm(ReceiptUploadTypeForm::class, null, [
//	    'editatzen' => false,
//	    'role' => $user->getRoles(),
//    	    'locale' => $request->getLocale(),
	]);
	$form->handleRequest($request);
	if ( $form->isSubmitted() && $form->isValid() ) {
	    try {
		$em = $this->getDoctrine()->getManager();
		$file = $form['file']->getData();
		$extension = $file->guessExtension();
		$date = new \DateTime();
		$dateStr = $date->format('Ymdhis');
		$filename = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file->getClientOriginalName());
		if (!$extension) {
		    // extension cannot be guessed
		    $extension = 'bin';
		}
		$directory = $this->getParameter('uploads_directory');
		$reader = Reader::createFromPath($file, 'r');
		$reader->setDelimiter(',');
		$reader->setHeaderOffset(0);
		$records = $reader->getRecords();
		foreach ($records as $record) {
		    $receipt = new Receipt();
		    $receipt->setNumeroReferencia($record['ID.INSCRIPCIÓN']);
//		    $receipt->setConcepto($record['CONCEPTO']);
		    if (!array_key_exists('CONCEPTO', $record) ) {
			$receipt->setConcepto($record['NOM.CURSO']." P:".$record['NUM.PERIODO']);
		    } else {
			$receipt->setConcepto($record['CONCEPTO']);
		    }
		    $receipt->setNombre($record['NOMBRE']);
		    $receipt->setApellido1($record['APELLIDO1']);
		    $receipt->setApellido2($record['APELLIDO2']);
		    $receipt->setDni($record['DNI']);
		    $receipt->setEmail($record['EMAIL']);
		    $receipt->setTelefono($record['TELEFONO']);
		    $receipt->setImporte($record['IMPORTE']);
		    $receipt->setEntidad($record['ENTIDAD']);
		    $receipt->setSufijo($record['SUFIJO']);
		    $receipt->setUltimoDiaPago(\DateTime::createFromFormat('Ymd H:i:s',$record['ULTIMODIAPAGO']." 23:59:59"));
		    $em->persist($receipt);
		}
		$em->flush();
		$this->addFlash('success','message.file_successfully_processed');
		$message='';
		} catch (\Exception $e ) {
		    $this->addFlash('error','there was an error procesing file %message%');
		    $message=$e->getMessage();
		}
		$file->move($directory, $dateStr.'-'.$filename.'.'.$extension);
		$logger->debug('<--receiptsUploadAction: POST End');
		return $this->render('receipt/upload.html.twig', [
		    'form' => $form->createView(),
		    'message' => $message,

		]);
	}
	$logger->debug('<--receiptsUploadAction: GET End OK');
	return $this->render('receipt/upload.html.twig', [
	    'form' => $form->createView(),
	]);
	
	
    }

    

    private function __remove_blank_filters ($criteria) {
	$new_criteria = [];
	foreach ($criteria as $key => $value) {
	    if (!empty($value))
		$new_criteria[$key] = $value;
	}
	return $new_criteria;
    }
}
