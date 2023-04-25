/*!
 * jodit - Jodit is awesome and usefully wysiwyg editor with filebrowser
 * Author: Chupurnov <chupurnov@gmail.com> (https://xdsoft.net/)
 * Version: v3.24.9
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
exports.__classPrivateFieldIn = exports.__classPrivateFieldSet = exports.__classPrivateFieldGet = exports.__importDefault = exports.__importStar = exports.__makeTemplateObject = exports.__asyncValues = exports.__asyncDelegator = exports.__asyncGenerator = exports.__await = exports.__spreadArray = exports.__spreadArrays = exports.__spread = exports.__read = exports.__values = exports.__exportStar = exports.__createBinding = exports.__generator = exports.__awaiter = exports.__metadata = exports.__setFunctionName = exports.__propKey = exports.__runInitializers = exports.__esDecorate = exports.__param = exports.__decorate = exports.__rest = exports.__assign = exports.__extends = void 0;
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
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.push(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
exports.__esDecorate = __esDecorate;
;
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
exports.__runInitializers = __runInitializers;
;
function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
}
exports.__propKey = __propKey;
;
function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol")
        name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
exports.__setFunctionName = __setFunctionName;
;
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
        while (g && (g = 0, op[0] && (_ = 0)), _)
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
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
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

/***/ 77536:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Async = void 0;
var tslib_1 = __webpack_require__(20255);
var async_1 = __webpack_require__(4696);
var is_function_1 = __webpack_require__(42096);
var is_plain_object_1 = __webpack_require__(79736);
var is_promise_1 = __webpack_require__(26335);
var is_string_1 = __webpack_require__(24421);
var is_number_1 = __webpack_require__(61817);
var assert_1 = __webpack_require__(52378);
var Async = (function () {
    function Async() {
        var _this = this;
        var _a, _b, _c, _d;
        this.timers = new Map();
        this.__callbacks = new Map();
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
        this.__callbacks.set(key, callback);
        return timer;
    };
    Async.prototype.updateTimeout = function (label, timeout) {
        void 0;
        if (!label || !this.timers.has(label)) {
            return null;
        }
        var callback = this.__callbacks.get(label);
        void 0;
        return this.setTimeout(callback, { label: label, timeout: timeout });
    };
    Async.prototype.clearLabel = function (label) {
        if (label && this.timers.has(label)) {
            (0, async_1.clearTimeout)(this.timers.get(label));
            this.timers.delete(label);
            this.__callbacks.delete(label);
        }
    };
    Async.prototype.clearTimeout = function (timerOrLabel) {
        if ((0, is_string_1.isString)(timerOrLabel)) {
            return this.clearLabel(timerOrLabel);
        }
        (0, async_1.clearTimeout)(timerOrLabel);
        this.timers.delete(timerOrLabel);
        this.__callbacks.delete(timerOrLabel);
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

/***/ 22630:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(77536), exports);


/***/ }),

/***/ 29411:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STATUSES = void 0;
exports.STATUSES = {
    beforeInit: 'beforeInit',
    ready: 'ready',
    beforeDestruct: 'beforeDestruct',
    destructed: 'destructed'
};


/***/ }),

/***/ 46163:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.watch = exports.getPropertyDescriptor = void 0;
var tslib_1 = __webpack_require__(20255);
var is_function_1 = __webpack_require__(42096);
var is_plain_object_1 = __webpack_require__(79736);
var is_view_object_1 = __webpack_require__(96574);
var observable_1 = __webpack_require__(88418);
var statuses_1 = __webpack_require__(29411);
var split_array_1 = __webpack_require__(14556);
var error_1 = __webpack_require__(56964);
function getPropertyDescriptor(obj, prop) {
    var desc;
    do {
        desc = Object.getOwnPropertyDescriptor(obj, prop);
        obj = Object.getPrototypeOf(obj);
    } while (!desc && obj);
    return desc;
}
exports.getPropertyDescriptor = getPropertyDescriptor;
function watch(observeFields, context) {
    return function (target, propertyKey) {
        if (!(0, is_function_1.isFunction)(target[propertyKey])) {
            throw (0, error_1.error)('Handler must be a Function');
        }
        var process = function (component) {
            var callback = function (key) {
                var _a;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (!component.isInDestruct) {
                    return (_a = component)[propertyKey].apply(_a, tslib_1.__spreadArray([key], tslib_1.__read(args), false));
                }
            };
            (0, split_array_1.splitArray)(observeFields).forEach(function (field) {
                if (/:/.test(field)) {
                    var _a = tslib_1.__read(field.split(':'), 2), objectPath = _a[0], eventName_1 = _a[1];
                    var ctx_1 = context;
                    var view_1 = (0, is_view_object_1.isViewObject)(component)
                        ? component
                        : component.jodit;
                    if (objectPath.length) {
                        ctx_1 = component.get(objectPath);
                    }
                    if ((0, is_function_1.isFunction)(ctx_1)) {
                        ctx_1 = ctx_1(component);
                    }
                    view_1.events.on(ctx_1 || component, eventName_1, callback);
                    if (!ctx_1) {
                        view_1.events.on(eventName_1, callback);
                    }
                    component.hookStatus('beforeDestruct', function () {
                        view_1.events
                            .off(ctx_1 || component, eventName_1, callback)
                            .off(eventName_1, callback);
                    });
                    return;
                }
                var parts = field.split('.'), _b = tslib_1.__read(parts, 1), key = _b[0], teil = parts.slice(1);
                var value = component[key];
                if ((0, is_plain_object_1.isPlainObject)(value)) {
                    var observableValue = (0, observable_1.observable)(value);
                    observableValue.on("change.".concat(teil.join('.')), callback);
                }
                var descriptor = getPropertyDescriptor(target, key);
                Object.defineProperty(component, key, {
                    configurable: true,
                    set: function (v) {
                        var oldValue = value;
                        if (oldValue === v) {
                            return;
                        }
                        value = v;
                        if (descriptor && descriptor.set) {
                            descriptor.set.call(component, v);
                        }
                        if ((0, is_plain_object_1.isPlainObject)(value)) {
                            value = (0, observable_1.observable)(value);
                            value.on("change.".concat(teil.join('.')), callback);
                        }
                        callback(key, oldValue, value);
                    },
                    get: function () {
                        if (descriptor && descriptor.get) {
                            return descriptor.get.call(component);
                        }
                        return value;
                    }
                });
            });
        };
        if ((0, is_function_1.isFunction)(target.hookStatus)) {
            target.hookStatus(statuses_1.STATUSES.ready, process);
        }
        else {
            process(target);
        }
    };
}
exports.watch = watch;
exports["default"] = watch;


