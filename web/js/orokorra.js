$(document).ready(function(){
    $('#js-locale-es').on('click',function (e) {
	e.preventDefault();
	var location = window.location.href;
	var location_new = location.replace("/eu/","/es/");
	if (location_new !== location) {
	    window.location.href=location_new;
	} else {
	    var arr = location.split("/");
	    location_new = arr[0] + "//" + arr[2];
	    location_new = location_new + '/es/';
	    window.location.href = location_new;
	}
    });
    $('#js-locale-eu').on('click',function (e) {
	e.preventDefault();
	var location = window.location.href;
	var location_new = location.replace("/es/","/eu/");
	if (location_new !== location) {
	    window.location.href=location_new;
	} else {
	    var arr = location.split("/");
	    location_new = arr[0] + "//" + arr[2];
	    location_new = location_new + '/eu/';
	    window.location.href = location_new;
	}
    });
});
