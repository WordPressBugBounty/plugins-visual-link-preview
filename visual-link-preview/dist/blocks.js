var VisualLinkPreview;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7501:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/base64 v1.0.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports =  true && exports;

	// Detect free variable `module`.
	var freeModule =  true && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '1.0.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return base64;
		}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}	else { var key; }

}(this));


/***/ }),

/***/ 7129:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.P = querystringify;
__webpack_unused_export__ = querystring;


/***/ }),

/***/ 7458:
/***/ ((__unused_webpack_module, exports) => {

/*! https://mths.be/utf8js v3.0.0 by @mathias */
;(function(root) {

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	root.version = '3.0.0';
	root.encode = utf8encode;
	root.decode = utf8decode;

}( false ? 0 : exports));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/base-64/base64.js
var base64 = __webpack_require__(7501);
var base64_default = /*#__PURE__*/__webpack_require__.n(base64);
// EXTERNAL MODULE: ./node_modules/utf8/utf8.js
var utf8 = __webpack_require__(7458);
var utf8_default = /*#__PURE__*/__webpack_require__.n(utf8);
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/admin/encoder.js


var encodeLink = function encodeLink(link) {
  return base64_default().encode(utf8_default().encode(JSON.stringify(link)));
};
var decodeLink = function decodeLink(encoded) {
  var decoded = '';
  try {
    decoded = JSON.parse(utf8_default().decode(base64_default().decode(encoded)));
  } catch (e) {
    decoded = JSON.parse(base64_default().decode(encoded));
  }
  return decoded;
};
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/deprecated.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var renderToString = wp.element.renderToString;
/* harmony default export */ const deprecated = ([{
  attributes: {
    title: {
      type: 'array',
      source: 'children',
      selector: 'h3'
    },
    summary: {
      type: 'array',
      source: 'children',
      selector: '.summary'
    },
    image_id: {
      type: 'number'
    },
    image_url: {
      type: 'string',
      source: 'attribute',
      selector: 'img',
      attribute: 'src'
    },
    type: {
      type: 'string',
      default: 'internal'
    },
    post: {
      type: 'number',
      default: 0
    },
    post_label: {
      type: 'string',
      default: ''
    },
    url: {
      type: 'string',
      default: ''
    },
    template: {
      type: 'string',
      default: 'use_default_from_settings'
    },
    encoded: {
      type: 'string'
    }
  },
  migrate: function migrate(attributes) {
    return _objectSpread(_objectSpread({}, attributes), {}, {
      title: renderToString(attributes.title),
      summary: renderToString(attributes.summary)
    });
  },
  save: function save(_ref) {
    var className = _ref.className,
      attributes = _ref.attributes;
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, attributes.image_url && /*#__PURE__*/React.createElement("img", {
      className: "vlp-image",
      src: attributes.image_url
    }), /*#__PURE__*/React.createElement("h3", null, attributes.title), /*#__PURE__*/React.createElement("div", {
      className: "summary"
    }, attributes.summary));
  }
}]);
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/shared/ApiWrapper.js
function ApiWrapper_typeof(obj) { "@babel/helpers - typeof"; return ApiWrapper_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, ApiWrapper_typeof(obj); }
/* harmony default export */ const ApiWrapper = ({
  call: function call(endpoint) {
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
    var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var nonce = vlp_admin.api_nonce;
    if ('object' === ApiWrapper_typeof(window.wpApiSettings) && window.wpApiSettings.nonce) {
      nonce = window.wpApiSettings.nonce;
    }
    var args = {
      method: method,
      headers: {
        'X-WP-Nonce': nonce,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Don't cache API calls.
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
      },
      credentials: 'same-origin'
    };

    // Use POST for PUT and DELETE and emulate for better compatibility.
    if ('PUT' === method || 'DELETE' === method) {
      args.method = 'POST';
      args.headers['X-HTTP-Method-Override'] = method;
    }

    // Add optional body data.
    if (body) {
      args.body = JSON.stringify(body);
    }

    // Prevent double ? in endpoint by keeping only the first one.
    var occurrence = 0;
    endpoint = endpoint.replace(/\?/g, function (match) {
      occurrence++;
      return 2 <= occurrence ? "&" : match;
    });
    return fetch(endpoint, args).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        // Log errors in console and try to get as much debug information as possible.
        console.log(endpoint, args);
        console.log(response);
        var message = "Something went wrong. Using a firewall like Cloudflare or Sucuri? Try whitelisting your IP. If that doesn't work, please contact support@bootstrapped.ventures with the following details:";
        var responseDetails = "".concat(response.url, " ").concat(response.redirected ? '(redirected)' : '', "- ").concat(response.status, " - ").concat(response.statusText);
        try {
          response.text().then(function (text) {
            console.log(text);
            if (-1 !== text.indexOf('rest_cookie_invalid_nonce')) {
              // Got logged out.
              alert('You got logged out or your session expired. Please try logging out of WordPress and back in again.');
            } else {
              alert("".concat(message, "\r\n\r\n").concat(responseDetails, "\r\n\r\n").concat(text));
            }
          });
        } catch (e) {
          console.log(e);
          alert("".concat(message, "\r\n\r\n").concat(responseDetails, "\r\n\r\n").concat(e));
        }
        return false;
      }
    });
  }
});
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/shared/Api/Template.js

