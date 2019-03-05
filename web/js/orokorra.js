$(document).ready(function(){
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
	url: "http://garapenak/ordainketak/app_dev.php/api/activity/",
	context: document.body
    }).done(function(data){
	for (i=0; i<data.length; i++) {
	    var path = Routing.generate('buyTickets_activity', { activity: data[i].id } );
	    var item = data[i].name;
	    $("#js-menu-pagos").append('<a class="dropdown-item" href="'+path+'">'+item+'</a>');
	}
    });
});
