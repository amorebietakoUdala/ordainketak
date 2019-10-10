import '../../css/exam/new.scss';

import 'jquery-ui';


$(document).ready(function() {
    $('.js-back').on('click', function(e) {
        e.preventDefault();
        var url = e.currentTarget.dataset.url;
        document.location.href = url;
    });
});