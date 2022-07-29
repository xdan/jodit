/*!
 * jodit - Jodit is awesome and usefully wysiwyg editor with filebrowser
 * Author: Chupurnov <chupurnov@gmail.com> (https://xdsoft.net/)
 * Version: v3.19.3
 * Url: https://xdsoft.net/jodit/
 * License(s): MIT
 */
	
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 8058:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 70631:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.boundClass = exports.boundMethod = void 0;
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) { return typeof obj; };
}
else {
    _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
} return _typeof(obj); }
function boundMethod(target, key, descriptor) {
    var fn = descriptor.value;
    if (typeof fn !== 'function') {
        throw new TypeError("@boundMethod decorator can only be applied to methods not: ".concat(_typeof(fn)));
    }
    var definingProperty = false;
    return {
        configurable: true,
        get: function get() {
            if (definingProperty || this === target.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') {
                return fn;
            }
            var boundFn = fn.bind(this);
            definingProperty = true;
            Object.defineProperty(this, key, {
                configurable: true,
                get: function get() {
                    return boundFn;
                },
                set: function set(value) {
                    fn = value;
                    delete this[key];
                }
            });
            definingProperty = false;
            return boundFn;
        },
        set: function set(value) {
            fn = value;
        }
    };
}
exports.boundMethod = boundMethod;
function boundClass(target) {
    var keys;
    if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
        keys = Reflect.ownKeys(target.prototype);
    }
    else {
        keys = Object.getOwnPropertyNames(target.prototype);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
        }
    }
    keys.forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (typeof descriptor.value === 'function') {
            Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
        }
    });
    return target;
}
exports.boundClass = boundClass;
function autobind() {
    if (arguments.length === 1) {
        return boundClass.apply(void 0, arguments);
    }
    return boundMethod.apply(void 0, arguments);
}
exports["default"] = autobind;


/***/ }),

/***/ 20255:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.__classPrivateFieldIn = exports.__classPrivateFieldSet = exports.__classPrivateFieldGet = exports.__importDefault = exports.__importStar = exports.__makeTemplateObject = exports.__asyncValues = exports.__asyncDelegator = exports.__asyncGenerator = exports.__await = exports.__spreadArray = exports.__spreadArrays = exports.__spread = exports.__read = exports.__values = exports.__exportStar = exports.__createBinding = exports.__generator = exports.__awaiter = exports.__metadata = exports.__param = exports.__decorate = exports.__rest = exports.__assign = exports.__extends = void 0;
var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p))
                d[p] = b[p]; };
    return extendStatics(d, b);
};
function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
exports.__extends = __extends;
var __assign = function () {
    exports.__assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return exports.__assign.apply(this, arguments);
};
exports.__assign = __assign;
function __rest(s, e) {
    var t = {};
    for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}
exports.__rest = __rest;
function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
exports.__decorate = __decorate;
function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); };
}
exports.__param = __param;
function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(metadataKey, metadataValue);
}
exports.__metadata = __metadata;
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
exports.__awaiter = __awaiter;
function __generator(thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1)
            throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f)
            throw new TypeError("Generator is already executing.");
        while (_)
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                    return t;
                if (y = 0, t)
                    op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return { value: op[1], done: false };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e];
                y = 0;
            }
            finally {
                f = t = 0;
            }
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
}
exports.__generator = __generator;
exports.__createBinding = Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
});
function __exportStar(m, o) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
            (0, exports.__createBinding)(o, m, p);
}
exports.__exportStar = __exportStar;
function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
        return m.call(o);
    if (o && typeof o.length === "number")
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
exports.__values = __values;
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
        return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
            ar.push(r.value);
    }
    catch (error) {
        e = { error: error };
    }
    finally {
        try {
            if (r && !r.done && (m = i["return"]))
                m.call(i);
        }
        finally {
            if (e)
                throw e.error;
        }
    }
    return ar;
}
exports.__read = __read;
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}
exports.__spread = __spread;
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
        s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}
exports.__spreadArrays = __spreadArrays;
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar)
                    ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
    return to.concat(ar || Array.prototype.slice.call(from));
}
exports.__spreadArray = __spreadArray;
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}
exports.__await = __await;
function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n])
        i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try {
        step(g[n](v));
    }
    catch (e) {
        settle(q[0][3], e);
    } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]); }
}
exports.__asyncGenerator = __asyncGenerator;
function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}
exports.__asyncDelegator = __asyncDelegator;
function __asyncValues(o) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
}
exports.__asyncValues = __asyncValues;
function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", { value: raw });
    }
    else {
        cooked.raw = raw;
    }
    return cooked;
}
exports.__makeTemplateObject = __makeTemplateObject;
;
var __setModuleDefault = Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
};
function __importStar(mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                (0, exports.__createBinding)(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}
exports.__importStar = __importStar;
function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}
exports.__importDefault = __importDefault;
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
exports.__classPrivateFieldGet = __classPrivateFieldGet;
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m")
        throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}
