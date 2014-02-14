// Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/

// Runs before all modules

// Function.bind() - IE8
// Reference - http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// Array.forEach() - IE8
// Reference - http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisArg */) {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t)
                fun.call(thisArg, t[i], i, t);
        }
    };
}

// Console-polyfill. MIT license.
// // https://github.com/paulmillr/console-polyfill
// // Make it safe to do console.log() always.
(function(con) {
    'use strict';
    var prop, method;
    var empty = {};
    var dummy = function() {};
    var properties = 'memory'.split(',');
    var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                   'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
                       'table,time,timeEnd,timeStamp,trace,warn').split(',');
    while (prop = properties.pop()) con[prop] = con[prop] || empty;
        while (method = methods.pop()) con[method] = con[method] || dummy;
})(this.console = this.console || {});

// String.hashCode() - Additional function
String.prototype.hashCode = function () {
    var hash = 0, i, l, char;
    if (this.length === 0) return hash;
        for (i = 0, l = this.length; i < l; i++) {
            char  = this.charCodeAt(i);
            hash  = ((hash<<5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
};