/***/ }),

/***/ 3808:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEmitter = void 0;
var tslib_1 = __webpack_require__(20255);
var store_1 = __webpack_require__(83611);
var is_string_1 = __webpack_require__(24421);
var is_function_1 = __webpack_require__(42096);
var is_array_1 = __webpack_require__(49781);
var error_1 = __webpack_require__(56964);
var split_array_1 = __webpack_require__(14556);
var EventEmitter = (function () {
    function EventEmitter(doc) {
        var _this = this;
        this.__mutedEvents = new Set();
        this.__key = '__JoditEventEmitterNamespaces';
        this.__doc = document;
        this.__prepareEvent = function (e) {
            if (e.cancelBubble) {
                return;
            }
            if (e.composed && (0, is_function_1.isFunction)(e.composedPath) && e.composedPath()[0]) {
                Object.defineProperty(e, 'target', {
                    value: e.composedPath()[0],
                    configurable: true,
                    enumerable: true
                });
            }
            if (e.type.match(/^touch/) &&
                e.changedTouches &&
                e.changedTouches.length) {
                ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function (key) {
                    Object.defineProperty(e, key, {
                        value: e.changedTouches[0][key],
                        configurable: true,
                        enumerable: true
                    });
                });
            }
            if (!e.originalEvent) {
                e.originalEvent = e;
            }
            if (e.type === 'paste' &&
                e.clipboardData === undefined &&
                _this.__doc.defaultView.clipboardData) {
                Object.defineProperty(e, 'clipboardData', {
                    get: function () {
                        return _this.__doc.defaultView.clipboardData;
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        };
        this.currents = [];
        this.__stopped = [];
        this.__isDestructed = false;
        if (doc) {
            this.__doc = doc;
        }
        this.__key += new Date().getTime();
    }
    EventEmitter.prototype.mute = function (event) {
        this.__mutedEvents.add(event !== null && event !== void 0 ? event : '*');
        return this;
    };
    EventEmitter.prototype.isMuted = function (event) {
        if (event && this.__mutedEvents.has(event)) {
            return true;
        }
        return this.__mutedEvents.has('*');
    };
    EventEmitter.prototype.unmute = function (event) {
        this.__mutedEvents.delete(event !== null && event !== void 0 ? event : '*');
        return this;
    };
    EventEmitter.prototype.__eachEvent = function (events, callback) {
        var _this = this;
        var eventParts = (0, split_array_1.splitArray)(events).map(function (e) { return e.trim(); });
        eventParts.forEach(function (eventNameSpace) {
            var eventAndNameSpace = eventNameSpace.split('.');
            var namespace = eventAndNameSpace[1] || store_1.defaultNameSpace;
            callback.call(_this, eventAndNameSpace[0], namespace);
        });
    };
    EventEmitter.prototype.__getStore = function (subject) {
        if (!subject) {
            throw (0, error_1.error)('Need subject');
        }
        if (subject[this.__key] === undefined) {
            var store = new store_1.EventHandlersStore();
            Object.defineProperty(subject, this.__key, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: store
            });
        }
        return subject[this.__key];
    };
    EventEmitter.prototype.__removeStoreFromSubject = function (subject) {
        if (subject[this.__key] !== undefined) {
            Object.defineProperty(subject, this.__key, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: undefined
            });
        }
    };
    EventEmitter.prototype.__triggerNativeEvent = function (element, event) {
        var evt = this.__doc.createEvent('HTMLEvents');
        if ((0, is_string_1.isString)(event)) {
            evt.initEvent(event, true, true);
        }
        else {
            evt.initEvent(event.type, event.bubbles, event.cancelable);
            [
                'screenX',
                'screenY',
                'clientX',
                'clientY',
                'target',
                'srcElement',
                'currentTarget',
                'timeStamp',
                'which',
                'keyCode'
            ].forEach(function (property) {
                Object.defineProperty(evt, property, {
                    value: event[property],
                    enumerable: true
                });
            });
            Object.defineProperty(evt, 'originalEvent', {
                value: event,
                enumerable: true
            });
        }
        element.dispatchEvent(evt);
    };
    Object.defineProperty(EventEmitter.prototype, "current", {
        get: function () {
            return this.currents[this.currents.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    EventEmitter.prototype.on = function (eventsOrSubjects, callbackOrEvents, optionsOrCallback, opts) {
        var _this = this;
        var subjects;
        var events;
        var callback;
        var options;
        if ((0, is_string_1.isString)(eventsOrSubjects) || (0, is_string_1.isStringArray)(eventsOrSubjects)) {
            subjects = this;
            events = eventsOrSubjects;
            callback = callbackOrEvents;
            options = optionsOrCallback;
        }
        else {
            subjects = eventsOrSubjects;
            events = callbackOrEvents;
            callback = optionsOrCallback;
            options = opts;
        }
        if (!((0, is_string_1.isString)(events) || (0, is_string_1.isStringArray)(events)) ||
            events.length === 0) {
            throw (0, error_1.error)('Need events names');
        }
        if (!(0, is_function_1.isFunction)(callback)) {
            throw (0, error_1.error)('Need event handler');
        }
        if ((0, is_array_1.isArray)(subjects)) {
            subjects.forEach(function (subj) {
                _this.on(subj, events, callback, options);
            });
            return this;
        }
        var subject = subjects;
        var store = this.__getStore(subject);
        var isDOMElement = (0, is_function_1.isFunction)(subject.addEventListener), self = this;
        var syntheticCallback = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (self.isMuted(event)) {
                return;
            }
            return callback && callback.call.apply(callback, tslib_1.__spreadArray([this], tslib_1.__read(args), false));
        };
        if (isDOMElement) {
            syntheticCallback = function (event) {
                if (self.isMuted(event.type)) {
                    return;
                }
                self.__prepareEvent(event);
                if (callback && callback.call(this, event) === false) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                }
                return;
            };
        }
        this.__eachEvent(events, function (event, namespace) {
            if (event.length === 0) {
                throw (0, error_1.error)('Need event name');
            }
            if (store.indexOf(event, namespace, callback) === false) {
                var block = {
                    event: event,
                    originalCallback: callback,
                    syntheticCallback: syntheticCallback
                };
                store.set(event, namespace, block, options === null || options === void 0 ? void 0 : options.top);
                if (isDOMElement) {
                    var options_1 = [
                        'touchstart',
                        'touchend',
                        'scroll',
                        'mousewheel',
                        'mousemove',
                        'touchmove'
                    ].includes(event)
                        ? {
                            passive: true
                        }
                        : false;
                    subject.addEventListener(event, syntheticCallback, options_1);
                }
            }
        });
        return this;
    };
    EventEmitter.prototype.one = function (eventsOrSubjects, callbackOrEvents, optionsOrCallback, opts) {
        var _this = this;
        var subjects;
        var events;
        var callback;
        var options;
        if ((0, is_string_1.isString)(eventsOrSubjects) || (0, is_string_1.isStringArray)(eventsOrSubjects)) {
            subjects = this;
            events = eventsOrSubjects;
            callback = callbackOrEvents;
            options = optionsOrCallback;
        }
        else {
            subjects = eventsOrSubjects;
            events = callbackOrEvents;
            callback = optionsOrCallback;
            options = opts;
        }
        var newCallback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(subjects, events, newCallback);
            return callback.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        };
        this.on(subjects, events, newCallback, options);
        return this;
    };
    EventEmitter.prototype.off = function (eventsOrSubjects, callbackOrEvents, handler) {
        var _this = this;
        var subjects;
        var events;
        var callback;
        if ((0, is_string_1.isString)(eventsOrSubjects) || (0, is_string_1.isStringArray)(eventsOrSubjects)) {
            subjects = this;
            events = eventsOrSubjects;
            callback = callbackOrEvents;
        }
        else {
            subjects = eventsOrSubjects;
            events = callbackOrEvents;
            callback = handler;
        }
        if ((0, is_array_1.isArray)(subjects)) {
            subjects.forEach(function (subj) {
                _this.off(subj, events, callback);
            });
            return this;
        }
        var subject = subjects;
        var store = this.__getStore(subject);
        if (!((0, is_string_1.isString)(events) || (0, is_string_1.isStringArray)(events)) ||
            events.length === 0) {
            store.namespaces().forEach(function (namespace) {
                _this.off(subject, '.' + namespace);
            });
            this.__removeStoreFromSubject(subject);
            return this;
        }
        var isDOMElement = (0, is_function_1.isFunction)(subject.removeEventListener), removeEventListener = function (block) {
            if (isDOMElement) {
                subject.removeEventListener(block.event, block.syntheticCallback, false);
            }
        }, removeCallbackFromNameSpace = function (event, namespace) {
            if (event === '') {
                store.events(namespace).forEach(function (eventName) {
                    if (eventName !== '') {
                        removeCallbackFromNameSpace(eventName, namespace);
                    }
                });
                return;
            }
            var blocks = store.get(event, namespace);
            if (!blocks || !blocks.length) {
                return;
            }
            if (!(0, is_function_1.isFunction)(callback)) {
                blocks.forEach(removeEventListener);
                blocks.length = 0;
                store.clearEvents(namespace, event);
            }
            else {
                var index = store.indexOf(event, namespace, callback);
                if (index !== false) {
                    removeEventListener(blocks[index]);
                    blocks.splice(index, 1);
                    if (!blocks.length) {
                        store.clearEvents(namespace, event);
                    }
                }
            }
        };
        this.__eachEvent(events, function (event, namespace) {
            if (namespace === store_1.defaultNameSpace) {
                store.namespaces().forEach(function (namespace) {
                    removeCallbackFromNameSpace(event, namespace);
                });
            }
            else {
                removeCallbackFromNameSpace(event, namespace);
            }
        });
        if (store.isEmpty()) {
            this.__removeStoreFromSubject(subject);
        }
        return this;
    };
    EventEmitter.prototype.stopPropagation = function (subjectOrEvents, eventsList) {
        var _this = this;
        var subject = (0, is_string_1.isString)(subjectOrEvents)
            ? this
            : subjectOrEvents;
        var events = (0, is_string_1.isString)(subjectOrEvents)
            ? subjectOrEvents
            : eventsList;
        if (typeof events !== 'string') {
            throw (0, error_1.error)('Need event names');
        }
        var store = this.__getStore(subject);
        this.__eachEvent(events, function (event, namespace) {
            var blocks = store.get(event, namespace);
            if (blocks) {
                _this.__stopped.push(blocks);
            }
            if (namespace === store_1.defaultNameSpace) {
                store
                    .namespaces(true)
                    .forEach(function (ns) {
                    return _this.stopPropagation(subject, event + '.' + ns);
                });
            }
        });
    };
    EventEmitter.prototype.__removeStop = function (currentBlocks) {
        if (currentBlocks) {
            var index = this.__stopped.indexOf(currentBlocks);
            index !== -1 && this.__stopped.splice(0, index + 1);
        }
    };
    EventEmitter.prototype.__isStopped = function (currentBlocks) {
        return (currentBlocks !== undefined &&
            this.__stopped.indexOf(currentBlocks) !== -1);
    };
    EventEmitter.prototype.fire = function (subjectOrEvents, eventsList) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var result, result_value;
        var subject = (0, is_string_1.isString)(subjectOrEvents)
            ? this
            : subjectOrEvents;
        var events = (0, is_string_1.isString)(subjectOrEvents)
            ? subjectOrEvents
            : eventsList;
        var argumentsList = (0, is_string_1.isString)(subjectOrEvents)
            ? tslib_1.__spreadArray([eventsList], tslib_1.__read(args), false) : args;
        var isDOMElement = (0, is_function_1.isFunction)(subject.dispatchEvent);
        if (!isDOMElement && !(0, is_string_1.isString)(events)) {
            throw (0, error_1.error)('Need events names');
        }
        var store = this.__getStore(subject);
        if (!(0, is_string_1.isString)(events) && isDOMElement) {
            this.__triggerNativeEvent(subject, eventsList);
        }
        else {
            this.__eachEvent(events, function (event, namespace) {
                if (isDOMElement) {
                    _this.__triggerNativeEvent(subject, event);
                }
                else {
                    var blocks_1 = store.get(event, namespace);
                    if (blocks_1) {
                        try {
                            tslib_1.__spreadArray([], tslib_1.__read(blocks_1), false).every(function (block) {
                                var _a;
                                if (_this.__isStopped(blocks_1)) {
                                    return false;
                                }
                                _this.currents.push(event);
                                result_value = (_a = block.syntheticCallback).call.apply(_a, tslib_1.__spreadArray([subject,
                                    event], tslib_1.__read(argumentsList), false));
                                _this.currents.pop();
                                if (result_value !== undefined) {
                                    result = result_value;
                                }
                                return true;
                            });
                        }
                        finally {
                            _this.__removeStop(blocks_1);
                        }
                    }
                    if (namespace === store_1.defaultNameSpace && !isDOMElement) {
                        store
                            .namespaces()
                            .filter(function (ns) { return ns !== namespace; })
                            .forEach(function (ns) {
                            var result_second = _this.fire.apply(_this, tslib_1.__spreadArray([
                                subject,
                                event + '.' + ns
                            ], tslib_1.__read(argumentsList), false));
                            if (result_second !== undefined) {
                                result = result_second;
                            }
                        });
                    }
                }
            });
        }
        return result;
    };
    EventEmitter.prototype.destruct = function () {
        if (!this.__isDestructed) {
            return;
        }
        this.__isDestructed = true;
        this.off(this);
        this.__getStore(this).clear();
        this.__removeStoreFromSubject(this);
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;


/***/ }),

/***/ 73852:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Eventify = void 0;
var tslib_1 = __webpack_require__(20255);
var Eventify = (function () {
    function Eventify() {
        this.__map = new Map();
    }
    Eventify.prototype.on = function (name, func) {
        var _a;
        if (!this.__map.has(name)) {
            this.__map.set(name, new Set());
        }
        (_a = this.__map.get(name)) === null || _a === void 0 ? void 0 : _a.add(func);
        return this;
    };
    Eventify.prototype.off = function (name, func) {
        var _a;
        if (this.__map.has(name)) {
            (_a = this.__map.get(name)) === null || _a === void 0 ? void 0 : _a.delete(func);
        }
        return this;
    };
    Eventify.prototype.destruct = function () {
        this.__map.clear();
    };
    Eventify.prototype.emit = function (name) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var result;
        if (this.__map.has(name)) {
            (_a = this.__map.get(name)) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) {
                result = cb.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
            });
        }
        return result;
    };
    return Eventify;
}());
exports.Eventify = Eventify;