var gettingPreview = false;
var gettingPreviewNext = false;
/* harmony default export */ const Template = ({
  preview: function preview(template) {
    if (!gettingPreview) {
      return this.previewDebounced(template);
    } else {
      gettingPreviewNext = template;
      return new Promise(function (r) {
        return r(false);
      });
    }
  },
  previewDebounced: function previewDebounced(template) {
    var _this = this;
    gettingPreview = true;
    var data = {
      template: template
    };
    return ApiWrapper.call("".concat(vlp_admin.endpoints.template, "/preview"), 'POST', data).then(function (json) {
      // Check if another request is queued.
      if (gettingPreviewNext) {
        var newTemplate = gettingPreviewNext;
        gettingPreviewNext = false;
        return _this.previewDebounced(newTemplate);
      } else {
        // Return this request.
        gettingPreview = false;
        return json;
      }
    });
  },
  save: function save(template) {
    var data = {
      template: template
    };
    return ApiWrapper.call(vlp_admin.endpoints.template, 'POST', data);
  },
  delete: function _delete(slug) {
    var data = {
      slug: slug
    };
    return ApiWrapper.call(vlp_admin.endpoints.template, 'DELETE', data);
  }
});
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/shared/Api/Old.js
var ajaxUrl = undefined === window.vlp_admin ? vlp_blocks.ajax_url : vlp_admin.ajax_url;
var ajaxNonce = undefined === window.vlp_admin ? vlp_blocks.nonce : vlp_admin.nonce;

// TODO Use REST API.
/* harmony default export */ const Old = ({
  searchPosts: function searchPosts(input) {
    return fetch(ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: 'action=vlp_search_posts&security=' + ajaxNonce + '&search=' + encodeURIComponent(input),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    }).then(function (response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    });
  },
  getTemplate: function getTemplate(encoded) {
    return fetch(ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: 'action=vlp_get_template&security=' + ajaxNonce + '&encoded=' + encodeURIComponent(encoded),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    }).then(function (response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    });
  },
  getContent: function getContent(type, value) {
    if ('internal' === type) {
      return this.getContentFromPost(value);
    } else {
      return this.getContentFromUrl(value);
    }
  },
  getContentFromPost: function getContentFromPost(postId) {
    return fetch(ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: 'action=vlp_get_post_content&security=' + ajaxNonce + '&id=' + encodeURIComponent(postId),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    }).then(function (response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    });
  },
  getContentFromUrl: function getContentFromUrl(url) {
    var content = {};

    // Check if valid URL.
    try {
      var testIfValidURL = new URL(url);
    } catch (e) {
      return Promise.resolve({
        success: false,
        data: content
      });
    }
    var endpoint = 'https://api.microlink.io';
    var headers = {};
    if ('' !== vlp_admin.microlink_api_key) {
      endpoint = 'https://pro.microlink.io';
      headers['x-api-key'] = vlp_admin.microlink_api_key;
    }

    // Valid URL, use OpenGraph API.
    return fetch(endpoint + '?url=' + encodeURIComponent(url), {
      headers: headers
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      if ('success' === json.status) {
        if (json.data.title) {
          content.title = json.data.title;
        }
        if (json.data.description) {
          content.summary = json.data.description;
        }
        if (json.data.image && json.data.image.url) {
          content.image_id = -1;
          content.image_url = json.data.image.url;
        }
      }
      return {
        success: 'success' === json.status,
        data: content
      };
    }).catch(function (error) {
      console.log('Fetch Error', error);
      return {
        success: false,
        data: {}
      };
    });
  },
  saveImage: function saveImage(url) {
    return fetch(ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      body: 'action=vlp_save_image&security=' + ajaxNonce + '&url=' + encodeURIComponent(url),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    }).then(function (response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    });
  }
});
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/shared/Api/index.js