exports.__classPrivateFieldSet = __classPrivateFieldSet;
function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
        throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}
exports.__classPrivateFieldIn = __classPrivateFieldIn;


/***/ }),

/***/ 14722:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Async = void 0;
var tslib_1 = __webpack_require__(20255);
var async_1 = __webpack_require__(97336);
var is_function_1 = __webpack_require__(84121);
var is_plain_object_1 = __webpack_require__(77184);
var is_promise_1 = __webpack_require__(30317);
var is_string_1 = __webpack_require__(40607);
var is_number_1 = __webpack_require__(93860);
var Async = (function () {
    function Async() {
        var _this = this;
        var _a, _b, _c, _d;
        this.timers = new Map();
        this.promisesRejections = new Set();
        this.requestsIdle = new Set();
        this.requestsRaf = new Set();
        this.requestIdleCallbackNative = (_b = (_a = window['requestIdleCallback']) === null || _a === void 0 ? void 0 : _a.bind(window)) !== null && _b !== void 0 ? _b : (function (callback, options) {
            var _a;
            var start = Date.now();
            return _this.setTimeout(function () {
                callback({
                    didTimeout: false,
                    timeRemaining: function () { return Math.max(0, 50 - (Date.now() - start)); }
                });
            }, (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : 1);
        });
        this.cancelIdleCallbackNative = (_d = (_c = window['cancelIdleCallback']) === null || _c === void 0 ? void 0 : _c.bind(window)) !== null && _d !== void 0 ? _d : (function (request) {
            _this.clearTimeout(request);
        });
        this.isDestructed = false;
    }
    Async.prototype.delay = function (timeout) {
        var _this = this;
        return this.promise(function (resolve) { return _this.setTimeout(resolve, timeout); });
    };
    Async.prototype.setTimeout = function (callback, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (this.isDestructed) {
            return 0;
        }
        var options = {};
        if (!(0, is_number_1.isNumber)(timeout)) {
            options = timeout;
            timeout = options.timeout || 0;
        }
        if (options.label) {
            this.clearLabel(options.label);
        }
        var timer = async_1.setTimeout.apply(void 0, tslib_1.__spreadArray([callback, timeout], tslib_1.__read(args), false)), key = options.label || timer;
        this.timers.set(key, timer);
        return timer;
    };
    Async.prototype.clearLabel = function (label) {
        if (label && this.timers.has(label)) {
            (0, async_1.clearTimeout)(this.timers.get(label));
            this.timers.delete(label);
        }
    };
    Async.prototype.clearTimeout = function (timerOrLabel) {
        if ((0, is_string_1.isString)(timerOrLabel)) {
            return this.clearLabel(timerOrLabel);
        }
        (0, async_1.clearTimeout)(timerOrLabel);
        this.timers.delete(timerOrLabel);
    };
    Async.prototype.debounce = function (fn, timeout, firstCallImmediately) {
        var _this = this;
        if (firstCallImmediately === void 0) { firstCallImmediately = false; }
        var timer = 0, fired = false;
        var promises = [];
        var callFn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!fired) {
                timer = 0;
                var res = fn.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
                fired = true;
                if (promises.length) {
                    var runPromises = function () {
                        promises.forEach(function (res) { return res(); });
                        promises.length = 0;
                    };
                    (0, is_promise_1.isPromise)(res) ? res.finally(runPromises) : runPromises();
                }
            }
        };
        var onFire = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            fired = false;
            if (!timeout) {
                callFn.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
            }
            else {
                if (!timer && firstCallImmediately) {
                    callFn.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
                }
                (0, async_1.clearTimeout)(timer);
                timer = _this.setTimeout(function () { return callFn.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false)); }, (0, is_function_1.isFunction)(timeout) ? timeout() : timeout);
                _this.timers.set(fn, timer);
            }
        };
        return (0, is_plain_object_1.isPlainObject)(timeout) && timeout.promisify
            ? function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var promise = _this.promise(function (res) {
                    promises.push(res);
                });
                onFire.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
                return promise;
            }
            : onFire;
    };
    Async.prototype.throttle = function (fn, timeout, ignore) {
        var _this = this;
        if (ignore === void 0) { ignore = false; }
        var timer = null, needInvoke, callee, lastArgs;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            needInvoke = true;
            lastArgs = args;
            if (!timeout) {
                fn.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(lastArgs), false));
                return;
            }
            if (!timer) {
                callee = function () {
                    if (needInvoke) {
                        fn.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(lastArgs), false));
                        needInvoke = false;
                        timer = _this.setTimeout(callee, (0, is_function_1.isFunction)(timeout) ? timeout() : timeout);
                        _this.timers.set(callee, timer);
                    }
                    else {
                        timer = null;
                    }
                };
                callee();
            }
        };
    };
    Async.prototype.promise = function (executor) {
        var _this = this;
        var rejectCallback = function () { };
        var promise = new Promise(function (resolve, reject) {
            _this.promisesRejections.add(reject);
            rejectCallback = reject;
            return executor(resolve, reject);
        });
        if (!promise.finally && "es5" !== 'es2018') {
            promise.finally = function (onfinally) {
                promise.then(onfinally).catch(onfinally);
                return promise;
            };
        }
        promise
            .finally(function () {
            _this.promisesRejections.delete(rejectCallback);
        })
            .catch(function () { return null; });
        promise.rejectCallback = rejectCallback;
        return promise;
    };
    Async.prototype.promiseState = function (p) {
        var _this = this;
        if (p.status) {
            return p.status;
        }
        if (!Promise.race) {
            return new Promise(function (resolve) {
                p.then(function (v) {
                    resolve('fulfilled');
                    return v;
                }, function (e) {
                    resolve('rejected');
                    throw e;
                });
                _this.setTimeout(function () {
                    resolve('pending');
                }, 100);
            });
        }
        var t = {};
        return Promise.race([p, t]).then(function (v) { return (v === t ? 'pending' : 'fulfilled'); }, function () { return 'rejected'; });
    };
    Async.prototype.requestIdleCallback = function (callback, options) {
        var request = this.requestIdleCallbackNative(callback, options);
        this.requestsIdle.add(request);
        return request;
    };
    Async.prototype.requestIdlePromise = function (options) {
        var _this = this;
        return this.promise(function (res) {
            var request = _this.requestIdleCallback(function () { return res(request); }, options);
        });
    };
    Async.prototype.cancelIdleCallback = function (request) {
        this.requestsIdle.delete(request);
        return this.cancelIdleCallbackNative(request);
    };
    Async.prototype.requestAnimationFrame = function (callback) {
        var request = requestAnimationFrame(callback);
        this.requestsRaf.add(request);
        return request;
    };
    Async.prototype.cancelAnimationFrame = function (request) {
        this.requestsRaf.delete(request);
        cancelAnimationFrame(request);
    };
    Async.prototype.clear = function () {
        var _this = this;
        this.requestsIdle.forEach(function (key) { return _this.cancelIdleCallback(key); });
        this.requestsRaf.forEach(function (key) { return _this.cancelAnimationFrame(key); });
        this.timers.forEach(function (key) {
            return (0, async_1.clearTimeout)(_this.timers.get(key));
        });
        this.timers.clear();
        this.promisesRejections.forEach(function (reject) { return reject(); });
        this.promisesRejections.clear();
    };
    Async.prototype.destruct = function () {
        this.clear();
        this.isDestructed = true;
    };
    return Async;
}());
exports.Async = Async;


