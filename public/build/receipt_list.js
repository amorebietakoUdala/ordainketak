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








var routes = __webpack_require__(/*! ../../../public/js/fos_js_routes.json */ "./public/js/fos_js_routes.json");


jquery__WEBPACK_IMPORTED_MODULE_2___default()(document).ready(function () {
  console.log('Receipt List OnReady!');
  _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default.a.setRoutingData(routes);
  console.log('Routes loaded!!!');
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
  jquery__WEBPACK_IMPORTED_MODULE_2___default()('#js-autoPay').on('click', function (e) {
    e.preventDefault();
    Object(_common_alert__WEBPACK_IMPORTED_MODULE_8__["createAlert"])(e, _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default.a.generate('receipt_pay', {
      numeroReferenciaGTWIN: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('numeroreferenciagtwin'),
      dni: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('dni')
    }));
  });

  if (jquery__WEBPACK_IMPORTED_MODULE_2___default()('#js-autoPay').length > 0) {
    jquery__WEBPACK_IMPORTED_MODULE_2___default()('#js-autoPay')[0].click();
  }

  jquery__WEBPACK_IMPORTED_MODULE_2___default()('.js-btnPay').on('click', function (e) {
    e.preventDefault();
    Object(_common_alert__WEBPACK_IMPORTED_MODULE_8__["createAlert"])(e, _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_9___default.a.generate('receipt_pay', {
      numeroReferenciaGTWIN: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('numeroreferenciagtwin'),
      dni: jquery__WEBPACK_IMPORTED_MODULE_2___default()(e.currentTarget).data('dni')
    }));
  });
});