var api = {
  template: Template,
  old: Old
};
/* harmony default export */ const Api = (api);
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/ImageSelect.js
function ImageSelect_typeof(obj) { "@babel/helpers - typeof"; return ImageSelect_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, ImageSelect_typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, ImageSelect_toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function ImageSelect_toPropertyKey(arg) { var key = ImageSelect_toPrimitive(arg, "string"); return ImageSelect_typeof(key) === "symbol" ? key : String(key); }
function ImageSelect_toPrimitive(input, hint) { if (ImageSelect_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (ImageSelect_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (ImageSelect_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var __ = wp.i18n.__;
var Button = wp.components.Button;
var Component = wp.element.Component;

// Backwards compatibility.
var MediaUpload;
if (wp.hasOwnProperty('blockEditor')) {
  MediaUpload = wp.blockEditor.MediaUpload;
} else {
  MediaUpload = wp.editor.MediaUpload;
}

var ImageSelect = /*#__PURE__*/function (_Component) {
  _inherits(ImageSelect, _Component);
  var _super = _createSuper(ImageSelect);
  function ImageSelect() {
    var _this;
    _classCallCheck(this, ImageSelect);
    _this = _super.apply(this, arguments);
    _this.state = {
      savingImage: false
    };
    return _this;
  }
  _createClass(ImageSelect, [{
    key: "onSaveImage",
    value: function onSaveImage() {
      var _this2 = this;
      this.setState({
        savingImage: true
      }, function () {
        Api.old.saveImage(_this2.props.attributes.image_url).then(function (_ref) {
          var success = _ref.success,
            data = _ref.data;
          _this2.setState({
            savingImage: false
          }, function () {
            if (success) {
              _this2.props.setAttributes({
                image_id: data.image_id,
                image_url: data.image_url
              });
            }
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        attributes = _this$props.attributes,
        setAttributes = _this$props.setAttributes;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 15
        }
      }, /*#__PURE__*/React.createElement(MediaUpload, {
        onSelect: function onSelect(media) {
          setAttributes({
            image_id: media.id,
            image_url: media.url
          });
        },
        type: "image",
        value: attributes.image_id,
        render: function render(_ref2) {
          var open = _ref2.open;
          return /*#__PURE__*/React.createElement(Button, {
            variant: "secondary",
            onClick: open
          }, attributes.image_id ? __('Change Image') : __('Choose Image'));
        }
      }), " ", attributes.image_id ? /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        onClick: function onClick() {
          setAttributes({
            image_id: 0,
            image_url: ''
          });
        }
      }, __('Remove Image')) : null, " ", -1 === attributes.image_id && attributes.image_url && /*#__PURE__*/React.createElement(Button, {
        isLink: true,
        disabled: this.state.savingImage,
        onClick: this.onSaveImage.bind(this)
      }, __('Save image locally')));
    }
  }]);
  return ImageSelect;
}(Component);

;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/Sidebar.js
function Sidebar_typeof(obj) { "@babel/helpers - typeof"; return Sidebar_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, Sidebar_typeof(obj); }
function Sidebar_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Sidebar_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, Sidebar_toPropertyKey(descriptor.key), descriptor); } }
function Sidebar_createClass(Constructor, protoProps, staticProps) { if (protoProps) Sidebar_defineProperties(Constructor.prototype, protoProps); if (staticProps) Sidebar_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function Sidebar_toPropertyKey(arg) { var key = Sidebar_toPrimitive(arg, "string"); return Sidebar_typeof(key) === "symbol" ? key : String(key); }
function Sidebar_toPrimitive(input, hint) { if (Sidebar_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (Sidebar_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function Sidebar_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) Sidebar_setPrototypeOf(subClass, superClass); }
function Sidebar_setPrototypeOf(o, p) { Sidebar_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return Sidebar_setPrototypeOf(o, p); }
function Sidebar_createSuper(Derived) { var hasNativeReflectConstruct = Sidebar_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Sidebar_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Sidebar_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Sidebar_possibleConstructorReturn(this, result); }; }
function Sidebar_possibleConstructorReturn(self, call) { if (call && (Sidebar_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return Sidebar_assertThisInitialized(self); }
function Sidebar_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function Sidebar_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function Sidebar_getPrototypeOf(o) { Sidebar_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return Sidebar_getPrototypeOf(o); }
var Sidebar_ = wp.i18n.__;
var _wp$components = wp.components,
  Sidebar_Button = _wp$components.Button,
  PanelBody = _wp$components.PanelBody,
  SelectControl = _wp$components.SelectControl,
  ToggleControl = _wp$components.ToggleControl;
var Sidebar_Component = wp.element.Component;

// Backwards compatibility.
var InspectorControls;
var PlainText;
if (wp.hasOwnProperty('blockEditor')) {
  InspectorControls = wp.blockEditor.InspectorControls;
  PlainText = wp.blockEditor.PlainText;
} else {
  InspectorControls = wp.editor.InspectorControls;
  PlainText = wp.editor.PlainText;
}

var Sidebar_default = /*#__PURE__*/function (_Component) {
  Sidebar_inherits(_default, _Component);
  var _super = Sidebar_createSuper(_default);
  function _default() {
    Sidebar_classCallCheck(this, _default);
    return _super.apply(this, arguments);
  }
  Sidebar_createClass(_default, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        attributes = _this$props.attributes,
        setAttributes = _this$props.setAttributes;
      var changeLinkButton = /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 15
        }
      }, /*#__PURE__*/React.createElement(Sidebar_Button, {
        variant: "secondary",
        onClick: function onClick() {
          setAttributes({
            type: false,
            post: 0
          });
        }
      }, "Change Link"));
      var templateOptions = [{
        value: 'use_default_from_settings',
        label: Sidebar_('Use Default from Settings')
      }];
      for (var template in vlp_blocks.templates) {
        templateOptions.push({
          value: template,
          label: vlp_blocks.templates[template].name
        });
      }
      return /*#__PURE__*/React.createElement(InspectorControls, null, 'internal' === attributes.type ? /*#__PURE__*/React.createElement(PanelBody, {
        title: Sidebar_('Internal Link')
      }, /*#__PURE__*/React.createElement("a", {
        href: "".concat(vlp_blocks.edit_link).concat(attributes.post),
        target: "_blank"
      }, " ", attributes.post_label || Sidebar_('Edit Post')), changeLinkButton) : /*#__PURE__*/React.createElement(PanelBody, {
        title: Sidebar_('External Link')
      }, /*#__PURE__*/React.createElement("a", {
        href: attributes.url,
        target: "_blank"
      }, " ", attributes.url), changeLinkButton), /*#__PURE__*/React.createElement(PanelBody, {
        title: Sidebar_('Content')
      }, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(PlainText, {
        placeholder: Sidebar_('Title', 'dynamic-widget-content'),
        value: attributes.title,
        onChange: function onChange(value) {
          return setAttributes({
            title: value
          });
        }
      })), /*#__PURE__*/React.createElement(PlainText, {
        placeholder: Sidebar_('Summary', 'dynamic-widget-content'),
        value: attributes.summary,
        onChange: function onChange(value) {
          return setAttributes({
            summary: value
          });
        }
      }), /*#__PURE__*/React.createElement(ImageSelect, this.props)), /*#__PURE__*/React.createElement(PanelBody, {
        title: Sidebar_('Options')
      }, /*#__PURE__*/React.createElement(ToggleControl, {
        label: Sidebar_('Open link in new tab'),
        checked: attributes.new_tab,
        onChange: function onChange() {
          return setAttributes({
            new_tab: !attributes.new_tab
          });
        }
      }), /*#__PURE__*/React.createElement(ToggleControl, {
        label: Sidebar_('Nofollow Link'),
        help: attributes.nofollow ? Sidebar_('The rel="nofollow" attribute will get added to the link.') : Sidebar_('The rel="nofollow" attribute will not get added to the link.'),
        checked: attributes.nofollow,
        onChange: function onChange() {
          return setAttributes({
            nofollow: !attributes.nofollow
          });
        }
      })), /*#__PURE__*/React.createElement(PanelBody, {
        title: Sidebar_('Style')
      }, /*#__PURE__*/React.createElement(SelectControl, {
        label: Sidebar_('Template'),
        value: attributes.template,
        options: templateOptions,
        onChange: function onChange(value) {
          setAttributes({
            template: value
          });
        }
      }), /*#__PURE__*/React.createElement("a", {
        href: vlp_blocks.settings_link,
        target: "_blank"
      }, Sidebar_('Change template styling'))));
    }
  }]);
  return _default;
}(Sidebar_Component);

