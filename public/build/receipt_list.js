(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["receipt_list"],{

/***/ "./assets/css/receipt/list.scss":
/*!**************************************!*\
  !*** ./assets/css/receipt/list.scss ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/js/receipt/list.js":
/*!***********************************!*\
  !*** ./assets/js/receipt/list.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.find */ "./node_modules/core-js/modules/es.array.find.js");
/* harmony import */ var core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_receipt_list_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../css/receipt/list.scss */ "./assets/css/receipt/list.scss");
/* harmony import */ var _css_receipt_list_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_receipt_list_scss__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var bootstrap_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bootstrap-table */ "./node_modules/bootstrap-table/dist/bootstrap-table.min.js");
/* harmony import */ var bootstrap_table__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap_table__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var bootstrap_table_dist_extensions_export_bootstrap_table_export__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bootstrap-table/dist/extensions/export/bootstrap-table-export */ "./node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.js");
/* harmony import */ var bootstrap_table_dist_extensions_export_bootstrap_table_export__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bootstrap_table_dist_extensions_export_bootstrap_table_export__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var tableexport_jquery_plugin_tableExport__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tableexport.jquery.plugin/tableExport */ "./node_modules/tableexport.jquery.plugin/tableExport.js");
/* harmony import */ var tableexport_jquery_plugin_tableExport__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tableexport_jquery_plugin_tableExport__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var bootstrap_table_dist_locale_bootstrap_table_es_ES__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bootstrap-table/dist/locale/bootstrap-table-es-ES */ "./node_modules/bootstrap-table/dist/locale/bootstrap-table-es-ES.js");
/* harmony import */ var bootstrap_table_dist_locale_bootstrap_table_es_ES__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(bootstrap_table_dist_locale_bootstrap_table_es_ES__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var bootstrap_table_dist_locale_bootstrap_table_eu_EU__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! bootstrap-table/dist/locale/bootstrap-table-eu-EU */ "./node_modules/bootstrap-table/dist/locale/bootstrap-table-eu-EU.js");
/* harmony import */ var bootstrap_table_dist_locale_bootstrap_table_eu_EU__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(bootstrap_table_dist_locale_bootstrap_table_eu_EU__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _common_alert__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/alert */ "./assets/js/common/alert.js");
/* harmony import */ var _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js */ "./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js");
/* harmony import */ var _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9__);


 // import 'jquery-ui';







var app_base = '/ordainketak';

var routes = __webpack_require__(/*! ../../../public/js/fos_js_routes.json */ "./public/js/fos_js_routes.json");


jquery__WEBPACK_IMPORTED_MODULE_2___default()(document).ready(function () {
  console.log('Receipt List OnReady!');
  _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default.a.setRoutingData(routes);
  console.log('Routes loaded!!!');
  var current_locale = jquery__WEBPACK_IMPORTED_MODULE_2___default()('html').attr("lang");
  jquery__WEBPACK_IMPORTED_MODULE_2___default()('#taula').bootstrapTable({
    cache: false,
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
    pageList: [10, 25, 50, 100],
    sortable: true,
    locale: jquery__WEBPACK_IMPORTED_MODULE_2___default()('html').attr('lang') + '-' + jquery__WEBPACK_IMPORTED_MODULE_2___default()('html').attr('lang').toUpperCase()
  });
  var $table = jquery__WEBPACK_IMPORTED_MODULE_2___default()('#taula');
  jquery__WEBPACK_IMPORTED_MODULE_2___default()(function () {
    jquery__WEBPACK_IMPORTED_MODULE_2___default()('#toolbar').find('select').change(function () {
      $table.bootstrapTable('destroy').bootstrapTable({
        exportDataType: jquery__WEBPACK_IMPORTED_MODULE_2___default()(this).val()
      });
    });
  });
  jquery__WEBPACK_IMPORTED_MODULE_2___default()(document).on('click', '#js-autoPay', function (e) {
    e.preventDefault();
    Object(_common_alert__WEBPACK_IMPORTED_MODULE_8__["createAlert"])(e, app_base + _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default.a.generate('receipt_pay', {
      numeroReferenciaGTWIN: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('numeroreferenciagtwin'),
      dni: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('dni'),
      _locale: current_locale
    }));
  });

  if (jquery__WEBPACK_IMPORTED_MODULE_2___default()('#js-autoPay').length > 0) {
    jquery__WEBPACK_IMPORTED_MODULE_2___default()('#js-autoPay')[0].click();
  }

  jquery__WEBPACK_IMPORTED_MODULE_2___default()(document).on('click', '.js-btnPay', function (e) {
    e.preventDefault();
    Object(_common_alert__WEBPACK_IMPORTED_MODULE_8__["createAlert"])(e, app_base + _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default.a.generate('receipt_pay', {
      numeroReferenciaGTWIN: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('numeroreferenciagtwin'),
      dni: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('dni'),
      _locale: current_locale
    }));
  });
});

