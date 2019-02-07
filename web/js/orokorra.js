$(document).ready(function(){
    $('#js-locale-es').on('click',function (e) {
	e.preventDefault();
	var location = window.location.href;
	location = location.replace("/eu/","/es/");
	window.location.href=location;
    });
    $('#js-locale-eu').on('click',function (e) {
	e.preventDefault();
	var location = window.location.href;
	location = location.replace("/es/","/eu/");
	window.location.href=location;
    });
});