/***/ }),

/***/ 60588:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(14722), exports);


/***/ }),

/***/ 97336:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(60232), exports);


/***/ }),

/***/ 60232:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearTimeout = exports.setTimeout = void 0;
var tslib_1 = __webpack_require__(20255);
function setTimeout(callback, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!timeout) {
        callback.call.apply(callback, tslib_1.__spreadArray([null], tslib_1.__read(args), false));
    }
    else {
        return window.setTimeout.apply(window, tslib_1.__spreadArray([callback, timeout], tslib_1.__read(args), false));
    }
    return 0;
}
exports.setTimeout = setTimeout;
function clearTimeout(timer) {
    window.clearTimeout(timer);
}
exports.clearTimeout = clearTimeout;


/***/ }),

/***/ 2555:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isArray = void 0;
function isArray(elm) {
    return Array.isArray(elm);
}
exports.isArray = isArray;


/***/ }),

/***/ 84121:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFunction = void 0;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;


/***/ }),

/***/ 93860:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNumber = void 0;
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
exports.isNumber = isNumber;


/***/ }),

/***/ 77184:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPlainObject = void 0;
var is_window_1 = __webpack_require__(99562);
function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object' || obj.nodeType || (0, is_window_1.isWindow)(obj)) {
        return false;
    }
    return !(obj.constructor &&
        !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'));
}
exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 30317:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPromise = void 0;
function isPromise(val) {
    return val && typeof val.then === 'function';
}
exports.isPromise = isPromise;


