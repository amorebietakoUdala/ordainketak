import '../../css/receipt/list.scss';

import $ from 'jquery';
// import 'jquery-ui';
import 'bootstrap-table';
import 'bootstrap-table/dist/extensions/export/bootstrap-table-export'
import 'tableexport.jquery.plugin/tableExport';
import 'bootstrap-table/dist/locale/bootstrap-table-es-ES';
import 'bootstrap-table/dist/locale/bootstrap-table-eu-EU';
import {createAlert} from '../common/alert';
const routes = require('../../../public/js/fos_js_routes.json');
import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js'


$(document).ready(function(){
    console.log('Receipt List OnReady!');
    Routing.setRoutingData(routes);
    console.log('Routes loaded!!!');

    $('#taula').bootstrapTable({
        cache : false,
        showExport: true,
        exportTypes: ['excel'],
        exportDataType: 'all',
        exportOptions: {
            fileName: "receipts",
            ignoreColumn: ['options']
        },
        showColumns: false,
        pagination: true,
        search: true,
        striped: true,
        sortStable: true,
        pageSize: 10,
        pageList: [10,25,50,100],
        sortable: true,
       locale: $('html').attr('lang')+'-'+$('html').attr('lang').toUpperCase(),
   });
    var $table = $('#taula');
    $(function () {
        $('#toolbar').find('select').change(function () {
            $table.bootstrapTable('destroy').bootstrapTable({
                exportDataType: $(this).val(),
            });
        });
    });

    $('#js-autoPay').on('click',function(e){
        e.preventDefault();
        createAlert(e, Routing.generate('receipt_pay', { numeroReferenciaGTWIN: $(e.currentTarget).data('numeroreferenciagtwin'), dni: $(e.currentTarget).data('dni') } ));
    });

    if ($('#js-autoPay').length > 0) { 
        $('#js-autoPay')[0].click();
    }

    $('.js-btnPay').on('click',function(e){
        e.preventDefault();
        createAlert(e, Routing.generate('receipt_pay', { numeroReferenciaGTWIN: $(e.currentTarget).data('numeroreferenciagtwin'), dni: $(e.currentTarget).data('dni') } ));
    });

});

