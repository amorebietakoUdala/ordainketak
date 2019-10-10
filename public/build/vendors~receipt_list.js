(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~receipt_list"],{

/***/ "./node_modules/bazinga-translator/js/translator.js":
/*!**********************************************************!*\
  !*** ./node_modules/bazinga-translator/js/translator.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author William DURAND <william.durand1@gmail.com>
 * @license MIT Licensed
 */
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else {}
}(this, function () {
    "use strict";

    var _messages     = {},
        _fallbackLocale = 'en',
        _domains      = [],
        _sPluralRegex = new RegExp(/^\w+\: +(.+)$/),
        _cPluralRegex = new RegExp(/^\s*((\{\s*(\-?\d+[\s*,\s*\-?\d+]*)\s*\})|([\[\]])\s*(-Inf|\-?\d+)\s*,\s*(\+?Inf|\-?\d+)\s*([\[\]]))\s?(.+?)$/),
        _iPluralRegex = new RegExp(/^\s*(\{\s*(\-?\d+[\s*,\s*\-?\d+]*)\s*\})|([\[\]])\s*(-Inf|\-?\d+)\s*,\s*(\+?Inf|\-?\d+)\s*([\[\]])/);

    var Translator = {
        /**
         * The current locale.
         *
         * @type {String}
         * @api public
         */
        locale: get_current_locale(),

        /**
         * Fallback locale.
         *
         * @type {String}
         * @api public
         */
        fallback: _fallbackLocale,

        /**
         * Placeholder prefix.
         *
         * @type {String}
         * @api public
         */
        placeHolderPrefix: '%',

        /**
         * Placeholder suffix.
         *
         * @type {String}
         * @api public
         */
        placeHolderSuffix: '%',

        /**
         * Default domain.
         *
         * @type {String}
         * @api public
         */
        defaultDomain: 'messages',

        /**
         * Plural separator.
         *
         * @type {String}
         * @api public
         */
        pluralSeparator: '|',

        /**
         * Adds a translation entry.
         *
         * @param {String} id         The message id
         * @param {String} message    The message to register for the given id
         * @param {String} [domain]   The domain for the message or null to use the default
         * @param {String} [locale]   The locale or null to use the default
         * @return {Object}           Translator
         * @api public
         */
        add: function(id, message, domain, locale) {
            var _locale = locale || this.locale || this.fallback,
                _domain = domain || this.defaultDomain;

            if (!_messages[_locale]) {
                _messages[_locale] = {};
            }

            if (!_messages[_locale][_domain]) {
                _messages[_locale][_domain] = {};
            }

            _messages[_locale][_domain][id] = message;

            if (false === exists(_domains, _domain)) {
                _domains.push(_domain);
            }

            return this;
        },


        /**
         * Translates the given message.
         *
         * @param {String} id               The message id
         * @param {Object} [parameters]     An array of parameters for the message
         * @param {String} [domain]         The domain for the message or null to guess it
         * @param {String} [locale]         The locale or null to use the default
         * @return {String}                 The translated string
         * @api public
         */
        trans: function(id, parameters, domain, locale) {
            var _message = get_message(
                id,
                domain,
                locale,
                this.locale,
                this.fallback
            );

            return replace_placeholders(_message, parameters || {});
        },

        /**
         * Translates the given choice message by choosing a translation according to a number.
         *
         * @param {String} id               The message id
         * @param {Number} number           The number to use to find the indice of the message
         * @param {Object} [parameters]     An array of parameters for the message
         * @param {String} [domain]         The domain for the message or null to guess it
         * @param {String} [locale]         The locale or null to use the default
         * @return {String}                 The translated string
         * @api public
         */
        transChoice: function(id, number, parameters, domain, locale) {
            var _message = get_message(
                id,
                domain,
                locale,
                this.locale,
                this.fallback
            );

            var _number  = parseInt(number, 10);
            parameters = parameters || {};

            if (parameters.count === undefined) {
                parameters.count = number;
            }

            if (typeof _message !== 'undefined' && !isNaN(_number)) {
                _message = pluralize(
                    _message,
                    _number,
                    locale || this.locale || this.fallback
                );
            }

            return replace_placeholders(_message, parameters);
        },

        /**
         * Loads translations from JSON.
         *
         * @param {String} data     A JSON string or object literal
         * @return {Object}         Translator
         * @api public
         */
        fromJSON: function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            if (data.locale) {
                this.locale = data.locale;
            }

            if (data.fallback) {
                this.fallback = data.fallback;
            }

            if (data.defaultDomain) {
                this.defaultDomain = data.defaultDomain;
            }

            if (data.translations) {
                for (var locale in data.translations) {
                    for (var domain in data.translations[locale]) {
                        for (var id in data.translations[locale][domain]) {
                            this.add(id, data.translations[locale][domain][id], domain, locale);
                        }
                    }
                }
            }

            return this;
        },

        /**
         * @api public
         */
        reset: function() {
            _messages   = {};
            _domains    = [];
            this.locale = get_current_locale();
        }
    };

    /**
     * Replace placeholders in given message.
     *
     * **WARNING:** used placeholders are removed.
     *
     * @param {String} message      The translated message
     * @param {Object} placeholders The placeholders to replace
     * @return {String}             A human readable message
     * @api private
     */
    function replace_placeholders(message, placeholders) {
        var _i,
            _prefix = Translator.placeHolderPrefix,
            _suffix = Translator.placeHolderSuffix;

        for (_i in placeholders) {
            var _r = new RegExp(_prefix + _i + _suffix, 'g');

            if (_r.test(message)) {
                var _v = String(placeholders[_i]).replace(new RegExp('\\$', 'g'), '$$$$');
                message = message.replace(_r, _v);
            }
        }

        return message;
    }

    /**
     * Get the message based on its id, its domain, and its locale. If domain or
     * locale are not specified, it will try to find the message using fallbacks.
     *
     * @param {String} id               The message id
     * @param {String} domain           The domain for the message or null to guess it
     * @param {String} locale           The locale or null to use the default
     * @param {String} currentLocale    The current locale or null to use the default
     * @param {String} localeFallback   The fallback (default) locale
     * @return {String}                 The right message if found, `undefined` otherwise
     * @api private
     */
    function get_message(id, domain, locale, currentLocale, localeFallback) {
        var _locale = locale || currentLocale || localeFallback,
            _domain = domain;

        var nationalLocaleFallback = _locale.split('_')[0];

        if (!(_locale in _messages)) {
            if (!(nationalLocaleFallback in _messages)) {
                if (!(localeFallback in _messages)) {
                    return id;
                }
                _locale = localeFallback;
            } else {
                _locale = nationalLocaleFallback;
            }
        }

        if (typeof _domain === 'undefined' || null === _domain) {
            for (var i = 0; i < _domains.length; i++) {
                if (has_message(_locale, _domains[i], id) ||
                    has_message(nationalLocaleFallback, _domains[i], id) ||
                    has_message(localeFallback, _domains[i], id)) {
                    _domain = _domains[i];

                    break;
                }
            }
        }

        if (has_message(_locale, _domain, id)) {
            return _messages[_locale][_domain][id];
        }

        var _length, _parts, _last, _lastLength;

        while (_locale.length > 2) {
            _length     = _locale.length;
            _parts      = _locale.split(/[\s_]+/);
            _last       = _parts[_parts.length - 1];
            _lastLength = _last.length;

            if (1 === _parts.length) {
                break;
            }

            _locale = _locale.substring(0, _length - (_lastLength + 1));

            if (has_message(_locale, _domain, id)) {
                return _messages[_locale][_domain][id];
            }
        }

        if (has_message(localeFallback, _domain, id)) {
            return _messages[localeFallback][_domain][id];
        }

        return id;
    }

    /**
     * Just look for a specific locale / domain / id if the message is available,
     * helpful for message availability validation
     *
     * @param {String} locale           The locale
     * @param {String} domain           The domain for the message
     * @param {String} id               The message id
     * @return {Boolean}                Return `true` if message is available,
     *                      `               false` otherwise
     * @api private
     */
    function has_message(locale, domain, id) {
        if (!(locale in _messages)) {
            return false;
        }

        if (!(domain in _messages[locale])) {
            return false;
        }

        if (!(id in _messages[locale][domain])) {
            return false;
        }

        return true;
    }

    /**
     * The logic comes from the Symfony2 PHP Framework.
     *
     * Given a message with different plural translations separated by a
     * pipe (|), this method returns the correct portion of the message based
     * on the given number, the current locale and the pluralization rules
     * in the message itself.
     *
     * The message supports two different types of pluralization rules:
     *
     * interval: {0} There is no apples|{1} There is one apple|]1,Inf] There is %count% apples
     * indexed:  There is one apple|There is %count% apples
     *
     * The indexed solution can also contain labels (e.g. one: There is one apple).
     * This is purely for making the translations more clear - it does not
     * affect the functionality.
     *
     * The two methods can also be mixed:
     *     {0} There is no apples|one: There is one apple|more: There is %count% apples
     *
     * @param {String} message  The message id
     * @param {Number} number   The number to use to find the indice of the message
     * @param {String} locale   The locale
     * @return {String}         The message part to use for translation
     * @api private
     */
    function pluralize(message, number, locale) {
        var _p,
            _e,
            _explicitRules = [],
            _standardRules = [],
            _parts         = message.split(Translator.pluralSeparator),
            _matches       = [];

        for (_p = 0; _p < _parts.length; _p++) {
            var _part = _parts[_p];

            if (_cPluralRegex.test(_part)) {
                _matches = _part.match(_cPluralRegex);
                _explicitRules[_matches[0]] = _matches[_matches.length - 1];
            } else if (_sPluralRegex.test(_part)) {
                _matches = _part.match(_sPluralRegex);
                _standardRules.push(_matches[1]);
            } else {
                _standardRules.push(_part);
            }
        }

        for (_e in _explicitRules) {
            if (_iPluralRegex.test(_e)) {
                _matches = _e.match(_iPluralRegex);

                if (_matches[1]) {
                    var _ns = _matches[2].split(','),
                        _n;

                    for (_n in _ns) {
                        if (number == _ns[_n]) {
                            return _explicitRules[_e];
                        }
                    }
                } else {
                    var _leftNumber  = convert_number(_matches[4]);
                    var _rightNumber = convert_number(_matches[5]);

                    if (('[' === _matches[3] ? number >= _leftNumber : number > _leftNumber) &&
                        (']' === _matches[6] ? number <= _rightNumber : number < _rightNumber)) {
                        return _explicitRules[_e];
                    }
                }
            }
        }

        return _standardRules[plural_position(number, locale)] || _standardRules[0] || undefined;
    }

    /**
     * The logic comes from the Symfony2 PHP Framework.
     *
     * Convert number as String, "Inf" and "-Inf"
     * values to number values.
     *
     * @param {String} number   A literal number
     * @return {Number}         The int value of the number
     * @api private
     */
    function convert_number(number) {
        if ('-Inf' === number) {
            return Number.NEGATIVE_INFINITY;
        } else if ('+Inf' === number || 'Inf' === number) {
            return Number.POSITIVE_INFINITY;
        }

        return parseInt(number, 10);
    }

    /**
     * The logic comes from the Symfony2 PHP Framework.
     *
     * Returns the plural position to use for the given locale and number.
     *
     * @param {Number} number  The number to use to find the indice of the message
     * @param {String} locale  The locale
     * @return {Number}        The plural position
     * @api private
     */
    function plural_position(number, locale) {
        var _locale = locale;

        if ('pt_BR' === _locale) {
            _locale = 'xbr';
        }

        if (_locale.length > 3) {
            _locale = _locale.split('_')[0];
        }

        switch (_locale) {
            case 'bo':
            case 'dz':
            case 'id':
            case 'ja':
            case 'jv':
            case 'ka':
            case 'km':
            case 'kn':
            case 'ko':
            case 'ms':
            case 'th':
            case 'tr':
            case 'vi':
            case 'zh':
                return 0;
            case 'af':
            case 'az':
            case 'bn':
            case 'bg':
            case 'ca':
            case 'da':
            case 'de':
            case 'el':
            case 'en':
            case 'eo':
            case 'es':
            case 'et':
            case 'eu':
            case 'fa':
            case 'fi':
            case 'fo':
            case 'fur':
            case 'fy':
            case 'gl':
            case 'gu':
            case 'ha':
            case 'he':
            case 'hu':
            case 'is':
            case 'it':
            case 'ku':
            case 'lb':
            case 'ml':
            case 'mn':
            case 'mr':
            case 'nah':
            case 'nb':
            case 'ne':
            case 'nl':
            case 'nn':
            case 'no':
            case 'om':
            case 'or':
            case 'pa':
            case 'pap':
            case 'ps':
            case 'pt':
            case 'so':
            case 'sq':
            case 'sv':
            case 'sw':
            case 'ta':
            case 'te':
            case 'tk':
            case 'ur':
            case 'zu':
                return (number == 1) ? 0 : 1;

            case 'am':
            case 'bh':
            case 'fil':
            case 'fr':
            case 'gun':
            case 'hi':
            case 'ln':
            case 'mg':
            case 'nso':
            case 'xbr':
            case 'ti':
            case 'wa':
                return ((number === 0) || (number == 1)) ? 0 : 1;

            case 'be':
            case 'bs':
            case 'hr':
            case 'ru':
            case 'sr':
            case 'uk':
                return ((number % 10 == 1) && (number % 100 != 11)) ? 0 : (((number % 10 >= 2) && (number % 10 <= 4) && ((number % 100 < 10) || (number % 100 >= 20))) ? 1 : 2);

            case 'cs':
            case 'sk':
                return (number == 1) ? 0 : (((number >= 2) && (number <= 4)) ? 1 : 2);

            case 'ga':
                return (number == 1) ? 0 : ((number == 2) ? 1 : 2);

            case 'lt':
                return ((number % 10 == 1) && (number % 100 != 11)) ? 0 : (((number % 10 >= 2) && ((number % 100 < 10) || (number % 100 >= 20))) ? 1 : 2);

            case 'sl':
                return (number % 100 == 1) ? 0 : ((number % 100 == 2) ? 1 : (((number % 100 == 3) || (number % 100 == 4)) ? 2 : 3));

            case 'mk':
                return (number % 10 == 1) ? 0 : 1;

            case 'mt':
                return (number == 1) ? 0 : (((number === 0) || ((number % 100 > 1) && (number % 100 < 11))) ? 1 : (((number % 100 > 10) && (number % 100 < 20)) ? 2 : 3));

            case 'lv':
                return (number === 0) ? 0 : (((number % 10 == 1) && (number % 100 != 11)) ? 1 : 2);

            case 'pl':
                return (number == 1) ? 0 : (((number % 10 >= 2) && (number % 10 <= 4) && ((number % 100 < 12) || (number % 100 > 14))) ? 1 : 2);

            case 'cy':
                return (number == 1) ? 0 : ((number == 2) ? 1 : (((number == 8) || (number == 11)) ? 2 : 3));

            case 'ro':
                return (number == 1) ? 0 : (((number === 0) || ((number % 100 > 0) && (number % 100 < 20))) ? 1 : 2);

            case 'ar':
                return (number === 0) ? 0 : ((number == 1) ? 1 : ((number == 2) ? 2 : (((number >= 3) && (number <= 10)) ? 3 : (((number >= 11) && (number <= 99)) ? 4 : 5))));

            default:
                return 0;
        }
    }

    /**
     * @type {Array}        An array
     * @type {String}       An element to compare
     * @return {Boolean}    Return `true` if `array` contains `element`,
     *                      `false` otherwise
     * @api private
     */
    function exists(array, element) {
        for (var i = 0; i < array.length; i++) {
            if (element === array[i]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the current application's locale based on the `lang` attribute
     * on the `html` tag.
     *
     * @return {String}     The current application's locale
     * @api private
     */
    function get_current_locale() {
        if (typeof document !== 'undefined') {
            return document.documentElement.lang.replace('-', '_');
        }
        else {
            return _fallbackLocale;
        }
    }

    return Translator;
}));


/***/ }),

/***/ "./node_modules/bootstrap-table/dist/bootstrap-table.min.js":
/*!******************************************************************!*\
  !*** ./node_modules/bootstrap-table/dist/bootstrap-table.min.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
  * bootstrap-table - An extended Bootstrap table with radio, checkbox, sort, pagination, and other added features. (supports twitter bootstrap v2 and v3).
  *
  * @version v1.14.2
  * @homepage https://bootstrap-table.com
  * @author wenzhixin <wenzhixin2010@gmail.com> (http://wenzhixin.net.cn/)
  * @license MIT
  */

(function(e,t){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}})(this,function(){'use strict';function e(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}function t(e){if(Array.isArray(e)){for(var t=0,o=Array(e.length);t<e.length;t++)o[t]=e[t];return o}return Array.from(e)}var o=function(){function e(e,t){for(var o,a=0;a<t.length;a++)o=t[a],o.enumerable=o.enumerable||!1,o.configurable=!0,'value'in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}return function(t,o,a){return o&&e(t.prototype,o),a&&e(t,a),t}}(),a=function(){function e(e,t){var o=[],a=!0,i=!1,n=void 0;try{for(var s,l=e[Symbol.iterator]();!(a=(s=l.next()).done)&&(o.push(s.value),!(t&&o.length===t));a=!0);}catch(e){i=!0,n=e}finally{try{!a&&l['return']&&l['return']()}finally{if(i)throw n}}return o}return function(t,o){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,o);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}(),n='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':typeof e};(function(s){var i=4;try{var g=s.fn.dropdown.Constructor.VERSION;g!==void 0&&(i=parseInt(g,10))}catch(t){}var l={3:{theme:'bootstrap3',iconsPrefix:'glyphicon',icons:{paginationSwitchDown:'glyphicon-collapse-down icon-chevron-down',paginationSwitchUp:'glyphicon-collapse-up icon-chevron-up',refresh:'glyphicon-refresh icon-refresh',toggleOff:'glyphicon-list-alt icon-list-alt',toggleOn:'glyphicon-list-alt icon-list-alt',columns:'glyphicon-th icon-th',detailOpen:'glyphicon-plus icon-plus',detailClose:'glyphicon-minus icon-minus',fullscreen:'glyphicon-fullscreen'},classes:{buttonsPrefix:'btn',buttons:'default',buttonsGroup:'btn-group',buttonsDropdown:'btn-group',pull:'pull',inputGroup:'',input:'form-control',paginationDropdown:'btn-group dropdown',dropup:'dropup',dropdownActive:'active',paginationActive:'active'},html:{toobarDropdow:['<ul class="dropdown-menu" role="menu">','</ul>'],toobarDropdowItem:'<li role="menuitem"><label>%s</label></li>',pageDropdown:['<ul class="dropdown-menu" role="menu">','</ul>'],pageDropdownItem:'<li role="menuitem" class="%s"><a href="#">%s</a></li>',dropdownCaret:'<span class="caret"></span>',pagination:['<ul class="pagination%s">','</ul>'],paginationItem:'<li class="page-item%s"><a class="page-link" href="#">%s</a></li>',icon:'<i class="%s %s"></i>'}},4:{theme:'bootstrap4',iconsPrefix:'fa',icons:{paginationSwitchDown:'fa-caret-square-down',paginationSwitchUp:'fa-caret-square-up',refresh:'fa-sync',toggleOff:'fa-toggle-off',toggleOn:'fa-toggle-on',columns:'fa-th-list',fullscreen:'fa-arrows-alt',detailOpen:'fa-plus',detailClose:'fa-minus'},classes:{buttonsPrefix:'btn',buttons:'secondary',buttonsGroup:'btn-group',buttonsDropdown:'btn-group',pull:'float',inputGroup:'',input:'form-control',paginationDropdown:'btn-group dropdown',dropup:'dropup',dropdownActive:'active',paginationActive:'active'},html:{toobarDropdow:['<div class="dropdown-menu dropdown-menu-right">','</div>'],toobarDropdowItem:'<label class="dropdown-item">%s</label>',pageDropdown:['<div class="dropdown-menu">','</div>'],pageDropdownItem:'<a class="dropdown-item %s" href="#">%s</a>',dropdownCaret:'<span class="caret"></span>',pagination:['<ul class="pagination%s">','</ul>'],paginationItem:'<li class="page-item%s"><a class="page-link" href="#">%s</a></li>',icon:'<i class="%s %s"></i>'}}}[i],r={bootstrapVersion:i,sprintf:function(e){for(var t=arguments.length,o=Array(1<t?t-1:0),a=1;a<t;a++)o[a-1]=arguments[a];var n=!0,s=0,i=e.replace(/%s/g,function(){var e=o[s++];return'undefined'==typeof e?(n=!1,''):e});return n?i:''},isEmptyObject:function(){var e=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};return 0===function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(e).length&&e.constructor===Object},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},getFieldTitle:function(e,t){for(var o=e,a=Array.isArray(o),i=0,_iterator=a?o:o[Symbol.iterator]();;){var n;if(a){if(i>=o.length)break;n=o[i++]}else{if(i=o.next(),i.done)break;n=i.value}var s=n;if(s.field===t)return s.title}return''},setFieldIndex:function(e){for(var t=0,o=[],a=e[0],n=Array.isArray(a),s=0,_iterator2=n?a:a[Symbol.iterator]();;){var l;if(n){if(s>=a.length)break;l=a[s++]}else{if(s=a.next(),s.done)break;l=s.value}var d=l;t+=d.colspan||1}for(var m=0;m<e.length;m++){o[m]=[];for(var i=0;i<t;i++)o[m][i]=!1}for(var y=0;y<e.length;y++)for(var c=e[y],p=Array.isArray(c),h=0,_iterator3=p?c:c[Symbol.iterator]();;){var g;if(p){if(h>=c.length)break;g=c[h++]}else{if(h=c.next(),h.done)break;g=h.value}var u=g,r=u.rowspan||1,f=u.colspan||1,b=o[y].indexOf(!1);1===f&&(u.fieldIndex=b,'undefined'==typeof u.field&&(u.field=b));for(var w=0;w<r;w++)o[y+w][b]=!0;for(var k=0;k<f;k++)o[y][b+k]=!0}},getScrollBarWidth:function(){if(this.cachedWidth===void 0){var e=s('<div/>').addClass('fixed-table-scroll-inner'),t=s('<div/>').addClass('fixed-table-scroll-outer');t.append(e),s('body').append(t);var o=e[0].offsetWidth;t.css('overflow','scroll');var a=e[0].offsetWidth;o===a&&(a=t[0].clientWidth),t.remove(),this.cachedWidth=o-a}return this.cachedWidth},calculateObjectValue:function(e,o,a,i){var s=o;if('string'==typeof o){var h=o.split('.');if(1<h.length){s=window;for(var l=h,r=Array.isArray(l),d=0,_iterator4=r?l:l[Symbol.iterator]();;){var c;if(r){if(d>=l.length)break;c=l[d++]}else{if(d=l.next(),d.done)break;c=d.value}var p=c;s=s[p]}}else s=window[o]}return null!==s&&'object'===('undefined'==typeof s?'undefined':n(s))?s:'function'==typeof s?s.apply(e,a||[]):!s&&'string'==typeof o&&this.sprintf.apply(this,[o].concat(t(a)))?this.sprintf.apply(this,[o].concat(t(a))):i},compareObjects:function(e,t,o){var a=Object.keys(e),i=Object.keys(t);if(o&&a.length!==i.length)return!1;for(var n=a,s=Array.isArray(n),l=0,_iterator5=s?n:n[Symbol.iterator]();;){var r;if(s){if(l>=n.length)break;r=n[l++]}else{if(l=n.next(),l.done)break;r=l.value}var d=r;if(-1!==i.indexOf(d)&&e[d]!==t[d])return!1}return!0},escapeHTML:function(e){return'string'==typeof e?e.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/`/g,'&#x60;'):e},getRealDataAttr:function(e){for(var t=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(e),o=Array.isArray(t),i=0,_iterator6=o?t:t[Symbol.iterator]();;){var n;if(o){if(i>=t.length)break;n=t[i++]}else{if(i=t.next(),i.done)break;n=i.value}var s=n,l=a(s,2),r=l[0],d=l[1],c=r.split(/(?=[A-Z])/).join('-').toLowerCase();c!==r&&(e[c]=d,delete e[r])}return e},getItemField:function(e,t,o){var a=e;if('string'!=typeof t||e.hasOwnProperty(t))return o?this.escapeHTML(e[t]):e[t];for(var i=t.split('.'),n=i,s=Array.isArray(n),l=0,_iterator7=s?n:n[Symbol.iterator]();;){var r;if(s){if(l>=n.length)break;r=n[l++]}else{if(l=n.next(),l.done)break;r=l.value}var d=r;a=a&&a[d]}return o?this.escapeHTML(a):a},isIEBrowser:function(){return -1!==navigator.userAgent.indexOf('MSIE ')||/Trident.*rv:11\./.test(navigator.userAgent)},findIndex:function(e,t){for(var o=e,a=Array.isArray(o),i=0,_iterator8=a?o:o[Symbol.iterator]();;){var n;if(a){if(i>=o.length)break;n=o[i++]}else{if(i=o.next(),i.done)break;n=i.value}var s=n;if(JSON.stringify(s)===JSON.stringify(t))return e.indexOf(s)}return-1}},d={height:void 0,classes:'table table-bordered table-hover',theadClasses:'',rowStyle:function(){return{}},rowAttributes:function(){return{}},undefinedText:'-',locale:void 0,sortable:!0,sortClass:void 0,silentSort:!0,sortName:void 0,sortOrder:'asc',sortStable:!1,rememberOrder:!1,customSort:void 0,columns:[[]],data:[],url:void 0,method:'get',cache:!0,contentType:'application/json',dataType:'json',ajax:void 0,ajaxOptions:{},queryParams:function(e){return e},queryParamsType:'limit',responseHandler:function(e){return e},totalField:'total',dataField:'rows',pagination:!1,onlyInfoPagination:!1,paginationLoop:!0,sidePagination:'client',totalRows:0,pageNumber:1,pageSize:10,pageList:[10,25,50,100],paginationHAlign:'right',paginationVAlign:'bottom',paginationDetailHAlign:'left',paginationPreText:'&lsaquo;',paginationNextText:'&rsaquo;',paginationSuccessivelySize:5,paginationPagesBySide:1,paginationUseIntermediate:!1,search:!1,searchOnEnterKey:!1,strictSearch:!1,trimOnSearch:!0,searchAlign:'right',searchTimeOut:500,searchText:'',customSearch:void 0,showHeader:!0,showFooter:!1,footerStyle:function(){return{}},showColumns:!1,minimumCountColumns:1,showPaginationSwitch:!1,showRefresh:!1,showToggle:!1,showFullscreen:!1,smartDisplay:!0,escape:!1,idField:void 0,selectItemName:'btSelectItem',clickToSelect:!1,ignoreClickToSelectOn:function(e){var t=e.tagName;return -1!==['A','BUTTON'].indexOf(t)},singleSelect:!1,checkboxHeader:!0,maintainSelected:!1,uniqueId:void 0,cardView:!1,detailView:!1,detailFormatter:function(){return''},detailFilter:function(){return!0},toolbar:void 0,toolbarAlign:'left',buttonsToolbar:void 0,buttonsAlign:'right',buttonsPrefix:l.classes.buttonsPrefix,buttonsClass:l.classes.buttons,icons:l.icons,iconSize:void 0,iconsPrefix:l.iconsPrefix,onAll:function(){return!1},onClickCell:function(){return!1},onDblClickCell:function(){return!1},onClickRow:function(){return!1},onDblClickRow:function(){return!1},onSort:function(){return!1},onCheck:function(){return!1},onUncheck:function(){return!1},onCheckAll:function(){return!1},onUncheckAll:function(){return!1},onCheckSome:function(){return!1},onUncheckSome:function(){return!1},onLoadSuccess:function(){return!1},onLoadError:function(){return!1},onColumnSwitch:function(){return!1},onPageChange:function(){return!1},onSearch:function(){return!1},onToggle:function(){return!1},onPreBody:function(){return!1},onPostBody:function(){return!1},onPostHeader:function(){return!1},onExpandRow:function(){return!1},onCollapseRow:function(){return!1},onRefreshOptions:function(){return!1},onRefresh:function(){return!1},onResetView:function(){return!1},onScrollBody:function(){return!1}},c={};c['en-US']=c.en={formatLoadingMessage:function(){return'Loading, please wait'},formatRecordsPerPage:function(e){return e+' rows per page'},formatShowingRows:function(e,t,o){return'Showing '+e+' to '+t+' of '+o+' rows'},formatDetailPagination:function(e){return'Showing '+e+' rows'},formatSearch:function(){return'Search'},formatNoMatches:function(){return'No matching records found'},formatPaginationSwitch:function(){return'Hide/Show pagination'},formatRefresh:function(){return'Refresh'},formatToggle:function(){return'Toggle'},formatColumns:function(){return'Columns'},formatFullscreen:function(){return'Fullscreen'},formatAllRows:function(){return'All'}},s.extend(d,c['en-US']);var p=function(){function t(o,a){e(this,t),this.options=a,this.$el=s(o),this.$el_=this.$el.clone(),this.timeoutId_=0,this.timeoutFooter_=0,this.init()}return o(t,[{key:'init',value:function(){this.initConstants(),this.initLocale(),this.initContainer(),this.initTable(),this.initHeader(),this.initData(),this.initHiddenRows(),this.initFooter(),this.initToolbar(),this.initPagination(),this.initBody(),this.initSearchText(),this.initServer()}},{key:'initConstants',value:function(){var e=this.options;this.constants=l;var t=e.buttonsPrefix?e.buttonsPrefix+'-':'';this.constants.buttonsClass=[e.buttonsPrefix,t+e.buttonsClass,r.sprintf(t+'%s',e.iconSize)].join(' ').trim()}},{key:'initLocale',value:function(){if(this.options.locale){var e=s.fn.bootstrapTable.locales,t=this.options.locale.split(/-|_/);t[0]=t[0].toLowerCase(),t[1]&&(t[1]=t[1].toUpperCase()),e[this.options.locale]?s.extend(this.options,e[this.options.locale]):e[t.join('-')]?s.extend(this.options,e[t.join('-')]):e[t[0]]&&s.extend(this.options,e[t[0]])}}},{key:'initContainer',value:function(){var e=-1===['top','both'].indexOf(this.options.paginationVAlign)?'':'<div class="fixed-table-pagination clearfix"></div>',t=-1===['bottom','both'].indexOf(this.options.paginationVAlign)?'':'<div class="fixed-table-pagination"></div>';this.$container=s('\n        <div class="bootstrap-table">\n        <div class="fixed-table-toolbar"></div>\n        '+e+'\n        <div class="fixed-table-container">\n        <div class="fixed-table-header"><table></table></div>\n        <div class="fixed-table-body">\n        <div class="fixed-table-loading">\n        <span class="loading-wrap">\n        <span class="loading-text">'+this.options.formatLoadingMessage()+'</span>\n        <span class="animation-wrap"><span class="animation-dot"></span></span>\n        </span>\n        </div>\n        </div>\n        <div class="fixed-table-footer"><table><thead><tr></tr></thead></table></div>\n        </div>\n        '+t+'\n        </div>\n      '),this.$container.insertAfter(this.$el),this.$tableContainer=this.$container.find('.fixed-table-container'),this.$tableHeader=this.$container.find('.fixed-table-header'),this.$tableBody=this.$container.find('.fixed-table-body'),this.$tableLoading=this.$container.find('.fixed-table-loading'),this.$tableFooter=this.$container.find('.fixed-table-footer'),this.$toolbar=this.options.buttonsToolbar?s('body').find(this.options.buttonsToolbar):this.$container.find('.fixed-table-toolbar'),this.$pagination=this.$container.find('.fixed-table-pagination'),this.$tableBody.append(this.$el),this.$container.after('<div class="clearfix"></div>'),this.$el.addClass(this.options.classes),this.$tableLoading.addClass(this.options.classes),this.options.height&&(this.$tableContainer.addClass('fixed-height'),this.options.showFooter&&this.$tableContainer.addClass('has-footer'),-1!==this.options.classes.split(' ').indexOf('table-bordered')&&(this.$tableBody.append('<div class="fixed-table-border"></div>'),this.$tableBorder=this.$tableBody.find('.fixed-table-border'),this.$tableLoading.addClass('fixed-table-border')))}},{key:'initTable',value:function(){var e=this,o=[],a=[];if(this.$header=this.$el.find('>thead'),this.$header.length?this.options.theadClasses&&this.$header.addClass(this.options.theadClasses):this.$header=s('<thead class="'+this.options.theadClasses+'"></thead>').appendTo(this.$el),this.$header.find('tr').each(function(e,t){var a=[];s(t).find('th').each(function(e,t){'undefined'!=typeof s(t).data('field')&&s(t).data('field',''+s(t).data('field')),a.push(s.extend({},{title:s(t).html(),class:s(t).attr('class'),titleTooltip:s(t).attr('title'),rowspan:s(t).attr('rowspan')?+s(t).attr('rowspan'):void 0,colspan:s(t).attr('colspan')?+s(t).attr('colspan'):void 0},s(t).data()))}),o.push(a)}),Array.isArray(this.options.columns[0])||(this.options.columns=[this.options.columns]),this.options.columns=s.extend(!0,[],o,this.options.columns),this.columns=[],this.fieldsColumnsIndex=[],r.setFieldIndex(this.options.columns),this.options.columns.forEach(function(o,a){o.forEach(function(o,i){var n=s.extend({},t.COLUMN_DEFAULTS,o);'undefined'!=typeof n.fieldIndex&&(e.columns[n.fieldIndex]=n,e.fieldsColumnsIndex[n.field]=n.fieldIndex),e.options.columns[a][i]=n})}),!this.options.data.length){var i=[];this.$el.find('>tbody>tr').each(function(t,o){var n={};n._id=s(o).attr('id'),n._class=s(o).attr('class'),n._data=r.getRealDataAttr(s(o).data()),s(o).find('>td').each(function(o,a){for(var l=+s(a).attr('colspan')||1,d=+s(a).attr('rowspan')||1,c=o;i[t]&&i[t][c];c++);for(var h=c;h<c+l;h++)for(var g=t;g<t+d;g++)i[g]||(i[g]=[]),i[g][h]=!0;var p=e.columns[c].field;n[p]=s(a).html().trim(),n['_'+p+'_id']=s(a).attr('id'),n['_'+p+'_class']=s(a).attr('class'),n['_'+p+'_rowspan']=s(a).attr('rowspan'),n['_'+p+'_colspan']=s(a).attr('colspan'),n['_'+p+'_title']=s(a).attr('title'),n['_'+p+'_data']=r.getRealDataAttr(s(a).data())}),a.push(n)}),this.options.data=a,a.length&&(this.fromHtml=!0)}}},{key:'initHeader',value:function(){var t=this,e={},o=[];this.header={fields:[],styles:[],classes:[],formatters:[],events:[],sorters:[],sortNames:[],cellStyles:[],searchables:[]},this.options.columns.forEach(function(a,n){o.push('<tr>'),0===n&&!t.options.cardView&&t.options.detailView&&o.push('<th class="detail" rowspan="'+t.options.columns.length+'">\n            <div class="fht-cell"></div>\n            </th>\n          '),a.forEach(function(a,i){var s='',l='',d='',c='',p=r.sprintf(' class="%s"',a['class']),h='px',g=a.width;if(void 0===a.width||t.options.cardView||'string'!=typeof a.width||-1===a.width.indexOf('%')||(h='%'),a.width&&'string'==typeof a.width&&(g=a.width.replace('%','').replace('px','')),l=r.sprintf('text-align: %s; ',a.halign?a.halign:a.align),d=r.sprintf('text-align: %s; ',a.align),c=r.sprintf('vertical-align: %s; ',a.valign),c+=r.sprintf('width: %s; ',(a.checkbox||a.radio)&&!g?a.showSelectTitle?void 0:'36px':g?g+h:void 0),'undefined'!=typeof a.fieldIndex){if(t.header.fields[a.fieldIndex]=a.field,t.header.styles[a.fieldIndex]=d+c,t.header.classes[a.fieldIndex]=p,t.header.formatters[a.fieldIndex]=a.formatter,t.header.events[a.fieldIndex]=a.events,t.header.sorters[a.fieldIndex]=a.sorter,t.header.sortNames[a.fieldIndex]=a.sortName,t.header.cellStyles[a.fieldIndex]=a.cellStyle,t.header.searchables[a.fieldIndex]=a.searchable,!a.visible)return;if(t.options.cardView&&!a.cardVisible)return;e[a.field]=a}o.push('<th'+r.sprintf(' title="%s"',a.titleTooltip),a.checkbox||a.radio?r.sprintf(' class="bs-checkbox %s"',a['class']||''):p,r.sprintf(' style="%s"',l+c),r.sprintf(' rowspan="%s"',a.rowspan),r.sprintf(' colspan="%s"',a.colspan),r.sprintf(' data-field="%s"',a.field),0===i&&0<n?' data-not-first-th':'','>'),o.push(r.sprintf('<div class="th-inner %s">',t.options.sortable&&a.sortable?'sortable both':'')),s=t.options.escape?r.escapeHTML(a.title):a.title;var u=s;a.checkbox&&(s='',!t.options.singleSelect&&t.options.checkboxHeader&&(s='<label><input name="btSelectAll" type="checkbox" /><span></span></label>'),t.header.stateField=a.field),a.radio&&(s='',t.header.stateField=a.field,t.options.singleSelect=!0),!s&&a.showSelectTitle&&(s+=u),o.push(s),o.push('</div>'),o.push('<div class="fht-cell"></div>'),o.push('</div>'),o.push('</th>')}),o.push('</tr>')}),this.$header.html(o.join('')),this.$header.find('th[data-field]').each(function(t,o){s(o).data(e[s(o).data('field')])}),this.$container.off('click','.th-inner').on('click','.th-inner',function(o){var e=s(o.currentTarget);return t.options.detailView&&!e.parent().hasClass('bs-checkbox')&&e.closest('.bootstrap-table')[0]!==t.$container[0]?!1:void(t.options.sortable&&e.parent().data().sortable&&t.onSort(o))}),this.$header.children().children().off('keypress').on('keypress',function(o){if(t.options.sortable&&s(o.currentTarget).data().sortable){var e=o.keyCode||o.which;13===e&&t.onSort(o)}}),s(window).off('resize.bootstrap-table'),!this.options.showHeader||this.options.cardView?(this.$header.hide(),this.$tableHeader.hide(),this.$tableLoading.css('top',0)):(this.$header.show(),this.$tableHeader.show(),this.$tableLoading.css('top',this.$header.outerHeight()+1),this.getCaret(),s(window).on('resize.bootstrap-table',function(o){return t.resetWidth(o)})),this.$selectAll=this.$header.find('[name="btSelectAll"]'),this.$selectAll.off('click').on('click',function(e){var o=e.currentTarget,a=s(o).prop('checked');t[a?'checkAll':'uncheckAll'](),t.updateSelected()})}},{key:'initFooter',value:function(){!this.options.showFooter||this.options.cardView?this.$tableFooter.hide():this.$tableFooter.show()}},{key:'initData',value:function(e,t){this.options.data='append'===t?this.options.data.concat(e):'prepend'===t?[].concat(e).concat(this.options.data):e||this.options.data,this.data=this.options.data,'server'===this.options.sidePagination||this.initSort()}},{key:'initSort',value:function(){var e=this,t=this.options.sortName,o='desc'===this.options.sortOrder?-1:1,i=this.header.fields.indexOf(this.options.sortName),a=0;-1!==i&&(this.options.sortStable&&this.data.forEach(function(e,t){e.hasOwnProperty('_position')||(e._position=t)}),this.options.customSort?r.calculateObjectValue(this.options,this.options.customSort,[this.options.sortName,this.options.sortOrder,this.data]):this.data.sort(function(n,a){e.header.sortNames[i]&&(t=e.header.sortNames[i]);var s=r.getItemField(n,t,e.options.escape),l=r.getItemField(a,t,e.options.escape),d=r.calculateObjectValue(e.header,e.header.sorters[i],[s,l,n,a]);return void 0===d?((void 0===s||null===s)&&(s=''),(void 0===l||null===l)&&(l=''),e.options.sortStable&&s===l&&(s=n._position,l=a._position),r.isNumeric(s)&&r.isNumeric(l))?(s=parseFloat(s),l=parseFloat(l),s<l?-1*o:s>l?o:0):s===l?0:('string'!=typeof s&&(s=s.toString()),-1===s.localeCompare(l)?-1*o:o):e.options.sortStable&&0===d?o*(n._position-a._position):o*d}),void 0!==this.options.sortClass&&(clearTimeout(a),a=setTimeout(function(){e.$el.removeClass(e.options.sortClass);var t=e.$header.find('[data-field="'+e.options.sortName+'"]').index();e.$el.find('tr td:nth-child('+(t+1)+')').addClass(e.options.sortClass)},250)))}},{key:'onSort',value:function(e){var t=e.type,o=e.currentTarget,a='keypress'===t?s(o):s(o).parent(),i=this.$header.find('th').eq(a.index());return this.$header.add(this.$header_).find('span.order').remove(),this.options.sortName===a.data('field')?this.options.sortOrder='asc'===this.options.sortOrder?'desc':'asc':(this.options.sortName=a.data('field'),this.options.sortOrder=this.options.rememberOrder?'asc'===a.data('order')?'desc':'asc':this.columns[this.fieldsColumnsIndex[a.data('field')]].order),this.trigger('sort',this.options.sortName,this.options.sortOrder),a.add(i).data('order',this.options.sortOrder),this.getCaret(),'server'===this.options.sidePagination?void this.initServer(this.options.silentSort):void(this.initSort(),this.initBody())}},{key:'initToolbar',value:function(){var e=this,t=this.options,o=[],a=0,i=void 0,l=void 0,d=0;this.$toolbar.find('.bs-bars').children().length&&s('body').append(s(t.toolbar)),this.$toolbar.html(''),('string'==typeof t.toolbar||'object'===n(t.toolbar))&&s(r.sprintf('<div class="bs-bars %s-%s"></div>',this.constants.classes.pull,t.toolbarAlign)).appendTo(this.$toolbar).append(s(t.toolbar)),o=['<div class="'+['columns','columns-'+t.buttonsAlign,this.constants.classes.buttonsGroup,this.constants.classes.pull+'-'+t.buttonsAlign].join(' ')+'">'],'string'==typeof t.icons&&(t.icons=r.calculateObjectValue(null,t.icons)),t.showPaginationSwitch&&o.push('<button class="'+this.constants.buttonsClass+'" type="button" name="paginationSwitch"\n          aria-label="Pagination Switch" title="'+t.formatPaginationSwitch()+'">\n          '+r.sprintf(this.constants.html.icon,t.iconsPrefix,t.icons.paginationSwitchDown)+'\n          </button>'),t.showRefresh&&o.push('<button class="'+this.constants.buttonsClass+'" type="button" name="refresh"\n          aria-label="Refresh" title="'+t.formatRefresh()+'">\n          '+r.sprintf(this.constants.html.icon,t.iconsPrefix,t.icons.refresh)+'\n          </button>'),t.showToggle&&o.push('<button class="'+this.constants.buttonsClass+'" type="button" name="toggle"\n          aria-label="Toggle" title="'+t.formatToggle()+'">\n          '+r.sprintf(this.constants.html.icon,t.iconsPrefix,t.icons.toggleOff)+'\n          </button>'),t.showFullscreen&&o.push('<button class="'+this.constants.buttonsClass+'" type="button" name="fullscreen"\n          aria-label="Fullscreen" title="'+t.formatFullscreen()+'">\n          '+r.sprintf(this.constants.html.icon,t.iconsPrefix,t.icons.fullscreen)+'\n          </button>'),t.showColumns&&(o.push('<div class="keep-open '+this.constants.classes.buttonsDropdown+'" title="'+t.formatColumns()+'">\n          <button class="'+this.constants.buttonsClass+' dropdown-toggle" type="button" data-toggle="dropdown"\n          aria-label="Columns" title="'+t.formatFullscreen()+'">\n          '+r.sprintf(this.constants.html.icon,t.iconsPrefix,t.icons.columns)+'\n          '+this.constants.html.dropdownCaret+'\n          </button>\n          '+this.constants.html.toobarDropdow[0]),this.columns.forEach(function(a,n){if(!(a.radio||a.checkbox)&&(!t.cardView||a.cardVisible)){var i=a.visible?' checked="checked"':'';a.switchable&&(o.push(r.sprintf(e.constants.html.toobarDropdowItem,r.sprintf('<input type="checkbox" data-field="%s" value="%s"%s> <span>%s</span>',a.field,n,i,a.title))),d++)}}),o.push(this.constants.html.toobarDropdow[1],'</div>')),o.push('</div>'),(this.showToolbar||2<o.length)&&this.$toolbar.append(o.join('')),t.showPaginationSwitch&&this.$toolbar.find('button[name="paginationSwitch"]').off('click').on('click',function(){return e.togglePagination()}),t.showFullscreen&&this.$toolbar.find('button[name="fullscreen"]').off('click').on('click',function(){return e.toggleFullscreen()}),t.showRefresh&&this.$toolbar.find('button[name="refresh"]').off('click').on('click',function(){return e.refresh()}),t.showToggle&&this.$toolbar.find('button[name="toggle"]').off('click').on('click',function(){e.toggleView()}),t.showColumns&&(i=this.$toolbar.find('.keep-open'),d<=t.minimumCountColumns&&i.find('input').prop('disabled',!0),i.find('li, label').off('click').on('click',function(t){t.stopImmediatePropagation()}),i.find('input').off('click').on('click',function(t){var o=t.currentTarget,a=s(o);e.toggleColumn(a.val(),a.prop('checked'),!1),e.trigger('column-switch',a.data('field'),a.prop('checked'))})),t.search&&(o=[],o.push('<div class="'+this.constants.classes.pull+'-'+t.searchAlign+' search '+this.constants.classes.inputGroup+'">\n          <input class="'+this.constants.classes.input+r.sprintf(' input-%s',t.iconSize)+'"\n          type="text" placeholder="'+t.formatSearch()+'">\n          </div>'),this.$toolbar.append(o.join('')),l=this.$toolbar.find('.search input'),l.off('keyup drop blur').on('keyup drop blur',function(o){t.searchOnEnterKey&&13!==o.keyCode||-1!==[37,38,39,40].indexOf(o.keyCode)||(clearTimeout(a),a=setTimeout(function(){e.onSearch(o)},t.searchTimeOut))}),r.isIEBrowser()&&l.off('mouseup').on('mouseup',function(o){clearTimeout(a),a=setTimeout(function(){e.onSearch(o)},t.searchTimeOut)}))}},{key:'onSearch',value:function(e){var t=e.currentTarget,o=e.firedByInitSearchText,a=s(t).val().trim();this.options.trimOnSearch&&s(t).val()!==a&&s(t).val(a),a===this.searchText||(this.searchText=a,this.options.searchText=a,!o&&(this.options.pageNumber=1),this.initSearch(),o?'client'===this.options.sidePagination&&this.updatePagination():this.updatePagination(),this.trigger('search',a))}},{key:'initSearch',value:function(){var e=this;if('server'!==this.options.sidePagination){if(this.options.customSearch)return void(this.data=r.calculateObjectValue(this.options,this.options.customSearch,[this.options.data,this.searchText]));var t=this.searchText&&(this.options.escape?r.escapeHTML(this.searchText):this.searchText).toLowerCase(),o=r.isEmptyObject(this.filterColumns)?null:this.filterColumns;this.data=o?this.options.data.filter(function(e){for(var t in o)if(Array.isArray(o[t])&&-1===o[t].indexOf(e[t])||!Array.isArray(o[t])&&e[t]!==o[t])return!1;return!0}):this.options.data,this.data=t?this.data.filter(function(o,a){for(var c=0;c<e.header.fields.length;c++)if(e.header.searchables[c]){var i=r.isNumeric(e.header.fields[c])?parseInt(e.header.fields[c],10):e.header.fields[c],n=e.columns[e.fieldsColumnsIndex[i]],s=void 0;if('string'==typeof i){s=o;for(var l=i.split('.'),d=0;d<l.length;d++)null!==s[l[d]]&&(s=s[l[d]])}else s=o[i];if(n&&n.searchFormatter&&(s=r.calculateObjectValue(n,e.header.formatters[c],[s,o,a],s)),'string'==typeof s||'number'==typeof s)if(e.options.strictSearch){if((''+s).toLowerCase()===t)return!0;}else if(-1!==(''+s).toLowerCase().indexOf(t))return!0}return!1}):this.data}}},{key:'initPagination',value:function(){var e=Math.round,t=this,a=this.options;if(!a.pagination)return void this.$pagination.hide();this.$pagination.show();var o=[],n=!1,s=void 0,i=void 0,l=void 0,d=void 0,c=void 0,p=void 0,h=void 0,g=this.getData(),u=a.pageList;if('server'!==a.sidePagination&&(a.totalRows=g.length),this.totalPages=0,a.totalRows){if(a.pageSize===a.formatAllRows())a.pageSize=a.totalRows,n=!0;else if(a.pageSize===a.totalRows){var $='string'==typeof a.pageList?a.pageList.replace('[','').replace(']','').replace(/ /g,'').toLowerCase().split(','):a.pageList;-1!==$.indexOf(a.formatAllRows().toLowerCase())&&(n=!0)}this.totalPages=~~((a.totalRows-1)/a.pageSize)+1,a.totalPages=this.totalPages}0<this.totalPages&&a.pageNumber>this.totalPages&&(a.pageNumber=this.totalPages),this.pageFrom=(a.pageNumber-1)*a.pageSize+1,this.pageTo=a.pageNumber*a.pageSize,this.pageTo>a.totalRows&&(this.pageTo=a.totalRows);var f=a.onlyInfoPagination?a.formatDetailPagination(a.totalRows):a.formatShowingRows(this.pageFrom,this.pageTo,a.totalRows);if(o.push('<div class="'+this.constants.classes.pull+'-'+a.paginationDetailHAlign+' pagination-detail">\n        <span class="pagination-info">\n        '+f+'\n        </span>'),!a.onlyInfoPagination){o.push('<span class="page-list">');var P=['<span class="'+this.constants.classes.paginationDropdown+'">\n          <button class="'+this.constants.buttonsClass+' dropdown-toggle" type="button" data-toggle="dropdown">\n          <span class="page-size">\n          '+(n?a.formatAllRows():a.pageSize)+'\n          </span>\n          '+this.constants.html.dropdownCaret+'\n          </button>\n          '+this.constants.html.pageDropdown[0]];if('string'==typeof a.pageList){var C=a.pageList.replace('[','').replace(']','').replace(/ /g,'').split(',');u=[];for(var b=C,m=Array.isArray(b),y=0,_iterator9=m?b:b[Symbol.iterator]();;){var w;if(m){if(y>=b.length)break;w=b[y++]}else{if(y=b.next(),y.done)break;w=y.value}var k=w;u.push(k.toUpperCase()===a.formatAllRows().toUpperCase()||'UNLIMITED'===k.toUpperCase()?a.formatAllRows():+k)}}u.forEach(function(e,o){if(!a.smartDisplay||0===o||u[o-1]<a.totalRows){var i;i=n?e===a.formatAllRows()?t.constants.classes.dropdownActive:'':e===a.pageSize?t.constants.classes.dropdownActive:'',P.push(r.sprintf(t.constants.html.pageDropdownItem,i,e))}}),P.push(this.constants.html.pageDropdown[1]+'</span>'),o.push(a.formatRecordsPerPage(P.join(''))),o.push('</span></div>'),o.push('<div class="'+this.constants.classes.pull+'-'+a.paginationHAlign+' pagination">',r.sprintf(this.constants.html.pagination[0],r.sprintf(' pagination-%s',a.iconSize)),r.sprintf(this.constants.html.paginationItem,' page-pre',a.paginationPreText)),this.totalPages<a.paginationSuccessivelySize?(i=1,l=this.totalPages):(i=a.pageNumber-a.paginationPagesBySide,l=i+2*a.paginationPagesBySide),a.pageNumber<a.paginationSuccessivelySize-1&&(l=a.paginationSuccessivelySize),l>this.totalPages&&(l=this.totalPages),a.paginationSuccessivelySize>this.totalPages-i&&(i=i-(a.paginationSuccessivelySize-(this.totalPages-i))+1),1>i&&(i=1),l>this.totalPages&&(l=this.totalPages);var v=e(a.paginationPagesBySide/2),x=function(e){var o=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'';return r.sprintf(t.constants.html.paginationItem,o+(e===a.pageNumber?' '+t.constants.classes.paginationActive:''),e)};if(1<i){var T=a.paginationPagesBySide;for(T>=i&&(T=i-1),s=1;s<=T;s++)o.push(x(s));i-1===T+1?(s=i-1,o.push(x(s))):i-1>T&&(i-2*a.paginationPagesBySide>a.paginationPagesBySide&&a.paginationUseIntermediate?(s=e((i-v)/2+v),o.push(x(s,' page-intermediate'))):o.push(r.sprintf(this.constants.html.paginationItem,' page-first-separator disabled','...')))}for(s=i;s<=l;s++)o.push(x(s));if(this.totalPages>l){var A=this.totalPages-(a.paginationPagesBySide-1);for(l>=A&&(A=l+1),l+1===A-1?(s=l+1,o.push(x(s))):A>l+1&&(this.totalPages-l>2*a.paginationPagesBySide&&a.paginationUseIntermediate?(s=e((this.totalPages-v-l)/2+l),o.push(x(s,' page-intermediate'))):o.push(r.sprintf(this.constants.html.paginationItem,' page-last-separator disabled','...'))),s=A;s<=this.totalPages;s++)o.push(x(s))}o.push(r.sprintf(this.constants.html.paginationItem,' page-next',a.paginationNextText)),o.push(this.constants.html.pagination[1],'</div>')}this.$pagination.html(o.join(''));var S=-1===['bottom','both'].indexOf(a.paginationVAlign)?'':' '+this.constants.classes.dropup;this.$pagination.last().find('.page-list > span').addClass(S),a.onlyInfoPagination||(d=this.$pagination.find('.page-list a'),c=this.$pagination.find('.page-pre'),p=this.$pagination.find('.page-next'),h=this.$pagination.find('.page-item').not('.page-next, .page-pre'),a.smartDisplay&&(1>=this.totalPages&&this.$pagination.find('div.pagination').hide(),(2>u.length||a.totalRows<=u[0])&&this.$pagination.find('span.page-list').hide(),this.$pagination[this.getData().length?'show':'hide']()),!a.paginationLoop&&(1===a.pageNumber&&c.addClass('disabled'),a.pageNumber===this.totalPages&&p.addClass('disabled')),n&&(a.pageSize=a.formatAllRows()),d.off('click').on('click',function(o){return t.onPageListChange(o)}),c.off('click').on('click',function(o){return t.onPagePre(o)}),p.off('click').on('click',function(o){return t.onPageNext(o)}),h.off('click').on('click',function(o){return t.onPageNumber(o)}))}},{key:'updatePagination',value:function(e){e&&s(e.currentTarget).hasClass('disabled')||(!this.options.maintainSelected&&this.resetRows(),this.initPagination(),'server'===this.options.sidePagination?this.initServer():this.initBody(),this.trigger('page-change',this.options.pageNumber,this.options.pageSize))}},{key:'onPageListChange',value:function(e){e.preventDefault();var t=s(e.currentTarget);return t.parent().addClass(this.constants.classes.dropdownActive).siblings().removeClass(this.constants.classes.dropdownActive),this.options.pageSize=t.text().toUpperCase()===this.options.formatAllRows().toUpperCase()?this.options.formatAllRows():+t.text(),this.$toolbar.find('.page-size').text(this.options.pageSize),this.updatePagination(e),!1}},{key:'onPagePre',value:function(e){return e.preventDefault(),0==this.options.pageNumber-1?this.options.pageNumber=this.options.totalPages:this.options.pageNumber--,this.updatePagination(e),!1}},{key:'onPageNext',value:function(e){return e.preventDefault(),this.options.pageNumber+1>this.options.totalPages?this.options.pageNumber=1:this.options.pageNumber++,this.updatePagination(e),!1}},{key:'onPageNumber',value:function(e){if(e.preventDefault(),this.options.pageNumber!==+s(e.currentTarget).text())return this.options.pageNumber=+s(e.currentTarget).text(),this.updatePagination(e),!1}},{key:'initRow',value:function(e,t){var o=this,i=[],n={},s=[],l='',d={},c=[];if(!(-1<r.findIndex(this.hiddenRows,e))){if(n=r.calculateObjectValue(this.options,this.options.rowStyle,[e,t],n),n&&n.css)for(var p=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(n.css),h=Array.isArray(p),g=0,_iterator10=h?p:p[Symbol.iterator]();;){var u;if(h){if(g>=p.length)break;u=p[g++]}else{if(g=p.next(),g.done)break;u=g.value}var f=u,b=a(f,2),m=b[0],y=b[1];s.push(m+': '+y)}if(d=r.calculateObjectValue(this.options,this.options.rowAttributes,[e,t],d),d)for(var w=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(d),x=Array.isArray(w),S=0,_iterator11=x?w:w[Symbol.iterator]();;){var $;if(x){if(S>=w.length)break;$=w[S++]}else{if(S=w.next(),S.done)break;$=S.value}var P=$,C=a(P,2),T=C[0],A=C[1];c.push(T+'="'+r.escapeHTML(A)+'"')}if(e._data&&!r.isEmptyObject(e._data))for(var O=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(e._data),I=Array.isArray(O),R=0,_iterator12=I?O:O[Symbol.iterator]();;){var _;if(I){if(R>=O.length)break;_=O[R++]}else{if(R=O.next(),R.done)break;_=R.value}var V=_,F=a(V,2),B=F[0],k=F[1];if('index'===B)return;l+=' data-'+B+'="'+k+'"'}return i.push('<tr',r.sprintf(' %s',c.length?c.join(' '):void 0),r.sprintf(' id="%s"',Array.isArray(e)?void 0:e._id),r.sprintf(' class="%s"',n.classes||(Array.isArray(e)?void 0:e._class)),' data-index="'+t+'"',r.sprintf(' data-uniqueid="%s"',e[this.options.uniqueId]),r.sprintf('%s',l),'>'),this.options.cardView&&i.push('<td colspan="'+this.header.fields.length+'"><div class="card-views">'),!this.options.cardView&&this.options.detailView&&(i.push('<td>'),r.calculateObjectValue(null,this.options.detailFilter,[t,e])&&i.push('\n            <a class="detail-icon" href="#">\n            '+r.sprintf(this.constants.html.icon,this.options.iconsPrefix,this.options.icons.detailOpen)+'\n            </a>\n          '),i.push('</td>')),this.header.fields.forEach(function(n,l){var d='',p=r.getItemField(e,n,o.options.escape),h='',g='',u={},f='',b=o.header.classes[l],m='',y='',w='',k='',v='',x=o.columns[l];if((!o.fromHtml||'undefined'!=typeof p||x.checkbox||x.radio)&&x.visible&&(!o.options.cardView||x.cardVisible)){if(x.escape&&(p=r.escapeHTML(p)),s.concat([o.header.styles[l]]).length&&(m=' style="'+s.concat([o.header.styles[l]]).join('; ')+'"'),e['_'+n+'_id']&&(f=r.sprintf(' id="%s"',e['_'+n+'_id'])),e['_'+n+'_class']&&(b=r.sprintf(' class="%s"',e['_'+n+'_class'])),e['_'+n+'_rowspan']&&(w=r.sprintf(' rowspan="%s"',e['_'+n+'_rowspan'])),e['_'+n+'_colspan']&&(k=r.sprintf(' colspan="%s"',e['_'+n+'_colspan'])),e['_'+n+'_title']&&(v=r.sprintf(' title="%s"',e['_'+n+'_title'])),u=r.calculateObjectValue(o.header,o.header.cellStyles[l],[p,e,t,n],u),u.classes&&(b=' class="'+u.classes+'"'),u.css){for(var S=[],$=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(u.css),P=Array.isArray($),C=0,_iterator13=P?$:$[Symbol.iterator]();;){var T;if(P){if(C>=$.length)break;T=$[C++]}else{if(C=$.next(),C.done)break;T=C.value}var A=T,O=a(A,2),I=O[0],R=O[1];S.push(I+': '+R)}m=' style="'+S.concat(o.header.styles[l]).join('; ')+'"'}if(h=r.calculateObjectValue(x,o.header.formatters[l],[p,e,t,n],p),e['_'+n+'_data']&&!r.isEmptyObject(e['_'+n+'_data']))for(var _=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(e['_'+n+'_data']),V=Array.isArray(_),F=0,_iterator14=V?_:_[Symbol.iterator]();;){var B;if(V){if(F>=_.length)break;B=_[F++]}else{if(F=_.next(),F.done)break;B=F.value}var N=B,j=a(N,2),H=j[0],L=j[1];if('index'===H)return;y+=' data-'+H+'="'+L+'"'}if(x.checkbox||x.radio){g=x.checkbox?'checkbox':g,g=x.radio?'radio':g;var D=x['class']||'',c=!0===h||p||h&&h.checked,E=!x.checkboxEnabled||h&&h.disabled;d=[o.options.cardView?'<div class="card-view '+D+'">':'<td class="bs-checkbox '+D+'">','<label>\n              <input\n              data-index="'+t+'"\n              name="'+o.options.selectItemName+'"\n              type="'+g+'"\n              '+r.sprintf('value="%s"',e[o.options.idField])+'\n              '+r.sprintf('checked="%s"',c?'checked':void 0)+'\n              '+r.sprintf('disabled="%s"',E?'disabled':void 0)+' />\n              <span></span>\n              </label>',o.header.formatters[l]&&'string'==typeof h?h:'',o.options.cardView?'</div>':'</td>'].join(''),e[o.header.stateField]=!0===h||!!p||h&&h.checked}else if(h='undefined'==typeof h||null===h?o.options.undefinedText:h,o.options.cardView){var U=o.options.showHeader?'<span class="card-view-title"'+m+'>'+r.getFieldTitle(o.columns,n)+'</span>':'';d='<div class="card-view">'+U+'<span class="card-view-value">'+h+'</span></div>',o.options.smartDisplay&&''===h&&(d='<div class="card-view"></div>')}else d='<td'+f+b+m+y+w+k+v+'>'+h+'</td>';i.push(d)}}),this.options.cardView&&i.push('</div></td>'),i.push('</tr>'),i.join('')}}},{key:'initBody',value:function(e){var t=this,o=this.getData();this.trigger('pre-body',o),this.$body=this.$el.find('>tbody'),this.$body.length||(this.$body=s('<tbody></tbody>').appendTo(this.$el)),this.options.pagination&&'server'!==this.options.sidePagination||(this.pageFrom=1,this.pageTo=o.length);for(var n=s(document.createDocumentFragment()),l=!1,d=this.pageFrom-1;d<this.pageTo;d++){var i=o[d],c=this.initRow(i,d,o,n);l=l||!!c,c&&'string'==typeof c&&n.append(c)}l?this.$body.html(n):this.$body.html('<tr class="no-records-found">'+r.sprintf('<td colspan="%s">%s</td>',this.$header.find('th').length,this.options.formatNoMatches())+'</tr>'),e||this.scrollTo(0),this.$body.find('> tr[data-index] > td').off('click dblclick').on('click dblclick',function(e){var o=e.currentTarget,a=e.type,i=e.target,n=s(o),l=n.parent(),d=s(i).parents('.card-views').children(),c=s(i).parents('.card-view'),p=t.data[l.data('index')],h=t.options.cardView?d.index(c):n[0].cellIndex,g=t.getVisibleFields(),u=g[t.options.detailView&&!t.options.cardView?h-1:h],f=t.columns[t.fieldsColumnsIndex[u]],b=r.getItemField(p,u,t.options.escape);if(!n.find('.detail-icon').length&&(t.trigger('click'===a?'click-cell':'dbl-click-cell',u,b,p,n),t.trigger('click'===a?'click-row':'dbl-click-row',p,l,u),'click'===a&&t.options.clickToSelect&&f.clickToSelect&&!r.calculateObjectValue(t.options,t.options.ignoreClickToSelectOn,[i]))){var m=l.find(r.sprintf('[name="%s"]',t.options.selectItemName));m.length&&m[0].click()}}),this.$body.find('> tr[data-index] > td > .detail-icon').off('click').on('click',function(a){a.preventDefault();var e=s(a.currentTarget),i=e.parent().parent(),n=i.data('index'),l=o[n];if(i.next().is('tr.detail-view'))e.html(r.sprintf(t.constants.html.icon,t.options.iconsPrefix,t.options.icons.detailOpen)),t.trigger('collapse-row',n,l,i.next()),i.next().remove();else{e.html(r.sprintf(t.constants.html.icon,t.options.iconsPrefix,t.options.icons.detailClose)),i.after(r.sprintf('<tr class="detail-view"><td colspan="%s"></td></tr>',i.children('td').length));var d=i.next().find('td'),c=r.calculateObjectValue(t.options,t.options.detailFormatter,[n,l,d],'');1===d.length&&d.append(c),t.trigger('expand-row',n,l,d)}return t.resetView(),!1}),this.$selectItem=this.$body.find(r.sprintf('[name="%s"]',this.options.selectItemName)),this.$selectItem.off('click').on('click',function(o){o.stopImmediatePropagation();var e=s(o.currentTarget);t.check_(e.prop('checked'),e.data('index'))}),this.header.events.forEach(function(e,o){var i=e;if(i){'string'==typeof i&&(i=r.calculateObjectValue(null,i));var n=t.header.fields[o],l=t.getVisibleFields().indexOf(n);if(-1!==l){t.options.detailView&&!t.options.cardView&&(l+=1);for(var d=function(){if(p){if(h>=c.length)return'break';g=c[h++]}else{if(h=c.next(),h.done)return'break';g=h.value}var e=g,o=a(e,2),r=o[0],i=o[1];t.$body.find('>tr:not(.no-records-found)').each(function(e,o){var a=s(o),d=a.find(t.options.cardView?'.card-view':'td').eq(l),c=r.indexOf(' '),p=r.substring(0,c),h=r.substring(c+1);d.find(h).off(p).on(p,function(o){var e=a.data('index'),s=t.data[e],l=s[n];i.apply(t,[o,l,s,e])})})},c=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(i),p=Array.isArray(c),h=0,_iterator15=p?c:c[Symbol.iterator]();;){var g,u=d();if('break'===u)break}}}}),this.updateSelected(),this.resetView(),this.trigger('post-body',o)}},{key:'initServer',value:function(e,t,o){var a=this,i={},n=this.header.fields.indexOf(this.options.sortName),l={searchText:this.searchText,sortName:this.options.sortName,sortOrder:this.options.sortOrder};if((this.header.sortNames[n]&&(l.sortName=this.header.sortNames[n]),this.options.pagination&&'server'===this.options.sidePagination&&(l.pageSize=this.options.pageSize===this.options.formatAllRows()?this.options.totalRows:this.options.pageSize,l.pageNumber=this.options.pageNumber),o||this.options.url||this.options.ajax)&&('limit'===this.options.queryParamsType&&(l={search:l.searchText,sort:l.sortName,order:l.sortOrder},this.options.pagination&&'server'===this.options.sidePagination&&(l.offset=this.options.pageSize===this.options.formatAllRows()?0:this.options.pageSize*(this.options.pageNumber-1),l.limit=this.options.pageSize===this.options.formatAllRows()?this.options.totalRows:this.options.pageSize,0===l.limit&&delete l.limit)),r.isEmptyObject(this.filterColumnsPartial)||(l.filter=JSON.stringify(this.filterColumnsPartial,null)),i=r.calculateObjectValue(this.options,this.options.queryParams,[l],i),s.extend(i,t||{}),!1!==i)){e||this.showLoading();var d=s.extend({},r.calculateObjectValue(null,this.options.ajaxOptions),{type:this.options.method,url:o||this.options.url,data:'application/json'===this.options.contentType&&'post'===this.options.method?JSON.stringify(i):i,cache:this.options.cache,contentType:this.options.contentType,dataType:this.options.dataType,success:function(t){var o=r.calculateObjectValue(a.options,a.options.responseHandler,[t],t);a.load(o),a.trigger('load-success',o),e||a.hideLoading()},error:function(t){var o=[];'server'===a.options.sidePagination&&(o={},o[a.options.totalField]=0,o[a.options.dataField]=[]),a.load(o),a.trigger('load-error',t.status,t),e||a.$tableLoading.hide()}});return this.options.ajax?r.calculateObjectValue(this,this.options.ajax,[d],null):(this._xhr&&4!==this._xhr.readyState&&this._xhr.abort(),this._xhr=s.ajax(d)),i}}},{key:'initSearchText',value:function(){if(this.options.search&&(this.searchText='',''!==this.options.searchText)){var e=this.$toolbar.find('.search input');e.val(this.options.searchText),this.onSearch({currentTarget:e,firedByInitSearchText:!0})}}},{key:'getCaret',value:function(){var e=this;this.$header.find('th').each(function(t,o){s(o).find('.sortable').removeClass('desc asc').addClass(s(o).data('field')===e.options.sortName?e.options.sortOrder:'both')})}},{key:'updateSelected',value:function(){var e=this.$selectItem.filter(':enabled').length&&this.$selectItem.filter(':enabled').length===this.$selectItem.filter(':enabled').filter(':checked').length;this.$selectAll.add(this.$selectAll_).prop('checked',e),this.$selectItem.each(function(e,t){s(t).closest('tr')[s(t).prop('checked')?'addClass':'removeClass']('selected')})}},{key:'updateRows',value:function(){var e=this;this.$selectItem.each(function(t,o){e.data[s(o).data('index')][e.header.stateField]=s(o).prop('checked')})}},{key:'resetRows',value:function(){for(var e=this.data,t=Array.isArray(e),o=0,_iterator16=t?e:e[Symbol.iterator]();;){var a;if(t){if(o>=e.length)break;a=e[o++]}else{if(o=e.next(),o.done)break;a=o.value}var i=a;this.$selectAll.prop('checked',!1),this.$selectItem.prop('checked',!1),this.header.stateField&&(i[this.header.stateField]=!1)}this.initHiddenRows()}},{key:'trigger',value:function(e){for(var o,a=e+'.bs.table',i=arguments.length,n=Array(1<i?i-1:0),l=1;l<i;l++)n[l-1]=arguments[l];(o=this.options)[t.EVENTS[a]].apply(o,n),this.$el.trigger(s.Event(a),n),this.options.onAll(a,n),this.$el.trigger(s.Event('all.bs.table'),[a,n])}},{key:'resetHeader',value:function(){var e=this;clearTimeout(this.timeoutId_),this.timeoutId_=setTimeout(function(){return e.fitHeader()},this.$el.is(':hidden')?100:0)}},{key:'fitHeader',value:function(){var e=this;if(this.$el.is(':hidden'))return void(this.timeoutId_=setTimeout(function(){return e.fitHeader()},100));var t=this.$tableBody.get(0),o=t.scrollWidth>t.clientWidth&&t.scrollHeight>t.clientHeight+this.$header.outerHeight()?r.getScrollBarWidth():0;this.$el.css('margin-top',-this.$header.outerHeight());var a=s(':focus');if(0<a.length){var c=a.parents('th');if(0<c.length){var p=c.attr('data-field');if(void 0!==p){var h=this.$header.find('[data-field=\''+p+'\']');0<h.length&&h.find(':input').addClass('focus-temp')}}}this.$header_=this.$header.clone(!0,!0),this.$selectAll_=this.$header_.find('[name="btSelectAll"]'),this.$tableHeader.css('margin-right',o).find('table').css('width',this.$el.outerWidth()).html('').attr('class',this.$el.attr('class')).append(this.$header_),this.$tableLoading.css('width',this.$el.outerWidth());var i=s('.focus-temp:visible:eq(0)');0<i.length&&(i.focus(),this.$header.find('.focus-temp').removeClass('focus-temp')),this.$header.find('th[data-field]').each(function(t,o){e.$header_.find(r.sprintf('th[data-field="%s"]',s(o).data('field'))).data(s(o).data())});for(var n=this.getVisibleFields(),l=this.$header_.find('th'),d=this.$body.find('>tr:first-child:not(.no-records-found)');d.length&&d.find('>td[colspan]:not([colspan="1"])').length;)d=d.next();d.find('> *').each(function(t,o){var a=s(o),i=t;if(e.options.detailView&&!e.options.cardView){if(0===t){var d=l.filter('.detail'),c=d.width()-d.find('.fht-cell').width();d.find('.fht-cell').width(a.innerWidth()-c)}i=t-1}if(-1!==i){var p=e.$header_.find(r.sprintf('th[data-field="%s"]',n[i]));1<p.length&&(p=s(l[a[0].cellIndex]));var h=p.width()-p.find('.fht-cell').width();p.find('.fht-cell').width(a.innerWidth()-h)}}),this.horizontalScroll(),this.trigger('post-header')}},{key:'resetFooter',value:function(){var e=this.getData(),t=[];if(this.options.showFooter&&!this.options.cardView){!this.options.cardView&&this.options.detailView&&t.push('<th class="detail"><div class="th-inner"></div><div class="fht-cell"></div></th>');for(var o=this.columns,i=Array.isArray(o),n=0,_iterator17=i?o:o[Symbol.iterator]();;){var s;if(i){if(n>=o.length)break;s=o[n++]}else{if(n=o.next(),n.done)break;s=n.value}var l=s,d='',c='',p=[],h={},g=r.sprintf(' class="%s"',l['class']);if(l.visible){if(this.options.cardView&&!l.cardVisible)return;if(d=r.sprintf('text-align: %s; ',l.falign?l.falign:l.align),c=r.sprintf('vertical-align: %s; ',l.valign),h=r.calculateObjectValue(null,this.options.footerStyle,[l]),h&&h.css)for(var u=function(e){return Object.keys(e).map(function(t){return[t,e[t]]})}(h.css),f=Array.isArray(u),b=0,_iterator18=f?u:u[Symbol.iterator]();;){var m;if(f){if(b>=u.length)break;m=u[b++]}else{if(b=u.next(),b.done)break;m=b.value}var y=m,w=a(y,2),k=w[0],v=w[1];p.push(k+': '+v)}h&&h.classes&&(g=r.sprintf(' class="%s"',l['class']?[l['class'],h.classes].join(' '):h.classes)),t.push('<th',g,r.sprintf(' style="%s"',d+c+p.concat().join('; ')),'>'),t.push('<div class="th-inner">'),t.push(r.calculateObjectValue(l,l.footerFormatter,[e],'')),t.push('</div>'),t.push('<div class="fht-cell"></div>'),t.push('</div>'),t.push('</th>')}}this.$tableFooter.find('tr').html(t.join('')),this.$tableFooter.show(),this.fitFooter()}}},{key:'fitFooter',value:function(){var e=this;if(this.$el.is(':hidden'))return void setTimeout(function(){return e.fitFooter()},100);var t=this.$tableBody.get(0),o=t.scrollWidth>t.clientWidth&&t.scrollHeight>t.clientHeight+this.$header.outerHeight()?r.getScrollBarWidth():0;this.$tableFooter.css('margin-right',o).find('table').css('width',this.$el.outerWidth()).attr('class',this.$el.attr('class'));for(var a=this.getVisibleFields(),n=this.$tableFooter.find('th'),i=this.$body.find('>tr:first-child:not(.no-records-found)');i.length&&i.find('>td[colspan]:not([colspan="1"])').length;)i=i.next();i.find('> *').each(function(t,o){var a=s(o),i=t;if(e.options.detailView&&!e.options.cardView){if(0===t){var l=n.filter('.detail'),r=l.width()-l.find('.fht-cell').width();l.find('.fht-cell').width(a.innerWidth()-r)}i=t-1}if(-1!==i){var d=n.eq(t),c=d.width()-d.find('.fht-cell').width();d.find('.fht-cell').width(a.innerWidth()-c)}}),this.horizontalScroll()}},{key:'horizontalScroll',value:function(){var e=this;this.trigger('scroll-body'),this.$tableBody.off('scroll').on('scroll',function(t){var o=t.currentTarget;e.options.showHeader&&e.options.height&&e.$tableHeader.scrollLeft(s(o).scrollLeft()),e.options.showFooter&&!e.options.cardView&&e.$tableFooter.scrollLeft(s(o).scrollLeft())})}},{key:'toggleColumn',value:function(e,t,o){if(-1!==e&&(this.columns[e].visible=t,this.initHeader(),this.initSearch(),this.initPagination(),this.initBody(),this.options.showColumns)){var a=this.$toolbar.find('.keep-open input').prop('disabled',!1);o&&a.filter(r.sprintf('[value="%s"]',e)).prop('checked',t),a.filter(':checked').length<=this.options.minimumCountColumns&&a.filter(':checked').prop('disabled',!0)}}},{key:'getVisibleFields',value:function(){for(var e=[],t=this.header.fields,o=Array.isArray(t),a=0,_iterator19=o?t:t[Symbol.iterator]();;){var i;if(o){if(a>=t.length)break;i=t[a++]}else{if(a=t.next(),a.done)break;i=a.value}var n=i,s=this.columns[this.fieldsColumnsIndex[n]];s.visible&&e.push(n)}return e}},{key:'resetView',value:function(e){var t=0;if(e&&e.height&&(this.options.height=e.height),this.$selectAll.prop('checked',0<this.$selectItem.length&&this.$selectItem.length===this.$selectItem.filter(':checked').length),this.options.cardView)return this.$el.css('margin-top','0'),this.$tableContainer.css('padding-bottom','0'),void this.$tableFooter.hide();if(this.options.showHeader&&this.options.height?(this.$tableHeader.show(),this.resetHeader(),t+=this.$header.outerHeight(!0)):(this.$tableHeader.hide(),this.trigger('post-header')),this.options.showFooter&&(this.resetFooter(),this.options.height&&(t+=this.$tableFooter.outerHeight(!0))),this.options.height){var o=this.$toolbar.outerHeight(!0),a=this.$pagination.outerHeight(!0),i=this.options.height-o-a,n=this.$tableBody.find('table').outerHeight(!0);this.$tableContainer.css('height',i+'px'),this.$tableBorder&&this.$tableBorder.css('height',i-n-t-1+'px')}this.getCaret(),this.$tableContainer.css('padding-bottom',t+'px'),this.trigger('reset-view')}},{key:'getData',value:function(e){var t=this.options.data;return(this.searchText||this.options.sortName||!r.isEmptyObject(this.filterColumns)||!r.isEmptyObject(this.filterColumnsPartial))&&(t=this.data),e?t.slice(this.pageFrom-1,this.pageTo):t}},{key:'load',value:function(e){var t=!1,o=e;this.options.pagination&&'server'===this.options.sidePagination&&(this.options.totalRows=o[this.options.totalField]),t=o.fixedScroll,o=Array.isArray(o)?o:o[this.options.dataField],this.initData(o),this.initSearch(),this.initPagination(),this.initBody(t)}},{key:'append',value:function(e){this.initData(e,'append'),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)}},{key:'prepend',value:function(e){this.initData(e,'prepend'),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)}},{key:'remove',value:function(e){var t=this.options.data.length,o=void 0,a=void 0;if(e.hasOwnProperty('field')&&e.hasOwnProperty('values')){for(o=t-1;0<=o;o--)(a=this.options.data[o],!!a.hasOwnProperty(e.field))&&-1!==e.values.indexOf(a[e.field])&&(this.options.data.splice(o,1),'server'===this.options.sidePagination&&(this.options.totalRows-=1));t===this.options.data.length||(this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0))}}},{key:'removeAll',value:function(){0<this.options.data.length&&(this.options.data.splice(0,this.options.data.length),this.initSearch(),this.initPagination(),this.initBody(!0))}},{key:'getRowByUniqueId',value:function(e){var t=this.options.uniqueId,o=this.options.data.length,a=e,n=null,s=void 0,i=void 0,l=void 0;for(s=o-1;0<=s;s--){if(i=this.options.data[s],i.hasOwnProperty(t))l=i[t];else if(i._data&&i._data.hasOwnProperty(t))l=i._data[t];else continue;if('string'==typeof l?a=a.toString():'number'==typeof l&&(+l===l&&0==l%1?a=parseInt(a):l===+l&&0!==l&&(a=parseFloat(a))),l===a){n=i;break}}return n}},{key:'removeByUniqueId',value:function(e){var t=this.options.data.length,o=this.getRowByUniqueId(e);o&&this.options.data.splice(this.options.data.indexOf(o),1),t===this.options.data.length||(this.initSearch(),this.initPagination(),this.initBody(!0))}},{key:'updateByUniqueId',value:function(e){for(var t=Array.isArray(e)?e:[e],o=t,a=Array.isArray(o),i=0,_iterator20=a?o:o[Symbol.iterator]();;){var n;if(a){if(i>=o.length)break;n=o[i++]}else{if(i=o.next(),i.done)break;n=i.value}var l=n;if(l.hasOwnProperty('id')&&l.hasOwnProperty('row')){var r=this.options.data.indexOf(this.getRowByUniqueId(l.id));-1!==r&&s.extend(this.options.data[r],l.row)}}this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)}},{key:'refreshColumnTitle',value:function(e){if(e.hasOwnProperty('field')&&e.hasOwnProperty('title')&&(this.columns[this.fieldsColumnsIndex[e.field]].title=this.options.escape?r.escapeHTML(e.title):e.title,this.columns[this.fieldsColumnsIndex[e.field]].visible)){var t=void 0===this.options.height?this.$header:this.$tableHeader;t.find('th[data-field]').each(function(t,o){if(s(o).data('field')===e.field)return s(s(o).find('.th-inner')[0]).text(e.title),!1})}}},{key:'insertRow',value:function(e){e.hasOwnProperty('index')&&e.hasOwnProperty('row')&&(this.options.data.splice(e.index,0,e.row),this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0))}},{key:'updateRow',value:function(e){for(var t=Array.isArray(e)?e:[e],o=t,a=Array.isArray(o),i=0,_iterator21=a?o:o[Symbol.iterator]();;){var n;if(a){if(i>=o.length)break;n=o[i++]}else{if(i=o.next(),i.done)break;n=i.value}var l=n;l.hasOwnProperty('index')&&l.hasOwnProperty('row')&&s.extend(this.options.data[l.index],l.row)}this.initSearch(),this.initPagination(),this.initSort(),this.initBody(!0)}},{key:'initHiddenRows',value:function(){this.hiddenRows=[]}},{key:'showRow',value:function(e){this.toggleRow(e,!0)}},{key:'hideRow',value:function(e){this.toggleRow(e,!1)}},{key:'toggleRow',value:function(e,t){var o;if(e.hasOwnProperty('index')?o=this.getData()[e.index]:e.hasOwnProperty('uniqueId')&&(o=this.getRowByUniqueId(e.uniqueId)),!!o){var a=r.findIndex(this.hiddenRows,o);t||-1!==a?t&&-1<a&&this.hiddenRows.splice(a,1):this.hiddenRows.push(o),this.initBody(!0)}}},{key:'getHiddenRows',value:function(e){if(e)return this.initHiddenRows(),void this.initBody(!0);for(var t=this.getData(),o=[],a=t,i=Array.isArray(a),n=0,_iterator22=i?a:a[Symbol.iterator]();;){var s;if(i){if(n>=a.length)break;s=a[n++]}else{if(n=a.next(),n.done)break;s=n.value}var l=s;-1!==this.hiddenRows.indexOf(l)&&o.push(l)}return this.hiddenRows=o,o}},{key:'mergeCells',value:function(e){var t=e.index,o=this.getVisibleFields().indexOf(e.field),a=e.rowspan||1,n=e.colspan||1,s=void 0,i=void 0,l=this.$body.find('>tr');this.options.detailView&&!this.options.cardView&&(o+=1);var r=l.eq(t).find('>td').eq(o);if(!(0>t||0>o||t>=this.data.length)){for(s=t;s<t+a;s++)for(i=o;i<o+n;i++)l.eq(s).find('>td').eq(i).hide();r.attr('rowspan',a).attr('colspan',n).show()}}},{key:'updateCell',value:function(e){e.hasOwnProperty('index')&&e.hasOwnProperty('field')&&e.hasOwnProperty('value')&&(this.data[e.index][e.field]=e.value,!1===e.reinit||(this.initSort(),this.initBody(!0)))}},{key:'updateCellById',value:function(e){var t=this;if(e.hasOwnProperty('id')&&e.hasOwnProperty('field')&&e.hasOwnProperty('value')){var o=Array.isArray(e)?e:[e];o.forEach(function(e){var o=e.id,a=e.field,i=e.value,n=t.options.data.indexOf(t.getRowByUniqueId(o));-1===n||(t.data[n][a]=i)}),!1===e.reinit||(this.initSort(),this.initBody(!0))}}},{key:'getOptions',value:function(){var e=JSON.parse(JSON.stringify(this.options));return delete e.data,e}},{key:'getSelections',value:function(){var e=this;return this.options.data.filter(function(t){return!0===t[e.header.stateField]})}},{key:'getAllSelections',value:function(){var e=this;return this.options.data.filter(function(t){return t[e.header.stateField]})}},{key:'checkAll',value:function(){this.checkAll_(!0)}},{key:'uncheckAll',value:function(){this.checkAll_(!1)}},{key:'checkInvert',value:function(){var e=this.$selectItem.filter(':enabled'),t=e.filter(':checked');e.each(function(e,t){s(t).prop('checked',!s(t).prop('checked'))}),this.updateRows(),this.updateSelected(),this.trigger('uncheck-some',t),t=this.getSelections(),this.trigger('check-some',t)}},{key:'checkAll_',value:function(e){var t;e||(t=this.getSelections()),this.$selectAll.add(this.$selectAll_).prop('checked',e),this.$selectItem.filter(':enabled').prop('checked',e),this.updateRows(),e&&(t=this.getSelections()),this.trigger(e?'check-all':'uncheck-all',t)}},{key:'check',value:function(e){this.check_(!0,e)}},{key:'uncheck',value:function(e){this.check_(!1,e)}},{key:'check_',value:function(e,t){var o=this.$selectItem.filter('[data-index="'+t+'"]'),a=this.data[t];if(o.is(':radio')||this.options.singleSelect){for(var i=this.options.data,n=Array.isArray(i),s=0,_iterator23=n?i:i[Symbol.iterator]();;){var l;if(n){if(s>=i.length)break;l=i[s++]}else{if(s=i.next(),s.done)break;l=s.value}var d=l;d[this.header.stateField]=!1}this.$selectItem.filter(':checked').not(o).prop('checked',!1)}a[this.header.stateField]=e,o.prop('checked',e),this.updateSelected(),this.trigger(e?'check':'uncheck',this.data[t],o)}},{key:'checkBy',value:function(e){this.checkBy_(!0,e)}},{key:'uncheckBy',value:function(e){this.checkBy_(!1,e)}},{key:'checkBy_',value:function(e,t){var o=this;if(t.hasOwnProperty('field')&&t.hasOwnProperty('values')){var a=[];this.options.data.forEach(function(n,s){if(!n.hasOwnProperty(t.field))return!1;if(-1!==t.values.indexOf(n[t.field])){var i=o.$selectItem.filter(':enabled').filter(r.sprintf('[data-index="%s"]',s)).prop('checked',e);n[o.header.stateField]=e,a.push(n),o.trigger(e?'check':'uncheck',n,i)}}),this.updateSelected(),this.trigger(e?'check-some':'uncheck-some',a)}}},{key:'destroy',value:function(){this.$el.insertBefore(this.$container),s(this.options.toolbar).insertBefore(this.$el),this.$container.next().remove(),this.$container.remove(),this.$el.html(this.$el_.html()).css('margin-top','0').attr('class',this.$el_.attr('class')||'')}},{key:'showLoading',value:function(){this.$tableLoading.css('display','flex')}},{key:'hideLoading',value:function(){this.$tableLoading.css('display','none')}},{key:'togglePagination',value:function(){this.options.pagination=!this.options.pagination,this.$toolbar.find('button[name="paginationSwitch"]').html(r.sprintf(this.constants.html.icon,this.options.iconsPrefix,this.options.pagination?this.options.icons.paginationSwitchDown:this.options.icons.paginationSwitchUp)),this.updatePagination()}},{key:'toggleFullscreen',value:function(){this.$el.closest('.bootstrap-table').toggleClass('fullscreen'),this.resetView()}},{key:'refresh',value:function(e){e&&e.url&&(this.options.url=e.url),e&&e.pageNumber&&(this.options.pageNumber=e.pageNumber),e&&e.pageSize&&(this.options.pageSize=e.pageSize),this.trigger('refresh',this.initServer(e&&e.silent,e&&e.query,e&&e.url))}},{key:'resetWidth',value:function(){this.options.showHeader&&this.options.height&&this.fitHeader(),this.options.showFooter&&!this.options.cardView&&this.fitFooter()}},{key:'showColumn',value:function(e){this.toggleColumn(this.fieldsColumnsIndex[e],!0,!0)}},{key:'hideColumn',value:function(e){this.toggleColumn(this.fieldsColumnsIndex[e],!1,!0)}},{key:'getHiddenColumns',value:function(){return this.columns.filter(function(e){var t=e.visible;return!t})}},{key:'getVisibleColumns',value:function(){return this.columns.filter(function(e){var t=e.visible;return t})}},{key:'toggleAllColumns',value:function(e){for(var t=this.columns,o=Array.isArray(t),a=0,_iterator24=o?t:t[Symbol.iterator]();;){var i;if(o){if(a>=t.length)break;i=t[a++]}else{if(a=t.next(),a.done)break;i=a.value}var n=i;n.visible=e}if(this.initHeader(),this.initSearch(),this.initPagination(),this.initBody(),this.options.showColumns){var s=this.$toolbar.find('.keep-open input').prop('disabled',!1);s.filter(':checked').length<=this.options.minimumCountColumns&&s.filter(':checked').prop('disabled',!0)}}},{key:'showAllColumns',value:function(){this.toggleAllColumns(!0)}},{key:'hideAllColumns',value:function(){this.toggleAllColumns(!1)}},{key:'filterBy',value:function(e){this.filterColumns=r.isEmptyObject(e)?{}:e,this.options.pageNumber=1,this.initSearch(),this.updatePagination()}},{key:'scrollTo',value:function(e){if('undefined'==typeof e)return this.$tableBody.scrollTop();var t=e;'string'==typeof e&&'bottom'===e&&(t=this.$tableBody[0].scrollHeight),this.$tableBody.scrollTop(t)}},{key:'getScrollPosition',value:function(){return this.scrollTo()}},{key:'selectPage',value:function(e){0<e&&e<=this.options.totalPages&&(this.options.pageNumber=e,this.updatePagination())}},{key:'prevPage',value:function(){1<this.options.pageNumber&&(this.options.pageNumber--,this.updatePagination())}},{key:'nextPage',value:function(){this.options.pageNumber<this.options.totalPages&&(this.options.pageNumber++,this.updatePagination())}},{key:'toggleView',value:function(){this.options.cardView=!this.options.cardView,this.initHeader(),this.$toolbar.find('button[name="toggle"]').html(r.sprintf(this.constants.html.icon,this.options.iconsPrefix,this.options.cardView?this.options.icons.toggleOn:this.options.icons.toggleOff)),this.initBody(),this.trigger('toggle',this.options.cardView)}},{key:'refreshOptions',value:function(e){r.compareObjects(this.options,e,!0)||(this.options=s.extend(this.options,e),this.trigger('refresh-options',this.options),this.destroy(),this.init())}},{key:'resetSearch',value:function(e){var t=this.$toolbar.find('.search input');t.val(e||''),this.onSearch({currentTarget:t})}},{key:'expandRow_',value:function(e,t){var o=this.$body.find(r.sprintf('> tr[data-index="%s"]',t));o.next().is('tr.detail-view')===!e&&o.find('> td > .detail-icon').click()}},{key:'expandRow',value:function(e){this.expandRow_(!0,e)}},{key:'collapseRow',value:function(e){this.expandRow_(!1,e)}},{key:'expandAllRows',value:function(e){var t=this;if(e){var o=this.$body.find(r.sprintf('> tr[data-index="%s"]',0)),a=null,n=!1,l=-1;if(o.next().is('tr.detail-view')?!o.next().next().is('tr.detail-view')&&(o.next().find('.detail-icon').click(),n=!0):(o.find('> td > .detail-icon').click(),n=!0),n)try{l=setInterval(function(){a=t.$body.find('tr.detail-view').last().find('.detail-icon'),0<a.length?a.click():clearInterval(l)},1)}catch(e){clearInterval(l)}}else for(var d=this.$body.children(),c=0;c<d.length;c++)this.expandRow_(!0,s(d[c]).data('index'))}},{key:'collapseAllRows',value:function(e){if(e)this.expandRow_(!1,0);else for(var t=this.$body.children(),o=0;o<t.length;o++)this.expandRow_(!1,s(t[o]).data('index'))}},{key:'updateFormatText',value:function(e,t){this.options[r.sprintf('format%s',e)]&&('string'==typeof t?this.options[r.sprintf('format%s',e)]=function(){return t}:'function'==typeof t&&(this.options[r.sprintf('format%s',e)]=t)),this.initToolbar(),this.initPagination(),this.initBody()}}]),t}();p.DEFAULTS=d,p.LOCALES=c,p.COLUMN_DEFAULTS={radio:!1,checkbox:!1,checkboxEnabled:!0,field:void 0,title:void 0,titleTooltip:void 0,class:void 0,align:void 0,halign:void 0,falign:void 0,valign:void 0,width:void 0,sortable:!1,order:'asc',visible:!0,switchable:!0,clickToSelect:!0,formatter:void 0,footerFormatter:void 0,events:void 0,sorter:void 0,sortName:void 0,cellStyle:void 0,searchable:!0,searchFormatter:!0,cardVisible:!0,escape:!1,showSelectTitle:!1},p.EVENTS={"all.bs.table":'onAll',"click-cell.bs.table":'onClickCell',"dbl-click-cell.bs.table":'onDblClickCell',"click-row.bs.table":'onClickRow',"dbl-click-row.bs.table":'onDblClickRow',"sort.bs.table":'onSort',"check.bs.table":'onCheck',"uncheck.bs.table":'onUncheck',"check-all.bs.table":'onCheckAll',"uncheck-all.bs.table":'onUncheckAll',"check-some.bs.table":'onCheckSome',"uncheck-some.bs.table":'onUncheckSome',"load-success.bs.table":'onLoadSuccess',"load-error.bs.table":'onLoadError',"column-switch.bs.table":'onColumnSwitch',"page-change.bs.table":'onPageChange',"search.bs.table":'onSearch',"toggle.bs.table":'onToggle',"pre-body.bs.table":'onPreBody',"post-body.bs.table":'onPostBody',"post-header.bs.table":'onPostHeader',"expand-row.bs.table":'onExpandRow',"collapse-row.bs.table":'onCollapseRow',"refresh-options.bs.table":'onRefreshOptions',"reset-view.bs.table":'onResetView',"refresh.bs.table":'onRefresh',"scroll-body.bs.table":'onScrollBody'};var h=['getOptions','getSelections','getAllSelections','getData','load','append','prepend','remove','removeAll','insertRow','updateRow','updateCell','updateByUniqueId','removeByUniqueId','getRowByUniqueId','showRow','hideRow','getHiddenRows','mergeCells','refreshColumnTitle','checkAll','uncheckAll','checkInvert','check','uncheck','checkBy','uncheckBy','refresh','resetView','resetWidth','destroy','showLoading','hideLoading','showColumn','hideColumn','getHiddenColumns','getVisibleColumns','showAllColumns','hideAllColumns','filterBy','scrollTo','getScrollPosition','selectPage','prevPage','nextPage','togglePagination','toggleView','refreshOptions','resetSearch','expandRow','collapseRow','expandAllRows','collapseAllRows','updateFormatText','updateCellById'];s.BootstrapTable=p,s.fn.bootstrapTable=function(e){for(var t=arguments.length,o=Array(1<t?t-1:0),a=1;a<t;a++)o[a-1]=arguments[a];var i;return this.each(function(t,a){var l=s(a).data('bootstrap.table'),r=s.extend({},p.DEFAULTS,s(a).data(),'object'===('undefined'==typeof e?'undefined':n(e))&&e);if('string'==typeof e){var d;if(-1===h.indexOf(e))throw new Error('Unknown method: '+e);if(!l)return;i=(d=l)[e].apply(d,o),'destroy'===e&&s(a).removeData('bootstrap.table')}l||s(a).data('bootstrap.table',l=new s.BootstrapTable(a,r))}),'undefined'==typeof i?this:i},s.fn.bootstrapTable.Constructor=p,s.fn.bootstrapTable.defaults=p.DEFAULTS,s.fn.bootstrapTable.columnDefaults=p.COLUMN_DEFAULTS,s.fn.bootstrapTable.locales=p.LOCALES,s.fn.bootstrapTable.methods=h,s.fn.bootstrapTable.utils=r,s(function(){s('[data-toggle="table"]').bootstrapTable()})})(jQuery)});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/bootstrap-table/dist/extensions/export/bootstrap-table-export.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  /**
   * @author zhixin wen <wenzhixin2010@gmail.com>
   * extensions: https://github.com/hhurz/tableExport.jquery.plugin
   */

  (function ($) {
    var Utils = $.fn.bootstrapTable.utils;

    var bootstrap = {
      3: {
        icons: {
          export: 'glyphicon-export icon-share'
        },
        html: {
          dropmenu: '<ul class="dropdown-menu" role="menu"></ul>',
          dropitem: '<li role="menuitem" data-type="%s"><a href="javascript:">%s</a></li>'
        }
      },
      4: {
        icons: {
          export: 'fa-download'
        },
        html: {
          dropmenu: '<div class="dropdown-menu dropdown-menu-right"></div>',
          dropitem: '<a class="dropdown-item" data-type="%s" href="javascript:">%s</a>'
        }
      }
    }[Utils.bootstrapVersion];

    var TYPE_NAME = {
      json: 'JSON',
      xml: 'XML',
      png: 'PNG',
      csv: 'CSV',
      txt: 'TXT',
      sql: 'SQL',
      doc: 'MS-Word',
      excel: 'MS-Excel',
      xlsx: 'MS-Excel (OpenXML)',
      powerpoint: 'MS-Powerpoint',
      pdf: 'PDF'
    };

    $.extend($.fn.bootstrapTable.defaults, {
      showExport: false,
      exportDataType: 'basic', // basic, all, selected
      exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
      exportOptions: {},
      exportFooter: false
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
      export: bootstrap.icons.export
    });

    $.extend($.fn.bootstrapTable.locales, {
      formatExport: function formatExport() {
        return 'Export data';
      }
    });
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    $.fn.bootstrapTable.methods.push('exportTable');

    $.BootstrapTable = function (_$$BootstrapTable) {
      _inherits(_class, _$$BootstrapTable);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
      }

      _createClass(_class, [{
        key: 'initToolbar',
        value: function initToolbar() {
          var _this2 = this;

          var o = this.options;

          this.showToolbar = this.showToolbar || o.showExport;

          _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'initToolbar', this).call(this);

          if (!this.options.showExport) {
            return;
          }
          var $btnGroup = this.$toolbar.find('>.btn-group');
          this.$export = $btnGroup.find('div.export');

          if (this.$export.length) {
            this.updateExportButton();
            return;
          }
          this.$export = $('\n        <div class="export btn-group">\n        <button class="btn btn-' + o.buttonsClass + ' btn-' + o.iconSize + ' dropdown-toggle"\n          aria-label="export type"\n          title="' + o.formatExport() + '"\n          data-toggle="dropdown"\n          type="button">\n          <i class="' + o.iconsPrefix + ' ' + o.icons.export + '"></i>\n          <span class="caret"></span>\n        </button>\n        ' + bootstrap.html.dropmenu + '\n        </div>\n      ').appendTo($btnGroup);

          this.updateExportButton();

          var $menu = this.$export.find('.dropdown-menu');
          var exportTypes = o.exportTypes;

          if (typeof exportTypes === 'string') {
            var types = exportTypes.slice(1, -1).replace(/ /g, '').split(',');
            exportTypes = types.map(function (t) {
              return t.slice(1, -1);
            });
          }
          for (var _iterator = exportTypes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var type = _ref;

            if (TYPE_NAME.hasOwnProperty(type)) {
              $menu.append(Utils.sprintf(bootstrap.html.dropitem, type, TYPE_NAME[type]));
            }
          }

          $menu.find('>li, >a').click(function (_ref2) {
            var currentTarget = _ref2.currentTarget;

            var type = $(currentTarget).data('type');
            var exportOptions = {
              type: type,
              escape: false
            };

            _this2.exportTable(exportOptions);
          });
        }
      }, {
        key: 'exportTable',
        value: function exportTable(options) {
          var _this3 = this;

          var o = this.options;
          var stateField = this.header.stateField;
          var isCardView = o.cardView;

          var doExport = function doExport(callback) {
            if (stateField) {
              _this3.hideColumn(stateField);
            }
            if (isCardView) {
              _this3.toggleView();
            }

            var data = _this3.getData();
            if (o.exportFooter) {
              var $footerRow = _this3.$tableFooter.find('tr').first();
              var footerData = {};
              var footerHtml = [];

              $.each($footerRow.children(), function (index, footerCell) {
                var footerCellHtml = $(footerCell).children('.th-inner').first().html();
                footerData[_this3.columns[index].field] = footerCellHtml === '&nbsp;' ? null : footerCellHtml;

                // grab footer cell text into cell index-based array
                footerHtml.push(footerCellHtml);
              });

              _this3.append(footerData);

              var $lastTableRow = _this3.$body.children().last();

              $.each($lastTableRow.children(), function (index, lastTableRowCell) {
                $(lastTableRowCell).html(footerHtml[index]);
              });
            }

            _this3.$el.tableExport($.extend({
              onAfterSaveToFile: function onAfterSaveToFile() {
                if (o.exportFooter) {
                  _this3.load(data);
                }

                if (stateField) {
                  _this3.showColumn(stateField);
                }
                if (isCardView) {
                  _this3.toggleView();
                }

                callback();
              }
            }, o.exportOptions, options));
          };

          if (o.exportDataType === 'all' && o.pagination) {
            var eventName = o.sidePagination === 'server' ? 'post-body.bs.table' : 'page-change.bs.table';
            this.$el.one(eventName, function () {
              doExport(function () {
                _this3.togglePagination();
              });
            });
            this.togglePagination();
          } else if (o.exportDataType === 'selected') {
            var data = this.getData();
            var selectedData = this.getSelections();
            if (!selectedData.length) {
              return;
            }

            if (o.sidePagination === 'server') {
              data = _defineProperty({
                total: o.totalRows
              }, this.options.dataField, data);
              selectedData = _defineProperty({
                total: selectedData.length
              }, this.options.dataField, selectedData);
            }

            this.load(selectedData);
            doExport(function () {
              _this3.load(data);
            });
          } else {
            doExport();
          }
        }
      }, {
        key: 'updateSelected',
        value: function updateSelected() {
          _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'updateSelected', this).call(this);
          this.updateExportButton();
        }
      }, {
        key: 'updateExportButton',
        value: function updateExportButton() {
          if (this.options.exportDataType === 'selected') {
            this.$export.find('> button').prop('disabled', !this.getSelections().length);
          }
        }
      }]);

      return _class;
    }($.BootstrapTable);
  })(jQuery);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-table/dist/locale/bootstrap-table-es-ES.js":
/*!***************************************************************************!*\
  !*** ./node_modules/bootstrap-table/dist/locale/bootstrap-table-es-ES.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function () {
  'use strict';

  /**
   * Bootstrap Table Spanish Spain translation
   * Author: Marc Pina<iwalkalone69@gmail.com>
   */
  (function ($) {
    $.fn.bootstrapTable.locales['es-ES'] = {
      formatLoadingMessage: function formatLoadingMessage() {
        return 'Por favor espere';
      },
      formatRecordsPerPage: function formatRecordsPerPage(pageNumber) {
        return pageNumber + ' resultados por p\xE1gina';
      },
      formatShowingRows: function formatShowingRows(pageFrom, pageTo, totalRows) {
        return 'Mostrando desde ' + pageFrom + ' hasta ' + pageTo + ' - En total ' + totalRows + ' resultados';
      },
      formatDetailPagination: function formatDetailPagination(totalRows) {
        return 'Showing ' + totalRows + ' rows';
      },
      formatSearch: function formatSearch() {
        return 'Buscar';
      },
      formatNoMatches: function formatNoMatches() {
        return 'No se encontraron resultados';
      },
      formatPaginationSwitch: function formatPaginationSwitch() {
        return 'Ocultar/Mostrar paginación';
      },
      formatRefresh: function formatRefresh() {
        return 'Refrescar';
      },
      formatToggle: function formatToggle() {
        return 'Ocultar/Mostrar';
      },
      formatColumns: function formatColumns() {
        return 'Columnas';
      },
      formatFullscreen: function formatFullscreen() {
        return 'Fullscreen';
      },
      formatAllRows: function formatAllRows() {
        return 'Todos';
      },
      formatAutoRefresh: function formatAutoRefresh() {
        return 'Auto Refresh';
      },

      formatExport: function formatExport() {
        return 'Exportar los datos';
      },
      formatClearFilters: function formatClearFilters() {
        return 'Borrar los filtros';
      },
      formatJumpto: function formatJumpto() {
        return 'GO';
      },

      formatAdvancedSearch: function formatAdvancedSearch() {
        return 'Búsqueda avanzada';
      },
      formatAdvancedCloseButton: function formatAdvancedCloseButton() {
        return 'Cerrar';
      }
    };

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);
  })(jQuery);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/bootstrap-table/dist/locale/bootstrap-table-eu-EU.js":
/*!***************************************************************************!*\
  !*** ./node_modules/bootstrap-table/dist/locale/bootstrap-table-eu-EU.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function () {
  'use strict';

  /**
   * Bootstrap Table Basque (Basque Country) translation
   * Author: Iker Ibarguren Berasaluze<ikerib@gmail.com>
   */
  (function ($) {
    $.fn.bootstrapTable.locales['eu-EU'] = {
      formatLoadingMessage: function formatLoadingMessage() {
        return 'Itxaron mesedez';
      },
      formatRecordsPerPage: function formatRecordsPerPage(pageNumber) {
        return pageNumber + ' emaitza orriko.';
      },
      formatShowingRows: function formatShowingRows(pageFrom, pageTo, totalRows) {
        return totalRows + ' erregistroetatik ' + pageFrom + 'etik ' + pageTo + 'erakoak erakusten.';
      },
      formatDetailPagination: function formatDetailPagination(totalRows) {
        return 'Showing ' + totalRows + ' rows';
      },
      formatSearch: function formatSearch() {
        return 'Bilatu';
      },
      formatNoMatches: function formatNoMatches() {
        return 'Ez da emaitzarik aurkitu';
      },
      formatPaginationSwitch: function formatPaginationSwitch() {
        return 'Ezkutatu/Erakutsi orrikatzea';
      },
      formatRefresh: function formatRefresh() {
        return 'Eguneratu';
      },
      formatToggle: function formatToggle() {
        return 'Ezkutatu/Erakutsi';
      },
      formatColumns: function formatColumns() {
        return 'Zutabeak';
      },
      formatFullscreen: function formatFullscreen() {
        return 'Fullscreen';
      },
      formatAllRows: function formatAllRows() {
        return 'Guztiak';
      },
      formatAutoRefresh: function formatAutoRefresh() {
        return 'Auto Refresh';
      },
      formatExport: function formatExport() {
        return 'Export data';
      },
      formatClearFilters: function formatClearFilters() {
        return 'Clear filters';
      },
      formatJumpto: function formatJumpto() {
        return 'GO';
      },
      formatAdvancedSearch: function formatAdvancedSearch() {
        return 'Advanced search';
      },
      formatAdvancedCloseButton: function formatAdvancedCloseButton() {
        return 'Close';
      }
    };

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['eu-EU']);
  })(jQuery);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./node_modules/core-js/internals/a-function.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-function.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/add-to-unscopables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  hide(ArrayPrototype, UNSCOPABLES, create(null));
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(/*! ../internals/bind-context */ "./node_modules/core-js/internals/bind-context.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/bind-context.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/bind-context.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(/*! ../internals/a-function */ "./node_modules/core-js/internals/a-function.js");

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var defineProperties = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.find.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.find.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $find = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").find;
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
* sweetalert2 v8.11.6
* Released under the MIT License.
*/
(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var consolePrefix = 'SweetAlert2:';
/**
 * Filter the unique values into a new array
 * @param arr
 */

var uniqueArray = function uniqueArray(arr) {
  var result = [];

  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }

  return result;
};
/**
 * Returns the array ob object values (Object.values isn't supported in IE11)
 * @param obj
 */

var objectValues = function objectValues(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};
/**
 * Convert NodeList to Array
 * @param nodeList
 */

var toArray = function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};
/**
 * Standardise console warnings
 * @param message
 */

var warn = function warn(message) {
  console.warn("".concat(consolePrefix, " ").concat(message));
};
/**
 * Standardise console errors
 * @param message
 */

var error = function error(message) {
  console.error("".concat(consolePrefix, " ").concat(message));
};
/**
 * Private global state for `warnOnce`
 * @type {Array}
 * @private
 */

var previousWarnOnceMessages = [];
/**
 * Show a console warning, but only if it hasn't already been shown
 * @param message
 */

var warnOnce = function warnOnce(message) {
  if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
    previousWarnOnceMessages.push(message);
    warn(message);
  }
};
/**
 * Show a one-time console warning about deprecated params/methods
 */

var warnAboutDepreation = function warnAboutDepreation(deprecatedParam, useInstead) {
  warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
};
/**
 * If `arg` is a function, call it (with no arguments or context) and return the result.
 * Otherwise, just pass the value through
 * @param arg
 */

var callIfFunction = function callIfFunction(arg) {
  return typeof arg === 'function' ? arg() : arg;
};
var isPromise = function isPromise(arg) {
  return arg && Promise.resolve(arg) === arg;
};

var DismissReason = Object.freeze({
  cancel: 'cancel',
  backdrop: 'backdrop',
  close: 'close',
  esc: 'esc',
  timer: 'timer'
});

var argsToParams = function argsToParams(args) {
  var params = {};

  switch (_typeof(args[0])) {
    case 'object':
      _extends(params, args[0]);

      break;

    default:
      ['title', 'html', 'type'].forEach(function (name, index) {
        switch (_typeof(args[index])) {
          case 'string':
            params[name] = args[index];
            break;

          case 'undefined':
            break;

          default:
            error("Unexpected type of ".concat(name, "! Expected \"string\", got ").concat(_typeof(args[index])));
        }
      });
  }

  return params;
};

var swalPrefix = 'swal2-';
var prefix = function prefix(items) {
  var result = {};

  for (var i in items) {
    result[items[i]] = swalPrefix + items[i];
  }

  return result;
};
var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'toast', 'toast-shown', 'toast-column', 'fade', 'show', 'hide', 'noanimation', 'close', 'title', 'header', 'content', 'actions', 'confirm', 'cancel', 'footer', 'icon', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl']);
var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

var states = {
  previousBodyPadding: null
};
var hasClass = function hasClass(elem, className) {
  return elem.classList.contains(className);
};
var applyCustomClass = function applyCustomClass(elem, customClass, className) {
  // Clean up previous custom classes
  toArray(elem.classList).forEach(function (className) {
    if (!(objectValues(swalClasses).indexOf(className) !== -1) && !(objectValues(iconTypes).indexOf(className) !== -1)) {
      elem.classList.remove(className);
    }
  });

  if (customClass && customClass[className]) {
    addClass(elem, customClass[className]);
  }
};
function getInput(content, inputType) {
  if (!inputType) {
    return null;
  }

  switch (inputType) {
    case 'select':
    case 'textarea':
    case 'file':
      return getChildByClass(content, swalClasses[inputType]);

    case 'checkbox':
      return content.querySelector(".".concat(swalClasses.checkbox, " input"));

    case 'radio':
      return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

    case 'range':
      return content.querySelector(".".concat(swalClasses.range, " input"));

    default:
      return getChildByClass(content, swalClasses.input);
  }
}
var focusInput = function focusInput(input) {
  input.focus(); // place cursor at end of text in text input

  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915
    var val = input.value;
    input.value = '';
    input.value = val;
  }
};
var toggleClass = function toggleClass(target, classList, condition) {
  if (!target || !classList) {
    return;
  }

  if (typeof classList === 'string') {
    classList = classList.split(/\s+/).filter(Boolean);
  }

  classList.forEach(function (className) {
    if (target.forEach) {
      target.forEach(function (elem) {
        condition ? elem.classList.add(className) : elem.classList.remove(className);
      });
    } else {
      condition ? target.classList.add(className) : target.classList.remove(className);
    }
  });
};
var addClass = function addClass(target, classList) {
  toggleClass(target, classList, true);
};
var removeClass = function removeClass(target, classList) {
  toggleClass(target, classList, false);
};
var getChildByClass = function getChildByClass(elem, className) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i];
    }
  }
};
var applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
  if (value || parseInt(value) === 0) {
    elem.style[property] = typeof value === 'number' ? value + 'px' : value;
  } else {
    elem.style.removeProperty(property);
  }
};
var show = function show(elem) {
  var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
  elem.style.opacity = '';
  elem.style.display = display;
};
var hide = function hide(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
};
var toggle = function toggle(elem, condition, display) {
  condition ? show(elem, display) : hide(elem);
}; // borrowed from jquery $(elem).is(':visible') implementation

var isVisible = function isVisible(elem) {
  return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
};
var isScrollable = function isScrollable(elem) {
  return !!(elem.scrollHeight > elem.clientHeight);
}; // borrowed from https://stackoverflow.com/a/46352119

var hasCssAnimation = function hasCssAnimation(elem) {
  var style = window.getComputedStyle(elem);
  var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
  var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
  return animDuration > 0 || transDuration > 0;
};
var contains = function contains(haystack, needle) {
  if (typeof haystack.contains === 'function') {
    return haystack.contains(needle);
  }
};

var getContainer = function getContainer() {
  return document.body.querySelector('.' + swalClasses.container);
};
var elementBySelector = function elementBySelector(selectorString) {
  var container = getContainer();
  return container ? container.querySelector(selectorString) : null;
};

var elementByClass = function elementByClass(className) {
  return elementBySelector('.' + className);
};

var getPopup = function getPopup() {
  return elementByClass(swalClasses.popup);
};
var getIcons = function getIcons() {
  var popup = getPopup();
  return toArray(popup.querySelectorAll('.' + swalClasses.icon));
};
var getIcon = function getIcon() {
  var visibleIcon = getIcons().filter(function (icon) {
    return isVisible(icon);
  });
  return visibleIcon.length ? visibleIcon[0] : null;
};
var getTitle = function getTitle() {
  return elementByClass(swalClasses.title);
};
var getContent = function getContent() {
  return elementByClass(swalClasses.content);
};
var getImage = function getImage() {
  return elementByClass(swalClasses.image);
};
var getProgressSteps = function getProgressSteps() {
  return elementByClass(swalClasses['progress-steps']);
};
var getValidationMessage = function getValidationMessage() {
  return elementByClass(swalClasses['validation-message']);
};
var getConfirmButton = function getConfirmButton() {
  return elementBySelector('.' + swalClasses.actions + ' .' + swalClasses.confirm);
};
var getCancelButton = function getCancelButton() {
  return elementBySelector('.' + swalClasses.actions + ' .' + swalClasses.cancel);
};
var getActions = function getActions() {
  return elementByClass(swalClasses.actions);
};
var getHeader = function getHeader() {
  return elementByClass(swalClasses.header);
};
var getFooter = function getFooter() {
  return elementByClass(swalClasses.footer);
};
var getCloseButton = function getCloseButton() {
  return elementByClass(swalClasses.close);
};
var getFocusableElements = function getFocusableElements() {
  var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
  .sort(function (a, b) {
    a = parseInt(a.getAttribute('tabindex'));
    b = parseInt(b.getAttribute('tabindex'));

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }

    return 0;
  }); // https://github.com/jkup/focusable/blob/master/index.js

  var otherFocusableElements = toArray(getPopup().querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]')).filter(function (el) {
    return el.getAttribute('tabindex') !== '-1';
  });
  return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
    return isVisible(el);
  });
};
var isModal = function isModal() {
  return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
};
var isToast = function isToast() {
  return document.body.classList.contains(swalClasses['toast-shown']);
};
var isLoading = function isLoading() {
  return getPopup().hasAttribute('data-loading');
};

// Detect Node env
var isNodeEnv = function isNodeEnv() {
  return typeof window === 'undefined' || typeof document === 'undefined';
};

var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.error, "\">\n       <span class=\"swal2-x-mark\"><span class=\"swal2-x-mark-line-left\"></span><span class=\"swal2-x-mark-line-right\"></span></span>\n     </div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.question, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.warning, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.info, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.success, "\">\n       <div class=\"swal2-success-circular-line-left\"></div>\n       <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n       <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n       <div class=\"swal2-success-circular-line-right\"></div>\n     </div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\">&times;</button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\">OK</button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\">Cancel</button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\">\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

var resetOldContainer = function resetOldContainer() {
  var oldContainer = getContainer();

  if (!oldContainer) {
    return;
  }

  oldContainer.parentNode.removeChild(oldContainer);
  removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
};

var oldInputVal; // IE11 workaround, see #1109 for details

var resetValidationMessage = function resetValidationMessage(e) {
  if (Swal.isVisible() && oldInputVal !== e.target.value) {
    Swal.resetValidationMessage();
  }

  oldInputVal = e.target.value;
};

var addInputChangeListeners = function addInputChangeListeners() {
  var content = getContent();
  var input = getChildByClass(content, swalClasses.input);
  var file = getChildByClass(content, swalClasses.file);
  var range = content.querySelector(".".concat(swalClasses.range, " input"));
  var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
  var select = getChildByClass(content, swalClasses.select);
  var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
  var textarea = getChildByClass(content, swalClasses.textarea);
  input.oninput = resetValidationMessage;
  file.onchange = resetValidationMessage;
  select.onchange = resetValidationMessage;
  checkbox.onchange = resetValidationMessage;
  textarea.oninput = resetValidationMessage;

  range.oninput = function (e) {
    resetValidationMessage(e);
    rangeOutput.value = range.value;
  };

  range.onchange = function (e) {
    resetValidationMessage(e);
    range.nextSibling.value = range.value;
  };
};

var getTarget = function getTarget(target) {
  return typeof target === 'string' ? document.querySelector(target) : target;
};

var setupAccessibility = function setupAccessibility(params) {
  var popup = getPopup();
  popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

  if (!params.toast) {
    popup.setAttribute('aria-modal', 'true');
  }
};

var setupRTL = function setupRTL(targetElement) {
  if (window.getComputedStyle(targetElement).direction === 'rtl') {
    addClass(getContainer(), swalClasses.rtl);
  }
};
/*
 * Add modal + backdrop to DOM
 */


var init = function init(params) {
  // Clean up the old popup container if it exists
  resetOldContainer();
  /* istanbul ignore if */

  if (isNodeEnv()) {
    error('SweetAlert2 requires document to initialize');
    return;
  }

  var container = document.createElement('div');
  container.className = swalClasses.container;
  container.innerHTML = sweetHTML;
  var targetElement = getTarget(params.target);
  targetElement.appendChild(container);
  setupAccessibility(params);
  setupRTL(targetElement);
  addInputChangeListeners();
};

var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
  // DOM element
  if (param instanceof HTMLElement) {
    target.appendChild(param); // JQuery element(s)
  } else if (_typeof(param) === 'object') {
    handleJqueryElem(target, param); // Plain string
  } else if (param) {
    target.innerHTML = param;
  }
};

var handleJqueryElem = function handleJqueryElem(target, elem) {
  target.innerHTML = '';

  if (0 in elem) {
    for (var i = 0; i in elem; i++) {
      target.appendChild(elem[i].cloneNode(true));
    }
  } else {
    target.appendChild(elem.cloneNode(true));
  }
};

var animationEndEvent = function () {
  // Prevent run in Node env

  /* istanbul ignore if */
  if (isNodeEnv()) {
    return false;
  }

  var testEl = document.createElement('div');
  var transEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd oanimationend',
    'animation': 'animationend'
  };

  for (var i in transEndEventNames) {
    if (transEndEventNames.hasOwnProperty(i) && typeof testEl.style[i] !== 'undefined') {
      return transEndEventNames[i];
    }
  }

  return false;
}();

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
var measureScrollbar = function measureScrollbar() {
  var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

  if (supportsTouch) {
    return 0;
  }

  var scrollDiv = document.createElement('div');
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

function handleButtonsStyling(confirmButton, cancelButton, params) {
  addClass([confirmButton, cancelButton], swalClasses.styled); // Buttons background colors

  if (params.confirmButtonColor) {
    confirmButton.style.backgroundColor = params.confirmButtonColor;
  }

  if (params.cancelButtonColor) {
    cancelButton.style.backgroundColor = params.cancelButtonColor;
  } // Loading state


  var confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color');
  confirmButton.style.borderLeftColor = confirmButtonBackgroundColor;
  confirmButton.style.borderRightColor = confirmButtonBackgroundColor;
}

function renderButton(button, buttonType, params) {
  toggle(button, params['showC' + buttonType.substring(1) + 'Button'], 'inline-block');
  button.innerHTML = params[buttonType + 'ButtonText']; // Set caption text

  button.setAttribute('aria-label', params[buttonType + 'ButtonAriaLabel']); // ARIA label
  // Add buttons custom classes

  button.className = swalClasses[buttonType];
  applyCustomClass(button, params.customClass, buttonType + 'Button');
  addClass(button, params[buttonType + 'ButtonClass']);
}

var renderActions = function renderActions(instance, params) {
  var actions = getActions();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton(); // Actions (buttons) wrapper

  if (!params.showConfirmButton && !params.showCancelButton) {
    hide(actions);
  } else {
    show(actions);
  } // Custom class


  applyCustomClass(actions, params.customClass, 'actions'); // Render confirm button

  renderButton(confirmButton, 'confirm', params); // render Cancel Button

  renderButton(cancelButton, 'cancel', params);

  if (params.buttonsStyling) {
    handleButtonsStyling(confirmButton, cancelButton, params);
  } else {
    removeClass([confirmButton, cancelButton], swalClasses.styled);
    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
  }
};

function handleBackdropParam(container, backdrop) {
  if (typeof backdrop === 'string') {
    container.style.background = backdrop;
  } else if (!backdrop) {
    addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
  }
}

function handlePositionParam(container, position) {
  if (position in swalClasses) {
    addClass(container, swalClasses[position]);
  } else {
    warn('The "position" parameter is not valid, defaulting to "center"');
    addClass(container, swalClasses.center);
  }
}

function handleGrowParam(container, grow) {
  if (grow && typeof grow === 'string') {
    var growClass = 'grow-' + grow;

    if (growClass in swalClasses) {
      addClass(container, swalClasses[growClass]);
    }
  }
}

var renderContainer = function renderContainer(instance, params) {
  var container = getContainer();

  if (!container) {
    return;
  }

  handleBackdropParam(container, params.backdrop);

  if (!params.backdrop && params.allowOutsideClick) {
    warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
  }

  handlePositionParam(container, params.position);
  handleGrowParam(container, params.grow); // Custom class

  applyCustomClass(container, params.customClass, 'container');

  if (params.customContainerClass) {
    // @deprecated
    addClass(container, params.customContainerClass);
  }
};

/**
 * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
 * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
 * This is the approach that Babel will probably take to implement private methods/fields
 *   https://github.com/tc39/proposal-private-methods
 *   https://github.com/babel/babel/pull/7555
 * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
 *   then we can use that language feature.
 */
var privateProps = {
  promise: new WeakMap(),
  innerParams: new WeakMap(),
  domCache: new WeakMap()
};

var renderInput = function renderInput(instance, params) {
  var innerParams = privateProps.innerParams.get(instance);
  var rerender = !innerParams || params.input !== innerParams.input;
  var content = getContent();
  var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

  for (var i = 0; i < inputTypes.length; i++) {
    var inputClass = swalClasses[inputTypes[i]];
    var inputContainer = getChildByClass(content, inputClass); // set attributes

    setAttributes(inputTypes[i], params.inputAttributes); // set class

    setClass(inputContainer, inputClass, params);
    rerender && hide(inputContainer);
  }

  if (!params.input) {
    return;
  }

  if (!renderInputType[params.input]) {
    return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
  }

  if (rerender) {
    var input = renderInputType[params.input](params);
    show(input);
  }
};

var removeAttributes = function removeAttributes(input) {
  for (var i = 0; i < input.attributes.length; i++) {
    var attrName = input.attributes[i].name;

    if (!(['type', 'value', 'style'].indexOf(attrName) !== -1)) {
      input.removeAttribute(attrName);
    }
  }
};

var setAttributes = function setAttributes(inputType, inputAttributes) {
  var input = getInput(getContent(), inputType);

  if (!input) {
    return;
  }

  removeAttributes(input);

  for (var attr in inputAttributes) {
    // Do not set a placeholder for <input type="range">
    // it'll crash Edge, #1298
    if (inputType === 'range' && attr === 'placeholder') {
      continue;
    }

    input.setAttribute(attr, inputAttributes[attr]);
  }
};

var setClass = function setClass(inputContainer, inputClass, params) {
  inputContainer.className = inputClass;

  if (params.inputClass) {
    addClass(inputContainer, params.inputClass);
  }

  if (params.customClass) {
    addClass(inputContainer, params.customClass.input);
  }
};

var setInputPlaceholder = function setInputPlaceholder(input, params) {
  if (!input.placeholder || params.inputPlaceholder) {
    input.placeholder = params.inputPlaceholder;
  }
};

var renderInputType = {};

renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function (params) {
  var input = getChildByClass(getContent(), swalClasses.input);

  if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
    input.value = params.inputValue;
  } else if (!isPromise(params.inputValue)) {
    warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(params.inputValue), "\""));
  }

  setInputPlaceholder(input, params);
  input.type = params.input;
  return input;
};

renderInputType.file = function (params) {
  var input = getChildByClass(getContent(), swalClasses.file);
  setInputPlaceholder(input, params);
  input.type = params.input;
  return input;
};

renderInputType.range = function (params) {
  var range = getChildByClass(getContent(), swalClasses.range);
  var rangeInput = range.querySelector('input');
  var rangeOutput = range.querySelector('output');
  rangeInput.value = params.inputValue;
  rangeInput.type = params.input;
  rangeOutput.value = params.inputValue;
  return range;
};

renderInputType.select = function (params) {
  var select = getChildByClass(getContent(), swalClasses.select);
  select.innerHTML = '';

  if (params.inputPlaceholder) {
    var placeholder = document.createElement('option');
    placeholder.innerHTML = params.inputPlaceholder;
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
  }

  return select;
};

renderInputType.radio = function () {
  var radio = getChildByClass(getContent(), swalClasses.radio);
  radio.innerHTML = '';
  return radio;
};

renderInputType.checkbox = function (params) {
  var checkbox = getChildByClass(getContent(), swalClasses.checkbox);
  var checkboxInput = getInput(getContent(), 'checkbox');
  checkboxInput.type = 'checkbox';
  checkboxInput.value = 1;
  checkboxInput.id = swalClasses.checkbox;
  checkboxInput.checked = Boolean(params.inputValue);
  var label = checkbox.querySelector('span');
  label.innerHTML = params.inputPlaceholder;
  return checkbox;
};

renderInputType.textarea = function (params) {
  var textarea = getChildByClass(getContent(), swalClasses.textarea);
  textarea.value = params.inputValue;
  setInputPlaceholder(textarea, params);
  return textarea;
};

var renderContent = function renderContent(instance, params) {
  var content = getContent().querySelector('#' + swalClasses.content); // Content as HTML

  if (params.html) {
    parseHtmlToContainer(params.html, content);
    show(content, 'block'); // Content as plain text
  } else if (params.text) {
    content.textContent = params.text;
    show(content, 'block'); // No content
  } else {
    hide(content);
  }

  renderInput(instance, params); // Custom class

  applyCustomClass(getContent(), params.customClass, 'content');
};

var renderFooter = function renderFooter(instance, params) {
  var footer = getFooter();
  toggle(footer, params.footer);

  if (params.footer) {
    parseHtmlToContainer(params.footer, footer);
  } // Custom class


  applyCustomClass(footer, params.customClass, 'footer');
};

var renderCloseButton = function renderCloseButton(instance, params) {
  var closeButton = getCloseButton(); // Custom class

  applyCustomClass(closeButton, params.customClass, 'closeButton');
  toggle(closeButton, params.showCloseButton);
  closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
};

var renderIcon = function renderIcon(instance, params) {
  var innerParams = privateProps.innerParams.get(instance); // if the icon with the given type already rendered,
  // apply the custom class without re-rendering the icon

  if (innerParams && params.type === innerParams.type && getIcon()) {
    applyCustomClass(getIcon(), params.customClass, 'icon');
    return;
  }

  hideAllIcons();

  if (!params.type) {
    return;
  }

  adjustSuccessIconBackgoundColor();

  if (Object.keys(iconTypes).indexOf(params.type) !== -1) {
    var icon = elementBySelector(".".concat(swalClasses.icon, ".").concat(iconTypes[params.type]));
    show(icon); // Custom class

    applyCustomClass(icon, params.customClass, 'icon'); // Animate icon

    toggleClass(icon, "swal2-animate-".concat(params.type, "-icon"), params.animation);
  } else {
    error("Unknown type! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.type, "\""));
  }
};

var hideAllIcons = function hideAllIcons() {
  var icons = getIcons();

  for (var i = 0; i < icons.length; i++) {
    hide(icons[i]);
  }
}; // Adjust success icon background color to match the popup background color


var adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
  var popup = getPopup();
  var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
  var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

  for (var i = 0; i < successIconParts.length; i++) {
    successIconParts[i].style.backgroundColor = popupBackgroundColor;
  }
};

var renderImage = function renderImage(instance, params) {
  var image = getImage();

  if (!params.imageUrl) {
    return hide(image);
  }

  show(image); // Src, alt

  image.setAttribute('src', params.imageUrl);
  image.setAttribute('alt', params.imageAlt); // Width, height

  applyNumericalStyle(image, 'width', params.imageWidth);
  applyNumericalStyle(image, 'height', params.imageHeight); // Class

  image.className = swalClasses.image;
  applyCustomClass(image, params.customClass, 'image');

  if (params.imageClass) {
    addClass(image, params.imageClass);
  }
};

var createStepElement = function createStepElement(step) {
  var stepEl = document.createElement('li');
  addClass(stepEl, swalClasses['progress-step']);
  stepEl.innerHTML = step;
  return stepEl;
};

var createLineElement = function createLineElement(params) {
  var lineEl = document.createElement('li');
  addClass(lineEl, swalClasses['progress-step-line']);

  if (params.progressStepsDistance) {
    lineEl.style.width = params.progressStepsDistance;
  }

  return lineEl;
};

var renderProgressSteps = function renderProgressSteps(instance, params) {
  var progressStepsContainer = getProgressSteps();

  if (!params.progressSteps || params.progressSteps.length === 0) {
    return hide(progressStepsContainer);
  }

  show(progressStepsContainer);
  progressStepsContainer.innerHTML = '';
  var currentProgressStep = parseInt(params.currentProgressStep === null ? Swal.getQueueStep() : params.currentProgressStep);

  if (currentProgressStep >= params.progressSteps.length) {
    warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
  }

  params.progressSteps.forEach(function (step, index) {
    var stepEl = createStepElement(step);
    progressStepsContainer.appendChild(stepEl);

    if (index === currentProgressStep) {
      addClass(stepEl, swalClasses['active-progress-step']);
    }

    if (index !== params.progressSteps.length - 1) {
      var lineEl = createLineElement(step);
      progressStepsContainer.appendChild(lineEl);
    }
  });
};

var renderTitle = function renderTitle(instance, params) {
  var title = getTitle();
  toggle(title, params.title || params.titleText);

  if (params.title) {
    parseHtmlToContainer(params.title, title);
  }

  if (params.titleText) {
    title.innerText = params.titleText;
  } // Custom class


  applyCustomClass(title, params.customClass, 'title');
};

var renderHeader = function renderHeader(instance, params) {
  var header = getHeader(); // Custom class

  applyCustomClass(header, params.customClass, 'header'); // Progress steps

  renderProgressSteps(instance, params); // Icon

  renderIcon(instance, params); // Image

  renderImage(instance, params); // Title

  renderTitle(instance, params); // Close button

  renderCloseButton(instance, params);
};

var renderPopup = function renderPopup(instance, params) {
  var popup = getPopup(); // Width

  applyNumericalStyle(popup, 'width', params.width); // Padding

  applyNumericalStyle(popup, 'padding', params.padding); // Background

  if (params.background) {
    popup.style.background = params.background;
  } // Default Class


  popup.className = swalClasses.popup;

  if (params.toast) {
    addClass([document.documentElement, document.body], swalClasses['toast-shown']);
    addClass(popup, swalClasses.toast);
  } else {
    addClass(popup, swalClasses.modal);
  } // Custom class


  applyCustomClass(popup, params.customClass, 'popup');

  if (typeof params.customClass === 'string') {
    addClass(popup, params.customClass);
  } // CSS animation


  toggleClass(popup, swalClasses.noanimation, !params.animation);
};

var render = function render(instance, params) {
  renderPopup(instance, params);
  renderContainer(instance, params);
  renderHeader(instance, params);
  renderContent(instance, params);
  renderActions(instance, params);
  renderFooter(instance, params);
};

/*
 * Global function to determine if SweetAlert2 popup is shown
 */

var isVisible$1 = function isVisible$$1() {
  return isVisible(getPopup());
};
/*
 * Global function to click 'Confirm' button
 */

var clickConfirm = function clickConfirm() {
  return getConfirmButton() && getConfirmButton().click();
};
/*
 * Global function to click 'Cancel' button
 */

var clickCancel = function clickCancel() {
  return getCancelButton() && getCancelButton().click();
};

function fire() {
  var Swal = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _construct(Swal, args);
}

/**
 * Returns an extended version of `Swal` containing `params` as defaults.
 * Useful for reusing Swal configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await TextPrompt('What is your first name?')
 * const {value: lastName} = await TextPrompt('What is your last name?')
 *
 * @param mixinParams
 */
function mixin(mixinParams) {
  var MixinSwal =
  /*#__PURE__*/
  function (_this) {
    _inherits(MixinSwal, _this);

    function MixinSwal() {
      _classCallCheck(this, MixinSwal);

      return _possibleConstructorReturn(this, _getPrototypeOf(MixinSwal).apply(this, arguments));
    }

    _createClass(MixinSwal, [{
      key: "_main",
      value: function _main(params) {
        return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, _extends({}, mixinParams, params));
      }
    }]);

    return MixinSwal;
  }(this);

  return MixinSwal;
}

// private global state for the queue feature
var currentSteps = [];
/*
 * Global function for chaining sweetAlert popups
 */

var queue = function queue(steps) {
  var Swal = this;
  currentSteps = steps;

  var resetAndResolve = function resetAndResolve(resolve, value) {
    currentSteps = [];
    document.body.removeAttribute('data-swal2-queue-step');
    resolve(value);
  };

  var queueResult = [];
  return new Promise(function (resolve) {
    (function step(i, callback) {
      if (i < currentSteps.length) {
        document.body.setAttribute('data-swal2-queue-step', i);
        Swal.fire(currentSteps[i]).then(function (result) {
          if (typeof result.value !== 'undefined') {
            queueResult.push(result.value);
            step(i + 1, callback);
          } else {
            resetAndResolve(resolve, {
              dismiss: result.dismiss
            });
          }
        });
      } else {
        resetAndResolve(resolve, {
          value: queueResult
        });
      }
    })(0);
  });
};
/*
 * Global function for getting the index of current popup in queue
 */

var getQueueStep = function getQueueStep() {
  return document.body.getAttribute('data-swal2-queue-step');
};
/*
 * Global function for inserting a popup to the queue
 */

var insertQueueStep = function insertQueueStep(step, index) {
  if (index && index < currentSteps.length) {
    return currentSteps.splice(index, 0, step);
  }

  return currentSteps.push(step);
};
/*
 * Global function for deleting a popup from the queue
 */

var deleteQueueStep = function deleteQueueStep(index) {
  if (typeof currentSteps[index] !== 'undefined') {
    currentSteps.splice(index, 1);
  }
};

/**
 * Show spinner instead of Confirm button and disable Cancel button
 */

var showLoading = function showLoading() {
  var popup = getPopup();

  if (!popup) {
    Swal.fire('');
  }

  popup = getPopup();
  var actions = getActions();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton();
  show(actions);
  show(confirmButton);
  addClass([popup, actions], swalClasses.loading);
  confirmButton.disabled = true;
  cancelButton.disabled = true;
  popup.setAttribute('data-loading', true);
  popup.setAttribute('aria-busy', true);
  popup.focus();
};

var RESTORE_FOCUS_TIMEOUT = 100;

var globalState = {};
var focusPreviousActiveElement = function focusPreviousActiveElement() {
  if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
    globalState.previousActiveElement.focus();
    globalState.previousActiveElement = null;
  } else if (document.body) {
    document.body.focus();
  }
}; // Restore previous active (focused) element


var restoreActiveElement = function restoreActiveElement() {
  return new Promise(function (resolve) {
    var x = window.scrollX;
    var y = window.scrollY;
    globalState.restoreFocusTimeout = setTimeout(function () {
      focusPreviousActiveElement();
      resolve();
    }, RESTORE_FOCUS_TIMEOUT); // issues/900

    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      // IE doesn't have scrollX/scrollY support
      window.scrollTo(x, y);
    }
  });
};

/**
 * If `timer` parameter is set, returns number of milliseconds of timer remained.
 * Otherwise, returns undefined.
 */

var getTimerLeft = function getTimerLeft() {
  return globalState.timeout && globalState.timeout.getTimerLeft();
};
/**
 * Stop timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var stopTimer = function stopTimer() {
  return globalState.timeout && globalState.timeout.stop();
};
/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var resumeTimer = function resumeTimer() {
  return globalState.timeout && globalState.timeout.start();
};
/**
 * Resume timer. Returns number of milliseconds of timer remained.
 * If `timer` parameter isn't set, returns undefined.
 */

var toggleTimer = function toggleTimer() {
  var timer = globalState.timeout;
  return timer && (timer.running ? timer.stop() : timer.start());
};
/**
 * Increase timer. Returns number of milliseconds of an updated timer.
 * If `timer` parameter isn't set, returns undefined.
 */

var increaseTimer = function increaseTimer(n) {
  return globalState.timeout && globalState.timeout.increase(n);
};
/**
 * Check if timer is running. Returns true if timer is running
 * or false if timer is paused or stopped.
 * If `timer` parameter isn't set, returns undefined
 */

var isTimerRunning = function isTimerRunning() {
  return globalState.timeout && globalState.timeout.isRunning();
};

var defaultParams = {
  title: '',
  titleText: '',
  text: '',
  html: '',
  footer: '',
  type: null,
  toast: false,
  customClass: '',
  customContainerClass: '',
  target: 'body',
  backdrop: true,
  animation: true,
  heightAuto: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  stopKeydownPropagation: true,
  keydownListenerCapture: false,
  showConfirmButton: true,
  showCancelButton: false,
  preConfirm: null,
  confirmButtonText: 'OK',
  confirmButtonAriaLabel: '',
  confirmButtonColor: null,
  confirmButtonClass: '',
  cancelButtonText: 'Cancel',
  cancelButtonAriaLabel: '',
  cancelButtonColor: null,
  cancelButtonClass: '',
  buttonsStyling: true,
  reverseButtons: false,
  focusConfirm: true,
  focusCancel: false,
  showCloseButton: false,
  closeButtonAriaLabel: 'Close this dialog',
  showLoaderOnConfirm: false,
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  imageAlt: '',
  imageClass: '',
  timer: null,
  width: null,
  padding: null,
  background: null,
  input: null,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: {},
  inputAutoTrim: true,
  inputClass: '',
  inputAttributes: {},
  inputValidator: null,
  validationMessage: null,
  grow: false,
  position: 'center',
  progressSteps: [],
  currentProgressStep: null,
  progressStepsDistance: null,
  onBeforeOpen: null,
  onAfterClose: null,
  onOpen: null,
  onClose: null,
  scrollbarPadding: true
};
var updatableParams = ['title', 'titleText', 'text', 'html', 'type', 'customClass', 'showConfirmButton', 'showCancelButton', 'confirmButtonText', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonClass', 'cancelButtonText', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonClass', 'buttonsStyling', 'reverseButtons', 'imageUrl', 'imageWidth', 'imageHeigth', 'imageAlt', 'imageClass', 'progressSteps', 'currentProgressStep'];
var deprecatedParams = {
  customContainerClass: 'customClass',
  confirmButtonClass: 'customClass',
  cancelButtonClass: 'customClass',
  imageClass: 'customClass',
  inputClass: 'customClass'
};
var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
/**
 * Is valid parameter
 * @param {String} paramName
 */

var isValidParameter = function isValidParameter(paramName) {
  return defaultParams.hasOwnProperty(paramName);
};
/**
 * Is valid parameter for Swal.update() method
 * @param {String} paramName
 */

var isUpdatableParameter = function isUpdatableParameter(paramName) {
  return updatableParams.indexOf(paramName) !== -1;
};
/**
 * Is deprecated parameter
 * @param {String} paramName
 */

var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
  return deprecatedParams[paramName];
};

var checkIfParamIsValid = function checkIfParamIsValid(param) {
  if (!isValidParameter(param)) {
    warn("Unknown parameter \"".concat(param, "\""));
  }
};

var checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
  if (toastIncompatibleParams.indexOf(param) !== -1) {
    warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
  }
};

var checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
  if (isDeprecatedParameter(param)) {
    warnAboutDepreation(param, isDeprecatedParameter(param));
  }
};
/**
 * Show relevant warnings for given params
 *
 * @param params
 */


var showWarningsForParams = function showWarningsForParams(params) {
  for (var param in params) {
    checkIfParamIsValid(param);

    if (params.toast) {
      checkIfToastParamIsValid(param);
    }

    checkIfParamIsDeprecated();
  }
};



var staticMethods = Object.freeze({
	isValidParameter: isValidParameter,
	isUpdatableParameter: isUpdatableParameter,
	isDeprecatedParameter: isDeprecatedParameter,
	argsToParams: argsToParams,
	isVisible: isVisible$1,
	clickConfirm: clickConfirm,
	clickCancel: clickCancel,
	getContainer: getContainer,
	getPopup: getPopup,
	getTitle: getTitle,
	getContent: getContent,
	getImage: getImage,
	getIcon: getIcon,
	getIcons: getIcons,
	getCloseButton: getCloseButton,
	getActions: getActions,
	getConfirmButton: getConfirmButton,
	getCancelButton: getCancelButton,
	getHeader: getHeader,
	getFooter: getFooter,
	getFocusableElements: getFocusableElements,
	getValidationMessage: getValidationMessage,
	isLoading: isLoading,
	fire: fire,
	mixin: mixin,
	queue: queue,
	getQueueStep: getQueueStep,
	insertQueueStep: insertQueueStep,
	deleteQueueStep: deleteQueueStep,
	showLoading: showLoading,
	enableLoading: showLoading,
	getTimerLeft: getTimerLeft,
	stopTimer: stopTimer,
	resumeTimer: resumeTimer,
	toggleTimer: toggleTimer,
	increaseTimer: increaseTimer,
	isTimerRunning: isTimerRunning
});

/**
 * Enables buttons and hide loader.
 */

function hideLoading() {
  var innerParams = privateProps.innerParams.get(this);
  var domCache = privateProps.domCache.get(this);

  if (!innerParams.showConfirmButton) {
    hide(domCache.confirmButton);

    if (!innerParams.showCancelButton) {
      hide(domCache.actions);
    }
  }

  removeClass([domCache.popup, domCache.actions], swalClasses.loading);
  domCache.popup.removeAttribute('aria-busy');
  domCache.popup.removeAttribute('data-loading');
  domCache.confirmButton.disabled = false;
  domCache.cancelButton.disabled = false;
}

function getInput$1(instance) {
  var innerParams = privateProps.innerParams.get(instance || this);
  var domCache = privateProps.domCache.get(instance || this);
  return getInput(domCache.content, innerParams.input);
}

var fixScrollbar = function fixScrollbar() {
  // for queues, do not do this more than once
  if (states.previousBodyPadding !== null) {
    return;
  } // if the body has overflow


  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
    document.body.style.paddingRight = states.previousBodyPadding + measureScrollbar() + 'px';
  }
};
var undoScrollbar = function undoScrollbar() {
  if (states.previousBodyPadding !== null) {
    document.body.style.paddingRight = states.previousBodyPadding + 'px';
    states.previousBodyPadding = null;
  }
};

/* istanbul ignore next */

var iOSfix = function iOSfix() {
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
    var offset = document.body.scrollTop;
    document.body.style.top = offset * -1 + 'px';
    addClass(document.body, swalClasses.iosfix);
    lockBodyScroll();
  }
};

var lockBodyScroll = function lockBodyScroll() {
  // #1246
  var container = getContainer();
  var preventTouchMove;

  container.ontouchstart = function (e) {
    preventTouchMove = e.target === container || !isScrollable(container);
  };

  container.ontouchmove = function (e) {
    if (preventTouchMove) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
};
/* istanbul ignore next */


var undoIOSfix = function undoIOSfix() {
  if (hasClass(document.body, swalClasses.iosfix)) {
    var offset = parseInt(document.body.style.top, 10);
    removeClass(document.body, swalClasses.iosfix);
    document.body.style.top = '';
    document.body.scrollTop = offset * -1;
  }
};

var isIE11 = function isIE11() {
  return !!window.MSInputMethodContext && !!document.documentMode;
}; // Fix IE11 centering sweetalert2/issues/933

/* istanbul ignore next */


var fixVerticalPositionIE = function fixVerticalPositionIE() {
  var container = getContainer();
  var popup = getPopup();
  container.style.removeProperty('align-items');

  if (popup.offsetTop < 0) {
    container.style.alignItems = 'flex-start';
  }
};
/* istanbul ignore next */


var IEfix = function IEfix() {
  if (typeof window !== 'undefined' && isIE11()) {
    fixVerticalPositionIE();
    window.addEventListener('resize', fixVerticalPositionIE);
  }
};
/* istanbul ignore next */

var undoIEfix = function undoIEfix() {
  if (typeof window !== 'undefined' && isIE11()) {
    window.removeEventListener('resize', fixVerticalPositionIE);
  }
};

// Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
// elements not within the active modal dialog will not be surfaced if a user opens a screen
// reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

var setAriaHidden = function setAriaHidden() {
  var bodyChildren = toArray(document.body.children);
  bodyChildren.forEach(function (el) {
    if (el === getContainer() || contains(el, getContainer())) {
      return;
    }

    if (el.hasAttribute('aria-hidden')) {
      el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
    }

    el.setAttribute('aria-hidden', 'true');
  });
};
var unsetAriaHidden = function unsetAriaHidden() {
  var bodyChildren = toArray(document.body.children);
  bodyChildren.forEach(function (el) {
    if (el.hasAttribute('data-previous-aria-hidden')) {
      el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
      el.removeAttribute('data-previous-aria-hidden');
    } else {
      el.removeAttribute('aria-hidden');
    }
  });
};

/**
 * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
 * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
 * This is the approach that Babel will probably take to implement private methods/fields
 *   https://github.com/tc39/proposal-private-methods
 *   https://github.com/babel/babel/pull/7555
 * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
 *   then we can use that language feature.
 */
var privateMethods = {
  swalPromiseResolve: new WeakMap()
};

/*
 * Instance method to close sweetAlert
 */

function removePopupAndResetState(container, isToast, onAfterClose) {
  if (isToast) {
    triggerOnAfterClose(onAfterClose);
  } else {
    restoreActiveElement().then(function () {
      return triggerOnAfterClose(onAfterClose);
    });
    globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
      capture: globalState.keydownListenerCapture
    });
    globalState.keydownHandlerAdded = false;
  } // Unset globalState props so GC will dispose globalState (#1569)


  delete globalState.keydownHandler;
  delete globalState.keydownTarget;

  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }

  removeBodyClasses();

  if (isModal()) {
    undoScrollbar();
    undoIOSfix();
    undoIEfix();
    unsetAriaHidden();
  }
}

function removeBodyClasses() {
  removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);
}

function swalCloseEventFinished(popup, container, isToast, onAfterClose) {
  if (hasClass(popup, swalClasses.hide)) {
    removePopupAndResetState(container, isToast, onAfterClose);
  } // Unset WeakMaps so GC will be able to dispose them (#1569)


  unsetWeakMaps(privateProps);
  unsetWeakMaps(privateMethods);
}

function close(resolveValue) {
  var container = getContainer();
  var popup = getPopup();

  if (!popup || hasClass(popup, swalClasses.hide)) {
    return;
  }

  var innerParams = privateProps.innerParams.get(this);
  var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
  var onClose = innerParams.onClose;
  var onAfterClose = innerParams.onAfterClose;
  removeClass(popup, swalClasses.show);
  addClass(popup, swalClasses.hide); // If animation is supported, animate

  if (animationEndEvent && hasCssAnimation(popup)) {
    popup.addEventListener(animationEndEvent, function (e) {
      if (e.target === popup) {
        swalCloseEventFinished(popup, container, isToast(), onAfterClose);
      }
    });
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState(container, isToast(), onAfterClose);
  }

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup);
  } // Resolve Swal promise


  swalPromiseResolve(resolveValue || {}); // Unset this.params so GC will dispose it (#1569)

  delete this.params;
}

var unsetWeakMaps = function unsetWeakMaps(obj) {
  for (var i in obj) {
    obj[i] = new WeakMap();
  }
};

var triggerOnAfterClose = function triggerOnAfterClose(onAfterClose) {
  if (onAfterClose !== null && typeof onAfterClose === 'function') {
    setTimeout(function () {
      onAfterClose();
    });
  }
};

function setButtonsDisabled(instance, buttons, disabled) {
  var domCache = privateProps.domCache.get(instance);
  buttons.forEach(function (button) {
    domCache[button].disabled = disabled;
  });
}

function setInputDisabled(input, disabled) {
  if (!input) {
    return false;
  }

  if (input.type === 'radio') {
    var radiosContainer = input.parentNode.parentNode;
    var radios = radiosContainer.querySelectorAll('input');

    for (var i = 0; i < radios.length; i++) {
      radios[i].disabled = disabled;
    }
  } else {
    input.disabled = disabled;
  }
}

function enableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'cancelButton'], false);
}
function disableButtons() {
  setButtonsDisabled(this, ['confirmButton', 'cancelButton'], true);
} // @deprecated

function enableConfirmButton() {
  warnAboutDepreation('Swal.disableConfirmButton()', "Swal.getConfirmButton().removeAttribute('disabled')");
  setButtonsDisabled(this, ['confirmButton'], false);
} // @deprecated

function disableConfirmButton() {
  warnAboutDepreation('Swal.enableConfirmButton()', "Swal.getConfirmButton().setAttribute('disabled', '')");
  setButtonsDisabled(this, ['confirmButton'], true);
}
function enableInput() {
  return setInputDisabled(this.getInput(), false);
}
function disableInput() {
  return setInputDisabled(this.getInput(), true);
}

function showValidationMessage(error) {
  var domCache = privateProps.domCache.get(this);
  domCache.validationMessage.innerHTML = error;
  var popupComputedStyle = window.getComputedStyle(domCache.popup);
  domCache.validationMessage.style.marginLeft = "-".concat(popupComputedStyle.getPropertyValue('padding-left'));
  domCache.validationMessage.style.marginRight = "-".concat(popupComputedStyle.getPropertyValue('padding-right'));
  show(domCache.validationMessage);
  var input = this.getInput();

  if (input) {
    input.setAttribute('aria-invalid', true);
    input.setAttribute('aria-describedBy', swalClasses['validation-message']);
    focusInput(input);
    addClass(input, swalClasses.inputerror);
  }
} // Hide block with validation message

function resetValidationMessage$1() {
  var domCache = privateProps.domCache.get(this);

  if (domCache.validationMessage) {
    hide(domCache.validationMessage);
  }

  var input = this.getInput();

  if (input) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedBy');
    removeClass(input, swalClasses.inputerror);
  }
}

function getProgressSteps$1() {
  warnAboutDepreation('Swal.getProgressSteps()', "const swalInstance = Swal.fire({progressSteps: ['1', '2', '3']}); const progressSteps = swalInstance.params.progressSteps");
  var innerParams = privateProps.innerParams.get(this);
  return innerParams.progressSteps;
}
function setProgressSteps(progressSteps) {
  warnAboutDepreation('Swal.setProgressSteps()', 'Swal.update()');
  var innerParams = privateProps.innerParams.get(this);

  var updatedParams = _extends({}, innerParams, {
    progressSteps: progressSteps
  });

  renderProgressSteps(this, updatedParams);
  privateProps.innerParams.set(this, updatedParams);
}
function showProgressSteps() {
  var domCache = privateProps.domCache.get(this);
  show(domCache.progressSteps);
}
function hideProgressSteps() {
  var domCache = privateProps.domCache.get(this);
  hide(domCache.progressSteps);
}

var Timer =
/*#__PURE__*/
function () {
  function Timer(callback, delay) {
    _classCallCheck(this, Timer);

    this.callback = callback;
    this.remaining = delay;
    this.running = false;
    this.start();
  }

  _createClass(Timer, [{
    key: "start",
    value: function start() {
      if (!this.running) {
        this.running = true;
        this.started = new Date();
        this.id = setTimeout(this.callback, this.remaining);
      }

      return this.remaining;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.running) {
        this.running = false;
        clearTimeout(this.id);
        this.remaining -= new Date() - this.started;
      }

      return this.remaining;
    }
  }, {
    key: "increase",
    value: function increase(n) {
      var running = this.running;

      if (running) {
        this.stop();
      }

      this.remaining += n;

      if (running) {
        this.start();
      }

      return this.remaining;
    }
  }, {
    key: "getTimerLeft",
    value: function getTimerLeft() {
      if (this.running) {
        this.stop();
        this.start();
      }

      return this.remaining;
    }
  }, {
    key: "isRunning",
    value: function isRunning() {
      return this.running;
    }
  }]);

  return Timer;
}();

var defaultInputValidators = {
  email: function email(string, validationMessage) {
    return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage ? validationMessage : 'Invalid email address');
  },
  url: function url(string, validationMessage) {
    // taken from https://stackoverflow.com/a/3809435 with a small change from #1306
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage ? validationMessage : 'Invalid URL');
  }
};

/**
 * Set type, text and actions on popup
 *
 * @param params
 * @returns {boolean}
 */

function setParameters(params) {
  // Use default `inputValidator` for supported input types if not provided
  if (!params.inputValidator) {
    Object.keys(defaultInputValidators).forEach(function (key) {
      if (params.input === key) {
        params.inputValidator = defaultInputValidators[key];
      }
    });
  } // showLoaderOnConfirm && preConfirm


  if (params.showLoaderOnConfirm && !params.preConfirm) {
    warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
  } // params.animation will be actually used in renderPopup.js
  // but in case when params.animation is a function, we need to call that function
  // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
  // inside the params.animation function


  params.animation = callIfFunction(params.animation); // Determine if the custom target element is valid

  if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
    warn('Target parameter is not valid, defaulting to "body"');
    params.target = 'body';
  } // Replace newlines with <br> in title


  if (typeof params.title === 'string') {
    params.title = params.title.split('\n').join('<br />');
  }

  var oldPopup = getPopup();
  var targetElement = typeof params.target === 'string' ? document.querySelector(params.target) : params.target;

  if (!oldPopup || // If the model target has changed, refresh the popup
  oldPopup && targetElement && oldPopup.parentNode !== targetElement.parentNode) {
    init(params);
  }
}

function swalOpenAnimationFinished(popup, container) {
  popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
  container.style.overflowY = 'auto';
}
/**
 * Open popup, add necessary classes and styles, fix scrollbar
 *
 * @param {Array} params
 */


var openPopup = function openPopup(params) {
  var container = getContainer();
  var popup = getPopup();

  if (params.onBeforeOpen !== null && typeof params.onBeforeOpen === 'function') {
    params.onBeforeOpen(popup);
  }

  if (params.animation) {
    addClass(popup, swalClasses.show);
    addClass(container, swalClasses.fade);
  }

  show(popup); // scrolling is 'hidden' until animation is done, after that 'auto'

  if (animationEndEvent && hasCssAnimation(popup)) {
    container.style.overflowY = 'hidden';
    popup.addEventListener(animationEndEvent, swalOpenAnimationFinished.bind(null, popup, container));
  } else {
    container.style.overflowY = 'auto';
  }

  addClass([document.documentElement, document.body, container], swalClasses.shown);

  if (params.heightAuto && params.backdrop && !params.toast) {
    addClass([document.documentElement, document.body], swalClasses['height-auto']);
  }

  if (isModal()) {
    if (params.scrollbarPadding) {
      fixScrollbar();
    }

    iOSfix();
    IEfix();
    setAriaHidden(); // sweetalert2/issues/1247

    setTimeout(function () {
      container.scrollTop = 0;
    });
  }

  if (!isToast() && !globalState.previousActiveElement) {
    globalState.previousActiveElement = document.activeElement;
  }

  if (params.onOpen !== null && typeof params.onOpen === 'function') {
    setTimeout(function () {
      params.onOpen(popup);
    });
  }
};

var _this = undefined;

var handleInputOptions = function handleInputOptions(instance, params) {
  var content = getContent();

  var processInputOptions = function processInputOptions(inputOptions) {
    return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
  };

  if (isPromise(params.inputOptions)) {
    showLoading();
    params.inputOptions.then(function (inputOptions) {
      instance.hideLoading();
      processInputOptions(inputOptions);
    });
  } else if (_typeof(params.inputOptions) === 'object') {
    processInputOptions(params.inputOptions);
  } else {
    error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
  }
};
var handleInputValue = function handleInputValue(instance, params) {
  var input = instance.getInput();
  hide(input);
  params.inputValue.then(function (inputValue) {
    input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : inputValue + '';
    show(input);
    input.focus();
    instance.hideLoading();
  })["catch"](function (err) {
    error('Error in inputValue promise: ' + err);
    input.value = '';
    show(input);
    input.focus();

    _this.hideLoading();
  });
};
var populateInputOptions = {
  select: function select(content, inputOptions, params) {
    var select = getChildByClass(content, swalClasses.select);
    inputOptions.forEach(function (inputOption) {
      var optionValue = inputOption[0];
      var optionLabel = inputOption[1];
      var option = document.createElement('option');
      option.value = optionValue;
      option.innerHTML = optionLabel;

      if (params.inputValue.toString() === optionValue.toString()) {
        option.selected = true;
      }

      select.appendChild(option);
    });
    select.focus();
  },
  radio: function radio(content, inputOptions, params) {
    var radio = getChildByClass(content, swalClasses.radio);
    inputOptions.forEach(function (inputOption) {
      var radioValue = inputOption[0];
      var radioLabel = inputOption[1];
      var radioInput = document.createElement('input');
      var radioLabelElement = document.createElement('label');
      radioInput.type = 'radio';
      radioInput.name = swalClasses.radio;
      radioInput.value = radioValue;

      if (params.inputValue.toString() === radioValue.toString()) {
        radioInput.checked = true;
      }

      var label = document.createElement('span');
      label.innerHTML = radioLabel;
      label.className = swalClasses.label;
      radioLabelElement.appendChild(radioInput);
      radioLabelElement.appendChild(label);
      radio.appendChild(radioLabelElement);
    });
    var radios = radio.querySelectorAll('input');

    if (radios.length) {
      radios[0].focus();
    }
  }
  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   * @param inputOptions
   */

};

var formatInputOptions = function formatInputOptions(inputOptions) {
  var result = [];

  if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
    inputOptions.forEach(function (value, key) {
      result.push([key, value]);
    });
  } else {
    Object.keys(inputOptions).forEach(function (key) {
      result.push([key, inputOptions[key]]);
    });
  }

  return result;
};

function _main(userParams) {
  var _this = this;

  showWarningsForParams(userParams);

  var innerParams = _extends({}, defaultParams, userParams);

  setParameters(innerParams);
  Object.freeze(innerParams); // clear the previous timer

  if (globalState.timeout) {
    globalState.timeout.stop();
    delete globalState.timeout;
  } // clear the restore focus timeout


  clearTimeout(globalState.restoreFocusTimeout);
  var domCache = {
    popup: getPopup(),
    container: getContainer(),
    content: getContent(),
    actions: getActions(),
    confirmButton: getConfirmButton(),
    cancelButton: getCancelButton(),
    closeButton: getCloseButton(),
    validationMessage: getValidationMessage(),
    progressSteps: getProgressSteps()
  };
  privateProps.domCache.set(this, domCache);
  render(this, innerParams);
  privateProps.innerParams.set(this, innerParams);
  var constructor = this.constructor;
  return new Promise(function (resolve) {
    // functions to handle all closings/dismissals
    var succeedWith = function succeedWith(value) {
      _this.closePopup({
        value: value
      });
    };

    var dismissWith = function dismissWith(dismiss) {
      _this.closePopup({
        dismiss: dismiss
      });
    };

    privateMethods.swalPromiseResolve.set(_this, resolve); // Close on timer

    if (innerParams.timer) {
      globalState.timeout = new Timer(function () {
        dismissWith('timer');
        delete globalState.timeout;
      }, innerParams.timer);
    } // Get the value of the popup input


    var getInputValue = function getInputValue() {
      var input = _this.getInput();

      if (!input) {
        return null;
      }

      switch (innerParams.input) {
        case 'checkbox':
          return input.checked ? 1 : 0;

        case 'radio':
          return input.checked ? input.value : null;

        case 'file':
          return input.files.length ? input.files[0] : null;

        default:
          return innerParams.inputAutoTrim ? input.value.trim() : input.value;
      }
    }; // input autofocus


    if (innerParams.input) {
      setTimeout(function () {
        var input = _this.getInput();

        if (input) {
          focusInput(input);
        }
      }, 0);
    }

    var confirm = function confirm(value) {
      if (innerParams.showLoaderOnConfirm) {
        constructor.showLoading(); // TODO: make showLoading an *instance* method
      }

      if (innerParams.preConfirm) {
        _this.resetValidationMessage();

        var preConfirmPromise = Promise.resolve().then(function () {
          return innerParams.preConfirm(value, innerParams.validationMessage);
        });
        preConfirmPromise.then(function (preConfirmValue) {
          if (isVisible(domCache.validationMessage) || preConfirmValue === false) {
            _this.hideLoading();
          } else {
            succeedWith(typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
          }
        });
      } else {
        succeedWith(value);
      }
    }; // Mouse interactions


    var onButtonEvent = function onButtonEvent(e) {
      var target = e.target;
      var confirmButton = domCache.confirmButton,
          cancelButton = domCache.cancelButton;
      var targetedConfirm = confirmButton && (confirmButton === target || confirmButton.contains(target));
      var targetedCancel = cancelButton && (cancelButton === target || cancelButton.contains(target));

      switch (e.type) {
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm) {
            _this.disableButtons();

            if (innerParams.input) {
              var inputValue = getInputValue();

              if (innerParams.inputValidator) {
                _this.disableInput();

                var validationPromise = Promise.resolve().then(function () {
                  return innerParams.inputValidator(inputValue, innerParams.validationMessage);
                });
                validationPromise.then(function (validationMessage) {
                  _this.enableButtons();

                  _this.enableInput();

                  if (validationMessage) {
                    _this.showValidationMessage(validationMessage);
                  } else {
                    confirm(inputValue);
                  }
                });
              } else if (!_this.getInput().checkValidity()) {
                _this.enableButtons();

                _this.showValidationMessage(innerParams.validationMessage);
              } else {
                confirm(inputValue);
              }
            } else {
              confirm(true);
            } // Clicked 'cancel'

          } else if (targetedCancel) {
            _this.disableButtons();

            dismissWith(constructor.DismissReason.cancel);
          }

          break;

        default:
      }
    };

    var buttons = domCache.popup.querySelectorAll('button');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].onclick = onButtonEvent;
      buttons[i].onmouseover = onButtonEvent;
      buttons[i].onmouseout = onButtonEvent;
      buttons[i].onmousedown = onButtonEvent;
    } // Closing popup by close button


    domCache.closeButton.onclick = function () {
      dismissWith(constructor.DismissReason.close);
    };

    if (innerParams.toast) {
      // Closing popup by internal click
      domCache.popup.onclick = function () {
        if (innerParams.showConfirmButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
          return;
        }

        dismissWith(constructor.DismissReason.close);
      };
    } else {
      var ignoreOutsideClick = false; // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider

      domCache.popup.onmousedown = function () {
        domCache.container.onmouseup = function (e) {
          domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
          // have any other direct children aside of the popup

          if (e.target === domCache.container) {
            ignoreOutsideClick = true;
          }
        };
      }; // Ignore click events that had mousedown on the container but mouseup on the popup


      domCache.container.onmousedown = function () {
        domCache.popup.onmouseup = function (e) {
          domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

          if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
            ignoreOutsideClick = true;
          }
        };
      };

      domCache.container.onclick = function (e) {
        if (ignoreOutsideClick) {
          ignoreOutsideClick = false;
          return;
        }

        if (e.target !== domCache.container) {
          return;
        }

        if (callIfFunction(innerParams.allowOutsideClick)) {
          dismissWith(constructor.DismissReason.backdrop);
        }
      };
    } // Reverse buttons (Confirm on the right side)


    if (innerParams.reverseButtons) {
      domCache.confirmButton.parentNode.insertBefore(domCache.cancelButton, domCache.confirmButton);
    } else {
      domCache.confirmButton.parentNode.insertBefore(domCache.confirmButton, domCache.cancelButton);
    } // Focus handling


    var setFocus = function setFocus(index, increment) {
      var focusableElements = getFocusableElements(innerParams.focusCancel); // search for visible elements and select the next possible match

      for (var _i = 0; _i < focusableElements.length; _i++) {
        index = index + increment; // rollover to first item

        if (index === focusableElements.length) {
          index = 0; // go to last item
        } else if (index === -1) {
          index = focusableElements.length - 1;
        }

        return focusableElements[index].focus();
      } // no visible focusable elements, focus the popup


      domCache.popup.focus();
    };

    var keydownHandler = function keydownHandler(e, innerParams) {
      if (innerParams.stopKeydownPropagation) {
        e.stopPropagation();
      }

      var arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down' // IE11
      ];

      if (e.key === 'Enter' && !e.isComposing) {
        if (e.target && _this.getInput() && e.target.outerHTML === _this.getInput().outerHTML) {
          if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
            return; // do not submit
          }

          constructor.clickConfirm();
          e.preventDefault();
        } // TAB

      } else if (e.key === 'Tab') {
        var targetElement = e.target;
        var focusableElements = getFocusableElements(innerParams.focusCancel);
        var btnIndex = -1;

        for (var _i2 = 0; _i2 < focusableElements.length; _i2++) {
          if (targetElement === focusableElements[_i2]) {
            btnIndex = _i2;
            break;
          }
        }

        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(btnIndex, 1);
        } else {
          // Cycle to the prev button
          setFocus(btnIndex, -1);
        }

        e.stopPropagation();
        e.preventDefault(); // ARROWS - switch focus between buttons
      } else if (arrowKeys.indexOf(e.key) !== -1) {
        // focus Cancel button if Confirm button is currently focused
        if (document.activeElement === domCache.confirmButton && isVisible(domCache.cancelButton)) {
          domCache.cancelButton.focus(); // and vice versa
        } else if (document.activeElement === domCache.cancelButton && isVisible(domCache.confirmButton)) {
          domCache.confirmButton.focus();
        } // ESC

      } else if ((e.key === 'Escape' || e.key === 'Esc') && callIfFunction(innerParams.allowEscapeKey) === true) {
        e.preventDefault();
        dismissWith(constructor.DismissReason.esc);
      }
    };

    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (!innerParams.toast) {
      globalState.keydownHandler = function (e) {
        return keydownHandler(e, innerParams);
      };

      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : domCache.popup;
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }

    _this.enableButtons();

    _this.hideLoading();

    _this.resetValidationMessage();

    if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
      addClass(document.body, swalClasses['toast-column']);
    } else {
      removeClass(document.body, swalClasses['toast-column']);
    } // inputOptions, inputValue


    if (innerParams.input === 'select' || innerParams.input === 'radio') {
      handleInputOptions(_this, innerParams);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(innerParams.input) !== -1 && isPromise(innerParams.inputValue)) {
      handleInputValue(_this, innerParams);
    }

    openPopup(innerParams);

    if (!innerParams.toast) {
      if (!callIfFunction(innerParams.allowEnterKey)) {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      } else if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
        domCache.cancelButton.focus();
      } else if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
        domCache.confirmButton.focus();
      } else {
        setFocus(-1, 1);
      }
    } // fix scroll


    domCache.container.scrollTop = 0;
  });
}

/**
 * Updates popup parameters.
 */

function update(params) {
  var validUpdatableParams = {}; // assign valid params from `params` to `defaults`

  Object.keys(params).forEach(function (param) {
    if (Swal.isUpdatableParameter(param)) {
      validUpdatableParams[param] = params[param];
    } else {
      warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js"));
    }
  });
  var innerParams = privateProps.innerParams.get(this);

  var updatedParams = _extends({}, innerParams, validUpdatableParams);

  render(this, updatedParams);
  privateProps.innerParams.set(this, updatedParams);
  Object.defineProperties(this, {
    params: {
      value: _extends({}, this.params, params),
      writable: false,
      enumerable: true
    }
  });
}



var instanceMethods = Object.freeze({
	hideLoading: hideLoading,
	disableLoading: hideLoading,
	getInput: getInput$1,
	close: close,
	closePopup: close,
	closeModal: close,
	closeToast: close,
	enableButtons: enableButtons,
	disableButtons: disableButtons,
	enableConfirmButton: enableConfirmButton,
	disableConfirmButton: disableConfirmButton,
	enableInput: enableInput,
	disableInput: disableInput,
	showValidationMessage: showValidationMessage,
	resetValidationMessage: resetValidationMessage$1,
	getProgressSteps: getProgressSteps$1,
	setProgressSteps: setProgressSteps,
	showProgressSteps: showProgressSteps,
	hideProgressSteps: hideProgressSteps,
	_main: _main,
	update: update
});

var currentInstance; // SweetAlert constructor

function SweetAlert() {
  // Prevent run in Node env

  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    return;
  } // Check for the existence of Promise

  /* istanbul ignore if */


  if (typeof Promise === 'undefined') {
    error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
  }

  currentInstance = this;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var outerParams = Object.freeze(this.constructor.argsToParams(args));
  Object.defineProperties(this, {
    params: {
      value: outerParams,
      writable: false,
      enumerable: true,
      configurable: true
    }
  });

  var promise = this._main(this.params);

  privateProps.promise.set(this, promise);
} // `catch` cannot be the name of a module export, so we define our thenable methods here instead


SweetAlert.prototype.then = function (onFulfilled) {
  var promise = privateProps.promise.get(this);
  return promise.then(onFulfilled);
};

SweetAlert.prototype["finally"] = function (onFinally) {
  var promise = privateProps.promise.get(this);
  return promise["finally"](onFinally);
}; // Assign instance methods from src/instanceMethods/*.js to prototype


_extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


_extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


Object.keys(instanceMethods).forEach(function (key) {
  SweetAlert[key] = function () {
    if (currentInstance) {
      var _currentInstance;

      return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
    }
  };
});
SweetAlert.DismissReason = DismissReason;
SweetAlert.version = '8.11.6';

var Swal = SweetAlert;
Swal["default"] = Swal;

return Swal;

})));
if (typeof window !== 'undefined' && window.Sweetalert2){  window.swal = window.sweetAlert = window.Swal = window.SweetAlert = window.Sweetalert2}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"@charset \"UTF-8\";@-webkit-keyframes swal2-show{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes swal2-show{0%{-webkit-transform:scale(.7);transform:scale(.7)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}100%{-webkit-transform:scale(1);transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}100%{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{-webkit-transform:scale(1);transform:scale(1);opacity:1}100%{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.875em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}100%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}100%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}50%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}80%{margin-top:-.375em;-webkit-transform:scale(1.15);transform:scale(1.15)}100%{margin-top:0;-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}50%{margin-top:1.625em;-webkit-transform:scale(.4);transform:scale(.4);opacity:0}80%{margin-top:-.375em;-webkit-transform:scale(1.15);transform:scale(1.15)}100%{margin-top:0;-webkit-transform:scale(1);transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}100%{-webkit-transform:rotateX(0);transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}100%{-webkit-transform:rotateX(0);transform:rotateX(0);opacity:1}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-shown{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon::before{display:flex;align-items:center;font-size:2em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon::before{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex-basis:auto!important;height:auto;margin:0 .3125em}.swal2-popup.swal2-toast .swal2-styled{margin:0 .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 .0625em #fff,0 0 0 .125em rgba(50,100,150,.4)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:2em 2em;transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;-webkit-transform-origin:0 1.5em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}@-webkit-keyframes swal2-toast-show{0%{-webkit-transform:translateY(-.625em) rotateZ(2deg);transform:translateY(-.625em) rotateZ(2deg)}33%{-webkit-transform:translateY(0) rotateZ(-2deg);transform:translateY(0) rotateZ(-2deg)}66%{-webkit-transform:translateY(.3125em) rotateZ(2deg);transform:translateY(.3125em) rotateZ(2deg)}100%{-webkit-transform:translateY(0) rotateZ(0);transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{-webkit-transform:translateY(-.625em) rotateZ(2deg);transform:translateY(-.625em) rotateZ(2deg)}33%{-webkit-transform:translateY(0) rotateZ(-2deg);transform:translateY(0) rotateZ(-2deg)}66%{-webkit-transform:translateY(.3125em) rotateZ(2deg);transform:translateY(.3125em) rotateZ(2deg)}100%{-webkit-transform:translateY(0) rotateZ(0);transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{-webkit-transform:rotateZ(1deg);transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{-webkit-transform:rotateZ(1deg);transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-shown{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent}body.swal2-no-backdrop .swal2-shown>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-shown.swal2-top{top:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-top-left,body.swal2-no-backdrop .swal2-shown.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-top-end,body.swal2-no-backdrop .swal2-shown.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-shown.swal2-center{top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-left,body.swal2-no-backdrop .swal2-shown.swal2-center-start{top:50%;left:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-center-end,body.swal2-no-backdrop .swal2-shown.swal2-center-right{top:50%;right:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom{bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}body.swal2-no-backdrop .swal2-shown.swal2-bottom-left,body.swal2-no-backdrop .swal2-shown.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-shown.swal2-bottom-end,body.swal2-no-backdrop .swal2-shown.swal2-bottom-right{right:0;bottom:0}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;background-color:transparent;-webkit-overflow-scrolling:touch}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-container.swal2-fade{transition:background-color .1s}.swal2-container.swal2-shown{background-color:rgba(0,0,0,.4)}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:.3125em;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{z-index:1;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-actions.swal2-loading .swal2-styled.swal2-confirm{box-sizing:border-box;width:2.5em;height:2.5em;margin:.46875em;padding:0;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:.25em solid transparent;border-radius:100%;border-color:transparent;background-color:transparent!important;color:transparent;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-actions.swal2-loading .swal2-styled.swal2-cancel{margin-right:30px;margin-left:30px}.swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after{content:\"\";display:inline-block;width:15px;height:15px;margin-left:5px;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:3px solid #999;border-radius:50%;border-right-color:transparent;box-shadow:1px 1px 1px #fff}.swal2-styled{margin:.3125em;padding:.625em 2em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#3085d6;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#aaa;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 2px #fff,0 0 0 4px rgba(50,100,150,.4)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;top:0;right:0;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:0;outline:initial;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{-webkit-transform:none;transform:none;background:0 0;color:#f27474}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0;color:#545454;font-size:1.125em;font-weight:300;line-height:normal;word-wrap:break-word}#swal2-content{text-align:center}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 3px #c4e6f5}.swal2-file::-webkit-input-placeholder,.swal2-input::-webkit-input-placeholder,.swal2-textarea::-webkit-input-placeholder{color:#ccc}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::-ms-input-placeholder,.swal2-input::-ms-input-placeholder,.swal2-textarea::-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:inherit}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:inherit;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-validation-message{display:none;align-items:center;justify-content:center;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;zoom:normal;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-moz-document url-prefix(){.swal2-close:focus{outline:2px solid rgba(50,100,150,.4)}}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;zoom:normal;border:.25em solid transparent;border-radius:50%;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon::before{display:flex;align-items:center;height:92%;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning::before{content:\"!\"}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info::before{content:\"i\"}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question::before{content:\"?\"}.swal2-icon.swal2-question.swal2-arabic-question-mark::before{content:\"؟\"}.swal2-icon.swal2-success{border-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:3.75em 3.75em;transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 3.75em;transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.875em;width:1.5625em;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal2-progress-steps{align-items:center;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;width:2em;height:2em;border-radius:2em;background:#3085d6;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#3085d6}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;width:2.5em;height:.4em;margin:0 -1px;background:#3085d6}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-show.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-hide.swal2-noanimation{-webkit-animation:none;animation:none}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-animate-success-icon .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-animate-success-icon .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-animate-success-icon .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-animate-error-icon{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-animate-error-icon .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}@-webkit-keyframes swal2-rotate-loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}");

/***/ }),

/***/ "./node_modules/tableexport.jquery.plugin/tableExport.js":
/*!***************************************************************!*\
  !*** ./node_modules/tableexport.jquery.plugin/tableExport.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {/**
 * @preserve tableExport.jquery.plugin
 *
 * Version 1.10.4
 *
 * Copyright (c) 2015-2019 hhurz, https://github.com/hhurz
 *
 * Original Work Copyright (c) 2014 Giri Raj
 *
 * Licensed under the MIT License
 **/



(function ($) {
  $.fn.tableExport = function (options) {
    var defaults = {
      csvEnclosure:        '"',
      csvSeparator:        ',',
      csvUseBOM:           true,
      displayTableName:    false,
      escape:              false,
      exportHiddenCells:   false,       // true = speed up export of large tables with hidden cells (hidden cells will be exported !)
      fileName:            'tableExport',
      htmlContent:         false,
      ignoreColumn:        [],
      ignoreRow:           [],
      jsonScope:           'all',       // head, data, all
      jspdf: {                          // jsPDF / jsPDF-AutoTable related options
        orientation:       'p',
        unit:              'pt',
        format:            'a4',        // One of jsPDF page formats or 'bestfit' for autmatic paper format selection
        margins:           {left: 20, right: 10, top: 10, bottom: 10},
        onDocCreated:      null,
        autotable: {
          styles: {
            cellPadding:   2,
            rowHeight:     12,
            fontSize:      8,
            fillColor:     255,         // Color value or 'inherit' to use css background-color from html table
            textColor:     50,          // Color value or 'inherit' to use css color from html table
            fontStyle:     'normal',    // normal, bold, italic, bolditalic or 'inherit' to use css font-weight and fonst-style from html table
            overflow:      'ellipsize', // visible, hidden, ellipsize or linebreak
            halign:        'inherit',   // left, center, right or 'inherit' to use css horizontal cell alignment from html table
            valign:        'middle'     // top, middle, bottom
          },
          headerStyles: {
            fillColor:     [52, 73, 94],
            textColor:     255,
            fontStyle:     'bold',
            halign:        'inherit',   // left, center, right or 'inherit' to use css horizontal header cell alignment from html table
            valign:        'middle'     // top, middle, bottom
          },
          alternateRowStyles: {
            fillColor:     245
          },
          tableExport: {
            doc:               null,    // jsPDF doc object. If set, an already created doc will be used to export to
            onAfterAutotable:  null,
            onBeforeAutotable: null,
            onAutotableText:   null,
            onTable:           null,
            outputImages:      true
          }
        }
      },
      mso: {                            // MS Excel and MS Word related options
        fileFormat:        'xlshtml',   // xlshtml = Excel 2000 html format
                                        // xmlss = XML Spreadsheet 2003 file format (XMLSS)
                                        // xlsx = Excel 2007 Office Open XML format
        onMsoNumberFormat: null,        // Excel 2000 html format only. See readme.md for more information about msonumberformat
        pageFormat:        'a4',        // Page format used for page orientation
        pageOrientation:   'portrait',  // portrait, landscape (xlshtml format only)
        rtl:               false,       // true = Set worksheet option 'DisplayRightToLeft'
        styles:            [],          // E.g. ['border-bottom', 'border-top', 'border-left', 'border-right']
        worksheetName:     ''
      },
      numbers: {
        html: {
          decimalMark:        '.',
          thousandsSeparator: ','
        },
        output: {                       // Use 'output: false' to keep number format in exported output
          decimalMark:        '.',
          thousandsSeparator: ','
        }
      },
      onAfterSaveToFile:   null,
      onBeforeSaveToFile:  null,        // Return false as result to abort save process
      onCellData:          null,
      onCellHtmlData:      null,
      onIgnoreRow:         null,        // onIgnoreRow($tr, rowIndex): function should return true to not export a row
      outputMode:          'file',      // 'file', 'string', 'base64' or 'window' (experimental)
      pdfmake: {
        enabled:           false,       // true: use pdfmake instead of jspdf and jspdf-autotable (experimental)
        docDefinition: {
          pageOrientation: 'portrait',  // 'portrait' or 'landscape'
          defaultStyle: {
            font:          'Roboto'     // Default is 'Roboto', for arabic font set this option to 'Mirza' and include mirza_fonts.js
          }
        },
        fonts: {}
      },
      preserve: {
        leadingWS:         false,       // preserve leading white spaces
        trailingWS:        false        // preserve trailing white spaces
      },
      preventInjection:    true,        // Prepend a single quote to cell strings that start with =,+,- or @ to prevent formula injection
      sql: {
        tableEnclosure:     '`',        // If table or column names contain any characters except letters, numbers, and
        columnEnclosure:    '`'         // underscores usually the name must be delimited by enclosing it in back quotes (`)
      },
      tbodySelector:       'tr',
      tfootSelector:       'tr',        // Set empty ('') to prevent export of tfoot rows
      theadSelector:       'tr',
      tableName:           'Table',
      type:                'csv'        // 'csv', 'tsv', 'txt', 'sql', 'json', 'xml', 'excel', 'doc', 'png' or 'pdf'
    };

    var pageFormats = { // Size in pt of various paper formats. Adopted from jsPDF.
      'a0': [2383.94, 3370.39], 'a1': [1683.78, 2383.94], 'a2': [1190.55, 1683.78],
      'a3': [841.89, 1190.55],  'a4': [595.28, 841.89],   'a5': [419.53, 595.28],
      'a6': [297.64, 419.53],   'a7': [209.76, 297.64],   'a8': [147.40, 209.76],
      'a9': [104.88, 147.40],   'a10': [73.70, 104.88],
      'b0': [2834.65, 4008.19], 'b1': [2004.09, 2834.65], 'b2': [1417.32, 2004.09],
      'b3': [1000.63, 1417.32], 'b4': [708.66, 1000.63],  'b5': [498.90, 708.66],
      'b6': [354.33, 498.90],   'b7': [249.45, 354.33],   'b8': [175.75, 249.45],
      'b9': [124.72, 175.75],   'b10': [87.87, 124.72],
      'c0': [2599.37, 3676.54],
      'c1': [1836.85, 2599.37], 'c2': [1298.27, 1836.85], 'c3': [918.43, 1298.27],
      'c4': [649.13, 918.43],   'c5': [459.21, 649.13],   'c6': [323.15, 459.21],
      'c7': [229.61, 323.15],   'c8': [161.57, 229.61],   'c9': [113.39, 161.57],
      'c10': [79.37, 113.39],
      'dl': [311.81, 623.62],
      'letter': [612, 792], 'government-letter': [576, 756], 'legal': [612, 1008],
      'junior-legal': [576, 360], 'ledger': [1224, 792], 'tabloid': [792, 1224],
      'credit-card': [153, 243]
    };
    var FONT_ROW_RATIO = 1.15;
    var el             = this;
    var DownloadEvt    = null;
    var $hrows         = [];
    var $rows          = [];
    var rowIndex       = 0;
    var trData         = '';
    var colNames       = [];
    var ranges         = [];
    var blob;
    var $hiddenTableElements = [];
    var checkCellVisibilty = false;

    $.extend(true, defaults, options);

    // Adopt deprecated options
    if (defaults.type === 'xlsx') {
      defaults.mso.fileFormat = defaults.type;
      defaults.type = 'excel';
    }
    if (typeof defaults.excelFileFormat !== 'undefined' && defaults.mso.fileFormat === 'undefined')
      defaults.mso.fileFormat = defaults.excelFileFormat;
    if (typeof defaults.excelPageFormat !== 'undefined' && defaults.mso.pageFormat === 'undefined')
      defaults.mso.pageFormat = defaults.excelPageFormat;
    if (typeof defaults.excelPageOrientation !== 'undefined' && defaults.mso.pageOrientation === 'undefined')
      defaults.mso.pageOrientation = defaults.excelPageOrientation;
    if (typeof defaults.excelRTL !== 'undefined' && defaults.mso.rtl === 'undefined')
      defaults.mso.rtl = defaults.excelRTL;
    if (typeof defaults.excelstyles !== 'undefined' && defaults.mso.styles === 'undefined')
      defaults.mso.styles = defaults.excelstyles;
    if (typeof defaults.onMsoNumberFormat !== 'undefined' && defaults.mso.onMsoNumberFormat === 'undefined')
      defaults.mso.onMsoNumberFormat = defaults.onMsoNumberFormat;
    if (typeof defaults.worksheetName !== 'undefined' && defaults.mso.worksheetName === 'undefined')
      defaults.mso.worksheetName = defaults.worksheetName;

    // Check values of some options
    defaults.mso.pageOrientation = (defaults.mso.pageOrientation.substr(0, 1) === 'l') ? 'landscape' : 'portrait';

    colNames = GetColumnNames(el);

    if ( defaults.type === 'csv' || defaults.type === 'tsv' || defaults.type === 'txt' ) {

      var csvData   = "";
      var rowlength = 0;
      ranges        = [];
      rowIndex      = 0;

      var csvString = function (cell, rowIndex, colIndex) {
        var result = '';

        if ( cell !== null ) {
          var dataString = parseString(cell, rowIndex, colIndex);

          var csvValue = (dataString === null || dataString === '') ? '' : dataString.toString();

          if ( defaults.type === 'tsv' ) {
            if ( dataString instanceof Date )
              dataString.toLocaleString();

            // According to http://www.iana.org/assignments/media-types/text/tab-separated-values
            // are fields that contain tabs not allowable in tsv encoding
            result = replaceAll(csvValue, '\t', ' ');
          }
          else {
            // Takes a string and encapsulates it (by default in double-quotes) if it
            // contains the csv field separator, spaces, or linebreaks.
            if ( dataString instanceof Date )
              result = defaults.csvEnclosure + dataString.toLocaleString() + defaults.csvEnclosure;
            else {
              result = preventInjection(csvValue);
              result = replaceAll(result, defaults.csvEnclosure, defaults.csvEnclosure + defaults.csvEnclosure);

              if ( result.indexOf(defaults.csvSeparator) >= 0 || /[\r\n ]/g.test(result) )
                result = defaults.csvEnclosure + result + defaults.csvEnclosure;
            }
          }
        }

        return result;
      };

      var CollectCsvData = function ($rows, rowselector, length) {

        $rows.each(function () {
          trData = "";
          ForEachVisibleCell(this, rowselector, rowIndex, length + $rows.length,
                             function (cell, row, col) {
                               trData += csvString(cell, row, col) + (defaults.type === 'tsv' ? '\t' : defaults.csvSeparator);
                             });
          trData = $.trim(trData).substring(0, trData.length - 1);
          if ( trData.length > 0 ) {

            if ( csvData.length > 0 )
              csvData += "\n";

            csvData += trData;
          }
          rowIndex++;
        });

        return $rows.length;
      };

      rowlength += CollectCsvData($(el).find('thead').first().find(defaults.theadSelector), 'th,td', rowlength);
      findTableElements($(el),'tbody').each(function () {
        rowlength += CollectCsvData(findTableElements($(this), defaults.tbodySelector), 'td,th', rowlength);
      });
      if ( defaults.tfootSelector.length )
        CollectCsvData($(el).find('tfoot').first().find(defaults.tfootSelector), 'td,th', rowlength);

      csvData += "\n";

      //output
      if ( defaults.outputMode === 'string' )
        return csvData;

      if ( defaults.outputMode === 'base64' )
        return base64encode(csvData);

      if ( defaults.outputMode === 'window' ) {
        downloadFile(false, 'data:text/' + (defaults.type === 'csv' ? 'csv' : 'plain') + ';charset=utf-8,', csvData);
        return;
      }

      saveToFile ( csvData, 
                   defaults.fileName + '.' + defaults.type, 
                   "text/" + (defaults.type === 'csv' ? 'csv' : 'plain'), 
                   "utf-8", 
                   "", 
                   (defaults.type === 'csv' && defaults.csvUseBOM) );

    } else if ( defaults.type === 'sql' ) {

      // Header
      rowIndex = 0;
      ranges   = [];
      var tdData = "INSERT INTO " + defaults.sql.tableEnclosure + defaults.tableName + defaults.sql.tableEnclosure + " (";
      $hrows     = collectHeadRows ($(el));
      $($hrows).each(function () {
        ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                           function (cell, row, col) {
                             tdData += defaults.sql.columnEnclosure + parseString(cell, row, col) + defaults.sql.columnEnclosure + ",";
                           });
        rowIndex++;
        tdData = $.trim(tdData).substring(0, tdData.length - 1);
      });
      tdData += ") VALUES ";

      // Data
      $rows = collectRows ($(el));
      $($rows).each(function () {
        trData = "";
        ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                           function (cell, row, col) {
                             trData += "'" + parseString(cell, row, col) + "',";
                           });
        if ( trData.length > 3 ) {
          tdData += "(" + trData;
          tdData = $.trim(tdData).substring(0, tdData.length - 1);
          tdData += "),";
        }
        rowIndex++;
      });

      tdData = $.trim(tdData).substring(0, tdData.length - 1);
      tdData += ";";

      // Output
      if ( defaults.outputMode === 'string' )
        return tdData;

      if ( defaults.outputMode === 'base64' )
        return base64encode(tdData);

      saveToFile ( tdData, defaults.fileName + '.sql', "application/sql", "utf-8", "", false );

    } else if ( defaults.type === 'json' ) {
      var jsonHeaderArray = [];
      ranges = [];
      $hrows = collectHeadRows ($(el));
      $($hrows).each(function () {
        var jsonArrayTd = [];

        ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                           function (cell, row, col) {
                             jsonArrayTd.push(parseString(cell, row, col));
                           });
        jsonHeaderArray.push(jsonArrayTd);
      });

      // Data
      var jsonArray = [];

      $rows = collectRows ($(el));
      $($rows).each(function () {
        var jsonObjectTd = {};
        var colIndex = 0;

        ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                           function (cell, row, col) {
                             if ( jsonHeaderArray.length ) {
                               jsonObjectTd[jsonHeaderArray[jsonHeaderArray.length - 1][colIndex]] = parseString(cell, row, col);
                             } else {
                               jsonObjectTd[colIndex] = parseString(cell, row, col);
                             }
                             colIndex++;
                           });
        if ( $.isEmptyObject(jsonObjectTd) === false )
          jsonArray.push(jsonObjectTd);

        rowIndex++;
      });

      var sdata = "";

      if ( defaults.jsonScope === 'head' )
        sdata = JSON.stringify(jsonHeaderArray);
      else if ( defaults.jsonScope === 'data' )
        sdata = JSON.stringify(jsonArray);
      else // all
        sdata = JSON.stringify({header: jsonHeaderArray, data: jsonArray});

      if ( defaults.outputMode === 'string' )
        return sdata;

      if ( defaults.outputMode === 'base64' )
        return base64encode(sdata);

      saveToFile ( sdata, defaults.fileName + '.json', "application/json", "utf-8", "base64", false );

    } else if ( defaults.type === 'xml' ) {
      rowIndex = 0;
      ranges   = [];
      var xml  = '<?xml version="1.0" encoding="utf-8"?>';
      xml += '<tabledata><fields>';

      // Header
      $hrows = collectHeadRows ($(el));
      $($hrows).each(function () {

        ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                           function (cell, row, col) {
                             xml += "<field>" + parseString(cell, row, col) + "</field>";
                           });
        rowIndex++;
      });
      xml += '</fields><data>';

      // Data
      var rowCount = 1;

      $rows = collectRows ($(el));
      $($rows).each(function () {
        var colCount = 1;
        trData       = "";
        ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                           function (cell, row, col) {
                             trData += "<column-" + colCount + ">" + parseString(cell, row, col) + "</column-" + colCount + ">";
                             colCount++;
                           });
        if ( trData.length > 0 && trData !== "<column-1></column-1>" ) {
          xml += '<row id="' + rowCount + '">' + trData + '</row>';
          rowCount++;
        }

        rowIndex++;
      });
      xml += '</data></tabledata>';

      // Output
      if ( defaults.outputMode === 'string' )
        return xml;

      if ( defaults.outputMode === 'base64' )
        return base64encode(xml);

      saveToFile ( xml, defaults.fileName + '.xml', "application/xml", "utf-8", "base64", false );
    }
    else if ( defaults.type === 'excel' && defaults.mso.fileFormat === 'xmlss' ) {
      var docDatas = [];
      var docNames = [];

      $(el).filter(function () {
        return isVisible($(this));
      }).each(function () {
        var $table  = $(this);

        var ssName = '';
        if ( typeof defaults.mso.worksheetName === 'string' && defaults.mso.worksheetName.length )
          ssName = defaults.mso.worksheetName + ' ' + (docNames.length + 1);
        else if ( typeof defaults.mso.worksheetName[docNames.length] !== 'undefined' )
          ssName = defaults.mso.worksheetName[docNames.length];
        if ( ! ssName.length )
          ssName = $table.find('caption').text() || '';
        if ( ! ssName.length )
          ssName = 'Table ' + (docNames.length + 1);
        ssName = $.trim(ssName.replace(/[\\\/[\]*:?'"]/g,'').substring(0,31));

        docNames.push($('<div />').text(ssName).html());

        if ( defaults.exportHiddenCells === false ) {
          $hiddenTableElements = $table.find("tr, th, td").filter(":hidden");
          checkCellVisibilty = $hiddenTableElements.length > 0;
        }

        rowIndex = 0;
        colNames = GetColumnNames(this);
        docData  = '<Table>\r';

        function CollectXmlssData ($rows, rowselector, length) {
          var spans = [];

          $($rows).each(function () {
            var ssIndex = 0;
            var nCols = 0;
            trData   = "";

            ForEachVisibleCell(this, 'td,th', rowIndex, length + $rows.length,
                               function (cell, row, col) {
                                 if ( cell !== null ) {
                                   var style = "";
                                   var data  = parseString(cell, row, col);
                                   var type  = "String";

                                   if ( jQuery.isNumeric(data) !== false ) {
                                     type = "Number";
                                   }
                                   else {
                                     var number = parsePercent(data);
                                     if ( number !== false ) {
                                       data  = number;
                                       type  = "Number";
                                       style += ' ss:StyleID="pct1"';
                                     }
                                   }

                                   if ( type !== "Number" )
                                     data = data.replace(/\n/g, '<br>');

                                   var colspan = getColspan (cell);
                                   var rowspan = getRowspan (cell);

                                   // Skip spans
                                   $.each(spans, function () {
                                     var range = this;
                                     if ( rowIndex >= range.s.r && rowIndex <= range.e.r && nCols >= range.s.c && nCols <= range.e.c ) {
                                       for ( var i = 0; i <= range.e.c - range.s.c; ++i ) {
                                         nCols++;
                                         ssIndex++;
                                       }
                                     }
                                   });

                                   // Handle Row Span
                                   if ( rowspan || colspan ) {
                                     rowspan = rowspan || 1;
                                     colspan = colspan || 1;
                                     spans.push({
                                                  s: {r: rowIndex, c: nCols},
                                                  e: {r: rowIndex + rowspan - 1, c: nCols + colspan - 1}
                                                });
                                   }

                                   // Handle Colspan
                                   if ( colspan > 1 ) {
                                     style += ' ss:MergeAcross="' + (colspan-1) + '"';
                                     nCols += (colspan - 1);
                                   }

                                   if ( rowspan > 1 ) {
                                     style += ' ss:MergeDown="' + (rowspan-1) + '" ss:StyleID="rsp1"';
                                   }

                                   if ( ssIndex > 0 ) {
                                     style += ' ss:Index="' + (nCols+1) + '"';
                                     ssIndex = 0;
                                   }

                                   trData += '<Cell' + style + '><Data ss:Type="' + type + '">' +
                                     $('<div />').text(data).html() +
                                     '</Data></Cell>\r';
                                   nCols++;
                                 }
                               });
            if ( trData.length > 0 )
              docData += '<Row ss:AutoFitHeight="0">\r' + trData + '</Row>\r';
            rowIndex++;
          });

          return $rows.length;
        }

        var rowLength = CollectXmlssData (collectHeadRows ($table), 'th,td', rowLength);
        CollectXmlssData (collectRows ($table), 'td,th', rowLength);

        docData += '</Table>\r';
        docDatas.push(docData);
      });

      var count = {};
      var firstOccurences = {};
      var item, itemCount;
      for (var n = 0, c = docNames.length; n < c; n++)
      {
        item = docNames[n];
        itemCount = count[item];
        itemCount = count[item] = (itemCount == null ? 1 : itemCount + 1);

        if( itemCount === 2 )
          docNames[firstOccurences[item]] = docNames[firstOccurences[item]].substring(0,29) + "-1";
        if( count[ item ] > 1 )
          docNames[n] = docNames[n].substring(0,29) + "-" + count[item];
        else
          firstOccurences[item] = n;
      }

      var CreationDate = new Date().toISOString();
      var xmlssDocFile = '<?xml version="1.0" encoding="UTF-8"?>\r' +
        '<?mso-application progid="Excel.Sheet"?>\r' +
        '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\r' +
        ' xmlns:o="urn:schemas-microsoft-com:office:office"\r' +
        ' xmlns:x="urn:schemas-microsoft-com:office:excel"\r' +
        ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\r' +
        ' xmlns:html="http://www.w3.org/TR/REC-html40">\r' +
        '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\r' +
        '  <Created>' + CreationDate + '</Created>\r' +
        '</DocumentProperties>\r' +
        '<OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">\r' +
        '  <AllowPNG/>\r' +
        '</OfficeDocumentSettings>\r' +
        '<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">\r' +
        '  <WindowHeight>9000</WindowHeight>\r' +
        '  <WindowWidth>13860</WindowWidth>\r' +
        '  <WindowTopX>0</WindowTopX>\r' +
        '  <WindowTopY>0</WindowTopY>\r' +
        '  <ProtectStructure>False</ProtectStructure>\r' +
        '  <ProtectWindows>False</ProtectWindows>\r' +
        '</ExcelWorkbook>\r' +
        '<Styles>\r' +
        '  <Style ss:ID="Default" ss:Name="Normal">\r' +
        '    <Alignment ss:Vertical="Bottom"/>\r' +
        '    <Borders/>\r' +
        '    <Font/>\r' +
        '    <Interior/>\r' +
        '    <NumberFormat/>\r' +
        '    <Protection/>\r' +
        '  </Style>\r' +
        '  <Style ss:ID="rsp1">\r' +
        '    <Alignment ss:Vertical="Center"/>\r' +
        '  </Style>\r' +
        '  <Style ss:ID="pct1">\r' +
        '    <NumberFormat ss:Format="Percent"/>\r' +
        '  </Style>\r' +
        '</Styles>\r';

      for ( var j = 0; j < docDatas.length; j++ ) {
        xmlssDocFile += '<Worksheet ss:Name="' + docNames[j] + '" ss:RightToLeft="' + (defaults.mso.rtl ? '1' : '0') + '">\r' +
          docDatas[j];
        if (defaults.mso.rtl) {
          xmlssDocFile += '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">\r' +
            '<DisplayRightToLeft/>\r' +
            '</WorksheetOptions>\r';
        }
        else
          xmlssDocFile += '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"/>\r';
        xmlssDocFile += '</Worksheet>\r';
      }

      xmlssDocFile += '</Workbook>\r';

      if ( defaults.outputMode === 'string' )
        return xmlssDocFile;

      if ( defaults.outputMode === 'base64' )
        return base64encode(xmlssDocFile);

      saveToFile ( xmlssDocFile, defaults.fileName + '.xml', "application/xml", "utf-8", "base64", false );
    }
    else if ( defaults.type === 'excel' && defaults.mso.fileFormat === 'xlsx' ) {

      var docNames = [];
      var workbook = XLSX.utils.book_new();

      // Multiple worksheets and .xlsx file extension #202

      $(el).filter(function () {
        return isVisible($(this));
      }).each(function () {
        var $table = $(this);
        var ws = XLSX.utils.table_to_sheet(this);

        var sheetName = '';
        if ( typeof defaults.mso.worksheetName === 'string' && defaults.mso.worksheetName.length )
          sheetName = defaults.mso.worksheetName + ' ' + (docNames.length + 1);
        else if ( typeof defaults.mso.worksheetName[docNames.length] !== 'undefined' )
          sheetName = defaults.mso.worksheetName[docNames.length];
        if ( ! sheetName.length )
          sheetName = $table.find('caption').text() || '';
        if ( ! sheetName.length )
          sheetName = 'Table ' + (docNames.length + 1);
        sheetName = $.trim(sheetName.replace(/[\\\/[\]*:?'"]/g,'').substring(0,31));

        docNames.push(sheetName);
        XLSX.utils.book_append_sheet(workbook, ws, sheetName);
      });

      // add worksheet to workbook
      var wbout = XLSX.write(workbook, {type: 'binary', bookType: defaults.mso.fileFormat, bookSST: false});

      saveToFile ( jx_s2ab(wbout), 
                   defaults.fileName + '.' + defaults.mso.fileFormat, 
                   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                   "UTF-8", "", false );
    }
    else if ( defaults.type === 'excel' || defaults.type === 'xls' || defaults.type === 'word' || defaults.type === 'doc' ) {

      var MSDocType   = (defaults.type === 'excel' || defaults.type === 'xls') ? 'excel' : 'word';
      var MSDocExt    = (MSDocType === 'excel') ? 'xls' : 'doc';
      var MSDocSchema = 'xmlns:x="urn:schemas-microsoft-com:office:' + MSDocType + '"';
      var docData     = '';
      var docName     = '';

      $(el).filter(function () {
        return isVisible($(this));
      }).each(function () {
        var $table = $(this);

        if (docName === '') {
          docName = defaults.mso.worksheetName || $table.find('caption').text() || 'Table';
          docName = $.trim(docName.replace(/[\\\/[\]*:?'"]/g, '').substring(0, 31));
        }

        if ( defaults.exportHiddenCells === false ) {
          $hiddenTableElements = $table.find("tr, th, td").filter(":hidden");
          checkCellVisibilty = $hiddenTableElements.length > 0;
        }

        rowIndex = 0;
        ranges   = [];
        colNames = GetColumnNames(this);

        // Header
        docData += '<table><thead>';
        $hrows = collectHeadRows ($table);
        $($hrows).each(function () {
          var $row = $(this);
          trData = "";
          ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                             function (cell, row, col) {
                               if ( cell !== null ) {
                                 var thstyle = '';
                                 var cellstyles = document.defaultView.getComputedStyle(cell, null);
                                 var rowstyles = document.defaultView.getComputedStyle($row[0], null);

                                 trData += '<th';
                                 for ( var cssStyle in defaults.mso.styles ) {
                                   var thcss = cellstyles[defaults.mso.styles[cssStyle]];
                                   if ( thcss === '' )
                                     thcss = rowstyles[defaults.mso.styles[cssStyle]];
                                   if ( thcss !== '' && thcss !== '0px none rgb(0, 0, 0)' && thcss !== 'rgba(0, 0, 0, 0)' ) {
                                     thstyle += (thstyle === '') ? 'style="' : ';';
                                     thstyle += defaults.mso.styles[cssStyle] + ':' + thcss;
                                   }
                                 }
                                 if ( thstyle !== '' )
                                   trData += ' ' + thstyle + '"';

                                 var tdcolspan = getColspan (cell);
                                 if ( tdcolspan > 0 )
                                   trData += ' colspan="' + tdcolspan + '"';

                                 var tdrowspan = getRowspan (cell);
                                 if ( tdrowspan > 0 )
                                   trData += ' rowspan="' + tdrowspan + '"';

                                 trData += '>' + parseString(cell, row, col) + '</th>';
                               }
                             });
          if ( trData.length > 0 )
            docData += '<tr>' + trData + '</tr>';
          rowIndex++;
        });
        docData += '</thead><tbody>';

        // Data
        $rows = collectRows ($table);
        $($rows).each(function () {
          var $row = $(this);
          trData   = "";
          ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                             function (cell, row, col) {
                               if ( cell !== null ) {
                                 var tdvalue = parseString(cell, row, col);
                                 var tdstyle = '';
                                 var tdcss   = $(cell).data("tableexport-msonumberformat");
                                 var cellstyles = document.defaultView.getComputedStyle(cell, null);
                                 var rowstyles = document.defaultView.getComputedStyle($row[0], null);

                                 if ( typeof tdcss === 'undefined' && typeof defaults.mso.onMsoNumberFormat === 'function' )
                                   tdcss = defaults.mso.onMsoNumberFormat(cell, row, col);

                                 if ( typeof tdcss !== 'undefined' && tdcss !== '' )
                                   tdstyle = 'style="mso-number-format:\'' + tdcss + '\'';

                                 for ( var cssStyle in defaults.mso.styles ) {
                                   tdcss = cellstyles[defaults.mso.styles[cssStyle]];
                                   if ( tdcss === '' )
                                     tdcss = rowstyles[defaults.mso.styles[cssStyle]];

                                   if ( tdcss !== '' && tdcss !== '0px none rgb(0, 0, 0)' && tdcss !== 'rgba(0, 0, 0, 0)' ) {
                                     tdstyle += (tdstyle === '') ? 'style="' : ';';
                                     tdstyle += defaults.mso.styles[cssStyle] + ':' + tdcss;
                                   }
                                 }
                                 trData += '<td';
                                 if ( tdstyle !== '' )
                                   trData += ' ' + tdstyle + '"';

                                 var tdcolspan = getColspan (cell);
                                 if ( tdcolspan > 0 )
                                   trData += ' colspan="' + tdcolspan + '"';

                                 var tdrowspan = getRowspan (cell);
                                 if ( tdrowspan > 0 )
                                   trData += ' rowspan="' + tdrowspan + '"';

                                 if ( typeof tdvalue === 'string' && tdvalue !== '' ) {
                                   tdvalue = preventInjection(tdvalue);
                                   tdvalue = tdvalue.replace(/\n/g, '<br>');
                                 }

                                 trData += '>' + tdvalue + '</td>';
                               }
                             });
          if ( trData.length > 0 )
            docData += '<tr>' + trData + '</tr>';
          rowIndex++;
        });

        if ( defaults.displayTableName )
          docData += '<tr><td></td></tr><tr><td></td></tr><tr><td>' + parseString($('<p>' + defaults.tableName + '</p>')) + '</td></tr>';

        docData += '</tbody></table>';
      });

      //noinspection XmlUnusedNamespaceDeclaration
      var docFile = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' + MSDocSchema + ' xmlns="http://www.w3.org/TR/REC-html40">';
      docFile += '<meta http-equiv="content-type" content="application/vnd.ms-' + MSDocType + '; charset=UTF-8">';
      docFile += "<head>";
      if (MSDocType === 'excel') {
        docFile += "<!--[if gte mso 9]>";
        docFile += "<xml>";
        docFile += "<x:ExcelWorkbook>";
        docFile += "<x:ExcelWorksheets>";
        docFile += "<x:ExcelWorksheet>";
        docFile += "<x:Name>";
        docFile += docName;
        docFile += "</x:Name>";
        docFile += "<x:WorksheetOptions>";
        docFile += "<x:DisplayGridlines/>";
        if (defaults.mso.rtl)
          docFile += "<x:DisplayRightToLeft/>";
        docFile += "</x:WorksheetOptions>";
        docFile += "</x:ExcelWorksheet>";
        docFile += "</x:ExcelWorksheets>";
        docFile += "</x:ExcelWorkbook>";
        docFile += "</xml>";
        docFile += "<![endif]-->";
      }
      docFile += "<style>";

      docFile += "@page { size:" + defaults.mso.pageOrientation + "; mso-page-orientation:" + defaults.mso.pageOrientation + "; }";
      docFile += "@page Section1 {size:" + pageFormats[defaults.mso.pageFormat][0] + "pt " + pageFormats[defaults.mso.pageFormat][1] + "pt";
      docFile += "; margin:1.0in 1.25in 1.0in 1.25in;mso-header-margin:.5in;mso-footer-margin:.5in;mso-paper-source:0;}";
      docFile += "div.Section1 {page:Section1;}";
      docFile += "@page Section2 {size:" + pageFormats[defaults.mso.pageFormat][1] + "pt " + pageFormats[defaults.mso.pageFormat][0] + "pt";
      docFile += ";mso-page-orientation:" + defaults.mso.pageOrientation + ";margin:1.25in 1.0in 1.25in 1.0in;mso-header-margin:.5in;mso-footer-margin:.5in;mso-paper-source:0;}";
      docFile += "div.Section2 {page:Section2;}";

      docFile += "br {mso-data-placement:same-cell;}";
      docFile += "</style>";
      docFile += "</head>";
      docFile += "<body>";
      docFile += "<div class=\"Section" + ((defaults.mso.pageOrientation === 'landscape') ? "2" : "1") + "\">";
      docFile += docData;
      docFile += "</div>";
      docFile += "</body>";
      docFile += "</html>";

      if ( defaults.outputMode === 'string' )
        return docFile;

      if ( defaults.outputMode === 'base64' )
        return base64encode(docFile);

      saveToFile ( docFile, defaults.fileName + '.' + MSDocExt, "application/vnd.ms-" + MSDocType, "", "base64", false );
    }
    else if ( defaults.type === 'png' ) {
      html2canvas($(el)[0]).then(
        function (canvas) {

          var image      = canvas.toDataURL();
          var byteString = atob(image.substring(22)); // remove data stuff
          var buffer     = new ArrayBuffer(byteString.length);
          var intArray   = new Uint8Array(buffer);

          for ( var i = 0; i < byteString.length; i++ )
            intArray[i] = byteString.charCodeAt(i);

          if ( defaults.outputMode === 'string' )
            return byteString;

          if ( defaults.outputMode === 'base64' )
            return base64encode(image);

          if ( defaults.outputMode === 'window' ) {
            window.open(image);
            return;
          }

          saveToFile ( buffer, defaults.fileName + '.png', "image/png", "", "", false );
        });

    } else if ( defaults.type === 'pdf' ) {

      if ( defaults.pdfmake.enabled === true ) {
        // pdf output using pdfmake
        // https://github.com/bpampuch/pdfmake

        var widths = [];
        var body   = [];
        rowIndex   = 0;
        ranges     = [];

        /**
         * @return {number}
         */
        var CollectPdfmakeData = function ($rows, colselector, length) {
          var rlength = 0;

          $($rows).each(function () {
            var r = [];

            ForEachVisibleCell(this, colselector, rowIndex, length,
                               function (cell, row, col) {
                                 if ( typeof cell !== 'undefined' && cell !== null ) {

                                   var colspan = getColspan (cell);
                                   var rowspan = getRowspan (cell);

                                   var cellValue = parseString(cell, row, col) || " ";

                                   if ( colspan > 1 || rowspan > 1 ) {
                                     colspan = colspan || 1;
                                     rowspan = rowspan || 1;
                                     r.push({colSpan: colspan, rowSpan: rowspan, text: cellValue});
                                   }
                                   else
                                     r.push(cellValue);
                                 }
                                 else
                                   r.push(" ");
                               });

            if ( r.length )
              body.push(r);

            if ( rlength < r.length )
              rlength = r.length;

            rowIndex++;
          });

          return rlength;
        };

        $hrows = collectHeadRows ($(this));

        var colcount = CollectPdfmakeData($hrows, 'th,td', $hrows.length);

        for ( var i = widths.length; i < colcount; i++ )
          widths.push("*");

        // Data
        $rows = collectRows ($(this));

        CollectPdfmakeData($rows, 'th,td', $hrows.length + $rows.length);

        var docDefinition = {
          content: [{
            table: {
              headerRows: $hrows.length,
              widths:     widths,
              body:       body
            }
          }]
        };

        $.extend(true, docDefinition, defaults.pdfmake.docDefinition);

        pdfMake.fonts = {
          Roboto: {
            normal:      'Roboto-Regular.ttf',
            bold:        'Roboto-Medium.ttf',
            italics:     'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
          }
        };

        $.extend(true, pdfMake.fonts, defaults.pdfmake.fonts);

        pdfMake.createPdf(docDefinition).getBuffer(function (buffer) {
          saveToFile ( buffer, defaults.fileName + '.pdf', "application/pdf", "", "", false );
        });

      }
      else if ( defaults.jspdf.autotable === false ) {
        // pdf output using jsPDF's core html support

        var addHtmlOptions = {
          dim:       {
            w: getPropertyUnitValue($(el).first().get(0), 'width', 'mm'),
            h: getPropertyUnitValue($(el).first().get(0), 'height', 'mm')
          },
          pagesplit: false
        };

        var doc = new jsPDF(defaults.jspdf.orientation, defaults.jspdf.unit, defaults.jspdf.format);
        doc.addHTML($(el).first(),
                    defaults.jspdf.margins.left,
                    defaults.jspdf.margins.top,
                    addHtmlOptions,
                    function () {
                      jsPdfOutput(doc, false);
                    });
        //delete doc;
      }
      else {
        // pdf output using jsPDF AutoTable plugin
        // https://github.com/simonbengtsson/jsPDF-AutoTable

        var teOptions = defaults.jspdf.autotable.tableExport;

        // When setting jspdf.format to 'bestfit' tableExport tries to choose
        // the minimum required paper format and orientation in which the table
        // (or tables in multitable mode) completely fits without column adjustment
        if ( typeof defaults.jspdf.format === 'string' && defaults.jspdf.format.toLowerCase() === 'bestfit' ) {
          var rk = '', ro = '';
          var mw = 0;

          $(el).each(function () {
            if ( isVisible($(this)) ) {
              var w = getPropertyUnitValue($(this).get(0), 'width', 'pt');

              if ( w > mw ) {
                if ( w > pageFormats.a0[0] ) {
                  rk = 'a0';
                  ro = 'l';
                }
                for ( var key in pageFormats ) {
                  if ( pageFormats.hasOwnProperty(key) ) {
                    if ( pageFormats[key][1] > w ) {
                      rk = key;
                      ro = 'l';
                      if ( pageFormats[key][0] > w )
                        ro = 'p';
                    }
                  }
                }
                mw = w;
              }
            }
          });
          defaults.jspdf.format      = (rk === '' ? 'a4' : rk);
          defaults.jspdf.orientation = (ro === '' ? 'w' : ro);
        }

        // The jsPDF doc object is stored in defaults.jspdf.autotable.tableExport,
        // thus it can be accessed from any callback function
        if ( teOptions.doc == null ) {
          teOptions.doc = new jsPDF(defaults.jspdf.orientation,
                                    defaults.jspdf.unit,
                                    defaults.jspdf.format);
          teOptions.wScaleFactor = 1;
          teOptions.hScaleFactor = 1;

          if ( typeof defaults.jspdf.onDocCreated === 'function' )
            defaults.jspdf.onDocCreated(teOptions.doc);
        }

        if ( teOptions.outputImages === true )
          teOptions.images = {};

        if ( typeof teOptions.images !== 'undefined' ) {
          $(el).filter(function () {
            return isVisible($(this));
          }).each(function () {
            var rowCount = 0;
            ranges       = [];

            if ( defaults.exportHiddenCells === false ) {
              $hiddenTableElements = $(this).find("tr, th, td").filter(":hidden");
              checkCellVisibilty = $hiddenTableElements.length > 0;
            }

            $hrows = collectHeadRows ($(this));
            $rows = collectRows ($(this));

            $($rows).each(function () {
              ForEachVisibleCell(this, 'td,th', $hrows.length + rowCount, $hrows.length + $rows.length,
                                 function (cell) {
                                   collectImages(cell, $(cell).children(), teOptions);
                                 });
              rowCount++;
            });
          });

          $hrows = [];
          $rows  = [];
        }

        loadImages(teOptions, function () {
          $(el).filter(function () {
            return isVisible($(this));
          }).each(function () {
            var colKey;
            rowIndex = 0;
            ranges   = [];

            if ( defaults.exportHiddenCells === false ) {
              $hiddenTableElements = $(this).find("tr, th, td").filter(":hidden");
              checkCellVisibilty = $hiddenTableElements.length > 0;
            }

            colNames = GetColumnNames(this);

            teOptions.columns = [];
            teOptions.rows    = [];
            teOptions.teCells = {};

            // onTable: optional callback function for every matching table that can be used
            // to modify the tableExport options or to skip the output of a particular table
            // if the table selector targets multiple tables
            if ( typeof teOptions.onTable === 'function' )
              if ( teOptions.onTable($(this), defaults) === false )
                return true; // continue to next iteration step (table)

            // each table works with an own copy of AutoTable options
            defaults.jspdf.autotable.tableExport = null;  // avoid deep recursion error
            var atOptions                        = $.extend(true, {}, defaults.jspdf.autotable);
            defaults.jspdf.autotable.tableExport = teOptions;

            atOptions.margin = {};
            $.extend(true, atOptions.margin, defaults.jspdf.margins);
            atOptions.tableExport = teOptions;

            // Fix jsPDF Autotable's row height calculation
            if ( typeof atOptions.beforePageContent !== 'function' ) {
              atOptions.beforePageContent = function (data) {
                if ( data.pageCount === 1 ) {
                  var all = data.table.rows.concat(data.table.headerRow);
                  $.each(all, function () {
                    var row = this;
                    if ( row.height > 0 ) {
                      row.height += (2 - FONT_ROW_RATIO) / 2 * row.styles.fontSize;
                      data.table.height += (2 - FONT_ROW_RATIO) / 2 * row.styles.fontSize;
                    }
                  });
                }
              };
            }

            if ( typeof atOptions.createdHeaderCell !== 'function' ) {
              // apply some original css styles to pdf header cells
              atOptions.createdHeaderCell = function (cell, data) {

                // jsPDF AutoTable plugin v2.0.14 fix: each cell needs its own styles object
                cell.styles = $.extend({}, data.row.styles);

                if ( typeof teOptions.columns [data.column.dataKey] !== 'undefined' ) {
                  var col = teOptions.columns [data.column.dataKey];

                  if ( typeof col.rect !== 'undefined' ) {
                    var rh;

                    cell.contentWidth = col.rect.width;

                    if ( typeof teOptions.heightRatio === 'undefined' || teOptions.heightRatio === 0 ) {
                      if ( data.row.raw [data.column.dataKey].rowspan )
                        rh = data.row.raw [data.column.dataKey].rect.height / data.row.raw [data.column.dataKey].rowspan;
                      else
                        rh = data.row.raw [data.column.dataKey].rect.height;

                      teOptions.heightRatio = cell.styles.rowHeight / rh;
                    }

                    rh = data.row.raw [data.column.dataKey].rect.height * teOptions.heightRatio;
                    if ( rh > cell.styles.rowHeight )
                      cell.styles.rowHeight = rh;
                  }

                  cell.styles.halign = (atOptions.headerStyles.halign === 'inherit') ? 'center' : atOptions.headerStyles.halign;
                  cell.styles.valign = atOptions.headerStyles.valign;

                  if ( typeof col.style !== 'undefined' && col.style.hidden !== true ) {
                    if ( atOptions.headerStyles.halign === 'inherit' )
                      cell.styles.halign = col.style.align;
                    if ( atOptions.styles.fillColor === 'inherit' )
                      cell.styles.fillColor = col.style.bcolor;
                    if ( atOptions.styles.textColor === 'inherit' )
                      cell.styles.textColor = col.style.color;
                    if ( atOptions.styles.fontStyle === 'inherit' )
                      cell.styles.fontStyle = col.style.fstyle;
                  }
                }
              };
            }

            if ( typeof atOptions.createdCell !== 'function' ) {
              // apply some original css styles to pdf table cells
              atOptions.createdCell = function (cell, data) {
                var tecell = teOptions.teCells [data.row.index + ":" + data.column.dataKey];

                cell.styles.halign = (atOptions.styles.halign === 'inherit') ? 'center' : atOptions.styles.halign;
                cell.styles.valign = atOptions.styles.valign;

                if ( typeof tecell !== 'undefined' && typeof tecell.style !== 'undefined' && tecell.style.hidden !== true ) {
                  if ( atOptions.styles.halign === 'inherit' )
                    cell.styles.halign = tecell.style.align;
                  if ( atOptions.styles.fillColor === 'inherit' )
                    cell.styles.fillColor = tecell.style.bcolor;
                  if ( atOptions.styles.textColor === 'inherit' )
                    cell.styles.textColor = tecell.style.color;
                  if ( atOptions.styles.fontStyle === 'inherit' )
                    cell.styles.fontStyle = tecell.style.fstyle;
                }
              };
            }

            if ( typeof atOptions.drawHeaderCell !== 'function' ) {
              atOptions.drawHeaderCell = function (cell, data) {
                var colopt = teOptions.columns [data.column.dataKey];

                if ( (colopt.style.hasOwnProperty("hidden") !== true || colopt.style.hidden !== true) &&
                  colopt.rowIndex >= 0 )
                  return prepareAutoTableText(cell, data, colopt);
                else
                  return false; // cell is hidden
              };
            }

            if ( typeof atOptions.drawCell !== 'function' ) {
              atOptions.drawCell = function (cell, data) {
                var tecell = teOptions.teCells [data.row.index + ":" + data.column.dataKey];
                var draw2canvas = (typeof tecell !== 'undefined' && tecell.isCanvas);

                if ( draw2canvas !== true ) {
                  if ( prepareAutoTableText(cell, data, tecell) ) {

                    teOptions.doc.rect(cell.x, cell.y, cell.width, cell.height, cell.styles.fillStyle);

                    if ( typeof tecell !== 'undefined' &&
                         typeof tecell.elements !== 'undefined' && tecell.elements.length ) {

                      var hScale = cell.height / tecell.rect.height;
                      if ( hScale > teOptions.hScaleFactor )
                        teOptions.hScaleFactor = hScale;
                      teOptions.wScaleFactor = cell.width / tecell.rect.width;

                      var ySave = cell.textPos.y;
                      drawAutotableElements(cell, tecell.elements, teOptions);
                      cell.textPos.y = ySave;

                      drawAutotableText(cell, tecell.elements, teOptions);
                    }
                    else
                      drawAutotableText(cell, {}, teOptions);
                  }
                }
                else {
                  var container = tecell.elements[0];
                  var imgId  = $(container).attr("data-tableexport-canvas");
                  var r = container.getBoundingClientRect();

                  cell.width = r.width * teOptions.wScaleFactor;
                  cell.height = r.height * teOptions.hScaleFactor;
                  data.row.height = cell.height;

                  jsPdfDrawImage (cell, container, imgId, teOptions);
                }
                return false;
              };
            }

            // collect header and data rows
            teOptions.headerrows = [];
            $hrows = collectHeadRows ($(this));
            $($hrows).each(function () {
              colKey = 0;
              teOptions.headerrows[rowIndex] = [];

              ForEachVisibleCell(this, 'th,td', rowIndex, $hrows.length,
                                 function (cell, row, col) {
                                   var obj      = getCellStyles(cell);
                                   obj.title    = parseString(cell, row, col);
                                   obj.key      = colKey++;
                                   obj.rowIndex = rowIndex;
                                   teOptions.headerrows[rowIndex].push(obj);
                                 });
              rowIndex++;
            });

            if ( rowIndex > 0 ) {
              // iterate through last row
              var lastrow = rowIndex - 1;
              while ( lastrow >= 0 ) {
                $.each(teOptions.headerrows[lastrow], function () {
                  var obj = this;

                  if ( lastrow > 0 && this.rect === null )
                    obj = teOptions.headerrows[lastrow - 1][this.key];

                  if ( obj !== null && obj.rowIndex >= 0 &&
                    (obj.style.hasOwnProperty("hidden") !== true || obj.style.hidden !== true) )
                    teOptions.columns.push(obj);
                });

                lastrow = (teOptions.columns.length > 0) ? -1 : lastrow - 1;
              }
            }

            var rowCount = 0;
            $rows        = [];
            $rows = collectRows ($(this));
            $($rows).each(function () {
              var rowData = [];
              colKey      = 0;

              ForEachVisibleCell(this, 'td,th', rowIndex, $hrows.length + $rows.length,
                                 function (cell, row, col) {
                                   var obj;

                                   if ( typeof teOptions.columns[colKey] === 'undefined' ) {
                                     // jsPDF-Autotable needs columns. Thus define hidden ones for tables without thead
                                     obj = {
                                       title: '',
                                       key:   colKey,
                                       style: {
                                         hidden: true
                                       }
                                     };
                                     teOptions.columns.push(obj);
                                   }
                                   if ( typeof cell !== 'undefined' && cell !== null ) {
                                     obj = getCellStyles(cell);
                                     obj.isCanvas = cell.hasAttribute("data-tableexport-canvas");
                                     obj.elements = obj.isCanvas ? $(cell) : $(cell).children();
                                     teOptions.teCells [rowCount + ":" + colKey++] = obj;
                                   }
                                   else {
                                     obj = $.extend(true, {}, teOptions.teCells [rowCount + ":" + (colKey - 1)]);
                                     obj.colspan = -1;
                                     teOptions.teCells [rowCount + ":" + colKey++] = obj;
                                   }

                                   rowData.push(parseString(cell, row, col));
                                 });
              if ( rowData.length ) {
                teOptions.rows.push(rowData);
                rowCount++;
              }
              rowIndex++;
            });

            // onBeforeAutotable: optional callback function before calling
            // jsPDF AutoTable that can be used to modify the AutoTable options
            if ( typeof teOptions.onBeforeAutotable === 'function' )
              teOptions.onBeforeAutotable($(this), teOptions.columns, teOptions.rows, atOptions);

            teOptions.doc.autoTable(teOptions.columns, teOptions.rows, atOptions);

            // onAfterAutotable: optional callback function after returning
            // from jsPDF AutoTable that can be used to modify the AutoTable options
            if ( typeof teOptions.onAfterAutotable === 'function' )
              teOptions.onAfterAutotable($(this), atOptions);

            // set the start position for the next table (in case there is one)
            defaults.jspdf.autotable.startY = teOptions.doc.autoTableEndPosY() + atOptions.margin.top;

          });

          jsPdfOutput(teOptions.doc, (typeof teOptions.images !== 'undefined' && jQuery.isEmptyObject(teOptions.images) === false));

          if ( typeof teOptions.headerrows !== 'undefined' )
            teOptions.headerrows.length = 0;
          if ( typeof teOptions.columns !== 'undefined' )
            teOptions.columns.length = 0;
          if ( typeof teOptions.rows !== 'undefined' )
            teOptions.rows.length = 0;
          delete teOptions.doc;
          teOptions.doc = null;
        });
      }
    }

    function collectHeadRows ($table) {
      var result = [];
      findTableElements($table,'thead').each(function () {
        result.push.apply(result, findTableElements($(this), defaults.theadSelector).toArray());
      });
      return result;
    }

    function collectRows ($table) {
      var result = [];
      findTableElements($table,'tbody').each(function () {
        result.push.apply(result, findTableElements($(this), defaults.tbodySelector).toArray());
      });
      if ( defaults.tfootSelector.length ) {
        findTableElements($table,'tfoot').each(function () {
          result.push.apply(result, findTableElements($(this), defaults.tfootSelector).toArray());
        });
      }
      return result;
    }

    function findTableElements ($parent, selector) {
      var parentSelector = $parent[0].tagName;
      var parentLevel = $parent.parents(parentSelector).length;
      return $parent.find(selector).filter (function () {
        return parentLevel === $(this).closest(parentSelector).parents(parentSelector).length;
      });
    }

    function GetColumnNames (table) {
      var result = [];
      $(table).find('thead').first().find('th').each(function (index, el) {
        if ( $(el).attr("data-field") !== undefined )
          result[index] = $(el).attr("data-field");
        else
          result[index] = index.toString();
      });
      return result;
    }

    function isVisible ($element) {
      var isCell = typeof $element[0].cellIndex !== 'undefined';
      var isRow = typeof $element[0].rowIndex !== 'undefined';
      var isElementVisible = (isCell || isRow) ? isTableElementVisible($element) : $element.is(':visible');
      var tableexportDisplay = $element.data("tableexport-display");

      if (isCell && tableexportDisplay !== 'none' && tableexportDisplay !== 'always') {
        $element = $($element[0].parentNode);
        isRow = typeof $element[0].rowIndex !== 'undefined';
        tableexportDisplay = $element.data("tableexport-display");
      }
      if (isRow && tableexportDisplay !== 'none' && tableexportDisplay !== 'always') {
        tableexportDisplay = $element.closest('table').data("tableexport-display");
      }

      return tableexportDisplay !== 'none' && (isElementVisible === true || tableexportDisplay === 'always');
    }

    function isTableElementVisible ($element) {
      var hiddenEls = [];

      if ( checkCellVisibilty ) {
        hiddenEls = $hiddenTableElements.filter (function () {
          var found = false;

          if (this.nodeType === $element[0].nodeType) {
            if (typeof this.rowIndex !== 'undefined' && this.rowIndex === $element[0].rowIndex)
              found = true;
            else if (typeof this.cellIndex !== 'undefined' && this.cellIndex === $element[0].cellIndex &&
              typeof this.parentNode.rowIndex !== 'undefined' &&
              typeof $element[0].parentNode.rowIndex !== 'undefined' &&
              this.parentNode.rowIndex === $element[0].parentNode.rowIndex)
              found = true;
          }
          return found;
        });
      }
      return (checkCellVisibilty === false || hiddenEls.length === 0);
    }

    function isColumnIgnored ($cell, rowLength, colIndex) {
      var result = false;

      if (isVisible($cell)) {
        if ( defaults.ignoreColumn.length > 0 ) {
          if ( $.inArray(colIndex, defaults.ignoreColumn) !== -1 ||
            $.inArray(colIndex - rowLength, defaults.ignoreColumn) !== -1 ||
            (colNames.length > colIndex && typeof colNames[colIndex] !== 'undefined' &&
              $.inArray(colNames[colIndex], defaults.ignoreColumn) !== -1) )
            result = true;
        }
      }
      else
        result = true;

      return result;
    }

    function ForEachVisibleCell (tableRow, selector, rowIndex, rowCount, cellcallback) {
      if ( typeof (cellcallback) === 'function' ) {
        var ignoreRow = false;

        if (typeof defaults.onIgnoreRow === 'function')
          ignoreRow = defaults.onIgnoreRow($(tableRow), rowIndex);

        if (ignoreRow === false &&
          $.inArray(rowIndex, defaults.ignoreRow) === -1 &&
          $.inArray(rowIndex - rowCount, defaults.ignoreRow) === -1 &&
          isVisible($(tableRow))) {

          var $cells = findTableElements($(tableRow), selector);
          var cellCount = 0;

          $cells.each(function (colIndex) {
            var $cell = $(this);
            var c;
            var colspan = getColspan (this);
            var rowspan = getRowspan (this);

            // Skip ranges
            $.each(ranges, function () {
              var range = this;
              if ( rowIndex >= range.s.r && rowIndex <= range.e.r && cellCount >= range.s.c && cellCount <= range.e.c ) {
                for ( c = 0; c <= range.e.c - range.s.c; ++c )
                  cellcallback(null, rowIndex, cellCount++);
              }
            });

            if ( isColumnIgnored($cell, $cells.length, colIndex) === false ) {
              // Handle Row Span
              if ( rowspan || colspan ) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({
                              s: {r: rowIndex, c: cellCount},
                              e: {r: rowIndex + rowspan - 1, c: cellCount + colspan - 1}
                            });
              }

              // Handle Value
              cellcallback(this, rowIndex, cellCount++);
            }

            // Handle Colspan
            if ( colspan )
              for ( c = 0; c < colspan - 1; ++c )
                cellcallback(null, rowIndex, cellCount++);
          });

          // Skip ranges
          $.each(ranges, function () {
            var range = this;
            if ( rowIndex >= range.s.r && rowIndex <= range.e.r && cellCount >= range.s.c && cellCount <= range.e.c ) {
              for ( c = 0; c <= range.e.c - range.s.c; ++c )
                cellcallback(null, rowIndex, cellCount++);
            }
          });
        }
      }
    }

    function jsPdfDrawImage (cell, container, imgId, teOptions) {
      if ( typeof teOptions.images !== 'undefined' ) {
        var image = teOptions.images[imgId];

        if ( typeof image !== 'undefined' ) {
          var r          = container.getBoundingClientRect();
          var arCell     = cell.width / cell.height;
          var arImg      = r.width / r.height;
          var imgWidth   = cell.width;
          var imgHeight  = cell.height;
          var px2pt      = 0.264583 * 72 / 25.4;
          var uy         = 0;

          if ( arImg <= arCell ) {
            imgHeight = Math.min(cell.height, r.height);
            imgWidth  = r.width * imgHeight / r.height;
          }
          else if ( arImg > arCell ) {
            imgWidth  = Math.min(cell.width, r.width);
            imgHeight = r.height * imgWidth / r.width;
          }

          imgWidth *= px2pt;
          imgHeight *= px2pt;

          if ( imgHeight < cell.height )
            uy = (cell.height - imgHeight) / 2;

          try {
            teOptions.doc.addImage(image.src, cell.textPos.x, cell.y + uy, imgWidth, imgHeight);
          }
          catch (e) {
            // TODO: IE -> convert png to jpeg
          }
          cell.textPos.x += imgWidth;
        }
      }
    }

    function jsPdfOutput (doc, hasimages) {
      if ( defaults.outputMode === 'string' )
        return doc.output();

      if ( defaults.outputMode === 'base64' )
        return base64encode(doc.output());

      if ( defaults.outputMode === 'window' ) {
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(doc.output("blob")));
        return;
      }

      try {
        var blob = doc.output('blob');
        saveAs(blob, defaults.fileName + '.pdf');
      }
      catch (e) {
        downloadFile(defaults.fileName + '.pdf',
          'data:application/pdf' + (hasimages ? '' : ';base64') + ',',
          hasimages ? doc.output('blob') : doc.output());
      }
    }

    function prepareAutoTableText (cell, data, cellopt) {
      var cs = 0;
      if ( typeof cellopt !== 'undefined' )
        cs = cellopt.colspan;

      if ( cs >= 0 ) {
        // colspan handling
        var cellWidth = cell.width;
        var textPosX  = cell.textPos.x;
        var i         = data.table.columns.indexOf(data.column);

        for ( var c = 1; c < cs; c++ ) {
          var column = data.table.columns[i + c];
          cellWidth += column.width;
        }

        if ( cs > 1 ) {
          if ( cell.styles.halign === 'right' )
            textPosX = cell.textPos.x + cellWidth - cell.width;
          else if ( cell.styles.halign === 'center' )
            textPosX = cell.textPos.x + (cellWidth - cell.width) / 2;
        }

        cell.width     = cellWidth;
        cell.textPos.x = textPosX;

        if ( typeof cellopt !== 'undefined' && cellopt.rowspan > 1 )
          cell.height = cell.height * cellopt.rowspan;

        // fix jsPDF's calculation of text position
        if ( cell.styles.valign === 'middle' || cell.styles.valign === 'bottom' ) {
          var splittedText = typeof cell.text === 'string' ? cell.text.split(/\r\n|\r|\n/g) : cell.text;
          var lineCount    = splittedText.length || 1;
          if ( lineCount > 2 )
            cell.textPos.y -= ((2 - FONT_ROW_RATIO) / 2 * data.row.styles.fontSize) * (lineCount - 2) / 3;
        }
        return true;
      }
      else
        return false; // cell is hidden (colspan = -1), don't draw it
    }

    function collectImages (cell, elements, teOptions) {
      if ( typeof cell !== 'undefined' && cell !== null ) {

        if ( cell.hasAttribute("data-tableexport-canvas") ) {
          var imgId = new Date().getTime();
          $(cell).attr("data-tableexport-canvas", imgId);

          teOptions.images[imgId] = {
            url: '[data-tableexport-canvas="'+imgId+'"]',
            src: null
          };
        }
        else if (elements !== 'undefined' && elements != null) {
          elements.each(function () {
            if ($(this).is("img")) {
              var imgId = strHashCode(this.src);
              teOptions.images[imgId] = {
                url: this.src,
                src: this.src
              };
            }
            collectImages(cell, $(this).children(), teOptions);
          });
        }
      }
    }

    function loadImages (teOptions, callback) {
      var imageCount = 0;
      var pendingCount = 0;

      function done () {
        callback(imageCount);
      }

      function loadImage (image) {
        if (image.url) {
          if (!image.src) {
            var $imgContainer = $(image.url);
            if ($imgContainer.length) {
              imageCount = ++pendingCount;

              html2canvas($imgContainer[0]).then(function(canvas) {
                image.src = canvas.toDataURL("image/png");
                if ( !--pendingCount )
                  done();
              });
            }
          }
          else {
            var img = new Image();
            imageCount = ++pendingCount;
            img.crossOrigin = 'Anonymous';
            img.onerror = img.onload = function () {
              if ( img.complete ) {

                if ( img.src.indexOf('data:image/') === 0 ) {
                  img.width = image.width || img.width || 0;
                  img.height = image.height || img.height || 0;
                }

                if ( img.width + img.height ) {
                  var canvas = document.createElement("canvas");
                  var ctx = canvas.getContext("2d");

                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);

                  image.src = canvas.toDataURL("image/png");
                }
              }
              if ( !--pendingCount )
                done();
            };
            img.src = image.url;
          }
        }
      }

      if ( typeof teOptions.images !== 'undefined' ) {
        for ( var i in teOptions.images )
          if ( teOptions.images.hasOwnProperty(i) )
            loadImage(teOptions.images[i]);
      }

      return pendingCount || done();
    }

    function drawAutotableElements (cell, elements, teOptions) {
      elements.each(function () {
        if ( $(this).is("div") ) {
          var bcolor = rgb2array(getStyle(this, 'background-color'), [255, 255, 255]);
          var lcolor = rgb2array(getStyle(this, 'border-top-color'), [0, 0, 0]);
          var lwidth = getPropertyUnitValue(this, 'border-top-width', defaults.jspdf.unit);

          var r  = this.getBoundingClientRect();
          var ux = this.offsetLeft * teOptions.wScaleFactor;
          var uy = this.offsetTop * teOptions.hScaleFactor;
          var uw = r.width * teOptions.wScaleFactor;
          var uh = r.height * teOptions.hScaleFactor;

          teOptions.doc.setDrawColor.apply(undefined, lcolor);
          teOptions.doc.setFillColor.apply(undefined, bcolor);
          teOptions.doc.setLineWidth(lwidth);
          teOptions.doc.rect(cell.x + ux, cell.y + uy, uw, uh, lwidth ? "FD" : "F");
        }
        else if ( $(this).is("img") ) {
          var imgId  = strHashCode(this.src);
          jsPdfDrawImage (cell, this, imgId, teOptions);
        }

        drawAutotableElements(cell, $(this).children(), teOptions);
      });
    }

    function drawAutotableText (cell, texttags, teOptions) {
      if ( typeof teOptions.onAutotableText === 'function' ) {
        teOptions.onAutotableText(teOptions.doc, cell, texttags);
      }
      else {
        var x     = cell.textPos.x;
        var y     = cell.textPos.y;
        var style = {halign: cell.styles.halign, valign: cell.styles.valign};

        if ( texttags.length ) {
          var tag = texttags[0];
          while ( tag.previousSibling )
            tag = tag.previousSibling;

          var b = false, i = false;

          while ( tag ) {
            var txt = tag.innerText || tag.textContent || "";
            var leadingspace = (txt.length && txt[0] === " ") ? " " : "";
            var trailingspace = (txt.length > 1 && txt[txt.length - 1] === " ") ? " " : "";

            if (defaults.preserve.leadingWS !== true)
              txt = leadingspace + trimLeft(txt);
            if (defaults.preserve.trailingWS !== true)
              txt = trimRight(txt) + trailingspace;

            if ( $(tag).is("br") ) {
              x = cell.textPos.x;
              y += teOptions.doc.internal.getFontSize();
            }

            if ( $(tag).is("b") )
              b = true;
            else if ( $(tag).is("i") )
              i = true;

            if ( b || i )
              teOptions.doc.setFontType((b && i) ? "bolditalic" : b ? "bold" : "italic");

            var w = teOptions.doc.getStringUnitWidth(txt) * teOptions.doc.internal.getFontSize();

            if ( w ) {
              if ( cell.styles.overflow === 'linebreak' &&
                   x > cell.textPos.x && (x + w) > (cell.textPos.x + cell.width) ) {
                var chars = ".,!%*;:=-";
                if ( chars.indexOf(txt.charAt(0)) >= 0 ) {
                  var s = txt.charAt(0);
                  w     = teOptions.doc.getStringUnitWidth(s) * teOptions.doc.internal.getFontSize();
                  if ( (x + w) <= (cell.textPos.x + cell.width) ) {
                    teOptions.doc.autoTableText(s, x, y, style);
                    txt = txt.substring(1, txt.length);
                  }
                  w = teOptions.doc.getStringUnitWidth(txt) * teOptions.doc.internal.getFontSize();
                }
                x = cell.textPos.x;
                y += teOptions.doc.internal.getFontSize();
              }

              if ( cell.styles.overflow !== 'visible' ) {
                while ( txt.length && (x + w) > (cell.textPos.x + cell.width) ) {
                  txt = txt.substring(0, txt.length - 1);
                  w   = teOptions.doc.getStringUnitWidth(txt) * teOptions.doc.internal.getFontSize();
                }
              }

              teOptions.doc.autoTableText(txt, x, y, style);
              x += w;
            }

            if ( b || i ) {
              if ( $(tag).is("b") )
                b = false;
              else if ( $(tag).is("i") )
                i = false;

              teOptions.doc.setFontType((!b && !i) ? "normal" : b ? "bold" : "italic");
            }

            tag = tag.nextSibling;
          }
          cell.textPos.x = x;
          cell.textPos.y = y;
        }
        else {
          teOptions.doc.autoTableText(cell.text, cell.textPos.x, cell.textPos.y, style);
        }
      }
    }

    function escapeRegExp (string) {
      return string == null ? "" : string.toString().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll (string, find, replace) {
      return string == null ? "" : string.toString().replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function trimLeft (string) {
      return string == null ? "" : string.toString().replace(/^\s+/, "");
    }

    function trimRight (string) {
      return string == null ? "" : string.toString().replace(/\s+$/, "");
    }

    function parseNumber (value) {
      value = value || "0";
      value = replaceAll(value, defaults.numbers.html.thousandsSeparator, '');
      value = replaceAll(value, defaults.numbers.html.decimalMark, '.');

      return typeof value === "number" || jQuery.isNumeric(value) !== false ? value : false;
    }

    function parsePercent (value) {
      if ( value.indexOf("%") > -1 ) {
        value = parseNumber(value.replace(/%/g, ""));
        if ( value !== false )
          value = value / 100;
      }
      else
        value = false;
      return value;
    }

    function parseString (cell, rowIndex, colIndex) {
      var result = '';

      if ( cell !== null ) {
        var $cell = $(cell);
        var htmlData;

        if ( $cell[0].hasAttribute("data-tableexport-canvas") ) {
          htmlData = '';
        }
        else if ( $cell[0].hasAttribute("data-tableexport-value") ) {
          htmlData = $cell.data("tableexport-value");
          htmlData = htmlData ? htmlData + '' : '';
        }
        else {
          htmlData = $cell.html();

          if ( typeof defaults.onCellHtmlData === 'function' )
            htmlData = defaults.onCellHtmlData($cell, rowIndex, colIndex, htmlData);
          else if ( htmlData !== '' ) {
            var html      = $.parseHTML(htmlData);
            var inputidx  = 0;
            var selectidx = 0;

            htmlData = '';
            $.each(html, function () {
              if ( $(this).is("input") )
                htmlData += $cell.find('input').eq(inputidx++).val();
              else if ( $(this).is("select") )
                htmlData += $cell.find('select option:selected').eq(selectidx++).text();
              else if ( $(this).is("br") )
                htmlData += "<br>";
              else {
                if ( typeof $(this).html() === 'undefined' )
                  htmlData += $(this).text();
                else if ( jQuery().bootstrapTable === undefined ||
                  ($(this).hasClass('filterControl') !== true &&
                    $(cell).parents('.detail-view').length === 0) )
                  htmlData += $(this).html();
              }
            });
          }
        }

        if ( defaults.htmlContent === true ) {
          result = $.trim(htmlData);
        }
        else if ( htmlData && htmlData !== '' ) {
          var cellFormat = $(cell).data("tableexport-cellformat");

          if ( cellFormat !== '' ) {
            var text   = htmlData.replace(/\n/g, '\u2028').replace(/(<\s*br([^>]*)>)/gi, '\u2060');
            var obj    = $('<div/>').html(text).contents();
            var number = false;
            text       = '';

            $.each(obj.text().split("\u2028"), function (i, v) {
              if ( i > 0 )
                text += " ";

              if (defaults.preserve.leadingWS !== true)
                v = trimLeft(v);
              text += (defaults.preserve.trailingWS !== true) ? trimRight(v) : v;
            });

            $.each(text.split("\u2060"), function (i, v) {
              if ( i > 0 )
                result += "\n";

              if (defaults.preserve.leadingWS !== true)
                v = trimLeft(v);
              if (defaults.preserve.trailingWS !== true)
                v = trimRight(v);
              result += v.replace(/\u00AD/g, ""); // remove soft hyphens
            });

            result = result.replace(/\u00A0/g, " "); // replace nbsp's with spaces

            if ( defaults.type === 'json' ||
              (defaults.type === 'excel' && defaults.mso.fileFormat === 'xmlss') ||
              defaults.numbers.output === false ) {
              number = parseNumber(result);

              if ( number !== false )
                result = Number(number);
            }
            else if ( defaults.numbers.html.decimalMark !== defaults.numbers.output.decimalMark ||
              defaults.numbers.html.thousandsSeparator !== defaults.numbers.output.thousandsSeparator ) {
              number = parseNumber(result);

              if ( number !== false ) {
                var frac = ("" + number.substr(number < 0 ? 1 : 0)).split('.');
                if ( frac.length === 1 )
                  frac[1] = "";
                var mod = frac[0].length > 3 ? frac[0].length % 3 : 0;

                result = (number < 0 ? "-" : "") +
                  (defaults.numbers.output.thousandsSeparator ? ((mod ? frac[0].substr(0, mod) + defaults.numbers.output.thousandsSeparator : "") + frac[0].substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + defaults.numbers.output.thousandsSeparator)) : frac[0]) +
                  (frac[1].length ? defaults.numbers.output.decimalMark + frac[1] : "");
              }
            }
          }
          else
            result = htmlData;
        }

        if ( defaults.escape === true ) {
          //noinspection JSDeprecatedSymbols
          result = escape(result);
        }

        if ( typeof defaults.onCellData === 'function' ) {
          result = defaults.onCellData($cell, rowIndex, colIndex, result);
        }
      }

      return result;
    }

    function preventInjection (string) {
      if ( string.length > 0 && defaults.preventInjection === true ) {
        var chars = "=+-@";
        if ( chars.indexOf(string.charAt(0)) >= 0 )
          return ( "'" + string );
      }
      return string;
    }

    //noinspection JSUnusedLocalSymbols
    function hyphenate (a, b, c) {
      return b + "-" + c.toLowerCase();
    }

    function rgb2array (rgb_string, default_result) {
      var re     = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
      var bits   = re.exec(rgb_string);
      var result = default_result;
      if ( bits )
        result = [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
      return result;
    }

    function getCellStyles (cell) {
      var a  = getStyle(cell, 'text-align');
      var fw = getStyle(cell, 'font-weight');
      var fs = getStyle(cell, 'font-style');
      var f  = '';
      if ( a === 'start' )
        a = getStyle(cell, 'direction') === 'rtl' ? 'right' : 'left';
      if ( fw >= 700 )
        f = 'bold';
      if ( fs === 'italic' )
        f += fs;
      if ( f === '' )
        f = 'normal';

      var result = {
        style:   {
          align:  a,
          bcolor: rgb2array(getStyle(cell, 'background-color'), [255, 255, 255]),
          color:  rgb2array(getStyle(cell, 'color'), [0, 0, 0]),
          fstyle: f
        },
        colspan: getColspan (cell),
        rowspan: getRowspan (cell)
      };

      if ( cell !== null ) {
        var r       = cell.getBoundingClientRect();
        result.rect = {
          width:  r.width,
          height: r.height
        };
      }

      return result;
    }

    function getColspan (cell) {
      var result = $(cell).data("tableexport-colspan");
      if ( typeof result === 'undefined' && $(cell).is("[colspan]") )
        result = $(cell).attr('colspan');

      return (parseInt(result) || 0);
    }

    function getRowspan (cell) {
      var result = $(cell).data("tableexport-rowspan");
      if ( typeof result === 'undefined' && $(cell).is("[rowspan]") )
        result = $(cell).attr('rowspan');

      return (parseInt(result) || 0);
    }

    // get computed style property
    function getStyle (target, prop) {
      try {
        if ( window.getComputedStyle ) { // gecko and webkit
          prop = prop.replace(/([a-z])([A-Z])/, hyphenate);  // requires hyphenated, not camel
          return window.getComputedStyle(target, null).getPropertyValue(prop);
        }
        if ( target.currentStyle ) { // ie
          return target.currentStyle[prop];
        }
        return target.style[prop];
      }
      catch (e) {
      }
      return "";
    }

    function getUnitValue (parent, value, unit) {
      var baseline = 100;  // any number serves

      var temp              = document.createElement("div");  // create temporary element
      temp.style.overflow   = "hidden";  // in case baseline is set too low
      temp.style.visibility = "hidden";  // no need to show it

      parent.appendChild(temp); // insert it into the parent for em, ex and %

      temp.style.width = baseline + unit;
      var factor       = baseline / temp.offsetWidth;

      parent.removeChild(temp);  // clean up

      return (value * factor);
    }

    function getPropertyUnitValue (target, prop, unit) {
      var value = getStyle(target, prop);  // get the computed style value

      var numeric = value.match(/\d+/);  // get the numeric component
      if ( numeric !== null ) {
        numeric = numeric[0];  // get the string

        return getUnitValue(target.parentElement, numeric, unit);
      }
      return 0;
    }

    function jx_Workbook () {
      if ( !(this instanceof jx_Workbook) ) {
        //noinspection JSPotentiallyInvalidConstructorUsage
        return new jx_Workbook();
      }
      this.SheetNames = [];
      this.Sheets     = {};
    }

    function jx_s2ab (s) {
      var buf  = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for ( var i = 0; i !== s.length; ++i ) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    function jx_datenum (v, date1904) {
      if ( date1904 ) v += 1462;
      var epoch = Date.parse(v);
      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function jx_createSheet (data) {
      var ws    = {};
      var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
      for ( var R = 0; R !== data.length; ++R ) {
        for ( var C = 0; C !== data[R].length; ++C ) {
          if ( range.s.r > R ) range.s.r = R;
          if ( range.s.c > C ) range.s.c = C;
          if ( range.e.r < R ) range.e.r = R;
          if ( range.e.c < C ) range.e.c = C;
          var cell = {v: data[R][C]};
          if ( cell.v === null ) continue;
          var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

          if ( typeof cell.v === 'number' ) cell.t = 'n';
          else if ( typeof cell.v === 'boolean' ) cell.t = 'b';
          else if ( cell.v instanceof Date ) {
            cell.t = 'n';
            cell.z = XLSX.SSF._table[14];
            cell.v = jx_datenum(cell.v);
          }
          else cell.t = 's';
          ws[cell_ref] = cell;
        }
      }

      if ( range.s.c < 10000000 ) ws['!ref'] = XLSX.utils.encode_range(range);
      return ws;
    }

    function strHashCode (str) {
      var hash = 0, i, chr, len;
      if ( str.length === 0 ) return hash;
      for ( i = 0, len = str.length; i < len; i++ ) {
        chr  = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }

    function saveToFile (data, fileName, type, charset, encoding, bom) {
      var saveIt = true;
      if ( typeof defaults.onBeforeSaveToFile === 'function' ) {
        saveIt = defaults.onBeforeSaveToFile(data, fileName, type, charset, encoding);
        if ( typeof saveIt !== 'boolean' )
          saveIt = true;
      }

      if (saveIt) {
        try {
          blob = new Blob([data], {type: type + ';charset=' + charset});
          saveAs (blob, fileName, bom === false);

          if ( typeof defaults.onAfterSaveToFile === 'function' )
            defaults.onAfterSaveToFile(data, fileName);
        }
        catch (e) {
          downloadFile (fileName, 
                        'data:' + type + 
                        (charset.length ? ';charset=' + charset : '') +
                        (encoding.length ? ';' + encoding : '') + ',' + (bom ? '\ufeff' : ''), 
                        data);
        }
      }
    }

    function downloadFile (filename, header, data) {
      var ua = window.navigator.userAgent;
      if ( filename !== false && window.navigator.msSaveOrOpenBlob ) {
        //noinspection JSUnresolvedFunction
        window.navigator.msSaveOrOpenBlob(new Blob([data]), filename);
      }
      else if ( filename !== false && (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) ) {
        // Internet Explorer (<= 9) workaround by Darryl (https://github.com/dawiong/tableExport.jquery.plugin)
        // based on sampopes answer on http://stackoverflow.com/questions/22317951
        // ! Not working for json and pdf format !
        var frame = document.createElement("iframe");

        if ( frame ) {
          document.body.appendChild(frame);
          frame.setAttribute("style", "display:none");
          frame.contentDocument.open("txt/plain", "replace");
          frame.contentDocument.write(data);
          frame.contentDocument.close();
          frame.contentDocument.focus();

          var extension = filename.substr((filename.lastIndexOf('.') +1));
          switch(extension) {
            case 'doc': case 'json': case 'png': case 'pdf': case 'xls': case 'xlsx':
            filename += ".txt";
            break;
          }
          frame.contentDocument.execCommand("SaveAs", true, filename);
          document.body.removeChild(frame);
        }
      }
      else {
        var DownloadLink = document.createElement('a');

        if ( DownloadLink ) {
          var blobUrl = null;

          DownloadLink.style.display = 'none';
          if ( filename !== false )
            DownloadLink.download = filename;
          else
            DownloadLink.target = '_blank';

          if ( typeof data === 'object' ) {
            window.URL = window.URL || window.webkitURL;
            var binaryData = [];
            binaryData.push(data);
            blobUrl = window.URL.createObjectURL(new Blob(binaryData, {type: header}));
            DownloadLink.href = blobUrl;
          }
          else if ( header.toLowerCase().indexOf("base64,") >= 0 )
            DownloadLink.href = header + base64encode(data);
          else
            DownloadLink.href = header + encodeURIComponent(data);

          document.body.appendChild(DownloadLink);

          if ( document.createEvent ) {
            if ( DownloadEvt === null )
              DownloadEvt = document.createEvent('MouseEvents');

            DownloadEvt.initEvent('click', true, false);
            DownloadLink.dispatchEvent(DownloadEvt);
          }
          else if ( document.createEventObject )
            DownloadLink.fireEvent('onclick');
          else if ( typeof DownloadLink.onclick === 'function' )
            DownloadLink.onclick();

          setTimeout(function(){
            if ( blobUrl )
              window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(DownloadLink);

            if ( typeof defaults.onAfterSaveToFile === 'function' )
              defaults.onAfterSaveToFile(data, filename);
          }, 100);
        }
      }
    }

    function utf8Encode (text) {
      if (typeof text === 'string') {
        text = text.replace(/\x0d\x0a/g, "\x0a");
        var utftext = "";
        for ( var n = 0; n < text.length; n++ ) {
          var c = text.charCodeAt(n);
          if ( c < 128 ) {
            utftext += String.fromCharCode(c);
          }
          else if ( (c > 127) && (c < 2048) ) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }
      return text;
    }

    function base64encode (input) {
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var i      = 0;
      input      = utf8Encode(input);
      while ( i < input.length ) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if ( isNaN(chr2) ) {
          enc3 = enc4 = 64;
        } else if ( isNaN(chr3) ) {
          enc4 = 64;
        }
        output = output +
          keyStr.charAt(enc1) + keyStr.charAt(enc2) +
          keyStr.charAt(enc3) + keyStr.charAt(enc4);
      }
      return output;
    }

    return this;
  }
})(jQuery);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmF6aW5nYS10cmFuc2xhdG9yL2pzL3RyYW5zbGF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC10YWJsZS9kaXN0L2Jvb3RzdHJhcC10YWJsZS5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC10YWJsZS9kaXN0L2V4dGVuc2lvbnMvZXhwb3J0L2Jvb3RzdHJhcC10YWJsZS1leHBvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC10YWJsZS9kaXN0L2xvY2FsZS9ib290c3RyYXAtdGFibGUtZXMtRVMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC10YWJsZS9kaXN0L2xvY2FsZS9ib290c3RyYXAtdGFibGUtZXUtRVUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtZnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYmluZC1jb250ZXh0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9odG1sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1hcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0aWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3Qta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmZpbmQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N3ZWV0YWxlcnQyL2Rpc3Qvc3dlZXRhbGVydDIuYWxsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90YWJsZWV4cG9ydC5qcXVlcnkucGx1Z2luL3RhYmxlRXhwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQTBDO0FBQ2xELFFBQVEsb0NBQXFCLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxvR0FBQztBQUNyQztBQUNBLFNBQVMsRUFRSjtBQUNMLENBQUM7QUFDRDs7QUFFQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLGdDQUFnQztBQUM1RSwyQ0FBMkMsZ0NBQWdDOztBQUUzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLG1CQUFtQixPQUFPO0FBQzFCLG1C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RUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsMEpBQTBKO0FBQzFKOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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RUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLEVBQUU7O0FBRUw7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtGQUErRjtBQUMvRjtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTs7O0FBR0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLHlCQUF5Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7OztBQUdILHVDQUF1QyxFQUFFOztBQUV6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLG1CQUFtQjtBQUN0QztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrRkFBa0YsK0JBQStCLEVBQUU7QUFDbkg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQztBQUNqQztBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSwyREFBMkQsS0FBSztBQUNoRSxHQUFHO0FBQ0g7QUFDQTtBQUNBLHNEQUFzRCxNQUFNLFFBQVEsS0FBSztBQUN6RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7OztBQUdIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQSxzREFBc0Q7O0FBRXREO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSwrQkFBK0I7O0FBRS9CO0FBQ0EsNkJBQTZCOztBQUU3QjtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBLDBEQUEwRDs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7O0FBR0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxN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QU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IscUJBQXFCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLHdDQUF3QyxrRUFBa0U7O0FBRTFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw0QkFBNEI7QUFDeEQ7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDBCQUEwQjtBQUM1RCxrQ0FBa0M7QUFDbEMsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBLFdBQVc7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNEJBQTRCO0FBQ3REO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUEyRTtBQUMzRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pELGFBQWE7O0FBRWIsb0RBQW9EOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFMQUFxTCxFQUFFO0FBQ3ZMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixJQUFJLFNBQVMsSUFBSSxTQUFTLElBQUk7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUI7O0FBRXpCLDREQUE0RDtBQUM1RCx1Q0FBdUM7QUFDdkMsdUNBQXVDOztBQUV2QywrQkFBK0I7O0FBRS9CO0FBQ0E7O0FBRUEsK0JBQStCOztBQUUvQjtBQUNBOztBQUVBO0FBQ0EseUNBQXlDOztBQUV6Qyx1Q0FBdUM7QUFDdkM7QUFDQSw2QkFBNkI7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGdCQUFnQjtBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixJQUFJLHlCQUF5QixNQUFNO0FBQ3RELHNCQUFzQixtQkFBbUI7QUFDekMsd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLGlEQUFpRCxXQUFXOztBQUU1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsU0FBUztBQUM3QztBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLGVBQWUsb0JBQW9CO0FBQ3RFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1Qyw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUVBQXVFLGFBQWE7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoidmVuZG9yc35yZWNlaXB0X2xpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgV2lsbGlhbSBEVVJBTkQgPHdpbGxpYW0uZHVyYW5kMUBnbWFpbC5jb20+XG4gKiBAbGljZW5zZSBNSVQgTGljZW5zZWRcbiAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ1RyYW5zbGF0b3InLCBmYWN0b3J5KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAvLyBsaWtlIE5vZGUuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcm9vdC5UcmFuc2xhdG9yID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIF9tZXNzYWdlcyAgICAgPSB7fSxcbiAgICAgICAgX2ZhbGxiYWNrTG9jYWxlID0gJ2VuJyxcbiAgICAgICAgX2RvbWFpbnMgICAgICA9IFtdLFxuICAgICAgICBfc1BsdXJhbFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxcdytcXDogKyguKykkLyksXG4gICAgICAgIF9jUGx1cmFsUmVnZXggPSBuZXcgUmVnRXhwKC9eXFxzKigoXFx7XFxzKihcXC0/XFxkK1tcXHMqLFxccypcXC0/XFxkK10qKVxccypcXH0pfChbXFxbXFxdXSlcXHMqKC1JbmZ8XFwtP1xcZCspXFxzKixcXHMqKFxcKz9JbmZ8XFwtP1xcZCspXFxzKihbXFxbXFxdXSkpXFxzPyguKz8pJC8pLFxuICAgICAgICBfaVBsdXJhbFJlZ2V4ID0gbmV3IFJlZ0V4cCgvXlxccyooXFx7XFxzKihcXC0/XFxkK1tcXHMqLFxccypcXC0/XFxkK10qKVxccypcXH0pfChbXFxbXFxdXSlcXHMqKC1JbmZ8XFwtP1xcZCspXFxzKixcXHMqKFxcKz9JbmZ8XFwtP1xcZCspXFxzKihbXFxbXFxdXSkvKTtcblxuICAgIHZhciBUcmFuc2xhdG9yID0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGN1cnJlbnQgbG9jYWxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgbG9jYWxlOiBnZXRfY3VycmVudF9sb2NhbGUoKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmFsbGJhY2sgbG9jYWxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZmFsbGJhY2s6IF9mYWxsYmFja0xvY2FsZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUGxhY2Vob2xkZXIgcHJlZml4LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2VIb2xkZXJQcmVmaXg6ICclJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUGxhY2Vob2xkZXIgc3VmZml4LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2VIb2xkZXJTdWZmaXg6ICclJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBkb21haW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZWZhdWx0RG9tYWluOiAnbWVzc2FnZXMnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQbHVyYWwgc2VwYXJhdG9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcGx1cmFsU2VwYXJhdG9yOiAnfCcsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgYSB0cmFuc2xhdGlvbiBlbnRyeS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGlkICAgICAgICAgVGhlIG1lc3NhZ2UgaWRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICAgVGhlIG1lc3NhZ2UgdG8gcmVnaXN0ZXIgZm9yIHRoZSBnaXZlbiBpZFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2RvbWFpbl0gICBUaGUgZG9tYWluIGZvciB0aGUgbWVzc2FnZSBvciBudWxsIHRvIHVzZSB0aGUgZGVmYXVsdFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2xvY2FsZV0gICBUaGUgbG9jYWxlIG9yIG51bGwgdG8gdXNlIHRoZSBkZWZhdWx0XG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIFRyYW5zbGF0b3JcbiAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGFkZDogZnVuY3Rpb24oaWQsIG1lc3NhZ2UsIGRvbWFpbiwgbG9jYWxlKSB7XG4gICAgICAgICAgICB2YXIgX2xvY2FsZSA9IGxvY2FsZSB8fCB0aGlzLmxvY2FsZSB8fCB0aGlzLmZhbGxiYWNrLFxuICAgICAgICAgICAgICAgIF9kb21haW4gPSBkb21haW4gfHwgdGhpcy5kZWZhdWx0RG9tYWluO1xuXG4gICAgICAgICAgICBpZiAoIV9tZXNzYWdlc1tfbG9jYWxlXSkge1xuICAgICAgICAgICAgICAgIF9tZXNzYWdlc1tfbG9jYWxlXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIV9tZXNzYWdlc1tfbG9jYWxlXVtfZG9tYWluXSkge1xuICAgICAgICAgICAgICAgIF9tZXNzYWdlc1tfbG9jYWxlXVtfZG9tYWluXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfbWVzc2FnZXNbX2xvY2FsZV1bX2RvbWFpbl1baWRdID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgaWYgKGZhbHNlID09PSBleGlzdHMoX2RvbWFpbnMsIF9kb21haW4pKSB7XG4gICAgICAgICAgICAgICAgX2RvbWFpbnMucHVzaChfZG9tYWluKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gbWVzc2FnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGlkICAgICAgICAgICAgICAgVGhlIG1lc3NhZ2UgaWRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbWV0ZXJzXSAgICAgQW4gYXJyYXkgb2YgcGFyYW1ldGVycyBmb3IgdGhlIG1lc3NhZ2VcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtkb21haW5dICAgICAgICAgVGhlIGRvbWFpbiBmb3IgdGhlIG1lc3NhZ2Ugb3IgbnVsbCB0byBndWVzcyBpdFxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2xvY2FsZV0gICAgICAgICBUaGUgbG9jYWxlIG9yIG51bGwgdG8gdXNlIHRoZSBkZWZhdWx0XG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgIFRoZSB0cmFuc2xhdGVkIHN0cmluZ1xuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgdHJhbnM6IGZ1bmN0aW9uKGlkLCBwYXJhbWV0ZXJzLCBkb21haW4sIGxvY2FsZSkge1xuICAgICAgICAgICAgdmFyIF9tZXNzYWdlID0gZ2V0X21lc3NhZ2UoXG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZG9tYWluLFxuICAgICAgICAgICAgICAgIGxvY2FsZSxcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZSxcbiAgICAgICAgICAgICAgICB0aGlzLmZhbGxiYWNrXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVwbGFjZV9wbGFjZWhvbGRlcnMoX21lc3NhZ2UsIHBhcmFtZXRlcnMgfHwge30pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmFuc2xhdGVzIHRoZSBnaXZlbiBjaG9pY2UgbWVzc2FnZSBieSBjaG9vc2luZyBhIHRyYW5zbGF0aW9uIGFjY29yZGluZyB0byBhIG51bWJlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGlkICAgICAgICAgICAgICAgVGhlIG1lc3NhZ2UgaWRcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciAgICAgICAgICAgVGhlIG51bWJlciB0byB1c2UgdG8gZmluZCB0aGUgaW5kaWNlIG9mIHRoZSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1ldGVyc10gICAgIEFuIGFycmF5IG9mIHBhcmFtZXRlcnMgZm9yIHRoZSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZG9tYWluXSAgICAgICAgIFRoZSBkb21haW4gZm9yIHRoZSBtZXNzYWdlIG9yIG51bGwgdG8gZ3Vlc3MgaXRcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFtsb2NhbGVdICAgICAgICAgVGhlIGxvY2FsZSBvciBudWxsIHRvIHVzZSB0aGUgZGVmYXVsdFxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgICBUaGUgdHJhbnNsYXRlZCBzdHJpbmdcbiAgICAgICAgICogQGFwaSBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIHRyYW5zQ2hvaWNlOiBmdW5jdGlvbihpZCwgbnVtYmVyLCBwYXJhbWV0ZXJzLCBkb21haW4sIGxvY2FsZSkge1xuICAgICAgICAgICAgdmFyIF9tZXNzYWdlID0gZ2V0X21lc3NhZ2UoXG4gICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgZG9tYWluLFxuICAgICAgICAgICAgICAgIGxvY2FsZSxcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZSxcbiAgICAgICAgICAgICAgICB0aGlzLmZhbGxiYWNrXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgX251bWJlciAgPSBwYXJzZUludChudW1iZXIsIDEwKTtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5jb3VudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycy5jb3VudCA9IG51bWJlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBfbWVzc2FnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgIWlzTmFOKF9udW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgX21lc3NhZ2UgPSBwbHVyYWxpemUoXG4gICAgICAgICAgICAgICAgICAgIF9tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBfbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBsb2NhbGUgfHwgdGhpcy5sb2NhbGUgfHwgdGhpcy5mYWxsYmFja1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXBsYWNlX3BsYWNlaG9sZGVycyhfbWVzc2FnZSwgcGFyYW1ldGVycyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvYWRzIHRyYW5zbGF0aW9ucyBmcm9tIEpTT04uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhICAgICBBIEpTT04gc3RyaW5nIG9yIG9iamVjdCBsaXRlcmFsXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICBUcmFuc2xhdG9yXG4gICAgICAgICAqIEBhcGkgcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBmcm9tSlNPTjogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YS5sb2NhbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZSA9IGRhdGEubG9jYWxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YS5mYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmFsbGJhY2sgPSBkYXRhLmZhbGxiYWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YS5kZWZhdWx0RG9tYWluKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0RG9tYWluID0gZGF0YS5kZWZhdWx0RG9tYWluO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YS50cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBsb2NhbGUgaW4gZGF0YS50cmFuc2xhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZG9tYWluIGluIGRhdGEudHJhbnNsYXRpb25zW2xvY2FsZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlkIGluIGRhdGEudHJhbnNsYXRpb25zW2xvY2FsZV1bZG9tYWluXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKGlkLCBkYXRhLnRyYW5zbGF0aW9uc1tsb2NhbGVdW2RvbWFpbl1baWRdLCBkb21haW4sIGxvY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAYXBpIHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX21lc3NhZ2VzICAgPSB7fTtcbiAgICAgICAgICAgIF9kb21haW5zICAgID0gW107XG4gICAgICAgICAgICB0aGlzLmxvY2FsZSA9IGdldF9jdXJyZW50X2xvY2FsZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIGdpdmVuIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiAqKldBUk5JTkc6KiogdXNlZCBwbGFjZWhvbGRlcnMgYXJlIHJlbW92ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgICAgIFRoZSB0cmFuc2xhdGVkIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcGxhY2Vob2xkZXJzIFRoZSBwbGFjZWhvbGRlcnMgdG8gcmVwbGFjZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgQSBodW1hbiByZWFkYWJsZSBtZXNzYWdlXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVwbGFjZV9wbGFjZWhvbGRlcnMobWVzc2FnZSwgcGxhY2Vob2xkZXJzKSB7XG4gICAgICAgIHZhciBfaSxcbiAgICAgICAgICAgIF9wcmVmaXggPSBUcmFuc2xhdG9yLnBsYWNlSG9sZGVyUHJlZml4LFxuICAgICAgICAgICAgX3N1ZmZpeCA9IFRyYW5zbGF0b3IucGxhY2VIb2xkZXJTdWZmaXg7XG5cbiAgICAgICAgZm9yIChfaSBpbiBwbGFjZWhvbGRlcnMpIHtcbiAgICAgICAgICAgIHZhciBfciA9IG5ldyBSZWdFeHAoX3ByZWZpeCArIF9pICsgX3N1ZmZpeCwgJ2cnKTtcblxuICAgICAgICAgICAgaWYgKF9yLnRlc3QobWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3YgPSBTdHJpbmcocGxhY2Vob2xkZXJzW19pXSkucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcJCcsICdnJyksICckJCQkJyk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShfciwgX3YpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBtZXNzYWdlIGJhc2VkIG9uIGl0cyBpZCwgaXRzIGRvbWFpbiwgYW5kIGl0cyBsb2NhbGUuIElmIGRvbWFpbiBvclxuICAgICAqIGxvY2FsZSBhcmUgbm90IHNwZWNpZmllZCwgaXQgd2lsbCB0cnkgdG8gZmluZCB0aGUgbWVzc2FnZSB1c2luZyBmYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgICAgICAgICAgICAgICBUaGUgbWVzc2FnZSBpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gICAgICAgICAgIFRoZSBkb21haW4gZm9yIHRoZSBtZXNzYWdlIG9yIG51bGwgdG8gZ3Vlc3MgaXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlICAgICAgICAgICBUaGUgbG9jYWxlIG9yIG51bGwgdG8gdXNlIHRoZSBkZWZhdWx0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGN1cnJlbnRMb2NhbGUgICAgVGhlIGN1cnJlbnQgbG9jYWxlIG9yIG51bGwgdG8gdXNlIHRoZSBkZWZhdWx0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZUZhbGxiYWNrICAgVGhlIGZhbGxiYWNrIChkZWZhdWx0KSBsb2NhbGVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgICBUaGUgcmlnaHQgbWVzc2FnZSBpZiBmb3VuZCwgYHVuZGVmaW5lZGAgb3RoZXJ3aXNlXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0X21lc3NhZ2UoaWQsIGRvbWFpbiwgbG9jYWxlLCBjdXJyZW50TG9jYWxlLCBsb2NhbGVGYWxsYmFjaykge1xuICAgICAgICB2YXIgX2xvY2FsZSA9IGxvY2FsZSB8fCBjdXJyZW50TG9jYWxlIHx8IGxvY2FsZUZhbGxiYWNrLFxuICAgICAgICAgICAgX2RvbWFpbiA9IGRvbWFpbjtcblxuICAgICAgICB2YXIgbmF0aW9uYWxMb2NhbGVGYWxsYmFjayA9IF9sb2NhbGUuc3BsaXQoJ18nKVswXTtcblxuICAgICAgICBpZiAoIShfbG9jYWxlIGluIF9tZXNzYWdlcykpIHtcbiAgICAgICAgICAgIGlmICghKG5hdGlvbmFsTG9jYWxlRmFsbGJhY2sgaW4gX21lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgIGlmICghKGxvY2FsZUZhbGxiYWNrIGluIF9tZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfbG9jYWxlID0gbG9jYWxlRmFsbGJhY2s7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9sb2NhbGUgPSBuYXRpb25hbExvY2FsZUZhbGxiYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBfZG9tYWluID09PSAndW5kZWZpbmVkJyB8fCBudWxsID09PSBfZG9tYWluKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9kb21haW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc19tZXNzYWdlKF9sb2NhbGUsIF9kb21haW5zW2ldLCBpZCkgfHxcbiAgICAgICAgICAgICAgICAgICAgaGFzX21lc3NhZ2UobmF0aW9uYWxMb2NhbGVGYWxsYmFjaywgX2RvbWFpbnNbaV0sIGlkKSB8fFxuICAgICAgICAgICAgICAgICAgICBoYXNfbWVzc2FnZShsb2NhbGVGYWxsYmFjaywgX2RvbWFpbnNbaV0sIGlkKSkge1xuICAgICAgICAgICAgICAgICAgICBfZG9tYWluID0gX2RvbWFpbnNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc19tZXNzYWdlKF9sb2NhbGUsIF9kb21haW4sIGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9tZXNzYWdlc1tfbG9jYWxlXVtfZG9tYWluXVtpZF07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX2xlbmd0aCwgX3BhcnRzLCBfbGFzdCwgX2xhc3RMZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKF9sb2NhbGUubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgX2xlbmd0aCAgICAgPSBfbG9jYWxlLmxlbmd0aDtcbiAgICAgICAgICAgIF9wYXJ0cyAgICAgID0gX2xvY2FsZS5zcGxpdCgvW1xcc19dKy8pO1xuICAgICAgICAgICAgX2xhc3QgICAgICAgPSBfcGFydHNbX3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgX2xhc3RMZW5ndGggPSBfbGFzdC5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmICgxID09PSBfcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9sb2NhbGUgPSBfbG9jYWxlLnN1YnN0cmluZygwLCBfbGVuZ3RoIC0gKF9sYXN0TGVuZ3RoICsgMSkpO1xuXG4gICAgICAgICAgICBpZiAoaGFzX21lc3NhZ2UoX2xvY2FsZSwgX2RvbWFpbiwgaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9tZXNzYWdlc1tfbG9jYWxlXVtfZG9tYWluXVtpZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzX21lc3NhZ2UobG9jYWxlRmFsbGJhY2ssIF9kb21haW4sIGlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9tZXNzYWdlc1tsb2NhbGVGYWxsYmFja11bX2RvbWFpbl1baWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEp1c3QgbG9vayBmb3IgYSBzcGVjaWZpYyBsb2NhbGUgLyBkb21haW4gLyBpZCBpZiB0aGUgbWVzc2FnZSBpcyBhdmFpbGFibGUsXG4gICAgICogaGVscGZ1bCBmb3IgbWVzc2FnZSBhdmFpbGFiaWxpdHkgdmFsaWRhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSAgICAgICAgICAgVGhlIGxvY2FsZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkb21haW4gICAgICAgICAgIFRoZSBkb21haW4gZm9yIHRoZSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlkICAgICAgICAgICAgICAgVGhlIG1lc3NhZ2UgaWRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICBSZXR1cm4gYHRydWVgIGlmIG1lc3NhZ2UgaXMgYXZhaWxhYmxlLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIGAgICAgICAgICAgICAgICBmYWxzZWAgb3RoZXJ3aXNlXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFzX21lc3NhZ2UobG9jYWxlLCBkb21haW4sIGlkKSB7XG4gICAgICAgIGlmICghKGxvY2FsZSBpbiBfbWVzc2FnZXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShkb21haW4gaW4gX21lc3NhZ2VzW2xvY2FsZV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShpZCBpbiBfbWVzc2FnZXNbbG9jYWxlXVtkb21haW5dKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGxvZ2ljIGNvbWVzIGZyb20gdGhlIFN5bWZvbnkyIFBIUCBGcmFtZXdvcmsuXG4gICAgICpcbiAgICAgKiBHaXZlbiBhIG1lc3NhZ2Ugd2l0aCBkaWZmZXJlbnQgcGx1cmFsIHRyYW5zbGF0aW9ucyBzZXBhcmF0ZWQgYnkgYVxuICAgICAqIHBpcGUgKHwpLCB0aGlzIG1ldGhvZCByZXR1cm5zIHRoZSBjb3JyZWN0IHBvcnRpb24gb2YgdGhlIG1lc3NhZ2UgYmFzZWRcbiAgICAgKiBvbiB0aGUgZ2l2ZW4gbnVtYmVyLCB0aGUgY3VycmVudCBsb2NhbGUgYW5kIHRoZSBwbHVyYWxpemF0aW9uIHJ1bGVzXG4gICAgICogaW4gdGhlIG1lc3NhZ2UgaXRzZWxmLlxuICAgICAqXG4gICAgICogVGhlIG1lc3NhZ2Ugc3VwcG9ydHMgdHdvIGRpZmZlcmVudCB0eXBlcyBvZiBwbHVyYWxpemF0aW9uIHJ1bGVzOlxuICAgICAqXG4gICAgICogaW50ZXJ2YWw6IHswfSBUaGVyZSBpcyBubyBhcHBsZXN8ezF9IFRoZXJlIGlzIG9uZSBhcHBsZXxdMSxJbmZdIFRoZXJlIGlzICVjb3VudCUgYXBwbGVzXG4gICAgICogaW5kZXhlZDogIFRoZXJlIGlzIG9uZSBhcHBsZXxUaGVyZSBpcyAlY291bnQlIGFwcGxlc1xuICAgICAqXG4gICAgICogVGhlIGluZGV4ZWQgc29sdXRpb24gY2FuIGFsc28gY29udGFpbiBsYWJlbHMgKGUuZy4gb25lOiBUaGVyZSBpcyBvbmUgYXBwbGUpLlxuICAgICAqIFRoaXMgaXMgcHVyZWx5IGZvciBtYWtpbmcgdGhlIHRyYW5zbGF0aW9ucyBtb3JlIGNsZWFyIC0gaXQgZG9lcyBub3RcbiAgICAgKiBhZmZlY3QgdGhlIGZ1bmN0aW9uYWxpdHkuXG4gICAgICpcbiAgICAgKiBUaGUgdHdvIG1ldGhvZHMgY2FuIGFsc28gYmUgbWl4ZWQ6XG4gICAgICogICAgIHswfSBUaGVyZSBpcyBubyBhcHBsZXN8b25lOiBUaGVyZSBpcyBvbmUgYXBwbGV8bW9yZTogVGhlcmUgaXMgJWNvdW50JSBhcHBsZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICBUaGUgbWVzc2FnZSBpZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgICBUaGUgbnVtYmVyIHRvIHVzZSB0byBmaW5kIHRoZSBpbmRpY2Ugb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlICAgVGhlIGxvY2FsZVxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICBUaGUgbWVzc2FnZSBwYXJ0IHRvIHVzZSBmb3IgdHJhbnNsYXRpb25cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwbHVyYWxpemUobWVzc2FnZSwgbnVtYmVyLCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIF9wLFxuICAgICAgICAgICAgX2UsXG4gICAgICAgICAgICBfZXhwbGljaXRSdWxlcyA9IFtdLFxuICAgICAgICAgICAgX3N0YW5kYXJkUnVsZXMgPSBbXSxcbiAgICAgICAgICAgIF9wYXJ0cyAgICAgICAgID0gbWVzc2FnZS5zcGxpdChUcmFuc2xhdG9yLnBsdXJhbFNlcGFyYXRvciksXG4gICAgICAgICAgICBfbWF0Y2hlcyAgICAgICA9IFtdO1xuXG4gICAgICAgIGZvciAoX3AgPSAwOyBfcCA8IF9wYXJ0cy5sZW5ndGg7IF9wKyspIHtcbiAgICAgICAgICAgIHZhciBfcGFydCA9IF9wYXJ0c1tfcF07XG5cbiAgICAgICAgICAgIGlmIChfY1BsdXJhbFJlZ2V4LnRlc3QoX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgX21hdGNoZXMgPSBfcGFydC5tYXRjaChfY1BsdXJhbFJlZ2V4KTtcbiAgICAgICAgICAgICAgICBfZXhwbGljaXRSdWxlc1tfbWF0Y2hlc1swXV0gPSBfbWF0Y2hlc1tfbWF0Y2hlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3NQbHVyYWxSZWdleC50ZXN0KF9wYXJ0KSkge1xuICAgICAgICAgICAgICAgIF9tYXRjaGVzID0gX3BhcnQubWF0Y2goX3NQbHVyYWxSZWdleCk7XG4gICAgICAgICAgICAgICAgX3N0YW5kYXJkUnVsZXMucHVzaChfbWF0Y2hlc1sxXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9zdGFuZGFyZFJ1bGVzLnB1c2goX3BhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChfZSBpbiBfZXhwbGljaXRSdWxlcykge1xuICAgICAgICAgICAgaWYgKF9pUGx1cmFsUmVnZXgudGVzdChfZSkpIHtcbiAgICAgICAgICAgICAgICBfbWF0Y2hlcyA9IF9lLm1hdGNoKF9pUGx1cmFsUmVnZXgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9tYXRjaGVzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbnMgPSBfbWF0Y2hlc1syXS5zcGxpdCgnLCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgX247XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChfbiBpbiBfbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPT0gX25zW19uXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfZXhwbGljaXRSdWxlc1tfZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2xlZnROdW1iZXIgID0gY29udmVydF9udW1iZXIoX21hdGNoZXNbNF0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3JpZ2h0TnVtYmVyID0gY29udmVydF9udW1iZXIoX21hdGNoZXNbNV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgoJ1snID09PSBfbWF0Y2hlc1szXSA/IG51bWJlciA+PSBfbGVmdE51bWJlciA6IG51bWJlciA+IF9sZWZ0TnVtYmVyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCddJyA9PT0gX21hdGNoZXNbNl0gPyBudW1iZXIgPD0gX3JpZ2h0TnVtYmVyIDogbnVtYmVyIDwgX3JpZ2h0TnVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9leHBsaWNpdFJ1bGVzW19lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfc3RhbmRhcmRSdWxlc1twbHVyYWxfcG9zaXRpb24obnVtYmVyLCBsb2NhbGUpXSB8fCBfc3RhbmRhcmRSdWxlc1swXSB8fCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGxvZ2ljIGNvbWVzIGZyb20gdGhlIFN5bWZvbnkyIFBIUCBGcmFtZXdvcmsuXG4gICAgICpcbiAgICAgKiBDb252ZXJ0IG51bWJlciBhcyBTdHJpbmcsIFwiSW5mXCIgYW5kIFwiLUluZlwiXG4gICAgICogdmFsdWVzIHRvIG51bWJlciB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbnVtYmVyICAgQSBsaXRlcmFsIG51bWJlclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICBUaGUgaW50IHZhbHVlIG9mIHRoZSBudW1iZXJcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb252ZXJ0X251bWJlcihudW1iZXIpIHtcbiAgICAgICAgaWYgKCctSW5mJyA9PT0gbnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgICAgICB9IGVsc2UgaWYgKCcrSW5mJyA9PT0gbnVtYmVyIHx8ICdJbmYnID09PSBudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VJbnQobnVtYmVyLCAxMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGxvZ2ljIGNvbWVzIGZyb20gdGhlIFN5bWZvbnkyIFBIUCBGcmFtZXdvcmsuXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIHRoZSBwbHVyYWwgcG9zaXRpb24gdG8gdXNlIGZvciB0aGUgZ2l2ZW4gbG9jYWxlIGFuZCBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtYmVyICBUaGUgbnVtYmVyIHRvIHVzZSB0byBmaW5kIHRoZSBpbmRpY2Ugb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlICBUaGUgbG9jYWxlXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAgICAgICAgVGhlIHBsdXJhbCBwb3NpdGlvblxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBsdXJhbF9wb3NpdGlvbihudW1iZXIsIGxvY2FsZSkge1xuICAgICAgICB2YXIgX2xvY2FsZSA9IGxvY2FsZTtcblxuICAgICAgICBpZiAoJ3B0X0JSJyA9PT0gX2xvY2FsZSkge1xuICAgICAgICAgICAgX2xvY2FsZSA9ICd4YnInO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9sb2NhbGUubGVuZ3RoID4gMykge1xuICAgICAgICAgICAgX2xvY2FsZSA9IF9sb2NhbGUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoX2xvY2FsZSkge1xuICAgICAgICAgICAgY2FzZSAnYm8nOlxuICAgICAgICAgICAgY2FzZSAnZHonOlxuICAgICAgICAgICAgY2FzZSAnaWQnOlxuICAgICAgICAgICAgY2FzZSAnamEnOlxuICAgICAgICAgICAgY2FzZSAnanYnOlxuICAgICAgICAgICAgY2FzZSAna2EnOlxuICAgICAgICAgICAgY2FzZSAna20nOlxuICAgICAgICAgICAgY2FzZSAna24nOlxuICAgICAgICAgICAgY2FzZSAna28nOlxuICAgICAgICAgICAgY2FzZSAnbXMnOlxuICAgICAgICAgICAgY2FzZSAndGgnOlxuICAgICAgICAgICAgY2FzZSAndHInOlxuICAgICAgICAgICAgY2FzZSAndmknOlxuICAgICAgICAgICAgY2FzZSAnemgnOlxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgY2FzZSAnYWYnOlxuICAgICAgICAgICAgY2FzZSAnYXonOlxuICAgICAgICAgICAgY2FzZSAnYm4nOlxuICAgICAgICAgICAgY2FzZSAnYmcnOlxuICAgICAgICAgICAgY2FzZSAnY2EnOlxuICAgICAgICAgICAgY2FzZSAnZGEnOlxuICAgICAgICAgICAgY2FzZSAnZGUnOlxuICAgICAgICAgICAgY2FzZSAnZWwnOlxuICAgICAgICAgICAgY2FzZSAnZW4nOlxuICAgICAgICAgICAgY2FzZSAnZW8nOlxuICAgICAgICAgICAgY2FzZSAnZXMnOlxuICAgICAgICAgICAgY2FzZSAnZXQnOlxuICAgICAgICAgICAgY2FzZSAnZXUnOlxuICAgICAgICAgICAgY2FzZSAnZmEnOlxuICAgICAgICAgICAgY2FzZSAnZmknOlxuICAgICAgICAgICAgY2FzZSAnZm8nOlxuICAgICAgICAgICAgY2FzZSAnZnVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2Z5JzpcbiAgICAgICAgICAgIGNhc2UgJ2dsJzpcbiAgICAgICAgICAgIGNhc2UgJ2d1JzpcbiAgICAgICAgICAgIGNhc2UgJ2hhJzpcbiAgICAgICAgICAgIGNhc2UgJ2hlJzpcbiAgICAgICAgICAgIGNhc2UgJ2h1JzpcbiAgICAgICAgICAgIGNhc2UgJ2lzJzpcbiAgICAgICAgICAgIGNhc2UgJ2l0JzpcbiAgICAgICAgICAgIGNhc2UgJ2t1JzpcbiAgICAgICAgICAgIGNhc2UgJ2xiJzpcbiAgICAgICAgICAgIGNhc2UgJ21sJzpcbiAgICAgICAgICAgIGNhc2UgJ21uJzpcbiAgICAgICAgICAgIGNhc2UgJ21yJzpcbiAgICAgICAgICAgIGNhc2UgJ25haCc6XG4gICAgICAgICAgICBjYXNlICduYic6XG4gICAgICAgICAgICBjYXNlICduZSc6XG4gICAgICAgICAgICBjYXNlICdubCc6XG4gICAgICAgICAgICBjYXNlICdubic6XG4gICAgICAgICAgICBjYXNlICdubyc6XG4gICAgICAgICAgICBjYXNlICdvbSc6XG4gICAgICAgICAgICBjYXNlICdvcic6XG4gICAgICAgICAgICBjYXNlICdwYSc6XG4gICAgICAgICAgICBjYXNlICdwYXAnOlxuICAgICAgICAgICAgY2FzZSAncHMnOlxuICAgICAgICAgICAgY2FzZSAncHQnOlxuICAgICAgICAgICAgY2FzZSAnc28nOlxuICAgICAgICAgICAgY2FzZSAnc3EnOlxuICAgICAgICAgICAgY2FzZSAnc3YnOlxuICAgICAgICAgICAgY2FzZSAnc3cnOlxuICAgICAgICAgICAgY2FzZSAndGEnOlxuICAgICAgICAgICAgY2FzZSAndGUnOlxuICAgICAgICAgICAgY2FzZSAndGsnOlxuICAgICAgICAgICAgY2FzZSAndXInOlxuICAgICAgICAgICAgY2FzZSAnenUnOlxuICAgICAgICAgICAgICAgIHJldHVybiAobnVtYmVyID09IDEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGNhc2UgJ2FtJzpcbiAgICAgICAgICAgIGNhc2UgJ2JoJzpcbiAgICAgICAgICAgIGNhc2UgJ2ZpbCc6XG4gICAgICAgICAgICBjYXNlICdmcic6XG4gICAgICAgICAgICBjYXNlICdndW4nOlxuICAgICAgICAgICAgY2FzZSAnaGknOlxuICAgICAgICAgICAgY2FzZSAnbG4nOlxuICAgICAgICAgICAgY2FzZSAnbWcnOlxuICAgICAgICAgICAgY2FzZSAnbnNvJzpcbiAgICAgICAgICAgIGNhc2UgJ3hicic6XG4gICAgICAgICAgICBjYXNlICd0aSc6XG4gICAgICAgICAgICBjYXNlICd3YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICgobnVtYmVyID09PSAwKSB8fCAobnVtYmVyID09IDEpKSA/IDAgOiAxO1xuXG4gICAgICAgICAgICBjYXNlICdiZSc6XG4gICAgICAgICAgICBjYXNlICdicyc6XG4gICAgICAgICAgICBjYXNlICdocic6XG4gICAgICAgICAgICBjYXNlICdydSc6XG4gICAgICAgICAgICBjYXNlICdzcic6XG4gICAgICAgICAgICBjYXNlICd1ayc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICgobnVtYmVyICUgMTAgPT0gMSkgJiYgKG51bWJlciAlIDEwMCAhPSAxMSkpID8gMCA6ICgoKG51bWJlciAlIDEwID49IDIpICYmIChudW1iZXIgJSAxMCA8PSA0KSAmJiAoKG51bWJlciAlIDEwMCA8IDEwKSB8fCAobnVtYmVyICUgMTAwID49IDIwKSkpID8gMSA6IDIpO1xuXG4gICAgICAgICAgICBjYXNlICdjcyc6XG4gICAgICAgICAgICBjYXNlICdzayc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChudW1iZXIgPT0gMSkgPyAwIDogKCgobnVtYmVyID49IDIpICYmIChudW1iZXIgPD0gNCkpID8gMSA6IDIpO1xuXG4gICAgICAgICAgICBjYXNlICdnYSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChudW1iZXIgPT0gMSkgPyAwIDogKChudW1iZXIgPT0gMikgPyAxIDogMik7XG5cbiAgICAgICAgICAgIGNhc2UgJ2x0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKChudW1iZXIgJSAxMCA9PSAxKSAmJiAobnVtYmVyICUgMTAwICE9IDExKSkgPyAwIDogKCgobnVtYmVyICUgMTAgPj0gMikgJiYgKChudW1iZXIgJSAxMDAgPCAxMCkgfHwgKG51bWJlciAlIDEwMCA+PSAyMCkpKSA/IDEgOiAyKTtcblxuICAgICAgICAgICAgY2FzZSAnc2wnOlxuICAgICAgICAgICAgICAgIHJldHVybiAobnVtYmVyICUgMTAwID09IDEpID8gMCA6ICgobnVtYmVyICUgMTAwID09IDIpID8gMSA6ICgoKG51bWJlciAlIDEwMCA9PSAzKSB8fCAobnVtYmVyICUgMTAwID09IDQpKSA/IDIgOiAzKSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ21rJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKG51bWJlciAlIDEwID09IDEpID8gMCA6IDE7XG5cbiAgICAgICAgICAgIGNhc2UgJ210JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKG51bWJlciA9PSAxKSA/IDAgOiAoKChudW1iZXIgPT09IDApIHx8ICgobnVtYmVyICUgMTAwID4gMSkgJiYgKG51bWJlciAlIDEwMCA8IDExKSkpID8gMSA6ICgoKG51bWJlciAlIDEwMCA+IDEwKSAmJiAobnVtYmVyICUgMTAwIDwgMjApKSA/IDIgOiAzKSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ2x2JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKG51bWJlciA9PT0gMCkgPyAwIDogKCgobnVtYmVyICUgMTAgPT0gMSkgJiYgKG51bWJlciAlIDEwMCAhPSAxMSkpID8gMSA6IDIpO1xuXG4gICAgICAgICAgICBjYXNlICdwbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChudW1iZXIgPT0gMSkgPyAwIDogKCgobnVtYmVyICUgMTAgPj0gMikgJiYgKG51bWJlciAlIDEwIDw9IDQpICYmICgobnVtYmVyICUgMTAwIDwgMTIpIHx8IChudW1iZXIgJSAxMDAgPiAxNCkpKSA/IDEgOiAyKTtcblxuICAgICAgICAgICAgY2FzZSAnY3knOlxuICAgICAgICAgICAgICAgIHJldHVybiAobnVtYmVyID09IDEpID8gMCA6ICgobnVtYmVyID09IDIpID8gMSA6ICgoKG51bWJlciA9PSA4KSB8fCAobnVtYmVyID09IDExKSkgPyAyIDogMykpO1xuXG4gICAgICAgICAgICBjYXNlICdybyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChudW1iZXIgPT0gMSkgPyAwIDogKCgobnVtYmVyID09PSAwKSB8fCAoKG51bWJlciAlIDEwMCA+IDApICYmIChudW1iZXIgJSAxMDAgPCAyMCkpKSA/IDEgOiAyKTtcblxuICAgICAgICAgICAgY2FzZSAnYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiAobnVtYmVyID09PSAwKSA/IDAgOiAoKG51bWJlciA9PSAxKSA/IDEgOiAoKG51bWJlciA9PSAyKSA/IDIgOiAoKChudW1iZXIgPj0gMykgJiYgKG51bWJlciA8PSAxMCkpID8gMyA6ICgoKG51bWJlciA+PSAxMSkgJiYgKG51bWJlciA8PSA5OSkpID8gNCA6IDUpKSkpO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0FycmF5fSAgICAgICAgQW4gYXJyYXlcbiAgICAgKiBAdHlwZSB7U3RyaW5nfSAgICAgICBBbiBlbGVtZW50IHRvIGNvbXBhcmVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICBSZXR1cm4gYHRydWVgIGlmIGBhcnJheWAgY29udGFpbnMgYGVsZW1lbnRgLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXhpc3RzKGFycmF5LCBlbGVtZW50KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50ID09PSBhcnJheVtpXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBhcHBsaWNhdGlvbidzIGxvY2FsZSBiYXNlZCBvbiB0aGUgYGxhbmdgIGF0dHJpYnV0ZVxuICAgICAqIG9uIHRoZSBgaHRtbGAgdGFnLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAgICAgVGhlIGN1cnJlbnQgYXBwbGljYXRpb24ncyBsb2NhbGVcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRfY3VycmVudF9sb2NhbGUoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX2ZhbGxiYWNrTG9jYWxlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFRyYW5zbGF0b3I7XG59KSk7XG4iLCIvKipcbiAgKiBib290c3RyYXAtdGFibGUgLSBBbiBleHRlbmRlZCBCb290c3RyYXAgdGFibGUgd2l0aCByYWRpbywgY2hlY2tib3gsIHNvcnQsIHBhZ2luYXRpb24sIGFuZCBvdGhlciBhZGRlZCBmZWF0dXJlcy4gKHN1cHBvcnRzIHR3aXR0ZXIgYm9vdHN0cmFwIHYyIGFuZCB2MykuXG4gICpcbiAgKiBAdmVyc2lvbiB2MS4xNC4yXG4gICogQGhvbWVwYWdlIGh0dHBzOi8vYm9vdHN0cmFwLXRhYmxlLmNvbVxuICAqIEBhdXRob3Igd2VuemhpeGluIDx3ZW56aGl4aW4yMDEwQGdtYWlsLmNvbT4gKGh0dHA6Ly93ZW56aGl4aW4ubmV0LmNuLylcbiAgKiBAbGljZW5zZSBNSVRcbiAgKi9cblxuKGZ1bmN0aW9uKGUsdCl7aWYoJ2Z1bmN0aW9uJz09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sdCk7ZWxzZSBpZigndW5kZWZpbmVkJyE9dHlwZW9mIGV4cG9ydHMpdCgpO2Vsc2V7dCgpLGUuYm9vdHN0cmFwVGFibGU9e2V4cG9ydHM6e319LmV4cG9ydHN9fSkodGhpcyxmdW5jdGlvbigpeyd1c2Ugc3RyaWN0JztmdW5jdGlvbiBlKGUsdCl7aWYoIShlIGluc3RhbmNlb2YgdCkpdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyl9ZnVuY3Rpb24gdChlKXtpZihBcnJheS5pc0FycmF5KGUpKXtmb3IodmFyIHQ9MCxvPUFycmF5KGUubGVuZ3RoKTt0PGUubGVuZ3RoO3QrKylvW3RdPWVbdF07cmV0dXJuIG99cmV0dXJuIEFycmF5LmZyb20oZSl9dmFyIG89ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCl7Zm9yKHZhciBvLGE9MDthPHQubGVuZ3RoO2ErKylvPXRbYV0sby5lbnVtZXJhYmxlPW8uZW51bWVyYWJsZXx8ITEsby5jb25maWd1cmFibGU9ITAsJ3ZhbHVlJ2luIG8mJihvLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxvLmtleSxvKX1yZXR1cm4gZnVuY3Rpb24odCxvLGEpe3JldHVybiBvJiZlKHQucHJvdG90eXBlLG8pLGEmJmUodCxhKSx0fX0oKSxhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQpe3ZhciBvPVtdLGE9ITAsaT0hMSxuPXZvaWQgMDt0cnl7Zm9yKHZhciBzLGw9ZVtTeW1ib2wuaXRlcmF0b3JdKCk7IShhPShzPWwubmV4dCgpKS5kb25lKSYmKG8ucHVzaChzLnZhbHVlKSwhKHQmJm8ubGVuZ3RoPT09dCkpO2E9ITApO31jYXRjaChlKXtpPSEwLG49ZX1maW5hbGx5e3RyeXshYSYmbFsncmV0dXJuJ10mJmxbJ3JldHVybiddKCl9ZmluYWxseXtpZihpKXRocm93IG59fXJldHVybiBvfXJldHVybiBmdW5jdGlvbih0LG8pe2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIHQ7aWYoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh0KSlyZXR1cm4gZSh0LG8pO3Rocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UnKX19KCksbj0nZnVuY3Rpb24nPT10eXBlb2YgU3ltYm9sJiYnc3ltYm9sJz09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbihlKXtyZXR1cm4gdHlwZW9mIGV9OmZ1bmN0aW9uKGUpe3JldHVybiBlJiYnZnVuY3Rpb24nPT10eXBlb2YgU3ltYm9sJiZlLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZlIT09U3ltYm9sLnByb3RvdHlwZT8nc3ltYm9sJzp0eXBlb2YgZX07KGZ1bmN0aW9uKHMpe3ZhciBpPTQ7dHJ5e3ZhciBnPXMuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IuVkVSU0lPTjtnIT09dm9pZCAwJiYoaT1wYXJzZUludChnLDEwKSl9Y2F0Y2godCl7fXZhciBsPXszOnt0aGVtZTonYm9vdHN0cmFwMycsaWNvbnNQcmVmaXg6J2dseXBoaWNvbicsaWNvbnM6e3BhZ2luYXRpb25Td2l0Y2hEb3duOidnbHlwaGljb24tY29sbGFwc2UtZG93biBpY29uLWNoZXZyb24tZG93bicscGFnaW5hdGlvblN3aXRjaFVwOidnbHlwaGljb24tY29sbGFwc2UtdXAgaWNvbi1jaGV2cm9uLXVwJyxyZWZyZXNoOidnbHlwaGljb24tcmVmcmVzaCBpY29uLXJlZnJlc2gnLHRvZ2dsZU9mZjonZ2x5cGhpY29uLWxpc3QtYWx0IGljb24tbGlzdC1hbHQnLHRvZ2dsZU9uOidnbHlwaGljb24tbGlzdC1hbHQgaWNvbi1saXN0LWFsdCcsY29sdW1uczonZ2x5cGhpY29uLXRoIGljb24tdGgnLGRldGFpbE9wZW46J2dseXBoaWNvbi1wbHVzIGljb24tcGx1cycsZGV0YWlsQ2xvc2U6J2dseXBoaWNvbi1taW51cyBpY29uLW1pbnVzJyxmdWxsc2NyZWVuOidnbHlwaGljb24tZnVsbHNjcmVlbid9LGNsYXNzZXM6e2J1dHRvbnNQcmVmaXg6J2J0bicsYnV0dG9uczonZGVmYXVsdCcsYnV0dG9uc0dyb3VwOididG4tZ3JvdXAnLGJ1dHRvbnNEcm9wZG93bjonYnRuLWdyb3VwJyxwdWxsOidwdWxsJyxpbnB1dEdyb3VwOicnLGlucHV0Oidmb3JtLWNvbnRyb2wnLHBhZ2luYXRpb25Ecm9wZG93bjonYnRuLWdyb3VwIGRyb3Bkb3duJyxkcm9wdXA6J2Ryb3B1cCcsZHJvcGRvd25BY3RpdmU6J2FjdGl2ZScscGFnaW5hdGlvbkFjdGl2ZTonYWN0aXZlJ30saHRtbDp7dG9vYmFyRHJvcGRvdzpbJzx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPicsJzwvdWw+J10sdG9vYmFyRHJvcGRvd0l0ZW06JzxsaSByb2xlPVwibWVudWl0ZW1cIj48bGFiZWw+JXM8L2xhYmVsPjwvbGk+JyxwYWdlRHJvcGRvd246Wyc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj4nLCc8L3VsPiddLHBhZ2VEcm9wZG93bkl0ZW06JzxsaSByb2xlPVwibWVudWl0ZW1cIiBjbGFzcz1cIiVzXCI+PGEgaHJlZj1cIiNcIj4lczwvYT48L2xpPicsZHJvcGRvd25DYXJldDonPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj4nLHBhZ2luYXRpb246Wyc8dWwgY2xhc3M9XCJwYWdpbmF0aW9uJXNcIj4nLCc8L3VsPiddLHBhZ2luYXRpb25JdGVtOic8bGkgY2xhc3M9XCJwYWdlLWl0ZW0lc1wiPjxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4lczwvYT48L2xpPicsaWNvbjonPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4nfX0sNDp7dGhlbWU6J2Jvb3RzdHJhcDQnLGljb25zUHJlZml4OidmYScsaWNvbnM6e3BhZ2luYXRpb25Td2l0Y2hEb3duOidmYS1jYXJldC1zcXVhcmUtZG93bicscGFnaW5hdGlvblN3aXRjaFVwOidmYS1jYXJldC1zcXVhcmUtdXAnLHJlZnJlc2g6J2ZhLXN5bmMnLHRvZ2dsZU9mZjonZmEtdG9nZ2xlLW9mZicsdG9nZ2xlT246J2ZhLXRvZ2dsZS1vbicsY29sdW1uczonZmEtdGgtbGlzdCcsZnVsbHNjcmVlbjonZmEtYXJyb3dzLWFsdCcsZGV0YWlsT3BlbjonZmEtcGx1cycsZGV0YWlsQ2xvc2U6J2ZhLW1pbnVzJ30sY2xhc3Nlczp7YnV0dG9uc1ByZWZpeDonYnRuJyxidXR0b25zOidzZWNvbmRhcnknLGJ1dHRvbnNHcm91cDonYnRuLWdyb3VwJyxidXR0b25zRHJvcGRvd246J2J0bi1ncm91cCcscHVsbDonZmxvYXQnLGlucHV0R3JvdXA6JycsaW5wdXQ6J2Zvcm0tY29udHJvbCcscGFnaW5hdGlvbkRyb3Bkb3duOididG4tZ3JvdXAgZHJvcGRvd24nLGRyb3B1cDonZHJvcHVwJyxkcm9wZG93bkFjdGl2ZTonYWN0aXZlJyxwYWdpbmF0aW9uQWN0aXZlOidhY3RpdmUnfSxodG1sOnt0b29iYXJEcm9wZG93OlsnPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiPicsJzwvZGl2PiddLHRvb2JhckRyb3Bkb3dJdGVtOic8bGFiZWwgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCI+JXM8L2xhYmVsPicscGFnZURyb3Bkb3duOlsnPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4nLCc8L2Rpdj4nXSxwYWdlRHJvcGRvd25JdGVtOic8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW0gJXNcIiBocmVmPVwiI1wiPiVzPC9hPicsZHJvcGRvd25DYXJldDonPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj4nLHBhZ2luYXRpb246Wyc8dWwgY2xhc3M9XCJwYWdpbmF0aW9uJXNcIj4nLCc8L3VsPiddLHBhZ2luYXRpb25JdGVtOic8bGkgY2xhc3M9XCJwYWdlLWl0ZW0lc1wiPjxhIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZj1cIiNcIj4lczwvYT48L2xpPicsaWNvbjonPGkgY2xhc3M9XCIlcyAlc1wiPjwvaT4nfX19W2ldLHI9e2Jvb3RzdHJhcFZlcnNpb246aSxzcHJpbnRmOmZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1hcmd1bWVudHMubGVuZ3RoLG89QXJyYXkoMTx0P3QtMTowKSxhPTE7YTx0O2ErKylvW2EtMV09YXJndW1lbnRzW2FdO3ZhciBuPSEwLHM9MCxpPWUucmVwbGFjZSgvJXMvZyxmdW5jdGlvbigpe3ZhciBlPW9bcysrXTtyZXR1cm4ndW5kZWZpbmVkJz09dHlwZW9mIGU/KG49ITEsJycpOmV9KTtyZXR1cm4gbj9pOicnfSxpc0VtcHR5T2JqZWN0OmZ1bmN0aW9uKCl7dmFyIGU9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOnt9O3JldHVybiAwPT09ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5rZXlzKGUpLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdCxlW3RdXX0pfShlKS5sZW5ndGgmJmUuY29uc3RydWN0b3I9PT1PYmplY3R9LGlzTnVtZXJpYzpmdW5jdGlvbihlKXtyZXR1cm4haXNOYU4ocGFyc2VGbG9hdChlKSkmJmlzRmluaXRlKGUpfSxnZXRGaWVsZFRpdGxlOmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBvPWUsYT1BcnJheS5pc0FycmF5KG8pLGk9MCxfaXRlcmF0b3I9YT9vOm9bU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciBuO2lmKGEpe2lmKGk+PW8ubGVuZ3RoKWJyZWFrO249b1tpKytdfWVsc2V7aWYoaT1vLm5leHQoKSxpLmRvbmUpYnJlYWs7bj1pLnZhbHVlfXZhciBzPW47aWYocy5maWVsZD09PXQpcmV0dXJuIHMudGl0bGV9cmV0dXJuJyd9LHNldEZpZWxkSW5kZXg6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PTAsbz1bXSxhPWVbMF0sbj1BcnJheS5pc0FycmF5KGEpLHM9MCxfaXRlcmF0b3IyPW4/YTphW1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgbDtpZihuKXtpZihzPj1hLmxlbmd0aClicmVhaztsPWFbcysrXX1lbHNle2lmKHM9YS5uZXh0KCkscy5kb25lKWJyZWFrO2w9cy52YWx1ZX12YXIgZD1sO3QrPWQuY29sc3Bhbnx8MX1mb3IodmFyIG09MDttPGUubGVuZ3RoO20rKyl7b1ttXT1bXTtmb3IodmFyIGk9MDtpPHQ7aSsrKW9bbV1baV09ITF9Zm9yKHZhciB5PTA7eTxlLmxlbmd0aDt5KyspZm9yKHZhciBjPWVbeV0scD1BcnJheS5pc0FycmF5KGMpLGg9MCxfaXRlcmF0b3IzPXA/YzpjW1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgZztpZihwKXtpZihoPj1jLmxlbmd0aClicmVhaztnPWNbaCsrXX1lbHNle2lmKGg9Yy5uZXh0KCksaC5kb25lKWJyZWFrO2c9aC52YWx1ZX12YXIgdT1nLHI9dS5yb3dzcGFufHwxLGY9dS5jb2xzcGFufHwxLGI9b1t5XS5pbmRleE9mKCExKTsxPT09ZiYmKHUuZmllbGRJbmRleD1iLCd1bmRlZmluZWQnPT10eXBlb2YgdS5maWVsZCYmKHUuZmllbGQ9YikpO2Zvcih2YXIgdz0wO3c8cjt3Kyspb1t5K3ddW2JdPSEwO2Zvcih2YXIgaz0wO2s8ZjtrKyspb1t5XVtiK2tdPSEwfX0sZ2V0U2Nyb2xsQmFyV2lkdGg6ZnVuY3Rpb24oKXtpZih0aGlzLmNhY2hlZFdpZHRoPT09dm9pZCAwKXt2YXIgZT1zKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZml4ZWQtdGFibGUtc2Nyb2xsLWlubmVyJyksdD1zKCc8ZGl2Lz4nKS5hZGRDbGFzcygnZml4ZWQtdGFibGUtc2Nyb2xsLW91dGVyJyk7dC5hcHBlbmQoZSkscygnYm9keScpLmFwcGVuZCh0KTt2YXIgbz1lWzBdLm9mZnNldFdpZHRoO3QuY3NzKCdvdmVyZmxvdycsJ3Njcm9sbCcpO3ZhciBhPWVbMF0ub2Zmc2V0V2lkdGg7bz09PWEmJihhPXRbMF0uY2xpZW50V2lkdGgpLHQucmVtb3ZlKCksdGhpcy5jYWNoZWRXaWR0aD1vLWF9cmV0dXJuIHRoaXMuY2FjaGVkV2lkdGh9LGNhbGN1bGF0ZU9iamVjdFZhbHVlOmZ1bmN0aW9uKGUsbyxhLGkpe3ZhciBzPW87aWYoJ3N0cmluZyc9PXR5cGVvZiBvKXt2YXIgaD1vLnNwbGl0KCcuJyk7aWYoMTxoLmxlbmd0aCl7cz13aW5kb3c7Zm9yKHZhciBsPWgscj1BcnJheS5pc0FycmF5KGwpLGQ9MCxfaXRlcmF0b3I0PXI/bDpsW1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgYztpZihyKXtpZihkPj1sLmxlbmd0aClicmVhaztjPWxbZCsrXX1lbHNle2lmKGQ9bC5uZXh0KCksZC5kb25lKWJyZWFrO2M9ZC52YWx1ZX12YXIgcD1jO3M9c1twXX19ZWxzZSBzPXdpbmRvd1tvXX1yZXR1cm4gbnVsbCE9PXMmJidvYmplY3QnPT09KCd1bmRlZmluZWQnPT10eXBlb2Ygcz8ndW5kZWZpbmVkJzpuKHMpKT9zOidmdW5jdGlvbic9PXR5cGVvZiBzP3MuYXBwbHkoZSxhfHxbXSk6IXMmJidzdHJpbmcnPT10eXBlb2YgbyYmdGhpcy5zcHJpbnRmLmFwcGx5KHRoaXMsW29dLmNvbmNhdCh0KGEpKSk/dGhpcy5zcHJpbnRmLmFwcGx5KHRoaXMsW29dLmNvbmNhdCh0KGEpKSk6aX0sY29tcGFyZU9iamVjdHM6ZnVuY3Rpb24oZSx0LG8pe3ZhciBhPU9iamVjdC5rZXlzKGUpLGk9T2JqZWN0LmtleXModCk7aWYobyYmYS5sZW5ndGghPT1pLmxlbmd0aClyZXR1cm4hMTtmb3IodmFyIG49YSxzPUFycmF5LmlzQXJyYXkobiksbD0wLF9pdGVyYXRvcjU9cz9uOm5bU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciByO2lmKHMpe2lmKGw+PW4ubGVuZ3RoKWJyZWFrO3I9bltsKytdfWVsc2V7aWYobD1uLm5leHQoKSxsLmRvbmUpYnJlYWs7cj1sLnZhbHVlfXZhciBkPXI7aWYoLTEhPT1pLmluZGV4T2YoZCkmJmVbZF0hPT10W2RdKXJldHVybiExfXJldHVybiEwfSxlc2NhcGVIVE1MOmZ1bmN0aW9uKGUpe3JldHVybidzdHJpbmcnPT10eXBlb2YgZT9lLnJlcGxhY2UoLyYvZywnJmFtcDsnKS5yZXBsYWNlKC88L2csJyZsdDsnKS5yZXBsYWNlKC8+L2csJyZndDsnKS5yZXBsYWNlKC9cIi9nLCcmcXVvdDsnKS5yZXBsYWNlKC8nL2csJyYjMDM5OycpLnJlcGxhY2UoL2AvZywnJiN4NjA7Jyk6ZX0sZ2V0UmVhbERhdGFBdHRyOmZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1mdW5jdGlvbihlKXtyZXR1cm4gT2JqZWN0LmtleXMoZSkubWFwKGZ1bmN0aW9uKHQpe3JldHVyblt0LGVbdF1dfSl9KGUpLG89QXJyYXkuaXNBcnJheSh0KSxpPTAsX2l0ZXJhdG9yNj1vP3Q6dFtTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIG47aWYobyl7aWYoaT49dC5sZW5ndGgpYnJlYWs7bj10W2krK119ZWxzZXtpZihpPXQubmV4dCgpLGkuZG9uZSlicmVhaztuPWkudmFsdWV9dmFyIHM9bixsPWEocywyKSxyPWxbMF0sZD1sWzFdLGM9ci5zcGxpdCgvKD89W0EtWl0pLykuam9pbignLScpLnRvTG93ZXJDYXNlKCk7YyE9PXImJihlW2NdPWQsZGVsZXRlIGVbcl0pfXJldHVybiBlfSxnZXRJdGVtRmllbGQ6ZnVuY3Rpb24oZSx0LG8pe3ZhciBhPWU7aWYoJ3N0cmluZychPXR5cGVvZiB0fHxlLmhhc093blByb3BlcnR5KHQpKXJldHVybiBvP3RoaXMuZXNjYXBlSFRNTChlW3RdKTplW3RdO2Zvcih2YXIgaT10LnNwbGl0KCcuJyksbj1pLHM9QXJyYXkuaXNBcnJheShuKSxsPTAsX2l0ZXJhdG9yNz1zP246bltTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIHI7aWYocyl7aWYobD49bi5sZW5ndGgpYnJlYWs7cj1uW2wrK119ZWxzZXtpZihsPW4ubmV4dCgpLGwuZG9uZSlicmVhaztyPWwudmFsdWV9dmFyIGQ9cjthPWEmJmFbZF19cmV0dXJuIG8/dGhpcy5lc2NhcGVIVE1MKGEpOmF9LGlzSUVCcm93c2VyOmZ1bmN0aW9uKCl7cmV0dXJuIC0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFICcpfHwvVHJpZGVudC4qcnY6MTFcXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9LGZpbmRJbmRleDpmdW5jdGlvbihlLHQpe2Zvcih2YXIgbz1lLGE9QXJyYXkuaXNBcnJheShvKSxpPTAsX2l0ZXJhdG9yOD1hP286b1tTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIG47aWYoYSl7aWYoaT49by5sZW5ndGgpYnJlYWs7bj1vW2krK119ZWxzZXtpZihpPW8ubmV4dCgpLGkuZG9uZSlicmVhaztuPWkudmFsdWV9dmFyIHM9bjtpZihKU09OLnN0cmluZ2lmeShzKT09PUpTT04uc3RyaW5naWZ5KHQpKXJldHVybiBlLmluZGV4T2Yocyl9cmV0dXJuLTF9fSxkPXtoZWlnaHQ6dm9pZCAwLGNsYXNzZXM6J3RhYmxlIHRhYmxlLWJvcmRlcmVkIHRhYmxlLWhvdmVyJyx0aGVhZENsYXNzZXM6Jycscm93U3R5bGU6ZnVuY3Rpb24oKXtyZXR1cm57fX0scm93QXR0cmlidXRlczpmdW5jdGlvbigpe3JldHVybnt9fSx1bmRlZmluZWRUZXh0OictJyxsb2NhbGU6dm9pZCAwLHNvcnRhYmxlOiEwLHNvcnRDbGFzczp2b2lkIDAsc2lsZW50U29ydDohMCxzb3J0TmFtZTp2b2lkIDAsc29ydE9yZGVyOidhc2MnLHNvcnRTdGFibGU6ITEscmVtZW1iZXJPcmRlcjohMSxjdXN0b21Tb3J0OnZvaWQgMCxjb2x1bW5zOltbXV0sZGF0YTpbXSx1cmw6dm9pZCAwLG1ldGhvZDonZ2V0JyxjYWNoZTohMCxjb250ZW50VHlwZTonYXBwbGljYXRpb24vanNvbicsZGF0YVR5cGU6J2pzb24nLGFqYXg6dm9pZCAwLGFqYXhPcHRpb25zOnt9LHF1ZXJ5UGFyYW1zOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxxdWVyeVBhcmFtc1R5cGU6J2xpbWl0JyxyZXNwb25zZUhhbmRsZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LHRvdGFsRmllbGQ6J3RvdGFsJyxkYXRhRmllbGQ6J3Jvd3MnLHBhZ2luYXRpb246ITEsb25seUluZm9QYWdpbmF0aW9uOiExLHBhZ2luYXRpb25Mb29wOiEwLHNpZGVQYWdpbmF0aW9uOidjbGllbnQnLHRvdGFsUm93czowLHBhZ2VOdW1iZXI6MSxwYWdlU2l6ZToxMCxwYWdlTGlzdDpbMTAsMjUsNTAsMTAwXSxwYWdpbmF0aW9uSEFsaWduOidyaWdodCcscGFnaW5hdGlvblZBbGlnbjonYm90dG9tJyxwYWdpbmF0aW9uRGV0YWlsSEFsaWduOidsZWZ0JyxwYWdpbmF0aW9uUHJlVGV4dDonJmxzYXF1bzsnLHBhZ2luYXRpb25OZXh0VGV4dDonJnJzYXF1bzsnLHBhZ2luYXRpb25TdWNjZXNzaXZlbHlTaXplOjUscGFnaW5hdGlvblBhZ2VzQnlTaWRlOjEscGFnaW5hdGlvblVzZUludGVybWVkaWF0ZTohMSxzZWFyY2g6ITEsc2VhcmNoT25FbnRlcktleTohMSxzdHJpY3RTZWFyY2g6ITEsdHJpbU9uU2VhcmNoOiEwLHNlYXJjaEFsaWduOidyaWdodCcsc2VhcmNoVGltZU91dDo1MDAsc2VhcmNoVGV4dDonJyxjdXN0b21TZWFyY2g6dm9pZCAwLHNob3dIZWFkZXI6ITAsc2hvd0Zvb3RlcjohMSxmb290ZXJTdHlsZTpmdW5jdGlvbigpe3JldHVybnt9fSxzaG93Q29sdW1uczohMSxtaW5pbXVtQ291bnRDb2x1bW5zOjEsc2hvd1BhZ2luYXRpb25Td2l0Y2g6ITEsc2hvd1JlZnJlc2g6ITEsc2hvd1RvZ2dsZTohMSxzaG93RnVsbHNjcmVlbjohMSxzbWFydERpc3BsYXk6ITAsZXNjYXBlOiExLGlkRmllbGQ6dm9pZCAwLHNlbGVjdEl0ZW1OYW1lOididFNlbGVjdEl0ZW0nLGNsaWNrVG9TZWxlY3Q6ITEsaWdub3JlQ2xpY2tUb1NlbGVjdE9uOmZ1bmN0aW9uKGUpe3ZhciB0PWUudGFnTmFtZTtyZXR1cm4gLTEhPT1bJ0EnLCdCVVRUT04nXS5pbmRleE9mKHQpfSxzaW5nbGVTZWxlY3Q6ITEsY2hlY2tib3hIZWFkZXI6ITAsbWFpbnRhaW5TZWxlY3RlZDohMSx1bmlxdWVJZDp2b2lkIDAsY2FyZFZpZXc6ITEsZGV0YWlsVmlldzohMSxkZXRhaWxGb3JtYXR0ZXI6ZnVuY3Rpb24oKXtyZXR1cm4nJ30sZGV0YWlsRmlsdGVyOmZ1bmN0aW9uKCl7cmV0dXJuITB9LHRvb2xiYXI6dm9pZCAwLHRvb2xiYXJBbGlnbjonbGVmdCcsYnV0dG9uc1Rvb2xiYXI6dm9pZCAwLGJ1dHRvbnNBbGlnbjoncmlnaHQnLGJ1dHRvbnNQcmVmaXg6bC5jbGFzc2VzLmJ1dHRvbnNQcmVmaXgsYnV0dG9uc0NsYXNzOmwuY2xhc3Nlcy5idXR0b25zLGljb25zOmwuaWNvbnMsaWNvblNpemU6dm9pZCAwLGljb25zUHJlZml4OmwuaWNvbnNQcmVmaXgsb25BbGw6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25DbGlja0NlbGw6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25EYmxDbGlja0NlbGw6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25DbGlja1JvdzpmdW5jdGlvbigpe3JldHVybiExfSxvbkRibENsaWNrUm93OmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uU29ydDpmdW5jdGlvbigpe3JldHVybiExfSxvbkNoZWNrOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uVW5jaGVjazpmdW5jdGlvbigpe3JldHVybiExfSxvbkNoZWNrQWxsOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uVW5jaGVja0FsbDpmdW5jdGlvbigpe3JldHVybiExfSxvbkNoZWNrU29tZTpmdW5jdGlvbigpe3JldHVybiExfSxvblVuY2hlY2tTb21lOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uTG9hZFN1Y2Nlc3M6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25Mb2FkRXJyb3I6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25Db2x1bW5Td2l0Y2g6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25QYWdlQ2hhbmdlOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uU2VhcmNoOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uVG9nZ2xlOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uUHJlQm9keTpmdW5jdGlvbigpe3JldHVybiExfSxvblBvc3RCb2R5OmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uUG9zdEhlYWRlcjpmdW5jdGlvbigpe3JldHVybiExfSxvbkV4cGFuZFJvdzpmdW5jdGlvbigpe3JldHVybiExfSxvbkNvbGxhcHNlUm93OmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uUmVmcmVzaE9wdGlvbnM6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sb25SZWZyZXNoOmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uUmVzZXRWaWV3OmZ1bmN0aW9uKCl7cmV0dXJuITF9LG9uU2Nyb2xsQm9keTpmdW5jdGlvbigpe3JldHVybiExfX0sYz17fTtjWydlbi1VUyddPWMuZW49e2Zvcm1hdExvYWRpbmdNZXNzYWdlOmZ1bmN0aW9uKCl7cmV0dXJuJ0xvYWRpbmcsIHBsZWFzZSB3YWl0J30sZm9ybWF0UmVjb3Jkc1BlclBhZ2U6ZnVuY3Rpb24oZSl7cmV0dXJuIGUrJyByb3dzIHBlciBwYWdlJ30sZm9ybWF0U2hvd2luZ1Jvd3M6ZnVuY3Rpb24oZSx0LG8pe3JldHVybidTaG93aW5nICcrZSsnIHRvICcrdCsnIG9mICcrbysnIHJvd3MnfSxmb3JtYXREZXRhaWxQYWdpbmF0aW9uOmZ1bmN0aW9uKGUpe3JldHVybidTaG93aW5nICcrZSsnIHJvd3MnfSxmb3JtYXRTZWFyY2g6ZnVuY3Rpb24oKXtyZXR1cm4nU2VhcmNoJ30sZm9ybWF0Tm9NYXRjaGVzOmZ1bmN0aW9uKCl7cmV0dXJuJ05vIG1hdGNoaW5nIHJlY29yZHMgZm91bmQnfSxmb3JtYXRQYWdpbmF0aW9uU3dpdGNoOmZ1bmN0aW9uKCl7cmV0dXJuJ0hpZGUvU2hvdyBwYWdpbmF0aW9uJ30sZm9ybWF0UmVmcmVzaDpmdW5jdGlvbigpe3JldHVybidSZWZyZXNoJ30sZm9ybWF0VG9nZ2xlOmZ1bmN0aW9uKCl7cmV0dXJuJ1RvZ2dsZSd9LGZvcm1hdENvbHVtbnM6ZnVuY3Rpb24oKXtyZXR1cm4nQ29sdW1ucyd9LGZvcm1hdEZ1bGxzY3JlZW46ZnVuY3Rpb24oKXtyZXR1cm4nRnVsbHNjcmVlbid9LGZvcm1hdEFsbFJvd3M6ZnVuY3Rpb24oKXtyZXR1cm4nQWxsJ319LHMuZXh0ZW5kKGQsY1snZW4tVVMnXSk7dmFyIHA9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG8sYSl7ZSh0aGlzLHQpLHRoaXMub3B0aW9ucz1hLHRoaXMuJGVsPXMobyksdGhpcy4kZWxfPXRoaXMuJGVsLmNsb25lKCksdGhpcy50aW1lb3V0SWRfPTAsdGhpcy50aW1lb3V0Rm9vdGVyXz0wLHRoaXMuaW5pdCgpfXJldHVybiBvKHQsW3trZXk6J2luaXQnLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5pbml0Q29uc3RhbnRzKCksdGhpcy5pbml0TG9jYWxlKCksdGhpcy5pbml0Q29udGFpbmVyKCksdGhpcy5pbml0VGFibGUoKSx0aGlzLmluaXRIZWFkZXIoKSx0aGlzLmluaXREYXRhKCksdGhpcy5pbml0SGlkZGVuUm93cygpLHRoaXMuaW5pdEZvb3RlcigpLHRoaXMuaW5pdFRvb2xiYXIoKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0Qm9keSgpLHRoaXMuaW5pdFNlYXJjaFRleHQoKSx0aGlzLmluaXRTZXJ2ZXIoKX19LHtrZXk6J2luaXRDb25zdGFudHMnLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5vcHRpb25zO3RoaXMuY29uc3RhbnRzPWw7dmFyIHQ9ZS5idXR0b25zUHJlZml4P2UuYnV0dG9uc1ByZWZpeCsnLSc6Jyc7dGhpcy5jb25zdGFudHMuYnV0dG9uc0NsYXNzPVtlLmJ1dHRvbnNQcmVmaXgsdCtlLmJ1dHRvbnNDbGFzcyxyLnNwcmludGYodCsnJXMnLGUuaWNvblNpemUpXS5qb2luKCcgJykudHJpbSgpfX0se2tleTonaW5pdExvY2FsZScsdmFsdWU6ZnVuY3Rpb24oKXtpZih0aGlzLm9wdGlvbnMubG9jYWxlKXt2YXIgZT1zLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXMsdD10aGlzLm9wdGlvbnMubG9jYWxlLnNwbGl0KC8tfF8vKTt0WzBdPXRbMF0udG9Mb3dlckNhc2UoKSx0WzFdJiYodFsxXT10WzFdLnRvVXBwZXJDYXNlKCkpLGVbdGhpcy5vcHRpb25zLmxvY2FsZV0/cy5leHRlbmQodGhpcy5vcHRpb25zLGVbdGhpcy5vcHRpb25zLmxvY2FsZV0pOmVbdC5qb2luKCctJyldP3MuZXh0ZW5kKHRoaXMub3B0aW9ucyxlW3Quam9pbignLScpXSk6ZVt0WzBdXSYmcy5leHRlbmQodGhpcy5vcHRpb25zLGVbdFswXV0pfX19LHtrZXk6J2luaXRDb250YWluZXInLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9LTE9PT1bJ3RvcCcsJ2JvdGgnXS5pbmRleE9mKHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduKT8nJzonPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLXBhZ2luYXRpb24gY2xlYXJmaXhcIj48L2Rpdj4nLHQ9LTE9PT1bJ2JvdHRvbScsJ2JvdGgnXS5pbmRleE9mKHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uVkFsaWduKT8nJzonPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLXBhZ2luYXRpb25cIj48L2Rpdj4nO3RoaXMuJGNvbnRhaW5lcj1zKCdcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJib290c3RyYXAtdGFibGVcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmaXhlZC10YWJsZS10b29sYmFyXCI+PC9kaXY+XFxuICAgICAgICAnK2UrJ1xcbiAgICAgICAgPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWNvbnRhaW5lclwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWhlYWRlclwiPjx0YWJsZT48L3RhYmxlPjwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cImZpeGVkLXRhYmxlLWJvZHlcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmaXhlZC10YWJsZS1sb2FkaW5nXCI+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cImxvYWRpbmctd3JhcFwiPlxcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJsb2FkaW5nLXRleHRcIj4nK3RoaXMub3B0aW9ucy5mb3JtYXRMb2FkaW5nTWVzc2FnZSgpKyc8L3NwYW4+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cImFuaW1hdGlvbi13cmFwXCI+PHNwYW4gY2xhc3M9XCJhbmltYXRpb24tZG90XCI+PC9zcGFuPjwvc3Bhbj5cXG4gICAgICAgIDwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZml4ZWQtdGFibGUtZm9vdGVyXCI+PHRhYmxlPjx0aGVhZD48dHI+PC90cj48L3RoZWFkPjwvdGFibGU+PC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgICcrdCsnXFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAnKSx0aGlzLiRjb250YWluZXIuaW5zZXJ0QWZ0ZXIodGhpcy4kZWwpLHRoaXMuJHRhYmxlQ29udGFpbmVyPXRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtY29udGFpbmVyJyksdGhpcy4kdGFibGVIZWFkZXI9dGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS1oZWFkZXInKSx0aGlzLiR0YWJsZUJvZHk9dGhpcy4kY29udGFpbmVyLmZpbmQoJy5maXhlZC10YWJsZS1ib2R5JyksdGhpcy4kdGFibGVMb2FkaW5nPXRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtbG9hZGluZycpLHRoaXMuJHRhYmxlRm9vdGVyPXRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtZm9vdGVyJyksdGhpcy4kdG9vbGJhcj10aGlzLm9wdGlvbnMuYnV0dG9uc1Rvb2xiYXI/cygnYm9keScpLmZpbmQodGhpcy5vcHRpb25zLmJ1dHRvbnNUb29sYmFyKTp0aGlzLiRjb250YWluZXIuZmluZCgnLmZpeGVkLXRhYmxlLXRvb2xiYXInKSx0aGlzLiRwYWdpbmF0aW9uPXRoaXMuJGNvbnRhaW5lci5maW5kKCcuZml4ZWQtdGFibGUtcGFnaW5hdGlvbicpLHRoaXMuJHRhYmxlQm9keS5hcHBlbmQodGhpcy4kZWwpLHRoaXMuJGNvbnRhaW5lci5hZnRlcignPGRpdiBjbGFzcz1cImNsZWFyZml4XCI+PC9kaXY+JyksdGhpcy4kZWwuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMpLHRoaXMuJHRhYmxlTG9hZGluZy5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3NlcyksdGhpcy5vcHRpb25zLmhlaWdodCYmKHRoaXMuJHRhYmxlQ29udGFpbmVyLmFkZENsYXNzKCdmaXhlZC1oZWlnaHQnKSx0aGlzLm9wdGlvbnMuc2hvd0Zvb3RlciYmdGhpcy4kdGFibGVDb250YWluZXIuYWRkQ2xhc3MoJ2hhcy1mb290ZXInKSwtMSE9PXRoaXMub3B0aW9ucy5jbGFzc2VzLnNwbGl0KCcgJykuaW5kZXhPZigndGFibGUtYm9yZGVyZWQnKSYmKHRoaXMuJHRhYmxlQm9keS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJmaXhlZC10YWJsZS1ib3JkZXJcIj48L2Rpdj4nKSx0aGlzLiR0YWJsZUJvcmRlcj10aGlzLiR0YWJsZUJvZHkuZmluZCgnLmZpeGVkLXRhYmxlLWJvcmRlcicpLHRoaXMuJHRhYmxlTG9hZGluZy5hZGRDbGFzcygnZml4ZWQtdGFibGUtYm9yZGVyJykpKX19LHtrZXk6J2luaXRUYWJsZScsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLG89W10sYT1bXTtpZih0aGlzLiRoZWFkZXI9dGhpcy4kZWwuZmluZCgnPnRoZWFkJyksdGhpcy4kaGVhZGVyLmxlbmd0aD90aGlzLm9wdGlvbnMudGhlYWRDbGFzc2VzJiZ0aGlzLiRoZWFkZXIuYWRkQ2xhc3ModGhpcy5vcHRpb25zLnRoZWFkQ2xhc3Nlcyk6dGhpcy4kaGVhZGVyPXMoJzx0aGVhZCBjbGFzcz1cIicrdGhpcy5vcHRpb25zLnRoZWFkQ2xhc3NlcysnXCI+PC90aGVhZD4nKS5hcHBlbmRUbyh0aGlzLiRlbCksdGhpcy4kaGVhZGVyLmZpbmQoJ3RyJykuZWFjaChmdW5jdGlvbihlLHQpe3ZhciBhPVtdO3ModCkuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uKGUsdCl7J3VuZGVmaW5lZCchPXR5cGVvZiBzKHQpLmRhdGEoJ2ZpZWxkJykmJnModCkuZGF0YSgnZmllbGQnLCcnK3ModCkuZGF0YSgnZmllbGQnKSksYS5wdXNoKHMuZXh0ZW5kKHt9LHt0aXRsZTpzKHQpLmh0bWwoKSxjbGFzczpzKHQpLmF0dHIoJ2NsYXNzJyksdGl0bGVUb29sdGlwOnModCkuYXR0cigndGl0bGUnKSxyb3dzcGFuOnModCkuYXR0cigncm93c3BhbicpPytzKHQpLmF0dHIoJ3Jvd3NwYW4nKTp2b2lkIDAsY29sc3BhbjpzKHQpLmF0dHIoJ2NvbHNwYW4nKT8rcyh0KS5hdHRyKCdjb2xzcGFuJyk6dm9pZCAwfSxzKHQpLmRhdGEoKSkpfSksby5wdXNoKGEpfSksQXJyYXkuaXNBcnJheSh0aGlzLm9wdGlvbnMuY29sdW1uc1swXSl8fCh0aGlzLm9wdGlvbnMuY29sdW1ucz1bdGhpcy5vcHRpb25zLmNvbHVtbnNdKSx0aGlzLm9wdGlvbnMuY29sdW1ucz1zLmV4dGVuZCghMCxbXSxvLHRoaXMub3B0aW9ucy5jb2x1bW5zKSx0aGlzLmNvbHVtbnM9W10sdGhpcy5maWVsZHNDb2x1bW5zSW5kZXg9W10sci5zZXRGaWVsZEluZGV4KHRoaXMub3B0aW9ucy5jb2x1bW5zKSx0aGlzLm9wdGlvbnMuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKG8sYSl7by5mb3JFYWNoKGZ1bmN0aW9uKG8saSl7dmFyIG49cy5leHRlbmQoe30sdC5DT0xVTU5fREVGQVVMVFMsbyk7J3VuZGVmaW5lZCchPXR5cGVvZiBuLmZpZWxkSW5kZXgmJihlLmNvbHVtbnNbbi5maWVsZEluZGV4XT1uLGUuZmllbGRzQ29sdW1uc0luZGV4W24uZmllbGRdPW4uZmllbGRJbmRleCksZS5vcHRpb25zLmNvbHVtbnNbYV1baV09bn0pfSksIXRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCl7dmFyIGk9W107dGhpcy4kZWwuZmluZCgnPnRib2R5PnRyJykuZWFjaChmdW5jdGlvbih0LG8pe3ZhciBuPXt9O24uX2lkPXMobykuYXR0cignaWQnKSxuLl9jbGFzcz1zKG8pLmF0dHIoJ2NsYXNzJyksbi5fZGF0YT1yLmdldFJlYWxEYXRhQXR0cihzKG8pLmRhdGEoKSkscyhvKS5maW5kKCc+dGQnKS5lYWNoKGZ1bmN0aW9uKG8sYSl7Zm9yKHZhciBsPStzKGEpLmF0dHIoJ2NvbHNwYW4nKXx8MSxkPStzKGEpLmF0dHIoJ3Jvd3NwYW4nKXx8MSxjPW87aVt0XSYmaVt0XVtjXTtjKyspO2Zvcih2YXIgaD1jO2g8YytsO2grKylmb3IodmFyIGc9dDtnPHQrZDtnKyspaVtnXXx8KGlbZ109W10pLGlbZ11baF09ITA7dmFyIHA9ZS5jb2x1bW5zW2NdLmZpZWxkO25bcF09cyhhKS5odG1sKCkudHJpbSgpLG5bJ18nK3ArJ19pZCddPXMoYSkuYXR0cignaWQnKSxuWydfJytwKydfY2xhc3MnXT1zKGEpLmF0dHIoJ2NsYXNzJyksblsnXycrcCsnX3Jvd3NwYW4nXT1zKGEpLmF0dHIoJ3Jvd3NwYW4nKSxuWydfJytwKydfY29sc3BhbiddPXMoYSkuYXR0cignY29sc3BhbicpLG5bJ18nK3ArJ190aXRsZSddPXMoYSkuYXR0cigndGl0bGUnKSxuWydfJytwKydfZGF0YSddPXIuZ2V0UmVhbERhdGFBdHRyKHMoYSkuZGF0YSgpKX0pLGEucHVzaChuKX0pLHRoaXMub3B0aW9ucy5kYXRhPWEsYS5sZW5ndGgmJih0aGlzLmZyb21IdG1sPSEwKX19fSx7a2V5Oidpbml0SGVhZGVyJyx2YWx1ZTpmdW5jdGlvbigpe3ZhciB0PXRoaXMsZT17fSxvPVtdO3RoaXMuaGVhZGVyPXtmaWVsZHM6W10sc3R5bGVzOltdLGNsYXNzZXM6W10sZm9ybWF0dGVyczpbXSxldmVudHM6W10sc29ydGVyczpbXSxzb3J0TmFtZXM6W10sY2VsbFN0eWxlczpbXSxzZWFyY2hhYmxlczpbXX0sdGhpcy5vcHRpb25zLmNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihhLG4pe28ucHVzaCgnPHRyPicpLDA9PT1uJiYhdC5vcHRpb25zLmNhcmRWaWV3JiZ0Lm9wdGlvbnMuZGV0YWlsVmlldyYmby5wdXNoKCc8dGggY2xhc3M9XCJkZXRhaWxcIiByb3dzcGFuPVwiJyt0Lm9wdGlvbnMuY29sdW1ucy5sZW5ndGgrJ1wiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaHQtY2VsbFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvdGg+XFxuICAgICAgICAgICcpLGEuZm9yRWFjaChmdW5jdGlvbihhLGkpe3ZhciBzPScnLGw9JycsZD0nJyxjPScnLHA9ci5zcHJpbnRmKCcgY2xhc3M9XCIlc1wiJyxhWydjbGFzcyddKSxoPSdweCcsZz1hLndpZHRoO2lmKHZvaWQgMD09PWEud2lkdGh8fHQub3B0aW9ucy5jYXJkVmlld3x8J3N0cmluZychPXR5cGVvZiBhLndpZHRofHwtMT09PWEud2lkdGguaW5kZXhPZignJScpfHwoaD0nJScpLGEud2lkdGgmJidzdHJpbmcnPT10eXBlb2YgYS53aWR0aCYmKGc9YS53aWR0aC5yZXBsYWNlKCclJywnJykucmVwbGFjZSgncHgnLCcnKSksbD1yLnNwcmludGYoJ3RleHQtYWxpZ246ICVzOyAnLGEuaGFsaWduP2EuaGFsaWduOmEuYWxpZ24pLGQ9ci5zcHJpbnRmKCd0ZXh0LWFsaWduOiAlczsgJyxhLmFsaWduKSxjPXIuc3ByaW50ZigndmVydGljYWwtYWxpZ246ICVzOyAnLGEudmFsaWduKSxjKz1yLnNwcmludGYoJ3dpZHRoOiAlczsgJywoYS5jaGVja2JveHx8YS5yYWRpbykmJiFnP2Euc2hvd1NlbGVjdFRpdGxlP3ZvaWQgMDonMzZweCc6Zz9nK2g6dm9pZCAwKSwndW5kZWZpbmVkJyE9dHlwZW9mIGEuZmllbGRJbmRleCl7aWYodC5oZWFkZXIuZmllbGRzW2EuZmllbGRJbmRleF09YS5maWVsZCx0LmhlYWRlci5zdHlsZXNbYS5maWVsZEluZGV4XT1kK2MsdC5oZWFkZXIuY2xhc3Nlc1thLmZpZWxkSW5kZXhdPXAsdC5oZWFkZXIuZm9ybWF0dGVyc1thLmZpZWxkSW5kZXhdPWEuZm9ybWF0dGVyLHQuaGVhZGVyLmV2ZW50c1thLmZpZWxkSW5kZXhdPWEuZXZlbnRzLHQuaGVhZGVyLnNvcnRlcnNbYS5maWVsZEluZGV4XT1hLnNvcnRlcix0LmhlYWRlci5zb3J0TmFtZXNbYS5maWVsZEluZGV4XT1hLnNvcnROYW1lLHQuaGVhZGVyLmNlbGxTdHlsZXNbYS5maWVsZEluZGV4XT1hLmNlbGxTdHlsZSx0LmhlYWRlci5zZWFyY2hhYmxlc1thLmZpZWxkSW5kZXhdPWEuc2VhcmNoYWJsZSwhYS52aXNpYmxlKXJldHVybjtpZih0Lm9wdGlvbnMuY2FyZFZpZXcmJiFhLmNhcmRWaXNpYmxlKXJldHVybjtlW2EuZmllbGRdPWF9by5wdXNoKCc8dGgnK3Iuc3ByaW50ZignIHRpdGxlPVwiJXNcIicsYS50aXRsZVRvb2x0aXApLGEuY2hlY2tib3h8fGEucmFkaW8/ci5zcHJpbnRmKCcgY2xhc3M9XCJicy1jaGVja2JveCAlc1wiJyxhWydjbGFzcyddfHwnJyk6cCxyLnNwcmludGYoJyBzdHlsZT1cIiVzXCInLGwrYyksci5zcHJpbnRmKCcgcm93c3Bhbj1cIiVzXCInLGEucm93c3Bhbiksci5zcHJpbnRmKCcgY29sc3Bhbj1cIiVzXCInLGEuY29sc3Bhbiksci5zcHJpbnRmKCcgZGF0YS1maWVsZD1cIiVzXCInLGEuZmllbGQpLDA9PT1pJiYwPG4/JyBkYXRhLW5vdC1maXJzdC10aCc6JycsJz4nKSxvLnB1c2goci5zcHJpbnRmKCc8ZGl2IGNsYXNzPVwidGgtaW5uZXIgJXNcIj4nLHQub3B0aW9ucy5zb3J0YWJsZSYmYS5zb3J0YWJsZT8nc29ydGFibGUgYm90aCc6JycpKSxzPXQub3B0aW9ucy5lc2NhcGU/ci5lc2NhcGVIVE1MKGEudGl0bGUpOmEudGl0bGU7dmFyIHU9czthLmNoZWNrYm94JiYocz0nJywhdC5vcHRpb25zLnNpbmdsZVNlbGVjdCYmdC5vcHRpb25zLmNoZWNrYm94SGVhZGVyJiYocz0nPGxhYmVsPjxpbnB1dCBuYW1lPVwiYnRTZWxlY3RBbGxcIiB0eXBlPVwiY2hlY2tib3hcIiAvPjxzcGFuPjwvc3Bhbj48L2xhYmVsPicpLHQuaGVhZGVyLnN0YXRlRmllbGQ9YS5maWVsZCksYS5yYWRpbyYmKHM9JycsdC5oZWFkZXIuc3RhdGVGaWVsZD1hLmZpZWxkLHQub3B0aW9ucy5zaW5nbGVTZWxlY3Q9ITApLCFzJiZhLnNob3dTZWxlY3RUaXRsZSYmKHMrPXUpLG8ucHVzaChzKSxvLnB1c2goJzwvZGl2PicpLG8ucHVzaCgnPGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+Jyksby5wdXNoKCc8L2Rpdj4nKSxvLnB1c2goJzwvdGg+Jyl9KSxvLnB1c2goJzwvdHI+Jyl9KSx0aGlzLiRoZWFkZXIuaHRtbChvLmpvaW4oJycpKSx0aGlzLiRoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uKHQsbyl7cyhvKS5kYXRhKGVbcyhvKS5kYXRhKCdmaWVsZCcpXSl9KSx0aGlzLiRjb250YWluZXIub2ZmKCdjbGljaycsJy50aC1pbm5lcicpLm9uKCdjbGljaycsJy50aC1pbm5lcicsZnVuY3Rpb24obyl7dmFyIGU9cyhvLmN1cnJlbnRUYXJnZXQpO3JldHVybiB0Lm9wdGlvbnMuZGV0YWlsVmlldyYmIWUucGFyZW50KCkuaGFzQ2xhc3MoJ2JzLWNoZWNrYm94JykmJmUuY2xvc2VzdCgnLmJvb3RzdHJhcC10YWJsZScpWzBdIT09dC4kY29udGFpbmVyWzBdPyExOnZvaWQodC5vcHRpb25zLnNvcnRhYmxlJiZlLnBhcmVudCgpLmRhdGEoKS5zb3J0YWJsZSYmdC5vblNvcnQobykpfSksdGhpcy4kaGVhZGVyLmNoaWxkcmVuKCkuY2hpbGRyZW4oKS5vZmYoJ2tleXByZXNzJykub24oJ2tleXByZXNzJyxmdW5jdGlvbihvKXtpZih0Lm9wdGlvbnMuc29ydGFibGUmJnMoby5jdXJyZW50VGFyZ2V0KS5kYXRhKCkuc29ydGFibGUpe3ZhciBlPW8ua2V5Q29kZXx8by53aGljaDsxMz09PWUmJnQub25Tb3J0KG8pfX0pLHMod2luZG93KS5vZmYoJ3Jlc2l6ZS5ib290c3RyYXAtdGFibGUnKSwhdGhpcy5vcHRpb25zLnNob3dIZWFkZXJ8fHRoaXMub3B0aW9ucy5jYXJkVmlldz8odGhpcy4kaGVhZGVyLmhpZGUoKSx0aGlzLiR0YWJsZUhlYWRlci5oaWRlKCksdGhpcy4kdGFibGVMb2FkaW5nLmNzcygndG9wJywwKSk6KHRoaXMuJGhlYWRlci5zaG93KCksdGhpcy4kdGFibGVIZWFkZXIuc2hvdygpLHRoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ3RvcCcsdGhpcy4kaGVhZGVyLm91dGVySGVpZ2h0KCkrMSksdGhpcy5nZXRDYXJldCgpLHMod2luZG93KS5vbigncmVzaXplLmJvb3RzdHJhcC10YWJsZScsZnVuY3Rpb24obyl7cmV0dXJuIHQucmVzZXRXaWR0aChvKX0pKSx0aGlzLiRzZWxlY3RBbGw9dGhpcy4kaGVhZGVyLmZpbmQoJ1tuYW1lPVwiYnRTZWxlY3RBbGxcIl0nKSx0aGlzLiRzZWxlY3RBbGwub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7dmFyIG89ZS5jdXJyZW50VGFyZ2V0LGE9cyhvKS5wcm9wKCdjaGVja2VkJyk7dFthPydjaGVja0FsbCc6J3VuY2hlY2tBbGwnXSgpLHQudXBkYXRlU2VsZWN0ZWQoKX0pfX0se2tleTonaW5pdEZvb3RlcicsdmFsdWU6ZnVuY3Rpb24oKXshdGhpcy5vcHRpb25zLnNob3dGb290ZXJ8fHRoaXMub3B0aW9ucy5jYXJkVmlldz90aGlzLiR0YWJsZUZvb3Rlci5oaWRlKCk6dGhpcy4kdGFibGVGb290ZXIuc2hvdygpfX0se2tleTonaW5pdERhdGEnLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dGhpcy5vcHRpb25zLmRhdGE9J2FwcGVuZCc9PT10P3RoaXMub3B0aW9ucy5kYXRhLmNvbmNhdChlKToncHJlcGVuZCc9PT10P1tdLmNvbmNhdChlKS5jb25jYXQodGhpcy5vcHRpb25zLmRhdGEpOmV8fHRoaXMub3B0aW9ucy5kYXRhLHRoaXMuZGF0YT10aGlzLm9wdGlvbnMuZGF0YSwnc2VydmVyJz09PXRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbnx8dGhpcy5pbml0U29ydCgpfX0se2tleTonaW5pdFNvcnQnLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PXRoaXMub3B0aW9ucy5zb3J0TmFtZSxvPSdkZXNjJz09PXRoaXMub3B0aW9ucy5zb3J0T3JkZXI/LTE6MSxpPXRoaXMuaGVhZGVyLmZpZWxkcy5pbmRleE9mKHRoaXMub3B0aW9ucy5zb3J0TmFtZSksYT0wOy0xIT09aSYmKHRoaXMub3B0aW9ucy5zb3J0U3RhYmxlJiZ0aGlzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihlLHQpe2UuaGFzT3duUHJvcGVydHkoJ19wb3NpdGlvbicpfHwoZS5fcG9zaXRpb249dCl9KSx0aGlzLm9wdGlvbnMuY3VzdG9tU29ydD9yLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucyx0aGlzLm9wdGlvbnMuY3VzdG9tU29ydCxbdGhpcy5vcHRpb25zLnNvcnROYW1lLHRoaXMub3B0aW9ucy5zb3J0T3JkZXIsdGhpcy5kYXRhXSk6dGhpcy5kYXRhLnNvcnQoZnVuY3Rpb24obixhKXtlLmhlYWRlci5zb3J0TmFtZXNbaV0mJih0PWUuaGVhZGVyLnNvcnROYW1lc1tpXSk7dmFyIHM9ci5nZXRJdGVtRmllbGQobix0LGUub3B0aW9ucy5lc2NhcGUpLGw9ci5nZXRJdGVtRmllbGQoYSx0LGUub3B0aW9ucy5lc2NhcGUpLGQ9ci5jYWxjdWxhdGVPYmplY3RWYWx1ZShlLmhlYWRlcixlLmhlYWRlci5zb3J0ZXJzW2ldLFtzLGwsbixhXSk7cmV0dXJuIHZvaWQgMD09PWQ/KCh2b2lkIDA9PT1zfHxudWxsPT09cykmJihzPScnKSwodm9pZCAwPT09bHx8bnVsbD09PWwpJiYobD0nJyksZS5vcHRpb25zLnNvcnRTdGFibGUmJnM9PT1sJiYocz1uLl9wb3NpdGlvbixsPWEuX3Bvc2l0aW9uKSxyLmlzTnVtZXJpYyhzKSYmci5pc051bWVyaWMobCkpPyhzPXBhcnNlRmxvYXQocyksbD1wYXJzZUZsb2F0KGwpLHM8bD8tMSpvOnM+bD9vOjApOnM9PT1sPzA6KCdzdHJpbmcnIT10eXBlb2YgcyYmKHM9cy50b1N0cmluZygpKSwtMT09PXMubG9jYWxlQ29tcGFyZShsKT8tMSpvOm8pOmUub3B0aW9ucy5zb3J0U3RhYmxlJiYwPT09ZD9vKihuLl9wb3NpdGlvbi1hLl9wb3NpdGlvbik6bypkfSksdm9pZCAwIT09dGhpcy5vcHRpb25zLnNvcnRDbGFzcyYmKGNsZWFyVGltZW91dChhKSxhPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLiRlbC5yZW1vdmVDbGFzcyhlLm9wdGlvbnMuc29ydENsYXNzKTt2YXIgdD1lLiRoZWFkZXIuZmluZCgnW2RhdGEtZmllbGQ9XCInK2Uub3B0aW9ucy5zb3J0TmFtZSsnXCJdJykuaW5kZXgoKTtlLiRlbC5maW5kKCd0ciB0ZDpudGgtY2hpbGQoJysodCsxKSsnKScpLmFkZENsYXNzKGUub3B0aW9ucy5zb3J0Q2xhc3MpfSwyNTApKSl9fSx7a2V5OidvblNvcnQnLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PWUudHlwZSxvPWUuY3VycmVudFRhcmdldCxhPSdrZXlwcmVzcyc9PT10P3Mobyk6cyhvKS5wYXJlbnQoKSxpPXRoaXMuJGhlYWRlci5maW5kKCd0aCcpLmVxKGEuaW5kZXgoKSk7cmV0dXJuIHRoaXMuJGhlYWRlci5hZGQodGhpcy4kaGVhZGVyXykuZmluZCgnc3Bhbi5vcmRlcicpLnJlbW92ZSgpLHRoaXMub3B0aW9ucy5zb3J0TmFtZT09PWEuZGF0YSgnZmllbGQnKT90aGlzLm9wdGlvbnMuc29ydE9yZGVyPSdhc2MnPT09dGhpcy5vcHRpb25zLnNvcnRPcmRlcj8nZGVzYyc6J2FzYyc6KHRoaXMub3B0aW9ucy5zb3J0TmFtZT1hLmRhdGEoJ2ZpZWxkJyksdGhpcy5vcHRpb25zLnNvcnRPcmRlcj10aGlzLm9wdGlvbnMucmVtZW1iZXJPcmRlcj8nYXNjJz09PWEuZGF0YSgnb3JkZXInKT8nZGVzYyc6J2FzYyc6dGhpcy5jb2x1bW5zW3RoaXMuZmllbGRzQ29sdW1uc0luZGV4W2EuZGF0YSgnZmllbGQnKV1dLm9yZGVyKSx0aGlzLnRyaWdnZXIoJ3NvcnQnLHRoaXMub3B0aW9ucy5zb3J0TmFtZSx0aGlzLm9wdGlvbnMuc29ydE9yZGVyKSxhLmFkZChpKS5kYXRhKCdvcmRlcicsdGhpcy5vcHRpb25zLnNvcnRPcmRlciksdGhpcy5nZXRDYXJldCgpLCdzZXJ2ZXInPT09dGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uP3ZvaWQgdGhpcy5pbml0U2VydmVyKHRoaXMub3B0aW9ucy5zaWxlbnRTb3J0KTp2b2lkKHRoaXMuaW5pdFNvcnQoKSx0aGlzLmluaXRCb2R5KCkpfX0se2tleTonaW5pdFRvb2xiYXInLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcyx0PXRoaXMub3B0aW9ucyxvPVtdLGE9MCxpPXZvaWQgMCxsPXZvaWQgMCxkPTA7dGhpcy4kdG9vbGJhci5maW5kKCcuYnMtYmFycycpLmNoaWxkcmVuKCkubGVuZ3RoJiZzKCdib2R5JykuYXBwZW5kKHModC50b29sYmFyKSksdGhpcy4kdG9vbGJhci5odG1sKCcnKSwoJ3N0cmluZyc9PXR5cGVvZiB0LnRvb2xiYXJ8fCdvYmplY3QnPT09bih0LnRvb2xiYXIpKSYmcyhyLnNwcmludGYoJzxkaXYgY2xhc3M9XCJicy1iYXJzICVzLSVzXCI+PC9kaXY+Jyx0aGlzLmNvbnN0YW50cy5jbGFzc2VzLnB1bGwsdC50b29sYmFyQWxpZ24pKS5hcHBlbmRUbyh0aGlzLiR0b29sYmFyKS5hcHBlbmQocyh0LnRvb2xiYXIpKSxvPVsnPGRpdiBjbGFzcz1cIicrWydjb2x1bW5zJywnY29sdW1ucy0nK3QuYnV0dG9uc0FsaWduLHRoaXMuY29uc3RhbnRzLmNsYXNzZXMuYnV0dG9uc0dyb3VwLHRoaXMuY29uc3RhbnRzLmNsYXNzZXMucHVsbCsnLScrdC5idXR0b25zQWxpZ25dLmpvaW4oJyAnKSsnXCI+J10sJ3N0cmluZyc9PXR5cGVvZiB0Lmljb25zJiYodC5pY29ucz1yLmNhbGN1bGF0ZU9iamVjdFZhbHVlKG51bGwsdC5pY29ucykpLHQuc2hvd1BhZ2luYXRpb25Td2l0Y2gmJm8ucHVzaCgnPGJ1dHRvbiBjbGFzcz1cIicrdGhpcy5jb25zdGFudHMuYnV0dG9uc0NsYXNzKydcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIlxcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiUGFnaW5hdGlvbiBTd2l0Y2hcIiB0aXRsZT1cIicrdC5mb3JtYXRQYWdpbmF0aW9uU3dpdGNoKCkrJ1wiPlxcbiAgICAgICAgICAnK3Iuc3ByaW50Zih0aGlzLmNvbnN0YW50cy5odG1sLmljb24sdC5pY29uc1ByZWZpeCx0Lmljb25zLnBhZ2luYXRpb25Td2l0Y2hEb3duKSsnXFxuICAgICAgICAgIDwvYnV0dG9uPicpLHQuc2hvd1JlZnJlc2gmJm8ucHVzaCgnPGJ1dHRvbiBjbGFzcz1cIicrdGhpcy5jb25zdGFudHMuYnV0dG9uc0NsYXNzKydcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInJlZnJlc2hcIlxcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiUmVmcmVzaFwiIHRpdGxlPVwiJyt0LmZvcm1hdFJlZnJlc2goKSsnXCI+XFxuICAgICAgICAgICcrci5zcHJpbnRmKHRoaXMuY29uc3RhbnRzLmh0bWwuaWNvbix0Lmljb25zUHJlZml4LHQuaWNvbnMucmVmcmVzaCkrJ1xcbiAgICAgICAgICA8L2J1dHRvbj4nKSx0LnNob3dUb2dnbGUmJm8ucHVzaCgnPGJ1dHRvbiBjbGFzcz1cIicrdGhpcy5jb25zdGFudHMuYnV0dG9uc0NsYXNzKydcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cInRvZ2dsZVwiXFxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJUb2dnbGVcIiB0aXRsZT1cIicrdC5mb3JtYXRUb2dnbGUoKSsnXCI+XFxuICAgICAgICAgICcrci5zcHJpbnRmKHRoaXMuY29uc3RhbnRzLmh0bWwuaWNvbix0Lmljb25zUHJlZml4LHQuaWNvbnMudG9nZ2xlT2ZmKSsnXFxuICAgICAgICAgIDwvYnV0dG9uPicpLHQuc2hvd0Z1bGxzY3JlZW4mJm8ucHVzaCgnPGJ1dHRvbiBjbGFzcz1cIicrdGhpcy5jb25zdGFudHMuYnV0dG9uc0NsYXNzKydcIiB0eXBlPVwiYnV0dG9uXCIgbmFtZT1cImZ1bGxzY3JlZW5cIlxcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiRnVsbHNjcmVlblwiIHRpdGxlPVwiJyt0LmZvcm1hdEZ1bGxzY3JlZW4oKSsnXCI+XFxuICAgICAgICAgICcrci5zcHJpbnRmKHRoaXMuY29uc3RhbnRzLmh0bWwuaWNvbix0Lmljb25zUHJlZml4LHQuaWNvbnMuZnVsbHNjcmVlbikrJ1xcbiAgICAgICAgICA8L2J1dHRvbj4nKSx0LnNob3dDb2x1bW5zJiYoby5wdXNoKCc8ZGl2IGNsYXNzPVwia2VlcC1vcGVuICcrdGhpcy5jb25zdGFudHMuY2xhc3Nlcy5idXR0b25zRHJvcGRvd24rJ1wiIHRpdGxlPVwiJyt0LmZvcm1hdENvbHVtbnMoKSsnXCI+XFxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCInK3RoaXMuY29uc3RhbnRzLmJ1dHRvbnNDbGFzcysnIGRyb3Bkb3duLXRvZ2dsZVwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIkNvbHVtbnNcIiB0aXRsZT1cIicrdC5mb3JtYXRGdWxsc2NyZWVuKCkrJ1wiPlxcbiAgICAgICAgICAnK3Iuc3ByaW50Zih0aGlzLmNvbnN0YW50cy5odG1sLmljb24sdC5pY29uc1ByZWZpeCx0Lmljb25zLmNvbHVtbnMpKydcXG4gICAgICAgICAgJyt0aGlzLmNvbnN0YW50cy5odG1sLmRyb3Bkb3duQ2FyZXQrJ1xcbiAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgJyt0aGlzLmNvbnN0YW50cy5odG1sLnRvb2JhckRyb3Bkb3dbMF0pLHRoaXMuY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uKGEsbil7aWYoIShhLnJhZGlvfHxhLmNoZWNrYm94KSYmKCF0LmNhcmRWaWV3fHxhLmNhcmRWaXNpYmxlKSl7dmFyIGk9YS52aXNpYmxlPycgY2hlY2tlZD1cImNoZWNrZWRcIic6Jyc7YS5zd2l0Y2hhYmxlJiYoby5wdXNoKHIuc3ByaW50ZihlLmNvbnN0YW50cy5odG1sLnRvb2JhckRyb3Bkb3dJdGVtLHIuc3ByaW50ZignPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtZmllbGQ9XCIlc1wiIHZhbHVlPVwiJXNcIiVzPiA8c3Bhbj4lczwvc3Bhbj4nLGEuZmllbGQsbixpLGEudGl0bGUpKSksZCsrKX19KSxvLnB1c2godGhpcy5jb25zdGFudHMuaHRtbC50b29iYXJEcm9wZG93WzFdLCc8L2Rpdj4nKSksby5wdXNoKCc8L2Rpdj4nKSwodGhpcy5zaG93VG9vbGJhcnx8MjxvLmxlbmd0aCkmJnRoaXMuJHRvb2xiYXIuYXBwZW5kKG8uam9pbignJykpLHQuc2hvd1BhZ2luYXRpb25Td2l0Y2gmJnRoaXMuJHRvb2xiYXIuZmluZCgnYnV0dG9uW25hbWU9XCJwYWdpbmF0aW9uU3dpdGNoXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtyZXR1cm4gZS50b2dnbGVQYWdpbmF0aW9uKCl9KSx0LnNob3dGdWxsc2NyZWVuJiZ0aGlzLiR0b29sYmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwiZnVsbHNjcmVlblwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7cmV0dXJuIGUudG9nZ2xlRnVsbHNjcmVlbigpfSksdC5zaG93UmVmcmVzaCYmdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInJlZnJlc2hcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe3JldHVybiBlLnJlZnJlc2goKX0pLHQuc2hvd1RvZ2dsZSYmdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInRvZ2dsZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7ZS50b2dnbGVWaWV3KCl9KSx0LnNob3dDb2x1bW5zJiYoaT10aGlzLiR0b29sYmFyLmZpbmQoJy5rZWVwLW9wZW4nKSxkPD10Lm1pbmltdW1Db3VudENvbHVtbnMmJmkuZmluZCgnaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsITApLGkuZmluZCgnbGksIGxhYmVsJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24odCl7dC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKX0pLGkuZmluZCgnaW5wdXQnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbih0KXt2YXIgbz10LmN1cnJlbnRUYXJnZXQsYT1zKG8pO2UudG9nZ2xlQ29sdW1uKGEudmFsKCksYS5wcm9wKCdjaGVja2VkJyksITEpLGUudHJpZ2dlcignY29sdW1uLXN3aXRjaCcsYS5kYXRhKCdmaWVsZCcpLGEucHJvcCgnY2hlY2tlZCcpKX0pKSx0LnNlYXJjaCYmKG89W10sby5wdXNoKCc8ZGl2IGNsYXNzPVwiJyt0aGlzLmNvbnN0YW50cy5jbGFzc2VzLnB1bGwrJy0nK3Quc2VhcmNoQWxpZ24rJyBzZWFyY2ggJyt0aGlzLmNvbnN0YW50cy5jbGFzc2VzLmlucHV0R3JvdXArJ1wiPlxcbiAgICAgICAgICA8aW5wdXQgY2xhc3M9XCInK3RoaXMuY29uc3RhbnRzLmNsYXNzZXMuaW5wdXQrci5zcHJpbnRmKCcgaW5wdXQtJXMnLHQuaWNvblNpemUpKydcIlxcbiAgICAgICAgICB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiJyt0LmZvcm1hdFNlYXJjaCgpKydcIj5cXG4gICAgICAgICAgPC9kaXY+JyksdGhpcy4kdG9vbGJhci5hcHBlbmQoby5qb2luKCcnKSksbD10aGlzLiR0b29sYmFyLmZpbmQoJy5zZWFyY2ggaW5wdXQnKSxsLm9mZigna2V5dXAgZHJvcCBibHVyJykub24oJ2tleXVwIGRyb3AgYmx1cicsZnVuY3Rpb24obyl7dC5zZWFyY2hPbkVudGVyS2V5JiYxMyE9PW8ua2V5Q29kZXx8LTEhPT1bMzcsMzgsMzksNDBdLmluZGV4T2Yoby5rZXlDb2RlKXx8KGNsZWFyVGltZW91dChhKSxhPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLm9uU2VhcmNoKG8pfSx0LnNlYXJjaFRpbWVPdXQpKX0pLHIuaXNJRUJyb3dzZXIoKSYmbC5vZmYoJ21vdXNldXAnKS5vbignbW91c2V1cCcsZnVuY3Rpb24obyl7Y2xlYXJUaW1lb3V0KGEpLGE9c2V0VGltZW91dChmdW5jdGlvbigpe2Uub25TZWFyY2gobyl9LHQuc2VhcmNoVGltZU91dCl9KSl9fSx7a2V5OidvblNlYXJjaCcsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5jdXJyZW50VGFyZ2V0LG89ZS5maXJlZEJ5SW5pdFNlYXJjaFRleHQsYT1zKHQpLnZhbCgpLnRyaW0oKTt0aGlzLm9wdGlvbnMudHJpbU9uU2VhcmNoJiZzKHQpLnZhbCgpIT09YSYmcyh0KS52YWwoYSksYT09PXRoaXMuc2VhcmNoVGV4dHx8KHRoaXMuc2VhcmNoVGV4dD1hLHRoaXMub3B0aW9ucy5zZWFyY2hUZXh0PWEsIW8mJih0aGlzLm9wdGlvbnMucGFnZU51bWJlcj0xKSx0aGlzLmluaXRTZWFyY2goKSxvPydjbGllbnQnPT09dGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uJiZ0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTp0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKSx0aGlzLnRyaWdnZXIoJ3NlYXJjaCcsYSkpfX0se2tleTonaW5pdFNlYXJjaCcsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO2lmKCdzZXJ2ZXInIT09dGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uKXtpZih0aGlzLm9wdGlvbnMuY3VzdG9tU2VhcmNoKXJldHVybiB2b2lkKHRoaXMuZGF0YT1yLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucyx0aGlzLm9wdGlvbnMuY3VzdG9tU2VhcmNoLFt0aGlzLm9wdGlvbnMuZGF0YSx0aGlzLnNlYXJjaFRleHRdKSk7dmFyIHQ9dGhpcy5zZWFyY2hUZXh0JiYodGhpcy5vcHRpb25zLmVzY2FwZT9yLmVzY2FwZUhUTUwodGhpcy5zZWFyY2hUZXh0KTp0aGlzLnNlYXJjaFRleHQpLnRvTG93ZXJDYXNlKCksbz1yLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zKT9udWxsOnRoaXMuZmlsdGVyQ29sdW1uczt0aGlzLmRhdGE9bz90aGlzLm9wdGlvbnMuZGF0YS5maWx0ZXIoZnVuY3Rpb24oZSl7Zm9yKHZhciB0IGluIG8paWYoQXJyYXkuaXNBcnJheShvW3RdKSYmLTE9PT1vW3RdLmluZGV4T2YoZVt0XSl8fCFBcnJheS5pc0FycmF5KG9bdF0pJiZlW3RdIT09b1t0XSlyZXR1cm4hMTtyZXR1cm4hMH0pOnRoaXMub3B0aW9ucy5kYXRhLHRoaXMuZGF0YT10P3RoaXMuZGF0YS5maWx0ZXIoZnVuY3Rpb24obyxhKXtmb3IodmFyIGM9MDtjPGUuaGVhZGVyLmZpZWxkcy5sZW5ndGg7YysrKWlmKGUuaGVhZGVyLnNlYXJjaGFibGVzW2NdKXt2YXIgaT1yLmlzTnVtZXJpYyhlLmhlYWRlci5maWVsZHNbY10pP3BhcnNlSW50KGUuaGVhZGVyLmZpZWxkc1tjXSwxMCk6ZS5oZWFkZXIuZmllbGRzW2NdLG49ZS5jb2x1bW5zW2UuZmllbGRzQ29sdW1uc0luZGV4W2ldXSxzPXZvaWQgMDtpZignc3RyaW5nJz09dHlwZW9mIGkpe3M9bztmb3IodmFyIGw9aS5zcGxpdCgnLicpLGQ9MDtkPGwubGVuZ3RoO2QrKyludWxsIT09c1tsW2RdXSYmKHM9c1tsW2RdXSl9ZWxzZSBzPW9baV07aWYobiYmbi5zZWFyY2hGb3JtYXR0ZXImJihzPXIuY2FsY3VsYXRlT2JqZWN0VmFsdWUobixlLmhlYWRlci5mb3JtYXR0ZXJzW2NdLFtzLG8sYV0scykpLCdzdHJpbmcnPT10eXBlb2Ygc3x8J251bWJlcic9PXR5cGVvZiBzKWlmKGUub3B0aW9ucy5zdHJpY3RTZWFyY2gpe2lmKCgnJytzKS50b0xvd2VyQ2FzZSgpPT09dClyZXR1cm4hMDt9ZWxzZSBpZigtMSE9PSgnJytzKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodCkpcmV0dXJuITB9cmV0dXJuITF9KTp0aGlzLmRhdGF9fX0se2tleTonaW5pdFBhZ2luYXRpb24nLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9TWF0aC5yb3VuZCx0PXRoaXMsYT10aGlzLm9wdGlvbnM7aWYoIWEucGFnaW5hdGlvbilyZXR1cm4gdm9pZCB0aGlzLiRwYWdpbmF0aW9uLmhpZGUoKTt0aGlzLiRwYWdpbmF0aW9uLnNob3coKTt2YXIgbz1bXSxuPSExLHM9dm9pZCAwLGk9dm9pZCAwLGw9dm9pZCAwLGQ9dm9pZCAwLGM9dm9pZCAwLHA9dm9pZCAwLGg9dm9pZCAwLGc9dGhpcy5nZXREYXRhKCksdT1hLnBhZ2VMaXN0O2lmKCdzZXJ2ZXInIT09YS5zaWRlUGFnaW5hdGlvbiYmKGEudG90YWxSb3dzPWcubGVuZ3RoKSx0aGlzLnRvdGFsUGFnZXM9MCxhLnRvdGFsUm93cyl7aWYoYS5wYWdlU2l6ZT09PWEuZm9ybWF0QWxsUm93cygpKWEucGFnZVNpemU9YS50b3RhbFJvd3Msbj0hMDtlbHNlIGlmKGEucGFnZVNpemU9PT1hLnRvdGFsUm93cyl7dmFyICQ9J3N0cmluZyc9PXR5cGVvZiBhLnBhZ2VMaXN0P2EucGFnZUxpc3QucmVwbGFjZSgnWycsJycpLnJlcGxhY2UoJ10nLCcnKS5yZXBsYWNlKC8gL2csJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKTphLnBhZ2VMaXN0Oy0xIT09JC5pbmRleE9mKGEuZm9ybWF0QWxsUm93cygpLnRvTG93ZXJDYXNlKCkpJiYobj0hMCl9dGhpcy50b3RhbFBhZ2VzPX5+KChhLnRvdGFsUm93cy0xKS9hLnBhZ2VTaXplKSsxLGEudG90YWxQYWdlcz10aGlzLnRvdGFsUGFnZXN9MDx0aGlzLnRvdGFsUGFnZXMmJmEucGFnZU51bWJlcj50aGlzLnRvdGFsUGFnZXMmJihhLnBhZ2VOdW1iZXI9dGhpcy50b3RhbFBhZ2VzKSx0aGlzLnBhZ2VGcm9tPShhLnBhZ2VOdW1iZXItMSkqYS5wYWdlU2l6ZSsxLHRoaXMucGFnZVRvPWEucGFnZU51bWJlciphLnBhZ2VTaXplLHRoaXMucGFnZVRvPmEudG90YWxSb3dzJiYodGhpcy5wYWdlVG89YS50b3RhbFJvd3MpO3ZhciBmPWEub25seUluZm9QYWdpbmF0aW9uP2EuZm9ybWF0RGV0YWlsUGFnaW5hdGlvbihhLnRvdGFsUm93cyk6YS5mb3JtYXRTaG93aW5nUm93cyh0aGlzLnBhZ2VGcm9tLHRoaXMucGFnZVRvLGEudG90YWxSb3dzKTtpZihvLnB1c2goJzxkaXYgY2xhc3M9XCInK3RoaXMuY29uc3RhbnRzLmNsYXNzZXMucHVsbCsnLScrYS5wYWdpbmF0aW9uRGV0YWlsSEFsaWduKycgcGFnaW5hdGlvbi1kZXRhaWxcIj5cXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicGFnaW5hdGlvbi1pbmZvXCI+XFxuICAgICAgICAnK2YrJ1xcbiAgICAgICAgPC9zcGFuPicpLCFhLm9ubHlJbmZvUGFnaW5hdGlvbil7by5wdXNoKCc8c3BhbiBjbGFzcz1cInBhZ2UtbGlzdFwiPicpO3ZhciBQPVsnPHNwYW4gY2xhc3M9XCInK3RoaXMuY29uc3RhbnRzLmNsYXNzZXMucGFnaW5hdGlvbkRyb3Bkb3duKydcIj5cXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIicrdGhpcy5jb25zdGFudHMuYnV0dG9uc0NsYXNzKycgZHJvcGRvd24tdG9nZ2xlXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIj5cXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwYWdlLXNpemVcIj5cXG4gICAgICAgICAgJysobj9hLmZvcm1hdEFsbFJvd3MoKTphLnBhZ2VTaXplKSsnXFxuICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgJyt0aGlzLmNvbnN0YW50cy5odG1sLmRyb3Bkb3duQ2FyZXQrJ1xcbiAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgJyt0aGlzLmNvbnN0YW50cy5odG1sLnBhZ2VEcm9wZG93blswXV07aWYoJ3N0cmluZyc9PXR5cGVvZiBhLnBhZ2VMaXN0KXt2YXIgQz1hLnBhZ2VMaXN0LnJlcGxhY2UoJ1snLCcnKS5yZXBsYWNlKCddJywnJykucmVwbGFjZSgvIC9nLCcnKS5zcGxpdCgnLCcpO3U9W107Zm9yKHZhciBiPUMsbT1BcnJheS5pc0FycmF5KGIpLHk9MCxfaXRlcmF0b3I5PW0/YjpiW1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgdztpZihtKXtpZih5Pj1iLmxlbmd0aClicmVhazt3PWJbeSsrXX1lbHNle2lmKHk9Yi5uZXh0KCkseS5kb25lKWJyZWFrO3c9eS52YWx1ZX12YXIgaz13O3UucHVzaChrLnRvVXBwZXJDYXNlKCk9PT1hLmZvcm1hdEFsbFJvd3MoKS50b1VwcGVyQ2FzZSgpfHwnVU5MSU1JVEVEJz09PWsudG9VcHBlckNhc2UoKT9hLmZvcm1hdEFsbFJvd3MoKTorayl9fXUuZm9yRWFjaChmdW5jdGlvbihlLG8pe2lmKCFhLnNtYXJ0RGlzcGxheXx8MD09PW98fHVbby0xXTxhLnRvdGFsUm93cyl7dmFyIGk7aT1uP2U9PT1hLmZvcm1hdEFsbFJvd3MoKT90LmNvbnN0YW50cy5jbGFzc2VzLmRyb3Bkb3duQWN0aXZlOicnOmU9PT1hLnBhZ2VTaXplP3QuY29uc3RhbnRzLmNsYXNzZXMuZHJvcGRvd25BY3RpdmU6JycsUC5wdXNoKHIuc3ByaW50Zih0LmNvbnN0YW50cy5odG1sLnBhZ2VEcm9wZG93bkl0ZW0saSxlKSl9fSksUC5wdXNoKHRoaXMuY29uc3RhbnRzLmh0bWwucGFnZURyb3Bkb3duWzFdKyc8L3NwYW4+Jyksby5wdXNoKGEuZm9ybWF0UmVjb3Jkc1BlclBhZ2UoUC5qb2luKCcnKSkpLG8ucHVzaCgnPC9zcGFuPjwvZGl2PicpLG8ucHVzaCgnPGRpdiBjbGFzcz1cIicrdGhpcy5jb25zdGFudHMuY2xhc3Nlcy5wdWxsKyctJythLnBhZ2luYXRpb25IQWxpZ24rJyBwYWdpbmF0aW9uXCI+JyxyLnNwcmludGYodGhpcy5jb25zdGFudHMuaHRtbC5wYWdpbmF0aW9uWzBdLHIuc3ByaW50ZignIHBhZ2luYXRpb24tJXMnLGEuaWNvblNpemUpKSxyLnNwcmludGYodGhpcy5jb25zdGFudHMuaHRtbC5wYWdpbmF0aW9uSXRlbSwnIHBhZ2UtcHJlJyxhLnBhZ2luYXRpb25QcmVUZXh0KSksdGhpcy50b3RhbFBhZ2VzPGEucGFnaW5hdGlvblN1Y2Nlc3NpdmVseVNpemU/KGk9MSxsPXRoaXMudG90YWxQYWdlcyk6KGk9YS5wYWdlTnVtYmVyLWEucGFnaW5hdGlvblBhZ2VzQnlTaWRlLGw9aSsyKmEucGFnaW5hdGlvblBhZ2VzQnlTaWRlKSxhLnBhZ2VOdW1iZXI8YS5wYWdpbmF0aW9uU3VjY2Vzc2l2ZWx5U2l6ZS0xJiYobD1hLnBhZ2luYXRpb25TdWNjZXNzaXZlbHlTaXplKSxsPnRoaXMudG90YWxQYWdlcyYmKGw9dGhpcy50b3RhbFBhZ2VzKSxhLnBhZ2luYXRpb25TdWNjZXNzaXZlbHlTaXplPnRoaXMudG90YWxQYWdlcy1pJiYoaT1pLShhLnBhZ2luYXRpb25TdWNjZXNzaXZlbHlTaXplLSh0aGlzLnRvdGFsUGFnZXMtaSkpKzEpLDE+aSYmKGk9MSksbD50aGlzLnRvdGFsUGFnZXMmJihsPXRoaXMudG90YWxQYWdlcyk7dmFyIHY9ZShhLnBhZ2luYXRpb25QYWdlc0J5U2lkZS8yKSx4PWZ1bmN0aW9uKGUpe3ZhciBvPTE8YXJndW1lbnRzLmxlbmd0aCYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTonJztyZXR1cm4gci5zcHJpbnRmKHQuY29uc3RhbnRzLmh0bWwucGFnaW5hdGlvbkl0ZW0sbysoZT09PWEucGFnZU51bWJlcj8nICcrdC5jb25zdGFudHMuY2xhc3Nlcy5wYWdpbmF0aW9uQWN0aXZlOicnKSxlKX07aWYoMTxpKXt2YXIgVD1hLnBhZ2luYXRpb25QYWdlc0J5U2lkZTtmb3IoVD49aSYmKFQ9aS0xKSxzPTE7czw9VDtzKyspby5wdXNoKHgocykpO2ktMT09PVQrMT8ocz1pLTEsby5wdXNoKHgocykpKTppLTE+VCYmKGktMiphLnBhZ2luYXRpb25QYWdlc0J5U2lkZT5hLnBhZ2luYXRpb25QYWdlc0J5U2lkZSYmYS5wYWdpbmF0aW9uVXNlSW50ZXJtZWRpYXRlPyhzPWUoKGktdikvMit2KSxvLnB1c2goeChzLCcgcGFnZS1pbnRlcm1lZGlhdGUnKSkpOm8ucHVzaChyLnNwcmludGYodGhpcy5jb25zdGFudHMuaHRtbC5wYWdpbmF0aW9uSXRlbSwnIHBhZ2UtZmlyc3Qtc2VwYXJhdG9yIGRpc2FibGVkJywnLi4uJykpKX1mb3Iocz1pO3M8PWw7cysrKW8ucHVzaCh4KHMpKTtpZih0aGlzLnRvdGFsUGFnZXM+bCl7dmFyIEE9dGhpcy50b3RhbFBhZ2VzLShhLnBhZ2luYXRpb25QYWdlc0J5U2lkZS0xKTtmb3IobD49QSYmKEE9bCsxKSxsKzE9PT1BLTE/KHM9bCsxLG8ucHVzaCh4KHMpKSk6QT5sKzEmJih0aGlzLnRvdGFsUGFnZXMtbD4yKmEucGFnaW5hdGlvblBhZ2VzQnlTaWRlJiZhLnBhZ2luYXRpb25Vc2VJbnRlcm1lZGlhdGU/KHM9ZSgodGhpcy50b3RhbFBhZ2VzLXYtbCkvMitsKSxvLnB1c2goeChzLCcgcGFnZS1pbnRlcm1lZGlhdGUnKSkpOm8ucHVzaChyLnNwcmludGYodGhpcy5jb25zdGFudHMuaHRtbC5wYWdpbmF0aW9uSXRlbSwnIHBhZ2UtbGFzdC1zZXBhcmF0b3IgZGlzYWJsZWQnLCcuLi4nKSkpLHM9QTtzPD10aGlzLnRvdGFsUGFnZXM7cysrKW8ucHVzaCh4KHMpKX1vLnB1c2goci5zcHJpbnRmKHRoaXMuY29uc3RhbnRzLmh0bWwucGFnaW5hdGlvbkl0ZW0sJyBwYWdlLW5leHQnLGEucGFnaW5hdGlvbk5leHRUZXh0KSksby5wdXNoKHRoaXMuY29uc3RhbnRzLmh0bWwucGFnaW5hdGlvblsxXSwnPC9kaXY+Jyl9dGhpcy4kcGFnaW5hdGlvbi5odG1sKG8uam9pbignJykpO3ZhciBTPS0xPT09Wydib3R0b20nLCdib3RoJ10uaW5kZXhPZihhLnBhZ2luYXRpb25WQWxpZ24pPycnOicgJyt0aGlzLmNvbnN0YW50cy5jbGFzc2VzLmRyb3B1cDt0aGlzLiRwYWdpbmF0aW9uLmxhc3QoKS5maW5kKCcucGFnZS1saXN0ID4gc3BhbicpLmFkZENsYXNzKFMpLGEub25seUluZm9QYWdpbmF0aW9ufHwoZD10aGlzLiRwYWdpbmF0aW9uLmZpbmQoJy5wYWdlLWxpc3QgYScpLGM9dGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1wcmUnKSxwPXRoaXMuJHBhZ2luYXRpb24uZmluZCgnLnBhZ2UtbmV4dCcpLGg9dGhpcy4kcGFnaW5hdGlvbi5maW5kKCcucGFnZS1pdGVtJykubm90KCcucGFnZS1uZXh0LCAucGFnZS1wcmUnKSxhLnNtYXJ0RGlzcGxheSYmKDE+PXRoaXMudG90YWxQYWdlcyYmdGhpcy4kcGFnaW5hdGlvbi5maW5kKCdkaXYucGFnaW5hdGlvbicpLmhpZGUoKSwoMj51Lmxlbmd0aHx8YS50b3RhbFJvd3M8PXVbMF0pJiZ0aGlzLiRwYWdpbmF0aW9uLmZpbmQoJ3NwYW4ucGFnZS1saXN0JykuaGlkZSgpLHRoaXMuJHBhZ2luYXRpb25bdGhpcy5nZXREYXRhKCkubGVuZ3RoPydzaG93JzonaGlkZSddKCkpLCFhLnBhZ2luYXRpb25Mb29wJiYoMT09PWEucGFnZU51bWJlciYmYy5hZGRDbGFzcygnZGlzYWJsZWQnKSxhLnBhZ2VOdW1iZXI9PT10aGlzLnRvdGFsUGFnZXMmJnAuYWRkQ2xhc3MoJ2Rpc2FibGVkJykpLG4mJihhLnBhZ2VTaXplPWEuZm9ybWF0QWxsUm93cygpKSxkLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKG8pe3JldHVybiB0Lm9uUGFnZUxpc3RDaGFuZ2Uobyl9KSxjLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKG8pe3JldHVybiB0Lm9uUGFnZVByZShvKX0pLHAub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24obyl7cmV0dXJuIHQub25QYWdlTmV4dChvKX0pLGgub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24obyl7cmV0dXJuIHQub25QYWdlTnVtYmVyKG8pfSkpfX0se2tleTondXBkYXRlUGFnaW5hdGlvbicsdmFsdWU6ZnVuY3Rpb24oZSl7ZSYmcyhlLmN1cnJlbnRUYXJnZXQpLmhhc0NsYXNzKCdkaXNhYmxlZCcpfHwoIXRoaXMub3B0aW9ucy5tYWludGFpblNlbGVjdGVkJiZ0aGlzLnJlc2V0Um93cygpLHRoaXMuaW5pdFBhZ2luYXRpb24oKSwnc2VydmVyJz09PXRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbj90aGlzLmluaXRTZXJ2ZXIoKTp0aGlzLmluaXRCb2R5KCksdGhpcy50cmlnZ2VyKCdwYWdlLWNoYW5nZScsdGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIsdGhpcy5vcHRpb25zLnBhZ2VTaXplKSl9fSx7a2V5OidvblBhZ2VMaXN0Q2hhbmdlJyx2YWx1ZTpmdW5jdGlvbihlKXtlLnByZXZlbnREZWZhdWx0KCk7dmFyIHQ9cyhlLmN1cnJlbnRUYXJnZXQpO3JldHVybiB0LnBhcmVudCgpLmFkZENsYXNzKHRoaXMuY29uc3RhbnRzLmNsYXNzZXMuZHJvcGRvd25BY3RpdmUpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3ModGhpcy5jb25zdGFudHMuY2xhc3Nlcy5kcm9wZG93bkFjdGl2ZSksdGhpcy5vcHRpb25zLnBhZ2VTaXplPXQudGV4dCgpLnRvVXBwZXJDYXNlKCk9PT10aGlzLm9wdGlvbnMuZm9ybWF0QWxsUm93cygpLnRvVXBwZXJDYXNlKCk/dGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKTordC50ZXh0KCksdGhpcy4kdG9vbGJhci5maW5kKCcucGFnZS1zaXplJykudGV4dCh0aGlzLm9wdGlvbnMucGFnZVNpemUpLHRoaXMudXBkYXRlUGFnaW5hdGlvbihlKSwhMX19LHtrZXk6J29uUGFnZVByZScsdmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucHJldmVudERlZmF1bHQoKSwwPT10aGlzLm9wdGlvbnMucGFnZU51bWJlci0xP3RoaXMub3B0aW9ucy5wYWdlTnVtYmVyPXRoaXMub3B0aW9ucy50b3RhbFBhZ2VzOnRoaXMub3B0aW9ucy5wYWdlTnVtYmVyLS0sdGhpcy51cGRhdGVQYWdpbmF0aW9uKGUpLCExfX0se2tleTonb25QYWdlTmV4dCcsdmFsdWU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucHJldmVudERlZmF1bHQoKSx0aGlzLm9wdGlvbnMucGFnZU51bWJlcisxPnRoaXMub3B0aW9ucy50b3RhbFBhZ2VzP3RoaXMub3B0aW9ucy5wYWdlTnVtYmVyPTE6dGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIrKyx0aGlzLnVwZGF0ZVBhZ2luYXRpb24oZSksITF9fSx7a2V5OidvblBhZ2VOdW1iZXInLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKGUucHJldmVudERlZmF1bHQoKSx0aGlzLm9wdGlvbnMucGFnZU51bWJlciE9PStzKGUuY3VycmVudFRhcmdldCkudGV4dCgpKXJldHVybiB0aGlzLm9wdGlvbnMucGFnZU51bWJlcj0rcyhlLmN1cnJlbnRUYXJnZXQpLnRleHQoKSx0aGlzLnVwZGF0ZVBhZ2luYXRpb24oZSksITF9fSx7a2V5Oidpbml0Um93Jyx2YWx1ZTpmdW5jdGlvbihlLHQpe3ZhciBvPXRoaXMsaT1bXSxuPXt9LHM9W10sbD0nJyxkPXt9LGM9W107aWYoISgtMTxyLmZpbmRJbmRleCh0aGlzLmhpZGRlblJvd3MsZSkpKXtpZihuPXIuY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhpcy5vcHRpb25zLHRoaXMub3B0aW9ucy5yb3dTdHlsZSxbZSx0XSxuKSxuJiZuLmNzcylmb3IodmFyIHA9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5rZXlzKGUpLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdCxlW3RdXX0pfShuLmNzcyksaD1BcnJheS5pc0FycmF5KHApLGc9MCxfaXRlcmF0b3IxMD1oP3A6cFtTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIHU7aWYoaCl7aWYoZz49cC5sZW5ndGgpYnJlYWs7dT1wW2crK119ZWxzZXtpZihnPXAubmV4dCgpLGcuZG9uZSlicmVhazt1PWcudmFsdWV9dmFyIGY9dSxiPWEoZiwyKSxtPWJbMF0seT1iWzFdO3MucHVzaChtKyc6ICcreSl9aWYoZD1yLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMub3B0aW9ucyx0aGlzLm9wdGlvbnMucm93QXR0cmlidXRlcyxbZSx0XSxkKSxkKWZvcih2YXIgdz1mdW5jdGlvbihlKXtyZXR1cm4gT2JqZWN0LmtleXMoZSkubWFwKGZ1bmN0aW9uKHQpe3JldHVyblt0LGVbdF1dfSl9KGQpLHg9QXJyYXkuaXNBcnJheSh3KSxTPTAsX2l0ZXJhdG9yMTE9eD93OndbU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciAkO2lmKHgpe2lmKFM+PXcubGVuZ3RoKWJyZWFrOyQ9d1tTKytdfWVsc2V7aWYoUz13Lm5leHQoKSxTLmRvbmUpYnJlYWs7JD1TLnZhbHVlfXZhciBQPSQsQz1hKFAsMiksVD1DWzBdLEE9Q1sxXTtjLnB1c2goVCsnPVwiJytyLmVzY2FwZUhUTUwoQSkrJ1wiJyl9aWYoZS5fZGF0YSYmIXIuaXNFbXB0eU9iamVjdChlLl9kYXRhKSlmb3IodmFyIE89ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5rZXlzKGUpLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdCxlW3RdXX0pfShlLl9kYXRhKSxJPUFycmF5LmlzQXJyYXkoTyksUj0wLF9pdGVyYXRvcjEyPUk/TzpPW1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgXztpZihJKXtpZihSPj1PLmxlbmd0aClicmVhaztfPU9bUisrXX1lbHNle2lmKFI9Ty5uZXh0KCksUi5kb25lKWJyZWFrO189Ui52YWx1ZX12YXIgVj1fLEY9YShWLDIpLEI9RlswXSxrPUZbMV07aWYoJ2luZGV4Jz09PUIpcmV0dXJuO2wrPScgZGF0YS0nK0IrJz1cIicraysnXCInfXJldHVybiBpLnB1c2goJzx0cicsci5zcHJpbnRmKCcgJXMnLGMubGVuZ3RoP2Muam9pbignICcpOnZvaWQgMCksci5zcHJpbnRmKCcgaWQ9XCIlc1wiJyxBcnJheS5pc0FycmF5KGUpP3ZvaWQgMDplLl9pZCksci5zcHJpbnRmKCcgY2xhc3M9XCIlc1wiJyxuLmNsYXNzZXN8fChBcnJheS5pc0FycmF5KGUpP3ZvaWQgMDplLl9jbGFzcykpLCcgZGF0YS1pbmRleD1cIicrdCsnXCInLHIuc3ByaW50ZignIGRhdGEtdW5pcXVlaWQ9XCIlc1wiJyxlW3RoaXMub3B0aW9ucy51bmlxdWVJZF0pLHIuc3ByaW50ZignJXMnLGwpLCc+JyksdGhpcy5vcHRpb25zLmNhcmRWaWV3JiZpLnB1c2goJzx0ZCBjb2xzcGFuPVwiJyt0aGlzLmhlYWRlci5maWVsZHMubGVuZ3RoKydcIj48ZGl2IGNsYXNzPVwiY2FyZC12aWV3c1wiPicpLCF0aGlzLm9wdGlvbnMuY2FyZFZpZXcmJnRoaXMub3B0aW9ucy5kZXRhaWxWaWV3JiYoaS5wdXNoKCc8dGQ+Jyksci5jYWxjdWxhdGVPYmplY3RWYWx1ZShudWxsLHRoaXMub3B0aW9ucy5kZXRhaWxGaWx0ZXIsW3QsZV0pJiZpLnB1c2goJ1xcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiZGV0YWlsLWljb25cIiBocmVmPVwiI1wiPlxcbiAgICAgICAgICAgICcrci5zcHJpbnRmKHRoaXMuY29uc3RhbnRzLmh0bWwuaWNvbix0aGlzLm9wdGlvbnMuaWNvbnNQcmVmaXgsdGhpcy5vcHRpb25zLmljb25zLmRldGFpbE9wZW4pKydcXG4gICAgICAgICAgICA8L2E+XFxuICAgICAgICAgICcpLGkucHVzaCgnPC90ZD4nKSksdGhpcy5oZWFkZXIuZmllbGRzLmZvckVhY2goZnVuY3Rpb24obixsKXt2YXIgZD0nJyxwPXIuZ2V0SXRlbUZpZWxkKGUsbixvLm9wdGlvbnMuZXNjYXBlKSxoPScnLGc9JycsdT17fSxmPScnLGI9by5oZWFkZXIuY2xhc3Nlc1tsXSxtPScnLHk9Jycsdz0nJyxrPScnLHY9JycseD1vLmNvbHVtbnNbbF07aWYoKCFvLmZyb21IdG1sfHwndW5kZWZpbmVkJyE9dHlwZW9mIHB8fHguY2hlY2tib3h8fHgucmFkaW8pJiZ4LnZpc2libGUmJighby5vcHRpb25zLmNhcmRWaWV3fHx4LmNhcmRWaXNpYmxlKSl7aWYoeC5lc2NhcGUmJihwPXIuZXNjYXBlSFRNTChwKSkscy5jb25jYXQoW28uaGVhZGVyLnN0eWxlc1tsXV0pLmxlbmd0aCYmKG09JyBzdHlsZT1cIicrcy5jb25jYXQoW28uaGVhZGVyLnN0eWxlc1tsXV0pLmpvaW4oJzsgJykrJ1wiJyksZVsnXycrbisnX2lkJ10mJihmPXIuc3ByaW50ZignIGlkPVwiJXNcIicsZVsnXycrbisnX2lkJ10pKSxlWydfJytuKydfY2xhc3MnXSYmKGI9ci5zcHJpbnRmKCcgY2xhc3M9XCIlc1wiJyxlWydfJytuKydfY2xhc3MnXSkpLGVbJ18nK24rJ19yb3dzcGFuJ10mJih3PXIuc3ByaW50ZignIHJvd3NwYW49XCIlc1wiJyxlWydfJytuKydfcm93c3BhbiddKSksZVsnXycrbisnX2NvbHNwYW4nXSYmKGs9ci5zcHJpbnRmKCcgY29sc3Bhbj1cIiVzXCInLGVbJ18nK24rJ19jb2xzcGFuJ10pKSxlWydfJytuKydfdGl0bGUnXSYmKHY9ci5zcHJpbnRmKCcgdGl0bGU9XCIlc1wiJyxlWydfJytuKydfdGl0bGUnXSkpLHU9ci5jYWxjdWxhdGVPYmplY3RWYWx1ZShvLmhlYWRlcixvLmhlYWRlci5jZWxsU3R5bGVzW2xdLFtwLGUsdCxuXSx1KSx1LmNsYXNzZXMmJihiPScgY2xhc3M9XCInK3UuY2xhc3NlcysnXCInKSx1LmNzcyl7Zm9yKHZhciBTPVtdLCQ9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5rZXlzKGUpLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdCxlW3RdXX0pfSh1LmNzcyksUD1BcnJheS5pc0FycmF5KCQpLEM9MCxfaXRlcmF0b3IxMz1QPyQ6JFtTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIFQ7aWYoUCl7aWYoQz49JC5sZW5ndGgpYnJlYWs7VD0kW0MrK119ZWxzZXtpZihDPSQubmV4dCgpLEMuZG9uZSlicmVhaztUPUMudmFsdWV9dmFyIEE9VCxPPWEoQSwyKSxJPU9bMF0sUj1PWzFdO1MucHVzaChJKyc6ICcrUil9bT0nIHN0eWxlPVwiJytTLmNvbmNhdChvLmhlYWRlci5zdHlsZXNbbF0pLmpvaW4oJzsgJykrJ1wiJ31pZihoPXIuY2FsY3VsYXRlT2JqZWN0VmFsdWUoeCxvLmhlYWRlci5mb3JtYXR0ZXJzW2xdLFtwLGUsdCxuXSxwKSxlWydfJytuKydfZGF0YSddJiYhci5pc0VtcHR5T2JqZWN0KGVbJ18nK24rJ19kYXRhJ10pKWZvcih2YXIgXz1mdW5jdGlvbihlKXtyZXR1cm4gT2JqZWN0LmtleXMoZSkubWFwKGZ1bmN0aW9uKHQpe3JldHVyblt0LGVbdF1dfSl9KGVbJ18nK24rJ19kYXRhJ10pLFY9QXJyYXkuaXNBcnJheShfKSxGPTAsX2l0ZXJhdG9yMTQ9Vj9fOl9bU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciBCO2lmKFYpe2lmKEY+PV8ubGVuZ3RoKWJyZWFrO0I9X1tGKytdfWVsc2V7aWYoRj1fLm5leHQoKSxGLmRvbmUpYnJlYWs7Qj1GLnZhbHVlfXZhciBOPUIsaj1hKE4sMiksSD1qWzBdLEw9alsxXTtpZignaW5kZXgnPT09SClyZXR1cm47eSs9JyBkYXRhLScrSCsnPVwiJytMKydcIid9aWYoeC5jaGVja2JveHx8eC5yYWRpbyl7Zz14LmNoZWNrYm94PydjaGVja2JveCc6ZyxnPXgucmFkaW8/J3JhZGlvJzpnO3ZhciBEPXhbJ2NsYXNzJ118fCcnLGM9ITA9PT1ofHxwfHxoJiZoLmNoZWNrZWQsRT0heC5jaGVja2JveEVuYWJsZWR8fGgmJmguZGlzYWJsZWQ7ZD1bby5vcHRpb25zLmNhcmRWaWV3Pyc8ZGl2IGNsYXNzPVwiY2FyZC12aWV3ICcrRCsnXCI+JzonPHRkIGNsYXNzPVwiYnMtY2hlY2tib3ggJytEKydcIj4nLCc8bGFiZWw+XFxuICAgICAgICAgICAgICA8aW5wdXRcXG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9XCInK3QrJ1wiXFxuICAgICAgICAgICAgICBuYW1lPVwiJytvLm9wdGlvbnMuc2VsZWN0SXRlbU5hbWUrJ1wiXFxuICAgICAgICAgICAgICB0eXBlPVwiJytnKydcIlxcbiAgICAgICAgICAgICAgJytyLnNwcmludGYoJ3ZhbHVlPVwiJXNcIicsZVtvLm9wdGlvbnMuaWRGaWVsZF0pKydcXG4gICAgICAgICAgICAgICcrci5zcHJpbnRmKCdjaGVja2VkPVwiJXNcIicsYz8nY2hlY2tlZCc6dm9pZCAwKSsnXFxuICAgICAgICAgICAgICAnK3Iuc3ByaW50ZignZGlzYWJsZWQ9XCIlc1wiJyxFPydkaXNhYmxlZCc6dm9pZCAwKSsnIC8+XFxuICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XFxuICAgICAgICAgICAgICA8L2xhYmVsPicsby5oZWFkZXIuZm9ybWF0dGVyc1tsXSYmJ3N0cmluZyc9PXR5cGVvZiBoP2g6Jycsby5vcHRpb25zLmNhcmRWaWV3Pyc8L2Rpdj4nOic8L3RkPiddLmpvaW4oJycpLGVbby5oZWFkZXIuc3RhdGVGaWVsZF09ITA9PT1ofHwhIXB8fGgmJmguY2hlY2tlZH1lbHNlIGlmKGg9J3VuZGVmaW5lZCc9PXR5cGVvZiBofHxudWxsPT09aD9vLm9wdGlvbnMudW5kZWZpbmVkVGV4dDpoLG8ub3B0aW9ucy5jYXJkVmlldyl7dmFyIFU9by5vcHRpb25zLnNob3dIZWFkZXI/JzxzcGFuIGNsYXNzPVwiY2FyZC12aWV3LXRpdGxlXCInK20rJz4nK3IuZ2V0RmllbGRUaXRsZShvLmNvbHVtbnMsbikrJzwvc3Bhbj4nOicnO2Q9JzxkaXYgY2xhc3M9XCJjYXJkLXZpZXdcIj4nK1UrJzxzcGFuIGNsYXNzPVwiY2FyZC12aWV3LXZhbHVlXCI+JytoKyc8L3NwYW4+PC9kaXY+JyxvLm9wdGlvbnMuc21hcnREaXNwbGF5JiYnJz09PWgmJihkPSc8ZGl2IGNsYXNzPVwiY2FyZC12aWV3XCI+PC9kaXY+Jyl9ZWxzZSBkPSc8dGQnK2YrYittK3krdytrK3YrJz4nK2grJzwvdGQ+JztpLnB1c2goZCl9fSksdGhpcy5vcHRpb25zLmNhcmRWaWV3JiZpLnB1c2goJzwvZGl2PjwvdGQ+JyksaS5wdXNoKCc8L3RyPicpLGkuam9pbignJyl9fX0se2tleTonaW5pdEJvZHknLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMsbz10aGlzLmdldERhdGEoKTt0aGlzLnRyaWdnZXIoJ3ByZS1ib2R5JyxvKSx0aGlzLiRib2R5PXRoaXMuJGVsLmZpbmQoJz50Ym9keScpLHRoaXMuJGJvZHkubGVuZ3RofHwodGhpcy4kYm9keT1zKCc8dGJvZHk+PC90Ym9keT4nKS5hcHBlbmRUbyh0aGlzLiRlbCkpLHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uJiYnc2VydmVyJyE9PXRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbnx8KHRoaXMucGFnZUZyb209MSx0aGlzLnBhZ2VUbz1vLmxlbmd0aCk7Zm9yKHZhciBuPXMoZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKSxsPSExLGQ9dGhpcy5wYWdlRnJvbS0xO2Q8dGhpcy5wYWdlVG87ZCsrKXt2YXIgaT1vW2RdLGM9dGhpcy5pbml0Um93KGksZCxvLG4pO2w9bHx8ISFjLGMmJidzdHJpbmcnPT10eXBlb2YgYyYmbi5hcHBlbmQoYyl9bD90aGlzLiRib2R5Lmh0bWwobik6dGhpcy4kYm9keS5odG1sKCc8dHIgY2xhc3M9XCJuby1yZWNvcmRzLWZvdW5kXCI+JytyLnNwcmludGYoJzx0ZCBjb2xzcGFuPVwiJXNcIj4lczwvdGQ+Jyx0aGlzLiRoZWFkZXIuZmluZCgndGgnKS5sZW5ndGgsdGhpcy5vcHRpb25zLmZvcm1hdE5vTWF0Y2hlcygpKSsnPC90cj4nKSxlfHx0aGlzLnNjcm9sbFRvKDApLHRoaXMuJGJvZHkuZmluZCgnPiB0cltkYXRhLWluZGV4XSA+IHRkJykub2ZmKCdjbGljayBkYmxjbGljaycpLm9uKCdjbGljayBkYmxjbGljaycsZnVuY3Rpb24oZSl7dmFyIG89ZS5jdXJyZW50VGFyZ2V0LGE9ZS50eXBlLGk9ZS50YXJnZXQsbj1zKG8pLGw9bi5wYXJlbnQoKSxkPXMoaSkucGFyZW50cygnLmNhcmQtdmlld3MnKS5jaGlsZHJlbigpLGM9cyhpKS5wYXJlbnRzKCcuY2FyZC12aWV3JykscD10LmRhdGFbbC5kYXRhKCdpbmRleCcpXSxoPXQub3B0aW9ucy5jYXJkVmlldz9kLmluZGV4KGMpOm5bMF0uY2VsbEluZGV4LGc9dC5nZXRWaXNpYmxlRmllbGRzKCksdT1nW3Qub3B0aW9ucy5kZXRhaWxWaWV3JiYhdC5vcHRpb25zLmNhcmRWaWV3P2gtMTpoXSxmPXQuY29sdW1uc1t0LmZpZWxkc0NvbHVtbnNJbmRleFt1XV0sYj1yLmdldEl0ZW1GaWVsZChwLHUsdC5vcHRpb25zLmVzY2FwZSk7aWYoIW4uZmluZCgnLmRldGFpbC1pY29uJykubGVuZ3RoJiYodC50cmlnZ2VyKCdjbGljayc9PT1hPydjbGljay1jZWxsJzonZGJsLWNsaWNrLWNlbGwnLHUsYixwLG4pLHQudHJpZ2dlcignY2xpY2snPT09YT8nY2xpY2stcm93JzonZGJsLWNsaWNrLXJvdycscCxsLHUpLCdjbGljayc9PT1hJiZ0Lm9wdGlvbnMuY2xpY2tUb1NlbGVjdCYmZi5jbGlja1RvU2VsZWN0JiYhci5jYWxjdWxhdGVPYmplY3RWYWx1ZSh0Lm9wdGlvbnMsdC5vcHRpb25zLmlnbm9yZUNsaWNrVG9TZWxlY3RPbixbaV0pKSl7dmFyIG09bC5maW5kKHIuc3ByaW50ZignW25hbWU9XCIlc1wiXScsdC5vcHRpb25zLnNlbGVjdEl0ZW1OYW1lKSk7bS5sZW5ndGgmJm1bMF0uY2xpY2soKX19KSx0aGlzLiRib2R5LmZpbmQoJz4gdHJbZGF0YS1pbmRleF0gPiB0ZCA+IC5kZXRhaWwtaWNvbicpLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQoKTt2YXIgZT1zKGEuY3VycmVudFRhcmdldCksaT1lLnBhcmVudCgpLnBhcmVudCgpLG49aS5kYXRhKCdpbmRleCcpLGw9b1tuXTtpZihpLm5leHQoKS5pcygndHIuZGV0YWlsLXZpZXcnKSllLmh0bWwoci5zcHJpbnRmKHQuY29uc3RhbnRzLmh0bWwuaWNvbix0Lm9wdGlvbnMuaWNvbnNQcmVmaXgsdC5vcHRpb25zLmljb25zLmRldGFpbE9wZW4pKSx0LnRyaWdnZXIoJ2NvbGxhcHNlLXJvdycsbixsLGkubmV4dCgpKSxpLm5leHQoKS5yZW1vdmUoKTtlbHNle2UuaHRtbChyLnNwcmludGYodC5jb25zdGFudHMuaHRtbC5pY29uLHQub3B0aW9ucy5pY29uc1ByZWZpeCx0Lm9wdGlvbnMuaWNvbnMuZGV0YWlsQ2xvc2UpKSxpLmFmdGVyKHIuc3ByaW50ZignPHRyIGNsYXNzPVwiZGV0YWlsLXZpZXdcIj48dGQgY29sc3Bhbj1cIiVzXCI+PC90ZD48L3RyPicsaS5jaGlsZHJlbigndGQnKS5sZW5ndGgpKTt2YXIgZD1pLm5leHQoKS5maW5kKCd0ZCcpLGM9ci5jYWxjdWxhdGVPYmplY3RWYWx1ZSh0Lm9wdGlvbnMsdC5vcHRpb25zLmRldGFpbEZvcm1hdHRlcixbbixsLGRdLCcnKTsxPT09ZC5sZW5ndGgmJmQuYXBwZW5kKGMpLHQudHJpZ2dlcignZXhwYW5kLXJvdycsbixsLGQpfXJldHVybiB0LnJlc2V0VmlldygpLCExfSksdGhpcy4kc2VsZWN0SXRlbT10aGlzLiRib2R5LmZpbmQoci5zcHJpbnRmKCdbbmFtZT1cIiVzXCJdJyx0aGlzLm9wdGlvbnMuc2VsZWN0SXRlbU5hbWUpKSx0aGlzLiRzZWxlY3RJdGVtLm9mZignY2xpY2snKS5vbignY2xpY2snLGZ1bmN0aW9uKG8pe28uc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7dmFyIGU9cyhvLmN1cnJlbnRUYXJnZXQpO3QuY2hlY2tfKGUucHJvcCgnY2hlY2tlZCcpLGUuZGF0YSgnaW5kZXgnKSl9KSx0aGlzLmhlYWRlci5ldmVudHMuZm9yRWFjaChmdW5jdGlvbihlLG8pe3ZhciBpPWU7aWYoaSl7J3N0cmluZyc9PXR5cGVvZiBpJiYoaT1yLmNhbGN1bGF0ZU9iamVjdFZhbHVlKG51bGwsaSkpO3ZhciBuPXQuaGVhZGVyLmZpZWxkc1tvXSxsPXQuZ2V0VmlzaWJsZUZpZWxkcygpLmluZGV4T2Yobik7aWYoLTEhPT1sKXt0Lm9wdGlvbnMuZGV0YWlsVmlldyYmIXQub3B0aW9ucy5jYXJkVmlldyYmKGwrPTEpO2Zvcih2YXIgZD1mdW5jdGlvbigpe2lmKHApe2lmKGg+PWMubGVuZ3RoKXJldHVybidicmVhayc7Zz1jW2grK119ZWxzZXtpZihoPWMubmV4dCgpLGguZG9uZSlyZXR1cm4nYnJlYWsnO2c9aC52YWx1ZX12YXIgZT1nLG89YShlLDIpLHI9b1swXSxpPW9bMV07dC4kYm9keS5maW5kKCc+dHI6bm90KC5uby1yZWNvcmRzLWZvdW5kKScpLmVhY2goZnVuY3Rpb24oZSxvKXt2YXIgYT1zKG8pLGQ9YS5maW5kKHQub3B0aW9ucy5jYXJkVmlldz8nLmNhcmQtdmlldyc6J3RkJykuZXEobCksYz1yLmluZGV4T2YoJyAnKSxwPXIuc3Vic3RyaW5nKDAsYyksaD1yLnN1YnN0cmluZyhjKzEpO2QuZmluZChoKS5vZmYocCkub24ocCxmdW5jdGlvbihvKXt2YXIgZT1hLmRhdGEoJ2luZGV4Jykscz10LmRhdGFbZV0sbD1zW25dO2kuYXBwbHkodCxbbyxsLHMsZV0pfSl9KX0sYz1mdW5jdGlvbihlKXtyZXR1cm4gT2JqZWN0LmtleXMoZSkubWFwKGZ1bmN0aW9uKHQpe3JldHVyblt0LGVbdF1dfSl9KGkpLHA9QXJyYXkuaXNBcnJheShjKSxoPTAsX2l0ZXJhdG9yMTU9cD9jOmNbU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciBnLHU9ZCgpO2lmKCdicmVhayc9PT11KWJyZWFrfX19fSksdGhpcy51cGRhdGVTZWxlY3RlZCgpLHRoaXMucmVzZXRWaWV3KCksdGhpcy50cmlnZ2VyKCdwb3N0LWJvZHknLG8pfX0se2tleTonaW5pdFNlcnZlcicsdmFsdWU6ZnVuY3Rpb24oZSx0LG8pe3ZhciBhPXRoaXMsaT17fSxuPXRoaXMuaGVhZGVyLmZpZWxkcy5pbmRleE9mKHRoaXMub3B0aW9ucy5zb3J0TmFtZSksbD17c2VhcmNoVGV4dDp0aGlzLnNlYXJjaFRleHQsc29ydE5hbWU6dGhpcy5vcHRpb25zLnNvcnROYW1lLHNvcnRPcmRlcjp0aGlzLm9wdGlvbnMuc29ydE9yZGVyfTtpZigodGhpcy5oZWFkZXIuc29ydE5hbWVzW25dJiYobC5zb3J0TmFtZT10aGlzLmhlYWRlci5zb3J0TmFtZXNbbl0pLHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uJiYnc2VydmVyJz09PXRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiYmKGwucGFnZVNpemU9dGhpcy5vcHRpb25zLnBhZ2VTaXplPT09dGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKT90aGlzLm9wdGlvbnMudG90YWxSb3dzOnRoaXMub3B0aW9ucy5wYWdlU2l6ZSxsLnBhZ2VOdW1iZXI9dGhpcy5vcHRpb25zLnBhZ2VOdW1iZXIpLG98fHRoaXMub3B0aW9ucy51cmx8fHRoaXMub3B0aW9ucy5hamF4KSYmKCdsaW1pdCc9PT10aGlzLm9wdGlvbnMucXVlcnlQYXJhbXNUeXBlJiYobD17c2VhcmNoOmwuc2VhcmNoVGV4dCxzb3J0Omwuc29ydE5hbWUsb3JkZXI6bC5zb3J0T3JkZXJ9LHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uJiYnc2VydmVyJz09PXRoaXMub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiYmKGwub2Zmc2V0PXRoaXMub3B0aW9ucy5wYWdlU2l6ZT09PXRoaXMub3B0aW9ucy5mb3JtYXRBbGxSb3dzKCk/MDp0aGlzLm9wdGlvbnMucGFnZVNpemUqKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyLTEpLGwubGltaXQ9dGhpcy5vcHRpb25zLnBhZ2VTaXplPT09dGhpcy5vcHRpb25zLmZvcm1hdEFsbFJvd3MoKT90aGlzLm9wdGlvbnMudG90YWxSb3dzOnRoaXMub3B0aW9ucy5wYWdlU2l6ZSwwPT09bC5saW1pdCYmZGVsZXRlIGwubGltaXQpKSxyLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbCl8fChsLmZpbHRlcj1KU09OLnN0cmluZ2lmeSh0aGlzLmZpbHRlckNvbHVtbnNQYXJ0aWFsLG51bGwpKSxpPXIuY2FsY3VsYXRlT2JqZWN0VmFsdWUodGhpcy5vcHRpb25zLHRoaXMub3B0aW9ucy5xdWVyeVBhcmFtcyxbbF0saSkscy5leHRlbmQoaSx0fHx7fSksITEhPT1pKSl7ZXx8dGhpcy5zaG93TG9hZGluZygpO3ZhciBkPXMuZXh0ZW5kKHt9LHIuY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCx0aGlzLm9wdGlvbnMuYWpheE9wdGlvbnMpLHt0eXBlOnRoaXMub3B0aW9ucy5tZXRob2QsdXJsOm98fHRoaXMub3B0aW9ucy51cmwsZGF0YTonYXBwbGljYXRpb24vanNvbic9PT10aGlzLm9wdGlvbnMuY29udGVudFR5cGUmJidwb3N0Jz09PXRoaXMub3B0aW9ucy5tZXRob2Q/SlNPTi5zdHJpbmdpZnkoaSk6aSxjYWNoZTp0aGlzLm9wdGlvbnMuY2FjaGUsY29udGVudFR5cGU6dGhpcy5vcHRpb25zLmNvbnRlbnRUeXBlLGRhdGFUeXBlOnRoaXMub3B0aW9ucy5kYXRhVHlwZSxzdWNjZXNzOmZ1bmN0aW9uKHQpe3ZhciBvPXIuY2FsY3VsYXRlT2JqZWN0VmFsdWUoYS5vcHRpb25zLGEub3B0aW9ucy5yZXNwb25zZUhhbmRsZXIsW3RdLHQpO2EubG9hZChvKSxhLnRyaWdnZXIoJ2xvYWQtc3VjY2VzcycsbyksZXx8YS5oaWRlTG9hZGluZygpfSxlcnJvcjpmdW5jdGlvbih0KXt2YXIgbz1bXTsnc2VydmVyJz09PWEub3B0aW9ucy5zaWRlUGFnaW5hdGlvbiYmKG89e30sb1thLm9wdGlvbnMudG90YWxGaWVsZF09MCxvW2Eub3B0aW9ucy5kYXRhRmllbGRdPVtdKSxhLmxvYWQobyksYS50cmlnZ2VyKCdsb2FkLWVycm9yJyx0LnN0YXR1cyx0KSxlfHxhLiR0YWJsZUxvYWRpbmcuaGlkZSgpfX0pO3JldHVybiB0aGlzLm9wdGlvbnMuYWpheD9yLmNhbGN1bGF0ZU9iamVjdFZhbHVlKHRoaXMsdGhpcy5vcHRpb25zLmFqYXgsW2RdLG51bGwpOih0aGlzLl94aHImJjQhPT10aGlzLl94aHIucmVhZHlTdGF0ZSYmdGhpcy5feGhyLmFib3J0KCksdGhpcy5feGhyPXMuYWpheChkKSksaX19fSx7a2V5Oidpbml0U2VhcmNoVGV4dCcsdmFsdWU6ZnVuY3Rpb24oKXtpZih0aGlzLm9wdGlvbnMuc2VhcmNoJiYodGhpcy5zZWFyY2hUZXh0PScnLCcnIT09dGhpcy5vcHRpb25zLnNlYXJjaFRleHQpKXt2YXIgZT10aGlzLiR0b29sYmFyLmZpbmQoJy5zZWFyY2ggaW5wdXQnKTtlLnZhbCh0aGlzLm9wdGlvbnMuc2VhcmNoVGV4dCksdGhpcy5vblNlYXJjaCh7Y3VycmVudFRhcmdldDplLGZpcmVkQnlJbml0U2VhcmNoVGV4dDohMH0pfX19LHtrZXk6J2dldENhcmV0Jyx2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7dGhpcy4kaGVhZGVyLmZpbmQoJ3RoJykuZWFjaChmdW5jdGlvbih0LG8pe3MobykuZmluZCgnLnNvcnRhYmxlJykucmVtb3ZlQ2xhc3MoJ2Rlc2MgYXNjJykuYWRkQ2xhc3MocyhvKS5kYXRhKCdmaWVsZCcpPT09ZS5vcHRpb25zLnNvcnROYW1lP2Uub3B0aW9ucy5zb3J0T3JkZXI6J2JvdGgnKX0pfX0se2tleTondXBkYXRlU2VsZWN0ZWQnLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJykubGVuZ3RoJiZ0aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKS5sZW5ndGg9PT10aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmVuYWJsZWQnKS5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoO3RoaXMuJHNlbGVjdEFsbC5hZGQodGhpcy4kc2VsZWN0QWxsXykucHJvcCgnY2hlY2tlZCcsZSksdGhpcy4kc2VsZWN0SXRlbS5lYWNoKGZ1bmN0aW9uKGUsdCl7cyh0KS5jbG9zZXN0KCd0cicpW3ModCkucHJvcCgnY2hlY2tlZCcpPydhZGRDbGFzcyc6J3JlbW92ZUNsYXNzJ10oJ3NlbGVjdGVkJyl9KX19LHtrZXk6J3VwZGF0ZVJvd3MnLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpczt0aGlzLiRzZWxlY3RJdGVtLmVhY2goZnVuY3Rpb24odCxvKXtlLmRhdGFbcyhvKS5kYXRhKCdpbmRleCcpXVtlLmhlYWRlci5zdGF0ZUZpZWxkXT1zKG8pLnByb3AoJ2NoZWNrZWQnKX0pfX0se2tleToncmVzZXRSb3dzJyx2YWx1ZTpmdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLmRhdGEsdD1BcnJheS5pc0FycmF5KGUpLG89MCxfaXRlcmF0b3IxNj10P2U6ZVtTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIGE7aWYodCl7aWYobz49ZS5sZW5ndGgpYnJlYWs7YT1lW28rK119ZWxzZXtpZihvPWUubmV4dCgpLG8uZG9uZSlicmVhazthPW8udmFsdWV9dmFyIGk9YTt0aGlzLiRzZWxlY3RBbGwucHJvcCgnY2hlY2tlZCcsITEpLHRoaXMuJHNlbGVjdEl0ZW0ucHJvcCgnY2hlY2tlZCcsITEpLHRoaXMuaGVhZGVyLnN0YXRlRmllbGQmJihpW3RoaXMuaGVhZGVyLnN0YXRlRmllbGRdPSExKX10aGlzLmluaXRIaWRkZW5Sb3dzKCl9fSx7a2V5Oid0cmlnZ2VyJyx2YWx1ZTpmdW5jdGlvbihlKXtmb3IodmFyIG8sYT1lKycuYnMudGFibGUnLGk9YXJndW1lbnRzLmxlbmd0aCxuPUFycmF5KDE8aT9pLTE6MCksbD0xO2w8aTtsKyspbltsLTFdPWFyZ3VtZW50c1tsXTsobz10aGlzLm9wdGlvbnMpW3QuRVZFTlRTW2FdXS5hcHBseShvLG4pLHRoaXMuJGVsLnRyaWdnZXIocy5FdmVudChhKSxuKSx0aGlzLm9wdGlvbnMub25BbGwoYSxuKSx0aGlzLiRlbC50cmlnZ2VyKHMuRXZlbnQoJ2FsbC5icy50YWJsZScpLFthLG5dKX19LHtrZXk6J3Jlc2V0SGVhZGVyJyx2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkXyksdGhpcy50aW1lb3V0SWRfPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtyZXR1cm4gZS5maXRIZWFkZXIoKX0sdGhpcy4kZWwuaXMoJzpoaWRkZW4nKT8xMDA6MCl9fSx7a2V5OidmaXRIZWFkZXInLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLiRlbC5pcygnOmhpZGRlbicpKXJldHVybiB2b2lkKHRoaXMudGltZW91dElkXz1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIGUuZml0SGVhZGVyKCl9LDEwMCkpO3ZhciB0PXRoaXMuJHRhYmxlQm9keS5nZXQoMCksbz10LnNjcm9sbFdpZHRoPnQuY2xpZW50V2lkdGgmJnQuc2Nyb2xsSGVpZ2h0PnQuY2xpZW50SGVpZ2h0K3RoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpP3IuZ2V0U2Nyb2xsQmFyV2lkdGgoKTowO3RoaXMuJGVsLmNzcygnbWFyZ2luLXRvcCcsLXRoaXMuJGhlYWRlci5vdXRlckhlaWdodCgpKTt2YXIgYT1zKCc6Zm9jdXMnKTtpZigwPGEubGVuZ3RoKXt2YXIgYz1hLnBhcmVudHMoJ3RoJyk7aWYoMDxjLmxlbmd0aCl7dmFyIHA9Yy5hdHRyKCdkYXRhLWZpZWxkJyk7aWYodm9pZCAwIT09cCl7dmFyIGg9dGhpcy4kaGVhZGVyLmZpbmQoJ1tkYXRhLWZpZWxkPVxcJycrcCsnXFwnXScpOzA8aC5sZW5ndGgmJmguZmluZCgnOmlucHV0JykuYWRkQ2xhc3MoJ2ZvY3VzLXRlbXAnKX19fXRoaXMuJGhlYWRlcl89dGhpcy4kaGVhZGVyLmNsb25lKCEwLCEwKSx0aGlzLiRzZWxlY3RBbGxfPXRoaXMuJGhlYWRlcl8uZmluZCgnW25hbWU9XCJidFNlbGVjdEFsbFwiXScpLHRoaXMuJHRhYmxlSGVhZGVyLmNzcygnbWFyZ2luLXJpZ2h0JyxvKS5maW5kKCd0YWJsZScpLmNzcygnd2lkdGgnLHRoaXMuJGVsLm91dGVyV2lkdGgoKSkuaHRtbCgnJykuYXR0cignY2xhc3MnLHRoaXMuJGVsLmF0dHIoJ2NsYXNzJykpLmFwcGVuZCh0aGlzLiRoZWFkZXJfKSx0aGlzLiR0YWJsZUxvYWRpbmcuY3NzKCd3aWR0aCcsdGhpcy4kZWwub3V0ZXJXaWR0aCgpKTt2YXIgaT1zKCcuZm9jdXMtdGVtcDp2aXNpYmxlOmVxKDApJyk7MDxpLmxlbmd0aCYmKGkuZm9jdXMoKSx0aGlzLiRoZWFkZXIuZmluZCgnLmZvY3VzLXRlbXAnKS5yZW1vdmVDbGFzcygnZm9jdXMtdGVtcCcpKSx0aGlzLiRoZWFkZXIuZmluZCgndGhbZGF0YS1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uKHQsbyl7ZS4kaGVhZGVyXy5maW5kKHIuc3ByaW50ZigndGhbZGF0YS1maWVsZD1cIiVzXCJdJyxzKG8pLmRhdGEoJ2ZpZWxkJykpKS5kYXRhKHMobykuZGF0YSgpKX0pO2Zvcih2YXIgbj10aGlzLmdldFZpc2libGVGaWVsZHMoKSxsPXRoaXMuJGhlYWRlcl8uZmluZCgndGgnKSxkPXRoaXMuJGJvZHkuZmluZCgnPnRyOmZpcnN0LWNoaWxkOm5vdCgubm8tcmVjb3Jkcy1mb3VuZCknKTtkLmxlbmd0aCYmZC5maW5kKCc+dGRbY29sc3Bhbl06bm90KFtjb2xzcGFuPVwiMVwiXSknKS5sZW5ndGg7KWQ9ZC5uZXh0KCk7ZC5maW5kKCc+IConKS5lYWNoKGZ1bmN0aW9uKHQsbyl7dmFyIGE9cyhvKSxpPXQ7aWYoZS5vcHRpb25zLmRldGFpbFZpZXcmJiFlLm9wdGlvbnMuY2FyZFZpZXcpe2lmKDA9PT10KXt2YXIgZD1sLmZpbHRlcignLmRldGFpbCcpLGM9ZC53aWR0aCgpLWQuZmluZCgnLmZodC1jZWxsJykud2lkdGgoKTtkLmZpbmQoJy5maHQtY2VsbCcpLndpZHRoKGEuaW5uZXJXaWR0aCgpLWMpfWk9dC0xfWlmKC0xIT09aSl7dmFyIHA9ZS4kaGVhZGVyXy5maW5kKHIuc3ByaW50ZigndGhbZGF0YS1maWVsZD1cIiVzXCJdJyxuW2ldKSk7MTxwLmxlbmd0aCYmKHA9cyhsW2FbMF0uY2VsbEluZGV4XSkpO3ZhciBoPXAud2lkdGgoKS1wLmZpbmQoJy5maHQtY2VsbCcpLndpZHRoKCk7cC5maW5kKCcuZmh0LWNlbGwnKS53aWR0aChhLmlubmVyV2lkdGgoKS1oKX19KSx0aGlzLmhvcml6b250YWxTY3JvbGwoKSx0aGlzLnRyaWdnZXIoJ3Bvc3QtaGVhZGVyJyl9fSx7a2V5OidyZXNldEZvb3RlcicsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmdldERhdGEoKSx0PVtdO2lmKHRoaXMub3B0aW9ucy5zaG93Rm9vdGVyJiYhdGhpcy5vcHRpb25zLmNhcmRWaWV3KXshdGhpcy5vcHRpb25zLmNhcmRWaWV3JiZ0aGlzLm9wdGlvbnMuZGV0YWlsVmlldyYmdC5wdXNoKCc8dGggY2xhc3M9XCJkZXRhaWxcIj48ZGl2IGNsYXNzPVwidGgtaW5uZXJcIj48L2Rpdj48ZGl2IGNsYXNzPVwiZmh0LWNlbGxcIj48L2Rpdj48L3RoPicpO2Zvcih2YXIgbz10aGlzLmNvbHVtbnMsaT1BcnJheS5pc0FycmF5KG8pLG49MCxfaXRlcmF0b3IxNz1pP286b1tTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIHM7aWYoaSl7aWYobj49by5sZW5ndGgpYnJlYWs7cz1vW24rK119ZWxzZXtpZihuPW8ubmV4dCgpLG4uZG9uZSlicmVhaztzPW4udmFsdWV9dmFyIGw9cyxkPScnLGM9JycscD1bXSxoPXt9LGc9ci5zcHJpbnRmKCcgY2xhc3M9XCIlc1wiJyxsWydjbGFzcyddKTtpZihsLnZpc2libGUpe2lmKHRoaXMub3B0aW9ucy5jYXJkVmlldyYmIWwuY2FyZFZpc2libGUpcmV0dXJuO2lmKGQ9ci5zcHJpbnRmKCd0ZXh0LWFsaWduOiAlczsgJyxsLmZhbGlnbj9sLmZhbGlnbjpsLmFsaWduKSxjPXIuc3ByaW50ZigndmVydGljYWwtYWxpZ246ICVzOyAnLGwudmFsaWduKSxoPXIuY2FsY3VsYXRlT2JqZWN0VmFsdWUobnVsbCx0aGlzLm9wdGlvbnMuZm9vdGVyU3R5bGUsW2xdKSxoJiZoLmNzcylmb3IodmFyIHU9ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5rZXlzKGUpLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdCxlW3RdXX0pfShoLmNzcyksZj1BcnJheS5pc0FycmF5KHUpLGI9MCxfaXRlcmF0b3IxOD1mP3U6dVtTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIG07aWYoZil7aWYoYj49dS5sZW5ndGgpYnJlYWs7bT11W2IrK119ZWxzZXtpZihiPXUubmV4dCgpLGIuZG9uZSlicmVhazttPWIudmFsdWV9dmFyIHk9bSx3PWEoeSwyKSxrPXdbMF0sdj13WzFdO3AucHVzaChrKyc6ICcrdil9aCYmaC5jbGFzc2VzJiYoZz1yLnNwcmludGYoJyBjbGFzcz1cIiVzXCInLGxbJ2NsYXNzJ10/W2xbJ2NsYXNzJ10saC5jbGFzc2VzXS5qb2luKCcgJyk6aC5jbGFzc2VzKSksdC5wdXNoKCc8dGgnLGcsci5zcHJpbnRmKCcgc3R5bGU9XCIlc1wiJyxkK2MrcC5jb25jYXQoKS5qb2luKCc7ICcpKSwnPicpLHQucHVzaCgnPGRpdiBjbGFzcz1cInRoLWlubmVyXCI+JyksdC5wdXNoKHIuY2FsY3VsYXRlT2JqZWN0VmFsdWUobCxsLmZvb3RlckZvcm1hdHRlcixbZV0sJycpKSx0LnB1c2goJzwvZGl2PicpLHQucHVzaCgnPGRpdiBjbGFzcz1cImZodC1jZWxsXCI+PC9kaXY+JyksdC5wdXNoKCc8L2Rpdj4nKSx0LnB1c2goJzwvdGg+Jyl9fXRoaXMuJHRhYmxlRm9vdGVyLmZpbmQoJ3RyJykuaHRtbCh0LmpvaW4oJycpKSx0aGlzLiR0YWJsZUZvb3Rlci5zaG93KCksdGhpcy5maXRGb290ZXIoKX19fSx7a2V5OidmaXRGb290ZXInLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztpZih0aGlzLiRlbC5pcygnOmhpZGRlbicpKXJldHVybiB2b2lkIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtyZXR1cm4gZS5maXRGb290ZXIoKX0sMTAwKTt2YXIgdD10aGlzLiR0YWJsZUJvZHkuZ2V0KDApLG89dC5zY3JvbGxXaWR0aD50LmNsaWVudFdpZHRoJiZ0LnNjcm9sbEhlaWdodD50LmNsaWVudEhlaWdodCt0aGlzLiRoZWFkZXIub3V0ZXJIZWlnaHQoKT9yLmdldFNjcm9sbEJhcldpZHRoKCk6MDt0aGlzLiR0YWJsZUZvb3Rlci5jc3MoJ21hcmdpbi1yaWdodCcsbykuZmluZCgndGFibGUnKS5jc3MoJ3dpZHRoJyx0aGlzLiRlbC5vdXRlcldpZHRoKCkpLmF0dHIoJ2NsYXNzJyx0aGlzLiRlbC5hdHRyKCdjbGFzcycpKTtmb3IodmFyIGE9dGhpcy5nZXRWaXNpYmxlRmllbGRzKCksbj10aGlzLiR0YWJsZUZvb3Rlci5maW5kKCd0aCcpLGk9dGhpcy4kYm9keS5maW5kKCc+dHI6Zmlyc3QtY2hpbGQ6bm90KC5uby1yZWNvcmRzLWZvdW5kKScpO2kubGVuZ3RoJiZpLmZpbmQoJz50ZFtjb2xzcGFuXTpub3QoW2NvbHNwYW49XCIxXCJdKScpLmxlbmd0aDspaT1pLm5leHQoKTtpLmZpbmQoJz4gKicpLmVhY2goZnVuY3Rpb24odCxvKXt2YXIgYT1zKG8pLGk9dDtpZihlLm9wdGlvbnMuZGV0YWlsVmlldyYmIWUub3B0aW9ucy5jYXJkVmlldyl7aWYoMD09PXQpe3ZhciBsPW4uZmlsdGVyKCcuZGV0YWlsJykscj1sLndpZHRoKCktbC5maW5kKCcuZmh0LWNlbGwnKS53aWR0aCgpO2wuZmluZCgnLmZodC1jZWxsJykud2lkdGgoYS5pbm5lcldpZHRoKCktcil9aT10LTF9aWYoLTEhPT1pKXt2YXIgZD1uLmVxKHQpLGM9ZC53aWR0aCgpLWQuZmluZCgnLmZodC1jZWxsJykud2lkdGgoKTtkLmZpbmQoJy5maHQtY2VsbCcpLndpZHRoKGEuaW5uZXJXaWR0aCgpLWMpfX0pLHRoaXMuaG9yaXpvbnRhbFNjcm9sbCgpfX0se2tleTonaG9yaXpvbnRhbFNjcm9sbCcsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3RoaXMudHJpZ2dlcignc2Nyb2xsLWJvZHknKSx0aGlzLiR0YWJsZUJvZHkub2ZmKCdzY3JvbGwnKS5vbignc2Nyb2xsJyxmdW5jdGlvbih0KXt2YXIgbz10LmN1cnJlbnRUYXJnZXQ7ZS5vcHRpb25zLnNob3dIZWFkZXImJmUub3B0aW9ucy5oZWlnaHQmJmUuJHRhYmxlSGVhZGVyLnNjcm9sbExlZnQocyhvKS5zY3JvbGxMZWZ0KCkpLGUub3B0aW9ucy5zaG93Rm9vdGVyJiYhZS5vcHRpb25zLmNhcmRWaWV3JiZlLiR0YWJsZUZvb3Rlci5zY3JvbGxMZWZ0KHMobykuc2Nyb2xsTGVmdCgpKX0pfX0se2tleTondG9nZ2xlQ29sdW1uJyx2YWx1ZTpmdW5jdGlvbihlLHQsbyl7aWYoLTEhPT1lJiYodGhpcy5jb2x1bW5zW2VdLnZpc2libGU9dCx0aGlzLmluaXRIZWFkZXIoKSx0aGlzLmluaXRTZWFyY2goKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0Qm9keSgpLHRoaXMub3B0aW9ucy5zaG93Q29sdW1ucykpe3ZhciBhPXRoaXMuJHRvb2xiYXIuZmluZCgnLmtlZXAtb3BlbiBpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywhMSk7byYmYS5maWx0ZXIoci5zcHJpbnRmKCdbdmFsdWU9XCIlc1wiXScsZSkpLnByb3AoJ2NoZWNrZWQnLHQpLGEuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aDw9dGhpcy5vcHRpb25zLm1pbmltdW1Db3VudENvbHVtbnMmJmEuZmlsdGVyKCc6Y2hlY2tlZCcpLnByb3AoJ2Rpc2FibGVkJywhMCl9fX0se2tleTonZ2V0VmlzaWJsZUZpZWxkcycsdmFsdWU6ZnVuY3Rpb24oKXtmb3IodmFyIGU9W10sdD10aGlzLmhlYWRlci5maWVsZHMsbz1BcnJheS5pc0FycmF5KHQpLGE9MCxfaXRlcmF0b3IxOT1vP3Q6dFtTeW1ib2wuaXRlcmF0b3JdKCk7Oyl7dmFyIGk7aWYobyl7aWYoYT49dC5sZW5ndGgpYnJlYWs7aT10W2ErK119ZWxzZXtpZihhPXQubmV4dCgpLGEuZG9uZSlicmVhaztpPWEudmFsdWV9dmFyIG49aSxzPXRoaXMuY29sdW1uc1t0aGlzLmZpZWxkc0NvbHVtbnNJbmRleFtuXV07cy52aXNpYmxlJiZlLnB1c2gobil9cmV0dXJuIGV9fSx7a2V5OidyZXNldFZpZXcnLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PTA7aWYoZSYmZS5oZWlnaHQmJih0aGlzLm9wdGlvbnMuaGVpZ2h0PWUuaGVpZ2h0KSx0aGlzLiRzZWxlY3RBbGwucHJvcCgnY2hlY2tlZCcsMDx0aGlzLiRzZWxlY3RJdGVtLmxlbmd0aCYmdGhpcy4kc2VsZWN0SXRlbS5sZW5ndGg9PT10aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGgpLHRoaXMub3B0aW9ucy5jYXJkVmlldylyZXR1cm4gdGhpcy4kZWwuY3NzKCdtYXJnaW4tdG9wJywnMCcpLHRoaXMuJHRhYmxlQ29udGFpbmVyLmNzcygncGFkZGluZy1ib3R0b20nLCcwJyksdm9pZCB0aGlzLiR0YWJsZUZvb3Rlci5oaWRlKCk7aWYodGhpcy5vcHRpb25zLnNob3dIZWFkZXImJnRoaXMub3B0aW9ucy5oZWlnaHQ/KHRoaXMuJHRhYmxlSGVhZGVyLnNob3coKSx0aGlzLnJlc2V0SGVhZGVyKCksdCs9dGhpcy4kaGVhZGVyLm91dGVySGVpZ2h0KCEwKSk6KHRoaXMuJHRhYmxlSGVhZGVyLmhpZGUoKSx0aGlzLnRyaWdnZXIoJ3Bvc3QtaGVhZGVyJykpLHRoaXMub3B0aW9ucy5zaG93Rm9vdGVyJiYodGhpcy5yZXNldEZvb3RlcigpLHRoaXMub3B0aW9ucy5oZWlnaHQmJih0Kz10aGlzLiR0YWJsZUZvb3Rlci5vdXRlckhlaWdodCghMCkpKSx0aGlzLm9wdGlvbnMuaGVpZ2h0KXt2YXIgbz10aGlzLiR0b29sYmFyLm91dGVySGVpZ2h0KCEwKSxhPXRoaXMuJHBhZ2luYXRpb24ub3V0ZXJIZWlnaHQoITApLGk9dGhpcy5vcHRpb25zLmhlaWdodC1vLWEsbj10aGlzLiR0YWJsZUJvZHkuZmluZCgndGFibGUnKS5vdXRlckhlaWdodCghMCk7dGhpcy4kdGFibGVDb250YWluZXIuY3NzKCdoZWlnaHQnLGkrJ3B4JyksdGhpcy4kdGFibGVCb3JkZXImJnRoaXMuJHRhYmxlQm9yZGVyLmNzcygnaGVpZ2h0JyxpLW4tdC0xKydweCcpfXRoaXMuZ2V0Q2FyZXQoKSx0aGlzLiR0YWJsZUNvbnRhaW5lci5jc3MoJ3BhZGRpbmctYm90dG9tJyx0KydweCcpLHRoaXMudHJpZ2dlcigncmVzZXQtdmlldycpfX0se2tleTonZ2V0RGF0YScsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5vcHRpb25zLmRhdGE7cmV0dXJuKHRoaXMuc2VhcmNoVGV4dHx8dGhpcy5vcHRpb25zLnNvcnROYW1lfHwhci5pc0VtcHR5T2JqZWN0KHRoaXMuZmlsdGVyQ29sdW1ucyl8fCFyLmlzRW1wdHlPYmplY3QodGhpcy5maWx0ZXJDb2x1bW5zUGFydGlhbCkpJiYodD10aGlzLmRhdGEpLGU/dC5zbGljZSh0aGlzLnBhZ2VGcm9tLTEsdGhpcy5wYWdlVG8pOnR9fSx7a2V5Oidsb2FkJyx2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD0hMSxvPWU7dGhpcy5vcHRpb25zLnBhZ2luYXRpb24mJidzZXJ2ZXInPT09dGhpcy5vcHRpb25zLnNpZGVQYWdpbmF0aW9uJiYodGhpcy5vcHRpb25zLnRvdGFsUm93cz1vW3RoaXMub3B0aW9ucy50b3RhbEZpZWxkXSksdD1vLmZpeGVkU2Nyb2xsLG89QXJyYXkuaXNBcnJheShvKT9vOm9bdGhpcy5vcHRpb25zLmRhdGFGaWVsZF0sdGhpcy5pbml0RGF0YShvKSx0aGlzLmluaXRTZWFyY2goKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0Qm9keSh0KX19LHtrZXk6J2FwcGVuZCcsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5pbml0RGF0YShlLCdhcHBlbmQnKSx0aGlzLmluaXRTZWFyY2goKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0U29ydCgpLHRoaXMuaW5pdEJvZHkoITApfX0se2tleToncHJlcGVuZCcsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5pbml0RGF0YShlLCdwcmVwZW5kJyksdGhpcy5pbml0U2VhcmNoKCksdGhpcy5pbml0UGFnaW5hdGlvbigpLHRoaXMuaW5pdFNvcnQoKSx0aGlzLmluaXRCb2R5KCEwKX19LHtrZXk6J3JlbW92ZScsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoLG89dm9pZCAwLGE9dm9pZCAwO2lmKGUuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykmJmUuaGFzT3duUHJvcGVydHkoJ3ZhbHVlcycpKXtmb3Iobz10LTE7MDw9bztvLS0pKGE9dGhpcy5vcHRpb25zLmRhdGFbb10sISFhLmhhc093blByb3BlcnR5KGUuZmllbGQpKSYmLTEhPT1lLnZhbHVlcy5pbmRleE9mKGFbZS5maWVsZF0pJiYodGhpcy5vcHRpb25zLmRhdGEuc3BsaWNlKG8sMSksJ3NlcnZlcic9PT10aGlzLm9wdGlvbnMuc2lkZVBhZ2luYXRpb24mJih0aGlzLm9wdGlvbnMudG90YWxSb3dzLT0xKSk7dD09PXRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aHx8KHRoaXMuaW5pdFNlYXJjaCgpLHRoaXMuaW5pdFBhZ2luYXRpb24oKSx0aGlzLmluaXRTb3J0KCksdGhpcy5pbml0Qm9keSghMCkpfX19LHtrZXk6J3JlbW92ZUFsbCcsdmFsdWU6ZnVuY3Rpb24oKXswPHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCYmKHRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSgwLHRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCksdGhpcy5pbml0U2VhcmNoKCksdGhpcy5pbml0UGFnaW5hdGlvbigpLHRoaXMuaW5pdEJvZHkoITApKX19LHtrZXk6J2dldFJvd0J5VW5pcXVlSWQnLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMub3B0aW9ucy51bmlxdWVJZCxvPXRoaXMub3B0aW9ucy5kYXRhLmxlbmd0aCxhPWUsbj1udWxsLHM9dm9pZCAwLGk9dm9pZCAwLGw9dm9pZCAwO2ZvcihzPW8tMTswPD1zO3MtLSl7aWYoaT10aGlzLm9wdGlvbnMuZGF0YVtzXSxpLmhhc093blByb3BlcnR5KHQpKWw9aVt0XTtlbHNlIGlmKGkuX2RhdGEmJmkuX2RhdGEuaGFzT3duUHJvcGVydHkodCkpbD1pLl9kYXRhW3RdO2Vsc2UgY29udGludWU7aWYoJ3N0cmluZyc9PXR5cGVvZiBsP2E9YS50b1N0cmluZygpOidudW1iZXInPT10eXBlb2YgbCYmKCtsPT09bCYmMD09bCUxP2E9cGFyc2VJbnQoYSk6bD09PStsJiYwIT09bCYmKGE9cGFyc2VGbG9hdChhKSkpLGw9PT1hKXtuPWk7YnJlYWt9fXJldHVybiBufX0se2tleToncmVtb3ZlQnlVbmlxdWVJZCcsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5vcHRpb25zLmRhdGEubGVuZ3RoLG89dGhpcy5nZXRSb3dCeVVuaXF1ZUlkKGUpO28mJnRoaXMub3B0aW9ucy5kYXRhLnNwbGljZSh0aGlzLm9wdGlvbnMuZGF0YS5pbmRleE9mKG8pLDEpLHQ9PT10aGlzLm9wdGlvbnMuZGF0YS5sZW5ndGh8fCh0aGlzLmluaXRTZWFyY2goKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0Qm9keSghMCkpfX0se2tleTondXBkYXRlQnlVbmlxdWVJZCcsdmFsdWU6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PUFycmF5LmlzQXJyYXkoZSk/ZTpbZV0sbz10LGE9QXJyYXkuaXNBcnJheShvKSxpPTAsX2l0ZXJhdG9yMjA9YT9vOm9bU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciBuO2lmKGEpe2lmKGk+PW8ubGVuZ3RoKWJyZWFrO249b1tpKytdfWVsc2V7aWYoaT1vLm5leHQoKSxpLmRvbmUpYnJlYWs7bj1pLnZhbHVlfXZhciBsPW47aWYobC5oYXNPd25Qcm9wZXJ0eSgnaWQnKSYmbC5oYXNPd25Qcm9wZXJ0eSgncm93Jykpe3ZhciByPXRoaXMub3B0aW9ucy5kYXRhLmluZGV4T2YodGhpcy5nZXRSb3dCeVVuaXF1ZUlkKGwuaWQpKTstMSE9PXImJnMuZXh0ZW5kKHRoaXMub3B0aW9ucy5kYXRhW3JdLGwucm93KX19dGhpcy5pbml0U2VhcmNoKCksdGhpcy5pbml0UGFnaW5hdGlvbigpLHRoaXMuaW5pdFNvcnQoKSx0aGlzLmluaXRCb2R5KCEwKX19LHtrZXk6J3JlZnJlc2hDb2x1bW5UaXRsZScsdmFsdWU6ZnVuY3Rpb24oZSl7aWYoZS5oYXNPd25Qcm9wZXJ0eSgnZmllbGQnKSYmZS5oYXNPd25Qcm9wZXJ0eSgndGl0bGUnKSYmKHRoaXMuY29sdW1uc1t0aGlzLmZpZWxkc0NvbHVtbnNJbmRleFtlLmZpZWxkXV0udGl0bGU9dGhpcy5vcHRpb25zLmVzY2FwZT9yLmVzY2FwZUhUTUwoZS50aXRsZSk6ZS50aXRsZSx0aGlzLmNvbHVtbnNbdGhpcy5maWVsZHNDb2x1bW5zSW5kZXhbZS5maWVsZF1dLnZpc2libGUpKXt2YXIgdD12b2lkIDA9PT10aGlzLm9wdGlvbnMuaGVpZ2h0P3RoaXMuJGhlYWRlcjp0aGlzLiR0YWJsZUhlYWRlcjt0LmZpbmQoJ3RoW2RhdGEtZmllbGRdJykuZWFjaChmdW5jdGlvbih0LG8pe2lmKHMobykuZGF0YSgnZmllbGQnKT09PWUuZmllbGQpcmV0dXJuIHMocyhvKS5maW5kKCcudGgtaW5uZXInKVswXSkudGV4dChlLnRpdGxlKSwhMX0pfX19LHtrZXk6J2luc2VydFJvdycsdmFsdWU6ZnVuY3Rpb24oZSl7ZS5oYXNPd25Qcm9wZXJ0eSgnaW5kZXgnKSYmZS5oYXNPd25Qcm9wZXJ0eSgncm93JykmJih0aGlzLm9wdGlvbnMuZGF0YS5zcGxpY2UoZS5pbmRleCwwLGUucm93KSx0aGlzLmluaXRTZWFyY2goKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0U29ydCgpLHRoaXMuaW5pdEJvZHkoITApKX19LHtrZXk6J3VwZGF0ZVJvdycsdmFsdWU6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PUFycmF5LmlzQXJyYXkoZSk/ZTpbZV0sbz10LGE9QXJyYXkuaXNBcnJheShvKSxpPTAsX2l0ZXJhdG9yMjE9YT9vOm9bU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciBuO2lmKGEpe2lmKGk+PW8ubGVuZ3RoKWJyZWFrO249b1tpKytdfWVsc2V7aWYoaT1vLm5leHQoKSxpLmRvbmUpYnJlYWs7bj1pLnZhbHVlfXZhciBsPW47bC5oYXNPd25Qcm9wZXJ0eSgnaW5kZXgnKSYmbC5oYXNPd25Qcm9wZXJ0eSgncm93JykmJnMuZXh0ZW5kKHRoaXMub3B0aW9ucy5kYXRhW2wuaW5kZXhdLGwucm93KX10aGlzLmluaXRTZWFyY2goKSx0aGlzLmluaXRQYWdpbmF0aW9uKCksdGhpcy5pbml0U29ydCgpLHRoaXMuaW5pdEJvZHkoITApfX0se2tleTonaW5pdEhpZGRlblJvd3MnLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5oaWRkZW5Sb3dzPVtdfX0se2tleTonc2hvd1JvdycsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy50b2dnbGVSb3coZSwhMCl9fSx7a2V5OidoaWRlUm93Jyx2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLnRvZ2dsZVJvdyhlLCExKX19LHtrZXk6J3RvZ2dsZVJvdycsdmFsdWU6ZnVuY3Rpb24oZSx0KXt2YXIgbztpZihlLmhhc093blByb3BlcnR5KCdpbmRleCcpP289dGhpcy5nZXREYXRhKClbZS5pbmRleF06ZS5oYXNPd25Qcm9wZXJ0eSgndW5pcXVlSWQnKSYmKG89dGhpcy5nZXRSb3dCeVVuaXF1ZUlkKGUudW5pcXVlSWQpKSwhIW8pe3ZhciBhPXIuZmluZEluZGV4KHRoaXMuaGlkZGVuUm93cyxvKTt0fHwtMSE9PWE/dCYmLTE8YSYmdGhpcy5oaWRkZW5Sb3dzLnNwbGljZShhLDEpOnRoaXMuaGlkZGVuUm93cy5wdXNoKG8pLHRoaXMuaW5pdEJvZHkoITApfX19LHtrZXk6J2dldEhpZGRlblJvd3MnLHZhbHVlOmZ1bmN0aW9uKGUpe2lmKGUpcmV0dXJuIHRoaXMuaW5pdEhpZGRlblJvd3MoKSx2b2lkIHRoaXMuaW5pdEJvZHkoITApO2Zvcih2YXIgdD10aGlzLmdldERhdGEoKSxvPVtdLGE9dCxpPUFycmF5LmlzQXJyYXkoYSksbj0wLF9pdGVyYXRvcjIyPWk/YTphW1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgcztpZihpKXtpZihuPj1hLmxlbmd0aClicmVhaztzPWFbbisrXX1lbHNle2lmKG49YS5uZXh0KCksbi5kb25lKWJyZWFrO3M9bi52YWx1ZX12YXIgbD1zOy0xIT09dGhpcy5oaWRkZW5Sb3dzLmluZGV4T2YobCkmJm8ucHVzaChsKX1yZXR1cm4gdGhpcy5oaWRkZW5Sb3dzPW8sb319LHtrZXk6J21lcmdlQ2VsbHMnLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PWUuaW5kZXgsbz10aGlzLmdldFZpc2libGVGaWVsZHMoKS5pbmRleE9mKGUuZmllbGQpLGE9ZS5yb3dzcGFufHwxLG49ZS5jb2xzcGFufHwxLHM9dm9pZCAwLGk9dm9pZCAwLGw9dGhpcy4kYm9keS5maW5kKCc+dHInKTt0aGlzLm9wdGlvbnMuZGV0YWlsVmlldyYmIXRoaXMub3B0aW9ucy5jYXJkVmlldyYmKG8rPTEpO3ZhciByPWwuZXEodCkuZmluZCgnPnRkJykuZXEobyk7aWYoISgwPnR8fDA+b3x8dD49dGhpcy5kYXRhLmxlbmd0aCkpe2ZvcihzPXQ7czx0K2E7cysrKWZvcihpPW87aTxvK247aSsrKWwuZXEocykuZmluZCgnPnRkJykuZXEoaSkuaGlkZSgpO3IuYXR0cigncm93c3BhbicsYSkuYXR0cignY29sc3Bhbicsbikuc2hvdygpfX19LHtrZXk6J3VwZGF0ZUNlbGwnLHZhbHVlOmZ1bmN0aW9uKGUpe2UuaGFzT3duUHJvcGVydHkoJ2luZGV4JykmJmUuaGFzT3duUHJvcGVydHkoJ2ZpZWxkJykmJmUuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykmJih0aGlzLmRhdGFbZS5pbmRleF1bZS5maWVsZF09ZS52YWx1ZSwhMT09PWUucmVpbml0fHwodGhpcy5pbml0U29ydCgpLHRoaXMuaW5pdEJvZHkoITApKSl9fSx7a2V5Oid1cGRhdGVDZWxsQnlJZCcsdmFsdWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZihlLmhhc093blByb3BlcnR5KCdpZCcpJiZlLmhhc093blByb3BlcnR5KCdmaWVsZCcpJiZlLmhhc093blByb3BlcnR5KCd2YWx1ZScpKXt2YXIgbz1BcnJheS5pc0FycmF5KGUpP2U6W2VdO28uZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgbz1lLmlkLGE9ZS5maWVsZCxpPWUudmFsdWUsbj10Lm9wdGlvbnMuZGF0YS5pbmRleE9mKHQuZ2V0Um93QnlVbmlxdWVJZChvKSk7LTE9PT1ufHwodC5kYXRhW25dW2FdPWkpfSksITE9PT1lLnJlaW5pdHx8KHRoaXMuaW5pdFNvcnQoKSx0aGlzLmluaXRCb2R5KCEwKSl9fX0se2tleTonZ2V0T3B0aW9ucycsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgZT1KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMub3B0aW9ucykpO3JldHVybiBkZWxldGUgZS5kYXRhLGV9fSx7a2V5OidnZXRTZWxlY3Rpb25zJyx2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXM7cmV0dXJuIHRoaXMub3B0aW9ucy5kYXRhLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4hMD09PXRbZS5oZWFkZXIuc3RhdGVGaWVsZF19KX19LHtrZXk6J2dldEFsbFNlbGVjdGlvbnMnLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcztyZXR1cm4gdGhpcy5vcHRpb25zLmRhdGEuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0W2UuaGVhZGVyLnN0YXRlRmllbGRdfSl9fSx7a2V5OidjaGVja0FsbCcsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmNoZWNrQWxsXyghMCl9fSx7a2V5Oid1bmNoZWNrQWxsJyx2YWx1ZTpmdW5jdGlvbigpe3RoaXMuY2hlY2tBbGxfKCExKX19LHtrZXk6J2NoZWNrSW52ZXJ0Jyx2YWx1ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLHQ9ZS5maWx0ZXIoJzpjaGVja2VkJyk7ZS5lYWNoKGZ1bmN0aW9uKGUsdCl7cyh0KS5wcm9wKCdjaGVja2VkJywhcyh0KS5wcm9wKCdjaGVja2VkJykpfSksdGhpcy51cGRhdGVSb3dzKCksdGhpcy51cGRhdGVTZWxlY3RlZCgpLHRoaXMudHJpZ2dlcigndW5jaGVjay1zb21lJyx0KSx0PXRoaXMuZ2V0U2VsZWN0aW9ucygpLHRoaXMudHJpZ2dlcignY2hlY2stc29tZScsdCl9fSx7a2V5OidjaGVja0FsbF8nLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0O2V8fCh0PXRoaXMuZ2V0U2VsZWN0aW9ucygpKSx0aGlzLiRzZWxlY3RBbGwuYWRkKHRoaXMuJHNlbGVjdEFsbF8pLnByb3AoJ2NoZWNrZWQnLGUpLHRoaXMuJHNlbGVjdEl0ZW0uZmlsdGVyKCc6ZW5hYmxlZCcpLnByb3AoJ2NoZWNrZWQnLGUpLHRoaXMudXBkYXRlUm93cygpLGUmJih0PXRoaXMuZ2V0U2VsZWN0aW9ucygpKSx0aGlzLnRyaWdnZXIoZT8nY2hlY2stYWxsJzondW5jaGVjay1hbGwnLHQpfX0se2tleTonY2hlY2snLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tfKCEwLGUpfX0se2tleTondW5jaGVjaycsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5jaGVja18oITEsZSl9fSx7a2V5OidjaGVja18nLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIG89dGhpcy4kc2VsZWN0SXRlbS5maWx0ZXIoJ1tkYXRhLWluZGV4PVwiJyt0KydcIl0nKSxhPXRoaXMuZGF0YVt0XTtpZihvLmlzKCc6cmFkaW8nKXx8dGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdCl7Zm9yKHZhciBpPXRoaXMub3B0aW9ucy5kYXRhLG49QXJyYXkuaXNBcnJheShpKSxzPTAsX2l0ZXJhdG9yMjM9bj9pOmlbU3ltYm9sLml0ZXJhdG9yXSgpOzspe3ZhciBsO2lmKG4pe2lmKHM+PWkubGVuZ3RoKWJyZWFrO2w9aVtzKytdfWVsc2V7aWYocz1pLm5leHQoKSxzLmRvbmUpYnJlYWs7bD1zLnZhbHVlfXZhciBkPWw7ZFt0aGlzLmhlYWRlci5zdGF0ZUZpZWxkXT0hMX10aGlzLiRzZWxlY3RJdGVtLmZpbHRlcignOmNoZWNrZWQnKS5ub3QobykucHJvcCgnY2hlY2tlZCcsITEpfWFbdGhpcy5oZWFkZXIuc3RhdGVGaWVsZF09ZSxvLnByb3AoJ2NoZWNrZWQnLGUpLHRoaXMudXBkYXRlU2VsZWN0ZWQoKSx0aGlzLnRyaWdnZXIoZT8nY2hlY2snOid1bmNoZWNrJyx0aGlzLmRhdGFbdF0sbyl9fSx7a2V5OidjaGVja0J5Jyx2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLmNoZWNrQnlfKCEwLGUpfX0se2tleTondW5jaGVja0J5Jyx2YWx1ZTpmdW5jdGlvbihlKXt0aGlzLmNoZWNrQnlfKCExLGUpfX0se2tleTonY2hlY2tCeV8nLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIG89dGhpcztpZih0Lmhhc093blByb3BlcnR5KCdmaWVsZCcpJiZ0Lmhhc093blByb3BlcnR5KCd2YWx1ZXMnKSl7dmFyIGE9W107dGhpcy5vcHRpb25zLmRhdGEuZm9yRWFjaChmdW5jdGlvbihuLHMpe2lmKCFuLmhhc093blByb3BlcnR5KHQuZmllbGQpKXJldHVybiExO2lmKC0xIT09dC52YWx1ZXMuaW5kZXhPZihuW3QuZmllbGRdKSl7dmFyIGk9by4kc2VsZWN0SXRlbS5maWx0ZXIoJzplbmFibGVkJykuZmlsdGVyKHIuc3ByaW50ZignW2RhdGEtaW5kZXg9XCIlc1wiXScscykpLnByb3AoJ2NoZWNrZWQnLGUpO25bby5oZWFkZXIuc3RhdGVGaWVsZF09ZSxhLnB1c2gobiksby50cmlnZ2VyKGU/J2NoZWNrJzondW5jaGVjaycsbixpKX19KSx0aGlzLnVwZGF0ZVNlbGVjdGVkKCksdGhpcy50cmlnZ2VyKGU/J2NoZWNrLXNvbWUnOid1bmNoZWNrLXNvbWUnLGEpfX19LHtrZXk6J2Rlc3Ryb3knLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy4kZWwuaW5zZXJ0QmVmb3JlKHRoaXMuJGNvbnRhaW5lcikscyh0aGlzLm9wdGlvbnMudG9vbGJhcikuaW5zZXJ0QmVmb3JlKHRoaXMuJGVsKSx0aGlzLiRjb250YWluZXIubmV4dCgpLnJlbW92ZSgpLHRoaXMuJGNvbnRhaW5lci5yZW1vdmUoKSx0aGlzLiRlbC5odG1sKHRoaXMuJGVsXy5odG1sKCkpLmNzcygnbWFyZ2luLXRvcCcsJzAnKS5hdHRyKCdjbGFzcycsdGhpcy4kZWxfLmF0dHIoJ2NsYXNzJyl8fCcnKX19LHtrZXk6J3Nob3dMb2FkaW5nJyx2YWx1ZTpmdW5jdGlvbigpe3RoaXMuJHRhYmxlTG9hZGluZy5jc3MoJ2Rpc3BsYXknLCdmbGV4Jyl9fSx7a2V5OidoaWRlTG9hZGluZycsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLiR0YWJsZUxvYWRpbmcuY3NzKCdkaXNwbGF5Jywnbm9uZScpfX0se2tleTondG9nZ2xlUGFnaW5hdGlvbicsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMucGFnaW5hdGlvbj0hdGhpcy5vcHRpb25zLnBhZ2luYXRpb24sdGhpcy4kdG9vbGJhci5maW5kKCdidXR0b25bbmFtZT1cInBhZ2luYXRpb25Td2l0Y2hcIl0nKS5odG1sKHIuc3ByaW50Zih0aGlzLmNvbnN0YW50cy5odG1sLmljb24sdGhpcy5vcHRpb25zLmljb25zUHJlZml4LHRoaXMub3B0aW9ucy5wYWdpbmF0aW9uP3RoaXMub3B0aW9ucy5pY29ucy5wYWdpbmF0aW9uU3dpdGNoRG93bjp0aGlzLm9wdGlvbnMuaWNvbnMucGFnaW5hdGlvblN3aXRjaFVwKSksdGhpcy51cGRhdGVQYWdpbmF0aW9uKCl9fSx7a2V5Oid0b2dnbGVGdWxsc2NyZWVuJyx2YWx1ZTpmdW5jdGlvbigpe3RoaXMuJGVsLmNsb3Nlc3QoJy5ib290c3RyYXAtdGFibGUnKS50b2dnbGVDbGFzcygnZnVsbHNjcmVlbicpLHRoaXMucmVzZXRWaWV3KCl9fSx7a2V5OidyZWZyZXNoJyx2YWx1ZTpmdW5jdGlvbihlKXtlJiZlLnVybCYmKHRoaXMub3B0aW9ucy51cmw9ZS51cmwpLGUmJmUucGFnZU51bWJlciYmKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyPWUucGFnZU51bWJlciksZSYmZS5wYWdlU2l6ZSYmKHRoaXMub3B0aW9ucy5wYWdlU2l6ZT1lLnBhZ2VTaXplKSx0aGlzLnRyaWdnZXIoJ3JlZnJlc2gnLHRoaXMuaW5pdFNlcnZlcihlJiZlLnNpbGVudCxlJiZlLnF1ZXJ5LGUmJmUudXJsKSl9fSx7a2V5OidyZXNldFdpZHRoJyx2YWx1ZTpmdW5jdGlvbigpe3RoaXMub3B0aW9ucy5zaG93SGVhZGVyJiZ0aGlzLm9wdGlvbnMuaGVpZ2h0JiZ0aGlzLmZpdEhlYWRlcigpLHRoaXMub3B0aW9ucy5zaG93Rm9vdGVyJiYhdGhpcy5vcHRpb25zLmNhcmRWaWV3JiZ0aGlzLmZpdEZvb3RlcigpfX0se2tleTonc2hvd0NvbHVtbicsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy50b2dnbGVDb2x1bW4odGhpcy5maWVsZHNDb2x1bW5zSW5kZXhbZV0sITAsITApfX0se2tleTonaGlkZUNvbHVtbicsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy50b2dnbGVDb2x1bW4odGhpcy5maWVsZHNDb2x1bW5zSW5kZXhbZV0sITEsITApfX0se2tleTonZ2V0SGlkZGVuQ29sdW1ucycsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2x1bW5zLmZpbHRlcihmdW5jdGlvbihlKXt2YXIgdD1lLnZpc2libGU7cmV0dXJuIXR9KX19LHtrZXk6J2dldFZpc2libGVDb2x1bW5zJyx2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uKGUpe3ZhciB0PWUudmlzaWJsZTtyZXR1cm4gdH0pfX0se2tleTondG9nZ2xlQWxsQ29sdW1ucycsdmFsdWU6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PXRoaXMuY29sdW1ucyxvPUFycmF5LmlzQXJyYXkodCksYT0wLF9pdGVyYXRvcjI0PW8/dDp0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KXt2YXIgaTtpZihvKXtpZihhPj10Lmxlbmd0aClicmVhaztpPXRbYSsrXX1lbHNle2lmKGE9dC5uZXh0KCksYS5kb25lKWJyZWFrO2k9YS52YWx1ZX12YXIgbj1pO24udmlzaWJsZT1lfWlmKHRoaXMuaW5pdEhlYWRlcigpLHRoaXMuaW5pdFNlYXJjaCgpLHRoaXMuaW5pdFBhZ2luYXRpb24oKSx0aGlzLmluaXRCb2R5KCksdGhpcy5vcHRpb25zLnNob3dDb2x1bW5zKXt2YXIgcz10aGlzLiR0b29sYmFyLmZpbmQoJy5rZWVwLW9wZW4gaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsITEpO3MuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aDw9dGhpcy5vcHRpb25zLm1pbmltdW1Db3VudENvbHVtbnMmJnMuZmlsdGVyKCc6Y2hlY2tlZCcpLnByb3AoJ2Rpc2FibGVkJywhMCl9fX0se2tleTonc2hvd0FsbENvbHVtbnMnLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy50b2dnbGVBbGxDb2x1bW5zKCEwKX19LHtrZXk6J2hpZGVBbGxDb2x1bW5zJyx2YWx1ZTpmdW5jdGlvbigpe3RoaXMudG9nZ2xlQWxsQ29sdW1ucyghMSl9fSx7a2V5OidmaWx0ZXJCeScsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5maWx0ZXJDb2x1bW5zPXIuaXNFbXB0eU9iamVjdChlKT97fTplLHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyPTEsdGhpcy5pbml0U2VhcmNoKCksdGhpcy51cGRhdGVQYWdpbmF0aW9uKCl9fSx7a2V5OidzY3JvbGxUbycsdmFsdWU6ZnVuY3Rpb24oZSl7aWYoJ3VuZGVmaW5lZCc9PXR5cGVvZiBlKXJldHVybiB0aGlzLiR0YWJsZUJvZHkuc2Nyb2xsVG9wKCk7dmFyIHQ9ZTsnc3RyaW5nJz09dHlwZW9mIGUmJidib3R0b20nPT09ZSYmKHQ9dGhpcy4kdGFibGVCb2R5WzBdLnNjcm9sbEhlaWdodCksdGhpcy4kdGFibGVCb2R5LnNjcm9sbFRvcCh0KX19LHtrZXk6J2dldFNjcm9sbFBvc2l0aW9uJyx2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnNjcm9sbFRvKCl9fSx7a2V5OidzZWxlY3RQYWdlJyx2YWx1ZTpmdW5jdGlvbihlKXswPGUmJmU8PXRoaXMub3B0aW9ucy50b3RhbFBhZ2VzJiYodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXI9ZSx0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKSl9fSx7a2V5OidwcmV2UGFnZScsdmFsdWU6ZnVuY3Rpb24oKXsxPHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyJiYodGhpcy5vcHRpb25zLnBhZ2VOdW1iZXItLSx0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKSl9fSx7a2V5OiduZXh0UGFnZScsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMucGFnZU51bWJlcjx0aGlzLm9wdGlvbnMudG90YWxQYWdlcyYmKHRoaXMub3B0aW9ucy5wYWdlTnVtYmVyKyssdGhpcy51cGRhdGVQYWdpbmF0aW9uKCkpfX0se2tleTondG9nZ2xlVmlldycsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMuY2FyZFZpZXc9IXRoaXMub3B0aW9ucy5jYXJkVmlldyx0aGlzLmluaXRIZWFkZXIoKSx0aGlzLiR0b29sYmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwidG9nZ2xlXCJdJykuaHRtbChyLnNwcmludGYodGhpcy5jb25zdGFudHMuaHRtbC5pY29uLHRoaXMub3B0aW9ucy5pY29uc1ByZWZpeCx0aGlzLm9wdGlvbnMuY2FyZFZpZXc/dGhpcy5vcHRpb25zLmljb25zLnRvZ2dsZU9uOnRoaXMub3B0aW9ucy5pY29ucy50b2dnbGVPZmYpKSx0aGlzLmluaXRCb2R5KCksdGhpcy50cmlnZ2VyKCd0b2dnbGUnLHRoaXMub3B0aW9ucy5jYXJkVmlldyl9fSx7a2V5OidyZWZyZXNoT3B0aW9ucycsdmFsdWU6ZnVuY3Rpb24oZSl7ci5jb21wYXJlT2JqZWN0cyh0aGlzLm9wdGlvbnMsZSwhMCl8fCh0aGlzLm9wdGlvbnM9cy5leHRlbmQodGhpcy5vcHRpb25zLGUpLHRoaXMudHJpZ2dlcigncmVmcmVzaC1vcHRpb25zJyx0aGlzLm9wdGlvbnMpLHRoaXMuZGVzdHJveSgpLHRoaXMuaW5pdCgpKX19LHtrZXk6J3Jlc2V0U2VhcmNoJyx2YWx1ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLiR0b29sYmFyLmZpbmQoJy5zZWFyY2ggaW5wdXQnKTt0LnZhbChlfHwnJyksdGhpcy5vblNlYXJjaCh7Y3VycmVudFRhcmdldDp0fSl9fSx7a2V5OidleHBhbmRSb3dfJyx2YWx1ZTpmdW5jdGlvbihlLHQpe3ZhciBvPXRoaXMuJGJvZHkuZmluZChyLnNwcmludGYoJz4gdHJbZGF0YS1pbmRleD1cIiVzXCJdJyx0KSk7by5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3Jyk9PT0hZSYmby5maW5kKCc+IHRkID4gLmRldGFpbC1pY29uJykuY2xpY2soKX19LHtrZXk6J2V4cGFuZFJvdycsdmFsdWU6ZnVuY3Rpb24oZSl7dGhpcy5leHBhbmRSb3dfKCEwLGUpfX0se2tleTonY29sbGFwc2VSb3cnLHZhbHVlOmZ1bmN0aW9uKGUpe3RoaXMuZXhwYW5kUm93XyghMSxlKX19LHtrZXk6J2V4cGFuZEFsbFJvd3MnLHZhbHVlOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7aWYoZSl7dmFyIG89dGhpcy4kYm9keS5maW5kKHIuc3ByaW50ZignPiB0cltkYXRhLWluZGV4PVwiJXNcIl0nLDApKSxhPW51bGwsbj0hMSxsPS0xO2lmKG8ubmV4dCgpLmlzKCd0ci5kZXRhaWwtdmlldycpPyFvLm5leHQoKS5uZXh0KCkuaXMoJ3RyLmRldGFpbC12aWV3JykmJihvLm5leHQoKS5maW5kKCcuZGV0YWlsLWljb24nKS5jbGljaygpLG49ITApOihvLmZpbmQoJz4gdGQgPiAuZGV0YWlsLWljb24nKS5jbGljaygpLG49ITApLG4pdHJ5e2w9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXthPXQuJGJvZHkuZmluZCgndHIuZGV0YWlsLXZpZXcnKS5sYXN0KCkuZmluZCgnLmRldGFpbC1pY29uJyksMDxhLmxlbmd0aD9hLmNsaWNrKCk6Y2xlYXJJbnRlcnZhbChsKX0sMSl9Y2F0Y2goZSl7Y2xlYXJJbnRlcnZhbChsKX19ZWxzZSBmb3IodmFyIGQ9dGhpcy4kYm9keS5jaGlsZHJlbigpLGM9MDtjPGQubGVuZ3RoO2MrKyl0aGlzLmV4cGFuZFJvd18oITAscyhkW2NdKS5kYXRhKCdpbmRleCcpKX19LHtrZXk6J2NvbGxhcHNlQWxsUm93cycsdmFsdWU6ZnVuY3Rpb24oZSl7aWYoZSl0aGlzLmV4cGFuZFJvd18oITEsMCk7ZWxzZSBmb3IodmFyIHQ9dGhpcy4kYm9keS5jaGlsZHJlbigpLG89MDtvPHQubGVuZ3RoO28rKyl0aGlzLmV4cGFuZFJvd18oITEscyh0W29dKS5kYXRhKCdpbmRleCcpKX19LHtrZXk6J3VwZGF0ZUZvcm1hdFRleHQnLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dGhpcy5vcHRpb25zW3Iuc3ByaW50ZignZm9ybWF0JXMnLGUpXSYmKCdzdHJpbmcnPT10eXBlb2YgdD90aGlzLm9wdGlvbnNbci5zcHJpbnRmKCdmb3JtYXQlcycsZSldPWZ1bmN0aW9uKCl7cmV0dXJuIHR9OidmdW5jdGlvbic9PXR5cGVvZiB0JiYodGhpcy5vcHRpb25zW3Iuc3ByaW50ZignZm9ybWF0JXMnLGUpXT10KSksdGhpcy5pbml0VG9vbGJhcigpLHRoaXMuaW5pdFBhZ2luYXRpb24oKSx0aGlzLmluaXRCb2R5KCl9fV0pLHR9KCk7cC5ERUZBVUxUUz1kLHAuTE9DQUxFUz1jLHAuQ09MVU1OX0RFRkFVTFRTPXtyYWRpbzohMSxjaGVja2JveDohMSxjaGVja2JveEVuYWJsZWQ6ITAsZmllbGQ6dm9pZCAwLHRpdGxlOnZvaWQgMCx0aXRsZVRvb2x0aXA6dm9pZCAwLGNsYXNzOnZvaWQgMCxhbGlnbjp2b2lkIDAsaGFsaWduOnZvaWQgMCxmYWxpZ246dm9pZCAwLHZhbGlnbjp2b2lkIDAsd2lkdGg6dm9pZCAwLHNvcnRhYmxlOiExLG9yZGVyOidhc2MnLHZpc2libGU6ITAsc3dpdGNoYWJsZTohMCxjbGlja1RvU2VsZWN0OiEwLGZvcm1hdHRlcjp2b2lkIDAsZm9vdGVyRm9ybWF0dGVyOnZvaWQgMCxldmVudHM6dm9pZCAwLHNvcnRlcjp2b2lkIDAsc29ydE5hbWU6dm9pZCAwLGNlbGxTdHlsZTp2b2lkIDAsc2VhcmNoYWJsZTohMCxzZWFyY2hGb3JtYXR0ZXI6ITAsY2FyZFZpc2libGU6ITAsZXNjYXBlOiExLHNob3dTZWxlY3RUaXRsZTohMX0scC5FVkVOVFM9e1wiYWxsLmJzLnRhYmxlXCI6J29uQWxsJyxcImNsaWNrLWNlbGwuYnMudGFibGVcIjonb25DbGlja0NlbGwnLFwiZGJsLWNsaWNrLWNlbGwuYnMudGFibGVcIjonb25EYmxDbGlja0NlbGwnLFwiY2xpY2stcm93LmJzLnRhYmxlXCI6J29uQ2xpY2tSb3cnLFwiZGJsLWNsaWNrLXJvdy5icy50YWJsZVwiOidvbkRibENsaWNrUm93JyxcInNvcnQuYnMudGFibGVcIjonb25Tb3J0JyxcImNoZWNrLmJzLnRhYmxlXCI6J29uQ2hlY2snLFwidW5jaGVjay5icy50YWJsZVwiOidvblVuY2hlY2snLFwiY2hlY2stYWxsLmJzLnRhYmxlXCI6J29uQ2hlY2tBbGwnLFwidW5jaGVjay1hbGwuYnMudGFibGVcIjonb25VbmNoZWNrQWxsJyxcImNoZWNrLXNvbWUuYnMudGFibGVcIjonb25DaGVja1NvbWUnLFwidW5jaGVjay1zb21lLmJzLnRhYmxlXCI6J29uVW5jaGVja1NvbWUnLFwibG9hZC1zdWNjZXNzLmJzLnRhYmxlXCI6J29uTG9hZFN1Y2Nlc3MnLFwibG9hZC1lcnJvci5icy50YWJsZVwiOidvbkxvYWRFcnJvcicsXCJjb2x1bW4tc3dpdGNoLmJzLnRhYmxlXCI6J29uQ29sdW1uU3dpdGNoJyxcInBhZ2UtY2hhbmdlLmJzLnRhYmxlXCI6J29uUGFnZUNoYW5nZScsXCJzZWFyY2guYnMudGFibGVcIjonb25TZWFyY2gnLFwidG9nZ2xlLmJzLnRhYmxlXCI6J29uVG9nZ2xlJyxcInByZS1ib2R5LmJzLnRhYmxlXCI6J29uUHJlQm9keScsXCJwb3N0LWJvZHkuYnMudGFibGVcIjonb25Qb3N0Qm9keScsXCJwb3N0LWhlYWRlci5icy50YWJsZVwiOidvblBvc3RIZWFkZXInLFwiZXhwYW5kLXJvdy5icy50YWJsZVwiOidvbkV4cGFuZFJvdycsXCJjb2xsYXBzZS1yb3cuYnMudGFibGVcIjonb25Db2xsYXBzZVJvdycsXCJyZWZyZXNoLW9wdGlvbnMuYnMudGFibGVcIjonb25SZWZyZXNoT3B0aW9ucycsXCJyZXNldC12aWV3LmJzLnRhYmxlXCI6J29uUmVzZXRWaWV3JyxcInJlZnJlc2guYnMudGFibGVcIjonb25SZWZyZXNoJyxcInNjcm9sbC1ib2R5LmJzLnRhYmxlXCI6J29uU2Nyb2xsQm9keSd9O3ZhciBoPVsnZ2V0T3B0aW9ucycsJ2dldFNlbGVjdGlvbnMnLCdnZXRBbGxTZWxlY3Rpb25zJywnZ2V0RGF0YScsJ2xvYWQnLCdhcHBlbmQnLCdwcmVwZW5kJywncmVtb3ZlJywncmVtb3ZlQWxsJywnaW5zZXJ0Um93JywndXBkYXRlUm93JywndXBkYXRlQ2VsbCcsJ3VwZGF0ZUJ5VW5pcXVlSWQnLCdyZW1vdmVCeVVuaXF1ZUlkJywnZ2V0Um93QnlVbmlxdWVJZCcsJ3Nob3dSb3cnLCdoaWRlUm93JywnZ2V0SGlkZGVuUm93cycsJ21lcmdlQ2VsbHMnLCdyZWZyZXNoQ29sdW1uVGl0bGUnLCdjaGVja0FsbCcsJ3VuY2hlY2tBbGwnLCdjaGVja0ludmVydCcsJ2NoZWNrJywndW5jaGVjaycsJ2NoZWNrQnknLCd1bmNoZWNrQnknLCdyZWZyZXNoJywncmVzZXRWaWV3JywncmVzZXRXaWR0aCcsJ2Rlc3Ryb3knLCdzaG93TG9hZGluZycsJ2hpZGVMb2FkaW5nJywnc2hvd0NvbHVtbicsJ2hpZGVDb2x1bW4nLCdnZXRIaWRkZW5Db2x1bW5zJywnZ2V0VmlzaWJsZUNvbHVtbnMnLCdzaG93QWxsQ29sdW1ucycsJ2hpZGVBbGxDb2x1bW5zJywnZmlsdGVyQnknLCdzY3JvbGxUbycsJ2dldFNjcm9sbFBvc2l0aW9uJywnc2VsZWN0UGFnZScsJ3ByZXZQYWdlJywnbmV4dFBhZ2UnLCd0b2dnbGVQYWdpbmF0aW9uJywndG9nZ2xlVmlldycsJ3JlZnJlc2hPcHRpb25zJywncmVzZXRTZWFyY2gnLCdleHBhbmRSb3cnLCdjb2xsYXBzZVJvdycsJ2V4cGFuZEFsbFJvd3MnLCdjb2xsYXBzZUFsbFJvd3MnLCd1cGRhdGVGb3JtYXRUZXh0JywndXBkYXRlQ2VsbEJ5SWQnXTtzLkJvb3RzdHJhcFRhYmxlPXAscy5mbi5ib290c3RyYXBUYWJsZT1mdW5jdGlvbihlKXtmb3IodmFyIHQ9YXJndW1lbnRzLmxlbmd0aCxvPUFycmF5KDE8dD90LTE6MCksYT0xO2E8dDthKyspb1thLTFdPWFyZ3VtZW50c1thXTt2YXIgaTtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKHQsYSl7dmFyIGw9cyhhKS5kYXRhKCdib290c3RyYXAudGFibGUnKSxyPXMuZXh0ZW5kKHt9LHAuREVGQVVMVFMscyhhKS5kYXRhKCksJ29iamVjdCc9PT0oJ3VuZGVmaW5lZCc9PXR5cGVvZiBlPyd1bmRlZmluZWQnOm4oZSkpJiZlKTtpZignc3RyaW5nJz09dHlwZW9mIGUpe3ZhciBkO2lmKC0xPT09aC5pbmRleE9mKGUpKXRocm93IG5ldyBFcnJvcignVW5rbm93biBtZXRob2Q6ICcrZSk7aWYoIWwpcmV0dXJuO2k9KGQ9bClbZV0uYXBwbHkoZCxvKSwnZGVzdHJveSc9PT1lJiZzKGEpLnJlbW92ZURhdGEoJ2Jvb3RzdHJhcC50YWJsZScpfWx8fHMoYSkuZGF0YSgnYm9vdHN0cmFwLnRhYmxlJyxsPW5ldyBzLkJvb3RzdHJhcFRhYmxlKGEscikpfSksJ3VuZGVmaW5lZCc9PXR5cGVvZiBpP3RoaXM6aX0scy5mbi5ib290c3RyYXBUYWJsZS5Db25zdHJ1Y3Rvcj1wLHMuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHM9cC5ERUZBVUxUUyxzLmZuLmJvb3RzdHJhcFRhYmxlLmNvbHVtbkRlZmF1bHRzPXAuQ09MVU1OX0RFRkFVTFRTLHMuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcz1wLkxPQ0FMRVMscy5mbi5ib290c3RyYXBUYWJsZS5tZXRob2RzPWgscy5mbi5ib290c3RyYXBUYWJsZS51dGlscz1yLHMoZnVuY3Rpb24oKXtzKCdbZGF0YS10b2dnbGU9XCJ0YWJsZVwiXScpLmJvb3RzdHJhcFRhYmxlKCl9KX0pKGpRdWVyeSl9KTsiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeSgpO1xuICAgIGdsb2JhbC5ib290c3RyYXBUYWJsZUV4cG9ydCA9IG1vZC5leHBvcnRzO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH07XG4gIH0oKTtcblxuICBmdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG4gIH1cblxuICB2YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG5cbiAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgICB9XG5cbiAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogQGF1dGhvciB6aGl4aW4gd2VuIDx3ZW56aGl4aW4yMDEwQGdtYWlsLmNvbT5cbiAgICogZXh0ZW5zaW9uczogaHR0cHM6Ly9naXRodWIuY29tL2hodXJ6L3RhYmxlRXhwb3J0LmpxdWVyeS5wbHVnaW5cbiAgICovXG5cbiAgKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIFV0aWxzID0gJC5mbi5ib290c3RyYXBUYWJsZS51dGlscztcblxuICAgIHZhciBib290c3RyYXAgPSB7XG4gICAgICAzOiB7XG4gICAgICAgIGljb25zOiB7XG4gICAgICAgICAgZXhwb3J0OiAnZ2x5cGhpY29uLWV4cG9ydCBpY29uLXNoYXJlJ1xuICAgICAgICB9LFxuICAgICAgICBodG1sOiB7XG4gICAgICAgICAgZHJvcG1lbnU6ICc8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj48L3VsPicsXG4gICAgICAgICAgZHJvcGl0ZW06ICc8bGkgcm9sZT1cIm1lbnVpdGVtXCIgZGF0YS10eXBlPVwiJXNcIj48YSBocmVmPVwiamF2YXNjcmlwdDpcIj4lczwvYT48L2xpPidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIDQ6IHtcbiAgICAgICAgaWNvbnM6IHtcbiAgICAgICAgICBleHBvcnQ6ICdmYS1kb3dubG9hZCdcbiAgICAgICAgfSxcbiAgICAgICAgaHRtbDoge1xuICAgICAgICAgIGRyb3BtZW51OiAnPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiPjwvZGl2PicsXG4gICAgICAgICAgZHJvcGl0ZW06ICc8YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBkYXRhLXR5cGU9XCIlc1wiIGhyZWY9XCJqYXZhc2NyaXB0OlwiPiVzPC9hPidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1bVXRpbHMuYm9vdHN0cmFwVmVyc2lvbl07XG5cbiAgICB2YXIgVFlQRV9OQU1FID0ge1xuICAgICAganNvbjogJ0pTT04nLFxuICAgICAgeG1sOiAnWE1MJyxcbiAgICAgIHBuZzogJ1BORycsXG4gICAgICBjc3Y6ICdDU1YnLFxuICAgICAgdHh0OiAnVFhUJyxcbiAgICAgIHNxbDogJ1NRTCcsXG4gICAgICBkb2M6ICdNUy1Xb3JkJyxcbiAgICAgIGV4Y2VsOiAnTVMtRXhjZWwnLFxuICAgICAgeGxzeDogJ01TLUV4Y2VsIChPcGVuWE1MKScsXG4gICAgICBwb3dlcnBvaW50OiAnTVMtUG93ZXJwb2ludCcsXG4gICAgICBwZGY6ICdQREYnXG4gICAgfTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMsIHtcbiAgICAgIHNob3dFeHBvcnQ6IGZhbHNlLFxuICAgICAgZXhwb3J0RGF0YVR5cGU6ICdiYXNpYycsIC8vIGJhc2ljLCBhbGwsIHNlbGVjdGVkXG4gICAgICBleHBvcnRUeXBlczogWydqc29uJywgJ3htbCcsICdjc3YnLCAndHh0JywgJ3NxbCcsICdleGNlbCddLFxuICAgICAgZXhwb3J0T3B0aW9uczoge30sXG4gICAgICBleHBvcnRGb290ZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICAkLmV4dGVuZCgkLmZuLmJvb3RzdHJhcFRhYmxlLmRlZmF1bHRzLmljb25zLCB7XG4gICAgICBleHBvcnQ6IGJvb3RzdHJhcC5pY29ucy5leHBvcnRcbiAgICB9KTtcblxuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcywge1xuICAgICAgZm9ybWF0RXhwb3J0OiBmdW5jdGlvbiBmb3JtYXRFeHBvcnQoKSB7XG4gICAgICAgIHJldHVybiAnRXhwb3J0IGRhdGEnO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQuZXh0ZW5kKCQuZm4uYm9vdHN0cmFwVGFibGUuZGVmYXVsdHMsICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlcyk7XG5cbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlLm1ldGhvZHMucHVzaCgnZXhwb3J0VGFibGUnKTtcblxuICAgICQuQm9vdHN0cmFwVGFibGUgPSBmdW5jdGlvbiAoXyQkQm9vdHN0cmFwVGFibGUpIHtcbiAgICAgIF9pbmhlcml0cyhfY2xhc3MsIF8kJEJvb3RzdHJhcFRhYmxlKTtcblxuICAgICAgZnVuY3Rpb24gX2NsYXNzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgX2NsYXNzKTtcblxuICAgICAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKF9jbGFzcy5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKF9jbGFzcykpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfVxuXG4gICAgICBfY3JlYXRlQ2xhc3MoX2NsYXNzLCBbe1xuICAgICAgICBrZXk6ICdpbml0VG9vbGJhcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0VG9vbGJhcigpIHtcbiAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgIHZhciBvID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgICAgdGhpcy5zaG93VG9vbGJhciA9IHRoaXMuc2hvd1Rvb2xiYXIgfHwgby5zaG93RXhwb3J0O1xuXG4gICAgICAgICAgX2dldChfY2xhc3MucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzLnByb3RvdHlwZSksICdpbml0VG9vbGJhcicsIHRoaXMpLmNhbGwodGhpcyk7XG5cbiAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93RXhwb3J0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciAkYnRuR3JvdXAgPSB0aGlzLiR0b29sYmFyLmZpbmQoJz4uYnRuLWdyb3VwJyk7XG4gICAgICAgICAgdGhpcy4kZXhwb3J0ID0gJGJ0bkdyb3VwLmZpbmQoJ2Rpdi5leHBvcnQnKTtcblxuICAgICAgICAgIGlmICh0aGlzLiRleHBvcnQubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUV4cG9ydEJ1dHRvbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLiRleHBvcnQgPSAkKCdcXG4gICAgICAgIDxkaXYgY2xhc3M9XCJleHBvcnQgYnRuLWdyb3VwXCI+XFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi0nICsgby5idXR0b25zQ2xhc3MgKyAnIGJ0bi0nICsgby5pY29uU2l6ZSArICcgZHJvcGRvd24tdG9nZ2xlXCJcXG4gICAgICAgICAgYXJpYS1sYWJlbD1cImV4cG9ydCB0eXBlXCJcXG4gICAgICAgICAgdGl0bGU9XCInICsgby5mb3JtYXRFeHBvcnQoKSArICdcIlxcbiAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiPlxcbiAgICAgICAgICA8aSBjbGFzcz1cIicgKyBvLmljb25zUHJlZml4ICsgJyAnICsgby5pY29ucy5leHBvcnQgKyAnXCI+PC9pPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxcbiAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAnICsgYm9vdHN0cmFwLmh0bWwuZHJvcG1lbnUgKyAnXFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAnKS5hcHBlbmRUbygkYnRuR3JvdXApO1xuXG4gICAgICAgICAgdGhpcy51cGRhdGVFeHBvcnRCdXR0b24oKTtcblxuICAgICAgICAgIHZhciAkbWVudSA9IHRoaXMuJGV4cG9ydC5maW5kKCcuZHJvcGRvd24tbWVudScpO1xuICAgICAgICAgIHZhciBleHBvcnRUeXBlcyA9IG8uZXhwb3J0VHlwZXM7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydFR5cGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFyIHR5cGVzID0gZXhwb3J0VHlwZXMuc2xpY2UoMSwgLTEpLnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBleHBvcnRUeXBlcyA9IHR5cGVzLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICByZXR1cm4gdC5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gZXhwb3J0VHlwZXMsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjtcblxuICAgICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0eXBlID0gX3JlZjtcblxuICAgICAgICAgICAgaWYgKFRZUEVfTkFNRS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICAgICAgICAkbWVudS5hcHBlbmQoVXRpbHMuc3ByaW50Zihib290c3RyYXAuaHRtbC5kcm9waXRlbSwgdHlwZSwgVFlQRV9OQU1FW3R5cGVdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJG1lbnUuZmluZCgnPmxpLCA+YScpLmNsaWNrKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUYXJnZXQgPSBfcmVmMi5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgICAgICB2YXIgdHlwZSA9ICQoY3VycmVudFRhcmdldCkuZGF0YSgndHlwZScpO1xuICAgICAgICAgICAgdmFyIGV4cG9ydE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgIGVzY2FwZTogZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF90aGlzMi5leHBvcnRUYWJsZShleHBvcnRPcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdleHBvcnRUYWJsZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBleHBvcnRUYWJsZShvcHRpb25zKSB7XG4gICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICB2YXIgbyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICB2YXIgc3RhdGVGaWVsZCA9IHRoaXMuaGVhZGVyLnN0YXRlRmllbGQ7XG4gICAgICAgICAgdmFyIGlzQ2FyZFZpZXcgPSBvLmNhcmRWaWV3O1xuXG4gICAgICAgICAgdmFyIGRvRXhwb3J0ID0gZnVuY3Rpb24gZG9FeHBvcnQoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZUZpZWxkKSB7XG4gICAgICAgICAgICAgIF90aGlzMy5oaWRlQ29sdW1uKHN0YXRlRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQ2FyZFZpZXcpIHtcbiAgICAgICAgICAgICAgX3RoaXMzLnRvZ2dsZVZpZXcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBfdGhpczMuZ2V0RGF0YSgpO1xuICAgICAgICAgICAgaWYgKG8uZXhwb3J0Rm9vdGVyKSB7XG4gICAgICAgICAgICAgIHZhciAkZm9vdGVyUm93ID0gX3RoaXMzLiR0YWJsZUZvb3Rlci5maW5kKCd0cicpLmZpcnN0KCk7XG4gICAgICAgICAgICAgIHZhciBmb290ZXJEYXRhID0ge307XG4gICAgICAgICAgICAgIHZhciBmb290ZXJIdG1sID0gW107XG5cbiAgICAgICAgICAgICAgJC5lYWNoKCRmb290ZXJSb3cuY2hpbGRyZW4oKSwgZnVuY3Rpb24gKGluZGV4LCBmb290ZXJDZWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvb3RlckNlbGxIdG1sID0gJChmb290ZXJDZWxsKS5jaGlsZHJlbignLnRoLWlubmVyJykuZmlyc3QoKS5odG1sKCk7XG4gICAgICAgICAgICAgICAgZm9vdGVyRGF0YVtfdGhpczMuY29sdW1uc1tpbmRleF0uZmllbGRdID0gZm9vdGVyQ2VsbEh0bWwgPT09ICcmbmJzcDsnID8gbnVsbCA6IGZvb3RlckNlbGxIdG1sO1xuXG4gICAgICAgICAgICAgICAgLy8gZ3JhYiBmb290ZXIgY2VsbCB0ZXh0IGludG8gY2VsbCBpbmRleC1iYXNlZCBhcnJheVxuICAgICAgICAgICAgICAgIGZvb3Rlckh0bWwucHVzaChmb290ZXJDZWxsSHRtbCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIF90aGlzMy5hcHBlbmQoZm9vdGVyRGF0YSk7XG5cbiAgICAgICAgICAgICAgdmFyICRsYXN0VGFibGVSb3cgPSBfdGhpczMuJGJvZHkuY2hpbGRyZW4oKS5sYXN0KCk7XG5cbiAgICAgICAgICAgICAgJC5lYWNoKCRsYXN0VGFibGVSb3cuY2hpbGRyZW4oKSwgZnVuY3Rpb24gKGluZGV4LCBsYXN0VGFibGVSb3dDZWxsKSB7XG4gICAgICAgICAgICAgICAgJChsYXN0VGFibGVSb3dDZWxsKS5odG1sKGZvb3Rlckh0bWxbaW5kZXhdKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF90aGlzMy4kZWwudGFibGVFeHBvcnQoJC5leHRlbmQoe1xuICAgICAgICAgICAgICBvbkFmdGVyU2F2ZVRvRmlsZTogZnVuY3Rpb24gb25BZnRlclNhdmVUb0ZpbGUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG8uZXhwb3J0Rm9vdGVyKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczMubG9hZChkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgX3RoaXMzLnNob3dDb2x1bW4oc3RhdGVGaWVsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc0NhcmRWaWV3KSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczMudG9nZ2xlVmlldygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG8uZXhwb3J0T3B0aW9ucywgb3B0aW9ucykpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoby5leHBvcnREYXRhVHlwZSA9PT0gJ2FsbCcgJiYgby5wYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gby5zaWRlUGFnaW5hdGlvbiA9PT0gJ3NlcnZlcicgPyAncG9zdC1ib2R5LmJzLnRhYmxlJyA6ICdwYWdlLWNoYW5nZS5icy50YWJsZSc7XG4gICAgICAgICAgICB0aGlzLiRlbC5vbmUoZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGRvRXhwb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpczMudG9nZ2xlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvLmV4cG9ydERhdGFUeXBlID09PSAnc2VsZWN0ZWQnKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkRGF0YSA9IHRoaXMuZ2V0U2VsZWN0aW9ucygpO1xuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZERhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG8uc2lkZVBhZ2luYXRpb24gPT09ICdzZXJ2ZXInKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBfZGVmaW5lUHJvcGVydHkoe1xuICAgICAgICAgICAgICAgIHRvdGFsOiBvLnRvdGFsUm93c1xuICAgICAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMuZGF0YUZpZWxkLCBkYXRhKTtcbiAgICAgICAgICAgICAgc2VsZWN0ZWREYXRhID0gX2RlZmluZVByb3BlcnR5KHtcbiAgICAgICAgICAgICAgICB0b3RhbDogc2VsZWN0ZWREYXRhLmxlbmd0aFxuICAgICAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMuZGF0YUZpZWxkLCBzZWxlY3RlZERhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxvYWQoc2VsZWN0ZWREYXRhKTtcbiAgICAgICAgICAgIGRvRXhwb3J0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgX3RoaXMzLmxvYWQoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9FeHBvcnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAndXBkYXRlU2VsZWN0ZWQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWQoKSB7XG4gICAgICAgICAgX2dldChfY2xhc3MucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzLnByb3RvdHlwZSksICd1cGRhdGVTZWxlY3RlZCcsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgICAgICAgdGhpcy51cGRhdGVFeHBvcnRCdXR0b24oKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVFeHBvcnRCdXR0b24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRXhwb3J0QnV0dG9uKCkge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhwb3J0RGF0YVR5cGUgPT09ICdzZWxlY3RlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuJGV4cG9ydC5maW5kKCc+IGJ1dHRvbicpLnByb3AoJ2Rpc2FibGVkJywgIXRoaXMuZ2V0U2VsZWN0aW9ucygpLmxlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XSk7XG5cbiAgICAgIHJldHVybiBfY2xhc3M7XG4gICAgfSgkLkJvb3RzdHJhcFRhYmxlKTtcbiAgfSkoalF1ZXJ5KTtcbn0pOyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KCk7XG4gICAgZ2xvYmFsLmJvb3RzdHJhcFRhYmxlRXNFUyA9IG1vZC5leHBvcnRzO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQm9vdHN0cmFwIFRhYmxlIFNwYW5pc2ggU3BhaW4gdHJhbnNsYXRpb25cbiAgICogQXV0aG9yOiBNYXJjIFBpbmE8aXdhbGthbG9uZTY5QGdtYWlsLmNvbT5cbiAgICovXG4gIChmdW5jdGlvbiAoJCkge1xuICAgICQuZm4uYm9vdHN0cmFwVGFibGUubG9jYWxlc1snZXMtRVMnXSA9IHtcbiAgICAgIGZvcm1hdExvYWRpbmdNZXNzYWdlOiBmdW5jdGlvbiBmb3JtYXRMb2FkaW5nTWVzc2FnZSgpIHtcbiAgICAgICAgcmV0dXJuICdQb3IgZmF2b3IgZXNwZXJlJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRSZWNvcmRzUGVyUGFnZTogZnVuY3Rpb24gZm9ybWF0UmVjb3Jkc1BlclBhZ2UocGFnZU51bWJlcikge1xuICAgICAgICByZXR1cm4gcGFnZU51bWJlciArICcgcmVzdWx0YWRvcyBwb3IgcFxceEUxZ2luYSc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0U2hvd2luZ1Jvd3M6IGZ1bmN0aW9uIGZvcm1hdFNob3dpbmdSb3dzKHBhZ2VGcm9tLCBwYWdlVG8sIHRvdGFsUm93cykge1xuICAgICAgICByZXR1cm4gJ01vc3RyYW5kbyBkZXNkZSAnICsgcGFnZUZyb20gKyAnIGhhc3RhICcgKyBwYWdlVG8gKyAnIC0gRW4gdG90YWwgJyArIHRvdGFsUm93cyArICcgcmVzdWx0YWRvcyc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0RGV0YWlsUGFnaW5hdGlvbjogZnVuY3Rpb24gZm9ybWF0RGV0YWlsUGFnaW5hdGlvbih0b3RhbFJvd3MpIHtcbiAgICAgICAgcmV0dXJuICdTaG93aW5nICcgKyB0b3RhbFJvd3MgKyAnIHJvd3MnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdFNlYXJjaDogZnVuY3Rpb24gZm9ybWF0U2VhcmNoKCkge1xuICAgICAgICByZXR1cm4gJ0J1c2Nhcic7XG4gICAgICB9LFxuICAgICAgZm9ybWF0Tm9NYXRjaGVzOiBmdW5jdGlvbiBmb3JtYXROb01hdGNoZXMoKSB7XG4gICAgICAgIHJldHVybiAnTm8gc2UgZW5jb250cmFyb24gcmVzdWx0YWRvcyc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0UGFnaW5hdGlvblN3aXRjaDogZnVuY3Rpb24gZm9ybWF0UGFnaW5hdGlvblN3aXRjaCgpIHtcbiAgICAgICAgcmV0dXJuICdPY3VsdGFyL01vc3RyYXIgcGFnaW5hY2nDs24nO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdFJlZnJlc2g6IGZ1bmN0aW9uIGZvcm1hdFJlZnJlc2goKSB7XG4gICAgICAgIHJldHVybiAnUmVmcmVzY2FyJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRUb2dnbGU6IGZ1bmN0aW9uIGZvcm1hdFRvZ2dsZSgpIHtcbiAgICAgICAgcmV0dXJuICdPY3VsdGFyL01vc3RyYXInO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdENvbHVtbnM6IGZ1bmN0aW9uIGZvcm1hdENvbHVtbnMoKSB7XG4gICAgICAgIHJldHVybiAnQ29sdW1uYXMnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdEZ1bGxzY3JlZW46IGZ1bmN0aW9uIGZvcm1hdEZ1bGxzY3JlZW4oKSB7XG4gICAgICAgIHJldHVybiAnRnVsbHNjcmVlbic7XG4gICAgICB9LFxuICAgICAgZm9ybWF0QWxsUm93czogZnVuY3Rpb24gZm9ybWF0QWxsUm93cygpIHtcbiAgICAgICAgcmV0dXJuICdUb2Rvcyc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0QXV0b1JlZnJlc2g6IGZ1bmN0aW9uIGZvcm1hdEF1dG9SZWZyZXNoKCkge1xuICAgICAgICByZXR1cm4gJ0F1dG8gUmVmcmVzaCc7XG4gICAgICB9LFxuXG4gICAgICBmb3JtYXRFeHBvcnQ6IGZ1bmN0aW9uIGZvcm1hdEV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuICdFeHBvcnRhciBsb3MgZGF0b3MnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdENsZWFyRmlsdGVyczogZnVuY3Rpb24gZm9ybWF0Q2xlYXJGaWx0ZXJzKCkge1xuICAgICAgICByZXR1cm4gJ0JvcnJhciBsb3MgZmlsdHJvcyc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0SnVtcHRvOiBmdW5jdGlvbiBmb3JtYXRKdW1wdG8oKSB7XG4gICAgICAgIHJldHVybiAnR08nO1xuICAgICAgfSxcblxuICAgICAgZm9ybWF0QWR2YW5jZWRTZWFyY2g6IGZ1bmN0aW9uIGZvcm1hdEFkdmFuY2VkU2VhcmNoKCkge1xuICAgICAgICByZXR1cm4gJ0LDunNxdWVkYSBhdmFuemFkYSc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0QWR2YW5jZWRDbG9zZUJ1dHRvbjogZnVuY3Rpb24gZm9ybWF0QWR2YW5jZWRDbG9zZUJ1dHRvbigpIHtcbiAgICAgICAgcmV0dXJuICdDZXJyYXInO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkLmV4dGVuZCgkLmZuLmJvb3RzdHJhcFRhYmxlLmRlZmF1bHRzLCAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbJ2VzLUVTJ10pO1xuICB9KShqUXVlcnkpO1xufSk7IiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbW9kID0ge1xuICAgICAgZXhwb3J0czoge31cbiAgICB9O1xuICAgIGZhY3RvcnkoKTtcbiAgICBnbG9iYWwuYm9vdHN0cmFwVGFibGVFdUVVID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBCb290c3RyYXAgVGFibGUgQmFzcXVlIChCYXNxdWUgQ291bnRyeSkgdHJhbnNsYXRpb25cbiAgICogQXV0aG9yOiBJa2VyIEliYXJndXJlbiBCZXJhc2FsdXplPGlrZXJpYkBnbWFpbC5jb20+XG4gICAqL1xuICAoZnVuY3Rpb24gKCQpIHtcbiAgICAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbJ2V1LUVVJ10gPSB7XG4gICAgICBmb3JtYXRMb2FkaW5nTWVzc2FnZTogZnVuY3Rpb24gZm9ybWF0TG9hZGluZ01lc3NhZ2UoKSB7XG4gICAgICAgIHJldHVybiAnSXR4YXJvbiBtZXNlZGV6JztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRSZWNvcmRzUGVyUGFnZTogZnVuY3Rpb24gZm9ybWF0UmVjb3Jkc1BlclBhZ2UocGFnZU51bWJlcikge1xuICAgICAgICByZXR1cm4gcGFnZU51bWJlciArICcgZW1haXR6YSBvcnJpa28uJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRTaG93aW5nUm93czogZnVuY3Rpb24gZm9ybWF0U2hvd2luZ1Jvd3MocGFnZUZyb20sIHBhZ2VUbywgdG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiB0b3RhbFJvd3MgKyAnIGVycmVnaXN0cm9ldGF0aWsgJyArIHBhZ2VGcm9tICsgJ2V0aWsgJyArIHBhZ2VUbyArICdlcmFrb2FrIGVyYWt1c3Rlbi4nO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdERldGFpbFBhZ2luYXRpb246IGZ1bmN0aW9uIGZvcm1hdERldGFpbFBhZ2luYXRpb24odG90YWxSb3dzKSB7XG4gICAgICAgIHJldHVybiAnU2hvd2luZyAnICsgdG90YWxSb3dzICsgJyByb3dzJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRTZWFyY2g6IGZ1bmN0aW9uIGZvcm1hdFNlYXJjaCgpIHtcbiAgICAgICAgcmV0dXJuICdCaWxhdHUnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdE5vTWF0Y2hlczogZnVuY3Rpb24gZm9ybWF0Tm9NYXRjaGVzKCkge1xuICAgICAgICByZXR1cm4gJ0V6IGRhIGVtYWl0emFyaWsgYXVya2l0dSc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0UGFnaW5hdGlvblN3aXRjaDogZnVuY3Rpb24gZm9ybWF0UGFnaW5hdGlvblN3aXRjaCgpIHtcbiAgICAgICAgcmV0dXJuICdFemt1dGF0dS9FcmFrdXRzaSBvcnJpa2F0emVhJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRSZWZyZXNoOiBmdW5jdGlvbiBmb3JtYXRSZWZyZXNoKCkge1xuICAgICAgICByZXR1cm4gJ0VndW5lcmF0dSc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0VG9nZ2xlOiBmdW5jdGlvbiBmb3JtYXRUb2dnbGUoKSB7XG4gICAgICAgIHJldHVybiAnRXprdXRhdHUvRXJha3V0c2knO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdENvbHVtbnM6IGZ1bmN0aW9uIGZvcm1hdENvbHVtbnMoKSB7XG4gICAgICAgIHJldHVybiAnWnV0YWJlYWsnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdEZ1bGxzY3JlZW46IGZ1bmN0aW9uIGZvcm1hdEZ1bGxzY3JlZW4oKSB7XG4gICAgICAgIHJldHVybiAnRnVsbHNjcmVlbic7XG4gICAgICB9LFxuICAgICAgZm9ybWF0QWxsUm93czogZnVuY3Rpb24gZm9ybWF0QWxsUm93cygpIHtcbiAgICAgICAgcmV0dXJuICdHdXp0aWFrJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRBdXRvUmVmcmVzaDogZnVuY3Rpb24gZm9ybWF0QXV0b1JlZnJlc2goKSB7XG4gICAgICAgIHJldHVybiAnQXV0byBSZWZyZXNoJztcbiAgICAgIH0sXG4gICAgICBmb3JtYXRFeHBvcnQ6IGZ1bmN0aW9uIGZvcm1hdEV4cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuICdFeHBvcnQgZGF0YSc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0Q2xlYXJGaWx0ZXJzOiBmdW5jdGlvbiBmb3JtYXRDbGVhckZpbHRlcnMoKSB7XG4gICAgICAgIHJldHVybiAnQ2xlYXIgZmlsdGVycyc7XG4gICAgICB9LFxuICAgICAgZm9ybWF0SnVtcHRvOiBmdW5jdGlvbiBmb3JtYXRKdW1wdG8oKSB7XG4gICAgICAgIHJldHVybiAnR08nO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdEFkdmFuY2VkU2VhcmNoOiBmdW5jdGlvbiBmb3JtYXRBZHZhbmNlZFNlYXJjaCgpIHtcbiAgICAgICAgcmV0dXJuICdBZHZhbmNlZCBzZWFyY2gnO1xuICAgICAgfSxcbiAgICAgIGZvcm1hdEFkdmFuY2VkQ2xvc2VCdXR0b246IGZ1bmN0aW9uIGZvcm1hdEFkdmFuY2VkQ2xvc2VCdXR0b24oKSB7XG4gICAgICAgIHJldHVybiAnQ2xvc2UnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkLmV4dGVuZCgkLmZuLmJvb3RzdHJhcFRhYmxlLmRlZmF1bHRzLCAkLmZuLmJvb3RzdHJhcFRhYmxlLmxvY2FsZXNbJ2V1LUVVJ10pO1xuICB9KShqUXVlcnkpO1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZScpO1xuXG52YXIgVU5TQ09QQUJMRVMgPSB3ZWxsS25vd25TeW1ib2woJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90b3R5cGUgPSBBcnJheS5wcm90b3R5cGU7XG5cbi8vIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmlmIChBcnJheVByb3RvdHlwZVtVTlNDT1BBQkxFU10gPT0gdW5kZWZpbmVkKSB7XG4gIGhpZGUoQXJyYXlQcm90b3R5cGUsIFVOU0NPUEFCTEVTLCBjcmVhdGUobnVsbCkpO1xufVxuXG4vLyBhZGQgYSBrZXkgdG8gQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgQXJyYXlQcm90b3R5cGVbVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsInZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2JpbmQtY29udGV4dCcpO1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciBhcnJheVNwZWNpZXNDcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcblxudmFyIHB1c2ggPSBbXS5wdXNoO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgZm9yRWFjaCwgbWFwLCBmaWx0ZXIsIHNvbWUsIGV2ZXJ5LCBmaW5kLCBmaW5kSW5kZXggfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCwgc3BlY2lmaWNDcmVhdGUpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IEluZGV4ZWRPYmplY3QoTyk7XG4gICAgdmFyIGJvdW5kRnVuY3Rpb24gPSBiaW5kKGNhbGxiYWNrZm4sIHRoYXQsIDMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY3JlYXRlID0gc3BlY2lmaWNDcmVhdGUgfHwgYXJyYXlTcGVjaWVzQ3JlYXRlO1xuICAgIHZhciB0YXJnZXQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWx1ZSwgcmVzdWx0O1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsdWUgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlc3VsdCA9IGJvdW5kRnVuY3Rpb24odmFsdWUsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHRhcmdldFtpbmRleF0gPSByZXN1bHQ7IC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXN1bHQpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsdWU7ICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiBwdXNoLmNhbGwodGFyZ2V0LCB2YWx1ZSk7IC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYgKElTX0VWRVJZKSByZXR1cm4gZmFsc2U7ICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogdGFyZ2V0O1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4gIGZvckVhY2g6IGNyZWF0ZU1ldGhvZCgwKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5tYXBgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUubWFwXG4gIG1hcDogY3JlYXRlTWV0aG9kKDEpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbHRlcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maWx0ZXJcbiAgZmlsdGVyOiBjcmVhdGVNZXRob2QoMiksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuc29tZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5zb21lXG4gIHNvbWU6IGNyZWF0ZU1ldGhvZCgzKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5ldmVyeWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5ldmVyeVxuICBldmVyeTogY3JlYXRlTWV0aG9kKDQpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbmRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmluZFxuICBmaW5kOiBjcmVhdGVNZXRob2QoNSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRJbmRleFxuICBmaW5kSW5kZXg6IGNyZWF0ZU1ldGhvZCg2KVxufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gbmV3IChDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEMpKGxlbmd0aCA9PT0gMCA/IDAgOiBsZW5ndGgpO1xufTtcbiIsInZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1mdW5jdGlvbicpO1xuXG4vLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQpO1xuICAgIH07XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QnVpbHRJbignZG9jdW1lbnQnLCAnZG9jdW1lbnRFbGVtZW50Jyk7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xuXG4vLyBgSXNBcnJheWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pc2FycmF5XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIGNsYXNzb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9odG1sJyk7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBJRV9QUk9UTyA9IHNoYXJlZEtleSgnSUVfUFJPVE8nKTtcblxudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBsZW5ndGggPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIHNjcmlwdCA9ICdzY3JpcHQnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBqcyA9ICdqYXZhJyArIHNjcmlwdCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gU3RyaW5nKGpzKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArIHNjcmlwdCArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy8nICsgc2NyaXB0ICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGxlbmd0aC0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2xlbmd0aF1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxuLy8gYE9iamVjdC5jcmVhdGVgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmNyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG5cbmhpZGRlbktleXNbSUVfUFJPVE9dID0gdHJ1ZTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBvYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydGllc1xubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IG9iamVjdEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKE8sIGtleSA9IGtleXNbaW5kZXgrK10sIFByb3BlcnRpZXNba2V5XSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbi8vIGBPYmplY3Qua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3Qua2V5c1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJGZpbmQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uJykuZmluZDtcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcycpO1xuXG52YXIgRklORCA9ICdmaW5kJztcbnZhciBTS0lQU19IT0xFUyA9IHRydWU7XG5cbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZiAoRklORCBpbiBbXSkgQXJyYXkoMSlbRklORF0oZnVuY3Rpb24gKCkgeyBTS0lQU19IT0xFUyA9IGZhbHNlOyB9KTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5maW5kYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBTS0lQU19IT0xFUyB9LCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmFkZFRvVW5zY29wYWJsZXMoRklORCk7XG4iLCIvKiFcbiogc3dlZXRhbGVydDIgdjguMTEuNlxuKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLlN3ZWV0YWxlcnQyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gX2V4dGVuZHMoKSB7XG4gIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICB9O1xuICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xufVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgcmV0dXJuIG87XG4gIH07XG5cbiAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbn1cblxuZnVuY3Rpb24gaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7XG4gIGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7XG4gIGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7XG5cbiAgdHJ5IHtcbiAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykge1xuICBpZiAoaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkpIHtcbiAgICBfY29uc3RydWN0ID0gUmVmbGVjdC5jb25zdHJ1Y3Q7XG4gIH0gZWxzZSB7XG4gICAgX2NvbnN0cnVjdCA9IGZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykge1xuICAgICAgdmFyIGEgPSBbbnVsbF07XG4gICAgICBhLnB1c2guYXBwbHkoYSwgYXJncyk7XG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSBGdW5jdGlvbi5iaW5kLmFwcGx5KFBhcmVudCwgYSk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAgIGlmIChDbGFzcykgX3NldFByb3RvdHlwZU9mKGluc3RhbmNlLCBDbGFzcy5wcm90b3R5cGUpO1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbmZ1bmN0aW9uIF9zdXBlclByb3BCYXNlKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgd2hpbGUgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICBvYmplY3QgPSBfZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhaztcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbmZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7XG4gICAgX2dldCA9IFJlZmxlY3QuZ2V0O1xuICB9IGVsc2Uge1xuICAgIF9nZXQgPSBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgICB2YXIgYmFzZSA9IF9zdXBlclByb3BCYXNlKHRhcmdldCwgcHJvcGVydHkpO1xuXG4gICAgICBpZiAoIWJhc2UpIHJldHVybjtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7XG5cbiAgICAgIGlmIChkZXNjLmdldCkge1xuICAgICAgICByZXR1cm4gZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlciB8fCB0YXJnZXQpO1xufVxuXG52YXIgY29uc29sZVByZWZpeCA9ICdTd2VldEFsZXJ0MjonO1xuLyoqXG4gKiBGaWx0ZXIgdGhlIHVuaXF1ZSB2YWx1ZXMgaW50byBhIG5ldyBhcnJheVxuICogQHBhcmFtIGFyclxuICovXG5cbnZhciB1bmlxdWVBcnJheSA9IGZ1bmN0aW9uIHVuaXF1ZUFycmF5KGFycikge1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmVzdWx0LmluZGV4T2YoYXJyW2ldKSA9PT0gLTEpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycltpXSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIGFycmF5IG9iIG9iamVjdCB2YWx1ZXMgKE9iamVjdC52YWx1ZXMgaXNuJ3Qgc3VwcG9ydGVkIGluIElFMTEpXG4gKiBAcGFyYW0gb2JqXG4gKi9cblxudmFyIG9iamVjdFZhbHVlcyA9IGZ1bmN0aW9uIG9iamVjdFZhbHVlcyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH0pO1xufTtcbi8qKlxuICogQ29udmVydCBOb2RlTGlzdCB0byBBcnJheVxuICogQHBhcmFtIG5vZGVMaXN0XG4gKi9cblxudmFyIHRvQXJyYXkgPSBmdW5jdGlvbiB0b0FycmF5KG5vZGVMaXN0KSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7XG59O1xuLyoqXG4gKiBTdGFuZGFyZGlzZSBjb25zb2xlIHdhcm5pbmdzXG4gKiBAcGFyYW0gbWVzc2FnZVxuICovXG5cbnZhciB3YXJuID0gZnVuY3Rpb24gd2FybihtZXNzYWdlKSB7XG4gIGNvbnNvbGUud2FybihcIlwiLmNvbmNhdChjb25zb2xlUHJlZml4LCBcIiBcIikuY29uY2F0KG1lc3NhZ2UpKTtcbn07XG4vKipcbiAqIFN0YW5kYXJkaXNlIGNvbnNvbGUgZXJyb3JzXG4gKiBAcGFyYW0gbWVzc2FnZVxuICovXG5cbnZhciBlcnJvciA9IGZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgY29uc29sZS5lcnJvcihcIlwiLmNvbmNhdChjb25zb2xlUHJlZml4LCBcIiBcIikuY29uY2F0KG1lc3NhZ2UpKTtcbn07XG4vKipcbiAqIFByaXZhdGUgZ2xvYmFsIHN0YXRlIGZvciBgd2Fybk9uY2VgXG4gKiBAdHlwZSB7QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbnZhciBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMgPSBbXTtcbi8qKlxuICogU2hvdyBhIGNvbnNvbGUgd2FybmluZywgYnV0IG9ubHkgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBzaG93blxuICogQHBhcmFtIG1lc3NhZ2VcbiAqL1xuXG52YXIgd2Fybk9uY2UgPSBmdW5jdGlvbiB3YXJuT25jZShtZXNzYWdlKSB7XG4gIGlmICghKHByZXZpb3VzV2Fybk9uY2VNZXNzYWdlcy5pbmRleE9mKG1lc3NhZ2UpICE9PSAtMSkpIHtcbiAgICBwcmV2aW91c1dhcm5PbmNlTWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICB3YXJuKG1lc3NhZ2UpO1xuICB9XG59O1xuLyoqXG4gKiBTaG93IGEgb25lLXRpbWUgY29uc29sZSB3YXJuaW5nIGFib3V0IGRlcHJlY2F0ZWQgcGFyYW1zL21ldGhvZHNcbiAqL1xuXG52YXIgd2FybkFib3V0RGVwcmVhdGlvbiA9IGZ1bmN0aW9uIHdhcm5BYm91dERlcHJlYXRpb24oZGVwcmVjYXRlZFBhcmFtLCB1c2VJbnN0ZWFkKSB7XG4gIHdhcm5PbmNlKFwiXFxcIlwiLmNvbmNhdChkZXByZWNhdGVkUGFyYW0sIFwiXFxcIiBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS4gUGxlYXNlIHVzZSBcXFwiXCIpLmNvbmNhdCh1c2VJbnN0ZWFkLCBcIlxcXCIgaW5zdGVhZC5cIikpO1xufTtcbi8qKlxuICogSWYgYGFyZ2AgaXMgYSBmdW5jdGlvbiwgY2FsbCBpdCAod2l0aCBubyBhcmd1bWVudHMgb3IgY29udGV4dCkgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICogT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHZhbHVlIHRocm91Z2hcbiAqIEBwYXJhbSBhcmdcbiAqL1xuXG52YXIgY2FsbElmRnVuY3Rpb24gPSBmdW5jdGlvbiBjYWxsSWZGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbicgPyBhcmcoKSA6IGFyZztcbn07XG52YXIgaXNQcm9taXNlID0gZnVuY3Rpb24gaXNQcm9taXNlKGFyZykge1xuICByZXR1cm4gYXJnICYmIFByb21pc2UucmVzb2x2ZShhcmcpID09PSBhcmc7XG59O1xuXG52YXIgRGlzbWlzc1JlYXNvbiA9IE9iamVjdC5mcmVlemUoe1xuICBjYW5jZWw6ICdjYW5jZWwnLFxuICBiYWNrZHJvcDogJ2JhY2tkcm9wJyxcbiAgY2xvc2U6ICdjbG9zZScsXG4gIGVzYzogJ2VzYycsXG4gIHRpbWVyOiAndGltZXInXG59KTtcblxudmFyIGFyZ3NUb1BhcmFtcyA9IGZ1bmN0aW9uIGFyZ3NUb1BhcmFtcyhhcmdzKSB7XG4gIHZhciBwYXJhbXMgPSB7fTtcblxuICBzd2l0Y2ggKF90eXBlb2YoYXJnc1swXSkpIHtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgX2V4dGVuZHMocGFyYW1zLCBhcmdzWzBdKTtcblxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgWyd0aXRsZScsICdodG1sJywgJ3R5cGUnXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpbmRleCkge1xuICAgICAgICBzd2l0Y2ggKF90eXBlb2YoYXJnc1tpbmRleF0pKSB7XG4gICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXJyb3IoXCJVbmV4cGVjdGVkIHR5cGUgb2YgXCIuY29uY2F0KG5hbWUsIFwiISBFeHBlY3RlZCBcXFwic3RyaW5nXFxcIiwgZ290IFwiKS5jb25jYXQoX3R5cGVvZihhcmdzW2luZGV4XSkpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGFyYW1zO1xufTtcblxudmFyIHN3YWxQcmVmaXggPSAnc3dhbDItJztcbnZhciBwcmVmaXggPSBmdW5jdGlvbiBwcmVmaXgoaXRlbXMpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIGkgaW4gaXRlbXMpIHtcbiAgICByZXN1bHRbaXRlbXNbaV1dID0gc3dhbFByZWZpeCArIGl0ZW1zW2ldO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgc3dhbENsYXNzZXMgPSBwcmVmaXgoWydjb250YWluZXInLCAnc2hvd24nLCAnaGVpZ2h0LWF1dG8nLCAnaW9zZml4JywgJ3BvcHVwJywgJ21vZGFsJywgJ25vLWJhY2tkcm9wJywgJ3RvYXN0JywgJ3RvYXN0LXNob3duJywgJ3RvYXN0LWNvbHVtbicsICdmYWRlJywgJ3Nob3cnLCAnaGlkZScsICdub2FuaW1hdGlvbicsICdjbG9zZScsICd0aXRsZScsICdoZWFkZXInLCAnY29udGVudCcsICdhY3Rpb25zJywgJ2NvbmZpcm0nLCAnY2FuY2VsJywgJ2Zvb3RlcicsICdpY29uJywgJ2ltYWdlJywgJ2lucHV0JywgJ2ZpbGUnLCAncmFuZ2UnLCAnc2VsZWN0JywgJ3JhZGlvJywgJ2NoZWNrYm94JywgJ2xhYmVsJywgJ3RleHRhcmVhJywgJ2lucHV0ZXJyb3InLCAndmFsaWRhdGlvbi1tZXNzYWdlJywgJ3Byb2dyZXNzLXN0ZXBzJywgJ2FjdGl2ZS1wcm9ncmVzcy1zdGVwJywgJ3Byb2dyZXNzLXN0ZXAnLCAncHJvZ3Jlc3Mtc3RlcC1saW5lJywgJ2xvYWRpbmcnLCAnc3R5bGVkJywgJ3RvcCcsICd0b3Atc3RhcnQnLCAndG9wLWVuZCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnY2VudGVyJywgJ2NlbnRlci1zdGFydCcsICdjZW50ZXItZW5kJywgJ2NlbnRlci1sZWZ0JywgJ2NlbnRlci1yaWdodCcsICdib3R0b20nLCAnYm90dG9tLXN0YXJ0JywgJ2JvdHRvbS1lbmQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ2dyb3ctcm93JywgJ2dyb3ctY29sdW1uJywgJ2dyb3ctZnVsbHNjcmVlbicsICdydGwnXSk7XG52YXIgaWNvblR5cGVzID0gcHJlZml4KFsnc3VjY2VzcycsICd3YXJuaW5nJywgJ2luZm8nLCAncXVlc3Rpb24nLCAnZXJyb3InXSk7XG5cbnZhciBzdGF0ZXMgPSB7XG4gIHByZXZpb3VzQm9keVBhZGRpbmc6IG51bGxcbn07XG52YXIgaGFzQ2xhc3MgPSBmdW5jdGlvbiBoYXNDbGFzcyhlbGVtLCBjbGFzc05hbWUpIHtcbiAgcmV0dXJuIGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG59O1xudmFyIGFwcGx5Q3VzdG9tQ2xhc3MgPSBmdW5jdGlvbiBhcHBseUN1c3RvbUNsYXNzKGVsZW0sIGN1c3RvbUNsYXNzLCBjbGFzc05hbWUpIHtcbiAgLy8gQ2xlYW4gdXAgcHJldmlvdXMgY3VzdG9tIGNsYXNzZXNcbiAgdG9BcnJheShlbGVtLmNsYXNzTGlzdCkuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKCEob2JqZWN0VmFsdWVzKHN3YWxDbGFzc2VzKS5pbmRleE9mKGNsYXNzTmFtZSkgIT09IC0xKSAmJiAhKG9iamVjdFZhbHVlcyhpY29uVHlwZXMpLmluZGV4T2YoY2xhc3NOYW1lKSAhPT0gLTEpKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChjdXN0b21DbGFzcyAmJiBjdXN0b21DbGFzc1tjbGFzc05hbWVdKSB7XG4gICAgYWRkQ2xhc3MoZWxlbSwgY3VzdG9tQ2xhc3NbY2xhc3NOYW1lXSk7XG4gIH1cbn07XG5mdW5jdGlvbiBnZXRJbnB1dChjb250ZW50LCBpbnB1dFR5cGUpIHtcbiAgaWYgKCFpbnB1dFR5cGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHN3aXRjaCAoaW5wdXRUeXBlKSB7XG4gICAgY2FzZSAnc2VsZWN0JzpcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgY2FzZSAnZmlsZSc6XG4gICAgICByZXR1cm4gZ2V0Q2hpbGRCeUNsYXNzKGNvbnRlbnQsIHN3YWxDbGFzc2VzW2lucHV0VHlwZV0pO1xuXG4gICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgcmV0dXJuIGNvbnRlbnQucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiIGlucHV0XCIpKTtcblxuICAgIGNhc2UgJ3JhZGlvJzpcbiAgICAgIHJldHVybiBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIiBpbnB1dDpjaGVja2VkXCIpKSB8fCBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnJhZGlvLCBcIiBpbnB1dDpmaXJzdC1jaGlsZFwiKSk7XG5cbiAgICBjYXNlICdyYW5nZSc6XG4gICAgICByZXR1cm4gY29udGVudC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5yYW5nZSwgXCIgaW5wdXRcIikpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBnZXRDaGlsZEJ5Q2xhc3MoY29udGVudCwgc3dhbENsYXNzZXMuaW5wdXQpO1xuICB9XG59XG52YXIgZm9jdXNJbnB1dCA9IGZ1bmN0aW9uIGZvY3VzSW5wdXQoaW5wdXQpIHtcbiAgaW5wdXQuZm9jdXMoKTsgLy8gcGxhY2UgY3Vyc29yIGF0IGVuZCBvZiB0ZXh0IGluIHRleHQgaW5wdXRcblxuICBpZiAoaW5wdXQudHlwZSAhPT0gJ2ZpbGUnKSB7XG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjM0NTkxNVxuICAgIHZhciB2YWwgPSBpbnB1dC52YWx1ZTtcbiAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgIGlucHV0LnZhbHVlID0gdmFsO1xuICB9XG59O1xudmFyIHRvZ2dsZUNsYXNzID0gZnVuY3Rpb24gdG9nZ2xlQ2xhc3ModGFyZ2V0LCBjbGFzc0xpc3QsIGNvbmRpdGlvbikge1xuICBpZiAoIXRhcmdldCB8fCAhY2xhc3NMaXN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjbGFzc0xpc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgY2xhc3NMaXN0ID0gY2xhc3NMaXN0LnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgY2xhc3NMaXN0LmZvckVhY2goZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgIGlmICh0YXJnZXQuZm9yRWFjaCkge1xuICAgICAgdGFyZ2V0LmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgY29uZGl0aW9uID8gZWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkgOiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25kaXRpb24gPyB0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpIDogdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciBhZGRDbGFzcyA9IGZ1bmN0aW9uIGFkZENsYXNzKHRhcmdldCwgY2xhc3NMaXN0KSB7XG4gIHRvZ2dsZUNsYXNzKHRhcmdldCwgY2xhc3NMaXN0LCB0cnVlKTtcbn07XG52YXIgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCkge1xuICB0b2dnbGVDbGFzcyh0YXJnZXQsIGNsYXNzTGlzdCwgZmFsc2UpO1xufTtcbnZhciBnZXRDaGlsZEJ5Q2xhc3MgPSBmdW5jdGlvbiBnZXRDaGlsZEJ5Q2xhc3MoZWxlbSwgY2xhc3NOYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGhhc0NsYXNzKGVsZW0uY2hpbGROb2Rlc1tpXSwgY2xhc3NOYW1lKSkge1xuICAgICAgcmV0dXJuIGVsZW0uY2hpbGROb2Rlc1tpXTtcbiAgICB9XG4gIH1cbn07XG52YXIgYXBwbHlOdW1lcmljYWxTdHlsZSA9IGZ1bmN0aW9uIGFwcGx5TnVtZXJpY2FsU3R5bGUoZWxlbSwgcHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSB8fCBwYXJzZUludCh2YWx1ZSkgPT09IDApIHtcbiAgICBlbGVtLnN0eWxlW3Byb3BlcnR5XSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSArICdweCcgOiB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnN0eWxlLnJlbW92ZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgfVxufTtcbnZhciBzaG93ID0gZnVuY3Rpb24gc2hvdyhlbGVtKSB7XG4gIHZhciBkaXNwbGF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnZmxleCc7XG4gIGVsZW0uc3R5bGUub3BhY2l0eSA9ICcnO1xuICBlbGVtLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5O1xufTtcbnZhciBoaWRlID0gZnVuY3Rpb24gaGlkZShlbGVtKSB7XG4gIGVsZW0uc3R5bGUub3BhY2l0eSA9ICcnO1xuICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG59O1xudmFyIHRvZ2dsZSA9IGZ1bmN0aW9uIHRvZ2dsZShlbGVtLCBjb25kaXRpb24sIGRpc3BsYXkpIHtcbiAgY29uZGl0aW9uID8gc2hvdyhlbGVtLCBkaXNwbGF5KSA6IGhpZGUoZWxlbSk7XG59OyAvLyBib3Jyb3dlZCBmcm9tIGpxdWVyeSAkKGVsZW0pLmlzKCc6dmlzaWJsZScpIGltcGxlbWVudGF0aW9uXG5cbnZhciBpc1Zpc2libGUgPSBmdW5jdGlvbiBpc1Zpc2libGUoZWxlbSkge1xuICByZXR1cm4gISEoZWxlbSAmJiAoZWxlbS5vZmZzZXRXaWR0aCB8fCBlbGVtLm9mZnNldEhlaWdodCB8fCBlbGVtLmdldENsaWVudFJlY3RzKCkubGVuZ3RoKSk7XG59O1xudmFyIGlzU2Nyb2xsYWJsZSA9IGZ1bmN0aW9uIGlzU2Nyb2xsYWJsZShlbGVtKSB7XG4gIHJldHVybiAhIShlbGVtLnNjcm9sbEhlaWdodCA+IGVsZW0uY2xpZW50SGVpZ2h0KTtcbn07IC8vIGJvcnJvd2VkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ2MzUyMTE5XG5cbnZhciBoYXNDc3NBbmltYXRpb24gPSBmdW5jdGlvbiBoYXNDc3NBbmltYXRpb24oZWxlbSkge1xuICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgdmFyIGFuaW1EdXJhdGlvbiA9IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYW5pbWF0aW9uLWR1cmF0aW9uJykgfHwgJzAnKTtcbiAgdmFyIHRyYW5zRHVyYXRpb24gPSBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zaXRpb24tZHVyYXRpb24nKSB8fCAnMCcpO1xuICByZXR1cm4gYW5pbUR1cmF0aW9uID4gMCB8fCB0cmFuc0R1cmF0aW9uID4gMDtcbn07XG52YXIgY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyhoYXlzdGFjaywgbmVlZGxlKSB7XG4gIGlmICh0eXBlb2YgaGF5c3RhY2suY29udGFpbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaGF5c3RhY2suY29udGFpbnMobmVlZGxlKTtcbiAgfVxufTtcblxudmFyIGdldENvbnRhaW5lciA9IGZ1bmN0aW9uIGdldENvbnRhaW5lcigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLicgKyBzd2FsQ2xhc3Nlcy5jb250YWluZXIpO1xufTtcbnZhciBlbGVtZW50QnlTZWxlY3RvciA9IGZ1bmN0aW9uIGVsZW1lbnRCeVNlbGVjdG9yKHNlbGVjdG9yU3RyaW5nKSB7XG4gIHZhciBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgcmV0dXJuIGNvbnRhaW5lciA/IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yU3RyaW5nKSA6IG51bGw7XG59O1xuXG52YXIgZWxlbWVudEJ5Q2xhc3MgPSBmdW5jdGlvbiBlbGVtZW50QnlDbGFzcyhjbGFzc05hbWUpIHtcbiAgcmV0dXJuIGVsZW1lbnRCeVNlbGVjdG9yKCcuJyArIGNsYXNzTmFtZSk7XG59O1xuXG52YXIgZ2V0UG9wdXAgPSBmdW5jdGlvbiBnZXRQb3B1cCgpIHtcbiAgcmV0dXJuIGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLnBvcHVwKTtcbn07XG52YXIgZ2V0SWNvbnMgPSBmdW5jdGlvbiBnZXRJY29ucygpIHtcbiAgdmFyIHBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgcmV0dXJuIHRvQXJyYXkocG9wdXAucXVlcnlTZWxlY3RvckFsbCgnLicgKyBzd2FsQ2xhc3Nlcy5pY29uKSk7XG59O1xudmFyIGdldEljb24gPSBmdW5jdGlvbiBnZXRJY29uKCkge1xuICB2YXIgdmlzaWJsZUljb24gPSBnZXRJY29ucygpLmZpbHRlcihmdW5jdGlvbiAoaWNvbikge1xuICAgIHJldHVybiBpc1Zpc2libGUoaWNvbik7XG4gIH0pO1xuICByZXR1cm4gdmlzaWJsZUljb24ubGVuZ3RoID8gdmlzaWJsZUljb25bMF0gOiBudWxsO1xufTtcbnZhciBnZXRUaXRsZSA9IGZ1bmN0aW9uIGdldFRpdGxlKCkge1xuICByZXR1cm4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMudGl0bGUpO1xufTtcbnZhciBnZXRDb250ZW50ID0gZnVuY3Rpb24gZ2V0Q29udGVudCgpIHtcbiAgcmV0dXJuIGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmNvbnRlbnQpO1xufTtcbnZhciBnZXRJbWFnZSA9IGZ1bmN0aW9uIGdldEltYWdlKCkge1xuICByZXR1cm4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuaW1hZ2UpO1xufTtcbnZhciBnZXRQcm9ncmVzc1N0ZXBzID0gZnVuY3Rpb24gZ2V0UHJvZ3Jlc3NTdGVwcygpIHtcbiAgcmV0dXJuIGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWydwcm9ncmVzcy1zdGVwcyddKTtcbn07XG52YXIgZ2V0VmFsaWRhdGlvbk1lc3NhZ2UgPSBmdW5jdGlvbiBnZXRWYWxpZGF0aW9uTWVzc2FnZSgpIHtcbiAgcmV0dXJuIGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG59O1xudmFyIGdldENvbmZpcm1CdXR0b24gPSBmdW5jdGlvbiBnZXRDb25maXJtQnV0dG9uKCkge1xuICByZXR1cm4gZWxlbWVudEJ5U2VsZWN0b3IoJy4nICsgc3dhbENsYXNzZXMuYWN0aW9ucyArICcgLicgKyBzd2FsQ2xhc3Nlcy5jb25maXJtKTtcbn07XG52YXIgZ2V0Q2FuY2VsQnV0dG9uID0gZnVuY3Rpb24gZ2V0Q2FuY2VsQnV0dG9uKCkge1xuICByZXR1cm4gZWxlbWVudEJ5U2VsZWN0b3IoJy4nICsgc3dhbENsYXNzZXMuYWN0aW9ucyArICcgLicgKyBzd2FsQ2xhc3Nlcy5jYW5jZWwpO1xufTtcbnZhciBnZXRBY3Rpb25zID0gZnVuY3Rpb24gZ2V0QWN0aW9ucygpIHtcbiAgcmV0dXJuIGVsZW1lbnRCeUNsYXNzKHN3YWxDbGFzc2VzLmFjdGlvbnMpO1xufTtcbnZhciBnZXRIZWFkZXIgPSBmdW5jdGlvbiBnZXRIZWFkZXIoKSB7XG4gIHJldHVybiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5oZWFkZXIpO1xufTtcbnZhciBnZXRGb290ZXIgPSBmdW5jdGlvbiBnZXRGb290ZXIoKSB7XG4gIHJldHVybiBlbGVtZW50QnlDbGFzcyhzd2FsQ2xhc3Nlcy5mb290ZXIpO1xufTtcbnZhciBnZXRDbG9zZUJ1dHRvbiA9IGZ1bmN0aW9uIGdldENsb3NlQnV0dG9uKCkge1xuICByZXR1cm4gZWxlbWVudEJ5Q2xhc3Moc3dhbENsYXNzZXMuY2xvc2UpO1xufTtcbnZhciBnZXRGb2N1c2FibGVFbGVtZW50cyA9IGZ1bmN0aW9uIGdldEZvY3VzYWJsZUVsZW1lbnRzKCkge1xuICB2YXIgZm9jdXNhYmxlRWxlbWVudHNXaXRoVGFiaW5kZXggPSB0b0FycmF5KGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbCgnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbdGFiaW5kZXg9XCIwXCJdKScpKSAvLyBzb3J0IGFjY29yZGluZyB0byB0YWJpbmRleFxuICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIGEgPSBwYXJzZUludChhLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSk7XG4gICAgYiA9IHBhcnNlSW50KGIuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKTtcblxuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChhIDwgYikge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9KTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL2prdXAvZm9jdXNhYmxlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5cbiAgdmFyIG90aGVyRm9jdXNhYmxlRWxlbWVudHMgPSB0b0FycmF5KGdldFBvcHVwKCkucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0sIGF1ZGlvW2NvbnRyb2xzXSwgdmlkZW9bY29udHJvbHNdJykpLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpICE9PSAnLTEnO1xuICB9KTtcbiAgcmV0dXJuIHVuaXF1ZUFycmF5KGZvY3VzYWJsZUVsZW1lbnRzV2l0aFRhYmluZGV4LmNvbmNhdChvdGhlckZvY3VzYWJsZUVsZW1lbnRzKSkuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgIHJldHVybiBpc1Zpc2libGUoZWwpO1xuICB9KTtcbn07XG52YXIgaXNNb2RhbCA9IGZ1bmN0aW9uIGlzTW9kYWwoKSB7XG4gIHJldHVybiAhaXNUb2FzdCgpICYmICFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG59O1xudmFyIGlzVG9hc3QgPSBmdW5jdGlvbiBpc1RvYXN0KCkge1xuICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoc3dhbENsYXNzZXNbJ3RvYXN0LXNob3duJ10pO1xufTtcbnZhciBpc0xvYWRpbmcgPSBmdW5jdGlvbiBpc0xvYWRpbmcoKSB7XG4gIHJldHVybiBnZXRQb3B1cCgpLmhhc0F0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJyk7XG59O1xuXG4vLyBEZXRlY3QgTm9kZSBlbnZcbnZhciBpc05vZGVFbnYgPSBmdW5jdGlvbiBpc05vZGVFbnYoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnO1xufTtcblxudmFyIHN3ZWV0SFRNTCA9IFwiXFxuIDxkaXYgYXJpYS1sYWJlbGxlZGJ5PVxcXCJcIi5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIiBhcmlhLWRlc2NyaWJlZGJ5PVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbnRlbnQsIFwiXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5wb3B1cCwgXCJcXFwiIHRhYmluZGV4PVxcXCItMVxcXCI+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5oZWFkZXIsIFwiXFxcIj5cXG4gICAgIDx1bCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcHMnXSwgXCJcXFwiPjwvdWw+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmljb24sIFwiIFwiKS5jb25jYXQoaWNvblR5cGVzLmVycm9yLCBcIlxcXCI+XFxuICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmtcXFwiPjxzcGFuIGNsYXNzPVxcXCJzd2FsMi14LW1hcmstbGluZS1sZWZ0XFxcIj48L3NwYW4+PHNwYW4gY2xhc3M9XFxcInN3YWwyLXgtbWFyay1saW5lLXJpZ2h0XFxcIj48L3NwYW4+PC9zcGFuPlxcbiAgICAgPC9kaXY+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmljb24sIFwiIFwiKS5jb25jYXQoaWNvblR5cGVzLnF1ZXN0aW9uLCBcIlxcXCI+PC9kaXY+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmljb24sIFwiIFwiKS5jb25jYXQoaWNvblR5cGVzLndhcm5pbmcsIFwiXFxcIj48L2Rpdj5cXG4gICAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuaWNvbiwgXCIgXCIpLmNvbmNhdChpY29uVHlwZXMuaW5mbywgXCJcXFwiPjwvZGl2PlxcbiAgICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pY29uLCBcIiBcIikuY29uY2F0KGljb25UeXBlcy5zdWNjZXNzLCBcIlxcXCI+XFxuICAgICAgIDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZS1sZWZ0XFxcIj48L2Rpdj5cXG4gICAgICAgPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS10aXBcXFwiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtbGluZS1sb25nXFxcIj48L3NwYW4+XFxuICAgICAgIDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtcmluZ1xcXCI+PC9kaXY+IDxkaXYgY2xhc3M9XFxcInN3YWwyLXN1Y2Nlc3MtZml4XFxcIj48L2Rpdj5cXG4gICAgICAgPGRpdiBjbGFzcz1cXFwic3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lLXJpZ2h0XFxcIj48L2Rpdj5cXG4gICAgIDwvZGl2PlxcbiAgICAgPGltZyBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbWFnZSwgXCJcXFwiIC8+XFxuICAgICA8aDIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMudGl0bGUsIFwiXFxcIiBpZD1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50aXRsZSwgXCJcXFwiPjwvaDI+XFxuICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2xvc2UsIFwiXFxcIj4mdGltZXM7PC9idXR0b24+XFxuICAgPC9kaXY+XFxuICAgPGRpdiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jb250ZW50LCBcIlxcXCI+XFxuICAgICA8ZGl2IGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbnRlbnQsIFwiXFxcIj48L2Rpdj5cXG4gICAgIDxpbnB1dCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5pbnB1dCwgXCJcXFwiIC8+XFxuICAgICA8aW5wdXQgdHlwZT1cXFwiZmlsZVxcXCIgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZmlsZSwgXCJcXFwiIC8+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIlxcXCI+XFxuICAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYW5nZVxcXCIgLz5cXG4gICAgICAgPG91dHB1dD48L291dHB1dD5cXG4gICAgIDwvZGl2PlxcbiAgICAgPHNlbGVjdCBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5zZWxlY3QsIFwiXFxcIj48L3NlbGVjdD5cXG4gICAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMucmFkaW8sIFwiXFxcIj48L2Rpdj5cXG4gICAgIDxsYWJlbCBmb3I9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuY2hlY2tib3gsIFwiXFxcIiBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCJcXFwiPlxcbiAgICAgICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIC8+XFxuICAgICAgIDxzcGFuIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmxhYmVsLCBcIlxcXCI+PC9zcGFuPlxcbiAgICAgPC9sYWJlbD5cXG4gICAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiXCIpLmNvbmNhdChzd2FsQ2xhc3Nlcy50ZXh0YXJlYSwgXCJcXFwiPjwvdGV4dGFyZWE+XFxuICAgICA8ZGl2IGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSwgXCJcXFwiIGlkPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSwgXCJcXFwiPjwvZGl2PlxcbiAgIDwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuYWN0aW9ucywgXCJcXFwiPlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNvbmZpcm0sIFwiXFxcIj5PSzwvYnV0dG9uPlxcbiAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJcIikuY29uY2F0KHN3YWxDbGFzc2VzLmNhbmNlbCwgXCJcXFwiPkNhbmNlbDwvYnV0dG9uPlxcbiAgIDwvZGl2PlxcbiAgIDxkaXYgY2xhc3M9XFxcIlwiKS5jb25jYXQoc3dhbENsYXNzZXMuZm9vdGVyLCBcIlxcXCI+XFxuICAgPC9kaXY+XFxuIDwvZGl2PlxcblwiKS5yZXBsYWNlKC8oXnxcXG4pXFxzKi9nLCAnJyk7XG5cbnZhciByZXNldE9sZENvbnRhaW5lciA9IGZ1bmN0aW9uIHJlc2V0T2xkQ29udGFpbmVyKCkge1xuICB2YXIgb2xkQ29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgaWYgKCFvbGRDb250YWluZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBvbGRDb250YWluZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGRDb250YWluZXIpO1xuICByZW1vdmVDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgW3N3YWxDbGFzc2VzWyduby1iYWNrZHJvcCddLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSwgc3dhbENsYXNzZXNbJ2hhcy1jb2x1bW4nXV0pO1xufTtcblxudmFyIG9sZElucHV0VmFsOyAvLyBJRTExIHdvcmthcm91bmQsIHNlZSAjMTEwOSBmb3IgZGV0YWlsc1xuXG52YXIgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSA9IGZ1bmN0aW9uIHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoZSkge1xuICBpZiAoU3dhbC5pc1Zpc2libGUoKSAmJiBvbGRJbnB1dFZhbCAhPT0gZS50YXJnZXQudmFsdWUpIHtcbiAgICBTd2FsLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcbiAgfVxuXG4gIG9sZElucHV0VmFsID0gZS50YXJnZXQudmFsdWU7XG59O1xuXG52YXIgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMgPSBmdW5jdGlvbiBhZGRJbnB1dENoYW5nZUxpc3RlbmVycygpIHtcbiAgdmFyIGNvbnRlbnQgPSBnZXRDb250ZW50KCk7XG4gIHZhciBpbnB1dCA9IGdldENoaWxkQnlDbGFzcyhjb250ZW50LCBzd2FsQ2xhc3Nlcy5pbnB1dCk7XG4gIHZhciBmaWxlID0gZ2V0Q2hpbGRCeUNsYXNzKGNvbnRlbnQsIHN3YWxDbGFzc2VzLmZpbGUpO1xuICB2YXIgcmFuZ2UgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLnJhbmdlLCBcIiBpbnB1dFwiKSk7XG4gIHZhciByYW5nZU91dHB1dCA9IGNvbnRlbnQucXVlcnlTZWxlY3RvcihcIi5cIi5jb25jYXQoc3dhbENsYXNzZXMucmFuZ2UsIFwiIG91dHB1dFwiKSk7XG4gIHZhciBzZWxlY3QgPSBnZXRDaGlsZEJ5Q2xhc3MoY29udGVudCwgc3dhbENsYXNzZXMuc2VsZWN0KTtcbiAgdmFyIGNoZWNrYm94ID0gY29udGVudC5xdWVyeVNlbGVjdG9yKFwiLlwiLmNvbmNhdChzd2FsQ2xhc3Nlcy5jaGVja2JveCwgXCIgaW5wdXRcIikpO1xuICB2YXIgdGV4dGFyZWEgPSBnZXRDaGlsZEJ5Q2xhc3MoY29udGVudCwgc3dhbENsYXNzZXMudGV4dGFyZWEpO1xuICBpbnB1dC5vbmlucHV0ID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgZmlsZS5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gIHNlbGVjdC5vbmNoYW5nZSA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG4gIGNoZWNrYm94Lm9uY2hhbmdlID0gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZTtcbiAgdGV4dGFyZWEub25pbnB1dCA9IHJlc2V0VmFsaWRhdGlvbk1lc3NhZ2U7XG5cbiAgcmFuZ2Uub25pbnB1dCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgcmVzZXRWYWxpZGF0aW9uTWVzc2FnZShlKTtcbiAgICByYW5nZU91dHB1dC52YWx1ZSA9IHJhbmdlLnZhbHVlO1xuICB9O1xuXG4gIHJhbmdlLm9uY2hhbmdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICByZXNldFZhbGlkYXRpb25NZXNzYWdlKGUpO1xuICAgIHJhbmdlLm5leHRTaWJsaW5nLnZhbHVlID0gcmFuZ2UudmFsdWU7XG4gIH07XG59O1xuXG52YXIgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICByZXR1cm4gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCkgOiB0YXJnZXQ7XG59O1xuXG52YXIgc2V0dXBBY2Nlc3NpYmlsaXR5ID0gZnVuY3Rpb24gc2V0dXBBY2Nlc3NpYmlsaXR5KHBhcmFtcykge1xuICB2YXIgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCBwYXJhbXMudG9hc3QgPyAnYWxlcnQnIDogJ2RpYWxvZycpO1xuICBwb3B1cC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsIHBhcmFtcy50b2FzdCA/ICdwb2xpdGUnIDogJ2Fzc2VydGl2ZScpO1xuXG4gIGlmICghcGFyYW1zLnRvYXN0KSB7XG4gICAgcG9wdXAuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgfVxufTtcblxudmFyIHNldHVwUlRMID0gZnVuY3Rpb24gc2V0dXBSVEwodGFyZ2V0RWxlbWVudCkge1xuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0RWxlbWVudCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIGFkZENsYXNzKGdldENvbnRhaW5lcigpLCBzd2FsQ2xhc3Nlcy5ydGwpO1xuICB9XG59O1xuLypcbiAqIEFkZCBtb2RhbCArIGJhY2tkcm9wIHRvIERPTVxuICovXG5cblxudmFyIGluaXQgPSBmdW5jdGlvbiBpbml0KHBhcmFtcykge1xuICAvLyBDbGVhbiB1cCB0aGUgb2xkIHBvcHVwIGNvbnRhaW5lciBpZiBpdCBleGlzdHNcbiAgcmVzZXRPbGRDb250YWluZXIoKTtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5cbiAgaWYgKGlzTm9kZUVudigpKSB7XG4gICAgZXJyb3IoJ1N3ZWV0QWxlcnQyIHJlcXVpcmVzIGRvY3VtZW50IHRvIGluaXRpYWxpemUnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5jb250YWluZXI7XG4gIGNvbnRhaW5lci5pbm5lckhUTUwgPSBzd2VldEhUTUw7XG4gIHZhciB0YXJnZXRFbGVtZW50ID0gZ2V0VGFyZ2V0KHBhcmFtcy50YXJnZXQpO1xuICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gIHNldHVwQWNjZXNzaWJpbGl0eShwYXJhbXMpO1xuICBzZXR1cFJUTCh0YXJnZXRFbGVtZW50KTtcbiAgYWRkSW5wdXRDaGFuZ2VMaXN0ZW5lcnMoKTtcbn07XG5cbnZhciBwYXJzZUh0bWxUb0NvbnRhaW5lciA9IGZ1bmN0aW9uIHBhcnNlSHRtbFRvQ29udGFpbmVyKHBhcmFtLCB0YXJnZXQpIHtcbiAgLy8gRE9NIGVsZW1lbnRcbiAgaWYgKHBhcmFtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocGFyYW0pOyAvLyBKUXVlcnkgZWxlbWVudChzKVxuICB9IGVsc2UgaWYgKF90eXBlb2YocGFyYW0pID09PSAnb2JqZWN0Jykge1xuICAgIGhhbmRsZUpxdWVyeUVsZW0odGFyZ2V0LCBwYXJhbSk7IC8vIFBsYWluIHN0cmluZ1xuICB9IGVsc2UgaWYgKHBhcmFtKSB7XG4gICAgdGFyZ2V0LmlubmVySFRNTCA9IHBhcmFtO1xuICB9XG59O1xuXG52YXIgaGFuZGxlSnF1ZXJ5RWxlbSA9IGZ1bmN0aW9uIGhhbmRsZUpxdWVyeUVsZW0odGFyZ2V0LCBlbGVtKSB7XG4gIHRhcmdldC5pbm5lckhUTUwgPSAnJztcblxuICBpZiAoMCBpbiBlbGVtKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgaW4gZWxlbTsgaSsrKSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbVtpXS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbS5jbG9uZU5vZGUodHJ1ZSkpO1xuICB9XG59O1xuXG52YXIgYW5pbWF0aW9uRW5kRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFByZXZlbnQgcnVuIGluIE5vZGUgZW52XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChpc05vZGVFbnYoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciB0ZXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAnV2Via2l0QW5pbWF0aW9uJzogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgJ09BbmltYXRpb24nOiAnb0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kJyxcbiAgICAnYW5pbWF0aW9uJzogJ2FuaW1hdGlvbmVuZCdcbiAgfTtcblxuICBmb3IgKHZhciBpIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgIGlmICh0cmFuc0VuZEV2ZW50TmFtZXMuaGFzT3duUHJvcGVydHkoaSkgJiYgdHlwZW9mIHRlc3RFbC5zdHlsZVtpXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufSgpO1xuXG4vLyBNZWFzdXJlIHdpZHRoIG9mIHNjcm9sbGJhclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL2pzL21vZGFsLmpzI0wyNzktTDI4NlxudmFyIG1lYXN1cmVTY3JvbGxiYXIgPSBmdW5jdGlvbiBtZWFzdXJlU2Nyb2xsYmFyKCkge1xuICB2YXIgc3VwcG9ydHNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCBuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cztcblxuICBpZiAoc3VwcG9ydHNUb3VjaCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzY3JvbGxEaXYuc3R5bGUud2lkdGggPSAnNTBweCc7XG4gIHNjcm9sbERpdi5zdHlsZS5oZWlnaHQgPSAnNTBweCc7XG4gIHNjcm9sbERpdi5zdHlsZS5vdmVyZmxvdyA9ICdzY3JvbGwnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG4gIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpO1xuICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG59O1xuXG5mdW5jdGlvbiBoYW5kbGVCdXR0b25zU3R5bGluZyhjb25maXJtQnV0dG9uLCBjYW5jZWxCdXR0b24sIHBhcmFtcykge1xuICBhZGRDbGFzcyhbY29uZmlybUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTsgLy8gQnV0dG9ucyBiYWNrZ3JvdW5kIGNvbG9yc1xuXG4gIGlmIChwYXJhbXMuY29uZmlybUJ1dHRvbkNvbG9yKSB7XG4gICAgY29uZmlybUJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY29uZmlybUJ1dHRvbkNvbG9yO1xuICB9XG5cbiAgaWYgKHBhcmFtcy5jYW5jZWxCdXR0b25Db2xvcikge1xuICAgIGNhbmNlbEJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuY2FuY2VsQnV0dG9uQ29sb3I7XG4gIH0gLy8gTG9hZGluZyBzdGF0ZVxuXG5cbiAgdmFyIGNvbmZpcm1CdXR0b25CYWNrZ3JvdW5kQ29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjb25maXJtQnV0dG9uKS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gIGNvbmZpcm1CdXR0b24uc3R5bGUuYm9yZGVyTGVmdENvbG9yID0gY29uZmlybUJ1dHRvbkJhY2tncm91bmRDb2xvcjtcbiAgY29uZmlybUJ1dHRvbi5zdHlsZS5ib3JkZXJSaWdodENvbG9yID0gY29uZmlybUJ1dHRvbkJhY2tncm91bmRDb2xvcjtcbn1cblxuZnVuY3Rpb24gcmVuZGVyQnV0dG9uKGJ1dHRvbiwgYnV0dG9uVHlwZSwgcGFyYW1zKSB7XG4gIHRvZ2dsZShidXR0b24sIHBhcmFtc1snc2hvd0MnICsgYnV0dG9uVHlwZS5zdWJzdHJpbmcoMSkgKyAnQnV0dG9uJ10sICdpbmxpbmUtYmxvY2snKTtcbiAgYnV0dG9uLmlubmVySFRNTCA9IHBhcmFtc1tidXR0b25UeXBlICsgJ0J1dHRvblRleHQnXTsgLy8gU2V0IGNhcHRpb24gdGV4dFxuXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwYXJhbXNbYnV0dG9uVHlwZSArICdCdXR0b25BcmlhTGFiZWwnXSk7IC8vIEFSSUEgbGFiZWxcbiAgLy8gQWRkIGJ1dHRvbnMgY3VzdG9tIGNsYXNzZXNcblxuICBidXR0b24uY2xhc3NOYW1lID0gc3dhbENsYXNzZXNbYnV0dG9uVHlwZV07XG4gIGFwcGx5Q3VzdG9tQ2xhc3MoYnV0dG9uLCBwYXJhbXMuY3VzdG9tQ2xhc3MsIGJ1dHRvblR5cGUgKyAnQnV0dG9uJyk7XG4gIGFkZENsYXNzKGJ1dHRvbiwgcGFyYW1zW2J1dHRvblR5cGUgKyAnQnV0dG9uQ2xhc3MnXSk7XG59XG5cbnZhciByZW5kZXJBY3Rpb25zID0gZnVuY3Rpb24gcmVuZGVyQWN0aW9ucyhpbnN0YW5jZSwgcGFyYW1zKSB7XG4gIHZhciBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICB2YXIgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgdmFyIGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpOyAvLyBBY3Rpb25zIChidXR0b25zKSB3cmFwcGVyXG5cbiAgaWYgKCFwYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gJiYgIXBhcmFtcy5zaG93Q2FuY2VsQnV0dG9uKSB7XG4gICAgaGlkZShhY3Rpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzaG93KGFjdGlvbnMpO1xuICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgYXBwbHlDdXN0b21DbGFzcyhhY3Rpb25zLCBwYXJhbXMuY3VzdG9tQ2xhc3MsICdhY3Rpb25zJyk7IC8vIFJlbmRlciBjb25maXJtIGJ1dHRvblxuXG4gIHJlbmRlckJ1dHRvbihjb25maXJtQnV0dG9uLCAnY29uZmlybScsIHBhcmFtcyk7IC8vIHJlbmRlciBDYW5jZWwgQnV0dG9uXG5cbiAgcmVuZGVyQnV0dG9uKGNhbmNlbEJ1dHRvbiwgJ2NhbmNlbCcsIHBhcmFtcyk7XG5cbiAgaWYgKHBhcmFtcy5idXR0b25zU3R5bGluZykge1xuICAgIGhhbmRsZUJ1dHRvbnNTdHlsaW5nKGNvbmZpcm1CdXR0b24sIGNhbmNlbEJ1dHRvbiwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICByZW1vdmVDbGFzcyhbY29uZmlybUJ1dHRvbiwgY2FuY2VsQnV0dG9uXSwgc3dhbENsYXNzZXMuc3R5bGVkKTtcbiAgICBjb25maXJtQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbmZpcm1CdXR0b24uc3R5bGUuYm9yZGVyTGVmdENvbG9yID0gY29uZmlybUJ1dHRvbi5zdHlsZS5ib3JkZXJSaWdodENvbG9yID0gJyc7XG4gICAgY2FuY2VsQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNhbmNlbEJ1dHRvbi5zdHlsZS5ib3JkZXJMZWZ0Q29sb3IgPSBjYW5jZWxCdXR0b24uc3R5bGUuYm9yZGVyUmlnaHRDb2xvciA9ICcnO1xuICB9XG59O1xuXG5mdW5jdGlvbiBoYW5kbGVCYWNrZHJvcFBhcmFtKGNvbnRhaW5lciwgYmFja2Ryb3ApIHtcbiAgaWYgKHR5cGVvZiBiYWNrZHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICBjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9IGJhY2tkcm9wO1xuICB9IGVsc2UgaWYgKCFiYWNrZHJvcCkge1xuICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snbm8tYmFja2Ryb3AnXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlUG9zaXRpb25QYXJhbShjb250YWluZXIsIHBvc2l0aW9uKSB7XG4gIGlmIChwb3NpdGlvbiBpbiBzd2FsQ2xhc3Nlcykge1xuICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbcG9zaXRpb25dKTtcbiAgfSBlbHNlIHtcbiAgICB3YXJuKCdUaGUgXCJwb3NpdGlvblwiIHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJjZW50ZXJcIicpO1xuICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXMuY2VudGVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBncm93KSB7XG4gIGlmIChncm93ICYmIHR5cGVvZiBncm93ID09PSAnc3RyaW5nJykge1xuICAgIHZhciBncm93Q2xhc3MgPSAnZ3Jvdy0nICsgZ3JvdztcblxuICAgIGlmIChncm93Q2xhc3MgaW4gc3dhbENsYXNzZXMpIHtcbiAgICAgIGFkZENsYXNzKGNvbnRhaW5lciwgc3dhbENsYXNzZXNbZ3Jvd0NsYXNzXSk7XG4gICAgfVxuICB9XG59XG5cbnZhciByZW5kZXJDb250YWluZXIgPSBmdW5jdGlvbiByZW5kZXJDb250YWluZXIoaW5zdGFuY2UsIHBhcmFtcykge1xuICB2YXIgY29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG5cbiAgaWYgKCFjb250YWluZXIpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBoYW5kbGVCYWNrZHJvcFBhcmFtKGNvbnRhaW5lciwgcGFyYW1zLmJhY2tkcm9wKTtcblxuICBpZiAoIXBhcmFtcy5iYWNrZHJvcCAmJiBwYXJhbXMuYWxsb3dPdXRzaWRlQ2xpY2spIHtcbiAgICB3YXJuKCdcImFsbG93T3V0c2lkZUNsaWNrXCIgcGFyYW1ldGVyIHJlcXVpcmVzIGBiYWNrZHJvcGAgcGFyYW1ldGVyIHRvIGJlIHNldCB0byBgdHJ1ZWAnKTtcbiAgfVxuXG4gIGhhbmRsZVBvc2l0aW9uUGFyYW0oY29udGFpbmVyLCBwYXJhbXMucG9zaXRpb24pO1xuICBoYW5kbGVHcm93UGFyYW0oY29udGFpbmVyLCBwYXJhbXMuZ3Jvdyk7IC8vIEN1c3RvbSBjbGFzc1xuXG4gIGFwcGx5Q3VzdG9tQ2xhc3MoY29udGFpbmVyLCBwYXJhbXMuY3VzdG9tQ2xhc3MsICdjb250YWluZXInKTtcblxuICBpZiAocGFyYW1zLmN1c3RvbUNvbnRhaW5lckNsYXNzKSB7XG4gICAgLy8gQGRlcHJlY2F0ZWRcbiAgICBhZGRDbGFzcyhjb250YWluZXIsIHBhcmFtcy5jdXN0b21Db250YWluZXJDbGFzcyk7XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgY29udGFpbnRzIGBXZWFrTWFwYHMgZm9yIGVhY2ggZWZmZWN0aXZlbHktXCJwcml2YXRlICBwcm9wZXJ0eVwiIHRoYXQgYSBgU3dhbGAgaGFzLlxuICogRm9yIGV4YW1wbGUsIHRvIHNldCB0aGUgcHJpdmF0ZSBwcm9wZXJ0eSBcImZvb1wiIG9mIGB0aGlzYCB0byBcImJhclwiLCB5b3UgY2FuIGBwcml2YXRlUHJvcHMuZm9vLnNldCh0aGlzLCAnYmFyJylgXG4gKiBUaGlzIGlzIHRoZSBhcHByb2FjaCB0aGF0IEJhYmVsIHdpbGwgcHJvYmFibHkgdGFrZSB0byBpbXBsZW1lbnQgcHJpdmF0ZSBtZXRob2RzL2ZpZWxkc1xuICogICBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1wcml2YXRlLW1ldGhvZHNcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL3B1bGwvNzU1NVxuICogT25jZSB3ZSBoYXZlIHRoZSBjaGFuZ2VzIGZyb20gdGhhdCBQUiBpbiBCYWJlbCwgYW5kIG91ciBjb3JlIGNsYXNzIGZpdHMgcmVhc29uYWJsZSBpbiAqb25lIG1vZHVsZSpcbiAqICAgdGhlbiB3ZSBjYW4gdXNlIHRoYXQgbGFuZ3VhZ2UgZmVhdHVyZS5cbiAqL1xudmFyIHByaXZhdGVQcm9wcyA9IHtcbiAgcHJvbWlzZTogbmV3IFdlYWtNYXAoKSxcbiAgaW5uZXJQYXJhbXM6IG5ldyBXZWFrTWFwKCksXG4gIGRvbUNhY2hlOiBuZXcgV2Vha01hcCgpXG59O1xuXG52YXIgcmVuZGVySW5wdXQgPSBmdW5jdGlvbiByZW5kZXJJbnB1dChpbnN0YW5jZSwgcGFyYW1zKSB7XG4gIHZhciBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpO1xuICB2YXIgcmVyZW5kZXIgPSAhaW5uZXJQYXJhbXMgfHwgcGFyYW1zLmlucHV0ICE9PSBpbm5lclBhcmFtcy5pbnB1dDtcbiAgdmFyIGNvbnRlbnQgPSBnZXRDb250ZW50KCk7XG4gIHZhciBpbnB1dFR5cGVzID0gWydpbnB1dCcsICdmaWxlJywgJ3JhbmdlJywgJ3NlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICd0ZXh0YXJlYSddO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpbnB1dENsYXNzID0gc3dhbENsYXNzZXNbaW5wdXRUeXBlc1tpXV07XG4gICAgdmFyIGlucHV0Q29udGFpbmVyID0gZ2V0Q2hpbGRCeUNsYXNzKGNvbnRlbnQsIGlucHV0Q2xhc3MpOyAvLyBzZXQgYXR0cmlidXRlc1xuXG4gICAgc2V0QXR0cmlidXRlcyhpbnB1dFR5cGVzW2ldLCBwYXJhbXMuaW5wdXRBdHRyaWJ1dGVzKTsgLy8gc2V0IGNsYXNzXG5cbiAgICBzZXRDbGFzcyhpbnB1dENvbnRhaW5lciwgaW5wdXRDbGFzcywgcGFyYW1zKTtcbiAgICByZXJlbmRlciAmJiBoaWRlKGlucHV0Q29udGFpbmVyKTtcbiAgfVxuXG4gIGlmICghcGFyYW1zLmlucHV0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFyZW5kZXJJbnB1dFR5cGVbcGFyYW1zLmlucHV0XSkge1xuICAgIHJldHVybiBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dCEgRXhwZWN0ZWQgXFxcInRleHRcXFwiLCBcXFwiZW1haWxcXFwiLCBcXFwicGFzc3dvcmRcXFwiLCBcXFwibnVtYmVyXFxcIiwgXFxcInRlbFxcXCIsIFxcXCJzZWxlY3RcXFwiLCBcXFwicmFkaW9cXFwiLCBcXFwiY2hlY2tib3hcXFwiLCBcXFwidGV4dGFyZWFcXFwiLCBcXFwiZmlsZVxcXCIgb3IgXFxcInVybFxcXCIsIGdvdCBcXFwiXCIuY29uY2F0KHBhcmFtcy5pbnB1dCwgXCJcXFwiXCIpKTtcbiAgfVxuXG4gIGlmIChyZXJlbmRlcikge1xuICAgIHZhciBpbnB1dCA9IHJlbmRlcklucHV0VHlwZVtwYXJhbXMuaW5wdXRdKHBhcmFtcyk7XG4gICAgc2hvdyhpbnB1dCk7XG4gIH1cbn07XG5cbnZhciByZW1vdmVBdHRyaWJ1dGVzID0gZnVuY3Rpb24gcmVtb3ZlQXR0cmlidXRlcyhpbnB1dCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYXR0ck5hbWUgPSBpbnB1dC5hdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICBpZiAoIShbJ3R5cGUnLCAndmFsdWUnLCAnc3R5bGUnXS5pbmRleE9mKGF0dHJOYW1lKSAhPT0gLTEpKSB7XG4gICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgIH1cbiAgfVxufTtcblxudmFyIHNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKGlucHV0VHlwZSwgaW5wdXRBdHRyaWJ1dGVzKSB7XG4gIHZhciBpbnB1dCA9IGdldElucHV0KGdldENvbnRlbnQoKSwgaW5wdXRUeXBlKTtcblxuICBpZiAoIWlucHV0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmVtb3ZlQXR0cmlidXRlcyhpbnB1dCk7XG5cbiAgZm9yICh2YXIgYXR0ciBpbiBpbnB1dEF0dHJpYnV0ZXMpIHtcbiAgICAvLyBEbyBub3Qgc2V0IGEgcGxhY2Vob2xkZXIgZm9yIDxpbnB1dCB0eXBlPVwicmFuZ2VcIj5cbiAgICAvLyBpdCdsbCBjcmFzaCBFZGdlLCAjMTI5OFxuICAgIGlmIChpbnB1dFR5cGUgPT09ICdyYW5nZScgJiYgYXR0ciA9PT0gJ3BsYWNlaG9sZGVyJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKGF0dHIsIGlucHV0QXR0cmlidXRlc1thdHRyXSk7XG4gIH1cbn07XG5cbnZhciBzZXRDbGFzcyA9IGZ1bmN0aW9uIHNldENsYXNzKGlucHV0Q29udGFpbmVyLCBpbnB1dENsYXNzLCBwYXJhbXMpIHtcbiAgaW5wdXRDb250YWluZXIuY2xhc3NOYW1lID0gaW5wdXRDbGFzcztcblxuICBpZiAocGFyYW1zLmlucHV0Q2xhc3MpIHtcbiAgICBhZGRDbGFzcyhpbnB1dENvbnRhaW5lciwgcGFyYW1zLmlucHV0Q2xhc3MpO1xuICB9XG5cbiAgaWYgKHBhcmFtcy5jdXN0b21DbGFzcykge1xuICAgIGFkZENsYXNzKGlucHV0Q29udGFpbmVyLCBwYXJhbXMuY3VzdG9tQ2xhc3MuaW5wdXQpO1xuICB9XG59O1xuXG52YXIgc2V0SW5wdXRQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIHNldElucHV0UGxhY2Vob2xkZXIoaW5wdXQsIHBhcmFtcykge1xuICBpZiAoIWlucHV0LnBsYWNlaG9sZGVyIHx8IHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyKSB7XG4gICAgaW5wdXQucGxhY2Vob2xkZXIgPSBwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcjtcbiAgfVxufTtcblxudmFyIHJlbmRlcklucHV0VHlwZSA9IHt9O1xuXG5yZW5kZXJJbnB1dFR5cGUudGV4dCA9IHJlbmRlcklucHV0VHlwZS5lbWFpbCA9IHJlbmRlcklucHV0VHlwZS5wYXNzd29yZCA9IHJlbmRlcklucHV0VHlwZS5udW1iZXIgPSByZW5kZXJJbnB1dFR5cGUudGVsID0gcmVuZGVySW5wdXRUeXBlLnVybCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIGlucHV0ID0gZ2V0Q2hpbGRCeUNsYXNzKGdldENvbnRlbnQoKSwgc3dhbENsYXNzZXMuaW5wdXQpO1xuXG4gIGlmICh0eXBlb2YgcGFyYW1zLmlucHV0VmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBwYXJhbXMuaW5wdXRWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICBpbnB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dFZhbHVlO1xuICB9IGVsc2UgaWYgKCFpc1Byb21pc2UocGFyYW1zLmlucHV0VmFsdWUpKSB7XG4gICAgd2FybihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dFZhbHVlISBFeHBlY3RlZCBcXFwic3RyaW5nXFxcIiwgXFxcIm51bWJlclxcXCIgb3IgXFxcIlByb21pc2VcXFwiLCBnb3QgXFxcIlwiLmNvbmNhdChfdHlwZW9mKHBhcmFtcy5pbnB1dFZhbHVlKSwgXCJcXFwiXCIpKTtcbiAgfVxuXG4gIHNldElucHV0UGxhY2Vob2xkZXIoaW5wdXQsIHBhcmFtcyk7XG4gIGlucHV0LnR5cGUgPSBwYXJhbXMuaW5wdXQ7XG4gIHJldHVybiBpbnB1dDtcbn07XG5cbnJlbmRlcklucHV0VHlwZS5maWxlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgaW5wdXQgPSBnZXRDaGlsZEJ5Q2xhc3MoZ2V0Q29udGVudCgpLCBzd2FsQ2xhc3Nlcy5maWxlKTtcbiAgc2V0SW5wdXRQbGFjZWhvbGRlcihpbnB1dCwgcGFyYW1zKTtcbiAgaW5wdXQudHlwZSA9IHBhcmFtcy5pbnB1dDtcbiAgcmV0dXJuIGlucHV0O1xufTtcblxucmVuZGVySW5wdXRUeXBlLnJhbmdlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgcmFuZ2UgPSBnZXRDaGlsZEJ5Q2xhc3MoZ2V0Q29udGVudCgpLCBzd2FsQ2xhc3Nlcy5yYW5nZSk7XG4gIHZhciByYW5nZUlucHV0ID0gcmFuZ2UucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcbiAgdmFyIHJhbmdlT3V0cHV0ID0gcmFuZ2UucXVlcnlTZWxlY3Rvcignb3V0cHV0Jyk7XG4gIHJhbmdlSW5wdXQudmFsdWUgPSBwYXJhbXMuaW5wdXRWYWx1ZTtcbiAgcmFuZ2VJbnB1dC50eXBlID0gcGFyYW1zLmlucHV0O1xuICByYW5nZU91dHB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dFZhbHVlO1xuICByZXR1cm4gcmFuZ2U7XG59O1xuXG5yZW5kZXJJbnB1dFR5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgc2VsZWN0ID0gZ2V0Q2hpbGRCeUNsYXNzKGdldENvbnRlbnQoKSwgc3dhbENsYXNzZXMuc2VsZWN0KTtcbiAgc2VsZWN0LmlubmVySFRNTCA9ICcnO1xuXG4gIGlmIChwYXJhbXMuaW5wdXRQbGFjZWhvbGRlcikge1xuICAgIHZhciBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIHBsYWNlaG9sZGVyLmlubmVySFRNTCA9IHBhcmFtcy5pbnB1dFBsYWNlaG9sZGVyO1xuICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XG4gICAgcGxhY2Vob2xkZXIuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHBsYWNlaG9sZGVyLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICBzZWxlY3QuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdDtcbn07XG5cbnJlbmRlcklucHV0VHlwZS5yYWRpbyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJhZGlvID0gZ2V0Q2hpbGRCeUNsYXNzKGdldENvbnRlbnQoKSwgc3dhbENsYXNzZXMucmFkaW8pO1xuICByYWRpby5pbm5lckhUTUwgPSAnJztcbiAgcmV0dXJuIHJhZGlvO1xufTtcblxucmVuZGVySW5wdXRUeXBlLmNoZWNrYm94ID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICB2YXIgY2hlY2tib3ggPSBnZXRDaGlsZEJ5Q2xhc3MoZ2V0Q29udGVudCgpLCBzd2FsQ2xhc3Nlcy5jaGVja2JveCk7XG4gIHZhciBjaGVja2JveElucHV0ID0gZ2V0SW5wdXQoZ2V0Q29udGVudCgpLCAnY2hlY2tib3gnKTtcbiAgY2hlY2tib3hJbnB1dC50eXBlID0gJ2NoZWNrYm94JztcbiAgY2hlY2tib3hJbnB1dC52YWx1ZSA9IDE7XG4gIGNoZWNrYm94SW5wdXQuaWQgPSBzd2FsQ2xhc3Nlcy5jaGVja2JveDtcbiAgY2hlY2tib3hJbnB1dC5jaGVja2VkID0gQm9vbGVhbihwYXJhbXMuaW5wdXRWYWx1ZSk7XG4gIHZhciBsYWJlbCA9IGNoZWNrYm94LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcbiAgbGFiZWwuaW5uZXJIVE1MID0gcGFyYW1zLmlucHV0UGxhY2Vob2xkZXI7XG4gIHJldHVybiBjaGVja2JveDtcbn07XG5cbnJlbmRlcklucHV0VHlwZS50ZXh0YXJlYSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgdmFyIHRleHRhcmVhID0gZ2V0Q2hpbGRCeUNsYXNzKGdldENvbnRlbnQoKSwgc3dhbENsYXNzZXMudGV4dGFyZWEpO1xuICB0ZXh0YXJlYS52YWx1ZSA9IHBhcmFtcy5pbnB1dFZhbHVlO1xuICBzZXRJbnB1dFBsYWNlaG9sZGVyKHRleHRhcmVhLCBwYXJhbXMpO1xuICByZXR1cm4gdGV4dGFyZWE7XG59O1xuXG52YXIgcmVuZGVyQ29udGVudCA9IGZ1bmN0aW9uIHJlbmRlckNvbnRlbnQoaW5zdGFuY2UsIHBhcmFtcykge1xuICB2YXIgY29udGVudCA9IGdldENvbnRlbnQoKS5xdWVyeVNlbGVjdG9yKCcjJyArIHN3YWxDbGFzc2VzLmNvbnRlbnQpOyAvLyBDb250ZW50IGFzIEhUTUxcblxuICBpZiAocGFyYW1zLmh0bWwpIHtcbiAgICBwYXJzZUh0bWxUb0NvbnRhaW5lcihwYXJhbXMuaHRtbCwgY29udGVudCk7XG4gICAgc2hvdyhjb250ZW50LCAnYmxvY2snKTsgLy8gQ29udGVudCBhcyBwbGFpbiB0ZXh0XG4gIH0gZWxzZSBpZiAocGFyYW1zLnRleHQpIHtcbiAgICBjb250ZW50LnRleHRDb250ZW50ID0gcGFyYW1zLnRleHQ7XG4gICAgc2hvdyhjb250ZW50LCAnYmxvY2snKTsgLy8gTm8gY29udGVudFxuICB9IGVsc2Uge1xuICAgIGhpZGUoY29udGVudCk7XG4gIH1cblxuICByZW5kZXJJbnB1dChpbnN0YW5jZSwgcGFyYW1zKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgYXBwbHlDdXN0b21DbGFzcyhnZXRDb250ZW50KCksIHBhcmFtcy5jdXN0b21DbGFzcywgJ2NvbnRlbnQnKTtcbn07XG5cbnZhciByZW5kZXJGb290ZXIgPSBmdW5jdGlvbiByZW5kZXJGb290ZXIoaW5zdGFuY2UsIHBhcmFtcykge1xuICB2YXIgZm9vdGVyID0gZ2V0Rm9vdGVyKCk7XG4gIHRvZ2dsZShmb290ZXIsIHBhcmFtcy5mb290ZXIpO1xuXG4gIGlmIChwYXJhbXMuZm9vdGVyKSB7XG4gICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLmZvb3RlciwgZm9vdGVyKTtcbiAgfSAvLyBDdXN0b20gY2xhc3NcblxuXG4gIGFwcGx5Q3VzdG9tQ2xhc3MoZm9vdGVyLCBwYXJhbXMuY3VzdG9tQ2xhc3MsICdmb290ZXInKTtcbn07XG5cbnZhciByZW5kZXJDbG9zZUJ1dHRvbiA9IGZ1bmN0aW9uIHJlbmRlckNsb3NlQnV0dG9uKGluc3RhbmNlLCBwYXJhbXMpIHtcbiAgdmFyIGNsb3NlQnV0dG9uID0gZ2V0Q2xvc2VCdXR0b24oKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgYXBwbHlDdXN0b21DbGFzcyhjbG9zZUJ1dHRvbiwgcGFyYW1zLmN1c3RvbUNsYXNzLCAnY2xvc2VCdXR0b24nKTtcbiAgdG9nZ2xlKGNsb3NlQnV0dG9uLCBwYXJhbXMuc2hvd0Nsb3NlQnV0dG9uKTtcbiAgY2xvc2VCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgcGFyYW1zLmNsb3NlQnV0dG9uQXJpYUxhYmVsKTtcbn07XG5cbnZhciByZW5kZXJJY29uID0gZnVuY3Rpb24gcmVuZGVySWNvbihpbnN0YW5jZSwgcGFyYW1zKSB7XG4gIHZhciBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQoaW5zdGFuY2UpOyAvLyBpZiB0aGUgaWNvbiB3aXRoIHRoZSBnaXZlbiB0eXBlIGFscmVhZHkgcmVuZGVyZWQsXG4gIC8vIGFwcGx5IHRoZSBjdXN0b20gY2xhc3Mgd2l0aG91dCByZS1yZW5kZXJpbmcgdGhlIGljb25cblxuICBpZiAoaW5uZXJQYXJhbXMgJiYgcGFyYW1zLnR5cGUgPT09IGlubmVyUGFyYW1zLnR5cGUgJiYgZ2V0SWNvbigpKSB7XG4gICAgYXBwbHlDdXN0b21DbGFzcyhnZXRJY29uKCksIHBhcmFtcy5jdXN0b21DbGFzcywgJ2ljb24nKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBoaWRlQWxsSWNvbnMoKTtcblxuICBpZiAoIXBhcmFtcy50eXBlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ291bmRDb2xvcigpO1xuXG4gIGlmIChPYmplY3Qua2V5cyhpY29uVHlwZXMpLmluZGV4T2YocGFyYW1zLnR5cGUpICE9PSAtMSkge1xuICAgIHZhciBpY29uID0gZWxlbWVudEJ5U2VsZWN0b3IoXCIuXCIuY29uY2F0KHN3YWxDbGFzc2VzLmljb24sIFwiLlwiKS5jb25jYXQoaWNvblR5cGVzW3BhcmFtcy50eXBlXSkpO1xuICAgIHNob3coaWNvbik7IC8vIEN1c3RvbSBjbGFzc1xuXG4gICAgYXBwbHlDdXN0b21DbGFzcyhpY29uLCBwYXJhbXMuY3VzdG9tQ2xhc3MsICdpY29uJyk7IC8vIEFuaW1hdGUgaWNvblxuXG4gICAgdG9nZ2xlQ2xhc3MoaWNvbiwgXCJzd2FsMi1hbmltYXRlLVwiLmNvbmNhdChwYXJhbXMudHlwZSwgXCItaWNvblwiKSwgcGFyYW1zLmFuaW1hdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IoXCJVbmtub3duIHR5cGUhIEV4cGVjdGVkIFxcXCJzdWNjZXNzXFxcIiwgXFxcImVycm9yXFxcIiwgXFxcIndhcm5pbmdcXFwiLCBcXFwiaW5mb1xcXCIgb3IgXFxcInF1ZXN0aW9uXFxcIiwgZ290IFxcXCJcIi5jb25jYXQocGFyYW1zLnR5cGUsIFwiXFxcIlwiKSk7XG4gIH1cbn07XG5cbnZhciBoaWRlQWxsSWNvbnMgPSBmdW5jdGlvbiBoaWRlQWxsSWNvbnMoKSB7XG4gIHZhciBpY29ucyA9IGdldEljb25zKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpY29ucy5sZW5ndGg7IGkrKykge1xuICAgIGhpZGUoaWNvbnNbaV0pO1xuICB9XG59OyAvLyBBZGp1c3Qgc3VjY2VzcyBpY29uIGJhY2tncm91bmQgY29sb3IgdG8gbWF0Y2ggdGhlIHBvcHVwIGJhY2tncm91bmQgY29sb3JcblxuXG52YXIgYWRqdXN0U3VjY2Vzc0ljb25CYWNrZ291bmRDb2xvciA9IGZ1bmN0aW9uIGFkanVzdFN1Y2Nlc3NJY29uQmFja2dvdW5kQ29sb3IoKSB7XG4gIHZhciBwb3B1cCA9IGdldFBvcHVwKCk7XG4gIHZhciBwb3B1cEJhY2tncm91bmRDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBvcHVwKS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gIHZhciBzdWNjZXNzSWNvblBhcnRzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdLCAuc3dhbDItc3VjY2Vzcy1maXgnKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN1Y2Nlc3NJY29uUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICBzdWNjZXNzSWNvblBhcnRzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBvcHVwQmFja2dyb3VuZENvbG9yO1xuICB9XG59O1xuXG52YXIgcmVuZGVySW1hZ2UgPSBmdW5jdGlvbiByZW5kZXJJbWFnZShpbnN0YW5jZSwgcGFyYW1zKSB7XG4gIHZhciBpbWFnZSA9IGdldEltYWdlKCk7XG5cbiAgaWYgKCFwYXJhbXMuaW1hZ2VVcmwpIHtcbiAgICByZXR1cm4gaGlkZShpbWFnZSk7XG4gIH1cblxuICBzaG93KGltYWdlKTsgLy8gU3JjLCBhbHRcblxuICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHBhcmFtcy5pbWFnZVVybCk7XG4gIGltYWdlLnNldEF0dHJpYnV0ZSgnYWx0JywgcGFyYW1zLmltYWdlQWx0KTsgLy8gV2lkdGgsIGhlaWdodFxuXG4gIGFwcGx5TnVtZXJpY2FsU3R5bGUoaW1hZ2UsICd3aWR0aCcsIHBhcmFtcy5pbWFnZVdpZHRoKTtcbiAgYXBwbHlOdW1lcmljYWxTdHlsZShpbWFnZSwgJ2hlaWdodCcsIHBhcmFtcy5pbWFnZUhlaWdodCk7IC8vIENsYXNzXG5cbiAgaW1hZ2UuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMuaW1hZ2U7XG4gIGFwcGx5Q3VzdG9tQ2xhc3MoaW1hZ2UsIHBhcmFtcy5jdXN0b21DbGFzcywgJ2ltYWdlJyk7XG5cbiAgaWYgKHBhcmFtcy5pbWFnZUNsYXNzKSB7XG4gICAgYWRkQ2xhc3MoaW1hZ2UsIHBhcmFtcy5pbWFnZUNsYXNzKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZVN0ZXBFbGVtZW50ID0gZnVuY3Rpb24gY3JlYXRlU3RlcEVsZW1lbnQoc3RlcCkge1xuICB2YXIgc3RlcEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgYWRkQ2xhc3Moc3RlcEVsLCBzd2FsQ2xhc3Nlc1sncHJvZ3Jlc3Mtc3RlcCddKTtcbiAgc3RlcEVsLmlubmVySFRNTCA9IHN0ZXA7XG4gIHJldHVybiBzdGVwRWw7XG59O1xuXG52YXIgY3JlYXRlTGluZUVsZW1lbnQgPSBmdW5jdGlvbiBjcmVhdGVMaW5lRWxlbWVudChwYXJhbXMpIHtcbiAgdmFyIGxpbmVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGFkZENsYXNzKGxpbmVFbCwgc3dhbENsYXNzZXNbJ3Byb2dyZXNzLXN0ZXAtbGluZSddKTtcblxuICBpZiAocGFyYW1zLnByb2dyZXNzU3RlcHNEaXN0YW5jZSkge1xuICAgIGxpbmVFbC5zdHlsZS53aWR0aCA9IHBhcmFtcy5wcm9ncmVzc1N0ZXBzRGlzdGFuY2U7XG4gIH1cblxuICByZXR1cm4gbGluZUVsO1xufTtcblxudmFyIHJlbmRlclByb2dyZXNzU3RlcHMgPSBmdW5jdGlvbiByZW5kZXJQcm9ncmVzc1N0ZXBzKGluc3RhbmNlLCBwYXJhbXMpIHtcbiAgdmFyIHByb2dyZXNzU3RlcHNDb250YWluZXIgPSBnZXRQcm9ncmVzc1N0ZXBzKCk7XG5cbiAgaWYgKCFwYXJhbXMucHJvZ3Jlc3NTdGVwcyB8fCBwYXJhbXMucHJvZ3Jlc3NTdGVwcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gaGlkZShwcm9ncmVzc1N0ZXBzQ29udGFpbmVyKTtcbiAgfVxuXG4gIHNob3cocHJvZ3Jlc3NTdGVwc0NvbnRhaW5lcik7XG4gIHByb2dyZXNzU3RlcHNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gIHZhciBjdXJyZW50UHJvZ3Jlc3NTdGVwID0gcGFyc2VJbnQocGFyYW1zLmN1cnJlbnRQcm9ncmVzc1N0ZXAgPT09IG51bGwgPyBTd2FsLmdldFF1ZXVlU3RlcCgpIDogcGFyYW1zLmN1cnJlbnRQcm9ncmVzc1N0ZXApO1xuXG4gIGlmIChjdXJyZW50UHJvZ3Jlc3NTdGVwID49IHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmxlbmd0aCkge1xuICAgIHdhcm4oJ0ludmFsaWQgY3VycmVudFByb2dyZXNzU3RlcCBwYXJhbWV0ZXIsIGl0IHNob3VsZCBiZSBsZXNzIHRoYW4gcHJvZ3Jlc3NTdGVwcy5sZW5ndGggJyArICcoY3VycmVudFByb2dyZXNzU3RlcCBsaWtlIEpTIGFycmF5cyBzdGFydHMgZnJvbSAwKScpO1xuICB9XG5cbiAgcGFyYW1zLnByb2dyZXNzU3RlcHMuZm9yRWFjaChmdW5jdGlvbiAoc3RlcCwgaW5kZXgpIHtcbiAgICB2YXIgc3RlcEVsID0gY3JlYXRlU3RlcEVsZW1lbnQoc3RlcCk7XG4gICAgcHJvZ3Jlc3NTdGVwc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGVwRWwpO1xuXG4gICAgaWYgKGluZGV4ID09PSBjdXJyZW50UHJvZ3Jlc3NTdGVwKSB7XG4gICAgICBhZGRDbGFzcyhzdGVwRWwsIHN3YWxDbGFzc2VzWydhY3RpdmUtcHJvZ3Jlc3Mtc3RlcCddKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggIT09IHBhcmFtcy5wcm9ncmVzc1N0ZXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHZhciBsaW5lRWwgPSBjcmVhdGVMaW5lRWxlbWVudChzdGVwKTtcbiAgICAgIHByb2dyZXNzU3RlcHNDb250YWluZXIuYXBwZW5kQ2hpbGQobGluZUVsKTtcbiAgICB9XG4gIH0pO1xufTtcblxudmFyIHJlbmRlclRpdGxlID0gZnVuY3Rpb24gcmVuZGVyVGl0bGUoaW5zdGFuY2UsIHBhcmFtcykge1xuICB2YXIgdGl0bGUgPSBnZXRUaXRsZSgpO1xuICB0b2dnbGUodGl0bGUsIHBhcmFtcy50aXRsZSB8fCBwYXJhbXMudGl0bGVUZXh0KTtcblxuICBpZiAocGFyYW1zLnRpdGxlKSB7XG4gICAgcGFyc2VIdG1sVG9Db250YWluZXIocGFyYW1zLnRpdGxlLCB0aXRsZSk7XG4gIH1cblxuICBpZiAocGFyYW1zLnRpdGxlVGV4dCkge1xuICAgIHRpdGxlLmlubmVyVGV4dCA9IHBhcmFtcy50aXRsZVRleHQ7XG4gIH0gLy8gQ3VzdG9tIGNsYXNzXG5cblxuICBhcHBseUN1c3RvbUNsYXNzKHRpdGxlLCBwYXJhbXMuY3VzdG9tQ2xhc3MsICd0aXRsZScpO1xufTtcblxudmFyIHJlbmRlckhlYWRlciA9IGZ1bmN0aW9uIHJlbmRlckhlYWRlcihpbnN0YW5jZSwgcGFyYW1zKSB7XG4gIHZhciBoZWFkZXIgPSBnZXRIZWFkZXIoKTsgLy8gQ3VzdG9tIGNsYXNzXG5cbiAgYXBwbHlDdXN0b21DbGFzcyhoZWFkZXIsIHBhcmFtcy5jdXN0b21DbGFzcywgJ2hlYWRlcicpOyAvLyBQcm9ncmVzcyBzdGVwc1xuXG4gIHJlbmRlclByb2dyZXNzU3RlcHMoaW5zdGFuY2UsIHBhcmFtcyk7IC8vIEljb25cblxuICByZW5kZXJJY29uKGluc3RhbmNlLCBwYXJhbXMpOyAvLyBJbWFnZVxuXG4gIHJlbmRlckltYWdlKGluc3RhbmNlLCBwYXJhbXMpOyAvLyBUaXRsZVxuXG4gIHJlbmRlclRpdGxlKGluc3RhbmNlLCBwYXJhbXMpOyAvLyBDbG9zZSBidXR0b25cblxuICByZW5kZXJDbG9zZUJ1dHRvbihpbnN0YW5jZSwgcGFyYW1zKTtcbn07XG5cbnZhciByZW5kZXJQb3B1cCA9IGZ1bmN0aW9uIHJlbmRlclBvcHVwKGluc3RhbmNlLCBwYXJhbXMpIHtcbiAgdmFyIHBvcHVwID0gZ2V0UG9wdXAoKTsgLy8gV2lkdGhcblxuICBhcHBseU51bWVyaWNhbFN0eWxlKHBvcHVwLCAnd2lkdGgnLCBwYXJhbXMud2lkdGgpOyAvLyBQYWRkaW5nXG5cbiAgYXBwbHlOdW1lcmljYWxTdHlsZShwb3B1cCwgJ3BhZGRpbmcnLCBwYXJhbXMucGFkZGluZyk7IC8vIEJhY2tncm91bmRcblxuICBpZiAocGFyYW1zLmJhY2tncm91bmQpIHtcbiAgICBwb3B1cC5zdHlsZS5iYWNrZ3JvdW5kID0gcGFyYW1zLmJhY2tncm91bmQ7XG4gIH0gLy8gRGVmYXVsdCBDbGFzc1xuXG5cbiAgcG9wdXAuY2xhc3NOYW1lID0gc3dhbENsYXNzZXMucG9wdXA7XG5cbiAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1sndG9hc3Qtc2hvd24nXSk7XG4gICAgYWRkQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnRvYXN0KTtcbiAgfSBlbHNlIHtcbiAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMubW9kYWwpO1xuICB9IC8vIEN1c3RvbSBjbGFzc1xuXG5cbiAgYXBwbHlDdXN0b21DbGFzcyhwb3B1cCwgcGFyYW1zLmN1c3RvbUNsYXNzLCAncG9wdXAnKTtcblxuICBpZiAodHlwZW9mIHBhcmFtcy5jdXN0b21DbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICBhZGRDbGFzcyhwb3B1cCwgcGFyYW1zLmN1c3RvbUNsYXNzKTtcbiAgfSAvLyBDU1MgYW5pbWF0aW9uXG5cblxuICB0b2dnbGVDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMubm9hbmltYXRpb24sICFwYXJhbXMuYW5pbWF0aW9uKTtcbn07XG5cbnZhciByZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoaW5zdGFuY2UsIHBhcmFtcykge1xuICByZW5kZXJQb3B1cChpbnN0YW5jZSwgcGFyYW1zKTtcbiAgcmVuZGVyQ29udGFpbmVyKGluc3RhbmNlLCBwYXJhbXMpO1xuICByZW5kZXJIZWFkZXIoaW5zdGFuY2UsIHBhcmFtcyk7XG4gIHJlbmRlckNvbnRlbnQoaW5zdGFuY2UsIHBhcmFtcyk7XG4gIHJlbmRlckFjdGlvbnMoaW5zdGFuY2UsIHBhcmFtcyk7XG4gIHJlbmRlckZvb3RlcihpbnN0YW5jZSwgcGFyYW1zKTtcbn07XG5cbi8qXG4gKiBHbG9iYWwgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIFN3ZWV0QWxlcnQyIHBvcHVwIGlzIHNob3duXG4gKi9cblxudmFyIGlzVmlzaWJsZSQxID0gZnVuY3Rpb24gaXNWaXNpYmxlJCQxKCkge1xuICByZXR1cm4gaXNWaXNpYmxlKGdldFBvcHVwKCkpO1xufTtcbi8qXG4gKiBHbG9iYWwgZnVuY3Rpb24gdG8gY2xpY2sgJ0NvbmZpcm0nIGJ1dHRvblxuICovXG5cbnZhciBjbGlja0NvbmZpcm0gPSBmdW5jdGlvbiBjbGlja0NvbmZpcm0oKSB7XG4gIHJldHVybiBnZXRDb25maXJtQnV0dG9uKCkgJiYgZ2V0Q29uZmlybUJ1dHRvbigpLmNsaWNrKCk7XG59O1xuLypcbiAqIEdsb2JhbCBmdW5jdGlvbiB0byBjbGljayAnQ2FuY2VsJyBidXR0b25cbiAqL1xuXG52YXIgY2xpY2tDYW5jZWwgPSBmdW5jdGlvbiBjbGlja0NhbmNlbCgpIHtcbiAgcmV0dXJuIGdldENhbmNlbEJ1dHRvbigpICYmIGdldENhbmNlbEJ1dHRvbigpLmNsaWNrKCk7XG59O1xuXG5mdW5jdGlvbiBmaXJlKCkge1xuICB2YXIgU3dhbCA9IHRoaXM7XG5cbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBfY29uc3RydWN0KFN3YWwsIGFyZ3MpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gZXh0ZW5kZWQgdmVyc2lvbiBvZiBgU3dhbGAgY29udGFpbmluZyBgcGFyYW1zYCBhcyBkZWZhdWx0cy5cbiAqIFVzZWZ1bCBmb3IgcmV1c2luZyBTd2FsIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogQmVmb3JlOlxuICogY29uc3QgdGV4dFByb21wdE9wdGlvbnMgPSB7IGlucHV0OiAndGV4dCcsIHNob3dDYW5jZWxCdXR0b246IHRydWUgfVxuICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgU3dhbC5maXJlKHsgLi4udGV4dFByb21wdE9wdGlvbnMsIHRpdGxlOiAnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JyB9KVxuICogY29uc3Qge3ZhbHVlOiBsYXN0TmFtZX0gPSBhd2FpdCBTd2FsLmZpcmUoeyAuLi50ZXh0UHJvbXB0T3B0aW9ucywgdGl0bGU6ICdXaGF0IGlzIHlvdXIgbGFzdCBuYW1lPycgfSlcbiAqXG4gKiBBZnRlcjpcbiAqIGNvbnN0IFRleHRQcm9tcHQgPSBTd2FsLm1peGluKHsgaW5wdXQ6ICd0ZXh0Jywgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSB9KVxuICogY29uc3Qge3ZhbHVlOiBmaXJzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGZpcnN0IG5hbWU/JylcbiAqIGNvbnN0IHt2YWx1ZTogbGFzdE5hbWV9ID0gYXdhaXQgVGV4dFByb21wdCgnV2hhdCBpcyB5b3VyIGxhc3QgbmFtZT8nKVxuICpcbiAqIEBwYXJhbSBtaXhpblBhcmFtc1xuICovXG5mdW5jdGlvbiBtaXhpbihtaXhpblBhcmFtcykge1xuICB2YXIgTWl4aW5Td2FsID1cbiAgLyojX19QVVJFX18qL1xuICBmdW5jdGlvbiAoX3RoaXMpIHtcbiAgICBfaW5oZXJpdHMoTWl4aW5Td2FsLCBfdGhpcyk7XG5cbiAgICBmdW5jdGlvbiBNaXhpblN3YWwoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWl4aW5Td2FsKTtcblxuICAgICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9nZXRQcm90b3R5cGVPZihNaXhpblN3YWwpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhNaXhpblN3YWwsIFt7XG4gICAgICBrZXk6IFwiX21haW5cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfbWFpbihwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIF9nZXQoX2dldFByb3RvdHlwZU9mKE1peGluU3dhbC5wcm90b3R5cGUpLCBcIl9tYWluXCIsIHRoaXMpLmNhbGwodGhpcywgX2V4dGVuZHMoe30sIG1peGluUGFyYW1zLCBwYXJhbXMpKTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gTWl4aW5Td2FsO1xuICB9KHRoaXMpO1xuXG4gIHJldHVybiBNaXhpblN3YWw7XG59XG5cbi8vIHByaXZhdGUgZ2xvYmFsIHN0YXRlIGZvciB0aGUgcXVldWUgZmVhdHVyZVxudmFyIGN1cnJlbnRTdGVwcyA9IFtdO1xuLypcbiAqIEdsb2JhbCBmdW5jdGlvbiBmb3IgY2hhaW5pbmcgc3dlZXRBbGVydCBwb3B1cHNcbiAqL1xuXG52YXIgcXVldWUgPSBmdW5jdGlvbiBxdWV1ZShzdGVwcykge1xuICB2YXIgU3dhbCA9IHRoaXM7XG4gIGN1cnJlbnRTdGVwcyA9IHN0ZXBzO1xuXG4gIHZhciByZXNldEFuZFJlc29sdmUgPSBmdW5jdGlvbiByZXNldEFuZFJlc29sdmUocmVzb2x2ZSwgdmFsdWUpIHtcbiAgICBjdXJyZW50U3RlcHMgPSBbXTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zd2FsMi1xdWV1ZS1zdGVwJyk7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH07XG5cbiAgdmFyIHF1ZXVlUmVzdWx0ID0gW107XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIChmdW5jdGlvbiBzdGVwKGksIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoaSA8IGN1cnJlbnRTdGVwcy5sZW5ndGgpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dhbDItcXVldWUtc3RlcCcsIGkpO1xuICAgICAgICBTd2FsLmZpcmUoY3VycmVudFN0ZXBzW2ldKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdC52YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHF1ZXVlUmVzdWx0LnB1c2gocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgIHN0ZXAoaSArIDEsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzZXRBbmRSZXNvbHZlKHJlc29sdmUsIHtcbiAgICAgICAgICAgICAgZGlzbWlzczogcmVzdWx0LmRpc21pc3NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNldEFuZFJlc29sdmUocmVzb2x2ZSwge1xuICAgICAgICAgIHZhbHVlOiBxdWV1ZVJlc3VsdFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSgwKTtcbiAgfSk7XG59O1xuLypcbiAqIEdsb2JhbCBmdW5jdGlvbiBmb3IgZ2V0dGluZyB0aGUgaW5kZXggb2YgY3VycmVudCBwb3B1cCBpbiBxdWV1ZVxuICovXG5cbnZhciBnZXRRdWV1ZVN0ZXAgPSBmdW5jdGlvbiBnZXRRdWV1ZVN0ZXAoKSB7XG4gIHJldHVybiBkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS1zd2FsMi1xdWV1ZS1zdGVwJyk7XG59O1xuLypcbiAqIEdsb2JhbCBmdW5jdGlvbiBmb3IgaW5zZXJ0aW5nIGEgcG9wdXAgdG8gdGhlIHF1ZXVlXG4gKi9cblxudmFyIGluc2VydFF1ZXVlU3RlcCA9IGZ1bmN0aW9uIGluc2VydFF1ZXVlU3RlcChzdGVwLCBpbmRleCkge1xuICBpZiAoaW5kZXggJiYgaW5kZXggPCBjdXJyZW50U3RlcHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRTdGVwcy5zcGxpY2UoaW5kZXgsIDAsIHN0ZXApO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRTdGVwcy5wdXNoKHN0ZXApO1xufTtcbi8qXG4gKiBHbG9iYWwgZnVuY3Rpb24gZm9yIGRlbGV0aW5nIGEgcG9wdXAgZnJvbSB0aGUgcXVldWVcbiAqL1xuXG52YXIgZGVsZXRlUXVldWVTdGVwID0gZnVuY3Rpb24gZGVsZXRlUXVldWVTdGVwKGluZGV4KSB7XG4gIGlmICh0eXBlb2YgY3VycmVudFN0ZXBzW2luZGV4XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjdXJyZW50U3RlcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTaG93IHNwaW5uZXIgaW5zdGVhZCBvZiBDb25maXJtIGJ1dHRvbiBhbmQgZGlzYWJsZSBDYW5jZWwgYnV0dG9uXG4gKi9cblxudmFyIHNob3dMb2FkaW5nID0gZnVuY3Rpb24gc2hvd0xvYWRpbmcoKSB7XG4gIHZhciBwb3B1cCA9IGdldFBvcHVwKCk7XG5cbiAgaWYgKCFwb3B1cCkge1xuICAgIFN3YWwuZmlyZSgnJyk7XG4gIH1cblxuICBwb3B1cCA9IGdldFBvcHVwKCk7XG4gIHZhciBhY3Rpb25zID0gZ2V0QWN0aW9ucygpO1xuICB2YXIgY29uZmlybUJ1dHRvbiA9IGdldENvbmZpcm1CdXR0b24oKTtcbiAgdmFyIGNhbmNlbEJ1dHRvbiA9IGdldENhbmNlbEJ1dHRvbigpO1xuICBzaG93KGFjdGlvbnMpO1xuICBzaG93KGNvbmZpcm1CdXR0b24pO1xuICBhZGRDbGFzcyhbcG9wdXAsIGFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgY29uZmlybUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIGNhbmNlbEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gIHBvcHVwLnNldEF0dHJpYnV0ZSgnZGF0YS1sb2FkaW5nJywgdHJ1ZSk7XG4gIHBvcHVwLnNldEF0dHJpYnV0ZSgnYXJpYS1idXN5JywgdHJ1ZSk7XG4gIHBvcHVwLmZvY3VzKCk7XG59O1xuXG52YXIgUkVTVE9SRV9GT0NVU19USU1FT1VUID0gMTAwO1xuXG52YXIgZ2xvYmFsU3RhdGUgPSB7fTtcbnZhciBmb2N1c1ByZXZpb3VzQWN0aXZlRWxlbWVudCA9IGZ1bmN0aW9uIGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50KCkge1xuICBpZiAoZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ICYmIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudC5mb2N1cykge1xuICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIGdsb2JhbFN0YXRlLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IG51bGw7XG4gIH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgIGRvY3VtZW50LmJvZHkuZm9jdXMoKTtcbiAgfVxufTsgLy8gUmVzdG9yZSBwcmV2aW91cyBhY3RpdmUgKGZvY3VzZWQpIGVsZW1lbnRcblxuXG52YXIgcmVzdG9yZUFjdGl2ZUVsZW1lbnQgPSBmdW5jdGlvbiByZXN0b3JlQWN0aXZlRWxlbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgdmFyIHggPSB3aW5kb3cuc2Nyb2xsWDtcbiAgICB2YXIgeSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGdsb2JhbFN0YXRlLnJlc3RvcmVGb2N1c1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvY3VzUHJldmlvdXNBY3RpdmVFbGVtZW50KCk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSwgUkVTVE9SRV9GT0NVU19USU1FT1VUKTsgLy8gaXNzdWVzLzkwMFxuXG4gICAgaWYgKHR5cGVvZiB4ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgeSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIElFIGRvZXNuJ3QgaGF2ZSBzY3JvbGxYL3Njcm9sbFkgc3VwcG9ydFxuICAgICAgd2luZG93LnNjcm9sbFRvKHgsIHkpO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzIHNldCwgcmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICogT3RoZXJ3aXNlLCByZXR1cm5zIHVuZGVmaW5lZC5cbiAqL1xuXG52YXIgZ2V0VGltZXJMZWZ0ID0gZnVuY3Rpb24gZ2V0VGltZXJMZWZ0KCkge1xuICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dCAmJiBnbG9iYWxTdGF0ZS50aW1lb3V0LmdldFRpbWVyTGVmdCgpO1xufTtcbi8qKlxuICogU3RvcCB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAqL1xuXG52YXIgc3RvcFRpbWVyID0gZnVuY3Rpb24gc3RvcFRpbWVyKCkge1xuICByZXR1cm4gZ2xvYmFsU3RhdGUudGltZW91dCAmJiBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0b3AoKTtcbn07XG4vKipcbiAqIFJlc3VtZSB0aW1lci4gUmV0dXJucyBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIG9mIHRpbWVyIHJlbWFpbmVkLlxuICogSWYgYHRpbWVyYCBwYXJhbWV0ZXIgaXNuJ3Qgc2V0LCByZXR1cm5zIHVuZGVmaW5lZC5cbiAqL1xuXG52YXIgcmVzdW1lVGltZXIgPSBmdW5jdGlvbiByZXN1bWVUaW1lcigpIHtcbiAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5zdGFydCgpO1xufTtcbi8qKlxuICogUmVzdW1lIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgdGltZXIgcmVtYWluZWQuXG4gKiBJZiBgdGltZXJgIHBhcmFtZXRlciBpc24ndCBzZXQsIHJldHVybnMgdW5kZWZpbmVkLlxuICovXG5cbnZhciB0b2dnbGVUaW1lciA9IGZ1bmN0aW9uIHRvZ2dsZVRpbWVyKCkge1xuICB2YXIgdGltZXIgPSBnbG9iYWxTdGF0ZS50aW1lb3V0O1xuICByZXR1cm4gdGltZXIgJiYgKHRpbWVyLnJ1bm5pbmcgPyB0aW1lci5zdG9wKCkgOiB0aW1lci5zdGFydCgpKTtcbn07XG4vKipcbiAqIEluY3JlYXNlIHRpbWVyLiBSZXR1cm5zIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb2YgYW4gdXBkYXRlZCB0aW1lci5cbiAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWQuXG4gKi9cblxudmFyIGluY3JlYXNlVGltZXIgPSBmdW5jdGlvbiBpbmNyZWFzZVRpbWVyKG4pIHtcbiAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5pbmNyZWFzZShuKTtcbn07XG4vKipcbiAqIENoZWNrIGlmIHRpbWVyIGlzIHJ1bm5pbmcuIFJldHVybnMgdHJ1ZSBpZiB0aW1lciBpcyBydW5uaW5nXG4gKiBvciBmYWxzZSBpZiB0aW1lciBpcyBwYXVzZWQgb3Igc3RvcHBlZC5cbiAqIElmIGB0aW1lcmAgcGFyYW1ldGVyIGlzbid0IHNldCwgcmV0dXJucyB1bmRlZmluZWRcbiAqL1xuXG52YXIgaXNUaW1lclJ1bm5pbmcgPSBmdW5jdGlvbiBpc1RpbWVyUnVubmluZygpIHtcbiAgcmV0dXJuIGdsb2JhbFN0YXRlLnRpbWVvdXQgJiYgZ2xvYmFsU3RhdGUudGltZW91dC5pc1J1bm5pbmcoKTtcbn07XG5cbnZhciBkZWZhdWx0UGFyYW1zID0ge1xuICB0aXRsZTogJycsXG4gIHRpdGxlVGV4dDogJycsXG4gIHRleHQ6ICcnLFxuICBodG1sOiAnJyxcbiAgZm9vdGVyOiAnJyxcbiAgdHlwZTogbnVsbCxcbiAgdG9hc3Q6IGZhbHNlLFxuICBjdXN0b21DbGFzczogJycsXG4gIGN1c3RvbUNvbnRhaW5lckNsYXNzOiAnJyxcbiAgdGFyZ2V0OiAnYm9keScsXG4gIGJhY2tkcm9wOiB0cnVlLFxuICBhbmltYXRpb246IHRydWUsXG4gIGhlaWdodEF1dG86IHRydWUsXG4gIGFsbG93T3V0c2lkZUNsaWNrOiB0cnVlLFxuICBhbGxvd0VzY2FwZUtleTogdHJ1ZSxcbiAgYWxsb3dFbnRlcktleTogdHJ1ZSxcbiAgc3RvcEtleWRvd25Qcm9wYWdhdGlvbjogdHJ1ZSxcbiAga2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTogZmFsc2UsXG4gIHNob3dDb25maXJtQnV0dG9uOiB0cnVlLFxuICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgcHJlQ29uZmlybTogbnVsbCxcbiAgY29uZmlybUJ1dHRvblRleHQ6ICdPSycsXG4gIGNvbmZpcm1CdXR0b25BcmlhTGFiZWw6ICcnLFxuICBjb25maXJtQnV0dG9uQ29sb3I6IG51bGwsXG4gIGNvbmZpcm1CdXR0b25DbGFzczogJycsXG4gIGNhbmNlbEJ1dHRvblRleHQ6ICdDYW5jZWwnLFxuICBjYW5jZWxCdXR0b25BcmlhTGFiZWw6ICcnLFxuICBjYW5jZWxCdXR0b25Db2xvcjogbnVsbCxcbiAgY2FuY2VsQnV0dG9uQ2xhc3M6ICcnLFxuICBidXR0b25zU3R5bGluZzogdHJ1ZSxcbiAgcmV2ZXJzZUJ1dHRvbnM6IGZhbHNlLFxuICBmb2N1c0NvbmZpcm06IHRydWUsXG4gIGZvY3VzQ2FuY2VsOiBmYWxzZSxcbiAgc2hvd0Nsb3NlQnV0dG9uOiBmYWxzZSxcbiAgY2xvc2VCdXR0b25BcmlhTGFiZWw6ICdDbG9zZSB0aGlzIGRpYWxvZycsXG4gIHNob3dMb2FkZXJPbkNvbmZpcm06IGZhbHNlLFxuICBpbWFnZVVybDogbnVsbCxcbiAgaW1hZ2VXaWR0aDogbnVsbCxcbiAgaW1hZ2VIZWlnaHQ6IG51bGwsXG4gIGltYWdlQWx0OiAnJyxcbiAgaW1hZ2VDbGFzczogJycsXG4gIHRpbWVyOiBudWxsLFxuICB3aWR0aDogbnVsbCxcbiAgcGFkZGluZzogbnVsbCxcbiAgYmFja2dyb3VuZDogbnVsbCxcbiAgaW5wdXQ6IG51bGwsXG4gIGlucHV0UGxhY2Vob2xkZXI6ICcnLFxuICBpbnB1dFZhbHVlOiAnJyxcbiAgaW5wdXRPcHRpb25zOiB7fSxcbiAgaW5wdXRBdXRvVHJpbTogdHJ1ZSxcbiAgaW5wdXRDbGFzczogJycsXG4gIGlucHV0QXR0cmlidXRlczoge30sXG4gIGlucHV0VmFsaWRhdG9yOiBudWxsLFxuICB2YWxpZGF0aW9uTWVzc2FnZTogbnVsbCxcbiAgZ3JvdzogZmFsc2UsXG4gIHBvc2l0aW9uOiAnY2VudGVyJyxcbiAgcHJvZ3Jlc3NTdGVwczogW10sXG4gIGN1cnJlbnRQcm9ncmVzc1N0ZXA6IG51bGwsXG4gIHByb2dyZXNzU3RlcHNEaXN0YW5jZTogbnVsbCxcbiAgb25CZWZvcmVPcGVuOiBudWxsLFxuICBvbkFmdGVyQ2xvc2U6IG51bGwsXG4gIG9uT3BlbjogbnVsbCxcbiAgb25DbG9zZTogbnVsbCxcbiAgc2Nyb2xsYmFyUGFkZGluZzogdHJ1ZVxufTtcbnZhciB1cGRhdGFibGVQYXJhbXMgPSBbJ3RpdGxlJywgJ3RpdGxlVGV4dCcsICd0ZXh0JywgJ2h0bWwnLCAndHlwZScsICdjdXN0b21DbGFzcycsICdzaG93Q29uZmlybUJ1dHRvbicsICdzaG93Q2FuY2VsQnV0dG9uJywgJ2NvbmZpcm1CdXR0b25UZXh0JywgJ2NvbmZpcm1CdXR0b25BcmlhTGFiZWwnLCAnY29uZmlybUJ1dHRvbkNvbG9yJywgJ2NvbmZpcm1CdXR0b25DbGFzcycsICdjYW5jZWxCdXR0b25UZXh0JywgJ2NhbmNlbEJ1dHRvbkFyaWFMYWJlbCcsICdjYW5jZWxCdXR0b25Db2xvcicsICdjYW5jZWxCdXR0b25DbGFzcycsICdidXR0b25zU3R5bGluZycsICdyZXZlcnNlQnV0dG9ucycsICdpbWFnZVVybCcsICdpbWFnZVdpZHRoJywgJ2ltYWdlSGVpZ3RoJywgJ2ltYWdlQWx0JywgJ2ltYWdlQ2xhc3MnLCAncHJvZ3Jlc3NTdGVwcycsICdjdXJyZW50UHJvZ3Jlc3NTdGVwJ107XG52YXIgZGVwcmVjYXRlZFBhcmFtcyA9IHtcbiAgY3VzdG9tQ29udGFpbmVyQ2xhc3M6ICdjdXN0b21DbGFzcycsXG4gIGNvbmZpcm1CdXR0b25DbGFzczogJ2N1c3RvbUNsYXNzJyxcbiAgY2FuY2VsQnV0dG9uQ2xhc3M6ICdjdXN0b21DbGFzcycsXG4gIGltYWdlQ2xhc3M6ICdjdXN0b21DbGFzcycsXG4gIGlucHV0Q2xhc3M6ICdjdXN0b21DbGFzcydcbn07XG52YXIgdG9hc3RJbmNvbXBhdGlibGVQYXJhbXMgPSBbJ2FsbG93T3V0c2lkZUNsaWNrJywgJ2FsbG93RW50ZXJLZXknLCAnYmFja2Ryb3AnLCAnZm9jdXNDb25maXJtJywgJ2ZvY3VzQ2FuY2VsJywgJ2hlaWdodEF1dG8nLCAna2V5ZG93bkxpc3RlbmVyQ2FwdHVyZSddO1xuLyoqXG4gKiBJcyB2YWxpZCBwYXJhbWV0ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbU5hbWVcbiAqL1xuXG52YXIgaXNWYWxpZFBhcmFtZXRlciA9IGZ1bmN0aW9uIGlzVmFsaWRQYXJhbWV0ZXIocGFyYW1OYW1lKSB7XG4gIHJldHVybiBkZWZhdWx0UGFyYW1zLmhhc093blByb3BlcnR5KHBhcmFtTmFtZSk7XG59O1xuLyoqXG4gKiBJcyB2YWxpZCBwYXJhbWV0ZXIgZm9yIFN3YWwudXBkYXRlKCkgbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1OYW1lXG4gKi9cblxudmFyIGlzVXBkYXRhYmxlUGFyYW1ldGVyID0gZnVuY3Rpb24gaXNVcGRhdGFibGVQYXJhbWV0ZXIocGFyYW1OYW1lKSB7XG4gIHJldHVybiB1cGRhdGFibGVQYXJhbXMuaW5kZXhPZihwYXJhbU5hbWUpICE9PSAtMTtcbn07XG4vKipcbiAqIElzIGRlcHJlY2F0ZWQgcGFyYW1ldGVyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1OYW1lXG4gKi9cblxudmFyIGlzRGVwcmVjYXRlZFBhcmFtZXRlciA9IGZ1bmN0aW9uIGlzRGVwcmVjYXRlZFBhcmFtZXRlcihwYXJhbU5hbWUpIHtcbiAgcmV0dXJuIGRlcHJlY2F0ZWRQYXJhbXNbcGFyYW1OYW1lXTtcbn07XG5cbnZhciBjaGVja0lmUGFyYW1Jc1ZhbGlkID0gZnVuY3Rpb24gY2hlY2tJZlBhcmFtSXNWYWxpZChwYXJhbSkge1xuICBpZiAoIWlzVmFsaWRQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgd2FybihcIlVua25vd24gcGFyYW1ldGVyIFxcXCJcIi5jb25jYXQocGFyYW0sIFwiXFxcIlwiKSk7XG4gIH1cbn07XG5cbnZhciBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQgPSBmdW5jdGlvbiBjaGVja0lmVG9hc3RQYXJhbUlzVmFsaWQocGFyYW0pIHtcbiAgaWYgKHRvYXN0SW5jb21wYXRpYmxlUGFyYW1zLmluZGV4T2YocGFyYW0pICE9PSAtMSkge1xuICAgIHdhcm4oXCJUaGUgcGFyYW1ldGVyIFxcXCJcIi5jb25jYXQocGFyYW0sIFwiXFxcIiBpcyBpbmNvbXBhdGlibGUgd2l0aCB0b2FzdHNcIikpO1xuICB9XG59O1xuXG52YXIgY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkID0gZnVuY3Rpb24gY2hlY2tJZlBhcmFtSXNEZXByZWNhdGVkKHBhcmFtKSB7XG4gIGlmIChpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIocGFyYW0pKSB7XG4gICAgd2FybkFib3V0RGVwcmVhdGlvbihwYXJhbSwgaXNEZXByZWNhdGVkUGFyYW1ldGVyKHBhcmFtKSk7XG4gIH1cbn07XG4vKipcbiAqIFNob3cgcmVsZXZhbnQgd2FybmluZ3MgZm9yIGdpdmVuIHBhcmFtc1xuICpcbiAqIEBwYXJhbSBwYXJhbXNcbiAqL1xuXG5cbnZhciBzaG93V2FybmluZ3NGb3JQYXJhbXMgPSBmdW5jdGlvbiBzaG93V2FybmluZ3NGb3JQYXJhbXMocGFyYW1zKSB7XG4gIGZvciAodmFyIHBhcmFtIGluIHBhcmFtcykge1xuICAgIGNoZWNrSWZQYXJhbUlzVmFsaWQocGFyYW0pO1xuXG4gICAgaWYgKHBhcmFtcy50b2FzdCkge1xuICAgICAgY2hlY2tJZlRvYXN0UGFyYW1Jc1ZhbGlkKHBhcmFtKTtcbiAgICB9XG5cbiAgICBjaGVja0lmUGFyYW1Jc0RlcHJlY2F0ZWQoKTtcbiAgfVxufTtcblxuXG5cbnZhciBzdGF0aWNNZXRob2RzID0gT2JqZWN0LmZyZWV6ZSh7XG5cdGlzVmFsaWRQYXJhbWV0ZXI6IGlzVmFsaWRQYXJhbWV0ZXIsXG5cdGlzVXBkYXRhYmxlUGFyYW1ldGVyOiBpc1VwZGF0YWJsZVBhcmFtZXRlcixcblx0aXNEZXByZWNhdGVkUGFyYW1ldGVyOiBpc0RlcHJlY2F0ZWRQYXJhbWV0ZXIsXG5cdGFyZ3NUb1BhcmFtczogYXJnc1RvUGFyYW1zLFxuXHRpc1Zpc2libGU6IGlzVmlzaWJsZSQxLFxuXHRjbGlja0NvbmZpcm06IGNsaWNrQ29uZmlybSxcblx0Y2xpY2tDYW5jZWw6IGNsaWNrQ2FuY2VsLFxuXHRnZXRDb250YWluZXI6IGdldENvbnRhaW5lcixcblx0Z2V0UG9wdXA6IGdldFBvcHVwLFxuXHRnZXRUaXRsZTogZ2V0VGl0bGUsXG5cdGdldENvbnRlbnQ6IGdldENvbnRlbnQsXG5cdGdldEltYWdlOiBnZXRJbWFnZSxcblx0Z2V0SWNvbjogZ2V0SWNvbixcblx0Z2V0SWNvbnM6IGdldEljb25zLFxuXHRnZXRDbG9zZUJ1dHRvbjogZ2V0Q2xvc2VCdXR0b24sXG5cdGdldEFjdGlvbnM6IGdldEFjdGlvbnMsXG5cdGdldENvbmZpcm1CdXR0b246IGdldENvbmZpcm1CdXR0b24sXG5cdGdldENhbmNlbEJ1dHRvbjogZ2V0Q2FuY2VsQnV0dG9uLFxuXHRnZXRIZWFkZXI6IGdldEhlYWRlcixcblx0Z2V0Rm9vdGVyOiBnZXRGb290ZXIsXG5cdGdldEZvY3VzYWJsZUVsZW1lbnRzOiBnZXRGb2N1c2FibGVFbGVtZW50cyxcblx0Z2V0VmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlLFxuXHRpc0xvYWRpbmc6IGlzTG9hZGluZyxcblx0ZmlyZTogZmlyZSxcblx0bWl4aW46IG1peGluLFxuXHRxdWV1ZTogcXVldWUsXG5cdGdldFF1ZXVlU3RlcDogZ2V0UXVldWVTdGVwLFxuXHRpbnNlcnRRdWV1ZVN0ZXA6IGluc2VydFF1ZXVlU3RlcCxcblx0ZGVsZXRlUXVldWVTdGVwOiBkZWxldGVRdWV1ZVN0ZXAsXG5cdHNob3dMb2FkaW5nOiBzaG93TG9hZGluZyxcblx0ZW5hYmxlTG9hZGluZzogc2hvd0xvYWRpbmcsXG5cdGdldFRpbWVyTGVmdDogZ2V0VGltZXJMZWZ0LFxuXHRzdG9wVGltZXI6IHN0b3BUaW1lcixcblx0cmVzdW1lVGltZXI6IHJlc3VtZVRpbWVyLFxuXHR0b2dnbGVUaW1lcjogdG9nZ2xlVGltZXIsXG5cdGluY3JlYXNlVGltZXI6IGluY3JlYXNlVGltZXIsXG5cdGlzVGltZXJSdW5uaW5nOiBpc1RpbWVyUnVubmluZ1xufSk7XG5cbi8qKlxuICogRW5hYmxlcyBidXR0b25zIGFuZCBoaWRlIGxvYWRlci5cbiAqL1xuXG5mdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgdmFyIGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcbiAgdmFyIGRvbUNhY2hlID0gcHJpdmF0ZVByb3BzLmRvbUNhY2hlLmdldCh0aGlzKTtcblxuICBpZiAoIWlubmVyUGFyYW1zLnNob3dDb25maXJtQnV0dG9uKSB7XG4gICAgaGlkZShkb21DYWNoZS5jb25maXJtQnV0dG9uKTtcblxuICAgIGlmICghaW5uZXJQYXJhbXMuc2hvd0NhbmNlbEJ1dHRvbikge1xuICAgICAgaGlkZShkb21DYWNoZS5hY3Rpb25zKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVDbGFzcyhbZG9tQ2FjaGUucG9wdXAsIGRvbUNhY2hlLmFjdGlvbnNdLCBzd2FsQ2xhc3Nlcy5sb2FkaW5nKTtcbiAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWJ1c3knKTtcbiAgZG9tQ2FjaGUucG9wdXAucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnKTtcbiAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICBkb21DYWNoZS5jYW5jZWxCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5wdXQkMShpbnN0YW5jZSkge1xuICB2YXIgaW5uZXJQYXJhbXMgPSBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuZ2V0KGluc3RhbmNlIHx8IHRoaXMpO1xuICB2YXIgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KGluc3RhbmNlIHx8IHRoaXMpO1xuICByZXR1cm4gZ2V0SW5wdXQoZG9tQ2FjaGUuY29udGVudCwgaW5uZXJQYXJhbXMuaW5wdXQpO1xufVxuXG52YXIgZml4U2Nyb2xsYmFyID0gZnVuY3Rpb24gZml4U2Nyb2xsYmFyKCkge1xuICAvLyBmb3IgcXVldWVzLCBkbyBub3QgZG8gdGhpcyBtb3JlIHRoYW4gb25jZVxuICBpZiAoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gaWYgdGhlIGJvZHkgaGFzIG92ZXJmbG93XG5cblxuICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAvLyBhZGQgcGFkZGluZyBzbyB0aGUgY29udGVudCBkb2Vzbid0IHNoaWZ0IGFmdGVyIHJlbW92YWwgb2Ygc2Nyb2xsYmFyXG4gICAgc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgPSBwYXJzZUludCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JykpO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgKyBtZWFzdXJlU2Nyb2xsYmFyKCkgKyAncHgnO1xuICB9XG59O1xudmFyIHVuZG9TY3JvbGxiYXIgPSBmdW5jdGlvbiB1bmRvU2Nyb2xsYmFyKCkge1xuICBpZiAoc3RhdGVzLnByZXZpb3VzQm9keVBhZGRpbmcgIT09IG51bGwpIHtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IHN0YXRlcy5wcmV2aW91c0JvZHlQYWRkaW5nICsgJ3B4JztcbiAgICBzdGF0ZXMucHJldmlvdXNCb2R5UGFkZGluZyA9IG51bGw7XG4gIH1cbn07XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbnZhciBpT1NmaXggPSBmdW5jdGlvbiBpT1NmaXgoKSB7XG4gIHZhciBpT1MgPSAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtO1xuXG4gIGlmIChpT1MgJiYgIWhhc0NsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzLmlvc2ZpeCkpIHtcbiAgICB2YXIgb2Zmc2V0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBvZmZzZXQgKiAtMSArICdweCc7XG4gICAgYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KTtcbiAgICBsb2NrQm9keVNjcm9sbCgpO1xuICB9XG59O1xuXG52YXIgbG9ja0JvZHlTY3JvbGwgPSBmdW5jdGlvbiBsb2NrQm9keVNjcm9sbCgpIHtcbiAgLy8gIzEyNDZcbiAgdmFyIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICB2YXIgcHJldmVudFRvdWNoTW92ZTtcblxuICBjb250YWluZXIub250b3VjaHN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICBwcmV2ZW50VG91Y2hNb3ZlID0gZS50YXJnZXQgPT09IGNvbnRhaW5lciB8fCAhaXNTY3JvbGxhYmxlKGNvbnRhaW5lcik7XG4gIH07XG5cbiAgY29udGFpbmVyLm9udG91Y2htb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAocHJldmVudFRvdWNoTW92ZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuXG52YXIgdW5kb0lPU2ZpeCA9IGZ1bmN0aW9uIHVuZG9JT1NmaXgoKSB7XG4gIGlmIChoYXNDbGFzcyhkb2N1bWVudC5ib2R5LCBzd2FsQ2xhc3Nlcy5pb3NmaXgpKSB7XG4gICAgdmFyIG9mZnNldCA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuc3R5bGUudG9wLCAxMCk7XG4gICAgcmVtb3ZlQ2xhc3MoZG9jdW1lbnQuYm9keSwgc3dhbENsYXNzZXMuaW9zZml4KTtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xuICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gb2Zmc2V0ICogLTE7XG4gIH1cbn07XG5cbnZhciBpc0lFMTEgPSBmdW5jdGlvbiBpc0lFMTEoKSB7XG4gIHJldHVybiAhIXdpbmRvdy5NU0lucHV0TWV0aG9kQ29udGV4dCAmJiAhIWRvY3VtZW50LmRvY3VtZW50TW9kZTtcbn07IC8vIEZpeCBJRTExIGNlbnRlcmluZyBzd2VldGFsZXJ0Mi9pc3N1ZXMvOTMzXG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cblxudmFyIGZpeFZlcnRpY2FsUG9zaXRpb25JRSA9IGZ1bmN0aW9uIGZpeFZlcnRpY2FsUG9zaXRpb25JRSgpIHtcbiAgdmFyIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICB2YXIgcG9wdXAgPSBnZXRQb3B1cCgpO1xuICBjb250YWluZXIuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2FsaWduLWl0ZW1zJyk7XG5cbiAgaWYgKHBvcHVwLm9mZnNldFRvcCA8IDApIHtcbiAgICBjb250YWluZXIuc3R5bGUuYWxpZ25JdGVtcyA9ICdmbGV4LXN0YXJ0JztcbiAgfVxufTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cblxudmFyIElFZml4ID0gZnVuY3Rpb24gSUVmaXgoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiBpc0lFMTEoKSkge1xuICAgIGZpeFZlcnRpY2FsUG9zaXRpb25JRSgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmaXhWZXJ0aWNhbFBvc2l0aW9uSUUpO1xuICB9XG59O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxudmFyIHVuZG9JRWZpeCA9IGZ1bmN0aW9uIHVuZG9JRWZpeCgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIGlzSUUxMSgpKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZpeFZlcnRpY2FsUG9zaXRpb25JRSk7XG4gIH1cbn07XG5cbi8vIEFkZGluZyBhcmlhLWhpZGRlbj1cInRydWVcIiB0byBlbGVtZW50cyBvdXRzaWRlIG9mIHRoZSBhY3RpdmUgbW9kYWwgZGlhbG9nIGVuc3VyZXMgdGhhdFxuLy8gZWxlbWVudHMgbm90IHdpdGhpbiB0aGUgYWN0aXZlIG1vZGFsIGRpYWxvZyB3aWxsIG5vdCBiZSBzdXJmYWNlZCBpZiBhIHVzZXIgb3BlbnMgYSBzY3JlZW5cbi8vIHJlYWRlcuKAmXMgbGlzdCBvZiBlbGVtZW50cyAoaGVhZGluZ3MsIGZvcm0gY29udHJvbHMsIGxhbmRtYXJrcywgZXRjLikgaW4gdGhlIGRvY3VtZW50LlxuXG52YXIgc2V0QXJpYUhpZGRlbiA9IGZ1bmN0aW9uIHNldEFyaWFIaWRkZW4oKSB7XG4gIHZhciBib2R5Q2hpbGRyZW4gPSB0b0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICBib2R5Q2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoZWwgPT09IGdldENvbnRhaW5lcigpIHx8IGNvbnRhaW5zKGVsLCBnZXRDb250YWluZXIoKSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlvdXMtYXJpYS1oaWRkZW4nLCBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgIH1cblxuICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICB9KTtcbn07XG52YXIgdW5zZXRBcmlhSGlkZGVuID0gZnVuY3Rpb24gdW5zZXRBcmlhSGlkZGVuKCkge1xuICB2YXIgYm9keUNoaWxkcmVuID0gdG9BcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAgYm9keUNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1wcmV2aW91cy1hcmlhLWhpZGRlbicpKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJykpO1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXByZXZpb3VzLWFyaWEtaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBjb250YWludHMgYFdlYWtNYXBgcyBmb3IgZWFjaCBlZmZlY3RpdmVseS1cInByaXZhdGUgIHByb3BlcnR5XCIgdGhhdCBhIGBTd2FsYCBoYXMuXG4gKiBGb3IgZXhhbXBsZSwgdG8gc2V0IHRoZSBwcml2YXRlIHByb3BlcnR5IFwiZm9vXCIgb2YgYHRoaXNgIHRvIFwiYmFyXCIsIHlvdSBjYW4gYHByaXZhdGVQcm9wcy5mb28uc2V0KHRoaXMsICdiYXInKWBcbiAqIFRoaXMgaXMgdGhlIGFwcHJvYWNoIHRoYXQgQmFiZWwgd2lsbCBwcm9iYWJseSB0YWtlIHRvIGltcGxlbWVudCBwcml2YXRlIG1ldGhvZHMvZmllbGRzXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByaXZhdGUtbWV0aG9kc1xuICogICBodHRwczovL2dpdGh1Yi5jb20vYmFiZWwvYmFiZWwvcHVsbC83NTU1XG4gKiBPbmNlIHdlIGhhdmUgdGhlIGNoYW5nZXMgZnJvbSB0aGF0IFBSIGluIEJhYmVsLCBhbmQgb3VyIGNvcmUgY2xhc3MgZml0cyByZWFzb25hYmxlIGluICpvbmUgbW9kdWxlKlxuICogICB0aGVuIHdlIGNhbiB1c2UgdGhhdCBsYW5ndWFnZSBmZWF0dXJlLlxuICovXG52YXIgcHJpdmF0ZU1ldGhvZHMgPSB7XG4gIHN3YWxQcm9taXNlUmVzb2x2ZTogbmV3IFdlYWtNYXAoKVxufTtcblxuLypcbiAqIEluc3RhbmNlIG1ldGhvZCB0byBjbG9zZSBzd2VldEFsZXJ0XG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlKGNvbnRhaW5lciwgaXNUb2FzdCwgb25BZnRlckNsb3NlKSB7XG4gIGlmIChpc1RvYXN0KSB7XG4gICAgdHJpZ2dlck9uQWZ0ZXJDbG9zZShvbkFmdGVyQ2xvc2UpO1xuICB9IGVsc2Uge1xuICAgIHJlc3RvcmVBY3RpdmVFbGVtZW50KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdHJpZ2dlck9uQWZ0ZXJDbG9zZShvbkFmdGVyQ2xvc2UpO1xuICAgIH0pO1xuICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICBjYXB0dXJlOiBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlXG4gICAgfSk7XG4gICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IGZhbHNlO1xuICB9IC8vIFVuc2V0IGdsb2JhbFN0YXRlIHByb3BzIHNvIEdDIHdpbGwgZGlzcG9zZSBnbG9iYWxTdGF0ZSAoIzE1NjkpXG5cblxuICBkZWxldGUgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXI7XG4gIGRlbGV0ZSBnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0O1xuXG4gIGlmIChjb250YWluZXIucGFyZW50Tm9kZSkge1xuICAgIGNvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNvbnRhaW5lcik7XG4gIH1cblxuICByZW1vdmVCb2R5Q2xhc3NlcygpO1xuXG4gIGlmIChpc01vZGFsKCkpIHtcbiAgICB1bmRvU2Nyb2xsYmFyKCk7XG4gICAgdW5kb0lPU2ZpeCgpO1xuICAgIHVuZG9JRWZpeCgpO1xuICAgIHVuc2V0QXJpYUhpZGRlbigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUJvZHlDbGFzc2VzKCkge1xuICByZW1vdmVDbGFzcyhbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSwgW3N3YWxDbGFzc2VzLnNob3duLCBzd2FsQ2xhc3Nlc1snaGVpZ2h0LWF1dG8nXSwgc3dhbENsYXNzZXNbJ25vLWJhY2tkcm9wJ10sIHN3YWxDbGFzc2VzWyd0b2FzdC1zaG93biddLCBzd2FsQ2xhc3Nlc1sndG9hc3QtY29sdW1uJ11dKTtcbn1cblxuZnVuY3Rpb24gc3dhbENsb3NlRXZlbnRGaW5pc2hlZChwb3B1cCwgY29udGFpbmVyLCBpc1RvYXN0LCBvbkFmdGVyQ2xvc2UpIHtcbiAgaWYgKGhhc0NsYXNzKHBvcHVwLCBzd2FsQ2xhc3Nlcy5oaWRlKSkge1xuICAgIHJlbW92ZVBvcHVwQW5kUmVzZXRTdGF0ZShjb250YWluZXIsIGlzVG9hc3QsIG9uQWZ0ZXJDbG9zZSk7XG4gIH0gLy8gVW5zZXQgV2Vha01hcHMgc28gR0Mgd2lsbCBiZSBhYmxlIHRvIGRpc3Bvc2UgdGhlbSAoIzE1NjkpXG5cblxuICB1bnNldFdlYWtNYXBzKHByaXZhdGVQcm9wcyk7XG4gIHVuc2V0V2Vha01hcHMocHJpdmF0ZU1ldGhvZHMpO1xufVxuXG5mdW5jdGlvbiBjbG9zZShyZXNvbHZlVmFsdWUpIHtcbiAgdmFyIGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICB2YXIgcG9wdXAgPSBnZXRQb3B1cCgpO1xuXG4gIGlmICghcG9wdXAgfHwgaGFzQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLmhpZGUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcbiAgdmFyIHN3YWxQcm9taXNlUmVzb2x2ZSA9IHByaXZhdGVNZXRob2RzLnN3YWxQcm9taXNlUmVzb2x2ZS5nZXQodGhpcyk7XG4gIHZhciBvbkNsb3NlID0gaW5uZXJQYXJhbXMub25DbG9zZTtcbiAgdmFyIG9uQWZ0ZXJDbG9zZSA9IGlubmVyUGFyYW1zLm9uQWZ0ZXJDbG9zZTtcbiAgcmVtb3ZlQ2xhc3MocG9wdXAsIHN3YWxDbGFzc2VzLnNob3cpO1xuICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuaGlkZSk7IC8vIElmIGFuaW1hdGlvbiBpcyBzdXBwb3J0ZWQsIGFuaW1hdGVcblxuICBpZiAoYW5pbWF0aW9uRW5kRXZlbnQgJiYgaGFzQ3NzQW5pbWF0aW9uKHBvcHVwKSkge1xuICAgIHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IHBvcHVwKSB7XG4gICAgICAgIHN3YWxDbG9zZUV2ZW50RmluaXNoZWQocG9wdXAsIGNvbnRhaW5lciwgaXNUb2FzdCgpLCBvbkFmdGVyQ2xvc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIE90aGVyd2lzZSwgcmVtb3ZlIGltbWVkaWF0ZWx5XG4gICAgcmVtb3ZlUG9wdXBBbmRSZXNldFN0YXRlKGNvbnRhaW5lciwgaXNUb2FzdCgpLCBvbkFmdGVyQ2xvc2UpO1xuICB9XG5cbiAgaWYgKG9uQ2xvc2UgIT09IG51bGwgJiYgdHlwZW9mIG9uQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvbkNsb3NlKHBvcHVwKTtcbiAgfSAvLyBSZXNvbHZlIFN3YWwgcHJvbWlzZVxuXG5cbiAgc3dhbFByb21pc2VSZXNvbHZlKHJlc29sdmVWYWx1ZSB8fCB7fSk7IC8vIFVuc2V0IHRoaXMucGFyYW1zIHNvIEdDIHdpbGwgZGlzcG9zZSBpdCAoIzE1NjkpXG5cbiAgZGVsZXRlIHRoaXMucGFyYW1zO1xufVxuXG52YXIgdW5zZXRXZWFrTWFwcyA9IGZ1bmN0aW9uIHVuc2V0V2Vha01hcHMob2JqKSB7XG4gIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgb2JqW2ldID0gbmV3IFdlYWtNYXAoKTtcbiAgfVxufTtcblxudmFyIHRyaWdnZXJPbkFmdGVyQ2xvc2UgPSBmdW5jdGlvbiB0cmlnZ2VyT25BZnRlckNsb3NlKG9uQWZ0ZXJDbG9zZSkge1xuICBpZiAob25BZnRlckNsb3NlICE9PSBudWxsICYmIHR5cGVvZiBvbkFmdGVyQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uQWZ0ZXJDbG9zZSgpO1xuICAgIH0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRCdXR0b25zRGlzYWJsZWQoaW5zdGFuY2UsIGJ1dHRvbnMsIGRpc2FibGVkKSB7XG4gIHZhciBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQoaW5zdGFuY2UpO1xuICBidXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgIGRvbUNhY2hlW2J1dHRvbl0uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldElucHV0RGlzYWJsZWQoaW5wdXQsIGRpc2FibGVkKSB7XG4gIGlmICghaW5wdXQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgIHZhciByYWRpb3NDb250YWluZXIgPSBpbnB1dC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgdmFyIHJhZGlvcyA9IHJhZGlvc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYWRpb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJhZGlvc1tpXS5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpbnB1dC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUJ1dHRvbnMoKSB7XG4gIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nLCAnY2FuY2VsQnV0dG9uJ10sIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIGRpc2FibGVCdXR0b25zKCkge1xuICBzZXRCdXR0b25zRGlzYWJsZWQodGhpcywgWydjb25maXJtQnV0dG9uJywgJ2NhbmNlbEJ1dHRvbiddLCB0cnVlKTtcbn0gLy8gQGRlcHJlY2F0ZWRcblxuZnVuY3Rpb24gZW5hYmxlQ29uZmlybUJ1dHRvbigpIHtcbiAgd2FybkFib3V0RGVwcmVhdGlvbignU3dhbC5kaXNhYmxlQ29uZmlybUJ1dHRvbigpJywgXCJTd2FsLmdldENvbmZpcm1CdXR0b24oKS5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcIik7XG4gIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nXSwgZmFsc2UpO1xufSAvLyBAZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBkaXNhYmxlQ29uZmlybUJ1dHRvbigpIHtcbiAgd2FybkFib3V0RGVwcmVhdGlvbignU3dhbC5lbmFibGVDb25maXJtQnV0dG9uKCknLCBcIlN3YWwuZ2V0Q29uZmlybUJ1dHRvbigpLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJylcIik7XG4gIHNldEJ1dHRvbnNEaXNhYmxlZCh0aGlzLCBbJ2NvbmZpcm1CdXR0b24nXSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBlbmFibGVJbnB1dCgpIHtcbiAgcmV0dXJuIHNldElucHV0RGlzYWJsZWQodGhpcy5nZXRJbnB1dCgpLCBmYWxzZSk7XG59XG5mdW5jdGlvbiBkaXNhYmxlSW5wdXQoKSB7XG4gIHJldHVybiBzZXRJbnB1dERpc2FibGVkKHRoaXMuZ2V0SW5wdXQoKSwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHNob3dWYWxpZGF0aW9uTWVzc2FnZShlcnJvcikge1xuICB2YXIgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICBkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZS5pbm5lckhUTUwgPSBlcnJvcjtcbiAgdmFyIHBvcHVwQ29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbUNhY2hlLnBvcHVwKTtcbiAgZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2Uuc3R5bGUubWFyZ2luTGVmdCA9IFwiLVwiLmNvbmNhdChwb3B1cENvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykpO1xuICBkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZS5zdHlsZS5tYXJnaW5SaWdodCA9IFwiLVwiLmNvbmNhdChwb3B1cENvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpKTtcbiAgc2hvdyhkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSk7XG4gIHZhciBpbnB1dCA9IHRoaXMuZ2V0SW5wdXQoKTtcblxuICBpZiAoaW5wdXQpIHtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsIHRydWUpO1xuICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRCeScsIHN3YWxDbGFzc2VzWyd2YWxpZGF0aW9uLW1lc3NhZ2UnXSk7XG4gICAgZm9jdXNJbnB1dChpbnB1dCk7XG4gICAgYWRkQ2xhc3MoaW5wdXQsIHN3YWxDbGFzc2VzLmlucHV0ZXJyb3IpO1xuICB9XG59IC8vIEhpZGUgYmxvY2sgd2l0aCB2YWxpZGF0aW9uIG1lc3NhZ2VcblxuZnVuY3Rpb24gcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxKCkge1xuICB2YXIgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuXG4gIGlmIChkb21DYWNoZS52YWxpZGF0aW9uTWVzc2FnZSkge1xuICAgIGhpZGUoZG9tQ2FjaGUudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIGlucHV0ID0gdGhpcy5nZXRJbnB1dCgpO1xuXG4gIGlmIChpbnB1dCkge1xuICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7XG4gICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZEJ5Jyk7XG4gICAgcmVtb3ZlQ2xhc3MoaW5wdXQsIHN3YWxDbGFzc2VzLmlucHV0ZXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFByb2dyZXNzU3RlcHMkMSgpIHtcbiAgd2FybkFib3V0RGVwcmVhdGlvbignU3dhbC5nZXRQcm9ncmVzc1N0ZXBzKCknLCBcImNvbnN0IHN3YWxJbnN0YW5jZSA9IFN3YWwuZmlyZSh7cHJvZ3Jlc3NTdGVwczogWycxJywgJzInLCAnMyddfSk7IGNvbnN0IHByb2dyZXNzU3RlcHMgPSBzd2FsSW5zdGFuY2UucGFyYW1zLnByb2dyZXNzU3RlcHNcIik7XG4gIHZhciBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG4gIHJldHVybiBpbm5lclBhcmFtcy5wcm9ncmVzc1N0ZXBzO1xufVxuZnVuY3Rpb24gc2V0UHJvZ3Jlc3NTdGVwcyhwcm9ncmVzc1N0ZXBzKSB7XG4gIHdhcm5BYm91dERlcHJlYXRpb24oJ1N3YWwuc2V0UHJvZ3Jlc3NTdGVwcygpJywgJ1N3YWwudXBkYXRlKCknKTtcbiAgdmFyIGlubmVyUGFyYW1zID0gcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLmdldCh0aGlzKTtcblxuICB2YXIgdXBkYXRlZFBhcmFtcyA9IF9leHRlbmRzKHt9LCBpbm5lclBhcmFtcywge1xuICAgIHByb2dyZXNzU3RlcHM6IHByb2dyZXNzU3RlcHNcbiAgfSk7XG5cbiAgcmVuZGVyUHJvZ3Jlc3NTdGVwcyh0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbiAgcHJpdmF0ZVByb3BzLmlubmVyUGFyYW1zLnNldCh0aGlzLCB1cGRhdGVkUGFyYW1zKTtcbn1cbmZ1bmN0aW9uIHNob3dQcm9ncmVzc1N0ZXBzKCkge1xuICB2YXIgZG9tQ2FjaGUgPSBwcml2YXRlUHJvcHMuZG9tQ2FjaGUuZ2V0KHRoaXMpO1xuICBzaG93KGRvbUNhY2hlLnByb2dyZXNzU3RlcHMpO1xufVxuZnVuY3Rpb24gaGlkZVByb2dyZXNzU3RlcHMoKSB7XG4gIHZhciBkb21DYWNoZSA9IHByaXZhdGVQcm9wcy5kb21DYWNoZS5nZXQodGhpcyk7XG4gIGhpZGUoZG9tQ2FjaGUucHJvZ3Jlc3NTdGVwcyk7XG59XG5cbnZhciBUaW1lciA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFRpbWVyKGNhbGxiYWNrLCBkZWxheSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUaW1lcik7XG5cbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy5yZW1haW5pbmcgPSBkZWxheTtcbiAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0KCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVGltZXIsIFt7XG4gICAga2V5OiBcInN0YXJ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5pZCA9IHNldFRpbWVvdXQodGhpcy5jYWxsYmFjaywgdGhpcy5yZW1haW5pbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0b3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIGlmICh0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5yZW1haW5pbmcgLT0gbmV3IERhdGUoKSAtIHRoaXMuc3RhcnRlZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbmNyZWFzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbmNyZWFzZShuKSB7XG4gICAgICB2YXIgcnVubmluZyA9IHRoaXMucnVubmluZztcblxuICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtYWluaW5nICs9IG47XG5cbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRUaW1lckxlZnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VGltZXJMZWZ0KCkge1xuICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzUnVubmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc1J1bm5pbmcoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5uaW5nO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBUaW1lcjtcbn0oKTtcblxudmFyIGRlZmF1bHRJbnB1dFZhbGlkYXRvcnMgPSB7XG4gIGVtYWlsOiBmdW5jdGlvbiBlbWFpbChzdHJpbmcsIHZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgcmV0dXJuIC9eW2EtekEtWjAtOS4rXy1dK0BbYS16QS1aMC05Li1dK1xcLlthLXpBLVowLTktXXsyLDI0fSQvLnRlc3Qoc3RyaW5nKSA/IFByb21pc2UucmVzb2x2ZSgpIDogUHJvbWlzZS5yZXNvbHZlKHZhbGlkYXRpb25NZXNzYWdlID8gdmFsaWRhdGlvbk1lc3NhZ2UgOiAnSW52YWxpZCBlbWFpbCBhZGRyZXNzJyk7XG4gIH0sXG4gIHVybDogZnVuY3Rpb24gdXJsKHN0cmluZywgdmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAvLyB0YWtlbiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zODA5NDM1IHdpdGggYSBzbWFsbCBjaGFuZ2UgZnJvbSAjMTMwNlxuICAgIHJldHVybiAvXmh0dHBzPzpcXC9cXC8od3d3XFwuKT9bLWEtekEtWjAtOUA6JS5fK34jPV17MiwyNTZ9XFwuW2Etel17Miw2M31cXGIoWy1hLXpBLVowLTlAOiVfKy5+Iz8mLz1dKikkLy50ZXN0KHN0cmluZykgPyBQcm9taXNlLnJlc29sdmUoKSA6IFByb21pc2UucmVzb2x2ZSh2YWxpZGF0aW9uTWVzc2FnZSA/IHZhbGlkYXRpb25NZXNzYWdlIDogJ0ludmFsaWQgVVJMJyk7XG4gIH1cbn07XG5cbi8qKlxuICogU2V0IHR5cGUsIHRleHQgYW5kIGFjdGlvbnMgb24gcG9wdXBcbiAqXG4gKiBAcGFyYW0gcGFyYW1zXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBzZXRQYXJhbWV0ZXJzKHBhcmFtcykge1xuICAvLyBVc2UgZGVmYXVsdCBgaW5wdXRWYWxpZGF0b3JgIGZvciBzdXBwb3J0ZWQgaW5wdXQgdHlwZXMgaWYgbm90IHByb3ZpZGVkXG4gIGlmICghcGFyYW1zLmlucHV0VmFsaWRhdG9yKSB7XG4gICAgT2JqZWN0LmtleXMoZGVmYXVsdElucHV0VmFsaWRhdG9ycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAocGFyYW1zLmlucHV0ID09PSBrZXkpIHtcbiAgICAgICAgcGFyYW1zLmlucHV0VmFsaWRhdG9yID0gZGVmYXVsdElucHV0VmFsaWRhdG9yc1trZXldO1xuICAgICAgfVxuICAgIH0pO1xuICB9IC8vIHNob3dMb2FkZXJPbkNvbmZpcm0gJiYgcHJlQ29uZmlybVxuXG5cbiAgaWYgKHBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtICYmICFwYXJhbXMucHJlQ29uZmlybSkge1xuICAgIHdhcm4oJ3Nob3dMb2FkZXJPbkNvbmZpcm0gaXMgc2V0IHRvIHRydWUsIGJ1dCBwcmVDb25maXJtIGlzIG5vdCBkZWZpbmVkLlxcbicgKyAnc2hvd0xvYWRlck9uQ29uZmlybSBzaG91bGQgYmUgdXNlZCB0b2dldGhlciB3aXRoIHByZUNvbmZpcm0sIHNlZSB1c2FnZSBleGFtcGxlOlxcbicgKyAnaHR0cHM6Ly9zd2VldGFsZXJ0Mi5naXRodWIuaW8vI2FqYXgtcmVxdWVzdCcpO1xuICB9IC8vIHBhcmFtcy5hbmltYXRpb24gd2lsbCBiZSBhY3R1YWxseSB1c2VkIGluIHJlbmRlclBvcHVwLmpzXG4gIC8vIGJ1dCBpbiBjYXNlIHdoZW4gcGFyYW1zLmFuaW1hdGlvbiBpcyBhIGZ1bmN0aW9uLCB3ZSBuZWVkIHRvIGNhbGwgdGhhdCBmdW5jdGlvblxuICAvLyBiZWZvcmUgcG9wdXAgKHJlKWluaXRpYWxpemF0aW9uLCBzbyBpdCdsbCBiZSBwb3NzaWJsZSB0byBjaGVjayBTd2FsLmlzVmlzaWJsZSgpXG4gIC8vIGluc2lkZSB0aGUgcGFyYW1zLmFuaW1hdGlvbiBmdW5jdGlvblxuXG5cbiAgcGFyYW1zLmFuaW1hdGlvbiA9IGNhbGxJZkZ1bmN0aW9uKHBhcmFtcy5hbmltYXRpb24pOyAvLyBEZXRlcm1pbmUgaWYgdGhlIGN1c3RvbSB0YXJnZXQgZWxlbWVudCBpcyB2YWxpZFxuXG4gIGlmICghcGFyYW1zLnRhcmdldCB8fCB0eXBlb2YgcGFyYW1zLnRhcmdldCA9PT0gJ3N0cmluZycgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnRhcmdldCkgfHwgdHlwZW9mIHBhcmFtcy50YXJnZXQgIT09ICdzdHJpbmcnICYmICFwYXJhbXMudGFyZ2V0LmFwcGVuZENoaWxkKSB7XG4gICAgd2FybignVGFyZ2V0IHBhcmFtZXRlciBpcyBub3QgdmFsaWQsIGRlZmF1bHRpbmcgdG8gXCJib2R5XCInKTtcbiAgICBwYXJhbXMudGFyZ2V0ID0gJ2JvZHknO1xuICB9IC8vIFJlcGxhY2UgbmV3bGluZXMgd2l0aCA8YnI+IGluIHRpdGxlXG5cblxuICBpZiAodHlwZW9mIHBhcmFtcy50aXRsZSA9PT0gJ3N0cmluZycpIHtcbiAgICBwYXJhbXMudGl0bGUgPSBwYXJhbXMudGl0bGUuc3BsaXQoJ1xcbicpLmpvaW4oJzxiciAvPicpO1xuICB9XG5cbiAgdmFyIG9sZFBvcHVwID0gZ2V0UG9wdXAoKTtcbiAgdmFyIHRhcmdldEVsZW1lbnQgPSB0eXBlb2YgcGFyYW1zLnRhcmdldCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmFtcy50YXJnZXQpIDogcGFyYW1zLnRhcmdldDtcblxuICBpZiAoIW9sZFBvcHVwIHx8IC8vIElmIHRoZSBtb2RlbCB0YXJnZXQgaGFzIGNoYW5nZWQsIHJlZnJlc2ggdGhlIHBvcHVwXG4gIG9sZFBvcHVwICYmIHRhcmdldEVsZW1lbnQgJiYgb2xkUG9wdXAucGFyZW50Tm9kZSAhPT0gdGFyZ2V0RWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgaW5pdChwYXJhbXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN3YWxPcGVuQW5pbWF0aW9uRmluaXNoZWQocG9wdXAsIGNvbnRhaW5lcikge1xuICBwb3B1cC5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZEV2ZW50LCBzd2FsT3BlbkFuaW1hdGlvbkZpbmlzaGVkKTtcbiAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93WSA9ICdhdXRvJztcbn1cbi8qKlxuICogT3BlbiBwb3B1cCwgYWRkIG5lY2Vzc2FyeSBjbGFzc2VzIGFuZCBzdHlsZXMsIGZpeCBzY3JvbGxiYXJcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXNcbiAqL1xuXG5cbnZhciBvcGVuUG9wdXAgPSBmdW5jdGlvbiBvcGVuUG9wdXAocGFyYW1zKSB7XG4gIHZhciBjb250YWluZXIgPSBnZXRDb250YWluZXIoKTtcbiAgdmFyIHBvcHVwID0gZ2V0UG9wdXAoKTtcblxuICBpZiAocGFyYW1zLm9uQmVmb3JlT3BlbiAhPT0gbnVsbCAmJiB0eXBlb2YgcGFyYW1zLm9uQmVmb3JlT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHBhcmFtcy5vbkJlZm9yZU9wZW4ocG9wdXApO1xuICB9XG5cbiAgaWYgKHBhcmFtcy5hbmltYXRpb24pIHtcbiAgICBhZGRDbGFzcyhwb3B1cCwgc3dhbENsYXNzZXMuc2hvdyk7XG4gICAgYWRkQ2xhc3MoY29udGFpbmVyLCBzd2FsQ2xhc3Nlcy5mYWRlKTtcbiAgfVxuXG4gIHNob3cocG9wdXApOyAvLyBzY3JvbGxpbmcgaXMgJ2hpZGRlbicgdW50aWwgYW5pbWF0aW9uIGlzIGRvbmUsIGFmdGVyIHRoYXQgJ2F1dG8nXG5cbiAgaWYgKGFuaW1hdGlvbkVuZEV2ZW50ICYmIGhhc0Nzc0FuaW1hdGlvbihwb3B1cCkpIHtcbiAgICBjb250YWluZXIuc3R5bGUub3ZlcmZsb3dZID0gJ2hpZGRlbic7XG4gICAgcG9wdXAuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmRFdmVudCwgc3dhbE9wZW5BbmltYXRpb25GaW5pc2hlZC5iaW5kKG51bGwsIHBvcHVwLCBjb250YWluZXIpKTtcbiAgfSBlbHNlIHtcbiAgICBjb250YWluZXIuc3R5bGUub3ZlcmZsb3dZID0gJ2F1dG8nO1xuICB9XG5cbiAgYWRkQ2xhc3MoW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgZG9jdW1lbnQuYm9keSwgY29udGFpbmVyXSwgc3dhbENsYXNzZXMuc2hvd24pO1xuXG4gIGlmIChwYXJhbXMuaGVpZ2h0QXV0byAmJiBwYXJhbXMuYmFja2Ryb3AgJiYgIXBhcmFtcy50b2FzdCkge1xuICAgIGFkZENsYXNzKFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLCBzd2FsQ2xhc3Nlc1snaGVpZ2h0LWF1dG8nXSk7XG4gIH1cblxuICBpZiAoaXNNb2RhbCgpKSB7XG4gICAgaWYgKHBhcmFtcy5zY3JvbGxiYXJQYWRkaW5nKSB7XG4gICAgICBmaXhTY3JvbGxiYXIoKTtcbiAgICB9XG5cbiAgICBpT1NmaXgoKTtcbiAgICBJRWZpeCgpO1xuICAgIHNldEFyaWFIaWRkZW4oKTsgLy8gc3dlZXRhbGVydDIvaXNzdWVzLzEyNDdcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCA9IDA7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoIWlzVG9hc3QoKSAmJiAhZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50KSB7XG4gICAgZ2xvYmFsU3RhdGUucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgfVxuXG4gIGlmIChwYXJhbXMub25PcGVuICE9PSBudWxsICYmIHR5cGVvZiBwYXJhbXMub25PcGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBwYXJhbXMub25PcGVuKHBvcHVwKTtcbiAgICB9KTtcbiAgfVxufTtcblxudmFyIF90aGlzID0gdW5kZWZpbmVkO1xuXG52YXIgaGFuZGxlSW5wdXRPcHRpb25zID0gZnVuY3Rpb24gaGFuZGxlSW5wdXRPcHRpb25zKGluc3RhbmNlLCBwYXJhbXMpIHtcbiAgdmFyIGNvbnRlbnQgPSBnZXRDb250ZW50KCk7XG5cbiAgdmFyIHByb2Nlc3NJbnB1dE9wdGlvbnMgPSBmdW5jdGlvbiBwcm9jZXNzSW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucykge1xuICAgIHJldHVybiBwb3B1bGF0ZUlucHV0T3B0aW9uc1twYXJhbXMuaW5wdXRdKGNvbnRlbnQsIGZvcm1hdElucHV0T3B0aW9ucyhpbnB1dE9wdGlvbnMpLCBwYXJhbXMpO1xuICB9O1xuXG4gIGlmIChpc1Byb21pc2UocGFyYW1zLmlucHV0T3B0aW9ucykpIHtcbiAgICBzaG93TG9hZGluZygpO1xuICAgIHBhcmFtcy5pbnB1dE9wdGlvbnMudGhlbihmdW5jdGlvbiAoaW5wdXRPcHRpb25zKSB7XG4gICAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICAgICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhpbnB1dE9wdGlvbnMpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKF90eXBlb2YocGFyYW1zLmlucHV0T3B0aW9ucykgPT09ICdvYmplY3QnKSB7XG4gICAgcHJvY2Vzc0lucHV0T3B0aW9ucyhwYXJhbXMuaW5wdXRPcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBlcnJvcihcIlVuZXhwZWN0ZWQgdHlwZSBvZiBpbnB1dE9wdGlvbnMhIEV4cGVjdGVkIG9iamVjdCwgTWFwIG9yIFByb21pc2UsIGdvdCBcIi5jb25jYXQoX3R5cGVvZihwYXJhbXMuaW5wdXRPcHRpb25zKSkpO1xuICB9XG59O1xudmFyIGhhbmRsZUlucHV0VmFsdWUgPSBmdW5jdGlvbiBoYW5kbGVJbnB1dFZhbHVlKGluc3RhbmNlLCBwYXJhbXMpIHtcbiAgdmFyIGlucHV0ID0gaW5zdGFuY2UuZ2V0SW5wdXQoKTtcbiAgaGlkZShpbnB1dCk7XG4gIHBhcmFtcy5pbnB1dFZhbHVlLnRoZW4oZnVuY3Rpb24gKGlucHV0VmFsdWUpIHtcbiAgICBpbnB1dC52YWx1ZSA9IHBhcmFtcy5pbnB1dCA9PT0gJ251bWJlcicgPyBwYXJzZUZsb2F0KGlucHV0VmFsdWUpIHx8IDAgOiBpbnB1dFZhbHVlICsgJyc7XG4gICAgc2hvdyhpbnB1dCk7XG4gICAgaW5wdXQuZm9jdXMoKTtcbiAgICBpbnN0YW5jZS5oaWRlTG9hZGluZygpO1xuICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBlcnJvcignRXJyb3IgaW4gaW5wdXRWYWx1ZSBwcm9taXNlOiAnICsgZXJyKTtcbiAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgIHNob3coaW5wdXQpO1xuICAgIGlucHV0LmZvY3VzKCk7XG5cbiAgICBfdGhpcy5oaWRlTG9hZGluZygpO1xuICB9KTtcbn07XG52YXIgcG9wdWxhdGVJbnB1dE9wdGlvbnMgPSB7XG4gIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KGNvbnRlbnQsIGlucHV0T3B0aW9ucywgcGFyYW1zKSB7XG4gICAgdmFyIHNlbGVjdCA9IGdldENoaWxkQnlDbGFzcyhjb250ZW50LCBzd2FsQ2xhc3Nlcy5zZWxlY3QpO1xuICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dE9wdGlvbikge1xuICAgICAgdmFyIG9wdGlvblZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICB2YXIgb3B0aW9uTGFiZWwgPSBpbnB1dE9wdGlvblsxXTtcbiAgICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdGlvbi52YWx1ZSA9IG9wdGlvblZhbHVlO1xuICAgICAgb3B0aW9uLmlubmVySFRNTCA9IG9wdGlvbkxhYmVsO1xuXG4gICAgICBpZiAocGFyYW1zLmlucHV0VmFsdWUudG9TdHJpbmcoKSA9PT0gb3B0aW9uVmFsdWUudG9TdHJpbmcoKSkge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9KTtcbiAgICBzZWxlY3QuZm9jdXMoKTtcbiAgfSxcbiAgcmFkaW86IGZ1bmN0aW9uIHJhZGlvKGNvbnRlbnQsIGlucHV0T3B0aW9ucywgcGFyYW1zKSB7XG4gICAgdmFyIHJhZGlvID0gZ2V0Q2hpbGRCeUNsYXNzKGNvbnRlbnQsIHN3YWxDbGFzc2VzLnJhZGlvKTtcbiAgICBpbnB1dE9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXRPcHRpb24pIHtcbiAgICAgIHZhciByYWRpb1ZhbHVlID0gaW5wdXRPcHRpb25bMF07XG4gICAgICB2YXIgcmFkaW9MYWJlbCA9IGlucHV0T3B0aW9uWzFdO1xuICAgICAgdmFyIHJhZGlvSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgdmFyIHJhZGlvTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgIHJhZGlvSW5wdXQudHlwZSA9ICdyYWRpbyc7XG4gICAgICByYWRpb0lucHV0Lm5hbWUgPSBzd2FsQ2xhc3Nlcy5yYWRpbztcbiAgICAgIHJhZGlvSW5wdXQudmFsdWUgPSByYWRpb1ZhbHVlO1xuXG4gICAgICBpZiAocGFyYW1zLmlucHV0VmFsdWUudG9TdHJpbmcoKSA9PT0gcmFkaW9WYWx1ZS50b1N0cmluZygpKSB7XG4gICAgICAgIHJhZGlvSW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGxhYmVsLmlubmVySFRNTCA9IHJhZGlvTGFiZWw7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBzd2FsQ2xhc3Nlcy5sYWJlbDtcbiAgICAgIHJhZGlvTGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHJhZGlvSW5wdXQpO1xuICAgICAgcmFkaW9MYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgcmFkaW8uYXBwZW5kQ2hpbGQocmFkaW9MYWJlbEVsZW1lbnQpO1xuICAgIH0pO1xuICAgIHZhciByYWRpb3MgPSByYWRpby5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuXG4gICAgaWYgKHJhZGlvcy5sZW5ndGgpIHtcbiAgICAgIHJhZGlvc1swXS5mb2N1cygpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQ29udmVydHMgYGlucHV0T3B0aW9uc2AgaW50byBhbiBhcnJheSBvZiBgW3ZhbHVlLCBsYWJlbF1gc1xuICAgKiBAcGFyYW0gaW5wdXRPcHRpb25zXG4gICAqL1xuXG59O1xuXG52YXIgZm9ybWF0SW5wdXRPcHRpb25zID0gZnVuY3Rpb24gZm9ybWF0SW5wdXRPcHRpb25zKGlucHV0T3B0aW9ucykge1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgaWYgKHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnICYmIGlucHV0T3B0aW9ucyBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGlucHV0T3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHQucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5rZXlzKGlucHV0T3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXN1bHQucHVzaChba2V5LCBpbnB1dE9wdGlvbnNba2V5XV0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIF9tYWluKHVzZXJQYXJhbXMpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICBzaG93V2FybmluZ3NGb3JQYXJhbXModXNlclBhcmFtcyk7XG5cbiAgdmFyIGlubmVyUGFyYW1zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRQYXJhbXMsIHVzZXJQYXJhbXMpO1xuXG4gIHNldFBhcmFtZXRlcnMoaW5uZXJQYXJhbXMpO1xuICBPYmplY3QuZnJlZXplKGlubmVyUGFyYW1zKTsgLy8gY2xlYXIgdGhlIHByZXZpb3VzIHRpbWVyXG5cbiAgaWYgKGdsb2JhbFN0YXRlLnRpbWVvdXQpIHtcbiAgICBnbG9iYWxTdGF0ZS50aW1lb3V0LnN0b3AoKTtcbiAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgfSAvLyBjbGVhciB0aGUgcmVzdG9yZSBmb2N1cyB0aW1lb3V0XG5cblxuICBjbGVhclRpbWVvdXQoZ2xvYmFsU3RhdGUucmVzdG9yZUZvY3VzVGltZW91dCk7XG4gIHZhciBkb21DYWNoZSA9IHtcbiAgICBwb3B1cDogZ2V0UG9wdXAoKSxcbiAgICBjb250YWluZXI6IGdldENvbnRhaW5lcigpLFxuICAgIGNvbnRlbnQ6IGdldENvbnRlbnQoKSxcbiAgICBhY3Rpb25zOiBnZXRBY3Rpb25zKCksXG4gICAgY29uZmlybUJ1dHRvbjogZ2V0Q29uZmlybUJ1dHRvbigpLFxuICAgIGNhbmNlbEJ1dHRvbjogZ2V0Q2FuY2VsQnV0dG9uKCksXG4gICAgY2xvc2VCdXR0b246IGdldENsb3NlQnV0dG9uKCksXG4gICAgdmFsaWRhdGlvbk1lc3NhZ2U6IGdldFZhbGlkYXRpb25NZXNzYWdlKCksXG4gICAgcHJvZ3Jlc3NTdGVwczogZ2V0UHJvZ3Jlc3NTdGVwcygpXG4gIH07XG4gIHByaXZhdGVQcm9wcy5kb21DYWNoZS5zZXQodGhpcywgZG9tQ2FjaGUpO1xuICByZW5kZXIodGhpcywgaW5uZXJQYXJhbXMpO1xuICBwcml2YXRlUHJvcHMuaW5uZXJQYXJhbXMuc2V0KHRoaXMsIGlubmVyUGFyYW1zKTtcbiAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgLy8gZnVuY3Rpb25zIHRvIGhhbmRsZSBhbGwgY2xvc2luZ3MvZGlzbWlzc2Fsc1xuICAgIHZhciBzdWNjZWVkV2l0aCA9IGZ1bmN0aW9uIHN1Y2NlZWRXaXRoKHZhbHVlKSB7XG4gICAgICBfdGhpcy5jbG9zZVBvcHVwKHtcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGRpc21pc3NXaXRoID0gZnVuY3Rpb24gZGlzbWlzc1dpdGgoZGlzbWlzcykge1xuICAgICAgX3RoaXMuY2xvc2VQb3B1cCh7XG4gICAgICAgIGRpc21pc3M6IGRpc21pc3NcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBwcml2YXRlTWV0aG9kcy5zd2FsUHJvbWlzZVJlc29sdmUuc2V0KF90aGlzLCByZXNvbHZlKTsgLy8gQ2xvc2Ugb24gdGltZXJcblxuICAgIGlmIChpbm5lclBhcmFtcy50aW1lcikge1xuICAgICAgZ2xvYmFsU3RhdGUudGltZW91dCA9IG5ldyBUaW1lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRpc21pc3NXaXRoKCd0aW1lcicpO1xuICAgICAgICBkZWxldGUgZ2xvYmFsU3RhdGUudGltZW91dDtcbiAgICAgIH0sIGlubmVyUGFyYW1zLnRpbWVyKTtcbiAgICB9IC8vIEdldCB0aGUgdmFsdWUgb2YgdGhlIHBvcHVwIGlucHV0XG5cblxuICAgIHZhciBnZXRJbnB1dFZhbHVlID0gZnVuY3Rpb24gZ2V0SW5wdXRWYWx1ZSgpIHtcbiAgICAgIHZhciBpbnB1dCA9IF90aGlzLmdldElucHV0KCk7XG5cbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxuICAgICAgICAgIHJldHVybiBpbnB1dC5jaGVja2VkID8gMSA6IDA7XG5cbiAgICAgICAgY2FzZSAncmFkaW8nOlxuICAgICAgICAgIHJldHVybiBpbnB1dC5jaGVja2VkID8gaW5wdXQudmFsdWUgOiBudWxsO1xuXG4gICAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICAgIHJldHVybiBpbnB1dC5maWxlcy5sZW5ndGggPyBpbnB1dC5maWxlc1swXSA6IG51bGw7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gaW5uZXJQYXJhbXMuaW5wdXRBdXRvVHJpbSA/IGlucHV0LnZhbHVlLnRyaW0oKSA6IGlucHV0LnZhbHVlO1xuICAgICAgfVxuICAgIH07IC8vIGlucHV0IGF1dG9mb2N1c1xuXG5cbiAgICBpZiAoaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5wdXQgPSBfdGhpcy5nZXRJbnB1dCgpO1xuXG4gICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgIGZvY3VzSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICB2YXIgY29uZmlybSA9IGZ1bmN0aW9uIGNvbmZpcm0odmFsdWUpIHtcbiAgICAgIGlmIChpbm5lclBhcmFtcy5zaG93TG9hZGVyT25Db25maXJtKSB7XG4gICAgICAgIGNvbnN0cnVjdG9yLnNob3dMb2FkaW5nKCk7IC8vIFRPRE86IG1ha2Ugc2hvd0xvYWRpbmcgYW4gKmluc3RhbmNlKiBtZXRob2RcbiAgICAgIH1cblxuICAgICAgaWYgKGlubmVyUGFyYW1zLnByZUNvbmZpcm0pIHtcbiAgICAgICAgX3RoaXMucmVzZXRWYWxpZGF0aW9uTWVzc2FnZSgpO1xuXG4gICAgICAgIHZhciBwcmVDb25maXJtUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBpbm5lclBhcmFtcy5wcmVDb25maXJtKHZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcmVDb25maXJtUHJvbWlzZS50aGVuKGZ1bmN0aW9uIChwcmVDb25maXJtVmFsdWUpIHtcbiAgICAgICAgICBpZiAoaXNWaXNpYmxlKGRvbUNhY2hlLnZhbGlkYXRpb25NZXNzYWdlKSB8fCBwcmVDb25maXJtVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfdGhpcy5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWNjZWVkV2l0aCh0eXBlb2YgcHJlQ29uZmlybVZhbHVlID09PSAndW5kZWZpbmVkJyA/IHZhbHVlIDogcHJlQ29uZmlybVZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3VjY2VlZFdpdGgodmFsdWUpO1xuICAgICAgfVxuICAgIH07IC8vIE1vdXNlIGludGVyYWN0aW9uc1xuXG5cbiAgICB2YXIgb25CdXR0b25FdmVudCA9IGZ1bmN0aW9uIG9uQnV0dG9uRXZlbnQoZSkge1xuICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgdmFyIGNvbmZpcm1CdXR0b24gPSBkb21DYWNoZS5jb25maXJtQnV0dG9uLFxuICAgICAgICAgIGNhbmNlbEJ1dHRvbiA9IGRvbUNhY2hlLmNhbmNlbEJ1dHRvbjtcbiAgICAgIHZhciB0YXJnZXRlZENvbmZpcm0gPSBjb25maXJtQnV0dG9uICYmIChjb25maXJtQnV0dG9uID09PSB0YXJnZXQgfHwgY29uZmlybUJ1dHRvbi5jb250YWlucyh0YXJnZXQpKTtcbiAgICAgIHZhciB0YXJnZXRlZENhbmNlbCA9IGNhbmNlbEJ1dHRvbiAmJiAoY2FuY2VsQnV0dG9uID09PSB0YXJnZXQgfHwgY2FuY2VsQnV0dG9uLmNvbnRhaW5zKHRhcmdldCkpO1xuXG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlICdjbGljayc6XG4gICAgICAgICAgLy8gQ2xpY2tlZCAnY29uZmlybSdcbiAgICAgICAgICBpZiAodGFyZ2V0ZWRDb25maXJtKSB7XG4gICAgICAgICAgICBfdGhpcy5kaXNhYmxlQnV0dG9ucygpO1xuXG4gICAgICAgICAgICBpZiAoaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgICAgICAgICAgdmFyIGlucHV0VmFsdWUgPSBnZXRJbnB1dFZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgaWYgKGlubmVyUGFyYW1zLmlucHV0VmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZGlzYWJsZUlucHV0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdGlvblByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBpbm5lclBhcmFtcy5pbnB1dFZhbGlkYXRvcihpbnB1dFZhbHVlLCBpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGlvblByb21pc2UudGhlbihmdW5jdGlvbiAodmFsaWRhdGlvbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZUJ1dHRvbnMoKTtcblxuICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlSW5wdXQoKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRpb25NZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNob3dWYWxpZGF0aW9uTWVzc2FnZSh2YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25maXJtKGlucHV0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFfdGhpcy5nZXRJbnB1dCgpLmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmVuYWJsZUJ1dHRvbnMoKTtcblxuICAgICAgICAgICAgICAgIF90aGlzLnNob3dWYWxpZGF0aW9uTWVzc2FnZShpbm5lclBhcmFtcy52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlybShpbnB1dFZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uZmlybSh0cnVlKTtcbiAgICAgICAgICAgIH0gLy8gQ2xpY2tlZCAnY2FuY2VsJ1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRlZENhbmNlbCkge1xuICAgICAgICAgICAgX3RoaXMuZGlzYWJsZUJ1dHRvbnMoKTtcblxuICAgICAgICAgICAgZGlzbWlzc1dpdGgoY29uc3RydWN0b3IuRGlzbWlzc1JlYXNvbi5jYW5jZWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBidXR0b25zID0gZG9tQ2FjaGUucG9wdXAucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1dHRvbnNbaV0ub25jbGljayA9IG9uQnV0dG9uRXZlbnQ7XG4gICAgICBidXR0b25zW2ldLm9ubW91c2VvdmVyID0gb25CdXR0b25FdmVudDtcbiAgICAgIGJ1dHRvbnNbaV0ub25tb3VzZW91dCA9IG9uQnV0dG9uRXZlbnQ7XG4gICAgICBidXR0b25zW2ldLm9ubW91c2Vkb3duID0gb25CdXR0b25FdmVudDtcbiAgICB9IC8vIENsb3NpbmcgcG9wdXAgYnkgY2xvc2UgYnV0dG9uXG5cblxuICAgIGRvbUNhY2hlLmNsb3NlQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBkaXNtaXNzV2l0aChjb25zdHJ1Y3Rvci5EaXNtaXNzUmVhc29uLmNsb3NlKTtcbiAgICB9O1xuXG4gICAgaWYgKGlubmVyUGFyYW1zLnRvYXN0KSB7XG4gICAgICAvLyBDbG9zaW5nIHBvcHVwIGJ5IGludGVybmFsIGNsaWNrXG4gICAgICBkb21DYWNoZS5wb3B1cC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaW5uZXJQYXJhbXMuc2hvd0NvbmZpcm1CdXR0b24gfHwgaW5uZXJQYXJhbXMuc2hvd0NhbmNlbEJ1dHRvbiB8fCBpbm5lclBhcmFtcy5zaG93Q2xvc2VCdXR0b24gfHwgaW5uZXJQYXJhbXMuaW5wdXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkaXNtaXNzV2l0aChjb25zdHJ1Y3Rvci5EaXNtaXNzUmVhc29uLmNsb3NlKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpZ25vcmVPdXRzaWRlQ2xpY2sgPSBmYWxzZTsgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIHBvcHVwIGJ1dCBtb3VzZXVwIG9uIHRoZSBjb250YWluZXJcbiAgICAgIC8vIFRoaXMgY2FuIGhhcHBlbiB3aGVuIHRoZSB1c2VyIGRyYWdzIGEgc2xpZGVyXG5cbiAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2Vkb3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZXVwID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZXVwID0gdW5kZWZpbmVkOyAvLyBXZSBvbmx5IGNoZWNrIGlmIHRoZSBtb3VzZXVwIHRhcmdldCBpcyB0aGUgY29udGFpbmVyIGJlY2F1c2UgdXN1YWxseSBpdCBkb2Vzbid0XG4gICAgICAgICAgLy8gaGF2ZSBhbnkgb3RoZXIgZGlyZWN0IGNoaWxkcmVuIGFzaWRlIG9mIHRoZSBwb3B1cFxuXG4gICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBkb21DYWNoZS5jb250YWluZXIpIHtcbiAgICAgICAgICAgIGlnbm9yZU91dHNpZGVDbGljayA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTsgLy8gSWdub3JlIGNsaWNrIGV2ZW50cyB0aGF0IGhhZCBtb3VzZWRvd24gb24gdGhlIGNvbnRhaW5lciBidXQgbW91c2V1cCBvbiB0aGUgcG9wdXBcblxuXG4gICAgICBkb21DYWNoZS5jb250YWluZXIub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRvbUNhY2hlLnBvcHVwLm9ubW91c2V1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgZG9tQ2FjaGUucG9wdXAub25tb3VzZXVwID0gdW5kZWZpbmVkOyAvLyBXZSBhbHNvIG5lZWQgdG8gY2hlY2sgaWYgdGhlIG1vdXNldXAgdGFyZ2V0IGlzIGEgY2hpbGQgb2YgdGhlIHBvcHVwXG5cbiAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGRvbUNhY2hlLnBvcHVwIHx8IGRvbUNhY2hlLnBvcHVwLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgaWdub3JlT3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICBkb21DYWNoZS5jb250YWluZXIub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChpZ25vcmVPdXRzaWRlQ2xpY2spIHtcbiAgICAgICAgICBpZ25vcmVPdXRzaWRlQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IGRvbUNhY2hlLmNvbnRhaW5lcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd091dHNpZGVDbGljaykpIHtcbiAgICAgICAgICBkaXNtaXNzV2l0aChjb25zdHJ1Y3Rvci5EaXNtaXNzUmVhc29uLmJhY2tkcm9wKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IC8vIFJldmVyc2UgYnV0dG9ucyAoQ29uZmlybSBvbiB0aGUgcmlnaHQgc2lkZSlcblxuXG4gICAgaWYgKGlubmVyUGFyYW1zLnJldmVyc2VCdXR0b25zKSB7XG4gICAgICBkb21DYWNoZS5jb25maXJtQnV0dG9uLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRvbUNhY2hlLmNhbmNlbEJ1dHRvbiwgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvbUNhY2hlLmNvbmZpcm1CdXR0b24ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZG9tQ2FjaGUuY29uZmlybUJ1dHRvbiwgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uKTtcbiAgICB9IC8vIEZvY3VzIGhhbmRsaW5nXG5cblxuICAgIHZhciBzZXRGb2N1cyA9IGZ1bmN0aW9uIHNldEZvY3VzKGluZGV4LCBpbmNyZW1lbnQpIHtcbiAgICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IGdldEZvY3VzYWJsZUVsZW1lbnRzKGlubmVyUGFyYW1zLmZvY3VzQ2FuY2VsKTsgLy8gc2VhcmNoIGZvciB2aXNpYmxlIGVsZW1lbnRzIGFuZCBzZWxlY3QgdGhlIG5leHQgcG9zc2libGUgbWF0Y2hcblxuICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBpbmRleCA9IGluZGV4ICsgaW5jcmVtZW50OyAvLyByb2xsb3ZlciB0byBmaXJzdCBpdGVtXG5cbiAgICAgICAgaWYgKGluZGV4ID09PSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBpbmRleCA9IDA7IC8vIGdvIHRvIGxhc3QgaXRlbVxuICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgIGluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb2N1c2FibGVFbGVtZW50c1tpbmRleF0uZm9jdXMoKTtcbiAgICAgIH0gLy8gbm8gdmlzaWJsZSBmb2N1c2FibGUgZWxlbWVudHMsIGZvY3VzIHRoZSBwb3B1cFxuXG5cbiAgICAgIGRvbUNhY2hlLnBvcHVwLmZvY3VzKCk7XG4gICAgfTtcblxuICAgIHZhciBrZXlkb3duSGFuZGxlciA9IGZ1bmN0aW9uIGtleWRvd25IYW5kbGVyKGUsIGlubmVyUGFyYW1zKSB7XG4gICAgICBpZiAoaW5uZXJQYXJhbXMuc3RvcEtleWRvd25Qcm9wYWdhdGlvbikge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXJyb3dLZXlzID0gWydBcnJvd0xlZnQnLCAnQXJyb3dSaWdodCcsICdBcnJvd1VwJywgJ0Fycm93RG93bicsICdMZWZ0JywgJ1JpZ2h0JywgJ1VwJywgJ0Rvd24nIC8vIElFMTFcbiAgICAgIF07XG5cbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5pc0NvbXBvc2luZykge1xuICAgICAgICBpZiAoZS50YXJnZXQgJiYgX3RoaXMuZ2V0SW5wdXQoKSAmJiBlLnRhcmdldC5vdXRlckhUTUwgPT09IF90aGlzLmdldElucHV0KCkub3V0ZXJIVE1MKSB7XG4gICAgICAgICAgaWYgKFsndGV4dGFyZWEnLCAnZmlsZSddLmluZGV4T2YoaW5uZXJQYXJhbXMuaW5wdXQpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBkbyBub3Qgc3VibWl0XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3RydWN0b3IuY2xpY2tDb25maXJtKCk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IC8vIFRBQlxuXG4gICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgICB2YXIgdGFyZ2V0RWxlbWVudCA9IGUudGFyZ2V0O1xuICAgICAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBnZXRGb2N1c2FibGVFbGVtZW50cyhpbm5lclBhcmFtcy5mb2N1c0NhbmNlbCk7XG4gICAgICAgIHZhciBidG5JbmRleCA9IC0xO1xuXG4gICAgICAgIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgX2kyKyspIHtcbiAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudCA9PT0gZm9jdXNhYmxlRWxlbWVudHNbX2kyXSkge1xuICAgICAgICAgICAgYnRuSW5kZXggPSBfaTI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAvLyBDeWNsZSB0byB0aGUgbmV4dCBidXR0b25cbiAgICAgICAgICBzZXRGb2N1cyhidG5JbmRleCwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ3ljbGUgdG8gdGhlIHByZXYgYnV0dG9uXG4gICAgICAgICAgc2V0Rm9jdXMoYnRuSW5kZXgsIC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gQVJST1dTIC0gc3dpdGNoIGZvY3VzIGJldHdlZW4gYnV0dG9uc1xuICAgICAgfSBlbHNlIGlmIChhcnJvd0tleXMuaW5kZXhPZihlLmtleSkgIT09IC0xKSB7XG4gICAgICAgIC8vIGZvY3VzIENhbmNlbCBidXR0b24gaWYgQ29uZmlybSBidXR0b24gaXMgY3VycmVudGx5IGZvY3VzZWRcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGRvbUNhY2hlLmNvbmZpcm1CdXR0b24gJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmNhbmNlbEJ1dHRvbikpIHtcbiAgICAgICAgICBkb21DYWNoZS5jYW5jZWxCdXR0b24uZm9jdXMoKTsgLy8gYW5kIHZpY2UgdmVyc2FcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb21DYWNoZS5jYW5jZWxCdXR0b24gJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmNvbmZpcm1CdXR0b24pKSB7XG4gICAgICAgICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5mb2N1cygpO1xuICAgICAgICB9IC8vIEVTQ1xuXG4gICAgICB9IGVsc2UgaWYgKChlLmtleSA9PT0gJ0VzY2FwZScgfHwgZS5rZXkgPT09ICdFc2MnKSAmJiBjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VzY2FwZUtleSkgPT09IHRydWUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBkaXNtaXNzV2l0aChjb25zdHJ1Y3Rvci5EaXNtaXNzUmVhc29uLmVzYyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChnbG9iYWxTdGF0ZS5rZXlkb3duVGFyZ2V0ICYmIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyQWRkZWQpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICAgIGNhcHR1cmU6IGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmVcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaW5uZXJQYXJhbXMudG9hc3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGtleWRvd25IYW5kbGVyKGUsIGlubmVyUGFyYW1zKTtcbiAgICAgIH07XG5cbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQgPSBpbm5lclBhcmFtcy5rZXlkb3duTGlzdGVuZXJDYXB0dXJlID8gd2luZG93IDogZG9tQ2FjaGUucG9wdXA7XG4gICAgICBnbG9iYWxTdGF0ZS5rZXlkb3duTGlzdGVuZXJDYXB0dXJlID0gaW5uZXJQYXJhbXMua2V5ZG93bkxpc3RlbmVyQ2FwdHVyZTtcbiAgICAgIGdsb2JhbFN0YXRlLmtleWRvd25UYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdsb2JhbFN0YXRlLmtleWRvd25IYW5kbGVyLCB7XG4gICAgICAgIGNhcHR1cmU6IGdsb2JhbFN0YXRlLmtleWRvd25MaXN0ZW5lckNhcHR1cmVcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUua2V5ZG93bkhhbmRsZXJBZGRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgX3RoaXMuZW5hYmxlQnV0dG9ucygpO1xuXG4gICAgX3RoaXMuaGlkZUxvYWRpbmcoKTtcblxuICAgIF90aGlzLnJlc2V0VmFsaWRhdGlvbk1lc3NhZ2UoKTtcblxuICAgIGlmIChpbm5lclBhcmFtcy50b2FzdCAmJiAoaW5uZXJQYXJhbXMuaW5wdXQgfHwgaW5uZXJQYXJhbXMuZm9vdGVyIHx8IGlubmVyUGFyYW1zLnNob3dDbG9zZUJ1dHRvbikpIHtcbiAgICAgIGFkZENsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyd0b2FzdC1jb2x1bW4nXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZUNsYXNzKGRvY3VtZW50LmJvZHksIHN3YWxDbGFzc2VzWyd0b2FzdC1jb2x1bW4nXSk7XG4gICAgfSAvLyBpbnB1dE9wdGlvbnMsIGlucHV0VmFsdWVcblxuXG4gICAgaWYgKGlubmVyUGFyYW1zLmlucHV0ID09PSAnc2VsZWN0JyB8fCBpbm5lclBhcmFtcy5pbnB1dCA9PT0gJ3JhZGlvJykge1xuICAgICAgaGFuZGxlSW5wdXRPcHRpb25zKF90aGlzLCBpbm5lclBhcmFtcyk7XG4gICAgfSBlbHNlIGlmIChbJ3RleHQnLCAnZW1haWwnLCAnbnVtYmVyJywgJ3RlbCcsICd0ZXh0YXJlYSddLmluZGV4T2YoaW5uZXJQYXJhbXMuaW5wdXQpICE9PSAtMSAmJiBpc1Byb21pc2UoaW5uZXJQYXJhbXMuaW5wdXRWYWx1ZSkpIHtcbiAgICAgIGhhbmRsZUlucHV0VmFsdWUoX3RoaXMsIGlubmVyUGFyYW1zKTtcbiAgICB9XG5cbiAgICBvcGVuUG9wdXAoaW5uZXJQYXJhbXMpO1xuXG4gICAgaWYgKCFpbm5lclBhcmFtcy50b2FzdCkge1xuICAgICAgaWYgKCFjYWxsSWZGdW5jdGlvbihpbm5lclBhcmFtcy5hbGxvd0VudGVyS2V5KSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW5uZXJQYXJhbXMuZm9jdXNDYW5jZWwgJiYgaXNWaXNpYmxlKGRvbUNhY2hlLmNhbmNlbEJ1dHRvbikpIHtcbiAgICAgICAgZG9tQ2FjaGUuY2FuY2VsQnV0dG9uLmZvY3VzKCk7XG4gICAgICB9IGVsc2UgaWYgKGlubmVyUGFyYW1zLmZvY3VzQ29uZmlybSAmJiBpc1Zpc2libGUoZG9tQ2FjaGUuY29uZmlybUJ1dHRvbikpIHtcbiAgICAgICAgZG9tQ2FjaGUuY29uZmlybUJ1dHRvbi5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0Rm9jdXMoLTEsIDEpO1xuICAgICAgfVxuICAgIH0gLy8gZml4IHNjcm9sbFxuXG5cbiAgICBkb21DYWNoZS5jb250YWluZXIuc2Nyb2xsVG9wID0gMDtcbiAgfSk7XG59XG5cbi8qKlxuICogVXBkYXRlcyBwb3B1cCBwYXJhbWV0ZXJzLlxuICovXG5cbmZ1bmN0aW9uIHVwZGF0ZShwYXJhbXMpIHtcbiAgdmFyIHZhbGlkVXBkYXRhYmxlUGFyYW1zID0ge307IC8vIGFzc2lnbiB2YWxpZCBwYXJhbXMgZnJvbSBgcGFyYW1zYCB0byBgZGVmYXVsdHNgXG5cbiAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgIGlmIChTd2FsLmlzVXBkYXRhYmxlUGFyYW1ldGVyKHBhcmFtKSkge1xuICAgICAgdmFsaWRVcGRhdGFibGVQYXJhbXNbcGFyYW1dID0gcGFyYW1zW3BhcmFtXTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2FybihcIkludmFsaWQgcGFyYW1ldGVyIHRvIHVwZGF0ZTogXFxcIlwiLmNvbmNhdChwYXJhbSwgXCJcXFwiLiBVcGRhdGFibGUgcGFyYW1zIGFyZSBsaXN0ZWQgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL3N3ZWV0YWxlcnQyL3N3ZWV0YWxlcnQyL2Jsb2IvbWFzdGVyL3NyYy91dGlscy9wYXJhbXMuanNcIikpO1xuICAgIH1cbiAgfSk7XG4gIHZhciBpbm5lclBhcmFtcyA9IHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5nZXQodGhpcyk7XG5cbiAgdmFyIHVwZGF0ZWRQYXJhbXMgPSBfZXh0ZW5kcyh7fSwgaW5uZXJQYXJhbXMsIHZhbGlkVXBkYXRhYmxlUGFyYW1zKTtcblxuICByZW5kZXIodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gIHByaXZhdGVQcm9wcy5pbm5lclBhcmFtcy5zZXQodGhpcywgdXBkYXRlZFBhcmFtcyk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgIHZhbHVlOiBfZXh0ZW5kcyh7fSwgdGhpcy5wYXJhbXMsIHBhcmFtcyksXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbn1cblxuXG5cbnZhciBpbnN0YW5jZU1ldGhvZHMgPSBPYmplY3QuZnJlZXplKHtcblx0aGlkZUxvYWRpbmc6IGhpZGVMb2FkaW5nLFxuXHRkaXNhYmxlTG9hZGluZzogaGlkZUxvYWRpbmcsXG5cdGdldElucHV0OiBnZXRJbnB1dCQxLFxuXHRjbG9zZTogY2xvc2UsXG5cdGNsb3NlUG9wdXA6IGNsb3NlLFxuXHRjbG9zZU1vZGFsOiBjbG9zZSxcblx0Y2xvc2VUb2FzdDogY2xvc2UsXG5cdGVuYWJsZUJ1dHRvbnM6IGVuYWJsZUJ1dHRvbnMsXG5cdGRpc2FibGVCdXR0b25zOiBkaXNhYmxlQnV0dG9ucyxcblx0ZW5hYmxlQ29uZmlybUJ1dHRvbjogZW5hYmxlQ29uZmlybUJ1dHRvbixcblx0ZGlzYWJsZUNvbmZpcm1CdXR0b246IGRpc2FibGVDb25maXJtQnV0dG9uLFxuXHRlbmFibGVJbnB1dDogZW5hYmxlSW5wdXQsXG5cdGRpc2FibGVJbnB1dDogZGlzYWJsZUlucHV0LFxuXHRzaG93VmFsaWRhdGlvbk1lc3NhZ2U6IHNob3dWYWxpZGF0aW9uTWVzc2FnZSxcblx0cmVzZXRWYWxpZGF0aW9uTWVzc2FnZTogcmVzZXRWYWxpZGF0aW9uTWVzc2FnZSQxLFxuXHRnZXRQcm9ncmVzc1N0ZXBzOiBnZXRQcm9ncmVzc1N0ZXBzJDEsXG5cdHNldFByb2dyZXNzU3RlcHM6IHNldFByb2dyZXNzU3RlcHMsXG5cdHNob3dQcm9ncmVzc1N0ZXBzOiBzaG93UHJvZ3Jlc3NTdGVwcyxcblx0aGlkZVByb2dyZXNzU3RlcHM6IGhpZGVQcm9ncmVzc1N0ZXBzLFxuXHRfbWFpbjogX21haW4sXG5cdHVwZGF0ZTogdXBkYXRlXG59KTtcblxudmFyIGN1cnJlbnRJbnN0YW5jZTsgLy8gU3dlZXRBbGVydCBjb25zdHJ1Y3RvclxuXG5mdW5jdGlvbiBTd2VldEFsZXJ0KCkge1xuICAvLyBQcmV2ZW50IHJ1biBpbiBOb2RlIGVudlxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gQ2hlY2sgZm9yIHRoZSBleGlzdGVuY2Ugb2YgUHJvbWlzZVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuXG5cbiAgaWYgKHR5cGVvZiBQcm9taXNlID09PSAndW5kZWZpbmVkJykge1xuICAgIGVycm9yKCdUaGlzIHBhY2thZ2UgcmVxdWlyZXMgYSBQcm9taXNlIGxpYnJhcnksIHBsZWFzZSBpbmNsdWRlIGEgc2hpbSB0byBlbmFibGUgaXQgaW4gdGhpcyBicm93c2VyIChTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9zd2VldGFsZXJ0Mi9zd2VldGFsZXJ0Mi93aWtpL01pZ3JhdGlvbi1mcm9tLVN3ZWV0QWxlcnQtdG8tU3dlZXRBbGVydDIjMS1pZS1zdXBwb3J0KScpO1xuICB9XG5cbiAgY3VycmVudEluc3RhbmNlID0gdGhpcztcblxuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIG91dGVyUGFyYW1zID0gT2JqZWN0LmZyZWV6ZSh0aGlzLmNvbnN0cnVjdG9yLmFyZ3NUb1BhcmFtcyhhcmdzKSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICBwYXJhbXM6IHtcbiAgICAgIHZhbHVlOiBvdXRlclBhcmFtcyxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlID0gdGhpcy5fbWFpbih0aGlzLnBhcmFtcyk7XG5cbiAgcHJpdmF0ZVByb3BzLnByb21pc2Uuc2V0KHRoaXMsIHByb21pc2UpO1xufSAvLyBgY2F0Y2hgIGNhbm5vdCBiZSB0aGUgbmFtZSBvZiBhIG1vZHVsZSBleHBvcnQsIHNvIHdlIGRlZmluZSBvdXIgdGhlbmFibGUgbWV0aG9kcyBoZXJlIGluc3RlYWRcblxuXG5Td2VldEFsZXJ0LnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKG9uRnVsZmlsbGVkKSB7XG4gIHZhciBwcm9taXNlID0gcHJpdmF0ZVByb3BzLnByb21pc2UuZ2V0KHRoaXMpO1xuICByZXR1cm4gcHJvbWlzZS50aGVuKG9uRnVsZmlsbGVkKTtcbn07XG5cblN3ZWV0QWxlcnQucHJvdG90eXBlW1wiZmluYWxseVwiXSA9IGZ1bmN0aW9uIChvbkZpbmFsbHkpIHtcbiAgdmFyIHByb21pc2UgPSBwcml2YXRlUHJvcHMucHJvbWlzZS5nZXQodGhpcyk7XG4gIHJldHVybiBwcm9taXNlW1wiZmluYWxseVwiXShvbkZpbmFsbHkpO1xufTsgLy8gQXNzaWduIGluc3RhbmNlIG1ldGhvZHMgZnJvbSBzcmMvaW5zdGFuY2VNZXRob2RzLyouanMgdG8gcHJvdG90eXBlXG5cblxuX2V4dGVuZHMoU3dlZXRBbGVydC5wcm90b3R5cGUsIGluc3RhbmNlTWV0aG9kcyk7IC8vIEFzc2lnbiBzdGF0aWMgbWV0aG9kcyBmcm9tIHNyYy9zdGF0aWNNZXRob2RzLyouanMgdG8gY29uc3RydWN0b3JcblxuXG5fZXh0ZW5kcyhTd2VldEFsZXJ0LCBzdGF0aWNNZXRob2RzKTsgLy8gUHJveHkgdG8gaW5zdGFuY2UgbWV0aG9kcyB0byBjb25zdHJ1Y3RvciwgZm9yIG5vdywgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cblxuT2JqZWN0LmtleXMoaW5zdGFuY2VNZXRob2RzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgU3dlZXRBbGVydFtrZXldID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjdXJyZW50SW5zdGFuY2UpIHtcbiAgICAgIHZhciBfY3VycmVudEluc3RhbmNlO1xuXG4gICAgICByZXR1cm4gKF9jdXJyZW50SW5zdGFuY2UgPSBjdXJyZW50SW5zdGFuY2UpW2tleV0uYXBwbHkoX2N1cnJlbnRJbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59KTtcblN3ZWV0QWxlcnQuRGlzbWlzc1JlYXNvbiA9IERpc21pc3NSZWFzb247XG5Td2VldEFsZXJ0LnZlcnNpb24gPSAnOC4xMS42JztcblxudmFyIFN3YWwgPSBTd2VldEFsZXJ0O1xuU3dhbFtcImRlZmF1bHRcIl0gPSBTd2FsO1xuXG5yZXR1cm4gU3dhbDtcblxufSkpKTtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuU3dlZXRhbGVydDIpeyAgd2luZG93LnN3YWwgPSB3aW5kb3cuc3dlZXRBbGVydCA9IHdpbmRvdy5Td2FsID0gd2luZG93LlN3ZWV0QWxlcnQgPSB3aW5kb3cuU3dlZXRhbGVydDJ9XG5cblwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmZnVuY3Rpb24oZSx0KXt2YXIgbj1lLmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtpZihlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChuKSxuLnN0eWxlU2hlZXQpbi5zdHlsZVNoZWV0LmRpc2FibGVkfHwobi5zdHlsZVNoZWV0LmNzc1RleHQ9dCk7ZWxzZSB0cnl7bi5pbm5lckhUTUw9dH1jYXRjaChlKXtuLmlubmVyVGV4dD10fX0oZG9jdW1lbnQsXCJAY2hhcnNldCBcXFwiVVRGLThcXFwiO0Atd2Via2l0LWtleWZyYW1lcyBzd2FsMi1zaG93ezAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKC43KTt0cmFuc2Zvcm06c2NhbGUoLjcpfTQ1JXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxLjA1KTt0cmFuc2Zvcm06c2NhbGUoMS4wNSl9ODAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKC45NSk7dHJhbnNmb3JtOnNjYWxlKC45NSl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKTt0cmFuc2Zvcm06c2NhbGUoMSl9fUBrZXlmcmFtZXMgc3dhbDItc2hvd3swJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSguNyk7dHJhbnNmb3JtOnNjYWxlKC43KX00NSV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMS4wNSk7dHJhbnNmb3JtOnNjYWxlKDEuMDUpfTgwJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSguOTUpO3RyYW5zZm9ybTpzY2FsZSguOTUpfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSk7dHJhbnNmb3JtOnNjYWxlKDEpfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItaGlkZXswJXstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKTt0cmFuc2Zvcm06c2NhbGUoMSk7b3BhY2l0eToxfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoLjUpO3RyYW5zZm9ybTpzY2FsZSguNSk7b3BhY2l0eTowfX1Aa2V5ZnJhbWVzIHN3YWwyLWhpZGV7MCV7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSk7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKC41KTt0cmFuc2Zvcm06c2NhbGUoLjUpO29wYWNpdHk6MH19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6MS4xODc1ZW07bGVmdDouMDYyNWVtO3dpZHRoOjB9NTQle3RvcDoxLjA2MjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6Mi4xODc1ZW07bGVmdDotLjM3NWVtO3dpZHRoOjMuMTI1ZW19ODQle3RvcDozZW07bGVmdDoxLjMxMjVlbTt3aWR0aDoxLjA2MjVlbX0xMDAle3RvcDoyLjgxMjVlbTtsZWZ0Oi44NzVlbTt3aWR0aDoxLjU2MjVlbX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXB7MCV7dG9wOjEuMTg3NWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6MS4wNjI1ZW07bGVmdDouMTI1ZW07d2lkdGg6MH03MCV7dG9wOjIuMTg3NWVtO2xlZnQ6LS4zNzVlbTt3aWR0aDozLjEyNWVtfTg0JXt0b3A6M2VtO2xlZnQ6MS4zMTI1ZW07d2lkdGg6MS4wNjI1ZW19MTAwJXt0b3A6Mi44MTI1ZW07bGVmdDouODc1ZW07d2lkdGg6MS41NjI1ZW19fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nezAle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH02NSV7dG9wOjMuMzc1ZW07cmlnaHQ6Mi44NzVlbTt3aWR0aDowfTg0JXt0b3A6Mi4xODc1ZW07cmlnaHQ6MDt3aWR0aDozLjQzNzVlbX0xMDAle3RvcDoyLjM3NWVtO3JpZ2h0Oi41ZW07d2lkdGg6Mi45Mzc1ZW19fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZ3swJXt0b3A6My4zNzVlbTtyaWdodDoyLjg3NWVtO3dpZHRoOjB9NjUle3RvcDozLjM3NWVtO3JpZ2h0OjIuODc1ZW07d2lkdGg6MH04NCV7dG9wOjIuMTg3NWVtO3JpZ2h0OjA7d2lkdGg6My40Mzc1ZW19MTAwJXt0b3A6Mi4zNzVlbTtyaWdodDouNWVtO3dpZHRoOjIuOTM3NWVtfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZXswJXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9NSV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTEyJXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKTt0cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpfX1Aa2V5ZnJhbWVzIHN3YWwyLXJvdGF0ZS1zdWNjZXNzLWNpcmN1bGFyLWxpbmV7MCV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfTUley13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0xMiV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC00MDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoLTQwNWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDA1ZGVnKX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrezAle21hcmdpbi10b3A6MS42MjVlbTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSguNCk7dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9NTAle21hcmdpbi10b3A6MS42MjVlbTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSguNCk7dHJhbnNmb3JtOnNjYWxlKC40KTtvcGFjaXR5OjB9ODAle21hcmdpbi10b3A6LS4zNzVlbTstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxLjE1KTt0cmFuc2Zvcm06c2NhbGUoMS4xNSl9MTAwJXttYXJnaW4tdG9wOjA7LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMSk7dHJhbnNmb3JtOnNjYWxlKDEpO29wYWNpdHk6MX19QGtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFya3swJXttYXJnaW4tdG9wOjEuNjI1ZW07LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoLjQpO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTUwJXttYXJnaW4tdG9wOjEuNjI1ZW07LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoLjQpO3RyYW5zZm9ybTpzY2FsZSguNCk7b3BhY2l0eTowfTgwJXttYXJnaW4tdG9wOi0uMzc1ZW07LXdlYmtpdC10cmFuc2Zvcm06c2NhbGUoMS4xNSk7dHJhbnNmb3JtOnNjYWxlKDEuMTUpfTEwMCV7bWFyZ2luLXRvcDowOy13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpO3RyYW5zZm9ybTpzY2FsZSgxKTtvcGFjaXR5OjF9fUAtd2Via2l0LWtleWZyYW1lcyBzd2FsMi1hbmltYXRlLWVycm9yLWljb257MCV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlWCgxMDBkZWcpO3RyYW5zZm9ybTpyb3RhdGVYKDEwMGRlZyk7b3BhY2l0eTowfTEwMCV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlWCgwKTt0cmFuc2Zvcm06cm90YXRlWCgwKTtvcGFjaXR5OjF9fUBrZXlmcmFtZXMgc3dhbDItYW5pbWF0ZS1lcnJvci1pY29uezAley13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZVgoMTAwZGVnKTt0cmFuc2Zvcm06cm90YXRlWCgxMDBkZWcpO29wYWNpdHk6MH0xMDAley13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZVgoMCk7dHJhbnNmb3JtOnJvdGF0ZVgoMCk7b3BhY2l0eToxfX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXJ7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItc2hvd257YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudH1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9we3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLWVuZCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0e3RvcDowO3JpZ2h0OjA7Ym90dG9tOmF1dG87bGVmdDphdXRvfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e3RvcDowO3JpZ2h0OmF1dG87Ym90dG9tOmF1dG87bGVmdDowfWJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItbGVmdCxib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0e3RvcDo1MCU7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjA7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX1ib2R5LnN3YWwyLXRvYXN0LXNob3duIC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVye3RvcDo1MCU7cmlnaHQ6YXV0bztib3R0b206YXV0bztsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1yaWdodHt0b3A6NTAlO3JpZ2h0OjA7Ym90dG9tOmF1dG87bGVmdDphdXRvOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0LGJvZHkuc3dhbDItdG9hc3Qtc2hvd24gLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnR7dG9wOmF1dG87cmlnaHQ6YXV0bztib3R0b206MDtsZWZ0OjB9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbXt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTowO2xlZnQ6NTAlOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZVgoLTUwJSl9Ym9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1lbmQsYm9keS5zd2FsMi10b2FzdC1zaG93biAuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodHt0b3A6YXV0bztyaWdodDowO2JvdHRvbTowO2xlZnQ6YXV0b31ib2R5LnN3YWwyLXRvYXN0LWNvbHVtbiAuc3dhbDItdG9hc3R7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOnN0cmV0Y2h9Ym9keS5zd2FsMi10b2FzdC1jb2x1bW4gLnN3YWwyLXRvYXN0IC5zd2FsMi1hY3Rpb25ze2ZsZXg6MTthbGlnbi1zZWxmOnN0cmV0Y2g7aGVpZ2h0OjIuMmVtO21hcmdpbi10b3A6LjMxMjVlbX1ib2R5LnN3YWwyLXRvYXN0LWNvbHVtbiAuc3dhbDItdG9hc3QgLnN3YWwyLWxvYWRpbmd7anVzdGlmeS1jb250ZW50OmNlbnRlcn1ib2R5LnN3YWwyLXRvYXN0LWNvbHVtbiAuc3dhbDItdG9hc3QgLnN3YWwyLWlucHV0e2hlaWdodDoyZW07bWFyZ2luOi4zMTI1ZW0gYXV0bztmb250LXNpemU6MWVtfWJvZHkuc3dhbDItdG9hc3QtY29sdW1uIC5zd2FsMi10b2FzdCAuc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdle2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0e2ZsZXgtZGlyZWN0aW9uOnJvdzthbGlnbi1pdGVtczpjZW50ZXI7d2lkdGg6YXV0bztwYWRkaW5nOi42MjVlbTtvdmVyZmxvdy15OmhpZGRlbjtib3gtc2hhZG93OjAgMCAuNjI1ZW0gI2Q5ZDlkOX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWhlYWRlcntmbGV4LWRpcmVjdGlvbjpyb3d9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi10aXRsZXtmbGV4LWdyb3c6MTtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydDttYXJnaW46MCAuNmVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1mb290ZXJ7bWFyZ2luOi41ZW0gMCAwO3BhZGRpbmc6LjVlbSAwIDA7Zm9udC1zaXplOi44ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1jbG9zZXtwb3NpdGlvbjpzdGF0aWM7d2lkdGg6LjhlbTtoZWlnaHQ6LjhlbTtsaW5lLWhlaWdodDouOH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWNvbnRlbnR7anVzdGlmeS1jb250ZW50OmZsZXgtc3RhcnQ7Zm9udC1zaXplOjFlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb257d2lkdGg6MmVtO21pbi13aWR0aDoyZW07aGVpZ2h0OjJlbTttYXJnaW46MH0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb246OmJlZm9yZXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToyZW07Zm9udC13ZWlnaHQ6NzAwfUBtZWRpYSBhbGwgYW5kICgtbXMtaGlnaC1jb250cmFzdDpub25lKSwoLW1zLWhpZ2gtY29udHJhc3Q6YWN0aXZlKXsuc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb246OmJlZm9yZXtmb250LXNpemU6LjI1ZW19fS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLXJpbmd7d2lkdGg6MmVtO2hlaWdodDoyZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVde3RvcDouODc1ZW07d2lkdGg6MS4zNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV1bY2xhc3MkPWxlZnRde2xlZnQ6LjMxMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWljb24uc3dhbDItZXJyb3IgW2NsYXNzXj1zd2FsMi14LW1hcmstbGluZV1bY2xhc3MkPXJpZ2h0XXtyaWdodDouMzEyNWVtfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItYWN0aW9uc3tmbGV4LWJhc2lzOmF1dG8haW1wb3J0YW50O2hlaWdodDphdXRvO21hcmdpbjowIC4zMTI1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdHlsZWR7bWFyZ2luOjAgLjMxMjVlbTtwYWRkaW5nOi4zMTI1ZW0gLjYyNWVtO2ZvbnQtc2l6ZToxZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdHlsZWQ6Zm9jdXN7Ym94LXNoYWRvdzowIDAgMCAuMDYyNWVtICNmZmYsMCAwIDAgLjEyNWVtIHJnYmEoNTAsMTAwLDE1MCwuNCl9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNze2JvcmRlci1jb2xvcjojYTVkYzg2fS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MS42ZW07aGVpZ2h0OjNlbTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdCAuc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV1bY2xhc3MkPWxlZnRde3RvcDotLjhlbTtsZWZ0Oi0uNWVtOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTstd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46MmVtIDJlbTt0cmFuc2Zvcm0tb3JpZ2luOjJlbSAyZW07Ym9yZGVyLXJhZGl1czo0ZW0gMCAwIDRlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1yaWdodF17dG9wOi0uMjVlbTtsZWZ0Oi45Mzc1ZW07LXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOjAgMS41ZW07dHJhbnNmb3JtLW9yaWdpbjowIDEuNWVtO2JvcmRlci1yYWRpdXM6MCA0ZW0gNGVtIDB9LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLXJpbmd7d2lkdGg6MmVtO2hlaWdodDoyZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIC5zd2FsMi1zdWNjZXNzLWZpeHt0b3A6MDtsZWZ0Oi40Mzc1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6Mi42ODc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0IC5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1saW5lXXtoZWlnaHQ6LjMxMjVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD10aXBde3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX0uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD1sb25nXXt0b3A6LjkzNzVlbTtyaWdodDouMTg3NWVtO3dpZHRoOjEuMzc1ZW19LnN3YWwyLXBvcHVwLnN3YWwyLXRvYXN0LnN3YWwyLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItdG9hc3Qtc2hvdyAuNXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LXNob3cgLjVzfS5zd2FsMi1wb3B1cC5zd2FsMi10b2FzdC5zd2FsMi1oaWRley13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWhpZGUgLjFzIGZvcndhcmRzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1oaWRlIC4xcyBmb3J3YXJkc30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1pY29uIC5zd2FsMi1zdWNjZXNzLWxpbmUtdGlwey13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzO2FuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS10aXAgLjc1c30uc3dhbDItcG9wdXAuc3dhbDItdG9hc3QgLnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1pY29uIC5zd2FsMi1zdWNjZXNzLWxpbmUtbG9uZ3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi10b2FzdC1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXM7YW5pbWF0aW9uOnN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmcgLjc1c31ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3Qtc2hvd3swJXstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKC0uNjI1ZW0pIHJvdGF0ZVooMmRlZyk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLS42MjVlbSkgcm90YXRlWigyZGVnKX0zMyV7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKC0yZGVnKX02NiV7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSguMzEyNWVtKSByb3RhdGVaKDJkZWcpO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC4zMTI1ZW0pIHJvdGF0ZVooMmRlZyl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigwKX19QGtleWZyYW1lcyBzd2FsMi10b2FzdC1zaG93ezAley13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoLS42MjVlbSkgcm90YXRlWigyZGVnKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtLjYyNWVtKSByb3RhdGVaKDJkZWcpfTMzJXstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApIHJvdGF0ZVooLTJkZWcpfTY2JXstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKC4zMTI1ZW0pIHJvdGF0ZVooMmRlZyk7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLjMxMjVlbSkgcm90YXRlWigyZGVnKX0xMDAley13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCkgcm90YXRlWigwKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKSByb3RhdGVaKDApfX1ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItdG9hc3QtaGlkZXsxMDAley13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZVooMWRlZyk7dHJhbnNmb3JtOnJvdGF0ZVooMWRlZyk7b3BhY2l0eTowfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWhpZGV7MTAwJXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO3RyYW5zZm9ybTpyb3RhdGVaKDFkZWcpO29wYWNpdHk6MH19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcHswJXt0b3A6LjU2MjVlbTtsZWZ0Oi4wNjI1ZW07d2lkdGg6MH01NCV7dG9wOi4xMjVlbTtsZWZ0Oi4xMjVlbTt3aWR0aDowfTcwJXt0b3A6LjYyNWVtO2xlZnQ6LS4yNWVtO3dpZHRoOjEuNjI1ZW19ODQle3RvcDoxLjA2MjVlbTtsZWZ0Oi43NWVtO3dpZHRoOi41ZW19MTAwJXt0b3A6MS4xMjVlbTtsZWZ0Oi4xODc1ZW07d2lkdGg6Ljc1ZW19fUBrZXlmcmFtZXMgc3dhbDItdG9hc3QtYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwezAle3RvcDouNTYyNWVtO2xlZnQ6LjA2MjVlbTt3aWR0aDowfTU0JXt0b3A6LjEyNWVtO2xlZnQ6LjEyNWVtO3dpZHRoOjB9NzAle3RvcDouNjI1ZW07bGVmdDotLjI1ZW07d2lkdGg6MS42MjVlbX04NCV7dG9wOjEuMDYyNWVtO2xlZnQ6Ljc1ZW07d2lkdGg6LjVlbX0xMDAle3RvcDoxLjEyNWVtO2xlZnQ6LjE4NzVlbTt3aWR0aDouNzVlbX19QC13ZWJraXQta2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1Aa2V5ZnJhbWVzIHN3YWwyLXRvYXN0LWFuaW1hdGUtc3VjY2Vzcy1saW5lLWxvbmd7MCV7dG9wOjEuNjI1ZW07cmlnaHQ6MS4zNzVlbTt3aWR0aDowfTY1JXt0b3A6MS4yNWVtO3JpZ2h0Oi45Mzc1ZW07d2lkdGg6MH04NCV7dG9wOi45Mzc1ZW07cmlnaHQ6MDt3aWR0aDoxLjEyNWVtfTEwMCV7dG9wOi45Mzc1ZW07cmlnaHQ6LjE4NzVlbTt3aWR0aDoxLjM3NWVtfX1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pe292ZXJmbG93OmhpZGRlbn1ib2R5LnN3YWwyLWhlaWdodC1hdXRve2hlaWdodDphdXRvIWltcG9ydGFudH1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1zaG93bnt0b3A6YXV0bztyaWdodDphdXRvO2JvdHRvbTphdXRvO2xlZnQ6YXV0bzttYXgtd2lkdGg6Y2FsYygxMDAlIC0gLjYyNWVtICogMik7YmFja2dyb3VuZC1jb2xvcjp0cmFuc3BhcmVudH1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1zaG93bj4uc3dhbDItbW9kYWx7Ym94LXNoYWRvdzowIDAgMTBweCByZ2JhKDAsMCwwLC40KX1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1zaG93bi5zd2FsMi10b3B7dG9wOjA7bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgtNTAlKX1ib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1zaG93bi5zd2FsMi10b3AtbGVmdCxib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1zaG93bi5zd2FsMi10b3Atc3RhcnR7dG9wOjA7bGVmdDowfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLXRvcC1lbmQsYm9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItc2hvd24uc3dhbDItdG9wLXJpZ2h0e3RvcDowO3JpZ2h0OjB9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItc2hvd24uc3dhbDItY2VudGVye3RvcDo1MCU7bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLWNlbnRlci1sZWZ0LGJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLWNlbnRlci1zdGFydHt0b3A6NTAlO2xlZnQ6MDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLWNlbnRlci1lbmQsYm9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItc2hvd24uc3dhbDItY2VudGVyLXJpZ2h0e3RvcDo1MCU7cmlnaHQ6MDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLWJvdHRvbXtib3R0b206MDtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVYKC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGVYKC01MCUpfWJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLWJvdHRvbS1sZWZ0LGJvZHkuc3dhbDItbm8tYmFja2Ryb3AgLnN3YWwyLXNob3duLnN3YWwyLWJvdHRvbS1zdGFydHtib3R0b206MDtsZWZ0OjB9Ym9keS5zd2FsMi1uby1iYWNrZHJvcCAuc3dhbDItc2hvd24uc3dhbDItYm90dG9tLWVuZCxib2R5LnN3YWwyLW5vLWJhY2tkcm9wIC5zd2FsMi1zaG93bi5zd2FsMi1ib3R0b20tcmlnaHR7cmlnaHQ6MDtib3R0b206MH0uc3dhbDItY29udGFpbmVye2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpmaXhlZDt6LWluZGV4OjEwNjA7dG9wOjA7cmlnaHQ6MDtib3R0b206MDtsZWZ0OjA7ZmxleC1kaXJlY3Rpb246cm93O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93LXg6aGlkZGVuO2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnQ7LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6dG91Y2h9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3B7YWxpZ24taXRlbXM6ZmxleC1zdGFydH0uc3dhbDItY29udGFpbmVyLnN3YWwyLXRvcC1sZWZ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXN0YXJ0e2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7anVzdGlmeS1jb250ZW50OmZsZXgtc3RhcnR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi10b3AtZW5kLC5zd2FsMi1jb250YWluZXIuc3dhbDItdG9wLXJpZ2h0e2FsaWduLWl0ZW1zOmZsZXgtc3RhcnQ7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVye2FsaWduLWl0ZW1zOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1sZWZ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItY2VudGVyLXN0YXJ0e2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1zdGFydH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWNlbnRlci1lbmQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1jZW50ZXItcmlnaHR7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpmbGV4LWVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbXthbGlnbi1pdGVtczpmbGV4LWVuZH0uc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLXN0YXJ0e2FsaWduLWl0ZW1zOmZsZXgtZW5kO2p1c3RpZnktY29udGVudDpmbGV4LXN0YXJ0fS5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tLWVuZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodHthbGlnbi1pdGVtczpmbGV4LWVuZDtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmR9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tZW5kPjpmaXJzdC1jaGlsZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1sZWZ0PjpmaXJzdC1jaGlsZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWJvdHRvbS1yaWdodD46Zmlyc3QtY2hpbGQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ib3R0b20tc3RhcnQ+OmZpcnN0LWNoaWxkLC5zd2FsMi1jb250YWluZXIuc3dhbDItYm90dG9tPjpmaXJzdC1jaGlsZHttYXJnaW4tdG9wOmF1dG99LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWZ1bGxzY3JlZW4+LnN3YWwyLW1vZGFse2Rpc3BsYXk6ZmxleCFpbXBvcnRhbnQ7ZmxleDoxO2FsaWduLXNlbGY6c3RyZXRjaDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1yb3c+LnN3YWwyLW1vZGFse2Rpc3BsYXk6ZmxleCFpbXBvcnRhbnQ7ZmxleDoxO2FsaWduLWNvbnRlbnQ6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbntmbGV4OjE7ZmxleC1kaXJlY3Rpb246Y29sdW1ufS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItYm90dG9tLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItY2VudGVyLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItdG9we2FsaWduLWl0ZW1zOmNlbnRlcn0uc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctY29sdW1uLnN3YWwyLWJvdHRvbS1sZWZ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItYm90dG9tLXN0YXJ0LC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItY2VudGVyLWxlZnQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbi5zd2FsMi1jZW50ZXItc3RhcnQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbi5zd2FsMi10b3AtbGVmdCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctY29sdW1uLnN3YWwyLXRvcC1zdGFydHthbGlnbi1pdGVtczpmbGV4LXN0YXJ0fS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItYm90dG9tLWVuZCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctY29sdW1uLnN3YWwyLWJvdHRvbS1yaWdodCwuc3dhbDItY29udGFpbmVyLnN3YWwyLWdyb3ctY29sdW1uLnN3YWwyLWNlbnRlci1lbmQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbi5zd2FsMi1jZW50ZXItcmlnaHQsLnN3YWwyLWNvbnRhaW5lci5zd2FsMi1ncm93LWNvbHVtbi5zd2FsMi10b3AtZW5kLC5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4uc3dhbDItdG9wLXJpZ2h0e2FsaWduLWl0ZW1zOmZsZXgtZW5kfS5zd2FsMi1jb250YWluZXIuc3dhbDItZ3Jvdy1jb2x1bW4+LnN3YWwyLW1vZGFse2Rpc3BsYXk6ZmxleCFpbXBvcnRhbnQ7ZmxleDoxO2FsaWduLWNvbnRlbnQ6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXJ9LnN3YWwyLWNvbnRhaW5lcjpub3QoLnN3YWwyLXRvcCk6bm90KC5zd2FsMi10b3Atc3RhcnQpOm5vdCguc3dhbDItdG9wLWVuZCk6bm90KC5zd2FsMi10b3AtbGVmdCk6bm90KC5zd2FsMi10b3AtcmlnaHQpOm5vdCguc3dhbDItY2VudGVyLXN0YXJ0KTpub3QoLnN3YWwyLWNlbnRlci1lbmQpOm5vdCguc3dhbDItY2VudGVyLWxlZnQpOm5vdCguc3dhbDItY2VudGVyLXJpZ2h0KTpub3QoLnN3YWwyLWJvdHRvbSk6bm90KC5zd2FsMi1ib3R0b20tc3RhcnQpOm5vdCguc3dhbDItYm90dG9tLWVuZCk6bm90KC5zd2FsMi1ib3R0b20tbGVmdCk6bm90KC5zd2FsMi1ib3R0b20tcmlnaHQpOm5vdCguc3dhbDItZ3Jvdy1mdWxsc2NyZWVuKT4uc3dhbDItbW9kYWx7bWFyZ2luOmF1dG99QG1lZGlhIGFsbCBhbmQgKC1tcy1oaWdoLWNvbnRyYXN0Om5vbmUpLCgtbXMtaGlnaC1jb250cmFzdDphY3RpdmUpey5zd2FsMi1jb250YWluZXIgLnN3YWwyLW1vZGFse21hcmdpbjowIWltcG9ydGFudH19LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1mYWRle3RyYW5zaXRpb246YmFja2dyb3VuZC1jb2xvciAuMXN9LnN3YWwyLWNvbnRhaW5lci5zd2FsMi1zaG93bntiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjQpfS5zd2FsMi1wb3B1cHtkaXNwbGF5Om5vbmU7cG9zaXRpb246cmVsYXRpdmU7Ym94LXNpemluZzpib3JkZXItYm94O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjMyZW07bWF4LXdpZHRoOjEwMCU7cGFkZGluZzoxLjI1ZW07Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czouMzEyNWVtO2JhY2tncm91bmQ6I2ZmZjtmb250LWZhbWlseTppbmhlcml0O2ZvbnQtc2l6ZToxcmVtfS5zd2FsMi1wb3B1cDpmb2N1c3tvdXRsaW5lOjB9LnN3YWwyLXBvcHVwLnN3YWwyLWxvYWRpbmd7b3ZlcmZsb3cteTpoaWRkZW59LnN3YWwyLWhlYWRlcntkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcn0uc3dhbDItdGl0bGV7cG9zaXRpb246cmVsYXRpdmU7bWF4LXdpZHRoOjEwMCU7bWFyZ2luOjAgMCAuNGVtO3BhZGRpbmc6MDtjb2xvcjojNTk1OTU5O2ZvbnQtc2l6ZToxLjg3NWVtO2ZvbnQtd2VpZ2h0OjYwMDt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LXRyYW5zZm9ybTpub25lO3dvcmQtd3JhcDpicmVhay13b3JkfS5zd2FsMi1hY3Rpb25ze3otaW5kZXg6MTtmbGV4LXdyYXA6d3JhcDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt3aWR0aDoxMDAlO21hcmdpbjoxLjI1ZW0gYXV0byAwfS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZFtkaXNhYmxlZF17b3BhY2l0eTouNH0uc3dhbDItYWN0aW9uczpub3QoLnN3YWwyLWxvYWRpbmcpIC5zd2FsMi1zdHlsZWQ6aG92ZXJ7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgwLDAsMCwuMSkscmdiYSgwLDAsMCwuMSkpfS5zd2FsMi1hY3Rpb25zOm5vdCguc3dhbDItbG9hZGluZykgLnN3YWwyLXN0eWxlZDphY3RpdmV7YmFja2dyb3VuZC1pbWFnZTpsaW5lYXItZ3JhZGllbnQocmdiYSgwLDAsMCwuMikscmdiYSgwLDAsMCwuMikpfS5zd2FsMi1hY3Rpb25zLnN3YWwyLWxvYWRpbmcgLnN3YWwyLXN0eWxlZC5zd2FsMi1jb25maXJte2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDoyLjVlbTtoZWlnaHQ6Mi41ZW07bWFyZ2luOi40Njg3NWVtO3BhZGRpbmc6MDstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1yb3RhdGUtbG9hZGluZyAxLjVzIGxpbmVhciAwcyBpbmZpbml0ZSBub3JtYWw7YW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1sb2FkaW5nIDEuNXMgbGluZWFyIDBzIGluZmluaXRlIG5vcm1hbDtib3JkZXI6LjI1ZW0gc29saWQgdHJhbnNwYXJlbnQ7Ym9yZGVyLXJhZGl1czoxMDAlO2JvcmRlci1jb2xvcjp0cmFuc3BhcmVudDtiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50IWltcG9ydGFudDtjb2xvcjp0cmFuc3BhcmVudDtjdXJzb3I6ZGVmYXVsdDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LnN3YWwyLWFjdGlvbnMuc3dhbDItbG9hZGluZyAuc3dhbDItc3R5bGVkLnN3YWwyLWNhbmNlbHttYXJnaW4tcmlnaHQ6MzBweDttYXJnaW4tbGVmdDozMHB4fS5zd2FsMi1hY3Rpb25zLnN3YWwyLWxvYWRpbmcgOm5vdCguc3dhbDItc3R5bGVkKS5zd2FsMi1jb25maXJtOjphZnRlcntjb250ZW50OlxcXCJcXFwiO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7bWFyZ2luLWxlZnQ6NXB4Oy13ZWJraXQtYW5pbWF0aW9uOnN3YWwyLXJvdGF0ZS1sb2FkaW5nIDEuNXMgbGluZWFyIDBzIGluZmluaXRlIG5vcm1hbDthbmltYXRpb246c3dhbDItcm90YXRlLWxvYWRpbmcgMS41cyBsaW5lYXIgMHMgaW5maW5pdGUgbm9ybWFsO2JvcmRlcjozcHggc29saWQgIzk5OTtib3JkZXItcmFkaXVzOjUwJTtib3JkZXItcmlnaHQtY29sb3I6dHJhbnNwYXJlbnQ7Ym94LXNoYWRvdzoxcHggMXB4IDFweCAjZmZmfS5zd2FsMi1zdHlsZWR7bWFyZ2luOi4zMTI1ZW07cGFkZGluZzouNjI1ZW0gMmVtO2JveC1zaGFkb3c6bm9uZTtmb250LXdlaWdodDo1MDB9LnN3YWwyLXN0eWxlZDpub3QoW2Rpc2FibGVkXSl7Y3Vyc29yOnBvaW50ZXJ9LnN3YWwyLXN0eWxlZC5zd2FsMi1jb25maXJte2JvcmRlcjowO2JvcmRlci1yYWRpdXM6LjI1ZW07YmFja2dyb3VuZDppbml0aWFsO2JhY2tncm91bmQtY29sb3I6IzMwODVkNjtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxLjA2MjVlbX0uc3dhbDItc3R5bGVkLnN3YWwyLWNhbmNlbHtib3JkZXI6MDtib3JkZXItcmFkaXVzOi4yNWVtO2JhY2tncm91bmQ6aW5pdGlhbDtiYWNrZ3JvdW5kLWNvbG9yOiNhYWE7Y29sb3I6I2ZmZjtmb250LXNpemU6MS4wNjI1ZW19LnN3YWwyLXN0eWxlZDpmb2N1c3tvdXRsaW5lOjA7Ym94LXNoYWRvdzowIDAgMCAycHggI2ZmZiwwIDAgMCA0cHggcmdiYSg1MCwxMDAsMTUwLC40KX0uc3dhbDItc3R5bGVkOjotbW96LWZvY3VzLWlubmVye2JvcmRlcjowfS5zd2FsMi1mb290ZXJ7anVzdGlmeS1jb250ZW50OmNlbnRlcjttYXJnaW46MS4yNWVtIDAgMDtwYWRkaW5nOjFlbSAwIDA7Ym9yZGVyLXRvcDoxcHggc29saWQgI2VlZTtjb2xvcjojNTQ1NDU0O2ZvbnQtc2l6ZToxZW19LnN3YWwyLWltYWdle21heC13aWR0aDoxMDAlO21hcmdpbjoxLjI1ZW0gYXV0b30uc3dhbDItY2xvc2V7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7cmlnaHQ6MDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3dpZHRoOjEuMmVtO2hlaWdodDoxLjJlbTtwYWRkaW5nOjA7b3ZlcmZsb3c6aGlkZGVuO3RyYW5zaXRpb246Y29sb3IgLjFzIGVhc2Utb3V0O2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6MDtvdXRsaW5lOmluaXRpYWw7YmFja2dyb3VuZDowIDA7Y29sb3I6I2NjYztmb250LWZhbWlseTpzZXJpZjtmb250LXNpemU6Mi41ZW07bGluZS1oZWlnaHQ6MS4yO2N1cnNvcjpwb2ludGVyfS5zd2FsMi1jbG9zZTpob3Zlcnstd2Via2l0LXRyYW5zZm9ybTpub25lO3RyYW5zZm9ybTpub25lO2JhY2tncm91bmQ6MCAwO2NvbG9yOiNmMjc0NzR9LnN3YWwyLWNvbnRlbnR7ei1pbmRleDoxO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luOjA7cGFkZGluZzowO2NvbG9yOiM1NDU0NTQ7Zm9udC1zaXplOjEuMTI1ZW07Zm9udC13ZWlnaHQ6MzAwO2xpbmUtaGVpZ2h0Om5vcm1hbDt3b3JkLXdyYXA6YnJlYWstd29yZH0jc3dhbDItY29udGVudHt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItY2hlY2tib3gsLnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi1yYWRpbywuc3dhbDItc2VsZWN0LC5zd2FsMi10ZXh0YXJlYXttYXJnaW46MWVtIGF1dG99LnN3YWwyLWZpbGUsLnN3YWwyLWlucHV0LC5zd2FsMi10ZXh0YXJlYXtib3gtc2l6aW5nOmJvcmRlci1ib3g7d2lkdGg6MTAwJTt0cmFuc2l0aW9uOmJvcmRlci1jb2xvciAuM3MsYm94LXNoYWRvdyAuM3M7Ym9yZGVyOjFweCBzb2xpZCAjZDlkOWQ5O2JvcmRlci1yYWRpdXM6LjE4NzVlbTtiYWNrZ3JvdW5kOmluaGVyaXQ7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggcmdiYSgwLDAsMCwuMDYpO2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWZpbGUuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItaW5wdXQuc3dhbDItaW5wdXRlcnJvciwuc3dhbDItdGV4dGFyZWEuc3dhbDItaW5wdXRlcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NCFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDAgMnB4ICNmMjc0NzQhaW1wb3J0YW50fS5zd2FsMi1maWxlOmZvY3VzLC5zd2FsMi1pbnB1dDpmb2N1cywuc3dhbDItdGV4dGFyZWE6Zm9jdXN7Ym9yZGVyOjFweCBzb2xpZCAjYjRkYmVkO291dGxpbmU6MDtib3gtc2hhZG93OjAgMCAzcHggI2M0ZTZmNX0uc3dhbDItZmlsZTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciwuc3dhbDItaW5wdXQ6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXIsLnN3YWwyLXRleHRhcmVhOjotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVye2NvbG9yOiNjY2N9LnN3YWwyLWZpbGU6Oi1tb3otcGxhY2Vob2xkZXIsLnN3YWwyLWlucHV0OjotbW96LXBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTo6LW1vei1wbGFjZWhvbGRlcntjb2xvcjojY2NjfS5zd2FsMi1maWxlOi1tcy1pbnB1dC1wbGFjZWhvbGRlciwuc3dhbDItaW5wdXQ6LW1zLWlucHV0LXBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTotbXMtaW5wdXQtcGxhY2Vob2xkZXJ7Y29sb3I6I2NjY30uc3dhbDItZmlsZTo6LW1zLWlucHV0LXBsYWNlaG9sZGVyLC5zd2FsMi1pbnB1dDo6LW1zLWlucHV0LXBsYWNlaG9sZGVyLC5zd2FsMi10ZXh0YXJlYTo6LW1zLWlucHV0LXBsYWNlaG9sZGVye2NvbG9yOiNjY2N9LnN3YWwyLWZpbGU6OnBsYWNlaG9sZGVyLC5zd2FsMi1pbnB1dDo6cGxhY2Vob2xkZXIsLnN3YWwyLXRleHRhcmVhOjpwbGFjZWhvbGRlcntjb2xvcjojY2NjfS5zd2FsMi1yYW5nZXttYXJnaW46MWVtIGF1dG87YmFja2dyb3VuZDppbmhlcml0fS5zd2FsMi1yYW5nZSBpbnB1dHt3aWR0aDo4MCV9LnN3YWwyLXJhbmdlIG91dHB1dHt3aWR0aDoyMCU7Y29sb3I6aW5oZXJpdDtmb250LXdlaWdodDo2MDA7dGV4dC1hbGlnbjpjZW50ZXJ9LnN3YWwyLXJhbmdlIGlucHV0LC5zd2FsMi1yYW5nZSBvdXRwdXR7aGVpZ2h0OjIuNjI1ZW07cGFkZGluZzowO2ZvbnQtc2l6ZToxLjEyNWVtO2xpbmUtaGVpZ2h0OjIuNjI1ZW19LnN3YWwyLWlucHV0e2hlaWdodDoyLjYyNWVtO3BhZGRpbmc6MCAuNzVlbX0uc3dhbDItaW5wdXRbdHlwZT1udW1iZXJde21heC13aWR0aDoxMGVtfS5zd2FsMi1maWxle2JhY2tncm91bmQ6aW5oZXJpdDtmb250LXNpemU6MS4xMjVlbX0uc3dhbDItdGV4dGFyZWF7aGVpZ2h0OjYuNzVlbTtwYWRkaW5nOi43NWVtfS5zd2FsMi1zZWxlY3R7bWluLXdpZHRoOjUwJTttYXgtd2lkdGg6MTAwJTtwYWRkaW5nOi4zNzVlbSAuNjI1ZW07YmFja2dyb3VuZDppbmhlcml0O2NvbG9yOmluaGVyaXQ7Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWNoZWNrYm94LC5zd2FsMi1yYWRpb3thbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtiYWNrZ3JvdW5kOmluaGVyaXQ7Y29sb3I6aW5oZXJpdH0uc3dhbDItY2hlY2tib3ggbGFiZWwsLnN3YWwyLXJhZGlvIGxhYmVse21hcmdpbjowIC42ZW07Zm9udC1zaXplOjEuMTI1ZW19LnN3YWwyLWNoZWNrYm94IGlucHV0LC5zd2FsMi1yYWRpbyBpbnB1dHttYXJnaW46MCAuNGVtfS5zd2FsMi12YWxpZGF0aW9uLW1lc3NhZ2V7ZGlzcGxheTpub25lO2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6LjYyNWVtO292ZXJmbG93OmhpZGRlbjtiYWNrZ3JvdW5kOiNmMGYwZjA7Y29sb3I6IzY2Njtmb250LXNpemU6MWVtO2ZvbnQtd2VpZ2h0OjMwMH0uc3dhbDItdmFsaWRhdGlvbi1tZXNzYWdlOjpiZWZvcmV7Y29udGVudDpcXFwiIVxcXCI7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MS41ZW07bWluLXdpZHRoOjEuNWVtO2hlaWdodDoxLjVlbTttYXJnaW46MCAuNjI1ZW07em9vbTpub3JtYWw7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZC1jb2xvcjojZjI3NDc0O2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NjAwO2xpbmUtaGVpZ2h0OjEuNWVtO3RleHQtYWxpZ246Y2VudGVyfUBzdXBwb3J0cyAoLW1zLWFjY2VsZXJhdG9yOnRydWUpey5zd2FsMi1yYW5nZSBpbnB1dHt3aWR0aDoxMDAlIWltcG9ydGFudH0uc3dhbDItcmFuZ2Ugb3V0cHV0e2Rpc3BsYXk6bm9uZX19QG1lZGlhIGFsbCBhbmQgKC1tcy1oaWdoLWNvbnRyYXN0Om5vbmUpLCgtbXMtaGlnaC1jb250cmFzdDphY3RpdmUpey5zd2FsMi1yYW5nZSBpbnB1dHt3aWR0aDoxMDAlIWltcG9ydGFudH0uc3dhbDItcmFuZ2Ugb3V0cHV0e2Rpc3BsYXk6bm9uZX19QC1tb3otZG9jdW1lbnQgdXJsLXByZWZpeCgpey5zd2FsMi1jbG9zZTpmb2N1c3tvdXRsaW5lOjJweCBzb2xpZCByZ2JhKDUwLDEwMCwxNTAsLjQpfX0uc3dhbDItaWNvbntwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2l6aW5nOmNvbnRlbnQtYm94O2p1c3RpZnktY29udGVudDpjZW50ZXI7d2lkdGg6NWVtO2hlaWdodDo1ZW07bWFyZ2luOjEuMjVlbSBhdXRvIDEuODc1ZW07em9vbTpub3JtYWw7Ym9yZGVyOi4yNWVtIHNvbGlkIHRyYW5zcGFyZW50O2JvcmRlci1yYWRpdXM6NTAlO2xpbmUtaGVpZ2h0OjVlbTtjdXJzb3I6ZGVmYXVsdDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LnN3YWwyLWljb246OmJlZm9yZXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2hlaWdodDo5MiU7Zm9udC1zaXplOjMuNzVlbX0uc3dhbDItaWNvbi5zd2FsMi1lcnJvcntib3JkZXItY29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciAuc3dhbDIteC1tYXJre3Bvc2l0aW9uOnJlbGF0aXZlO2ZsZXgtZ3JvdzoxfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVde2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjIuMzEyNWVtO3dpZHRoOjIuOTM3NWVtO2hlaWdodDouMzEyNWVtO2JvcmRlci1yYWRpdXM6LjEyNWVtO2JhY2tncm91bmQtY29sb3I6I2YyNzQ3NH0uc3dhbDItaWNvbi5zd2FsMi1lcnJvciBbY2xhc3NePXN3YWwyLXgtbWFyay1saW5lXVtjbGFzcyQ9bGVmdF17bGVmdDoxLjA2MjVlbTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfS5zd2FsMi1pY29uLnN3YWwyLWVycm9yIFtjbGFzc149c3dhbDIteC1tYXJrLWxpbmVdW2NsYXNzJD1yaWdodF17cmlnaHQ6MWVtOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKX0uc3dhbDItaWNvbi5zd2FsMi13YXJuaW5ne2JvcmRlci1jb2xvcjojZmFjZWE4O2NvbG9yOiNmOGJiODZ9LnN3YWwyLWljb24uc3dhbDItd2FybmluZzo6YmVmb3Jle2NvbnRlbnQ6XFxcIiFcXFwifS5zd2FsMi1pY29uLnN3YWwyLWluZm97Ym9yZGVyLWNvbG9yOiM5ZGUwZjY7Y29sb3I6IzNmYzNlZX0uc3dhbDItaWNvbi5zd2FsMi1pbmZvOjpiZWZvcmV7Y29udGVudDpcXFwiaVxcXCJ9LnN3YWwyLWljb24uc3dhbDItcXVlc3Rpb257Ym9yZGVyLWNvbG9yOiNjOWRhZTE7Y29sb3I6Izg3YWRiZH0uc3dhbDItaWNvbi5zd2FsMi1xdWVzdGlvbjo6YmVmb3Jle2NvbnRlbnQ6XFxcIj9cXFwifS5zd2FsMi1pY29uLnN3YWwyLXF1ZXN0aW9uLnN3YWwyLWFyYWJpYy1xdWVzdGlvbi1tYXJrOjpiZWZvcmV7Y29udGVudDpcXFwi2J9cXFwifS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3N7Ym9yZGVyLWNvbG9yOiNhNWRjODZ9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtY2lyY3VsYXItbGluZV17cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6My43NWVtO2hlaWdodDo3LjVlbTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmVdW2NsYXNzJD1sZWZ0XXt0b3A6LS40Mzc1ZW07bGVmdDotMi4wNjM1ZW07LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpOy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjozLjc1ZW0gMy43NWVtO3RyYW5zZm9ybS1vcmlnaW46My43NWVtIDMuNzVlbTtib3JkZXItcmFkaXVzOjcuNWVtIDAgMCA3LjVlbX0uc3dhbDItaWNvbi5zd2FsMi1zdWNjZXNzIFtjbGFzc149c3dhbDItc3VjY2Vzcy1jaXJjdWxhci1saW5lXVtjbGFzcyQ9cmlnaHRde3RvcDotLjY4NzVlbTtsZWZ0OjEuODc1ZW07LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpOy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjowIDMuNzVlbTt0cmFuc2Zvcm0tb3JpZ2luOjAgMy43NWVtO2JvcmRlci1yYWRpdXM6MCA3LjVlbSA3LjVlbSAwfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtcmluZ3twb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjI7dG9wOi0uMjVlbTtsZWZ0Oi0uMjVlbTtib3gtc2l6aW5nOmNvbnRlbnQtYm94O3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7Ym9yZGVyOi4yNWVtIHNvbGlkIHJnYmEoMTY1LDIyMCwxMzQsLjMpO2JvcmRlci1yYWRpdXM6NTAlfS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgLnN3YWwyLXN1Y2Nlc3MtZml4e3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MTt0b3A6LjVlbTtsZWZ0OjEuNjI1ZW07d2lkdGg6LjQzNzVlbTtoZWlnaHQ6NS42MjVlbTstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoLTQ1ZGVnKTt0cmFuc2Zvcm06cm90YXRlKC00NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV17ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjI7aGVpZ2h0Oi4zMTI1ZW07Ym9yZGVyLXJhZGl1czouMTI1ZW07YmFja2dyb3VuZC1jb2xvcjojYTVkYzg2fS5zd2FsMi1pY29uLnN3YWwyLXN1Y2Nlc3MgW2NsYXNzXj1zd2FsMi1zdWNjZXNzLWxpbmVdW2NsYXNzJD10aXBde3RvcDoyLjg3NWVtO2xlZnQ6Ljg3NWVtO3dpZHRoOjEuNTYyNWVtOy13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyl9LnN3YWwyLWljb24uc3dhbDItc3VjY2VzcyBbY2xhc3NePXN3YWwyLXN1Y2Nlc3MtbGluZV1bY2xhc3MkPWxvbmdde3RvcDoyLjM3NWVtO3JpZ2h0Oi41ZW07d2lkdGg6Mi45Mzc1ZW07LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKC00NWRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfS5zd2FsMi1wcm9ncmVzcy1zdGVwc3thbGlnbi1pdGVtczpjZW50ZXI7bWFyZ2luOjAgMCAxLjI1ZW07cGFkZGluZzowO2JhY2tncm91bmQ6aW5oZXJpdDtmb250LXdlaWdodDo2MDB9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIGxpe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlfS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcHt6LWluZGV4OjIwO3dpZHRoOjJlbTtoZWlnaHQ6MmVtO2JvcmRlci1yYWRpdXM6MmVtO2JhY2tncm91bmQ6IzMwODVkNjtjb2xvcjojZmZmO2xpbmUtaGVpZ2h0OjJlbTt0ZXh0LWFsaWduOmNlbnRlcn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAuc3dhbDItYWN0aXZlLXByb2dyZXNzLXN0ZXB7YmFja2dyb3VuZDojMzA4NWQ2fS5zd2FsMi1wcm9ncmVzcy1zdGVwcyAuc3dhbDItcHJvZ3Jlc3Mtc3RlcC5zd2FsMi1hY3RpdmUtcHJvZ3Jlc3Mtc3RlcH4uc3dhbDItcHJvZ3Jlc3Mtc3RlcHtiYWNrZ3JvdW5kOiNhZGQ4ZTY7Y29sb3I6I2ZmZn0uc3dhbDItcHJvZ3Jlc3Mtc3RlcHMgLnN3YWwyLXByb2dyZXNzLXN0ZXAuc3dhbDItYWN0aXZlLXByb2dyZXNzLXN0ZXB+LnN3YWwyLXByb2dyZXNzLXN0ZXAtbGluZXtiYWNrZ3JvdW5kOiNhZGQ4ZTZ9LnN3YWwyLXByb2dyZXNzLXN0ZXBzIC5zd2FsMi1wcm9ncmVzcy1zdGVwLWxpbmV7ei1pbmRleDoxMDt3aWR0aDoyLjVlbTtoZWlnaHQ6LjRlbTttYXJnaW46MCAtMXB4O2JhY2tncm91bmQ6IzMwODVkNn1bY2xhc3NePXN3YWwyXXstd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6dHJhbnNwYXJlbnR9LnN3YWwyLXNob3d7LXdlYmtpdC1hbmltYXRpb246c3dhbDItc2hvdyAuM3M7YW5pbWF0aW9uOnN3YWwyLXNob3cgLjNzfS5zd2FsMi1zaG93LnN3YWwyLW5vYW5pbWF0aW9uey13ZWJraXQtYW5pbWF0aW9uOm5vbmU7YW5pbWF0aW9uOm5vbmV9LnN3YWwyLWhpZGV7LXdlYmtpdC1hbmltYXRpb246c3dhbDItaGlkZSAuMTVzIGZvcndhcmRzO2FuaW1hdGlvbjpzd2FsMi1oaWRlIC4xNXMgZm9yd2FyZHN9LnN3YWwyLWhpZGUuc3dhbDItbm9hbmltYXRpb257LXdlYmtpdC1hbmltYXRpb246bm9uZTthbmltYXRpb246bm9uZX0uc3dhbDItcnRsIC5zd2FsMi1jbG9zZXtyaWdodDphdXRvO2xlZnQ6MH0uc3dhbDItYW5pbWF0ZS1zdWNjZXNzLWljb24gLnN3YWwyLXN1Y2Nlc3MtbGluZS10aXB7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtdGlwIC43NXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1saW5lLXRpcCAuNzVzfS5zd2FsMi1hbmltYXRlLXN1Y2Nlc3MtaWNvbiAuc3dhbDItc3VjY2Vzcy1saW5lLWxvbmd7LXdlYmtpdC1hbmltYXRpb246c3dhbDItYW5pbWF0ZS1zdWNjZXNzLWxpbmUtbG9uZyAuNzVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLXN1Y2Nlc3MtbGluZS1sb25nIC43NXN9LnN3YWwyLWFuaW1hdGUtc3VjY2Vzcy1pY29uIC5zd2FsMi1zdWNjZXNzLWNpcmN1bGFyLWxpbmUtcmlnaHR7LXdlYmtpdC1hbmltYXRpb246c3dhbDItcm90YXRlLXN1Y2Nlc3MtY2lyY3VsYXItbGluZSA0LjI1cyBlYXNlLWluO2FuaW1hdGlvbjpzd2FsMi1yb3RhdGUtc3VjY2Vzcy1jaXJjdWxhci1saW5lIDQuMjVzIGVhc2UtaW59LnN3YWwyLWFuaW1hdGUtZXJyb3ItaWNvbnstd2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzO2FuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLWljb24gLjVzfS5zd2FsMi1hbmltYXRlLWVycm9yLWljb24gLnN3YWwyLXgtbWFya3std2Via2l0LWFuaW1hdGlvbjpzd2FsMi1hbmltYXRlLWVycm9yLXgtbWFyayAuNXM7YW5pbWF0aW9uOnN3YWwyLWFuaW1hdGUtZXJyb3IteC1tYXJrIC41c31ALXdlYmtpdC1rZXlmcmFtZXMgc3dhbDItcm90YXRlLWxvYWRpbmd7MCV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDApO3RyYW5zZm9ybTpyb3RhdGUoMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fUBrZXlmcmFtZXMgc3dhbDItcm90YXRlLWxvYWRpbmd7MCV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDApO3RyYW5zZm9ybTpyb3RhdGUoMCl9MTAwJXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fUBtZWRpYSBwcmludHtib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pe292ZXJmbG93LXk6c2Nyb2xsIWltcG9ydGFudH1ib2R5LnN3YWwyLXNob3duOm5vdCguc3dhbDItbm8tYmFja2Ryb3ApOm5vdCguc3dhbDItdG9hc3Qtc2hvd24pPlthcmlhLWhpZGRlbj10cnVlXXtkaXNwbGF5Om5vbmV9Ym9keS5zd2FsMi1zaG93bjpub3QoLnN3YWwyLW5vLWJhY2tkcm9wKTpub3QoLnN3YWwyLXRvYXN0LXNob3duKSAuc3dhbDItY29udGFpbmVye3Bvc2l0aW9uOnN0YXRpYyFpbXBvcnRhbnR9fVwiKTsiLCIvKipcclxuICogQHByZXNlcnZlIHRhYmxlRXhwb3J0LmpxdWVyeS5wbHVnaW5cclxuICpcclxuICogVmVyc2lvbiAxLjEwLjRcclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTkgaGh1cnosIGh0dHBzOi8vZ2l0aHViLmNvbS9oaHVyelxyXG4gKlxyXG4gKiBPcmlnaW5hbCBXb3JrIENvcHlyaWdodCAoYykgMjAxNCBHaXJpIFJhalxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuICoqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgkKSB7XHJcbiAgJC5mbi50YWJsZUV4cG9ydCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgIGNzdkVuY2xvc3VyZTogICAgICAgICdcIicsXHJcbiAgICAgIGNzdlNlcGFyYXRvcjogICAgICAgICcsJyxcclxuICAgICAgY3N2VXNlQk9NOiAgICAgICAgICAgdHJ1ZSxcclxuICAgICAgZGlzcGxheVRhYmxlTmFtZTogICAgZmFsc2UsXHJcbiAgICAgIGVzY2FwZTogICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICBleHBvcnRIaWRkZW5DZWxsczogICBmYWxzZSwgICAgICAgLy8gdHJ1ZSA9IHNwZWVkIHVwIGV4cG9ydCBvZiBsYXJnZSB0YWJsZXMgd2l0aCBoaWRkZW4gY2VsbHMgKGhpZGRlbiBjZWxscyB3aWxsIGJlIGV4cG9ydGVkICEpXHJcbiAgICAgIGZpbGVOYW1lOiAgICAgICAgICAgICd0YWJsZUV4cG9ydCcsXHJcbiAgICAgIGh0bWxDb250ZW50OiAgICAgICAgIGZhbHNlLFxyXG4gICAgICBpZ25vcmVDb2x1bW46ICAgICAgICBbXSxcclxuICAgICAgaWdub3JlUm93OiAgICAgICAgICAgW10sXHJcbiAgICAgIGpzb25TY29wZTogICAgICAgICAgICdhbGwnLCAgICAgICAvLyBoZWFkLCBkYXRhLCBhbGxcclxuICAgICAganNwZGY6IHsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpzUERGIC8ganNQREYtQXV0b1RhYmxlIHJlbGF0ZWQgb3B0aW9uc1xyXG4gICAgICAgIG9yaWVudGF0aW9uOiAgICAgICAncCcsXHJcbiAgICAgICAgdW5pdDogICAgICAgICAgICAgICdwdCcsXHJcbiAgICAgICAgZm9ybWF0OiAgICAgICAgICAgICdhNCcsICAgICAgICAvLyBPbmUgb2YganNQREYgcGFnZSBmb3JtYXRzIG9yICdiZXN0Zml0JyBmb3IgYXV0bWF0aWMgcGFwZXIgZm9ybWF0IHNlbGVjdGlvblxyXG4gICAgICAgIG1hcmdpbnM6ICAgICAgICAgICB7bGVmdDogMjAsIHJpZ2h0OiAxMCwgdG9wOiAxMCwgYm90dG9tOiAxMH0sXHJcbiAgICAgICAgb25Eb2NDcmVhdGVkOiAgICAgIG51bGwsXHJcbiAgICAgICAgYXV0b3RhYmxlOiB7XHJcbiAgICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgICAgY2VsbFBhZGRpbmc6ICAgMixcclxuICAgICAgICAgICAgcm93SGVpZ2h0OiAgICAgMTIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAgICAgIDgsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvcjogICAgIDI1NSwgICAgICAgICAvLyBDb2xvciB2YWx1ZSBvciAnaW5oZXJpdCcgdG8gdXNlIGNzcyBiYWNrZ3JvdW5kLWNvbG9yIGZyb20gaHRtbCB0YWJsZVxyXG4gICAgICAgICAgICB0ZXh0Q29sb3I6ICAgICA1MCwgICAgICAgICAgLy8gQ29sb3IgdmFsdWUgb3IgJ2luaGVyaXQnIHRvIHVzZSBjc3MgY29sb3IgZnJvbSBodG1sIHRhYmxlXHJcbiAgICAgICAgICAgIGZvbnRTdHlsZTogICAgICdub3JtYWwnLCAgICAvLyBub3JtYWwsIGJvbGQsIGl0YWxpYywgYm9sZGl0YWxpYyBvciAnaW5oZXJpdCcgdG8gdXNlIGNzcyBmb250LXdlaWdodCBhbmQgZm9uc3Qtc3R5bGUgZnJvbSBodG1sIHRhYmxlXHJcbiAgICAgICAgICAgIG92ZXJmbG93OiAgICAgICdlbGxpcHNpemUnLCAvLyB2aXNpYmxlLCBoaWRkZW4sIGVsbGlwc2l6ZSBvciBsaW5lYnJlYWtcclxuICAgICAgICAgICAgaGFsaWduOiAgICAgICAgJ2luaGVyaXQnLCAgIC8vIGxlZnQsIGNlbnRlciwgcmlnaHQgb3IgJ2luaGVyaXQnIHRvIHVzZSBjc3MgaG9yaXpvbnRhbCBjZWxsIGFsaWdubWVudCBmcm9tIGh0bWwgdGFibGVcclxuICAgICAgICAgICAgdmFsaWduOiAgICAgICAgJ21pZGRsZScgICAgIC8vIHRvcCwgbWlkZGxlLCBib3R0b21cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBoZWFkZXJTdHlsZXM6IHtcclxuICAgICAgICAgICAgZmlsbENvbG9yOiAgICAgWzUyLCA3MywgOTRdLFxyXG4gICAgICAgICAgICB0ZXh0Q29sb3I6ICAgICAyNTUsXHJcbiAgICAgICAgICAgIGZvbnRTdHlsZTogICAgICdib2xkJyxcclxuICAgICAgICAgICAgaGFsaWduOiAgICAgICAgJ2luaGVyaXQnLCAgIC8vIGxlZnQsIGNlbnRlciwgcmlnaHQgb3IgJ2luaGVyaXQnIHRvIHVzZSBjc3MgaG9yaXpvbnRhbCBoZWFkZXIgY2VsbCBhbGlnbm1lbnQgZnJvbSBodG1sIHRhYmxlXHJcbiAgICAgICAgICAgIHZhbGlnbjogICAgICAgICdtaWRkbGUnICAgICAvLyB0b3AsIG1pZGRsZSwgYm90dG9tXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWx0ZXJuYXRlUm93U3R5bGVzOiB7XHJcbiAgICAgICAgICAgIGZpbGxDb2xvcjogICAgIDI0NVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRhYmxlRXhwb3J0OiB7XHJcbiAgICAgICAgICAgIGRvYzogICAgICAgICAgICAgICBudWxsLCAgICAvLyBqc1BERiBkb2Mgb2JqZWN0LiBJZiBzZXQsIGFuIGFscmVhZHkgY3JlYXRlZCBkb2Mgd2lsbCBiZSB1c2VkIHRvIGV4cG9ydCB0b1xyXG4gICAgICAgICAgICBvbkFmdGVyQXV0b3RhYmxlOiAgbnVsbCxcclxuICAgICAgICAgICAgb25CZWZvcmVBdXRvdGFibGU6IG51bGwsXHJcbiAgICAgICAgICAgIG9uQXV0b3RhYmxlVGV4dDogICBudWxsLFxyXG4gICAgICAgICAgICBvblRhYmxlOiAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgb3V0cHV0SW1hZ2VzOiAgICAgIHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG1zbzogeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNUyBFeGNlbCBhbmQgTVMgV29yZCByZWxhdGVkIG9wdGlvbnNcclxuICAgICAgICBmaWxlRm9ybWF0OiAgICAgICAgJ3hsc2h0bWwnLCAgIC8vIHhsc2h0bWwgPSBFeGNlbCAyMDAwIGh0bWwgZm9ybWF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB4bWxzcyA9IFhNTCBTcHJlYWRzaGVldCAyMDAzIGZpbGUgZm9ybWF0IChYTUxTUylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHhsc3ggPSBFeGNlbCAyMDA3IE9mZmljZSBPcGVuIFhNTCBmb3JtYXRcclxuICAgICAgICBvbk1zb051bWJlckZvcm1hdDogbnVsbCwgICAgICAgIC8vIEV4Y2VsIDIwMDAgaHRtbCBmb3JtYXQgb25seS4gU2VlIHJlYWRtZS5tZCBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBtc29udW1iZXJmb3JtYXRcclxuICAgICAgICBwYWdlRm9ybWF0OiAgICAgICAgJ2E0JywgICAgICAgIC8vIFBhZ2UgZm9ybWF0IHVzZWQgZm9yIHBhZ2Ugb3JpZW50YXRpb25cclxuICAgICAgICBwYWdlT3JpZW50YXRpb246ICAgJ3BvcnRyYWl0JywgIC8vIHBvcnRyYWl0LCBsYW5kc2NhcGUgKHhsc2h0bWwgZm9ybWF0IG9ubHkpXHJcbiAgICAgICAgcnRsOiAgICAgICAgICAgICAgIGZhbHNlLCAgICAgICAvLyB0cnVlID0gU2V0IHdvcmtzaGVldCBvcHRpb24gJ0Rpc3BsYXlSaWdodFRvTGVmdCdcclxuICAgICAgICBzdHlsZXM6ICAgICAgICAgICAgW10sICAgICAgICAgIC8vIEUuZy4gWydib3JkZXItYm90dG9tJywgJ2JvcmRlci10b3AnLCAnYm9yZGVyLWxlZnQnLCAnYm9yZGVyLXJpZ2h0J11cclxuICAgICAgICB3b3Jrc2hlZXROYW1lOiAgICAgJydcclxuICAgICAgfSxcclxuICAgICAgbnVtYmVyczoge1xyXG4gICAgICAgIGh0bWw6IHtcclxuICAgICAgICAgIGRlY2ltYWxNYXJrOiAgICAgICAgJy4nLFxyXG4gICAgICAgICAgdGhvdXNhbmRzU2VwYXJhdG9yOiAnLCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIG91dHB1dDogeyAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlICdvdXRwdXQ6IGZhbHNlJyB0byBrZWVwIG51bWJlciBmb3JtYXQgaW4gZXhwb3J0ZWQgb3V0cHV0XHJcbiAgICAgICAgICBkZWNpbWFsTWFyazogICAgICAgICcuJyxcclxuICAgICAgICAgIHRob3VzYW5kc1NlcGFyYXRvcjogJywnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBvbkFmdGVyU2F2ZVRvRmlsZTogICBudWxsLFxyXG4gICAgICBvbkJlZm9yZVNhdmVUb0ZpbGU6ICBudWxsLCAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGFzIHJlc3VsdCB0byBhYm9ydCBzYXZlIHByb2Nlc3NcclxuICAgICAgb25DZWxsRGF0YTogICAgICAgICAgbnVsbCxcclxuICAgICAgb25DZWxsSHRtbERhdGE6ICAgICAgbnVsbCxcclxuICAgICAgb25JZ25vcmVSb3c6ICAgICAgICAgbnVsbCwgICAgICAgIC8vIG9uSWdub3JlUm93KCR0ciwgcm93SW5kZXgpOiBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRydWUgdG8gbm90IGV4cG9ydCBhIHJvd1xyXG4gICAgICBvdXRwdXRNb2RlOiAgICAgICAgICAnZmlsZScsICAgICAgLy8gJ2ZpbGUnLCAnc3RyaW5nJywgJ2Jhc2U2NCcgb3IgJ3dpbmRvdycgKGV4cGVyaW1lbnRhbClcclxuICAgICAgcGRmbWFrZToge1xyXG4gICAgICAgIGVuYWJsZWQ6ICAgICAgICAgICBmYWxzZSwgICAgICAgLy8gdHJ1ZTogdXNlIHBkZm1ha2UgaW5zdGVhZCBvZiBqc3BkZiBhbmQganNwZGYtYXV0b3RhYmxlIChleHBlcmltZW50YWwpXHJcbiAgICAgICAgZG9jRGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgcGFnZU9yaWVudGF0aW9uOiAncG9ydHJhaXQnLCAgLy8gJ3BvcnRyYWl0JyBvciAnbGFuZHNjYXBlJ1xyXG4gICAgICAgICAgZGVmYXVsdFN0eWxlOiB7XHJcbiAgICAgICAgICAgIGZvbnQ6ICAgICAgICAgICdSb2JvdG8nICAgICAvLyBEZWZhdWx0IGlzICdSb2JvdG8nLCBmb3IgYXJhYmljIGZvbnQgc2V0IHRoaXMgb3B0aW9uIHRvICdNaXJ6YScgYW5kIGluY2x1ZGUgbWlyemFfZm9udHMuanNcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvbnRzOiB7fVxyXG4gICAgICB9LFxyXG4gICAgICBwcmVzZXJ2ZToge1xyXG4gICAgICAgIGxlYWRpbmdXUzogICAgICAgICBmYWxzZSwgICAgICAgLy8gcHJlc2VydmUgbGVhZGluZyB3aGl0ZSBzcGFjZXNcclxuICAgICAgICB0cmFpbGluZ1dTOiAgICAgICAgZmFsc2UgICAgICAgIC8vIHByZXNlcnZlIHRyYWlsaW5nIHdoaXRlIHNwYWNlc1xyXG4gICAgICB9LFxyXG4gICAgICBwcmV2ZW50SW5qZWN0aW9uOiAgICB0cnVlLCAgICAgICAgLy8gUHJlcGVuZCBhIHNpbmdsZSBxdW90ZSB0byBjZWxsIHN0cmluZ3MgdGhhdCBzdGFydCB3aXRoID0sKywtIG9yIEAgdG8gcHJldmVudCBmb3JtdWxhIGluamVjdGlvblxyXG4gICAgICBzcWw6IHtcclxuICAgICAgICB0YWJsZUVuY2xvc3VyZTogICAgICdgJywgICAgICAgIC8vIElmIHRhYmxlIG9yIGNvbHVtbiBuYW1lcyBjb250YWluIGFueSBjaGFyYWN0ZXJzIGV4Y2VwdCBsZXR0ZXJzLCBudW1iZXJzLCBhbmRcclxuICAgICAgICBjb2x1bW5FbmNsb3N1cmU6ICAgICdgJyAgICAgICAgIC8vIHVuZGVyc2NvcmVzIHVzdWFsbHkgdGhlIG5hbWUgbXVzdCBiZSBkZWxpbWl0ZWQgYnkgZW5jbG9zaW5nIGl0IGluIGJhY2sgcXVvdGVzIChgKVxyXG4gICAgICB9LFxyXG4gICAgICB0Ym9keVNlbGVjdG9yOiAgICAgICAndHInLFxyXG4gICAgICB0Zm9vdFNlbGVjdG9yOiAgICAgICAndHInLCAgICAgICAgLy8gU2V0IGVtcHR5ICgnJykgdG8gcHJldmVudCBleHBvcnQgb2YgdGZvb3Qgcm93c1xyXG4gICAgICB0aGVhZFNlbGVjdG9yOiAgICAgICAndHInLFxyXG4gICAgICB0YWJsZU5hbWU6ICAgICAgICAgICAnVGFibGUnLFxyXG4gICAgICB0eXBlOiAgICAgICAgICAgICAgICAnY3N2JyAgICAgICAgLy8gJ2NzdicsICd0c3YnLCAndHh0JywgJ3NxbCcsICdqc29uJywgJ3htbCcsICdleGNlbCcsICdkb2MnLCAncG5nJyBvciAncGRmJ1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcGFnZUZvcm1hdHMgPSB7IC8vIFNpemUgaW4gcHQgb2YgdmFyaW91cyBwYXBlciBmb3JtYXRzLiBBZG9wdGVkIGZyb20ganNQREYuXHJcbiAgICAgICdhMCc6IFsyMzgzLjk0LCAzMzcwLjM5XSwgJ2ExJzogWzE2ODMuNzgsIDIzODMuOTRdLCAnYTInOiBbMTE5MC41NSwgMTY4My43OF0sXHJcbiAgICAgICdhMyc6IFs4NDEuODksIDExOTAuNTVdLCAgJ2E0JzogWzU5NS4yOCwgODQxLjg5XSwgICAnYTUnOiBbNDE5LjUzLCA1OTUuMjhdLFxyXG4gICAgICAnYTYnOiBbMjk3LjY0LCA0MTkuNTNdLCAgICdhNyc6IFsyMDkuNzYsIDI5Ny42NF0sICAgJ2E4JzogWzE0Ny40MCwgMjA5Ljc2XSxcclxuICAgICAgJ2E5JzogWzEwNC44OCwgMTQ3LjQwXSwgICAnYTEwJzogWzczLjcwLCAxMDQuODhdLFxyXG4gICAgICAnYjAnOiBbMjgzNC42NSwgNDAwOC4xOV0sICdiMSc6IFsyMDA0LjA5LCAyODM0LjY1XSwgJ2IyJzogWzE0MTcuMzIsIDIwMDQuMDldLFxyXG4gICAgICAnYjMnOiBbMTAwMC42MywgMTQxNy4zMl0sICdiNCc6IFs3MDguNjYsIDEwMDAuNjNdLCAgJ2I1JzogWzQ5OC45MCwgNzA4LjY2XSxcclxuICAgICAgJ2I2JzogWzM1NC4zMywgNDk4LjkwXSwgICAnYjcnOiBbMjQ5LjQ1LCAzNTQuMzNdLCAgICdiOCc6IFsxNzUuNzUsIDI0OS40NV0sXHJcbiAgICAgICdiOSc6IFsxMjQuNzIsIDE3NS43NV0sICAgJ2IxMCc6IFs4Ny44NywgMTI0LjcyXSxcclxuICAgICAgJ2MwJzogWzI1OTkuMzcsIDM2NzYuNTRdLFxyXG4gICAgICAnYzEnOiBbMTgzNi44NSwgMjU5OS4zN10sICdjMic6IFsxMjk4LjI3LCAxODM2Ljg1XSwgJ2MzJzogWzkxOC40MywgMTI5OC4yN10sXHJcbiAgICAgICdjNCc6IFs2NDkuMTMsIDkxOC40M10sICAgJ2M1JzogWzQ1OS4yMSwgNjQ5LjEzXSwgICAnYzYnOiBbMzIzLjE1LCA0NTkuMjFdLFxyXG4gICAgICAnYzcnOiBbMjI5LjYxLCAzMjMuMTVdLCAgICdjOCc6IFsxNjEuNTcsIDIyOS42MV0sICAgJ2M5JzogWzExMy4zOSwgMTYxLjU3XSxcclxuICAgICAgJ2MxMCc6IFs3OS4zNywgMTEzLjM5XSxcclxuICAgICAgJ2RsJzogWzMxMS44MSwgNjIzLjYyXSxcclxuICAgICAgJ2xldHRlcic6IFs2MTIsIDc5Ml0sICdnb3Zlcm5tZW50LWxldHRlcic6IFs1NzYsIDc1Nl0sICdsZWdhbCc6IFs2MTIsIDEwMDhdLFxyXG4gICAgICAnanVuaW9yLWxlZ2FsJzogWzU3NiwgMzYwXSwgJ2xlZGdlcic6IFsxMjI0LCA3OTJdLCAndGFibG9pZCc6IFs3OTIsIDEyMjRdLFxyXG4gICAgICAnY3JlZGl0LWNhcmQnOiBbMTUzLCAyNDNdXHJcbiAgICB9O1xyXG4gICAgdmFyIEZPTlRfUk9XX1JBVElPID0gMS4xNTtcclxuICAgIHZhciBlbCAgICAgICAgICAgICA9IHRoaXM7XHJcbiAgICB2YXIgRG93bmxvYWRFdnQgICAgPSBudWxsO1xyXG4gICAgdmFyICRocm93cyAgICAgICAgID0gW107XHJcbiAgICB2YXIgJHJvd3MgICAgICAgICAgPSBbXTtcclxuICAgIHZhciByb3dJbmRleCAgICAgICA9IDA7XHJcbiAgICB2YXIgdHJEYXRhICAgICAgICAgPSAnJztcclxuICAgIHZhciBjb2xOYW1lcyAgICAgICA9IFtdO1xyXG4gICAgdmFyIHJhbmdlcyAgICAgICAgID0gW107XHJcbiAgICB2YXIgYmxvYjtcclxuICAgIHZhciAkaGlkZGVuVGFibGVFbGVtZW50cyA9IFtdO1xyXG4gICAgdmFyIGNoZWNrQ2VsbFZpc2liaWx0eSA9IGZhbHNlO1xyXG5cclxuICAgICQuZXh0ZW5kKHRydWUsIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAvLyBBZG9wdCBkZXByZWNhdGVkIG9wdGlvbnNcclxuICAgIGlmIChkZWZhdWx0cy50eXBlID09PSAneGxzeCcpIHtcclxuICAgICAgZGVmYXVsdHMubXNvLmZpbGVGb3JtYXQgPSBkZWZhdWx0cy50eXBlO1xyXG4gICAgICBkZWZhdWx0cy50eXBlID0gJ2V4Y2VsJztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZGVmYXVsdHMuZXhjZWxGaWxlRm9ybWF0ICE9PSAndW5kZWZpbmVkJyAmJiBkZWZhdWx0cy5tc28uZmlsZUZvcm1hdCA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGRlZmF1bHRzLm1zby5maWxlRm9ybWF0ID0gZGVmYXVsdHMuZXhjZWxGaWxlRm9ybWF0O1xyXG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0cy5leGNlbFBhZ2VGb3JtYXQgIT09ICd1bmRlZmluZWQnICYmIGRlZmF1bHRzLm1zby5wYWdlRm9ybWF0ID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZGVmYXVsdHMubXNvLnBhZ2VGb3JtYXQgPSBkZWZhdWx0cy5leGNlbFBhZ2VGb3JtYXQ7XHJcbiAgICBpZiAodHlwZW9mIGRlZmF1bHRzLmV4Y2VsUGFnZU9yaWVudGF0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBkZWZhdWx0cy5tc28ucGFnZU9yaWVudGF0aW9uID09PSAndW5kZWZpbmVkJylcclxuICAgICAgZGVmYXVsdHMubXNvLnBhZ2VPcmllbnRhdGlvbiA9IGRlZmF1bHRzLmV4Y2VsUGFnZU9yaWVudGF0aW9uO1xyXG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0cy5leGNlbFJUTCAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmYXVsdHMubXNvLnJ0bCA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgIGRlZmF1bHRzLm1zby5ydGwgPSBkZWZhdWx0cy5leGNlbFJUTDtcclxuICAgIGlmICh0eXBlb2YgZGVmYXVsdHMuZXhjZWxzdHlsZXMgIT09ICd1bmRlZmluZWQnICYmIGRlZmF1bHRzLm1zby5zdHlsZXMgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBkZWZhdWx0cy5tc28uc3R5bGVzID0gZGVmYXVsdHMuZXhjZWxzdHlsZXM7XHJcbiAgICBpZiAodHlwZW9mIGRlZmF1bHRzLm9uTXNvTnVtYmVyRm9ybWF0ICE9PSAndW5kZWZpbmVkJyAmJiBkZWZhdWx0cy5tc28ub25Nc29OdW1iZXJGb3JtYXQgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBkZWZhdWx0cy5tc28ub25Nc29OdW1iZXJGb3JtYXQgPSBkZWZhdWx0cy5vbk1zb051bWJlckZvcm1hdDtcclxuICAgIGlmICh0eXBlb2YgZGVmYXVsdHMud29ya3NoZWV0TmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmYXVsdHMubXNvLndvcmtzaGVldE5hbWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICBkZWZhdWx0cy5tc28ud29ya3NoZWV0TmFtZSA9IGRlZmF1bHRzLndvcmtzaGVldE5hbWU7XHJcblxyXG4gICAgLy8gQ2hlY2sgdmFsdWVzIG9mIHNvbWUgb3B0aW9uc1xyXG4gICAgZGVmYXVsdHMubXNvLnBhZ2VPcmllbnRhdGlvbiA9IChkZWZhdWx0cy5tc28ucGFnZU9yaWVudGF0aW9uLnN1YnN0cigwLCAxKSA9PT0gJ2wnKSA/ICdsYW5kc2NhcGUnIDogJ3BvcnRyYWl0JztcclxuXHJcbiAgICBjb2xOYW1lcyA9IEdldENvbHVtbk5hbWVzKGVsKTtcclxuXHJcbiAgICBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICdjc3YnIHx8IGRlZmF1bHRzLnR5cGUgPT09ICd0c3YnIHx8IGRlZmF1bHRzLnR5cGUgPT09ICd0eHQnICkge1xyXG5cclxuICAgICAgdmFyIGNzdkRhdGEgICA9IFwiXCI7XHJcbiAgICAgIHZhciByb3dsZW5ndGggPSAwO1xyXG4gICAgICByYW5nZXMgICAgICAgID0gW107XHJcbiAgICAgIHJvd0luZGV4ICAgICAgPSAwO1xyXG5cclxuICAgICAgdmFyIGNzdlN0cmluZyA9IGZ1bmN0aW9uIChjZWxsLCByb3dJbmRleCwgY29sSW5kZXgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcblxyXG4gICAgICAgIGlmICggY2VsbCAhPT0gbnVsbCApIHtcclxuICAgICAgICAgIHZhciBkYXRhU3RyaW5nID0gcGFyc2VTdHJpbmcoY2VsbCwgcm93SW5kZXgsIGNvbEluZGV4KTtcclxuXHJcbiAgICAgICAgICB2YXIgY3N2VmFsdWUgPSAoZGF0YVN0cmluZyA9PT0gbnVsbCB8fCBkYXRhU3RyaW5nID09PSAnJykgPyAnJyA6IGRhdGFTdHJpbmcudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICd0c3YnICkge1xyXG4gICAgICAgICAgICBpZiAoIGRhdGFTdHJpbmcgaW5zdGFuY2VvZiBEYXRlIClcclxuICAgICAgICAgICAgICBkYXRhU3RyaW5nLnRvTG9jYWxlU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBBY2NvcmRpbmcgdG8gaHR0cDovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9tZWRpYS10eXBlcy90ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzXHJcbiAgICAgICAgICAgIC8vIGFyZSBmaWVsZHMgdGhhdCBjb250YWluIHRhYnMgbm90IGFsbG93YWJsZSBpbiB0c3YgZW5jb2RpbmdcclxuICAgICAgICAgICAgcmVzdWx0ID0gcmVwbGFjZUFsbChjc3ZWYWx1ZSwgJ1xcdCcsICcgJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGFrZXMgYSBzdHJpbmcgYW5kIGVuY2Fwc3VsYXRlcyBpdCAoYnkgZGVmYXVsdCBpbiBkb3VibGUtcXVvdGVzKSBpZiBpdFxyXG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgY3N2IGZpZWxkIHNlcGFyYXRvciwgc3BhY2VzLCBvciBsaW5lYnJlYWtzLlxyXG4gICAgICAgICAgICBpZiAoIGRhdGFTdHJpbmcgaW5zdGFuY2VvZiBEYXRlIClcclxuICAgICAgICAgICAgICByZXN1bHQgPSBkZWZhdWx0cy5jc3ZFbmNsb3N1cmUgKyBkYXRhU3RyaW5nLnRvTG9jYWxlU3RyaW5nKCkgKyBkZWZhdWx0cy5jc3ZFbmNsb3N1cmU7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlc3VsdCA9IHByZXZlbnRJbmplY3Rpb24oY3N2VmFsdWUpO1xyXG4gICAgICAgICAgICAgIHJlc3VsdCA9IHJlcGxhY2VBbGwocmVzdWx0LCBkZWZhdWx0cy5jc3ZFbmNsb3N1cmUsIGRlZmF1bHRzLmNzdkVuY2xvc3VyZSArIGRlZmF1bHRzLmNzdkVuY2xvc3VyZSk7XHJcblxyXG4gICAgICAgICAgICAgIGlmICggcmVzdWx0LmluZGV4T2YoZGVmYXVsdHMuY3N2U2VwYXJhdG9yKSA+PSAwIHx8IC9bXFxyXFxuIF0vZy50ZXN0KHJlc3VsdCkgKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVmYXVsdHMuY3N2RW5jbG9zdXJlICsgcmVzdWx0ICsgZGVmYXVsdHMuY3N2RW5jbG9zdXJlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIENvbGxlY3RDc3ZEYXRhID0gZnVuY3Rpb24gKCRyb3dzLCByb3dzZWxlY3RvciwgbGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICRyb3dzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdHJEYXRhID0gXCJcIjtcclxuICAgICAgICAgIEZvckVhY2hWaXNpYmxlQ2VsbCh0aGlzLCByb3dzZWxlY3Rvciwgcm93SW5kZXgsIGxlbmd0aCArICRyb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2VsbCwgcm93LCBjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyRGF0YSArPSBjc3ZTdHJpbmcoY2VsbCwgcm93LCBjb2wpICsgKGRlZmF1bHRzLnR5cGUgPT09ICd0c3YnID8gJ1xcdCcgOiBkZWZhdWx0cy5jc3ZTZXBhcmF0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdHJEYXRhID0gJC50cmltKHRyRGF0YSkuc3Vic3RyaW5nKDAsIHRyRGF0YS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgIGlmICggdHJEYXRhLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGNzdkRhdGEubGVuZ3RoID4gMCApXHJcbiAgICAgICAgICAgICAgY3N2RGF0YSArPSBcIlxcblwiO1xyXG5cclxuICAgICAgICAgICAgY3N2RGF0YSArPSB0ckRhdGE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHJvd3MubGVuZ3RoO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcm93bGVuZ3RoICs9IENvbGxlY3RDc3ZEYXRhKCQoZWwpLmZpbmQoJ3RoZWFkJykuZmlyc3QoKS5maW5kKGRlZmF1bHRzLnRoZWFkU2VsZWN0b3IpLCAndGgsdGQnLCByb3dsZW5ndGgpO1xyXG4gICAgICBmaW5kVGFibGVFbGVtZW50cygkKGVsKSwndGJvZHknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByb3dsZW5ndGggKz0gQ29sbGVjdENzdkRhdGEoZmluZFRhYmxlRWxlbWVudHMoJCh0aGlzKSwgZGVmYXVsdHMudGJvZHlTZWxlY3RvciksICd0ZCx0aCcsIHJvd2xlbmd0aCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoIGRlZmF1bHRzLnRmb290U2VsZWN0b3IubGVuZ3RoIClcclxuICAgICAgICBDb2xsZWN0Q3N2RGF0YSgkKGVsKS5maW5kKCd0Zm9vdCcpLmZpcnN0KCkuZmluZChkZWZhdWx0cy50Zm9vdFNlbGVjdG9yKSwgJ3RkLHRoJywgcm93bGVuZ3RoKTtcclxuXHJcbiAgICAgIGNzdkRhdGEgKz0gXCJcXG5cIjtcclxuXHJcbiAgICAgIC8vb3V0cHV0XHJcbiAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ3N0cmluZycgKVxyXG4gICAgICAgIHJldHVybiBjc3ZEYXRhO1xyXG5cclxuICAgICAgaWYgKCBkZWZhdWx0cy5vdXRwdXRNb2RlID09PSAnYmFzZTY0JyApXHJcbiAgICAgICAgcmV0dXJuIGJhc2U2NGVuY29kZShjc3ZEYXRhKTtcclxuXHJcbiAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ3dpbmRvdycgKSB7XHJcbiAgICAgICAgZG93bmxvYWRGaWxlKGZhbHNlLCAnZGF0YTp0ZXh0LycgKyAoZGVmYXVsdHMudHlwZSA9PT0gJ2NzdicgPyAnY3N2JyA6ICdwbGFpbicpICsgJztjaGFyc2V0PXV0Zi04LCcsIGNzdkRhdGEpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2F2ZVRvRmlsZSAoIGNzdkRhdGEsIFxyXG4gICAgICAgICAgICAgICAgICAgZGVmYXVsdHMuZmlsZU5hbWUgKyAnLicgKyBkZWZhdWx0cy50eXBlLCBcclxuICAgICAgICAgICAgICAgICAgIFwidGV4dC9cIiArIChkZWZhdWx0cy50eXBlID09PSAnY3N2JyA/ICdjc3YnIDogJ3BsYWluJyksIFxyXG4gICAgICAgICAgICAgICAgICAgXCJ1dGYtOFwiLCBcclxuICAgICAgICAgICAgICAgICAgIFwiXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgKGRlZmF1bHRzLnR5cGUgPT09ICdjc3YnICYmIGRlZmF1bHRzLmNzdlVzZUJPTSkgKTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKCBkZWZhdWx0cy50eXBlID09PSAnc3FsJyApIHtcclxuXHJcbiAgICAgIC8vIEhlYWRlclxyXG4gICAgICByb3dJbmRleCA9IDA7XHJcbiAgICAgIHJhbmdlcyAgID0gW107XHJcbiAgICAgIHZhciB0ZERhdGEgPSBcIklOU0VSVCBJTlRPIFwiICsgZGVmYXVsdHMuc3FsLnRhYmxlRW5jbG9zdXJlICsgZGVmYXVsdHMudGFibGVOYW1lICsgZGVmYXVsdHMuc3FsLnRhYmxlRW5jbG9zdXJlICsgXCIgKFwiO1xyXG4gICAgICAkaHJvd3MgICAgID0gY29sbGVjdEhlYWRSb3dzICgkKGVsKSk7XHJcbiAgICAgICQoJGhyb3dzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBGb3JFYWNoVmlzaWJsZUNlbGwodGhpcywgJ3RoLHRkJywgcm93SW5kZXgsICRocm93cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjZWxsLCByb3csIGNvbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRkRGF0YSArPSBkZWZhdWx0cy5zcWwuY29sdW1uRW5jbG9zdXJlICsgcGFyc2VTdHJpbmcoY2VsbCwgcm93LCBjb2wpICsgZGVmYXVsdHMuc3FsLmNvbHVtbkVuY2xvc3VyZSArIFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgIHRkRGF0YSA9ICQudHJpbSh0ZERhdGEpLnN1YnN0cmluZygwLCB0ZERhdGEubGVuZ3RoIC0gMSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0ZERhdGEgKz0gXCIpIFZBTFVFUyBcIjtcclxuXHJcbiAgICAgIC8vIERhdGFcclxuICAgICAgJHJvd3MgPSBjb2xsZWN0Um93cyAoJChlbCkpO1xyXG4gICAgICAkKCRyb3dzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0ckRhdGEgPSBcIlwiO1xyXG4gICAgICAgIEZvckVhY2hWaXNpYmxlQ2VsbCh0aGlzLCAndGQsdGgnLCByb3dJbmRleCwgJGhyb3dzLmxlbmd0aCArICRyb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNlbGwsIHJvdywgY29sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJEYXRhICs9IFwiJ1wiICsgcGFyc2VTdHJpbmcoY2VsbCwgcm93LCBjb2wpICsgXCInLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICBpZiAoIHRyRGF0YS5sZW5ndGggPiAzICkge1xyXG4gICAgICAgICAgdGREYXRhICs9IFwiKFwiICsgdHJEYXRhO1xyXG4gICAgICAgICAgdGREYXRhID0gJC50cmltKHRkRGF0YSkuc3Vic3RyaW5nKDAsIHRkRGF0YS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgIHRkRGF0YSArPSBcIiksXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJvd0luZGV4Kys7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGREYXRhID0gJC50cmltKHRkRGF0YSkuc3Vic3RyaW5nKDAsIHRkRGF0YS5sZW5ndGggLSAxKTtcclxuICAgICAgdGREYXRhICs9IFwiO1wiO1xyXG5cclxuICAgICAgLy8gT3V0cHV0XHJcbiAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ3N0cmluZycgKVxyXG4gICAgICAgIHJldHVybiB0ZERhdGE7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdiYXNlNjQnIClcclxuICAgICAgICByZXR1cm4gYmFzZTY0ZW5jb2RlKHRkRGF0YSk7XHJcblxyXG4gICAgICBzYXZlVG9GaWxlICggdGREYXRhLCBkZWZhdWx0cy5maWxlTmFtZSArICcuc3FsJywgXCJhcHBsaWNhdGlvbi9zcWxcIiwgXCJ1dGYtOFwiLCBcIlwiLCBmYWxzZSApO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICdqc29uJyApIHtcclxuICAgICAgdmFyIGpzb25IZWFkZXJBcnJheSA9IFtdO1xyXG4gICAgICByYW5nZXMgPSBbXTtcclxuICAgICAgJGhyb3dzID0gY29sbGVjdEhlYWRSb3dzICgkKGVsKSk7XHJcbiAgICAgICQoJGhyb3dzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIganNvbkFycmF5VGQgPSBbXTtcclxuXHJcbiAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsICd0aCx0ZCcsIHJvd0luZGV4LCAkaHJvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2VsbCwgcm93LCBjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uQXJyYXlUZC5wdXNoKHBhcnNlU3RyaW5nKGNlbGwsIHJvdywgY29sKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGpzb25IZWFkZXJBcnJheS5wdXNoKGpzb25BcnJheVRkKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBEYXRhXHJcbiAgICAgIHZhciBqc29uQXJyYXkgPSBbXTtcclxuXHJcbiAgICAgICRyb3dzID0gY29sbGVjdFJvd3MgKCQoZWwpKTtcclxuICAgICAgJCgkcm93cykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGpzb25PYmplY3RUZCA9IHt9O1xyXG4gICAgICAgIHZhciBjb2xJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIEZvckVhY2hWaXNpYmxlQ2VsbCh0aGlzLCAndGQsdGgnLCByb3dJbmRleCwgJGhyb3dzLmxlbmd0aCArICRyb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNlbGwsIHJvdywgY29sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBqc29uSGVhZGVyQXJyYXkubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbk9iamVjdFRkW2pzb25IZWFkZXJBcnJheVtqc29uSGVhZGVyQXJyYXkubGVuZ3RoIC0gMV1bY29sSW5kZXhdXSA9IHBhcnNlU3RyaW5nKGNlbGwsIHJvdywgY29sKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbk9iamVjdFRkW2NvbEluZGV4XSA9IHBhcnNlU3RyaW5nKGNlbGwsIHJvdywgY29sKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sSW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCAkLmlzRW1wdHlPYmplY3QoanNvbk9iamVjdFRkKSA9PT0gZmFsc2UgKVxyXG4gICAgICAgICAganNvbkFycmF5LnB1c2goanNvbk9iamVjdFRkKTtcclxuXHJcbiAgICAgICAgcm93SW5kZXgrKztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgc2RhdGEgPSBcIlwiO1xyXG5cclxuICAgICAgaWYgKCBkZWZhdWx0cy5qc29uU2NvcGUgPT09ICdoZWFkJyApXHJcbiAgICAgICAgc2RhdGEgPSBKU09OLnN0cmluZ2lmeShqc29uSGVhZGVyQXJyYXkpO1xyXG4gICAgICBlbHNlIGlmICggZGVmYXVsdHMuanNvblNjb3BlID09PSAnZGF0YScgKVxyXG4gICAgICAgIHNkYXRhID0gSlNPTi5zdHJpbmdpZnkoanNvbkFycmF5KTtcclxuICAgICAgZWxzZSAvLyBhbGxcclxuICAgICAgICBzZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtoZWFkZXI6IGpzb25IZWFkZXJBcnJheSwgZGF0YToganNvbkFycmF5fSk7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdzdHJpbmcnIClcclxuICAgICAgICByZXR1cm4gc2RhdGE7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdiYXNlNjQnIClcclxuICAgICAgICByZXR1cm4gYmFzZTY0ZW5jb2RlKHNkYXRhKTtcclxuXHJcbiAgICAgIHNhdmVUb0ZpbGUgKCBzZGF0YSwgZGVmYXVsdHMuZmlsZU5hbWUgKyAnLmpzb24nLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgXCJ1dGYtOFwiLCBcImJhc2U2NFwiLCBmYWxzZSApO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICd4bWwnICkge1xyXG4gICAgICByb3dJbmRleCA9IDA7XHJcbiAgICAgIHJhbmdlcyAgID0gW107XHJcbiAgICAgIHZhciB4bWwgID0gJzw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cInV0Zi04XCI/Pic7XHJcbiAgICAgIHhtbCArPSAnPHRhYmxlZGF0YT48ZmllbGRzPic7XHJcblxyXG4gICAgICAvLyBIZWFkZXJcclxuICAgICAgJGhyb3dzID0gY29sbGVjdEhlYWRSb3dzICgkKGVsKSk7XHJcbiAgICAgICQoJGhyb3dzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsICd0aCx0ZCcsIHJvd0luZGV4LCAkaHJvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2VsbCwgcm93LCBjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4bWwgKz0gXCI8ZmllbGQ+XCIgKyBwYXJzZVN0cmluZyhjZWxsLCByb3csIGNvbCkgKyBcIjwvZmllbGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJvd0luZGV4Kys7XHJcbiAgICAgIH0pO1xyXG4gICAgICB4bWwgKz0gJzwvZmllbGRzPjxkYXRhPic7XHJcblxyXG4gICAgICAvLyBEYXRhXHJcbiAgICAgIHZhciByb3dDb3VudCA9IDE7XHJcblxyXG4gICAgICAkcm93cyA9IGNvbGxlY3RSb3dzICgkKGVsKSk7XHJcbiAgICAgICQoJHJvd3MpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjb2xDb3VudCA9IDE7XHJcbiAgICAgICAgdHJEYXRhICAgICAgID0gXCJcIjtcclxuICAgICAgICBGb3JFYWNoVmlzaWJsZUNlbGwodGhpcywgJ3RkLHRoJywgcm93SW5kZXgsICRocm93cy5sZW5ndGggKyAkcm93cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjZWxsLCByb3csIGNvbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyRGF0YSArPSBcIjxjb2x1bW4tXCIgKyBjb2xDb3VudCArIFwiPlwiICsgcGFyc2VTdHJpbmcoY2VsbCwgcm93LCBjb2wpICsgXCI8L2NvbHVtbi1cIiArIGNvbENvdW50ICsgXCI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCB0ckRhdGEubGVuZ3RoID4gMCAmJiB0ckRhdGEgIT09IFwiPGNvbHVtbi0xPjwvY29sdW1uLTE+XCIgKSB7XHJcbiAgICAgICAgICB4bWwgKz0gJzxyb3cgaWQ9XCInICsgcm93Q291bnQgKyAnXCI+JyArIHRyRGF0YSArICc8L3Jvdz4nO1xyXG4gICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvd0luZGV4Kys7XHJcbiAgICAgIH0pO1xyXG4gICAgICB4bWwgKz0gJzwvZGF0YT48L3RhYmxlZGF0YT4nO1xyXG5cclxuICAgICAgLy8gT3V0cHV0XHJcbiAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ3N0cmluZycgKVxyXG4gICAgICAgIHJldHVybiB4bWw7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdiYXNlNjQnIClcclxuICAgICAgICByZXR1cm4gYmFzZTY0ZW5jb2RlKHhtbCk7XHJcblxyXG4gICAgICBzYXZlVG9GaWxlICggeG1sLCBkZWZhdWx0cy5maWxlTmFtZSArICcueG1sJywgXCJhcHBsaWNhdGlvbi94bWxcIiwgXCJ1dGYtOFwiLCBcImJhc2U2NFwiLCBmYWxzZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICdleGNlbCcgJiYgZGVmYXVsdHMubXNvLmZpbGVGb3JtYXQgPT09ICd4bWxzcycgKSB7XHJcbiAgICAgIHZhciBkb2NEYXRhcyA9IFtdO1xyXG4gICAgICB2YXIgZG9jTmFtZXMgPSBbXTtcclxuXHJcbiAgICAgICQoZWwpLmZpbHRlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzVmlzaWJsZSgkKHRoaXMpKTtcclxuICAgICAgfSkuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICR0YWJsZSAgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICB2YXIgc3NOYW1lID0gJyc7XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgZGVmYXVsdHMubXNvLndvcmtzaGVldE5hbWUgPT09ICdzdHJpbmcnICYmIGRlZmF1bHRzLm1zby53b3Jrc2hlZXROYW1lLmxlbmd0aCApXHJcbiAgICAgICAgICBzc05hbWUgPSBkZWZhdWx0cy5tc28ud29ya3NoZWV0TmFtZSArICcgJyArIChkb2NOYW1lcy5sZW5ndGggKyAxKTtcclxuICAgICAgICBlbHNlIGlmICggdHlwZW9mIGRlZmF1bHRzLm1zby53b3Jrc2hlZXROYW1lW2RvY05hbWVzLmxlbmd0aF0gIT09ICd1bmRlZmluZWQnIClcclxuICAgICAgICAgIHNzTmFtZSA9IGRlZmF1bHRzLm1zby53b3Jrc2hlZXROYW1lW2RvY05hbWVzLmxlbmd0aF07XHJcbiAgICAgICAgaWYgKCAhIHNzTmFtZS5sZW5ndGggKVxyXG4gICAgICAgICAgc3NOYW1lID0gJHRhYmxlLmZpbmQoJ2NhcHRpb24nKS50ZXh0KCkgfHwgJyc7XHJcbiAgICAgICAgaWYgKCAhIHNzTmFtZS5sZW5ndGggKVxyXG4gICAgICAgICAgc3NOYW1lID0gJ1RhYmxlICcgKyAoZG9jTmFtZXMubGVuZ3RoICsgMSk7XHJcbiAgICAgICAgc3NOYW1lID0gJC50cmltKHNzTmFtZS5yZXBsYWNlKC9bXFxcXFxcL1tcXF0qOj8nXCJdL2csJycpLnN1YnN0cmluZygwLDMxKSk7XHJcblxyXG4gICAgICAgIGRvY05hbWVzLnB1c2goJCgnPGRpdiAvPicpLnRleHQoc3NOYW1lKS5odG1sKCkpO1xyXG5cclxuICAgICAgICBpZiAoIGRlZmF1bHRzLmV4cG9ydEhpZGRlbkNlbGxzID09PSBmYWxzZSApIHtcclxuICAgICAgICAgICRoaWRkZW5UYWJsZUVsZW1lbnRzID0gJHRhYmxlLmZpbmQoXCJ0ciwgdGgsIHRkXCIpLmZpbHRlcihcIjpoaWRkZW5cIik7XHJcbiAgICAgICAgICBjaGVja0NlbGxWaXNpYmlsdHkgPSAkaGlkZGVuVGFibGVFbGVtZW50cy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm93SW5kZXggPSAwO1xyXG4gICAgICAgIGNvbE5hbWVzID0gR2V0Q29sdW1uTmFtZXModGhpcyk7XHJcbiAgICAgICAgZG9jRGF0YSAgPSAnPFRhYmxlPlxccic7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIENvbGxlY3RYbWxzc0RhdGEgKCRyb3dzLCByb3dzZWxlY3RvciwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICB2YXIgc3BhbnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAkKCRyb3dzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNzSW5kZXggPSAwO1xyXG4gICAgICAgICAgICB2YXIgbkNvbHMgPSAwO1xyXG4gICAgICAgICAgICB0ckRhdGEgICA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBGb3JFYWNoVmlzaWJsZUNlbGwodGhpcywgJ3RkLHRoJywgcm93SW5kZXgsIGxlbmd0aCArICRyb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjZWxsLCByb3csIGNvbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGNlbGwgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSAgPSBwYXJzZVN0cmluZyhjZWxsLCByb3csIGNvbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgID0gXCJTdHJpbmdcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBqUXVlcnkuaXNOdW1lcmljKGRhdGEpICE9PSBmYWxzZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSBcIk51bWJlclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXIgPSBwYXJzZVBlcmNlbnQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG51bWJlciAhPT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgID0gbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlICA9IFwiTnVtYmVyXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICcgc3M6U3R5bGVJRD1cInBjdDFcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGUgIT09IFwiTnVtYmVyXCIgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEucmVwbGFjZSgvXFxuL2csICc8YnI+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2xzcGFuID0gZ2V0Q29sc3BhbiAoY2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3NwYW4gPSBnZXRSb3dzcGFuIChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2tpcCBzcGFuc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChzcGFucywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcm93SW5kZXggPj0gcmFuZ2Uucy5yICYmIHJvd0luZGV4IDw9IHJhbmdlLmUuciAmJiBuQ29scyA+PSByYW5nZS5zLmMgJiYgbkNvbHMgPD0gcmFuZ2UuZS5jICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPD0gcmFuZ2UuZS5jIC0gcmFuZ2Uucy5jOyArK2kgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkNvbHMrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzc0luZGV4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIFJvdyBTcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByb3dzcGFuIHx8IGNvbHNwYW4gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuID0gcm93c3BhbiB8fCAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sc3BhbiA9IGNvbHNwYW4gfHwgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYW5zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHM6IHtyOiByb3dJbmRleCwgYzogbkNvbHN9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGU6IHtyOiByb3dJbmRleCArIHJvd3NwYW4gLSAxLCBjOiBuQ29scyArIGNvbHNwYW4gLSAxfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBDb2xzcGFuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjb2xzcGFuID4gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlICs9ICcgc3M6TWVyZ2VBY3Jvc3M9XCInICsgKGNvbHNwYW4tMSkgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkNvbHMgKz0gKGNvbHNwYW4gLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggcm93c3BhbiA+IDEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnIHNzOk1lcmdlRG93bj1cIicgKyAocm93c3Bhbi0xKSArICdcIiBzczpTdHlsZUlEPVwicnNwMVwiJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc3NJbmRleCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSArPSAnIHNzOkluZGV4PVwiJyArIChuQ29scysxKSArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzc0luZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyRGF0YSArPSAnPENlbGwnICsgc3R5bGUgKyAnPjxEYXRhIHNzOlR5cGU9XCInICsgdHlwZSArICdcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJzxkaXYgLz4nKS50ZXh0KGRhdGEpLmh0bWwoKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9EYXRhPjwvQ2VsbD5cXHInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5Db2xzKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoIHRyRGF0YS5sZW5ndGggPiAwIClcclxuICAgICAgICAgICAgICBkb2NEYXRhICs9ICc8Um93IHNzOkF1dG9GaXRIZWlnaHQ9XCIwXCI+XFxyJyArIHRyRGF0YSArICc8L1Jvdz5cXHInO1xyXG4gICAgICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuICRyb3dzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByb3dMZW5ndGggPSBDb2xsZWN0WG1sc3NEYXRhIChjb2xsZWN0SGVhZFJvd3MgKCR0YWJsZSksICd0aCx0ZCcsIHJvd0xlbmd0aCk7XHJcbiAgICAgICAgQ29sbGVjdFhtbHNzRGF0YSAoY29sbGVjdFJvd3MgKCR0YWJsZSksICd0ZCx0aCcsIHJvd0xlbmd0aCk7XHJcblxyXG4gICAgICAgIGRvY0RhdGEgKz0gJzwvVGFibGU+XFxyJztcclxuICAgICAgICBkb2NEYXRhcy5wdXNoKGRvY0RhdGEpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBjb3VudCA9IHt9O1xyXG4gICAgICB2YXIgZmlyc3RPY2N1cmVuY2VzID0ge307XHJcbiAgICAgIHZhciBpdGVtLCBpdGVtQ291bnQ7XHJcbiAgICAgIGZvciAodmFyIG4gPSAwLCBjID0gZG9jTmFtZXMubGVuZ3RoOyBuIDwgYzsgbisrKVxyXG4gICAgICB7XHJcbiAgICAgICAgaXRlbSA9IGRvY05hbWVzW25dO1xyXG4gICAgICAgIGl0ZW1Db3VudCA9IGNvdW50W2l0ZW1dO1xyXG4gICAgICAgIGl0ZW1Db3VudCA9IGNvdW50W2l0ZW1dID0gKGl0ZW1Db3VudCA9PSBudWxsID8gMSA6IGl0ZW1Db3VudCArIDEpO1xyXG5cclxuICAgICAgICBpZiggaXRlbUNvdW50ID09PSAyIClcclxuICAgICAgICAgIGRvY05hbWVzW2ZpcnN0T2NjdXJlbmNlc1tpdGVtXV0gPSBkb2NOYW1lc1tmaXJzdE9jY3VyZW5jZXNbaXRlbV1dLnN1YnN0cmluZygwLDI5KSArIFwiLTFcIjtcclxuICAgICAgICBpZiggY291bnRbIGl0ZW0gXSA+IDEgKVxyXG4gICAgICAgICAgZG9jTmFtZXNbbl0gPSBkb2NOYW1lc1tuXS5zdWJzdHJpbmcoMCwyOSkgKyBcIi1cIiArIGNvdW50W2l0ZW1dO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGZpcnN0T2NjdXJlbmNlc1tpdGVtXSA9IG47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBDcmVhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgIHZhciB4bWxzc0RvY0ZpbGUgPSAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIj8+XFxyJyArXHJcbiAgICAgICAgJzw/bXNvLWFwcGxpY2F0aW9uIHByb2dpZD1cIkV4Y2VsLlNoZWV0XCI/PlxccicgK1xyXG4gICAgICAgICc8V29ya2Jvb2sgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOm9mZmljZTpzcHJlYWRzaGVldFwiXFxyJyArXHJcbiAgICAgICAgJyB4bWxuczpvPVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTpvZmZpY2U6b2ZmaWNlXCJcXHInICtcclxuICAgICAgICAnIHhtbG5zOng9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOm9mZmljZTpleGNlbFwiXFxyJyArXHJcbiAgICAgICAgJyB4bWxuczpzcz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOnNwcmVhZHNoZWV0XCJcXHInICtcclxuICAgICAgICAnIHhtbG5zOmh0bWw9XCJodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtaHRtbDQwXCI+XFxyJyArXHJcbiAgICAgICAgJzxEb2N1bWVudFByb3BlcnRpZXMgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOm9mZmljZTpvZmZpY2VcIj5cXHInICtcclxuICAgICAgICAnICA8Q3JlYXRlZD4nICsgQ3JlYXRpb25EYXRlICsgJzwvQ3JlYXRlZD5cXHInICtcclxuICAgICAgICAnPC9Eb2N1bWVudFByb3BlcnRpZXM+XFxyJyArXHJcbiAgICAgICAgJzxPZmZpY2VEb2N1bWVudFNldHRpbmdzIHhtbG5zPVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTpvZmZpY2U6b2ZmaWNlXCI+XFxyJyArXHJcbiAgICAgICAgJyAgPEFsbG93UE5HLz5cXHInICtcclxuICAgICAgICAnPC9PZmZpY2VEb2N1bWVudFNldHRpbmdzPlxccicgK1xyXG4gICAgICAgICc8RXhjZWxXb3JrYm9vayB4bWxucz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOmV4Y2VsXCI+XFxyJyArXHJcbiAgICAgICAgJyAgPFdpbmRvd0hlaWdodD45MDAwPC9XaW5kb3dIZWlnaHQ+XFxyJyArXHJcbiAgICAgICAgJyAgPFdpbmRvd1dpZHRoPjEzODYwPC9XaW5kb3dXaWR0aD5cXHInICtcclxuICAgICAgICAnICA8V2luZG93VG9wWD4wPC9XaW5kb3dUb3BYPlxccicgK1xyXG4gICAgICAgICcgIDxXaW5kb3dUb3BZPjA8L1dpbmRvd1RvcFk+XFxyJyArXHJcbiAgICAgICAgJyAgPFByb3RlY3RTdHJ1Y3R1cmU+RmFsc2U8L1Byb3RlY3RTdHJ1Y3R1cmU+XFxyJyArXHJcbiAgICAgICAgJyAgPFByb3RlY3RXaW5kb3dzPkZhbHNlPC9Qcm90ZWN0V2luZG93cz5cXHInICtcclxuICAgICAgICAnPC9FeGNlbFdvcmtib29rPlxccicgK1xyXG4gICAgICAgICc8U3R5bGVzPlxccicgK1xyXG4gICAgICAgICcgIDxTdHlsZSBzczpJRD1cIkRlZmF1bHRcIiBzczpOYW1lPVwiTm9ybWFsXCI+XFxyJyArXHJcbiAgICAgICAgJyAgICA8QWxpZ25tZW50IHNzOlZlcnRpY2FsPVwiQm90dG9tXCIvPlxccicgK1xyXG4gICAgICAgICcgICAgPEJvcmRlcnMvPlxccicgK1xyXG4gICAgICAgICcgICAgPEZvbnQvPlxccicgK1xyXG4gICAgICAgICcgICAgPEludGVyaW9yLz5cXHInICtcclxuICAgICAgICAnICAgIDxOdW1iZXJGb3JtYXQvPlxccicgK1xyXG4gICAgICAgICcgICAgPFByb3RlY3Rpb24vPlxccicgK1xyXG4gICAgICAgICcgIDwvU3R5bGU+XFxyJyArXHJcbiAgICAgICAgJyAgPFN0eWxlIHNzOklEPVwicnNwMVwiPlxccicgK1xyXG4gICAgICAgICcgICAgPEFsaWdubWVudCBzczpWZXJ0aWNhbD1cIkNlbnRlclwiLz5cXHInICtcclxuICAgICAgICAnICA8L1N0eWxlPlxccicgK1xyXG4gICAgICAgICcgIDxTdHlsZSBzczpJRD1cInBjdDFcIj5cXHInICtcclxuICAgICAgICAnICAgIDxOdW1iZXJGb3JtYXQgc3M6Rm9ybWF0PVwiUGVyY2VudFwiLz5cXHInICtcclxuICAgICAgICAnICA8L1N0eWxlPlxccicgK1xyXG4gICAgICAgICc8L1N0eWxlcz5cXHInO1xyXG5cclxuICAgICAgZm9yICggdmFyIGogPSAwOyBqIDwgZG9jRGF0YXMubGVuZ3RoOyBqKysgKSB7XHJcbiAgICAgICAgeG1sc3NEb2NGaWxlICs9ICc8V29ya3NoZWV0IHNzOk5hbWU9XCInICsgZG9jTmFtZXNbal0gKyAnXCIgc3M6UmlnaHRUb0xlZnQ9XCInICsgKGRlZmF1bHRzLm1zby5ydGwgPyAnMScgOiAnMCcpICsgJ1wiPlxccicgK1xyXG4gICAgICAgICAgZG9jRGF0YXNbal07XHJcbiAgICAgICAgaWYgKGRlZmF1bHRzLm1zby5ydGwpIHtcclxuICAgICAgICAgIHhtbHNzRG9jRmlsZSArPSAnPFdvcmtzaGVldE9wdGlvbnMgeG1sbnM9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOm9mZmljZTpleGNlbFwiPlxccicgK1xyXG4gICAgICAgICAgICAnPERpc3BsYXlSaWdodFRvTGVmdC8+XFxyJyArXHJcbiAgICAgICAgICAgICc8L1dvcmtzaGVldE9wdGlvbnM+XFxyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgeG1sc3NEb2NGaWxlICs9ICc8V29ya3NoZWV0T3B0aW9ucyB4bWxucz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOmV4Y2VsXCIvPlxccic7XHJcbiAgICAgICAgeG1sc3NEb2NGaWxlICs9ICc8L1dvcmtzaGVldD5cXHInO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB4bWxzc0RvY0ZpbGUgKz0gJzwvV29ya2Jvb2s+XFxyJztcclxuXHJcbiAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ3N0cmluZycgKVxyXG4gICAgICAgIHJldHVybiB4bWxzc0RvY0ZpbGU7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdiYXNlNjQnIClcclxuICAgICAgICByZXR1cm4gYmFzZTY0ZW5jb2RlKHhtbHNzRG9jRmlsZSk7XHJcblxyXG4gICAgICBzYXZlVG9GaWxlICggeG1sc3NEb2NGaWxlLCBkZWZhdWx0cy5maWxlTmFtZSArICcueG1sJywgXCJhcHBsaWNhdGlvbi94bWxcIiwgXCJ1dGYtOFwiLCBcImJhc2U2NFwiLCBmYWxzZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICdleGNlbCcgJiYgZGVmYXVsdHMubXNvLmZpbGVGb3JtYXQgPT09ICd4bHN4JyApIHtcclxuXHJcbiAgICAgIHZhciBkb2NOYW1lcyA9IFtdO1xyXG4gICAgICB2YXIgd29ya2Jvb2sgPSBYTFNYLnV0aWxzLmJvb2tfbmV3KCk7XHJcblxyXG4gICAgICAvLyBNdWx0aXBsZSB3b3Jrc2hlZXRzIGFuZCAueGxzeCBmaWxlIGV4dGVuc2lvbiAjMjAyXHJcblxyXG4gICAgICAkKGVsKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBpc1Zpc2libGUoJCh0aGlzKSk7XHJcbiAgICAgIH0pLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkdGFibGUgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciB3cyA9IFhMU1gudXRpbHMudGFibGVfdG9fc2hlZXQodGhpcyk7XHJcblxyXG4gICAgICAgIHZhciBzaGVldE5hbWUgPSAnJztcclxuICAgICAgICBpZiAoIHR5cGVvZiBkZWZhdWx0cy5tc28ud29ya3NoZWV0TmFtZSA9PT0gJ3N0cmluZycgJiYgZGVmYXVsdHMubXNvLndvcmtzaGVldE5hbWUubGVuZ3RoIClcclxuICAgICAgICAgIHNoZWV0TmFtZSA9IGRlZmF1bHRzLm1zby53b3Jrc2hlZXROYW1lICsgJyAnICsgKGRvY05hbWVzLmxlbmd0aCArIDEpO1xyXG4gICAgICAgIGVsc2UgaWYgKCB0eXBlb2YgZGVmYXVsdHMubXNvLndvcmtzaGVldE5hbWVbZG9jTmFtZXMubGVuZ3RoXSAhPT0gJ3VuZGVmaW5lZCcgKVxyXG4gICAgICAgICAgc2hlZXROYW1lID0gZGVmYXVsdHMubXNvLndvcmtzaGVldE5hbWVbZG9jTmFtZXMubGVuZ3RoXTtcclxuICAgICAgICBpZiAoICEgc2hlZXROYW1lLmxlbmd0aCApXHJcbiAgICAgICAgICBzaGVldE5hbWUgPSAkdGFibGUuZmluZCgnY2FwdGlvbicpLnRleHQoKSB8fCAnJztcclxuICAgICAgICBpZiAoICEgc2hlZXROYW1lLmxlbmd0aCApXHJcbiAgICAgICAgICBzaGVldE5hbWUgPSAnVGFibGUgJyArIChkb2NOYW1lcy5sZW5ndGggKyAxKTtcclxuICAgICAgICBzaGVldE5hbWUgPSAkLnRyaW0oc2hlZXROYW1lLnJlcGxhY2UoL1tcXFxcXFwvW1xcXSo6PydcIl0vZywnJykuc3Vic3RyaW5nKDAsMzEpKTtcclxuXHJcbiAgICAgICAgZG9jTmFtZXMucHVzaChzaGVldE5hbWUpO1xyXG4gICAgICAgIFhMU1gudXRpbHMuYm9va19hcHBlbmRfc2hlZXQod29ya2Jvb2ssIHdzLCBzaGVldE5hbWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIGFkZCB3b3Jrc2hlZXQgdG8gd29ya2Jvb2tcclxuICAgICAgdmFyIHdib3V0ID0gWExTWC53cml0ZSh3b3JrYm9vaywge3R5cGU6ICdiaW5hcnknLCBib29rVHlwZTogZGVmYXVsdHMubXNvLmZpbGVGb3JtYXQsIGJvb2tTU1Q6IGZhbHNlfSk7XHJcblxyXG4gICAgICBzYXZlVG9GaWxlICgganhfczJhYih3Ym91dCksIFxyXG4gICAgICAgICAgICAgICAgICAgZGVmYXVsdHMuZmlsZU5hbWUgKyAnLicgKyBkZWZhdWx0cy5tc28uZmlsZUZvcm1hdCwgXHJcbiAgICAgICAgICAgICAgICAgICBcImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0XCIsIFxyXG4gICAgICAgICAgICAgICAgICAgXCJVVEYtOFwiLCBcIlwiLCBmYWxzZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICdleGNlbCcgfHwgZGVmYXVsdHMudHlwZSA9PT0gJ3hscycgfHwgZGVmYXVsdHMudHlwZSA9PT0gJ3dvcmQnIHx8IGRlZmF1bHRzLnR5cGUgPT09ICdkb2MnICkge1xyXG5cclxuICAgICAgdmFyIE1TRG9jVHlwZSAgID0gKGRlZmF1bHRzLnR5cGUgPT09ICdleGNlbCcgfHwgZGVmYXVsdHMudHlwZSA9PT0gJ3hscycpID8gJ2V4Y2VsJyA6ICd3b3JkJztcclxuICAgICAgdmFyIE1TRG9jRXh0ICAgID0gKE1TRG9jVHlwZSA9PT0gJ2V4Y2VsJykgPyAneGxzJyA6ICdkb2MnO1xyXG4gICAgICB2YXIgTVNEb2NTY2hlbWEgPSAneG1sbnM6eD1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOicgKyBNU0RvY1R5cGUgKyAnXCInO1xyXG4gICAgICB2YXIgZG9jRGF0YSAgICAgPSAnJztcclxuICAgICAgdmFyIGRvY05hbWUgICAgID0gJyc7XHJcblxyXG4gICAgICAkKGVsKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBpc1Zpc2libGUoJCh0aGlzKSk7XHJcbiAgICAgIH0pLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkdGFibGUgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICBpZiAoZG9jTmFtZSA9PT0gJycpIHtcclxuICAgICAgICAgIGRvY05hbWUgPSBkZWZhdWx0cy5tc28ud29ya3NoZWV0TmFtZSB8fCAkdGFibGUuZmluZCgnY2FwdGlvbicpLnRleHQoKSB8fCAnVGFibGUnO1xyXG4gICAgICAgICAgZG9jTmFtZSA9ICQudHJpbShkb2NOYW1lLnJlcGxhY2UoL1tcXFxcXFwvW1xcXSo6PydcIl0vZywgJycpLnN1YnN0cmluZygwLCAzMSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBkZWZhdWx0cy5leHBvcnRIaWRkZW5DZWxscyA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAkaGlkZGVuVGFibGVFbGVtZW50cyA9ICR0YWJsZS5maW5kKFwidHIsIHRoLCB0ZFwiKS5maWx0ZXIoXCI6aGlkZGVuXCIpO1xyXG4gICAgICAgICAgY2hlY2tDZWxsVmlzaWJpbHR5ID0gJGhpZGRlblRhYmxlRWxlbWVudHMubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvd0luZGV4ID0gMDtcclxuICAgICAgICByYW5nZXMgICA9IFtdO1xyXG4gICAgICAgIGNvbE5hbWVzID0gR2V0Q29sdW1uTmFtZXModGhpcyk7XHJcblxyXG4gICAgICAgIC8vIEhlYWRlclxyXG4gICAgICAgIGRvY0RhdGEgKz0gJzx0YWJsZT48dGhlYWQ+JztcclxuICAgICAgICAkaHJvd3MgPSBjb2xsZWN0SGVhZFJvd3MgKCR0YWJsZSk7XHJcbiAgICAgICAgJCgkaHJvd3MpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyb3cgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgdHJEYXRhID0gXCJcIjtcclxuICAgICAgICAgIEZvckVhY2hWaXNpYmxlQ2VsbCh0aGlzLCAndGgsdGQnLCByb3dJbmRleCwgJGhyb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2VsbCwgcm93LCBjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggY2VsbCAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoc3R5bGUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxzdHlsZXMgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGNlbGwsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93c3R5bGVzID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSgkcm93WzBdLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyRGF0YSArPSAnPHRoJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGNzc1N0eWxlIGluIGRlZmF1bHRzLm1zby5zdHlsZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoY3NzID0gY2VsbHN0eWxlc1tkZWZhdWx0cy5tc28uc3R5bGVzW2Nzc1N0eWxlXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGNzcyA9PT0gJycgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhjc3MgPSByb3dzdHlsZXNbZGVmYXVsdHMubXNvLnN0eWxlc1tjc3NTdHlsZV1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGhjc3MgIT09ICcnICYmIHRoY3NzICE9PSAnMHB4IG5vbmUgcmdiKDAsIDAsIDApJyAmJiB0aGNzcyAhPT0gJ3JnYmEoMCwgMCwgMCwgMCknICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhzdHlsZSArPSAodGhzdHlsZSA9PT0gJycpID8gJ3N0eWxlPVwiJyA6ICc7JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoc3R5bGUgKz0gZGVmYXVsdHMubXNvLnN0eWxlc1tjc3NTdHlsZV0gKyAnOicgKyB0aGNzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0aHN0eWxlICE9PSAnJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJEYXRhICs9ICcgJyArIHRoc3R5bGUgKyAnXCInO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRkY29sc3BhbiA9IGdldENvbHNwYW4gKGNlbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRkY29sc3BhbiA+IDAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyRGF0YSArPSAnIGNvbHNwYW49XCInICsgdGRjb2xzcGFuICsgJ1wiJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZHJvd3NwYW4gPSBnZXRSb3dzcGFuIChjZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0ZHJvd3NwYW4gPiAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ckRhdGEgKz0gJyByb3dzcGFuPVwiJyArIHRkcm93c3BhbiArICdcIic7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ckRhdGEgKz0gJz4nICsgcGFyc2VTdHJpbmcoY2VsbCwgcm93LCBjb2wpICsgJzwvdGg+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIGlmICggdHJEYXRhLmxlbmd0aCA+IDAgKVxyXG4gICAgICAgICAgICBkb2NEYXRhICs9ICc8dHI+JyArIHRyRGF0YSArICc8L3RyPic7XHJcbiAgICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY0RhdGEgKz0gJzwvdGhlYWQ+PHRib2R5Pic7XHJcblxyXG4gICAgICAgIC8vIERhdGFcclxuICAgICAgICAkcm93cyA9IGNvbGxlY3RSb3dzICgkdGFibGUpO1xyXG4gICAgICAgICQoJHJvd3MpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyb3cgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgdHJEYXRhICAgPSBcIlwiO1xyXG4gICAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsICd0ZCx0aCcsIHJvd0luZGV4LCAkaHJvd3MubGVuZ3RoICsgJHJvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjZWxsLCByb3csIGNvbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjZWxsICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGR2YWx1ZSA9IHBhcnNlU3RyaW5nKGNlbGwsIHJvdywgY29sKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRkc3R5bGUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRkY3NzICAgPSAkKGNlbGwpLmRhdGEoXCJ0YWJsZWV4cG9ydC1tc29udW1iZXJmb3JtYXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjZWxsc3R5bGVzID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShjZWxsLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3N0eWxlcyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoJHJvd1swXSwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB0ZGNzcyA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmF1bHRzLm1zby5vbk1zb051bWJlckZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGRjc3MgPSBkZWZhdWx0cy5tc28ub25Nc29OdW1iZXJGb3JtYXQoY2VsbCwgcm93LCBjb2wpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgdGRjc3MgIT09ICd1bmRlZmluZWQnICYmIHRkY3NzICE9PSAnJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGRzdHlsZSA9ICdzdHlsZT1cIm1zby1udW1iZXItZm9ybWF0OlxcJycgKyB0ZGNzcyArICdcXCcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICggdmFyIGNzc1N0eWxlIGluIGRlZmF1bHRzLm1zby5zdHlsZXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGRjc3MgPSBjZWxsc3R5bGVzW2RlZmF1bHRzLm1zby5zdHlsZXNbY3NzU3R5bGVdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRkY3NzID09PSAnJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZGNzcyA9IHJvd3N0eWxlc1tkZWZhdWx0cy5tc28uc3R5bGVzW2Nzc1N0eWxlXV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGRjc3MgIT09ICcnICYmIHRkY3NzICE9PSAnMHB4IG5vbmUgcmdiKDAsIDAsIDApJyAmJiB0ZGNzcyAhPT0gJ3JnYmEoMCwgMCwgMCwgMCknICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGRzdHlsZSArPSAodGRzdHlsZSA9PT0gJycpID8gJ3N0eWxlPVwiJyA6ICc7JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRkc3R5bGUgKz0gZGVmYXVsdHMubXNvLnN0eWxlc1tjc3NTdHlsZV0gKyAnOicgKyB0ZGNzcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJEYXRhICs9ICc8dGQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRkc3R5bGUgIT09ICcnIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ckRhdGEgKz0gJyAnICsgdGRzdHlsZSArICdcIic7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGRjb2xzcGFuID0gZ2V0Q29sc3BhbiAoY2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGRjb2xzcGFuID4gMCApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJEYXRhICs9ICcgY29sc3Bhbj1cIicgKyB0ZGNvbHNwYW4gKyAnXCInO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRkcm93c3BhbiA9IGdldFJvd3NwYW4gKGNlbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHRkcm93c3BhbiA+IDAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyRGF0YSArPSAnIHJvd3NwYW49XCInICsgdGRyb3dzcGFuICsgJ1wiJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHRkdmFsdWUgPT09ICdzdHJpbmcnICYmIHRkdmFsdWUgIT09ICcnICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRkdmFsdWUgPSBwcmV2ZW50SW5qZWN0aW9uKHRkdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRkdmFsdWUgPSB0ZHZhbHVlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ckRhdGEgKz0gJz4nICsgdGR2YWx1ZSArICc8L3RkPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICBpZiAoIHRyRGF0YS5sZW5ndGggPiAwIClcclxuICAgICAgICAgICAgZG9jRGF0YSArPSAnPHRyPicgKyB0ckRhdGEgKyAnPC90cj4nO1xyXG4gICAgICAgICAgcm93SW5kZXgrKztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCBkZWZhdWx0cy5kaXNwbGF5VGFibGVOYW1lIClcclxuICAgICAgICAgIGRvY0RhdGEgKz0gJzx0cj48dGQ+PC90ZD48L3RyPjx0cj48dGQ+PC90ZD48L3RyPjx0cj48dGQ+JyArIHBhcnNlU3RyaW5nKCQoJzxwPicgKyBkZWZhdWx0cy50YWJsZU5hbWUgKyAnPC9wPicpKSArICc8L3RkPjwvdHI+JztcclxuXHJcbiAgICAgICAgZG9jRGF0YSArPSAnPC90Ym9keT48L3RhYmxlPic7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9ub2luc3BlY3Rpb24gWG1sVW51c2VkTmFtZXNwYWNlRGVjbGFyYXRpb25cclxuICAgICAgdmFyIGRvY0ZpbGUgPSAnPGh0bWwgeG1sbnM6bz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOm9mZmljZVwiICcgKyBNU0RvY1NjaGVtYSArICcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtaHRtbDQwXCI+JztcclxuICAgICAgZG9jRmlsZSArPSAnPG1ldGEgaHR0cC1lcXVpdj1cImNvbnRlbnQtdHlwZVwiIGNvbnRlbnQ9XCJhcHBsaWNhdGlvbi92bmQubXMtJyArIE1TRG9jVHlwZSArICc7IGNoYXJzZXQ9VVRGLThcIj4nO1xyXG4gICAgICBkb2NGaWxlICs9IFwiPGhlYWQ+XCI7XHJcbiAgICAgIGlmIChNU0RvY1R5cGUgPT09ICdleGNlbCcpIHtcclxuICAgICAgICBkb2NGaWxlICs9IFwiPCEtLVtpZiBndGUgbXNvIDldPlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gXCI8eG1sPlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gXCI8eDpFeGNlbFdvcmtib29rPlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gXCI8eDpFeGNlbFdvcmtzaGVldHM+XCI7XHJcbiAgICAgICAgZG9jRmlsZSArPSBcIjx4OkV4Y2VsV29ya3NoZWV0PlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gXCI8eDpOYW1lPlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gZG9jTmFtZTtcclxuICAgICAgICBkb2NGaWxlICs9IFwiPC94Ok5hbWU+XCI7XHJcbiAgICAgICAgZG9jRmlsZSArPSBcIjx4OldvcmtzaGVldE9wdGlvbnM+XCI7XHJcbiAgICAgICAgZG9jRmlsZSArPSBcIjx4OkRpc3BsYXlHcmlkbGluZXMvPlwiO1xyXG4gICAgICAgIGlmIChkZWZhdWx0cy5tc28ucnRsKVxyXG4gICAgICAgICAgZG9jRmlsZSArPSBcIjx4OkRpc3BsYXlSaWdodFRvTGVmdC8+XCI7XHJcbiAgICAgICAgZG9jRmlsZSArPSBcIjwveDpXb3Jrc2hlZXRPcHRpb25zPlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gXCI8L3g6RXhjZWxXb3Jrc2hlZXQ+XCI7XHJcbiAgICAgICAgZG9jRmlsZSArPSBcIjwveDpFeGNlbFdvcmtzaGVldHM+XCI7XHJcbiAgICAgICAgZG9jRmlsZSArPSBcIjwveDpFeGNlbFdvcmtib29rPlwiO1xyXG4gICAgICAgIGRvY0ZpbGUgKz0gXCI8L3htbD5cIjtcclxuICAgICAgICBkb2NGaWxlICs9IFwiPCFbZW5kaWZdLS0+XCI7XHJcbiAgICAgIH1cclxuICAgICAgZG9jRmlsZSArPSBcIjxzdHlsZT5cIjtcclxuXHJcbiAgICAgIGRvY0ZpbGUgKz0gXCJAcGFnZSB7IHNpemU6XCIgKyBkZWZhdWx0cy5tc28ucGFnZU9yaWVudGF0aW9uICsgXCI7IG1zby1wYWdlLW9yaWVudGF0aW9uOlwiICsgZGVmYXVsdHMubXNvLnBhZ2VPcmllbnRhdGlvbiArIFwiOyB9XCI7XHJcbiAgICAgIGRvY0ZpbGUgKz0gXCJAcGFnZSBTZWN0aW9uMSB7c2l6ZTpcIiArIHBhZ2VGb3JtYXRzW2RlZmF1bHRzLm1zby5wYWdlRm9ybWF0XVswXSArIFwicHQgXCIgKyBwYWdlRm9ybWF0c1tkZWZhdWx0cy5tc28ucGFnZUZvcm1hdF1bMV0gKyBcInB0XCI7XHJcbiAgICAgIGRvY0ZpbGUgKz0gXCI7IG1hcmdpbjoxLjBpbiAxLjI1aW4gMS4waW4gMS4yNWluO21zby1oZWFkZXItbWFyZ2luOi41aW47bXNvLWZvb3Rlci1tYXJnaW46LjVpbjttc28tcGFwZXItc291cmNlOjA7fVwiO1xyXG4gICAgICBkb2NGaWxlICs9IFwiZGl2LlNlY3Rpb24xIHtwYWdlOlNlY3Rpb24xO31cIjtcclxuICAgICAgZG9jRmlsZSArPSBcIkBwYWdlIFNlY3Rpb24yIHtzaXplOlwiICsgcGFnZUZvcm1hdHNbZGVmYXVsdHMubXNvLnBhZ2VGb3JtYXRdWzFdICsgXCJwdCBcIiArIHBhZ2VGb3JtYXRzW2RlZmF1bHRzLm1zby5wYWdlRm9ybWF0XVswXSArIFwicHRcIjtcclxuICAgICAgZG9jRmlsZSArPSBcIjttc28tcGFnZS1vcmllbnRhdGlvbjpcIiArIGRlZmF1bHRzLm1zby5wYWdlT3JpZW50YXRpb24gKyBcIjttYXJnaW46MS4yNWluIDEuMGluIDEuMjVpbiAxLjBpbjttc28taGVhZGVyLW1hcmdpbjouNWluO21zby1mb290ZXItbWFyZ2luOi41aW47bXNvLXBhcGVyLXNvdXJjZTowO31cIjtcclxuICAgICAgZG9jRmlsZSArPSBcImRpdi5TZWN0aW9uMiB7cGFnZTpTZWN0aW9uMjt9XCI7XHJcblxyXG4gICAgICBkb2NGaWxlICs9IFwiYnIge21zby1kYXRhLXBsYWNlbWVudDpzYW1lLWNlbGw7fVwiO1xyXG4gICAgICBkb2NGaWxlICs9IFwiPC9zdHlsZT5cIjtcclxuICAgICAgZG9jRmlsZSArPSBcIjwvaGVhZD5cIjtcclxuICAgICAgZG9jRmlsZSArPSBcIjxib2R5PlwiO1xyXG4gICAgICBkb2NGaWxlICs9IFwiPGRpdiBjbGFzcz1cXFwiU2VjdGlvblwiICsgKChkZWZhdWx0cy5tc28ucGFnZU9yaWVudGF0aW9uID09PSAnbGFuZHNjYXBlJykgPyBcIjJcIiA6IFwiMVwiKSArIFwiXFxcIj5cIjtcclxuICAgICAgZG9jRmlsZSArPSBkb2NEYXRhO1xyXG4gICAgICBkb2NGaWxlICs9IFwiPC9kaXY+XCI7XHJcbiAgICAgIGRvY0ZpbGUgKz0gXCI8L2JvZHk+XCI7XHJcbiAgICAgIGRvY0ZpbGUgKz0gXCI8L2h0bWw+XCI7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdzdHJpbmcnIClcclxuICAgICAgICByZXR1cm4gZG9jRmlsZTtcclxuXHJcbiAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ2Jhc2U2NCcgKVxyXG4gICAgICAgIHJldHVybiBiYXNlNjRlbmNvZGUoZG9jRmlsZSk7XHJcblxyXG4gICAgICBzYXZlVG9GaWxlICggZG9jRmlsZSwgZGVmYXVsdHMuZmlsZU5hbWUgKyAnLicgKyBNU0RvY0V4dCwgXCJhcHBsaWNhdGlvbi92bmQubXMtXCIgKyBNU0RvY1R5cGUsIFwiXCIsIFwiYmFzZTY0XCIsIGZhbHNlICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICggZGVmYXVsdHMudHlwZSA9PT0gJ3BuZycgKSB7XHJcbiAgICAgIGh0bWwyY2FudmFzKCQoZWwpWzBdKS50aGVuKFxyXG4gICAgICAgIGZ1bmN0aW9uIChjYW52YXMpIHtcclxuXHJcbiAgICAgICAgICB2YXIgaW1hZ2UgICAgICA9IGNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgICAgICAgIHZhciBieXRlU3RyaW5nID0gYXRvYihpbWFnZS5zdWJzdHJpbmcoMjIpKTsgLy8gcmVtb3ZlIGRhdGEgc3R1ZmZcclxuICAgICAgICAgIHZhciBidWZmZXIgICAgID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICAgIHZhciBpbnRBcnJheSAgID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcclxuXHJcbiAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBieXRlU3RyaW5nLmxlbmd0aDsgaSsrIClcclxuICAgICAgICAgICAgaW50QXJyYXlbaV0gPSBieXRlU3RyaW5nLmNoYXJDb2RlQXQoaSk7XHJcblxyXG4gICAgICAgICAgaWYgKCBkZWZhdWx0cy5vdXRwdXRNb2RlID09PSAnc3RyaW5nJyApXHJcbiAgICAgICAgICAgIHJldHVybiBieXRlU3RyaW5nO1xyXG5cclxuICAgICAgICAgIGlmICggZGVmYXVsdHMub3V0cHV0TW9kZSA9PT0gJ2Jhc2U2NCcgKVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZTY0ZW5jb2RlKGltYWdlKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICd3aW5kb3cnICkge1xyXG4gICAgICAgICAgICB3aW5kb3cub3BlbihpbWFnZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBzYXZlVG9GaWxlICggYnVmZmVyLCBkZWZhdWx0cy5maWxlTmFtZSArICcucG5nJywgXCJpbWFnZS9wbmdcIiwgXCJcIiwgXCJcIiwgZmFsc2UgKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9IGVsc2UgaWYgKCBkZWZhdWx0cy50eXBlID09PSAncGRmJyApIHtcclxuXHJcbiAgICAgIGlmICggZGVmYXVsdHMucGRmbWFrZS5lbmFibGVkID09PSB0cnVlICkge1xyXG4gICAgICAgIC8vIHBkZiBvdXRwdXQgdXNpbmcgcGRmbWFrZVxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9icGFtcHVjaC9wZGZtYWtlXHJcblxyXG4gICAgICAgIHZhciB3aWR0aHMgPSBbXTtcclxuICAgICAgICB2YXIgYm9keSAgID0gW107XHJcbiAgICAgICAgcm93SW5kZXggICA9IDA7XHJcbiAgICAgICAgcmFuZ2VzICAgICA9IFtdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIENvbGxlY3RQZGZtYWtlRGF0YSA9IGZ1bmN0aW9uICgkcm93cywgY29sc2VsZWN0b3IsIGxlbmd0aCkge1xyXG4gICAgICAgICAgdmFyIHJsZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICQoJHJvd3MpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgciA9IFtdO1xyXG5cclxuICAgICAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsIGNvbHNlbGVjdG9yLCByb3dJbmRleCwgbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNlbGwsIHJvdywgY29sKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIGNlbGwgIT09ICd1bmRlZmluZWQnICYmIGNlbGwgIT09IG51bGwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2xzcGFuID0gZ2V0Q29sc3BhbiAoY2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvd3NwYW4gPSBnZXRSb3dzcGFuIChjZWxsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxWYWx1ZSA9IHBhcnNlU3RyaW5nKGNlbGwsIHJvdywgY29sKSB8fCBcIiBcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjb2xzcGFuID4gMSB8fCByb3dzcGFuID4gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW4gPSBjb2xzcGFuIHx8IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dzcGFuID0gcm93c3BhbiB8fCAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgci5wdXNoKHtjb2xTcGFuOiBjb2xzcGFuLCByb3dTcGFuOiByb3dzcGFuLCB0ZXh0OiBjZWxsVmFsdWV9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgci5wdXNoKGNlbGxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIucHVzaChcIiBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICggci5sZW5ndGggKVxyXG4gICAgICAgICAgICAgIGJvZHkucHVzaChyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggcmxlbmd0aCA8IHIubGVuZ3RoIClcclxuICAgICAgICAgICAgICBybGVuZ3RoID0gci5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHJsZW5ndGg7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJGhyb3dzID0gY29sbGVjdEhlYWRSb3dzICgkKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbGNvdW50ID0gQ29sbGVjdFBkZm1ha2VEYXRhKCRocm93cywgJ3RoLHRkJywgJGhyb3dzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAoIHZhciBpID0gd2lkdGhzLmxlbmd0aDsgaSA8IGNvbGNvdW50OyBpKysgKVxyXG4gICAgICAgICAgd2lkdGhzLnB1c2goXCIqXCIpO1xyXG5cclxuICAgICAgICAvLyBEYXRhXHJcbiAgICAgICAgJHJvd3MgPSBjb2xsZWN0Um93cyAoJCh0aGlzKSk7XHJcblxyXG4gICAgICAgIENvbGxlY3RQZGZtYWtlRGF0YSgkcm93cywgJ3RoLHRkJywgJGhyb3dzLmxlbmd0aCArICRyb3dzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgIHZhciBkb2NEZWZpbml0aW9uID0ge1xyXG4gICAgICAgICAgY29udGVudDogW3tcclxuICAgICAgICAgICAgdGFibGU6IHtcclxuICAgICAgICAgICAgICBoZWFkZXJSb3dzOiAkaHJvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgIHdpZHRoczogICAgIHdpZHRocyxcclxuICAgICAgICAgICAgICBib2R5OiAgICAgICBib2R5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJC5leHRlbmQodHJ1ZSwgZG9jRGVmaW5pdGlvbiwgZGVmYXVsdHMucGRmbWFrZS5kb2NEZWZpbml0aW9uKTtcclxuXHJcbiAgICAgICAgcGRmTWFrZS5mb250cyA9IHtcclxuICAgICAgICAgIFJvYm90bzoge1xyXG4gICAgICAgICAgICBub3JtYWw6ICAgICAgJ1JvYm90by1SZWd1bGFyLnR0ZicsXHJcbiAgICAgICAgICAgIGJvbGQ6ICAgICAgICAnUm9ib3RvLU1lZGl1bS50dGYnLFxyXG4gICAgICAgICAgICBpdGFsaWNzOiAgICAgJ1JvYm90by1JdGFsaWMudHRmJyxcclxuICAgICAgICAgICAgYm9sZGl0YWxpY3M6ICdSb2JvdG8tTWVkaXVtSXRhbGljLnR0ZidcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkLmV4dGVuZCh0cnVlLCBwZGZNYWtlLmZvbnRzLCBkZWZhdWx0cy5wZGZtYWtlLmZvbnRzKTtcclxuXHJcbiAgICAgICAgcGRmTWFrZS5jcmVhdGVQZGYoZG9jRGVmaW5pdGlvbikuZ2V0QnVmZmVyKGZ1bmN0aW9uIChidWZmZXIpIHtcclxuICAgICAgICAgIHNhdmVUb0ZpbGUgKCBidWZmZXIsIGRlZmF1bHRzLmZpbGVOYW1lICsgJy5wZGYnLCBcImFwcGxpY2F0aW9uL3BkZlwiLCBcIlwiLCBcIlwiLCBmYWxzZSApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICggZGVmYXVsdHMuanNwZGYuYXV0b3RhYmxlID09PSBmYWxzZSApIHtcclxuICAgICAgICAvLyBwZGYgb3V0cHV0IHVzaW5nIGpzUERGJ3MgY29yZSBodG1sIHN1cHBvcnRcclxuXHJcbiAgICAgICAgdmFyIGFkZEh0bWxPcHRpb25zID0ge1xyXG4gICAgICAgICAgZGltOiAgICAgICB7XHJcbiAgICAgICAgICAgIHc6IGdldFByb3BlcnR5VW5pdFZhbHVlKCQoZWwpLmZpcnN0KCkuZ2V0KDApLCAnd2lkdGgnLCAnbW0nKSxcclxuICAgICAgICAgICAgaDogZ2V0UHJvcGVydHlVbml0VmFsdWUoJChlbCkuZmlyc3QoKS5nZXQoMCksICdoZWlnaHQnLCAnbW0nKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHBhZ2VzcGxpdDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZG9jID0gbmV3IGpzUERGKGRlZmF1bHRzLmpzcGRmLm9yaWVudGF0aW9uLCBkZWZhdWx0cy5qc3BkZi51bml0LCBkZWZhdWx0cy5qc3BkZi5mb3JtYXQpO1xyXG4gICAgICAgIGRvYy5hZGRIVE1MKCQoZWwpLmZpcnN0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdHMuanNwZGYubWFyZ2lucy5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzLmpzcGRmLm1hcmdpbnMudG9wLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZEh0bWxPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGpzUGRmT3V0cHV0KGRvYywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIC8vZGVsZXRlIGRvYztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAvLyBwZGYgb3V0cHV0IHVzaW5nIGpzUERGIEF1dG9UYWJsZSBwbHVnaW5cclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc2ltb25iZW5ndHNzb24vanNQREYtQXV0b1RhYmxlXHJcblxyXG4gICAgICAgIHZhciB0ZU9wdGlvbnMgPSBkZWZhdWx0cy5qc3BkZi5hdXRvdGFibGUudGFibGVFeHBvcnQ7XHJcblxyXG4gICAgICAgIC8vIFdoZW4gc2V0dGluZyBqc3BkZi5mb3JtYXQgdG8gJ2Jlc3RmaXQnIHRhYmxlRXhwb3J0IHRyaWVzIHRvIGNob29zZVxyXG4gICAgICAgIC8vIHRoZSBtaW5pbXVtIHJlcXVpcmVkIHBhcGVyIGZvcm1hdCBhbmQgb3JpZW50YXRpb24gaW4gd2hpY2ggdGhlIHRhYmxlXHJcbiAgICAgICAgLy8gKG9yIHRhYmxlcyBpbiBtdWx0aXRhYmxlIG1vZGUpIGNvbXBsZXRlbHkgZml0cyB3aXRob3V0IGNvbHVtbiBhZGp1c3RtZW50XHJcbiAgICAgICAgaWYgKCB0eXBlb2YgZGVmYXVsdHMuanNwZGYuZm9ybWF0ID09PSAnc3RyaW5nJyAmJiBkZWZhdWx0cy5qc3BkZi5mb3JtYXQudG9Mb3dlckNhc2UoKSA9PT0gJ2Jlc3RmaXQnICkge1xyXG4gICAgICAgICAgdmFyIHJrID0gJycsIHJvID0gJyc7XHJcbiAgICAgICAgICB2YXIgbXcgPSAwO1xyXG5cclxuICAgICAgICAgICQoZWwpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIGlzVmlzaWJsZSgkKHRoaXMpKSApIHtcclxuICAgICAgICAgICAgICB2YXIgdyA9IGdldFByb3BlcnR5VW5pdFZhbHVlKCQodGhpcykuZ2V0KDApLCAnd2lkdGgnLCAncHQnKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKCB3ID4gbXcgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHcgPiBwYWdlRm9ybWF0cy5hMFswXSApIHtcclxuICAgICAgICAgICAgICAgICAgcmsgPSAnYTAnO1xyXG4gICAgICAgICAgICAgICAgICBybyA9ICdsJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBrZXkgaW4gcGFnZUZvcm1hdHMgKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICggcGFnZUZvcm1hdHMuaGFzT3duUHJvcGVydHkoa2V5KSApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBhZ2VGb3JtYXRzW2tleV1bMV0gPiB3ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmsgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBybyA9ICdsJztcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICggcGFnZUZvcm1hdHNba2V5XVswXSA+IHcgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBybyA9ICdwJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG13ID0gdztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZGVmYXVsdHMuanNwZGYuZm9ybWF0ICAgICAgPSAocmsgPT09ICcnID8gJ2E0JyA6IHJrKTtcclxuICAgICAgICAgIGRlZmF1bHRzLmpzcGRmLm9yaWVudGF0aW9uID0gKHJvID09PSAnJyA/ICd3JyA6IHJvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBqc1BERiBkb2Mgb2JqZWN0IGlzIHN0b3JlZCBpbiBkZWZhdWx0cy5qc3BkZi5hdXRvdGFibGUudGFibGVFeHBvcnQsXHJcbiAgICAgICAgLy8gdGh1cyBpdCBjYW4gYmUgYWNjZXNzZWQgZnJvbSBhbnkgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAgICBpZiAoIHRlT3B0aW9ucy5kb2MgPT0gbnVsbCApIHtcclxuICAgICAgICAgIHRlT3B0aW9ucy5kb2MgPSBuZXcganNQREYoZGVmYXVsdHMuanNwZGYub3JpZW50YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzLmpzcGRmLnVuaXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzLmpzcGRmLmZvcm1hdCk7XHJcbiAgICAgICAgICB0ZU9wdGlvbnMud1NjYWxlRmFjdG9yID0gMTtcclxuICAgICAgICAgIHRlT3B0aW9ucy5oU2NhbGVGYWN0b3IgPSAxO1xyXG5cclxuICAgICAgICAgIGlmICggdHlwZW9mIGRlZmF1bHRzLmpzcGRmLm9uRG9jQ3JlYXRlZCA9PT0gJ2Z1bmN0aW9uJyApXHJcbiAgICAgICAgICAgIGRlZmF1bHRzLmpzcGRmLm9uRG9jQ3JlYXRlZCh0ZU9wdGlvbnMuZG9jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggdGVPcHRpb25zLm91dHB1dEltYWdlcyA9PT0gdHJ1ZSApXHJcbiAgICAgICAgICB0ZU9wdGlvbnMuaW1hZ2VzID0ge307XHJcblxyXG4gICAgICAgIGlmICggdHlwZW9mIHRlT3B0aW9ucy5pbWFnZXMgIT09ICd1bmRlZmluZWQnICkge1xyXG4gICAgICAgICAgJChlbCkuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzVmlzaWJsZSgkKHRoaXMpKTtcclxuICAgICAgICAgIH0pLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcm93Q291bnQgPSAwO1xyXG4gICAgICAgICAgICByYW5nZXMgICAgICAgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmICggZGVmYXVsdHMuZXhwb3J0SGlkZGVuQ2VsbHMgPT09IGZhbHNlICkge1xyXG4gICAgICAgICAgICAgICRoaWRkZW5UYWJsZUVsZW1lbnRzID0gJCh0aGlzKS5maW5kKFwidHIsIHRoLCB0ZFwiKS5maWx0ZXIoXCI6aGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgIGNoZWNrQ2VsbFZpc2liaWx0eSA9ICRoaWRkZW5UYWJsZUVsZW1lbnRzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRocm93cyA9IGNvbGxlY3RIZWFkUm93cyAoJCh0aGlzKSk7XHJcbiAgICAgICAgICAgICRyb3dzID0gY29sbGVjdFJvd3MgKCQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgJCgkcm93cykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsICd0ZCx0aCcsICRocm93cy5sZW5ndGggKyByb3dDb3VudCwgJGhyb3dzLmxlbmd0aCArICRyb3dzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNlbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0SW1hZ2VzKGNlbGwsICQoY2VsbCkuY2hpbGRyZW4oKSwgdGVPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgcm93Q291bnQrKztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAkaHJvd3MgPSBbXTtcclxuICAgICAgICAgICRyb3dzICA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9hZEltYWdlcyh0ZU9wdGlvbnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoZWwpLmZpbHRlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc1Zpc2libGUoJCh0aGlzKSk7XHJcbiAgICAgICAgICB9KS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbEtleTtcclxuICAgICAgICAgICAgcm93SW5kZXggPSAwO1xyXG4gICAgICAgICAgICByYW5nZXMgICA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBkZWZhdWx0cy5leHBvcnRIaWRkZW5DZWxscyA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgJGhpZGRlblRhYmxlRWxlbWVudHMgPSAkKHRoaXMpLmZpbmQoXCJ0ciwgdGgsIHRkXCIpLmZpbHRlcihcIjpoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgY2hlY2tDZWxsVmlzaWJpbHR5ID0gJGhpZGRlblRhYmxlRWxlbWVudHMubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29sTmFtZXMgPSBHZXRDb2x1bW5OYW1lcyh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHRlT3B0aW9ucy5jb2x1bW5zID0gW107XHJcbiAgICAgICAgICAgIHRlT3B0aW9ucy5yb3dzICAgID0gW107XHJcbiAgICAgICAgICAgIHRlT3B0aW9ucy50ZUNlbGxzID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBvblRhYmxlOiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiBmb3IgZXZlcnkgbWF0Y2hpbmcgdGFibGUgdGhhdCBjYW4gYmUgdXNlZFxyXG4gICAgICAgICAgICAvLyB0byBtb2RpZnkgdGhlIHRhYmxlRXhwb3J0IG9wdGlvbnMgb3IgdG8gc2tpcCB0aGUgb3V0cHV0IG9mIGEgcGFydGljdWxhciB0YWJsZVxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGFibGUgc2VsZWN0b3IgdGFyZ2V0cyBtdWx0aXBsZSB0YWJsZXNcclxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgdGVPcHRpb25zLm9uVGFibGUgPT09ICdmdW5jdGlvbicgKVxyXG4gICAgICAgICAgICAgIGlmICggdGVPcHRpb25zLm9uVGFibGUoJCh0aGlzKSwgZGVmYXVsdHMpID09PSBmYWxzZSApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gY29udGludWUgdG8gbmV4dCBpdGVyYXRpb24gc3RlcCAodGFibGUpXHJcblxyXG4gICAgICAgICAgICAvLyBlYWNoIHRhYmxlIHdvcmtzIHdpdGggYW4gb3duIGNvcHkgb2YgQXV0b1RhYmxlIG9wdGlvbnNcclxuICAgICAgICAgICAgZGVmYXVsdHMuanNwZGYuYXV0b3RhYmxlLnRhYmxlRXhwb3J0ID0gbnVsbDsgIC8vIGF2b2lkIGRlZXAgcmVjdXJzaW9uIGVycm9yXHJcbiAgICAgICAgICAgIHZhciBhdE9wdGlvbnMgICAgICAgICAgICAgICAgICAgICAgICA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cy5qc3BkZi5hdXRvdGFibGUpO1xyXG4gICAgICAgICAgICBkZWZhdWx0cy5qc3BkZi5hdXRvdGFibGUudGFibGVFeHBvcnQgPSB0ZU9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICBhdE9wdGlvbnMubWFyZ2luID0ge307XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIGF0T3B0aW9ucy5tYXJnaW4sIGRlZmF1bHRzLmpzcGRmLm1hcmdpbnMpO1xyXG4gICAgICAgICAgICBhdE9wdGlvbnMudGFibGVFeHBvcnQgPSB0ZU9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICAvLyBGaXgganNQREYgQXV0b3RhYmxlJ3Mgcm93IGhlaWdodCBjYWxjdWxhdGlvblxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBhdE9wdGlvbnMuYmVmb3JlUGFnZUNvbnRlbnQgIT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgYXRPcHRpb25zLmJlZm9yZVBhZ2VDb250ZW50ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmICggZGF0YS5wYWdlQ291bnQgPT09IDEgKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBhbGwgPSBkYXRhLnRhYmxlLnJvd3MuY29uY2F0KGRhdGEudGFibGUuaGVhZGVyUm93KTtcclxuICAgICAgICAgICAgICAgICAgJC5lYWNoKGFsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggcm93LmhlaWdodCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByb3cuaGVpZ2h0ICs9ICgyIC0gRk9OVF9ST1dfUkFUSU8pIC8gMiAqIHJvdy5zdHlsZXMuZm9udFNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLnRhYmxlLmhlaWdodCArPSAoMiAtIEZPTlRfUk9XX1JBVElPKSAvIDIgKiByb3cuc3R5bGVzLmZvbnRTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgYXRPcHRpb25zLmNyZWF0ZWRIZWFkZXJDZWxsICE9PSAnZnVuY3Rpb24nICkge1xyXG4gICAgICAgICAgICAgIC8vIGFwcGx5IHNvbWUgb3JpZ2luYWwgY3NzIHN0eWxlcyB0byBwZGYgaGVhZGVyIGNlbGxzXHJcbiAgICAgICAgICAgICAgYXRPcHRpb25zLmNyZWF0ZWRIZWFkZXJDZWxsID0gZnVuY3Rpb24gKGNlbGwsIGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBqc1BERiBBdXRvVGFibGUgcGx1Z2luIHYyLjAuMTQgZml4OiBlYWNoIGNlbGwgbmVlZHMgaXRzIG93biBzdHlsZXMgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBjZWxsLnN0eWxlcyA9ICQuZXh0ZW5kKHt9LCBkYXRhLnJvdy5zdHlsZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHRlT3B0aW9ucy5jb2x1bW5zIFtkYXRhLmNvbHVtbi5kYXRhS2V5XSAhPT0gJ3VuZGVmaW5lZCcgKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSB0ZU9wdGlvbnMuY29sdW1ucyBbZGF0YS5jb2x1bW4uZGF0YUtleV07XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBjb2wucmVjdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjZWxsLmNvbnRlbnRXaWR0aCA9IGNvbC5yZWN0LndpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB0ZU9wdGlvbnMuaGVpZ2h0UmF0aW8gPT09ICd1bmRlZmluZWQnIHx8IHRlT3B0aW9ucy5oZWlnaHRSYXRpbyA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICggZGF0YS5yb3cucmF3IFtkYXRhLmNvbHVtbi5kYXRhS2V5XS5yb3dzcGFuIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmggPSBkYXRhLnJvdy5yYXcgW2RhdGEuY29sdW1uLmRhdGFLZXldLnJlY3QuaGVpZ2h0IC8gZGF0YS5yb3cucmF3IFtkYXRhLmNvbHVtbi5kYXRhS2V5XS5yb3dzcGFuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByaCA9IGRhdGEucm93LnJhdyBbZGF0YS5jb2x1bW4uZGF0YUtleV0ucmVjdC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgdGVPcHRpb25zLmhlaWdodFJhdGlvID0gY2VsbC5zdHlsZXMucm93SGVpZ2h0IC8gcmg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByaCA9IGRhdGEucm93LnJhdyBbZGF0YS5jb2x1bW4uZGF0YUtleV0ucmVjdC5oZWlnaHQgKiB0ZU9wdGlvbnMuaGVpZ2h0UmF0aW87XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCByaCA+IGNlbGwuc3R5bGVzLnJvd0hlaWdodCApXHJcbiAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlcy5yb3dIZWlnaHQgPSByaDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMuaGFsaWduID0gKGF0T3B0aW9ucy5oZWFkZXJTdHlsZXMuaGFsaWduID09PSAnaW5oZXJpdCcpID8gJ2NlbnRlcicgOiBhdE9wdGlvbnMuaGVhZGVyU3R5bGVzLmhhbGlnbjtcclxuICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMudmFsaWduID0gYXRPcHRpb25zLmhlYWRlclN0eWxlcy52YWxpZ247XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBjb2wuc3R5bGUgIT09ICd1bmRlZmluZWQnICYmIGNvbC5zdHlsZS5oaWRkZW4gIT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBhdE9wdGlvbnMuaGVhZGVyU3R5bGVzLmhhbGlnbiA9PT0gJ2luaGVyaXQnIClcclxuICAgICAgICAgICAgICAgICAgICAgIGNlbGwuc3R5bGVzLmhhbGlnbiA9IGNvbC5zdHlsZS5hbGlnbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGF0T3B0aW9ucy5zdHlsZXMuZmlsbENvbG9yID09PSAnaW5oZXJpdCcgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMuZmlsbENvbG9yID0gY29sLnN0eWxlLmJjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGF0T3B0aW9ucy5zdHlsZXMudGV4dENvbG9yID09PSAnaW5oZXJpdCcgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMudGV4dENvbG9yID0gY29sLnN0eWxlLmNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggYXRPcHRpb25zLnN0eWxlcy5mb250U3R5bGUgPT09ICdpbmhlcml0JyApXHJcbiAgICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlcy5mb250U3R5bGUgPSBjb2wuc3R5bGUuZnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgYXRPcHRpb25zLmNyZWF0ZWRDZWxsICE9PSAnZnVuY3Rpb24nICkge1xyXG4gICAgICAgICAgICAgIC8vIGFwcGx5IHNvbWUgb3JpZ2luYWwgY3NzIHN0eWxlcyB0byBwZGYgdGFibGUgY2VsbHNcclxuICAgICAgICAgICAgICBhdE9wdGlvbnMuY3JlYXRlZENlbGwgPSBmdW5jdGlvbiAoY2VsbCwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlY2VsbCA9IHRlT3B0aW9ucy50ZUNlbGxzIFtkYXRhLnJvdy5pbmRleCArIFwiOlwiICsgZGF0YS5jb2x1bW4uZGF0YUtleV07XHJcblxyXG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMuaGFsaWduID0gKGF0T3B0aW9ucy5zdHlsZXMuaGFsaWduID09PSAnaW5oZXJpdCcpID8gJ2NlbnRlcicgOiBhdE9wdGlvbnMuc3R5bGVzLmhhbGlnbjtcclxuICAgICAgICAgICAgICAgIGNlbGwuc3R5bGVzLnZhbGlnbiA9IGF0T3B0aW9ucy5zdHlsZXMudmFsaWduO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHRlY2VsbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRlY2VsbC5zdHlsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdGVjZWxsLnN0eWxlLmhpZGRlbiAhPT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCBhdE9wdGlvbnMuc3R5bGVzLmhhbGlnbiA9PT0gJ2luaGVyaXQnIClcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlcy5oYWxpZ24gPSB0ZWNlbGwuc3R5bGUuYWxpZ247XHJcbiAgICAgICAgICAgICAgICAgIGlmICggYXRPcHRpb25zLnN0eWxlcy5maWxsQ29sb3IgPT09ICdpbmhlcml0JyApXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMuZmlsbENvbG9yID0gdGVjZWxsLnN0eWxlLmJjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgaWYgKCBhdE9wdGlvbnMuc3R5bGVzLnRleHRDb2xvciA9PT0gJ2luaGVyaXQnIClcclxuICAgICAgICAgICAgICAgICAgICBjZWxsLnN0eWxlcy50ZXh0Q29sb3IgPSB0ZWNlbGwuc3R5bGUuY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgIGlmICggYXRPcHRpb25zLnN0eWxlcy5mb250U3R5bGUgPT09ICdpbmhlcml0JyApXHJcbiAgICAgICAgICAgICAgICAgICAgY2VsbC5zdHlsZXMuZm9udFN0eWxlID0gdGVjZWxsLnN0eWxlLmZzdHlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBhdE9wdGlvbnMuZHJhd0hlYWRlckNlbGwgIT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgYXRPcHRpb25zLmRyYXdIZWFkZXJDZWxsID0gZnVuY3Rpb24gKGNlbGwsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb2xvcHQgPSB0ZU9wdGlvbnMuY29sdW1ucyBbZGF0YS5jb2x1bW4uZGF0YUtleV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAoY29sb3B0LnN0eWxlLmhhc093blByb3BlcnR5KFwiaGlkZGVuXCIpICE9PSB0cnVlIHx8IGNvbG9wdC5zdHlsZS5oaWRkZW4gIT09IHRydWUpICYmXHJcbiAgICAgICAgICAgICAgICAgIGNvbG9wdC5yb3dJbmRleCA+PSAwIClcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXBhcmVBdXRvVGFibGVUZXh0KGNlbGwsIGRhdGEsIGNvbG9wdCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gY2VsbCBpcyBoaWRkZW5cclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBhdE9wdGlvbnMuZHJhd0NlbGwgIT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgYXRPcHRpb25zLmRyYXdDZWxsID0gZnVuY3Rpb24gKGNlbGwsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZWNlbGwgPSB0ZU9wdGlvbnMudGVDZWxscyBbZGF0YS5yb3cuaW5kZXggKyBcIjpcIiArIGRhdGEuY29sdW1uLmRhdGFLZXldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRyYXcyY2FudmFzID0gKHR5cGVvZiB0ZWNlbGwgIT09ICd1bmRlZmluZWQnICYmIHRlY2VsbC5pc0NhbnZhcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBkcmF3MmNhbnZhcyAhPT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCBwcmVwYXJlQXV0b1RhYmxlVGV4dChjZWxsLCBkYXRhLCB0ZWNlbGwpICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0ZU9wdGlvbnMuZG9jLnJlY3QoY2VsbC54LCBjZWxsLnksIGNlbGwud2lkdGgsIGNlbGwuaGVpZ2h0LCBjZWxsLnN0eWxlcy5maWxsU3R5bGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB0ZWNlbGwgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdGVjZWxsLmVsZW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiB0ZWNlbGwuZWxlbWVudHMubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBoU2NhbGUgPSBjZWxsLmhlaWdodCAvIHRlY2VsbC5yZWN0LmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICggaFNjYWxlID4gdGVPcHRpb25zLmhTY2FsZUZhY3RvciApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlT3B0aW9ucy5oU2NhbGVGYWN0b3IgPSBoU2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZU9wdGlvbnMud1NjYWxlRmFjdG9yID0gY2VsbC53aWR0aCAvIHRlY2VsbC5yZWN0LndpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIHZhciB5U2F2ZSA9IGNlbGwudGV4dFBvcy55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgZHJhd0F1dG90YWJsZUVsZW1lbnRzKGNlbGwsIHRlY2VsbC5lbGVtZW50cywgdGVPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGNlbGwudGV4dFBvcy55ID0geVNhdmU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgZHJhd0F1dG90YWJsZVRleHQoY2VsbCwgdGVjZWxsLmVsZW1lbnRzLCB0ZU9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICBkcmF3QXV0b3RhYmxlVGV4dChjZWxsLCB7fSwgdGVPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0ZWNlbGwuZWxlbWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICAgIHZhciBpbWdJZCAgPSAkKGNvbnRhaW5lcikuYXR0cihcImRhdGEtdGFibGVleHBvcnQtY2FudmFzXCIpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgciA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNlbGwud2lkdGggPSByLndpZHRoICogdGVPcHRpb25zLndTY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgICAgICAgY2VsbC5oZWlnaHQgPSByLmhlaWdodCAqIHRlT3B0aW9ucy5oU2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEucm93LmhlaWdodCA9IGNlbGwuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAganNQZGZEcmF3SW1hZ2UgKGNlbGwsIGNvbnRhaW5lciwgaW1nSWQsIHRlT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY29sbGVjdCBoZWFkZXIgYW5kIGRhdGEgcm93c1xyXG4gICAgICAgICAgICB0ZU9wdGlvbnMuaGVhZGVycm93cyA9IFtdO1xyXG4gICAgICAgICAgICAkaHJvd3MgPSBjb2xsZWN0SGVhZFJvd3MgKCQodGhpcykpO1xyXG4gICAgICAgICAgICAkKCRocm93cykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgY29sS2V5ID0gMDtcclxuICAgICAgICAgICAgICB0ZU9wdGlvbnMuaGVhZGVycm93c1tyb3dJbmRleF0gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsICd0aCx0ZCcsIHJvd0luZGV4LCAkaHJvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2VsbCwgcm93LCBjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqICAgICAgPSBnZXRDZWxsU3R5bGVzKGNlbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai50aXRsZSAgICA9IHBhcnNlU3RyaW5nKGNlbGwsIHJvdywgY29sKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoua2V5ICAgICAgPSBjb2xLZXkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmoucm93SW5kZXggPSByb3dJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZU9wdGlvbnMuaGVhZGVycm93c1tyb3dJbmRleF0ucHVzaChvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICggcm93SW5kZXggPiAwICkge1xyXG4gICAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCBsYXN0IHJvd1xyXG4gICAgICAgICAgICAgIHZhciBsYXN0cm93ID0gcm93SW5kZXggLSAxO1xyXG4gICAgICAgICAgICAgIHdoaWxlICggbGFzdHJvdyA+PSAwICkge1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHRlT3B0aW9ucy5oZWFkZXJyb3dzW2xhc3Ryb3ddLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKCBsYXN0cm93ID4gMCAmJiB0aGlzLnJlY3QgPT09IG51bGwgKVxyXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHRlT3B0aW9ucy5oZWFkZXJyb3dzW2xhc3Ryb3cgLSAxXVt0aGlzLmtleV07XHJcblxyXG4gICAgICAgICAgICAgICAgICBpZiAoIG9iaiAhPT0gbnVsbCAmJiBvYmoucm93SW5kZXggPj0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChvYmouc3R5bGUuaGFzT3duUHJvcGVydHkoXCJoaWRkZW5cIikgIT09IHRydWUgfHwgb2JqLnN0eWxlLmhpZGRlbiAhPT0gdHJ1ZSkgKVxyXG4gICAgICAgICAgICAgICAgICAgIHRlT3B0aW9ucy5jb2x1bW5zLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxhc3Ryb3cgPSAodGVPcHRpb25zLmNvbHVtbnMubGVuZ3RoID4gMCkgPyAtMSA6IGxhc3Ryb3cgLSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJvd0NvdW50ID0gMDtcclxuICAgICAgICAgICAgJHJvd3MgICAgICAgID0gW107XHJcbiAgICAgICAgICAgICRyb3dzID0gY29sbGVjdFJvd3MgKCQodGhpcykpO1xyXG4gICAgICAgICAgICAkKCRyb3dzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB2YXIgcm93RGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgIGNvbEtleSAgICAgID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgRm9yRWFjaFZpc2libGVDZWxsKHRoaXMsICd0ZCx0aCcsIHJvd0luZGV4LCAkaHJvd3MubGVuZ3RoICsgJHJvd3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2VsbCwgcm93LCBjb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB0ZU9wdGlvbnMuY29sdW1uc1tjb2xLZXldID09PSAndW5kZWZpbmVkJyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGpzUERGLUF1dG90YWJsZSBuZWVkcyBjb2x1bW5zLiBUaHVzIGRlZmluZSBoaWRkZW4gb25lcyBmb3IgdGFibGVzIHdpdGhvdXQgdGhlYWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICAgY29sS2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVPcHRpb25zLmNvbHVtbnMucHVzaChvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBjZWxsICE9PSAndW5kZWZpbmVkJyAmJiBjZWxsICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gZ2V0Q2VsbFN0eWxlcyhjZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pc0NhbnZhcyA9IGNlbGwuaGFzQXR0cmlidXRlKFwiZGF0YS10YWJsZWV4cG9ydC1jYW52YXNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouZWxlbWVudHMgPSBvYmouaXNDYW52YXMgPyAkKGNlbGwpIDogJChjZWxsKS5jaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVPcHRpb25zLnRlQ2VsbHMgW3Jvd0NvdW50ICsgXCI6XCIgKyBjb2xLZXkrK10gPSBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqID0gJC5leHRlbmQodHJ1ZSwge30sIHRlT3B0aW9ucy50ZUNlbGxzIFtyb3dDb3VudCArIFwiOlwiICsgKGNvbEtleSAtIDEpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouY29sc3BhbiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVPcHRpb25zLnRlQ2VsbHMgW3Jvd0NvdW50ICsgXCI6XCIgKyBjb2xLZXkrK10gPSBvYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dEYXRhLnB1c2gocGFyc2VTdHJpbmcoY2VsbCwgcm93LCBjb2wpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgaWYgKCByb3dEYXRhLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgIHRlT3B0aW9ucy5yb3dzLnB1c2gocm93RGF0YSk7XHJcbiAgICAgICAgICAgICAgICByb3dDb3VudCsrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByb3dJbmRleCsrO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIG9uQmVmb3JlQXV0b3RhYmxlOiBvcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvbiBiZWZvcmUgY2FsbGluZ1xyXG4gICAgICAgICAgICAvLyBqc1BERiBBdXRvVGFibGUgdGhhdCBjYW4gYmUgdXNlZCB0byBtb2RpZnkgdGhlIEF1dG9UYWJsZSBvcHRpb25zXHJcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHRlT3B0aW9ucy5vbkJlZm9yZUF1dG90YWJsZSA9PT0gJ2Z1bmN0aW9uJyApXHJcbiAgICAgICAgICAgICAgdGVPcHRpb25zLm9uQmVmb3JlQXV0b3RhYmxlKCQodGhpcyksIHRlT3B0aW9ucy5jb2x1bW5zLCB0ZU9wdGlvbnMucm93cywgYXRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIHRlT3B0aW9ucy5kb2MuYXV0b1RhYmxlKHRlT3B0aW9ucy5jb2x1bW5zLCB0ZU9wdGlvbnMucm93cywgYXRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIG9uQWZ0ZXJBdXRvdGFibGU6IG9wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHJldHVybmluZ1xyXG4gICAgICAgICAgICAvLyBmcm9tIGpzUERGIEF1dG9UYWJsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIG1vZGlmeSB0aGUgQXV0b1RhYmxlIG9wdGlvbnNcclxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgdGVPcHRpb25zLm9uQWZ0ZXJBdXRvdGFibGUgPT09ICdmdW5jdGlvbicgKVxyXG4gICAgICAgICAgICAgIHRlT3B0aW9ucy5vbkFmdGVyQXV0b3RhYmxlKCQodGhpcyksIGF0T3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIHN0YXJ0IHBvc2l0aW9uIGZvciB0aGUgbmV4dCB0YWJsZSAoaW4gY2FzZSB0aGVyZSBpcyBvbmUpXHJcbiAgICAgICAgICAgIGRlZmF1bHRzLmpzcGRmLmF1dG90YWJsZS5zdGFydFkgPSB0ZU9wdGlvbnMuZG9jLmF1dG9UYWJsZUVuZFBvc1koKSArIGF0T3B0aW9ucy5tYXJnaW4udG9wO1xyXG5cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGpzUGRmT3V0cHV0KHRlT3B0aW9ucy5kb2MsICh0eXBlb2YgdGVPcHRpb25zLmltYWdlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgalF1ZXJ5LmlzRW1wdHlPYmplY3QodGVPcHRpb25zLmltYWdlcykgPT09IGZhbHNlKSk7XHJcblxyXG4gICAgICAgICAgaWYgKCB0eXBlb2YgdGVPcHRpb25zLmhlYWRlcnJvd3MgIT09ICd1bmRlZmluZWQnIClcclxuICAgICAgICAgICAgdGVPcHRpb25zLmhlYWRlcnJvd3MubGVuZ3RoID0gMDtcclxuICAgICAgICAgIGlmICggdHlwZW9mIHRlT3B0aW9ucy5jb2x1bW5zICE9PSAndW5kZWZpbmVkJyApXHJcbiAgICAgICAgICAgIHRlT3B0aW9ucy5jb2x1bW5zLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICBpZiAoIHR5cGVvZiB0ZU9wdGlvbnMucm93cyAhPT0gJ3VuZGVmaW5lZCcgKVxyXG4gICAgICAgICAgICB0ZU9wdGlvbnMucm93cy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgZGVsZXRlIHRlT3B0aW9ucy5kb2M7XHJcbiAgICAgICAgICB0ZU9wdGlvbnMuZG9jID0gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbGxlY3RIZWFkUm93cyAoJHRhYmxlKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgZmluZFRhYmxlRWxlbWVudHMoJHRhYmxlLCd0aGVhZCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgZmluZFRhYmxlRWxlbWVudHMoJCh0aGlzKSwgZGVmYXVsdHMudGhlYWRTZWxlY3RvcikudG9BcnJheSgpKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29sbGVjdFJvd3MgKCR0YWJsZSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgIGZpbmRUYWJsZUVsZW1lbnRzKCR0YWJsZSwndGJvZHknKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIGZpbmRUYWJsZUVsZW1lbnRzKCQodGhpcyksIGRlZmF1bHRzLnRib2R5U2VsZWN0b3IpLnRvQXJyYXkoKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoIGRlZmF1bHRzLnRmb290U2VsZWN0b3IubGVuZ3RoICkge1xyXG4gICAgICAgIGZpbmRUYWJsZUVsZW1lbnRzKCR0YWJsZSwndGZvb3QnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgZmluZFRhYmxlRWxlbWVudHMoJCh0aGlzKSwgZGVmYXVsdHMudGZvb3RTZWxlY3RvcikudG9BcnJheSgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbmRUYWJsZUVsZW1lbnRzICgkcGFyZW50LCBzZWxlY3Rvcikge1xyXG4gICAgICB2YXIgcGFyZW50U2VsZWN0b3IgPSAkcGFyZW50WzBdLnRhZ05hbWU7XHJcbiAgICAgIHZhciBwYXJlbnRMZXZlbCA9ICRwYXJlbnQucGFyZW50cyhwYXJlbnRTZWxlY3RvcikubGVuZ3RoO1xyXG4gICAgICByZXR1cm4gJHBhcmVudC5maW5kKHNlbGVjdG9yKS5maWx0ZXIgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gcGFyZW50TGV2ZWwgPT09ICQodGhpcykuY2xvc2VzdChwYXJlbnRTZWxlY3RvcikucGFyZW50cyhwYXJlbnRTZWxlY3RvcikubGVuZ3RoO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBHZXRDb2x1bW5OYW1lcyAodGFibGUpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAkKHRhYmxlKS5maW5kKCd0aGVhZCcpLmZpcnN0KCkuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcclxuICAgICAgICBpZiAoICQoZWwpLmF0dHIoXCJkYXRhLWZpZWxkXCIpICE9PSB1bmRlZmluZWQgKVxyXG4gICAgICAgICAgcmVzdWx0W2luZGV4XSA9ICQoZWwpLmF0dHIoXCJkYXRhLWZpZWxkXCIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJlc3VsdFtpbmRleF0gPSBpbmRleC50b1N0cmluZygpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1Zpc2libGUgKCRlbGVtZW50KSB7XHJcbiAgICAgIHZhciBpc0NlbGwgPSB0eXBlb2YgJGVsZW1lbnRbMF0uY2VsbEluZGV4ICE9PSAndW5kZWZpbmVkJztcclxuICAgICAgdmFyIGlzUm93ID0gdHlwZW9mICRlbGVtZW50WzBdLnJvd0luZGV4ICE9PSAndW5kZWZpbmVkJztcclxuICAgICAgdmFyIGlzRWxlbWVudFZpc2libGUgPSAoaXNDZWxsIHx8IGlzUm93KSA/IGlzVGFibGVFbGVtZW50VmlzaWJsZSgkZWxlbWVudCkgOiAkZWxlbWVudC5pcygnOnZpc2libGUnKTtcclxuICAgICAgdmFyIHRhYmxlZXhwb3J0RGlzcGxheSA9ICRlbGVtZW50LmRhdGEoXCJ0YWJsZWV4cG9ydC1kaXNwbGF5XCIpO1xyXG5cclxuICAgICAgaWYgKGlzQ2VsbCAmJiB0YWJsZWV4cG9ydERpc3BsYXkgIT09ICdub25lJyAmJiB0YWJsZWV4cG9ydERpc3BsYXkgIT09ICdhbHdheXMnKSB7XHJcbiAgICAgICAgJGVsZW1lbnQgPSAkKCRlbGVtZW50WzBdLnBhcmVudE5vZGUpO1xyXG4gICAgICAgIGlzUm93ID0gdHlwZW9mICRlbGVtZW50WzBdLnJvd0luZGV4ICE9PSAndW5kZWZpbmVkJztcclxuICAgICAgICB0YWJsZWV4cG9ydERpc3BsYXkgPSAkZWxlbWVudC5kYXRhKFwidGFibGVleHBvcnQtZGlzcGxheVwiKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNSb3cgJiYgdGFibGVleHBvcnREaXNwbGF5ICE9PSAnbm9uZScgJiYgdGFibGVleHBvcnREaXNwbGF5ICE9PSAnYWx3YXlzJykge1xyXG4gICAgICAgIHRhYmxlZXhwb3J0RGlzcGxheSA9ICRlbGVtZW50LmNsb3Nlc3QoJ3RhYmxlJykuZGF0YShcInRhYmxlZXhwb3J0LWRpc3BsYXlcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0YWJsZWV4cG9ydERpc3BsYXkgIT09ICdub25lJyAmJiAoaXNFbGVtZW50VmlzaWJsZSA9PT0gdHJ1ZSB8fCB0YWJsZWV4cG9ydERpc3BsYXkgPT09ICdhbHdheXMnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1RhYmxlRWxlbWVudFZpc2libGUgKCRlbGVtZW50KSB7XHJcbiAgICAgIHZhciBoaWRkZW5FbHMgPSBbXTtcclxuXHJcbiAgICAgIGlmICggY2hlY2tDZWxsVmlzaWJpbHR5ICkge1xyXG4gICAgICAgIGhpZGRlbkVscyA9ICRoaWRkZW5UYWJsZUVsZW1lbnRzLmZpbHRlciAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMubm9kZVR5cGUgPT09ICRlbGVtZW50WzBdLm5vZGVUeXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yb3dJbmRleCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5yb3dJbmRleCA9PT0gJGVsZW1lbnRbMF0ucm93SW5kZXgpXHJcbiAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5jZWxsSW5kZXggIT09ICd1bmRlZmluZWQnICYmIHRoaXMuY2VsbEluZGV4ID09PSAkZWxlbWVudFswXS5jZWxsSW5kZXggJiZcclxuICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5wYXJlbnROb2RlLnJvd0luZGV4ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgICAgICAgIHR5cGVvZiAkZWxlbWVudFswXS5wYXJlbnROb2RlLnJvd0luZGV4ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4gICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5yb3dJbmRleCA9PT0gJGVsZW1lbnRbMF0ucGFyZW50Tm9kZS5yb3dJbmRleClcclxuICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIChjaGVja0NlbGxWaXNpYmlsdHkgPT09IGZhbHNlIHx8IGhpZGRlbkVscy5sZW5ndGggPT09IDApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzQ29sdW1uSWdub3JlZCAoJGNlbGwsIHJvd0xlbmd0aCwgY29sSW5kZXgpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKGlzVmlzaWJsZSgkY2VsbCkpIHtcclxuICAgICAgICBpZiAoIGRlZmF1bHRzLmlnbm9yZUNvbHVtbi5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgaWYgKCAkLmluQXJyYXkoY29sSW5kZXgsIGRlZmF1bHRzLmlnbm9yZUNvbHVtbikgIT09IC0xIHx8XHJcbiAgICAgICAgICAgICQuaW5BcnJheShjb2xJbmRleCAtIHJvd0xlbmd0aCwgZGVmYXVsdHMuaWdub3JlQ29sdW1uKSAhPT0gLTEgfHxcclxuICAgICAgICAgICAgKGNvbE5hbWVzLmxlbmd0aCA+IGNvbEluZGV4ICYmIHR5cGVvZiBjb2xOYW1lc1tjb2xJbmRleF0gIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgICAgICAgJC5pbkFycmF5KGNvbE5hbWVzW2NvbEluZGV4XSwgZGVmYXVsdHMuaWdub3JlQ29sdW1uKSAhPT0gLTEpIClcclxuICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEZvckVhY2hWaXNpYmxlQ2VsbCAodGFibGVSb3csIHNlbGVjdG9yLCByb3dJbmRleCwgcm93Q291bnQsIGNlbGxjYWxsYmFjaykge1xyXG4gICAgICBpZiAoIHR5cGVvZiAoY2VsbGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICB2YXIgaWdub3JlUm93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdHMub25JZ25vcmVSb3cgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICBpZ25vcmVSb3cgPSBkZWZhdWx0cy5vbklnbm9yZVJvdygkKHRhYmxlUm93KSwgcm93SW5kZXgpO1xyXG5cclxuICAgICAgICBpZiAoaWdub3JlUm93ID09PSBmYWxzZSAmJlxyXG4gICAgICAgICAgJC5pbkFycmF5KHJvd0luZGV4LCBkZWZhdWx0cy5pZ25vcmVSb3cpID09PSAtMSAmJlxyXG4gICAgICAgICAgJC5pbkFycmF5KHJvd0luZGV4IC0gcm93Q291bnQsIGRlZmF1bHRzLmlnbm9yZVJvdykgPT09IC0xICYmXHJcbiAgICAgICAgICBpc1Zpc2libGUoJCh0YWJsZVJvdykpKSB7XHJcblxyXG4gICAgICAgICAgdmFyICRjZWxscyA9IGZpbmRUYWJsZUVsZW1lbnRzKCQodGFibGVSb3cpLCBzZWxlY3Rvcik7XHJcbiAgICAgICAgICB2YXIgY2VsbENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAkY2VsbHMuZWFjaChmdW5jdGlvbiAoY29sSW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyICRjZWxsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIGM7XHJcbiAgICAgICAgICAgIHZhciBjb2xzcGFuID0gZ2V0Q29sc3BhbiAodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciByb3dzcGFuID0gZ2V0Um93c3BhbiAodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIHJhbmdlc1xyXG4gICAgICAgICAgICAkLmVhY2gocmFuZ2VzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJhbmdlID0gdGhpcztcclxuICAgICAgICAgICAgICBpZiAoIHJvd0luZGV4ID49IHJhbmdlLnMuciAmJiByb3dJbmRleCA8PSByYW5nZS5lLnIgJiYgY2VsbENvdW50ID49IHJhbmdlLnMuYyAmJiBjZWxsQ291bnQgPD0gcmFuZ2UuZS5jICkge1xyXG4gICAgICAgICAgICAgICAgZm9yICggYyA9IDA7IGMgPD0gcmFuZ2UuZS5jIC0gcmFuZ2Uucy5jOyArK2MgKVxyXG4gICAgICAgICAgICAgICAgICBjZWxsY2FsbGJhY2sobnVsbCwgcm93SW5kZXgsIGNlbGxDb3VudCsrKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBpc0NvbHVtbklnbm9yZWQoJGNlbGwsICRjZWxscy5sZW5ndGgsIGNvbEluZGV4KSA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgLy8gSGFuZGxlIFJvdyBTcGFuXHJcbiAgICAgICAgICAgICAgaWYgKCByb3dzcGFuIHx8IGNvbHNwYW4gKSB7XHJcbiAgICAgICAgICAgICAgICByb3dzcGFuID0gcm93c3BhbiB8fCAxO1xyXG4gICAgICAgICAgICAgICAgY29sc3BhbiA9IGNvbHNwYW4gfHwgMTtcclxuICAgICAgICAgICAgICAgIHJhbmdlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgczoge3I6IHJvd0luZGV4LCBjOiBjZWxsQ291bnR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlOiB7cjogcm93SW5kZXggKyByb3dzcGFuIC0gMSwgYzogY2VsbENvdW50ICsgY29sc3BhbiAtIDF9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIEhhbmRsZSBWYWx1ZVxyXG4gICAgICAgICAgICAgIGNlbGxjYWxsYmFjayh0aGlzLCByb3dJbmRleCwgY2VsbENvdW50KyspO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgQ29sc3BhblxyXG4gICAgICAgICAgICBpZiAoIGNvbHNwYW4gKVxyXG4gICAgICAgICAgICAgIGZvciAoIGMgPSAwOyBjIDwgY29sc3BhbiAtIDE7ICsrYyApXHJcbiAgICAgICAgICAgICAgICBjZWxsY2FsbGJhY2sobnVsbCwgcm93SW5kZXgsIGNlbGxDb3VudCsrKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIFNraXAgcmFuZ2VzXHJcbiAgICAgICAgICAkLmVhY2gocmFuZ2VzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5nZSA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICggcm93SW5kZXggPj0gcmFuZ2Uucy5yICYmIHJvd0luZGV4IDw9IHJhbmdlLmUuciAmJiBjZWxsQ291bnQgPj0gcmFuZ2Uucy5jICYmIGNlbGxDb3VudCA8PSByYW5nZS5lLmMgKSB7XHJcbiAgICAgICAgICAgICAgZm9yICggYyA9IDA7IGMgPD0gcmFuZ2UuZS5jIC0gcmFuZ2Uucy5jOyArK2MgKVxyXG4gICAgICAgICAgICAgICAgY2VsbGNhbGxiYWNrKG51bGwsIHJvd0luZGV4LCBjZWxsQ291bnQrKyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGpzUGRmRHJhd0ltYWdlIChjZWxsLCBjb250YWluZXIsIGltZ0lkLCB0ZU9wdGlvbnMpIHtcclxuICAgICAgaWYgKCB0eXBlb2YgdGVPcHRpb25zLmltYWdlcyAhPT0gJ3VuZGVmaW5lZCcgKSB7XHJcbiAgICAgICAgdmFyIGltYWdlID0gdGVPcHRpb25zLmltYWdlc1tpbWdJZF07XHJcblxyXG4gICAgICAgIGlmICggdHlwZW9mIGltYWdlICE9PSAndW5kZWZpbmVkJyApIHtcclxuICAgICAgICAgIHZhciByICAgICAgICAgID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgdmFyIGFyQ2VsbCAgICAgPSBjZWxsLndpZHRoIC8gY2VsbC5oZWlnaHQ7XHJcbiAgICAgICAgICB2YXIgYXJJbWcgICAgICA9IHIud2lkdGggLyByLmhlaWdodDtcclxuICAgICAgICAgIHZhciBpbWdXaWR0aCAgID0gY2VsbC53aWR0aDtcclxuICAgICAgICAgIHZhciBpbWdIZWlnaHQgID0gY2VsbC5oZWlnaHQ7XHJcbiAgICAgICAgICB2YXIgcHgycHQgICAgICA9IDAuMjY0NTgzICogNzIgLyAyNS40O1xyXG4gICAgICAgICAgdmFyIHV5ICAgICAgICAgPSAwO1xyXG5cclxuICAgICAgICAgIGlmICggYXJJbWcgPD0gYXJDZWxsICkge1xyXG4gICAgICAgICAgICBpbWdIZWlnaHQgPSBNYXRoLm1pbihjZWxsLmhlaWdodCwgci5oZWlnaHQpO1xyXG4gICAgICAgICAgICBpbWdXaWR0aCAgPSByLndpZHRoICogaW1nSGVpZ2h0IC8gci5oZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmICggYXJJbWcgPiBhckNlbGwgKSB7XHJcbiAgICAgICAgICAgIGltZ1dpZHRoICA9IE1hdGgubWluKGNlbGwud2lkdGgsIHIud2lkdGgpO1xyXG4gICAgICAgICAgICBpbWdIZWlnaHQgPSByLmhlaWdodCAqIGltZ1dpZHRoIC8gci53aWR0aDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWdXaWR0aCAqPSBweDJwdDtcclxuICAgICAgICAgIGltZ0hlaWdodCAqPSBweDJwdDtcclxuXHJcbiAgICAgICAgICBpZiAoIGltZ0hlaWdodCA8IGNlbGwuaGVpZ2h0IClcclxuICAgICAgICAgICAgdXkgPSAoY2VsbC5oZWlnaHQgLSBpbWdIZWlnaHQpIC8gMjtcclxuXHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0ZU9wdGlvbnMuZG9jLmFkZEltYWdlKGltYWdlLnNyYywgY2VsbC50ZXh0UG9zLngsIGNlbGwueSArIHV5LCBpbWdXaWR0aCwgaW1nSGVpZ2h0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IElFIC0+IGNvbnZlcnQgcG5nIHRvIGpwZWdcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNlbGwudGV4dFBvcy54ICs9IGltZ1dpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGpzUGRmT3V0cHV0IChkb2MsIGhhc2ltYWdlcykge1xyXG4gICAgICBpZiAoIGRlZmF1bHRzLm91dHB1dE1vZGUgPT09ICdzdHJpbmcnIClcclxuICAgICAgICByZXR1cm4gZG9jLm91dHB1dCgpO1xyXG5cclxuICAgICAgaWYgKCBkZWZhdWx0cy5vdXRwdXRNb2RlID09PSAnYmFzZTY0JyApXHJcbiAgICAgICAgcmV0dXJuIGJhc2U2NGVuY29kZShkb2Mub3V0cHV0KCkpO1xyXG5cclxuICAgICAgaWYgKCBkZWZhdWx0cy5vdXRwdXRNb2RlID09PSAnd2luZG93JyApIHtcclxuICAgICAgICB3aW5kb3cuVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMO1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGRvYy5vdXRwdXQoXCJibG9iXCIpKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHZhciBibG9iID0gZG9jLm91dHB1dCgnYmxvYicpO1xyXG4gICAgICAgIHNhdmVBcyhibG9iLCBkZWZhdWx0cy5maWxlTmFtZSArICcucGRmJyk7XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBkb3dubG9hZEZpbGUoZGVmYXVsdHMuZmlsZU5hbWUgKyAnLnBkZicsXHJcbiAgICAgICAgICAnZGF0YTphcHBsaWNhdGlvbi9wZGYnICsgKGhhc2ltYWdlcyA/ICcnIDogJztiYXNlNjQnKSArICcsJyxcclxuICAgICAgICAgIGhhc2ltYWdlcyA/IGRvYy5vdXRwdXQoJ2Jsb2InKSA6IGRvYy5vdXRwdXQoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwcmVwYXJlQXV0b1RhYmxlVGV4dCAoY2VsbCwgZGF0YSwgY2VsbG9wdCkge1xyXG4gICAgICB2YXIgY3MgPSAwO1xyXG4gICAgICBpZiAoIHR5cGVvZiBjZWxsb3B0ICE9PSAndW5kZWZpbmVkJyApXHJcbiAgICAgICAgY3MgPSBjZWxsb3B0LmNvbHNwYW47XHJcblxyXG4gICAgICBpZiAoIGNzID49IDAgKSB7XHJcbiAgICAgICAgLy8gY29sc3BhbiBoYW5kbGluZ1xyXG4gICAgICAgIHZhciBjZWxsV2lkdGggPSBjZWxsLndpZHRoO1xyXG4gICAgICAgIHZhciB0ZXh0UG9zWCAgPSBjZWxsLnRleHRQb3MueDtcclxuICAgICAgICB2YXIgaSAgICAgICAgID0gZGF0YS50YWJsZS5jb2x1bW5zLmluZGV4T2YoZGF0YS5jb2x1bW4pO1xyXG5cclxuICAgICAgICBmb3IgKCB2YXIgYyA9IDE7IGMgPCBjczsgYysrICkge1xyXG4gICAgICAgICAgdmFyIGNvbHVtbiA9IGRhdGEudGFibGUuY29sdW1uc1tpICsgY107XHJcbiAgICAgICAgICBjZWxsV2lkdGggKz0gY29sdW1uLndpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBjcyA+IDEgKSB7XHJcbiAgICAgICAgICBpZiAoIGNlbGwuc3R5bGVzLmhhbGlnbiA9PT0gJ3JpZ2h0JyApXHJcbiAgICAgICAgICAgIHRleHRQb3NYID0gY2VsbC50ZXh0UG9zLnggKyBjZWxsV2lkdGggLSBjZWxsLndpZHRoO1xyXG4gICAgICAgICAgZWxzZSBpZiAoIGNlbGwuc3R5bGVzLmhhbGlnbiA9PT0gJ2NlbnRlcicgKVxyXG4gICAgICAgICAgICB0ZXh0UG9zWCA9IGNlbGwudGV4dFBvcy54ICsgKGNlbGxXaWR0aCAtIGNlbGwud2lkdGgpIC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNlbGwud2lkdGggICAgID0gY2VsbFdpZHRoO1xyXG4gICAgICAgIGNlbGwudGV4dFBvcy54ID0gdGV4dFBvc1g7XHJcblxyXG4gICAgICAgIGlmICggdHlwZW9mIGNlbGxvcHQgIT09ICd1bmRlZmluZWQnICYmIGNlbGxvcHQucm93c3BhbiA+IDEgKVxyXG4gICAgICAgICAgY2VsbC5oZWlnaHQgPSBjZWxsLmhlaWdodCAqIGNlbGxvcHQucm93c3BhbjtcclxuXHJcbiAgICAgICAgLy8gZml4IGpzUERGJ3MgY2FsY3VsYXRpb24gb2YgdGV4dCBwb3NpdGlvblxyXG4gICAgICAgIGlmICggY2VsbC5zdHlsZXMudmFsaWduID09PSAnbWlkZGxlJyB8fCBjZWxsLnN0eWxlcy52YWxpZ24gPT09ICdib3R0b20nICkge1xyXG4gICAgICAgICAgdmFyIHNwbGl0dGVkVGV4dCA9IHR5cGVvZiBjZWxsLnRleHQgPT09ICdzdHJpbmcnID8gY2VsbC50ZXh0LnNwbGl0KC9cXHJcXG58XFxyfFxcbi9nKSA6IGNlbGwudGV4dDtcclxuICAgICAgICAgIHZhciBsaW5lQ291bnQgICAgPSBzcGxpdHRlZFRleHQubGVuZ3RoIHx8IDE7XHJcbiAgICAgICAgICBpZiAoIGxpbmVDb3VudCA+IDIgKVxyXG4gICAgICAgICAgICBjZWxsLnRleHRQb3MueSAtPSAoKDIgLSBGT05UX1JPV19SQVRJTykgLyAyICogZGF0YS5yb3cuc3R5bGVzLmZvbnRTaXplKSAqIChsaW5lQ291bnQgLSAyKSAvIDM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGNlbGwgaXMgaGlkZGVuIChjb2xzcGFuID0gLTEpLCBkb24ndCBkcmF3IGl0XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29sbGVjdEltYWdlcyAoY2VsbCwgZWxlbWVudHMsIHRlT3B0aW9ucykge1xyXG4gICAgICBpZiAoIHR5cGVvZiBjZWxsICE9PSAndW5kZWZpbmVkJyAmJiBjZWxsICE9PSBudWxsICkge1xyXG5cclxuICAgICAgICBpZiAoIGNlbGwuaGFzQXR0cmlidXRlKFwiZGF0YS10YWJsZWV4cG9ydC1jYW52YXNcIikgKSB7XHJcbiAgICAgICAgICB2YXIgaW1nSWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICQoY2VsbCkuYXR0cihcImRhdGEtdGFibGVleHBvcnQtY2FudmFzXCIsIGltZ0lkKTtcclxuXHJcbiAgICAgICAgICB0ZU9wdGlvbnMuaW1hZ2VzW2ltZ0lkXSA9IHtcclxuICAgICAgICAgICAgdXJsOiAnW2RhdGEtdGFibGVleHBvcnQtY2FudmFzPVwiJytpbWdJZCsnXCJdJyxcclxuICAgICAgICAgICAgc3JjOiBudWxsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgZWxlbWVudHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKFwiaW1nXCIpKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGltZ0lkID0gc3RySGFzaENvZGUodGhpcy5zcmMpO1xyXG4gICAgICAgICAgICAgIHRlT3B0aW9ucy5pbWFnZXNbaW1nSWRdID0ge1xyXG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLnNyYyxcclxuICAgICAgICAgICAgICAgIHNyYzogdGhpcy5zcmNcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbGxlY3RJbWFnZXMoY2VsbCwgJCh0aGlzKS5jaGlsZHJlbigpLCB0ZU9wdGlvbnMpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZEltYWdlcyAodGVPcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgICB2YXIgaW1hZ2VDb3VudCA9IDA7XHJcbiAgICAgIHZhciBwZW5kaW5nQ291bnQgPSAwO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZG9uZSAoKSB7XHJcbiAgICAgICAgY2FsbGJhY2soaW1hZ2VDb3VudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvYWRJbWFnZSAoaW1hZ2UpIHtcclxuICAgICAgICBpZiAoaW1hZ2UudXJsKSB7XHJcbiAgICAgICAgICBpZiAoIWltYWdlLnNyYykge1xyXG4gICAgICAgICAgICB2YXIgJGltZ0NvbnRhaW5lciA9ICQoaW1hZ2UudXJsKTtcclxuICAgICAgICAgICAgaWYgKCRpbWdDb250YWluZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgaW1hZ2VDb3VudCA9ICsrcGVuZGluZ0NvdW50O1xyXG5cclxuICAgICAgICAgICAgICBodG1sMmNhbnZhcygkaW1nQ29udGFpbmVyWzBdKS50aGVuKGZ1bmN0aW9uKGNhbnZhcykge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL3BuZ1wiKTtcclxuICAgICAgICAgICAgICAgIGlmICggIS0tcGVuZGluZ0NvdW50IClcclxuICAgICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICBpbWFnZUNvdW50ID0gKytwZW5kaW5nQ291bnQ7XHJcbiAgICAgICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICdBbm9ueW1vdXMnO1xyXG4gICAgICAgICAgICBpbWcub25lcnJvciA9IGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCBpbWcuY29tcGxldGUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBpbWcuc3JjLmluZGV4T2YoJ2RhdGE6aW1hZ2UvJykgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgIGltZy53aWR0aCA9IGltYWdlLndpZHRoIHx8IGltZy53aWR0aCB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICBpbWcuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0IHx8IGltZy5oZWlnaHQgfHwgMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGltZy53aWR0aCArIGltZy5oZWlnaHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGltZy53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICggIS0tcGVuZGluZ0NvdW50IClcclxuICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaW1nLnNyYyA9IGltYWdlLnVybDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggdHlwZW9mIHRlT3B0aW9ucy5pbWFnZXMgIT09ICd1bmRlZmluZWQnICkge1xyXG4gICAgICAgIGZvciAoIHZhciBpIGluIHRlT3B0aW9ucy5pbWFnZXMgKVxyXG4gICAgICAgICAgaWYgKCB0ZU9wdGlvbnMuaW1hZ2VzLmhhc093blByb3BlcnR5KGkpIClcclxuICAgICAgICAgICAgbG9hZEltYWdlKHRlT3B0aW9ucy5pbWFnZXNbaV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGVuZGluZ0NvdW50IHx8IGRvbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3QXV0b3RhYmxlRWxlbWVudHMgKGNlbGwsIGVsZW1lbnRzLCB0ZU9wdGlvbnMpIHtcclxuICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCAkKHRoaXMpLmlzKFwiZGl2XCIpICkge1xyXG4gICAgICAgICAgdmFyIGJjb2xvciA9IHJnYjJhcnJheShnZXRTdHlsZSh0aGlzLCAnYmFja2dyb3VuZC1jb2xvcicpLCBbMjU1LCAyNTUsIDI1NV0pO1xyXG4gICAgICAgICAgdmFyIGxjb2xvciA9IHJnYjJhcnJheShnZXRTdHlsZSh0aGlzLCAnYm9yZGVyLXRvcC1jb2xvcicpLCBbMCwgMCwgMF0pO1xyXG4gICAgICAgICAgdmFyIGx3aWR0aCA9IGdldFByb3BlcnR5VW5pdFZhbHVlKHRoaXMsICdib3JkZXItdG9wLXdpZHRoJywgZGVmYXVsdHMuanNwZGYudW5pdCk7XHJcblxyXG4gICAgICAgICAgdmFyIHIgID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgIHZhciB1eCA9IHRoaXMub2Zmc2V0TGVmdCAqIHRlT3B0aW9ucy53U2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICB2YXIgdXkgPSB0aGlzLm9mZnNldFRvcCAqIHRlT3B0aW9ucy5oU2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICB2YXIgdXcgPSByLndpZHRoICogdGVPcHRpb25zLndTY2FsZUZhY3RvcjtcclxuICAgICAgICAgIHZhciB1aCA9IHIuaGVpZ2h0ICogdGVPcHRpb25zLmhTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICB0ZU9wdGlvbnMuZG9jLnNldERyYXdDb2xvci5hcHBseSh1bmRlZmluZWQsIGxjb2xvcik7XHJcbiAgICAgICAgICB0ZU9wdGlvbnMuZG9jLnNldEZpbGxDb2xvci5hcHBseSh1bmRlZmluZWQsIGJjb2xvcik7XHJcbiAgICAgICAgICB0ZU9wdGlvbnMuZG9jLnNldExpbmVXaWR0aChsd2lkdGgpO1xyXG4gICAgICAgICAgdGVPcHRpb25zLmRvYy5yZWN0KGNlbGwueCArIHV4LCBjZWxsLnkgKyB1eSwgdXcsIHVoLCBsd2lkdGggPyBcIkZEXCIgOiBcIkZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCAkKHRoaXMpLmlzKFwiaW1nXCIpICkge1xyXG4gICAgICAgICAgdmFyIGltZ0lkICA9IHN0ckhhc2hDb2RlKHRoaXMuc3JjKTtcclxuICAgICAgICAgIGpzUGRmRHJhd0ltYWdlIChjZWxsLCB0aGlzLCBpbWdJZCwgdGVPcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRyYXdBdXRvdGFibGVFbGVtZW50cyhjZWxsLCAkKHRoaXMpLmNoaWxkcmVuKCksIHRlT3B0aW9ucyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdBdXRvdGFibGVUZXh0IChjZWxsLCB0ZXh0dGFncywgdGVPcHRpb25zKSB7XHJcbiAgICAgIGlmICggdHlwZW9mIHRlT3B0aW9ucy5vbkF1dG90YWJsZVRleHQgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgdGVPcHRpb25zLm9uQXV0b3RhYmxlVGV4dCh0ZU9wdGlvbnMuZG9jLCBjZWxsLCB0ZXh0dGFncyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHggICAgID0gY2VsbC50ZXh0UG9zLng7XHJcbiAgICAgICAgdmFyIHkgICAgID0gY2VsbC50ZXh0UG9zLnk7XHJcbiAgICAgICAgdmFyIHN0eWxlID0ge2hhbGlnbjogY2VsbC5zdHlsZXMuaGFsaWduLCB2YWxpZ246IGNlbGwuc3R5bGVzLnZhbGlnbn07XHJcblxyXG4gICAgICAgIGlmICggdGV4dHRhZ3MubGVuZ3RoICkge1xyXG4gICAgICAgICAgdmFyIHRhZyA9IHRleHR0YWdzWzBdO1xyXG4gICAgICAgICAgd2hpbGUgKCB0YWcucHJldmlvdXNTaWJsaW5nIClcclxuICAgICAgICAgICAgdGFnID0gdGFnLnByZXZpb3VzU2libGluZztcclxuXHJcbiAgICAgICAgICB2YXIgYiA9IGZhbHNlLCBpID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgd2hpbGUgKCB0YWcgKSB7XHJcbiAgICAgICAgICAgIHZhciB0eHQgPSB0YWcuaW5uZXJUZXh0IHx8IHRhZy50ZXh0Q29udGVudCB8fCBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgbGVhZGluZ3NwYWNlID0gKHR4dC5sZW5ndGggJiYgdHh0WzBdID09PSBcIiBcIikgPyBcIiBcIiA6IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciB0cmFpbGluZ3NwYWNlID0gKHR4dC5sZW5ndGggPiAxICYmIHR4dFt0eHQubGVuZ3RoIC0gMV0gPT09IFwiIFwiKSA/IFwiIFwiIDogXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0cy5wcmVzZXJ2ZS5sZWFkaW5nV1MgIT09IHRydWUpXHJcbiAgICAgICAgICAgICAgdHh0ID0gbGVhZGluZ3NwYWNlICsgdHJpbUxlZnQodHh0KTtcclxuICAgICAgICAgICAgaWYgKGRlZmF1bHRzLnByZXNlcnZlLnRyYWlsaW5nV1MgIT09IHRydWUpXHJcbiAgICAgICAgICAgICAgdHh0ID0gdHJpbVJpZ2h0KHR4dCkgKyB0cmFpbGluZ3NwYWNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkKHRhZykuaXMoXCJiclwiKSApIHtcclxuICAgICAgICAgICAgICB4ID0gY2VsbC50ZXh0UG9zLng7XHJcbiAgICAgICAgICAgICAgeSArPSB0ZU9wdGlvbnMuZG9jLmludGVybmFsLmdldEZvbnRTaXplKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggJCh0YWcpLmlzKFwiYlwiKSApXHJcbiAgICAgICAgICAgICAgYiA9IHRydWU7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCAkKHRhZykuaXMoXCJpXCIpIClcclxuICAgICAgICAgICAgICBpID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggYiB8fCBpIClcclxuICAgICAgICAgICAgICB0ZU9wdGlvbnMuZG9jLnNldEZvbnRUeXBlKChiICYmIGkpID8gXCJib2xkaXRhbGljXCIgOiBiID8gXCJib2xkXCIgOiBcIml0YWxpY1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3ID0gdGVPcHRpb25zLmRvYy5nZXRTdHJpbmdVbml0V2lkdGgodHh0KSAqIHRlT3B0aW9ucy5kb2MuaW50ZXJuYWwuZ2V0Rm9udFNpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggdyApIHtcclxuICAgICAgICAgICAgICBpZiAoIGNlbGwuc3R5bGVzLm92ZXJmbG93ID09PSAnbGluZWJyZWFrJyAmJlxyXG4gICAgICAgICAgICAgICAgICAgeCA+IGNlbGwudGV4dFBvcy54ICYmICh4ICsgdykgPiAoY2VsbC50ZXh0UG9zLnggKyBjZWxsLndpZHRoKSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGFycyA9IFwiLiwhJSo7Oj0tXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGNoYXJzLmluZGV4T2YodHh0LmNoYXJBdCgwKSkgPj0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHMgPSB0eHQuY2hhckF0KDApO1xyXG4gICAgICAgICAgICAgICAgICB3ICAgICA9IHRlT3B0aW9ucy5kb2MuZ2V0U3RyaW5nVW5pdFdpZHRoKHMpICogdGVPcHRpb25zLmRvYy5pbnRlcm5hbC5nZXRGb250U2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoICh4ICsgdykgPD0gKGNlbGwudGV4dFBvcy54ICsgY2VsbC53aWR0aCkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVPcHRpb25zLmRvYy5hdXRvVGFibGVUZXh0KHMsIHgsIHksIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB0eHQgPSB0eHQuc3Vic3RyaW5nKDEsIHR4dC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHcgPSB0ZU9wdGlvbnMuZG9jLmdldFN0cmluZ1VuaXRXaWR0aCh0eHQpICogdGVPcHRpb25zLmRvYy5pbnRlcm5hbC5nZXRGb250U2l6ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgeCA9IGNlbGwudGV4dFBvcy54O1xyXG4gICAgICAgICAgICAgICAgeSArPSB0ZU9wdGlvbnMuZG9jLmludGVybmFsLmdldEZvbnRTaXplKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoIGNlbGwuc3R5bGVzLm92ZXJmbG93ICE9PSAndmlzaWJsZScgKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIHR4dC5sZW5ndGggJiYgKHggKyB3KSA+IChjZWxsLnRleHRQb3MueCArIGNlbGwud2lkdGgpICkge1xyXG4gICAgICAgICAgICAgICAgICB0eHQgPSB0eHQuc3Vic3RyaW5nKDAsIHR4dC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgICAgICAgdyAgID0gdGVPcHRpb25zLmRvYy5nZXRTdHJpbmdVbml0V2lkdGgodHh0KSAqIHRlT3B0aW9ucy5kb2MuaW50ZXJuYWwuZ2V0Rm9udFNpemUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHRlT3B0aW9ucy5kb2MuYXV0b1RhYmxlVGV4dCh0eHQsIHgsIHksIHN0eWxlKTtcclxuICAgICAgICAgICAgICB4ICs9IHc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggYiB8fCBpICkge1xyXG4gICAgICAgICAgICAgIGlmICggJCh0YWcpLmlzKFwiYlwiKSApXHJcbiAgICAgICAgICAgICAgICBiID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgZWxzZSBpZiAoICQodGFnKS5pcyhcImlcIikgKVxyXG4gICAgICAgICAgICAgICAgaSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICB0ZU9wdGlvbnMuZG9jLnNldEZvbnRUeXBlKCghYiAmJiAhaSkgPyBcIm5vcm1hbFwiIDogYiA/IFwiYm9sZFwiIDogXCJpdGFsaWNcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhZyA9IHRhZy5uZXh0U2libGluZztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNlbGwudGV4dFBvcy54ID0geDtcclxuICAgICAgICAgIGNlbGwudGV4dFBvcy55ID0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0ZU9wdGlvbnMuZG9jLmF1dG9UYWJsZVRleHQoY2VsbC50ZXh0LCBjZWxsLnRleHRQb3MueCwgY2VsbC50ZXh0UG9zLnksIHN0eWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlc2NhcGVSZWdFeHAgKHN0cmluZykge1xyXG4gICAgICByZXR1cm4gc3RyaW5nID09IG51bGwgPyBcIlwiIDogc3RyaW5nLnRvU3RyaW5nKCkucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCBcIlxcXFwkMVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlQWxsIChzdHJpbmcsIGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgcmV0dXJuIHN0cmluZyA9PSBudWxsID8gXCJcIiA6IHN0cmluZy50b1N0cmluZygpLnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoZmluZCksICdnJyksIHJlcGxhY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRyaW1MZWZ0IChzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuIHN0cmluZyA9PSBudWxsID8gXCJcIiA6IHN0cmluZy50b1N0cmluZygpLnJlcGxhY2UoL15cXHMrLywgXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdHJpbVJpZ2h0IChzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuIHN0cmluZyA9PSBudWxsID8gXCJcIiA6IHN0cmluZy50b1N0cmluZygpLnJlcGxhY2UoL1xccyskLywgXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VOdW1iZXIgKHZhbHVlKSB7XHJcbiAgICAgIHZhbHVlID0gdmFsdWUgfHwgXCIwXCI7XHJcbiAgICAgIHZhbHVlID0gcmVwbGFjZUFsbCh2YWx1ZSwgZGVmYXVsdHMubnVtYmVycy5odG1sLnRob3VzYW5kc1NlcGFyYXRvciwgJycpO1xyXG4gICAgICB2YWx1ZSA9IHJlcGxhY2VBbGwodmFsdWUsIGRlZmF1bHRzLm51bWJlcnMuaHRtbC5kZWNpbWFsTWFyaywgJy4nKTtcclxuXHJcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgfHwgalF1ZXJ5LmlzTnVtZXJpYyh2YWx1ZSkgIT09IGZhbHNlID8gdmFsdWUgOiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZVBlcmNlbnQgKHZhbHVlKSB7XHJcbiAgICAgIGlmICggdmFsdWUuaW5kZXhPZihcIiVcIikgPiAtMSApIHtcclxuICAgICAgICB2YWx1ZSA9IHBhcnNlTnVtYmVyKHZhbHVlLnJlcGxhY2UoLyUvZywgXCJcIikpO1xyXG4gICAgICAgIGlmICggdmFsdWUgIT09IGZhbHNlIClcclxuICAgICAgICAgIHZhbHVlID0gdmFsdWUgLyAxMDA7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHZhbHVlID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN0cmluZyAoY2VsbCwgcm93SW5kZXgsIGNvbEluZGV4KSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSAnJztcclxuXHJcbiAgICAgIGlmICggY2VsbCAhPT0gbnVsbCApIHtcclxuICAgICAgICB2YXIgJGNlbGwgPSAkKGNlbGwpO1xyXG4gICAgICAgIHZhciBodG1sRGF0YTtcclxuXHJcbiAgICAgICAgaWYgKCAkY2VsbFswXS5oYXNBdHRyaWJ1dGUoXCJkYXRhLXRhYmxlZXhwb3J0LWNhbnZhc1wiKSApIHtcclxuICAgICAgICAgIGh0bWxEYXRhID0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCAkY2VsbFswXS5oYXNBdHRyaWJ1dGUoXCJkYXRhLXRhYmxlZXhwb3J0LXZhbHVlXCIpICkge1xyXG4gICAgICAgICAgaHRtbERhdGEgPSAkY2VsbC5kYXRhKFwidGFibGVleHBvcnQtdmFsdWVcIik7XHJcbiAgICAgICAgICBodG1sRGF0YSA9IGh0bWxEYXRhID8gaHRtbERhdGEgKyAnJyA6ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGh0bWxEYXRhID0gJGNlbGwuaHRtbCgpO1xyXG5cclxuICAgICAgICAgIGlmICggdHlwZW9mIGRlZmF1bHRzLm9uQ2VsbEh0bWxEYXRhID09PSAnZnVuY3Rpb24nIClcclxuICAgICAgICAgICAgaHRtbERhdGEgPSBkZWZhdWx0cy5vbkNlbGxIdG1sRGF0YSgkY2VsbCwgcm93SW5kZXgsIGNvbEluZGV4LCBodG1sRGF0YSk7XHJcbiAgICAgICAgICBlbHNlIGlmICggaHRtbERhdGEgIT09ICcnICkge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCAgICAgID0gJC5wYXJzZUhUTUwoaHRtbERhdGEpO1xyXG4gICAgICAgICAgICB2YXIgaW5wdXRpZHggID0gMDtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGlkeCA9IDA7XHJcblxyXG4gICAgICAgICAgICBodG1sRGF0YSA9ICcnO1xyXG4gICAgICAgICAgICAkLmVhY2goaHRtbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGlmICggJCh0aGlzKS5pcyhcImlucHV0XCIpIClcclxuICAgICAgICAgICAgICAgIGh0bWxEYXRhICs9ICRjZWxsLmZpbmQoJ2lucHV0JykuZXEoaW5wdXRpZHgrKykudmFsKCk7XHJcbiAgICAgICAgICAgICAgZWxzZSBpZiAoICQodGhpcykuaXMoXCJzZWxlY3RcIikgKVxyXG4gICAgICAgICAgICAgICAgaHRtbERhdGEgKz0gJGNlbGwuZmluZCgnc2VsZWN0IG9wdGlvbjpzZWxlY3RlZCcpLmVxKHNlbGVjdGlkeCsrKS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgZWxzZSBpZiAoICQodGhpcykuaXMoXCJiclwiKSApXHJcbiAgICAgICAgICAgICAgICBodG1sRGF0YSArPSBcIjxicj5cIjtcclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mICQodGhpcykuaHRtbCgpID09PSAndW5kZWZpbmVkJyApXHJcbiAgICAgICAgICAgICAgICAgIGh0bWxEYXRhICs9ICQodGhpcykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIGpRdWVyeSgpLmJvb3RzdHJhcFRhYmxlID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgICAgICAgKCQodGhpcykuaGFzQ2xhc3MoJ2ZpbHRlckNvbnRyb2wnKSAhPT0gdHJ1ZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICQoY2VsbCkucGFyZW50cygnLmRldGFpbC12aWV3JykubGVuZ3RoID09PSAwKSApXHJcbiAgICAgICAgICAgICAgICAgIGh0bWxEYXRhICs9ICQodGhpcykuaHRtbCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGRlZmF1bHRzLmh0bWxDb250ZW50ID09PSB0cnVlICkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gJC50cmltKGh0bWxEYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIGh0bWxEYXRhICYmIGh0bWxEYXRhICE9PSAnJyApIHtcclxuICAgICAgICAgIHZhciBjZWxsRm9ybWF0ID0gJChjZWxsKS5kYXRhKFwidGFibGVleHBvcnQtY2VsbGZvcm1hdFwiKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGNlbGxGb3JtYXQgIT09ICcnICkge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCAgID0gaHRtbERhdGEucmVwbGFjZSgvXFxuL2csICdcXHUyMDI4JykucmVwbGFjZSgvKDxcXHMqYnIoW14+XSopPikvZ2ksICdcXHUyMDYwJyk7XHJcbiAgICAgICAgICAgIHZhciBvYmogICAgPSAkKCc8ZGl2Lz4nKS5odG1sKHRleHQpLmNvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIHZhciBudW1iZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGV4dCAgICAgICA9ICcnO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKG9iai50ZXh0KCkuc3BsaXQoXCJcXHUyMDI4XCIpLCBmdW5jdGlvbiAoaSwgdikge1xyXG4gICAgICAgICAgICAgIGlmICggaSA+IDAgKVxyXG4gICAgICAgICAgICAgICAgdGV4dCArPSBcIiBcIjtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRlZmF1bHRzLnByZXNlcnZlLmxlYWRpbmdXUyAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIHYgPSB0cmltTGVmdCh2KTtcclxuICAgICAgICAgICAgICB0ZXh0ICs9IChkZWZhdWx0cy5wcmVzZXJ2ZS50cmFpbGluZ1dTICE9PSB0cnVlKSA/IHRyaW1SaWdodCh2KSA6IHY7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKHRleHQuc3BsaXQoXCJcXHUyMDYwXCIpLCBmdW5jdGlvbiAoaSwgdikge1xyXG4gICAgICAgICAgICAgIGlmICggaSA+IDAgKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiXFxuXCI7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChkZWZhdWx0cy5wcmVzZXJ2ZS5sZWFkaW5nV1MgIT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICB2ID0gdHJpbUxlZnQodik7XHJcbiAgICAgICAgICAgICAgaWYgKGRlZmF1bHRzLnByZXNlcnZlLnRyYWlsaW5nV1MgIT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICB2ID0gdHJpbVJpZ2h0KHYpO1xyXG4gICAgICAgICAgICAgIHJlc3VsdCArPSB2LnJlcGxhY2UoL1xcdTAwQUQvZywgXCJcIik7IC8vIHJlbW92ZSBzb2Z0IGh5cGhlbnNcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFx1MDBBMC9nLCBcIiBcIik7IC8vIHJlcGxhY2UgbmJzcCdzIHdpdGggc3BhY2VzXHJcblxyXG4gICAgICAgICAgICBpZiAoIGRlZmF1bHRzLnR5cGUgPT09ICdqc29uJyB8fFxyXG4gICAgICAgICAgICAgIChkZWZhdWx0cy50eXBlID09PSAnZXhjZWwnICYmIGRlZmF1bHRzLm1zby5maWxlRm9ybWF0ID09PSAneG1sc3MnKSB8fFxyXG4gICAgICAgICAgICAgIGRlZmF1bHRzLm51bWJlcnMub3V0cHV0ID09PSBmYWxzZSApIHtcclxuICAgICAgICAgICAgICBudW1iZXIgPSBwYXJzZU51bWJlcihyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoIG51bWJlciAhPT0gZmFsc2UgKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTnVtYmVyKG51bWJlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoIGRlZmF1bHRzLm51bWJlcnMuaHRtbC5kZWNpbWFsTWFyayAhPT0gZGVmYXVsdHMubnVtYmVycy5vdXRwdXQuZGVjaW1hbE1hcmsgfHxcclxuICAgICAgICAgICAgICBkZWZhdWx0cy5udW1iZXJzLmh0bWwudGhvdXNhbmRzU2VwYXJhdG9yICE9PSBkZWZhdWx0cy5udW1iZXJzLm91dHB1dC50aG91c2FuZHNTZXBhcmF0b3IgKSB7XHJcbiAgICAgICAgICAgICAgbnVtYmVyID0gcGFyc2VOdW1iZXIocmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKCBudW1iZXIgIT09IGZhbHNlICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZyYWMgPSAoXCJcIiArIG51bWJlci5zdWJzdHIobnVtYmVyIDwgMCA/IDEgOiAwKSkuc3BsaXQoJy4nKTtcclxuICAgICAgICAgICAgICAgIGlmICggZnJhYy5sZW5ndGggPT09IDEgKVxyXG4gICAgICAgICAgICAgICAgICBmcmFjWzFdID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBtb2QgPSBmcmFjWzBdLmxlbmd0aCA+IDMgPyBmcmFjWzBdLmxlbmd0aCAlIDMgOiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChudW1iZXIgPCAwID8gXCItXCIgOiBcIlwiKSArXHJcbiAgICAgICAgICAgICAgICAgIChkZWZhdWx0cy5udW1iZXJzLm91dHB1dC50aG91c2FuZHNTZXBhcmF0b3IgPyAoKG1vZCA/IGZyYWNbMF0uc3Vic3RyKDAsIG1vZCkgKyBkZWZhdWx0cy5udW1iZXJzLm91dHB1dC50aG91c2FuZHNTZXBhcmF0b3IgOiBcIlwiKSArIGZyYWNbMF0uc3Vic3RyKG1vZCkucmVwbGFjZSgvKFxcZHszfSkoPz1cXGQpL2csIFwiJDFcIiArIGRlZmF1bHRzLm51bWJlcnMub3V0cHV0LnRob3VzYW5kc1NlcGFyYXRvcikpIDogZnJhY1swXSkgK1xyXG4gICAgICAgICAgICAgICAgICAoZnJhY1sxXS5sZW5ndGggPyBkZWZhdWx0cy5udW1iZXJzLm91dHB1dC5kZWNpbWFsTWFyayArIGZyYWNbMV0gOiBcIlwiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmVzdWx0ID0gaHRtbERhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIGRlZmF1bHRzLmVzY2FwZSA9PT0gdHJ1ZSApIHtcclxuICAgICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTRGVwcmVjYXRlZFN5bWJvbHNcclxuICAgICAgICAgIHJlc3VsdCA9IGVzY2FwZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0eXBlb2YgZGVmYXVsdHMub25DZWxsRGF0YSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGRlZmF1bHRzLm9uQ2VsbERhdGEoJGNlbGwsIHJvd0luZGV4LCBjb2xJbmRleCwgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcHJldmVudEluamVjdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgIGlmICggc3RyaW5nLmxlbmd0aCA+IDAgJiYgZGVmYXVsdHMucHJldmVudEluamVjdGlvbiA9PT0gdHJ1ZSApIHtcclxuICAgICAgICB2YXIgY2hhcnMgPSBcIj0rLUBcIjtcclxuICAgICAgICBpZiAoIGNoYXJzLmluZGV4T2Yoc3RyaW5nLmNoYXJBdCgwKSkgPj0gMCApXHJcbiAgICAgICAgICByZXR1cm4gKCBcIidcIiArIHN0cmluZyApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy9ub2luc3BlY3Rpb24gSlNVbnVzZWRMb2NhbFN5bWJvbHNcclxuICAgIGZ1bmN0aW9uIGh5cGhlbmF0ZSAoYSwgYiwgYykge1xyXG4gICAgICByZXR1cm4gYiArIFwiLVwiICsgYy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJnYjJhcnJheSAocmdiX3N0cmluZywgZGVmYXVsdF9yZXN1bHQpIHtcclxuICAgICAgdmFyIHJlICAgICA9IC9ecmdiXFwoKFxcZHsxLDN9KSxcXHMqKFxcZHsxLDN9KSxcXHMqKFxcZHsxLDN9KVxcKSQvO1xyXG4gICAgICB2YXIgYml0cyAgID0gcmUuZXhlYyhyZ2Jfc3RyaW5nKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IGRlZmF1bHRfcmVzdWx0O1xyXG4gICAgICBpZiAoIGJpdHMgKVxyXG4gICAgICAgIHJlc3VsdCA9IFtwYXJzZUludChiaXRzWzFdKSwgcGFyc2VJbnQoYml0c1syXSksIHBhcnNlSW50KGJpdHNbM10pXTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDZWxsU3R5bGVzIChjZWxsKSB7XHJcbiAgICAgIHZhciBhICA9IGdldFN0eWxlKGNlbGwsICd0ZXh0LWFsaWduJyk7XHJcbiAgICAgIHZhciBmdyA9IGdldFN0eWxlKGNlbGwsICdmb250LXdlaWdodCcpO1xyXG4gICAgICB2YXIgZnMgPSBnZXRTdHlsZShjZWxsLCAnZm9udC1zdHlsZScpO1xyXG4gICAgICB2YXIgZiAgPSAnJztcclxuICAgICAgaWYgKCBhID09PSAnc3RhcnQnIClcclxuICAgICAgICBhID0gZ2V0U3R5bGUoY2VsbCwgJ2RpcmVjdGlvbicpID09PSAncnRsJyA/ICdyaWdodCcgOiAnbGVmdCc7XHJcbiAgICAgIGlmICggZncgPj0gNzAwIClcclxuICAgICAgICBmID0gJ2JvbGQnO1xyXG4gICAgICBpZiAoIGZzID09PSAnaXRhbGljJyApXHJcbiAgICAgICAgZiArPSBmcztcclxuICAgICAgaWYgKCBmID09PSAnJyApXHJcbiAgICAgICAgZiA9ICdub3JtYWwnO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBzdHlsZTogICB7XHJcbiAgICAgICAgICBhbGlnbjogIGEsXHJcbiAgICAgICAgICBiY29sb3I6IHJnYjJhcnJheShnZXRTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicpLCBbMjU1LCAyNTUsIDI1NV0pLFxyXG4gICAgICAgICAgY29sb3I6ICByZ2IyYXJyYXkoZ2V0U3R5bGUoY2VsbCwgJ2NvbG9yJyksIFswLCAwLCAwXSksXHJcbiAgICAgICAgICBmc3R5bGU6IGZcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbHNwYW46IGdldENvbHNwYW4gKGNlbGwpLFxyXG4gICAgICAgIHJvd3NwYW46IGdldFJvd3NwYW4gKGNlbGwpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoIGNlbGwgIT09IG51bGwgKSB7XHJcbiAgICAgICAgdmFyIHIgICAgICAgPSBjZWxsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIHJlc3VsdC5yZWN0ID0ge1xyXG4gICAgICAgICAgd2lkdGg6ICByLndpZHRoLFxyXG4gICAgICAgICAgaGVpZ2h0OiByLmhlaWdodFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29sc3BhbiAoY2VsbCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gJChjZWxsKS5kYXRhKFwidGFibGVleHBvcnQtY29sc3BhblwiKTtcclxuICAgICAgaWYgKCB0eXBlb2YgcmVzdWx0ID09PSAndW5kZWZpbmVkJyAmJiAkKGNlbGwpLmlzKFwiW2NvbHNwYW5dXCIpIClcclxuICAgICAgICByZXN1bHQgPSAkKGNlbGwpLmF0dHIoJ2NvbHNwYW4nKTtcclxuXHJcbiAgICAgIHJldHVybiAocGFyc2VJbnQocmVzdWx0KSB8fCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSb3dzcGFuIChjZWxsKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSAkKGNlbGwpLmRhdGEoXCJ0YWJsZWV4cG9ydC1yb3dzcGFuXCIpO1xyXG4gICAgICBpZiAoIHR5cGVvZiByZXN1bHQgPT09ICd1bmRlZmluZWQnICYmICQoY2VsbCkuaXMoXCJbcm93c3Bhbl1cIikgKVxyXG4gICAgICAgIHJlc3VsdCA9ICQoY2VsbCkuYXR0cigncm93c3BhbicpO1xyXG5cclxuICAgICAgcmV0dXJuIChwYXJzZUludChyZXN1bHQpIHx8IDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldCBjb21wdXRlZCBzdHlsZSBwcm9wZXJ0eVxyXG4gICAgZnVuY3Rpb24gZ2V0U3R5bGUgKHRhcmdldCwgcHJvcCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgKSB7IC8vIGdlY2tvIGFuZCB3ZWJraXRcclxuICAgICAgICAgIHByb3AgPSBwcm9wLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pLywgaHlwaGVuYXRlKTsgIC8vIHJlcXVpcmVzIGh5cGhlbmF0ZWQsIG5vdCBjYW1lbFxyXG4gICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRhcmdldCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCB0YXJnZXQuY3VycmVudFN0eWxlICkgeyAvLyBpZVxyXG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5jdXJyZW50U3R5bGVbcHJvcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQuc3R5bGVbcHJvcF07XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVbml0VmFsdWUgKHBhcmVudCwgdmFsdWUsIHVuaXQpIHtcclxuICAgICAgdmFyIGJhc2VsaW5lID0gMTAwOyAgLy8gYW55IG51bWJlciBzZXJ2ZXNcclxuXHJcbiAgICAgIHZhciB0ZW1wICAgICAgICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ICAvLyBjcmVhdGUgdGVtcG9yYXJ5IGVsZW1lbnRcclxuICAgICAgdGVtcC5zdHlsZS5vdmVyZmxvdyAgID0gXCJoaWRkZW5cIjsgIC8vIGluIGNhc2UgYmFzZWxpbmUgaXMgc2V0IHRvbyBsb3dcclxuICAgICAgdGVtcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjsgIC8vIG5vIG5lZWQgdG8gc2hvdyBpdFxyXG5cclxuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRlbXApOyAvLyBpbnNlcnQgaXQgaW50byB0aGUgcGFyZW50IGZvciBlbSwgZXggYW5kICVcclxuXHJcbiAgICAgIHRlbXAuc3R5bGUud2lkdGggPSBiYXNlbGluZSArIHVuaXQ7XHJcbiAgICAgIHZhciBmYWN0b3IgICAgICAgPSBiYXNlbGluZSAvIHRlbXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGVtcCk7ICAvLyBjbGVhbiB1cFxyXG5cclxuICAgICAgcmV0dXJuICh2YWx1ZSAqIGZhY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UHJvcGVydHlVbml0VmFsdWUgKHRhcmdldCwgcHJvcCwgdW5pdCkge1xyXG4gICAgICB2YXIgdmFsdWUgPSBnZXRTdHlsZSh0YXJnZXQsIHByb3ApOyAgLy8gZ2V0IHRoZSBjb21wdXRlZCBzdHlsZSB2YWx1ZVxyXG5cclxuICAgICAgdmFyIG51bWVyaWMgPSB2YWx1ZS5tYXRjaCgvXFxkKy8pOyAgLy8gZ2V0IHRoZSBudW1lcmljIGNvbXBvbmVudFxyXG4gICAgICBpZiAoIG51bWVyaWMgIT09IG51bGwgKSB7XHJcbiAgICAgICAgbnVtZXJpYyA9IG51bWVyaWNbMF07ICAvLyBnZXQgdGhlIHN0cmluZ1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0VW5pdFZhbHVlKHRhcmdldC5wYXJlbnRFbGVtZW50LCBudW1lcmljLCB1bml0KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBqeF9Xb3JrYm9vayAoKSB7XHJcbiAgICAgIGlmICggISh0aGlzIGluc3RhbmNlb2YganhfV29ya2Jvb2spICkge1xyXG4gICAgICAgIC8vbm9pbnNwZWN0aW9uIEpTUG90ZW50aWFsbHlJbnZhbGlkQ29uc3RydWN0b3JVc2FnZVxyXG4gICAgICAgIHJldHVybiBuZXcganhfV29ya2Jvb2soKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLlNoZWV0TmFtZXMgPSBbXTtcclxuICAgICAgdGhpcy5TaGVldHMgICAgID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24ganhfczJhYiAocykge1xyXG4gICAgICB2YXIgYnVmICA9IG5ldyBBcnJheUJ1ZmZlcihzLmxlbmd0aCk7XHJcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKTtcclxuICAgICAgZm9yICggdmFyIGkgPSAwOyBpICE9PSBzLmxlbmd0aDsgKytpICkgdmlld1tpXSA9IHMuY2hhckNvZGVBdChpKSAmIDB4RkY7XHJcbiAgICAgIHJldHVybiBidWY7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24ganhfZGF0ZW51bSAodiwgZGF0ZTE5MDQpIHtcclxuICAgICAgaWYgKCBkYXRlMTkwNCApIHYgKz0gMTQ2MjtcclxuICAgICAgdmFyIGVwb2NoID0gRGF0ZS5wYXJzZSh2KTtcclxuICAgICAgcmV0dXJuIChlcG9jaCAtIG5ldyBEYXRlKERhdGUuVVRDKDE4OTksIDExLCAzMCkpKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBqeF9jcmVhdGVTaGVldCAoZGF0YSkge1xyXG4gICAgICB2YXIgd3MgICAgPSB7fTtcclxuICAgICAgdmFyIHJhbmdlID0ge3M6IHtjOiAxMDAwMDAwMCwgcjogMTAwMDAwMDB9LCBlOiB7YzogMCwgcjogMH19O1xyXG4gICAgICBmb3IgKCB2YXIgUiA9IDA7IFIgIT09IGRhdGEubGVuZ3RoOyArK1IgKSB7XHJcbiAgICAgICAgZm9yICggdmFyIEMgPSAwOyBDICE9PSBkYXRhW1JdLmxlbmd0aDsgKytDICkge1xyXG4gICAgICAgICAgaWYgKCByYW5nZS5zLnIgPiBSICkgcmFuZ2Uucy5yID0gUjtcclxuICAgICAgICAgIGlmICggcmFuZ2Uucy5jID4gQyApIHJhbmdlLnMuYyA9IEM7XHJcbiAgICAgICAgICBpZiAoIHJhbmdlLmUuciA8IFIgKSByYW5nZS5lLnIgPSBSO1xyXG4gICAgICAgICAgaWYgKCByYW5nZS5lLmMgPCBDICkgcmFuZ2UuZS5jID0gQztcclxuICAgICAgICAgIHZhciBjZWxsID0ge3Y6IGRhdGFbUl1bQ119O1xyXG4gICAgICAgICAgaWYgKCBjZWxsLnYgPT09IG51bGwgKSBjb250aW51ZTtcclxuICAgICAgICAgIHZhciBjZWxsX3JlZiA9IFhMU1gudXRpbHMuZW5jb2RlX2NlbGwoe2M6IEMsIHI6IFJ9KTtcclxuXHJcbiAgICAgICAgICBpZiAoIHR5cGVvZiBjZWxsLnYgPT09ICdudW1iZXInICkgY2VsbC50ID0gJ24nO1xyXG4gICAgICAgICAgZWxzZSBpZiAoIHR5cGVvZiBjZWxsLnYgPT09ICdib29sZWFuJyApIGNlbGwudCA9ICdiJztcclxuICAgICAgICAgIGVsc2UgaWYgKCBjZWxsLnYgaW5zdGFuY2VvZiBEYXRlICkge1xyXG4gICAgICAgICAgICBjZWxsLnQgPSAnbic7XHJcbiAgICAgICAgICAgIGNlbGwueiA9IFhMU1guU1NGLl90YWJsZVsxNF07XHJcbiAgICAgICAgICAgIGNlbGwudiA9IGp4X2RhdGVudW0oY2VsbC52KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgY2VsbC50ID0gJ3MnO1xyXG4gICAgICAgICAgd3NbY2VsbF9yZWZdID0gY2VsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggcmFuZ2Uucy5jIDwgMTAwMDAwMDAgKSB3c1snIXJlZiddID0gWExTWC51dGlscy5lbmNvZGVfcmFuZ2UocmFuZ2UpO1xyXG4gICAgICByZXR1cm4gd3M7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3RySGFzaENvZGUgKHN0cikge1xyXG4gICAgICB2YXIgaGFzaCA9IDAsIGksIGNociwgbGVuO1xyXG4gICAgICBpZiAoIHN0ci5sZW5ndGggPT09IDAgKSByZXR1cm4gaGFzaDtcclxuICAgICAgZm9yICggaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcclxuICAgICAgICBjaHIgID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xyXG4gICAgICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGhhc2g7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZVRvRmlsZSAoZGF0YSwgZmlsZU5hbWUsIHR5cGUsIGNoYXJzZXQsIGVuY29kaW5nLCBib20pIHtcclxuICAgICAgdmFyIHNhdmVJdCA9IHRydWU7XHJcbiAgICAgIGlmICggdHlwZW9mIGRlZmF1bHRzLm9uQmVmb3JlU2F2ZVRvRmlsZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICBzYXZlSXQgPSBkZWZhdWx0cy5vbkJlZm9yZVNhdmVUb0ZpbGUoZGF0YSwgZmlsZU5hbWUsIHR5cGUsIGNoYXJzZXQsIGVuY29kaW5nKTtcclxuICAgICAgICBpZiAoIHR5cGVvZiBzYXZlSXQgIT09ICdib29sZWFuJyApXHJcbiAgICAgICAgICBzYXZlSXQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2F2ZUl0KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGJsb2IgPSBuZXcgQmxvYihbZGF0YV0sIHt0eXBlOiB0eXBlICsgJztjaGFyc2V0PScgKyBjaGFyc2V0fSk7XHJcbiAgICAgICAgICBzYXZlQXMgKGJsb2IsIGZpbGVOYW1lLCBib20gPT09IGZhbHNlKTtcclxuXHJcbiAgICAgICAgICBpZiAoIHR5cGVvZiBkZWZhdWx0cy5vbkFmdGVyU2F2ZVRvRmlsZSA9PT0gJ2Z1bmN0aW9uJyApXHJcbiAgICAgICAgICAgIGRlZmF1bHRzLm9uQWZ0ZXJTYXZlVG9GaWxlKGRhdGEsIGZpbGVOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIGRvd25sb2FkRmlsZSAoZmlsZU5hbWUsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YTonICsgdHlwZSArIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2hhcnNldC5sZW5ndGggPyAnO2NoYXJzZXQ9JyArIGNoYXJzZXQgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZW5jb2RpbmcubGVuZ3RoID8gJzsnICsgZW5jb2RpbmcgOiAnJykgKyAnLCcgKyAoYm9tID8gJ1xcdWZlZmYnIDogJycpLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZG93bmxvYWRGaWxlIChmaWxlbmFtZSwgaGVhZGVyLCBkYXRhKSB7XHJcbiAgICAgIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xyXG4gICAgICBpZiAoIGZpbGVuYW1lICE9PSBmYWxzZSAmJiB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IgKSB7XHJcbiAgICAgICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkRnVuY3Rpb25cclxuICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IobmV3IEJsb2IoW2RhdGFdKSwgZmlsZW5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKCBmaWxlbmFtZSAhPT0gZmFsc2UgJiYgKHVhLmluZGV4T2YoXCJNU0lFIFwiKSA+IDAgfHwgISF1YS5tYXRjaCgvVHJpZGVudC4qcnZcXDoxMVxcLi8pKSApIHtcclxuICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciAoPD0gOSkgd29ya2Fyb3VuZCBieSBEYXJyeWwgKGh0dHBzOi8vZ2l0aHViLmNvbS9kYXdpb25nL3RhYmxlRXhwb3J0LmpxdWVyeS5wbHVnaW4pXHJcbiAgICAgICAgLy8gYmFzZWQgb24gc2FtcG9wZXMgYW5zd2VyIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjIzMTc5NTFcclxuICAgICAgICAvLyAhIE5vdCB3b3JraW5nIGZvciBqc29uIGFuZCBwZGYgZm9ybWF0ICFcclxuICAgICAgICB2YXIgZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xyXG5cclxuICAgICAgICBpZiAoIGZyYW1lICkge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcmFtZSk7XHJcbiAgICAgICAgICBmcmFtZS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6bm9uZVwiKTtcclxuICAgICAgICAgIGZyYW1lLmNvbnRlbnREb2N1bWVudC5vcGVuKFwidHh0L3BsYWluXCIsIFwicmVwbGFjZVwiKTtcclxuICAgICAgICAgIGZyYW1lLmNvbnRlbnREb2N1bWVudC53cml0ZShkYXRhKTtcclxuICAgICAgICAgIGZyYW1lLmNvbnRlbnREb2N1bWVudC5jbG9zZSgpO1xyXG4gICAgICAgICAgZnJhbWUuY29udGVudERvY3VtZW50LmZvY3VzKCk7XHJcblxyXG4gICAgICAgICAgdmFyIGV4dGVuc2lvbiA9IGZpbGVuYW1lLnN1YnN0cigoZmlsZW5hbWUubGFzdEluZGV4T2YoJy4nKSArMSkpO1xyXG4gICAgICAgICAgc3dpdGNoKGV4dGVuc2lvbikge1xyXG4gICAgICAgICAgICBjYXNlICdkb2MnOiBjYXNlICdqc29uJzogY2FzZSAncG5nJzogY2FzZSAncGRmJzogY2FzZSAneGxzJzogY2FzZSAneGxzeCc6XHJcbiAgICAgICAgICAgIGZpbGVuYW1lICs9IFwiLnR4dFwiO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZyYW1lLmNvbnRlbnREb2N1bWVudC5leGVjQ29tbWFuZChcIlNhdmVBc1wiLCB0cnVlLCBmaWxlbmFtZSk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGZyYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIERvd25sb2FkTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuXHJcbiAgICAgICAgaWYgKCBEb3dubG9hZExpbmsgKSB7XHJcbiAgICAgICAgICB2YXIgYmxvYlVybCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgRG93bmxvYWRMaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICBpZiAoIGZpbGVuYW1lICE9PSBmYWxzZSApXHJcbiAgICAgICAgICAgIERvd25sb2FkTGluay5kb3dubG9hZCA9IGZpbGVuYW1lO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBEb3dubG9hZExpbmsudGFyZ2V0ID0gJ19ibGFuayc7XHJcblxyXG4gICAgICAgICAgaWYgKCB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkw7XHJcbiAgICAgICAgICAgIHZhciBiaW5hcnlEYXRhID0gW107XHJcbiAgICAgICAgICAgIGJpbmFyeURhdGEucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgYmxvYlVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKGJpbmFyeURhdGEsIHt0eXBlOiBoZWFkZXJ9KSk7XHJcbiAgICAgICAgICAgIERvd25sb2FkTGluay5ocmVmID0gYmxvYlVybDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKCBoZWFkZXIudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiYmFzZTY0LFwiKSA+PSAwIClcclxuICAgICAgICAgICAgRG93bmxvYWRMaW5rLmhyZWYgPSBoZWFkZXIgKyBiYXNlNjRlbmNvZGUoZGF0YSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIERvd25sb2FkTGluay5ocmVmID0gaGVhZGVyICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGEpO1xyXG5cclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoRG93bmxvYWRMaW5rKTtcclxuXHJcbiAgICAgICAgICBpZiAoIGRvY3VtZW50LmNyZWF0ZUV2ZW50ICkge1xyXG4gICAgICAgICAgICBpZiAoIERvd25sb2FkRXZ0ID09PSBudWxsIClcclxuICAgICAgICAgICAgICBEb3dubG9hZEV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50cycpO1xyXG5cclxuICAgICAgICAgICAgRG93bmxvYWRFdnQuaW5pdEV2ZW50KCdjbGljaycsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgRG93bmxvYWRMaW5rLmRpc3BhdGNoRXZlbnQoRG93bmxvYWRFdnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoIGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0IClcclxuICAgICAgICAgICAgRG93bmxvYWRMaW5rLmZpcmVFdmVudCgnb25jbGljaycpO1xyXG4gICAgICAgICAgZWxzZSBpZiAoIHR5cGVvZiBEb3dubG9hZExpbmsub25jbGljayA9PT0gJ2Z1bmN0aW9uJyApXHJcbiAgICAgICAgICAgIERvd25sb2FkTGluay5vbmNsaWNrKCk7XHJcblxyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZiAoIGJsb2JVcmwgKVxyXG4gICAgICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGJsb2JVcmwpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKERvd25sb2FkTGluayk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBkZWZhdWx0cy5vbkFmdGVyU2F2ZVRvRmlsZSA9PT0gJ2Z1bmN0aW9uJyApXHJcbiAgICAgICAgICAgICAgZGVmYXVsdHMub25BZnRlclNhdmVUb0ZpbGUoZGF0YSwgZmlsZW5hbWUpO1xyXG4gICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1dGY4RW5jb2RlICh0ZXh0KSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHgwZFxceDBhL2csIFwiXFx4MGFcIik7XHJcbiAgICAgICAgdmFyIHV0ZnRleHQgPSBcIlwiO1xyXG4gICAgICAgIGZvciAoIHZhciBuID0gMDsgbiA8IHRleHQubGVuZ3RoOyBuKysgKSB7XHJcbiAgICAgICAgICB2YXIgYyA9IHRleHQuY2hhckNvZGVBdChuKTtcclxuICAgICAgICAgIGlmICggYyA8IDEyOCApIHtcclxuICAgICAgICAgICAgdXRmdGV4dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoIChjID4gMTI3KSAmJiAoYyA8IDIwNDgpICkge1xyXG4gICAgICAgICAgICB1dGZ0ZXh0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMgPj4gNikgfCAxOTIpO1xyXG4gICAgICAgICAgICB1dGZ0ZXh0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGMgJiA2MykgfCAxMjgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHV0ZnRleHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoYyA+PiAxMikgfCAyMjQpO1xyXG4gICAgICAgICAgICB1dGZ0ZXh0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjID4+IDYpICYgNjMpIHwgMTI4KTtcclxuICAgICAgICAgICAgdXRmdGV4dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChjICYgNjMpIHwgMTI4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHV0ZnRleHQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYmFzZTY0ZW5jb2RlIChpbnB1dCkge1xyXG4gICAgICB2YXIgY2hyMSwgY2hyMiwgY2hyMywgZW5jMSwgZW5jMiwgZW5jMywgZW5jNDtcclxuICAgICAgdmFyIGtleVN0ciA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIjtcclxuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XHJcbiAgICAgIHZhciBpICAgICAgPSAwO1xyXG4gICAgICBpbnB1dCAgICAgID0gdXRmOEVuY29kZShpbnB1dCk7XHJcbiAgICAgIHdoaWxlICggaSA8IGlucHV0Lmxlbmd0aCApIHtcclxuICAgICAgICBjaHIxID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xyXG4gICAgICAgIGNocjIgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XHJcbiAgICAgICAgY2hyMyA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcclxuICAgICAgICBlbmMxID0gY2hyMSA+PiAyO1xyXG4gICAgICAgIGVuYzIgPSAoKGNocjEgJiAzKSA8PCA0KSB8IChjaHIyID4+IDQpO1xyXG4gICAgICAgIGVuYzMgPSAoKGNocjIgJiAxNSkgPDwgMikgfCAoY2hyMyA+PiA2KTtcclxuICAgICAgICBlbmM0ID0gY2hyMyAmIDYzO1xyXG4gICAgICAgIGlmICggaXNOYU4oY2hyMikgKSB7XHJcbiAgICAgICAgICBlbmMzID0gZW5jNCA9IDY0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIGlzTmFOKGNocjMpICkge1xyXG4gICAgICAgICAgZW5jNCA9IDY0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgK1xyXG4gICAgICAgICAga2V5U3RyLmNoYXJBdChlbmMxKSArIGtleVN0ci5jaGFyQXQoZW5jMikgK1xyXG4gICAgICAgICAga2V5U3RyLmNoYXJBdChlbmMzKSArIGtleVN0ci5jaGFyQXQoZW5jNCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn0pKGpRdWVyeSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=