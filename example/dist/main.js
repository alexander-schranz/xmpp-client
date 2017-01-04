(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }g.XmppClient = f();
    }
})(function () {
    var define, module, exports;return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    }({ 1: [function (require, module, exports) {
            /** File: strophe.js
             *  A JavaScript library for writing XMPP clients.
             *
             *  This library uses either Bidirectional-streams Over Synchronous HTTP (BOSH)
             *  to emulate a persistent, stateful, two-way connection to an XMPP server or
             *  alternatively WebSockets.
             *
             *  More information on BOSH can be found in XEP 124.
             *  For more information on XMPP-over WebSocket see this RFC:
             *  http://tools.ietf.org/html/rfc7395
             */

            /* All of the Strophe globals are defined in this special function below so
             * that references to the globals become closures.  This will ensure that
             * on page reload, these references will still be available to callbacks
             * that are still executing.
             */

            /* jshint ignore:start */
            (function (callback) {
                /* jshint ignore:end */

                // This code was written by Tyler Akins and has been placed in the
                // public domain.  It would be nice if you left this header intact.
                // Base64 code from Tyler Akins -- http://rumkin.com

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-base64', function () {
                            return factory();
                        });
                    } else {
                        // Browser globals
                        root.Base64 = factory();
                    }
                })(this, function () {
                    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

                    var obj = {
                        /**
                         * Encodes a string in base64
                         * @param {String} input The string to encode in base64.
                         */
                        encode: function encode(input) {
                            var output = "";
                            var chr1, chr2, chr3;
                            var enc1, enc2, enc3, enc4;
                            var i = 0;

                            do {
                                chr1 = input.charCodeAt(i++);
                                chr2 = input.charCodeAt(i++);
                                chr3 = input.charCodeAt(i++);

                                enc1 = chr1 >> 2;
                                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                                enc4 = chr3 & 63;

                                if (isNaN(chr2)) {
                                    enc2 = (chr1 & 3) << 4;
                                    enc3 = enc4 = 64;
                                } else if (isNaN(chr3)) {
                                    enc4 = 64;
                                }

                                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                            } while (i < input.length);

                            return output;
                        },

                        /**
                         * Decodes a base64 string.
                         * @param {String} input The string to decode.
                         */
                        decode: function decode(input) {
                            var output = "";
                            var chr1, chr2, chr3;
                            var enc1, enc2, enc3, enc4;
                            var i = 0;

                            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                            do {
                                enc1 = keyStr.indexOf(input.charAt(i++));
                                enc2 = keyStr.indexOf(input.charAt(i++));
                                enc3 = keyStr.indexOf(input.charAt(i++));
                                enc4 = keyStr.indexOf(input.charAt(i++));

                                chr1 = enc1 << 2 | enc2 >> 4;
                                chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                                chr3 = (enc3 & 3) << 6 | enc4;

                                output = output + String.fromCharCode(chr1);

                                if (enc3 != 64) {
                                    output = output + String.fromCharCode(chr2);
                                }
                                if (enc4 != 64) {
                                    output = output + String.fromCharCode(chr3);
                                }
                            } while (i < input.length);

                            return output;
                        }
                    };
                    return obj;
                });

                /*
                 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
                 * in FIPS PUB 180-1
                 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
                 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
                 * Distributed under the BSD License
                 * See http://pajhome.org.uk/crypt/md5 for details.
                 */

                /* jshint undef: true, unused: true:, noarg: true, latedef: false */
                /* global define */

                /* Some functions and variables have been stripped for use with Strophe */

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-sha1', function () {
                            return factory();
                        });
                    } else {
                        // Browser globals
                        root.SHA1 = factory();
                    }
                })(this, function () {

                    /*
                     * Calculate the SHA-1 of an array of big-endian words, and a bit length
                     */
                    function core_sha1(x, len) {
                        /* append padding */
                        x[len >> 5] |= 0x80 << 24 - len % 32;
                        x[(len + 64 >> 9 << 4) + 15] = len;

                        var w = new Array(80);
                        var a = 1732584193;
                        var b = -271733879;
                        var c = -1732584194;
                        var d = 271733878;
                        var e = -1009589776;

                        var i, j, t, olda, oldb, oldc, oldd, olde;
                        for (i = 0; i < x.length; i += 16) {
                            olda = a;
                            oldb = b;
                            oldc = c;
                            oldd = d;
                            olde = e;

                            for (j = 0; j < 80; j++) {
                                if (j < 16) {
                                    w[j] = x[i + j];
                                } else {
                                    w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                                }
                                t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                                e = d;
                                d = c;
                                c = rol(b, 30);
                                b = a;
                                a = t;
                            }

                            a = safe_add(a, olda);
                            b = safe_add(b, oldb);
                            c = safe_add(c, oldc);
                            d = safe_add(d, oldd);
                            e = safe_add(e, olde);
                        }
                        return [a, b, c, d, e];
                    }

                    /*
                     * Perform the appropriate triplet combination function for the current
                     * iteration
                     */
                    function sha1_ft(t, b, c, d) {
                        if (t < 20) {
                            return b & c | ~b & d;
                        }
                        if (t < 40) {
                            return b ^ c ^ d;
                        }
                        if (t < 60) {
                            return b & c | b & d | c & d;
                        }
                        return b ^ c ^ d;
                    }

                    /*
                     * Determine the appropriate additive constant for the current iteration
                     */
                    function sha1_kt(t) {
                        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
                    }

                    /*
                     * Calculate the HMAC-SHA1 of a key and some data
                     */
                    function core_hmac_sha1(key, data) {
                        var bkey = str2binb(key);
                        if (bkey.length > 16) {
                            bkey = core_sha1(bkey, key.length * 8);
                        }

                        var ipad = new Array(16),
                            opad = new Array(16);
                        for (var i = 0; i < 16; i++) {
                            ipad[i] = bkey[i] ^ 0x36363636;
                            opad[i] = bkey[i] ^ 0x5C5C5C5C;
                        }

                        var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * 8);
                        return core_sha1(opad.concat(hash), 512 + 160);
                    }

                    /*
                     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
                     * to work around bugs in some JS interpreters.
                     */
                    function safe_add(x, y) {
                        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                        return msw << 16 | lsw & 0xFFFF;
                    }

                    /*
                     * Bitwise rotate a 32-bit number to the left.
                     */
                    function rol(num, cnt) {
                        return num << cnt | num >>> 32 - cnt;
                    }

                    /*
                     * Convert an 8-bit or 16-bit string to an array of big-endian words
                     * In 8-bit function, characters >255 have their hi-byte silently ignored.
                     */
                    function str2binb(str) {
                        var bin = [];
                        var mask = 255;
                        for (var i = 0; i < str.length * 8; i += 8) {
                            bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << 24 - i % 32;
                        }
                        return bin;
                    }

                    /*
                     * Convert an array of big-endian words to a string
                     */
                    function binb2str(bin) {
                        var str = "";
                        var mask = 255;
                        for (var i = 0; i < bin.length * 32; i += 8) {
                            str += String.fromCharCode(bin[i >> 5] >>> 24 - i % 32 & mask);
                        }
                        return str;
                    }

                    /*
                     * Convert an array of big-endian words to a base-64 string
                     */
                    function binb2b64(binarray) {
                        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var str = "";
                        var triplet, j;
                        for (var i = 0; i < binarray.length * 4; i += 3) {
                            triplet = (binarray[i >> 2] >> 8 * (3 - i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4) & 0xFF;
                            for (j = 0; j < 4; j++) {
                                if (i * 8 + j * 6 > binarray.length * 32) {
                                    str += "=";
                                } else {
                                    str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
                                }
                            }
                        }
                        return str;
                    }

                    /*
                     * These are the functions you'll usually want to call
                     * They take string arguments and return either hex or base-64 encoded strings
                     */
                    return {
                        b64_hmac_sha1: function b64_hmac_sha1(key, data) {
                            return binb2b64(core_hmac_sha1(key, data));
                        },
                        b64_sha1: function b64_sha1(s) {
                            return binb2b64(core_sha1(str2binb(s), s.length * 8));
                        },
                        binb2str: binb2str,
                        core_hmac_sha1: core_hmac_sha1,
                        str_hmac_sha1: function str_hmac_sha1(key, data) {
                            return binb2str(core_hmac_sha1(key, data));
                        },
                        str_sha1: function str_sha1(s) {
                            return binb2str(core_sha1(str2binb(s), s.length * 8));
                        }
                    };
                });

                /*
                 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
                 * Digest Algorithm, as defined in RFC 1321.
                 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
                 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
                 * Distributed under the BSD License
                 * See http://pajhome.org.uk/crypt/md5 for more info.
                 */

                /*
                 * Everything that isn't used by Strophe has been stripped here!
                 */

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-md5', function () {
                            return factory();
                        });
                    } else {
                        // Browser globals
                        root.MD5 = factory();
                    }
                })(this, function (b) {
                    /*
                     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
                     * to work around bugs in some JS interpreters.
                     */
                    var safe_add = function safe_add(x, y) {
                        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                        return msw << 16 | lsw & 0xFFFF;
                    };

                    /*
                     * Bitwise rotate a 32-bit number to the left.
                     */
                    var bit_rol = function bit_rol(num, cnt) {
                        return num << cnt | num >>> 32 - cnt;
                    };

                    /*
                     * Convert a string to an array of little-endian words
                     */
                    var str2binl = function str2binl(str) {
                        var bin = [];
                        for (var i = 0; i < str.length * 8; i += 8) {
                            bin[i >> 5] |= (str.charCodeAt(i / 8) & 255) << i % 32;
                        }
                        return bin;
                    };

                    /*
                     * Convert an array of little-endian words to a string
                     */
                    var binl2str = function binl2str(bin) {
                        var str = "";
                        for (var i = 0; i < bin.length * 32; i += 8) {
                            str += String.fromCharCode(bin[i >> 5] >>> i % 32 & 255);
                        }
                        return str;
                    };

                    /*
                     * Convert an array of little-endian words to a hex string.
                     */
                    var binl2hex = function binl2hex(binarray) {
                        var hex_tab = "0123456789abcdef";
                        var str = "";
                        for (var i = 0; i < binarray.length * 4; i++) {
                            str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF);
                        }
                        return str;
                    };

                    /*
                     * These functions implement the four basic operations the algorithm uses.
                     */
                    var md5_cmn = function md5_cmn(q, a, b, x, s, t) {
                        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
                    };

                    var md5_ff = function md5_ff(a, b, c, d, x, s, t) {
                        return md5_cmn(b & c | ~b & d, a, b, x, s, t);
                    };

                    var md5_gg = function md5_gg(a, b, c, d, x, s, t) {
                        return md5_cmn(b & d | c & ~d, a, b, x, s, t);
                    };

                    var md5_hh = function md5_hh(a, b, c, d, x, s, t) {
                        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
                    };

                    var md5_ii = function md5_ii(a, b, c, d, x, s, t) {
                        return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
                    };

                    /*
                     * Calculate the MD5 of an array of little-endian words, and a bit length
                     */
                    var core_md5 = function core_md5(x, len) {
                        /* append padding */
                        x[len >> 5] |= 0x80 << len % 32;
                        x[(len + 64 >>> 9 << 4) + 14] = len;

                        var a = 1732584193;
                        var b = -271733879;
                        var c = -1732584194;
                        var d = 271733878;

                        var olda, oldb, oldc, oldd;
                        for (var i = 0; i < x.length; i += 16) {
                            olda = a;
                            oldb = b;
                            oldc = c;
                            oldd = d;

                            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                            a = safe_add(a, olda);
                            b = safe_add(b, oldb);
                            c = safe_add(c, oldc);
                            d = safe_add(d, oldd);
                        }
                        return [a, b, c, d];
                    };

                    var obj = {
                        /*
                         * These are the functions you'll usually want to call.
                         * They take string arguments and return either hex or base-64 encoded
                         * strings.
                         */
                        hexdigest: function hexdigest(s) {
                            return binl2hex(core_md5(str2binl(s), s.length * 8));
                        },

                        hash: function hash(s) {
                            return binl2str(core_md5(str2binl(s), s.length * 8));
                        }
                    };
                    return obj;
                });

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-utils', function () {
                            return factory();
                        });
                    } else {
                        // Browser globals
                        root.stropheUtils = factory();
                    }
                })(this, function () {

                    var utils = {

                        utf16to8: function utf16to8(str) {
                            var i, c;
                            var out = "";
                            var len = str.length;
                            for (i = 0; i < len; i++) {
                                c = str.charCodeAt(i);
                                if (c >= 0x0000 && c <= 0x007F) {
                                    out += str.charAt(i);
                                } else if (c > 0x07FF) {
                                    out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
                                    out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
                                    out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
                                } else {
                                    out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
                                    out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
                                }
                            }
                            return out;
                        },

                        addCookies: function addCookies(cookies) {
                            /* Parameters:
                             *  (Object) cookies - either a map of cookie names
                             *    to string values or to maps of cookie values.
                             *
                             * For example:
                             * { "myCookie": "1234" }
                             *
                             * or:
                             * { "myCookie": {
                             *      "value": "1234",
                             *      "domain": ".example.org",
                             *      "path": "/",
                             *      "expires": expirationDate
                             *      }
                             *  }
                             *
                             *  These values get passed to Strophe.Connection via
                             *   options.cookies
                             */
                            var cookieName, cookieObj, isObj, cookieValue, expires, domain, path;
                            for (cookieName in cookies || {}) {
                                expires = '';
                                domain = '';
                                path = '';
                                cookieObj = cookies[cookieName];
                                isObj = (typeof cookieObj === "undefined" ? "undefined" : _typeof(cookieObj)) == "object";
                                cookieValue = escape(unescape(isObj ? cookieObj.value : cookieObj));
                                if (isObj) {
                                    expires = cookieObj.expires ? ";expires=" + cookieObj.expires : '';
                                    domain = cookieObj.domain ? ";domain=" + cookieObj.domain : '';
                                    path = cookieObj.path ? ";path=" + cookieObj.path : '';
                                }
                                document.cookie = cookieName + '=' + cookieValue + expires + domain + path;
                            }
                        }
                    };
                    return utils;
                });

                /*
                    This program is distributed under the terms of the MIT license.
                    Please see the LICENSE file for details.
                
                    Copyright 2006-2008, OGG, LLC
                */

                /* jshint undef: true, unused: true:, noarg: true, latedef: true */
                /* global define */

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-polyfill', [], function () {
                            return factory();
                        });
                    } else {
                        // Browser globals
                        return factory();
                    }
                })(this, function () {

                    /** Function: Function.prototype.bind
                     *  Bind a function to an instance.
                     *
                     *  This Function object extension method creates a bound method similar
                     *  to those in Python.  This means that the 'this' object will point
                     *  to the instance you want.  See <MDC's bind() documentation at https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind>
                     *  and <Bound Functions and Function Imports in JavaScript at http://benjamin.smedbergs.us/blog/2007-01-03/bound-functions-and-function-imports-in-javascript/>
                     *  for a complete explanation.
                     *
                     *  This extension already exists in some browsers (namely, Firefox 3), but
                     *  we provide it to support those that don't.
                     *
                     *  Parameters:
                     *    (Object) obj - The object that will become 'this' in the bound function.
                     *    (Object) argN - An option argument that will be prepended to the
                     *      arguments given for the function call
                     *
                     *  Returns:
                     *    The bound function.
                     */
                    if (!Function.prototype.bind) {
                        Function.prototype.bind = function (obj /*, arg1, arg2, ... */) {
                            var func = this;
                            var _slice = Array.prototype.slice;
                            var _concat = Array.prototype.concat;
                            var _args = _slice.call(arguments, 1);
                            return function () {
                                return func.apply(obj ? obj : this, _concat.call(_args, _slice.call(arguments, 0)));
                            };
                        };
                    }

                    /** Function: Array.isArray
                     *  This is a polyfill for the ES5 Array.isArray method.
                     */
                    if (!Array.isArray) {
                        Array.isArray = function (arg) {
                            return Object.prototype.toString.call(arg) === '[object Array]';
                        };
                    }

                    /** Function: Array.prototype.indexOf
                     *  Return the index of an object in an array.
                     *
                     *  This function is not supplied by some JavaScript implementations, so
                     *  we provide it if it is missing.  This code is from:
                     *  http://developer.mozilla.org/En/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
                     *
                     *  Parameters:
                     *    (Object) elt - The object to look for.
                     *    (Integer) from - The index from which to start looking. (optional).
                     *
                     *  Returns:
                     *    The index of elt in the array or -1 if not found.
                     */
                    if (!Array.prototype.indexOf) {
                        Array.prototype.indexOf = function (elt /*, from*/) {
                            var len = this.length;
                            var from = Number(arguments[1]) || 0;
                            from = from < 0 ? Math.ceil(from) : Math.floor(from);
                            if (from < 0) {
                                from += len;
                            }

                            for (; from < len; from++) {
                                if (from in this && this[from] === elt) {
                                    return from;
                                }
                            }
                            return -1;
                        };
                    }
                });

                /** Function: Array.prototype.forEach
                 *
                 *  This function is not available in IE < 9
                 *
                 *  See <forEach on developer.mozilla.org at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>
                 */
                if (!Array.prototype.forEach) {
                    Array.prototype.forEach = function (callback, thisArg) {
                        var T, k;
                        if (this === null) {
                            throw new TypeError(' this is null or not defined');
                        }

                        // 1. Let O be the result of calling toObject() passing the
                        // |this| value as the argument.
                        var O = Object(this);
                        // 2. Let lenValue be the result of calling the Get() internal
                        // method of O with the argument "length".
                        // 3. Let len be toUint32(lenValue).
                        var len = O.length >>> 0;
                        // 4. If isCallable(callback) is false, throw a TypeError exception.
                        // See: http://es5.github.com/#x9.11
                        if (typeof callback !== "function") {
                            throw new TypeError(callback + ' is not a function');
                        }
                        // 5. If thisArg was supplied, let T be thisArg; else let
                        // T be undefined.
                        if (arguments.length > 1) {
                            T = thisArg;
                        }
                        // 6. Let k be 0
                        k = 0;
                        // 7. Repeat, while k < len
                        while (k < len) {
                            var kValue;
                            // a. Let Pk be ToString(k).
                            //        This is implicit for LHS operands of the in operator
                            // b. Let kPresent be the result of calling the HasProperty
                            //        internal method of O with argument Pk.
                            //        This step can be combined with c
                            // c. If kPresent is true, then
                            if (k in O) {
                                // i. Let kValue be the result of calling the Get internal
                                // method of O with argument Pk.
                                kValue = O[k];
                                // ii. Call the Call internal method of callback with T as
                                // the this value and argument list containing kValue, k, and O.
                                callback.call(T, kValue, k, O);
                            }
                            // d. Increase k by 1.
                            k++;
                        }
                        // 8. return undefined
                    };
                }

                /*
                    This program is distributed under the terms of the MIT license.
                    Please see the LICENSE file for details.
                
                    Copyright 2006-2008, OGG, LLC
                */

                /* jshint undef: true, unused: true:, noarg: true, latedef: true */
                /*global define, document, window, setTimeout, clearTimeout, ActiveXObject, DOMParser */

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-core', ['strophe-sha1', 'strophe-base64', 'strophe-md5', 'strophe-utils', "strophe-polyfill"], function () {
                            return factory.apply(this, arguments);
                        });
                    } else {
                        // Browser globals
                        var o = factory(root.SHA1, root.Base64, root.MD5, root.stropheUtils);
                        window.Strophe = o.Strophe;
                        window.$build = o.$build;
                        window.$iq = o.$iq;
                        window.$msg = o.$msg;
                        window.$pres = o.$pres;
                        window.SHA1 = o.SHA1;
                        window.Base64 = o.Base64;
                        window.MD5 = o.MD5;
                        window.b64_hmac_sha1 = o.SHA1.b64_hmac_sha1;
                        window.b64_sha1 = o.SHA1.b64_sha1;
                        window.str_hmac_sha1 = o.SHA1.str_hmac_sha1;
                        window.str_sha1 = o.SHA1.str_sha1;
                    }
                })(this, function (SHA1, Base64, MD5, utils) {

                    var Strophe;

                    /** Function: $build
                     *  Create a Strophe.Builder.
                     *  This is an alias for 'new Strophe.Builder(name, attrs)'.
                     *
                     *  Parameters:
                     *    (String) name - The root element name.
                     *    (Object) attrs - The attributes for the root element in object notation.
                     *
                     *  Returns:
                     *    A new Strophe.Builder object.
                     */
                    function $build(name, attrs) {
                        return new Strophe.Builder(name, attrs);
                    }

                    /** Function: $msg
                     *  Create a Strophe.Builder with a <message/> element as the root.
                     *
                     *  Parameters:
                     *    (Object) attrs - The <message/> element attributes in object notation.
                     *
                     *  Returns:
                     *    A new Strophe.Builder object.
                     */
                    function $msg(attrs) {
                        return new Strophe.Builder("message", attrs);
                    }

                    /** Function: $iq
                     *  Create a Strophe.Builder with an <iq/> element as the root.
                     *
                     *  Parameters:
                     *    (Object) attrs - The <iq/> element attributes in object notation.
                     *
                     *  Returns:
                     *    A new Strophe.Builder object.
                     */
                    function $iq(attrs) {
                        return new Strophe.Builder("iq", attrs);
                    }

                    /** Function: $pres
                     *  Create a Strophe.Builder with a <presence/> element as the root.
                     *
                     *  Parameters:
                     *    (Object) attrs - The <presence/> element attributes in object notation.
                     *
                     *  Returns:
                     *    A new Strophe.Builder object.
                     */
                    function $pres(attrs) {
                        return new Strophe.Builder("presence", attrs);
                    }

                    /** Class: Strophe
                     *  An object container for all Strophe library functions.
                     *
                     *  This class is just a container for all the objects and constants
                     *  used in the library.  It is not meant to be instantiated, but to
                     *  provide a namespace for library objects, constants, and functions.
                     */
                    Strophe = {
                        /** Constant: VERSION
                         *  The version of the Strophe library. Unreleased builds will have
                         *  a version of head-HASH where HASH is a partial revision.
                         */
                        VERSION: "1.2.11",

                        /** Constants: XMPP Namespace Constants
                         *  Common namespace constants from the XMPP RFCs and XEPs.
                         *
                         *  NS.HTTPBIND - HTTP BIND namespace from XEP 124.
                         *  NS.BOSH - BOSH namespace from XEP 206.
                         *  NS.CLIENT - Main XMPP client namespace.
                         *  NS.AUTH - Legacy authentication namespace.
                         *  NS.ROSTER - Roster operations namespace.
                         *  NS.PROFILE - Profile namespace.
                         *  NS.DISCO_INFO - Service discovery info namespace from XEP 30.
                         *  NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
                         *  NS.MUC - Multi-User Chat namespace from XEP 45.
                         *  NS.SASL - XMPP SASL namespace from RFC 3920.
                         *  NS.STREAM - XMPP Streams namespace from RFC 3920.
                         *  NS.BIND - XMPP Binding namespace from RFC 3920.
                         *  NS.SESSION - XMPP Session namespace from RFC 3920.
                         *  NS.XHTML_IM - XHTML-IM namespace from XEP 71.
                         *  NS.XHTML - XHTML body namespace from XEP 71.
                         */
                        NS: {
                            HTTPBIND: "http://jabber.org/protocol/httpbind",
                            BOSH: "urn:xmpp:xbosh",
                            CLIENT: "jabber:client",
                            AUTH: "jabber:iq:auth",
                            ROSTER: "jabber:iq:roster",
                            PROFILE: "jabber:iq:profile",
                            DISCO_INFO: "http://jabber.org/protocol/disco#info",
                            DISCO_ITEMS: "http://jabber.org/protocol/disco#items",
                            MUC: "http://jabber.org/protocol/muc",
                            SASL: "urn:ietf:params:xml:ns:xmpp-sasl",
                            STREAM: "http://etherx.jabber.org/streams",
                            FRAMING: "urn:ietf:params:xml:ns:xmpp-framing",
                            BIND: "urn:ietf:params:xml:ns:xmpp-bind",
                            SESSION: "urn:ietf:params:xml:ns:xmpp-session",
                            VERSION: "jabber:iq:version",
                            STANZAS: "urn:ietf:params:xml:ns:xmpp-stanzas",
                            XHTML_IM: "http://jabber.org/protocol/xhtml-im",
                            XHTML: "http://www.w3.org/1999/xhtml"
                        },

                        /** Constants: XHTML_IM Namespace
                         *  contains allowed tags, tag attributes, and css properties.
                         *  Used in the createHtml function to filter incoming html into the allowed XHTML-IM subset.
                         *  See http://xmpp.org/extensions/xep-0071.html#profile-summary for the list of recommended
                         *  allowed tags and their attributes.
                         */
                        XHTML: {
                            tags: ['a', 'blockquote', 'br', 'cite', 'em', 'img', 'li', 'ol', 'p', 'span', 'strong', 'ul', 'body'],
                            attributes: {
                                'a': ['href'],
                                'blockquote': ['style'],
                                'br': [],
                                'cite': ['style'],
                                'em': [],
                                'img': ['src', 'alt', 'style', 'height', 'width'],
                                'li': ['style'],
                                'ol': ['style'],
                                'p': ['style'],
                                'span': ['style'],
                                'strong': [],
                                'ul': ['style'],
                                'body': []
                            },
                            css: ['background-color', 'color', 'font-family', 'font-size', 'font-style', 'font-weight', 'margin-left', 'margin-right', 'text-align', 'text-decoration'],
                            /** Function: XHTML.validTag
                             *
                             * Utility method to determine whether a tag is allowed
                             * in the XHTML_IM namespace.
                             *
                             * XHTML tag names are case sensitive and must be lower case.
                             */
                            validTag: function validTag(tag) {
                                for (var i = 0; i < Strophe.XHTML.tags.length; i++) {
                                    if (tag == Strophe.XHTML.tags[i]) {
                                        return true;
                                    }
                                }
                                return false;
                            },
                            /** Function: XHTML.validAttribute
                             *
                             * Utility method to determine whether an attribute is allowed
                             * as recommended per XEP-0071
                             *
                             * XHTML attribute names are case sensitive and must be lower case.
                             */
                            validAttribute: function validAttribute(tag, attribute) {
                                if (typeof Strophe.XHTML.attributes[tag] !== 'undefined' && Strophe.XHTML.attributes[tag].length > 0) {
                                    for (var i = 0; i < Strophe.XHTML.attributes[tag].length; i++) {
                                        if (attribute == Strophe.XHTML.attributes[tag][i]) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            },
                            validCSS: function validCSS(style) {
                                for (var i = 0; i < Strophe.XHTML.css.length; i++) {
                                    if (style == Strophe.XHTML.css[i]) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },

                        /** Constants: Connection Status Constants
                         *  Connection status constants for use by the connection handler
                         *  callback.
                         *
                         *  Status.ERROR - An error has occurred
                         *  Status.CONNECTING - The connection is currently being made
                         *  Status.CONNFAIL - The connection attempt failed
                         *  Status.AUTHENTICATING - The connection is authenticating
                         *  Status.AUTHFAIL - The authentication attempt failed
                         *  Status.CONNECTED - The connection has succeeded
                         *  Status.DISCONNECTED - The connection has been terminated
                         *  Status.DISCONNECTING - The connection is currently being terminated
                         *  Status.ATTACHED - The connection has been attached
                         *  Status.CONNTIMEOUT - The connection has timed out
                         */
                        Status: {
                            ERROR: 0,
                            CONNECTING: 1,
                            CONNFAIL: 2,
                            AUTHENTICATING: 3,
                            AUTHFAIL: 4,
                            CONNECTED: 5,
                            DISCONNECTED: 6,
                            DISCONNECTING: 7,
                            ATTACHED: 8,
                            REDIRECT: 9,
                            CONNTIMEOUT: 10
                        },

                        /** Constants: Log Level Constants
                         *  Logging level indicators.
                         *
                         *  LogLevel.DEBUG - Debug output
                         *  LogLevel.INFO - Informational output
                         *  LogLevel.WARN - Warnings
                         *  LogLevel.ERROR - Errors
                         *  LogLevel.FATAL - Fatal errors
                         */
                        LogLevel: {
                            DEBUG: 0,
                            INFO: 1,
                            WARN: 2,
                            ERROR: 3,
                            FATAL: 4
                        },

                        /** PrivateConstants: DOM Element Type Constants
                         *  DOM element types.
                         *
                         *  ElementType.NORMAL - Normal element.
                         *  ElementType.TEXT - Text data element.
                         *  ElementType.FRAGMENT - XHTML fragment element.
                         */
                        ElementType: {
                            NORMAL: 1,
                            TEXT: 3,
                            CDATA: 4,
                            FRAGMENT: 11
                        },

                        /** PrivateConstants: Timeout Values
                         *  Timeout values for error states.  These values are in seconds.
                         *  These should not be changed unless you know exactly what you are
                         *  doing.
                         *
                         *  TIMEOUT - Timeout multiplier. A waiting request will be considered
                         *      failed after Math.floor(TIMEOUT * wait) seconds have elapsed.
                         *      This defaults to 1.1, and with default wait, 66 seconds.
                         *  SECONDARY_TIMEOUT - Secondary timeout multiplier. In cases where
                         *      Strophe can detect early failure, it will consider the request
                         *      failed if it doesn't return after
                         *      Math.floor(SECONDARY_TIMEOUT * wait) seconds have elapsed.
                         *      This defaults to 0.1, and with default wait, 6 seconds.
                         */
                        TIMEOUT: 1.1,
                        SECONDARY_TIMEOUT: 0.1,

                        /** Function: addNamespace
                         *  This function is used to extend the current namespaces in
                         *  Strophe.NS.  It takes a key and a value with the key being the
                         *  name of the new namespace, with its actual value.
                         *  For example:
                         *  Strophe.addNamespace('PUBSUB', "http://jabber.org/protocol/pubsub");
                         *
                         *  Parameters:
                         *    (String) name - The name under which the namespace will be
                         *      referenced under Strophe.NS
                         *    (String) value - The actual namespace.
                         */
                        addNamespace: function addNamespace(name, value) {
                            Strophe.NS[name] = value;
                        },

                        /** Function: forEachChild
                         *  Map a function over some or all child elements of a given element.
                         *
                         *  This is a small convenience function for mapping a function over
                         *  some or all of the children of an element.  If elemName is null, all
                         *  children will be passed to the function, otherwise only children
                         *  whose tag names match elemName will be passed.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The element to operate on.
                         *    (String) elemName - The child element tag name filter.
                         *    (Function) func - The function to apply to each child.  This
                         *      function should take a single argument, a DOM element.
                         */
                        forEachChild: function forEachChild(elem, elemName, func) {
                            var i, childNode;
                            for (i = 0; i < elem.childNodes.length; i++) {
                                childNode = elem.childNodes[i];
                                if (childNode.nodeType == Strophe.ElementType.NORMAL && (!elemName || this.isTagEqual(childNode, elemName))) {
                                    func(childNode);
                                }
                            }
                        },

                        /** Function: isTagEqual
                         *  Compare an element's tag name with a string.
                         *
                         *  This function is case sensitive.
                         *
                         *  Parameters:
                         *    (XMLElement) el - A DOM element.
                         *    (String) name - The element name.
                         *
                         *  Returns:
                         *    true if the element's tag name matches _el_, and false
                         *    otherwise.
                         */
                        isTagEqual: function isTagEqual(el, name) {
                            return el.tagName == name;
                        },

                        /** PrivateVariable: _xmlGenerator
                         *  _Private_ variable that caches a DOM document to
                         *  generate elements.
                         */
                        _xmlGenerator: null,

                        /** PrivateFunction: _makeGenerator
                         *  _Private_ function that creates a dummy XML DOM document to serve as
                         *  an element and text node generator.
                         */
                        _makeGenerator: function _makeGenerator() {
                            var doc;
                            // IE9 does implement createDocument(); however, using it will cause the browser to leak memory on page unload.
                            // Here, we test for presence of createDocument() plus IE's proprietary documentMode attribute, which would be
                            // less than 10 in the case of IE9 and below.
                            if (document.implementation.createDocument === undefined || document.implementation.createDocument && document.documentMode && document.documentMode < 10) {
                                doc = this._getIEXmlDom();
                                doc.appendChild(doc.createElement('strophe'));
                            } else {
                                doc = document.implementation.createDocument('jabber:client', 'strophe', null);
                            }
                            return doc;
                        },

                        /** Function: xmlGenerator
                         *  Get the DOM document to generate elements.
                         *
                         *  Returns:
                         *    The currently used DOM document.
                         */
                        xmlGenerator: function xmlGenerator() {
                            if (!Strophe._xmlGenerator) {
                                Strophe._xmlGenerator = Strophe._makeGenerator();
                            }
                            return Strophe._xmlGenerator;
                        },

                        /** PrivateFunction: _getIEXmlDom
                         *  Gets IE xml doc object
                         *
                         *  Returns:
                         *    A Microsoft XML DOM Object
                         *  See Also:
                         *    http://msdn.microsoft.com/en-us/library/ms757837%28VS.85%29.aspx
                         */
                        _getIEXmlDom: function _getIEXmlDom() {
                            var doc = null;
                            var docStrings = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.5.0", "Msxml2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XMLDOM"];

                            for (var d = 0; d < docStrings.length; d++) {
                                if (doc === null) {
                                    try {
                                        doc = new ActiveXObject(docStrings[d]);
                                    } catch (e) {
                                        doc = null;
                                    }
                                } else {
                                    break;
                                }
                            }
                            return doc;
                        },

                        /** Function: xmlElement
                         *  Create an XML DOM element.
                         *
                         *  This function creates an XML DOM element correctly across all
                         *  implementations. Note that these are not HTML DOM elements, which
                         *  aren't appropriate for XMPP stanzas.
                         *
                         *  Parameters:
                         *    (String) name - The name for the element.
                         *    (Array|Object) attrs - An optional array or object containing
                         *      key/value pairs to use as element attributes. The object should
                         *      be in the format {'key': 'value'} or {key: 'value'}. The array
                         *      should have the format [['key1', 'value1'], ['key2', 'value2']].
                         *    (String) text - The text child data for the element.
                         *
                         *  Returns:
                         *    A new XML DOM element.
                         */
                        xmlElement: function xmlElement(name) {
                            if (!name) {
                                return null;
                            }

                            var node = Strophe.xmlGenerator().createElement(name);
                            // FIXME: this should throw errors if args are the wrong type or
                            // there are more than two optional args
                            var a, i, k;
                            for (a = 1; a < arguments.length; a++) {
                                var arg = arguments[a];
                                if (!arg) {
                                    continue;
                                }
                                if (typeof arg == "string" || typeof arg == "number") {
                                    node.appendChild(Strophe.xmlTextNode(arg));
                                } else if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) == "object" && typeof arg.sort == "function") {
                                    for (i = 0; i < arg.length; i++) {
                                        var attr = arg[i];
                                        if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) == "object" && typeof attr.sort == "function" && attr[1] !== undefined && attr[1] !== null) {
                                            node.setAttribute(attr[0], attr[1]);
                                        }
                                    }
                                } else if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) == "object") {
                                    for (k in arg) {
                                        if (arg.hasOwnProperty(k)) {
                                            if (arg[k] !== undefined && arg[k] !== null) {
                                                node.setAttribute(k, arg[k]);
                                            }
                                        }
                                    }
                                }
                            }

                            return node;
                        },

                        /*  Function: xmlescape
                         *  Excapes invalid xml characters.
                         *
                         *  Parameters:
                         *     (String) text - text to escape.
                         *
                         *  Returns:
                         *      Escaped text.
                         */
                        xmlescape: function xmlescape(text) {
                            text = text.replace(/\&/g, "&amp;");
                            text = text.replace(/</g, "&lt;");
                            text = text.replace(/>/g, "&gt;");
                            text = text.replace(/'/g, "&apos;");
                            text = text.replace(/"/g, "&quot;");
                            return text;
                        },

                        /*  Function: xmlunescape
                        *  Unexcapes invalid xml characters.
                        *
                        *  Parameters:
                        *     (String) text - text to unescape.
                        *
                        *  Returns:
                        *      Unescaped text.
                        */
                        xmlunescape: function xmlunescape(text) {
                            text = text.replace(/\&amp;/g, "&");
                            text = text.replace(/&lt;/g, "<");
                            text = text.replace(/&gt;/g, ">");
                            text = text.replace(/&apos;/g, "'");
                            text = text.replace(/&quot;/g, "\"");
                            return text;
                        },

                        /** Function: xmlTextNode
                         *  Creates an XML DOM text node.
                         *
                         *  Provides a cross implementation version of document.createTextNode.
                         *
                         *  Parameters:
                         *    (String) text - The content of the text node.
                         *
                         *  Returns:
                         *    A new XML DOM text node.
                         */
                        xmlTextNode: function xmlTextNode(text) {
                            return Strophe.xmlGenerator().createTextNode(text);
                        },

                        /** Function: xmlHtmlNode
                         *  Creates an XML DOM html node.
                         *
                         *  Parameters:
                         *    (String) html - The content of the html node.
                         *
                         *  Returns:
                         *    A new XML DOM text node.
                         */
                        xmlHtmlNode: function xmlHtmlNode(html) {
                            var node;
                            //ensure text is escaped
                            if (window.DOMParser) {
                                var parser = new DOMParser();
                                node = parser.parseFromString(html, "text/xml");
                            } else {
                                node = new ActiveXObject("Microsoft.XMLDOM");
                                node.async = "false";
                                node.loadXML(html);
                            }
                            return node;
                        },

                        /** Function: getText
                         *  Get the concatenation of all text children of an element.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - A DOM element.
                         *
                         *  Returns:
                         *    A String with the concatenated text of all text element children.
                         */
                        getText: function getText(elem) {
                            if (!elem) {
                                return null;
                            }

                            var str = "";
                            if (elem.childNodes.length === 0 && elem.nodeType == Strophe.ElementType.TEXT) {
                                str += elem.nodeValue;
                            }

                            for (var i = 0; i < elem.childNodes.length; i++) {
                                if (elem.childNodes[i].nodeType == Strophe.ElementType.TEXT) {
                                    str += elem.childNodes[i].nodeValue;
                                }
                            }

                            return Strophe.xmlescape(str);
                        },

                        /** Function: copyElement
                         *  Copy an XML DOM element.
                         *
                         *  This function copies a DOM element and all its descendants and returns
                         *  the new copy.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - A DOM element.
                         *
                         *  Returns:
                         *    A new, copied DOM element tree.
                         */
                        copyElement: function copyElement(elem) {
                            var i, el;
                            if (elem.nodeType == Strophe.ElementType.NORMAL) {
                                el = Strophe.xmlElement(elem.tagName);

                                for (i = 0; i < elem.attributes.length; i++) {
                                    el.setAttribute(elem.attributes[i].nodeName, elem.attributes[i].value);
                                }

                                for (i = 0; i < elem.childNodes.length; i++) {
                                    el.appendChild(Strophe.copyElement(elem.childNodes[i]));
                                }
                            } else if (elem.nodeType == Strophe.ElementType.TEXT) {
                                el = Strophe.xmlGenerator().createTextNode(elem.nodeValue);
                            }
                            return el;
                        },

                        /** Function: createHtml
                         *  Copy an HTML DOM element into an XML DOM.
                         *
                         *  This function copies a DOM element and all its descendants and returns
                         *  the new copy.
                         *
                         *  Parameters:
                         *    (HTMLElement) elem - A DOM element.
                         *
                         *  Returns:
                         *    A new, copied DOM element tree.
                         */
                        createHtml: function createHtml(elem) {
                            var i, el, j, tag, attribute, value, css, cssAttrs, attr, cssName, cssValue;
                            if (elem.nodeType == Strophe.ElementType.NORMAL) {
                                tag = elem.nodeName.toLowerCase(); // XHTML tags must be lower case.
                                if (Strophe.XHTML.validTag(tag)) {
                                    try {
                                        el = Strophe.xmlElement(tag);
                                        for (i = 0; i < Strophe.XHTML.attributes[tag].length; i++) {
                                            attribute = Strophe.XHTML.attributes[tag][i];
                                            value = elem.getAttribute(attribute);
                                            if (typeof value == 'undefined' || value === null || value === '' || value === false || value === 0) {
                                                continue;
                                            }
                                            if (attribute == 'style' && (typeof value === "undefined" ? "undefined" : _typeof(value)) == 'object') {
                                                if (typeof value.cssText != 'undefined') {
                                                    value = value.cssText; // we're dealing with IE, need to get CSS out
                                                }
                                            }
                                            // filter out invalid css styles
                                            if (attribute == 'style') {
                                                css = [];
                                                cssAttrs = value.split(';');
                                                for (j = 0; j < cssAttrs.length; j++) {
                                                    attr = cssAttrs[j].split(':');
                                                    cssName = attr[0].replace(/^\s*/, "").replace(/\s*$/, "").toLowerCase();
                                                    if (Strophe.XHTML.validCSS(cssName)) {
                                                        cssValue = attr[1].replace(/^\s*/, "").replace(/\s*$/, "");
                                                        css.push(cssName + ': ' + cssValue);
                                                    }
                                                }
                                                if (css.length > 0) {
                                                    value = css.join('; ');
                                                    el.setAttribute(attribute, value);
                                                }
                                            } else {
                                                el.setAttribute(attribute, value);
                                            }
                                        }

                                        for (i = 0; i < elem.childNodes.length; i++) {
                                            el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                                        }
                                    } catch (e) {
                                        // invalid elements
                                        el = Strophe.xmlTextNode('');
                                    }
                                } else {
                                    el = Strophe.xmlGenerator().createDocumentFragment();
                                    for (i = 0; i < elem.childNodes.length; i++) {
                                        el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                                    }
                                }
                            } else if (elem.nodeType == Strophe.ElementType.FRAGMENT) {
                                el = Strophe.xmlGenerator().createDocumentFragment();
                                for (i = 0; i < elem.childNodes.length; i++) {
                                    el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                                }
                            } else if (elem.nodeType == Strophe.ElementType.TEXT) {
                                el = Strophe.xmlTextNode(elem.nodeValue);
                            }
                            return el;
                        },

                        /** Function: escapeNode
                         *  Escape the node part (also called local part) of a JID.
                         *
                         *  Parameters:
                         *    (String) node - A node (or local part).
                         *
                         *  Returns:
                         *    An escaped node (or local part).
                         */
                        escapeNode: function escapeNode(node) {
                            if (typeof node !== "string") {
                                return node;
                            }
                            return node.replace(/^\s+|\s+$/g, '').replace(/\\/g, "\\5c").replace(/ /g, "\\20").replace(/\"/g, "\\22").replace(/\&/g, "\\26").replace(/\'/g, "\\27").replace(/\//g, "\\2f").replace(/:/g, "\\3a").replace(/</g, "\\3c").replace(/>/g, "\\3e").replace(/@/g, "\\40");
                        },

                        /** Function: unescapeNode
                         *  Unescape a node part (also called local part) of a JID.
                         *
                         *  Parameters:
                         *    (String) node - A node (or local part).
                         *
                         *  Returns:
                         *    An unescaped node (or local part).
                         */
                        unescapeNode: function unescapeNode(node) {
                            if (typeof node !== "string") {
                                return node;
                            }
                            return node.replace(/\\20/g, " ").replace(/\\22/g, '"').replace(/\\26/g, "&").replace(/\\27/g, "'").replace(/\\2f/g, "/").replace(/\\3a/g, ":").replace(/\\3c/g, "<").replace(/\\3e/g, ">").replace(/\\40/g, "@").replace(/\\5c/g, "\\");
                        },

                        /** Function: getNodeFromJid
                         *  Get the node portion of a JID String.
                         *
                         *  Parameters:
                         *    (String) jid - A JID.
                         *
                         *  Returns:
                         *    A String containing the node.
                         */
                        getNodeFromJid: function getNodeFromJid(jid) {
                            if (jid.indexOf("@") < 0) {
                                return null;
                            }
                            return jid.split("@")[0];
                        },

                        /** Function: getDomainFromJid
                         *  Get the domain portion of a JID String.
                         *
                         *  Parameters:
                         *    (String) jid - A JID.
                         *
                         *  Returns:
                         *    A String containing the domain.
                         */
                        getDomainFromJid: function getDomainFromJid(jid) {
                            var bare = Strophe.getBareJidFromJid(jid);
                            if (bare.indexOf("@") < 0) {
                                return bare;
                            } else {
                                var parts = bare.split("@");
                                parts.splice(0, 1);
                                return parts.join('@');
                            }
                        },

                        /** Function: getResourceFromJid
                         *  Get the resource portion of a JID String.
                         *
                         *  Parameters:
                         *    (String) jid - A JID.
                         *
                         *  Returns:
                         *    A String containing the resource.
                         */
                        getResourceFromJid: function getResourceFromJid(jid) {
                            var s = jid.split("/");
                            if (s.length < 2) {
                                return null;
                            }
                            s.splice(0, 1);
                            return s.join('/');
                        },

                        /** Function: getBareJidFromJid
                         *  Get the bare JID from a JID String.
                         *
                         *  Parameters:
                         *    (String) jid - A JID.
                         *
                         *  Returns:
                         *    A String containing the bare JID.
                         */
                        getBareJidFromJid: function getBareJidFromJid(jid) {
                            return jid ? jid.split("/")[0] : null;
                        },

                        /** PrivateFunction: _handleError
                         *  _Private_ function that properly logs an error to the console
                         */
                        _handleError: function _handleError(e) {
                            if (typeof e.stack !== "undefined") {
                                Strophe.fatal(e.stack);
                            }
                            if (e.sourceURL) {
                                Strophe.fatal("error: " + this.handler + " " + e.sourceURL + ":" + e.line + " - " + e.name + ": " + e.message);
                            } else if (e.fileName) {
                                Strophe.fatal("error: " + this.handler + " " + e.fileName + ":" + e.lineNumber + " - " + e.name + ": " + e.message);
                            } else {
                                Strophe.fatal("error: " + e.message);
                            }
                        },

                        /** Function: log
                         *  User overrideable logging function.
                         *
                         *  This function is called whenever the Strophe library calls any
                         *  of the logging functions.  The default implementation of this
                         *  function does nothing.  If client code wishes to handle the logging
                         *  messages, it should override this with
                         *  > Strophe.log = function (level, msg) {
                         *  >   (user code here)
                         *  > };
                         *
                         *  Please note that data sent and received over the wire is logged
                         *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
                         *
                         *  The different levels and their meanings are
                         *
                         *    DEBUG - Messages useful for debugging purposes.
                         *    INFO - Informational messages.  This is mostly information like
                         *      'disconnect was called' or 'SASL auth succeeded'.
                         *    WARN - Warnings about potential problems.  This is mostly used
                         *      to report transient connection errors like request timeouts.
                         *    ERROR - Some error occurred.
                         *    FATAL - A non-recoverable fatal error occurred.
                         *
                         *  Parameters:
                         *    (Integer) level - The log level of the log message.  This will
                         *      be one of the values in Strophe.LogLevel.
                         *    (String) msg - The log message.
                         */
                        /* jshint ignore:start */
                        log: function log(level, msg) {
                            return;
                        },
                        /* jshint ignore:end */

                        /** Function: debug
                         *  Log a message at the Strophe.LogLevel.DEBUG level.
                         *
                         *  Parameters:
                         *    (String) msg - The log message.
                         */
                        debug: function debug(msg) {
                            this.log(this.LogLevel.DEBUG, msg);
                        },

                        /** Function: info
                         *  Log a message at the Strophe.LogLevel.INFO level.
                         *
                         *  Parameters:
                         *    (String) msg - The log message.
                         */
                        info: function info(msg) {
                            this.log(this.LogLevel.INFO, msg);
                        },

                        /** Function: warn
                         *  Log a message at the Strophe.LogLevel.WARN level.
                         *
                         *  Parameters:
                         *    (String) msg - The log message.
                         */
                        warn: function warn(msg) {
                            this.log(this.LogLevel.WARN, msg);
                        },

                        /** Function: error
                         *  Log a message at the Strophe.LogLevel.ERROR level.
                         *
                         *  Parameters:
                         *    (String) msg - The log message.
                         */
                        error: function error(msg) {
                            this.log(this.LogLevel.ERROR, msg);
                        },

                        /** Function: fatal
                         *  Log a message at the Strophe.LogLevel.FATAL level.
                         *
                         *  Parameters:
                         *    (String) msg - The log message.
                         */
                        fatal: function fatal(msg) {
                            this.log(this.LogLevel.FATAL, msg);
                        },

                        /** Function: serialize
                         *  Render a DOM element and all descendants to a String.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - A DOM element.
                         *
                         *  Returns:
                         *    The serialized element tree as a String.
                         */
                        serialize: function serialize(elem) {
                            var result;

                            if (!elem) {
                                return null;
                            }

                            if (typeof elem.tree === "function") {
                                elem = elem.tree();
                            }

                            var nodeName = elem.nodeName;
                            var i, child;

                            if (elem.getAttribute("_realname")) {
                                nodeName = elem.getAttribute("_realname");
                            }

                            result = "<" + nodeName;
                            for (i = 0; i < elem.attributes.length; i++) {
                                if (elem.attributes[i].nodeName != "_realname") {
                                    result += " " + elem.attributes[i].nodeName + "='" + Strophe.xmlescape(elem.attributes[i].value) + "'";
                                }
                            }

                            if (elem.childNodes.length > 0) {
                                result += ">";
                                for (i = 0; i < elem.childNodes.length; i++) {
                                    child = elem.childNodes[i];
                                    switch (child.nodeType) {
                                        case Strophe.ElementType.NORMAL:
                                            // normal element, so recurse
                                            result += Strophe.serialize(child);
                                            break;
                                        case Strophe.ElementType.TEXT:
                                            // text element to escape values
                                            result += Strophe.xmlescape(child.nodeValue);
                                            break;
                                        case Strophe.ElementType.CDATA:
                                            // cdata section so don't escape values
                                            result += "<![CDATA[" + child.nodeValue + "]]>";
                                    }
                                }
                                result += "</" + nodeName + ">";
                            } else {
                                result += "/>";
                            }

                            return result;
                        },

                        /** PrivateVariable: _requestId
                         *  _Private_ variable that keeps track of the request ids for
                         *  connections.
                         */
                        _requestId: 0,

                        /** PrivateVariable: Strophe.connectionPlugins
                         *  _Private_ variable Used to store plugin names that need
                         *  initialization on Strophe.Connection construction.
                         */
                        _connectionPlugins: {},

                        /** Function: addConnectionPlugin
                         *  Extends the Strophe.Connection object with the given plugin.
                         *
                         *  Parameters:
                         *    (String) name - The name of the extension.
                         *    (Object) ptype - The plugin's prototype.
                         */
                        addConnectionPlugin: function addConnectionPlugin(name, ptype) {
                            Strophe._connectionPlugins[name] = ptype;
                        }
                    };

                    /** Class: Strophe.Builder
                     *  XML DOM builder.
                     *
                     *  This object provides an interface similar to JQuery but for building
                     *  DOM elements easily and rapidly.  All the functions except for toString()
                     *  and tree() return the object, so calls can be chained.  Here's an
                     *  example using the $iq() builder helper.
                     *  > $iq({to: 'you', from: 'me', type: 'get', id: '1'})
                     *  >     .c('query', {xmlns: 'strophe:example'})
                     *  >     .c('example')
                     *  >     .toString()
                     *
                     *  The above generates this XML fragment
                     *  > <iq to='you' from='me' type='get' id='1'>
                     *  >   <query xmlns='strophe:example'>
                     *  >     <example/>
                     *  >   </query>
                     *  > </iq>
                     *  The corresponding DOM manipulations to get a similar fragment would be
                     *  a lot more tedious and probably involve several helper variables.
                     *
                     *  Since adding children makes new operations operate on the child, up()
                     *  is provided to traverse up the tree.  To add two children, do
                     *  > builder.c('child1', ...).up().c('child2', ...)
                     *  The next operation on the Builder will be relative to the second child.
                     */

                    /** Constructor: Strophe.Builder
                     *  Create a Strophe.Builder object.
                     *
                     *  The attributes should be passed in object notation.  For example
                     *  > var b = new Builder('message', {to: 'you', from: 'me'});
                     *  or
                     *  > var b = new Builder('messsage', {'xml:lang': 'en'});
                     *
                     *  Parameters:
                     *    (String) name - The name of the root element.
                     *    (Object) attrs - The attributes for the root element in object notation.
                     *
                     *  Returns:
                     *    A new Strophe.Builder.
                     */
                    Strophe.Builder = function (name, attrs) {
                        // Set correct namespace for jabber:client elements
                        if (name == "presence" || name == "message" || name == "iq") {
                            if (attrs && !attrs.xmlns) {
                                attrs.xmlns = Strophe.NS.CLIENT;
                            } else if (!attrs) {
                                attrs = { xmlns: Strophe.NS.CLIENT };
                            }
                        }

                        // Holds the tree being built.
                        this.nodeTree = Strophe.xmlElement(name, attrs);

                        // Points to the current operation node.
                        this.node = this.nodeTree;
                    };

                    Strophe.Builder.prototype = {
                        /** Function: tree
                         *  Return the DOM tree.
                         *
                         *  This function returns the current DOM tree as an element object.  This
                         *  is suitable for passing to functions like Strophe.Connection.send().
                         *
                         *  Returns:
                         *    The DOM tree as a element object.
                         */
                        tree: function tree() {
                            return this.nodeTree;
                        },

                        /** Function: toString
                         *  Serialize the DOM tree to a String.
                         *
                         *  This function returns a string serialization of the current DOM
                         *  tree.  It is often used internally to pass data to a
                         *  Strophe.Request object.
                         *
                         *  Returns:
                         *    The serialized DOM tree in a String.
                         */
                        toString: function toString() {
                            return Strophe.serialize(this.nodeTree);
                        },

                        /** Function: up
                         *  Make the current parent element the new current element.
                         *
                         *  This function is often used after c() to traverse back up the tree.
                         *  For example, to add two children to the same element
                         *  > builder.c('child1', {}).up().c('child2', {});
                         *
                         *  Returns:
                         *    The Stophe.Builder object.
                         */
                        up: function up() {
                            this.node = this.node.parentNode;
                            return this;
                        },

                        /** Function: root
                         *  Make the root element the new current element.
                         *
                         *  When at a deeply nested element in the tree, this function can be used
                         *  to jump back to the root of the tree, instead of having to repeatedly
                         *  call up().
                         *
                         *  Returns:
                         *    The Stophe.Builder object.
                         */
                        root: function root() {
                            this.node = this.nodeTree;
                            return this;
                        },

                        /** Function: attrs
                         *  Add or modify attributes of the current element.
                         *
                         *  The attributes should be passed in object notation.  This function
                         *  does not move the current element pointer.
                         *
                         *  Parameters:
                         *    (Object) moreattrs - The attributes to add/modify in object notation.
                         *
                         *  Returns:
                         *    The Strophe.Builder object.
                         */
                        attrs: function attrs(moreattrs) {
                            for (var k in moreattrs) {
                                if (moreattrs.hasOwnProperty(k)) {
                                    if (moreattrs[k] === undefined) {
                                        this.node.removeAttribute(k);
                                    } else {
                                        this.node.setAttribute(k, moreattrs[k]);
                                    }
                                }
                            }
                            return this;
                        },

                        /** Function: c
                         *  Add a child to the current element and make it the new current
                         *  element.
                         *
                         *  This function moves the current element pointer to the child,
                         *  unless text is provided.  If you need to add another child, it
                         *  is necessary to use up() to go back to the parent in the tree.
                         *
                         *  Parameters:
                         *    (String) name - The name of the child.
                         *    (Object) attrs - The attributes of the child in object notation.
                         *    (String) text - The text to add to the child.
                         *
                         *  Returns:
                         *    The Strophe.Builder object.
                         */
                        c: function c(name, attrs, text) {
                            var child = Strophe.xmlElement(name, attrs, text);
                            this.node.appendChild(child);
                            if (typeof text !== "string" && typeof text !== "number") {
                                this.node = child;
                            }
                            return this;
                        },

                        /** Function: cnode
                         *  Add a child to the current element and make it the new current
                         *  element.
                         *
                         *  This function is the same as c() except that instead of using a
                         *  name and an attributes object to create the child it uses an
                         *  existing DOM element object.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - A DOM element.
                         *
                         *  Returns:
                         *    The Strophe.Builder object.
                         */
                        cnode: function cnode(elem) {
                            var impNode;
                            var xmlGen = Strophe.xmlGenerator();
                            try {
                                impNode = xmlGen.importNode !== undefined;
                            } catch (e) {
                                impNode = false;
                            }
                            var newElem = impNode ? xmlGen.importNode(elem, true) : Strophe.copyElement(elem);
                            this.node.appendChild(newElem);
                            this.node = newElem;
                            return this;
                        },

                        /** Function: t
                         *  Add a child text element.
                         *
                         *  This *does not* make the child the new current element since there
                         *  are no children of text elements.
                         *
                         *  Parameters:
                         *    (String) text - The text data to append to the current element.
                         *
                         *  Returns:
                         *    The Strophe.Builder object.
                         */
                        t: function t(text) {
                            var child = Strophe.xmlTextNode(text);
                            this.node.appendChild(child);
                            return this;
                        },

                        /** Function: h
                         *  Replace current element contents with the HTML passed in.
                         *
                         *  This *does not* make the child the new current element
                         *
                         *  Parameters:
                         *    (String) html - The html to insert as contents of current element.
                         *
                         *  Returns:
                         *    The Strophe.Builder object.
                         */
                        h: function h(html) {
                            var fragment = document.createElement('body');

                            // force the browser to try and fix any invalid HTML tags
                            fragment.innerHTML = html;

                            // copy cleaned html into an xml dom
                            var xhtml = Strophe.createHtml(fragment);

                            while (xhtml.childNodes.length > 0) {
                                this.node.appendChild(xhtml.childNodes[0]);
                            }
                            return this;
                        }
                    };

                    /** PrivateClass: Strophe.Handler
                     *  _Private_ helper class for managing stanza handlers.
                     *
                     *  A Strophe.Handler encapsulates a user provided callback function to be
                     *  executed when matching stanzas are received by the connection.
                     *  Handlers can be either one-off or persistant depending on their
                     *  return value. Returning true will cause a Handler to remain active, and
                     *  returning false will remove the Handler.
                     *
                     *  Users will not use Strophe.Handler objects directly, but instead they
                     *  will use Strophe.Connection.addHandler() and
                     *  Strophe.Connection.deleteHandler().
                     */

                    /** PrivateConstructor: Strophe.Handler
                     *  Create and initialize a new Strophe.Handler.
                     *
                     *  Parameters:
                     *    (Function) handler - A function to be executed when the handler is run.
                     *    (String) ns - The namespace to match.
                     *    (String) name - The element name to match.
                     *    (String) type - The element type to match.
                     *    (String) id - The element id attribute to match.
                     *    (String) from - The element from attribute to match.
                     *    (Object) options - Handler options
                     *
                     *  Returns:
                     *    A new Strophe.Handler object.
                     */
                    Strophe.Handler = function (handler, ns, name, type, id, from, options) {
                        this.handler = handler;
                        this.ns = ns;
                        this.name = name;
                        this.type = type;
                        this.id = id;
                        this.options = options || { 'matchBareFromJid': false, 'ignoreNamespaceFragment': false };
                        // BBB: Maintain backward compatibility with old `matchBare` option
                        if (this.options.matchBare) {
                            Strophe.warn('The "matchBare" option is deprecated, use "matchBareFromJid" instead.');
                            this.options.matchBareFromJid = this.options.matchBare;
                            delete this.options.matchBare;
                        }

                        if (this.options.matchBareFromJid) {
                            this.from = from ? Strophe.getBareJidFromJid(from) : null;
                        } else {
                            this.from = from;
                        }
                        // whether the handler is a user handler or a system handler
                        this.user = true;
                    };

                    Strophe.Handler.prototype = {
                        /** PrivateFunction: getNamespace
                         *  Returns the XML namespace attribute on an element.
                         *  If `ignoreNamespaceFragment` was passed in for this handler, then the
                         *  URL fragment will be stripped.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The XML element with the namespace.
                         *
                         *  Returns:
                         *    The namespace, with optionally the fragment stripped.
                         */
                        getNamespace: function getNamespace(elem) {
                            var elNamespace = elem.getAttribute("xmlns");
                            if (elNamespace && this.options.ignoreNamespaceFragment) {
                                elNamespace = elNamespace.split('#')[0];
                            }
                            return elNamespace;
                        },

                        /** PrivateFunction: namespaceMatch
                         *  Tests if a stanza matches the namespace set for this Strophe.Handler.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The XML element to test.
                         *
                         *  Returns:
                         *    true if the stanza matches and false otherwise.
                         */
                        namespaceMatch: function namespaceMatch(elem) {
                            var nsMatch = false;
                            if (!this.ns) {
                                return true;
                            } else {
                                var that = this;
                                Strophe.forEachChild(elem, null, function (elem) {
                                    if (that.getNamespace(elem) === that.ns) {
                                        nsMatch = true;
                                    }
                                });
                                nsMatch = nsMatch || this.getNamespace(elem) === this.ns;
                            }
                            return nsMatch;
                        },

                        /** PrivateFunction: isMatch
                         *  Tests if a stanza matches the Strophe.Handler.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The XML element to test.
                         *
                         *  Returns:
                         *    true if the stanza matches and false otherwise.
                         */
                        isMatch: function isMatch(elem) {
                            var from = elem.getAttribute('from');
                            if (this.options.matchBareFromJid) {
                                from = Strophe.getBareJidFromJid(from);
                            }
                            var elem_type = elem.getAttribute("type");
                            if (this.namespaceMatch(elem) && (!this.name || Strophe.isTagEqual(elem, this.name)) && (!this.type || (Array.isArray(this.type) ? this.type.indexOf(elem_type) != -1 : elem_type == this.type)) && (!this.id || elem.getAttribute("id") == this.id) && (!this.from || from == this.from)) {
                                return true;
                            }
                            return false;
                        },

                        /** PrivateFunction: run
                         *  Run the callback on a matching stanza.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The DOM element that triggered the
                         *      Strophe.Handler.
                         *
                         *  Returns:
                         *    A boolean indicating if the handler should remain active.
                         */
                        run: function run(elem) {
                            var result = null;
                            try {
                                result = this.handler(elem);
                            } catch (e) {
                                Strophe._handleError(e);
                                throw e;
                            }
                            return result;
                        },

                        /** PrivateFunction: toString
                         *  Get a String representation of the Strophe.Handler object.
                         *
                         *  Returns:
                         *    A String.
                         */
                        toString: function toString() {
                            return "{Handler: " + this.handler + "(" + this.name + "," + this.id + "," + this.ns + ")}";
                        }
                    };

                    /** PrivateClass: Strophe.TimedHandler
                     *  _Private_ helper class for managing timed handlers.
                     *
                     *  A Strophe.TimedHandler encapsulates a user provided callback that
                     *  should be called after a certain period of time or at regular
                     *  intervals.  The return value of the callback determines whether the
                     *  Strophe.TimedHandler will continue to fire.
                     *
                     *  Users will not use Strophe.TimedHandler objects directly, but instead
                     *  they will use Strophe.Connection.addTimedHandler() and
                     *  Strophe.Connection.deleteTimedHandler().
                     */

                    /** PrivateConstructor: Strophe.TimedHandler
                     *  Create and initialize a new Strophe.TimedHandler object.
                     *
                     *  Parameters:
                     *    (Integer) period - The number of milliseconds to wait before the
                     *      handler is called.
                     *    (Function) handler - The callback to run when the handler fires.  This
                     *      function should take no arguments.
                     *
                     *  Returns:
                     *    A new Strophe.TimedHandler object.
                     */
                    Strophe.TimedHandler = function (period, handler) {
                        this.period = period;
                        this.handler = handler;
                        this.lastCalled = new Date().getTime();
                        this.user = true;
                    };

                    Strophe.TimedHandler.prototype = {
                        /** PrivateFunction: run
                         *  Run the callback for the Strophe.TimedHandler.
                         *
                         *  Returns:
                         *    true if the Strophe.TimedHandler should be called again, and false
                         *      otherwise.
                         */
                        run: function run() {
                            this.lastCalled = new Date().getTime();
                            return this.handler();
                        },

                        /** PrivateFunction: reset
                         *  Reset the last called time for the Strophe.TimedHandler.
                         */
                        reset: function reset() {
                            this.lastCalled = new Date().getTime();
                        },

                        /** PrivateFunction: toString
                         *  Get a string representation of the Strophe.TimedHandler object.
                         *
                         *  Returns:
                         *    The string representation.
                         */
                        toString: function toString() {
                            return "{TimedHandler: " + this.handler + "(" + this.period + ")}";
                        }
                    };

                    /** Class: Strophe.Connection
                     *  XMPP Connection manager.
                     *
                     *  This class is the main part of Strophe.  It manages a BOSH or websocket
                     *  connection to an XMPP server and dispatches events to the user callbacks
                     *  as data arrives. It supports SASL PLAIN, SASL DIGEST-MD5, SASL SCRAM-SHA1
                     *  and legacy authentication.
                     *
                     *  After creating a Strophe.Connection object, the user will typically
                     *  call connect() with a user supplied callback to handle connection level
                     *  events like authentication failure, disconnection, or connection
                     *  complete.
                     *
                     *  The user will also have several event handlers defined by using
                     *  addHandler() and addTimedHandler().  These will allow the user code to
                     *  respond to interesting stanzas or do something periodically with the
                     *  connection. These handlers will be active once authentication is
                     *  finished.
                     *
                     *  To send data to the connection, use send().
                     */

                    /** Constructor: Strophe.Connection
                     *  Create and initialize a Strophe.Connection object.
                     *
                     *  The transport-protocol for this connection will be chosen automatically
                     *  based on the given service parameter. URLs starting with "ws://" or
                     *  "wss://" will use WebSockets, URLs starting with "http://", "https://"
                     *  or without a protocol will use BOSH.
                     *
                     *  To make Strophe connect to the current host you can leave out the protocol
                     *  and host part and just pass the path, e.g.
                     *
                     *  > var conn = new Strophe.Connection("/http-bind/");
                     *
                     *  Options common to both Websocket and BOSH:
                     *  ------------------------------------------
                     *
                     *  cookies:
                     *
                     *  The *cookies* option allows you to pass in cookies to be added to the
                     *  document. These cookies will then be included in the BOSH XMLHttpRequest
                     *  or in the websocket connection.
                     *
                     *  The passed in value must be a map of cookie names and string values.
                     *
                     *  > { "myCookie": {
                     *  >     "value": "1234",
                     *  >     "domain": ".example.org",
                     *  >     "path": "/",
                     *  >     "expires": expirationDate
                     *  >     }
                     *  > }
                     *
                     *  Note that cookies can't be set in this way for other domains (i.e. cross-domain).
                     *  Those cookies need to be set under those domains, for example they can be
                     *  set server-side by making a XHR call to that domain to ask it to set any
                     *  necessary cookies.
                     *
                     *  mechanisms:
                     *
                     *  The *mechanisms* option allows you to specify the SASL mechanisms that this
                     *  instance of Strophe.Connection (and therefore your XMPP client) will
                     *  support.
                     *
                     *  The value must be an array of objects with Strophe.SASLMechanism
                     *  prototypes.
                     *
                     *  If nothing is specified, then the following mechanisms (and their
                     *  priorities) are registered:
                     *
                     *      EXTERNAL - 60
                     *      OAUTHBEARER - 50
                     *      SCRAM-SHA1 - 40
                     *      DIGEST-MD5 - 30
                     *      PLAIN - 20
                     *      ANONYMOUS - 10
                     *
                     *  WebSocket options:
                     *  ------------------
                     *
                     *  If you want to connect to the current host with a WebSocket connection you
                     *  can tell Strophe to use WebSockets through a "protocol" attribute in the
                     *  optional options parameter. Valid values are "ws" for WebSocket and "wss"
                     *  for Secure WebSocket.
                     *  So to connect to "wss://CURRENT_HOSTNAME/xmpp-websocket" you would call
                     *
                     *  > var conn = new Strophe.Connection("/xmpp-websocket/", {protocol: "wss"});
                     *
                     *  Note that relative URLs _NOT_ starting with a "/" will also include the path
                     *  of the current site.
                     *
                     *  Also because downgrading security is not permitted by browsers, when using
                     *  relative URLs both BOSH and WebSocket connections will use their secure
                     *  variants if the current connection to the site is also secure (https).
                     *
                     *  BOSH options:
                     *  -------------
                     *
                     *  By adding "sync" to the options, you can control if requests will
                     *  be made synchronously or not. The default behaviour is asynchronous.
                     *  If you want to make requests synchronous, make "sync" evaluate to true.
                     *  > var conn = new Strophe.Connection("/http-bind/", {sync: true});
                     *
                     *  You can also toggle this on an already established connection.
                     *  > conn.options.sync = true;
                     *
                     *  The *customHeaders* option can be used to provide custom HTTP headers to be
                     *  included in the XMLHttpRequests made.
                     *
                     *  The *keepalive* option can be used to instruct Strophe to maintain the
                     *  current BOSH session across interruptions such as webpage reloads.
                     *
                     *  It will do this by caching the sessions tokens in sessionStorage, and when
                     *  "restore" is called it will check whether there are cached tokens with
                     *  which it can resume an existing session.
                     *
                     *  The *withCredentials* option should receive a Boolean value and is used to
                     *  indicate wether cookies should be included in ajax requests (by default
                     *  they're not).
                     *  Set this value to true if you are connecting to a BOSH service
                     *  and for some reason need to send cookies to it.
                     *  In order for this to work cross-domain, the server must also enable
                     *  credentials by setting the Access-Control-Allow-Credentials response header
                     *  to "true". For most usecases however this setting should be false (which
                     *  is the default).
                     *  Additionally, when using Access-Control-Allow-Credentials, the
                     *  Access-Control-Allow-Origin header can't be set to the wildcard "*", but
                     *  instead must be restricted to actual domains.
                     *
                     *  The *contentType* option can be set to change the default Content-Type
                     *  of "text/xml; charset=utf-8", which can be useful to reduce the amount of
                     *  CORS preflight requests that are sent to the server.
                     *
                     *  Parameters:
                     *    (String) service - The BOSH or WebSocket service URL.
                     *    (Object) options - A hash of configuration options
                     *
                     *  Returns:
                     *    A new Strophe.Connection object.
                     */
                    Strophe.Connection = function (service, options) {
                        // The service URL
                        this.service = service;
                        // Configuration options
                        this.options = options || {};
                        var proto = this.options.protocol || "";

                        // Select protocal based on service or options
                        if (service.indexOf("ws:") === 0 || service.indexOf("wss:") === 0 || proto.indexOf("ws") === 0) {
                            this._proto = new Strophe.Websocket(this);
                        } else {
                            this._proto = new Strophe.Bosh(this);
                        }

                        /* The connected JID. */
                        this.jid = "";
                        /* the JIDs domain */
                        this.domain = null;
                        /* stream:features */
                        this.features = null;

                        // SASL
                        this._sasl_data = {};
                        this.do_session = false;
                        this.do_bind = false;

                        // handler lists
                        this.timedHandlers = [];
                        this.handlers = [];
                        this.removeTimeds = [];
                        this.removeHandlers = [];
                        this.addTimeds = [];
                        this.addHandlers = [];
                        this.protocolErrorHandlers = {
                            'HTTP': {},
                            'websocket': {}
                        };

                        this._idleTimeout = null;
                        this._disconnectTimeout = null;

                        this.authenticated = false;
                        this.connected = false;
                        this.disconnecting = false;
                        this.do_authentication = true;
                        this.paused = false;
                        this.restored = false;

                        this._data = [];
                        this._uniqueId = 0;

                        this._sasl_success_handler = null;
                        this._sasl_failure_handler = null;
                        this._sasl_challenge_handler = null;

                        // Max retries before disconnecting
                        this.maxRetries = 5;

                        // Call onIdle callback every 1/10th of a second
                        // XXX: setTimeout should be called only with function expressions (23974bc1)
                        this._idleTimeout = setTimeout(function () {
                            this._onIdle();
                        }.bind(this), 100);

                        utils.addCookies(this.options.cookies);
                        this.registerSASLMechanisms(this.options.mechanisms);

                        // initialize plugins
                        for (var k in Strophe._connectionPlugins) {
                            if (Strophe._connectionPlugins.hasOwnProperty(k)) {
                                var ptype = Strophe._connectionPlugins[k];
                                // jslint complaints about the below line, but this is fine
                                var F = function F() {}; // jshint ignore:line
                                F.prototype = ptype;
                                this[k] = new F();
                                this[k].init(this);
                            }
                        }
                    };

                    Strophe.Connection.prototype = {
                        /** Function: reset
                         *  Reset the connection.
                         *
                         *  This function should be called after a connection is disconnected
                         *  before that connection is reused.
                         */
                        reset: function reset() {
                            this._proto._reset();

                            // SASL
                            this.do_session = false;
                            this.do_bind = false;

                            // handler lists
                            this.timedHandlers = [];
                            this.handlers = [];
                            this.removeTimeds = [];
                            this.removeHandlers = [];
                            this.addTimeds = [];
                            this.addHandlers = [];

                            this.authenticated = false;
                            this.connected = false;
                            this.disconnecting = false;
                            this.restored = false;

                            this._data = [];
                            this._requests = [];
                            this._uniqueId = 0;
                        },

                        /** Function: pause
                         *  Pause the request manager.
                         *
                         *  This will prevent Strophe from sending any more requests to the
                         *  server.  This is very useful for temporarily pausing
                         *  BOSH-Connections while a lot of send() calls are happening quickly.
                         *  This causes Strophe to send the data in a single request, saving
                         *  many request trips.
                         */
                        pause: function pause() {
                            this.paused = true;
                        },

                        /** Function: resume
                         *  Resume the request manager.
                         *
                         *  This resumes after pause() has been called.
                         */
                        resume: function resume() {
                            this.paused = false;
                        },

                        /** Function: getUniqueId
                         *  Generate a unique ID for use in <iq/> elements.
                         *
                         *  All <iq/> stanzas are required to have unique id attributes.  This
                         *  function makes creating these easy.  Each connection instance has
                         *  a counter which starts from zero, and the value of this counter
                         *  plus a colon followed by the suffix becomes the unique id. If no
                         *  suffix is supplied, the counter is used as the unique id.
                         *
                         *  Suffixes are used to make debugging easier when reading the stream
                         *  data, and their use is recommended.  The counter resets to 0 for
                         *  every new connection for the same reason.  For connections to the
                         *  same server that authenticate the same way, all the ids should be
                         *  the same, which makes it easy to see changes.  This is useful for
                         *  automated testing as well.
                         *
                         *  Parameters:
                         *    (String) suffix - A optional suffix to append to the id.
                         *
                         *  Returns:
                         *    A unique string to be used for the id attribute.
                         */
                        getUniqueId: function getUniqueId(suffix) {
                            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0,
                                    v = c == 'x' ? r : r & 0x3 | 0x8;
                                return v.toString(16);
                            });
                            if (typeof suffix == "string" || typeof suffix == "number") {
                                return uuid + ":" + suffix;
                            } else {
                                return uuid + "";
                            }
                        },

                        /** Function: addProtocolErrorHandler
                         *  Register a handler function for when a protocol (websocker or HTTP)
                         *  error occurs.
                         *
                         *  NOTE: Currently only HTTP errors for BOSH requests are handled.
                         *  Patches that handle websocket errors would be very welcome.
                         *
                         *  Parameters:
                         *    (String) protocol - 'HTTP' or 'websocket' 
                         *    (Integer) status_code - Error status code (e.g 500, 400 or 404)
                         *    (Function) callback - Function that will fire on Http error
                         *
                         *  Example:
                         *  function onError(err_code){
                         *    //do stuff
                         *  }
                         *
                         *  var conn = Strophe.connect('http://example.com/http-bind');
                         *  conn.addProtocolErrorHandler('HTTP', 500, onError);
                         *  // Triggers HTTP 500 error and onError handler will be called
                         *  conn.connect('user_jid@incorrect_jabber_host', 'secret', onConnect);
                         */
                        addProtocolErrorHandler: function addProtocolErrorHandler(protocol, status_code, callback) {
                            this.protocolErrorHandlers[protocol][status_code] = callback;
                        },

                        /** Function: connect
                         *  Starts the connection process.
                         *
                         *  As the connection process proceeds, the user supplied callback will
                         *  be triggered multiple times with status updates.  The callback
                         *  should take two arguments - the status code and the error condition.
                         *
                         *  The status code will be one of the values in the Strophe.Status
                         *  constants.  The error condition will be one of the conditions
                         *  defined in RFC 3920 or the condition 'strophe-parsererror'.
                         *
                         *  The Parameters _wait_, _hold_ and _route_ are optional and only relevant
                         *  for BOSH connections. Please see XEP 124 for a more detailed explanation
                         *  of the optional parameters.
                         *
                         *  Parameters:
                         *    (String) jid - The user's JID.  This may be a bare JID,
                         *      or a full JID.  If a node is not supplied, SASL ANONYMOUS
                         *      authentication will be attempted.
                         *    (String) pass - The user's password.
                         *    (Function) callback - The connect callback function.
                         *    (Integer) wait - The optional HTTPBIND wait value.  This is the
                         *      time the server will wait before returning an empty result for
                         *      a request.  The default setting of 60 seconds is recommended.
                         *    (Integer) hold - The optional HTTPBIND hold value.  This is the
                         *      number of connections the server will hold at one time.  This
                         *      should almost always be set to 1 (the default).
                         *    (String) route - The optional route value.
                         *    (String) authcid - The optional alternative authentication identity
                         *      (username) if intending to impersonate another user.
                         *      When using the SASL-EXTERNAL authentication mechanism, for example
                         *      with client certificates, then the authcid value is used to
                         *      determine whether an authorization JID (authzid) should be sent to
                         *      the server. The authzid should not be sent to the server if the
                         *      authzid and authcid are the same. So to prevent it from being sent
                         *      (for example when the JID is already contained in the client
                         *      certificate), set authcid to that same JID. See XEP-178 for more
                         *      details.
                         */
                        connect: function connect(jid, pass, callback, wait, hold, route, authcid) {
                            this.jid = jid;
                            /** Variable: authzid
                             *  Authorization identity.
                             */
                            this.authzid = Strophe.getBareJidFromJid(this.jid);

                            /** Variable: authcid
                             *  Authentication identity (User name).
                             */
                            this.authcid = authcid || Strophe.getNodeFromJid(this.jid);

                            /** Variable: pass
                             *  Authentication identity (User password).
                             */
                            this.pass = pass;

                            /** Variable: servtype
                             *  Digest MD5 compatibility.
                             */
                            this.servtype = "xmpp";

                            this.connect_callback = callback;
                            this.disconnecting = false;
                            this.connected = false;
                            this.authenticated = false;
                            this.restored = false;

                            // parse jid for domain
                            this.domain = Strophe.getDomainFromJid(this.jid);

                            this._changeConnectStatus(Strophe.Status.CONNECTING, null);

                            this._proto._connect(wait, hold, route);
                        },

                        /** Function: attach
                         *  Attach to an already created and authenticated BOSH session.
                         *
                         *  This function is provided to allow Strophe to attach to BOSH
                         *  sessions which have been created externally, perhaps by a Web
                         *  application.  This is often used to support auto-login type features
                         *  without putting user credentials into the page.
                         *
                         *  Parameters:
                         *    (String) jid - The full JID that is bound by the session.
                         *    (String) sid - The SID of the BOSH session.
                         *    (String) rid - The current RID of the BOSH session.  This RID
                         *      will be used by the next request.
                         *    (Function) callback The connect callback function.
                         *    (Integer) wait - The optional HTTPBIND wait value.  This is the
                         *      time the server will wait before returning an empty result for
                         *      a request.  The default setting of 60 seconds is recommended.
                         *      Other settings will require tweaks to the Strophe.TIMEOUT value.
                         *    (Integer) hold - The optional HTTPBIND hold value.  This is the
                         *      number of connections the server will hold at one time.  This
                         *      should almost always be set to 1 (the default).
                         *    (Integer) wind - The optional HTTBIND window value.  This is the
                         *      allowed range of request ids that are valid.  The default is 5.
                         */
                        attach: function attach(jid, sid, rid, callback, wait, hold, wind) {
                            if (this._proto instanceof Strophe.Bosh) {
                                this._proto._attach(jid, sid, rid, callback, wait, hold, wind);
                            } else {
                                throw {
                                    name: 'StropheSessionError',
                                    message: 'The "attach" method can only be used with a BOSH connection.'
                                };
                            }
                        },

                        /** Function: restore
                         *  Attempt to restore a cached BOSH session.
                         *
                         *  This function is only useful in conjunction with providing the
                         *  "keepalive":true option when instantiating a new Strophe.Connection.
                         *
                         *  When "keepalive" is set to true, Strophe will cache the BOSH tokens
                         *  RID (Request ID) and SID (Session ID) and then when this function is
                         *  called, it will attempt to restore the session from those cached
                         *  tokens.
                         *
                         *  This function must therefore be called instead of connect or attach.
                         *
                         *  For an example on how to use it, please see examples/restore.js
                         *
                         *  Parameters:
                         *    (String) jid - The user's JID.  This may be a bare JID or a full JID.
                         *    (Function) callback - The connect callback function.
                         *    (Integer) wait - The optional HTTPBIND wait value.  This is the
                         *      time the server will wait before returning an empty result for
                         *      a request.  The default setting of 60 seconds is recommended.
                         *    (Integer) hold - The optional HTTPBIND hold value.  This is the
                         *      number of connections the server will hold at one time.  This
                         *      should almost always be set to 1 (the default).
                         *    (Integer) wind - The optional HTTBIND window value.  This is the
                         *      allowed range of request ids that are valid.  The default is 5.
                         */
                        restore: function restore(jid, callback, wait, hold, wind) {
                            if (this._sessionCachingSupported()) {
                                this._proto._restore(jid, callback, wait, hold, wind);
                            } else {
                                throw {
                                    name: 'StropheSessionError',
                                    message: 'The "restore" method can only be used with a BOSH connection.'
                                };
                            }
                        },

                        /** PrivateFunction: _sessionCachingSupported
                         * Checks whether sessionStorage and JSON are supported and whether we're
                         * using BOSH.
                         */
                        _sessionCachingSupported: function _sessionCachingSupported() {
                            if (this._proto instanceof Strophe.Bosh) {
                                if (!JSON) {
                                    return false;
                                }
                                try {
                                    window.sessionStorage.setItem('_strophe_', '_strophe_');
                                    window.sessionStorage.removeItem('_strophe_');
                                } catch (e) {
                                    return false;
                                }
                                return true;
                            }
                            return false;
                        },

                        /** Function: xmlInput
                         *  User overrideable function that receives XML data coming into the
                         *  connection.
                         *
                         *  The default function does nothing.  User code can override this with
                         *  > Strophe.Connection.xmlInput = function (elem) {
                         *  >   (user code)
                         *  > };
                         *
                         *  Due to limitations of current Browsers' XML-Parsers the opening and closing
                         *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
                         *
                         *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
                         *  <Strophe.Bosh.strip> if you want to strip this tag.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The XML data received by the connection.
                         */
                        /* jshint unused:false */
                        xmlInput: function xmlInput(elem) {
                            return;
                        },
                        /* jshint unused:true */

                        /** Function: xmlOutput
                         *  User overrideable function that receives XML data sent to the
                         *  connection.
                         *
                         *  The default function does nothing.  User code can override this with
                         *  > Strophe.Connection.xmlOutput = function (elem) {
                         *  >   (user code)
                         *  > };
                         *
                         *  Due to limitations of current Browsers' XML-Parsers the opening and closing
                         *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
                         *
                         *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
                         *  <Strophe.Bosh.strip> if you want to strip this tag.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The XMLdata sent by the connection.
                         */
                        /* jshint unused:false */
                        xmlOutput: function xmlOutput(elem) {
                            return;
                        },
                        /* jshint unused:true */

                        /** Function: rawInput
                         *  User overrideable function that receives raw data coming into the
                         *  connection.
                         *
                         *  The default function does nothing.  User code can override this with
                         *  > Strophe.Connection.rawInput = function (data) {
                         *  >   (user code)
                         *  > };
                         *
                         *  Parameters:
                         *    (String) data - The data received by the connection.
                         */
                        /* jshint unused:false */
                        rawInput: function rawInput(data) {
                            return;
                        },
                        /* jshint unused:true */

                        /** Function: rawOutput
                         *  User overrideable function that receives raw data sent to the
                         *  connection.
                         *
                         *  The default function does nothing.  User code can override this with
                         *  > Strophe.Connection.rawOutput = function (data) {
                         *  >   (user code)
                         *  > };
                         *
                         *  Parameters:
                         *    (String) data - The data sent by the connection.
                         */
                        /* jshint unused:false */
                        rawOutput: function rawOutput(data) {
                            return;
                        },
                        /* jshint unused:true */

                        /** Function: nextValidRid
                         *  User overrideable function that receives the new valid rid.
                         *
                         *  The default function does nothing. User code can override this with
                         *  > Strophe.Connection.nextValidRid = function (rid) {
                         *  >    (user code)
                         *  > };
                         *
                         *  Parameters:
                         *    (Number) rid - The next valid rid
                         */
                        /* jshint unused:false */
                        nextValidRid: function nextValidRid(rid) {
                            return;
                        },
                        /* jshint unused:true */

                        /** Function: send
                         *  Send a stanza.
                         *
                         *  This function is called to push data onto the send queue to
                         *  go out over the wire.  Whenever a request is sent to the BOSH
                         *  server, all pending data is sent and the queue is flushed.
                         *
                         *  Parameters:
                         *    (XMLElement |
                         *     [XMLElement] |
                         *     Strophe.Builder) elem - The stanza to send.
                         */
                        send: function send(elem) {
                            if (elem === null) {
                                return;
                            }
                            if (typeof elem.sort === "function") {
                                for (var i = 0; i < elem.length; i++) {
                                    this._queueData(elem[i]);
                                }
                            } else if (typeof elem.tree === "function") {
                                this._queueData(elem.tree());
                            } else {
                                this._queueData(elem);
                            }

                            this._proto._send();
                        },

                        /** Function: flush
                         *  Immediately send any pending outgoing data.
                         *
                         *  Normally send() queues outgoing data until the next idle period
                         *  (100ms), which optimizes network use in the common cases when
                         *  several send()s are called in succession. flush() can be used to
                         *  immediately send all pending data.
                         */
                        flush: function flush() {
                            // cancel the pending idle period and run the idle function
                            // immediately
                            clearTimeout(this._idleTimeout);
                            this._onIdle();
                        },

                        /** Function: sendPresence
                         *  Helper function to send presence stanzas. The main benefit is for
                         *  sending presence stanzas for which you expect a responding presence
                         *  stanza with the same id (for example when leaving a chat room).
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The stanza to send.
                         *    (Function) callback - The callback function for a successful request.
                         *    (Function) errback - The callback function for a failed or timed
                         *      out request.  On timeout, the stanza will be null.
                         *    (Integer) timeout - The time specified in milliseconds for a
                         *      timeout to occur.
                         *
                         *  Returns:
                         *    The id used to send the presence.
                         */
                        sendPresence: function sendPresence(elem, callback, errback, timeout) {
                            var timeoutHandler = null;
                            var that = this;
                            if (typeof elem.tree === "function") {
                                elem = elem.tree();
                            }
                            var id = elem.getAttribute('id');
                            if (!id) {
                                // inject id if not found
                                id = this.getUniqueId("sendPresence");
                                elem.setAttribute("id", id);
                            }

                            if (typeof callback === "function" || typeof errback === "function") {
                                var handler = this.addHandler(function (stanza) {
                                    // remove timeout handler if there is one
                                    if (timeoutHandler) {
                                        that.deleteTimedHandler(timeoutHandler);
                                    }
                                    var type = stanza.getAttribute('type');
                                    if (type == 'error') {
                                        if (errback) {
                                            errback(stanza);
                                        }
                                    } else if (callback) {
                                        callback(stanza);
                                    }
                                }, null, 'presence', null, id);

                                // if timeout specified, set up a timeout handler.
                                if (timeout) {
                                    timeoutHandler = this.addTimedHandler(timeout, function () {
                                        // get rid of normal handler
                                        that.deleteHandler(handler);
                                        // call errback on timeout with null stanza
                                        if (errback) {
                                            errback(null);
                                        }
                                        return false;
                                    });
                                }
                            }
                            this.send(elem);
                            return id;
                        },

                        /** Function: sendIQ
                         *  Helper function to send IQ stanzas.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The stanza to send.
                         *    (Function) callback - The callback function for a successful request.
                         *    (Function) errback - The callback function for a failed or timed
                         *      out request.  On timeout, the stanza will be null.
                         *    (Integer) timeout - The time specified in milliseconds for a
                         *      timeout to occur.
                         *
                         *  Returns:
                         *    The id used to send the IQ.
                        */
                        sendIQ: function sendIQ(elem, callback, errback, timeout) {
                            var timeoutHandler = null;
                            var that = this;
                            if (typeof elem.tree === "function") {
                                elem = elem.tree();
                            }
                            var id = elem.getAttribute('id');
                            if (!id) {
                                // inject id if not found
                                id = this.getUniqueId("sendIQ");
                                elem.setAttribute("id", id);
                            }

                            if (typeof callback === "function" || typeof errback === "function") {
                                var handler = this.addHandler(function (stanza) {
                                    // remove timeout handler if there is one
                                    if (timeoutHandler) {
                                        that.deleteTimedHandler(timeoutHandler);
                                    }
                                    var iqtype = stanza.getAttribute('type');
                                    if (iqtype == 'result') {
                                        if (callback) {
                                            callback(stanza);
                                        }
                                    } else if (iqtype == 'error') {
                                        if (errback) {
                                            errback(stanza);
                                        }
                                    } else {
                                        throw {
                                            name: "StropheError",
                                            message: "Got bad IQ type of " + iqtype
                                        };
                                    }
                                }, null, 'iq', ['error', 'result'], id);

                                // if timeout specified, set up a timeout handler.
                                if (timeout) {
                                    timeoutHandler = this.addTimedHandler(timeout, function () {
                                        // get rid of normal handler
                                        that.deleteHandler(handler);
                                        // call errback on timeout with null stanza
                                        if (errback) {
                                            errback(null);
                                        }
                                        return false;
                                    });
                                }
                            }
                            this.send(elem);
                            return id;
                        },

                        /** PrivateFunction: _queueData
                         *  Queue outgoing data for later sending.  Also ensures that the data
                         *  is a DOMElement.
                         */
                        _queueData: function _queueData(element) {
                            if (element === null || !element.tagName || !element.childNodes) {
                                throw {
                                    name: "StropheError",
                                    message: "Cannot queue non-DOMElement."
                                };
                            }
                            this._data.push(element);
                        },

                        /** PrivateFunction: _sendRestart
                         *  Send an xmpp:restart stanza.
                         */
                        _sendRestart: function _sendRestart() {
                            this._data.push("restart");
                            this._proto._sendRestart();
                            // XXX: setTimeout should be called only with function expressions (23974bc1)
                            this._idleTimeout = setTimeout(function () {
                                this._onIdle();
                            }.bind(this), 100);
                        },

                        /** Function: addTimedHandler
                         *  Add a timed handler to the connection.
                         *
                         *  This function adds a timed handler.  The provided handler will
                         *  be called every period milliseconds until it returns false,
                         *  the connection is terminated, or the handler is removed.  Handlers
                         *  that wish to continue being invoked should return true.
                         *
                         *  Because of method binding it is necessary to save the result of
                         *  this function if you wish to remove a handler with
                         *  deleteTimedHandler().
                         *
                         *  Note that user handlers are not active until authentication is
                         *  successful.
                         *
                         *  Parameters:
                         *    (Integer) period - The period of the handler.
                         *    (Function) handler - The callback function.
                         *
                         *  Returns:
                         *    A reference to the handler that can be used to remove it.
                         */
                        addTimedHandler: function addTimedHandler(period, handler) {
                            var thand = new Strophe.TimedHandler(period, handler);
                            this.addTimeds.push(thand);
                            return thand;
                        },

                        /** Function: deleteTimedHandler
                         *  Delete a timed handler for a connection.
                         *
                         *  This function removes a timed handler from the connection.  The
                         *  handRef parameter is *not* the function passed to addTimedHandler(),
                         *  but is the reference returned from addTimedHandler().
                         *
                         *  Parameters:
                         *    (Strophe.TimedHandler) handRef - The handler reference.
                         */
                        deleteTimedHandler: function deleteTimedHandler(handRef) {
                            // this must be done in the Idle loop so that we don't change
                            // the handlers during iteration
                            this.removeTimeds.push(handRef);
                        },

                        /** Function: addHandler
                         *  Add a stanza handler for the connection.
                         *
                         *  This function adds a stanza handler to the connection.  The
                         *  handler callback will be called for any stanza that matches
                         *  the parameters.  Note that if multiple parameters are supplied,
                         *  they must all match for the handler to be invoked.
                         *
                         *  The handler will receive the stanza that triggered it as its argument.
                         *  *The handler should return true if it is to be invoked again;
                         *  returning false will remove the handler after it returns.*
                         *
                         *  As a convenience, the ns parameters applies to the top level element
                         *  and also any of its immediate children.  This is primarily to make
                         *  matching /iq/query elements easy.
                         *
                         *  Options
                         *  ~~~~~~~
                         *  With the options argument, you can specify boolean flags that affect how
                         *  matches are being done.
                         *
                         *  Currently two flags exist:
                         *
                         *  - matchBareFromJid:
                         *      When set to true, the from parameter and the
                         *      from attribute on the stanza will be matched as bare JIDs instead
                         *      of full JIDs. To use this, pass {matchBareFromJid: true} as the
                         *      value of options. The default value for matchBareFromJid is false.
                         *
                         *  - ignoreNamespaceFragment:
                         *      When set to true, a fragment specified on the stanza's namespace
                         *      URL will be ignored when it's matched with the one configured for
                         *      the handler.
                         *
                         *      This means that if you register like this:
                         *      >   connection.addHandler(
                         *      >       handler,
                         *      >       'http://jabber.org/protocol/muc',
                         *      >       null, null, null, null,
                         *      >       {'ignoreNamespaceFragment': true}
                         *      >   );
                         *
                         *      Then a stanza with XML namespace of
                         *      'http://jabber.org/protocol/muc#user' will also be matched. If
                         *      'ignoreNamespaceFragment' is false, then only stanzas with
                         *      'http://jabber.org/protocol/muc' will be matched.
                         *
                         *  Deleting the handler
                         *  ~~~~~~~~~~~~~~~~~~~~
                         *  The return value should be saved if you wish to remove the handler
                         *  with deleteHandler().
                         *
                         *  Parameters:
                         *    (Function) handler - The user callback.
                         *    (String) ns - The namespace to match.
                         *    (String) name - The stanza name to match.
                         *    (String|Array) type - The stanza type (or types if an array) to match.
                         *    (String) id - The stanza id attribute to match.
                         *    (String) from - The stanza from attribute to match.
                         *    (String) options - The handler options
                         *
                         *  Returns:
                         *    A reference to the handler that can be used to remove it.
                         */
                        addHandler: function addHandler(handler, ns, name, type, id, from, options) {
                            var hand = new Strophe.Handler(handler, ns, name, type, id, from, options);
                            this.addHandlers.push(hand);
                            return hand;
                        },

                        /** Function: deleteHandler
                         *  Delete a stanza handler for a connection.
                         *
                         *  This function removes a stanza handler from the connection.  The
                         *  handRef parameter is *not* the function passed to addHandler(),
                         *  but is the reference returned from addHandler().
                         *
                         *  Parameters:
                         *    (Strophe.Handler) handRef - The handler reference.
                         */
                        deleteHandler: function deleteHandler(handRef) {
                            // this must be done in the Idle loop so that we don't change
                            // the handlers during iteration
                            this.removeHandlers.push(handRef);
                            // If a handler is being deleted while it is being added,
                            // prevent it from getting added
                            var i = this.addHandlers.indexOf(handRef);
                            if (i >= 0) {
                                this.addHandlers.splice(i, 1);
                            }
                        },

                        /** Function: registerSASLMechanisms
                         *
                         * Register the SASL mechanisms which will be supported by this instance of
                         * Strophe.Connection (i.e. which this XMPP client will support).
                         *
                         *  Parameters:
                         *    (Array) mechanisms - Array of objects with Strophe.SASLMechanism prototypes
                         *
                         */
                        registerSASLMechanisms: function registerSASLMechanisms(mechanisms) {
                            this.mechanisms = {};
                            mechanisms = mechanisms || [Strophe.SASLAnonymous, Strophe.SASLExternal, Strophe.SASLMD5, Strophe.SASLOAuthBearer, Strophe.SASLPlain, Strophe.SASLSHA1];
                            mechanisms.forEach(this.registerSASLMechanism.bind(this));
                        },

                        /** Function: registerSASLMechanism
                         *
                         * Register a single SASL mechanism, to be supported by this client.
                         *
                         *  Parameters:
                         *    (Object) mechanism - Object with a Strophe.SASLMechanism prototype
                         *
                         */
                        registerSASLMechanism: function registerSASLMechanism(mechanism) {
                            this.mechanisms[mechanism.prototype.name] = mechanism;
                        },

                        /** Function: disconnect
                         *  Start the graceful disconnection process.
                         *
                         *  This function starts the disconnection process.  This process starts
                         *  by sending unavailable presence and sending BOSH body of type
                         *  terminate.  A timeout handler makes sure that disconnection happens
                         *  even if the BOSH server does not respond.
                         *  If the Connection object isn't connected, at least tries to abort all pending requests
                         *  so the connection object won't generate successful requests (which were already opened).
                         *
                         *  The user supplied connection callback will be notified of the
                         *  progress as this process happens.
                         *
                         *  Parameters:
                         *    (String) reason - The reason the disconnect is occuring.
                         */
                        disconnect: function disconnect(reason) {
                            this._changeConnectStatus(Strophe.Status.DISCONNECTING, reason);

                            Strophe.info("Disconnect was called because: " + reason);
                            if (this.connected) {
                                var pres = false;
                                this.disconnecting = true;
                                if (this.authenticated) {
                                    pres = $pres({
                                        xmlns: Strophe.NS.CLIENT,
                                        type: 'unavailable'
                                    });
                                }
                                // setup timeout handler
                                this._disconnectTimeout = this._addSysTimedHandler(3000, this._onDisconnectTimeout.bind(this));
                                this._proto._disconnect(pres);
                            } else {
                                Strophe.info("Disconnect was called before Strophe connected to the server");
                                this._proto._abortAllRequests();
                                this._doDisconnect();
                            }
                        },

                        /** PrivateFunction: _changeConnectStatus
                         *  _Private_ helper function that makes sure plugins and the user's
                         *  callback are notified of connection status changes.
                         *
                         *  Parameters:
                         *    (Integer) status - the new connection status, one of the values
                         *      in Strophe.Status
                         *    (String) condition - the error condition or null
                         */
                        _changeConnectStatus: function _changeConnectStatus(status, condition) {
                            // notify all plugins listening for status changes
                            for (var k in Strophe._connectionPlugins) {
                                if (Strophe._connectionPlugins.hasOwnProperty(k)) {
                                    var plugin = this[k];
                                    if (plugin.statusChanged) {
                                        try {
                                            plugin.statusChanged(status, condition);
                                        } catch (err) {
                                            Strophe.error("" + k + " plugin caused an exception " + "changing status: " + err);
                                        }
                                    }
                                }
                            }

                            // notify the user's callback
                            if (this.connect_callback) {
                                try {
                                    this.connect_callback(status, condition);
                                } catch (e) {
                                    Strophe._handleError(e);
                                    Strophe.error("User connection callback caused an " + "exception: " + e);
                                }
                            }
                        },

                        /** PrivateFunction: _doDisconnect
                         *  _Private_ function to disconnect.
                         *
                         *  This is the last piece of the disconnection logic.  This resets the
                         *  connection and alerts the user's connection callback.
                         */
                        _doDisconnect: function _doDisconnect(condition) {
                            if (typeof this._idleTimeout == "number") {
                                clearTimeout(this._idleTimeout);
                            }

                            // Cancel Disconnect Timeout
                            if (this._disconnectTimeout !== null) {
                                this.deleteTimedHandler(this._disconnectTimeout);
                                this._disconnectTimeout = null;
                            }

                            Strophe.info("_doDisconnect was called");
                            this._proto._doDisconnect();

                            this.authenticated = false;
                            this.disconnecting = false;
                            this.restored = false;

                            // delete handlers
                            this.handlers = [];
                            this.timedHandlers = [];
                            this.removeTimeds = [];
                            this.removeHandlers = [];
                            this.addTimeds = [];
                            this.addHandlers = [];

                            // tell the parent we disconnected
                            this._changeConnectStatus(Strophe.Status.DISCONNECTED, condition);
                            this.connected = false;
                        },

                        /** PrivateFunction: _dataRecv
                         *  _Private_ handler to processes incoming data from the the connection.
                         *
                         *  Except for _connect_cb handling the initial connection request,
                         *  this function handles the incoming data for all requests.  This
                         *  function also fires stanza handlers that match each incoming
                         *  stanza.
                         *
                         *  Parameters:
                         *    (Strophe.Request) req - The request that has data ready.
                         *    (string) req - The stanza a raw string (optiona).
                         */
                        _dataRecv: function _dataRecv(req, raw) {
                            Strophe.info("_dataRecv called");
                            var elem = this._proto._reqToData(req);
                            if (elem === null) {
                                return;
                            }

                            if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
                                if (elem.nodeName === this._proto.strip && elem.childNodes.length) {
                                    this.xmlInput(elem.childNodes[0]);
                                } else {
                                    this.xmlInput(elem);
                                }
                            }
                            if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
                                if (raw) {
                                    this.rawInput(raw);
                                } else {
                                    this.rawInput(Strophe.serialize(elem));
                                }
                            }

                            // remove handlers scheduled for deletion
                            var i, hand;
                            while (this.removeHandlers.length > 0) {
                                hand = this.removeHandlers.pop();
                                i = this.handlers.indexOf(hand);
                                if (i >= 0) {
                                    this.handlers.splice(i, 1);
                                }
                            }

                            // add handlers scheduled for addition
                            while (this.addHandlers.length > 0) {
                                this.handlers.push(this.addHandlers.pop());
                            }

                            // handle graceful disconnect
                            if (this.disconnecting && this._proto._emptyQueue()) {
                                this._doDisconnect();
                                return;
                            }

                            var type = elem.getAttribute("type");
                            var cond, conflict;
                            if (type !== null && type == "terminate") {
                                // Don't process stanzas that come in after disconnect
                                if (this.disconnecting) {
                                    return;
                                }

                                // an error occurred
                                cond = elem.getAttribute("condition");
                                conflict = elem.getElementsByTagName("conflict");
                                if (cond !== null) {
                                    if (cond == "remote-stream-error" && conflict.length > 0) {
                                        cond = "conflict";
                                    }
                                    this._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
                                } else {
                                    this._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
                                }
                                this._doDisconnect(cond);
                                return;
                            }

                            // send each incoming stanza through the handler chain
                            var that = this;
                            Strophe.forEachChild(elem, null, function (child) {
                                var i, newList;
                                // process handlers
                                newList = that.handlers;
                                that.handlers = [];
                                for (i = 0; i < newList.length; i++) {
                                    var hand = newList[i];
                                    // encapsulate 'handler.run' not to lose the whole handler list if
                                    // one of the handlers throws an exception
                                    try {
                                        if (hand.isMatch(child) && (that.authenticated || !hand.user)) {
                                            if (hand.run(child)) {
                                                that.handlers.push(hand);
                                            }
                                        } else {
                                            that.handlers.push(hand);
                                        }
                                    } catch (e) {
                                        // if the handler throws an exception, we consider it as false
                                        Strophe.warn('Removing Strophe handlers due to uncaught exception: ' + e.message);
                                    }
                                }
                            });
                        },

                        /** Attribute: mechanisms
                         *  SASL Mechanisms available for Connection.
                         */
                        mechanisms: {},

                        /** PrivateFunction: _connect_cb
                         *  _Private_ handler for initial connection request.
                         *
                         *  This handler is used to process the initial connection request
                         *  response from the BOSH server. It is used to set up authentication
                         *  handlers and start the authentication process.
                         *
                         *  SASL authentication will be attempted if available, otherwise
                         *  the code will fall back to legacy authentication.
                         *
                         *  Parameters:
                         *    (Strophe.Request) req - The current request.
                         *    (Function) _callback - low level (xmpp) connect callback function.
                         *      Useful for plugins with their own xmpp connect callback (when their)
                         *      want to do something special).
                         */
                        _connect_cb: function _connect_cb(req, _callback, raw) {
                            Strophe.info("_connect_cb was called");
                            this.connected = true;

                            var bodyWrap;
                            try {
                                bodyWrap = this._proto._reqToData(req);
                            } catch (e) {
                                if (e != "badformat") {
                                    throw e;
                                }
                                this._changeConnectStatus(Strophe.Status.CONNFAIL, 'bad-format');
                                this._doDisconnect('bad-format');
                            }
                            if (!bodyWrap) {
                                return;
                            }

                            if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
                                if (bodyWrap.nodeName === this._proto.strip && bodyWrap.childNodes.length) {
                                    this.xmlInput(bodyWrap.childNodes[0]);
                                } else {
                                    this.xmlInput(bodyWrap);
                                }
                            }
                            if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
                                if (raw) {
                                    this.rawInput(raw);
                                } else {
                                    this.rawInput(Strophe.serialize(bodyWrap));
                                }
                            }

                            var conncheck = this._proto._connect_cb(bodyWrap);
                            if (conncheck === Strophe.Status.CONNFAIL) {
                                return;
                            }

                            // Check for the stream:features tag
                            var hasFeatures;
                            if (bodyWrap.getElementsByTagNameNS) {
                                hasFeatures = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, "features").length > 0;
                            } else {
                                hasFeatures = bodyWrap.getElementsByTagName("stream:features").length > 0 || bodyWrap.getElementsByTagName("features").length > 0;
                            }
                            if (!hasFeatures) {
                                this._proto._no_auth_received(_callback);
                                return;
                            }

                            var matched = [],
                                i,
                                mech;
                            var mechanisms = bodyWrap.getElementsByTagName("mechanism");
                            if (mechanisms.length > 0) {
                                for (i = 0; i < mechanisms.length; i++) {
                                    mech = Strophe.getText(mechanisms[i]);
                                    if (this.mechanisms[mech]) matched.push(this.mechanisms[mech]);
                                }
                            }
                            if (matched.length === 0) {
                                if (bodyWrap.getElementsByTagName("auth").length === 0) {
                                    // There are no matching SASL mechanisms and also no legacy
                                    // auth available.
                                    this._proto._no_auth_received(_callback);
                                    return;
                                }
                            }
                            if (this.do_authentication !== false) {
                                this.authenticate(matched);
                            }
                        },

                        /** Function: sortMechanismsByPriority
                         *
                         *  Sorts an array of objects with prototype SASLMechanism according to
                         *  their priorities.
                         *
                         *  Parameters:
                         *    (Array) mechanisms - Array of SASL mechanisms.
                         *
                         */
                        sortMechanismsByPriority: function sortMechanismsByPriority(mechanisms) {
                            // Sorting mechanisms according to priority.
                            var i, j, higher, swap;
                            for (i = 0; i < mechanisms.length - 1; ++i) {
                                higher = i;
                                for (j = i + 1; j < mechanisms.length; ++j) {
                                    if (mechanisms[j].prototype.priority > mechanisms[higher].prototype.priority) {
                                        higher = j;
                                    }
                                }
                                if (higher != i) {
                                    swap = mechanisms[i];
                                    mechanisms[i] = mechanisms[higher];
                                    mechanisms[higher] = swap;
                                }
                            }
                            return mechanisms;
                        },

                        /** PrivateFunction: _attemptSASLAuth
                         *
                         *  Iterate through an array of SASL mechanisms and attempt authentication
                         *  with the highest priority (enabled) mechanism.
                         *
                         *  Parameters:
                         *    (Array) mechanisms - Array of SASL mechanisms.
                         *
                         *  Returns:
                         *    (Boolean) mechanism_found - true or false, depending on whether a
                         *          valid SASL mechanism was found with which authentication could be
                         *          started.
                         */
                        _attemptSASLAuth: function _attemptSASLAuth(mechanisms) {
                            mechanisms = this.sortMechanismsByPriority(mechanisms || []);
                            var i = 0,
                                mechanism_found = false;
                            for (i = 0; i < mechanisms.length; ++i) {
                                if (!mechanisms[i].prototype.test(this)) {
                                    continue;
                                }
                                this._sasl_success_handler = this._addSysHandler(this._sasl_success_cb.bind(this), null, "success", null, null);
                                this._sasl_failure_handler = this._addSysHandler(this._sasl_failure_cb.bind(this), null, "failure", null, null);
                                this._sasl_challenge_handler = this._addSysHandler(this._sasl_challenge_cb.bind(this), null, "challenge", null, null);

                                this._sasl_mechanism = new mechanisms[i]();
                                this._sasl_mechanism.onStart(this);

                                var request_auth_exchange = $build("auth", {
                                    xmlns: Strophe.NS.SASL,
                                    mechanism: this._sasl_mechanism.name
                                });
                                if (this._sasl_mechanism.isClientFirst) {
                                    var response = this._sasl_mechanism.onChallenge(this, null);
                                    request_auth_exchange.t(Base64.encode(response));
                                }
                                this.send(request_auth_exchange.tree());
                                mechanism_found = true;
                                break;
                            }
                            return mechanism_found;
                        },

                        /** PrivateFunction: _attemptLegacyAuth
                         *
                         *  Attempt legacy (i.e. non-SASL) authentication.
                         *
                         */
                        _attemptLegacyAuth: function _attemptLegacyAuth() {
                            if (Strophe.getNodeFromJid(this.jid) === null) {
                                // we don't have a node, which is required for non-anonymous
                                // client connections
                                this._changeConnectStatus(Strophe.Status.CONNFAIL, 'x-strophe-bad-non-anon-jid');
                                this.disconnect('x-strophe-bad-non-anon-jid');
                            } else {
                                // Fall back to legacy authentication
                                this._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
                                this._addSysHandler(this._auth1_cb.bind(this), null, null, null, "_auth_1");
                                this.send($iq({
                                    'type': "get",
                                    'to': this.domain,
                                    'id': "_auth_1"
                                }).c("query", { xmlns: Strophe.NS.AUTH }).c("username", {}).t(Strophe.getNodeFromJid(this.jid)).tree());
                            }
                        },

                        /** Function: authenticate
                         * Set up authentication
                         *
                         *  Continues the initial connection request by setting up authentication
                         *  handlers and starting the authentication process.
                         *
                         *  SASL authentication will be attempted if available, otherwise
                         *  the code will fall back to legacy authentication.
                         *
                         *  Parameters:
                         *    (Array) matched - Array of SASL mechanisms supported.
                         *
                         */
                        authenticate: function authenticate(matched) {
                            if (!this._attemptSASLAuth(matched)) {
                                this._attemptLegacyAuth();
                            }
                        },

                        /** PrivateFunction: _sasl_challenge_cb
                         *  _Private_ handler for the SASL challenge
                         *
                         */
                        _sasl_challenge_cb: function _sasl_challenge_cb(elem) {
                            var challenge = Base64.decode(Strophe.getText(elem));
                            var response = this._sasl_mechanism.onChallenge(this, challenge);
                            var stanza = $build('response', {
                                'xmlns': Strophe.NS.SASL
                            });
                            if (response !== "") {
                                stanza.t(Base64.encode(response));
                            }
                            this.send(stanza.tree());
                            return true;
                        },

                        /** PrivateFunction: _auth1_cb
                         *  _Private_ handler for legacy authentication.
                         *
                         *  This handler is called in response to the initial <iq type='get'/>
                         *  for legacy authentication.  It builds an authentication <iq/> and
                         *  sends it, creating a handler (calling back to _auth2_cb()) to
                         *  handle the result
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The stanza that triggered the callback.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        /* jshint unused:false */
                        _auth1_cb: function _auth1_cb(elem) {
                            // build plaintext auth iq
                            var iq = $iq({ type: "set", id: "_auth_2" }).c('query', { xmlns: Strophe.NS.AUTH }).c('username', {}).t(Strophe.getNodeFromJid(this.jid)).up().c('password').t(this.pass);

                            if (!Strophe.getResourceFromJid(this.jid)) {
                                // since the user has not supplied a resource, we pick
                                // a default one here.  unlike other auth methods, the server
                                // cannot do this for us.
                                this.jid = Strophe.getBareJidFromJid(this.jid) + '/strophe';
                            }
                            iq.up().c('resource', {}).t(Strophe.getResourceFromJid(this.jid));

                            this._addSysHandler(this._auth2_cb.bind(this), null, null, null, "_auth_2");
                            this.send(iq.tree());
                            return false;
                        },
                        /* jshint unused:true */

                        /** PrivateFunction: _sasl_success_cb
                         *  _Private_ handler for succesful SASL authentication.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The matching stanza.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        _sasl_success_cb: function _sasl_success_cb(elem) {
                            if (this._sasl_data["server-signature"]) {
                                var serverSignature;
                                var success = Base64.decode(Strophe.getText(elem));
                                var attribMatch = /([a-z]+)=([^,]+)(,|$)/;
                                var matches = success.match(attribMatch);
                                if (matches[1] == "v") {
                                    serverSignature = matches[2];
                                }

                                if (serverSignature != this._sasl_data["server-signature"]) {
                                    // remove old handlers
                                    this.deleteHandler(this._sasl_failure_handler);
                                    this._sasl_failure_handler = null;
                                    if (this._sasl_challenge_handler) {
                                        this.deleteHandler(this._sasl_challenge_handler);
                                        this._sasl_challenge_handler = null;
                                    }

                                    this._sasl_data = {};
                                    return this._sasl_failure_cb(null);
                                }
                            }
                            Strophe.info("SASL authentication succeeded.");

                            if (this._sasl_mechanism) {
                                this._sasl_mechanism.onSuccess();
                            }

                            // remove old handlers
                            this.deleteHandler(this._sasl_failure_handler);
                            this._sasl_failure_handler = null;
                            if (this._sasl_challenge_handler) {
                                this.deleteHandler(this._sasl_challenge_handler);
                                this._sasl_challenge_handler = null;
                            }

                            var streamfeature_handlers = [];
                            var wrapper = function wrapper(handlers, elem) {
                                while (handlers.length) {
                                    this.deleteHandler(handlers.pop());
                                }
                                this._sasl_auth1_cb.bind(this)(elem);
                                return false;
                            };
                            streamfeature_handlers.push(this._addSysHandler(function (elem) {
                                wrapper.bind(this)(streamfeature_handlers, elem);
                            }.bind(this), null, "stream:features", null, null));
                            streamfeature_handlers.push(this._addSysHandler(function (elem) {
                                wrapper.bind(this)(streamfeature_handlers, elem);
                            }.bind(this), Strophe.NS.STREAM, "features", null, null));

                            // we must send an xmpp:restart now
                            this._sendRestart();

                            return false;
                        },

                        /** PrivateFunction: _sasl_auth1_cb
                         *  _Private_ handler to start stream binding.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The matching stanza.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        _sasl_auth1_cb: function _sasl_auth1_cb(elem) {
                            // save stream:features for future usage
                            this.features = elem;
                            var i, child;
                            for (i = 0; i < elem.childNodes.length; i++) {
                                child = elem.childNodes[i];
                                if (child.nodeName == 'bind') {
                                    this.do_bind = true;
                                }

                                if (child.nodeName == 'session') {
                                    this.do_session = true;
                                }
                            }

                            if (!this.do_bind) {
                                this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                                return false;
                            } else {
                                this._addSysHandler(this._sasl_bind_cb.bind(this), null, null, null, "_bind_auth_2");

                                var resource = Strophe.getResourceFromJid(this.jid);
                                if (resource) {
                                    this.send($iq({ type: "set", id: "_bind_auth_2" }).c('bind', { xmlns: Strophe.NS.BIND }).c('resource', {}).t(resource).tree());
                                } else {
                                    this.send($iq({ type: "set", id: "_bind_auth_2" }).c('bind', { xmlns: Strophe.NS.BIND }).tree());
                                }
                            }
                            return false;
                        },

                        /** PrivateFunction: _sasl_bind_cb
                         *  _Private_ handler for binding result and session start.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The matching stanza.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        _sasl_bind_cb: function _sasl_bind_cb(elem) {
                            if (elem.getAttribute("type") == "error") {
                                Strophe.info("SASL binding failed.");
                                var conflict = elem.getElementsByTagName("conflict"),
                                    condition;
                                if (conflict.length > 0) {
                                    condition = 'conflict';
                                }
                                this._changeConnectStatus(Strophe.Status.AUTHFAIL, condition);
                                return false;
                            }

                            // TODO - need to grab errors
                            var bind = elem.getElementsByTagName("bind");
                            var jidNode;
                            if (bind.length > 0) {
                                // Grab jid
                                jidNode = bind[0].getElementsByTagName("jid");
                                if (jidNode.length > 0) {
                                    this.jid = Strophe.getText(jidNode[0]);

                                    if (this.do_session) {
                                        this._addSysHandler(this._sasl_session_cb.bind(this), null, null, null, "_session_auth_2");

                                        this.send($iq({ type: "set", id: "_session_auth_2" }).c('session', { xmlns: Strophe.NS.SESSION }).tree());
                                    } else {
                                        this.authenticated = true;
                                        this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                                    }
                                }
                            } else {
                                Strophe.info("SASL binding failed.");
                                this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                                return false;
                            }
                        },

                        /** PrivateFunction: _sasl_session_cb
                         *  _Private_ handler to finish successful SASL connection.
                         *
                         *  This sets Connection.authenticated to true on success, which
                         *  starts the processing of user handlers.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The matching stanza.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        _sasl_session_cb: function _sasl_session_cb(elem) {
                            if (elem.getAttribute("type") == "result") {
                                this.authenticated = true;
                                this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                            } else if (elem.getAttribute("type") == "error") {
                                Strophe.info("Session creation failed.");
                                this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                                return false;
                            }
                            return false;
                        },

                        /** PrivateFunction: _sasl_failure_cb
                         *  _Private_ handler for SASL authentication failure.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The matching stanza.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        /* jshint unused:false */
                        _sasl_failure_cb: function _sasl_failure_cb(elem) {
                            // delete unneeded handlers
                            if (this._sasl_success_handler) {
                                this.deleteHandler(this._sasl_success_handler);
                                this._sasl_success_handler = null;
                            }
                            if (this._sasl_challenge_handler) {
                                this.deleteHandler(this._sasl_challenge_handler);
                                this._sasl_challenge_handler = null;
                            }

                            if (this._sasl_mechanism) this._sasl_mechanism.onFailure();
                            this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                            return false;
                        },
                        /* jshint unused:true */

                        /** PrivateFunction: _auth2_cb
                         *  _Private_ handler to finish legacy authentication.
                         *
                         *  This handler is called when the result from the jabber:iq:auth
                         *  <iq/> stanza is returned.
                         *
                         *  Parameters:
                         *    (XMLElement) elem - The stanza that triggered the callback.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        _auth2_cb: function _auth2_cb(elem) {
                            if (elem.getAttribute("type") == "result") {
                                this.authenticated = true;
                                this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                            } else if (elem.getAttribute("type") == "error") {
                                this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                                this.disconnect('authentication failed');
                            }
                            return false;
                        },

                        /** PrivateFunction: _addSysTimedHandler
                         *  _Private_ function to add a system level timed handler.
                         *
                         *  This function is used to add a Strophe.TimedHandler for the
                         *  library code.  System timed handlers are allowed to run before
                         *  authentication is complete.
                         *
                         *  Parameters:
                         *    (Integer) period - The period of the handler.
                         *    (Function) handler - The callback function.
                         */
                        _addSysTimedHandler: function _addSysTimedHandler(period, handler) {
                            var thand = new Strophe.TimedHandler(period, handler);
                            thand.user = false;
                            this.addTimeds.push(thand);
                            return thand;
                        },

                        /** PrivateFunction: _addSysHandler
                         *  _Private_ function to add a system level stanza handler.
                         *
                         *  This function is used to add a Strophe.Handler for the
                         *  library code.  System stanza handlers are allowed to run before
                         *  authentication is complete.
                         *
                         *  Parameters:
                         *    (Function) handler - The callback function.
                         *    (String) ns - The namespace to match.
                         *    (String) name - The stanza name to match.
                         *    (String) type - The stanza type attribute to match.
                         *    (String) id - The stanza id attribute to match.
                         */
                        _addSysHandler: function _addSysHandler(handler, ns, name, type, id) {
                            var hand = new Strophe.Handler(handler, ns, name, type, id);
                            hand.user = false;
                            this.addHandlers.push(hand);
                            return hand;
                        },

                        /** PrivateFunction: _onDisconnectTimeout
                         *  _Private_ timeout handler for handling non-graceful disconnection.
                         *
                         *  If the graceful disconnect process does not complete within the
                         *  time allotted, this handler finishes the disconnect anyway.
                         *
                         *  Returns:
                         *    false to remove the handler.
                         */
                        _onDisconnectTimeout: function _onDisconnectTimeout() {
                            Strophe.info("_onDisconnectTimeout was called");
                            this._changeConnectStatus(Strophe.Status.CONNTIMEOUT, null);
                            this._proto._onDisconnectTimeout();
                            // actually disconnect
                            this._doDisconnect();
                            return false;
                        },

                        /** PrivateFunction: _onIdle
                         *  _Private_ handler to process events during idle cycle.
                         *
                         *  This handler is called every 100ms to fire timed handlers that
                         *  are ready and keep poll requests going.
                         */
                        _onIdle: function _onIdle() {
                            var i, thand, since, newList;

                            // add timed handlers scheduled for addition
                            // NOTE: we add before remove in the case a timed handler is
                            // added and then deleted before the next _onIdle() call.
                            while (this.addTimeds.length > 0) {
                                this.timedHandlers.push(this.addTimeds.pop());
                            }

                            // remove timed handlers that have been scheduled for deletion
                            while (this.removeTimeds.length > 0) {
                                thand = this.removeTimeds.pop();
                                i = this.timedHandlers.indexOf(thand);
                                if (i >= 0) {
                                    this.timedHandlers.splice(i, 1);
                                }
                            }

                            // call ready timed handlers
                            var now = new Date().getTime();
                            newList = [];
                            for (i = 0; i < this.timedHandlers.length; i++) {
                                thand = this.timedHandlers[i];
                                if (this.authenticated || !thand.user) {
                                    since = thand.lastCalled + thand.period;
                                    if (since - now <= 0) {
                                        if (thand.run()) {
                                            newList.push(thand);
                                        }
                                    } else {
                                        newList.push(thand);
                                    }
                                }
                            }
                            this.timedHandlers = newList;

                            clearTimeout(this._idleTimeout);

                            this._proto._onIdle();

                            // reactivate the timer only if connected
                            if (this.connected) {
                                // XXX: setTimeout should be called only with function expressions (23974bc1)
                                this._idleTimeout = setTimeout(function () {
                                    this._onIdle();
                                }.bind(this), 100);
                            }
                        }
                    };

                    /** Class: Strophe.SASLMechanism
                     *
                     *  encapsulates SASL authentication mechanisms.
                     *
                     *  User code may override the priority for each mechanism or disable it completely.
                     *  See <priority> for information about changing priority and <test> for informatian on
                     *  how to disable a mechanism.
                     *
                     *  By default, all mechanisms are enabled and the priorities are
                     *
                     *  EXTERNAL - 60
                     *  OAUTHBEARER - 50
                     *  SCRAM-SHA1 - 40
                     *  DIGEST-MD5 - 30
                     *  PLAIN - 20
                     *  ANONYMOUS - 10
                     *
                     *  See: Strophe.Connection.addSupportedSASLMechanisms
                     */

                    /**
                     * PrivateConstructor: Strophe.SASLMechanism
                     * SASL auth mechanism abstraction.
                     *
                     *  Parameters:
                     *    (String) name - SASL Mechanism name.
                     *    (Boolean) isClientFirst - If client should send response first without challenge.
                     *    (Number) priority - Priority.
                     *
                     *  Returns:
                     *    A new Strophe.SASLMechanism object.
                     */
                    Strophe.SASLMechanism = function (name, isClientFirst, priority) {
                        /** PrivateVariable: name
                         *  Mechanism name.
                         */
                        this.name = name;
                        /** PrivateVariable: isClientFirst
                         *  If client sends response without initial server challenge.
                         */
                        this.isClientFirst = isClientFirst;
                        /** Variable: priority
                         *  Determines which <SASLMechanism> is chosen for authentication (Higher is better).
                         *  Users may override this to prioritize mechanisms differently.
                         *
                         *  In the default configuration the priorities are
                         *
                         *  SCRAM-SHA1 - 40
                         *  DIGEST-MD5 - 30
                         *  Plain - 20
                         *
                         *  Example: (This will cause Strophe to choose the mechanism that the server sent first)
                         *
                         *  > Strophe.SASLMD5.priority = Strophe.SASLSHA1.priority;
                         *
                         *  See <SASL mechanisms> for a list of available mechanisms.
                         *
                         */
                        this.priority = priority;
                    };

                    Strophe.SASLMechanism.prototype = {
                        /**
                         *  Function: test
                         *  Checks if mechanism able to run.
                         *  To disable a mechanism, make this return false;
                         *
                         *  To disable plain authentication run
                         *  > Strophe.SASLPlain.test = function() {
                         *  >   return false;
                         *  > }
                         *
                         *  See <SASL mechanisms> for a list of available mechanisms.
                         *
                         *  Parameters:
                         *    (Strophe.Connection) connection - Target Connection.
                         *
                         *  Returns:
                         *    (Boolean) If mechanism was able to run.
                         */
                        /* jshint unused:false */
                        test: function test(connection) {
                            return true;
                        },
                        /* jshint unused:true */

                        /** PrivateFunction: onStart
                         *  Called before starting mechanism on some connection.
                         *
                         *  Parameters:
                         *    (Strophe.Connection) connection - Target Connection.
                         */
                        onStart: function onStart(connection) {
                            this._connection = connection;
                        },

                        /** PrivateFunction: onChallenge
                         *  Called by protocol implementation on incoming challenge. If client is
                         *  first (isClientFirst == true) challenge will be null on the first call.
                         *
                         *  Parameters:
                         *    (Strophe.Connection) connection - Target Connection.
                         *    (String) challenge - current challenge to handle.
                         *
                         *  Returns:
                         *    (String) Mechanism response.
                         */
                        /* jshint unused:false */
                        onChallenge: function onChallenge(connection, challenge) {
                            throw new Error("You should implement challenge handling!");
                        },
                        /* jshint unused:true */

                        /** PrivateFunction: onFailure
                         *  Protocol informs mechanism implementation about SASL failure.
                         */
                        onFailure: function onFailure() {
                            this._connection = null;
                        },

                        /** PrivateFunction: onSuccess
                         *  Protocol informs mechanism implementation about SASL success.
                         */
                        onSuccess: function onSuccess() {
                            this._connection = null;
                        }
                    };

                    /** Constants: SASL mechanisms
                     *  Available authentication mechanisms
                     *
                     *  Strophe.SASLAnonymous - SASL ANONYMOUS authentication.
                     *  Strophe.SASLPlain - SASL PLAIN authentication.
                     *  Strophe.SASLMD5 - SASL DIGEST-MD5 authentication
                     *  Strophe.SASLSHA1 - SASL SCRAM-SHA1 authentication
                     *  Strophe.SASLOAuthBearer - SASL OAuth Bearer authentication
                     *  Strophe.SASLExternal - SASL EXTERNAL authentication
                     */

                    // Building SASL callbacks

                    /** PrivateConstructor: SASLAnonymous
                     *  SASL ANONYMOUS authentication.
                     */
                    Strophe.SASLAnonymous = function () {};
                    Strophe.SASLAnonymous.prototype = new Strophe.SASLMechanism("ANONYMOUS", false, 10);

                    Strophe.SASLAnonymous.prototype.test = function (connection) {
                        return connection.authcid === null;
                    };

                    /** PrivateConstructor: SASLPlain
                     *  SASL PLAIN authentication.
                     */
                    Strophe.SASLPlain = function () {};
                    Strophe.SASLPlain.prototype = new Strophe.SASLMechanism("PLAIN", true, 20);

                    Strophe.SASLPlain.prototype.test = function (connection) {
                        return connection.authcid !== null;
                    };

                    Strophe.SASLPlain.prototype.onChallenge = function (connection) {
                        var auth_str = connection.authzid;
                        auth_str = auth_str + "\0";
                        auth_str = auth_str + connection.authcid;
                        auth_str = auth_str + "\0";
                        auth_str = auth_str + connection.pass;
                        return utils.utf16to8(auth_str);
                    };

                    /** PrivateConstructor: SASLSHA1
                     *  SASL SCRAM SHA 1 authentication.
                     */
                    Strophe.SASLSHA1 = function () {};
                    Strophe.SASLSHA1.prototype = new Strophe.SASLMechanism("SCRAM-SHA-1", true, 40);

                    Strophe.SASLSHA1.prototype.test = function (connection) {
                        return connection.authcid !== null;
                    };

                    Strophe.SASLSHA1.prototype.onChallenge = function (connection, challenge, test_cnonce) {
                        var cnonce = test_cnonce || MD5.hexdigest(Math.random() * 1234567890);
                        var auth_str = "n=" + utils.utf16to8(connection.authcid);
                        auth_str += ",r=";
                        auth_str += cnonce;
                        connection._sasl_data.cnonce = cnonce;
                        connection._sasl_data["client-first-message-bare"] = auth_str;

                        auth_str = "n,," + auth_str;

                        this.onChallenge = function (connection, challenge) {
                            var nonce, salt, iter, Hi, U, U_old, i, k, pass;
                            var clientKey, serverKey, clientSignature;
                            var responseText = "c=biws,";
                            var authMessage = connection._sasl_data["client-first-message-bare"] + "," + challenge + ",";
                            var cnonce = connection._sasl_data.cnonce;
                            var attribMatch = /([a-z]+)=([^,]+)(,|$)/;

                            while (challenge.match(attribMatch)) {
                                var matches = challenge.match(attribMatch);
                                challenge = challenge.replace(matches[0], "");
                                switch (matches[1]) {
                                    case "r":
                                        nonce = matches[2];
                                        break;
                                    case "s":
                                        salt = matches[2];
                                        break;
                                    case "i":
                                        iter = matches[2];
                                        break;
                                }
                            }

                            if (nonce.substr(0, cnonce.length) !== cnonce) {
                                connection._sasl_data = {};
                                return connection._sasl_failure_cb();
                            }

                            responseText += "r=" + nonce;
                            authMessage += responseText;

                            salt = Base64.decode(salt);
                            salt += "\x00\x00\x00\x01";

                            pass = utils.utf16to8(connection.pass);
                            Hi = U_old = SHA1.core_hmac_sha1(pass, salt);
                            for (i = 1; i < iter; i++) {
                                U = SHA1.core_hmac_sha1(pass, SHA1.binb2str(U_old));
                                for (k = 0; k < 5; k++) {
                                    Hi[k] ^= U[k];
                                }
                                U_old = U;
                            }
                            Hi = SHA1.binb2str(Hi);

                            clientKey = SHA1.core_hmac_sha1(Hi, "Client Key");
                            serverKey = SHA1.str_hmac_sha1(Hi, "Server Key");
                            clientSignature = SHA1.core_hmac_sha1(SHA1.str_sha1(SHA1.binb2str(clientKey)), authMessage);
                            connection._sasl_data["server-signature"] = SHA1.b64_hmac_sha1(serverKey, authMessage);

                            for (k = 0; k < 5; k++) {
                                clientKey[k] ^= clientSignature[k];
                            }

                            responseText += ",p=" + Base64.encode(SHA1.binb2str(clientKey));
                            return responseText;
                        }.bind(this);

                        return auth_str;
                    };

                    /** PrivateConstructor: SASLMD5
                     *  SASL DIGEST MD5 authentication.
                     */
                    Strophe.SASLMD5 = function () {};
                    Strophe.SASLMD5.prototype = new Strophe.SASLMechanism("DIGEST-MD5", false, 30);

                    Strophe.SASLMD5.prototype.test = function (connection) {
                        return connection.authcid !== null;
                    };

                    /** PrivateFunction: _quote
                     *  _Private_ utility function to backslash escape and quote strings.
                     *
                     *  Parameters:
                     *    (String) str - The string to be quoted.
                     *
                     *  Returns:
                     *    quoted string
                     */
                    Strophe.SASLMD5.prototype._quote = function (str) {
                        return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
                        //" end string workaround for emacs
                    };

                    Strophe.SASLMD5.prototype.onChallenge = function (connection, challenge, test_cnonce) {
                        var attribMatch = /([a-z]+)=("[^"]+"|[^,"]+)(?:,|$)/;
                        var cnonce = test_cnonce || MD5.hexdigest("" + Math.random() * 1234567890);
                        var realm = "";
                        var host = null;
                        var nonce = "";
                        var qop = "";
                        var matches;

                        while (challenge.match(attribMatch)) {
                            matches = challenge.match(attribMatch);
                            challenge = challenge.replace(matches[0], "");
                            matches[2] = matches[2].replace(/^"(.+)"$/, "$1");
                            switch (matches[1]) {
                                case "realm":
                                    realm = matches[2];
                                    break;
                                case "nonce":
                                    nonce = matches[2];
                                    break;
                                case "qop":
                                    qop = matches[2];
                                    break;
                                case "host":
                                    host = matches[2];
                                    break;
                            }
                        }

                        var digest_uri = connection.servtype + "/" + connection.domain;
                        if (host !== null) {
                            digest_uri = digest_uri + "/" + host;
                        }

                        var cred = utils.utf16to8(connection.authcid + ":" + realm + ":" + this._connection.pass);
                        var A1 = MD5.hash(cred) + ":" + nonce + ":" + cnonce;
                        var A2 = 'AUTHENTICATE:' + digest_uri;

                        var responseText = "";
                        responseText += 'charset=utf-8,';
                        responseText += 'username=' + this._quote(utils.utf16to8(connection.authcid)) + ',';
                        responseText += 'realm=' + this._quote(realm) + ',';
                        responseText += 'nonce=' + this._quote(nonce) + ',';
                        responseText += 'nc=00000001,';
                        responseText += 'cnonce=' + this._quote(cnonce) + ',';
                        responseText += 'digest-uri=' + this._quote(digest_uri) + ',';
                        responseText += 'response=' + MD5.hexdigest(MD5.hexdigest(A1) + ":" + nonce + ":00000001:" + cnonce + ":auth:" + MD5.hexdigest(A2)) + ",";
                        responseText += 'qop=auth';

                        this.onChallenge = function () {
                            return "";
                        };
                        return responseText;
                    };

                    /** PrivateConstructor: SASLOAuthBearer
                     *  SASL OAuth Bearer authentication.
                     */
                    Strophe.SASLOAuthBearer = function () {};
                    Strophe.SASLOAuthBearer.prototype = new Strophe.SASLMechanism("OAUTHBEARER", true, 50);

                    Strophe.SASLOAuthBearer.prototype.test = function (connection) {
                        return connection.authcid !== null;
                    };

                    Strophe.SASLOAuthBearer.prototype.onChallenge = function (connection) {
                        var auth_str = 'n,a=';
                        auth_str = auth_str + connection.authzid;
                        auth_str = auth_str + ',';
                        auth_str = auth_str + "\x01";
                        auth_str = auth_str + 'auth=Bearer ';
                        auth_str = auth_str + connection.pass;
                        auth_str = auth_str + "\x01";
                        auth_str = auth_str + "\x01";
                        return utils.utf16to8(auth_str);
                    };

                    /** PrivateConstructor: SASLExternal
                     *  SASL EXTERNAL authentication.
                     *
                     *  The EXTERNAL mechanism allows a client to request the server to use
                     *  credentials established by means external to the mechanism to
                     *  authenticate the client. The external means may be, for instance,
                     *  TLS services.
                     */
                    Strophe.SASLExternal = function () {};
                    Strophe.SASLExternal.prototype = new Strophe.SASLMechanism("EXTERNAL", true, 60);

                    Strophe.SASLExternal.prototype.onChallenge = function (connection) {
                        /** According to XEP-178, an authzid SHOULD NOT be presented when the
                         * authcid contained or implied in the client certificate is the JID (i.e.
                         * authzid) with which the user wants to log in as.
                         *
                         * To NOT send the authzid, the user should therefore set the authcid equal
                         * to the JID when instantiating a new Strophe.Connection object.
                         */
                        return connection.authcid === connection.authzid ? '' : connection.authzid;
                    };

                    return {
                        Strophe: Strophe,
                        $build: $build,
                        $msg: $msg,
                        $iq: $iq,
                        $pres: $pres,
                        SHA1: SHA1,
                        Base64: Base64,
                        MD5: MD5
                    };
                });

                /*
                    This program is distributed under the terms of the MIT license.
                    Please see the LICENSE file for details.
                
                    Copyright 2006-2008, OGG, LLC
                */

                /* jshint undef: true, unused: true:, noarg: true, latedef: true */
                /* global define, window, setTimeout, clearTimeout, XMLHttpRequest, ActiveXObject, Strophe, $build */

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-bosh', ['strophe-core'], function (core) {
                            return factory(core.Strophe, core.$build);
                        });
                    } else {
                        // Browser globals
                        return factory(Strophe, $build);
                    }
                })(this, function (Strophe, $build) {

                    /** PrivateClass: Strophe.Request
                     *  _Private_ helper class that provides a cross implementation abstraction
                     *  for a BOSH related XMLHttpRequest.
                     *
                     *  The Strophe.Request class is used internally to encapsulate BOSH request
                     *  information.  It is not meant to be used from user's code.
                     */

                    /** PrivateConstructor: Strophe.Request
                     *  Create and initialize a new Strophe.Request object.
                     *
                     *  Parameters:
                     *    (XMLElement) elem - The XML data to be sent in the request.
                     *    (Function) func - The function that will be called when the
                     *      XMLHttpRequest readyState changes.
                     *    (Integer) rid - The BOSH rid attribute associated with this request.
                     *    (Integer) sends - The number of times this same request has been sent.
                     */
                    Strophe.Request = function (elem, func, rid, sends) {
                        this.id = ++Strophe._requestId;
                        this.xmlData = elem;
                        this.data = Strophe.serialize(elem);
                        // save original function in case we need to make a new request
                        // from this one.
                        this.origFunc = func;
                        this.func = func;
                        this.rid = rid;
                        this.date = NaN;
                        this.sends = sends || 0;
                        this.abort = false;
                        this.dead = null;

                        this.age = function () {
                            if (!this.date) {
                                return 0;
                            }
                            var now = new Date();
                            return (now - this.date) / 1000;
                        };
                        this.timeDead = function () {
                            if (!this.dead) {
                                return 0;
                            }
                            var now = new Date();
                            return (now - this.dead) / 1000;
                        };
                        this.xhr = this._newXHR();
                    };

                    Strophe.Request.prototype = {
                        /** PrivateFunction: getResponse
                         *  Get a response from the underlying XMLHttpRequest.
                         *
                         *  This function attempts to get a response from the request and checks
                         *  for errors.
                         *
                         *  Throws:
                         *    "parsererror" - A parser error occured.
                         *    "badformat" - The entity has sent XML that cannot be processed.
                         *
                         *  Returns:
                         *    The DOM element tree of the response.
                         */
                        getResponse: function getResponse() {
                            var node = null;
                            if (this.xhr.responseXML && this.xhr.responseXML.documentElement) {
                                node = this.xhr.responseXML.documentElement;
                                if (node.tagName == "parsererror") {
                                    Strophe.error("invalid response received");
                                    Strophe.error("responseText: " + this.xhr.responseText);
                                    Strophe.error("responseXML: " + Strophe.serialize(this.xhr.responseXML));
                                    throw "parsererror";
                                }
                            } else if (this.xhr.responseText) {
                                Strophe.error("invalid response received");
                                Strophe.error("responseText: " + this.xhr.responseText);
                                throw "badformat";
                            }

                            return node;
                        },

                        /** PrivateFunction: _newXHR
                         *  _Private_ helper function to create XMLHttpRequests.
                         *
                         *  This function creates XMLHttpRequests across all implementations.
                         *
                         *  Returns:
                         *    A new XMLHttpRequest.
                         */
                        _newXHR: function _newXHR() {
                            var xhr = null;
                            if (window.XMLHttpRequest) {
                                xhr = new XMLHttpRequest();
                                if (xhr.overrideMimeType) {
                                    xhr.overrideMimeType("text/xml; charset=utf-8");
                                }
                            } else if (window.ActiveXObject) {
                                xhr = new ActiveXObject("Microsoft.XMLHTTP");
                            }
                            // use Function.bind() to prepend ourselves as an argument
                            xhr.onreadystatechange = this.func.bind(null, this);
                            return xhr;
                        }
                    };

                    /** Class: Strophe.Bosh
                     *  _Private_ helper class that handles BOSH Connections
                     *
                     *  The Strophe.Bosh class is used internally by Strophe.Connection
                     *  to encapsulate BOSH sessions. It is not meant to be used from user's code.
                     */

                    /** File: bosh.js
                     *  A JavaScript library to enable BOSH in Strophejs.
                     *
                     *  this library uses Bidirectional-streams Over Synchronous HTTP (BOSH)
                     *  to emulate a persistent, stateful, two-way connection to an XMPP server.
                     *  More information on BOSH can be found in XEP 124.
                     */

                    /** PrivateConstructor: Strophe.Bosh
                     *  Create and initialize a Strophe.Bosh object.
                     *
                     *  Parameters:
                     *    (Strophe.Connection) connection - The Strophe.Connection that will use BOSH.
                     *
                     *  Returns:
                     *    A new Strophe.Bosh object.
                     */
                    Strophe.Bosh = function (connection) {
                        this._conn = connection;
                        /* request id for body tags */
                        this.rid = Math.floor(Math.random() * 4294967295);
                        /* The current session ID. */
                        this.sid = null;

                        // default BOSH values
                        this.hold = 1;
                        this.wait = 60;
                        this.window = 5;
                        this.errors = 0;
                        this.inactivity = null;

                        this._requests = [];
                    };

                    Strophe.Bosh.prototype = {
                        /** Variable: strip
                         *
                         *  BOSH-Connections will have all stanzas wrapped in a <body> tag when
                         *  passed to <Strophe.Connection.xmlInput> or <Strophe.Connection.xmlOutput>.
                         *  To strip this tag, User code can set <Strophe.Bosh.strip> to "body":
                         *
                         *  > Strophe.Bosh.prototype.strip = "body";
                         *
                         *  This will enable stripping of the body tag in both
                         *  <Strophe.Connection.xmlInput> and <Strophe.Connection.xmlOutput>.
                         */
                        strip: null,

                        /** PrivateFunction: _buildBody
                         *  _Private_ helper function to generate the <body/> wrapper for BOSH.
                         *
                         *  Returns:
                         *    A Strophe.Builder with a <body/> element.
                         */
                        _buildBody: function _buildBody() {
                            var bodyWrap = $build('body', {
                                rid: this.rid++,
                                xmlns: Strophe.NS.HTTPBIND
                            });
                            if (this.sid !== null) {
                                bodyWrap.attrs({ sid: this.sid });
                            }
                            if (this._conn.options.keepalive && this._conn._sessionCachingSupported()) {
                                this._cacheSession();
                            }
                            return bodyWrap;
                        },

                        /** PrivateFunction: _reset
                         *  Reset the connection.
                         *
                         *  This function is called by the reset function of the Strophe Connection
                         */
                        _reset: function _reset() {
                            this.rid = Math.floor(Math.random() * 4294967295);
                            this.sid = null;
                            this.errors = 0;
                            if (this._conn._sessionCachingSupported()) {
                                window.sessionStorage.removeItem('strophe-bosh-session');
                            }

                            this._conn.nextValidRid(this.rid);
                        },

                        /** PrivateFunction: _connect
                         *  _Private_ function that initializes the BOSH connection.
                         *
                         *  Creates and sends the Request that initializes the BOSH connection.
                         */
                        _connect: function _connect(wait, hold, route) {
                            this.wait = wait || this.wait;
                            this.hold = hold || this.hold;
                            this.errors = 0;

                            // build the body tag
                            var body = this._buildBody().attrs({
                                to: this._conn.domain,
                                "xml:lang": "en",
                                wait: this.wait,
                                hold: this.hold,
                                content: "text/xml; charset=utf-8",
                                ver: "1.6",
                                "xmpp:version": "1.0",
                                "xmlns:xmpp": Strophe.NS.BOSH
                            });

                            if (route) {
                                body.attrs({
                                    route: route
                                });
                            }

                            var _connect_cb = this._conn._connect_cb;

                            this._requests.push(new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, _connect_cb.bind(this._conn)), body.tree().getAttribute("rid")));
                            this._throttledRequestHandler();
                        },

                        /** PrivateFunction: _attach
                         *  Attach to an already created and authenticated BOSH session.
                         *
                         *  This function is provided to allow Strophe to attach to BOSH
                         *  sessions which have been created externally, perhaps by a Web
                         *  application.  This is often used to support auto-login type features
                         *  without putting user credentials into the page.
                         *
                         *  Parameters:
                         *    (String) jid - The full JID that is bound by the session.
                         *    (String) sid - The SID of the BOSH session.
                         *    (String) rid - The current RID of the BOSH session.  This RID
                         *      will be used by the next request.
                         *    (Function) callback The connect callback function.
                         *    (Integer) wait - The optional HTTPBIND wait value.  This is the
                         *      time the server will wait before returning an empty result for
                         *      a request.  The default setting of 60 seconds is recommended.
                         *      Other settings will require tweaks to the Strophe.TIMEOUT value.
                         *    (Integer) hold - The optional HTTPBIND hold value.  This is the
                         *      number of connections the server will hold at one time.  This
                         *      should almost always be set to 1 (the default).
                         *    (Integer) wind - The optional HTTBIND window value.  This is the
                         *      allowed range of request ids that are valid.  The default is 5.
                         */
                        _attach: function _attach(jid, sid, rid, callback, wait, hold, wind) {
                            this._conn.jid = jid;
                            this.sid = sid;
                            this.rid = rid;

                            this._conn.connect_callback = callback;

                            this._conn.domain = Strophe.getDomainFromJid(this._conn.jid);

                            this._conn.authenticated = true;
                            this._conn.connected = true;

                            this.wait = wait || this.wait;
                            this.hold = hold || this.hold;
                            this.window = wind || this.window;

                            this._conn._changeConnectStatus(Strophe.Status.ATTACHED, null);
                        },

                        /** PrivateFunction: _restore
                         *  Attempt to restore a cached BOSH session
                         *
                         *  Parameters:
                         *    (String) jid - The full JID that is bound by the session.
                         *      This parameter is optional but recommended, specifically in cases
                         *      where prebinded BOSH sessions are used where it's important to know
                         *      that the right session is being restored.
                         *    (Function) callback The connect callback function.
                         *    (Integer) wait - The optional HTTPBIND wait value.  This is the
                         *      time the server will wait before returning an empty result for
                         *      a request.  The default setting of 60 seconds is recommended.
                         *      Other settings will require tweaks to the Strophe.TIMEOUT value.
                         *    (Integer) hold - The optional HTTPBIND hold value.  This is the
                         *      number of connections the server will hold at one time.  This
                         *      should almost always be set to 1 (the default).
                         *    (Integer) wind - The optional HTTBIND window value.  This is the
                         *      allowed range of request ids that are valid.  The default is 5.
                         */
                        _restore: function _restore(jid, callback, wait, hold, wind) {
                            var session = JSON.parse(window.sessionStorage.getItem('strophe-bosh-session'));
                            if (typeof session !== "undefined" && session !== null && session.rid && session.sid && session.jid && (typeof jid === "undefined" || jid === null || Strophe.getBareJidFromJid(session.jid) == Strophe.getBareJidFromJid(jid) ||
                            // If authcid is null, then it's an anonymous login, so
                            // we compare only the domains:
                            Strophe.getNodeFromJid(jid) === null && Strophe.getDomainFromJid(session.jid) == jid)) {
                                this._conn.restored = true;
                                this._attach(session.jid, session.sid, session.rid, callback, wait, hold, wind);
                            } else {
                                throw { name: "StropheSessionError", message: "_restore: no restoreable session." };
                            }
                        },

                        /** PrivateFunction: _cacheSession
                         *  _Private_ handler for the beforeunload event.
                         *
                         *  This handler is used to process the Bosh-part of the initial request.
                         *  Parameters:
                         *    (Strophe.Request) bodyWrap - The received stanza.
                         */
                        _cacheSession: function _cacheSession() {
                            if (this._conn.authenticated) {
                                if (this._conn.jid && this.rid && this.sid) {
                                    window.sessionStorage.setItem('strophe-bosh-session', JSON.stringify({
                                        'jid': this._conn.jid,
                                        'rid': this.rid,
                                        'sid': this.sid
                                    }));
                                }
                            } else {
                                window.sessionStorage.removeItem('strophe-bosh-session');
                            }
                        },

                        /** PrivateFunction: _connect_cb
                         *  _Private_ handler for initial connection request.
                         *
                         *  This handler is used to process the Bosh-part of the initial request.
                         *  Parameters:
                         *    (Strophe.Request) bodyWrap - The received stanza.
                         */
                        _connect_cb: function _connect_cb(bodyWrap) {
                            var typ = bodyWrap.getAttribute("type");
                            var cond, conflict;
                            if (typ !== null && typ == "terminate") {
                                // an error occurred
                                cond = bodyWrap.getAttribute("condition");
                                Strophe.error("BOSH-Connection failed: " + cond);
                                conflict = bodyWrap.getElementsByTagName("conflict");
                                if (cond !== null) {
                                    if (cond == "remote-stream-error" && conflict.length > 0) {
                                        cond = "conflict";
                                    }
                                    this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
                                } else {
                                    this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
                                }
                                this._conn._doDisconnect(cond);
                                return Strophe.Status.CONNFAIL;
                            }

                            // check to make sure we don't overwrite these if _connect_cb is
                            // called multiple times in the case of missing stream:features
                            if (!this.sid) {
                                this.sid = bodyWrap.getAttribute("sid");
                            }
                            var wind = bodyWrap.getAttribute('requests');
                            if (wind) {
                                this.window = parseInt(wind, 10);
                            }
                            var hold = bodyWrap.getAttribute('hold');
                            if (hold) {
                                this.hold = parseInt(hold, 10);
                            }
                            var wait = bodyWrap.getAttribute('wait');
                            if (wait) {
                                this.wait = parseInt(wait, 10);
                            }
                            var inactivity = bodyWrap.getAttribute('inactivity');
                            if (inactivity) {
                                this.inactivity = parseInt(inactivity, 10);
                            }
                        },

                        /** PrivateFunction: _disconnect
                         *  _Private_ part of Connection.disconnect for Bosh
                         *
                         *  Parameters:
                         *    (Request) pres - This stanza will be sent before disconnecting.
                         */
                        _disconnect: function _disconnect(pres) {
                            this._sendTerminate(pres);
                        },

                        /** PrivateFunction: _doDisconnect
                         *  _Private_ function to disconnect.
                         *
                         *  Resets the SID and RID.
                         */
                        _doDisconnect: function _doDisconnect() {
                            this.sid = null;
                            this.rid = Math.floor(Math.random() * 4294967295);
                            if (this._conn._sessionCachingSupported()) {
                                window.sessionStorage.removeItem('strophe-bosh-session');
                            }

                            this._conn.nextValidRid(this.rid);
                        },

                        /** PrivateFunction: _emptyQueue
                         * _Private_ function to check if the Request queue is empty.
                         *
                         *  Returns:
                         *    True, if there are no Requests queued, False otherwise.
                         */
                        _emptyQueue: function _emptyQueue() {
                            return this._requests.length === 0;
                        },

                        /** PrivateFunction: _callProtocolErrorHandlers
                         *  _Private_ function to call error handlers registered for HTTP errors.
                         *
                         *  Parameters:
                         *    (Strophe.Request) req - The request that is changing readyState.
                         */
                        _callProtocolErrorHandlers: function _callProtocolErrorHandlers(req) {
                            var reqStatus = this._getRequestStatus(req),
                                err_callback;
                            err_callback = this._conn.protocolErrorHandlers.HTTP[reqStatus];
                            if (err_callback) {
                                err_callback.call(this, reqStatus);
                            }
                        },

                        /** PrivateFunction: _hitError
                         *  _Private_ function to handle the error count.
                         *
                         *  Requests are resent automatically until their error count reaches
                         *  5.  Each time an error is encountered, this function is called to
                         *  increment the count and disconnect if the count is too high.
                         *
                         *  Parameters:
                         *    (Integer) reqStatus - The request status.
                         */
                        _hitError: function _hitError(reqStatus) {
                            this.errors++;
                            Strophe.warn("request errored, status: " + reqStatus + ", number of errors: " + this.errors);
                            if (this.errors > 4) {
                                this._conn._onDisconnectTimeout();
                            }
                        },

                        /** PrivateFunction: _no_auth_received
                         *
                         * Called on stream start/restart when no stream:features
                         * has been received and sends a blank poll request.
                         */
                        _no_auth_received: function _no_auth_received(_callback) {
                            if (_callback) {
                                _callback = _callback.bind(this._conn);
                            } else {
                                _callback = this._conn._connect_cb.bind(this._conn);
                            }
                            var body = this._buildBody();
                            this._requests.push(new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, _callback.bind(this._conn)), body.tree().getAttribute("rid")));
                            this._throttledRequestHandler();
                        },

                        /** PrivateFunction: _onDisconnectTimeout
                         *  _Private_ timeout handler for handling non-graceful disconnection.
                         *
                         *  Cancels all remaining Requests and clears the queue.
                         */
                        _onDisconnectTimeout: function _onDisconnectTimeout() {
                            this._abortAllRequests();
                        },

                        /** PrivateFunction: _abortAllRequests
                         *  _Private_ helper function that makes sure all pending requests are aborted.
                         */
                        _abortAllRequests: function _abortAllRequests() {
                            var req;
                            while (this._requests.length > 0) {
                                req = this._requests.pop();
                                req.abort = true;
                                req.xhr.abort();
                                // jslint complains, but this is fine. setting to empty func
                                // is necessary for IE6
                                req.xhr.onreadystatechange = function () {}; // jshint ignore:line
                            }
                        },

                        /** PrivateFunction: _onIdle
                         *  _Private_ handler called by Strophe.Connection._onIdle
                         *
                         *  Sends all queued Requests or polls with empty Request if there are none.
                         */
                        _onIdle: function _onIdle() {
                            var data = this._conn._data;
                            // if no requests are in progress, poll
                            if (this._conn.authenticated && this._requests.length === 0 && data.length === 0 && !this._conn.disconnecting) {
                                Strophe.info("no requests during idle cycle, sending " + "blank request");
                                data.push(null);
                            }

                            if (this._conn.paused) {
                                return;
                            }

                            if (this._requests.length < 2 && data.length > 0) {
                                var body = this._buildBody();
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i] !== null) {
                                        if (data[i] === "restart") {
                                            body.attrs({
                                                to: this._conn.domain,
                                                "xml:lang": "en",
                                                "xmpp:restart": "true",
                                                "xmlns:xmpp": Strophe.NS.BOSH
                                            });
                                        } else {
                                            body.cnode(data[i]).up();
                                        }
                                    }
                                }
                                delete this._conn._data;
                                this._conn._data = [];
                                this._requests.push(new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, this._conn._dataRecv.bind(this._conn)), body.tree().getAttribute("rid")));
                                this._throttledRequestHandler();
                            }

                            if (this._requests.length > 0) {
                                var time_elapsed = this._requests[0].age();
                                if (this._requests[0].dead !== null) {
                                    if (this._requests[0].timeDead() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait)) {
                                        this._throttledRequestHandler();
                                    }
                                }

                                if (time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait)) {
                                    Strophe.warn("Request " + this._requests[0].id + " timed out, over " + Math.floor(Strophe.TIMEOUT * this.wait) + " seconds since last activity");
                                    this._throttledRequestHandler();
                                }
                            }
                        },

                        /** PrivateFunction: _getRequestStatus
                         *
                         *  Returns the HTTP status code from a Strophe.Request
                         *
                         *  Parameters:
                         *    (Strophe.Request) req - The Strophe.Request instance.
                         *    (Integer) def - The default value that should be returned if no
                         *          status value was found.
                         */
                        _getRequestStatus: function _getRequestStatus(req, def) {
                            var reqStatus;
                            if (req.xhr.readyState == 4) {
                                try {
                                    reqStatus = req.xhr.status;
                                } catch (e) {
                                    // ignore errors from undefined status attribute. Works
                                    // around a browser bug
                                    Strophe.error("Caught an error while retrieving a request's status, " + "reqStatus: " + reqStatus);
                                }
                            }
                            if (typeof reqStatus == "undefined") {
                                reqStatus = typeof def === 'number' ? def : 0;
                            }
                            return reqStatus;
                        },

                        /** PrivateFunction: _onRequestStateChange
                         *  _Private_ handler for Strophe.Request state changes.
                         *
                         *  This function is called when the XMLHttpRequest readyState changes.
                         *  It contains a lot of error handling logic for the many ways that
                         *  requests can fail, and calls the request callback when requests
                         *  succeed.
                         *
                         *  Parameters:
                         *    (Function) func - The handler for the request.
                         *    (Strophe.Request) req - The request that is changing readyState.
                         */
                        _onRequestStateChange: function _onRequestStateChange(func, req) {
                            Strophe.debug("request id " + req.id + "." + req.sends + " state changed to " + req.xhr.readyState);
                            if (req.abort) {
                                req.abort = false;
                                return;
                            }
                            if (req.xhr.readyState !== 4) {
                                // The request is not yet complete
                                return;
                            }
                            var reqStatus = this._getRequestStatus(req);
                            if (this.disconnecting && reqStatus >= 400) {
                                this._hitError(reqStatus);
                                this._callProtocolErrorHandlers(req);
                                return;
                            }

                            if (reqStatus > 0 && reqStatus < 500 || req.sends > 5) {
                                // remove from internal queue
                                this._removeRequest(req);
                                Strophe.debug("request id " + req.id + " should now be removed");
                            }

                            if (reqStatus == 200) {
                                // request succeeded
                                var reqIs0 = this._requests[0] == req;
                                var reqIs1 = this._requests[1] == req;
                                // if request 1 finished, or request 0 finished and request
                                // 1 is over Strophe.SECONDARY_TIMEOUT seconds old, we need to
                                // restart the other - both will be in the first spot, as the
                                // completed request has been removed from the queue already
                                if (reqIs1 || reqIs0 && this._requests.length > 0 && this._requests[0].age() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait)) {
                                    this._restartRequest(0);
                                }
                                this._conn.nextValidRid(Number(req.rid) + 1);
                                Strophe.debug("request id " + req.id + "." + req.sends + " got 200");
                                func(req); // call handler
                                this.errors = 0;
                            } else if (reqStatus === 0 || reqStatus >= 400 && reqStatus < 600 || reqStatus >= 12000) {
                                // request failed
                                Strophe.error("request id " + req.id + "." + req.sends + " error " + reqStatus + " happened");
                                this._hitError(reqStatus);
                                this._callProtocolErrorHandlers(req);
                                if (reqStatus >= 400 && reqStatus < 500) {
                                    this._conn._changeConnectStatus(Strophe.Status.DISCONNECTING, null);
                                    this._conn._doDisconnect();
                                }
                            } else {
                                Strophe.error("request id " + req.id + "." + req.sends + " error " + reqStatus + " happened");
                            }
                            if (!(reqStatus > 0 && reqStatus < 500) || req.sends > 5) {
                                this._throttledRequestHandler();
                            }
                        },

                        /** PrivateFunction: _processRequest
                         *  _Private_ function to process a request in the queue.
                         *
                         *  This function takes requests off the queue and sends them and
                         *  restarts dead requests.
                         *
                         *  Parameters:
                         *    (Integer) i - The index of the request in the queue.
                         */
                        _processRequest: function _processRequest(i) {
                            var self = this;
                            var req = this._requests[i];
                            var reqStatus = this._getRequestStatus(req, -1);

                            // make sure we limit the number of retries
                            if (req.sends > this._conn.maxRetries) {
                                this._conn._onDisconnectTimeout();
                                return;
                            }

                            var time_elapsed = req.age();
                            var primaryTimeout = !isNaN(time_elapsed) && time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait);
                            var secondaryTimeout = req.dead !== null && req.timeDead() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait);
                            var requestCompletedWithServerError = req.xhr.readyState == 4 && (reqStatus < 1 || reqStatus >= 500);
                            if (primaryTimeout || secondaryTimeout || requestCompletedWithServerError) {
                                if (secondaryTimeout) {
                                    Strophe.error("Request " + this._requests[i].id + " timed out (secondary), restarting");
                                }
                                req.abort = true;
                                req.xhr.abort();
                                // setting to null fails on IE6, so set to empty function
                                req.xhr.onreadystatechange = function () {};
                                this._requests[i] = new Strophe.Request(req.xmlData, req.origFunc, req.rid, req.sends);
                                req = this._requests[i];
                            }

                            if (req.xhr.readyState === 0) {
                                Strophe.debug("request id " + req.id + "." + req.sends + " posting");

                                try {
                                    var contentType = this._conn.options.contentType || "text/xml; charset=utf-8";
                                    req.xhr.open("POST", this._conn.service, this._conn.options.sync ? false : true);
                                    if (typeof req.xhr.setRequestHeader !== 'undefined') {
                                        // IE9 doesn't have setRequestHeader
                                        req.xhr.setRequestHeader("Content-Type", contentType);
                                    }
                                    if (this._conn.options.withCredentials) {
                                        req.xhr.withCredentials = true;
                                    }
                                } catch (e2) {
                                    Strophe.error("XHR open failed.");
                                    if (!this._conn.connected) {
                                        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "bad-service");
                                    }
                                    this._conn.disconnect();
                                    return;
                                }

                                // Fires the XHR request -- may be invoked immediately
                                // or on a gradually expanding retry window for reconnects
                                var sendFunc = function sendFunc() {
                                    req.date = new Date();
                                    if (self._conn.options.customHeaders) {
                                        var headers = self._conn.options.customHeaders;
                                        for (var header in headers) {
                                            if (headers.hasOwnProperty(header)) {
                                                req.xhr.setRequestHeader(header, headers[header]);
                                            }
                                        }
                                    }
                                    req.xhr.send(req.data);
                                };

                                // Implement progressive backoff for reconnects --
                                // First retry (send == 1) should also be instantaneous
                                if (req.sends > 1) {
                                    // Using a cube of the retry number creates a nicely
                                    // expanding retry window
                                    var backoff = Math.min(Math.floor(Strophe.TIMEOUT * this.wait), Math.pow(req.sends, 3)) * 1000;
                                    setTimeout(function () {
                                        // XXX: setTimeout should be called only with function expressions (23974bc1)
                                        sendFunc();
                                    }, backoff);
                                } else {
                                    sendFunc();
                                }

                                req.sends++;

                                if (this._conn.xmlOutput !== Strophe.Connection.prototype.xmlOutput) {
                                    if (req.xmlData.nodeName === this.strip && req.xmlData.childNodes.length) {
                                        this._conn.xmlOutput(req.xmlData.childNodes[0]);
                                    } else {
                                        this._conn.xmlOutput(req.xmlData);
                                    }
                                }
                                if (this._conn.rawOutput !== Strophe.Connection.prototype.rawOutput) {
                                    this._conn.rawOutput(req.data);
                                }
                            } else {
                                Strophe.debug("_processRequest: " + (i === 0 ? "first" : "second") + " request has readyState of " + req.xhr.readyState);
                            }
                        },

                        /** PrivateFunction: _removeRequest
                         *  _Private_ function to remove a request from the queue.
                         *
                         *  Parameters:
                         *    (Strophe.Request) req - The request to remove.
                         */
                        _removeRequest: function _removeRequest(req) {
                            Strophe.debug("removing request");
                            var i;
                            for (i = this._requests.length - 1; i >= 0; i--) {
                                if (req == this._requests[i]) {
                                    this._requests.splice(i, 1);
                                }
                            }
                            // IE6 fails on setting to null, so set to empty function
                            req.xhr.onreadystatechange = function () {};
                            this._throttledRequestHandler();
                        },

                        /** PrivateFunction: _restartRequest
                         *  _Private_ function to restart a request that is presumed dead.
                         *
                         *  Parameters:
                         *    (Integer) i - The index of the request in the queue.
                         */
                        _restartRequest: function _restartRequest(i) {
                            var req = this._requests[i];
                            if (req.dead === null) {
                                req.dead = new Date();
                            }

                            this._processRequest(i);
                        },

                        /** PrivateFunction: _reqToData
                         * _Private_ function to get a stanza out of a request.
                         *
                         * Tries to extract a stanza out of a Request Object.
                         * When this fails the current connection will be disconnected.
                         *
                         *  Parameters:
                         *    (Object) req - The Request.
                         *
                         *  Returns:
                         *    The stanza that was passed.
                         */
                        _reqToData: function _reqToData(req) {
                            try {
                                return req.getResponse();
                            } catch (e) {
                                if (e != "parsererror") {
                                    throw e;
                                }
                                this._conn.disconnect("strophe-parsererror");
                            }
                        },

                        /** PrivateFunction: _sendTerminate
                         *  _Private_ function to send initial disconnect sequence.
                         *
                         *  This is the first step in a graceful disconnect.  It sends
                         *  the BOSH server a terminate body and includes an unavailable
                         *  presence if authentication has completed.
                         */
                        _sendTerminate: function _sendTerminate(pres) {
                            Strophe.info("_sendTerminate was called");
                            var body = this._buildBody().attrs({ type: "terminate" });
                            if (pres) {
                                body.cnode(pres.tree());
                            }
                            var req = new Strophe.Request(body.tree(), this._onRequestStateChange.bind(this, this._conn._dataRecv.bind(this._conn)), body.tree().getAttribute("rid"));
                            this._requests.push(req);
                            this._throttledRequestHandler();
                        },

                        /** PrivateFunction: _send
                         *  _Private_ part of the Connection.send function for BOSH
                         *
                         * Just triggers the RequestHandler to send the messages that are in the queue
                         */
                        _send: function _send() {
                            clearTimeout(this._conn._idleTimeout);
                            this._throttledRequestHandler();

                            // XXX: setTimeout should be called only with function expressions (23974bc1)
                            this._conn._idleTimeout = setTimeout(function () {
                                this._onIdle();
                            }.bind(this._conn), 100);
                        },

                        /** PrivateFunction: _sendRestart
                         *
                         *  Send an xmpp:restart stanza.
                         */
                        _sendRestart: function _sendRestart() {
                            this._throttledRequestHandler();
                            clearTimeout(this._conn._idleTimeout);
                        },

                        /** PrivateFunction: _throttledRequestHandler
                         *  _Private_ function to throttle requests to the connection window.
                         *
                         *  This function makes sure we don't send requests so fast that the
                         *  request ids overflow the connection window in the case that one
                         *  request died.
                         */
                        _throttledRequestHandler: function _throttledRequestHandler() {
                            if (!this._requests) {
                                Strophe.debug("_throttledRequestHandler called with " + "undefined requests");
                            } else {
                                Strophe.debug("_throttledRequestHandler called with " + this._requests.length + " requests");
                            }

                            if (!this._requests || this._requests.length === 0) {
                                return;
                            }

                            if (this._requests.length > 0) {
                                this._processRequest(0);
                            }

                            if (this._requests.length > 1 && Math.abs(this._requests[0].rid - this._requests[1].rid) < this.window) {
                                this._processRequest(1);
                            }
                        }
                    };
                    return Strophe;
                });

                /*
                    This program is distributed under the terms of the MIT license.
                    Please see the LICENSE file for details.
                
                    Copyright 2006-2008, OGG, LLC
                */

                /* jshint undef: true, unused: true:, noarg: true, latedef: true */
                /* global define, window, clearTimeout, WebSocket, DOMParser, Strophe, $build */

                (function (root, factory) {
                    if (typeof define === 'function' && define.amd) {
                        define('strophe-websocket', ['strophe-core'], function (core) {
                            return factory(core.Strophe, core.$build);
                        });
                    } else {
                        // Browser globals
                        return factory(Strophe, $build);
                    }
                })(this, function (Strophe, $build) {

                    /** Class: Strophe.WebSocket
                     *  _Private_ helper class that handles WebSocket Connections
                     *
                     *  The Strophe.WebSocket class is used internally by Strophe.Connection
                     *  to encapsulate WebSocket sessions. It is not meant to be used from user's code.
                     */

                    /** File: websocket.js
                     *  A JavaScript library to enable XMPP over Websocket in Strophejs.
                     *
                     *  This file implements XMPP over WebSockets for Strophejs.
                     *  If a Connection is established with a Websocket url (ws://...)
                     *  Strophe will use WebSockets.
                     *  For more information on XMPP-over-WebSocket see RFC 7395:
                     *  http://tools.ietf.org/html/rfc7395
                     *
                     *  WebSocket support implemented by Andreas Guth (andreas.guth@rwth-aachen.de)
                     */

                    /** PrivateConstructor: Strophe.Websocket
                     *  Create and initialize a Strophe.WebSocket object.
                     *  Currently only sets the connection Object.
                     *
                     *  Parameters:
                     *    (Strophe.Connection) connection - The Strophe.Connection that will use WebSockets.
                     *
                     *  Returns:
                     *    A new Strophe.WebSocket object.
                     */
                    Strophe.Websocket = function (connection) {
                        this._conn = connection;
                        this.strip = "wrapper";

                        var service = connection.service;
                        if (service.indexOf("ws:") !== 0 && service.indexOf("wss:") !== 0) {
                            // If the service is not an absolute URL, assume it is a path and put the absolute
                            // URL together from options, current URL and the path.
                            var new_service = "";

                            if (connection.options.protocol === "ws" && window.location.protocol !== "https:") {
                                new_service += "ws";
                            } else {
                                new_service += "wss";
                            }

                            new_service += "://" + window.location.host;

                            if (service.indexOf("/") !== 0) {
                                new_service += window.location.pathname + service;
                            } else {
                                new_service += service;
                            }

                            connection.service = new_service;
                        }
                    };

                    Strophe.Websocket.prototype = {
                        /** PrivateFunction: _buildStream
                         *  _Private_ helper function to generate the <stream> start tag for WebSockets
                         *
                         *  Returns:
                         *    A Strophe.Builder with a <stream> element.
                         */
                        _buildStream: function _buildStream() {
                            return $build("open", {
                                "xmlns": Strophe.NS.FRAMING,
                                "to": this._conn.domain,
                                "version": '1.0'
                            });
                        },

                        /** PrivateFunction: _check_streamerror
                         * _Private_ checks a message for stream:error
                         *
                         *  Parameters:
                         *    (Strophe.Request) bodyWrap - The received stanza.
                         *    connectstatus - The ConnectStatus that will be set on error.
                         *  Returns:
                         *     true if there was a streamerror, false otherwise.
                         */
                        _check_streamerror: function _check_streamerror(bodyWrap, connectstatus) {
                            var errors;
                            if (bodyWrap.getElementsByTagNameNS) {
                                errors = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, "error");
                            } else {
                                errors = bodyWrap.getElementsByTagName("stream:error");
                            }
                            if (errors.length === 0) {
                                return false;
                            }
                            var error = errors[0];

                            var condition = "";
                            var text = "";

                            var ns = "urn:ietf:params:xml:ns:xmpp-streams";
                            for (var i = 0; i < error.childNodes.length; i++) {
                                var e = error.childNodes[i];
                                if (e.getAttribute("xmlns") !== ns) {
                                    break;
                                }if (e.nodeName === "text") {
                                    text = e.textContent;
                                } else {
                                    condition = e.nodeName;
                                }
                            }

                            var errorString = "WebSocket stream error: ";

                            if (condition) {
                                errorString += condition;
                            } else {
                                errorString += "unknown";
                            }

                            if (text) {
                                errorString += " - " + condition;
                            }

                            Strophe.error(errorString);

                            // close the connection on stream_error
                            this._conn._changeConnectStatus(connectstatus, condition);
                            this._conn._doDisconnect();
                            return true;
                        },

                        /** PrivateFunction: _reset
                         *  Reset the connection.
                         *
                         *  This function is called by the reset function of the Strophe Connection.
                         *  Is not needed by WebSockets.
                         */
                        _reset: function _reset() {
                            return;
                        },

                        /** PrivateFunction: _connect
                         *  _Private_ function called by Strophe.Connection.connect
                         *
                         *  Creates a WebSocket for a connection and assigns Callbacks to it.
                         *  Does nothing if there already is a WebSocket.
                         */
                        _connect: function _connect() {
                            // Ensure that there is no open WebSocket from a previous Connection.
                            this._closeSocket();

                            // Create the new WobSocket
                            this.socket = new WebSocket(this._conn.service, "xmpp");
                            this.socket.onopen = this._onOpen.bind(this);
                            this.socket.onerror = this._onError.bind(this);
                            this.socket.onclose = this._onClose.bind(this);
                            this.socket.onmessage = this._connect_cb_wrapper.bind(this);
                        },

                        /** PrivateFunction: _connect_cb
                         *  _Private_ function called by Strophe.Connection._connect_cb
                         *
                         * checks for stream:error
                         *
                         *  Parameters:
                         *    (Strophe.Request) bodyWrap - The received stanza.
                         */
                        _connect_cb: function _connect_cb(bodyWrap) {
                            var error = this._check_streamerror(bodyWrap, Strophe.Status.CONNFAIL);
                            if (error) {
                                return Strophe.Status.CONNFAIL;
                            }
                        },

                        /** PrivateFunction: _handleStreamStart
                         * _Private_ function that checks the opening <open /> tag for errors.
                         *
                         * Disconnects if there is an error and returns false, true otherwise.
                         *
                         *  Parameters:
                         *    (Node) message - Stanza containing the <open /> tag.
                         */
                        _handleStreamStart: function _handleStreamStart(message) {
                            var error = false;

                            // Check for errors in the <open /> tag
                            var ns = message.getAttribute("xmlns");
                            if (typeof ns !== "string") {
                                error = "Missing xmlns in <open />";
                            } else if (ns !== Strophe.NS.FRAMING) {
                                error = "Wrong xmlns in <open />: " + ns;
                            }

                            var ver = message.getAttribute("version");
                            if (typeof ver !== "string") {
                                error = "Missing version in <open />";
                            } else if (ver !== "1.0") {
                                error = "Wrong version in <open />: " + ver;
                            }

                            if (error) {
                                this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, error);
                                this._conn._doDisconnect();
                                return false;
                            }

                            return true;
                        },

                        /** PrivateFunction: _connect_cb_wrapper
                         * _Private_ function that handles the first connection messages.
                         *
                         * On receiving an opening stream tag this callback replaces itself with the real
                         * message handler. On receiving a stream error the connection is terminated.
                         */
                        _connect_cb_wrapper: function _connect_cb_wrapper(message) {
                            if (message.data.indexOf("<open ") === 0 || message.data.indexOf("<?xml") === 0) {
                                // Strip the XML Declaration, if there is one
                                var data = message.data.replace(/^(<\?.*?\?>\s*)*/, "");
                                if (data === '') return;

                                var streamStart = new DOMParser().parseFromString(data, "text/xml").documentElement;
                                this._conn.xmlInput(streamStart);
                                this._conn.rawInput(message.data);

                                //_handleStreamSteart will check for XML errors and disconnect on error
                                if (this._handleStreamStart(streamStart)) {
                                    //_connect_cb will check for stream:error and disconnect on error
                                    this._connect_cb(streamStart);
                                }
                            } else if (message.data.indexOf("<close ") === 0) {
                                //'<close xmlns="urn:ietf:params:xml:ns:xmpp-framing />') {
                                this._conn.rawInput(message.data);
                                this._conn.xmlInput(message);
                                var see_uri = message.getAttribute("see-other-uri");
                                if (see_uri) {
                                    this._conn._changeConnectStatus(Strophe.Status.REDIRECT, "Received see-other-uri, resetting connection");
                                    this._conn.reset();
                                    this._conn.service = see_uri;
                                    this._connect();
                                } else {
                                    this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "Received closing stream");
                                    this._conn._doDisconnect();
                                }
                            } else {
                                var string = this._streamWrap(message.data);
                                var elem = new DOMParser().parseFromString(string, "text/xml").documentElement;
                                this.socket.onmessage = this._onMessage.bind(this);
                                this._conn._connect_cb(elem, null, message.data);
                            }
                        },

                        /** PrivateFunction: _disconnect
                         *  _Private_ function called by Strophe.Connection.disconnect
                         *
                         *  Disconnects and sends a last stanza if one is given
                         *
                         *  Parameters:
                         *    (Request) pres - This stanza will be sent before disconnecting.
                         */
                        _disconnect: function _disconnect(pres) {
                            if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
                                if (pres) {
                                    this._conn.send(pres);
                                }
                                var close = $build("close", { "xmlns": Strophe.NS.FRAMING });
                                this._conn.xmlOutput(close);
                                var closeString = Strophe.serialize(close);
                                this._conn.rawOutput(closeString);
                                try {
                                    this.socket.send(closeString);
                                } catch (e) {
                                    Strophe.info("Couldn't send <close /> tag.");
                                }
                            }
                            this._conn._doDisconnect();
                        },

                        /** PrivateFunction: _doDisconnect
                         *  _Private_ function to disconnect.
                         *
                         *  Just closes the Socket for WebSockets
                         */
                        _doDisconnect: function _doDisconnect() {
                            Strophe.info("WebSockets _doDisconnect was called");
                            this._closeSocket();
                        },

                        /** PrivateFunction _streamWrap
                         *  _Private_ helper function to wrap a stanza in a <stream> tag.
                         *  This is used so Strophe can process stanzas from WebSockets like BOSH
                         */
                        _streamWrap: function _streamWrap(stanza) {
                            return "<wrapper>" + stanza + '</wrapper>';
                        },

                        /** PrivateFunction: _closeSocket
                         *  _Private_ function to close the WebSocket.
                         *
                         *  Closes the socket if it is still open and deletes it
                         */
                        _closeSocket: function _closeSocket() {
                            if (this.socket) {
                                try {
                                    this.socket.close();
                                } catch (e) {}
                            }
                            this.socket = null;
                        },

                        /** PrivateFunction: _emptyQueue
                         * _Private_ function to check if the message queue is empty.
                         *
                         *  Returns:
                         *    True, because WebSocket messages are send immediately after queueing.
                         */
                        _emptyQueue: function _emptyQueue() {
                            return true;
                        },

                        /** PrivateFunction: _onClose
                         * _Private_ function to handle websockets closing.
                         *
                         * Nothing to do here for WebSockets
                         */
                        _onClose: function _onClose() {
                            if (this._conn.connected && !this._conn.disconnecting) {
                                Strophe.error("Websocket closed unexpectedly");
                                this._conn._doDisconnect();
                            } else {
                                Strophe.info("Websocket closed");
                            }
                        },

                        /** PrivateFunction: _no_auth_received
                         *
                         * Called on stream start/restart when no stream:features
                         * has been received.
                         */
                        _no_auth_received: function _no_auth_received(_callback) {
                            Strophe.error("Server did not send any auth methods");
                            this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "Server did not send any auth methods");
                            if (_callback) {
                                _callback = _callback.bind(this._conn);
                                _callback();
                            }
                            this._conn._doDisconnect();
                        },

                        /** PrivateFunction: _onDisconnectTimeout
                         *  _Private_ timeout handler for handling non-graceful disconnection.
                         *
                         *  This does nothing for WebSockets
                         */
                        _onDisconnectTimeout: function _onDisconnectTimeout() {},

                        /** PrivateFunction: _abortAllRequests
                         *  _Private_ helper function that makes sure all pending requests are aborted.
                         */
                        _abortAllRequests: function _abortAllRequests() {},

                        /** PrivateFunction: _onError
                         * _Private_ function to handle websockets errors.
                         *
                         * Parameters:
                         * (Object) error - The websocket error.
                         */
                        _onError: function _onError(error) {
                            Strophe.error("Websocket error " + error);
                            this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "The WebSocket connection could not be established or was disconnected.");
                            this._disconnect();
                        },

                        /** PrivateFunction: _onIdle
                         *  _Private_ function called by Strophe.Connection._onIdle
                         *
                         *  sends all queued stanzas
                         */
                        _onIdle: function _onIdle() {
                            var data = this._conn._data;
                            if (data.length > 0 && !this._conn.paused) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i] !== null) {
                                        var stanza, rawStanza;
                                        if (data[i] === "restart") {
                                            stanza = this._buildStream().tree();
                                        } else {
                                            stanza = data[i];
                                        }
                                        rawStanza = Strophe.serialize(stanza);
                                        this._conn.xmlOutput(stanza);
                                        this._conn.rawOutput(rawStanza);
                                        this.socket.send(rawStanza);
                                    }
                                }
                                this._conn._data = [];
                            }
                        },

                        /** PrivateFunction: _onMessage
                         * _Private_ function to handle websockets messages.
                         *
                         * This function parses each of the messages as if they are full documents.
                         * [TODO : We may actually want to use a SAX Push parser].
                         *
                         * Since all XMPP traffic starts with
                         *  <stream:stream version='1.0'
                         *                 xml:lang='en'
                         *                 xmlns='jabber:client'
                         *                 xmlns:stream='http://etherx.jabber.org/streams'
                         *                 id='3697395463'
                         *                 from='SERVER'>
                         *
                         * The first stanza will always fail to be parsed.
                         *
                         * Additionally, the seconds stanza will always be <stream:features> with
                         * the stream NS defined in the previous stanza, so we need to 'force'
                         * the inclusion of the NS in this stanza.
                         *
                         * Parameters:
                         * (string) message - The websocket message.
                         */
                        _onMessage: function _onMessage(message) {
                            var elem, data;
                            // check for closing stream
                            var close = '<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';
                            if (message.data === close) {
                                this._conn.rawInput(close);
                                this._conn.xmlInput(message);
                                if (!this._conn.disconnecting) {
                                    this._conn._doDisconnect();
                                }
                                return;
                            } else if (message.data.search("<open ") === 0) {
                                // This handles stream restarts
                                elem = new DOMParser().parseFromString(message.data, "text/xml").documentElement;
                                if (!this._handleStreamStart(elem)) {
                                    return;
                                }
                            } else {
                                data = this._streamWrap(message.data);
                                elem = new DOMParser().parseFromString(data, "text/xml").documentElement;
                            }

                            if (this._check_streamerror(elem, Strophe.Status.ERROR)) {
                                return;
                            }

                            //handle unavailable presence stanza before disconnecting
                            if (this._conn.disconnecting && elem.firstChild.nodeName === "presence" && elem.firstChild.getAttribute("type") === "unavailable") {
                                this._conn.xmlInput(elem);
                                this._conn.rawInput(Strophe.serialize(elem));
                                // if we are already disconnecting we will ignore the unavailable stanza and
                                // wait for the </stream:stream> tag before we close the connection
                                return;
                            }
                            this._conn._dataRecv(elem, message.data);
                        },

                        /** PrivateFunction: _onOpen
                         * _Private_ function to handle websockets connection setup.
                         *
                         * The opening stream tag is sent here.
                         */
                        _onOpen: function _onOpen() {
                            Strophe.info("Websocket open");
                            var start = this._buildStream();
                            this._conn.xmlOutput(start.tree());

                            var startString = Strophe.serialize(start);
                            this._conn.rawOutput(startString);
                            this.socket.send(startString);
                        },

                        /** PrivateFunction: _reqToData
                         * _Private_ function to get a stanza out of a request.
                         *
                         * WebSockets don't use requests, so the passed argument is just returned.
                         *
                         *  Parameters:
                         *    (Object) stanza - The stanza.
                         *
                         *  Returns:
                         *    The stanza that was passed.
                         */
                        _reqToData: function _reqToData(stanza) {
                            return stanza;
                        },

                        /** PrivateFunction: _send
                         *  _Private_ part of the Connection.send function for WebSocket
                         *
                         * Just flushes the messages that are in the queue
                         */
                        _send: function _send() {
                            this._conn.flush();
                        },

                        /** PrivateFunction: _sendRestart
                         *
                         *  Send an xmpp:restart stanza.
                         */
                        _sendRestart: function _sendRestart() {
                            clearTimeout(this._conn._idleTimeout);
                            this._conn._onIdle.bind(this._conn)();
                        }
                    };
                    return Strophe;
                });

                (function (root) {
                    if (typeof define === 'function' && define.amd) {
                        define("strophe", ["strophe-core", "strophe-bosh", "strophe-websocket"], function (wrapper) {
                            return wrapper;
                        });
                    }
                })(this);

                /* jshint ignore:start */
                if (callback) {
                    if (typeof define === 'function' && define.amd) {
                        //For backwards compatability
                        var n_callback = callback;
                        if (typeof requirejs === 'function') {
                            requirejs(["strophe"], function (o) {
                                n_callback(o.Strophe, o.$build, o.$msg, o.$iq, o.$pres);
                            });
                        } else {
                            require(["strophe"], function (o) {
                                n_callback(o.Strophe, o.$build, o.$msg, o.$iq, o.$pres);
                            });
                        }
                    } else {
                        return callback(Strophe, $build, $msg, $iq, $pres);
                    }
                }
            })(function (Strophe, build, msg, iq, pres) {
                window.Strophe = Strophe;
                window.$build = build;
                window.$msg = msg;
                window.$iq = iq;
                window.$pres = pres;
            });
            /* jshint ignore:end */
        }, {}], 2: [function (require, module, exports) {
            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            require('strophe.js');

            var XmppClient = function () {

                /**
                 * Create a new xmpp client.
                 *
                 * @param {string} bosh
                 * @param {string} id
                 */
                function XmppClient(bosh, id) {
                    _classCallCheck(this, XmppClient);

                    this.bosh = bosh;
                    this.id = id;
                }

                /**
                 * Login into xmpp server.
                 *
                 * @param {string} password
                 *
                 * @returns {Promise}
                 */

                _createClass(XmppClient, [{
                    key: 'login',
                    value: function login(password) {
                        return new Promise(function (resolve, error) {
                            // console.log(stropheJs);
                        });
                    }
                }]);

                return XmppClient;
            }();

            exports.default = XmppClient;
        }, { "strophe.js": 1 }] }, {}, [2])(2);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"strophe.js":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _view = require('../services/view.js');

var _view2 = _interopRequireDefault(_view);

var _xmppClient = require('../../dist/xmpp-client.js');

var _xmppClient2 = _interopRequireDefault(_xmppClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Login = function () {

    /**
     * Login need a template to be set.
     *
     * @param {string} html
     */
    function Login(html) {
        _classCallCheck(this, Login);

        _view2.default.set(html);
        this.initSelectors();
        this.initEvents();
        this.loadInputs();
    }

    /**
     * Init selectors.
     */


    _createClass(Login, [{
        key: 'initSelectors',
        value: function initSelectors() {
            this.$form = (0, _jquery2.default)('#login-form');
            this.$id = (0, _jquery2.default)('#id');
            this.$bosh = (0, _jquery2.default)('#bosh');
            this.$password = (0, _jquery2.default)('#password');
        }

        /**
         * Init dom events.
         */

    }, {
        key: 'initEvents',
        value: function initEvents() {
            // Submit listener
            this.$form.submit(function (event) {
                event.preventDefault();

                var xmpp = new _xmppClient2.default(this.$bosh.val(), this.$id.val());
                xmpp.login(this.$password.val()).then(function () {
                    alert('logged in');
                });
            }.bind(this));

            // Email Listener
            this.$id.keyup(this.updateBosh.bind(this));
            this.$id.change(this.saveInputs.bind(this));
            this.$bosh.change(this.saveInputs.bind(this));
        }

        /**
         * Update bosh from id value.
         */

    }, {
        key: 'updateBosh',
        value: function updateBosh() {
            var idParts = this.$id.val().split('@');

            if (idParts[1]) {
                this.$bosh.val('https://' + idParts[1] + ':5281/http-bind');
                this.saveInputs();
            }
        }

        /**
         * Save id to local storage.
         */

    }, {
        key: 'saveInputs',
        value: function saveInputs() {
            localStorage.id = this.$id.val();
            localStorage.bosh = this.$bosh.val();
        }

        /**
         * Load id from local storage.
         */

    }, {
        key: 'loadInputs',
        value: function loadInputs() {
            this.$id.val(localStorage.id);
            this.$bosh.val(localStorage.bosh);

            if (localStorage.id) {
                this.$password.focus();
            } else {
                this.$id.focus();
            }
        }
    }]);

    return Login;
}();

exports.default = Login;

},{"../../dist/xmpp-client.js":1,"../services/view.js":4,"jquery":6}],3:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _login = require('./templates/login.html');

var _login2 = _interopRequireDefault(_login);

var _login3 = require('./components/login');

var _login4 = _interopRequireDefault(_login3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).ready(function () {
    new _login4.default(_login2.default);
});

},{"./components/login":2,"./templates/login.html":5,"jquery":6}],4:[function(require,module,exports){
'use strict';

module.exports = {
    set: function set(html) {
        document.getElementById('main').innerHTML = html;
    }
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = "<div class=\"container\">\n    <div class=\"row main\">\n        <div class=\"panel-heading\">\n            <div class=\"panel-title text-center\">\n                <img width=\"100\" src=\"img/xmpp.svg\" alt=\"XMPP Client\" />\n                <hr />\n            </div>\n        </div>\n        <div class=\"main-login main-center\">\n            <form id=\"login-form\" class=\"form-horizontal\" method=\"post\" action=\"#\">\n                <div class=\"form-group\">\n                    <label for=\"id\" class=\"cols-sm-2 control-label\">Jabber-ID</label>\n                    <div class=\"cols-sm-10\">\n                        <div class=\"input-group\">\n                            <span class=\"input-group-addon\"><i class=\"fa fa-user fa\" aria-hidden=\"true\"></i></span>\n                            <input type=\"id\" class=\"form-control\" name=\"id\" id=\"id\" placeholder=\"user@example.com\" required/>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label for=\"password\" class=\"cols-sm-2 control-label\">Password</label>\n                    <div class=\"cols-sm-10\">\n                        <div class=\"input-group\">\n                            <span class=\"input-group-addon\"><i class=\"fa fa-lock fa-lg\" aria-hidden=\"true\"></i></span>\n                            <input type=\"password\" class=\"form-control\" name=\"password\" id=\"password\"  placeholder=\"Enter your Password\" required/>\n                        </div>\n                    </div>\n                </div>\n                \n                <div class=\"form-group\">\n                    <label for=\"bosh\" class=\"cols-sm-2 control-label\">BOSH</label>\n                    <div class=\"cols-sm-10\">\n                        <div class=\"input-group\">\n                            <span class=\"input-group-addon\"><i class=\"fa fa-user fa\" aria-hidden=\"true\"></i></span>\n                            <input type=\"bosh\" class=\"form-control\" name=\"bosh\" id=\"bosh\" placeholder=\"https://example.com:5280/http-bind\" required/>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"form-group \">\n                    <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">Login</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>";

},{}],6:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.1.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2016-09-22T22:30Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			resolve.call( undefined, value );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.call( undefined, value );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && jQuery.nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

function manipulationTarget( elem, content ) {
	if ( jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE <=9 only
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val,
		valueIsBorderBox = true,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Support: IE <=11 only
	// Running getBoundingClientRect on a disconnected node
	// in IE throws an error.
	if ( elem.getClientRects().length ) {
		val = elem.getBoundingClientRect()[ name ];
	}

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function raf() {
	if ( timerId ) {
		window.requestAnimationFrame( raf );
		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off or if document is hidden
	if ( jQuery.fx.off || document.hidden ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.requestAnimationFrame ?
			window.requestAnimationFrame( raf ) :
			window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	if ( window.cancelAnimationFrame ) {
		window.cancelAnimationFrame( timerId );
	} else {
		window.clearInterval( timerId );
	}

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( jQuery.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win, rect, doc,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		// Make sure element is not hidden (display: none)
		if ( rect.width || rect.height ) {
			doc = elem.ownerDocument;
			win = getWindow( doc );
			docElem = doc.documentElement;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		}

		// Return zeros for disconnected and hidden elements (gh-2310)
		return rect;
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.parseJSON = JSON.parse;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}





return jQuery;
} );

},{}],7:[function(require,module,exports){
/** File: strophe.js
 *  A JavaScript library for writing XMPP clients.
 *
 *  This library uses either Bidirectional-streams Over Synchronous HTTP (BOSH)
 *  to emulate a persistent, stateful, two-way connection to an XMPP server or
 *  alternatively WebSockets.
 *
 *  More information on BOSH can be found in XEP 124.
 *  For more information on XMPP-over WebSocket see this RFC:
 *  http://tools.ietf.org/html/rfc7395
 */

/* All of the Strophe globals are defined in this special function below so
 * that references to the globals become closures.  This will ensure that
 * on page reload, these references will still be available to callbacks
 * that are still executing.
 */

/* jshint ignore:start */
(function (callback) {
/* jshint ignore:end */

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-base64', function () {
            return factory();
        });
    } else {
        // Browser globals
        root.Base64 = factory();
    }
}(this, function () {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var obj = {
        /**
         * Encodes a string in base64
         * @param {String} input The string to encode in base64.
         */
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc2 = ((chr1 & 3) << 4);
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            } while (i < input.length);

            return output;
        },

        /**
         * Decodes a base64 string.
         * @param {String} input The string to decode.
         */
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            } while (i < input.length);

            return output;
        }
    };
    return obj;
}));

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/* jshint undef: true, unused: true:, noarg: true, latedef: false */
/* global define */

/* Some functions and variables have been stripped for use with Strophe */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-sha1', function () {
            return factory();
        });
    } else {
        // Browser globals
        root.SHA1 = factory();
    }
}(this, function () {

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = new Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  var i, j, t, olda, oldb, oldc, oldd, olde;
  for (i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    olde = e;

    for (j = 0; j < 80; j++)
    {
      if (j < 16) { w[j] = x[i + j]; }
      else { w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1); }
      t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return [a, b, c, d, e];
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if (t < 20) { return (b & c) | ((~b) & d); }
  if (t < 40) { return b ^ c ^ d; }
  if (t < 60) { return (b & c) | (b & d) | (c & d); }
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if (bkey.length > 16) { bkey = core_sha1(bkey, key.length * 8); }

  var ipad = new Array(16), opad = new Array(16);
  for (var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * 8);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = [];
  var mask = 255;
  for (var i = 0; i < str.length * 8; i += 8)
  {
    bin[i>>5] |= (str.charCodeAt(i / 8) & mask) << (24 - i%32);
  }
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = 255;
  for (var i = 0; i < bin.length * 32; i += 8)
  {
    str += String.fromCharCode((bin[i>>5] >>> (24 - i%32)) & mask);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  var triplet, j;
  for (var i = 0; i < binarray.length * 4; i += 3)
  {
    triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16) |
              (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 ) |
               ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for (j = 0; j < 4; j++)
    {
      if (i * 8 + j * 6 > binarray.length * 32) { str += "="; }
      else { str += tab.charAt((triplet >> 6*(3-j)) & 0x3F); }
    }
  }
  return str;
}

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
return {
    b64_hmac_sha1:  function (key, data){ return binb2b64(core_hmac_sha1(key, data)); },
    b64_sha1:       function (s) { return binb2b64(core_sha1(str2binb(s),s.length * 8)); },
    binb2str:       binb2str,
    core_hmac_sha1: core_hmac_sha1,
    str_hmac_sha1:  function (key, data){ return binb2str(core_hmac_sha1(key, data)); },
    str_sha1:       function (s) { return binb2str(core_sha1(str2binb(s),s.length * 8)); },
};
}));

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Everything that isn't used by Strophe has been stripped here!
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-md5', function () {
            return factory();
        });
    } else {
        // Browser globals
        root.MD5 = factory();
    }
}(this, function (b) {
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    var safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    var bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /*
     * Convert a string to an array of little-endian words
     */
    var str2binl = function (str) {
        var bin = [];
        for(var i = 0; i < str.length * 8; i += 8)
        {
            bin[i>>5] |= (str.charCodeAt(i / 8) & 255) << (i%32);
        }
        return bin;
    };

    /*
     * Convert an array of little-endian words to a string
     */
    var binl2str = function (bin) {
        var str = "";
        for(var i = 0; i < bin.length * 32; i += 8)
        {
            str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & 255);
        }
        return str;
    };

    /*
     * Convert an array of little-endian words to a hex string.
     */
    var binl2hex = function (binarray) {
        var hex_tab = "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++)
        {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    };

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    var md5_cmn = function (q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q),safe_add(x, t)), s),b);
    };

    var md5_ff = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };

    var md5_gg = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };

    var md5_hh = function (a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };

    var md5_ii = function (a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    var core_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;

        var olda, oldb, oldc, oldd;
        for (var i = 0; i < x.length; i += 16)
        {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    };

    var obj = {
        /*
         * These are the functions you'll usually want to call.
         * They take string arguments and return either hex or base-64 encoded
         * strings.
         */
        hexdigest: function (s) {
            return binl2hex(core_md5(str2binl(s), s.length * 8));
        },

        hash: function (s) {
            return binl2str(core_md5(str2binl(s), s.length * 8));
        }
    };
    return obj;
}));

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-utils', function () {
            return factory();
        });
    } else {
        // Browser globals
        root.stropheUtils = factory();
    }
}(this, function () {

    var utils = {

        utf16to8: function (str) {
            var i, c;
            var out = "";
            var len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0000) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
                }
            }
            return out;
        },

        addCookies: function (cookies) {
            /* Parameters:
             *  (Object) cookies - either a map of cookie names
             *    to string values or to maps of cookie values.
             *
             * For example:
             * { "myCookie": "1234" }
             *
             * or:
             * { "myCookie": {
             *      "value": "1234",
             *      "domain": ".example.org",
             *      "path": "/",
             *      "expires": expirationDate
             *      }
             *  }
             *
             *  These values get passed to Strophe.Connection via
             *   options.cookies
             */
            var cookieName, cookieObj, isObj, cookieValue, expires, domain, path;
            for (cookieName in (cookies || {})) {
                expires = '';
                domain = '';
                path = '';
                cookieObj = cookies[cookieName];
                isObj = typeof cookieObj == "object";
                cookieValue = escape(unescape(isObj ? cookieObj.value : cookieObj));
                if (isObj) {
                    expires = cookieObj.expires ? ";expires="+cookieObj.expires : '';
                    domain = cookieObj.domain ? ";domain="+cookieObj.domain : '';
                    path = cookieObj.path ? ";path="+cookieObj.path : '';
                }
                document.cookie =
                    cookieName+'='+cookieValue + expires + domain + path;
            }
        }
    };
    return utils;
}));

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/* jshint undef: true, unused: true:, noarg: true, latedef: true */
/* global define */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-polyfill', [], function () {
            return factory();
        });
    } else {
        // Browser globals
        return factory();
    }
}(this, function () {

/** Function: Function.prototype.bind
 *  Bind a function to an instance.
 *
 *  This Function object extension method creates a bound method similar
 *  to those in Python.  This means that the 'this' object will point
 *  to the instance you want.  See <MDC's bind() documentation at https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind>
 *  and <Bound Functions and Function Imports in JavaScript at http://benjamin.smedbergs.us/blog/2007-01-03/bound-functions-and-function-imports-in-javascript/>
 *  for a complete explanation.
 *
 *  This extension already exists in some browsers (namely, Firefox 3), but
 *  we provide it to support those that don't.
 *
 *  Parameters:
 *    (Object) obj - The object that will become 'this' in the bound function.
 *    (Object) argN - An option argument that will be prepended to the
 *      arguments given for the function call
 *
 *  Returns:
 *    The bound function.
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj /*, arg1, arg2, ... */) {
        var func = this;
        var _slice = Array.prototype.slice;
        var _concat = Array.prototype.concat;
        var _args = _slice.call(arguments, 1);
        return function () {
            return func.apply(obj ? obj : this, _concat.call(_args, _slice.call(arguments, 0)));
        };
    };
}

/** Function: Array.isArray
 *  This is a polyfill for the ES5 Array.isArray method.
 */
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

/** Function: Array.prototype.indexOf
 *  Return the index of an object in an array.
 *
 *  This function is not supplied by some JavaScript implementations, so
 *  we provide it if it is missing.  This code is from:
 *  http://developer.mozilla.org/En/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
 *
 *  Parameters:
 *    (Object) elt - The object to look for.
 *    (Integer) from - The index from which to start looking. (optional).
 *
 *  Returns:
 *    The index of elt in the array or -1 if not found.
 */
if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt /*, from*/) {
            var len = this.length;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) {
                from += len;
            }

            for (; from < len; from++) {
                if (from in this && this[from] === elt) {
                    return from;
                }
            }
            return -1;
        };
    }
}));


/** Function: Array.prototype.forEach
 *
 *  This function is not available in IE < 9
 *
 *  See <forEach on developer.mozilla.org at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach>
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this === null) {
            throw new TypeError(' this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);
        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;
        // 4. If isCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + ' is not a function');
        }
        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }
        // 6. Let k be 0
        k = 0;
        // 7. Repeat, while k < len
        while (k < len) {
            var kValue;
            // a. Let Pk be ToString(k).
            //        This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty
            //        internal method of O with argument Pk.
            //        This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {
                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];
                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/* jshint undef: true, unused: true:, noarg: true, latedef: true */
/*global define, document, window, setTimeout, clearTimeout, ActiveXObject, DOMParser */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-core', [
            'strophe-sha1',
            'strophe-base64',
            'strophe-md5',
            'strophe-utils',
            "strophe-polyfill"
        ], function () {
            return factory.apply(this, arguments);
        });
    } else {
        // Browser globals
        var o = factory(root.SHA1, root.Base64, root.MD5, root.stropheUtils);
        window.Strophe =        o.Strophe;
        window.$build =         o.$build;
        window.$iq =            o.$iq;
        window.$msg =           o.$msg;
        window.$pres =          o.$pres;
        window.SHA1 =           o.SHA1;
        window.Base64 =         o.Base64;
        window.MD5 =            o.MD5;
        window.b64_hmac_sha1 =  o.SHA1.b64_hmac_sha1;
        window.b64_sha1 =       o.SHA1.b64_sha1;
        window.str_hmac_sha1 =  o.SHA1.str_hmac_sha1;
        window.str_sha1 =       o.SHA1.str_sha1;
    }
}(this, function (SHA1, Base64, MD5, utils) {

var Strophe;

/** Function: $build
 *  Create a Strophe.Builder.
 *  This is an alias for 'new Strophe.Builder(name, attrs)'.
 *
 *  Parameters:
 *    (String) name - The root element name.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $build(name, attrs) { return new Strophe.Builder(name, attrs); }

/** Function: $msg
 *  Create a Strophe.Builder with a <message/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <message/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $msg(attrs) { return new Strophe.Builder("message", attrs); }

/** Function: $iq
 *  Create a Strophe.Builder with an <iq/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <iq/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $iq(attrs) { return new Strophe.Builder("iq", attrs); }

/** Function: $pres
 *  Create a Strophe.Builder with a <presence/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <presence/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $pres(attrs) { return new Strophe.Builder("presence", attrs); }

/** Class: Strophe
 *  An object container for all Strophe library functions.
 *
 *  This class is just a container for all the objects and constants
 *  used in the library.  It is not meant to be instantiated, but to
 *  provide a namespace for library objects, constants, and functions.
 */
Strophe = {
    /** Constant: VERSION
     *  The version of the Strophe library. Unreleased builds will have
     *  a version of head-HASH where HASH is a partial revision.
     */
    VERSION: "1.2.11",

    /** Constants: XMPP Namespace Constants
     *  Common namespace constants from the XMPP RFCs and XEPs.
     *
     *  NS.HTTPBIND - HTTP BIND namespace from XEP 124.
     *  NS.BOSH - BOSH namespace from XEP 206.
     *  NS.CLIENT - Main XMPP client namespace.
     *  NS.AUTH - Legacy authentication namespace.
     *  NS.ROSTER - Roster operations namespace.
     *  NS.PROFILE - Profile namespace.
     *  NS.DISCO_INFO - Service discovery info namespace from XEP 30.
     *  NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
     *  NS.MUC - Multi-User Chat namespace from XEP 45.
     *  NS.SASL - XMPP SASL namespace from RFC 3920.
     *  NS.STREAM - XMPP Streams namespace from RFC 3920.
     *  NS.BIND - XMPP Binding namespace from RFC 3920.
     *  NS.SESSION - XMPP Session namespace from RFC 3920.
     *  NS.XHTML_IM - XHTML-IM namespace from XEP 71.
     *  NS.XHTML - XHTML body namespace from XEP 71.
     */
    NS: {
        HTTPBIND: "http://jabber.org/protocol/httpbind",
        BOSH: "urn:xmpp:xbosh",
        CLIENT: "jabber:client",
        AUTH: "jabber:iq:auth",
        ROSTER: "jabber:iq:roster",
        PROFILE: "jabber:iq:profile",
        DISCO_INFO: "http://jabber.org/protocol/disco#info",
        DISCO_ITEMS: "http://jabber.org/protocol/disco#items",
        MUC: "http://jabber.org/protocol/muc",
        SASL: "urn:ietf:params:xml:ns:xmpp-sasl",
        STREAM: "http://etherx.jabber.org/streams",
        FRAMING: "urn:ietf:params:xml:ns:xmpp-framing",
        BIND: "urn:ietf:params:xml:ns:xmpp-bind",
        SESSION: "urn:ietf:params:xml:ns:xmpp-session",
        VERSION: "jabber:iq:version",
        STANZAS: "urn:ietf:params:xml:ns:xmpp-stanzas",
        XHTML_IM: "http://jabber.org/protocol/xhtml-im",
        XHTML: "http://www.w3.org/1999/xhtml"
    },

    /** Constants: XHTML_IM Namespace
     *  contains allowed tags, tag attributes, and css properties.
     *  Used in the createHtml function to filter incoming html into the allowed XHTML-IM subset.
     *  See http://xmpp.org/extensions/xep-0071.html#profile-summary for the list of recommended
     *  allowed tags and their attributes.
     */
    XHTML: {
        tags: ['a','blockquote','br','cite','em','img','li','ol','p','span','strong','ul','body'],
        attributes: {
            'a':          ['href'],
            'blockquote': ['style'],
            'br':         [],
            'cite':       ['style'],
            'em':         [],
            'img':        ['src', 'alt', 'style', 'height', 'width'],
            'li':         ['style'],
            'ol':         ['style'],
            'p':          ['style'],
            'span':       ['style'],
            'strong':     [],
            'ul':         ['style'],
            'body':       []
        },
        css: ['background-color','color','font-family','font-size','font-style','font-weight','margin-left','margin-right','text-align','text-decoration'],
        /** Function: XHTML.validTag
         *
         * Utility method to determine whether a tag is allowed
         * in the XHTML_IM namespace.
         *
         * XHTML tag names are case sensitive and must be lower case.
         */
        validTag: function(tag) {
            for (var i = 0; i < Strophe.XHTML.tags.length; i++) {
                if (tag == Strophe.XHTML.tags[i]) {
                    return true;
                }
            }
            return false;
        },
        /** Function: XHTML.validAttribute
         *
         * Utility method to determine whether an attribute is allowed
         * as recommended per XEP-0071
         *
         * XHTML attribute names are case sensitive and must be lower case.
         */
        validAttribute: function(tag, attribute) {
            if (typeof Strophe.XHTML.attributes[tag] !== 'undefined' && Strophe.XHTML.attributes[tag].length > 0) {
                for (var i = 0; i < Strophe.XHTML.attributes[tag].length; i++) {
                    if (attribute == Strophe.XHTML.attributes[tag][i]) {
                        return true;
                    }
                }
            }
        return false;
        },
        validCSS: function(style) {
            for (var i = 0; i < Strophe.XHTML.css.length; i++) {
                if (style == Strophe.XHTML.css[i]) {
                    return true;
                }
            }
            return false;
        }
    },

    /** Constants: Connection Status Constants
     *  Connection status constants for use by the connection handler
     *  callback.
     *
     *  Status.ERROR - An error has occurred
     *  Status.CONNECTING - The connection is currently being made
     *  Status.CONNFAIL - The connection attempt failed
     *  Status.AUTHENTICATING - The connection is authenticating
     *  Status.AUTHFAIL - The authentication attempt failed
     *  Status.CONNECTED - The connection has succeeded
     *  Status.DISCONNECTED - The connection has been terminated
     *  Status.DISCONNECTING - The connection is currently being terminated
     *  Status.ATTACHED - The connection has been attached
     *  Status.CONNTIMEOUT - The connection has timed out
     */
    Status: {
        ERROR: 0,
        CONNECTING: 1,
        CONNFAIL: 2,
        AUTHENTICATING: 3,
        AUTHFAIL: 4,
        CONNECTED: 5,
        DISCONNECTED: 6,
        DISCONNECTING: 7,
        ATTACHED: 8,
        REDIRECT: 9,
        CONNTIMEOUT: 10
    },

    /** Constants: Log Level Constants
     *  Logging level indicators.
     *
     *  LogLevel.DEBUG - Debug output
     *  LogLevel.INFO - Informational output
     *  LogLevel.WARN - Warnings
     *  LogLevel.ERROR - Errors
     *  LogLevel.FATAL - Fatal errors
     */
    LogLevel: {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        FATAL: 4
    },

    /** PrivateConstants: DOM Element Type Constants
     *  DOM element types.
     *
     *  ElementType.NORMAL - Normal element.
     *  ElementType.TEXT - Text data element.
     *  ElementType.FRAGMENT - XHTML fragment element.
     */
    ElementType: {
        NORMAL: 1,
        TEXT: 3,
        CDATA: 4,
        FRAGMENT: 11
    },

    /** PrivateConstants: Timeout Values
     *  Timeout values for error states.  These values are in seconds.
     *  These should not be changed unless you know exactly what you are
     *  doing.
     *
     *  TIMEOUT - Timeout multiplier. A waiting request will be considered
     *      failed after Math.floor(TIMEOUT * wait) seconds have elapsed.
     *      This defaults to 1.1, and with default wait, 66 seconds.
     *  SECONDARY_TIMEOUT - Secondary timeout multiplier. In cases where
     *      Strophe can detect early failure, it will consider the request
     *      failed if it doesn't return after
     *      Math.floor(SECONDARY_TIMEOUT * wait) seconds have elapsed.
     *      This defaults to 0.1, and with default wait, 6 seconds.
     */
    TIMEOUT: 1.1,
    SECONDARY_TIMEOUT: 0.1,

    /** Function: addNamespace
     *  This function is used to extend the current namespaces in
     *  Strophe.NS.  It takes a key and a value with the key being the
     *  name of the new namespace, with its actual value.
     *  For example:
     *  Strophe.addNamespace('PUBSUB', "http://jabber.org/protocol/pubsub");
     *
     *  Parameters:
     *    (String) name - The name under which the namespace will be
     *      referenced under Strophe.NS
     *    (String) value - The actual namespace.
     */
    addNamespace: function (name, value) {
        Strophe.NS[name] = value;
    },

    /** Function: forEachChild
     *  Map a function over some or all child elements of a given element.
     *
     *  This is a small convenience function for mapping a function over
     *  some or all of the children of an element.  If elemName is null, all
     *  children will be passed to the function, otherwise only children
     *  whose tag names match elemName will be passed.
     *
     *  Parameters:
     *    (XMLElement) elem - The element to operate on.
     *    (String) elemName - The child element tag name filter.
     *    (Function) func - The function to apply to each child.  This
     *      function should take a single argument, a DOM element.
     */
    forEachChild: function (elem, elemName, func) {
        var i, childNode;
        for (i = 0; i < elem.childNodes.length; i++) {
            childNode = elem.childNodes[i];
            if (childNode.nodeType == Strophe.ElementType.NORMAL &&
                (!elemName || this.isTagEqual(childNode, elemName))) {
                func(childNode);
            }
        }
    },

    /** Function: isTagEqual
     *  Compare an element's tag name with a string.
     *
     *  This function is case sensitive.
     *
     *  Parameters:
     *    (XMLElement) el - A DOM element.
     *    (String) name - The element name.
     *
     *  Returns:
     *    true if the element's tag name matches _el_, and false
     *    otherwise.
     */
    isTagEqual: function (el, name) {
        return el.tagName == name;
    },

    /** PrivateVariable: _xmlGenerator
     *  _Private_ variable that caches a DOM document to
     *  generate elements.
     */
    _xmlGenerator: null,

    /** PrivateFunction: _makeGenerator
     *  _Private_ function that creates a dummy XML DOM document to serve as
     *  an element and text node generator.
     */
    _makeGenerator: function () {
        var doc;
        // IE9 does implement createDocument(); however, using it will cause the browser to leak memory on page unload.
        // Here, we test for presence of createDocument() plus IE's proprietary documentMode attribute, which would be
                // less than 10 in the case of IE9 and below.
        if (document.implementation.createDocument === undefined ||
                        document.implementation.createDocument && document.documentMode && document.documentMode < 10) {
            doc = this._getIEXmlDom();
            doc.appendChild(doc.createElement('strophe'));
        } else {
            doc = document.implementation
                .createDocument('jabber:client', 'strophe', null);
        }
        return doc;
    },

    /** Function: xmlGenerator
     *  Get the DOM document to generate elements.
     *
     *  Returns:
     *    The currently used DOM document.
     */
    xmlGenerator: function () {
        if (!Strophe._xmlGenerator) {
            Strophe._xmlGenerator = Strophe._makeGenerator();
        }
        return Strophe._xmlGenerator;
    },

    /** PrivateFunction: _getIEXmlDom
     *  Gets IE xml doc object
     *
     *  Returns:
     *    A Microsoft XML DOM Object
     *  See Also:
     *    http://msdn.microsoft.com/en-us/library/ms757837%28VS.85%29.aspx
     */
    _getIEXmlDom : function() {
        var doc = null;
        var docStrings = [
            "Msxml2.DOMDocument.6.0",
            "Msxml2.DOMDocument.5.0",
            "Msxml2.DOMDocument.4.0",
            "MSXML2.DOMDocument.3.0",
            "MSXML2.DOMDocument",
            "MSXML.DOMDocument",
            "Microsoft.XMLDOM"
        ];

        for (var d = 0; d < docStrings.length; d++) {
            if (doc === null) {
                try {
                    doc = new ActiveXObject(docStrings[d]);
                } catch (e) {
                    doc = null;
                }
            } else {
                break;
            }
        }
        return doc;
    },

    /** Function: xmlElement
     *  Create an XML DOM element.
     *
     *  This function creates an XML DOM element correctly across all
     *  implementations. Note that these are not HTML DOM elements, which
     *  aren't appropriate for XMPP stanzas.
     *
     *  Parameters:
     *    (String) name - The name for the element.
     *    (Array|Object) attrs - An optional array or object containing
     *      key/value pairs to use as element attributes. The object should
     *      be in the format {'key': 'value'} or {key: 'value'}. The array
     *      should have the format [['key1', 'value1'], ['key2', 'value2']].
     *    (String) text - The text child data for the element.
     *
     *  Returns:
     *    A new XML DOM element.
     */
    xmlElement: function (name) {
        if (!name) { return null; }

        var node = Strophe.xmlGenerator().createElement(name);
        // FIXME: this should throw errors if args are the wrong type or
        // there are more than two optional args
        var a, i, k;
        for (a = 1; a < arguments.length; a++) {
            var arg = arguments[a];
            if (!arg) { continue; }
            if (typeof(arg) == "string" ||
                typeof(arg) == "number") {
                node.appendChild(Strophe.xmlTextNode(arg));
            } else if (typeof(arg) == "object" &&
                       typeof(arg.sort) == "function") {
                for (i = 0; i < arg.length; i++) {
                    var attr = arg[i];
                    if (typeof(attr) == "object" &&
                        typeof(attr.sort) == "function" &&
                        attr[1] !== undefined &&
                        attr[1] !== null) {
                        node.setAttribute(attr[0], attr[1]);
                    }
                }
            } else if (typeof(arg) == "object") {
                for (k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        if (arg[k] !== undefined &&
                            arg[k] !== null) {
                            node.setAttribute(k, arg[k]);
                        }
                    }
                }
            }
        }

        return node;
    },

    /*  Function: xmlescape
     *  Excapes invalid xml characters.
     *
     *  Parameters:
     *     (String) text - text to escape.
     *
     *  Returns:
     *      Escaped text.
     */
    xmlescape: function(text) {
        text = text.replace(/\&/g, "&amp;");
        text = text.replace(/</g,  "&lt;");
        text = text.replace(/>/g,  "&gt;");
        text = text.replace(/'/g,  "&apos;");
        text = text.replace(/"/g,  "&quot;");
        return text;
    },

    /*  Function: xmlunescape
    *  Unexcapes invalid xml characters.
    *
    *  Parameters:
    *     (String) text - text to unescape.
    *
    *  Returns:
    *      Unescaped text.
    */
    xmlunescape: function(text) {
        text = text.replace(/\&amp;/g, "&");
        text = text.replace(/&lt;/g,  "<");
        text = text.replace(/&gt;/g,  ">");
        text = text.replace(/&apos;/g,  "'");
        text = text.replace(/&quot;/g,  "\"");
        return text;
    },

    /** Function: xmlTextNode
     *  Creates an XML DOM text node.
     *
     *  Provides a cross implementation version of document.createTextNode.
     *
     *  Parameters:
     *    (String) text - The content of the text node.
     *
     *  Returns:
     *    A new XML DOM text node.
     */
    xmlTextNode: function (text) {
        return Strophe.xmlGenerator().createTextNode(text);
    },

    /** Function: xmlHtmlNode
     *  Creates an XML DOM html node.
     *
     *  Parameters:
     *    (String) html - The content of the html node.
     *
     *  Returns:
     *    A new XML DOM text node.
     */
    xmlHtmlNode: function (html) {
        var node;
        //ensure text is escaped
        if (window.DOMParser) {
            var parser = new DOMParser();
            node = parser.parseFromString(html, "text/xml");
        } else {
            node = new ActiveXObject("Microsoft.XMLDOM");
            node.async="false";
            node.loadXML(html);
        }
        return node;
    },

    /** Function: getText
     *  Get the concatenation of all text children of an element.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A String with the concatenated text of all text element children.
     */
    getText: function (elem) {
        if (!elem) { return null; }

        var str = "";
        if (elem.childNodes.length === 0 && elem.nodeType ==
            Strophe.ElementType.TEXT) {
            str += elem.nodeValue;
        }

        for (var i = 0; i < elem.childNodes.length; i++) {
            if (elem.childNodes[i].nodeType == Strophe.ElementType.TEXT) {
                str += elem.childNodes[i].nodeValue;
            }
        }

        return Strophe.xmlescape(str);
    },

    /** Function: copyElement
     *  Copy an XML DOM element.
     *
     *  This function copies a DOM element and all its descendants and returns
     *  the new copy.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A new, copied DOM element tree.
     */
    copyElement: function (elem) {
        var i, el;
        if (elem.nodeType == Strophe.ElementType.NORMAL) {
            el = Strophe.xmlElement(elem.tagName);

            for (i = 0; i < elem.attributes.length; i++) {
                el.setAttribute(elem.attributes[i].nodeName,
                                elem.attributes[i].value);
            }

            for (i = 0; i < elem.childNodes.length; i++) {
                el.appendChild(Strophe.copyElement(elem.childNodes[i]));
            }
        } else if (elem.nodeType == Strophe.ElementType.TEXT) {
            el = Strophe.xmlGenerator().createTextNode(elem.nodeValue);
        }
        return el;
    },


    /** Function: createHtml
     *  Copy an HTML DOM element into an XML DOM.
     *
     *  This function copies a DOM element and all its descendants and returns
     *  the new copy.
     *
     *  Parameters:
     *    (HTMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A new, copied DOM element tree.
     */
    createHtml: function (elem) {
        var i, el, j, tag, attribute, value, css, cssAttrs, attr, cssName, cssValue;
        if (elem.nodeType == Strophe.ElementType.NORMAL) {
            tag = elem.nodeName.toLowerCase(); // XHTML tags must be lower case.
            if(Strophe.XHTML.validTag(tag)) {
                try {
                    el = Strophe.xmlElement(tag);
                    for(i = 0; i < Strophe.XHTML.attributes[tag].length; i++) {
                        attribute = Strophe.XHTML.attributes[tag][i];
                        value = elem.getAttribute(attribute);
                        if(typeof value == 'undefined' || value === null || value === '' || value === false || value === 0) {
                            continue;
                        }
                        if(attribute == 'style' && typeof value == 'object') {
                            if(typeof value.cssText != 'undefined') {
                                value = value.cssText; // we're dealing with IE, need to get CSS out
                            }
                        }
                        // filter out invalid css styles
                        if(attribute == 'style') {
                            css = [];
                            cssAttrs = value.split(';');
                            for(j = 0; j < cssAttrs.length; j++) {
                                attr = cssAttrs[j].split(':');
                                cssName = attr[0].replace(/^\s*/, "").replace(/\s*$/, "").toLowerCase();
                                if(Strophe.XHTML.validCSS(cssName)) {
                                    cssValue = attr[1].replace(/^\s*/, "").replace(/\s*$/, "");
                                    css.push(cssName + ': ' + cssValue);
                                }
                            }
                            if(css.length > 0) {
                                value = css.join('; ');
                                el.setAttribute(attribute, value);
                            }
                        } else {
                            el.setAttribute(attribute, value);
                        }
                    }

                    for (i = 0; i < elem.childNodes.length; i++) {
                        el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                    }
                } catch(e) { // invalid elements
                  el = Strophe.xmlTextNode('');
                }
            } else {
                el = Strophe.xmlGenerator().createDocumentFragment();
                for (i = 0; i < elem.childNodes.length; i++) {
                    el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                }
            }
        } else if (elem.nodeType == Strophe.ElementType.FRAGMENT) {
            el = Strophe.xmlGenerator().createDocumentFragment();
            for (i = 0; i < elem.childNodes.length; i++) {
                el.appendChild(Strophe.createHtml(elem.childNodes[i]));
            }
        } else if (elem.nodeType == Strophe.ElementType.TEXT) {
            el = Strophe.xmlTextNode(elem.nodeValue);
        }
        return el;
    },

    /** Function: escapeNode
     *  Escape the node part (also called local part) of a JID.
     *
     *  Parameters:
     *    (String) node - A node (or local part).
     *
     *  Returns:
     *    An escaped node (or local part).
     */
    escapeNode: function (node) {
        if (typeof node !== "string") { return node; }
        return node.replace(/^\s+|\s+$/g, '')
            .replace(/\\/g,  "\\5c")
            .replace(/ /g,   "\\20")
            .replace(/\"/g,  "\\22")
            .replace(/\&/g,  "\\26")
            .replace(/\'/g,  "\\27")
            .replace(/\//g,  "\\2f")
            .replace(/:/g,   "\\3a")
            .replace(/</g,   "\\3c")
            .replace(/>/g,   "\\3e")
            .replace(/@/g,   "\\40");
    },

    /** Function: unescapeNode
     *  Unescape a node part (also called local part) of a JID.
     *
     *  Parameters:
     *    (String) node - A node (or local part).
     *
     *  Returns:
     *    An unescaped node (or local part).
     */
    unescapeNode: function (node) {
        if (typeof node !== "string") { return node; }
        return node.replace(/\\20/g, " ")
            .replace(/\\22/g, '"')
            .replace(/\\26/g, "&")
            .replace(/\\27/g, "'")
            .replace(/\\2f/g, "/")
            .replace(/\\3a/g, ":")
            .replace(/\\3c/g, "<")
            .replace(/\\3e/g, ">")
            .replace(/\\40/g, "@")
            .replace(/\\5c/g, "\\");
    },

    /** Function: getNodeFromJid
     *  Get the node portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the node.
     */
    getNodeFromJid: function (jid) {
        if (jid.indexOf("@") < 0) { return null; }
        return jid.split("@")[0];
    },

    /** Function: getDomainFromJid
     *  Get the domain portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the domain.
     */
    getDomainFromJid: function (jid) {
        var bare = Strophe.getBareJidFromJid(jid);
        if (bare.indexOf("@") < 0) {
            return bare;
        } else {
            var parts = bare.split("@");
            parts.splice(0, 1);
            return parts.join('@');
        }
    },

    /** Function: getResourceFromJid
     *  Get the resource portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the resource.
     */
    getResourceFromJid: function (jid) {
        var s = jid.split("/");
        if (s.length < 2) { return null; }
        s.splice(0, 1);
        return s.join('/');
    },

    /** Function: getBareJidFromJid
     *  Get the bare JID from a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the bare JID.
     */
    getBareJidFromJid: function (jid) {
        return jid ? jid.split("/")[0] : null;
    },

    /** PrivateFunction: _handleError
     *  _Private_ function that properly logs an error to the console
     */
    _handleError: function (e) {
        if (typeof e.stack !== "undefined") {
            Strophe.fatal(e.stack);
        }
        if (e.sourceURL) {
            Strophe.fatal("error: " + this.handler + " " + e.sourceURL + ":" +
                          e.line + " - " + e.name + ": " + e.message);
        } else if (e.fileName) {
            Strophe.fatal("error: " + this.handler + " " +
                          e.fileName + ":" + e.lineNumber + " - " +
                          e.name + ": " + e.message);
        } else {
            Strophe.fatal("error: " + e.message);
        }
    },

    /** Function: log
     *  User overrideable logging function.
     *
     *  This function is called whenever the Strophe library calls any
     *  of the logging functions.  The default implementation of this
     *  function does nothing.  If client code wishes to handle the logging
     *  messages, it should override this with
     *  > Strophe.log = function (level, msg) {
     *  >   (user code here)
     *  > };
     *
     *  Please note that data sent and received over the wire is logged
     *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
     *
     *  The different levels and their meanings are
     *
     *    DEBUG - Messages useful for debugging purposes.
     *    INFO - Informational messages.  This is mostly information like
     *      'disconnect was called' or 'SASL auth succeeded'.
     *    WARN - Warnings about potential problems.  This is mostly used
     *      to report transient connection errors like request timeouts.
     *    ERROR - Some error occurred.
     *    FATAL - A non-recoverable fatal error occurred.
     *
     *  Parameters:
     *    (Integer) level - The log level of the log message.  This will
     *      be one of the values in Strophe.LogLevel.
     *    (String) msg - The log message.
     */
    /* jshint ignore:start */
    log: function (level, msg) {
        return;
    },
    /* jshint ignore:end */

    /** Function: debug
     *  Log a message at the Strophe.LogLevel.DEBUG level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    debug: function(msg) {
        this.log(this.LogLevel.DEBUG, msg);
    },

    /** Function: info
     *  Log a message at the Strophe.LogLevel.INFO level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    info: function (msg) {
        this.log(this.LogLevel.INFO, msg);
    },

    /** Function: warn
     *  Log a message at the Strophe.LogLevel.WARN level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    warn: function (msg) {
        this.log(this.LogLevel.WARN, msg);
    },

    /** Function: error
     *  Log a message at the Strophe.LogLevel.ERROR level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    error: function (msg) {
        this.log(this.LogLevel.ERROR, msg);
    },

    /** Function: fatal
     *  Log a message at the Strophe.LogLevel.FATAL level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    fatal: function (msg) {
        this.log(this.LogLevel.FATAL, msg);
    },

    /** Function: serialize
     *  Render a DOM element and all descendants to a String.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    The serialized element tree as a String.
     */
    serialize: function (elem) {
        var result;

        if (!elem) { return null; }

        if (typeof(elem.tree) === "function") {
            elem = elem.tree();
        }

        var nodeName = elem.nodeName;
        var i, child;

        if (elem.getAttribute("_realname")) {
            nodeName = elem.getAttribute("_realname");
        }

        result = "<" + nodeName;
        for (i = 0; i < elem.attributes.length; i++) {
             if(elem.attributes[i].nodeName != "_realname") {
               result += " " + elem.attributes[i].nodeName +
                   "='" + Strophe.xmlescape(elem.attributes[i].value) + "'";
             }
        }

        if (elem.childNodes.length > 0) {
            result += ">";
            for (i = 0; i < elem.childNodes.length; i++) {
                child = elem.childNodes[i];
                switch( child.nodeType ){
                  case Strophe.ElementType.NORMAL:
                    // normal element, so recurse
                    result += Strophe.serialize(child);
                    break;
                  case Strophe.ElementType.TEXT:
                    // text element to escape values
                    result += Strophe.xmlescape(child.nodeValue);
                    break;
                  case Strophe.ElementType.CDATA:
                    // cdata section so don't escape values
                    result += "<![CDATA["+child.nodeValue+"]]>";
                }
            }
            result += "</" + nodeName + ">";
        } else {
            result += "/>";
        }

        return result;
    },

    /** PrivateVariable: _requestId
     *  _Private_ variable that keeps track of the request ids for
     *  connections.
     */
    _requestId: 0,

    /** PrivateVariable: Strophe.connectionPlugins
     *  _Private_ variable Used to store plugin names that need
     *  initialization on Strophe.Connection construction.
     */
    _connectionPlugins: {},

    /** Function: addConnectionPlugin
     *  Extends the Strophe.Connection object with the given plugin.
     *
     *  Parameters:
     *    (String) name - The name of the extension.
     *    (Object) ptype - The plugin's prototype.
     */
    addConnectionPlugin: function (name, ptype) {
        Strophe._connectionPlugins[name] = ptype;
    }
};

/** Class: Strophe.Builder
 *  XML DOM builder.
 *
 *  This object provides an interface similar to JQuery but for building
 *  DOM elements easily and rapidly.  All the functions except for toString()
 *  and tree() return the object, so calls can be chained.  Here's an
 *  example using the $iq() builder helper.
 *  > $iq({to: 'you', from: 'me', type: 'get', id: '1'})
 *  >     .c('query', {xmlns: 'strophe:example'})
 *  >     .c('example')
 *  >     .toString()
 *
 *  The above generates this XML fragment
 *  > <iq to='you' from='me' type='get' id='1'>
 *  >   <query xmlns='strophe:example'>
 *  >     <example/>
 *  >   </query>
 *  > </iq>
 *  The corresponding DOM manipulations to get a similar fragment would be
 *  a lot more tedious and probably involve several helper variables.
 *
 *  Since adding children makes new operations operate on the child, up()
 *  is provided to traverse up the tree.  To add two children, do
 *  > builder.c('child1', ...).up().c('child2', ...)
 *  The next operation on the Builder will be relative to the second child.
 */

/** Constructor: Strophe.Builder
 *  Create a Strophe.Builder object.
 *
 *  The attributes should be passed in object notation.  For example
 *  > var b = new Builder('message', {to: 'you', from: 'me'});
 *  or
 *  > var b = new Builder('messsage', {'xml:lang': 'en'});
 *
 *  Parameters:
 *    (String) name - The name of the root element.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder.
 */
Strophe.Builder = function (name, attrs) {
    // Set correct namespace for jabber:client elements
    if (name == "presence" || name == "message" || name == "iq") {
        if (attrs && !attrs.xmlns) {
            attrs.xmlns = Strophe.NS.CLIENT;
        } else if (!attrs) {
            attrs = {xmlns: Strophe.NS.CLIENT};
        }
    }

    // Holds the tree being built.
    this.nodeTree = Strophe.xmlElement(name, attrs);

    // Points to the current operation node.
    this.node = this.nodeTree;
};

Strophe.Builder.prototype = {
    /** Function: tree
     *  Return the DOM tree.
     *
     *  This function returns the current DOM tree as an element object.  This
     *  is suitable for passing to functions like Strophe.Connection.send().
     *
     *  Returns:
     *    The DOM tree as a element object.
     */
    tree: function () {
        return this.nodeTree;
    },

    /** Function: toString
     *  Serialize the DOM tree to a String.
     *
     *  This function returns a string serialization of the current DOM
     *  tree.  It is often used internally to pass data to a
     *  Strophe.Request object.
     *
     *  Returns:
     *    The serialized DOM tree in a String.
     */
    toString: function () {
        return Strophe.serialize(this.nodeTree);
    },

    /** Function: up
     *  Make the current parent element the new current element.
     *
     *  This function is often used after c() to traverse back up the tree.
     *  For example, to add two children to the same element
     *  > builder.c('child1', {}).up().c('child2', {});
     *
     *  Returns:
     *    The Stophe.Builder object.
     */
    up: function () {
        this.node = this.node.parentNode;
        return this;
    },

    /** Function: root
     *  Make the root element the new current element.
     *
     *  When at a deeply nested element in the tree, this function can be used
     *  to jump back to the root of the tree, instead of having to repeatedly
     *  call up().
     *
     *  Returns:
     *    The Stophe.Builder object.
     */
    root: function () {
        this.node = this.nodeTree;
        return this;
    },

    /** Function: attrs
     *  Add or modify attributes of the current element.
     *
     *  The attributes should be passed in object notation.  This function
     *  does not move the current element pointer.
     *
     *  Parameters:
     *    (Object) moreattrs - The attributes to add/modify in object notation.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    attrs: function (moreattrs) {
        for (var k in moreattrs) {
            if (moreattrs.hasOwnProperty(k)) {
                if (moreattrs[k] === undefined) {
                    this.node.removeAttribute(k);
                } else {
                    this.node.setAttribute(k, moreattrs[k]);
                }
            }
        }
        return this;
    },

    /** Function: c
     *  Add a child to the current element and make it the new current
     *  element.
     *
     *  This function moves the current element pointer to the child,
     *  unless text is provided.  If you need to add another child, it
     *  is necessary to use up() to go back to the parent in the tree.
     *
     *  Parameters:
     *    (String) name - The name of the child.
     *    (Object) attrs - The attributes of the child in object notation.
     *    (String) text - The text to add to the child.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    c: function (name, attrs, text) {
        var child = Strophe.xmlElement(name, attrs, text);
        this.node.appendChild(child);
        if (typeof text !== "string" && typeof text !=="number") {
            this.node = child;
        }
        return this;
    },

    /** Function: cnode
     *  Add a child to the current element and make it the new current
     *  element.
     *
     *  This function is the same as c() except that instead of using a
     *  name and an attributes object to create the child it uses an
     *  existing DOM element object.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    cnode: function (elem) {
        var impNode;
        var xmlGen = Strophe.xmlGenerator();
        try {
            impNode = (xmlGen.importNode !== undefined);
        } catch (e) {
            impNode = false;
        }
        var newElem = impNode ?
                      xmlGen.importNode(elem, true) :
                      Strophe.copyElement(elem);
        this.node.appendChild(newElem);
        this.node = newElem;
        return this;
    },

    /** Function: t
     *  Add a child text element.
     *
     *  This *does not* make the child the new current element since there
     *  are no children of text elements.
     *
     *  Parameters:
     *    (String) text - The text data to append to the current element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    t: function (text) {
        var child = Strophe.xmlTextNode(text);
        this.node.appendChild(child);
        return this;
    },

    /** Function: h
     *  Replace current element contents with the HTML passed in.
     *
     *  This *does not* make the child the new current element
     *
     *  Parameters:
     *    (String) html - The html to insert as contents of current element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    h: function (html) {
        var fragment = document.createElement('body');

        // force the browser to try and fix any invalid HTML tags
        fragment.innerHTML = html;

        // copy cleaned html into an xml dom
        var xhtml = Strophe.createHtml(fragment);

        while(xhtml.childNodes.length > 0) {
            this.node.appendChild(xhtml.childNodes[0]);
        }
        return this;
    }
};

/** PrivateClass: Strophe.Handler
 *  _Private_ helper class for managing stanza handlers.
 *
 *  A Strophe.Handler encapsulates a user provided callback function to be
 *  executed when matching stanzas are received by the connection.
 *  Handlers can be either one-off or persistant depending on their
 *  return value. Returning true will cause a Handler to remain active, and
 *  returning false will remove the Handler.
 *
 *  Users will not use Strophe.Handler objects directly, but instead they
 *  will use Strophe.Connection.addHandler() and
 *  Strophe.Connection.deleteHandler().
 */

/** PrivateConstructor: Strophe.Handler
 *  Create and initialize a new Strophe.Handler.
 *
 *  Parameters:
 *    (Function) handler - A function to be executed when the handler is run.
 *    (String) ns - The namespace to match.
 *    (String) name - The element name to match.
 *    (String) type - The element type to match.
 *    (String) id - The element id attribute to match.
 *    (String) from - The element from attribute to match.
 *    (Object) options - Handler options
 *
 *  Returns:
 *    A new Strophe.Handler object.
 */
Strophe.Handler = function (handler, ns, name, type, id, from, options) {
    this.handler = handler;
    this.ns = ns;
    this.name = name;
    this.type = type;
    this.id = id;
    this.options = options || {'matchBareFromJid': false, 'ignoreNamespaceFragment': false};
    // BBB: Maintain backward compatibility with old `matchBare` option
    if (this.options.matchBare) {
        Strophe.warn('The "matchBare" option is deprecated, use "matchBareFromJid" instead.');
        this.options.matchBareFromJid = this.options.matchBare;
        delete this.options.matchBare;
    }

    if (this.options.matchBareFromJid) {
        this.from = from ? Strophe.getBareJidFromJid(from) : null;
    } else {
        this.from = from;
    }
    // whether the handler is a user handler or a system handler
    this.user = true;
};

Strophe.Handler.prototype = {
    /** PrivateFunction: getNamespace
     *  Returns the XML namespace attribute on an element.
     *  If `ignoreNamespaceFragment` was passed in for this handler, then the
     *  URL fragment will be stripped.
     *
     *  Parameters:
     *    (XMLElement) elem - The XML element with the namespace.
     *
     *  Returns:
     *    The namespace, with optionally the fragment stripped.
     */
    getNamespace: function (elem) {
        var elNamespace = elem.getAttribute("xmlns");
        if (elNamespace && this.options.ignoreNamespaceFragment) {
            elNamespace = elNamespace.split('#')[0];
        }
        return elNamespace;
    },

    /** PrivateFunction: namespaceMatch
     *  Tests if a stanza matches the namespace set for this Strophe.Handler.
     *
     *  Parameters:
     *    (XMLElement) elem - The XML element to test.
     *
     *  Returns:
     *    true if the stanza matches and false otherwise.
     */
    namespaceMatch: function (elem) {
        var nsMatch = false;
        if (!this.ns) {
            return true;
        } else {
            var that = this;
            Strophe.forEachChild(elem, null, function (elem) {
                if (that.getNamespace(elem) === that.ns) {
                    nsMatch = true;
                }
            });
            nsMatch = nsMatch || this.getNamespace(elem) === this.ns;
        }
        return nsMatch;
    },

    /** PrivateFunction: isMatch
     *  Tests if a stanza matches the Strophe.Handler.
     *
     *  Parameters:
     *    (XMLElement) elem - The XML element to test.
     *
     *  Returns:
     *    true if the stanza matches and false otherwise.
     */
    isMatch: function (elem) {
        var from = elem.getAttribute('from');
        if (this.options.matchBareFromJid) {
            from = Strophe.getBareJidFromJid(from);
        }
        var elem_type = elem.getAttribute("type");
        if (this.namespaceMatch(elem) &&
            (!this.name || Strophe.isTagEqual(elem, this.name)) &&
            (!this.type || (Array.isArray(this.type) ? this.type.indexOf(elem_type) != -1 : elem_type == this.type)) &&
            (!this.id || elem.getAttribute("id") == this.id) &&
            (!this.from || from == this.from)) {
                return true;
        }
        return false;
    },

    /** PrivateFunction: run
     *  Run the callback on a matching stanza.
     *
     *  Parameters:
     *    (XMLElement) elem - The DOM element that triggered the
     *      Strophe.Handler.
     *
     *  Returns:
     *    A boolean indicating if the handler should remain active.
     */
    run: function (elem) {
        var result = null;
        try {
            result = this.handler(elem);
        } catch (e) {
            Strophe._handleError(e);
            throw e;
        }
        return result;
    },

    /** PrivateFunction: toString
     *  Get a String representation of the Strophe.Handler object.
     *
     *  Returns:
     *    A String.
     */
    toString: function () {
        return "{Handler: " + this.handler + "(" + this.name + "," +
            this.id + "," + this.ns + ")}";
    }
};

/** PrivateClass: Strophe.TimedHandler
 *  _Private_ helper class for managing timed handlers.
 *
 *  A Strophe.TimedHandler encapsulates a user provided callback that
 *  should be called after a certain period of time or at regular
 *  intervals.  The return value of the callback determines whether the
 *  Strophe.TimedHandler will continue to fire.
 *
 *  Users will not use Strophe.TimedHandler objects directly, but instead
 *  they will use Strophe.Connection.addTimedHandler() and
 *  Strophe.Connection.deleteTimedHandler().
 */

/** PrivateConstructor: Strophe.TimedHandler
 *  Create and initialize a new Strophe.TimedHandler object.
 *
 *  Parameters:
 *    (Integer) period - The number of milliseconds to wait before the
 *      handler is called.
 *    (Function) handler - The callback to run when the handler fires.  This
 *      function should take no arguments.
 *
 *  Returns:
 *    A new Strophe.TimedHandler object.
 */
Strophe.TimedHandler = function (period, handler) {
    this.period = period;
    this.handler = handler;
    this.lastCalled = new Date().getTime();
    this.user = true;
};

Strophe.TimedHandler.prototype = {
    /** PrivateFunction: run
     *  Run the callback for the Strophe.TimedHandler.
     *
     *  Returns:
     *    true if the Strophe.TimedHandler should be called again, and false
     *      otherwise.
     */
    run: function () {
        this.lastCalled = new Date().getTime();
        return this.handler();
    },

    /** PrivateFunction: reset
     *  Reset the last called time for the Strophe.TimedHandler.
     */
    reset: function () {
        this.lastCalled = new Date().getTime();
    },

    /** PrivateFunction: toString
     *  Get a string representation of the Strophe.TimedHandler object.
     *
     *  Returns:
     *    The string representation.
     */
    toString: function () {
        return "{TimedHandler: " + this.handler + "(" + this.period +")}";
    }
};

/** Class: Strophe.Connection
 *  XMPP Connection manager.
 *
 *  This class is the main part of Strophe.  It manages a BOSH or websocket
 *  connection to an XMPP server and dispatches events to the user callbacks
 *  as data arrives. It supports SASL PLAIN, SASL DIGEST-MD5, SASL SCRAM-SHA1
 *  and legacy authentication.
 *
 *  After creating a Strophe.Connection object, the user will typically
 *  call connect() with a user supplied callback to handle connection level
 *  events like authentication failure, disconnection, or connection
 *  complete.
 *
 *  The user will also have several event handlers defined by using
 *  addHandler() and addTimedHandler().  These will allow the user code to
 *  respond to interesting stanzas or do something periodically with the
 *  connection. These handlers will be active once authentication is
 *  finished.
 *
 *  To send data to the connection, use send().
 */

/** Constructor: Strophe.Connection
 *  Create and initialize a Strophe.Connection object.
 *
 *  The transport-protocol for this connection will be chosen automatically
 *  based on the given service parameter. URLs starting with "ws://" or
 *  "wss://" will use WebSockets, URLs starting with "http://", "https://"
 *  or without a protocol will use BOSH.
 *
 *  To make Strophe connect to the current host you can leave out the protocol
 *  and host part and just pass the path, e.g.
 *
 *  > var conn = new Strophe.Connection("/http-bind/");
 *
 *  Options common to both Websocket and BOSH:
 *  ------------------------------------------
 *
 *  cookies:
 *
 *  The *cookies* option allows you to pass in cookies to be added to the
 *  document. These cookies will then be included in the BOSH XMLHttpRequest
 *  or in the websocket connection.
 *
 *  The passed in value must be a map of cookie names and string values.
 *
 *  > { "myCookie": {
 *  >     "value": "1234",
 *  >     "domain": ".example.org",
 *  >     "path": "/",
 *  >     "expires": expirationDate
 *  >     }
 *  > }
 *
 *  Note that cookies can't be set in this way for other domains (i.e. cross-domain).
 *  Those cookies need to be set under those domains, for example they can be
 *  set server-side by making a XHR call to that domain to ask it to set any
 *  necessary cookies.
 *
 *  mechanisms:
 *
 *  The *mechanisms* option allows you to specify the SASL mechanisms that this
 *  instance of Strophe.Connection (and therefore your XMPP client) will
 *  support.
 *
 *  The value must be an array of objects with Strophe.SASLMechanism
 *  prototypes.
 *
 *  If nothing is specified, then the following mechanisms (and their
 *  priorities) are registered:
 *
 *      EXTERNAL - 60
 *      OAUTHBEARER - 50
 *      SCRAM-SHA1 - 40
 *      DIGEST-MD5 - 30
 *      PLAIN - 20
 *      ANONYMOUS - 10
 *
 *  WebSocket options:
 *  ------------------
 *
 *  If you want to connect to the current host with a WebSocket connection you
 *  can tell Strophe to use WebSockets through a "protocol" attribute in the
 *  optional options parameter. Valid values are "ws" for WebSocket and "wss"
 *  for Secure WebSocket.
 *  So to connect to "wss://CURRENT_HOSTNAME/xmpp-websocket" you would call
 *
 *  > var conn = new Strophe.Connection("/xmpp-websocket/", {protocol: "wss"});
 *
 *  Note that relative URLs _NOT_ starting with a "/" will also include the path
 *  of the current site.
 *
 *  Also because downgrading security is not permitted by browsers, when using
 *  relative URLs both BOSH and WebSocket connections will use their secure
 *  variants if the current connection to the site is also secure (https).
 *
 *  BOSH options:
 *  -------------
 *
 *  By adding "sync" to the options, you can control if requests will
 *  be made synchronously or not. The default behaviour is asynchronous.
 *  If you want to make requests synchronous, make "sync" evaluate to true.
 *  > var conn = new Strophe.Connection("/http-bind/", {sync: true});
 *
 *  You can also toggle this on an already established connection.
 *  > conn.options.sync = true;
 *
 *  The *customHeaders* option can be used to provide custom HTTP headers to be
 *  included in the XMLHttpRequests made.
 *
 *  The *keepalive* option can be used to instruct Strophe to maintain the
 *  current BOSH session across interruptions such as webpage reloads.
 *
 *  It will do this by caching the sessions tokens in sessionStorage, and when
 *  "restore" is called it will check whether there are cached tokens with
 *  which it can resume an existing session.
 *
 *  The *withCredentials* option should receive a Boolean value and is used to
 *  indicate wether cookies should be included in ajax requests (by default
 *  they're not).
 *  Set this value to true if you are connecting to a BOSH service
 *  and for some reason need to send cookies to it.
 *  In order for this to work cross-domain, the server must also enable
 *  credentials by setting the Access-Control-Allow-Credentials response header
 *  to "true". For most usecases however this setting should be false (which
 *  is the default).
 *  Additionally, when using Access-Control-Allow-Credentials, the
 *  Access-Control-Allow-Origin header can't be set to the wildcard "*", but
 *  instead must be restricted to actual domains.
 *
 *  The *contentType* option can be set to change the default Content-Type
 *  of "text/xml; charset=utf-8", which can be useful to reduce the amount of
 *  CORS preflight requests that are sent to the server.
 *
 *  Parameters:
 *    (String) service - The BOSH or WebSocket service URL.
 *    (Object) options - A hash of configuration options
 *
 *  Returns:
 *    A new Strophe.Connection object.
 */
Strophe.Connection = function (service, options) {
    // The service URL
    this.service = service;
    // Configuration options
    this.options = options || {};
    var proto = this.options.protocol || "";

    // Select protocal based on service or options
    if (service.indexOf("ws:") === 0 || service.indexOf("wss:") === 0 ||
            proto.indexOf("ws") === 0) {
        this._proto = new Strophe.Websocket(this);
    } else {
        this._proto = new Strophe.Bosh(this);
    }

    /* The connected JID. */
    this.jid = "";
    /* the JIDs domain */
    this.domain = null;
    /* stream:features */
    this.features = null;

    // SASL
    this._sasl_data = {};
    this.do_session = false;
    this.do_bind = false;

    // handler lists
    this.timedHandlers = [];
    this.handlers = [];
    this.removeTimeds = [];
    this.removeHandlers = [];
    this.addTimeds = [];
    this.addHandlers = [];
    this.protocolErrorHandlers = {
        'HTTP': {},
        'websocket': {}
    };

    this._idleTimeout = null;
    this._disconnectTimeout = null;

    this.authenticated = false;
    this.connected = false;
    this.disconnecting = false;
    this.do_authentication = true;
    this.paused = false;
    this.restored = false;

    this._data = [];
    this._uniqueId = 0;

    this._sasl_success_handler = null;
    this._sasl_failure_handler = null;
    this._sasl_challenge_handler = null;

    // Max retries before disconnecting
    this.maxRetries = 5;

    // Call onIdle callback every 1/10th of a second
    // XXX: setTimeout should be called only with function expressions (23974bc1)
    this._idleTimeout = setTimeout(function() {
        this._onIdle();
    }.bind(this), 100);

    utils.addCookies(this.options.cookies);
    this.registerSASLMechanisms(this.options.mechanisms);

    // initialize plugins
    for (var k in Strophe._connectionPlugins) {
        if (Strophe._connectionPlugins.hasOwnProperty(k)) {
            var ptype = Strophe._connectionPlugins[k];
            // jslint complaints about the below line, but this is fine
            var F = function () {}; // jshint ignore:line
            F.prototype = ptype;
            this[k] = new F();
            this[k].init(this);
        }
    }
};

Strophe.Connection.prototype = {
    /** Function: reset
     *  Reset the connection.
     *
     *  This function should be called after a connection is disconnected
     *  before that connection is reused.
     */
    reset: function () {
        this._proto._reset();

        // SASL
        this.do_session = false;
        this.do_bind = false;

        // handler lists
        this.timedHandlers = [];
        this.handlers = [];
        this.removeTimeds = [];
        this.removeHandlers = [];
        this.addTimeds = [];
        this.addHandlers = [];

        this.authenticated = false;
        this.connected = false;
        this.disconnecting = false;
        this.restored = false;

        this._data = [];
        this._requests = [];
        this._uniqueId = 0;
    },

    /** Function: pause
     *  Pause the request manager.
     *
     *  This will prevent Strophe from sending any more requests to the
     *  server.  This is very useful for temporarily pausing
     *  BOSH-Connections while a lot of send() calls are happening quickly.
     *  This causes Strophe to send the data in a single request, saving
     *  many request trips.
     */
    pause: function () {
        this.paused = true;
    },

    /** Function: resume
     *  Resume the request manager.
     *
     *  This resumes after pause() has been called.
     */
    resume: function () {
        this.paused = false;
    },

    /** Function: getUniqueId
     *  Generate a unique ID for use in <iq/> elements.
     *
     *  All <iq/> stanzas are required to have unique id attributes.  This
     *  function makes creating these easy.  Each connection instance has
     *  a counter which starts from zero, and the value of this counter
     *  plus a colon followed by the suffix becomes the unique id. If no
     *  suffix is supplied, the counter is used as the unique id.
     *
     *  Suffixes are used to make debugging easier when reading the stream
     *  data, and their use is recommended.  The counter resets to 0 for
     *  every new connection for the same reason.  For connections to the
     *  same server that authenticate the same way, all the ids should be
     *  the same, which makes it easy to see changes.  This is useful for
     *  automated testing as well.
     *
     *  Parameters:
     *    (String) suffix - A optional suffix to append to the id.
     *
     *  Returns:
     *    A unique string to be used for the id attribute.
     */
    getUniqueId: function(suffix) {
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
        if (typeof(suffix) == "string" || typeof(suffix) == "number") {
            return uuid + ":" + suffix;
        } else {
            return uuid + "";
        }
    },

    /** Function: addProtocolErrorHandler
     *  Register a handler function for when a protocol (websocker or HTTP)
     *  error occurs.
     *
     *  NOTE: Currently only HTTP errors for BOSH requests are handled.
     *  Patches that handle websocket errors would be very welcome.
     *
     *  Parameters:
     *    (String) protocol - 'HTTP' or 'websocket' 
     *    (Integer) status_code - Error status code (e.g 500, 400 or 404)
     *    (Function) callback - Function that will fire on Http error
     *
     *  Example:
     *  function onError(err_code){
     *    //do stuff
     *  }
     *
     *  var conn = Strophe.connect('http://example.com/http-bind');
     *  conn.addProtocolErrorHandler('HTTP', 500, onError);
     *  // Triggers HTTP 500 error and onError handler will be called
     *  conn.connect('user_jid@incorrect_jabber_host', 'secret', onConnect);
     */
    addProtocolErrorHandler: function(protocol, status_code, callback){
        this.protocolErrorHandlers[protocol][status_code] = callback;
    },


    /** Function: connect
     *  Starts the connection process.
     *
     *  As the connection process proceeds, the user supplied callback will
     *  be triggered multiple times with status updates.  The callback
     *  should take two arguments - the status code and the error condition.
     *
     *  The status code will be one of the values in the Strophe.Status
     *  constants.  The error condition will be one of the conditions
     *  defined in RFC 3920 or the condition 'strophe-parsererror'.
     *
     *  The Parameters _wait_, _hold_ and _route_ are optional and only relevant
     *  for BOSH connections. Please see XEP 124 for a more detailed explanation
     *  of the optional parameters.
     *
     *  Parameters:
     *    (String) jid - The user's JID.  This may be a bare JID,
     *      or a full JID.  If a node is not supplied, SASL ANONYMOUS
     *      authentication will be attempted.
     *    (String) pass - The user's password.
     *    (Function) callback - The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the
     *      time the server will wait before returning an empty result for
     *      a request.  The default setting of 60 seconds is recommended.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the
     *      number of connections the server will hold at one time.  This
     *      should almost always be set to 1 (the default).
     *    (String) route - The optional route value.
     *    (String) authcid - The optional alternative authentication identity
     *      (username) if intending to impersonate another user.
     *      When using the SASL-EXTERNAL authentication mechanism, for example
     *      with client certificates, then the authcid value is used to
     *      determine whether an authorization JID (authzid) should be sent to
     *      the server. The authzid should not be sent to the server if the
     *      authzid and authcid are the same. So to prevent it from being sent
     *      (for example when the JID is already contained in the client
     *      certificate), set authcid to that same JID. See XEP-178 for more
     *      details.
     */
    connect: function (jid, pass, callback, wait, hold, route, authcid) {
        this.jid = jid;
        /** Variable: authzid
         *  Authorization identity.
         */
        this.authzid = Strophe.getBareJidFromJid(this.jid);

        /** Variable: authcid
         *  Authentication identity (User name).
         */
        this.authcid = authcid || Strophe.getNodeFromJid(this.jid);

        /** Variable: pass
         *  Authentication identity (User password).
         */
        this.pass = pass;

        /** Variable: servtype
         *  Digest MD5 compatibility.
         */
        this.servtype = "xmpp";

        this.connect_callback = callback;
        this.disconnecting = false;
        this.connected = false;
        this.authenticated = false;
        this.restored = false;

        // parse jid for domain
        this.domain = Strophe.getDomainFromJid(this.jid);

        this._changeConnectStatus(Strophe.Status.CONNECTING, null);

        this._proto._connect(wait, hold, route);
    },

    /** Function: attach
     *  Attach to an already created and authenticated BOSH session.
     *
     *  This function is provided to allow Strophe to attach to BOSH
     *  sessions which have been created externally, perhaps by a Web
     *  application.  This is often used to support auto-login type features
     *  without putting user credentials into the page.
     *
     *  Parameters:
     *    (String) jid - The full JID that is bound by the session.
     *    (String) sid - The SID of the BOSH session.
     *    (String) rid - The current RID of the BOSH session.  This RID
     *      will be used by the next request.
     *    (Function) callback The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the
     *      time the server will wait before returning an empty result for
     *      a request.  The default setting of 60 seconds is recommended.
     *      Other settings will require tweaks to the Strophe.TIMEOUT value.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the
     *      number of connections the server will hold at one time.  This
     *      should almost always be set to 1 (the default).
     *    (Integer) wind - The optional HTTBIND window value.  This is the
     *      allowed range of request ids that are valid.  The default is 5.
     */
    attach: function (jid, sid, rid, callback, wait, hold, wind) {
        if (this._proto instanceof Strophe.Bosh) {
            this._proto._attach(jid, sid, rid, callback, wait, hold, wind);
        } else {
            throw {
                name: 'StropheSessionError',
                message: 'The "attach" method can only be used with a BOSH connection.'
            };
        }
    },

    /** Function: restore
     *  Attempt to restore a cached BOSH session.
     *
     *  This function is only useful in conjunction with providing the
     *  "keepalive":true option when instantiating a new Strophe.Connection.
     *
     *  When "keepalive" is set to true, Strophe will cache the BOSH tokens
     *  RID (Request ID) and SID (Session ID) and then when this function is
     *  called, it will attempt to restore the session from those cached
     *  tokens.
     *
     *  This function must therefore be called instead of connect or attach.
     *
     *  For an example on how to use it, please see examples/restore.js
     *
     *  Parameters:
     *    (String) jid - The user's JID.  This may be a bare JID or a full JID.
     *    (Function) callback - The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the
     *      time the server will wait before returning an empty result for
     *      a request.  The default setting of 60 seconds is recommended.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the
     *      number of connections the server will hold at one time.  This
     *      should almost always be set to 1 (the default).
     *    (Integer) wind - The optional HTTBIND window value.  This is the
     *      allowed range of request ids that are valid.  The default is 5.
     */
    restore: function (jid, callback, wait, hold, wind) {
        if (this._sessionCachingSupported()) {
            this._proto._restore(jid, callback, wait, hold, wind);
        } else {
            throw {
                name: 'StropheSessionError',
                message: 'The "restore" method can only be used with a BOSH connection.'
            };
        }
    },

    /** PrivateFunction: _sessionCachingSupported
     * Checks whether sessionStorage and JSON are supported and whether we're
     * using BOSH.
     */
    _sessionCachingSupported: function () {
        if (this._proto instanceof Strophe.Bosh) {
            if (!JSON) { return false; }
            try {
                window.sessionStorage.setItem('_strophe_', '_strophe_');
                window.sessionStorage.removeItem('_strophe_');
            } catch (e) {
                return false;
            }
            return true;
        }
        return false;
    },

    /** Function: xmlInput
     *  User overrideable function that receives XML data coming into the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > Strophe.Connection.xmlInput = function (elem) {
     *  >   (user code)
     *  > };
     *
     *  Due to limitations of current Browsers' XML-Parsers the opening and closing
     *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
     *
     *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
     *  <Strophe.Bosh.strip> if you want to strip this tag.
     *
     *  Parameters:
     *    (XMLElement) elem - The XML data received by the connection.
     */
    /* jshint unused:false */
    xmlInput: function (elem) {
        return;
    },
    /* jshint unused:true */

    /** Function: xmlOutput
     *  User overrideable function that receives XML data sent to the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > Strophe.Connection.xmlOutput = function (elem) {
     *  >   (user code)
     *  > };
     *
     *  Due to limitations of current Browsers' XML-Parsers the opening and closing
     *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
     *
     *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
     *  <Strophe.Bosh.strip> if you want to strip this tag.
     *
     *  Parameters:
     *    (XMLElement) elem - The XMLdata sent by the connection.
     */
    /* jshint unused:false */
    xmlOutput: function (elem) {
        return;
    },
    /* jshint unused:true */

    /** Function: rawInput
     *  User overrideable function that receives raw data coming into the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > Strophe.Connection.rawInput = function (data) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (String) data - The data received by the connection.
     */
    /* jshint unused:false */
    rawInput: function (data) {
        return;
    },
    /* jshint unused:true */

    /** Function: rawOutput
     *  User overrideable function that receives raw data sent to the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > Strophe.Connection.rawOutput = function (data) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (String) data - The data sent by the connection.
     */
    /* jshint unused:false */
    rawOutput: function (data) {
        return;
    },
    /* jshint unused:true */

    /** Function: nextValidRid
     *  User overrideable function that receives the new valid rid.
     *
     *  The default function does nothing. User code can override this with
     *  > Strophe.Connection.nextValidRid = function (rid) {
     *  >    (user code)
     *  > };
     *
     *  Parameters:
     *    (Number) rid - The next valid rid
     */
    /* jshint unused:false */
    nextValidRid: function (rid) {
        return;
    },
    /* jshint unused:true */

    /** Function: send
     *  Send a stanza.
     *
     *  This function is called to push data onto the send queue to
     *  go out over the wire.  Whenever a request is sent to the BOSH
     *  server, all pending data is sent and the queue is flushed.
     *
     *  Parameters:
     *    (XMLElement |
     *     [XMLElement] |
     *     Strophe.Builder) elem - The stanza to send.
     */
    send: function (elem) {
        if (elem === null) { return ; }
        if (typeof(elem.sort) === "function") {
            for (var i = 0; i < elem.length; i++) {
                this._queueData(elem[i]);
            }
        } else if (typeof(elem.tree) === "function") {
            this._queueData(elem.tree());
        } else {
            this._queueData(elem);
        }

        this._proto._send();
    },

    /** Function: flush
     *  Immediately send any pending outgoing data.
     *
     *  Normally send() queues outgoing data until the next idle period
     *  (100ms), which optimizes network use in the common cases when
     *  several send()s are called in succession. flush() can be used to
     *  immediately send all pending data.
     */
    flush: function () {
        // cancel the pending idle period and run the idle function
        // immediately
        clearTimeout(this._idleTimeout);
        this._onIdle();
    },

    /** Function: sendPresence
     *  Helper function to send presence stanzas. The main benefit is for
     *  sending presence stanzas for which you expect a responding presence
     *  stanza with the same id (for example when leaving a chat room).
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza to send.
     *    (Function) callback - The callback function for a successful request.
     *    (Function) errback - The callback function for a failed or timed
     *      out request.  On timeout, the stanza will be null.
     *    (Integer) timeout - The time specified in milliseconds for a
     *      timeout to occur.
     *
     *  Returns:
     *    The id used to send the presence.
     */
    sendPresence: function(elem, callback, errback, timeout) {
        var timeoutHandler = null;
        var that = this;
        if (typeof(elem.tree) === "function") {
            elem = elem.tree();
        }
        var id = elem.getAttribute('id');
        if (!id) { // inject id if not found
            id = this.getUniqueId("sendPresence");
            elem.setAttribute("id", id);
        }

        if (typeof callback === "function" || typeof errback === "function") {
            var handler = this.addHandler(function (stanza) {
                // remove timeout handler if there is one
                if (timeoutHandler) {
                    that.deleteTimedHandler(timeoutHandler);
                }
                var type = stanza.getAttribute('type');
                if (type == 'error') {
                    if (errback) {
                        errback(stanza);
                    }
                } else if (callback) {
                    callback(stanza);
                }
            }, null, 'presence', null, id);

            // if timeout specified, set up a timeout handler.
            if (timeout) {
                timeoutHandler = this.addTimedHandler(timeout, function () {
                    // get rid of normal handler
                    that.deleteHandler(handler);
                    // call errback on timeout with null stanza
                    if (errback) {
                        errback(null);
                    }
                    return false;
                });
            }
        }
        this.send(elem);
        return id;
    },

    /** Function: sendIQ
     *  Helper function to send IQ stanzas.
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza to send.
     *    (Function) callback - The callback function for a successful request.
     *    (Function) errback - The callback function for a failed or timed
     *      out request.  On timeout, the stanza will be null.
     *    (Integer) timeout - The time specified in milliseconds for a
     *      timeout to occur.
     *
     *  Returns:
     *    The id used to send the IQ.
    */
    sendIQ: function(elem, callback, errback, timeout) {
        var timeoutHandler = null;
        var that = this;
        if (typeof(elem.tree) === "function") {
            elem = elem.tree();
        }
        var id = elem.getAttribute('id');
        if (!id) { // inject id if not found
            id = this.getUniqueId("sendIQ");
            elem.setAttribute("id", id);
        }

        if (typeof callback === "function" || typeof errback === "function") {
            var handler = this.addHandler(function (stanza) {
                // remove timeout handler if there is one
                if (timeoutHandler) {
                    that.deleteTimedHandler(timeoutHandler);
                }
                var iqtype = stanza.getAttribute('type');
                if (iqtype == 'result') {
                    if (callback) {
                        callback(stanza);
                    }
                } else if (iqtype == 'error') {
                    if (errback) {
                        errback(stanza);
                    }
                } else {
                    throw {
                        name: "StropheError",
                        message: "Got bad IQ type of " + iqtype
                    };
                }
            }, null, 'iq', ['error', 'result'], id);

            // if timeout specified, set up a timeout handler.
            if (timeout) {
                timeoutHandler = this.addTimedHandler(timeout, function () {
                    // get rid of normal handler
                    that.deleteHandler(handler);
                    // call errback on timeout with null stanza
                    if (errback) {
                        errback(null);
                    }
                    return false;
                });
            }
        }
        this.send(elem);
        return id;
    },

    /** PrivateFunction: _queueData
     *  Queue outgoing data for later sending.  Also ensures that the data
     *  is a DOMElement.
     */
    _queueData: function (element) {
        if (element === null ||
            !element.tagName ||
            !element.childNodes) {
            throw {
                name: "StropheError",
                message: "Cannot queue non-DOMElement."
            };
        }
        this._data.push(element);
    },

    /** PrivateFunction: _sendRestart
     *  Send an xmpp:restart stanza.
     */
    _sendRestart: function () {
        this._data.push("restart");
        this._proto._sendRestart();
        // XXX: setTimeout should be called only with function expressions (23974bc1)
        this._idleTimeout = setTimeout(function() {
            this._onIdle();
        }.bind(this), 100);
    },

    /** Function: addTimedHandler
     *  Add a timed handler to the connection.
     *
     *  This function adds a timed handler.  The provided handler will
     *  be called every period milliseconds until it returns false,
     *  the connection is terminated, or the handler is removed.  Handlers
     *  that wish to continue being invoked should return true.
     *
     *  Because of method binding it is necessary to save the result of
     *  this function if you wish to remove a handler with
     *  deleteTimedHandler().
     *
     *  Note that user handlers are not active until authentication is
     *  successful.
     *
     *  Parameters:
     *    (Integer) period - The period of the handler.
     *    (Function) handler - The callback function.
     *
     *  Returns:
     *    A reference to the handler that can be used to remove it.
     */
    addTimedHandler: function (period, handler) {
        var thand = new Strophe.TimedHandler(period, handler);
        this.addTimeds.push(thand);
        return thand;
    },

    /** Function: deleteTimedHandler
     *  Delete a timed handler for a connection.
     *
     *  This function removes a timed handler from the connection.  The
     *  handRef parameter is *not* the function passed to addTimedHandler(),
     *  but is the reference returned from addTimedHandler().
     *
     *  Parameters:
     *    (Strophe.TimedHandler) handRef - The handler reference.
     */
    deleteTimedHandler: function (handRef) {
        // this must be done in the Idle loop so that we don't change
        // the handlers during iteration
        this.removeTimeds.push(handRef);
    },

    /** Function: addHandler
     *  Add a stanza handler for the connection.
     *
     *  This function adds a stanza handler to the connection.  The
     *  handler callback will be called for any stanza that matches
     *  the parameters.  Note that if multiple parameters are supplied,
     *  they must all match for the handler to be invoked.
     *
     *  The handler will receive the stanza that triggered it as its argument.
     *  *The handler should return true if it is to be invoked again;
     *  returning false will remove the handler after it returns.*
     *
     *  As a convenience, the ns parameters applies to the top level element
     *  and also any of its immediate children.  This is primarily to make
     *  matching /iq/query elements easy.
     *
     *  Options
     *  ~~~~~~~
     *  With the options argument, you can specify boolean flags that affect how
     *  matches are being done.
     *
     *  Currently two flags exist:
     *
     *  - matchBareFromJid:
     *      When set to true, the from parameter and the
     *      from attribute on the stanza will be matched as bare JIDs instead
     *      of full JIDs. To use this, pass {matchBareFromJid: true} as the
     *      value of options. The default value for matchBareFromJid is false.
     *
     *  - ignoreNamespaceFragment:
     *      When set to true, a fragment specified on the stanza's namespace
     *      URL will be ignored when it's matched with the one configured for
     *      the handler.
     *
     *      This means that if you register like this:
     *      >   connection.addHandler(
     *      >       handler,
     *      >       'http://jabber.org/protocol/muc',
     *      >       null, null, null, null,
     *      >       {'ignoreNamespaceFragment': true}
     *      >   );
     *
     *      Then a stanza with XML namespace of
     *      'http://jabber.org/protocol/muc#user' will also be matched. If
     *      'ignoreNamespaceFragment' is false, then only stanzas with
     *      'http://jabber.org/protocol/muc' will be matched.
     *
     *  Deleting the handler
     *  ~~~~~~~~~~~~~~~~~~~~
     *  The return value should be saved if you wish to remove the handler
     *  with deleteHandler().
     *
     *  Parameters:
     *    (Function) handler - The user callback.
     *    (String) ns - The namespace to match.
     *    (String) name - The stanza name to match.
     *    (String|Array) type - The stanza type (or types if an array) to match.
     *    (String) id - The stanza id attribute to match.
     *    (String) from - The stanza from attribute to match.
     *    (String) options - The handler options
     *
     *  Returns:
     *    A reference to the handler that can be used to remove it.
     */
    addHandler: function (handler, ns, name, type, id, from, options) {
        var hand = new Strophe.Handler(handler, ns, name, type, id, from, options);
        this.addHandlers.push(hand);
        return hand;
    },

    /** Function: deleteHandler
     *  Delete a stanza handler for a connection.
     *
     *  This function removes a stanza handler from the connection.  The
     *  handRef parameter is *not* the function passed to addHandler(),
     *  but is the reference returned from addHandler().
     *
     *  Parameters:
     *    (Strophe.Handler) handRef - The handler reference.
     */
    deleteHandler: function (handRef) {
        // this must be done in the Idle loop so that we don't change
        // the handlers during iteration
        this.removeHandlers.push(handRef);
        // If a handler is being deleted while it is being added,
        // prevent it from getting added
        var i = this.addHandlers.indexOf(handRef);
        if (i >= 0) {
            this.addHandlers.splice(i, 1);
        }
    },

    /** Function: registerSASLMechanisms
     *
     * Register the SASL mechanisms which will be supported by this instance of
     * Strophe.Connection (i.e. which this XMPP client will support).
     *
     *  Parameters:
     *    (Array) mechanisms - Array of objects with Strophe.SASLMechanism prototypes
     *
     */
    registerSASLMechanisms: function (mechanisms) {
        this.mechanisms = {};
        mechanisms = mechanisms || [
            Strophe.SASLAnonymous,
            Strophe.SASLExternal,
            Strophe.SASLMD5,
            Strophe.SASLOAuthBearer,
            Strophe.SASLPlain,
            Strophe.SASLSHA1
        ];
        mechanisms.forEach(this.registerSASLMechanism.bind(this));
    },

    /** Function: registerSASLMechanism
     *
     * Register a single SASL mechanism, to be supported by this client.
     *
     *  Parameters:
     *    (Object) mechanism - Object with a Strophe.SASLMechanism prototype
     *
     */
    registerSASLMechanism: function (mechanism) {
        this.mechanisms[mechanism.prototype.name] = mechanism;
    },

    /** Function: disconnect
     *  Start the graceful disconnection process.
     *
     *  This function starts the disconnection process.  This process starts
     *  by sending unavailable presence and sending BOSH body of type
     *  terminate.  A timeout handler makes sure that disconnection happens
     *  even if the BOSH server does not respond.
     *  If the Connection object isn't connected, at least tries to abort all pending requests
     *  so the connection object won't generate successful requests (which were already opened).
     *
     *  The user supplied connection callback will be notified of the
     *  progress as this process happens.
     *
     *  Parameters:
     *    (String) reason - The reason the disconnect is occuring.
     */
    disconnect: function (reason) {
        this._changeConnectStatus(Strophe.Status.DISCONNECTING, reason);

        Strophe.info("Disconnect was called because: " + reason);
        if (this.connected) {
            var pres = false;
            this.disconnecting = true;
            if (this.authenticated) {
                pres = $pres({
                    xmlns: Strophe.NS.CLIENT,
                    type: 'unavailable'
                });
            }
            // setup timeout handler
            this._disconnectTimeout = this._addSysTimedHandler(
                3000, this._onDisconnectTimeout.bind(this));
            this._proto._disconnect(pres);
        } else {
            Strophe.info("Disconnect was called before Strophe connected to the server");
            this._proto._abortAllRequests();
            this._doDisconnect();
        }
    },

    /** PrivateFunction: _changeConnectStatus
     *  _Private_ helper function that makes sure plugins and the user's
     *  callback are notified of connection status changes.
     *
     *  Parameters:
     *    (Integer) status - the new connection status, one of the values
     *      in Strophe.Status
     *    (String) condition - the error condition or null
     */
    _changeConnectStatus: function (status, condition) {
        // notify all plugins listening for status changes
        for (var k in Strophe._connectionPlugins) {
            if (Strophe._connectionPlugins.hasOwnProperty(k)) {
                var plugin = this[k];
                if (plugin.statusChanged) {
                    try {
                        plugin.statusChanged(status, condition);
                    } catch (err) {
                        Strophe.error("" + k + " plugin caused an exception " +
                                      "changing status: " + err);
                    }
                }
            }
        }

        // notify the user's callback
        if (this.connect_callback) {
            try {
                this.connect_callback(status, condition);
            } catch (e) {
                Strophe._handleError(e);
                Strophe.error(
                    "User connection callback caused an "+"exception: "+e);
            }
        }
    },

    /** PrivateFunction: _doDisconnect
     *  _Private_ function to disconnect.
     *
     *  This is the last piece of the disconnection logic.  This resets the
     *  connection and alerts the user's connection callback.
     */
    _doDisconnect: function (condition) {
        if (typeof this._idleTimeout == "number") {
            clearTimeout(this._idleTimeout);
        }

        // Cancel Disconnect Timeout
        if (this._disconnectTimeout !== null) {
            this.deleteTimedHandler(this._disconnectTimeout);
            this._disconnectTimeout = null;
        }

        Strophe.info("_doDisconnect was called");
        this._proto._doDisconnect();

        this.authenticated = false;
        this.disconnecting = false;
        this.restored = false;

        // delete handlers
        this.handlers = [];
        this.timedHandlers = [];
        this.removeTimeds = [];
        this.removeHandlers = [];
        this.addTimeds = [];
        this.addHandlers = [];

        // tell the parent we disconnected
        this._changeConnectStatus(Strophe.Status.DISCONNECTED, condition);
        this.connected = false;
    },

    /** PrivateFunction: _dataRecv
     *  _Private_ handler to processes incoming data from the the connection.
     *
     *  Except for _connect_cb handling the initial connection request,
     *  this function handles the incoming data for all requests.  This
     *  function also fires stanza handlers that match each incoming
     *  stanza.
     *
     *  Parameters:
     *    (Strophe.Request) req - The request that has data ready.
     *    (string) req - The stanza a raw string (optiona).
     */
    _dataRecv: function (req, raw) {
        Strophe.info("_dataRecv called");
        var elem = this._proto._reqToData(req);
        if (elem === null) { return; }

        if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
            if (elem.nodeName === this._proto.strip && elem.childNodes.length) {
                this.xmlInput(elem.childNodes[0]);
            } else {
                this.xmlInput(elem);
            }
        }
        if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
            if (raw) {
                this.rawInput(raw);
            } else {
                this.rawInput(Strophe.serialize(elem));
            }
        }

        // remove handlers scheduled for deletion
        var i, hand;
        while (this.removeHandlers.length > 0) {
            hand = this.removeHandlers.pop();
            i = this.handlers.indexOf(hand);
            if (i >= 0) {
                this.handlers.splice(i, 1);
            }
        }

        // add handlers scheduled for addition
        while (this.addHandlers.length > 0) {
            this.handlers.push(this.addHandlers.pop());
        }

        // handle graceful disconnect
        if (this.disconnecting && this._proto._emptyQueue()) {
            this._doDisconnect();
            return;
        }

        var type = elem.getAttribute("type");
        var cond, conflict;
        if (type !== null && type == "terminate") {
            // Don't process stanzas that come in after disconnect
            if (this.disconnecting) {
                return;
            }

            // an error occurred
            cond = elem.getAttribute("condition");
            conflict = elem.getElementsByTagName("conflict");
            if (cond !== null) {
                if (cond == "remote-stream-error" && conflict.length > 0) {
                    cond = "conflict";
                }
                this._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
            } else {
                this._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
            }
            this._doDisconnect(cond);
            return;
        }

        // send each incoming stanza through the handler chain
        var that = this;
        Strophe.forEachChild(elem, null, function (child) {
            var i, newList;
            // process handlers
            newList = that.handlers;
            that.handlers = [];
            for (i = 0; i < newList.length; i++) {
                var hand = newList[i];
                // encapsulate 'handler.run' not to lose the whole handler list if
                // one of the handlers throws an exception
                try {
                    if (hand.isMatch(child) &&
                        (that.authenticated || !hand.user)) {
                        if (hand.run(child)) {
                            that.handlers.push(hand);
                        }
                    } else {
                        that.handlers.push(hand);
                    }
                } catch(e) {
                    // if the handler throws an exception, we consider it as false
                    Strophe.warn('Removing Strophe handlers due to uncaught exception: '+e.message);
                }
            }
        });
    },


    /** Attribute: mechanisms
     *  SASL Mechanisms available for Connection.
     */
    mechanisms: {},

    /** PrivateFunction: _connect_cb
     *  _Private_ handler for initial connection request.
     *
     *  This handler is used to process the initial connection request
     *  response from the BOSH server. It is used to set up authentication
     *  handlers and start the authentication process.
     *
     *  SASL authentication will be attempted if available, otherwise
     *  the code will fall back to legacy authentication.
     *
     *  Parameters:
     *    (Strophe.Request) req - The current request.
     *    (Function) _callback - low level (xmpp) connect callback function.
     *      Useful for plugins with their own xmpp connect callback (when their)
     *      want to do something special).
     */
    _connect_cb: function (req, _callback, raw) {
        Strophe.info("_connect_cb was called");
        this.connected = true;

        var bodyWrap;
        try {
            bodyWrap = this._proto._reqToData(req);
        } catch (e) {
            if (e != "badformat") { throw e; }
            this._changeConnectStatus(Strophe.Status.CONNFAIL, 'bad-format');
            this._doDisconnect('bad-format');
        }
        if (!bodyWrap) { return; }

        if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
            if (bodyWrap.nodeName === this._proto.strip && bodyWrap.childNodes.length) {
                this.xmlInput(bodyWrap.childNodes[0]);
            } else {
                this.xmlInput(bodyWrap);
            }
        }
        if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
            if (raw) {
                this.rawInput(raw);
            } else {
                this.rawInput(Strophe.serialize(bodyWrap));
            }
        }

        var conncheck = this._proto._connect_cb(bodyWrap);
        if (conncheck === Strophe.Status.CONNFAIL) {
            return;
        }

        // Check for the stream:features tag
        var hasFeatures;
        if (bodyWrap.getElementsByTagNameNS) {
            hasFeatures = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, "features").length > 0;
        } else {
            hasFeatures = bodyWrap.getElementsByTagName("stream:features").length > 0 ||
                            bodyWrap.getElementsByTagName("features").length > 0;
        }
        if (!hasFeatures) {
            this._proto._no_auth_received(_callback);
            return;
        }

        var matched = [], i, mech;
        var mechanisms = bodyWrap.getElementsByTagName("mechanism");
        if (mechanisms.length > 0) {
            for (i = 0; i < mechanisms.length; i++) {
                mech = Strophe.getText(mechanisms[i]);
                if (this.mechanisms[mech]) matched.push(this.mechanisms[mech]);
            }
        }
        if (matched.length === 0) {
            if (bodyWrap.getElementsByTagName("auth").length === 0) {
                // There are no matching SASL mechanisms and also no legacy
                // auth available.
                this._proto._no_auth_received(_callback);
                return;
            }
        }
        if (this.do_authentication !== false) {
            this.authenticate(matched);
        }
    },

    /** Function: sortMechanismsByPriority
     *
     *  Sorts an array of objects with prototype SASLMechanism according to
     *  their priorities.
     *
     *  Parameters:
     *    (Array) mechanisms - Array of SASL mechanisms.
     *
     */
    sortMechanismsByPriority: function (mechanisms) {
        // Sorting mechanisms according to priority.
        var i, j, higher, swap;
        for (i = 0; i < mechanisms.length - 1; ++i) {
            higher = i;
            for (j = i + 1; j < mechanisms.length; ++j) {
                if (mechanisms[j].prototype.priority > mechanisms[higher].prototype.priority) {
                    higher = j;
                }
            }
            if (higher != i) {
                swap = mechanisms[i];
                mechanisms[i] = mechanisms[higher];
                mechanisms[higher] = swap;
            }
        }
        return mechanisms;
    },

    /** PrivateFunction: _attemptSASLAuth
     *
     *  Iterate through an array of SASL mechanisms and attempt authentication
     *  with the highest priority (enabled) mechanism.
     *
     *  Parameters:
     *    (Array) mechanisms - Array of SASL mechanisms.
     *
     *  Returns:
     *    (Boolean) mechanism_found - true or false, depending on whether a
     *          valid SASL mechanism was found with which authentication could be
     *          started.
     */
    _attemptSASLAuth: function (mechanisms) {
        mechanisms = this.sortMechanismsByPriority(mechanisms || []);
        var i = 0, mechanism_found = false;
        for (i = 0; i < mechanisms.length; ++i) {
            if (!mechanisms[i].prototype.test(this)) {
                continue;
            }
            this._sasl_success_handler = this._addSysHandler(
                this._sasl_success_cb.bind(this), null,
                "success", null, null);
            this._sasl_failure_handler = this._addSysHandler(
                this._sasl_failure_cb.bind(this), null,
                "failure", null, null);
            this._sasl_challenge_handler = this._addSysHandler(
                this._sasl_challenge_cb.bind(this), null,
                "challenge", null, null);

            this._sasl_mechanism = new mechanisms[i]();
            this._sasl_mechanism.onStart(this);

            var request_auth_exchange = $build("auth", {
                xmlns: Strophe.NS.SASL,
                mechanism: this._sasl_mechanism.name
            });
            if (this._sasl_mechanism.isClientFirst) {
                var response = this._sasl_mechanism.onChallenge(this, null);
                request_auth_exchange.t(Base64.encode(response));
            }
            this.send(request_auth_exchange.tree());
            mechanism_found = true;
            break;
        }
        return mechanism_found;
    },

    /** PrivateFunction: _attemptLegacyAuth
     *
     *  Attempt legacy (i.e. non-SASL) authentication.
     *
     */
    _attemptLegacyAuth: function () {
        if (Strophe.getNodeFromJid(this.jid) === null) {
            // we don't have a node, which is required for non-anonymous
            // client connections
            this._changeConnectStatus(
                Strophe.Status.CONNFAIL,
                'x-strophe-bad-non-anon-jid'
            );
            this.disconnect('x-strophe-bad-non-anon-jid');
        } else {
            // Fall back to legacy authentication
            this._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
            this._addSysHandler(
                this._auth1_cb.bind(this),
                null, null, null, "_auth_1"
            );
            this.send($iq({
                    'type': "get",
                    'to': this.domain,
                    'id': "_auth_1"
                }).c("query", {xmlns: Strophe.NS.AUTH})
                .c("username", {}).t(Strophe.getNodeFromJid(this.jid))
                .tree());
        }
    },

    /** Function: authenticate
     * Set up authentication
     *
     *  Continues the initial connection request by setting up authentication
     *  handlers and starting the authentication process.
     *
     *  SASL authentication will be attempted if available, otherwise
     *  the code will fall back to legacy authentication.
     *
     *  Parameters:
     *    (Array) matched - Array of SASL mechanisms supported.
     *
     */
    authenticate: function (matched) {
        if (!this._attemptSASLAuth(matched)) {
            this._attemptLegacyAuth();
        }
    },

    /** PrivateFunction: _sasl_challenge_cb
     *  _Private_ handler for the SASL challenge
     *
     */
    _sasl_challenge_cb: function(elem) {
      var challenge = Base64.decode(Strophe.getText(elem));
      var response = this._sasl_mechanism.onChallenge(this, challenge);
      var stanza = $build('response', {
          'xmlns': Strophe.NS.SASL
      });
      if (response !== "") {
        stanza.t(Base64.encode(response));
      }
      this.send(stanza.tree());
      return true;
    },

    /** PrivateFunction: _auth1_cb
     *  _Private_ handler for legacy authentication.
     *
     *  This handler is called in response to the initial <iq type='get'/>
     *  for legacy authentication.  It builds an authentication <iq/> and
     *  sends it, creating a handler (calling back to _auth2_cb()) to
     *  handle the result
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza that triggered the callback.
     *
     *  Returns:
     *    false to remove the handler.
     */
    /* jshint unused:false */
    _auth1_cb: function (elem) {
        // build plaintext auth iq
        var iq = $iq({type: "set", id: "_auth_2"})
            .c('query', {xmlns: Strophe.NS.AUTH})
            .c('username', {}).t(Strophe.getNodeFromJid(this.jid))
            .up()
            .c('password').t(this.pass);

        if (!Strophe.getResourceFromJid(this.jid)) {
            // since the user has not supplied a resource, we pick
            // a default one here.  unlike other auth methods, the server
            // cannot do this for us.
            this.jid = Strophe.getBareJidFromJid(this.jid) + '/strophe';
        }
        iq.up().c('resource', {}).t(Strophe.getResourceFromJid(this.jid));

        this._addSysHandler(this._auth2_cb.bind(this), null,
                            null, null, "_auth_2");
        this.send(iq.tree());
        return false;
    },
    /* jshint unused:true */

    /** PrivateFunction: _sasl_success_cb
     *  _Private_ handler for succesful SASL authentication.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_success_cb: function (elem) {
        if (this._sasl_data["server-signature"]) {
            var serverSignature;
            var success = Base64.decode(Strophe.getText(elem));
            var attribMatch = /([a-z]+)=([^,]+)(,|$)/;
            var matches = success.match(attribMatch);
            if (matches[1] == "v") {
                serverSignature = matches[2];
            }

            if (serverSignature != this._sasl_data["server-signature"]) {
              // remove old handlers
              this.deleteHandler(this._sasl_failure_handler);
              this._sasl_failure_handler = null;
              if (this._sasl_challenge_handler) {
                this.deleteHandler(this._sasl_challenge_handler);
                this._sasl_challenge_handler = null;
              }

              this._sasl_data = {};
              return this._sasl_failure_cb(null);
            }
        }
        Strophe.info("SASL authentication succeeded.");

        if (this._sasl_mechanism) {
          this._sasl_mechanism.onSuccess();
        }

        // remove old handlers
        this.deleteHandler(this._sasl_failure_handler);
        this._sasl_failure_handler = null;
        if (this._sasl_challenge_handler) {
            this.deleteHandler(this._sasl_challenge_handler);
            this._sasl_challenge_handler = null;
        }

        var streamfeature_handlers = [];
        var wrapper = function(handlers, elem) {
            while (handlers.length) {
                this.deleteHandler(handlers.pop());
            }
            this._sasl_auth1_cb.bind(this)(elem);
            return false;
        };
        streamfeature_handlers.push(this._addSysHandler(function(elem) {
            wrapper.bind(this)(streamfeature_handlers, elem);
        }.bind(this), null, "stream:features", null, null));
        streamfeature_handlers.push(this._addSysHandler(function(elem) {
            wrapper.bind(this)(streamfeature_handlers, elem);
        }.bind(this), Strophe.NS.STREAM, "features", null, null));

        // we must send an xmpp:restart now
        this._sendRestart();

        return false;
    },

    /** PrivateFunction: _sasl_auth1_cb
     *  _Private_ handler to start stream binding.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_auth1_cb: function (elem) {
        // save stream:features for future usage
        this.features = elem;
        var i, child;
        for (i = 0; i < elem.childNodes.length; i++) {
            child = elem.childNodes[i];
            if (child.nodeName == 'bind') {
                this.do_bind = true;
            }

            if (child.nodeName == 'session') {
                this.do_session = true;
            }
        }

        if (!this.do_bind) {
            this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
            return false;
        } else {
            this._addSysHandler(this._sasl_bind_cb.bind(this), null, null,
                                null, "_bind_auth_2");

            var resource = Strophe.getResourceFromJid(this.jid);
            if (resource) {
                this.send($iq({type: "set", id: "_bind_auth_2"})
                          .c('bind', {xmlns: Strophe.NS.BIND})
                          .c('resource', {}).t(resource).tree());
            } else {
                this.send($iq({type: "set", id: "_bind_auth_2"})
                          .c('bind', {xmlns: Strophe.NS.BIND})
                          .tree());
            }
        }
        return false;
    },

    /** PrivateFunction: _sasl_bind_cb
     *  _Private_ handler for binding result and session start.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_bind_cb: function (elem) {
        if (elem.getAttribute("type") == "error") {
            Strophe.info("SASL binding failed.");
            var conflict = elem.getElementsByTagName("conflict"), condition;
            if (conflict.length > 0) {
                condition = 'conflict';
            }
            this._changeConnectStatus(Strophe.Status.AUTHFAIL, condition);
            return false;
        }

        // TODO - need to grab errors
        var bind = elem.getElementsByTagName("bind");
        var jidNode;
        if (bind.length > 0) {
            // Grab jid
            jidNode = bind[0].getElementsByTagName("jid");
            if (jidNode.length > 0) {
                this.jid = Strophe.getText(jidNode[0]);

                if (this.do_session) {
                    this._addSysHandler(this._sasl_session_cb.bind(this),
                                        null, null, null, "_session_auth_2");

                    this.send($iq({type: "set", id: "_session_auth_2"})
                                  .c('session', {xmlns: Strophe.NS.SESSION})
                                  .tree());
                } else {
                    this.authenticated = true;
                    this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                }
            }
        } else {
            Strophe.info("SASL binding failed.");
            this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
            return false;
        }
    },

    /** PrivateFunction: _sasl_session_cb
     *  _Private_ handler to finish successful SASL connection.
     *
     *  This sets Connection.authenticated to true on success, which
     *  starts the processing of user handlers.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_session_cb: function (elem) {
        if (elem.getAttribute("type") == "result") {
            this.authenticated = true;
            this._changeConnectStatus(Strophe.Status.CONNECTED, null);
        } else if (elem.getAttribute("type") == "error") {
            Strophe.info("Session creation failed.");
            this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
            return false;
        }
        return false;
    },

    /** PrivateFunction: _sasl_failure_cb
     *  _Private_ handler for SASL authentication failure.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    /* jshint unused:false */
    _sasl_failure_cb: function (elem) {
        // delete unneeded handlers
        if (this._sasl_success_handler) {
            this.deleteHandler(this._sasl_success_handler);
            this._sasl_success_handler = null;
        }
        if (this._sasl_challenge_handler) {
            this.deleteHandler(this._sasl_challenge_handler);
            this._sasl_challenge_handler = null;
        }

        if(this._sasl_mechanism)
          this._sasl_mechanism.onFailure();
        this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
        return false;
    },
    /* jshint unused:true */

    /** PrivateFunction: _auth2_cb
     *  _Private_ handler to finish legacy authentication.
     *
     *  This handler is called when the result from the jabber:iq:auth
     *  <iq/> stanza is returned.
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza that triggered the callback.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _auth2_cb: function (elem) {
        if (elem.getAttribute("type") == "result") {
            this.authenticated = true;
            this._changeConnectStatus(Strophe.Status.CONNECTED, null);
        } else if (elem.getAttribute("type") == "error") {
            this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
            this.disconnect('authentication failed');
        }
        return false;
    },

    /** PrivateFunction: _addSysTimedHandler
     *  _Private_ function to add a system level timed handler.
     *
     *  This function is used to add a Strophe.TimedHandler for the
     *  library code.  System timed handlers are allowed to run before
     *  authentication is complete.
     *
     *  Parameters:
     *    (Integer) period - The period of the handler.
     *    (Function) handler - The callback function.
     */
    _addSysTimedHandler: function (period, handler) {
        var thand = new Strophe.TimedHandler(period, handler);
        thand.user = false;
        this.addTimeds.push(thand);
        return thand;
    },

    /** PrivateFunction: _addSysHandler
     *  _Private_ function to add a system level stanza handler.
     *
     *  This function is used to add a Strophe.Handler for the
     *  library code.  System stanza handlers are allowed to run before
     *  authentication is complete.
     *
     *  Parameters:
     *    (Function) handler - The callback function.
     *    (String) ns - The namespace to match.
     *    (String) name - The stanza name to match.
     *    (String) type - The stanza type attribute to match.
     *    (String) id - The stanza id attribute to match.
     */
    _addSysHandler: function (handler, ns, name, type, id) {
        var hand = new Strophe.Handler(handler, ns, name, type, id);
        hand.user = false;
        this.addHandlers.push(hand);
        return hand;
    },

    /** PrivateFunction: _onDisconnectTimeout
     *  _Private_ timeout handler for handling non-graceful disconnection.
     *
     *  If the graceful disconnect process does not complete within the
     *  time allotted, this handler finishes the disconnect anyway.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _onDisconnectTimeout: function () {
        Strophe.info("_onDisconnectTimeout was called");
        this._changeConnectStatus(Strophe.Status.CONNTIMEOUT, null);
        this._proto._onDisconnectTimeout();
        // actually disconnect
        this._doDisconnect();
        return false;
    },

    /** PrivateFunction: _onIdle
     *  _Private_ handler to process events during idle cycle.
     *
     *  This handler is called every 100ms to fire timed handlers that
     *  are ready and keep poll requests going.
     */
    _onIdle: function () {
        var i, thand, since, newList;

        // add timed handlers scheduled for addition
        // NOTE: we add before remove in the case a timed handler is
        // added and then deleted before the next _onIdle() call.
        while (this.addTimeds.length > 0) {
            this.timedHandlers.push(this.addTimeds.pop());
        }

        // remove timed handlers that have been scheduled for deletion
        while (this.removeTimeds.length > 0) {
            thand = this.removeTimeds.pop();
            i = this.timedHandlers.indexOf(thand);
            if (i >= 0) {
                this.timedHandlers.splice(i, 1);
            }
        }

        // call ready timed handlers
        var now = new Date().getTime();
        newList = [];
        for (i = 0; i < this.timedHandlers.length; i++) {
            thand = this.timedHandlers[i];
            if (this.authenticated || !thand.user) {
                since = thand.lastCalled + thand.period;
                if (since - now <= 0) {
                    if (thand.run()) {
                        newList.push(thand);
                    }
                } else {
                    newList.push(thand);
                }
            }
        }
        this.timedHandlers = newList;

        clearTimeout(this._idleTimeout);

        this._proto._onIdle();

        // reactivate the timer only if connected
        if (this.connected) {
            // XXX: setTimeout should be called only with function expressions (23974bc1)
            this._idleTimeout = setTimeout(function() {
                this._onIdle();
            }.bind(this), 100);
        }
    }
};

/** Class: Strophe.SASLMechanism
 *
 *  encapsulates SASL authentication mechanisms.
 *
 *  User code may override the priority for each mechanism or disable it completely.
 *  See <priority> for information about changing priority and <test> for informatian on
 *  how to disable a mechanism.
 *
 *  By default, all mechanisms are enabled and the priorities are
 *
 *  EXTERNAL - 60
 *  OAUTHBEARER - 50
 *  SCRAM-SHA1 - 40
 *  DIGEST-MD5 - 30
 *  PLAIN - 20
 *  ANONYMOUS - 10
 *
 *  See: Strophe.Connection.addSupportedSASLMechanisms
 */

/**
 * PrivateConstructor: Strophe.SASLMechanism
 * SASL auth mechanism abstraction.
 *
 *  Parameters:
 *    (String) name - SASL Mechanism name.
 *    (Boolean) isClientFirst - If client should send response first without challenge.
 *    (Number) priority - Priority.
 *
 *  Returns:
 *    A new Strophe.SASLMechanism object.
 */
Strophe.SASLMechanism = function(name, isClientFirst, priority) {
  /** PrivateVariable: name
   *  Mechanism name.
   */
  this.name = name;
  /** PrivateVariable: isClientFirst
   *  If client sends response without initial server challenge.
   */
  this.isClientFirst = isClientFirst;
  /** Variable: priority
   *  Determines which <SASLMechanism> is chosen for authentication (Higher is better).
   *  Users may override this to prioritize mechanisms differently.
   *
   *  In the default configuration the priorities are
   *
   *  SCRAM-SHA1 - 40
   *  DIGEST-MD5 - 30
   *  Plain - 20
   *
   *  Example: (This will cause Strophe to choose the mechanism that the server sent first)
   *
   *  > Strophe.SASLMD5.priority = Strophe.SASLSHA1.priority;
   *
   *  See <SASL mechanisms> for a list of available mechanisms.
   *
   */
  this.priority = priority;
};

Strophe.SASLMechanism.prototype = {
  /**
   *  Function: test
   *  Checks if mechanism able to run.
   *  To disable a mechanism, make this return false;
   *
   *  To disable plain authentication run
   *  > Strophe.SASLPlain.test = function() {
   *  >   return false;
   *  > }
   *
   *  See <SASL mechanisms> for a list of available mechanisms.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   *
   *  Returns:
   *    (Boolean) If mechanism was able to run.
   */
  /* jshint unused:false */
  test: function(connection) {
    return true;
  },
  /* jshint unused:true */

  /** PrivateFunction: onStart
   *  Called before starting mechanism on some connection.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   */
  onStart: function(connection) {
    this._connection = connection;
  },

  /** PrivateFunction: onChallenge
   *  Called by protocol implementation on incoming challenge. If client is
   *  first (isClientFirst == true) challenge will be null on the first call.
   *
   *  Parameters:
   *    (Strophe.Connection) connection - Target Connection.
   *    (String) challenge - current challenge to handle.
   *
   *  Returns:
   *    (String) Mechanism response.
   */
  /* jshint unused:false */
  onChallenge: function(connection, challenge) {
    throw new Error("You should implement challenge handling!");
  },
  /* jshint unused:true */

  /** PrivateFunction: onFailure
   *  Protocol informs mechanism implementation about SASL failure.
   */
  onFailure: function() {
    this._connection = null;
  },

  /** PrivateFunction: onSuccess
   *  Protocol informs mechanism implementation about SASL success.
   */
  onSuccess: function() {
    this._connection = null;
  }
};

  /** Constants: SASL mechanisms
   *  Available authentication mechanisms
   *
   *  Strophe.SASLAnonymous - SASL ANONYMOUS authentication.
   *  Strophe.SASLPlain - SASL PLAIN authentication.
   *  Strophe.SASLMD5 - SASL DIGEST-MD5 authentication
   *  Strophe.SASLSHA1 - SASL SCRAM-SHA1 authentication
   *  Strophe.SASLOAuthBearer - SASL OAuth Bearer authentication
   *  Strophe.SASLExternal - SASL EXTERNAL authentication
   */

// Building SASL callbacks

/** PrivateConstructor: SASLAnonymous
 *  SASL ANONYMOUS authentication.
 */
Strophe.SASLAnonymous = function() {};
Strophe.SASLAnonymous.prototype = new Strophe.SASLMechanism("ANONYMOUS", false, 10);

Strophe.SASLAnonymous.prototype.test = function(connection) {
    return connection.authcid === null;
};


/** PrivateConstructor: SASLPlain
 *  SASL PLAIN authentication.
 */
Strophe.SASLPlain = function() {};
Strophe.SASLPlain.prototype = new Strophe.SASLMechanism("PLAIN", true, 20);

Strophe.SASLPlain.prototype.test = function(connection) {
    return connection.authcid !== null;
};

Strophe.SASLPlain.prototype.onChallenge = function(connection) {
    var auth_str = connection.authzid;
    auth_str = auth_str + "\u0000";
    auth_str = auth_str + connection.authcid;
    auth_str = auth_str + "\u0000";
    auth_str = auth_str + connection.pass;
    return utils.utf16to8(auth_str);
};


/** PrivateConstructor: SASLSHA1
 *  SASL SCRAM SHA 1 authentication.
 */
Strophe.SASLSHA1 = function() {};
Strophe.SASLSHA1.prototype = new Strophe.SASLMechanism("SCRAM-SHA-1", true, 40);

Strophe.SASLSHA1.prototype.test = function(connection) {
    return connection.authcid !== null;
};

Strophe.SASLSHA1.prototype.onChallenge = function(connection, challenge, test_cnonce) {
  var cnonce = test_cnonce || MD5.hexdigest(Math.random() * 1234567890);
  var auth_str = "n=" + utils.utf16to8(connection.authcid);
  auth_str += ",r=";
  auth_str += cnonce;
  connection._sasl_data.cnonce = cnonce;
  connection._sasl_data["client-first-message-bare"] = auth_str;

  auth_str = "n,," + auth_str;

  this.onChallenge = function (connection, challenge) {
    var nonce, salt, iter, Hi, U, U_old, i, k, pass;
    var clientKey, serverKey, clientSignature;
    var responseText = "c=biws,";
    var authMessage = connection._sasl_data["client-first-message-bare"] + "," +
      challenge + ",";
    var cnonce = connection._sasl_data.cnonce;
    var attribMatch = /([a-z]+)=([^,]+)(,|$)/;

    while (challenge.match(attribMatch)) {
      var matches = challenge.match(attribMatch);
      challenge = challenge.replace(matches[0], "");
      switch (matches[1]) {
      case "r":
        nonce = matches[2];
        break;
      case "s":
        salt = matches[2];
        break;
      case "i":
        iter = matches[2];
        break;
      }
    }

    if (nonce.substr(0, cnonce.length) !== cnonce) {
      connection._sasl_data = {};
      return connection._sasl_failure_cb();
    }

    responseText += "r=" + nonce;
    authMessage += responseText;

    salt = Base64.decode(salt);
    salt += "\x00\x00\x00\x01";

    pass = utils.utf16to8(connection.pass);
    Hi = U_old = SHA1.core_hmac_sha1(pass, salt);
    for (i = 1; i < iter; i++) {
      U = SHA1.core_hmac_sha1(pass, SHA1.binb2str(U_old));
      for (k = 0; k < 5; k++) {
        Hi[k] ^= U[k];
      }
      U_old = U;
    }
    Hi = SHA1.binb2str(Hi);

    clientKey = SHA1.core_hmac_sha1(Hi, "Client Key");
    serverKey = SHA1.str_hmac_sha1(Hi, "Server Key");
    clientSignature = SHA1.core_hmac_sha1(SHA1.str_sha1(SHA1.binb2str(clientKey)), authMessage);
    connection._sasl_data["server-signature"] = SHA1.b64_hmac_sha1(serverKey, authMessage);

    for (k = 0; k < 5; k++) {
      clientKey[k] ^= clientSignature[k];
    }

    responseText += ",p=" + Base64.encode(SHA1.binb2str(clientKey));
    return responseText;
  }.bind(this);

  return auth_str;
};


/** PrivateConstructor: SASLMD5
 *  SASL DIGEST MD5 authentication.
 */
Strophe.SASLMD5 = function() {};
Strophe.SASLMD5.prototype = new Strophe.SASLMechanism("DIGEST-MD5", false, 30);

Strophe.SASLMD5.prototype.test = function(connection) {
    return connection.authcid !== null;
};

/** PrivateFunction: _quote
 *  _Private_ utility function to backslash escape and quote strings.
 *
 *  Parameters:
 *    (String) str - The string to be quoted.
 *
 *  Returns:
 *    quoted string
 */
Strophe.SASLMD5.prototype._quote = function (str) {
    return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    //" end string workaround for emacs
};

Strophe.SASLMD5.prototype.onChallenge = function(connection, challenge, test_cnonce) {
  var attribMatch = /([a-z]+)=("[^"]+"|[^,"]+)(?:,|$)/;
  var cnonce = test_cnonce || MD5.hexdigest("" + (Math.random() * 1234567890));
  var realm = "";
  var host = null;
  var nonce = "";
  var qop = "";
  var matches;

  while (challenge.match(attribMatch)) {
    matches = challenge.match(attribMatch);
    challenge = challenge.replace(matches[0], "");
    matches[2] = matches[2].replace(/^"(.+)"$/, "$1");
    switch (matches[1]) {
    case "realm":
      realm = matches[2];
      break;
    case "nonce":
      nonce = matches[2];
      break;
    case "qop":
      qop = matches[2];
      break;
    case "host":
      host = matches[2];
      break;
    }
  }

  var digest_uri = connection.servtype + "/" + connection.domain;
  if (host !== null) {
    digest_uri = digest_uri + "/" + host;
  }

  var cred = utils.utf16to8(connection.authcid + ":" + realm + ":" + this._connection.pass);
  var A1 = MD5.hash(cred) + ":" + nonce + ":" + cnonce;
  var A2 = 'AUTHENTICATE:' + digest_uri;

  var responseText = "";
  responseText += 'charset=utf-8,';
  responseText += 'username=' + this._quote(utils.utf16to8(connection.authcid)) + ',';
  responseText += 'realm=' + this._quote(realm) + ',';
  responseText += 'nonce=' + this._quote(nonce) + ',';
  responseText += 'nc=00000001,';
  responseText += 'cnonce=' + this._quote(cnonce) + ',';
  responseText += 'digest-uri=' + this._quote(digest_uri) + ',';
  responseText += 'response=' + MD5.hexdigest(MD5.hexdigest(A1) + ":" +
                                              nonce + ":00000001:" +
                                              cnonce + ":auth:" +
                                              MD5.hexdigest(A2)) + ",";
  responseText += 'qop=auth';

  this.onChallenge = function () {
      return "";
  };
  return responseText;
};


/** PrivateConstructor: SASLOAuthBearer
 *  SASL OAuth Bearer authentication.
 */
Strophe.SASLOAuthBearer = function() {};
Strophe.SASLOAuthBearer.prototype = new Strophe.SASLMechanism("OAUTHBEARER", true, 50);

Strophe.SASLOAuthBearer.prototype.test = function(connection) {
    return connection.authcid !== null;
};

Strophe.SASLOAuthBearer.prototype.onChallenge = function(connection) {
    var auth_str = 'n,a=';
    auth_str = auth_str + connection.authzid;
    auth_str = auth_str + ',';
    auth_str = auth_str + "\u0001";
    auth_str = auth_str + 'auth=Bearer ';
    auth_str = auth_str + connection.pass;
    auth_str = auth_str + "\u0001";
    auth_str = auth_str + "\u0001";
    return utils.utf16to8(auth_str);
};


/** PrivateConstructor: SASLExternal
 *  SASL EXTERNAL authentication.
 *
 *  The EXTERNAL mechanism allows a client to request the server to use
 *  credentials established by means external to the mechanism to
 *  authenticate the client. The external means may be, for instance,
 *  TLS services.
 */
Strophe.SASLExternal = function() {};
Strophe.SASLExternal.prototype = new Strophe.SASLMechanism("EXTERNAL", true, 60);

Strophe.SASLExternal.prototype.onChallenge = function(connection) {
    /** According to XEP-178, an authzid SHOULD NOT be presented when the
     * authcid contained or implied in the client certificate is the JID (i.e.
     * authzid) with which the user wants to log in as.
     *
     * To NOT send the authzid, the user should therefore set the authcid equal
     * to the JID when instantiating a new Strophe.Connection object.
     */
    return connection.authcid === connection.authzid ? '' : connection.authzid;
};

return {
    Strophe:        Strophe,
    $build:         $build,
    $msg:           $msg,
    $iq:            $iq,
    $pres:          $pres,
    SHA1:           SHA1,
    Base64:         Base64,
    MD5:            MD5,
};
}));

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/* jshint undef: true, unused: true:, noarg: true, latedef: true */
/* global define, window, setTimeout, clearTimeout, XMLHttpRequest, ActiveXObject, Strophe, $build */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-bosh', ['strophe-core'], function (core) {
            return factory(
                core.Strophe,
                core.$build
            );
        });
    } else {
        // Browser globals
        return factory(Strophe, $build);
    }
}(this, function (Strophe, $build) {

/** PrivateClass: Strophe.Request
 *  _Private_ helper class that provides a cross implementation abstraction
 *  for a BOSH related XMLHttpRequest.
 *
 *  The Strophe.Request class is used internally to encapsulate BOSH request
 *  information.  It is not meant to be used from user's code.
 */

/** PrivateConstructor: Strophe.Request
 *  Create and initialize a new Strophe.Request object.
 *
 *  Parameters:
 *    (XMLElement) elem - The XML data to be sent in the request.
 *    (Function) func - The function that will be called when the
 *      XMLHttpRequest readyState changes.
 *    (Integer) rid - The BOSH rid attribute associated with this request.
 *    (Integer) sends - The number of times this same request has been sent.
 */
Strophe.Request = function (elem, func, rid, sends) {
    this.id = ++Strophe._requestId;
    this.xmlData = elem;
    this.data = Strophe.serialize(elem);
    // save original function in case we need to make a new request
    // from this one.
    this.origFunc = func;
    this.func = func;
    this.rid = rid;
    this.date = NaN;
    this.sends = sends || 0;
    this.abort = false;
    this.dead = null;

    this.age = function () {
        if (!this.date) { return 0; }
        var now = new Date();
        return (now - this.date) / 1000;
    };
    this.timeDead = function () {
        if (!this.dead) { return 0; }
        var now = new Date();
        return (now - this.dead) / 1000;
    };
    this.xhr = this._newXHR();
};

Strophe.Request.prototype = {
    /** PrivateFunction: getResponse
     *  Get a response from the underlying XMLHttpRequest.
     *
     *  This function attempts to get a response from the request and checks
     *  for errors.
     *
     *  Throws:
     *    "parsererror" - A parser error occured.
     *    "badformat" - The entity has sent XML that cannot be processed.
     *
     *  Returns:
     *    The DOM element tree of the response.
     */
    getResponse: function () {
        var node = null;
        if (this.xhr.responseXML && this.xhr.responseXML.documentElement) {
            node = this.xhr.responseXML.documentElement;
            if (node.tagName == "parsererror") {
                Strophe.error("invalid response received");
                Strophe.error("responseText: " + this.xhr.responseText);
                Strophe.error("responseXML: " +
                              Strophe.serialize(this.xhr.responseXML));
                throw "parsererror";
            }
        } else if (this.xhr.responseText) {
            Strophe.error("invalid response received");
            Strophe.error("responseText: " + this.xhr.responseText);
            throw "badformat";
        }

        return node;
    },

    /** PrivateFunction: _newXHR
     *  _Private_ helper function to create XMLHttpRequests.
     *
     *  This function creates XMLHttpRequests across all implementations.
     *
     *  Returns:
     *    A new XMLHttpRequest.
     */
    _newXHR: function () {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/xml; charset=utf-8");
            }
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        // use Function.bind() to prepend ourselves as an argument
        xhr.onreadystatechange = this.func.bind(null, this);
        return xhr;
    }
};

/** Class: Strophe.Bosh
 *  _Private_ helper class that handles BOSH Connections
 *
 *  The Strophe.Bosh class is used internally by Strophe.Connection
 *  to encapsulate BOSH sessions. It is not meant to be used from user's code.
 */

/** File: bosh.js
 *  A JavaScript library to enable BOSH in Strophejs.
 *
 *  this library uses Bidirectional-streams Over Synchronous HTTP (BOSH)
 *  to emulate a persistent, stateful, two-way connection to an XMPP server.
 *  More information on BOSH can be found in XEP 124.
 */

/** PrivateConstructor: Strophe.Bosh
 *  Create and initialize a Strophe.Bosh object.
 *
 *  Parameters:
 *    (Strophe.Connection) connection - The Strophe.Connection that will use BOSH.
 *
 *  Returns:
 *    A new Strophe.Bosh object.
 */
Strophe.Bosh = function(connection) {
    this._conn = connection;
    /* request id for body tags */
    this.rid = Math.floor(Math.random() * 4294967295);
    /* The current session ID. */
    this.sid = null;

    // default BOSH values
    this.hold = 1;
    this.wait = 60;
    this.window = 5;
    this.errors = 0;
    this.inactivity = null;

    this._requests = [];
};

Strophe.Bosh.prototype = {
    /** Variable: strip
     *
     *  BOSH-Connections will have all stanzas wrapped in a <body> tag when
     *  passed to <Strophe.Connection.xmlInput> or <Strophe.Connection.xmlOutput>.
     *  To strip this tag, User code can set <Strophe.Bosh.strip> to "body":
     *
     *  > Strophe.Bosh.prototype.strip = "body";
     *
     *  This will enable stripping of the body tag in both
     *  <Strophe.Connection.xmlInput> and <Strophe.Connection.xmlOutput>.
     */
    strip: null,

    /** PrivateFunction: _buildBody
     *  _Private_ helper function to generate the <body/> wrapper for BOSH.
     *
     *  Returns:
     *    A Strophe.Builder with a <body/> element.
     */
    _buildBody: function () {
        var bodyWrap = $build('body', {
            rid: this.rid++,
            xmlns: Strophe.NS.HTTPBIND
        });
        if (this.sid !== null) {
            bodyWrap.attrs({sid: this.sid});
        }
        if (this._conn.options.keepalive && this._conn._sessionCachingSupported()) {
            this._cacheSession();
        }
        return bodyWrap;
    },

    /** PrivateFunction: _reset
     *  Reset the connection.
     *
     *  This function is called by the reset function of the Strophe Connection
     */
    _reset: function () {
        this.rid = Math.floor(Math.random() * 4294967295);
        this.sid = null;
        this.errors = 0;
        if (this._conn._sessionCachingSupported()) {
            window.sessionStorage.removeItem('strophe-bosh-session');
        }

        this._conn.nextValidRid(this.rid);
    },

    /** PrivateFunction: _connect
     *  _Private_ function that initializes the BOSH connection.
     *
     *  Creates and sends the Request that initializes the BOSH connection.
     */
    _connect: function (wait, hold, route) {
        this.wait = wait || this.wait;
        this.hold = hold || this.hold;
        this.errors = 0;

        // build the body tag
        var body = this._buildBody().attrs({
            to: this._conn.domain,
            "xml:lang": "en",
            wait: this.wait,
            hold: this.hold,
            content: "text/xml; charset=utf-8",
            ver: "1.6",
            "xmpp:version": "1.0",
            "xmlns:xmpp": Strophe.NS.BOSH
        });

        if(route){
            body.attrs({
                route: route
            });
        }

        var _connect_cb = this._conn._connect_cb;

        this._requests.push(
            new Strophe.Request(body.tree(),
                                this._onRequestStateChange.bind(
                                    this, _connect_cb.bind(this._conn)),
                                body.tree().getAttribute("rid")));
        this._throttledRequestHandler();
    },

    /** PrivateFunction: _attach
     *  Attach to an already created and authenticated BOSH session.
     *
     *  This function is provided to allow Strophe to attach to BOSH
     *  sessions which have been created externally, perhaps by a Web
     *  application.  This is often used to support auto-login type features
     *  without putting user credentials into the page.
     *
     *  Parameters:
     *    (String) jid - The full JID that is bound by the session.
     *    (String) sid - The SID of the BOSH session.
     *    (String) rid - The current RID of the BOSH session.  This RID
     *      will be used by the next request.
     *    (Function) callback The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the
     *      time the server will wait before returning an empty result for
     *      a request.  The default setting of 60 seconds is recommended.
     *      Other settings will require tweaks to the Strophe.TIMEOUT value.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the
     *      number of connections the server will hold at one time.  This
     *      should almost always be set to 1 (the default).
     *    (Integer) wind - The optional HTTBIND window value.  This is the
     *      allowed range of request ids that are valid.  The default is 5.
     */
    _attach: function (jid, sid, rid, callback, wait, hold, wind) {
        this._conn.jid = jid;
        this.sid = sid;
        this.rid = rid;

        this._conn.connect_callback = callback;

        this._conn.domain = Strophe.getDomainFromJid(this._conn.jid);

        this._conn.authenticated = true;
        this._conn.connected = true;

        this.wait = wait || this.wait;
        this.hold = hold || this.hold;
        this.window = wind || this.window;

        this._conn._changeConnectStatus(Strophe.Status.ATTACHED, null);
    },

    /** PrivateFunction: _restore
     *  Attempt to restore a cached BOSH session
     *
     *  Parameters:
     *    (String) jid - The full JID that is bound by the session.
     *      This parameter is optional but recommended, specifically in cases
     *      where prebinded BOSH sessions are used where it's important to know
     *      that the right session is being restored.
     *    (Function) callback The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the
     *      time the server will wait before returning an empty result for
     *      a request.  The default setting of 60 seconds is recommended.
     *      Other settings will require tweaks to the Strophe.TIMEOUT value.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the
     *      number of connections the server will hold at one time.  This
     *      should almost always be set to 1 (the default).
     *    (Integer) wind - The optional HTTBIND window value.  This is the
     *      allowed range of request ids that are valid.  The default is 5.
     */
    _restore: function (jid, callback, wait, hold, wind) {
        var session = JSON.parse(window.sessionStorage.getItem('strophe-bosh-session'));
        if (typeof session !== "undefined" &&
                   session !== null &&
                   session.rid &&
                   session.sid &&
                   session.jid &&
                   (    typeof jid === "undefined" ||
                        jid === null ||
                        Strophe.getBareJidFromJid(session.jid) == Strophe.getBareJidFromJid(jid) ||
                        // If authcid is null, then it's an anonymous login, so
                        // we compare only the domains:
                        ((Strophe.getNodeFromJid(jid) === null) && (Strophe.getDomainFromJid(session.jid) == jid))
                    )
        ) {
            this._conn.restored = true;
            this._attach(session.jid, session.sid, session.rid, callback, wait, hold, wind);
        } else {
            throw { name: "StropheSessionError", message: "_restore: no restoreable session." };
        }
    },

    /** PrivateFunction: _cacheSession
     *  _Private_ handler for the beforeunload event.
     *
     *  This handler is used to process the Bosh-part of the initial request.
     *  Parameters:
     *    (Strophe.Request) bodyWrap - The received stanza.
     */
    _cacheSession: function () {
        if (this._conn.authenticated) {
            if (this._conn.jid && this.rid && this.sid) {
                window.sessionStorage.setItem('strophe-bosh-session', JSON.stringify({
                    'jid': this._conn.jid,
                    'rid': this.rid,
                    'sid': this.sid
                }));
            }
        } else {
            window.sessionStorage.removeItem('strophe-bosh-session');
        }
    },

    /** PrivateFunction: _connect_cb
     *  _Private_ handler for initial connection request.
     *
     *  This handler is used to process the Bosh-part of the initial request.
     *  Parameters:
     *    (Strophe.Request) bodyWrap - The received stanza.
     */
    _connect_cb: function (bodyWrap) {
        var typ = bodyWrap.getAttribute("type");
        var cond, conflict;
        if (typ !== null && typ == "terminate") {
            // an error occurred
            cond = bodyWrap.getAttribute("condition");
            Strophe.error("BOSH-Connection failed: " + cond);
            conflict = bodyWrap.getElementsByTagName("conflict");
            if (cond !== null) {
                if (cond == "remote-stream-error" && conflict.length > 0) {
                    cond = "conflict";
                }
                this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
            } else {
                this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
            }
            this._conn._doDisconnect(cond);
            return Strophe.Status.CONNFAIL;
        }

        // check to make sure we don't overwrite these if _connect_cb is
        // called multiple times in the case of missing stream:features
        if (!this.sid) {
            this.sid = bodyWrap.getAttribute("sid");
        }
        var wind = bodyWrap.getAttribute('requests');
        if (wind) { this.window = parseInt(wind, 10); }
        var hold = bodyWrap.getAttribute('hold');
        if (hold) { this.hold = parseInt(hold, 10); }
        var wait = bodyWrap.getAttribute('wait');
        if (wait) { this.wait = parseInt(wait, 10); }
        var inactivity = bodyWrap.getAttribute('inactivity');
        if (inactivity) { this.inactivity = parseInt(inactivity, 10); }
    },

    /** PrivateFunction: _disconnect
     *  _Private_ part of Connection.disconnect for Bosh
     *
     *  Parameters:
     *    (Request) pres - This stanza will be sent before disconnecting.
     */
    _disconnect: function (pres) {
        this._sendTerminate(pres);
    },

    /** PrivateFunction: _doDisconnect
     *  _Private_ function to disconnect.
     *
     *  Resets the SID and RID.
     */
    _doDisconnect: function () {
        this.sid = null;
        this.rid = Math.floor(Math.random() * 4294967295);
        if (this._conn._sessionCachingSupported()) {
            window.sessionStorage.removeItem('strophe-bosh-session');
        }

        this._conn.nextValidRid(this.rid);
    },

    /** PrivateFunction: _emptyQueue
     * _Private_ function to check if the Request queue is empty.
     *
     *  Returns:
     *    True, if there are no Requests queued, False otherwise.
     */
    _emptyQueue: function () {
        return this._requests.length === 0;
    },

    /** PrivateFunction: _callProtocolErrorHandlers
     *  _Private_ function to call error handlers registered for HTTP errors.
     *
     *  Parameters:
     *    (Strophe.Request) req - The request that is changing readyState.
     */
    _callProtocolErrorHandlers: function (req) {
        var reqStatus = this._getRequestStatus(req),
            err_callback;
        err_callback = this._conn.protocolErrorHandlers.HTTP[reqStatus];
        if (err_callback) {
            err_callback.call(this, reqStatus);
        }
    },

    /** PrivateFunction: _hitError
     *  _Private_ function to handle the error count.
     *
     *  Requests are resent automatically until their error count reaches
     *  5.  Each time an error is encountered, this function is called to
     *  increment the count and disconnect if the count is too high.
     *
     *  Parameters:
     *    (Integer) reqStatus - The request status.
     */
    _hitError: function (reqStatus) {
        this.errors++;
        Strophe.warn("request errored, status: " + reqStatus +
                     ", number of errors: " + this.errors);
        if (this.errors > 4) {
            this._conn._onDisconnectTimeout();
        }
    },

    /** PrivateFunction: _no_auth_received
     *
     * Called on stream start/restart when no stream:features
     * has been received and sends a blank poll request.
     */
    _no_auth_received: function (_callback) {
        if (_callback) {
            _callback = _callback.bind(this._conn);
        } else {
            _callback = this._conn._connect_cb.bind(this._conn);
        }
        var body = this._buildBody();
        this._requests.push(
                new Strophe.Request(body.tree(),
                    this._onRequestStateChange.bind(
                        this, _callback.bind(this._conn)),
                    body.tree().getAttribute("rid")));
        this._throttledRequestHandler();
    },

    /** PrivateFunction: _onDisconnectTimeout
     *  _Private_ timeout handler for handling non-graceful disconnection.
     *
     *  Cancels all remaining Requests and clears the queue.
     */
    _onDisconnectTimeout: function () {
        this._abortAllRequests();
    },

    /** PrivateFunction: _abortAllRequests
     *  _Private_ helper function that makes sure all pending requests are aborted.
     */
    _abortAllRequests: function _abortAllRequests() {
        var req;
        while (this._requests.length > 0) {
            req = this._requests.pop();
            req.abort = true;
            req.xhr.abort();
            // jslint complains, but this is fine. setting to empty func
            // is necessary for IE6
            req.xhr.onreadystatechange = function () {}; // jshint ignore:line
        }
    },

    /** PrivateFunction: _onIdle
     *  _Private_ handler called by Strophe.Connection._onIdle
     *
     *  Sends all queued Requests or polls with empty Request if there are none.
     */
    _onIdle: function () {
        var data = this._conn._data;
        // if no requests are in progress, poll
        if (this._conn.authenticated && this._requests.length === 0 &&
            data.length === 0 && !this._conn.disconnecting) {
            Strophe.info("no requests during idle cycle, sending " +
                         "blank request");
            data.push(null);
        }

        if (this._conn.paused) {
            return;
        }

        if (this._requests.length < 2 && data.length > 0) {
            var body = this._buildBody();
            for (var i = 0; i < data.length; i++) {
                if (data[i] !== null) {
                    if (data[i] === "restart") {
                        body.attrs({
                            to: this._conn.domain,
                            "xml:lang": "en",
                            "xmpp:restart": "true",
                            "xmlns:xmpp": Strophe.NS.BOSH
                        });
                    } else {
                        body.cnode(data[i]).up();
                    }
                }
            }
            delete this._conn._data;
            this._conn._data = [];
            this._requests.push(
                new Strophe.Request(body.tree(),
                                    this._onRequestStateChange.bind(
                                        this, this._conn._dataRecv.bind(this._conn)),
                                    body.tree().getAttribute("rid")));
            this._throttledRequestHandler();
        }

        if (this._requests.length > 0) {
            var time_elapsed = this._requests[0].age();
            if (this._requests[0].dead !== null) {
                if (this._requests[0].timeDead() >
                    Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait)) {
                    this._throttledRequestHandler();
                }
            }

            if (time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait)) {
                Strophe.warn("Request " +
                             this._requests[0].id +
                             " timed out, over " + Math.floor(Strophe.TIMEOUT * this.wait) +
                             " seconds since last activity");
                this._throttledRequestHandler();
            }
        }
    },

    /** PrivateFunction: _getRequestStatus
     *
     *  Returns the HTTP status code from a Strophe.Request
     *
     *  Parameters:
     *    (Strophe.Request) req - The Strophe.Request instance.
     *    (Integer) def - The default value that should be returned if no
     *          status value was found.
     */
    _getRequestStatus: function (req, def) {
        var reqStatus;
        if (req.xhr.readyState == 4) {
            try {
                reqStatus = req.xhr.status;
            } catch (e) {
                // ignore errors from undefined status attribute. Works
                // around a browser bug
                Strophe.error(
                    "Caught an error while retrieving a request's status, " +
                    "reqStatus: " + reqStatus);
            }
        }
        if (typeof(reqStatus) == "undefined") {
            reqStatus = typeof def === 'number' ? def : 0;
        }
        return reqStatus;
    },

    /** PrivateFunction: _onRequestStateChange
     *  _Private_ handler for Strophe.Request state changes.
     *
     *  This function is called when the XMLHttpRequest readyState changes.
     *  It contains a lot of error handling logic for the many ways that
     *  requests can fail, and calls the request callback when requests
     *  succeed.
     *
     *  Parameters:
     *    (Function) func - The handler for the request.
     *    (Strophe.Request) req - The request that is changing readyState.
     */
    _onRequestStateChange: function (func, req) {
        Strophe.debug("request id "+req.id+"."+req.sends+
                      " state changed to "+req.xhr.readyState);
        if (req.abort) {
            req.abort = false;
            return;
        }
        if (req.xhr.readyState !== 4) {
            // The request is not yet complete
            return;
        }
        var reqStatus = this._getRequestStatus(req);
        if (this.disconnecting && reqStatus >= 400) {
            this._hitError(reqStatus);
            this._callProtocolErrorHandlers(req);
            return;
        }

        if ((reqStatus > 0 && reqStatus < 500) || req.sends > 5) {
            // remove from internal queue
            this._removeRequest(req);
            Strophe.debug("request id "+req.id+" should now be removed");
        }

        if (reqStatus == 200) {
            // request succeeded
            var reqIs0 = (this._requests[0] == req);
            var reqIs1 = (this._requests[1] == req);
            // if request 1 finished, or request 0 finished and request
            // 1 is over Strophe.SECONDARY_TIMEOUT seconds old, we need to
            // restart the other - both will be in the first spot, as the
            // completed request has been removed from the queue already
            if (reqIs1 ||
                (reqIs0 && this._requests.length > 0 &&
                    this._requests[0].age() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait))) {
                this._restartRequest(0);
            }
            this._conn.nextValidRid(Number(req.rid) + 1);
            Strophe.debug("request id "+req.id+"."+req.sends+" got 200");
            func(req); // call handler
            this.errors = 0;
        } else if (reqStatus === 0 ||
                   (reqStatus >= 400 && reqStatus < 600) ||
                   reqStatus >= 12000) {
            // request failed
            Strophe.error("request id "+req.id+"."+req.sends+" error "+reqStatus+" happened");
            this._hitError(reqStatus);
            this._callProtocolErrorHandlers(req);
            if (reqStatus >= 400 && reqStatus < 500) {
                this._conn._changeConnectStatus(Strophe.Status.DISCONNECTING, null);
                this._conn._doDisconnect();
            }
        } else {
            Strophe.error("request id "+req.id+"."+req.sends+" error "+reqStatus+" happened");
        }
        if (!(reqStatus > 0 && reqStatus < 500) || req.sends > 5) {
            this._throttledRequestHandler();
        }
    },

    /** PrivateFunction: _processRequest
     *  _Private_ function to process a request in the queue.
     *
     *  This function takes requests off the queue and sends them and
     *  restarts dead requests.
     *
     *  Parameters:
     *    (Integer) i - The index of the request in the queue.
     */
    _processRequest: function (i) {
        var self = this;
        var req = this._requests[i];
        var reqStatus = this._getRequestStatus(req, -1);

        // make sure we limit the number of retries
        if (req.sends > this._conn.maxRetries) {
            this._conn._onDisconnectTimeout();
            return;
        }

        var time_elapsed = req.age();
        var primaryTimeout = (!isNaN(time_elapsed) &&
                              time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait));
        var secondaryTimeout = (req.dead !== null &&
                                req.timeDead() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait));
        var requestCompletedWithServerError = (req.xhr.readyState == 4 &&
                                               (reqStatus < 1 || reqStatus >= 500));
        if (primaryTimeout || secondaryTimeout ||
            requestCompletedWithServerError) {
            if (secondaryTimeout) {
                Strophe.error("Request " + this._requests[i].id +
                              " timed out (secondary), restarting");
            }
            req.abort = true;
            req.xhr.abort();
            // setting to null fails on IE6, so set to empty function
            req.xhr.onreadystatechange = function () {};
            this._requests[i] = new Strophe.Request(req.xmlData,
                                                    req.origFunc,
                                                    req.rid,
                                                    req.sends);
            req = this._requests[i];
        }

        if (req.xhr.readyState === 0) {
            Strophe.debug("request id "+req.id+"."+req.sends+" posting");

            try {
                var contentType = this._conn.options.contentType || "text/xml; charset=utf-8";
                req.xhr.open("POST", this._conn.service, this._conn.options.sync ? false : true);
                if (typeof req.xhr.setRequestHeader !== 'undefined') {
                    // IE9 doesn't have setRequestHeader
                    req.xhr.setRequestHeader("Content-Type", contentType);
                }
                if (this._conn.options.withCredentials) {
                    req.xhr.withCredentials = true;
                }
            } catch (e2) {
                Strophe.error("XHR open failed.");
                if (!this._conn.connected) {
                    this._conn._changeConnectStatus(
                            Strophe.Status.CONNFAIL, "bad-service");
                }
                this._conn.disconnect();
                return;
            }

            // Fires the XHR request -- may be invoked immediately
            // or on a gradually expanding retry window for reconnects
            var sendFunc = function () {
                req.date = new Date();
                if (self._conn.options.customHeaders){
                    var headers = self._conn.options.customHeaders;
                    for (var header in headers) {
                        if (headers.hasOwnProperty(header)) {
                            req.xhr.setRequestHeader(header, headers[header]);
                        }
                    }
                }
                req.xhr.send(req.data);
            };

            // Implement progressive backoff for reconnects --
            // First retry (send == 1) should also be instantaneous
            if (req.sends > 1) {
                // Using a cube of the retry number creates a nicely
                // expanding retry window
                var backoff = Math.min(Math.floor(Strophe.TIMEOUT * this.wait),
                                       Math.pow(req.sends, 3)) * 1000;
                setTimeout(function() {
                    // XXX: setTimeout should be called only with function expressions (23974bc1)
                    sendFunc();
                }, backoff);
            } else {
                sendFunc();
            }

            req.sends++;

            if (this._conn.xmlOutput !== Strophe.Connection.prototype.xmlOutput) {
                if (req.xmlData.nodeName === this.strip && req.xmlData.childNodes.length) {
                    this._conn.xmlOutput(req.xmlData.childNodes[0]);
                } else {
                    this._conn.xmlOutput(req.xmlData);
                }
            }
            if (this._conn.rawOutput !== Strophe.Connection.prototype.rawOutput) {
                this._conn.rawOutput(req.data);
            }
        } else {
            Strophe.debug("_processRequest: " +
                          (i === 0 ? "first" : "second") +
                          " request has readyState of " +
                          req.xhr.readyState);
        }
    },

    /** PrivateFunction: _removeRequest
     *  _Private_ function to remove a request from the queue.
     *
     *  Parameters:
     *    (Strophe.Request) req - The request to remove.
     */
    _removeRequest: function (req) {
        Strophe.debug("removing request");
        var i;
        for (i = this._requests.length - 1; i >= 0; i--) {
            if (req == this._requests[i]) {
                this._requests.splice(i, 1);
            }
        }
        // IE6 fails on setting to null, so set to empty function
        req.xhr.onreadystatechange = function () {};
        this._throttledRequestHandler();
    },

    /** PrivateFunction: _restartRequest
     *  _Private_ function to restart a request that is presumed dead.
     *
     *  Parameters:
     *    (Integer) i - The index of the request in the queue.
     */
    _restartRequest: function (i) {
        var req = this._requests[i];
        if (req.dead === null) {
            req.dead = new Date();
        }

        this._processRequest(i);
    },

    /** PrivateFunction: _reqToData
     * _Private_ function to get a stanza out of a request.
     *
     * Tries to extract a stanza out of a Request Object.
     * When this fails the current connection will be disconnected.
     *
     *  Parameters:
     *    (Object) req - The Request.
     *
     *  Returns:
     *    The stanza that was passed.
     */
    _reqToData: function (req) {
        try {
            return req.getResponse();
        } catch (e) {
            if (e != "parsererror") { throw e; }
            this._conn.disconnect("strophe-parsererror");
        }
    },

    /** PrivateFunction: _sendTerminate
     *  _Private_ function to send initial disconnect sequence.
     *
     *  This is the first step in a graceful disconnect.  It sends
     *  the BOSH server a terminate body and includes an unavailable
     *  presence if authentication has completed.
     */
    _sendTerminate: function (pres) {
        Strophe.info("_sendTerminate was called");
        var body = this._buildBody().attrs({type: "terminate"});
        if (pres) {
            body.cnode(pres.tree());
        }
        var req = new Strophe.Request(
            body.tree(),
            this._onRequestStateChange.bind(
            this, this._conn._dataRecv.bind(this._conn)),
            body.tree().getAttribute("rid")
        );
        this._requests.push(req);
        this._throttledRequestHandler();
    },

    /** PrivateFunction: _send
     *  _Private_ part of the Connection.send function for BOSH
     *
     * Just triggers the RequestHandler to send the messages that are in the queue
     */
    _send: function () {
        clearTimeout(this._conn._idleTimeout);
        this._throttledRequestHandler();

        // XXX: setTimeout should be called only with function expressions (23974bc1)
        this._conn._idleTimeout = setTimeout(function() {
            this._onIdle();
        }.bind(this._conn), 100);
    },

    /** PrivateFunction: _sendRestart
     *
     *  Send an xmpp:restart stanza.
     */
    _sendRestart: function () {
        this._throttledRequestHandler();
        clearTimeout(this._conn._idleTimeout);
    },

    /** PrivateFunction: _throttledRequestHandler
     *  _Private_ function to throttle requests to the connection window.
     *
     *  This function makes sure we don't send requests so fast that the
     *  request ids overflow the connection window in the case that one
     *  request died.
     */
    _throttledRequestHandler: function () {
        if (!this._requests) {
            Strophe.debug("_throttledRequestHandler called with " +
                          "undefined requests");
        } else {
            Strophe.debug("_throttledRequestHandler called with " +
                          this._requests.length + " requests");
        }

        if (!this._requests || this._requests.length === 0) {
            return;
        }

        if (this._requests.length > 0) {
            this._processRequest(0);
        }

        if (this._requests.length > 1 &&
            Math.abs(this._requests[0].rid -
                     this._requests[1].rid) < this.window) {
            this._processRequest(1);
        }
    }
};
return Strophe;
}));

/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/* jshint undef: true, unused: true:, noarg: true, latedef: true */
/* global define, window, clearTimeout, WebSocket, DOMParser, Strophe, $build */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('strophe-websocket', ['strophe-core'], function (core) {
            return factory(
                core.Strophe,
                core.$build
            );
        });
    } else {
        // Browser globals
        return factory(Strophe, $build);
    }
}(this, function (Strophe, $build) {

/** Class: Strophe.WebSocket
 *  _Private_ helper class that handles WebSocket Connections
 *
 *  The Strophe.WebSocket class is used internally by Strophe.Connection
 *  to encapsulate WebSocket sessions. It is not meant to be used from user's code.
 */

/** File: websocket.js
 *  A JavaScript library to enable XMPP over Websocket in Strophejs.
 *
 *  This file implements XMPP over WebSockets for Strophejs.
 *  If a Connection is established with a Websocket url (ws://...)
 *  Strophe will use WebSockets.
 *  For more information on XMPP-over-WebSocket see RFC 7395:
 *  http://tools.ietf.org/html/rfc7395
 *
 *  WebSocket support implemented by Andreas Guth (andreas.guth@rwth-aachen.de)
 */

/** PrivateConstructor: Strophe.Websocket
 *  Create and initialize a Strophe.WebSocket object.
 *  Currently only sets the connection Object.
 *
 *  Parameters:
 *    (Strophe.Connection) connection - The Strophe.Connection that will use WebSockets.
 *
 *  Returns:
 *    A new Strophe.WebSocket object.
 */
Strophe.Websocket = function(connection) {
    this._conn = connection;
    this.strip = "wrapper";

    var service = connection.service;
    if (service.indexOf("ws:") !== 0 && service.indexOf("wss:") !== 0) {
        // If the service is not an absolute URL, assume it is a path and put the absolute
        // URL together from options, current URL and the path.
        var new_service = "";

        if (connection.options.protocol === "ws" && window.location.protocol !== "https:") {
            new_service += "ws";
        } else {
            new_service += "wss";
        }

        new_service += "://" + window.location.host;

        if (service.indexOf("/") !== 0) {
            new_service += window.location.pathname + service;
        } else {
            new_service += service;
        }

        connection.service = new_service;
    }
};

Strophe.Websocket.prototype = {
    /** PrivateFunction: _buildStream
     *  _Private_ helper function to generate the <stream> start tag for WebSockets
     *
     *  Returns:
     *    A Strophe.Builder with a <stream> element.
     */
    _buildStream: function () {
        return $build("open", {
            "xmlns": Strophe.NS.FRAMING,
            "to": this._conn.domain,
            "version": '1.0'
        });
    },

    /** PrivateFunction: _check_streamerror
     * _Private_ checks a message for stream:error
     *
     *  Parameters:
     *    (Strophe.Request) bodyWrap - The received stanza.
     *    connectstatus - The ConnectStatus that will be set on error.
     *  Returns:
     *     true if there was a streamerror, false otherwise.
     */
    _check_streamerror: function (bodyWrap, connectstatus) {
        var errors;
        if (bodyWrap.getElementsByTagNameNS) {
            errors = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, "error");
        } else {
            errors = bodyWrap.getElementsByTagName("stream:error");
        }
        if (errors.length === 0) {
            return false;
        }
        var error = errors[0];

        var condition = "";
        var text = "";

        var ns = "urn:ietf:params:xml:ns:xmpp-streams";
        for (var i = 0; i < error.childNodes.length; i++) {
            var e = error.childNodes[i];
            if (e.getAttribute("xmlns") !== ns) {
                break;
            } if (e.nodeName === "text") {
                text = e.textContent;
            } else {
                condition = e.nodeName;
            }
        }

        var errorString = "WebSocket stream error: ";

        if (condition) {
            errorString += condition;
        } else {
            errorString += "unknown";
        }

        if (text) {
            errorString += " - " + condition;
        }

        Strophe.error(errorString);

        // close the connection on stream_error
        this._conn._changeConnectStatus(connectstatus, condition);
        this._conn._doDisconnect();
        return true;
    },

    /** PrivateFunction: _reset
     *  Reset the connection.
     *
     *  This function is called by the reset function of the Strophe Connection.
     *  Is not needed by WebSockets.
     */
    _reset: function () {
        return;
    },

    /** PrivateFunction: _connect
     *  _Private_ function called by Strophe.Connection.connect
     *
     *  Creates a WebSocket for a connection and assigns Callbacks to it.
     *  Does nothing if there already is a WebSocket.
     */
    _connect: function () {
        // Ensure that there is no open WebSocket from a previous Connection.
        this._closeSocket();

        // Create the new WobSocket
        this.socket = new WebSocket(this._conn.service, "xmpp");
        this.socket.onopen = this._onOpen.bind(this);
        this.socket.onerror = this._onError.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        this.socket.onmessage = this._connect_cb_wrapper.bind(this);
    },

    /** PrivateFunction: _connect_cb
     *  _Private_ function called by Strophe.Connection._connect_cb
     *
     * checks for stream:error
     *
     *  Parameters:
     *    (Strophe.Request) bodyWrap - The received stanza.
     */
    _connect_cb: function(bodyWrap) {
        var error = this._check_streamerror(bodyWrap, Strophe.Status.CONNFAIL);
        if (error) {
            return Strophe.Status.CONNFAIL;
        }
    },

    /** PrivateFunction: _handleStreamStart
     * _Private_ function that checks the opening <open /> tag for errors.
     *
     * Disconnects if there is an error and returns false, true otherwise.
     *
     *  Parameters:
     *    (Node) message - Stanza containing the <open /> tag.
     */
    _handleStreamStart: function(message) {
        var error = false;

        // Check for errors in the <open /> tag
        var ns = message.getAttribute("xmlns");
        if (typeof ns !== "string") {
            error = "Missing xmlns in <open />";
        } else if (ns !== Strophe.NS.FRAMING) {
            error = "Wrong xmlns in <open />: " + ns;
        }

        var ver = message.getAttribute("version");
        if (typeof ver !== "string") {
            error = "Missing version in <open />";
        } else if (ver !== "1.0") {
            error = "Wrong version in <open />: " + ver;
        }

        if (error) {
            this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, error);
            this._conn._doDisconnect();
            return false;
        }

        return true;
    },

    /** PrivateFunction: _connect_cb_wrapper
     * _Private_ function that handles the first connection messages.
     *
     * On receiving an opening stream tag this callback replaces itself with the real
     * message handler. On receiving a stream error the connection is terminated.
     */
    _connect_cb_wrapper: function(message) {
        if (message.data.indexOf("<open ") === 0 || message.data.indexOf("<?xml") === 0) {
            // Strip the XML Declaration, if there is one
            var data = message.data.replace(/^(<\?.*?\?>\s*)*/, "");
            if (data === '') return;

            var streamStart = new DOMParser().parseFromString(data, "text/xml").documentElement;
            this._conn.xmlInput(streamStart);
            this._conn.rawInput(message.data);

            //_handleStreamSteart will check for XML errors and disconnect on error
            if (this._handleStreamStart(streamStart)) {
                //_connect_cb will check for stream:error and disconnect on error
                this._connect_cb(streamStart);
            }
        } else if (message.data.indexOf("<close ") === 0) { //'<close xmlns="urn:ietf:params:xml:ns:xmpp-framing />') {
            this._conn.rawInput(message.data);
            this._conn.xmlInput(message);
            var see_uri = message.getAttribute("see-other-uri");
            if (see_uri) {
                this._conn._changeConnectStatus(Strophe.Status.REDIRECT, "Received see-other-uri, resetting connection");
                this._conn.reset();
                this._conn.service = see_uri;
                this._connect();
            } else {
                this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "Received closing stream");
                this._conn._doDisconnect();
            }
        } else {
            var string = this._streamWrap(message.data);
            var elem = new DOMParser().parseFromString(string, "text/xml").documentElement;
            this.socket.onmessage = this._onMessage.bind(this);
            this._conn._connect_cb(elem, null, message.data);
        }
    },

    /** PrivateFunction: _disconnect
     *  _Private_ function called by Strophe.Connection.disconnect
     *
     *  Disconnects and sends a last stanza if one is given
     *
     *  Parameters:
     *    (Request) pres - This stanza will be sent before disconnecting.
     */
    _disconnect: function (pres) {
        if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
            if (pres) {
                this._conn.send(pres);
            }
            var close = $build("close", { "xmlns": Strophe.NS.FRAMING });
            this._conn.xmlOutput(close);
            var closeString = Strophe.serialize(close);
            this._conn.rawOutput(closeString);
            try {
                this.socket.send(closeString);
            } catch (e) {
                Strophe.info("Couldn't send <close /> tag.");
            }
        }
        this._conn._doDisconnect();
    },

    /** PrivateFunction: _doDisconnect
     *  _Private_ function to disconnect.
     *
     *  Just closes the Socket for WebSockets
     */
    _doDisconnect: function () {
        Strophe.info("WebSockets _doDisconnect was called");
        this._closeSocket();
    },

    /** PrivateFunction _streamWrap
     *  _Private_ helper function to wrap a stanza in a <stream> tag.
     *  This is used so Strophe can process stanzas from WebSockets like BOSH
     */
    _streamWrap: function (stanza) {
        return "<wrapper>" + stanza + '</wrapper>';
    },


    /** PrivateFunction: _closeSocket
     *  _Private_ function to close the WebSocket.
     *
     *  Closes the socket if it is still open and deletes it
     */
    _closeSocket: function () {
        if (this.socket) { try {
            this.socket.close();
        } catch (e) {} }
        this.socket = null;
    },

    /** PrivateFunction: _emptyQueue
     * _Private_ function to check if the message queue is empty.
     *
     *  Returns:
     *    True, because WebSocket messages are send immediately after queueing.
     */
    _emptyQueue: function () {
        return true;
    },

    /** PrivateFunction: _onClose
     * _Private_ function to handle websockets closing.
     *
     * Nothing to do here for WebSockets
     */
    _onClose: function() {
        if(this._conn.connected && !this._conn.disconnecting) {
            Strophe.error("Websocket closed unexpectedly");
            this._conn._doDisconnect();
        } else {
            Strophe.info("Websocket closed");
        }
    },

    /** PrivateFunction: _no_auth_received
     *
     * Called on stream start/restart when no stream:features
     * has been received.
     */
    _no_auth_received: function (_callback) {
        Strophe.error("Server did not send any auth methods");
        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "Server did not send any auth methods");
        if (_callback) {
            _callback = _callback.bind(this._conn);
            _callback();
        }
        this._conn._doDisconnect();
    },

    /** PrivateFunction: _onDisconnectTimeout
     *  _Private_ timeout handler for handling non-graceful disconnection.
     *
     *  This does nothing for WebSockets
     */
    _onDisconnectTimeout: function () {},

    /** PrivateFunction: _abortAllRequests
     *  _Private_ helper function that makes sure all pending requests are aborted.
     */
    _abortAllRequests: function () {},

    /** PrivateFunction: _onError
     * _Private_ function to handle websockets errors.
     *
     * Parameters:
     * (Object) error - The websocket error.
     */
    _onError: function(error) {
        Strophe.error("Websocket error " + error);
        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "The WebSocket connection could not be established or was disconnected.");
        this._disconnect();
    },

    /** PrivateFunction: _onIdle
     *  _Private_ function called by Strophe.Connection._onIdle
     *
     *  sends all queued stanzas
     */
    _onIdle: function () {
        var data = this._conn._data;
        if (data.length > 0 && !this._conn.paused) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] !== null) {
                    var stanza, rawStanza;
                    if (data[i] === "restart") {
                        stanza = this._buildStream().tree();
                    } else {
                        stanza = data[i];
                    }
                    rawStanza = Strophe.serialize(stanza);
                    this._conn.xmlOutput(stanza);
                    this._conn.rawOutput(rawStanza);
                    this.socket.send(rawStanza);
                }
            }
            this._conn._data = [];
        }
    },

    /** PrivateFunction: _onMessage
     * _Private_ function to handle websockets messages.
     *
     * This function parses each of the messages as if they are full documents.
     * [TODO : We may actually want to use a SAX Push parser].
     *
     * Since all XMPP traffic starts with
     *  <stream:stream version='1.0'
     *                 xml:lang='en'
     *                 xmlns='jabber:client'
     *                 xmlns:stream='http://etherx.jabber.org/streams'
     *                 id='3697395463'
     *                 from='SERVER'>
     *
     * The first stanza will always fail to be parsed.
     *
     * Additionally, the seconds stanza will always be <stream:features> with
     * the stream NS defined in the previous stanza, so we need to 'force'
     * the inclusion of the NS in this stanza.
     *
     * Parameters:
     * (string) message - The websocket message.
     */
    _onMessage: function(message) {
        var elem, data;
        // check for closing stream
        var close = '<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';
        if (message.data === close) {
            this._conn.rawInput(close);
            this._conn.xmlInput(message);
            if (!this._conn.disconnecting) {
                this._conn._doDisconnect();
            }
            return;
        } else if (message.data.search("<open ") === 0) {
            // This handles stream restarts
            elem = new DOMParser().parseFromString(message.data, "text/xml").documentElement;
            if (!this._handleStreamStart(elem)) {
                return;
            }
        } else {
            data = this._streamWrap(message.data);
            elem = new DOMParser().parseFromString(data, "text/xml").documentElement;
        }

        if (this._check_streamerror(elem, Strophe.Status.ERROR)) {
            return;
        }

        //handle unavailable presence stanza before disconnecting
        if (this._conn.disconnecting &&
                elem.firstChild.nodeName === "presence" &&
                elem.firstChild.getAttribute("type") === "unavailable") {
            this._conn.xmlInput(elem);
            this._conn.rawInput(Strophe.serialize(elem));
            // if we are already disconnecting we will ignore the unavailable stanza and
            // wait for the </stream:stream> tag before we close the connection
            return;
        }
        this._conn._dataRecv(elem, message.data);
    },

    /** PrivateFunction: _onOpen
     * _Private_ function to handle websockets connection setup.
     *
     * The opening stream tag is sent here.
     */
    _onOpen: function() {
        Strophe.info("Websocket open");
        var start = this._buildStream();
        this._conn.xmlOutput(start.tree());

        var startString = Strophe.serialize(start);
        this._conn.rawOutput(startString);
        this.socket.send(startString);
    },

    /** PrivateFunction: _reqToData
     * _Private_ function to get a stanza out of a request.
     *
     * WebSockets don't use requests, so the passed argument is just returned.
     *
     *  Parameters:
     *    (Object) stanza - The stanza.
     *
     *  Returns:
     *    The stanza that was passed.
     */
    _reqToData: function (stanza) {
        return stanza;
    },

    /** PrivateFunction: _send
     *  _Private_ part of the Connection.send function for WebSocket
     *
     * Just flushes the messages that are in the queue
     */
    _send: function () {
        this._conn.flush();
    },

    /** PrivateFunction: _sendRestart
     *
     *  Send an xmpp:restart stanza.
     */
    _sendRestart: function () {
        clearTimeout(this._conn._idleTimeout);
        this._conn._onIdle.bind(this._conn)();
    }
};
return Strophe;
}));

(function(root){
    if(typeof define === 'function' && define.amd){
        define("strophe", [
            "strophe-core",
            "strophe-bosh",
            "strophe-websocket"
        ], function (wrapper) {
            return wrapper;
        });
    }
})(this);

/* jshint ignore:start */
if (callback) {
    if(typeof define === 'function' && define.amd){
        //For backwards compatability
        var n_callback = callback;
        if (typeof requirejs === 'function') {
            requirejs(["strophe"], function(o){
                n_callback(o.Strophe,o.$build,o.$msg,o.$iq,o.$pres);
            });
        } else {
            require(["strophe"], function(o){
                n_callback(o.Strophe,o.$build,o.$msg,o.$iq,o.$pres);
            });
        }
    }else{
        return callback(Strophe, $build, $msg, $iq, $pres);
    }
}


})(function (Strophe, build, msg, iq, pres) {
    window.Strophe = Strophe;
    window.$build = build;
    window.$msg = msg;
    window.$iq = iq;
    window.$pres = pres;
});
/* jshint ignore:end */

},{}]},{},[3]);