/***/ })

},[["./assets/js/receipt/list.js","runtime","vendors~activity_edit~activity_list~activity_new~app~category_edit~category_list~category_new~concep~348e466a","vendors~activity_list~app~category_list~concept_list~receipt_list","vendors~activity_list~category_list~concept_list~receipt_list","activity_list~category_list~concept_list~receipt_list"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL3JlY2VpcHQvbGlzdC5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9yZWNlaXB0L2xpc3QuanMiXSwibmFtZXMiOlsicm91dGVzIiwicmVxdWlyZSIsIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY29uc29sZSIsImxvZyIsIlJvdXRpbmciLCJzZXRSb3V0aW5nRGF0YSIsImJvb3RzdHJhcFRhYmxlIiwiY2FjaGUiLCJzaG93RXhwb3J0IiwiZXhwb3J0VHlwZXMiLCJleHBvcnREYXRhVHlwZSIsImV4cG9ydE9wdGlvbnMiLCJmaWxlTmFtZSIsImlnbm9yZUNvbHVtbiIsInNob3dDb2x1bW5zIiwicGFnaW5hdGlvbiIsInNlYXJjaCIsInN0cmlwZWQiLCJzb3J0U3RhYmxlIiwicGFnZVNpemUiLCJwYWdlTGlzdCIsInNvcnRhYmxlIiwibG9jYWxlIiwiYXR0ciIsInRvVXBwZXJDYXNlIiwiJHRhYmxlIiwiZmluZCIsImNoYW5nZSIsInZhbCIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY3JlYXRlQWxlcnQiLCJnZW5lcmF0ZSIsIm51bWVyb1JlZmVyZW5jaWFHVFdJTiIsImN1cnJlbnRUYXJnZXQiLCJkYXRhIiwiZG5pIiwibGVuZ3RoIiwiY2xpY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtDQUdBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNQSxNQUFNLEdBQUdDLG1CQUFPLENBQUMsNkVBQUQsQ0FBdEI7O0FBQ0E7QUFHQUMsNkNBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUN4QkMsU0FBTyxDQUFDQyxHQUFSLENBQVksdUJBQVo7QUFDQUMsb0hBQU8sQ0FBQ0MsY0FBUixDQUF1QlIsTUFBdkI7QUFDQUssU0FBTyxDQUFDQyxHQUFSLENBQVksa0JBQVo7QUFF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c3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQgJy4uLy4uL2Nzcy9yZWNlaXB0L2xpc3Quc2Nzcyc7XHJcblxyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG4vLyBpbXBvcnQgJ2pxdWVyeS11aSc7XHJcbmltcG9ydCAnYm9vdHN0cmFwLXRhYmxlJztcclxuaW1wb3J0ICdib290c3RyYXAtdGFibGUvZGlzdC9leHRlbnNpb25zL2V4cG9ydC9ib290c3RyYXAtdGFibGUtZXhwb3J0J1xyXG5pbXBvcnQgJ3RhYmxlZXhwb3J0LmpxdWVyeS5wbHVnaW4vdGFibGVFeHBvcnQnO1xyXG5pbXBvcnQgJ2Jvb3RzdHJhcC10YWJsZS9kaXN0L2xvY2FsZS9ib290c3RyYXAtdGFibGUtZXMtRVMnO1xyXG5pbXBvcnQgJ2Jvb3RzdHJhcC10YWJsZS9kaXN0L2xvY2FsZS9ib290c3RyYXAtdGFibGUtZXUtRVUnO1xyXG5pbXBvcnQge2NyZWF0ZUFsZXJ0fSBmcm9tICcuLi9jb21tb24vYWxlcnQnO1xyXG5jb25zdCByb3V0ZXMgPSByZXF1aXJlKCcuLi8uLi8uLi9wdWJsaWMvanMvZm9zX2pzX3JvdXRlcy5qc29uJyk7XHJcbmltcG9ydCBSb3V0aW5nIGZyb20gJy4uLy4uLy4uL3ZlbmRvci9mcmllbmRzb2ZzeW1mb255L2pzcm91dGluZy1idW5kbGUvUmVzb3VyY2VzL3B1YmxpYy9qcy9yb3V0ZXIubWluLmpzJ1xyXG5cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zb2xlLmxvZygnUmVjZWlwdCBMaXN0IE9uUmVhZHkhJyk7XHJcbiAgICBSb3V0aW5nLnNldFJvdXRpbmdEYXRhKHJvdXRlcyk7XHJcbiAgICBjb25zb2xlLmxvZygnUm91dGVzIGxvYWRlZCEhIScpO1xyXG5cclxuICAgICQoJyN0YXVsYScpLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICBjYWNoZSA6IGZhbHNlLFxyXG4gICAgICAgIHNob3dFeHBvcnQ6IHRydWUsXHJcbiAgICAgICAgZXhwb3J0VHlwZXM6IFsnZXhjZWwnXSxcclxuICAgICAgICBleHBvcnREYXRhVHlwZTogJ2FsbCcsXHJcbiAgICAgICAgZXhwb3J0T3B0aW9uczoge1xyXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJyZWNlaXB0c1wiLFxyXG4gICAgICAgICAgICBpZ25vcmVDb2x1bW46IFsnb3B0aW9ucyddXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaG93Q29sdW1uczogZmFsc2UsXHJcbiAgICAgICAgcGFnaW5hdGlvbjogdHJ1ZSxcclxuICAgICAgICBzZWFyY2g6IHRydWUsXHJcbiAgICAgICAgc3RyaXBlZDogdHJ1ZSxcclxuICAgICAgICBzb3J0U3RhYmxlOiB0cnVlLFxyXG4gICAgICAgIHBhZ2VTaXplOiAxMCxcclxuICAgICAgICBwYWdlTGlzdDogWzEwLDI1LDUwLDEwMF0sXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICBsb2NhbGU6ICQoJ2h0bWwnKS5hdHRyKCdsYW5nJykrJy0nKyQoJ2h0bWwnKS5hdHRyKCdsYW5nJykudG9VcHBlckNhc2UoKSxcclxuICAgfSk7XHJcbiAgICB2YXIgJHRhYmxlID0gJCgnI3RhdWxhJyk7XHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjdG9vbGJhcicpLmZpbmQoJ3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR0YWJsZS5ib290c3RyYXBUYWJsZSgnZGVzdHJveScpLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICAgICAgICAgIGV4cG9ydERhdGFUeXBlOiAkKHRoaXMpLnZhbCgpLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJyNqcy1hdXRvUGF5Jykub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY3JlYXRlQWxlcnQoZSwgUm91dGluZy5nZW5lcmF0ZSgncmVjZWlwdF9wYXknLCB7IG51bWVyb1JlZmVyZW5jaWFHVFdJTjogJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ251bWVyb3JlZmVyZW5jaWFndHdpbicpLCBkbmk6ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdkbmknKSB9ICkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCQoJyNqcy1hdXRvUGF5JykubGVuZ3RoID4gMCkgeyBcclxuICAgICAgICAkKCcjanMtYXV0b1BheScpWzBdLmNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgnLmpzLWJ0blBheScpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNyZWF0ZUFsZXJ0KGUsIFJvdXRpbmcuZ2VuZXJhdGUoJ3JlY2VpcHRfcGF5JywgeyBudW1lcm9SZWZlcmVuY2lhR1RXSU46ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdudW1lcm9yZWZlcmVuY2lhZ3R3aW4nKSwgZG5pOiAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnZG5pJykgfSApKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9