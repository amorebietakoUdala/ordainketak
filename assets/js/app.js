import '../css/app.scss';

import $ from 'jquery';
import 'bootstrap';
import 'popper.js';

const app_base = '/ordainketak';
const routes = require('../../public/js/fos_js_routes.json');
import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js'

$(document).ready(function(){
	// Parece que no funciona la opción de base_url del JSRoutingBundle.
    Routing.setRoutingData(routes);
    $('#js-locale-es').on('click',function (e) {
		e.preventDefault();
		var current_locale = $('html').attr("lang");
		if ( current_locale === 'es') {
			return;
		}
		var location = window.location.href;
		var location_new = location.replace("/eu/","/es/");
		window.location.href=location_new;
    });
    $('#js-locale-eu').on('click',function (e) {
		e.preventDefault();
		var current_locale = $('html').attr("lang");
		if ( current_locale === 'eu') {
			return;
		}
		var location = window.location.href;
		var location_new = location.replace("/es/","/eu/");
		window.location.href=location_new;
    });
    $.ajax({
		url: app_base + Routing.generate('app_rest_getactivities'),
		context: document.body
		}).done(function(data){
		var app_base_url = 'ordainketak/';
		var current_locale = $('html').attr("lang");
		var i;
		for (i=0; i<data.length; i++) {
			var path = app_base + Routing.generate('buyTickets_activity', { activity: data[i].id, _locale: current_locale  } );
			var item = null;
			if ( current_locale === 'es') {
			item = data[i].name;
			} else {
			item = data[i].name_eu;
			}
			$("#js-menu-pagos").append('<a class="dropdown-item" href="'+path+'">'+item+'</a>');
		}
    });
});