/***/ }),

/***/ 55395:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(3808), exports);
tslib_1.__exportStar(__webpack_require__(73852), exports);
tslib_1.__exportStar(__webpack_require__(88418), exports);
tslib_1.__exportStar(__webpack_require__(83611), exports);


/***/ }),

/***/ 88418:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observable = void 0;
var tslib_1 = __webpack_require__(20255);
var is_array_1 = __webpack_require__(49781);
var is_equal_1 = __webpack_require__(32756);
var is_plain_object_1 = __webpack_require__(79736);
var watch_1 = __webpack_require__(46163);
var OBSERVABLE_OBJECT = Symbol('observable-object');
function isObservableObject(obj) {
    return obj[OBSERVABLE_OBJECT] !== undefined;
}
function observable(obj) {
    if (isObservableObject(obj)) {
        return obj;
    }
    var __lockEvent = {};
    var __onEvents = {};
    var on = function (event, callback) {
        if ((0, is_array_1.isArray)(event)) {
            event.map(function (e) { return on(e, callback); });
            return obj;
        }
        if (!__onEvents[event]) {
            __onEvents[event] = [];
        }
        __onEvents[event].push(callback);
        return obj;
    };
    var fire = function (event) {
        var attr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            attr[_i - 1] = arguments[_i];
        }
        if ((0, is_array_1.isArray)(event)) {
            event.map(function (e) { return fire.apply(void 0, tslib_1.__spreadArray([e], tslib_1.__read(attr), false)); });
            return;
        }
        try {
            if (!__lockEvent[event] && __onEvents[event]) {
                __lockEvent[event] = true;
                __onEvents[event].forEach(function (clb) { return clb.call.apply(clb, tslib_1.__spreadArray([obj], tslib_1.__read(attr), false)); });
            }
        }
        finally {
            __lockEvent[event] = false;
        }
    };
    var initAccessors = function (dict, prefixes) {
        if (prefixes === void 0) { prefixes = []; }
        var store = {};
        if (isObservableObject(dict)) {
            return;
        }
        Object.defineProperty(dict, OBSERVABLE_OBJECT, {
            enumerable: false,
            value: true
        });
        Object.keys(dict).forEach(function (_key) {
            var key = _key;
            var prefix = prefixes.concat(key).filter(function (a) { return a.length; });
            store[key] = dict[key];
            var descriptor = (0, watch_1.getPropertyDescriptor)(dict, key);
            Object.defineProperty(dict, key, {
                set: function (value) {
                    var oldValue = store[key];
                    if (!(0, is_equal_1.isFastEqual)(store[key], value)) {
                        fire([
                            'beforeChange',
                            "beforeChange.".concat(prefix.join('.'))
                        ], key, value);
                        if ((0, is_plain_object_1.isPlainObject)(value)) {
                            initAccessors(value, prefix);
                        }
                        if (descriptor && descriptor.set) {
                            descriptor.set.call(obj, value);
                        }
                        else {
                            store[key] = value;
                        }
                        var sum_1 = [];
                        fire(tslib_1.__spreadArray([
                            'change'
                        ], tslib_1.__read(prefix.reduce(function (rs, p) {
                            sum_1.push(p);
                            rs.push("change.".concat(sum_1.join('.')));
                            return rs;
                        }, [])), false), prefix.join('.'), oldValue, (value === null || value === void 0 ? void 0 : value.valueOf)
                            ? value.valueOf()
                            : value);
                    }
                },
                get: function () {
                    if (descriptor && descriptor.get) {
                        return descriptor.get.call(obj);
                    }
                    return store[key];
                },
                enumerable: true,
                configurable: true
            });
            if ((0, is_plain_object_1.isPlainObject)(store[key])) {
                initAccessors(store[key], prefix);
            }
        });
        Object.defineProperty(obj, 'on', {
            value: on
        });
    };
    initAccessors(obj);
    return obj;
}
exports.observable = observable;


