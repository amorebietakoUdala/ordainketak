import Translator from 'bazinga-translator';
const translations = require('../../../public/translations/'+Translator.locale+'.json');

import Swal from 'sweetalert2';

export function showAlert (title, html, confirmationButtonText, cancelButtonText, confirmURL) {
    Swal.fire({
        title: title,
        html: html,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmationButtonText,
    }).then( function (result) {
    if (result.value) {
        console.log(confirmURL);
        document.location.href=confirmURL;
    }
    });
}

export function createAlert(e, confirmURL) {
    Translator.fromJSON(translations);
    var numeroReferenciaGTWIN = $(e.currentTarget).data('numeroreferenciagtwin');
    var concepto = $(e.currentTarget).data('concepto');
    var dni=$(e.currentTarget).data('dni');
    var nombre=$(e.currentTarget).data('nombre');
    var apellido1=$(e.currentTarget).data('apellido1');
    var apellido2=$(e.currentTarget).data('apellido2');
    var importe=$(e.currentTarget).data('importe'); 
    var ultimodiapago=$(e.currentTarget).data('ultimodiapago');
    var html=Translator.trans('receipt.id')+": "+numeroReferenciaGTWIN + '<br/>'
             + Translator.trans('receipt.concepto')+": " + concepto + '<br/>' 
             + Translator.trans('receipt.dni')+": " + dni + '<br/>' 
             + Translator.trans('receipt.nombre')+": " + nombre + '<br/>' 
             + Translator.trans('receipt.apellidos')+": " + apellido1 + ' ' + apellido2 + '<br/>' 
             + Translator.trans('receipt.importe')+": " + importe + '<br/>' 
             + Translator.trans('receipt.ultimoDiaPago')+": " + ultimodiapago + '<br/>';
    showAlert(Translator.trans('confirmation.title'), html, Translator.trans('confirmation.pay'), Translator.trans('confirmation.cancel'), confirmURL);
}

export function createConfirmationAlert(confirmURL) {
    Translator.fromJSON(translations);
    showAlert(
		Translator.trans('messages.confirmacion'), 
		Translator.trans('¿Esta seguro de que desea eliminar el registro?'), 
		Translator.trans('messages.si'), 
		Translator.trans('messages.no'), 
		confirmURL
	);
}