// EXTERNAL MODULE: ./node_modules/querystringify/index.js
var querystringify = __webpack_require__(7129);
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/PostSelect/Post.js
var Post_ = wp.i18n.__;
var Post_Button = wp.components.Button;
function Post(props) {
  var post = props.post;
  return /*#__PURE__*/React.createElement("tr", {
    className: "vlp-post-select-row"
  }, /*#__PURE__*/React.createElement("td", null, post.post_type), /*#__PURE__*/React.createElement("td", null, post.date_display), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: post.permalink,
    target: "_blank"
  }, post.title)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Post_Button, {
    className: "vlp-post-select-use",
    variant: "primary",
    onClick: function onClick() {
      props.selectPost(post);
    }
  }, Post_('Use this post'))));
}
;
/* harmony default export */ const PostSelect_Post = (Post);
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/PostSelect/Modal.js
function Modal_typeof(obj) { "@babel/helpers - typeof"; return Modal_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, Modal_typeof(obj); }
function Modal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Modal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, Modal_toPropertyKey(descriptor.key), descriptor); } }
function Modal_createClass(Constructor, protoProps, staticProps) { if (protoProps) Modal_defineProperties(Constructor.prototype, protoProps); if (staticProps) Modal_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function Modal_toPropertyKey(arg) { var key = Modal_toPrimitive(arg, "string"); return Modal_typeof(key) === "symbol" ? key : String(key); }
function Modal_toPrimitive(input, hint) { if (Modal_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (Modal_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function Modal_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) Modal_setPrototypeOf(subClass, superClass); }
function Modal_setPrototypeOf(o, p) { Modal_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return Modal_setPrototypeOf(o, p); }
function Modal_createSuper(Derived) { var hasNativeReflectConstruct = Modal_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = Modal_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = Modal_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return Modal_possibleConstructorReturn(this, result); }; }
function Modal_possibleConstructorReturn(self, call) { if (call && (Modal_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return Modal_assertThisInitialized(self); }
function Modal_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function Modal_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function Modal_getPrototypeOf(o) { Modal_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return Modal_getPrototypeOf(o); }

var Modal_ = wp.i18n.__;
var _wp = wp,
  apiFetch = _wp.apiFetch;
var Modal_Component = wp.element.Component;
var Modal = wp.components.Modal;

var PostSelectModal = /*#__PURE__*/function (_Component) {
  Modal_inherits(PostSelectModal, _Component);
  var _super = Modal_createSuper(PostSelectModal);
  function PostSelectModal() {
    var _this;
    Modal_classCallCheck(this, PostSelectModal);
    _this = _super.apply(this, arguments);
    _this.state = {
      postType: '',
      search: '',
      posts: [],
      updatingPosts: false,
      needToUpdatePosts: false
    };
    return _this;
  }
  Modal_createClass(PostSelectModal, [{
    key: "onChangePostType",
    value: function onChangePostType(event) {
      var postType = event.target.value;
      if (postType !== this.state.postType) {
        this.setState({
          postType: postType,
          needToUpdatePosts: this.state.search.length >= 2 // Only update if there is text.
        });
      }
    }
  }, {
    key: "onChangeSearch",
    value: function onChangeSearch(event) {
      var search = event.target.value;
      if (search !== this.state.search) {
        this.setState({
          search: search,
          needToUpdatePosts: true
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.needToUpdatePosts) {
        this.updatePosts();
      }
    }
  }, {
    key: "updatePosts",
    value: function updatePosts() {
      var _this2 = this;
      if (!this.state.updatingPosts) {
        if (this.state.search.length < 2) {
          this.setState({
            updatingPosts: false,
            needToUpdatePosts: false,
            posts: []
          });
        } else {
          this.setState({
            updatingPosts: true,
            needToUpdatePosts: false
          });
          var request = apiFetch({
            path: "/visual-link-preview/v1/search?".concat((0,querystringify/* stringify */.P)({
              post_type: this.state.postType,
              keyword: this.state.search
            }))
          });
          request.then(function (posts) {
            _this2.setState({
              posts: posts,
              updatingPosts: false
            });
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      return /*#__PURE__*/React.createElement(Modal, {
        title: Modal_('Search for post...'),
        onRequestClose: this.props.onClose,
        focusOnMount: false,
        className: "vlp-post-select-modal"
      }, /*#__PURE__*/React.createElement("div", {
        className: "vlp-post-select"
      }, /*#__PURE__*/React.createElement("div", {
        className: "vlp-post-select-input"
      }, /*#__PURE__*/React.createElement("select", {
        value: this.state.postType,
        onChange: this.onChangePostType.bind(this)
      }, /*#__PURE__*/React.createElement("option", {
        value: ""
      }, Modal_('All Post Types', 'custom-related-posts')), Object.keys(vlp_admin.post_types).map(function (postType, index) {
        return /*#__PURE__*/React.createElement("option", {
          value: postType,
          key: index
        }, vlp_admin.post_types[postType]);
      })), /*#__PURE__*/React.createElement("input", {
        autoFocus: true,
        type: "text",
        placeholder: Modal_('Start typing to search...'),
        className: "vlp-post-select-search",
        value: this.state.search,
        onChange: this.onChangeSearch.bind(this)
      })), /*#__PURE__*/React.createElement("table", {
        className: "vlp-post-select-posts"
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, Modal_('Post Type')), /*#__PURE__*/React.createElement("th", null, Modal_('Date')), /*#__PURE__*/React.createElement("th", null, Modal_('Title')), /*#__PURE__*/React.createElement("th", null, "\xA0"))), 0 === this.state.posts.length ? /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
        colspan: "4"
      }, /*#__PURE__*/React.createElement("em", null, Modal_('No posts found'))))) : /*#__PURE__*/React.createElement("tbody", null, this.state.posts.map(function (post, index) {
        return /*#__PURE__*/React.createElement(PostSelect_Post, {
          post: post,
          selectPost: _this3.props.selectPost,
          key: index
        });
      })))));
    }
  }]);
  return PostSelectModal;
}(Modal_Component);
/* harmony default export */ const PostSelect_Modal = (PostSelectModal);
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/PostSelect/index.js
function PostSelect_typeof(obj) { "@babel/helpers - typeof"; return PostSelect_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, PostSelect_typeof(obj); }
function PostSelect_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function PostSelect_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, PostSelect_toPropertyKey(descriptor.key), descriptor); } }
function PostSelect_createClass(Constructor, protoProps, staticProps) { if (protoProps) PostSelect_defineProperties(Constructor.prototype, protoProps); if (staticProps) PostSelect_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function PostSelect_toPropertyKey(arg) { var key = PostSelect_toPrimitive(arg, "string"); return PostSelect_typeof(key) === "symbol" ? key : String(key); }
function PostSelect_toPrimitive(input, hint) { if (PostSelect_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (PostSelect_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function PostSelect_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) PostSelect_setPrototypeOf(subClass, superClass); }
function PostSelect_setPrototypeOf(o, p) { PostSelect_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return PostSelect_setPrototypeOf(o, p); }
function PostSelect_createSuper(Derived) { var hasNativeReflectConstruct = PostSelect_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = PostSelect_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = PostSelect_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return PostSelect_possibleConstructorReturn(this, result); }; }
function PostSelect_possibleConstructorReturn(self, call) { if (call && (PostSelect_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return PostSelect_assertThisInitialized(self); }
function PostSelect_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function PostSelect_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function PostSelect_getPrototypeOf(o) { PostSelect_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return PostSelect_getPrototypeOf(o); }
var PostSelect_ = wp.i18n.__;
var _wp$element = wp.element,
  PostSelect_Component = _wp$element.Component,
  Fragment = _wp$element.Fragment;
var PostSelect_Button = wp.components.Button;


var PostSelect = /*#__PURE__*/function (_Component) {
  PostSelect_inherits(PostSelect, _Component);
  var _super = PostSelect_createSuper(PostSelect);
  function PostSelect() {
    var _this;
    PostSelect_classCallCheck(this, PostSelect);
    _this = _super.apply(this, arguments);
    _this.state = {
      isModalOpen: false
    };
    _this.openModal = _this.openModal.bind(PostSelect_assertThisInitialized(_this));
    _this.closeModal = _this.closeModal.bind(PostSelect_assertThisInitialized(_this));
    return _this;
  }
  PostSelect_createClass(PostSelect, [{
    key: "openModal",
    value: function openModal() {
      if (!this.state.isModalOpen) {
        this.setState({
          isModalOpen: true
        });
      }
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      if (this.state.isModalOpen) {
        this.setState({
          isModalOpen: false
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(PostSelect_Button, {
        variant: "primary",
        onClick: this.openModal
      }, PostSelect_('Search for post...')), this.state.isModalOpen && /*#__PURE__*/React.createElement(PostSelect_Modal, {
        onClose: this.closeModal,
        selectPost: function selectPost(post) {
          _this2.closeModal();
          _this2.props.onChangeField({
            id: post.id,
            text: post.label
          });
        }
      }));
    }
  }]);
  return PostSelect;
}(PostSelect_Component);

;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/ChooseType.js
function ChooseType_typeof(obj) { "@babel/helpers - typeof"; return ChooseType_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, ChooseType_typeof(obj); }
function ChooseType_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ChooseType_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, ChooseType_toPropertyKey(descriptor.key), descriptor); } }
function ChooseType_createClass(Constructor, protoProps, staticProps) { if (protoProps) ChooseType_defineProperties(Constructor.prototype, protoProps); if (staticProps) ChooseType_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function ChooseType_toPropertyKey(arg) { var key = ChooseType_toPrimitive(arg, "string"); return ChooseType_typeof(key) === "symbol" ? key : String(key); }
function ChooseType_toPrimitive(input, hint) { if (ChooseType_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (ChooseType_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function ChooseType_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) ChooseType_setPrototypeOf(subClass, superClass); }
function ChooseType_setPrototypeOf(o, p) { ChooseType_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ChooseType_setPrototypeOf(o, p); }
function ChooseType_createSuper(Derived) { var hasNativeReflectConstruct = ChooseType_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = ChooseType_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = ChooseType_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return ChooseType_possibleConstructorReturn(this, result); }; }
function ChooseType_possibleConstructorReturn(self, call) { if (call && (ChooseType_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return ChooseType_assertThisInitialized(self); }
function ChooseType_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function ChooseType_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function ChooseType_getPrototypeOf(o) { ChooseType_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ChooseType_getPrototypeOf(o); }
var ChooseType_ = wp.i18n.__;
var ChooseType_Button = wp.components.Button;
var ChooseType_Component = wp.element.Component;

var ChooseType = /*#__PURE__*/function (_Component) {
  ChooseType_inherits(ChooseType, _Component);
  var _super = ChooseType_createSuper(ChooseType);
  function ChooseType() {
    ChooseType_classCallCheck(this, ChooseType);
    return _super.apply(this, arguments);
  }
  ChooseType_createClass(ChooseType, [{
    key: "getPage",
    value: function getPage(type) {
      this.props.setAttributes({
        type: type,
        nofollow: 'external' === type ? true : false,
        new_tab: 'external' === type ? true : false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props = this.props,
        attributes = _this$props.attributes,
        setAttributes = _this$props.setAttributes;
      return /*#__PURE__*/React.createElement("div", {
        className: "vlp-block-choosetype"
      }, /*#__PURE__*/React.createElement("div", {
        className: "vlp-block-choosetype-container"
      }, /*#__PURE__*/React.createElement("label", null, ChooseType_('Select a post on your website:')), /*#__PURE__*/React.createElement(PostSelect, {
        value: {
          id: attributes.post,
          text: attributes.post_label
        },
        onChangeField: function onChangeField(option) {
          setAttributes({
            post: option.id,
            post_label: option.text
          }, _this.getPage('internal'));
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "vlp-block-choosetype-container"
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "vlp-field-url"
      }, ChooseType_('Or add a link to an external URL:')), /*#__PURE__*/React.createElement("input", {
        id: "vlp-field-url",
        type: "text",
        value: attributes.url,
        onChange: function onChange(e) {
          return setAttributes({
            url: e.target.value
          });
        },
        onKeyPress: function onKeyPress(e) {
          if ('Enter' === e.key) {
            _this.getPage('external');
          }
        }
      }), /*#__PURE__*/React.createElement(ChooseType_Button, {
        variant: "primary",
        disabled: 0 === attributes.url.length,
        onClick: function onClick() {
          return _this.getPage('external');
        }
      }, ChooseType_('Use this URL'))));
    }
  }]);
  return ChooseType;
}(ChooseType_Component);

;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/edit/index.js
function edit_typeof(obj) { "@babel/helpers - typeof"; return edit_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, edit_typeof(obj); }
function edit_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function edit_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? edit_ownKeys(Object(source), !0).forEach(function (key) { edit_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : edit_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function edit_defineProperty(obj, key, value) { key = edit_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function edit_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function edit_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, edit_toPropertyKey(descriptor.key), descriptor); } }
function edit_createClass(Constructor, protoProps, staticProps) { if (protoProps) edit_defineProperties(Constructor.prototype, protoProps); if (staticProps) edit_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function edit_toPropertyKey(arg) { var key = edit_toPrimitive(arg, "string"); return edit_typeof(key) === "symbol" ? key : String(key); }
function edit_toPrimitive(input, hint) { if (edit_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (edit_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function edit_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) edit_setPrototypeOf(subClass, superClass); }
function edit_setPrototypeOf(o, p) { edit_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return edit_setPrototypeOf(o, p); }
function edit_createSuper(Derived) { var hasNativeReflectConstruct = edit_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = edit_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = edit_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return edit_possibleConstructorReturn(this, result); }; }
function edit_possibleConstructorReturn(self, call) { if (call && (edit_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return edit_assertThisInitialized(self); }
function edit_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function edit_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function edit_getPrototypeOf(o) { edit_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return edit_getPrototypeOf(o); }
var edit_ = wp.i18n.__;
var edit_wp$components = wp.components,
  Disabled = edit_wp$components.Disabled,
  Placeholder = edit_wp$components.Placeholder,
  Spinner = edit_wp$components.Spinner;
var edit_wp$element = wp.element,
  edit_Fragment = edit_wp$element.Fragment,
  edit_Component = edit_wp$element.Component;
var ServerSideRender = wp.serverSideRender;




var _default = /*#__PURE__*/function (_Component) {
  edit_inherits(_default, _Component);
  var _super = edit_createSuper(_default);
  function _default() {
    var _this;
    edit_classCallCheck(this, _default);
    _this = _super.apply(this, arguments);
    _this.initialiazing = true;
    _this.initialType = false;
    _this.state = {
      gettingContent: false
    };
    return _this;
  }
  edit_createClass(_default, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var encoded = this.props.attributes.hasOwnProperty('encoded') ? this.props.attributes.encoded : false;
      if (encoded) {
        var decoded = decodeLink(encoded);
        this.initialType = decoded.type;
        this.props.setAttributes(edit_objectSpread(edit_objectSpread({}, this.props.attributes), decoded));
      }
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps) {
      var link = Object.assign({}, nextProps.attributes);
      delete link.encoded;

      // Add class to link object.
      link.custom_class = nextProps.className;
      var encoded = encodeLink(link);
      if (nextProps.attributes.encoded !== encoded) {
        this.props.setAttributes({
          encoded: encoded
        });
      }
      var compareValue = this.props.attributes.type;
      if (this.initialiazing) {
        compareValue = this.initialType;
        this.initialiazing = false;
      }
      if (false === compareValue && compareValue !== nextProps.attributes.type) {
        this.getContent(nextProps.attributes);
      }
    }
  }, {
    key: "getContent",
    value: function getContent(attributes) {
      var _this2 = this;
      this.setState({
        gettingContent: true
      }, function () {
        var value = 'internal' === attributes.type ? attributes.post : attributes.url;
        Api.old.getContent(attributes.type, value).then(function (_ref) {
          var data = _ref.data;
          _this2.props.setAttributes(edit_objectSpread({}, data));

          // Prevent issue with block using old data.
          setTimeout(function () {
            _this2.setState({
              gettingContent: false
            });
          }, 1000);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var className = this.props.className;

      // Try to fix problem introduced in 1.3.1.
      var attributes = this.props.attributes;
      var summary = attributes.summary;
      if (summary && '&lt;p&gt;' === summary.substr(0, 9)) {
        summary = summary.replace(/&lt;/gm, '<');
        summary = summary.replace(/&gt;/gm, '>');
        attributes.summary = summary;
      }

      // Default values for nofollow and new_tab.
      if (!attributes.hasOwnProperty('nofollow')) {
        attributes.nofollow = 'external' === attributes.type ? true : false;
      }
      if (!attributes.hasOwnProperty('new_tab')) {
        attributes.new_tab = 'external' === attributes.type ? true : false;
      }
      return /*#__PURE__*/React.createElement(edit_Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: className
      }, !attributes.type ? /*#__PURE__*/React.createElement(ChooseType, this.props) : /*#__PURE__*/React.createElement(edit_Fragment, null, this.state.gettingContent ? /*#__PURE__*/React.createElement(Placeholder, null, /*#__PURE__*/React.createElement(Spinner, null)) : /*#__PURE__*/React.createElement(edit_Fragment, null, /*#__PURE__*/React.createElement(Sidebar_default, this.props), attributes.image_id || attributes.title || attributes.summary ? /*#__PURE__*/React.createElement(Disabled, null, /*#__PURE__*/React.createElement(ServerSideRender, {
        block: "visual-link-preview/link",
        attributes: attributes
      })) : /*#__PURE__*/React.createElement(Placeholder, null, edit_('Set content for this link in the sidebar.'))))));
    }
  }]);
  return _default;
}(edit_Component);

;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks/visual-link-preview/index.js




var visual_link_preview_ = wp.i18n.__;
var registerBlockType = wp.blocks.registerBlockType;

// Backwards compatibility.
var RichText;
if (wp.hasOwnProperty('blockEditor')) {
  RichText = wp.blockEditor.RichText;
} else {
  RichText = wp.editor.RichText;
}
registerBlockType('visual-link-preview/link', {
  title: visual_link_preview_('Visual Link Preview'),
  description: visual_link_preview_('A visual link block for internal or external links.'),
  icon: 'id',
  keywords: ['vlp'],
  category: 'widgets',
  supportHTML: false,
  attributes: {
    title: {
      type: 'string',
      source: 'html',
      selector: 'h3'
    },
    summary: {
      type: 'string',
      source: 'html',
      selector: '.summary'
    },
    image_id: {
      type: 'number'
    },
    image_url: {
      type: 'string',
      source: 'attribute',
      selector: 'img',
      attribute: 'src'
    },
    type: {
      type: 'string',
      default: false
    },
    post: {
      type: 'number',
      default: 0
    },
    post_label: {
      type: 'string',
      default: ''
    },
    url: {
      type: 'string',
      default: ''
    },
    template: {
      type: 'string',
      default: 'use_default_from_settings'
    },
    nofollow: {
      type: 'boolean'
    },
    new_tab: {
      type: 'boolean'
    },
    encoded: {
      type: 'string'
    }
  },
  transforms: {
    from: [{
      type: 'shortcode',
      tag: 'visual-link-preview',
      attributes: {
        title: {
          type: 'string',
          shortcode: function shortcode(_ref) {
            var _ref$named$encoded = _ref.named.encoded,
              encoded = _ref$named$encoded === void 0 ? '' : _ref$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.title;
          }
        },
        summary: {
          type: 'string',
          shortcode: function shortcode(_ref2) {
            var _ref2$named$encoded = _ref2.named.encoded,
              encoded = _ref2$named$encoded === void 0 ? '' : _ref2$named$encoded;
            var decoded = decodeLink(encoded);
            var summary = decoded.summary;

            // Replace line breaks with <br>.
            summary = summary.replace(new RegExp('\r?\n', 'g'), '<br />');

            // Surround summary with paragraph tags or it won't work in the RichText component.
            return '<p>' + summary + '</p>';
          }
        },
        image_id: {
          type: 'number',
          shortcode: function shortcode(_ref3) {
            var _ref3$named$encoded = _ref3.named.encoded,
              encoded = _ref3$named$encoded === void 0 ? '' : _ref3$named$encoded;
            var decoded = decodeLink(encoded);
            var image_id = parseInt(decoded.image_id);
            return image_id ? image_id : null;
          }
        },
        image_url: {
          type: 'string',
          shortcode: function shortcode(_ref4) {
            var _ref4$named$encoded = _ref4.named.encoded,
              encoded = _ref4$named$encoded === void 0 ? '' : _ref4$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.image_url;
          }
        },
        type: {
          type: 'string',
          shortcode: function shortcode(_ref5) {
            var _ref5$named$encoded = _ref5.named.encoded,
              encoded = _ref5$named$encoded === void 0 ? '' : _ref5$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.type;
          }
        },
        post: {
          type: 'number',
          shortcode: function shortcode(_ref6) {
            var _ref6$named$encoded = _ref6.named.encoded,
              encoded = _ref6$named$encoded === void 0 ? '' : _ref6$named$encoded;
            var decoded = decodeLink(encoded);
            return parseInt(decoded.post);
          }
        },
        post_label: {
          type: 'string',
          shortcode: function shortcode(_ref7) {
            var _ref7$named$encoded = _ref7.named.encoded,
              encoded = _ref7$named$encoded === void 0 ? '' : _ref7$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.post_label;
          }
        },
        url: {
          type: 'string',
          shortcode: function shortcode(_ref8) {
            var _ref8$named$encoded = _ref8.named.encoded,
              encoded = _ref8$named$encoded === void 0 ? '' : _ref8$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.url;
          }
        },
        template: {
          type: 'string',
          shortcode: function shortcode(_ref9) {
            var _ref9$named$encoded = _ref9.named.encoded,
              encoded = _ref9$named$encoded === void 0 ? '' : _ref9$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.template;
          }
        },
        nofollow: {
          type: 'boolean',
          shortcode: function shortcode(_ref10) {
            var _ref10$named$encoded = _ref10.named.encoded,
              encoded = _ref10$named$encoded === void 0 ? '' : _ref10$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.nofollow;
          }
        },
        new_tab: {
          type: 'boolean',
          shortcode: function shortcode(_ref11) {
            var _ref11$named$encoded = _ref11.named.encoded,
              encoded = _ref11$named$encoded === void 0 ? '' : _ref11$named$encoded;
            var decoded = decodeLink(encoded);
            return decoded.new_tab;
          }
        },
        encoded: {
          type: 'string',
          shortcode: function shortcode(_ref12) {
            var _ref12$named$encoded = _ref12.named.encoded,
              encoded = _ref12$named$encoded === void 0 ? '' : _ref12$named$encoded;
            return encoded;
          }
        }
      }
    }, {
      type: 'block',
      blocks: ['core/shortcode', 'core/paragraph'],
      isMatch: function isMatch(props) {
        var text = props.hasOwnProperty('text') ? props.text : props.content;
        var re = wp.shortcode.regexp('[visual-link-preview ');
        return re.test(text);
      },
      transform: function transform(props) {
        var text = props.hasOwnProperty('text') ? props.text : props.content;
        return wp.blocks.rawHandler({
          HTML: '<p>' + text + '</p>',
          mode: 'BLOCKS'
        });
      }
    }]
  },
  edit: _default,
  save: function save(_ref13) {
    var className = _ref13.className,
      attributes = _ref13.attributes;
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, attributes.image_url && /*#__PURE__*/React.createElement("img", {
      className: "vlp-image",
      src: attributes.image_url
    }), /*#__PURE__*/React.createElement(RichText.Content, {
      tagName: "h3",
      value: attributes.title
    }), /*#__PURE__*/React.createElement(RichText.Content, {
      tagName: "div",
      className: "summary",
      value: attributes.summary
    }));
  },
  deprecated: deprecated
});
;// CONCATENATED MODULE: ./visual-link-preview/assets/js/blocks.js

})();

(VisualLinkPreview = typeof VisualLinkPreview === "undefined" ? {} : VisualLinkPreview).blocks = __webpack_exports__;
/******/ })()
;