/***/ }),

/***/ 83611:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlersStore = exports.defaultNameSpace = void 0;
var assert_1 = __webpack_require__(52378);
var to_array_1 = __webpack_require__(1853);
exports.defaultNameSpace = 'JoditEventDefaultNamespace';
var EventHandlersStore = (function () {
    function EventHandlersStore() {
        this.__store = new Map();
    }
    EventHandlersStore.prototype.get = function (event, namespace) {
        if (this.__store.has(namespace)) {
            var ns = this.__store.get(namespace);
            void 0;
            return ns[event];
        }
    };
    EventHandlersStore.prototype.indexOf = function (event, namespace, originalCallback) {
        var blocks = this.get(event, namespace);
        if (blocks) {
            for (var i = 0; i < blocks.length; i += 1) {
                if (blocks[i].originalCallback === originalCallback) {
                    return i;
                }
            }
        }
        return false;
    };
    EventHandlersStore.prototype.namespaces = function (withoutDefault) {
        if (withoutDefault === void 0) { withoutDefault = false; }
        var nss = (0, to_array_1.toArray)(this.__store.keys());
        return withoutDefault ? nss.filter(function (ns) { return ns !== exports.defaultNameSpace; }) : nss;
    };
    EventHandlersStore.prototype.events = function (namespace) {
        var ns = this.__store.get(namespace);
        return ns ? Object.keys(ns) : [];
    };
    EventHandlersStore.prototype.set = function (event, namespace, data, onTop) {
        if (onTop === void 0) { onTop = false; }
        var ns = this.__store.get(namespace);
        if (!ns) {
            ns = {};
            this.__store.set(namespace, ns);
        }
        if (ns[event] === undefined) {
            ns[event] = [];
        }
        if (!onTop) {
            ns[event].push(data);
        }
        else {
            ns[event].unshift(data);
        }
    };
    EventHandlersStore.prototype.clear = function () {
        this.__store.clear();
    };
    EventHandlersStore.prototype.clearEvents = function (namespace, event) {
        var ns = this.__store.get(namespace);
        if (ns && ns[event]) {
            delete ns[event];
            if (!Object.keys(ns).length) {
                this.__store.delete(namespace);
            }
        }
    };
    EventHandlersStore.prototype.isEmpty = function () {
        return this.__store.size === 0;
    };
    return EventHandlersStore;
}());
exports.EventHandlersStore = EventHandlersStore;