/***/ })

},[["./assets/js/receipt/list.js","runtime","vendors~activity_edit~activity_list~activity_new~app~category_edit~category_list~category_new~concep~ab3f2145","vendors~activity_list~app~category_list~concept_list~payment_list~receipt_list","vendors~activity_list~category_list~concept_list~payment_list~receipt_list","vendors~activity_list~app~category_list~concept_list~receipt_list","vendors~activity_list~category_list~concept_list~receipt_list","activity_list~category_list~concept_list~receipt_list"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL3JlY2VpcHQvbGlzdC5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9yZWNlaXB0L2xpc3QuanMiXSwibmFtZXMiOlsiYXBwX2Jhc2UiLCJyb3V0ZXMiLCJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJjb25zb2xlIiwibG9nIiwiUm91dGluZyIsInNldFJvdXRpbmdEYXRhIiwiY3VycmVudF9sb2NhbGUiLCJhdHRyIiwiYm9vdHN0cmFwVGFibGUiLCJjYWNoZSIsInNob3dFeHBvcnQiLCJleHBvcnRUeXBlcyIsImV4cG9ydERhdGFUeXBlIiwiZXhwb3J0T3B0aW9ucyIsImZpbGVOYW1lIiwiaWdub3JlQ29sdW1uIiwic2hvd0NvbHVtbnMiLCJwYWdpbmF0aW9uIiwic2VhcmNoIiwic3RyaXBlZCIsInNvcnRTdGFibGUiLCJwYWdlU2l6ZSIsInBhZ2VMaXN0Iiwic29ydGFibGUiLCJsb2NhbGUiLCJ0b1VwcGVyQ2FzZSIsIiR0YWJsZSIsImZpbmQiLCJjaGFuZ2UiLCJ2YWwiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImNyZWF0ZUFsZXJ0IiwiZ2VuZXJhdGUiLCJudW1lcm9SZWZlcmVuY2lhR1RXSU4iLCJjdXJyZW50VGFyZ2V0IiwiZGF0YSIsImRuaSIsIl9sb2NhbGUiLCJsZW5ndGgiLCJjbGljayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0NBR0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUEsUUFBUSxHQUFHLGNBQWpCOztBQUNBLElBQU1DLE1BQU0sR0FBR0MsbUJBQU8sQ0FBQyw2RUFBRCxDQUF0Qjs7QUFDQTtBQUVBQyw2Q0FBQyxDQUFDQyxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFVO0FBQ3hCQyxTQUFPLENBQUNDLEdBQVIsQ0FBWSx1QkFBWjtBQUNBQyxv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LENBQXpCO0FBQTJFQyxTQUFHLEVBQUV2Qyw2Q0FBQyxDQUFDZ0MsQ0FBQyxDQUFDSyxhQUFILENBQUQsQ0FBbUJDLElBQW5CLENBQXdCLEtBQXhCLENBQWhGO0FBQWdIRSxhQUFPLEVBQUVqQztBQUF6SCxLQUFoQyxDQUFmLENBQVg7QUFDSCxHQUhEO0FBS0gsQ0FoREQsRSIsImZpbGUiOiJyZWNlaXB0X2xpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgJy4uLy4uL2Nzcy9yZWNlaXB0L2xpc3Quc2Nzcyc7XHJcblxyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG4vLyBpbXBvcnQgJ2pxdWVyeS11aSc7XHJcbmltcG9ydCAnYm9vdHN0cmFwLXRhYmxlJztcclxuaW1wb3J0ICdib290c3RyYXAtdGFibGUvZGlzdC9leHRlbnNpb25zL2V4cG9ydC9ib290c3RyYXAtdGFibGUtZXhwb3J0J1xyXG5pbXBvcnQgJ3RhYmxlZXhwb3J0LmpxdWVyeS5wbHVnaW4vdGFibGVFeHBvcnQnO1xyXG5pbXBvcnQgJ2Jvb3RzdHJhcC10YWJsZS9kaXN0L2xvY2FsZS9ib290c3RyYXAtdGFibGUtZXMtRVMnO1xyXG5pbXBvcnQgJ2Jvb3RzdHJhcC10YWJsZS9kaXN0L2xvY2FsZS9ib290c3RyYXAtdGFibGUtZXUtRVUnO1xyXG5pbXBvcnQge2NyZWF0ZUFsZXJ0fSBmcm9tICcuLi9jb21tb24vYWxlcnQnO1xyXG5jb25zdCBhcHBfYmFzZSA9ICcvb3JkYWlua2V0YWsnO1xyXG5jb25zdCByb3V0ZXMgPSByZXF1aXJlKCcuLi8uLi8uLi9wdWJsaWMvanMvZm9zX2pzX3JvdXRlcy5qc29uJyk7XHJcbmltcG9ydCBSb3V0aW5nIGZyb20gJy4uLy4uLy4uL3ZlbmRvci9mcmllbmRzb2ZzeW1mb255L2pzcm91dGluZy1idW5kbGUvUmVzb3VyY2VzL3B1YmxpYy9qcy9yb3V0ZXIubWluLmpzJ1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIGNvbnNvbGUubG9nKCdSZWNlaXB0IExpc3QgT25SZWFkeSEnKTtcclxuICAgIFJvdXRpbmcuc2V0Um91dGluZ0RhdGEocm91dGVzKTtcclxuICAgIGNvbnNvbGUubG9nKCdSb3V0ZXMgbG9hZGVkISEhJyk7XHJcblx0dmFyIGN1cnJlbnRfbG9jYWxlID0gJCgnaHRtbCcpLmF0dHIoXCJsYW5nXCIpO1xyXG5cclxuICAgICQoJyN0YXVsYScpLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICBjYWNoZSA6IGZhbHNlLFxyXG4gICAgICAgIHNob3dFeHBvcnQ6IHRydWUsXHJcbiAgICAgICAgZXhwb3J0VHlwZXM6IFsnZXhjZWwnXSxcclxuICAgICAgICBleHBvcnREYXRhVHlwZTogJ2FsbCcsXHJcbiAgICAgICAgZXhwb3J0T3B0aW9uczoge1xyXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJyZWNlaXB0c1wiLFxyXG4gICAgICAgICAgICBpZ25vcmVDb2x1bW46IFsnb3B0aW9ucyddXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaG93Q29sdW1uczogZmFsc2UsXHJcbiAgICAgICAgcGFnaW5hdGlvbjogdHJ1ZSxcclxuICAgICAgICBzZWFyY2g6IHRydWUsXHJcbiAgICAgICAgc3RyaXBlZDogdHJ1ZSxcclxuICAgICAgICBzb3J0U3RhYmxlOiB0cnVlLFxyXG4gICAgICAgIHBhZ2VTaXplOiAxMCxcclxuICAgICAgICBwYWdlTGlzdDogWzEwLDI1LDUwLDEwMF0sXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICBsb2NhbGU6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJykrJy0nKyQoJ2h0bWwnKS5hdHRyKCdsYW5nJykudG9VcHBlckNhc2UoKSxcclxuICAgfSk7XHJcbiAgICB2YXIgJHRhYmxlID0gJCgnI3RhdWxhJyk7XHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjdG9vbGJhcicpLmZpbmQoJ3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR0YWJsZS5ib290c3RyYXBUYWJsZSgnZGVzdHJveScpLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICAgICAgICAgIGV4cG9ydERhdGFUeXBlOiAkKHRoaXMpLnZhbCgpLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCcjanMtYXV0b1BheScsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNyZWF0ZUFsZXJ0KGUsIGFwcF9iYXNlICsgUm91dGluZy5nZW5lcmF0ZSgncmVjZWlwdF9wYXknLCB7IG51bWVyb1JlZmVyZW5jaWFHVFdJTjogJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ251bWVyb3JlZmVyZW5jaWFndHdpbicpLCBkbmk6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdkbmknKSwgX2xvY2FsZTogY3VycmVudF9sb2NhbGUgIH0gKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoJCgnI2pzLWF1dG9QYXknKS5sZW5ndGggPiAwKSB7IFxyXG4gICAgICAgICQoJyNqcy1hdXRvUGF5JylbMF0uY2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCcuanMtYnRuUGF5JyxmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY3JlYXRlQWxlcnQoZSwgYXBwX2Jhc2UgKyBSb3V0aW5nLmdlbmVyYXRlKCdyZWNlaXB0X3BheScsIHsgbnVtZXJvUmVmZXJlbmNpYUdUV0lOOiAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnbnVtZXJvcmVmZXJlbmNpYWd0d2luJyksIGRuaTogJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2RuaScpLCBfbG9jYWxlOiBjdXJyZW50X2xvY2FsZSB9ICkpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=