/***/ }),

/***/ 40607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isStringArray = exports.isString = void 0;
var is_array_1 = __webpack_require__(2555);
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isStringArray(value) {
    return (0, is_array_1.isArray)(value) && isString(value[0]);
}
exports.isStringArray = isStringArray;


/***/ }),

/***/ 99562:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isWindow = void 0;
function isWindow(obj) {
    return obj != null && obj === obj.window;
}
exports.isWindow = isWindow;


/***/ }),

/***/ 36211:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.domToVDom = exports.attrsToDict = void 0;
var tslib_1 = __webpack_require__(20255);
function attrsToDict(elm) {
    var _a, _b;
    var result = {};
    if (elm.nodeName === 'SCRIPT') {
        result.textContent = (_a = elm.textContent) !== null && _a !== void 0 ? _a : '';
    }
    if (elm.nodeType === Node.TEXT_NODE) {
        result.nodeValue = (_b = elm.nodeValue) !== null && _b !== void 0 ? _b : '';
    }
    if (elm instanceof HTMLElement) {
        for (var i = 0; i < elm.attributes.length; i += 1) {
            var attr = elm.attributes.item(i);
            if (attr) {
                result[attr.name] = attr.value;
            }
        }
    }
    return result;
}
exports.attrsToDict = attrsToDict;
function domToVDom(elm, noNode) {
    var _a;
    if (noNode === void 0) { noNode = true; }
    if (elm.nodeType === Node.TEXT_NODE) {
        return {
            type: 'TEXT_ELEMENT',
            props: {
                children: [],
                nodeValue: (_a = elm.nodeValue) !== null && _a !== void 0 ? _a : ''
            }
        };
    }
    return {
        type: elm.nodeName.toLowerCase(),
        props: tslib_1.__assign({ children: Array.from(elm.childNodes).map(function (n) { return domToVDom(n, noNode); }) }, attrsToDict(elm))
    };
}
exports.domToVDom = domToVDom;


/***/ }),

/***/ 23336:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(66814), exports);
tslib_1.__exportStar(__webpack_require__(52464), exports);
tslib_1.__exportStar(__webpack_require__(53401), exports);


/***/ }),