/***/ }),

/***/ 14556:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitArray = void 0;
function splitArray(a) {
    return Array.isArray(a) ? a : a.split(/[,\s]+/);
}
exports.splitArray = splitArray;


/***/ }),

/***/ 1853:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toArray = void 0;
var reset_1 = __webpack_require__(80861);
var is_native_function_1 = __webpack_require__(28069);
exports.toArray = function toArray() {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var func = (0, is_native_function_1.isNativeFunction)(Array.from)
        ? Array.from
        : (_a = (0, reset_1.reset)('Array.from')) !== null && _a !== void 0 ? _a : Array.from;
    return func.apply(Array, args);
};


/***/ }),

/***/ 4696:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(27512), exports);


/***/ }),

/***/ 27512:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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

/***/ 49781:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isArray = void 0;
function isArray(elm) {
    return Array.isArray(elm);
}
exports.isArray = isArray;


/***/ }),

/***/ 32756:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFastEqual = exports.isEqual = void 0;
var stringify_1 = __webpack_require__(42554);
function isEqual(a, b) {
    return a === b || (0, stringify_1.stringify)(a) === (0, stringify_1.stringify)(b);
}
exports.isEqual = isEqual;
function isFastEqual(a, b) {
    return a === b;
}
exports.isFastEqual = isFastEqual;


