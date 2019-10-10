(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app"],{

/***/ "./assets/css/app.scss":
/*!*****************************!*\
  !*** ./assets/css/app.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.js");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! popper.js */ "./node_modules/popper.js/dist/esm/popper.js");
/* harmony import */ var _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js */ "./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js");
/* harmony import */ var _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _css_app_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../css/app.scss */ "./assets/css/app.scss");
/* harmony import */ var _css_app_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_css_app_scss__WEBPACK_IMPORTED_MODULE_7__);








jquery__WEBPACK_IMPORTED_MODULE_3___default()(document).ready(function () {
  var routes = __webpack_require__(/*! ../../public/js/fos_js_routes.json */ "./public/js/fos_js_routes.json");

  _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_6___default.a.setRoutingData(routes);
  jquery__WEBPACK_IMPORTED_MODULE_3___default()('#js-locale-es').on('click', function (e) {
    e.preventDefault();
    var current_locale = jquery__WEBPACK_IMPORTED_MODULE_3___default()('html').attr("lang");

    if (current_locale === 'es') {
      return;
    }

    var location = window.location.href;
    var location_new = location.replace("/eu/", "/es/");
    window.location.href = location_new;
  });
  jquery__WEBPACK_IMPORTED_MODULE_3___default()('#js-locale-eu').on('click', function (e) {
    e.preventDefault();
    var current_locale = jquery__WEBPACK_IMPORTED_MODULE_3___default()('html').attr("lang");

    if (current_locale === 'eu') {
      return;
    }

    var location = window.location.href;
    var location_new = location.replace("/es/", "/eu/");
    window.location.href = location_new;
  });
  jquery__WEBPACK_IMPORTED_MODULE_3___default.a.ajax({
    url: "/ordainketak/api/activity/",
    context: document.body
  }).done(function (data) {
    var current_locale = jquery__WEBPACK_IMPORTED_MODULE_3___default()('html').attr("lang");
    var i;

    for (i = 0; i < data.length; i++) {
      var path = _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_6___default.a.generate('buyTickets_activity', {
        activity: data[i].id
      });
      var item = null;

      if (current_locale === 'es') {
        item = data[i].name;
      } else {
        item = data[i].name_eu;
      }

      jquery__WEBPACK_IMPORTED_MODULE_3___default()("#js-menu-pagos").append('<a class="dropdown-item" href="' + path + '">' + item + '</a>');
    }
  });
});

/***/ }),

/***/ "./public/js/fos_js_routes.json":
/*!**************************************!*\
  !*** ./public/js/fos_js_routes.json ***!
  \**************************************/
/*! exports provided: base_url, routes, prefix, host, port, scheme, locale, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"base_url\":\"\",\"routes\":{\"buyTickets_activity\":{\"tokens\":[[\"text\",\"/buy\"],[\"variable\",\"/\",\"[^/]++\",\"activity\",true],[\"text\",\"/tickets\"],[\"variable\",\"/\",\"es|eu\",\"_locale\",true]],\"defaults\":{\"_locale\":[]},\"requirements\":{\"_locale\":\"es|eu\"},\"hosttokens\":[],\"methods\":[],\"schemes\":[]},\"receipt_pay\":{\"tokens\":[[\"variable\",\"/\",\"[^/]++\",\"dni\",true],[\"variable\",\"/\",\"[^/]++\",\"numeroReferenciaGTWIN\",true],[\"text\",\"/pay\"],[\"variable\",\"/\",\"es|eu|en\",\"_locale\",true]],\"defaults\":{\"_locale\":[]},\"requirements\":{\"_locale\":\"es|eu|en\"},\"hosttokens\":[],\"methods\":[\"GET\",\"POST\"],\"schemes\":[]},\"bazinga_jstranslation_js\":{\"tokens\":[[\"variable\",\".\",\"js|json\",\"_format\",true],[\"variable\",\"/\",\"[\\\\w]+\",\"domain\",true],[\"text\",\"/translations\"]],\"defaults\":{\"domain\":\"messages\",\"_format\":\"js\"},\"requirements\":{\"_format\":\"js|json\",\"domain\":\"[\\\\w]+\"},\"hosttokens\":[],\"methods\":[\"GET\"],\"schemes\":[]}},\"prefix\":\"\",\"host\":\"localhost\",\"port\":\"\",\"scheme\":\"http\",\"locale\":[]}");

/***/ }),