/***/ 66814:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 52464:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VDomRender = void 0;
var tslib_1 = __webpack_require__(20255);
var helpers_1 = __webpack_require__(36211);
var async_1 = __webpack_require__(60588);
var autobind_decorator_1 = __webpack_require__(70631);
var isProperty = function (key) { return key !== 'children'; };
var isNew = function (prev, next) {
    return function (key) {
        return prev[key] !== next[key];
    };
};
var isGone = function (prev, next) {
    return function (key) {
        return !(key in next);
    };
};
var updateDom = function (dom, prevProps, nextProps) {
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(function (name) {
        dom[name] = '';
    });
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(function (name) {
        dom[name] = nextProps[name];
    });
};
var createDom = function (fiber) {
    var dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);
    return dom;
};
var VDomRender = (function () {
    function VDomRender() {
        this.async = new async_1.Async();
        this.nextUnitOfWork = undefined;
        this.currentRoot = undefined;
        this.wipRoot = undefined;
        this.deletions = [];
        this.async.requestIdleCallback(this.workLoop);
    }
    VDomRender.prototype.commitRoot = function () {
        var _a;
        this.deletions.forEach(this.commitWork);
        this.deletions.length = 0;
        this.commitWork((_a = this.wipRoot) === null || _a === void 0 ? void 0 : _a.child);
        this.currentRoot = this.wipRoot;
        this.wipRoot = undefined;
    };
    VDomRender.prototype.commitWork = function (fiber) {
        var _a, _b;
        if (!fiber) {
            return;
        }
        var domParentFiber = fiber.parent;
        while (!(domParentFiber === null || domParentFiber === void 0 ? void 0 : domParentFiber.dom)) {
            domParentFiber = domParentFiber === null || domParentFiber === void 0 ? void 0 : domParentFiber.parent;
        }
        var domParent = domParentFiber.dom;
        if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
            domParent.appendChild(fiber.dom);
        }
        else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
            updateDom(fiber.dom, (_b = (_a = fiber.alternate) === null || _a === void 0 ? void 0 : _a.props) !== null && _b !== void 0 ? _b : {}, fiber.props);
        }
        else if (fiber.effectTag === 'DELETION') {
            this.commitDeletion(fiber, domParent);
        }
        this.commitWork(fiber === null || fiber === void 0 ? void 0 : fiber.child);
        this.commitWork(fiber === null || fiber === void 0 ? void 0 : fiber.sibling);
    };
    VDomRender.prototype.commitDeletion = function (fiber, domParent) {
        if (fiber === null || fiber === void 0 ? void 0 : fiber.dom) {
            domParent.removeChild(fiber.dom);
        }
        else {
            this.commitDeletion(fiber === null || fiber === void 0 ? void 0 : fiber.child, domParent);
        }
    };
    VDomRender.prototype.render = function (element, container) {
        var _a;
        this.wipRoot = {
            type: 'div',
            dom: container,
            props: {
                children: [element]
            },
            alternate: (_a = this.currentRoot) !== null && _a !== void 0 ? _a : undefined
        };
        this.deletions = [];
        this.nextUnitOfWork = this.wipRoot;
    };
    VDomRender.prototype.workLoop = function (deadline) {
        var shouldYield = false;
        while (this.nextUnitOfWork && !shouldYield) {
            this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
            shouldYield = deadline.timeRemaining() < 1;
        }
        if (!this.nextUnitOfWork && this.wipRoot) {
            this.commitRoot();
        }
        this.async.requestIdleCallback(this.workLoop);
    };
    VDomRender.prototype.performUnitOfWork = function (fiber) {
        this.__updateHostComponent(fiber);
        if (fiber.child) {
            return fiber.child;
        }
        var nextFiber = fiber;
        while (nextFiber) {
            if (nextFiber.sibling) {
                return nextFiber.sibling;
            }
            nextFiber = nextFiber.parent;
        }
        return;
    };
    VDomRender.prototype.__updateHostComponent = function (fiber) {
        if (!fiber.dom) {
            fiber.dom = createDom(fiber);
        }
        this.__reconcileChildren(fiber, fiber.props.children);
    };
    VDomRender.prototype.__reconcileChildren = function (wipFiber, elements) {
        var index = 0;
        var oldFiber = wipFiber.alternate && wipFiber.alternate.child;
        var prevSibling = undefined;
        while (index < elements.length || oldFiber) {
            var element = elements[index];
            var newFiber = undefined;
            var sameType = oldFiber && element && element.type === oldFiber.type;
            if (sameType && oldFiber) {
                newFiber = {
                    type: oldFiber.type,
                    props: element.props,
                    dom: oldFiber.dom,
                    parent: wipFiber,
                    alternate: oldFiber,
                    effectTag: 'UPDATE'
                };
            }
            if (element && !sameType) {
                newFiber = {
                    type: element.type,
                    props: element.props,
                    dom: null,
                    parent: wipFiber,
                    alternate: undefined,
                    effectTag: 'PLACEMENT'
                };
            }
            if (oldFiber && !sameType) {
                oldFiber.effectTag = 'DELETION';
                this.deletions.push(oldFiber);
            }
            if (oldFiber) {
                oldFiber = oldFiber.sibling;
            }
            if (index === 0 && wipFiber) {
                wipFiber.child = newFiber;
            }
            else if (element && prevSibling) {
                prevSibling.sibling = newFiber;
            }
            prevSibling = newFiber;
            index++;
        }
    };
    VDomRender.prototype.htmlToVDom = function (html) {
        var box = document.createElement('div');
        box.innerHTML = html;
        return (0, helpers_1.domToVDom)(box.children.length > 1 || !box.firstChild ? box : box.firstChild);
    };
    VDomRender = tslib_1.__decorate([
        autobind_decorator_1.default
    ], VDomRender);
    return VDomRender;
}());
exports.VDomRender = VDomRender;


/***/ }),

/***/ 53401:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VDomJodit = void 0;
__webpack_require__(8058);
var render_1 = __webpack_require__(52464);
var VDomJodit = (function () {
    function VDomJodit(elm) {
        var _a;
        this.render = new render_1.VDomRender();
        this.container = document.createElement('div');
        elm.style.display = 'none';
        (_a = elm.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.container, elm);
        this.container.setAttribute('contenteditable', 'true');
        this.container.classList.add('jodit-v-dom-container');
        this.value = elm.value;
        this.preventAllInputEvents();
    }
    Object.defineProperty(VDomJodit.prototype, "value", {
        set: function (v) {
            this.vdom = this.render.htmlToVDom(v);
            this.render.render(this.vdom, this.container);
        },
        enumerable: false,
        configurable: true
    });
    VDomJodit.make = function (elm) {
        return new VDomJodit(elm);
    };
    VDomJodit.prototype.preventAllInputEvents = function () {
        this.container.addEventListener('keydown', function (e) {
            e.preventDefault();
        });
    };
    return VDomJodit;
}());
exports.VDomJodit = VDomJodit;


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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(23336);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});