/***/ }),

/***/ 42096:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFunction = void 0;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;


/***/ }),

/***/ 28069:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNativeFunction = void 0;
function isNativeFunction(f) {
    return (Boolean(f) &&
        (typeof f).toLowerCase() === 'function' &&
        (f === Function.prototype ||
            /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code]\s*}\s*$/i.test(String(f))));
}
exports.isNativeFunction = isNativeFunction;


/***/ }),

/***/ 61817:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNumber = void 0;
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
exports.isNumber = isNumber;


/***/ }),

/***/ 79736:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPlainObject = void 0;
var is_window_1 = __webpack_require__(85994);
function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object' || obj.nodeType || (0, is_window_1.isWindow)(obj)) {
        return false;
    }
    return !(obj.constructor &&
        !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'));
}
exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 26335:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPromise = void 0;
function isPromise(val) {
    return val && typeof val.then === 'function';
}
exports.isPromise = isPromise;


/***/ }),

/***/ 24421:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isStringArray = exports.isString = void 0;
var is_array_1 = __webpack_require__(49781);
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isStringArray(value) {
    return (0, is_array_1.isArray)(value) && isString(value[0]);
}
exports.isStringArray = isStringArray;


/***/ }),

/***/ 96574:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isViewObject = void 0;
var is_function_1 = __webpack_require__(42096);
function isViewObject(jodit) {
    return Boolean(jodit &&
        jodit instanceof Object &&
        (0, is_function_1.isFunction)(jodit.constructor) &&
        jodit.isView);
}
exports.isViewObject = isViewObject;


