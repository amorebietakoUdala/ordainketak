import '../../css/payment/show.scss';

import $ from 'jquery';

$(document).ready(function(){
	$('#payment_type_form_back').on('click', function(e){
        e.preventDefault();
        var url = e.currentTarget.dataset.url;
		console.log(url);
        document.location.href = url;
	})
});