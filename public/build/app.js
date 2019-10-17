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
/* harmony import */ var _css_app_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../css/app.scss */ "./assets/css/app.scss");
/* harmony import */ var _css_app_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_css_app_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.js");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! popper.js */ "./node_modules/popper.js/dist/esm/popper.js");
/* harmony import */ var _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js */ "./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js");
/* harmony import */ var _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_7__);







var app_base = '/ordainketak';

var routes = __webpack_require__(/*! ../../public/js/fos_js_routes.json */ "./public/js/fos_js_routes.json");


jquery__WEBPACK_IMPORTED_MODULE_4___default()(document).ready(function () {
  // Parece que no funciona la opción de base_url del JSRoutingBundle.
  _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_7___default.a.setRoutingData(routes);
  jquery__WEBPACK_IMPORTED_MODULE_4___default()('#js-locale-es').on('click', function (e) {
    e.preventDefault();
    var current_locale = jquery__WEBPACK_IMPORTED_MODULE_4___default()('html').attr("lang");

    if (current_locale === 'es') {
      return;
    }

    var location = window.location.href;
    var location_new = location.replace("/eu/", "/es/");
    window.location.href = location_new;
  });
  jquery__WEBPACK_IMPORTED_MODULE_4___default()('#js-locale-eu').on('click', function (e) {
    e.preventDefault();
    var current_locale = jquery__WEBPACK_IMPORTED_MODULE_4___default()('html').attr("lang");

    if (current_locale === 'eu') {
      return;
    }

    var location = window.location.href;
    var location_new = location.replace("/es/", "/eu/");
    window.location.href = location_new;
  });
  jquery__WEBPACK_IMPORTED_MODULE_4___default.a.ajax({
    url: app_base + _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_7___default.a.generate('app_rest_getactivities'),
    context: document.body
  }).done(function (data) {
    var app_base_url = 'ordainketak/';
    var current_locale = jquery__WEBPACK_IMPORTED_MODULE_4___default()('html').attr("lang");
    var i;

    for (i = 0; i < data.length; i++) {
      var path = app_base + _vendor_friendsofsymfony_jsrouting_bundle_Resources_public_js_router_min_js__WEBPACK_IMPORTED_MODULE_7___default.a.generate('buyTickets_activity', {
        activity: data[i].id,
        _locale: current_locale
      });
      var item = null;

      if (current_locale === 'es') {
        item = data[i].name;
      } else {
        item = data[i].name_eu;
      }

      jquery__WEBPACK_IMPORTED_MODULE_4___default()("#js-menu-pagos").append('<a class="dropdown-item" href="' + path + '">' + item + '</a>');
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

module.exports = JSON.parse("{\"base_url\":\"\",\"routes\":{\"buyTickets_activity\":{\"tokens\":[[\"text\",\"/buy\"],[\"variable\",\"/\",\"[^/]++\",\"activity\",true],[\"text\",\"/tickets\"],[\"variable\",\"/\",\"es|eu\",\"_locale\",true]],\"defaults\":{\"_locale\":[]},\"requirements\":{\"_locale\":\"es|eu\"},\"hosttokens\":[],\"methods\":[],\"schemes\":[]},\"receipt_pay\":{\"tokens\":[[\"variable\",\"/\",\"[^/]++\",\"dni\",true],[\"variable\",\"/\",\"[^/]++\",\"numeroReferenciaGTWIN\",true],[\"text\",\"/pay\"],[\"variable\",\"/\",\"es|eu|en\",\"_locale\",true]],\"defaults\":{\"_locale\":[]},\"requirements\":{\"_locale\":\"es|eu|en\"},\"hosttokens\":[],\"methods\":[\"GET\",\"POST\"],\"schemes\":[]},\"app_rest_getactivities\":{\"tokens\":[[\"text\",\"/api/activity/\"]],\"defaults\":[],\"requirements\":[],\"hosttokens\":[],\"methods\":[\"GET\"],\"schemes\":[]},\"bazinga_jstranslation_js\":{\"tokens\":[[\"variable\",\".\",\"js|json\",\"_format\",true],[\"variable\",\"/\",\"[\\\\w]+\",\"domain\",true],[\"text\",\"/translations\"]],\"defaults\":{\"domain\":\"messages\",\"_format\":\"js\"},\"requirements\":{\"_format\":\"js|json\",\"domain\":\"[\\\\w]+\"},\"hosttokens\":[],\"methods\":[\"GET\"],\"schemes\":[]}},\"prefix\":\"\",\"host\":\"localhost\",\"port\":\"\",\"scheme\":\"http\",\"locale\":[]}");

/***/ }),

/***/ "./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js":
/*!************************************************************************************!*\
  !*** ./vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.freeze */ "./node_modules/core-js/modules/es.object.freeze.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.constructor */ "./node_modules/core-js/modules/es.regexp.constructor.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e, t) {
  var n = t();
   true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (n.Routing),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
}(this, function () {
  "use strict";

  function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }

  var t = Object.assign || function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];

      for (var o in n) {
        Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
      }
    }

    return e;
  },
      n = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
    return _typeof(e);
  } : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
  },
      o = function () {
    function e(e, t) {
      for (var n = 0; n < t.length; n++) {
        var o = t[n];
        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
      }
    }

    return function (t, n, o) {
      return n && e(t.prototype, n), o && e(t, o), t;
    };
  }(),
      i = function () {
    function i(t, n) {
      e(this, i), this.context_ = t || {
        base_url: "",
        prefix: "",
        host: "",
        port: "",
        scheme: "",
        locale: ""
      }, this.setRoutes(n || {});
    }

    return o(i, [{
      key: "setRoutingData",
      value: function value(e) {
        this.setBaseUrl(e.base_url), this.setRoutes(e.routes), "prefix" in e && this.setPrefix(e.prefix), "port" in e && this.setPort(e.port), "locale" in e && this.setLocale(e.locale), this.setHost(e.host), this.setScheme(e.scheme);
      }
    }, {
      key: "setRoutes",
      value: function value(e) {
        this.routes_ = Object.freeze(e);
      }
    }, {
      key: "getRoutes",
      value: function value() {
        return this.routes_;
      }
    }, {
      key: "setBaseUrl",
      value: function value(e) {
        this.context_.base_url = e;
      }
    }, {
      key: "getBaseUrl",
      value: function value() {
        return this.context_.base_url;
      }
    }, {
      key: "setPrefix",
      value: function value(e) {
        this.context_.prefix = e;
      }
    }, {
      key: "setScheme",
      value: function value(e) {
        this.context_.scheme = e;
      }
    }, {
      key: "getScheme",
      value: function value() {
        return this.context_.scheme;
      }
    }, {
      key: "setHost",
      value: function value(e) {
        this.context_.host = e;
      }
    }, {
      key: "getHost",
      value: function value() {
        return this.context_.host;
      }
    }, {
      key: "setPort",
      value: function value(e) {
        this.context_.port = e;
      }
    }, {
      key: "getPort",
      value: function value() {
        return this.context_.port;
      }
    }, {
      key: "setLocale",
      value: function value(e) {
        this.context_.locale = e;
      }
    }, {
      key: "getLocale",
      value: function value() {
        return this.context_.locale;
      }
    }, {
      key: "buildQueryParams",
      value: function value(e, t, o) {
        var i = this,
            r = void 0,
            s = new RegExp(/\[\]$/);
        if (t instanceof Array) t.forEach(function (t, r) {
          s.test(e) ? o(e, t) : i.buildQueryParams(e + "[" + ("object" === ("undefined" == typeof t ? "undefined" : n(t)) ? r : "") + "]", t, o);
        });else if ("object" === ("undefined" == typeof t ? "undefined" : n(t))) for (r in t) {
          this.buildQueryParams(e + "[" + r + "]", t[r], o);
        } else o(e, t);
      }
    }, {
      key: "getRoute",
      value: function value(e) {
        var t = this.context_.prefix + e,
            n = e + "." + this.context_.locale,
            o = this.context_.prefix + e + "." + this.context_.locale,
            i = [t, n, o, e];

        for (var r in i) {
          if (i[r] in this.routes_) return this.routes_[i[r]];
        }

        throw new Error('The route "' + e + '" does not exist.');
      }
    }, {
      key: "generate",
      value: function value(e, n) {
        var o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            i = this.getRoute(e),
            r = n || {},
            s = t({}, r),
            u = "",
            c = !0,
            a = "",
            f = "undefined" == typeof this.getPort() || null === this.getPort() ? "" : this.getPort();

        if (i.tokens.forEach(function (t) {
          if ("text" === t[0]) return u = t[1] + u, void (c = !1);
          {
            if ("variable" !== t[0]) throw new Error('The token type "' + t[0] + '" is not supported.');
            var n = i.defaults && t[3] in i.defaults;

            if (!1 === c || !n || t[3] in r && r[t[3]] != i.defaults[t[3]]) {
              var o = void 0;
              if (t[3] in r) o = r[t[3]], delete s[t[3]];else {
                if (!n) {
                  if (c) return;
                  throw new Error('The route "' + e + '" requires the parameter "' + t[3] + '".');
                }

                o = i.defaults[t[3]];
              }
              var a = !0 === o || !1 === o || "" === o;

              if (!a || !c) {
                var f = encodeURIComponent(o).replace(/%2F/g, "/");
                "null" === f && null === o && (f = ""), u = t[1] + f + u;
              }

              c = !1;
            } else n && t[3] in s && delete s[t[3]];
          }
        }), "" === u && (u = "/"), i.hosttokens.forEach(function (e) {
          var t = void 0;
          return "text" === e[0] ? void (a = e[1] + a) : void ("variable" === e[0] && (e[3] in r ? (t = r[e[3]], delete s[e[3]]) : i.defaults && e[3] in i.defaults && (t = i.defaults[e[3]]), a = e[1] + t + a));
        }), u = this.context_.base_url + u, i.requirements && "_scheme" in i.requirements && this.getScheme() != i.requirements._scheme ? u = i.requirements._scheme + "://" + (a || this.getHost()) + u : "undefined" != typeof i.schemes && "undefined" != typeof i.schemes[0] && this.getScheme() !== i.schemes[0] ? u = i.schemes[0] + "://" + (a || this.getHost()) + u : a && this.getHost() !== a + ("" === f ? "" : ":" + f) ? u = this.getScheme() + "://" + a + ("" === f ? "" : ":" + f) + u : o === !0 && (u = this.getScheme() + "://" + this.getHost() + u), Object.keys(s).length > 0) {
          var l = void 0,
              h = [],
              y = function y(e, t) {
            t = "function" == typeof t ? t() : t, t = null === t ? "" : t, h.push(encodeURIComponent(e) + "=" + encodeURIComponent(t));
          };

          for (l in s) {
            this.buildQueryParams(l, s[l], y);
          }

          u = u + "?" + h.join("&").replace(/%20/g, "+");
        }

        return u;
      }
    }], [{
      key: "getInstance",
      value: function value() {
        return r;
      }
    }, {
      key: "setData",
      value: function value(e) {
        var t = i.getInstance();
        t.setRoutingData(e);
      }
    }]), i;
  }();

  i.Route, i.Context;
  var r = new i();
  return {
    Router: i,
    Routing: r
  };
});