/***/ }),

/***/ 24021:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isVoid = void 0;
function isVoid(value) {
    return value === undefined || value === null;
}
exports.isVoid = isVoid;


/***/ }),

/***/ 85994:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isWindow = void 0;
function isWindow(obj) {
    return obj != null && obj === obj.window;
}
exports.isWindow = isWindow;


/***/ }),

/***/ 42554:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringify = void 0;
function stringify(value, options) {
    if (options === void 0) { options = {}; }
    if (typeof value !== 'object') {
        return String(value);
    }
    var excludeKeys = new Set(options.excludeKeys);
    var map = new WeakMap();
    var r = function (k, v) {
        if (excludeKeys.has(k)) {
            return;
        }
        if (typeof v === 'object' && v != null) {
            if (map.get(v)) {
                return '[refObject]';
            }
            map.set(v, true);
        }
        return v;
    };
    return JSON.stringify(value, r, options.prettify);
}
exports.stringify = stringify;


/***/ }),

/***/ 41579:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isAbort = exports.abort = exports.options = exports.connection = exports.error = void 0;
var errors_1 = __webpack_require__(45339);
function error(message) {
    return new TypeError(message);
}
exports.error = error;
function connection(message) {
    return new errors_1.ConnectionError(message);
}
exports.connection = connection;
function options(message) {
    return new errors_1.OptionsError(message);
}
exports.options = options;
function abort(message) {
    return new errors_1.AbortError(message);
}
exports.abort = abort;
function isAbort(error) {
    return error instanceof errors_1.AbortError;
}
exports.isAbort = isAbort;


/***/ }),

/***/ 86768:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbortError = void 0;
var tslib_1 = __webpack_require__(20255);
var AbortError = (function (_super) {
    tslib_1.__extends(AbortError, _super);
    function AbortError(m) {
        var _this = _super.call(this, m) || this;
        Object.setPrototypeOf(_this, AbortError.prototype);
        return _this;
    }
    return AbortError;
}(Error));
exports.AbortError = AbortError;


/***/ }),

/***/ 43380:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionError = void 0;
var tslib_1 = __webpack_require__(20255);
var ConnectionError = (function (_super) {
    tslib_1.__extends(ConnectionError, _super);
    function ConnectionError(m) {
        var _this = _super.call(this, m) || this;
        Object.setPrototypeOf(_this, ConnectionError.prototype);
        return _this;
    }
    return ConnectionError;
}(Error));
exports.ConnectionError = ConnectionError;


/***/ }),

/***/ 45339:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(86768), exports);
tslib_1.__exportStar(__webpack_require__(43380), exports);
tslib_1.__exportStar(__webpack_require__(47403), exports);


/***/ }),

/***/ 47403:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OptionsError = void 0;
var tslib_1 = __webpack_require__(20255);
var OptionsError = (function (_super) {
    tslib_1.__extends(OptionsError, _super);
    function OptionsError(m) {
        var _this = _super.call(this, m) || this;
        Object.setPrototypeOf(_this, OptionsError.prototype);
        return _this;
    }
    return OptionsError;
}(TypeError));
exports.OptionsError = OptionsError;


/***/ }),

/***/ 56964:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(41579), exports);
tslib_1.__exportStar(__webpack_require__(45339), exports);


/***/ }),

/***/ 69384:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.get = void 0;
var tslib_1 = __webpack_require__(20255);
var is_string_1 = __webpack_require__(24421);
var is_void_1 = __webpack_require__(24021);
function get(chain, obj) {
    var e_1, _a;
    if (!(0, is_string_1.isString)(chain) || !chain.length) {
        return null;
    }
    var parts = chain.split('.');
    var result = obj;
    try {
        try {
            for (var parts_1 = tslib_1.__values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                var part = parts_1_1.value;
                if ((0, is_void_1.isVoid)(result[part])) {
                    return null;
                }
                result = result[part];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (_b) {
        return null;
    }
    if ((0, is_void_1.isVoid)(result)) {
        return null;
    }
    return result;
}
exports.get = get;


/***/ }),

/***/ 80861:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reset = void 0;
var get_1 = __webpack_require__(69384);
var is_function_1 = __webpack_require__(42096);
var map = {};
var reset = function (key) {
    var _a, _b;
    if (!(key in map)) {
        var iframe = document.createElement('iframe');
        try {
            iframe.src = 'about:blank';
            document.body.appendChild(iframe);
            if (!iframe.contentWindow) {
                return null;
            }
            var func = (0, get_1.get)(key, iframe.contentWindow), bind = (0, get_1.get)(key.split('.').slice(0, -1).join('.'), iframe.contentWindow);
            if ((0, is_function_1.isFunction)(func)) {
                map[key] = func.bind(bind);
            }
        }
        catch (e) {
            if (false) {}
        }
        finally {
            (_a = iframe.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(iframe);
        }
    }
    return (_b = map[key]) !== null && _b !== void 0 ? _b : null;
};
exports.reset = reset;


/***/ }),

