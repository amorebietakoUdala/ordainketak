(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~exam_new~receipt_list"],{

/***/ "./node_modules/jquery-ui/ui/version.js":
/*!**********************************************!*\
  !*** ./node_modules/jquery-ui/ui/version.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;( function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
} ( function( $ ) {

$.ui = $.ui || {};

return $.ui.version = "1.12.1";

} ) );


/***/ }),

/***/ "./node_modules/jquery-ui/ui/widget.js":
/*!*********************************************!*\
  !*** ./node_modules/jquery-ui/ui/widget.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/

( function( factory ) {
	if ( true ) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! ./version */ "./node_modules/jquery-ui/ui/version.js") ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}( function( $ ) {

var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$.cleanData = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// Http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
} )( $.cleanData );

$.widget = function( name, base, prototype ) {
	var existingConstructor, constructor, basePrototype;

	// ProxiedPrototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedPrototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	if ( $.isArray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// Create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// Allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// Allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	// Extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,

		// Copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// Track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	} );

	basePrototype = new base();

	// We need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superApply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( basePrototype, {

		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	} );

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// Redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
				child._proto );
		} );

		// Remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetSlice.call( arguments, 1 );
	var inputIndex = 0;
	var inputLength = input.length;
	var key;
	var value;

	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string";
		var args = widgetSlice.call( arguments, 1 );
		var returnValue = this;

		if ( isMethodCall ) {

			// If this is an empty collection, we need to have the instance method
			// return undefined instead of the jQuery instance
			if ( !this.length && options === "instance" ) {
				returnValue = undefined;
			} else {
				this.each( function() {
					var methodValue;
					var instance = $.data( this, fullName );

					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodValue = instance[ options ].apply( instance, args );

					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				} );
			}
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			} );
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// Callbacks
		create: null
	},

	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetUuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classesElementLookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setOptionDisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},

	_getCreateOptions: function() {
		return {};
	},

	_getCreateEventData: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classesElementLookup, function( key, value ) {
			that._removeClass( value, key );
		} );

		// We can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventNamespace )
			.removeData( this.widgetFullName );
		this.widget()
			.off( this.eventNamespace )
			.removeAttr( "aria-disabled" );

		// Clean up events and states
		this.bindings.off( this.eventNamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curOption;
		var i;

		if ( arguments.length === 0 ) {

			// Don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},

	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "classes" ) {
			this._setOptionClasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setOptionDisabled( value );
		}

		return this;
	},

	_setOptionClasses: function( value ) {
		var classKey, elements, currentElements;

		for ( classKey in value ) {
			currentElements = this.classesElementLookup[ classKey ];
			if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
				continue;
			}

			// We are doing this to create a new jQuery object because the _removeClass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. We need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentElements.get() );
			this._removeClass( currentElements, classKey );

			// We don't use _addClass() here, because that uses this.options.classes
			// for generating the string of classes. We want to use the value passed in from
			// _setOption(), this is the new value of the classes option which was passed to
			// _setOption(). We pass this value directly to _classes().
			elements.addClass( this._classes( {
				element: elements,
				keys: classKey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setOptionDisabled: function( value ) {
		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

		// If the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeClass( this.hoverable, null, "ui-state-hover" );
			this._removeClass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setOptions( { disabled: false } );
	},

	disable: function() {
		return this._setOptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function processClassString( classes, checkOption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classesElementLookup[ classes[ i ] ] || $();
				if ( options.add ) {
					current = $( $.unique( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classesElementLookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkOption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		this._on( options.element, {
			"remove": "_untrackClassesElement"
		} );

		if ( options.keys ) {
			processClassString( options.keys.match( /\S+/g ) || [], true );
		}
		if ( options.extra ) {
			processClassString( options.extra.match( /\S+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackClassesElement: function( event ) {
		var that = this;
		$.each( that.classesElementLookup, function( key, value ) {
			if ( $.inArray( event.target, value ) !== -1 ) {
				that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
			}
		} );
	},

	_removeClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, false );
	},

	_addClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, true );
	},

	_toggleClass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleClass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement;
		var instance = this;

		// No suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// No element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {

				// Allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// Copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventName = match[ 1 ] + instance.eventNamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateElement.on( eventName, selector, handlerProxy );
			} else {
				element.on( eventName, handlerProxy );
			}
		} );
	},

	_off: function( element, eventName ) {
		eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.off( eventName ).off( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasOptions;
		var effectName = !options ?
			method :
			options === true || typeof options === "number" ?
				defaultEffect :
				options.effect || defaultEffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}

		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );

return $.widget;

} ) );


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanF1ZXJ5LXVpL3VpL3ZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2pxdWVyeS11aS91aS93aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxNQUFNLElBQTBDOztBQUVoRDtBQUNBLEVBQUUsaUNBQVEsRUFBRSx5RUFBUSxFQUFFLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsb0dBQUU7QUFDakMsRUFBRSxNQUFNLEVBSU47QUFDRixDQUFDOztBQUVEOztBQUVBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7OztBQ2hCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLElBQTBDOztBQUVoRDtBQUNBLEVBQUUsaUNBQVEsRUFBRSx5RUFBUSxFQUFFLDhFQUFXLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxvR0FBRTtBQUM5QyxFQUFFLE1BQU0sRUFJTjtBQUNGLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLCtCQUErQjtBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSwwQkFBMEI7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7QUFFekI7QUFDQSx5QkFBeUI7O0FBRXpCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7O0FBRUEsOENBQThDLE9BQU8sV0FBVztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRCxnQkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQSw0QkFBNEIsa0JBQWtCO0FBQzlDLEVBQUU7O0FBRUY7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDLEVBQUU7O0FBRUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGVBQWUsb0JBQW9CO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLGtDQUFrQztBQUMzQztBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBLENBQUMiLCJmaWxlIjoidmVuZG9yc35leGFtX25ld35yZWNlaXB0X2xpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoIGZ1bmN0aW9uKCBmYWN0b3J5ICkge1xuXHRpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXG5cdFx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXHRcdGRlZmluZSggWyBcImpxdWVyeVwiIF0sIGZhY3RvcnkgKTtcblx0fSBlbHNlIHtcblxuXHRcdC8vIEJyb3dzZXIgZ2xvYmFsc1xuXHRcdGZhY3RvcnkoIGpRdWVyeSApO1xuXHR9XG59ICggZnVuY3Rpb24oICQgKSB7XG5cbiQudWkgPSAkLnVpIHx8IHt9O1xuXG5yZXR1cm4gJC51aS52ZXJzaW9uID0gXCIxLjEyLjFcIjtcblxufSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBVSSBXaWRnZXQgMS4xMi4xXG4gKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqL1xuXG4vLz4+bGFiZWw6IFdpZGdldFxuLy8+Pmdyb3VwOiBDb3JlXG4vLz4+ZGVzY3JpcHRpb246IFByb3ZpZGVzIGEgZmFjdG9yeSBmb3IgY3JlYXRpbmcgc3RhdGVmdWwgd2lkZ2V0cyB3aXRoIGEgY29tbW9uIEFQSS5cbi8vPj5kb2NzOiBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9qUXVlcnkud2lkZ2V0L1xuLy8+PmRlbW9zOiBodHRwOi8vanF1ZXJ5dWkuY29tL3dpZGdldC9cblxuKCBmdW5jdGlvbiggZmFjdG9yeSApIHtcblx0aWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcblxuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblx0XHRkZWZpbmUoIFsgXCJqcXVlcnlcIiwgXCIuL3ZlcnNpb25cIiBdLCBmYWN0b3J5ICk7XG5cdH0gZWxzZSB7XG5cblx0XHQvLyBCcm93c2VyIGdsb2JhbHNcblx0XHRmYWN0b3J5KCBqUXVlcnkgKTtcblx0fVxufSggZnVuY3Rpb24oICQgKSB7XG5cbnZhciB3aWRnZXRVdWlkID0gMDtcbnZhciB3aWRnZXRTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuJC5jbGVhbkRhdGEgPSAoIGZ1bmN0aW9uKCBvcmlnICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW1zICkge1xuXHRcdHZhciBldmVudHMsIGVsZW0sIGk7XG5cdFx0Zm9yICggaSA9IDA7ICggZWxlbSA9IGVsZW1zWyBpIF0gKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHR0cnkge1xuXG5cdFx0XHRcdC8vIE9ubHkgdHJpZ2dlciByZW1vdmUgd2hlbiBuZWNlc3NhcnkgdG8gc2F2ZSB0aW1lXG5cdFx0XHRcdGV2ZW50cyA9ICQuX2RhdGEoIGVsZW0sIFwiZXZlbnRzXCIgKTtcblx0XHRcdFx0aWYgKCBldmVudHMgJiYgZXZlbnRzLnJlbW92ZSApIHtcblx0XHRcdFx0XHQkKCBlbGVtICkudHJpZ2dlckhhbmRsZXIoIFwicmVtb3ZlXCIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHQvLyBIdHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC84MjM1XG5cdFx0XHR9IGNhdGNoICggZSApIHt9XG5cdFx0fVxuXHRcdG9yaWcoIGVsZW1zICk7XG5cdH07XG59ICkoICQuY2xlYW5EYXRhICk7XG5cbiQud2lkZ2V0ID0gZnVuY3Rpb24oIG5hbWUsIGJhc2UsIHByb3RvdHlwZSApIHtcblx0dmFyIGV4aXN0aW5nQ29uc3RydWN0b3IsIGNvbnN0cnVjdG9yLCBiYXNlUHJvdG90eXBlO1xuXG5cdC8vIFByb3hpZWRQcm90b3R5cGUgYWxsb3dzIHRoZSBwcm92aWRlZCBwcm90b3R5cGUgdG8gcmVtYWluIHVubW9kaWZpZWRcblx0Ly8gc28gdGhhdCBpdCBjYW4gYmUgdXNlZCBhcyBhIG1peGluIGZvciBtdWx0aXBsZSB3aWRnZXRzICgjODg3Nilcblx0dmFyIHByb3hpZWRQcm90b3R5cGUgPSB7fTtcblxuXHR2YXIgbmFtZXNwYWNlID0gbmFtZS5zcGxpdCggXCIuXCIgKVsgMCBdO1xuXHRuYW1lID0gbmFtZS5zcGxpdCggXCIuXCIgKVsgMSBdO1xuXHR2YXIgZnVsbE5hbWUgPSBuYW1lc3BhY2UgKyBcIi1cIiArIG5hbWU7XG5cblx0aWYgKCAhcHJvdG90eXBlICkge1xuXHRcdHByb3RvdHlwZSA9IGJhc2U7XG5cdFx0YmFzZSA9ICQuV2lkZ2V0O1xuXHR9XG5cblx0aWYgKCAkLmlzQXJyYXkoIHByb3RvdHlwZSApICkge1xuXHRcdHByb3RvdHlwZSA9ICQuZXh0ZW5kLmFwcGx5KCBudWxsLCBbIHt9IF0uY29uY2F0KCBwcm90b3R5cGUgKSApO1xuXHR9XG5cblx0Ly8gQ3JlYXRlIHNlbGVjdG9yIGZvciBwbHVnaW5cblx0JC5leHByWyBcIjpcIiBdWyBmdWxsTmFtZS50b0xvd2VyQ2FzZSgpIF0gPSBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRyZXR1cm4gISEkLmRhdGEoIGVsZW0sIGZ1bGxOYW1lICk7XG5cdH07XG5cblx0JFsgbmFtZXNwYWNlIF0gPSAkWyBuYW1lc3BhY2UgXSB8fCB7fTtcblx0ZXhpc3RpbmdDb25zdHJ1Y3RvciA9ICRbIG5hbWVzcGFjZSBdWyBuYW1lIF07XG5cdGNvbnN0cnVjdG9yID0gJFsgbmFtZXNwYWNlIF1bIG5hbWUgXSA9IGZ1bmN0aW9uKCBvcHRpb25zLCBlbGVtZW50ICkge1xuXG5cdFx0Ly8gQWxsb3cgaW5zdGFudGlhdGlvbiB3aXRob3V0IFwibmV3XCIga2V5d29yZFxuXHRcdGlmICggIXRoaXMuX2NyZWF0ZVdpZGdldCApIHtcblx0XHRcdHJldHVybiBuZXcgY29uc3RydWN0b3IoIG9wdGlvbnMsIGVsZW1lbnQgKTtcblx0XHR9XG5cblx0XHQvLyBBbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgaW5pdGlhbGl6aW5nIGZvciBzaW1wbGUgaW5oZXJpdGFuY2Vcblx0XHQvLyBtdXN0IHVzZSBcIm5ld1wiIGtleXdvcmQgKHRoZSBjb2RlIGFib3ZlIGFsd2F5cyBwYXNzZXMgYXJncylcblx0XHRpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG5cdFx0XHR0aGlzLl9jcmVhdGVXaWRnZXQoIG9wdGlvbnMsIGVsZW1lbnQgKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRXh0ZW5kIHdpdGggdGhlIGV4aXN0aW5nIGNvbnN0cnVjdG9yIHRvIGNhcnJ5IG92ZXIgYW55IHN0YXRpYyBwcm9wZXJ0aWVzXG5cdCQuZXh0ZW5kKCBjb25zdHJ1Y3RvciwgZXhpc3RpbmdDb25zdHJ1Y3Rvciwge1xuXHRcdHZlcnNpb246IHByb3RvdHlwZS52ZXJzaW9uLFxuXG5cdFx0Ly8gQ29weSB0aGUgb2JqZWN0IHVzZWQgdG8gY3JlYXRlIHRoZSBwcm90b3R5cGUgaW4gY2FzZSB3ZSBuZWVkIHRvXG5cdFx0Ly8gcmVkZWZpbmUgdGhlIHdpZGdldCBsYXRlclxuXHRcdF9wcm90bzogJC5leHRlbmQoIHt9LCBwcm90b3R5cGUgKSxcblxuXHRcdC8vIFRyYWNrIHdpZGdldHMgdGhhdCBpbmhlcml0IGZyb20gdGhpcyB3aWRnZXQgaW4gY2FzZSB0aGlzIHdpZGdldCBpc1xuXHRcdC8vIHJlZGVmaW5lZCBhZnRlciBhIHdpZGdldCBpbmhlcml0cyBmcm9tIGl0XG5cdFx0X2NoaWxkQ29uc3RydWN0b3JzOiBbXVxuXHR9ICk7XG5cblx0YmFzZVByb3RvdHlwZSA9IG5ldyBiYXNlKCk7XG5cblx0Ly8gV2UgbmVlZCB0byBtYWtlIHRoZSBvcHRpb25zIGhhc2ggYSBwcm9wZXJ0eSBkaXJlY3RseSBvbiB0aGUgbmV3IGluc3RhbmNlXG5cdC8vIG90aGVyd2lzZSB3ZSdsbCBtb2RpZnkgdGhlIG9wdGlvbnMgaGFzaCBvbiB0aGUgcHJvdG90eXBlIHRoYXQgd2UncmVcblx0Ly8gaW5oZXJpdGluZyBmcm9tXG5cdGJhc2VQcm90b3R5cGUub3B0aW9ucyA9ICQud2lkZ2V0LmV4dGVuZCgge30sIGJhc2VQcm90b3R5cGUub3B0aW9ucyApO1xuXHQkLmVhY2goIHByb3RvdHlwZSwgZnVuY3Rpb24oIHByb3AsIHZhbHVlICkge1xuXHRcdGlmICggISQuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcblx0XHRcdHByb3hpZWRQcm90b3R5cGVbIHByb3AgXSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRwcm94aWVkUHJvdG90eXBlWyBwcm9wIF0gPSAoIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZnVuY3Rpb24gX3N1cGVyKCkge1xuXHRcdFx0XHRyZXR1cm4gYmFzZS5wcm90b3R5cGVbIHByb3AgXS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIF9zdXBlckFwcGx5KCBhcmdzICkge1xuXHRcdFx0XHRyZXR1cm4gYmFzZS5wcm90b3R5cGVbIHByb3AgXS5hcHBseSggdGhpcywgYXJncyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBfX3N1cGVyID0gdGhpcy5fc3VwZXI7XG5cdFx0XHRcdHZhciBfX3N1cGVyQXBwbHkgPSB0aGlzLl9zdXBlckFwcGx5O1xuXHRcdFx0XHR2YXIgcmV0dXJuVmFsdWU7XG5cblx0XHRcdFx0dGhpcy5fc3VwZXIgPSBfc3VwZXI7XG5cdFx0XHRcdHRoaXMuX3N1cGVyQXBwbHkgPSBfc3VwZXJBcHBseTtcblxuXHRcdFx0XHRyZXR1cm5WYWx1ZSA9IHZhbHVlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdFx0XHR0aGlzLl9zdXBlciA9IF9fc3VwZXI7XG5cdFx0XHRcdHRoaXMuX3N1cGVyQXBwbHkgPSBfX3N1cGVyQXBwbHk7XG5cblx0XHRcdFx0cmV0dXJuIHJldHVyblZhbHVlO1xuXHRcdFx0fTtcblx0XHR9ICkoKTtcblx0fSApO1xuXHRjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLndpZGdldC5leHRlbmQoIGJhc2VQcm90b3R5cGUsIHtcblxuXHRcdC8vIFRPRE86IHJlbW92ZSBzdXBwb3J0IGZvciB3aWRnZXRFdmVudFByZWZpeFxuXHRcdC8vIGFsd2F5cyB1c2UgdGhlIG5hbWUgKyBhIGNvbG9uIGFzIHRoZSBwcmVmaXgsIGUuZy4sIGRyYWdnYWJsZTpzdGFydFxuXHRcdC8vIGRvbid0IHByZWZpeCBmb3Igd2lkZ2V0cyB0aGF0IGFyZW4ndCBET00tYmFzZWRcblx0XHR3aWRnZXRFdmVudFByZWZpeDogZXhpc3RpbmdDb25zdHJ1Y3RvciA/ICggYmFzZVByb3RvdHlwZS53aWRnZXRFdmVudFByZWZpeCB8fCBuYW1lICkgOiBuYW1lXG5cdH0sIHByb3hpZWRQcm90b3R5cGUsIHtcblx0XHRjb25zdHJ1Y3RvcjogY29uc3RydWN0b3IsXG5cdFx0bmFtZXNwYWNlOiBuYW1lc3BhY2UsXG5cdFx0d2lkZ2V0TmFtZTogbmFtZSxcblx0XHR3aWRnZXRGdWxsTmFtZTogZnVsbE5hbWVcblx0fSApO1xuXG5cdC8vIElmIHRoaXMgd2lkZ2V0IGlzIGJlaW5nIHJlZGVmaW5lZCB0aGVuIHdlIG5lZWQgdG8gZmluZCBhbGwgd2lkZ2V0cyB0aGF0XG5cdC8vIGFyZSBpbmhlcml0aW5nIGZyb20gaXQgYW5kIHJlZGVmaW5lIGFsbCBvZiB0aGVtIHNvIHRoYXQgdGhleSBpbmhlcml0IGZyb21cblx0Ly8gdGhlIG5ldyB2ZXJzaW9uIG9mIHRoaXMgd2lkZ2V0LiBXZSdyZSBlc3NlbnRpYWxseSB0cnlpbmcgdG8gcmVwbGFjZSBvbmVcblx0Ly8gbGV2ZWwgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cblx0aWYgKCBleGlzdGluZ0NvbnN0cnVjdG9yICkge1xuXHRcdCQuZWFjaCggZXhpc3RpbmdDb25zdHJ1Y3Rvci5fY2hpbGRDb25zdHJ1Y3RvcnMsIGZ1bmN0aW9uKCBpLCBjaGlsZCApIHtcblx0XHRcdHZhciBjaGlsZFByb3RvdHlwZSA9IGNoaWxkLnByb3RvdHlwZTtcblxuXHRcdFx0Ly8gUmVkZWZpbmUgdGhlIGNoaWxkIHdpZGdldCB1c2luZyB0aGUgc2FtZSBwcm90b3R5cGUgdGhhdCB3YXNcblx0XHRcdC8vIG9yaWdpbmFsbHkgdXNlZCwgYnV0IGluaGVyaXQgZnJvbSB0aGUgbmV3IHZlcnNpb24gb2YgdGhlIGJhc2Vcblx0XHRcdCQud2lkZ2V0KCBjaGlsZFByb3RvdHlwZS5uYW1lc3BhY2UgKyBcIi5cIiArIGNoaWxkUHJvdG90eXBlLndpZGdldE5hbWUsIGNvbnN0cnVjdG9yLFxuXHRcdFx0XHRjaGlsZC5fcHJvdG8gKTtcblx0XHR9ICk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIGxpc3Qgb2YgZXhpc3RpbmcgY2hpbGQgY29uc3RydWN0b3JzIGZyb20gdGhlIG9sZCBjb25zdHJ1Y3RvclxuXHRcdC8vIHNvIHRoZSBvbGQgY2hpbGQgY29uc3RydWN0b3JzIGNhbiBiZSBnYXJiYWdlIGNvbGxlY3RlZFxuXHRcdGRlbGV0ZSBleGlzdGluZ0NvbnN0cnVjdG9yLl9jaGlsZENvbnN0cnVjdG9ycztcblx0fSBlbHNlIHtcblx0XHRiYXNlLl9jaGlsZENvbnN0cnVjdG9ycy5wdXNoKCBjb25zdHJ1Y3RvciApO1xuXHR9XG5cblx0JC53aWRnZXQuYnJpZGdlKCBuYW1lLCBjb25zdHJ1Y3RvciApO1xuXG5cdHJldHVybiBjb25zdHJ1Y3Rvcjtcbn07XG5cbiQud2lkZ2V0LmV4dGVuZCA9IGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG5cdHZhciBpbnB1dCA9IHdpZGdldFNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXHR2YXIgaW5wdXRJbmRleCA9IDA7XG5cdHZhciBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblx0dmFyIGtleTtcblx0dmFyIHZhbHVlO1xuXG5cdGZvciAoIDsgaW5wdXRJbmRleCA8IGlucHV0TGVuZ3RoOyBpbnB1dEluZGV4KysgKSB7XG5cdFx0Zm9yICgga2V5IGluIGlucHV0WyBpbnB1dEluZGV4IF0gKSB7XG5cdFx0XHR2YWx1ZSA9IGlucHV0WyBpbnB1dEluZGV4IF1bIGtleSBdO1xuXHRcdFx0aWYgKCBpbnB1dFsgaW5wdXRJbmRleCBdLmhhc093blByb3BlcnR5KCBrZXkgKSAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdC8vIENsb25lIG9iamVjdHNcblx0XHRcdFx0aWYgKCAkLmlzUGxhaW5PYmplY3QoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0dGFyZ2V0WyBrZXkgXSA9ICQuaXNQbGFpbk9iamVjdCggdGFyZ2V0WyBrZXkgXSApID9cblx0XHRcdFx0XHRcdCQud2lkZ2V0LmV4dGVuZCgge30sIHRhcmdldFsga2V5IF0sIHZhbHVlICkgOlxuXG5cdFx0XHRcdFx0XHQvLyBEb24ndCBleHRlbmQgc3RyaW5ncywgYXJyYXlzLCBldGMuIHdpdGggb2JqZWN0c1xuXHRcdFx0XHRcdFx0JC53aWRnZXQuZXh0ZW5kKCB7fSwgdmFsdWUgKTtcblxuXHRcdFx0XHQvLyBDb3B5IGV2ZXJ5dGhpbmcgZWxzZSBieSByZWZlcmVuY2Vcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0YXJnZXRbIGtleSBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn07XG5cbiQud2lkZ2V0LmJyaWRnZSA9IGZ1bmN0aW9uKCBuYW1lLCBvYmplY3QgKSB7XG5cdHZhciBmdWxsTmFtZSA9IG9iamVjdC5wcm90b3R5cGUud2lkZ2V0RnVsbE5hbWUgfHwgbmFtZTtcblx0JC5mblsgbmFtZSBdID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0dmFyIGlzTWV0aG9kQ2FsbCA9IHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiO1xuXHRcdHZhciBhcmdzID0gd2lkZ2V0U2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cdFx0dmFyIHJldHVyblZhbHVlID0gdGhpcztcblxuXHRcdGlmICggaXNNZXRob2RDYWxsICkge1xuXG5cdFx0XHQvLyBJZiB0aGlzIGlzIGFuIGVtcHR5IGNvbGxlY3Rpb24sIHdlIG5lZWQgdG8gaGF2ZSB0aGUgaW5zdGFuY2UgbWV0aG9kXG5cdFx0XHQvLyByZXR1cm4gdW5kZWZpbmVkIGluc3RlYWQgb2YgdGhlIGpRdWVyeSBpbnN0YW5jZVxuXHRcdFx0aWYgKCAhdGhpcy5sZW5ndGggJiYgb3B0aW9ucyA9PT0gXCJpbnN0YW5jZVwiICkge1xuXHRcdFx0XHRyZXR1cm5WYWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIG1ldGhvZFZhbHVlO1xuXHRcdFx0XHRcdHZhciBpbnN0YW5jZSA9ICQuZGF0YSggdGhpcywgZnVsbE5hbWUgKTtcblxuXHRcdFx0XHRcdGlmICggb3B0aW9ucyA9PT0gXCJpbnN0YW5jZVwiICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuVmFsdWUgPSBpbnN0YW5jZTtcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICFpbnN0YW5jZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiAkLmVycm9yKCBcImNhbm5vdCBjYWxsIG1ldGhvZHMgb24gXCIgKyBuYW1lICtcblx0XHRcdFx0XHRcdFx0XCIgcHJpb3IgdG8gaW5pdGlhbGl6YXRpb247IFwiICtcblx0XHRcdFx0XHRcdFx0XCJhdHRlbXB0ZWQgdG8gY2FsbCBtZXRob2QgJ1wiICsgb3B0aW9ucyArIFwiJ1wiICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAhJC5pc0Z1bmN0aW9uKCBpbnN0YW5jZVsgb3B0aW9ucyBdICkgfHwgb3B0aW9ucy5jaGFyQXQoIDAgKSA9PT0gXCJfXCIgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJC5lcnJvciggXCJubyBzdWNoIG1ldGhvZCAnXCIgKyBvcHRpb25zICsgXCInIGZvciBcIiArIG5hbWUgK1xuXHRcdFx0XHRcdFx0XHRcIiB3aWRnZXQgaW5zdGFuY2VcIiApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG1ldGhvZFZhbHVlID0gaW5zdGFuY2VbIG9wdGlvbnMgXS5hcHBseSggaW5zdGFuY2UsIGFyZ3MgKTtcblxuXHRcdFx0XHRcdGlmICggbWV0aG9kVmFsdWUgIT09IGluc3RhbmNlICYmIG1ldGhvZFZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm5WYWx1ZSA9IG1ldGhvZFZhbHVlICYmIG1ldGhvZFZhbHVlLmpxdWVyeSA/XG5cdFx0XHRcdFx0XHRcdHJldHVyblZhbHVlLnB1c2hTdGFjayggbWV0aG9kVmFsdWUuZ2V0KCkgKSA6XG5cdFx0XHRcdFx0XHRcdG1ldGhvZFZhbHVlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIEFsbG93IG11bHRpcGxlIGhhc2hlcyB0byBiZSBwYXNzZWQgb24gaW5pdFxuXHRcdFx0aWYgKCBhcmdzLmxlbmd0aCApIHtcblx0XHRcdFx0b3B0aW9ucyA9ICQud2lkZ2V0LmV4dGVuZC5hcHBseSggbnVsbCwgWyBvcHRpb25zIF0uY29uY2F0KCBhcmdzICkgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGluc3RhbmNlID0gJC5kYXRhKCB0aGlzLCBmdWxsTmFtZSApO1xuXHRcdFx0XHRpZiAoIGluc3RhbmNlICkge1xuXHRcdFx0XHRcdGluc3RhbmNlLm9wdGlvbiggb3B0aW9ucyB8fCB7fSApO1xuXHRcdFx0XHRcdGlmICggaW5zdGFuY2UuX2luaXQgKSB7XG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5faW5pdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkLmRhdGEoIHRoaXMsIGZ1bGxOYW1lLCBuZXcgb2JqZWN0KCBvcHRpb25zLCB0aGlzICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXR1cm5WYWx1ZTtcblx0fTtcbn07XG5cbiQuV2lkZ2V0ID0gZnVuY3Rpb24oIC8qIG9wdGlvbnMsIGVsZW1lbnQgKi8gKSB7fTtcbiQuV2lkZ2V0Ll9jaGlsZENvbnN0cnVjdG9ycyA9IFtdO1xuXG4kLldpZGdldC5wcm90b3R5cGUgPSB7XG5cdHdpZGdldE5hbWU6IFwid2lkZ2V0XCIsXG5cdHdpZGdldEV2ZW50UHJlZml4OiBcIlwiLFxuXHRkZWZhdWx0RWxlbWVudDogXCI8ZGl2PlwiLFxuXG5cdG9wdGlvbnM6IHtcblx0XHRjbGFzc2VzOiB7fSxcblx0XHRkaXNhYmxlZDogZmFsc2UsXG5cblx0XHQvLyBDYWxsYmFja3Ncblx0XHRjcmVhdGU6IG51bGxcblx0fSxcblxuXHRfY3JlYXRlV2lkZ2V0OiBmdW5jdGlvbiggb3B0aW9ucywgZWxlbWVudCApIHtcblx0XHRlbGVtZW50ID0gJCggZWxlbWVudCB8fCB0aGlzLmRlZmF1bHRFbGVtZW50IHx8IHRoaXMgKVsgMCBdO1xuXHRcdHRoaXMuZWxlbWVudCA9ICQoIGVsZW1lbnQgKTtcblx0XHR0aGlzLnV1aWQgPSB3aWRnZXRVdWlkKys7XG5cdFx0dGhpcy5ldmVudE5hbWVzcGFjZSA9IFwiLlwiICsgdGhpcy53aWRnZXROYW1lICsgdGhpcy51dWlkO1xuXG5cdFx0dGhpcy5iaW5kaW5ncyA9ICQoKTtcblx0XHR0aGlzLmhvdmVyYWJsZSA9ICQoKTtcblx0XHR0aGlzLmZvY3VzYWJsZSA9ICQoKTtcblx0XHR0aGlzLmNsYXNzZXNFbGVtZW50TG9va3VwID0ge307XG5cblx0XHRpZiAoIGVsZW1lbnQgIT09IHRoaXMgKSB7XG5cdFx0XHQkLmRhdGEoIGVsZW1lbnQsIHRoaXMud2lkZ2V0RnVsbE5hbWUsIHRoaXMgKTtcblx0XHRcdHRoaXMuX29uKCB0cnVlLCB0aGlzLmVsZW1lbnQsIHtcblx0XHRcdFx0cmVtb3ZlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0aWYgKCBldmVudC50YXJnZXQgPT09IGVsZW1lbnQgKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmRlc3Ryb3koKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHRcdHRoaXMuZG9jdW1lbnQgPSAkKCBlbGVtZW50LnN0eWxlID9cblxuXHRcdFx0XHQvLyBFbGVtZW50IHdpdGhpbiB0aGUgZG9jdW1lbnRcblx0XHRcdFx0ZWxlbWVudC5vd25lckRvY3VtZW50IDpcblxuXHRcdFx0XHQvLyBFbGVtZW50IGlzIHdpbmRvdyBvciBkb2N1bWVudFxuXHRcdFx0XHRlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQgKTtcblx0XHRcdHRoaXMud2luZG93ID0gJCggdGhpcy5kb2N1bWVudFsgMCBdLmRlZmF1bHRWaWV3IHx8IHRoaXMuZG9jdW1lbnRbIDAgXS5wYXJlbnRXaW5kb3cgKTtcblx0XHR9XG5cblx0XHR0aGlzLm9wdGlvbnMgPSAkLndpZGdldC5leHRlbmQoIHt9LFxuXHRcdFx0dGhpcy5vcHRpb25zLFxuXHRcdFx0dGhpcy5fZ2V0Q3JlYXRlT3B0aW9ucygpLFxuXHRcdFx0b3B0aW9ucyApO1xuXG5cdFx0dGhpcy5fY3JlYXRlKCk7XG5cblx0XHRpZiAoIHRoaXMub3B0aW9ucy5kaXNhYmxlZCApIHtcblx0XHRcdHRoaXMuX3NldE9wdGlvbkRpc2FibGVkKCB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgKTtcblx0XHR9XG5cblx0XHR0aGlzLl90cmlnZ2VyKCBcImNyZWF0ZVwiLCBudWxsLCB0aGlzLl9nZXRDcmVhdGVFdmVudERhdGEoKSApO1xuXHRcdHRoaXMuX2luaXQoKTtcblx0fSxcblxuXHRfZ2V0Q3JlYXRlT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9LFxuXG5cdF9nZXRDcmVhdGVFdmVudERhdGE6ICQubm9vcCxcblxuXHRfY3JlYXRlOiAkLm5vb3AsXG5cblx0X2luaXQ6ICQubm9vcCxcblxuXHRkZXN0cm95OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHR0aGlzLl9kZXN0cm95KCk7XG5cdFx0JC5lYWNoKCB0aGlzLmNsYXNzZXNFbGVtZW50TG9va3VwLCBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHRcdHRoYXQuX3JlbW92ZUNsYXNzKCB2YWx1ZSwga2V5ICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gV2UgY2FuIHByb2JhYmx5IHJlbW92ZSB0aGUgdW5iaW5kIGNhbGxzIGluIDIuMFxuXHRcdC8vIGFsbCBldmVudCBiaW5kaW5ncyBzaG91bGQgZ28gdGhyb3VnaCB0aGlzLl9vbigpXG5cdFx0dGhpcy5lbGVtZW50XG5cdFx0XHQub2ZmKCB0aGlzLmV2ZW50TmFtZXNwYWNlIClcblx0XHRcdC5yZW1vdmVEYXRhKCB0aGlzLndpZGdldEZ1bGxOYW1lICk7XG5cdFx0dGhpcy53aWRnZXQoKVxuXHRcdFx0Lm9mZiggdGhpcy5ldmVudE5hbWVzcGFjZSApXG5cdFx0XHQucmVtb3ZlQXR0ciggXCJhcmlhLWRpc2FibGVkXCIgKTtcblxuXHRcdC8vIENsZWFuIHVwIGV2ZW50cyBhbmQgc3RhdGVzXG5cdFx0dGhpcy5iaW5kaW5ncy5vZmYoIHRoaXMuZXZlbnROYW1lc3BhY2UgKTtcblx0fSxcblxuXHRfZGVzdHJveTogJC5ub29wLFxuXG5cdHdpZGdldDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudDtcblx0fSxcblxuXHRvcHRpb246IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXHRcdHZhciBvcHRpb25zID0ga2V5O1xuXHRcdHZhciBwYXJ0cztcblx0XHR2YXIgY3VyT3B0aW9uO1xuXHRcdHZhciBpO1xuXG5cdFx0aWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAwICkge1xuXG5cdFx0XHQvLyBEb24ndCByZXR1cm4gYSByZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGhhc2hcblx0XHRcdHJldHVybiAkLndpZGdldC5leHRlbmQoIHt9LCB0aGlzLm9wdGlvbnMgKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgKSB7XG5cblx0XHRcdC8vIEhhbmRsZSBuZXN0ZWQga2V5cywgZS5nLiwgXCJmb28uYmFyXCIgPT4geyBmb286IHsgYmFyOiBfX18gfSB9XG5cdFx0XHRvcHRpb25zID0ge307XG5cdFx0XHRwYXJ0cyA9IGtleS5zcGxpdCggXCIuXCIgKTtcblx0XHRcdGtleSA9IHBhcnRzLnNoaWZ0KCk7XG5cdFx0XHRpZiAoIHBhcnRzLmxlbmd0aCApIHtcblx0XHRcdFx0Y3VyT3B0aW9uID0gb3B0aW9uc1sga2V5IF0gPSAkLndpZGdldC5leHRlbmQoIHt9LCB0aGlzLm9wdGlvbnNbIGtleSBdICk7XG5cdFx0XHRcdGZvciAoIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSsrICkge1xuXHRcdFx0XHRcdGN1ck9wdGlvblsgcGFydHNbIGkgXSBdID0gY3VyT3B0aW9uWyBwYXJ0c1sgaSBdIF0gfHwge307XG5cdFx0XHRcdFx0Y3VyT3B0aW9uID0gY3VyT3B0aW9uWyBwYXJ0c1sgaSBdIF07XG5cdFx0XHRcdH1cblx0XHRcdFx0a2V5ID0gcGFydHMucG9wKCk7XG5cdFx0XHRcdGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdFx0XHRyZXR1cm4gY3VyT3B0aW9uWyBrZXkgXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGN1ck9wdGlvblsga2V5IF07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3VyT3B0aW9uWyBrZXkgXSA9IHZhbHVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLm9wdGlvbnNbIGtleSBdID09PSB1bmRlZmluZWQgPyBudWxsIDogdGhpcy5vcHRpb25zWyBrZXkgXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvcHRpb25zWyBrZXkgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3NldE9wdGlvbnMoIG9wdGlvbnMgKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdF9zZXRPcHRpb25zOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0XHR2YXIga2V5O1xuXG5cdFx0Zm9yICgga2V5IGluIG9wdGlvbnMgKSB7XG5cdFx0XHR0aGlzLl9zZXRPcHRpb24oIGtleSwgb3B0aW9uc1sga2V5IF0gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRfc2V0T3B0aW9uOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHRpZiAoIGtleSA9PT0gXCJjbGFzc2VzXCIgKSB7XG5cdFx0XHR0aGlzLl9zZXRPcHRpb25DbGFzc2VzKCB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdHRoaXMub3B0aW9uc1sga2V5IF0gPSB2YWx1ZTtcblxuXHRcdGlmICgga2V5ID09PSBcImRpc2FibGVkXCIgKSB7XG5cdFx0XHR0aGlzLl9zZXRPcHRpb25EaXNhYmxlZCggdmFsdWUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRfc2V0T3B0aW9uQ2xhc3NlczogZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhciBjbGFzc0tleSwgZWxlbWVudHMsIGN1cnJlbnRFbGVtZW50cztcblxuXHRcdGZvciAoIGNsYXNzS2V5IGluIHZhbHVlICkge1xuXHRcdFx0Y3VycmVudEVsZW1lbnRzID0gdGhpcy5jbGFzc2VzRWxlbWVudExvb2t1cFsgY2xhc3NLZXkgXTtcblx0XHRcdGlmICggdmFsdWVbIGNsYXNzS2V5IF0gPT09IHRoaXMub3B0aW9ucy5jbGFzc2VzWyBjbGFzc0tleSBdIHx8XG5cdFx0XHRcdFx0IWN1cnJlbnRFbGVtZW50cyB8fFxuXHRcdFx0XHRcdCFjdXJyZW50RWxlbWVudHMubGVuZ3RoICkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2UgYXJlIGRvaW5nIHRoaXMgdG8gY3JlYXRlIGEgbmV3IGpRdWVyeSBvYmplY3QgYmVjYXVzZSB0aGUgX3JlbW92ZUNsYXNzKCkgY2FsbFxuXHRcdFx0Ly8gb24gdGhlIG5leHQgbGluZSBpcyBnb2luZyB0byBkZXN0cm95IHRoZSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgZWxlbWVudHMgYmVpbmdcblx0XHRcdC8vIHRyYWNrZWQuIFdlIG5lZWQgdG8gc2F2ZSBhIGNvcHkgb2YgdGhpcyBjb2xsZWN0aW9uIHNvIHRoYXQgd2UgY2FuIGFkZCB0aGUgbmV3IGNsYXNzZXNcblx0XHRcdC8vIGJlbG93LlxuXHRcdFx0ZWxlbWVudHMgPSAkKCBjdXJyZW50RWxlbWVudHMuZ2V0KCkgKTtcblx0XHRcdHRoaXMuX3JlbW92ZUNsYXNzKCBjdXJyZW50RWxlbWVudHMsIGNsYXNzS2V5ICk7XG5cblx0XHRcdC8vIFdlIGRvbid0IHVzZSBfYWRkQ2xhc3MoKSBoZXJlLCBiZWNhdXNlIHRoYXQgdXNlcyB0aGlzLm9wdGlvbnMuY2xhc3Nlc1xuXHRcdFx0Ly8gZm9yIGdlbmVyYXRpbmcgdGhlIHN0cmluZyBvZiBjbGFzc2VzLiBXZSB3YW50IHRvIHVzZSB0aGUgdmFsdWUgcGFzc2VkIGluIGZyb21cblx0XHRcdC8vIF9zZXRPcHRpb24oKSwgdGhpcyBpcyB0aGUgbmV3IHZhbHVlIG9mIHRoZSBjbGFzc2VzIG9wdGlvbiB3aGljaCB3YXMgcGFzc2VkIHRvXG5cdFx0XHQvLyBfc2V0T3B0aW9uKCkuIFdlIHBhc3MgdGhpcyB2YWx1ZSBkaXJlY3RseSB0byBfY2xhc3NlcygpLlxuXHRcdFx0ZWxlbWVudHMuYWRkQ2xhc3MoIHRoaXMuX2NsYXNzZXMoIHtcblx0XHRcdFx0ZWxlbWVudDogZWxlbWVudHMsXG5cdFx0XHRcdGtleXM6IGNsYXNzS2V5LFxuXHRcdFx0XHRjbGFzc2VzOiB2YWx1ZSxcblx0XHRcdFx0YWRkOiB0cnVlXG5cdFx0XHR9ICkgKTtcblx0XHR9XG5cdH0sXG5cblx0X3NldE9wdGlvbkRpc2FibGVkOiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dGhpcy5fdG9nZ2xlQ2xhc3MoIHRoaXMud2lkZ2V0KCksIHRoaXMud2lkZ2V0RnVsbE5hbWUgKyBcIi1kaXNhYmxlZFwiLCBudWxsLCAhIXZhbHVlICk7XG5cblx0XHQvLyBJZiB0aGUgd2lkZ2V0IGlzIGJlY29taW5nIGRpc2FibGVkLCB0aGVuIG5vdGhpbmcgaXMgaW50ZXJhY3RpdmVcblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0dGhpcy5fcmVtb3ZlQ2xhc3MoIHRoaXMuaG92ZXJhYmxlLCBudWxsLCBcInVpLXN0YXRlLWhvdmVyXCIgKTtcblx0XHRcdHRoaXMuX3JlbW92ZUNsYXNzKCB0aGlzLmZvY3VzYWJsZSwgbnVsbCwgXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG5cdFx0fVxuXHR9LFxuXG5cdGVuYWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3NldE9wdGlvbnMoIHsgZGlzYWJsZWQ6IGZhbHNlIH0gKTtcblx0fSxcblxuXHRkaXNhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5fc2V0T3B0aW9ucyggeyBkaXNhYmxlZDogdHJ1ZSB9ICk7XG5cdH0sXG5cblx0X2NsYXNzZXM6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXHRcdHZhciBmdWxsID0gW107XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdFx0b3B0aW9ucyA9ICQuZXh0ZW5kKCB7XG5cdFx0XHRlbGVtZW50OiB0aGlzLmVsZW1lbnQsXG5cdFx0XHRjbGFzc2VzOiB0aGlzLm9wdGlvbnMuY2xhc3NlcyB8fCB7fVxuXHRcdH0sIG9wdGlvbnMgKTtcblxuXHRcdGZ1bmN0aW9uIHByb2Nlc3NDbGFzc1N0cmluZyggY2xhc3NlcywgY2hlY2tPcHRpb24gKSB7XG5cdFx0XHR2YXIgY3VycmVudCwgaTtcblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0Y3VycmVudCA9IHRoYXQuY2xhc3Nlc0VsZW1lbnRMb29rdXBbIGNsYXNzZXNbIGkgXSBdIHx8ICQoKTtcblx0XHRcdFx0aWYgKCBvcHRpb25zLmFkZCApIHtcblx0XHRcdFx0XHRjdXJyZW50ID0gJCggJC51bmlxdWUoIGN1cnJlbnQuZ2V0KCkuY29uY2F0KCBvcHRpb25zLmVsZW1lbnQuZ2V0KCkgKSApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y3VycmVudCA9ICQoIGN1cnJlbnQubm90KCBvcHRpb25zLmVsZW1lbnQgKS5nZXQoKSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoYXQuY2xhc3Nlc0VsZW1lbnRMb29rdXBbIGNsYXNzZXNbIGkgXSBdID0gY3VycmVudDtcblx0XHRcdFx0ZnVsbC5wdXNoKCBjbGFzc2VzWyBpIF0gKTtcblx0XHRcdFx0aWYgKCBjaGVja09wdGlvbiAmJiBvcHRpb25zLmNsYXNzZXNbIGNsYXNzZXNbIGkgXSBdICkge1xuXHRcdFx0XHRcdGZ1bGwucHVzaCggb3B0aW9ucy5jbGFzc2VzWyBjbGFzc2VzWyBpIF0gXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fb24oIG9wdGlvbnMuZWxlbWVudCwge1xuXHRcdFx0XCJyZW1vdmVcIjogXCJfdW50cmFja0NsYXNzZXNFbGVtZW50XCJcblx0XHR9ICk7XG5cblx0XHRpZiAoIG9wdGlvbnMua2V5cyApIHtcblx0XHRcdHByb2Nlc3NDbGFzc1N0cmluZyggb3B0aW9ucy5rZXlzLm1hdGNoKCAvXFxTKy9nICkgfHwgW10sIHRydWUgKTtcblx0XHR9XG5cdFx0aWYgKCBvcHRpb25zLmV4dHJhICkge1xuXHRcdFx0cHJvY2Vzc0NsYXNzU3RyaW5nKCBvcHRpb25zLmV4dHJhLm1hdGNoKCAvXFxTKy9nICkgfHwgW10gKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZnVsbC5qb2luKCBcIiBcIiApO1xuXHR9LFxuXG5cdF91bnRyYWNrQ2xhc3Nlc0VsZW1lbnQ6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0JC5lYWNoKCB0aGF0LmNsYXNzZXNFbGVtZW50TG9va3VwLCBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHRcdGlmICggJC5pbkFycmF5KCBldmVudC50YXJnZXQsIHZhbHVlICkgIT09IC0xICkge1xuXHRcdFx0XHR0aGF0LmNsYXNzZXNFbGVtZW50TG9va3VwWyBrZXkgXSA9ICQoIHZhbHVlLm5vdCggZXZlbnQudGFyZ2V0ICkuZ2V0KCkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0X3JlbW92ZUNsYXNzOiBmdW5jdGlvbiggZWxlbWVudCwga2V5cywgZXh0cmEgKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3RvZ2dsZUNsYXNzKCBlbGVtZW50LCBrZXlzLCBleHRyYSwgZmFsc2UgKTtcblx0fSxcblxuXHRfYWRkQ2xhc3M6IGZ1bmN0aW9uKCBlbGVtZW50LCBrZXlzLCBleHRyYSApIHtcblx0XHRyZXR1cm4gdGhpcy5fdG9nZ2xlQ2xhc3MoIGVsZW1lbnQsIGtleXMsIGV4dHJhLCB0cnVlICk7XG5cdH0sXG5cblx0X3RvZ2dsZUNsYXNzOiBmdW5jdGlvbiggZWxlbWVudCwga2V5cywgZXh0cmEsIGFkZCApIHtcblx0XHRhZGQgPSAoIHR5cGVvZiBhZGQgPT09IFwiYm9vbGVhblwiICkgPyBhZGQgOiBleHRyYTtcblx0XHR2YXIgc2hpZnQgPSAoIHR5cGVvZiBlbGVtZW50ID09PSBcInN0cmluZ1wiIHx8IGVsZW1lbnQgPT09IG51bGwgKSxcblx0XHRcdG9wdGlvbnMgPSB7XG5cdFx0XHRcdGV4dHJhOiBzaGlmdCA/IGtleXMgOiBleHRyYSxcblx0XHRcdFx0a2V5czogc2hpZnQgPyBlbGVtZW50IDoga2V5cyxcblx0XHRcdFx0ZWxlbWVudDogc2hpZnQgPyB0aGlzLmVsZW1lbnQgOiBlbGVtZW50LFxuXHRcdFx0XHRhZGQ6IGFkZFxuXHRcdFx0fTtcblx0XHRvcHRpb25zLmVsZW1lbnQudG9nZ2xlQ2xhc3MoIHRoaXMuX2NsYXNzZXMoIG9wdGlvbnMgKSwgYWRkICk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0X29uOiBmdW5jdGlvbiggc3VwcHJlc3NEaXNhYmxlZENoZWNrLCBlbGVtZW50LCBoYW5kbGVycyApIHtcblx0XHR2YXIgZGVsZWdhdGVFbGVtZW50O1xuXHRcdHZhciBpbnN0YW5jZSA9IHRoaXM7XG5cblx0XHQvLyBObyBzdXBwcmVzc0Rpc2FibGVkQ2hlY2sgZmxhZywgc2h1ZmZsZSBhcmd1bWVudHNcblx0XHRpZiAoIHR5cGVvZiBzdXBwcmVzc0Rpc2FibGVkQ2hlY2sgIT09IFwiYm9vbGVhblwiICkge1xuXHRcdFx0aGFuZGxlcnMgPSBlbGVtZW50O1xuXHRcdFx0ZWxlbWVudCA9IHN1cHByZXNzRGlzYWJsZWRDaGVjaztcblx0XHRcdHN1cHByZXNzRGlzYWJsZWRDaGVjayA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIE5vIGVsZW1lbnQgYXJndW1lbnQsIHNodWZmbGUgYW5kIHVzZSB0aGlzLmVsZW1lbnRcblx0XHRpZiAoICFoYW5kbGVycyApIHtcblx0XHRcdGhhbmRsZXJzID0gZWxlbWVudDtcblx0XHRcdGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG5cdFx0XHRkZWxlZ2F0ZUVsZW1lbnQgPSB0aGlzLndpZGdldCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtZW50ID0gZGVsZWdhdGVFbGVtZW50ID0gJCggZWxlbWVudCApO1xuXHRcdFx0dGhpcy5iaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuYWRkKCBlbGVtZW50ICk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKCBoYW5kbGVycywgZnVuY3Rpb24oIGV2ZW50LCBoYW5kbGVyICkge1xuXHRcdFx0ZnVuY3Rpb24gaGFuZGxlclByb3h5KCkge1xuXG5cdFx0XHRcdC8vIEFsbG93IHdpZGdldHMgdG8gY3VzdG9taXplIHRoZSBkaXNhYmxlZCBoYW5kbGluZ1xuXHRcdFx0XHQvLyAtIGRpc2FibGVkIGFzIGFuIGFycmF5IGluc3RlYWQgb2YgYm9vbGVhblxuXHRcdFx0XHQvLyAtIGRpc2FibGVkIGNsYXNzIGFzIG1ldGhvZCBmb3IgZGlzYWJsaW5nIGluZGl2aWR1YWwgcGFydHNcblx0XHRcdFx0aWYgKCAhc3VwcHJlc3NEaXNhYmxlZENoZWNrICYmXG5cdFx0XHRcdFx0XHQoIGluc3RhbmNlLm9wdGlvbnMuZGlzYWJsZWQgPT09IHRydWUgfHxcblx0XHRcdFx0XHRcdCQoIHRoaXMgKS5oYXNDbGFzcyggXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiICkgKSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICggdHlwZW9mIGhhbmRsZXIgPT09IFwic3RyaW5nXCIgPyBpbnN0YW5jZVsgaGFuZGxlciBdIDogaGFuZGxlciApXG5cdFx0XHRcdFx0LmFwcGx5KCBpbnN0YW5jZSwgYXJndW1lbnRzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvcHkgdGhlIGd1aWQgc28gZGlyZWN0IHVuYmluZGluZyB3b3Jrc1xuXHRcdFx0aWYgKCB0eXBlb2YgaGFuZGxlciAhPT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdFx0aGFuZGxlclByb3h5Lmd1aWQgPSBoYW5kbGVyLmd1aWQgPVxuXHRcdFx0XHRcdGhhbmRsZXIuZ3VpZCB8fCBoYW5kbGVyUHJveHkuZ3VpZCB8fCAkLmd1aWQrKztcblx0XHRcdH1cblxuXHRcdFx0dmFyIG1hdGNoID0gZXZlbnQubWF0Y2goIC9eKFtcXHc6LV0qKVxccyooLiopJC8gKTtcblx0XHRcdHZhciBldmVudE5hbWUgPSBtYXRjaFsgMSBdICsgaW5zdGFuY2UuZXZlbnROYW1lc3BhY2U7XG5cdFx0XHR2YXIgc2VsZWN0b3IgPSBtYXRjaFsgMiBdO1xuXG5cdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRkZWxlZ2F0ZUVsZW1lbnQub24oIGV2ZW50TmFtZSwgc2VsZWN0b3IsIGhhbmRsZXJQcm94eSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudC5vbiggZXZlbnROYW1lLCBoYW5kbGVyUHJveHkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0X29mZjogZnVuY3Rpb24oIGVsZW1lbnQsIGV2ZW50TmFtZSApIHtcblx0XHRldmVudE5hbWUgPSAoIGV2ZW50TmFtZSB8fCBcIlwiICkuc3BsaXQoIFwiIFwiICkuam9pbiggdGhpcy5ldmVudE5hbWVzcGFjZSArIFwiIFwiICkgK1xuXHRcdFx0dGhpcy5ldmVudE5hbWVzcGFjZTtcblx0XHRlbGVtZW50Lm9mZiggZXZlbnROYW1lICkub2ZmKCBldmVudE5hbWUgKTtcblxuXHRcdC8vIENsZWFyIHRoZSBzdGFjayB0byBhdm9pZCBtZW1vcnkgbGVha3MgKCMxMDA1Nilcblx0XHR0aGlzLmJpbmRpbmdzID0gJCggdGhpcy5iaW5kaW5ncy5ub3QoIGVsZW1lbnQgKS5nZXQoKSApO1xuXHRcdHRoaXMuZm9jdXNhYmxlID0gJCggdGhpcy5mb2N1c2FibGUubm90KCBlbGVtZW50ICkuZ2V0KCkgKTtcblx0XHR0aGlzLmhvdmVyYWJsZSA9ICQoIHRoaXMuaG92ZXJhYmxlLm5vdCggZWxlbWVudCApLmdldCgpICk7XG5cdH0sXG5cblx0X2RlbGF5OiBmdW5jdGlvbiggaGFuZGxlciwgZGVsYXkgKSB7XG5cdFx0ZnVuY3Rpb24gaGFuZGxlclByb3h5KCkge1xuXHRcdFx0cmV0dXJuICggdHlwZW9mIGhhbmRsZXIgPT09IFwic3RyaW5nXCIgPyBpbnN0YW5jZVsgaGFuZGxlciBdIDogaGFuZGxlciApXG5cdFx0XHRcdC5hcHBseSggaW5zdGFuY2UsIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0XHR2YXIgaW5zdGFuY2UgPSB0aGlzO1xuXHRcdHJldHVybiBzZXRUaW1lb3V0KCBoYW5kbGVyUHJveHksIGRlbGF5IHx8IDAgKTtcblx0fSxcblxuXHRfaG92ZXJhYmxlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHR0aGlzLmhvdmVyYWJsZSA9IHRoaXMuaG92ZXJhYmxlLmFkZCggZWxlbWVudCApO1xuXHRcdHRoaXMuX29uKCBlbGVtZW50LCB7XG5cdFx0XHRtb3VzZWVudGVyOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdHRoaXMuX2FkZENsYXNzKCAkKCBldmVudC5jdXJyZW50VGFyZ2V0ICksIG51bGwsIFwidWktc3RhdGUtaG92ZXJcIiApO1xuXHRcdFx0fSxcblx0XHRcdG1vdXNlbGVhdmU6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dGhpcy5fcmVtb3ZlQ2xhc3MoICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKSwgbnVsbCwgXCJ1aS1zdGF0ZS1ob3ZlclwiICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9LFxuXG5cdF9mb2N1c2FibGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHRoaXMuZm9jdXNhYmxlID0gdGhpcy5mb2N1c2FibGUuYWRkKCBlbGVtZW50ICk7XG5cdFx0dGhpcy5fb24oIGVsZW1lbnQsIHtcblx0XHRcdGZvY3VzaW46IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dGhpcy5fYWRkQ2xhc3MoICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKSwgbnVsbCwgXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG5cdFx0XHR9LFxuXHRcdFx0Zm9jdXNvdXQ6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dGhpcy5fcmVtb3ZlQ2xhc3MoICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKSwgbnVsbCwgXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9LFxuXG5cdF90cmlnZ2VyOiBmdW5jdGlvbiggdHlwZSwgZXZlbnQsIGRhdGEgKSB7XG5cdFx0dmFyIHByb3AsIG9yaWc7XG5cdFx0dmFyIGNhbGxiYWNrID0gdGhpcy5vcHRpb25zWyB0eXBlIF07XG5cblx0XHRkYXRhID0gZGF0YSB8fCB7fTtcblx0XHRldmVudCA9ICQuRXZlbnQoIGV2ZW50ICk7XG5cdFx0ZXZlbnQudHlwZSA9ICggdHlwZSA9PT0gdGhpcy53aWRnZXRFdmVudFByZWZpeCA/XG5cdFx0XHR0eXBlIDpcblx0XHRcdHRoaXMud2lkZ2V0RXZlbnRQcmVmaXggKyB0eXBlICkudG9Mb3dlckNhc2UoKTtcblxuXHRcdC8vIFRoZSBvcmlnaW5hbCBldmVudCBtYXkgY29tZSBmcm9tIGFueSBlbGVtZW50XG5cdFx0Ly8gc28gd2UgbmVlZCB0byByZXNldCB0aGUgdGFyZ2V0IG9uIHRoZSBuZXcgZXZlbnRcblx0XHRldmVudC50YXJnZXQgPSB0aGlzLmVsZW1lbnRbIDAgXTtcblxuXHRcdC8vIENvcHkgb3JpZ2luYWwgZXZlbnQgcHJvcGVydGllcyBvdmVyIHRvIHRoZSBuZXcgZXZlbnRcblx0XHRvcmlnID0gZXZlbnQub3JpZ2luYWxFdmVudDtcblx0XHRpZiAoIG9yaWcgKSB7XG5cdFx0XHRmb3IgKCBwcm9wIGluIG9yaWcgKSB7XG5cdFx0XHRcdGlmICggISggcHJvcCBpbiBldmVudCApICkge1xuXHRcdFx0XHRcdGV2ZW50WyBwcm9wIF0gPSBvcmlnWyBwcm9wIF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQudHJpZ2dlciggZXZlbnQsIGRhdGEgKTtcblx0XHRyZXR1cm4gISggJC5pc0Z1bmN0aW9uKCBjYWxsYmFjayApICYmXG5cdFx0XHRjYWxsYmFjay5hcHBseSggdGhpcy5lbGVtZW50WyAwIF0sIFsgZXZlbnQgXS5jb25jYXQoIGRhdGEgKSApID09PSBmYWxzZSB8fFxuXHRcdFx0ZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgKTtcblx0fVxufTtcblxuJC5lYWNoKCB7IHNob3c6IFwiZmFkZUluXCIsIGhpZGU6IFwiZmFkZU91dFwiIH0sIGZ1bmN0aW9uKCBtZXRob2QsIGRlZmF1bHRFZmZlY3QgKSB7XG5cdCQuV2lkZ2V0LnByb3RvdHlwZVsgXCJfXCIgKyBtZXRob2QgXSA9IGZ1bmN0aW9uKCBlbGVtZW50LCBvcHRpb25zLCBjYWxsYmFjayApIHtcblx0XHRpZiAoIHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0b3B0aW9ucyA9IHsgZWZmZWN0OiBvcHRpb25zIH07XG5cdFx0fVxuXG5cdFx0dmFyIGhhc09wdGlvbnM7XG5cdFx0dmFyIGVmZmVjdE5hbWUgPSAhb3B0aW9ucyA/XG5cdFx0XHRtZXRob2QgOlxuXHRcdFx0b3B0aW9ucyA9PT0gdHJ1ZSB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIiA/XG5cdFx0XHRcdGRlZmF1bHRFZmZlY3QgOlxuXHRcdFx0XHRvcHRpb25zLmVmZmVjdCB8fCBkZWZhdWx0RWZmZWN0O1xuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0aWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdG9wdGlvbnMgPSB7IGR1cmF0aW9uOiBvcHRpb25zIH07XG5cdFx0fVxuXG5cdFx0aGFzT3B0aW9ucyA9ICEkLmlzRW1wdHlPYmplY3QoIG9wdGlvbnMgKTtcblx0XHRvcHRpb25zLmNvbXBsZXRlID0gY2FsbGJhY2s7XG5cblx0XHRpZiAoIG9wdGlvbnMuZGVsYXkgKSB7XG5cdFx0XHRlbGVtZW50LmRlbGF5KCBvcHRpb25zLmRlbGF5ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBoYXNPcHRpb25zICYmICQuZWZmZWN0cyAmJiAkLmVmZmVjdHMuZWZmZWN0WyBlZmZlY3ROYW1lIF0gKSB7XG5cdFx0XHRlbGVtZW50WyBtZXRob2QgXSggb3B0aW9ucyApO1xuXHRcdH0gZWxzZSBpZiAoIGVmZmVjdE5hbWUgIT09IG1ldGhvZCAmJiBlbGVtZW50WyBlZmZlY3ROYW1lIF0gKSB7XG5cdFx0XHRlbGVtZW50WyBlZmZlY3ROYW1lIF0oIG9wdGlvbnMuZHVyYXRpb24sIG9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbGVtZW50LnF1ZXVlKCBmdW5jdGlvbiggbmV4dCApIHtcblx0XHRcdFx0JCggdGhpcyApWyBtZXRob2QgXSgpO1xuXHRcdFx0XHRpZiAoIGNhbGxiYWNrICkge1xuXHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwoIGVsZW1lbnRbIDAgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5leHQoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH07XG59ICk7XG5cbnJldHVybiAkLndpZGdldDtcblxufSApICk7XG4iXSwic291cmNlUm9vdCI6IiJ9