/***/ })

},[["./assets/js/app.js","runtime","vendors~activity_edit~activity_list~activity_new~app~category_edit~category_list~category_new~concep~ab3f2145","vendors~activity_list~app~category_list~concept_list~payment_list~receipt_list","vendors~activity_list~app~category_list~concept_list~receipt_list","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5zY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vdmVuZG9yL2ZyaWVuZHNvZnN5bWZvbnkvanNyb3V0aW5nLWJ1bmRsZS9SZXNvdXJjZXMvcHVibGljL2pzL3JvdXRlci5taW4uanMiXSwibmFtZXMiOlsiYXBwX2Jhc2UiLCJyb3V0ZXMiLCJyZXF1aXJlIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJSb3V0aW5nIiwic2V0Um91dGluZ0RhdGEiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImN1cnJlbnRfbG9jYWxlIiwiYXR0ciIsImxvY2F0aW9uIiwid2luZG93IiwiaHJlZiIsImxvY2F0aW9uX25ldyIsInJlcGxhY2UiLCJhamF4IiwidXJsIiwiZ2VuZXJhdGUiLCJjb250ZXh0IiwiYm9keSIsImRvbmUiLCJkYXRhIiwiYXBwX2Jhc2VfdXJsIiwiaSIsImxlbmd0aCIsInBhdGgiLCJhY3Rpdml0eSIsImlkIiwiX2xvY2FsZSIsIml0ZW0iLCJuYW1lIiwibmFtZV9ldSIsImFwcGVuZCIsInQiLCJuIiwiZGVmaW5lIiwiVHlwZUVycm9yIiwiT2JqZWN0IiwiYXNzaWduIiwiYXJndW1lbnRzIiwibyIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIlN5bWJvbCIsIml0ZXJhdG9yIiwiY29uc3RydWN0b3IiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJkZWZpbmVQcm9wZXJ0eSIsImtleSIsImNvbnRleHRfIiwiYmFzZV91cmwiLCJwcmVmaXgiLCJob3N0IiwicG9ydCIsInNjaGVtZSIsImxvY2FsZSIsInNldFJvdXRlcyIsInZhbHVlIiwic2V0QmFzZVVybCIsInNldFByZWZpeCIsInNldFBvcnQiLCJzZXRMb2NhbGUiLCJzZXRIb3N0Iiwic2V0U2NoZW1lIiwicm91dGVzXyIsImZyZWV6ZSIsInIiLCJzIiwiUmVnRXhwIiwiQXJyYXkiLCJmb3JFYWNoIiwidGVzdCIsImJ1aWxkUXVlcnlQYXJhbXMiLCJFcnJvciIsImdldFJvdXRlIiwidSIsImMiLCJhIiwiZiIsImdldFBvcnQiLCJ0b2tlbnMiLCJkZWZhdWx0cyIsImVuY29kZVVSSUNvbXBvbmVudCIsImhvc3R0b2tlbnMiLCJyZXF1aXJlbWVudHMiLCJnZXRTY2hlbWUiLCJfc2NoZW1lIiwiZ2V0SG9zdCIsInNjaGVtZXMiLCJrZXlzIiwibCIsImgiLCJ5IiwicHVzaCIsImpvaW4iLCJnZXRJbnN0YW5jZSIsIlJvdXRlIiwiQ29udGV4dCIsIlJvdXRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUVBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFFBQVEsR0FBRyxjQUFqQjs7QUFDQSxJQUFNQyxNQUFNLEdBQUdDLG1CQUFPLENBQUMsMEVBQUQsQ0FBdEI7O0FBQ0E7QUFFQUMsNkNBQUMsQ0FBQ0MsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMzQjtBQUNHQyxvSEFBTyxDQUFDQyxjQUFSLENBQXVCTixNQUF2QjtBQUNBRSwrQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQkssRUFBbkIsQ0FBc0IsT0FBdEIsRUFBOEIsVUFBVUMsQ0FBVixFQUFhO0FBQzdDQSxLQUFDLENBQUNDLGNBQUY7QUFDQSxRQUFJQyxjQUFjLEdBQUdSLDZDQUFDLENBQUMsTUFBRCxDQUFELENBQVVTLElBQVYsQ0FBZSxNQUFmLENBQXJCOztBQUNBLFFBQUtELGNBQWMsS0FBSyxJQUF4QixFQUE4QjtBQUM3QjtBQUNBOztBQUNELFFBQUlFLFFBQVEsR0FBR0MsTUFBTSxDQUFDRCxRQUFQLENBQWdCRSxJQUEvQjtBQUNBLFFBQUlDLFlBQVksR0FBR0gsUUFBUSxDQUFDSSxPQUFULENBQWlCLE1BQWpCLEVBQXdCLE1BQXhCLENBQW5CO0FBQ0FILFVBQU0sQ0FBQ0QsUUFBUCxDQUFnQkUsSUFBaEIsR0FB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QkFBS0ssZ0JBQUwsQ0FBc0JrQixDQUF0QixFQUF3QnZCLENBQUMsQ0FBQ3VCLENBQUQsQ0FBekIsRUFBNkJFLENBQTdCO0FBQVg7O0FBQTJDakIsV0FBQyxHQUFDQSxDQUFDLEdBQUMsR0FBRixHQUFNZ0IsQ0FBQyxDQUFDRyxJQUFGLENBQU8sR0FBUCxFQUFZbkYsT0FBWixDQUFvQixNQUFwQixFQUEyQixHQUEzQixDQUFSO0FBQXdDOztBQUFBLGVBQU9nRSxDQUFQO0FBQVM7QUFBcnNELEtBQTVwRCxDQUFILEVBQXUyRyxDQUFDO0FBQUMzQixTQUFHLEVBQUMsYUFBTDtBQUFtQlMsV0FBSyxFQUFDLGlCQUFVO0FBQUMsZUFBT1MsQ0FBUDtBQUFTO0FBQTdDLEtBQUQsRUFBZ0Q7QUFBQ2xCLFNBQUcsRUFBQyxTQUFMO0FBQWVTLFdBQUssRUFBQyxlQUFTdEQsQ0FBVCxFQUFXO0FBQUMsWUFBSTJCLENBQUMsR0FBQ1YsQ0FBQyxDQUFDMkUsV0FBRixFQUFOO0FBQXNCakUsU0FBQyxDQUFDN0IsY0FBRixDQUFpQkUsQ0FBakI7QUFBb0I7QUFBM0UsS0FBaEQsQ0FBdjJHLENBQUQsRUFBdStHaUIsQ0FBOStHO0FBQWcvRyxHQUF4bkgsRUFBM21COztBQUFzdUlBLEdBQUMsQ0FBQzRFLEtBQUYsRUFBUTVFLENBQUMsQ0FBQzZFLE9BQVY7QUFBa0IsTUFBSS9CLENBQUMsR0FBQyxJQUFJOUMsQ0FBSixFQUFOO0FBQVksU0FBTTtBQUFDOEUsVUFBTSxFQUFDOUUsQ0FBUjtBQUFVcEIsV0FBTyxFQUFDa0U7QUFBbEIsR0FBTjtBQUEyQixDQUE3bEosQ0FBRCxDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsImltcG9ydCAnLi4vY3NzL2FwcC5zY3NzJztcclxuXHJcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcbmltcG9ydCAnYm9vdHN0cmFwJztcclxuaW1wb3J0ICdwb3BwZXIuanMnO1xyXG5cclxuY29uc3QgYXBwX2Jhc2UgPSAnL29yZGFpbmtldGFrJztcclxuY29uc3Qgcm91dGVzID0gcmVxdWlyZSgnLi4vLi4vcHVibGljL2pzL2Zvc19qc19yb3V0ZXMuanNvbicpO1xyXG5pbXBvcnQgUm91dGluZyBmcm9tICcuLi8uLi92ZW5kb3IvZnJpZW5kc29mc3ltZm9ueS9qc3JvdXRpbmctYnVuZGxlL1Jlc291cmNlcy9wdWJsaWMvanMvcm91dGVyLm1pbi5qcydcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcblx0Ly8gUGFyZWNlIHF1ZSBubyBmdW5jaW9uYSBsYSBvcGNpw7NuIGRlIGJhc2VfdXJsIGRlbCBKU1JvdXRpbmdCdW5kbGUuXHJcbiAgICBSb3V0aW5nLnNldFJvdXRpbmdEYXRhKHJvdXRlcyk7XHJcbiAgICAkKCcjanMtbG9jYWxlLWVzJykub24oJ2NsaWNrJyxmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGN1cnJlbnRfbG9jYWxlID0gJCgnaHRtbCcpLmF0dHIoXCJsYW5nXCIpO1xyXG5cdFx0aWYgKCBjdXJyZW50X2xvY2FsZSA9PT0gJ2VzJykge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR2YXIgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuXHRcdHZhciBsb2NhdGlvbl9uZXcgPSBsb2NhdGlvbi5yZXBsYWNlKFwiL2V1L1wiLFwiL2VzL1wiKTtcclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmPWxvY2F0aW9uX25ldztcclxuICAgIH0pO1xyXG4gICAgJCgnI2pzLWxvY2FsZS1ldScpLm9uKCdjbGljaycsZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBjdXJyZW50X2xvY2FsZSA9ICQoJ2h0bWwnKS5hdHRyKFwibGFuZ1wiKTtcclxuXHRcdGlmICggY3VycmVudF9sb2NhbGUgPT09ICdldScpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcblx0XHR2YXIgbG9jYXRpb25fbmV3ID0gbG9jYXRpb24ucmVwbGFjZShcIi9lcy9cIixcIi9ldS9cIik7XHJcblx0XHR3aW5kb3cubG9jYXRpb24uaHJlZj1sb2NhdGlvbl9uZXc7XHJcbiAgICB9KTtcclxuICAgICQuYWpheCh7XHJcblx0XHR1cmw6IGFwcF9iYXNlICsgUm91dGluZy5nZW5lcmF0ZSgnYXBwX3Jlc3RfZ2V0YWN0aXZpdGllcycpLFxyXG5cdFx0Y29udGV4dDogZG9jdW1lbnQuYm9keVxyXG5cdFx0fSkuZG9uZShmdW5jdGlvbihkYXRhKXtcclxuXHRcdHZhciBhcHBfYmFzZV91cmwgPSAnb3JkYWlua2V0YWsvJztcclxuXHRcdHZhciBjdXJyZW50X2xvY2FsZSA9ICQoJ2h0bWwnKS5hdHRyKFwibGFuZ1wiKTtcclxuXHRcdHZhciBpO1xyXG5cdFx0Zm9yIChpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgcGF0aCA9IGFwcF9iYXNlICsgUm91dGluZy5nZW5lcmF0ZSgnYnV5VGlja2V0c19hY3Rpdml0eScsIHsgYWN0aXZpdHk6IGRhdGFbaV0uaWQsIF9sb2NhbGU6IGN1cnJlbnRfbG9jYWxlICB9ICk7XHJcblx0XHRcdHZhciBpdGVtID0gbnVsbDtcclxuXHRcdFx0aWYgKCBjdXJyZW50X2xvY2FsZSA9PT0gJ2VzJykge1xyXG5cdFx0XHRpdGVtID0gZGF0YVtpXS5uYW1lO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpdGVtID0gZGF0YVtpXS5uYW1lX2V1O1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoXCIjanMtbWVudS1wYWdvc1wiKS5hcHBlbmQoJzxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCInK3BhdGgrJ1wiPicraXRlbSsnPC9hPicpO1xyXG5cdFx0fVxyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCIhZnVuY3Rpb24oZSx0KXt2YXIgbj10KCk7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxuLlJvdXRpbmcpOlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPW4uUm91dGluZzooZS5Sb3V0aW5nPW4uUm91dGluZyxlLmZvcz17Um91dGVyOm4uUm91dGVyfSl9KHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKGUsdCl7aWYoIShlIGluc3RhbmNlb2YgdCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgdD1PYmplY3QuYXNzaWdufHxmdW5jdGlvbihlKXtmb3IodmFyIHQ9MTt0PGFyZ3VtZW50cy5sZW5ndGg7dCsrKXt2YXIgbj1hcmd1bWVudHNbdF07Zm9yKHZhciBvIGluIG4pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG4sbykmJihlW29dPW5bb10pfXJldHVybiBlfSxuPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJmUuY29uc3RydWN0b3I9PT1TeW1ib2wmJmUhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIGV9LG89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7Zm9yKHZhciBuPTA7bjx0Lmxlbmd0aDtuKyspe3ZhciBvPXRbbl07by5lbnVtZXJhYmxlPW8uZW51bWVyYWJsZXx8ITEsby5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gbyYmKG8ud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLG8ua2V5LG8pfX1yZXR1cm4gZnVuY3Rpb24odCxuLG8pe3JldHVybiBuJiZlKHQucHJvdG90eXBlLG4pLG8mJmUodCxvKSx0fX0oKSxpPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gaSh0LG4pe2UodGhpcyxpKSx0aGlzLmNvbnRleHRfPXR8fHtiYXNlX3VybDpcIlwiLHByZWZpeDpcIlwiLGhvc3Q6XCJcIixwb3J0OlwiXCIsc2NoZW1lOlwiXCIsbG9jYWxlOlwiXCJ9LHRoaXMuc2V0Um91dGVzKG58fHt9KX1yZXR1cm4gbyhpLFt7a2V5Olwic2V0Um91dGluZ0RhdGFcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLnNldEJhc2VVcmwoZS5iYXNlX3VybCksdGhpcy5zZXRSb3V0ZXMoZS5yb3V0ZXMpLFwicHJlZml4XCJpbiBlJiZ0aGlzLnNldFByZWZpeChlLnByZWZpeCksXCJwb3J0XCJpbiBlJiZ0aGlzLnNldFBvcnQoZS5wb3J0KSxcImxvY2FsZVwiaW4gZSYmdGhpcy5zZXRMb2NhbGUoZS5sb2NhbGUpLHRoaXMuc2V0SG9zdChlLmhvc3QpLHRoaXMuc2V0U2NoZW1lKGUuc2NoZW1lKX19LHtrZXk6XCJzZXRSb3V0ZXNcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLnJvdXRlc189T2JqZWN0LmZyZWV6ZShlKX19LHtrZXk6XCJnZXRSb3V0ZXNcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnJvdXRlc199fSx7a2V5Olwic2V0QmFzZVVybFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuY29udGV4dF8uYmFzZV91cmw9ZX19LHtrZXk6XCJnZXRCYXNlVXJsXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb250ZXh0Xy5iYXNlX3VybH19LHtrZXk6XCJzZXRQcmVmaXhcIix2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLmNvbnRleHRfLnByZWZpeD1lfX0se2tleTpcInNldFNjaGVtZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuY29udGV4dF8uc2NoZW1lPWV9fSx7a2V5OlwiZ2V0U2NoZW1lXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb250ZXh0Xy5zY2hlbWV9fSx7a2V5Olwic2V0SG9zdFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuY29udGV4dF8uaG9zdD1lfX0se2tleTpcImdldEhvc3RcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbnRleHRfLmhvc3R9fSx7a2V5Olwic2V0UG9ydFwiLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuY29udGV4dF8ucG9ydD1lfX0se2tleTpcImdldFBvcnRcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbnRleHRfLnBvcnR9fSx7a2V5Olwic2V0TG9jYWxlXCIsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5jb250ZXh0Xy5sb2NhbGU9ZX19LHtrZXk6XCJnZXRMb2NhbGVcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbnRleHRfLmxvY2FsZX19LHtrZXk6XCJidWlsZFF1ZXJ5UGFyYW1zXCIsdmFsdWU6ZnVuY3Rpb24oZSx0LG8pe3ZhciBpPXRoaXMscj12b2lkIDAscz1uZXcgUmVnRXhwKC9cXFtcXF0kLyk7aWYodCBpbnN0YW5jZW9mIEFycmF5KXQuZm9yRWFjaChmdW5jdGlvbih0LHIpe3MudGVzdChlKT9vKGUsdCk6aS5idWlsZFF1ZXJ5UGFyYW1zKGUrXCJbXCIrKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpuKHQpKT9yOlwiXCIpK1wiXVwiLHQsbyl9KTtlbHNlIGlmKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpuKHQpKSlmb3IociBpbiB0KXRoaXMuYnVpbGRRdWVyeVBhcmFtcyhlK1wiW1wiK3IrXCJdXCIsdFtyXSxvKTtlbHNlIG8oZSx0KX19LHtrZXk6XCJnZXRSb3V0ZVwiLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuY29udGV4dF8ucHJlZml4K2Usbj1lK1wiLlwiK3RoaXMuY29udGV4dF8ubG9jYWxlLG89dGhpcy5jb250ZXh0Xy5wcmVmaXgrZStcIi5cIit0aGlzLmNvbnRleHRfLmxvY2FsZSxpPVt0LG4sbyxlXTtmb3IodmFyIHIgaW4gaSlpZihpW3JdaW4gdGhpcy5yb3V0ZXNfKXJldHVybiB0aGlzLnJvdXRlc19baVtyXV07dGhyb3cgbmV3IEVycm9yKCdUaGUgcm91dGUgXCInK2UrJ1wiIGRvZXMgbm90IGV4aXN0LicpfX0se2tleTpcImdlbmVyYXRlXCIsdmFsdWU6ZnVuY3Rpb24oZSxuKXt2YXIgbz1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdLGk9dGhpcy5nZXRSb3V0ZShlKSxyPW58fHt9LHM9dCh7fSxyKSx1PVwiXCIsYz0hMCxhPVwiXCIsZj1cInVuZGVmaW5lZFwiPT10eXBlb2YgdGhpcy5nZXRQb3J0KCl8fG51bGw9PT10aGlzLmdldFBvcnQoKT9cIlwiOnRoaXMuZ2V0UG9ydCgpO2lmKGkudG9rZW5zLmZvckVhY2goZnVuY3Rpb24odCl7aWYoXCJ0ZXh0XCI9PT10WzBdKXJldHVybiB1PXRbMV0rdSx2b2lkKGM9ITEpO3tpZihcInZhcmlhYmxlXCIhPT10WzBdKXRocm93IG5ldyBFcnJvcignVGhlIHRva2VuIHR5cGUgXCInK3RbMF0rJ1wiIGlzIG5vdCBzdXBwb3J0ZWQuJyk7dmFyIG49aS5kZWZhdWx0cyYmdFszXWluIGkuZGVmYXVsdHM7aWYoITE9PT1jfHwhbnx8dFszXWluIHImJnJbdFszXV0hPWkuZGVmYXVsdHNbdFszXV0pe3ZhciBvPXZvaWQgMDtpZih0WzNdaW4gcilvPXJbdFszXV0sZGVsZXRlIHNbdFszXV07ZWxzZXtpZighbil7aWYoYylyZXR1cm47dGhyb3cgbmV3IEVycm9yKCdUaGUgcm91dGUgXCInK2UrJ1wiIHJlcXVpcmVzIHRoZSBwYXJhbWV0ZXIgXCInK3RbM10rJ1wiLicpfW89aS5kZWZhdWx0c1t0WzNdXX12YXIgYT0hMD09PW98fCExPT09b3x8XCJcIj09PW87aWYoIWF8fCFjKXt2YXIgZj1lbmNvZGVVUklDb21wb25lbnQobykucmVwbGFjZSgvJTJGL2csXCIvXCIpO1wibnVsbFwiPT09ZiYmbnVsbD09PW8mJihmPVwiXCIpLHU9dFsxXStmK3V9Yz0hMX1lbHNlIG4mJnRbM11pbiBzJiZkZWxldGUgc1t0WzNdXX19KSxcIlwiPT09dSYmKHU9XCIvXCIpLGkuaG9zdHRva2Vucy5mb3JFYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PXZvaWQgMDtyZXR1cm5cInRleHRcIj09PWVbMF0/dm9pZChhPWVbMV0rYSk6dm9pZChcInZhcmlhYmxlXCI9PT1lWzBdJiYoZVszXWluIHI/KHQ9cltlWzNdXSxkZWxldGUgc1tlWzNdXSk6aS5kZWZhdWx0cyYmZVszXWluIGkuZGVmYXVsdHMmJih0PWkuZGVmYXVsdHNbZVszXV0pLGE9ZVsxXSt0K2EpKX0pLHU9dGhpcy5jb250ZXh0Xy5iYXNlX3VybCt1LGkucmVxdWlyZW1lbnRzJiZcIl9zY2hlbWVcImluIGkucmVxdWlyZW1lbnRzJiZ0aGlzLmdldFNjaGVtZSgpIT1pLnJlcXVpcmVtZW50cy5fc2NoZW1lP3U9aS5yZXF1aXJlbWVudHMuX3NjaGVtZStcIjovL1wiKyhhfHx0aGlzLmdldEhvc3QoKSkrdTpcInVuZGVmaW5lZFwiIT10eXBlb2YgaS5zY2hlbWVzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgaS5zY2hlbWVzWzBdJiZ0aGlzLmdldFNjaGVtZSgpIT09aS5zY2hlbWVzWzBdP3U9aS5zY2hlbWVzWzBdK1wiOi8vXCIrKGF8fHRoaXMuZ2V0SG9zdCgpKSt1OmEmJnRoaXMuZ2V0SG9zdCgpIT09YSsoXCJcIj09PWY/XCJcIjpcIjpcIitmKT91PXRoaXMuZ2V0U2NoZW1lKCkrXCI6Ly9cIithKyhcIlwiPT09Zj9cIlwiOlwiOlwiK2YpK3U6bz09PSEwJiYodT10aGlzLmdldFNjaGVtZSgpK1wiOi8vXCIrdGhpcy5nZXRIb3N0KCkrdSksT2JqZWN0LmtleXMocykubGVuZ3RoPjApe3ZhciBsPXZvaWQgMCxoPVtdLHk9ZnVuY3Rpb24oZSx0KXt0PVwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dCgpOnQsdD1udWxsPT09dD9cIlwiOnQsaC5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChlKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQodCkpfTtmb3IobCBpbiBzKXRoaXMuYnVpbGRRdWVyeVBhcmFtcyhsLHNbbF0seSk7dT11K1wiP1wiK2guam9pbihcIiZcIikucmVwbGFjZSgvJTIwL2csXCIrXCIpfXJldHVybiB1fX1dLFt7a2V5OlwiZ2V0SW5zdGFuY2VcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiByfX0se2tleTpcInNldERhdGFcIix2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD1pLmdldEluc3RhbmNlKCk7dC5zZXRSb3V0aW5nRGF0YShlKX19XSksaX0oKTtpLlJvdXRlLGkuQ29udGV4dDt2YXIgcj1uZXcgaTtyZXR1cm57Um91dGVyOmksUm91dGluZzpyfX0pOyJdLCJzb3VyY2VSb290IjoiIn0=