/***/ 93629:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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

/***/ 18510:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(20255);
tslib_1.__exportStar(__webpack_require__(89222), exports);
tslib_1.__exportStar(__webpack_require__(2123), exports);
tslib_1.__exportStar(__webpack_require__(67122), exports);


/***/ }),

/***/ 89222:
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2123:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VDomRender = void 0;
var tslib_1 = __webpack_require__(20255);
var helpers_1 = __webpack_require__(93629);
var async_1 = __webpack_require__(22630);
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
            fiber.dom.isConnected && domParent.removeChild(fiber.dom);
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
        return (0, helpers_1.domToVDom)(box);
    };
    VDomRender = tslib_1.__decorate([
        autobind_decorator_1.default
    ], VDomRender);
    return VDomRender;
}());
exports.VDomRender = VDomRender;


/***/ }),

/***/ 67122:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.insertChar = exports.VDomJodit = void 0;
var tslib_1 = __webpack_require__(20255);
__webpack_require__(8058);
var render_1 = __webpack_require__(2123);
var event_emitter_1 = __webpack_require__(55395);
var VDomJodit = (function () {
    function VDomJodit(elm) {
        var _this = this;
        var _a;
        this.render = new render_1.VDomRender();
        this.render2 = new render_1.VDomRender();
        this.event = new event_emitter_1.EventEmitter();
        this.container = document.createElement('div');
        this.editor = document.createElement('div');
        this.mirror = document.createElement('div');
        this.astMirror = document.createElement('pre');
        elm.style.display = 'none';
        (_a = elm.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.container, elm);
        this.editor.setAttribute('contenteditable', 'true');
        this.container.classList.add('jodit-v-dom-container');
        this.editor.classList.add('jodit-v-dom-editor');
        this.astMirror.classList.add('jodit-v-dom-ast-mirror');
        this.container.appendChild(this.editor);
        this.container.appendChild(this.astMirror);
        this.container.appendChild(this.mirror);
        this.value = elm.value;
        this.event.on(document, 'selectionchange', function () {
            console.log(111);
        });
        document.execCommand('defaultParagraphSeparator', false, 'p');
        var config = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        };
        var callback = function (mutationList) {
            var e_1, _a;
            try {
                for (var mutationList_1 = tslib_1.__values(mutationList), mutationList_1_1 = mutationList_1.next(); !mutationList_1_1.done; mutationList_1_1 = mutationList_1.next()) {
                    var mutation = mutationList_1_1.value;
                    console.log(mutation);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (mutationList_1_1 && !mutationList_1_1.done && (_a = mutationList_1.return)) _a.call(mutationList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var vdom = _this.render2.htmlToVDom(_this.editor.innerHTML);
            _this.astMirror.textContent = JSON.stringify(vdom, null, ' ');
            _this.render2.render(vdom, _this.mirror);
        };
        var observer = new MutationObserver(callback);
        observer.observe(this.editor, config);
        this.preventAllInputEvents();
    }
    Object.defineProperty(VDomJodit.prototype, "value", {
        set: function (v) {
            this.vdom = this.render.htmlToVDom(v);
            this.render.render(this.vdom, this.editor);
        },
        enumerable: false,
        configurable: true
    });
    VDomJodit.make = function (elm) {
        return new VDomJodit(elm);
    };
    VDomJodit.prototype.preventAllInputEvents = function () {
        this.container.addEventListener('keydown', function (e) {
        });
    };
    return VDomJodit;
}());
exports.VDomJodit = VDomJodit;
var vdom = {
    type: 'div',
    props: {
        children: [
            {
                type: 'h1',
                props: {
                    style: { color: '#f00' },
                    children: [
                        {
                            type: 'TEXT_ELEMENT',
                            props: {
                                nodeValue: 'This is a title'
                            }
                        }
                    ]
                }
            },
            {
                type: 'p',
                props: {
                    className: 'test',
                    children: [
                        {
                            type: 'TEXT_ELEMENT',
                            props: {
                                nodeValue: 'This is a paragraph'
                            }
                        }
                    ]
                }
            }
        ]
    }
};
var state = {
    cursor: {
        startContainer: vdom.props.children[0].props.children[0],
        startOffset: 0
    },
    vdom: vdom
};
function insertChar(char) {
    var _a = state.cursor, startContainer = _a.startContainer, startOffset = _a.startOffset;
    var text = startContainer.props.nodeValue;
    var before = text.slice(0, startOffset);
    var after = text.slice(startOffset);
    startContainer.props.nodeValue = before + char + after;
    state.cursor.startOffset += 1;
}
exports.insertChar = insertChar;


/***/ }),

/***/ 52378:
/***/ (function(module) {

module.exports = {assert(){}};;

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
/******/ 	var __webpack_exports__ = __webpack_require__(18510);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});