/***/ "./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js":
/*!************************************************************************************!*\
  !*** ./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nError: ENOENT: no such file or directory, open '/var/www/ordainketak/vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js'");

/***/ })

},[["./assets/js/app.js","runtime","vendors~app~exam_new~receipt_list","vendors~app~receipt_list","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hcHAuanMiXSwibmFtZXMiOlsiJCIsImRvY3VtZW50IiwicmVhZHkiLCJyb3V0ZXMiLCJyZXF1aXJlIiwiUm91dGluZyIsInNldFJvdXRpbmdEYXRhIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJjdXJyZW50X2xvY2FsZSIsImF0dHIiLCJsb2NhdGlvbiIsIndpbmRvdyIsImhyZWYiLCJsb2NhdGlvbl9uZXciLCJyZXBsYWNlIiwiYWpheCIsInVybCIsImNvbnRleHQiLCJib2R5IiwiZG9uZSIsImRhdGEiLCJpIiwibGVuZ3RoIiwicGF0aCIsImdlbmVyYXRlIiwiYWN0aXZpdHkiLCJpZCIsIml0ZW0iLCJuYW1lIiwibmFtZV9ldSIsImFwcGVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0FBLDZDQUFDLENBQUNDLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDeEIsTUFBTUMsTUFBTSxHQUFHQyxtQkFBTyxDQUFDLDBFQUFELENBQXRCOztBQUNBQyxvSEFBTyxDQUFDQyxjQUFSLENBQXVCSCxNQUF2QjtBQUNBSCwrQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQk8sRUFBbkIsQ0FBc0IsT0FBdEIsRUFBOEIsVUFBVUMsQ0FBVixFQUFhO0FBQzlDQSxLQUFDLENBQUNDLGNBQUY7QUFDQSxRQUFJQyxjQUFjLEdBQUdWLDZDQUFDLENBQUMsTUFBRCxDQUFELENBQVVXLElBQVYsQ0FBZSxNQUFmLENBQXJCOztBQUNBLFFBQUtELGNBQWMsS0FBSyxJQUF4QixFQUE4QjtBQUMxQjtBQUNIOztBQUNELFFBQUlFLFFBQVEsR0FBR0MsTUFBTSxDQUFDRCxRQUFQLENBQWdCRSxJQUEvQjtBQUNBLFFBQUlDLFlBQVksR0FBR0gsUUFBUSxDQUFDSSxPQUFULENBQWlCLE1BQWpCLEVBQXdCLE1BQXhCLENBQW5CO0FBQ0FILFVBQU0sQ0FBQ0QsUUFBUCxDQUFnQkUsSUFBaEIsR0FBcUJDLFlBQXJCO0FBQ0ksR0FURDtBQVVBZiwrQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQk8sRUFBbkIsQ0FBc0IsT0FBdEIsRUFBOEIsVUFBVUMsQ0FBVixFQUFhO0FBQzlDQSxLQUFDLENBQUNDLGNBQUY7QUFDQSxRQUFJQyxjQUFjLEdBQUdWLDZDQUFDLENBQUMsTUFBRCxDQUFELENBQVVXLElBQVYsQ0FBZSxNQUFmLENBQXJCOztBQUNBLFFBQUtELGNBQWMsS0FBSyxJQUF4QixFQUE4QjtBQUMxQjtBQUNIOztBQUNELFFBQUlFLFFBQVEsR0FBR0MsTUFBTSxDQUFDRCxRQUFQLENBQWdCRSxJQUEvQjtBQUNBLFFBQUlDLFlBQVksR0FBR0gsUUFBUSxDQUFDSSxPQUFULENBQWlCLE1BQWpCLEVBQXdCLE1BQXhCLENBQW5CO0FBQ0FILFVBQU0sQ0FBQ0QsUUFBUCxDQUFnQkUsSUFBaEIsR0FBcUJDLFlBQXJCO0FBQ0ksR0FURDtBQVVBZiwrQ0FBQyxDQUFDaUIsSUFBRixDQUFPO0FBQ1ZDLE9BQUcsRUFBRSw0QkFESztBQUVWQyxXQUFPLEVBQUVsQixRQUFRLENBQUNtQjtBQUZSLEdBQVAsRUFHR0MsSUFISCxDQUdRLFVBQVNDLElBQVQsRUFBYztBQUN0QixRQUFJWixjQUFjLEdBQUdWLDZDQUFDLENBQUMsTUFBRCxDQUFELENBQVVXLElBQVYsQ0FBZSxNQUFmLENBQXJCO0FBQ0EsUUFBSVksQ0FBSjs7QUFDSCxTQUFLQSxDQUFDLEdBQUMsQ0FBUCxFQUFVQSxDQUFDLEdBQUNELElBQUksQ0FBQ0UsTUFBakIsRUFBeUJELENBQUMsRUFBMUIsRUFBOEI7QUFDMUIsVUFBSUUsSUFBSSxHQUFHcEIsa0hBQU8sQ0FBQ3FCLFFBQVIsQ0FBaUIscUJBQWpCLEVBQXdDO0FBQUVDLGdCQUFRLEVBQUVMLElBQUksQ0FBQ0MsQ0FBRCxDQUFKLENBQVFLO0FBQXBCLE9BQXhDLENBQVg7QUFDQSxVQUFJQyxJQUFJLEdBQUcsSUFBWDs7QUFDQSxVQUFLbkIsY0FBYyxLQUFLLElBQXhCLEVBQThCO0FBQ2pDbUIsWUFBSSxHQUFHUCxJQUFJLENBQUNDLENBQUQsQ0FBSixDQUFRTyxJQUFmO0FBQ0ksT0FGRCxNQUVPO0FBQ1ZELFlBQUksR0FBR1AsSUFBSSxDQUFDQyxDQUFELENBQUosQ0FBUVEsT0FBZjtBQUNJOztBQUNEL0IsbURBQUMsQ0FBQyxnQkFBRCxDQUFELENBQW9CZ0MsTUFBcEIsQ0FBMkIsb0NBQWtDUCxJQUFsQyxHQUF1QyxJQUF2QyxHQUE0Q0ksSUFBNUMsR0FBaUQsTUFBNUU7QUFDSDtBQUNHLEdBaEJEO0FBaUJILENBeENELEUiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0ICdib290c3RyYXAnO1xyXG5pbXBvcnQgJ3BvcHBlci5qcyc7XHJcbmltcG9ydCBSb3V0aW5nIGZyb20gJy4uLy4uL3ZlbmRvci9mcmllbmRzb2ZzeW1mb255L2pzcm91dGluZy1idW5kbGUvUmVzb3VyY2VzL3B1YmxpYy9qcy9yb3V0ZXIubWluLmpzJztcclxuXHJcbmltcG9ydCAnLi4vY3NzL2FwcC5zY3NzJztcclxuXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgY29uc3Qgcm91dGVzID0gcmVxdWlyZSgnLi4vLi4vcHVibGljL2pzL2Zvc19qc19yb3V0ZXMuanNvbicpO1xyXG4gICAgUm91dGluZy5zZXRSb3V0aW5nRGF0YShyb3V0ZXMpO1xyXG4gICAgJCgnI2pzLWxvY2FsZS1lcycpLm9uKCdjbGljaycsZnVuY3Rpb24gKGUpIHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0dmFyIGN1cnJlbnRfbG9jYWxlID0gJCgnaHRtbCcpLmF0dHIoXCJsYW5nXCIpO1xyXG5cdGlmICggY3VycmVudF9sb2NhbGUgPT09ICdlcycpIHtcclxuXHQgICAgcmV0dXJuO1xyXG5cdH1cclxuXHR2YXIgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHR2YXIgbG9jYXRpb25fbmV3ID0gbG9jYXRpb24ucmVwbGFjZShcIi9ldS9cIixcIi9lcy9cIik7XHJcblx0d2luZG93LmxvY2F0aW9uLmhyZWY9bG9jYXRpb25fbmV3O1xyXG4gICAgfSk7XHJcbiAgICAkKCcjanMtbG9jYWxlLWV1Jykub24oJ2NsaWNrJyxmdW5jdGlvbiAoZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR2YXIgY3VycmVudF9sb2NhbGUgPSAkKCdodG1sJykuYXR0cihcImxhbmdcIik7XHJcblx0aWYgKCBjdXJyZW50X2xvY2FsZSA9PT0gJ2V1Jykge1xyXG5cdCAgICByZXR1cm47XHJcblx0fVxyXG5cdHZhciBsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG5cdHZhciBsb2NhdGlvbl9uZXcgPSBsb2NhdGlvbi5yZXBsYWNlKFwiL2VzL1wiLFwiL2V1L1wiKTtcclxuXHR3aW5kb3cubG9jYXRpb24uaHJlZj1sb2NhdGlvbl9uZXc7XHJcbiAgICB9KTtcclxuICAgICQuYWpheCh7XHJcblx0dXJsOiBcIi9vcmRhaW5rZXRhay9hcGkvYWN0aXZpdHkvXCIsXHJcblx0Y29udGV4dDogZG9jdW1lbnQuYm9keVxyXG4gICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciBjdXJyZW50X2xvY2FsZSA9ICQoJ2h0bWwnKS5hdHRyKFwibGFuZ1wiKTtcclxuICAgIHZhciBpO1xyXG5cdGZvciAoaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHQgICAgdmFyIHBhdGggPSBSb3V0aW5nLmdlbmVyYXRlKCdidXlUaWNrZXRzX2FjdGl2aXR5JywgeyBhY3Rpdml0eTogZGF0YVtpXS5pZCB9ICk7XHJcblx0ICAgIHZhciBpdGVtID0gbnVsbDtcclxuXHQgICAgaWYgKCBjdXJyZW50X2xvY2FsZSA9PT0gJ2VzJykge1xyXG5cdFx0aXRlbSA9IGRhdGFbaV0ubmFtZTtcclxuXHQgICAgfSBlbHNlIHtcclxuXHRcdGl0ZW0gPSBkYXRhW2ldLm5hbWVfZXU7XHJcblx0ICAgIH1cclxuXHQgICAgJChcIiNqcy1tZW51LXBhZ29zXCIpLmFwcGVuZCgnPGEgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgaHJlZj1cIicrcGF0aCsnXCI+JytpdGVtKyc8L2E+Jyk7XHJcblx0fVxyXG4gICAgfSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9