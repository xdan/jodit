/*!
 * jodit - Jodit is awesome and usefully wysiwyg editor with filebrowser
 * Author: Chupurnov <chupurnov@gmail.com> (https://xdsoft.net/)
 * Version: v3.14.3
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
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(2), exports);
(0, tslib_1.__exportStar)(__webpack_require__(3), exports);


/***/ }),
/* 1 */
/***/ (function(__unused_webpack_module, exports) {


/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.__classPrivateFieldSet = exports.__classPrivateFieldGet = exports.__importDefault = exports.__importStar = exports.__makeTemplateObject = exports.__asyncValues = exports.__asyncDelegator = exports.__asyncGenerator = exports.__await = exports.__spreadArray = exports.__spreadArrays = exports.__spread = exports.__read = exports.__values = exports.__exportStar = exports.__createBinding = exports.__generator = exports.__awaiter = exports.__metadata = exports.__param = exports.__decorate = exports.__rest = exports.__assign = exports.__extends = void 0;
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
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
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


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VDomRender = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(4);
var async_1 = __webpack_require__(180);
var autobind_decorator_1 = __webpack_require__(57);
var isProperty = function (key) { return key !== 'children'; };
var isNew = function (prev, next) { return function (key) {
    return prev[key] !== next[key];
}; };
var isGone = function (prev, next) { return function (key) {
    return !(key in next);
}; };
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
    VDomRender = (0, tslib_1.__decorate)([
        autobind_decorator_1.default
    ], VDomRender);
    return VDomRender;
}());
exports.VDomRender = VDomRender;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.domToVDom = exports.attrsToDict = void 0;
var tslib_1 = __webpack_require__(1);
var to_array_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(32);
function attrsToDict(elm) {
    var _a, _b;
    var result = {};
    if (elm.nodeName === 'SCRIPT') {
        result.textContent = (_a = elm.textContent) !== null && _a !== void 0 ? _a : '';
    }
    if (elm.nodeType === Node.TEXT_NODE) {
        result.nodeValue = (_b = elm.nodeValue) !== null && _b !== void 0 ? _b : '';
    }
    if (dom_1.Dom.isElement(elm)) {
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
        props: (0, tslib_1.__assign)({ children: (0, to_array_1.toArray)(elm.childNodes).map(function (n) { return domToVDom(n, noNode); }) }, attrsToDict(elm))
    };
}
exports.domToVDom = domToVDom;


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toArray = void 0;
var utils_1 = __webpack_require__(6);
var is_native_function_1 = __webpack_require__(84);
exports.toArray = function toArray() {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var func = (0, is_native_function_1.isNativeFunction)(Array.from)
        ? Array.from
        : (_a = (0, utils_1.reset)('Array.from')) !== null && _a !== void 0 ? _a : Array.from;
    return func.apply(Array, args);
};


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.memorizeExec = exports.keys = exports.loadImage = exports.reset = exports.callPromise = exports.markOwner = exports.attr = exports.call = void 0;
var tslib_1 = __webpack_require__(1);
var is_function_1 = __webpack_require__(7);
var is_promise_1 = __webpack_require__(8);
var get_1 = __webpack_require__(9);
var data_bind_1 = __webpack_require__(12);
var is_void_1 = __webpack_require__(11);
var checker_1 = __webpack_require__(23);
var css_1 = __webpack_require__(99);
var string_1 = __webpack_require__(59);
function call(func) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return func.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false));
}
exports.call = call;
function attr(elm, keyOrAttributes, value) {
    if (!elm || !(0, is_function_1.isFunction)(elm.getAttribute)) {
        return null;
    }
    if (!(0, checker_1.isString)(keyOrAttributes)) {
        Object.keys(keyOrAttributes).forEach(function (key) {
            var value = keyOrAttributes[key];
            if ((0, checker_1.isPlainObject)(value) && key === 'style') {
                (0, css_1.css)(elm, value);
            }
            else {
                if (key === 'className') {
                    key = 'class';
                }
                attr(elm, key, value);
            }
        });
        return null;
    }
    var key = (0, string_1.CamelCaseToKebabCase)(keyOrAttributes);
    if (/^-/.test(key)) {
        var res = attr(elm, "data".concat(key));
        if (res) {
            return res;
        }
        key = key.substr(1);
    }
    if (value !== undefined) {
        if (value == null) {
            elm.hasAttribute(key) && elm.removeAttribute(key);
        }
        else {
            elm.setAttribute(key, value.toString());
            return value.toString();
        }
    }
    return elm.getAttribute(key);
}
exports.attr = attr;
function markOwner(jodit, elm) {
    attr(elm, 'data-editor_id', jodit.id);
    !elm.component &&
        Object.defineProperty(elm, 'jodit', {
            value: jodit
        });
}
exports.markOwner = markOwner;
function callPromise(condition, callback) {
    if ((0, is_promise_1.isPromise)(condition)) {
        return condition.finally(callback);
    }
    return callback();
}
exports.callPromise = callPromise;
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
var loadImage = function (src, jodit) {
    return jodit.async.promise(function (res, rej) {
        var image = new Image(), onError = function () {
            jodit.e.off(image);
            rej === null || rej === void 0 ? void 0 : rej();
        }, onSuccess = function () {
            jodit.e.off(image);
            res(image);
        };
        jodit.e
            .one(image, 'load', onSuccess)
            .one(image, 'error', onError)
            .one(image, 'abort', onError);
        image.src = src;
        if (image.complete) {
            onSuccess();
        }
    });
};
exports.loadImage = loadImage;
var keys = function (obj, own) {
    if (own === void 0) { own = true; }
    if (own) {
        return Object.keys(obj);
    }
    var props = [];
    for (var key in obj) {
        props.push(key);
    }
    return props;
};
exports.keys = keys;
var memorizeExec = function (editor, _, _a, preProcessValue) {
    var control = _a.control;
    var key = "button".concat(control.command);
    var value = (control.args && control.args[0]) || (0, data_bind_1.dataBind)(editor, key);
    if ((0, is_void_1.isVoid)(value)) {
        return false;
    }
    (0, data_bind_1.dataBind)(editor, key, value);
    if (preProcessValue) {
        value = preProcessValue(value);
    }
    editor.execCommand(control.command, false, value || undefined);
};
exports.memorizeExec = memorizeExec;


/***/ }),
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.get = void 0;
var tslib_1 = __webpack_require__(1);
var is_string_1 = __webpack_require__(10);
var is_void_1 = __webpack_require__(11);
function get(chain, obj) {
    var e_1, _a;
    if (!(0, is_string_1.isString)(chain) || !chain.length) {
        return null;
    }
    var parts = chain.split('.');
    var result = obj;
    try {
        try {
            for (var parts_1 = (0, tslib_1.__values)(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
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
/* 10 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isString = void 0;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isVoid = void 0;
function isVoid(value) {
    return value === undefined || value === null;
}
exports.isVoid = isVoid;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dataBind = void 0;
var component_1 = __webpack_require__(13);
var checker_1 = __webpack_require__(23);
var store = new WeakMap();
var dataBind = function (elm, key, value) {
    var itemStore = store.get(elm);
    if (!itemStore) {
        itemStore = {};
        store.set(elm, itemStore);
        var e = null;
        if (elm instanceof component_1.ViewComponent) {
            e = elm.j.e;
        }
        if ((0, checker_1.isViewObject)(elm)) {
            e = elm.e;
        }
        e &&
            e.on('beforeDestruct', function () {
                store.delete(elm);
            });
    }
    if (value === undefined) {
        return itemStore[key];
    }
    itemStore[key] = value;
    return value;
};
exports.dataBind = dataBind;


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(14), exports);
(0, tslib_1.__exportStar)(__webpack_require__(15), exports);
(0, tslib_1.__exportStar)(__webpack_require__(179), exports);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Component = void 0;
var helpers_1 = __webpack_require__(16);
var global_1 = __webpack_require__(39);
var statuses_1 = __webpack_require__(14);
var StatusListHandlers = new Map();
var Component = (function () {
    function Component() {
        this.ownerWindow = window;
        this.__componentStatus = statuses_1.STATUSES.beforeInit;
        this.uid = 'jodit-uid-' + (0, global_1.uniqueUid)();
    }
    Object.defineProperty(Component.prototype, "componentName", {
        get: function () {
            if (!this.__componentName) {
                this.__componentName =
                    'jodit-' +
                        (0, helpers_1.kebabCase)(((0, helpers_1.isFunction)(this.className) ? this.className() : '') ||
                            (0, helpers_1.getClassName)(this));
            }
            return this.__componentName;
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.getFullElName = function (elementName, mod, modValue) {
        var result = [this.componentName];
        if (elementName) {
            elementName = elementName.replace(/[^a-z0-9-]/gi, '-');
            result.push("__".concat(elementName));
        }
        if (mod) {
            result.push('_', mod);
            result.push('_', (0, helpers_1.isVoid)(modValue) ? 'true' : modValue.toString());
        }
        return result.join('');
    };
    Object.defineProperty(Component.prototype, "ownerDocument", {
        get: function () {
            return this.ow.document;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "od", {
        get: function () {
            return this.ownerDocument;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "ow", {
        get: function () {
            return this.ownerWindow;
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.get = function (chain, obj) {
        return (0, helpers_1.get)(chain, obj || this);
    };
    Object.defineProperty(Component.prototype, "isReady", {
        get: function () {
            return this.componentStatus === statuses_1.STATUSES.ready;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "isDestructed", {
        get: function () {
            return this.componentStatus === statuses_1.STATUSES.destructed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "isInDestruct", {
        get: function () {
            return (statuses_1.STATUSES.beforeDestruct === this.componentStatus ||
                statuses_1.STATUSES.destructed === this.componentStatus);
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.bindDestruct = function (component) {
        var _this = this;
        component.hookStatus(statuses_1.STATUSES.beforeDestruct, function () { return !_this.isInDestruct && _this.destruct(); });
        return this;
    };
    Component.prototype.destruct = function () {
        this.setStatus(statuses_1.STATUSES.destructed);
        if (StatusListHandlers.get(this)) {
            StatusListHandlers.delete(this);
        }
    };
    Object.defineProperty(Component.prototype, "componentStatus", {
        get: function () {
            return this.__componentStatus;
        },
        set: function (componentStatus) {
            this.setStatus(componentStatus);
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.setStatus = function (componentStatus) {
        return this.setStatusComponent(componentStatus, this);
    };
    Component.prototype.setStatusComponent = function (componentStatus, component) {
        if (componentStatus === this.__componentStatus) {
            return;
        }
        var proto = Object.getPrototypeOf(this);
        if (proto && (0, helpers_1.isFunction)(proto.setStatusComponent)) {
            proto.setStatusComponent(componentStatus, component);
        }
        var statuses = StatusListHandlers.get(this), list = statuses === null || statuses === void 0 ? void 0 : statuses[componentStatus];
        if (list && list.length) {
            list.forEach(function (cb) { return cb(component); });
        }
        if (component === this) {
            this.__componentStatus = componentStatus;
        }
    };
    Component.prototype.hookStatus = function (status, callback) {
        var list = StatusListHandlers.get(this);
        if (!list) {
            list = {};
            StatusListHandlers.set(this, list);
        }
        if (!list[status]) {
            list[status] = [];
        }
        list[status].push(callback);
    };
    Component.STATUSES = statuses_1.STATUSES;
    return Component;
}());
exports.Component = Component;


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(17), exports);
(0, tslib_1.__exportStar)(__webpack_require__(117), exports);
(0, tslib_1.__exportStar)(__webpack_require__(164), exports);
(0, tslib_1.__exportStar)(__webpack_require__(23), exports);
(0, tslib_1.__exportStar)(__webpack_require__(109), exports);
(0, tslib_1.__exportStar)(__webpack_require__(166), exports);
(0, tslib_1.__exportStar)(__webpack_require__(100), exports);
(0, tslib_1.__exportStar)(__webpack_require__(172), exports);
(0, tslib_1.__exportStar)(__webpack_require__(59), exports);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(18), exports);
(0, tslib_1.__exportStar)(__webpack_require__(19), exports);
(0, tslib_1.__exportStar)(__webpack_require__(6), exports);
(0, tslib_1.__exportStar)(__webpack_require__(9), exports);
(0, tslib_1.__exportStar)(__webpack_require__(20), exports);
(0, tslib_1.__exportStar)(__webpack_require__(58), exports);
(0, tslib_1.__exportStar)(__webpack_require__(90), exports);
(0, tslib_1.__exportStar)(__webpack_require__(91), exports);
(0, tslib_1.__exportStar)(__webpack_require__(93), exports);
(0, tslib_1.__exportStar)(__webpack_require__(94), exports);
(0, tslib_1.__exportStar)(__webpack_require__(92), exports);
(0, tslib_1.__exportStar)(__webpack_require__(95), exports);
(0, tslib_1.__exportStar)(__webpack_require__(97), exports);
(0, tslib_1.__exportStar)(__webpack_require__(99), exports);
(0, tslib_1.__exportStar)(__webpack_require__(112), exports);
(0, tslib_1.__exportStar)(__webpack_require__(12), exports);
(0, tslib_1.__exportStar)(__webpack_require__(113), exports);
(0, tslib_1.__exportStar)(__webpack_require__(96), exports);
(0, tslib_1.__exportStar)(__webpack_require__(114), exports);
(0, tslib_1.__exportStar)(__webpack_require__(98), exports);
(0, tslib_1.__exportStar)(__webpack_require__(115), exports);
(0, tslib_1.__exportStar)(__webpack_require__(116), exports);
(0, tslib_1.__exportStar)(__webpack_require__(44), exports);
(0, tslib_1.__exportStar)(__webpack_require__(163), exports);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assert = void 0;
var tslib_1 = __webpack_require__(1);
var AssertionError = (function (_super) {
    (0, tslib_1.__extends)(AssertionError, _super);
    function AssertionError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'AssertionError';
        return _this;
    }
    return AssertionError;
}(Error));
function assert(condition, message) {
    if (!condition) {
        throw new AssertionError("Assertion failed: ".concat(message));
    }
}
exports.assert = assert;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.markDeprecated = exports.cns = void 0;
var tslib_1 = __webpack_require__(1);
exports.cns = console;
function markDeprecated(method, names, ctx) {
    if (names === void 0) { names = ['']; }
    if (ctx === void 0) { ctx = null; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        exports.cns.warn("Method \"".concat(names[0], "\" deprecated.") +
            (names[1] ? " Use \"".concat(names[1], "\" instead") : ''));
        return method.call.apply(method, (0, tslib_1.__spreadArray)([ctx], (0, tslib_1.__read)(args), false));
    };
}
exports.markDeprecated = markDeprecated;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.set = void 0;
var is_string_1 = __webpack_require__(10);
var is_numeric_1 = __webpack_require__(21);
var is_array_1 = __webpack_require__(22);
var checker_1 = __webpack_require__(23);
function set(chain, value, obj) {
    if (!(0, is_string_1.isString)(chain) || !chain.length) {
        return;
    }
    var parts = chain.split('.');
    var result = obj, key = parts[0];
    for (var i = 0; i < parts.length - 1; i += 1) {
        key = parts[i];
        if (!(0, is_array_1.isArray)(result[key]) && !(0, checker_1.isPlainObject)(result[key])) {
            result[key] = (0, is_numeric_1.isNumeric)(parts[i + 1]) ? [] : {};
        }
        result = result[key];
    }
    if (result) {
        result[parts[parts.length - 1]] = value;
    }
}
exports.set = set;


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNumeric = void 0;
var is_string_1 = __webpack_require__(10);
function isNumeric(value) {
    if ((0, is_string_1.isString)(value)) {
        if (!value.match(/^([+-])?[0-9]+(\.?)([0-9]+)?(e[0-9]+)?$/)) {
            return false;
        }
        value = parseFloat(value);
    }
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
exports.isNumeric = isNumeric;


/***/ }),
/* 22 */
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
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(24), exports);
(0, tslib_1.__exportStar)(__webpack_require__(22), exports);
(0, tslib_1.__exportStar)(__webpack_require__(25), exports);
(0, tslib_1.__exportStar)(__webpack_require__(26), exports);
(0, tslib_1.__exportStar)(__webpack_require__(7), exports);
(0, tslib_1.__exportStar)(__webpack_require__(28), exports);
(0, tslib_1.__exportStar)(__webpack_require__(29), exports);
(0, tslib_1.__exportStar)(__webpack_require__(30), exports);
(0, tslib_1.__exportStar)(__webpack_require__(81), exports);
(0, tslib_1.__exportStar)(__webpack_require__(82), exports);
(0, tslib_1.__exportStar)(__webpack_require__(83), exports);
(0, tslib_1.__exportStar)(__webpack_require__(84), exports);
(0, tslib_1.__exportStar)(__webpack_require__(85), exports);
(0, tslib_1.__exportStar)(__webpack_require__(21), exports);
(0, tslib_1.__exportStar)(__webpack_require__(86), exports);
(0, tslib_1.__exportStar)(__webpack_require__(8), exports);
(0, tslib_1.__exportStar)(__webpack_require__(10), exports);
(0, tslib_1.__exportStar)(__webpack_require__(88), exports);
(0, tslib_1.__exportStar)(__webpack_require__(89), exports);
(0, tslib_1.__exportStar)(__webpack_require__(11), exports);
(0, tslib_1.__exportStar)(__webpack_require__(87), exports);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasBrowserColorPicker = void 0;
function hasBrowserColorPicker() {
    var supportsColor = true;
    try {
        var a = document.createElement('input');
        a.type = 'color';
        supportsColor =
            a.type === 'color' && typeof a.selectionStart !== 'number';
    }
    catch (e) {
        supportsColor = false;
    }
    return supportsColor;
}
exports.hasBrowserColorPicker = hasBrowserColorPicker;


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isBoolean = void 0;
function isBoolean(elm) {
    return typeof elm === 'boolean';
}
exports.isBoolean = isBoolean;


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFastEqual = exports.isEqual = void 0;
var stringify_1 = __webpack_require__(27);
function isEqual(a, b) {
    return a === b || (0, stringify_1.stringify)(a) === (0, stringify_1.stringify)(b);
}
exports.isEqual = isEqual;
function isFastEqual(a, b) {
    return a === b;
}
exports.isFastEqual = isFastEqual;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isHTML = void 0;
var is_string_1 = __webpack_require__(10);
var isHTML = function (str) {
    return (0, is_string_1.isString)(str) &&
        /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/m.test(str.replace(/[\r\n]/g, ''));
};
exports.isHTML = isHTML;


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isHtmlFromWord = void 0;
function isHtmlFromWord(data) {
    return (data.search(/<meta.*?Microsoft Excel\s[\d].*?>/) !== -1 ||
        data.search(/<meta.*?Microsoft Word\s[\d].*?>/) !== -1 ||
        (data.search(/style="[^"]*mso-/) !== -1 && data.search(/<font/) !== -1));
}
exports.isHtmlFromWord = isHtmlFromWord;


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasContainer = exports.isDestructable = exports.isInitable = void 0;
var is_function_1 = __webpack_require__(7);
var dom_1 = __webpack_require__(31);
var is_void_1 = __webpack_require__(11);
function isInitable(value) {
    return !(0, is_void_1.isVoid)(value) && (0, is_function_1.isFunction)(value.init);
}
exports.isInitable = isInitable;
function isDestructable(value) {
    return !(0, is_void_1.isVoid)(value) && (0, is_function_1.isFunction)(value.destruct);
}
exports.isDestructable = isDestructable;
function hasContainer(value) {
    return !(0, is_void_1.isVoid)(value) && dom_1.Dom.isElement(value.container);
}
exports.hasContainer = hasContainer;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(32), exports);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dom = void 0;
var tslib_1 = __webpack_require__(1);
var consts = __webpack_require__(33);
var helpers_1 = __webpack_require__(16);
var selection_1 = __webpack_require__(34);
var constants_1 = __webpack_require__(33);
var Dom = (function () {
    function Dom() {
    }
    Dom.detach = function (node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };
    Dom.wrapInline = function (current, tag, editor) {
        var tmp, first = current, last = current;
        editor.s.save();
        var needFindNext = false;
        do {
            needFindNext = false;
            tmp = first.previousSibling;
            if (tmp && !Dom.isBlock(tmp)) {
                needFindNext = true;
                first = tmp;
            }
        } while (needFindNext);
        do {
            needFindNext = false;
            tmp = last.nextSibling;
            if (tmp && !Dom.isBlock(tmp)) {
                needFindNext = true;
                last = tmp;
            }
        } while (needFindNext);
        var wrapper = (0, helpers_1.isString)(tag) ? editor.createInside.element(tag) : tag;
        if (first.parentNode) {
            first.parentNode.insertBefore(wrapper, first);
        }
        var next = first;
        while (next) {
            next = first.nextSibling;
            wrapper.appendChild(first);
            if (first === last || !next) {
                break;
            }
            first = next;
        }
        editor.s.restore();
        return wrapper;
    };
    Dom.wrap = function (current, tag, create) {
        var wrapper = (0, helpers_1.isString)(tag) ? create.element(tag) : tag;
        if (!current.parentNode) {
            throw (0, helpers_1.error)('Element should be in DOM');
        }
        current.parentNode.insertBefore(wrapper, current);
        wrapper.appendChild(current);
        return wrapper;
    };
    Dom.unwrap = function (node) {
        var parent = node.parentNode;
        if (parent) {
            while (node.firstChild) {
                parent.insertBefore(node.firstChild, node);
            }
            Dom.safeRemove(node);
        }
    };
    Dom.between = function (start, end, callback) {
        var next = start;
        while (next && next !== end) {
            if (start !== next && callback(next)) {
                break;
            }
            var step = next.firstChild || next.nextSibling;
            if (!step) {
                while (next && !next.nextSibling) {
                    next = next.parentNode;
                }
                step = next === null || next === void 0 ? void 0 : next.nextSibling;
            }
            next = step;
        }
    };
    Dom.replace = function (elm, newTagName, create, withAttributes, notMoveContent) {
        if (withAttributes === void 0) { withAttributes = false; }
        if (notMoveContent === void 0) { notMoveContent = false; }
        if ((0, helpers_1.isHTML)(newTagName)) {
            newTagName = create.fromHTML(newTagName);
        }
        var tag = (0, helpers_1.isString)(newTagName)
            ? create.element(newTagName)
            : newTagName;
        if (!notMoveContent) {
            while (elm.firstChild) {
                tag.appendChild(elm.firstChild);
            }
        }
        if (withAttributes) {
            (0, helpers_1.toArray)(elm.attributes).forEach(function (attr) {
                tag.setAttribute(attr.name, attr.value);
            });
        }
        if (elm.parentNode) {
            elm.parentNode.replaceChild(tag, elm);
        }
        return tag;
    };
    Dom.isEmptyTextNode = function (node) {
        return (Dom.isText(node) &&
            (!node.nodeValue ||
                node.nodeValue
                    .replace(consts.INVISIBLE_SPACE_REG_EXP(), '')
                    .trim().length === 0));
    };
    Dom.isEmptyContent = function (node) {
        return Dom.each(node, function (elm) {
            return Dom.isEmptyTextNode(elm);
        });
    };
    Dom.isContentEditable = function (node, root) {
        return (Dom.isNode(node) &&
            !Dom.closest(node, function (elm) {
                return Dom.isElement(elm) &&
                    elm.getAttribute('contenteditable') === 'false';
            }, root));
    };
    Dom.isEmpty = function (node, condNoEmptyElement) {
        if (condNoEmptyElement === void 0) { condNoEmptyElement = /^(img|svg|canvas|input|textarea|form)$/; }
        if (!node) {
            return true;
        }
        if (Dom.isText(node)) {
            return node.nodeValue == null || (0, helpers_1.trim)(node.nodeValue).length === 0;
        }
        return (!condNoEmptyElement.test(node.nodeName.toLowerCase()) &&
            Dom.each(node, function (elm) {
                if ((Dom.isText(elm) &&
                    elm.nodeValue != null &&
                    (0, helpers_1.trim)(elm.nodeValue).length !== 0) ||
                    (Dom.isElement(elm) &&
                        condNoEmptyElement.test(elm.nodeName.toLowerCase()))) {
                    return false;
                }
            }));
    };
    Dom.isNode = function (object) {
        if (!object) {
            return false;
        }
        var win = (0, helpers_1.get)('ownerDocument.defaultView', object);
        if (typeof win === 'object' &&
            win &&
            (typeof win.Node === 'function' ||
                typeof win.Node === 'object')) {
            return object instanceof win.Node;
        }
        return false;
    };
    Dom.isCell = function (elm) {
        return Dom.isNode(elm) && /^(td|th)$/i.test(elm.nodeName);
    };
    Dom.isImage = function (elm) {
        return (Dom.isNode(elm) && /^(img|svg|picture|canvas)$/i.test(elm.nodeName));
    };
    Dom.isBlock = function (node) {
        return (!(0, helpers_1.isVoid)(node) &&
            typeof node === 'object' &&
            Dom.isNode(node) &&
            consts.IS_BLOCK.test(node.nodeName));
    };
    Dom.isText = function (node) {
        return Boolean(node && node.nodeType === Node.TEXT_NODE);
    };
    Dom.isElement = function (node) {
        var _a;
        if (!Dom.isNode(node)) {
            return false;
        }
        var win = (_a = node.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
        return Boolean(win && node.nodeType === Node.ELEMENT_NODE);
    };
    Dom.isHTMLElement = function (node) {
        var _a;
        if (!Dom.isNode(node)) {
            return false;
        }
        var win = (_a = node.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
        return Boolean(win && node instanceof win.HTMLElement);
    };
    Dom.isInlineBlock = function (node) {
        return (Dom.isElement(node) &&
            !/^(BR|HR)$/i.test(node.tagName) &&
            ['inline', 'inline-block'].indexOf((0, helpers_1.css)(node, 'display').toString()) !== -1);
    };
    Dom.canSplitBlock = function (node) {
        return (!(0, helpers_1.isVoid)(node) &&
            Dom.isHTMLElement(node) &&
            Dom.isBlock(node) &&
            !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) &&
            node.style !== undefined &&
            !/^(fixed|absolute)/i.test(node.style.position));
    };
    Dom.last = function (root, condition) {
        var last = root === null || root === void 0 ? void 0 : root.lastChild;
        if (!last) {
            return null;
        }
        do {
            if (condition(last)) {
                return last;
            }
            var next = last.lastChild;
            if (!next) {
                next = last.previousSibling;
            }
            if (!next && last.parentNode !== root) {
                do {
                    last = last.parentNode;
                } while (last &&
                    !(last === null || last === void 0 ? void 0 : last.previousSibling) &&
                    last.parentNode !== root);
                next = last === null || last === void 0 ? void 0 : last.previousSibling;
            }
            last = next;
        } while (last);
        return null;
    };
    Dom.prev = function (node, condition, root, withChild) {
        if (withChild === void 0) { withChild = true; }
        return Dom.find(node, condition, root, false, withChild);
    };
    Dom.next = function (node, condition, root, withChild) {
        if (withChild === void 0) { withChild = true; }
        return Dom.find(node, condition, root, true, withChild);
    };
    Dom.prevWithClass = function (node, className) {
        return Dom.prev(node, function (node) {
            return (Dom.isElement(node) && node.classList.contains(className));
        }, node.parentNode);
    };
    Dom.nextWithClass = function (node, className) {
        return Dom.next(node, function (elm) { return Dom.isElement(elm) && elm.classList.contains(className); }, node.parentNode);
    };
    Dom.find = function (node, condition, root, leftToRight, withChild) {
        if (leftToRight === void 0) { leftToRight = true; }
        if (withChild === void 0) { withChild = true; }
        var gen = this.nextGen(node, root, leftToRight, withChild);
        var item = gen.next();
        while (!item.done) {
            if (condition(item.value)) {
                return item.value;
            }
            item = gen.next();
        }
        return null;
    };
    Dom.nextGen = function (start, root, leftToRight, withChild) {
        var stack, currentNode, next;
        if (leftToRight === void 0) { leftToRight = true; }
        if (withChild === void 0) { withChild = true; }
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stack = [];
                    currentNode = start;
                    _a.label = 1;
                case 1:
                    next = leftToRight
                        ? currentNode.nextSibling
                        : currentNode.previousSibling;
                    while (next) {
                        stack.unshift(next);
                        next = leftToRight ? next.nextSibling : next.previousSibling;
                    }
                    return [5, (0, tslib_1.__values)(this.runInStack(start, stack, leftToRight, withChild))];
                case 2:
                    _a.sent();
                    currentNode = currentNode.parentNode;
                    _a.label = 3;
                case 3:
                    if (currentNode !== root) return [3, 1];
                    _a.label = 4;
                case 4: return [2, null];
            }
        });
    };
    Dom.each = function (elm, callback, leftToRight) {
        if (leftToRight === void 0) { leftToRight = true; }
        var gen = this.eachGen(elm, leftToRight);
        var item = gen.next();
        while (!item.done) {
            if (callback(item.value) === false) {
                return false;
            }
            item = gen.next();
        }
        return true;
    };
    Dom.eachGen = function (root, leftToRight) {
        if (leftToRight === void 0) { leftToRight = true; }
        return this.runInStack(root, [root], leftToRight);
    };
    Dom.runInStack = function (start, stack, leftToRight, withChild) {
        var item, child;
        if (withChild === void 0) { withChild = true; }
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!stack.length) return [3, 3];
                    item = stack.pop();
                    if (!(start !== item)) return [3, 2];
                    return [4, item];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (withChild) {
                        child = leftToRight ? item.lastChild : item.firstChild;
                        while (child) {
                            stack.push(child);
                            child = leftToRight
                                ? child.previousSibling
                                : child.nextSibling;
                        }
                    }
                    return [3, 0];
                case 3: return [2];
            }
        });
    };
    Dom.findWithCurrent = function (node, condition, root, sibling, child) {
        if (sibling === void 0) { sibling = 'nextSibling'; }
        if (child === void 0) { child = 'firstChild'; }
        var next = node;
        do {
            if (condition(next)) {
                return next || null;
            }
            if (child && next && next[child]) {
                var nextOne = Dom.findWithCurrent(next[child], condition, next, sibling, child);
                if (nextOne) {
                    return nextOne;
                }
            }
            while (next && !next[sibling] && next !== root) {
                next = next.parentNode;
            }
            if (next && next[sibling] && next !== root) {
                next = next[sibling];
            }
        } while (next && next !== root);
        return null;
    };
    Dom.findSibling = function (node, left, cond) {
        if (left === void 0) { left = true; }
        if (cond === void 0) { cond = function (n) { return !Dom.isEmptyTextNode(n); }; }
        var getSibling = function (node) {
            return left ? node.previousSibling : node.nextSibling;
        };
        var start = getSibling(node);
        while (start && !cond(start)) {
            start = getSibling(start);
        }
        return start && cond(start) ? start : null;
    };
    Dom.up = function (node, condition, root, checkRoot) {
        if (checkRoot === void 0) { checkRoot = false; }
        var start = node;
        if (!start) {
            return null;
        }
        do {
            if (condition(start)) {
                return start;
            }
            if (start === root || !start.parentNode) {
                break;
            }
            start = start.parentNode;
        } while (start && start !== root);
        if (start === root && checkRoot && condition(start)) {
            return start;
        }
        return null;
    };
    Dom.closest = function (node, tagsOrCondition, root) {
        var condition;
        if ((0, helpers_1.isFunction)(tagsOrCondition)) {
            condition = tagsOrCondition;
        }
        else if ((0, helpers_1.isArray)(tagsOrCondition)) {
            condition = function (tag) {
                return tag &&
                    tagsOrCondition.includes(tag.nodeName.toLowerCase());
            };
        }
        else {
            condition = function (tag) {
                return tag && tagsOrCondition === tag.nodeName.toLowerCase();
            };
        }
        return Dom.up(node, condition, root);
    };
    Dom.furthest = function (node, condition, root) {
        var matchedParent = null, current = node === null || node === void 0 ? void 0 : node.parentElement;
        while (current && current !== root && condition(current)) {
            matchedParent = current;
            current = current === null || current === void 0 ? void 0 : current.parentElement;
        }
        return matchedParent;
    };
    Dom.appendChildFirst = function (root, newElement) {
        var child = root.firstChild;
        if (child) {
            if (child !== newElement) {
                root.insertBefore(newElement, child);
            }
        }
        else {
            root.appendChild(newElement);
        }
    };
    Dom.after = function (elm, newElement) {
        var parentNode = elm.parentNode;
        if (!parentNode) {
            return;
        }
        if (parentNode.lastChild === elm) {
            parentNode.appendChild(newElement);
        }
        else {
            parentNode.insertBefore(newElement, elm.nextSibling);
        }
    };
    Dom.before = function (elm, newElement) {
        var parentNode = elm.parentNode;
        if (!parentNode) {
            return;
        }
        parentNode.insertBefore(newElement, elm);
    };
    Dom.prepend = function (root, newElement) {
        root.insertBefore(newElement, root.firstChild);
    };
    Dom.append = function (root, newElement) {
        var _this = this;
        if ((0, helpers_1.isArray)(newElement)) {
            newElement.forEach(function (node) {
                _this.append(root, node);
            });
        }
        else {
            root.appendChild(newElement);
        }
    };
    Dom.moveContent = function (from, to, inStart) {
        if (inStart === void 0) { inStart = false; }
        var fragment = (from.ownerDocument || document).createDocumentFragment();
        (0, helpers_1.toArray)(from.childNodes).forEach(function (node) {
            fragment.appendChild(node);
        });
        if (!inStart || !to.firstChild) {
            to.appendChild(fragment);
        }
        else {
            to.insertBefore(fragment, to.firstChild);
        }
    };
    Dom.all = function (node, condition, prev) {
        if (prev === void 0) { prev = false; }
        var nodes = node.childNodes ? (0, helpers_1.toArray)(node.childNodes) : [];
        if (condition(node)) {
            return node;
        }
        if (prev) {
            nodes = nodes.reverse();
        }
        nodes.forEach(function (child) {
            Dom.all(child, condition, prev);
        });
        return null;
    };
    Dom.isOrContains = function (root, child, onlyContains) {
        if (onlyContains === void 0) { onlyContains = false; }
        if (root === child) {
            return !onlyContains;
        }
        return Boolean(child && root && this.up(child, function (nd) { return nd === root; }, root, true));
    };
    Dom.safeRemove = function (node) {
        node && node.parentNode && node.parentNode.removeChild(node);
    };
    Dom.hide = function (node) {
        if (!node) {
            return;
        }
        (0, helpers_1.dataBind)(node, '__old_display', node.style.display);
        node.style.display = 'none';
    };
    Dom.show = function (node) {
        if (!node) {
            return;
        }
        var display = (0, helpers_1.dataBind)(node, '__old_display');
        if (node.style.display === 'none') {
            node.style.display = display || '';
        }
    };
    Dom.isTag = function (node, tagNames) {
        var tags = (0, helpers_1.asArray)(tagNames).map(String);
        for (var i = 0; i < tags.length; i += 1) {
            if (this.isElement(node) &&
                node.tagName.toLowerCase() === tags[i].toLowerCase()) {
                return true;
            }
        }
        return false;
    };
    Dom.markTemporary = function (element, attributes) {
        attributes && (0, helpers_1.attr)(element, attributes);
        (0, helpers_1.attr)(element, constants_1.TEMP_ATTR, true);
        return element;
    };
    Dom.isTemporary = function (element) {
        if (!Dom.isElement(element)) {
            return false;
        }
        return selection_1.Select.isMarker(element) || (0, helpers_1.attr)(element, constants_1.TEMP_ATTR) === 'true';
    };
    Dom.replaceTemporaryFromString = function (value) {
        return value.replace(/<([a-z]+)[^>]+data-jodit-temp[^>]+>(.+?)<\/\1>/gi, '$2');
    };
    Dom.temporaryList = function (root) {
        return (0, helpers_1.$$)("[".concat(constants_1.TEMP_ATTR, "]"), root);
    };
    return Dom;
}());
exports.Dom = Dom;


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TEMP_ATTR = exports.BASE_PATH = exports.KEY_ALIASES = exports.IS_MAC = exports.SAFE_COUNT_CHANGE_CALL = exports.INSERT_ONLY_TEXT = exports.INSERT_AS_TEXT = exports.INSERT_CLEAR_HTML = exports.INSERT_AS_HTML = exports.EMULATE_DBLCLICK_TIMEOUT = exports.MARKER_CLASS = exports.TEXT_HTML = exports.TEXT_PLAIN = exports.IS_IE = exports.MODE_SPLIT = exports.MODE_SOURCE = exports.MODE_WYSIWYG = exports.PARAGRAPH = exports.BR = exports.COMMAND_KEYS = exports.ACCURACY = exports.NEARBY = exports.KEY_F3 = exports.KEY_DELETE = exports.KEY_SPACE = exports.KEY_DOWN = exports.KEY_RIGHT = exports.KEY_UP = exports.KEY_LEFT = exports.KEY_ESC = exports.KEY_ENTER = exports.KEY_TAB = exports.KEY_BACKSPACE = exports.MAY_BE_REMOVED_WITH_KEY = exports.INSEPARABLE_TAGS = exports.IS_INLINE = exports.IS_BLOCK = exports.SPACE_REG_EXP_END = exports.SPACE_REG_EXP_START = exports.SPACE_REG_EXP = exports.INVISIBLE_SPACE_REG_EXP_START = exports.INVISIBLE_SPACE_REG_EXP_END = exports.INVISIBLE_SPACE_REG_EXP = exports.NBSP_SPACE = exports.INVISIBLE_SPACE = void 0;
exports.INVISIBLE_SPACE = '\uFEFF';
exports.NBSP_SPACE = '\u00A0';
var INVISIBLE_SPACE_REG_EXP = function () { return /[\uFEFF]/g; };
exports.INVISIBLE_SPACE_REG_EXP = INVISIBLE_SPACE_REG_EXP;
var INVISIBLE_SPACE_REG_EXP_END = function () { return /[\uFEFF]+$/g; };
exports.INVISIBLE_SPACE_REG_EXP_END = INVISIBLE_SPACE_REG_EXP_END;
var INVISIBLE_SPACE_REG_EXP_START = function () { return /^[\uFEFF]+/g; };
exports.INVISIBLE_SPACE_REG_EXP_START = INVISIBLE_SPACE_REG_EXP_START;
var SPACE_REG_EXP = function () { return /[\s\n\t\r\uFEFF\u200b]+/g; };
exports.SPACE_REG_EXP = SPACE_REG_EXP;
var SPACE_REG_EXP_START = function () { return /^[\s\n\t\r\uFEFF\u200b]+/g; };
exports.SPACE_REG_EXP_START = SPACE_REG_EXP_START;
var SPACE_REG_EXP_END = function () { return /[\s\n\t\r\uFEFF\u200b]+$/g; };
exports.SPACE_REG_EXP_END = SPACE_REG_EXP_END;
exports.IS_BLOCK = /^(ARTICLE|SCRIPT|STYLE|OBJECT|FOOTER|HEADER|NAV|SECTION|IFRAME|JODIT|JODIT-MEDIA|PRE|DIV|P|LI|UL|OL|H[1-6]|BLOCKQUOTE|TR|TD|TH|TBODY|THEAD|TABLE|BODY|HTML|FIGCAPTION|FIGURE|DT|DD|DL|DFN|FORM)$/i;
exports.IS_INLINE = /^(STRONG|SPAN|I|EM|B|SUP|SUB|A|U)$/i;
exports.INSEPARABLE_TAGS = [
    'img',
    'br',
    'video',
    'iframe',
    'script',
    'input',
    'textarea',
    'hr',
    'link',
    'jodit',
    'jodit-media'
];
exports.MAY_BE_REMOVED_WITH_KEY = RegExp("^".concat(exports.INSEPARABLE_TAGS.join('|'), "$"), 'i');
exports.KEY_BACKSPACE = 'Backspace';
exports.KEY_TAB = 'Tab';
exports.KEY_ENTER = 'Enter';
exports.KEY_ESC = 'Escape';
exports.KEY_LEFT = 'ArrowLeft';
exports.KEY_UP = 'ArrowUp';
exports.KEY_RIGHT = 'ArrowRight';
exports.KEY_DOWN = 'ArrowDown';
exports.KEY_SPACE = 'Space';
exports.KEY_DELETE = 'Delete';
exports.KEY_F3 = 'F3';
exports.NEARBY = 5;
exports.ACCURACY = 10;
exports.COMMAND_KEYS = [
    exports.KEY_BACKSPACE,
    exports.KEY_DELETE,
    exports.KEY_UP,
    exports.KEY_DOWN,
    exports.KEY_RIGHT,
    exports.KEY_LEFT,
    exports.KEY_ENTER,
    exports.KEY_ESC,
    exports.KEY_F3,
    exports.KEY_TAB
];
exports.BR = 'br';
exports.PARAGRAPH = 'p';
exports.MODE_WYSIWYG = 1;
exports.MODE_SOURCE = 2;
exports.MODE_SPLIT = 3;
exports.IS_IE = typeof navigator !== 'undefined' &&
    (navigator.userAgent.indexOf('MSIE') !== -1 ||
        /rv:11.0/i.test(navigator.userAgent));
exports.TEXT_PLAIN = exports.IS_IE ? 'text' : 'text/plain';
exports.TEXT_HTML = exports.IS_IE ? 'html' : 'text/html';
exports.MARKER_CLASS = 'jodit-selection_marker';
exports.EMULATE_DBLCLICK_TIMEOUT = 300;
exports.INSERT_AS_HTML = 'insert_as_html';
exports.INSERT_CLEAR_HTML = 'insert_clear_html';
exports.INSERT_AS_TEXT = 'insert_as_text';
exports.INSERT_ONLY_TEXT = 'insert_only_text';
exports.SAFE_COUNT_CHANGE_CALL = 10;
exports.IS_MAC = typeof window !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
exports.KEY_ALIASES = {
    add: '+',
    break: 'pause',
    cmd: 'meta',
    command: 'meta',
    ctl: 'control',
    ctrl: 'control',
    del: 'delete',
    down: 'arrowdown',
    esc: 'escape',
    ins: 'insert',
    left: 'arrowleft',
    mod: exports.IS_MAC ? 'meta' : 'control',
    opt: 'alt',
    option: 'alt',
    return: 'enter',
    right: 'arrowright',
    space: ' ',
    spacebar: ' ',
    up: 'arrowup',
    win: 'meta',
    windows: 'meta'
};
exports.BASE_PATH = (function () {
    if (typeof document === 'undefined') {
        return '';
    }
    var script = document.currentScript, removeScriptName = function (s) { return s.replace(/\/[^/]+.js$/, '/'); };
    if (script) {
        return removeScriptName(script.src);
    }
    var scripts = document.querySelectorAll('script[src]');
    if (scripts && scripts.length) {
        return removeScriptName(scripts[scripts.length - 1].src);
    }
    return window.location.href;
})();
exports.TEMP_ATTR = 'data-jodit-temp';


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(35), exports);
(0, tslib_1.__exportStar)(__webpack_require__(68), exports);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommitStyle = exports.REPLACE = exports.INITIAL = exports.UNSET = exports.CHANGE = exports.UNWRAP = exports.WRAP = void 0;
var constants_1 = __webpack_require__(33);
var apply_style_1 = __webpack_require__(36);
exports.WRAP = 'wrap';
exports.UNWRAP = 'unwrap';
exports.CHANGE = 'change';
exports.UNSET = 'unset';
exports.INITIAL = 'initial';
exports.REPLACE = 'replace';
var CommitStyle = (function () {
    function CommitStyle(options) {
        this.options = options;
    }
    Object.defineProperty(CommitStyle.prototype, "elementIsList", {
        get: function () {
            return Boolean(this.options.element && ['ul', 'ol'].includes(this.options.element));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommitStyle.prototype, "element", {
        get: function () {
            return this.options.element || this.defaultTag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommitStyle.prototype, "elementIsBlock", {
        get: function () {
            return Boolean(this.options.element && constants_1.IS_BLOCK.test(this.options.element));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommitStyle.prototype, "isElementCommit", {
        get: function () {
            return Boolean(this.options.element &&
                this.options.element !== this.options.defaultTag);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommitStyle.prototype, "defaultTag", {
        get: function () {
            if (this.options.defaultTag) {
                return this.options.defaultTag;
            }
            return this.elementIsBlock ? 'p' : 'span';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommitStyle.prototype, "elementIsDefault", {
        get: function () {
            return this.element === this.defaultTag;
        },
        enumerable: false,
        configurable: true
    });
    CommitStyle.prototype.apply = function (jodit) {
        (0, apply_style_1.ApplyStyle)(jodit, this);
    };
    return CommitStyle;
}());
exports.CommitStyle = CommitStyle;


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplyStyle = void 0;
var helpers_1 = __webpack_require__(16);
var api_1 = __webpack_require__(37);
var commit_style_1 = __webpack_require__(35);
var dom_1 = __webpack_require__(31);
var api_2 = __webpack_require__(37);
function ApplyStyle(jodit, cs) {
    var sel = jodit.s, editor = jodit.editor;
    var fsm = new api_2.FiniteStateMachine('start', {
        start: {
            start: function () {
                sel.save();
                (0, helpers_1.normalizeNode)(editor.firstChild);
                this.setState('generator');
            }
        },
        generator: {
            initGenerator: function () {
                return jodit.s.wrapInTagGen();
            },
            nextFont: function (gen) {
                var font = gen.next();
                if (font.done) {
                    this.setState('end');
                    return;
                }
                if ((0, api_1.isInsideInvisibleElement)(font.value, editor) ||
                    dom_1.Dom.isEmptyContent(font.value)) {
                    return;
                }
                this.setState('check');
                return font.value;
            }
        },
        check: {
            work: function (font) {
                var elm = (0, api_1.getSuitParent)(cs, font, jodit.editor) ||
                    (0, api_1.getSuitChild)(cs, font);
                if (elm) {
                    this.setState('wholeElement');
                    return elm;
                }
                elm = dom_1.Dom.closest(font, function (node) { return (0, api_2.isSuitElement)(cs, node, true); }, jodit.editor);
                if (elm) {
                    if (!cs.elementIsBlock) {
                        (0, api_2.extractSelectedPart)(elm, font, jodit);
                    }
                }
                if (cs.elementIsList && dom_1.Dom.isTag(elm, ['ul', 'ol'])) {
                    this.setState('orderList');
                    return font;
                }
                if (elm) {
                    this.setState('wholeElement');
                    return elm;
                }
                if ((0, api_1.unwrapChildren)(cs, font)) {
                    this.setState('endProcess');
                    return null;
                }
                this.setState('wrap');
                return font;
            }
        },
        wholeElement: {
            toggleStyles: function (toggleElm) {
                var mode = commit_style_1.INITIAL;
                if ((0, api_1.toggleCommitStyles)(cs, toggleElm)) {
                    mode = commit_style_1.UNWRAP;
                }
                else {
                    mode = (0, api_2.toggleCSS)(cs, toggleElm, jodit, mode);
                }
                this.setState('generator', mode);
            }
        },
        orderList: {
            toggleStyles: function (font) {
                var mode = commit_style_1.INITIAL;
                var li = dom_1.Dom.closest(font, 'li', jodit.editor);
                if (!li) {
                    this.setState('generator');
                    return;
                }
                var ul = dom_1.Dom.closest(font, ['ul', 'ol'], jodit.editor);
                if (!ul) {
                    this.setState('generator');
                    return;
                }
                mode = (0, api_2.toggleOrderedList)(cs, li, jodit, mode);
                if (mode === commit_style_1.REPLACE || mode === commit_style_1.UNWRAP || mode === commit_style_1.CHANGE) {
                    this.setState('endWhile');
                    return;
                }
                this.setState('generator');
            }
        },
        wrap: {
            toggleStyles: function (font) {
                if (this.getSubState() !== 'unwrap') {
                    var toggleElm = (0, api_2.wrapAndCommitStyle)(cs, font, jodit);
                    (0, api_2.toggleCSS)(cs, toggleElm, jodit, commit_style_1.WRAP);
                }
                this.setState('generator');
            }
        },
        endWhile: {
            nextFont: function (gen) {
                var font = gen.next();
                if (font.done) {
                    this.setState('end');
                }
            }
        },
        endProcess: {
            toggleStyles: function () {
                this.setState('generator');
            }
        },
        end: {
            finalize: function () {
                sel.restore();
            }
        }
    });
    fsm.dispatch('start');
    var gen = fsm.dispatch('initGenerator');
    while (fsm.getState() !== 'end') {
        var font = fsm.dispatch('nextFont', gen);
        if (font) {
            var wrapper = fsm.dispatch('work', font);
            fsm.dispatch('toggleStyles', wrapper);
        }
    }
    fsm.dispatch('finalize', gen);
}
exports.ApplyStyle = ApplyStyle;


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(38), exports);
(0, tslib_1.__exportStar)(__webpack_require__(66), exports);
(0, tslib_1.__exportStar)(__webpack_require__(69), exports);
(0, tslib_1.__exportStar)(__webpack_require__(67), exports);
(0, tslib_1.__exportStar)(__webpack_require__(70), exports);
(0, tslib_1.__exportStar)(__webpack_require__(71), exports);
(0, tslib_1.__exportStar)(__webpack_require__(74), exports);
(0, tslib_1.__exportStar)(__webpack_require__(75), exports);
(0, tslib_1.__exportStar)(__webpack_require__(72), exports);
(0, tslib_1.__exportStar)(__webpack_require__(73), exports);
(0, tslib_1.__exportStar)(__webpack_require__(76), exports);
(0, tslib_1.__exportStar)(__webpack_require__(77), exports);
(0, tslib_1.__exportStar)(__webpack_require__(78), exports);
(0, tslib_1.__exportStar)(__webpack_require__(80), exports);
(0, tslib_1.__exportStar)(__webpack_require__(79), exports);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleCSS = void 0;
var helpers_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(31);
var commit_style_1 = __webpack_require__(35);
var global_1 = __webpack_require__(39);
function toggleCSS(commitStyle, elm, jodit, mode, dry) {
    if (dry === void 0) { dry = false; }
    var _a = commitStyle.options, style = _a.style, className = _a.className;
    if (style && (0, helpers_1.size)(style) > 0) {
        Object.keys(style).forEach(function (rule) {
            var inlineValue = elm.style.getPropertyValue((0, helpers_1.kebabCase)(rule));
            if (inlineValue === '' && style[rule] == null) {
                return;
            }
            if (getNativeCSSValue(jodit, elm, rule) ===
                (0, helpers_1.normalizeCssValue)(rule, style[rule])) {
                !dry && (0, helpers_1.css)(elm, rule, null);
                mode = commit_style_1.UNSET;
                mode = removeExtraCSS(commitStyle, elm, mode);
                return;
            }
            mode = commit_style_1.CHANGE;
            !dry && (0, helpers_1.css)(elm, rule, style[rule]);
        });
    }
    if (className) {
        if (elm.classList.contains(className)) {
            elm.classList.remove(className);
            mode = commit_style_1.UNSET;
        }
        else {
            elm.classList.add(className);
            mode = commit_style_1.CHANGE;
        }
    }
    return mode;
}
exports.toggleCSS = toggleCSS;
function removeExtraCSS(commitStyle, elm, mode) {
    if (!(0, helpers_1.attr)(elm, 'style')) {
        (0, helpers_1.attr)(elm, 'style', null);
        if (elm.tagName.toLowerCase() === commitStyle.defaultTag) {
            dom_1.Dom.unwrap(elm);
            mode = commit_style_1.UNWRAP;
        }
    }
    return mode;
}
function getShadowRoot(jodit) {
    var _a;
    if ((0, helpers_1.dataBind)(jodit, 'shadowRoot') !== undefined) {
        return (0, helpers_1.dataBind)(jodit, 'shadowRoot');
    }
    var container = (0, global_1.getContainer)(jodit);
    var iframe = document.createElement('iframe');
    (0, helpers_1.css)(iframe, {
        width: 0,
        height: 0,
        position: 'absolute',
        border: 0
    });
    iframe.src = 'about:blank';
    container.appendChild(iframe);
    var doc = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document;
    var shadowRoot = !doc ? jodit.od.body : doc.body;
    (0, helpers_1.dataBind)(jodit, 'shadowRoot', shadowRoot);
    return shadowRoot;
}
function getNativeCSSValue(jodit, elm, key) {
    var newElm = jodit.create.element(elm.tagName.toLowerCase());
    newElm.style.cssText = elm.style.cssText;
    var root = getShadowRoot(jodit);
    root.appendChild(newElm);
    var result = (0, helpers_1.css)(newElm, key);
    dom_1.Dom.safeRemove(newElm);
    return result;
}


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eventEmitter = exports.getContainer = exports.extendLang = exports.lang = exports.modules = exports.pluginSystem = exports.uniqueUid = exports.instances = void 0;
var plugin_system_1 = __webpack_require__(40);
var dom_1 = __webpack_require__(31);
var event_emitter_1 = __webpack_require__(41);
var checker_1 = __webpack_require__(23);
var get_class_name_1 = __webpack_require__(58);
var string_1 = __webpack_require__(59);
exports.instances = {};
var counter = 1;
var uuids = new Set();
function uniqueUid() {
    function gen() {
        counter += 10 * (Math.random() + 1);
        return Math.round(counter).toString(16);
    }
    var uid = gen();
    while (uuids.has(uid)) {
        uid = gen();
    }
    uuids.add(uid);
    return uid;
}
exports.uniqueUid = uniqueUid;
exports.pluginSystem = new plugin_system_1.PluginSystem();
exports.modules = {};
exports.lang = {};
var extendLang = function (langs) {
    Object.keys(langs).forEach(function (key) {
        if (exports.lang[key]) {
            Object.assign(exports.lang[key], langs[key]);
        }
        else {
            exports.lang[key] = langs[key];
        }
    });
};
exports.extendLang = extendLang;
var boxes = new WeakMap();
function getContainer(jodit, classFunc, tag, createInsideEditor) {
    if (tag === void 0) { tag = 'div'; }
    if (createInsideEditor === void 0) { createInsideEditor = false; }
    var name = classFunc ? (0, get_class_name_1.getClassName)(classFunc.prototype) : 'jodit-utils';
    var data = boxes.get(jodit) || {}, key = name + tag;
    var view = (0, checker_1.isViewObject)(jodit) ? jodit : jodit.j;
    if (!data[key]) {
        var c = view.c, body = (0, checker_1.isJoditObject)(jodit) && jodit.o.shadowRoot
            ? jodit.o.shadowRoot
            : jodit.od.body;
        if (createInsideEditor &&
            (0, checker_1.isJoditObject)(jodit) &&
            jodit.od !== jodit.ed) {
            c = jodit.createInside;
            var place = tag === 'style' ? jodit.ed.head : jodit.ed.body;
            body =
                (0, checker_1.isJoditObject)(jodit) && jodit.o.shadowRoot
                    ? jodit.o.shadowRoot
                    : place;
        }
        var box_1 = c.element(tag, {
            className: "jodit jodit-".concat((0, string_1.kebabCase)(name), "-container jodit-box")
        });
        box_1.classList.add("jodit_theme_".concat(view.o.theme || 'default'));
        body.appendChild(box_1);
        data[key] = box_1;
        jodit.hookStatus('beforeDestruct', function () {
            dom_1.Dom.safeRemove(box_1);
            delete data[key];
            if (Object.keys(data).length) {
                boxes.delete(jodit);
            }
        });
        boxes.set(jodit, data);
    }
    data[key].classList.remove('jodit_theme_default', 'jodit_theme_dark');
    data[key].classList.add("jodit_theme_".concat(view.o.theme || 'default'));
    return data[key];
}
exports.getContainer = getContainer;
exports.eventEmitter = new event_emitter_1.EventEmitter();


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginSystem = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(16);
var PluginSystem = (function () {
    function PluginSystem() {
        this._items = new Map();
    }
    PluginSystem.prototype.normalizeName = function (name) {
        return (0, helpers_1.kebabCase)(name).toLowerCase();
    };
    PluginSystem.prototype.items = function (filter) {
        var results = [];
        this._items.forEach(function (plugin, name) {
            results.push([name, plugin]);
        });
        return results.filter(function (_a) {
            var _b = (0, tslib_1.__read)(_a, 1), name = _b[0];
            return !filter || filter.includes(name);
        });
    };
    PluginSystem.prototype.add = function (name, plugin) {
        this._items.set(this.normalizeName(name), plugin);
    };
    PluginSystem.prototype.get = function (name) {
        return this._items.get(this.normalizeName(name));
    };
    PluginSystem.prototype.remove = function (name) {
        this._items.delete(this.normalizeName(name));
    };
    PluginSystem.prototype.init = function (jodit) {
        var _this = this;
        var extrasList = jodit.o.extraPlugins.map(function (s) {
            return (0, helpers_1.isString)(s) ? { name: s } : s;
        }), disableList = (0, helpers_1.splitArray)(jodit.o.disablePlugins).map(function (s) {
            return _this.normalizeName(s);
        }), doneList = [], promiseList = {}, plugins = [], pluginsMap = {}, makeAndInit = function (_a) {
            var _b;
            var _c = (0, tslib_1.__read)(_a, 2), name = _c[0], plugin = _c[1];
            if (disableList.includes(name) ||
                doneList.includes(name) ||
                promiseList[name]) {
                return;
            }
            var requires = (_b = plugin) === null || _b === void 0 ? void 0 : _b.requires;
            if (requires &&
                (0, helpers_1.isArray)(requires) &&
                _this.hasDisabledRequires(disableList, requires)) {
                return;
            }
            var instance = PluginSystem.makePluginInstance(jodit, plugin);
            if (instance) {
                _this.initOrWait(jodit, name, instance, doneList, promiseList);
                plugins.push(instance);
                pluginsMap[name] = instance;
            }
        };
        var resultLoadExtras = this.loadExtras(jodit, extrasList);
        return (0, helpers_1.callPromise)(resultLoadExtras, function () {
            if (jodit.isInDestruct) {
                return;
            }
            _this.items(jodit.o.safeMode
                ? jodit.o.safePluginsList.concat(extrasList.map(function (s) { return s.name; }))
                : null).forEach(makeAndInit);
            _this.addListenerOnBeforeDestruct(jodit, plugins);
            jodit.__plugins = pluginsMap;
        });
    };
    PluginSystem.prototype.hasDisabledRequires = function (disableList, requires) {
        return Boolean((requires === null || requires === void 0 ? void 0 : requires.length) &&
            disableList.some(function (disabled) { return requires.includes(disabled); }));
    };
    PluginSystem.makePluginInstance = function (jodit, plugin) {
        try {
            return (0, helpers_1.isFunction)(plugin) ? new plugin(jodit) : plugin;
        }
        catch (e) {
            console.error(e);
            if (false) {}
        }
        return null;
    };
    PluginSystem.prototype.initOrWait = function (jodit, pluginName, instance, doneList, promiseList) {
        var initPlugin = function (name, plugin) {
            if ((0, helpers_1.isInitable)(plugin)) {
                var req = plugin.requires;
                if (!(req === null || req === void 0 ? void 0 : req.length) ||
                    req.every(function (name) { return doneList.includes(name); })) {
                    try {
                        plugin.init(jodit);
                    }
                    catch (e) {
                        console.error(e);
                        if (false) {}
                    }
                    doneList.push(name);
                }
                else {
                    if (false) {}
                    promiseList[name] = plugin;
                    return false;
                }
            }
            else {
                doneList.push(name);
            }
            if (plugin.hasStyle) {
                PluginSystem.loadStyle(jodit, name);
            }
            return true;
        };
        initPlugin(pluginName, instance);
        Object.keys(promiseList).forEach(function (name) {
            var plugin = promiseList[name];
            if (!plugin) {
                return;
            }
            if (initPlugin(name, plugin)) {
                promiseList[name] = undefined;
                delete promiseList[name];
            }
        });
    };
    PluginSystem.prototype.addListenerOnBeforeDestruct = function (jodit, plugins) {
        jodit.e.on('beforeDestruct', function () {
            plugins.forEach(function (instance) {
                if ((0, helpers_1.isDestructable)(instance)) {
                    instance.destruct(jodit);
                }
            });
            plugins.length = 0;
            delete jodit.__plugins;
        });
    };
    PluginSystem.prototype.load = function (jodit, pluginList) {
        var reflect = function (p) {
            return p.then(function (v) { return ({ v: v, status: 'fulfilled' }); }, function (e) { return ({ e: e, status: 'rejected' }); });
        };
        return Promise.all(pluginList.map(function (extra) {
            var url = extra.url ||
                PluginSystem.getFullUrl(jodit, extra.name, true);
            return reflect((0, helpers_1.appendScriptAsync)(jodit, url));
        }));
    };
    PluginSystem.loadStyle = function (jodit, pluginName) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var url;
            return (0, tslib_1.__generator)(this, function (_a) {
                url = PluginSystem.getFullUrl(jodit, pluginName, false);
                if (this.styles.has(url)) {
                    return [2];
                }
                this.styles.add(url);
                return [2, (0, helpers_1.appendStyleAsync)(jodit, url)];
            });
        });
    };
    PluginSystem.getFullUrl = function (jodit, name, js) {
        name = (0, helpers_1.kebabCase)(name);
        return (jodit.basePath +
            'plugins/' +
            name +
            '/' +
            name +
            '.' +
            (js ? 'js' : 'css'));
    };
    PluginSystem.prototype.loadExtras = function (jodit, extrasList) {
        var _this = this;
        if (extrasList && extrasList.length) {
            try {
                var needLoadExtras = extrasList.filter(function (extra) { return !_this._items.has(_this.normalizeName(extra.name)); });
                if (needLoadExtras.length) {
                    return this.load(jodit, needLoadExtras);
                }
            }
            catch (e) {
                if (false) {}
            }
        }
    };
    PluginSystem.styles = new Set();
    return PluginSystem;
}());
exports.PluginSystem = PluginSystem;


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(42), exports);
(0, tslib_1.__exportStar)(__webpack_require__(45), exports);
(0, tslib_1.__exportStar)(__webpack_require__(43), exports);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEmitter = void 0;
var tslib_1 = __webpack_require__(1);
var store_1 = __webpack_require__(43);
var is_string_1 = __webpack_require__(10);
var is_function_1 = __webpack_require__(7);
var is_array_1 = __webpack_require__(22);
var error_1 = __webpack_require__(44);
var EventEmitter = (function () {
    function EventEmitter(doc) {
        var _this = this;
        this.mutedEvents = new Set();
        this.__key = '__JoditEventEmitterNamespaces';
        this.doc = document;
        this.prepareEvent = function (event) {
            if (event.cancelBubble) {
                return;
            }
            if (event.type.match(/^touch/) &&
                event.changedTouches &&
                event.changedTouches.length) {
                ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function (key) {
                    Object.defineProperty(event, key, {
                        value: event.changedTouches[0][key],
                        configurable: true,
                        enumerable: true
                    });
                });
            }
            if (!event.originalEvent) {
                event.originalEvent = event;
            }
            if (event.type === 'paste' &&
                event.clipboardData === undefined &&
                _this.doc.defaultView.clipboardData) {
                Object.defineProperty(event, 'clipboardData', {
                    get: function () {
                        return _this.doc.defaultView.clipboardData;
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        };
        this.currents = [];
        this.__stopped = [];
        this.isDestructed = false;
        if (doc) {
            this.doc = doc;
        }
        this.__key += new Date().getTime();
    }
    EventEmitter.prototype.mute = function (event) {
        this.mutedEvents.add(event !== null && event !== void 0 ? event : '*');
        return this;
    };
    EventEmitter.prototype.isMuted = function (event) {
        if (event && this.mutedEvents.has(event)) {
            return true;
        }
        return this.mutedEvents.has('*');
    };
    EventEmitter.prototype.unmute = function (event) {
        this.mutedEvents.delete(event !== null && event !== void 0 ? event : '*');
        return this;
    };
    EventEmitter.prototype.eachEvent = function (events, callback) {
        var _this = this;
        var eventParts = events.split(/[\s,]+/);
        eventParts.forEach(function (eventNameSpace) {
            var eventAndNameSpace = eventNameSpace.split('.');
            var namespace = eventAndNameSpace[1] || store_1.defaultNameSpace;
            callback.call(_this, eventAndNameSpace[0], namespace);
        });
    };
    EventEmitter.prototype.getStore = function (subject) {
        if (!subject) {
            throw (0, error_1.error)('Need subject');
        }
        if (subject[this.__key] === undefined) {
            var store = new store_1.EventHandlersStore();
            Object.defineProperty(subject, this.__key, {
                enumerable: false,
                configurable: true,
                value: store
            });
        }
        return subject[this.__key];
    };
    EventEmitter.prototype.clearStore = function (subject) {
        if (subject[this.__key] !== undefined) {
            delete subject[this.__key];
        }
    };
    EventEmitter.prototype.triggerNativeEvent = function (element, event) {
        var evt = this.doc.createEvent('HTMLEvents');
        if (typeof event === 'string') {
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
    EventEmitter.prototype.on = function (subjectOrEvents, eventsOrCallback, handlerOrSelector, onTop) {
        var _this = this;
        if (onTop === void 0) { onTop = false; }
        var subject = (0, is_string_1.isString)(subjectOrEvents) ? this : subjectOrEvents;
        var events = (0, is_string_1.isString)(eventsOrCallback)
            ? eventsOrCallback
            : subjectOrEvents;
        var callback = handlerOrSelector;
        if (callback === undefined && (0, is_function_1.isFunction)(eventsOrCallback)) {
            callback = eventsOrCallback;
        }
        var store = this.getStore(subject);
        if (!(0, is_string_1.isString)(events) || events === '') {
            throw (0, error_1.error)('Need events names');
        }
        if (!(0, is_function_1.isFunction)(callback)) {
            throw (0, error_1.error)('Need event handler');
        }
        if ((0, is_array_1.isArray)(subject)) {
            subject.forEach(function (subj) {
                _this.on(subj, events, callback, onTop);
            });
            return this;
        }
        var isDOMElement = (0, is_function_1.isFunction)(subject.addEventListener), self = this;
        var syntheticCallback = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (self.isMuted(event)) {
                return;
            }
            return callback && callback.call.apply(callback, (0, tslib_1.__spreadArray)([this], (0, tslib_1.__read)(args), false));
        };
        if (isDOMElement) {
            syntheticCallback = function (event) {
                if (self.isMuted(event.type)) {
                    return;
                }
                self.prepareEvent(event);
                if (callback && callback.call(this, event) === false) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                }
                return;
            };
        }
        this.eachEvent(events, function (event, namespace) {
            if (event === '') {
                throw (0, error_1.error)('Need event name');
            }
            if (store.indexOf(event, namespace, callback) === false) {
                var block = {
                    event: event,
                    originalCallback: callback,
                    syntheticCallback: syntheticCallback
                };
                store.set(event, namespace, block, onTop);
                if (isDOMElement) {
                    var options = [
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
                    subject.addEventListener(event, syntheticCallback, options);
                }
            }
        });
        return this;
    };
    EventEmitter.prototype.one = function (subjectOrEvents, eventsOrCallback, handlerOrSelector, onTop) {
        var _this = this;
        if (onTop === void 0) { onTop = false; }
        var subject = (0, is_string_1.isString)(subjectOrEvents) ? this : subjectOrEvents;
        var events = (0, is_string_1.isString)(eventsOrCallback)
            ? eventsOrCallback
            : subjectOrEvents;
        var callback = handlerOrSelector;
        if (callback === undefined && (0, is_function_1.isFunction)(eventsOrCallback)) {
            callback = eventsOrCallback;
        }
        var newCallback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(subject, events, newCallback);
            return callback.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false));
        };
        this.on(subject, events, newCallback, onTop);
        return this;
    };
    EventEmitter.prototype.off = function (subjectOrEvents, eventsOrCallback, handler) {
        var _this = this;
        var subject = (0, is_string_1.isString)(subjectOrEvents)
            ? this
            : subjectOrEvents;
        var events = (0, is_string_1.isString)(eventsOrCallback)
            ? eventsOrCallback
            : subjectOrEvents;
        var store = this.getStore(subject);
        var callback = handler;
        if (!(0, is_string_1.isString)(events) || !events) {
            store.namespaces().forEach(function (namespace) {
                _this.off(subject, '.' + namespace);
            });
            this.clearStore(subject);
            return this;
        }
        if (callback === undefined && (0, is_function_1.isFunction)(eventsOrCallback)) {
            callback = eventsOrCallback;
        }
        var isDOMElement = (0, is_function_1.isFunction)(subject.removeEventListener), removeEventListener = function (block) {
            if (isDOMElement) {
                subject.removeEventListener(block.event, block.syntheticCallback, false);
            }
        }, removeCallbackFromNameSpace = function (event, namespace) {
            if (event !== '') {
                var blocks = store.get(event, namespace);
                if (blocks && blocks.length) {
                    if (!(0, is_function_1.isFunction)(callback)) {
                        blocks.forEach(removeEventListener);
                        blocks.length = 0;
                    }
                    else {
                        var index = store.indexOf(event, namespace, callback);
                        if (index !== false) {
                            removeEventListener(blocks[index]);
                            blocks.splice(index, 1);
                        }
                    }
                }
            }
            else {
                store.events(namespace).forEach(function (eventName) {
                    if (eventName !== '') {
                        removeCallbackFromNameSpace(eventName, namespace);
                    }
                });
            }
        };
        this.eachEvent(events, function (event, namespace) {
            if (namespace === store_1.defaultNameSpace) {
                store.namespaces().forEach(function (name) {
                    removeCallbackFromNameSpace(event, name);
                });
            }
            else {
                removeCallbackFromNameSpace(event, namespace);
            }
        });
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
        var store = this.getStore(subject);
        this.eachEvent(events, function (event, namespace) {
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
    EventEmitter.prototype.removeStop = function (currentBlocks) {
        if (currentBlocks) {
            var index = this.__stopped.indexOf(currentBlocks);
            index !== -1 && this.__stopped.splice(0, index + 1);
        }
    };
    EventEmitter.prototype.isStopped = function (currentBlocks) {
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
            ? (0, tslib_1.__spreadArray)([eventsList], (0, tslib_1.__read)(args), false) : args;
        var isDOMElement = (0, is_function_1.isFunction)(subject.dispatchEvent);
        if (!isDOMElement && !(0, is_string_1.isString)(events)) {
            throw (0, error_1.error)('Need events names');
        }
        var store = this.getStore(subject);
        if (!(0, is_string_1.isString)(events) && isDOMElement) {
            this.triggerNativeEvent(subject, eventsList);
        }
        else {
            this.eachEvent(events, function (event, namespace) {
                if (isDOMElement) {
                    _this.triggerNativeEvent(subject, event);
                }
                else {
                    var blocks_1 = store.get(event, namespace);
                    if (blocks_1) {
                        try {
                            (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(blocks_1), false).every(function (block) {
                                var _a;
                                if (_this.isStopped(blocks_1)) {
                                    return false;
                                }
                                _this.currents.push(event);
                                result_value = (_a = block.syntheticCallback).call.apply(_a, (0, tslib_1.__spreadArray)([subject,
                                    event], (0, tslib_1.__read)(argumentsList), false));
                                _this.currents.pop();
                                if (result_value !== undefined) {
                                    result = result_value;
                                }
                                return true;
                            });
                        }
                        finally {
                            _this.removeStop(blocks_1);
                        }
                    }
                    if (namespace === store_1.defaultNameSpace && !isDOMElement) {
                        store
                            .namespaces()
                            .filter(function (ns) { return ns !== namespace; })
                            .forEach(function (ns) {
                            var result_second = _this.fire.apply(_this, (0, tslib_1.__spreadArray)([
                                subject,
                                event + '.' + ns
                            ], (0, tslib_1.__read)(argumentsList), false));
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
        if (!this.isDestructed) {
            return;
        }
        this.isDestructed = true;
        this.off(this);
        this.getStore(this).clear();
        delete this[this.__key];
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlersStore = exports.defaultNameSpace = void 0;
exports.defaultNameSpace = 'JoditEventDefaultNamespace';
var EventHandlersStore = (function () {
    function EventHandlersStore() {
        this.__store = {};
    }
    EventHandlersStore.prototype.get = function (event, namespace) {
        if (this.__store[namespace] !== undefined) {
            return this.__store[namespace][event];
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
        var nss = Object.keys(this.__store);
        return withoutDefault ? nss.filter(function (ns) { return ns !== exports.defaultNameSpace; }) : nss;
    };
    EventHandlersStore.prototype.events = function (namespace) {
        return this.__store[namespace]
            ? Object.keys(this.__store[namespace])
            : [];
    };
    EventHandlersStore.prototype.set = function (event, namespace, data, onTop) {
        if (onTop === void 0) { onTop = false; }
        if (this.__store[namespace] === undefined) {
            this.__store[namespace] = {};
        }
        if (this.__store[namespace][event] === undefined) {
            this.__store[namespace][event] = [];
        }
        if (!onTop) {
            this.__store[namespace][event].push(data);
        }
        else {
            this.__store[namespace][event].unshift(data);
        }
    };
    EventHandlersStore.prototype.clear = function () {
        this.__store = {};
    };
    return EventHandlersStore;
}());
exports.EventHandlersStore = EventHandlersStore;


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.error = void 0;
function error(message) {
    return new TypeError(message);
}
exports.error = error;


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observable = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(16);
var decorators_1 = __webpack_require__(46);
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
        if ((0, helpers_1.isArray)(event)) {
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
        if ((0, helpers_1.isArray)(event)) {
            event.map(function (e) { return fire.apply(void 0, (0, tslib_1.__spreadArray)([e], (0, tslib_1.__read)(attr), false)); });
            return;
        }
        try {
            if (!__lockEvent[event] && __onEvents[event]) {
                __lockEvent[event] = true;
                __onEvents[event].forEach(function (clb) { return clb.call.apply(clb, (0, tslib_1.__spreadArray)([obj], (0, tslib_1.__read)(attr), false)); });
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
            var descriptor = (0, decorators_1.getPropertyDescriptor)(dict, key);
            Object.defineProperty(dict, key, {
                set: function (value) {
                    var _a;
                    var oldValue = store[key];
                    if (!(0, helpers_1.isFastEqual)(store[key], value)) {
                        fire([
                            'beforeChange',
                            "beforeChange.".concat(prefix.join('.'))
                        ], key, value);
                        if ((0, helpers_1.isPlainObject)(value)) {
                            initAccessors(value, prefix);
                        }
                        if (descriptor && descriptor.set) {
                            descriptor.set.call(obj, value);
                        }
                        else {
                            store[key] = value;
                        }
                        var sum_1 = [];
                        fire((0, tslib_1.__spreadArray)([
                            'change'
                        ], (0, tslib_1.__read)(prefix.reduce(function (rs, p) {
                            sum_1.push(p);
                            rs.push("change.".concat(sum_1.join('.')));
                            return rs;
                        }, [])), false), prefix.join('.'), oldValue, ((_a = value) === null || _a === void 0 ? void 0 : _a.valueOf)
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
            if ((0, helpers_1.isPlainObject)(store[key])) {
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
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autobind = void 0;
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(47), exports);
(0, tslib_1.__exportStar)(__webpack_require__(48), exports);
(0, tslib_1.__exportStar)(__webpack_require__(49), exports);
(0, tslib_1.__exportStar)(__webpack_require__(50), exports);
(0, tslib_1.__exportStar)(__webpack_require__(51), exports);
(0, tslib_1.__exportStar)(__webpack_require__(52), exports);
(0, tslib_1.__exportStar)(__webpack_require__(53), exports);
(0, tslib_1.__exportStar)(__webpack_require__(54), exports);
(0, tslib_1.__exportStar)(__webpack_require__(55), exports);
var autobind_decorator_1 = __webpack_require__(57);
Object.defineProperty(exports, "autobind", ({ enumerable: true, get: function () { return autobind_decorator_1.default; } }));


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cache = void 0;
var helpers_1 = __webpack_require__(16);
function cache(target, name, descriptor) {
    var getter = descriptor.get;
    if (!getter) {
        throw (0, helpers_1.error)('Getter property descriptor expected');
    }
    descriptor.get = function () {
        var value = getter.call(this);
        if (value && value.noCache === true) {
            return value;
        }
        Object.defineProperty(this, name, {
            configurable: descriptor.configurable,
            enumerable: descriptor.enumerable,
            writable: false,
            value: value
        });
        return value;
    };
}
exports.cache = cache;


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.component = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(16);
var cn = function (elm) {
    return (0, helpers_1.isFunction)(elm.className) ? elm.className() : NaN;
};
function component(constructorFunction) {
    var newConstructorFunction = (function (_super) {
        (0, tslib_1.__extends)(newConstructorFunction, _super);
        function newConstructorFunction() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false)) || this;
            var isSamePrototype = Object.getPrototypeOf(_this) ===
                newConstructorFunction.prototype;
            var isSameClassName = cn(_this) ===
                cn(newConstructorFunction.prototype);
            if (false) {}
            if (isSamePrototype || isSameClassName) {
                _this.setStatus('ready');
            }
            return _this;
        }
        return newConstructorFunction;
    }(constructorFunction));
    newConstructorFunction.prototype.constructor = constructorFunction;
    return newConstructorFunction;
}
exports.component = component;


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throttle = exports.debounce = void 0;
var checker_1 = __webpack_require__(23);
var component_1 = __webpack_require__(13);
var error_1 = __webpack_require__(44);
function debounce(timeout, firstCallImmediately, method) {
    if (firstCallImmediately === void 0) { firstCallImmediately = false; }
    if (method === void 0) { method = 'debounce'; }
    return function (target, propertyKey) {
        if (!(0, checker_1.isFunction)(target[propertyKey])) {
            throw (0, error_1.error)('Handler must be a Function');
        }
        target.hookStatus(component_1.STATUSES.ready, function (component) {
            var view = (0, checker_1.isViewObject)(component)
                ? component
                : component.jodit;
            var realTimeout = (0, checker_1.isFunction)(timeout)
                ? timeout(component)
                : timeout;
            component[propertyKey] = view.async[method](component[propertyKey].bind(component), (0, checker_1.isNumber)(realTimeout) || (0, checker_1.isPlainObject)(realTimeout)
                ? realTimeout
                : view.defaultTimeout, firstCallImmediately);
        });
    };
}
exports.debounce = debounce;
function throttle(timeout, firstCallImmediately) {
    if (firstCallImmediately === void 0) { firstCallImmediately = false; }
    return debounce(timeout, firstCallImmediately, 'throttle');
}
exports.throttle = throttle;


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.idle = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(13);
var helpers_1 = __webpack_require__(16);
function idle() {
    return function (target, propertyKey) {
        if (!(0, helpers_1.isFunction)(target[propertyKey])) {
            throw (0, helpers_1.error)('Handler must be a Function');
        }
        target.hookStatus(component_1.STATUSES.ready, function (component) {
            var view = (0, helpers_1.isViewObject)(component)
                ? component
                : component.jodit;
            var originalMethod = component[propertyKey];
            component[propertyKey] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return view.async.requestIdleCallback(originalMethod.bind.apply(originalMethod, (0, tslib_1.__spreadArray)([component], (0, tslib_1.__read)(args), false)));
            };
        });
    };
}
exports.idle = idle;


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hook = void 0;
var checker_1 = __webpack_require__(23);
var error_1 = __webpack_require__(44);
function hook(status) {
    return function (target, propertyKey) {
        if (!(0, checker_1.isFunction)(target[propertyKey])) {
            throw (0, error_1.error)('Handler must be a Function');
        }
        target.hookStatus(status, function (component) {
            target[propertyKey].call(component);
        });
    };
}
exports.hook = hook;


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nonenumerable = void 0;
var nonenumerable = function (target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    if (descriptor.enumerable !== false) {
        Object.defineProperty(target, propertyKey, {
            enumerable: false,
            set: function (value) {
                Object.defineProperty(this, propertyKey, {
                    enumerable: false,
                    writable: true,
                    value: value
                });
            }
        });
    }
};
exports.nonenumerable = nonenumerable;


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.persistent = void 0;
var component_1 = __webpack_require__(13);
var helpers_1 = __webpack_require__(16);
function persistent(target, propertyKey) {
    target.hookStatus(component_1.STATUSES.ready, function (component) {
        var jodit = (0, helpers_1.isViewObject)(component)
            ? component
            : component.jodit, storageKey = "".concat(jodit.options.namespace).concat(component.componentName, "_prop_").concat(propertyKey), initialValue = component[propertyKey];
        Object.defineProperty(component, propertyKey, {
            get: function () {
                var _a;
                return (_a = jodit.storage.get(storageKey)) !== null && _a !== void 0 ? _a : initialValue;
            },
            set: function (value) {
                jodit.storage.set(storageKey, value);
            }
        });
    });
}
exports.persistent = persistent;


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wait = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(16);
var component_1 = __webpack_require__(13);
function wait(condition) {
    return function (target, propertyKey) {
        if (!(0, helpers_1.isFunction)(target[propertyKey])) {
            throw (0, helpers_1.error)('Handler must be a Function');
        }
        target.hookStatus(component_1.STATUSES.ready, function (component) {
            var async = (0, helpers_1.isViewObject)(component)
                ? component.async
                : component.j.async;
            var realMethod = component[propertyKey];
            var timeout = 0;
            component[propertyKey] = function callProxy() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                async.clearTimeout(timeout);
                if (condition(component)) {
                    realMethod.apply(component, args);
                }
                else {
                    timeout = async.setTimeout(function () { return callProxy.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false)); }, 10);
                }
            };
        });
    };
}
exports.wait = wait;


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.watch = exports.getPropertyDescriptor = void 0;
var tslib_1 = __webpack_require__(1);
var checker_1 = __webpack_require__(23);
var event_emitter_1 = __webpack_require__(41);
var component_1 = __webpack_require__(13);
var split_array_1 = __webpack_require__(56);
var error_1 = __webpack_require__(44);
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
        if (!(0, checker_1.isFunction)(target[propertyKey])) {
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
                    return (_a = component)[propertyKey].apply(_a, (0, tslib_1.__spreadArray)([key], (0, tslib_1.__read)(args), false));
                }
            };
            (0, split_array_1.splitArray)(observeFields).forEach(function (field) {
                if (/:/.test(field)) {
                    var _a = (0, tslib_1.__read)(field.split(':'), 2), objectPath = _a[0], eventName_1 = _a[1];
                    var view_1 = (0, checker_1.isViewObject)(component)
                        ? component
                        : component.jodit;
                    if (objectPath.length) {
                        context = component.get(objectPath);
                    }
                    if ((0, checker_1.isFunction)(context)) {
                        context = context(component);
                    }
                    view_1.events.on(context || component, eventName_1, callback);
                    if (!context) {
                        view_1.events.on(eventName_1, callback);
                    }
                    view_1.hookStatus('beforeDestruct', function () {
                        view_1.events
                            .off(context || component, eventName_1, callback)
                            .off(eventName_1, callback);
                    });
                    return;
                }
                var parts = field.split('.'), _b = (0, tslib_1.__read)(parts, 1), key = _b[0], teil = parts.slice(1);
                var value = component[key];
                if ((0, checker_1.isPlainObject)(value)) {
                    var observableValue = (0, event_emitter_1.observable)(value);
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
                        if ((0, checker_1.isPlainObject)(value)) {
                            value = (0, event_emitter_1.observable)(value);
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
        if ((0, checker_1.isFunction)(target.hookStatus)) {
            target.hookStatus(component_1.STATUSES.ready, process);
        }
        else {
            process(target);
        }
    };
}
exports.watch = watch;
exports["default"] = watch;


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitArray = void 0;
var is_string_1 = __webpack_require__(10);
function splitArray(a) {
    return (0, is_string_1.isString)(a) ? a.split(/[,\s]+/) : a;
}
exports.splitArray = splitArray;


/***/ }),
/* 57 */
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
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getClassName = exports.keepNames = void 0;
var is_function_1 = __webpack_require__(7);
exports.keepNames = new Map();
var getClassName = function (obj) {
    var _a;
    if ((0, is_function_1.isFunction)(obj.className)) {
        return obj.className();
    }
    var constructor = ((_a = obj.constructor) === null || _a === void 0 ? void 0 : _a.originalConstructor) || obj.constructor;
    if (exports.keepNames.has(constructor)) {
        return exports.keepNames.get(constructor);
    }
    if (constructor.name) {
        return constructor.name;
    }
    var regex = new RegExp(/^\s*function\s*(\S*)\s*\(/);
    var res = constructor.toString().match(regex);
    return res ? res[1] : '';
};
exports.getClassName = getClassName;


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(60), exports);
(0, tslib_1.__exportStar)(__webpack_require__(27), exports);
(0, tslib_1.__exportStar)(__webpack_require__(61), exports);
(0, tslib_1.__exportStar)(__webpack_require__(62), exports);
(0, tslib_1.__exportStar)(__webpack_require__(63), exports);
(0, tslib_1.__exportStar)(__webpack_require__(64), exports);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.camelCase = void 0;
var camelCase = function (key) {
    return key.replace(/([-_])(.)/g, function (m, code, letter) {
        return letter.toUpperCase();
    });
};
exports.camelCase = camelCase;


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CamelCaseToKebabCase = exports.kebabCase = void 0;
var kebabCase = function (key) {
    return key
        .replace(/([A-Z])([A-Z])([a-z])/g, '$1-$2$3')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
};
exports.kebabCase = kebabCase;
var CamelCaseToKebabCase = function (key) {
    return key
        .replace(/([A-Z])([A-Z])([a-z])/g, '$1-$2$3')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
};
exports.CamelCaseToKebabCase = CamelCaseToKebabCase;


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trimInv = exports.trim = void 0;
var constants_1 = __webpack_require__(33);
function trim(value) {
    return value
        .replace((0, constants_1.SPACE_REG_EXP_END)(), '')
        .replace((0, constants_1.SPACE_REG_EXP_START)(), '');
}
exports.trim = trim;
function trimInv(value) {
    return value
        .replace((0, constants_1.INVISIBLE_SPACE_REG_EXP_END)(), '')
        .replace((0, constants_1.INVISIBLE_SPACE_REG_EXP_START)(), '');
}
exports.trimInv = trimInv;


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ucfirst = void 0;
function ucfirst(value) {
    if (!value.length) {
        return '';
    }
    return value[0].toUpperCase() + value.substr(1);
}
exports.ucfirst = ucfirst;


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.i18n = exports.sprintf = void 0;
var config_1 = __webpack_require__(65);
var utils_1 = __webpack_require__(17);
var checker_1 = __webpack_require__(23);
var string_1 = __webpack_require__(59);
var global_1 = __webpack_require__(39);
var sprintf = function (str, args) {
    if (!args || !args.length) {
        return str;
    }
    var reg = /%([sd])/g;
    var fnd = reg.exec(str);
    var res = str, i = 0;
    while (fnd && args[i] !== undefined) {
        res = res.replace(fnd[0], args[i].toString());
        i += 1;
        fnd = reg.exec(str);
    }
    return res;
};
exports.sprintf = sprintf;
var i18n = function (key, params, options) {
    if (!(0, checker_1.isString)(key)) {
        throw (0, utils_1.error)('i18n: Need string in first argument');
    }
    if (!key.length) {
        return key;
    }
    var debug = Boolean(options !== undefined && options.debugLanguage);
    var store;
    var parse = function (value) {
        return params && params.length ? (0, exports.sprintf)(value, params) : value;
    }, defaultLanguage = (0, utils_1.defaultLanguage)(config_1.Config.defaultOptions.language, config_1.Config.defaultOptions.language), language = (0, utils_1.defaultLanguage)(options === null || options === void 0 ? void 0 : options.language, defaultLanguage), tryGet = function (store) {
        if (!store) {
            return;
        }
        if ((0, checker_1.isString)(store[key])) {
            return parse(store[key]);
        }
        var lcKey = key.toLowerCase();
        if ((0, checker_1.isString)(store[lcKey])) {
            return parse(store[lcKey]);
        }
        var ucfKey = (0, string_1.ucfirst)(key);
        if ((0, checker_1.isString)(store[ucfKey])) {
            return parse(store[ucfKey]);
        }
        return;
    };
    if (global_1.lang[language] !== undefined) {
        store = global_1.lang[language];
    }
    else {
        if (global_1.lang[defaultLanguage] !== undefined) {
            store = global_1.lang[defaultLanguage];
        }
        else {
            store = global_1.lang.en;
        }
    }
    var i18nOvr = options === null || options === void 0 ? void 0 : options.i18n;
    if (i18nOvr && i18nOvr[language]) {
        var result_1 = tryGet(i18nOvr[language]);
        if (result_1) {
            return result_1;
        }
    }
    var result = tryGet(store);
    if (result) {
        return result;
    }
    if (global_1.lang.en && (0, checker_1.isString)(global_1.lang.en[key]) && global_1.lang.en[key]) {
        return parse(global_1.lang.en[key]);
    }
    if (debug) {
        return '{' + key + '}';
    }
    if (false) {}
    return parse(key);
};
exports.i18n = i18n;


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
var consts = __webpack_require__(33);
var Config = (function () {
    function Config() {
        this.namespace = '';
        this.safeMode = false;
        this.safePluginsList = ['about', 'enter', 'backspace'];
        this.license = '';
        this.preset = 'custom';
        this.presets = {
            inline: {
                inline: true,
                toolbar: false,
                toolbarInline: true,
                toolbarInlineForSelection: true,
                showXPathInStatusbar: false,
                showCharsCounter: false,
                showWordsCounter: false,
                showPlaceholder: false
            }
        };
        this.ownerDocument = (typeof document !== 'undefined'
            ? document
            : null);
        this.ownerWindow = (typeof window !== 'undefined'
            ? window
            : null);
        this.shadowRoot = null;
        this.styleValues = {};
        this.zIndex = 0;
        this.readonly = false;
        this.disabled = false;
        this.activeButtonsInReadOnly = [
            'source',
            'fullsize',
            'print',
            'about',
            'dots',
            'selectall'
        ];
        this.toolbarButtonSize = 'middle';
        this.allowTabNavigation = false;
        this.inline = false;
        this.theme = 'default';
        this.saveModeInStorage = false;
        this.spellcheck = true;
        this.editorCssClass = false;
        this.style = false;
        this.triggerChangeEvent = true;
        this.direction = '';
        this.language = 'auto';
        this.debugLanguage = false;
        this.i18n = false;
        this.tabIndex = -1;
        this.toolbar = true;
        this.statusbar = true;
        this.showTooltip = true;
        this.showTooltipDelay = 1000;
        this.useNativeTooltip = false;
        this.enter = consts.PARAGRAPH;
        this.enterBlock = this.enter !== 'br' ? this.enter : consts.PARAGRAPH;
        this.defaultMode = consts.MODE_WYSIWYG;
        this.useSplitMode = false;
        this.colors = {
            greyscale: [
                '#000000',
                '#434343',
                '#666666',
                '#999999',
                '#B7B7B7',
                '#CCCCCC',
                '#D9D9D9',
                '#EFEFEF',
                '#F3F3F3',
                '#FFFFFF'
            ],
            palette: [
                '#980000',
                '#FF0000',
                '#FF9900',
                '#FFFF00',
                '#00F0F0',
                '#00FFFF',
                '#4A86E8',
                '#0000FF',
                '#9900FF',
                '#FF00FF'
            ],
            full: [
                '#E6B8AF',
                '#F4CCCC',
                '#FCE5CD',
                '#FFF2CC',
                '#D9EAD3',
                '#D0E0E3',
                '#C9DAF8',
                '#CFE2F3',
                '#D9D2E9',
                '#EAD1DC',
                '#DD7E6B',
                '#EA9999',
                '#F9CB9C',
                '#FFE599',
                '#B6D7A8',
                '#A2C4C9',
                '#A4C2F4',
                '#9FC5E8',
                '#B4A7D6',
                '#D5A6BD',
                '#CC4125',
                '#E06666',
                '#F6B26B',
                '#FFD966',
                '#93C47D',
                '#76A5AF',
                '#6D9EEB',
                '#6FA8DC',
                '#8E7CC3',
                '#C27BA0',
                '#A61C00',
                '#CC0000',
                '#E69138',
                '#F1C232',
                '#6AA84F',
                '#45818E',
                '#3C78D8',
                '#3D85C6',
                '#674EA7',
                '#A64D79',
                '#85200C',
                '#990000',
                '#B45F06',
                '#BF9000',
                '#38761D',
                '#134F5C',
                '#1155CC',
                '#0B5394',
                '#351C75',
                '#733554',
                '#5B0F00',
                '#660000',
                '#783F04',
                '#7F6000',
                '#274E13',
                '#0C343D',
                '#1C4587',
                '#073763',
                '#20124D',
                '#4C1130'
            ]
        };
        this.colorPickerDefaultTab = 'background';
        this.imageDefaultWidth = 300;
        this.removeButtons = [];
        this.disablePlugins = [];
        this.extraPlugins = [];
        this.extraButtons = [];
        this.extraIcons = {};
        this.createAttributes = {};
        this.sizeLG = 900;
        this.sizeMD = 700;
        this.sizeSM = 400;
        this.buttons = [
            {
                group: 'font-style',
                buttons: []
            },
            {
                group: 'list',
                buttons: []
            },
            {
                group: 'font',
                buttons: []
            },
            '---',
            {
                group: 'script',
                buttons: []
            },
            {
                group: 'media',
                buttons: []
            },
            '\n',
            {
                group: 'state',
                buttons: []
            },
            {
                group: 'clipboard',
                buttons: []
            },
            {
                group: 'insert',
                buttons: []
            },
            {
                group: 'indent',
                buttons: []
            },
            {
                group: 'color',
                buttons: []
            },
            {
                group: 'form',
                buttons: []
            },
            '---',
            {
                group: 'history',
                buttons: []
            },
            {
                group: 'search',
                buttons: []
            },
            {
                group: 'source',
                buttons: []
            },
            {
                group: 'other',
                buttons: []
            },
            {
                group: 'info',
                buttons: []
            }
        ];
        this.buttonsMD = [
            'bold',
            'italic',
            '|',
            'ul',
            'ol',
            'eraser',
            '|',
            'font',
            'fontsize',
            '---',
            'image',
            'table',
            '|',
            'link',
            '\n',
            'brush',
            'paragraph',
            'align',
            '|',
            'hr',
            'copyformat',
            'fullsize',
            '---',
            'undo',
            'redo',
            '|',
            'dots'
        ];
        this.buttonsSM = [
            'bold',
            'italic',
            '|',
            'ul',
            'ol',
            'eraser',
            '|',
            'fontsize',
            'brush',
            'paragraph',
            '---',
            'image',
            'table',
            '\n',
            'link',
            '|',
            'align',
            '|',
            'undo',
            'redo',
            '|',
            'copyformat',
            'fullsize',
            '---',
            'dots'
        ];
        this.buttonsXS = [
            'bold',
            'brush',
            'paragraph',
            'eraser',
            '|',
            'fontsize',
            '---',
            'image',
            '\n',
            'align',
            'undo',
            'redo',
            '|',
            'link',
            'table',
            '---',
            'dots'
        ];
        this.events = {};
        this.textIcons = false;
        this.showBrowserColorPicker = true;
    }
    Object.defineProperty(Config, "defaultOptions", {
        get: function () {
            if (!Config.__defaultOptions) {
                Config.__defaultOptions = new Config();
            }
            return Config.__defaultOptions;
        },
        enumerable: false,
        configurable: true
    });
    return Config;
}());
exports.Config = Config;
Config.prototype.controls = {};


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleOrderedList = void 0;
var dom_1 = __webpack_require__(31);
var extract_1 = __webpack_require__(67);
var commit_style_1 = __webpack_require__(35);
var toggle_css_1 = __webpack_require__(38);
function toggleOrderedList(style, li, jodit, mode) {
    if (!li) {
        return mode;
    }
    var list = li.parentElement;
    if (!list) {
        return mode;
    }
    if (list.tagName.toLowerCase() !== style.element) {
        var newList = dom_1.Dom.replace(list, style.element, jodit.createInside);
        (0, toggle_css_1.toggleCSS)(style, newList, jodit, mode);
        return commit_style_1.REPLACE;
    }
    if ((0, toggle_css_1.toggleCSS)(style, li.parentElement, jodit, commit_style_1.INITIAL, true) === commit_style_1.CHANGE) {
        return (0, toggle_css_1.toggleCSS)(style, li.parentElement, jodit, mode);
    }
    (0, extract_1.extractSelectedPart)(list, li, jodit);
    dom_1.Dom.unwrap(li.parentElement);
    dom_1.Dom.replace(li, jodit.o.enter, jodit.createInside);
    return mode;
}
exports.toggleOrderedList = toggleOrderedList;


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractSelectedPart = void 0;
var select_1 = __webpack_require__(68);
var helpers_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(31);
function extractSelectedPart(wrapper, font, jodit) {
    var range = jodit.s.createRange();
    var leftEdge = select_1.Select.isMarker(font.previousSibling)
        ? font.previousSibling
        : font;
    range.setStartBefore(wrapper);
    range.setEndBefore(leftEdge);
    extractAndMove(wrapper, range, true);
    var rightEdge = select_1.Select.isMarker(font.nextSibling)
        ? font.nextSibling
        : font;
    range.setStartAfter(rightEdge);
    range.setEndAfter(wrapper);
    extractAndMove(wrapper, range, false);
}
exports.extractSelectedPart = extractSelectedPart;
function extractAndMove(wrapper, range, left) {
    var fragment = range.extractContents();
    if ((!fragment.textContent || !(0, helpers_1.trim)(fragment.textContent).length) &&
        fragment.firstChild) {
        dom_1.Dom.unwrap(fragment.firstChild);
    }
    if (wrapper.parentNode) {
        (0, helpers_1.call)(left ? dom_1.Dom.before : dom_1.Dom.after, wrapper, fragment);
    }
}


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Select = void 0;
var tslib_1 = __webpack_require__(1);
var consts = __webpack_require__(33);
var constants_1 = __webpack_require__(33);
var dom_1 = __webpack_require__(31);
var helpers_1 = __webpack_require__(16);
var commit_style_1 = __webpack_require__(35);
var decorators_1 = __webpack_require__(46);
var Select = (function () {
    function Select(jodit) {
        var _this = this;
        this.jodit = jodit;
        jodit.e.on('removeMarkers', function () {
            _this.removeMarkers();
        });
    }
    Object.defineProperty(Select.prototype, "j", {
        get: function () {
            return this.jodit;
        },
        enumerable: false,
        configurable: true
    });
    Select.prototype.errorNode = function (node) {
        if (!dom_1.Dom.isNode(node)) {
            throw (0, helpers_1.error)('Parameter node must be instance of Node');
        }
    };
    Object.defineProperty(Select.prototype, "area", {
        get: function () {
            return this.j.editor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Select.prototype, "win", {
        get: function () {
            return this.j.ew;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Select.prototype, "doc", {
        get: function () {
            return this.j.ed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Select.prototype, "sel", {
        get: function () {
            if (this.j.o.shadowRoot &&
                (0, helpers_1.isFunction)(this.j.o.shadowRoot.getSelection)) {
                return this.j.o.shadowRoot.getSelection();
            }
            return this.win.getSelection();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Select.prototype, "range", {
        get: function () {
            var sel = this.sel;
            return sel && sel.rangeCount ? sel.getRangeAt(0) : this.createRange();
        },
        enumerable: false,
        configurable: true
    });
    Select.prototype.createRange = function (select) {
        if (select === void 0) { select = false; }
        var range = this.doc.createRange();
        if (select) {
            this.selectRange(range);
        }
        return range;
    };
    Select.prototype.remove = function () {
        var sel = this.sel, current = this.current();
        if (sel && current) {
            for (var i = 0; i < sel.rangeCount; i += 1) {
                sel.getRangeAt(i).deleteContents();
                sel.getRangeAt(i).collapse(true);
            }
        }
    };
    Select.prototype.clear = function () {
        var _a, _b;
        if ((_a = this.sel) === null || _a === void 0 ? void 0 : _a.rangeCount) {
            (_b = this.sel) === null || _b === void 0 ? void 0 : _b.removeAllRanges();
        }
    };
    Select.prototype.removeNode = function (node) {
        if (!dom_1.Dom.isOrContains(this.j.editor, node, true)) {
            throw (0, helpers_1.error)("Selection.removeNode can remove only editor's children");
        }
        dom_1.Dom.safeRemove(node);
        this.j.e.fire('afterRemoveNode', node);
    };
    Select.prototype.insertCursorAtPoint = function (x, y) {
        var _this = this;
        this.removeMarkers();
        try {
            var rng_1 = this.createRange();
            (function () {
                if (_this.doc.caretPositionFromPoint) {
                    var caret = _this.doc.caretPositionFromPoint(x, y);
                    if (caret) {
                        rng_1.setStart(caret.offsetNode, caret.offset);
                        return;
                    }
                }
                if (_this.doc.caretRangeFromPoint) {
                    var caret = _this.doc.caretRangeFromPoint(x, y);
                    rng_1.setStart(caret.startContainer, caret.startOffset);
                }
            })();
            rng_1.collapse(true);
            this.selectRange(rng_1);
            return true;
        }
        catch (_a) { }
        return false;
    };
    Select.isMarker = function (elm) {
        return (dom_1.Dom.isNode(elm) &&
            dom_1.Dom.isTag(elm, 'span') &&
            elm.hasAttribute('data-' + consts.MARKER_CLASS));
    };
    Object.defineProperty(Select.prototype, "hasMarkers", {
        get: function () {
            return Boolean(this.markers.length);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Select.prototype, "markers", {
        get: function () {
            return (0, helpers_1.$$)('span[data-' + consts.MARKER_CLASS + ']', this.area);
        },
        enumerable: false,
        configurable: true
    });
    Select.prototype.removeMarkers = function () {
        this.markers.forEach(dom_1.Dom.safeRemove);
    };
    Select.prototype.marker = function (atStart, range) {
        if (atStart === void 0) { atStart = false; }
        var newRange = null;
        if (range) {
            newRange = range.cloneRange();
            newRange.collapse(atStart);
        }
        var marker = this.j.createInside.span();
        marker.id =
            consts.MARKER_CLASS +
                '_' +
                Number(new Date()) +
                '_' +
                String(Math.random()).slice(2);
        marker.style.lineHeight = '0';
        marker.style.display = 'none';
        marker.setAttribute('data-' + consts.MARKER_CLASS, atStart ? 'start' : 'end');
        marker.appendChild(this.j.createInside.text(consts.INVISIBLE_SPACE));
        if (newRange) {
            if (dom_1.Dom.isOrContains(this.area, atStart ? newRange.startContainer : newRange.endContainer)) {
                newRange.insertNode(marker);
            }
        }
        return marker;
    };
    Select.prototype.restore = function () {
        var range = false;
        var markAttr = function (start) {
            return "span[data-".concat(consts.MARKER_CLASS, "=").concat(start ? 'start' : 'end', "]");
        };
        var start = this.area.querySelector(markAttr(true)), end = this.area.querySelector(markAttr(false));
        if (!start) {
            return;
        }
        range = this.createRange();
        if (!end) {
            var previousNode = start.previousSibling;
            if (dom_1.Dom.isText(previousNode)) {
                range.setStart(previousNode, previousNode.nodeValue ? previousNode.nodeValue.length : 0);
            }
            else {
                range.setStartBefore(start);
            }
            dom_1.Dom.safeRemove(start);
            range.collapse(true);
        }
        else {
            range.setStartAfter(start);
            dom_1.Dom.safeRemove(start);
            range.setEndBefore(end);
            dom_1.Dom.safeRemove(end);
        }
        if (range) {
            this.selectRange(range);
        }
    };
    Select.prototype.save = function (silent) {
        if (silent === void 0) { silent = false; }
        if (this.hasMarkers) {
            return [];
        }
        var sel = this.sel;
        if (!sel || !sel.rangeCount) {
            return [];
        }
        var info = [], length = sel.rangeCount, ranges = [];
        for (var i = 0; i < length; i += 1) {
            ranges[i] = sel.getRangeAt(i);
            if (ranges[i].collapsed) {
                var start = this.marker(true, ranges[i]);
                info[i] = {
                    startId: start.id,
                    collapsed: true,
                    startMarker: start.outerHTML
                };
            }
            else {
                var start = this.marker(true, ranges[i]);
                var end = this.marker(false, ranges[i]);
                info[i] = {
                    startId: start.id,
                    endId: end.id,
                    collapsed: false,
                    startMarker: start.outerHTML,
                    endMarker: end.outerHTML
                };
            }
        }
        if (!silent) {
            sel.removeAllRanges();
            for (var i = length - 1; i >= 0; --i) {
                var startElm = this.doc.getElementById(info[i].startId);
                if (startElm) {
                    if (info[i].collapsed) {
                        ranges[i].setStartAfter(startElm);
                        ranges[i].collapse(true);
                    }
                    else {
                        ranges[i].setStartBefore(startElm);
                        if (info[i].endId) {
                            var endElm = this.doc.getElementById(info[i].endId);
                            if (endElm) {
                                ranges[i].setEndAfter(endElm);
                            }
                        }
                    }
                }
                try {
                    sel.addRange(ranges[i].cloneRange());
                }
                catch (_a) { }
            }
        }
        return info;
    };
    Select.prototype.focus = function (options) {
        var _a, _b;
        if (options === void 0) { options = {
            preventScroll: true
        }; }
        if (!this.isFocused()) {
            var scrollParent = (0, helpers_1.getScrollParent)(this.j.container), scrollTop = scrollParent === null || scrollParent === void 0 ? void 0 : scrollParent.scrollTop;
            if (this.j.iframe) {
                if (this.doc.readyState === 'complete') {
                    this.j.iframe.focus(options);
                }
            }
            this.win.focus();
            this.area.focus(options);
            if (scrollTop && (scrollParent === null || scrollParent === void 0 ? void 0 : scrollParent.scrollTo)) {
                scrollParent.scrollTo(0, scrollTop);
            }
            var sel = this.sel, range = (sel === null || sel === void 0 ? void 0 : sel.rangeCount) ? sel === null || sel === void 0 ? void 0 : sel.getRangeAt(0) : null;
            if (!range || !dom_1.Dom.isOrContains(this.area, range.startContainer)) {
                var range_1 = this.createRange();
                range_1.setStart(this.area, 0);
                range_1.collapse(true);
                this.selectRange(range_1, false);
            }
            if (!this.j.editorIsActive) {
                (_b = (_a = this.j) === null || _a === void 0 ? void 0 : _a.events) === null || _b === void 0 ? void 0 : _b.fire('focus');
            }
            return true;
        }
        return false;
    };
    Select.prototype.isCollapsed = function () {
        var sel = this.sel;
        for (var r = 0; sel && r < sel.rangeCount; r += 1) {
            if (!sel.getRangeAt(r).collapsed) {
                return false;
            }
        }
        return true;
    };
    Select.prototype.isFocused = function () {
        return (this.doc.hasFocus &&
            this.doc.hasFocus() &&
            this.area === this.doc.activeElement);
    };
    Select.prototype.current = function (checkChild) {
        if (checkChild === void 0) { checkChild = true; }
        if (this.j.getRealMode() === consts.MODE_WYSIWYG) {
            var sel = this.sel;
            if (!sel || sel.rangeCount === 0) {
                return null;
            }
            var range = sel.getRangeAt(0);
            var node = range.startContainer, rightMode_1 = false;
            var child = function (nd) {
                return rightMode_1 ? nd.lastChild : nd.firstChild;
            };
            if (dom_1.Dom.isTag(node, 'br') && sel.isCollapsed) {
                return node;
            }
            if (!dom_1.Dom.isText(node)) {
                node = range.startContainer.childNodes[range.startOffset];
                if (!node) {
                    node =
                        range.startContainer.childNodes[range.startOffset - 1];
                    rightMode_1 = true;
                }
                if (node && sel.isCollapsed && !dom_1.Dom.isText(node)) {
                    if (!rightMode_1 && dom_1.Dom.isText(node.previousSibling)) {
                        node = node.previousSibling;
                    }
                    else if (checkChild) {
                        var current = child(node);
                        while (current) {
                            if (current && dom_1.Dom.isText(current)) {
                                node = current;
                                break;
                            }
                            current = child(current);
                        }
                    }
                }
                if (node && !sel.isCollapsed && !dom_1.Dom.isText(node)) {
                    var leftChild = node, rightChild = node;
                    do {
                        leftChild = leftChild.firstChild;
                        rightChild = rightChild.lastChild;
                    } while (leftChild && rightChild && !dom_1.Dom.isText(leftChild));
                    if (leftChild === rightChild &&
                        leftChild &&
                        dom_1.Dom.isText(leftChild)) {
                        node = leftChild;
                    }
                }
            }
            if (node && dom_1.Dom.isOrContains(this.area, node)) {
                return node;
            }
        }
        return null;
    };
    Select.prototype.insertNode = function (node, insertCursorAfter, fireChange) {
        var _a;
        if (insertCursorAfter === void 0) { insertCursorAfter = true; }
        if (fireChange === void 0) { fireChange = true; }
        this.errorNode(node);
        this.j.e.fire('safeHTML', node);
        if (!this.isFocused() && this.j.isEditorMode()) {
            this.focus();
            this.restore();
        }
        var sel = this.sel;
        if (!this.isCollapsed()) {
            this.j.execCommand('Delete');
        }
        if (sel && sel.rangeCount) {
            var range = sel.getRangeAt(0);
            if (dom_1.Dom.isOrContains(this.area, range.commonAncestorContainer)) {
                if (dom_1.Dom.isTag(range.startContainer, constants_1.INSEPARABLE_TAGS) &&
                    range.collapsed) {
                    (_a = range.startContainer.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(node, range.startContainer);
                }
                else {
                    range.deleteContents();
                    range.insertNode(node);
                }
            }
            else {
                this.area.appendChild(node);
            }
        }
        else {
            this.area.appendChild(node);
        }
        if (insertCursorAfter) {
            if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                node.lastChild && this.setCursorAfter(node.lastChild);
            }
            else {
                this.setCursorAfter(node);
            }
        }
        if (fireChange && this.j.events) {
            this.j.e.fire('synchro');
        }
        if (this.j.events) {
            this.j.e.fire('afterInsertNode', node);
        }
    };
    Select.prototype.insertHTML = function (html) {
        if (html === '') {
            return;
        }
        var node = this.j.createInside.div(), fragment = this.j.createInside.fragment();
        var lastChild;
        if (!this.isFocused() && this.j.isEditorMode()) {
            this.focus();
            this.restore();
        }
        if (!dom_1.Dom.isNode(html)) {
            node.innerHTML = html.toString();
        }
        else {
            node.appendChild(html);
        }
        if (!this.j.isEditorMode() &&
            this.j.e.fire('insertHTML', node.innerHTML) === false) {
            return;
        }
        lastChild = node.lastChild;
        if (!lastChild) {
            return;
        }
        while (node.firstChild) {
            lastChild = node.firstChild;
            fragment.appendChild(node.firstChild);
        }
        this.insertNode(fragment, false, false);
        if (lastChild) {
            this.setCursorAfter(lastChild);
        }
        else {
            this.setCursorIn(fragment);
        }
        if (this.j.e) {
            this.j.e.fire('synchro');
        }
    };
    Select.prototype.insertImage = function (url, styles, defaultWidth) {
        if (styles === void 0) { styles = null; }
        if (defaultWidth === void 0) { defaultWidth = null; }
        var image = (0, helpers_1.isString)(url) ? this.j.createInside.element('img') : url;
        if ((0, helpers_1.isString)(url)) {
            image.setAttribute('src', url);
        }
        if (defaultWidth != null) {
            var dw = defaultWidth.toString();
            if (dw &&
                'auto' !== dw &&
                String(dw).indexOf('px') < 0 &&
                String(dw).indexOf('%') < 0) {
                dw += 'px';
            }
            (0, helpers_1.call)(this.j.o.resizer.forImageChangeAttributes ? helpers_1.attr : helpers_1.css, image, 'width', dw);
        }
        if (styles && typeof styles === 'object') {
            (0, helpers_1.css)(image, styles);
        }
        var onload = function () {
            if (image.naturalHeight < image.offsetHeight ||
                image.naturalWidth < image.offsetWidth) {
                image.style.width = '';
                image.style.height = '';
            }
            image.removeEventListener('load', onload);
        };
        this.j.e.on(image, 'load', onload);
        if (image.complete) {
            onload();
        }
        this.insertNode(image);
        this.j.e.fire('afterInsertImage', image);
    };
    Select.prototype.eachSelection = function (callback) {
        var _this = this;
        var _a;
        var sel = this.sel;
        if (sel && sel.rangeCount) {
            var range = sel.getRangeAt(0);
            var root_1 = range.commonAncestorContainer;
            if (!dom_1.Dom.isHTMLElement(root_1)) {
                root_1 = root_1.parentElement;
            }
            var nodes_1 = [], startOffset = range.startOffset, length_1 = root_1.childNodes.length, elementOffset = startOffset < length_1 ? startOffset : length_1 - 1;
            var start = range.startContainer === this.area
                ? root_1.childNodes[elementOffset]
                : range.startContainer, end_1 = range.endContainer === this.area
                ? root_1.childNodes[range.endOffset - 1]
                : range.endContainer;
            if (dom_1.Dom.isText(start) &&
                start === range.startContainer &&
                range.startOffset === ((_a = start.nodeValue) === null || _a === void 0 ? void 0 : _a.length) &&
                start.nextSibling) {
                start = start.nextSibling;
            }
            if (dom_1.Dom.isText(end_1) &&
                end_1 === range.endContainer &&
                range.endOffset === 0 &&
                end_1.previousSibling) {
                end_1 = end_1.previousSibling;
            }
            var checkElm_1 = function (node) {
                if (node &&
                    node !== root_1 &&
                    !dom_1.Dom.isEmptyTextNode(node) &&
                    !Select.isMarker(node)) {
                    nodes_1.push(node);
                }
            };
            checkElm_1(start);
            if (start !== end_1) {
                dom_1.Dom.find(start, function (node) {
                    checkElm_1(node);
                    return (node === end_1 ||
                        (node && node.contains && node.contains(end_1)));
                }, root_1, true, false);
            }
            var forEvery_1 = function (current) {
                if (!dom_1.Dom.isOrContains(_this.j.editor, current, true)) {
                    return;
                }
                if (current.nodeName.match(/^(UL|OL)$/)) {
                    return (0, helpers_1.toArray)(current.childNodes).forEach(forEvery_1);
                }
                if (dom_1.Dom.isTag(current, 'li')) {
                    if (current.firstChild) {
                        current = current.firstChild;
                    }
                    else {
                        var currentB = _this.j.createInside.text(constants_1.INVISIBLE_SPACE);
                        current.appendChild(currentB);
                        current = currentB;
                    }
                }
                callback(current);
            };
            if (nodes_1.length === 0 && dom_1.Dom.isEmptyTextNode(start)) {
                nodes_1.push(start);
            }
            if (nodes_1.length === 0 && start.firstChild) {
                nodes_1.push(start.firstChild);
            }
            nodes_1.forEach(forEvery_1);
        }
    };
    Select.prototype.cursorInTheEdge = function (start, parentBlock) {
        var _a, _b;
        var end = !start, range = (_a = this.sel) === null || _a === void 0 ? void 0 : _a.getRangeAt(0), current = this.current(false);
        if (!range ||
            !current ||
            !dom_1.Dom.isOrContains(parentBlock, current, true)) {
            return null;
        }
        var container = start ? range.startContainer : range.endContainer;
        var offset = start ? range.startOffset : range.endOffset;
        var check = function (elm) {
            return elm && !dom_1.Dom.isTag(elm, 'br') && !dom_1.Dom.isEmptyTextNode(elm);
        };
        if (dom_1.Dom.isText(container)) {
            var text = ((_b = container.nodeValue) === null || _b === void 0 ? void 0 : _b.length) ? container.nodeValue : '';
            if (end && text.replace((0, constants_1.INVISIBLE_SPACE_REG_EXP_END)(), '').length > offset) {
                return false;
            }
            var inv = (0, constants_1.INVISIBLE_SPACE_REG_EXP_START)().exec(text);
            if (start &&
                ((inv && inv[0].length < offset) || (!inv && offset > 0))) {
                return false;
            }
        }
        else {
            var children = (0, helpers_1.toArray)(container.childNodes);
            if (end) {
                if (children.slice(offset).some(check)) {
                    return false;
                }
            }
            else {
                if (children.slice(0, offset).some(check)) {
                    return false;
                }
            }
        }
        return !(0, helpers_1.call)(start ? dom_1.Dom.prev : dom_1.Dom.next, current, check, parentBlock);
    };
    Select.prototype.cursorOnTheLeft = function (parentBlock) {
        return this.cursorInTheEdge(true, parentBlock);
    };
    Select.prototype.cursorOnTheRight = function (parentBlock) {
        return this.cursorInTheEdge(false, parentBlock);
    };
    Select.prototype.setCursorAfter = function (node) {
        return this.setCursorNearWith(node, false);
    };
    Select.prototype.setCursorBefore = function (node) {
        return this.setCursorNearWith(node, true);
    };
    Select.prototype.setCursorNearWith = function (node, inStart) {
        var _this = this;
        var _a, _b;
        this.errorNode(node);
        if (!dom_1.Dom.up(node, function (elm) {
            return elm === _this.area || (elm && elm.parentNode === _this.area);
        }, this.area)) {
            throw (0, helpers_1.error)('Node element must be in editor');
        }
        var range = this.createRange();
        var fakeNode = null;
        if (!dom_1.Dom.isText(node)) {
            fakeNode = this.j.createInside.text(consts.INVISIBLE_SPACE);
            inStart ? range.setStartBefore(node) : range.setEndAfter(node);
            range.collapse(inStart);
            range.insertNode(fakeNode);
            range.selectNode(fakeNode);
        }
        else {
            if (inStart) {
                range.setStart(node, 0);
            }
            else {
                range.setEnd(node, (_b = (_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0);
            }
        }
        range.collapse(inStart);
        this.selectRange(range);
        return fakeNode;
    };
    Select.prototype.setCursorIn = function (node, inStart) {
        var _this = this;
        if (inStart === void 0) { inStart = false; }
        this.errorNode(node);
        if (!dom_1.Dom.up(node, function (elm) {
            return elm === _this.area || (elm && elm.parentNode === _this.area);
        }, this.area)) {
            throw (0, helpers_1.error)('Node element must be in editor');
        }
        var range = this.createRange();
        var start = node, last = node;
        do {
            if (dom_1.Dom.isText(start)) {
                break;
            }
            last = start;
            start = inStart ? start.firstChild : start.lastChild;
        } while (start);
        if (!start) {
            var fakeNode = this.j.createInside.text(consts.INVISIBLE_SPACE);
            if (!/^(img|br|input)$/i.test(last.nodeName)) {
                last.appendChild(fakeNode);
                last = fakeNode;
            }
            else {
                start = last;
            }
        }
        range.selectNodeContents(start || last);
        range.collapse(inStart);
        this.selectRange(range);
        return last;
    };
    Select.prototype.selectRange = function (range, focus) {
        if (focus === void 0) { focus = true; }
        var sel = this.sel;
        if (focus && !this.isFocused()) {
            this.focus();
        }
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        this.j.e.fire('changeSelection');
    };
    Select.prototype.select = function (node, inward) {
        var _this = this;
        if (inward === void 0) { inward = false; }
        this.errorNode(node);
        if (!dom_1.Dom.up(node, function (elm) {
            return elm === _this.area || (elm && elm.parentNode === _this.area);
        }, this.area)) {
            throw (0, helpers_1.error)('Node element must be in editor');
        }
        var range = this.createRange();
        range[inward ? 'selectNodeContents' : 'selectNode'](node);
        this.selectRange(range);
    };
    Object.defineProperty(Select.prototype, "html", {
        get: function () {
            var sel = this.sel;
            if (sel && sel.rangeCount > 0) {
                var range = sel.getRangeAt(0);
                var clonedSelection = range.cloneContents();
                var div = this.j.createInside.div();
                div.appendChild(clonedSelection);
                return div.innerHTML;
            }
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Select.prototype.wrapInTagGen = function () {
        var font, _a, marker, font, elms, elms_1, elms_1_1, font, firstChild, lastChild, e_1_1;
        var e_1, _b;
        return (0, tslib_1.__generator)(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!this.isCollapsed()) return [3, 2];
                    font = this.jodit.createInside.element('font', constants_1.INVISIBLE_SPACE);
                    this.insertNode(font, false, false);
                    _a = (0, tslib_1.__read)(this.markers, 1), marker = _a[0];
                    if (marker) {
                        font.appendChild(marker);
                    }
                    else {
                        this.setCursorIn(font);
                        this.save();
                    }
                    return [4, font];
                case 1:
                    _c.sent();
                    dom_1.Dom.unwrap(font);
                    return [2];
                case 2:
                    (0, helpers_1.$$)('*[style*=font-size]', this.area).forEach(function (elm) {
                        return (0, helpers_1.attr)(elm, 'data-font-size', elm.style.fontSize.toString());
                    });
                    if (!this.isCollapsed()) {
                        this.j.nativeExecCommand('fontsize', false, '7');
                    }
                    else {
                        font = this.j.createInside.element('font');
                        (0, helpers_1.attr)(font, 'size', 7);
                        this.insertNode(font, false, false);
                    }
                    (0, helpers_1.$$)('*[data-font-size]', this.area).forEach(function (elm) {
                        var fontSize = (0, helpers_1.attr)(elm, 'data-font-size');
                        if (fontSize) {
                            elm.style.fontSize = fontSize;
                            (0, helpers_1.attr)(elm, 'data-font-size', null);
                        }
                    });
                    elms = (0, helpers_1.$$)('font[size="7"]', this.area);
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, 9, 10]);
                    elms_1 = (0, tslib_1.__values)(elms), elms_1_1 = elms_1.next();
                    _c.label = 4;
                case 4:
                    if (!!elms_1_1.done) return [3, 7];
                    font = elms_1_1.value;
                    firstChild = font.firstChild, lastChild = font.lastChild;
                    if (firstChild &&
                        firstChild === lastChild &&
                        Select.isMarker(firstChild)) {
                        dom_1.Dom.unwrap(font);
                        return [3, 6];
                    }
                    if (firstChild && Select.isMarker(firstChild)) {
                        dom_1.Dom.before(font, firstChild);
                    }
                    if (lastChild && Select.isMarker(lastChild)) {
                        dom_1.Dom.after(font, lastChild);
                    }
                    return [4, font];
                case 5:
                    _c.sent();
                    dom_1.Dom.unwrap(font);
                    _c.label = 6;
                case 6:
                    elms_1_1 = elms_1.next();
                    return [3, 4];
                case 7: return [3, 10];
                case 8:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 10];
                case 9:
                    try {
                        if (elms_1_1 && !elms_1_1.done && (_b = elms_1.return)) _b.call(elms_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7];
                case 10: return [2];
            }
        });
    };
    Select.prototype.wrapInTag = function (tagOrCallback) {
        var e_2, _a;
        var result = [];
        try {
            for (var _b = (0, tslib_1.__values)(this.wrapInTagGen()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var font = _c.value;
                try {
                    if (font.firstChild &&
                        font.firstChild === font.lastChild &&
                        Select.isMarker(font.firstChild)) {
                        continue;
                    }
                    if ((0, helpers_1.isFunction)(tagOrCallback)) {
                        tagOrCallback(font);
                    }
                    else {
                        result.push(dom_1.Dom.replace(font, tagOrCallback, this.j.createInside));
                    }
                }
                finally {
                    var pn = font.parentNode;
                    if (pn) {
                        dom_1.Dom.unwrap(font);
                        if (dom_1.Dom.isEmpty(pn)) {
                            dom_1.Dom.unwrap(pn);
                        }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return result;
    };
    Select.prototype.applyStyle = function (style, options) {
        if (options === void 0) { options = {}; }
        var styleElm = new commit_style_1.CommitStyle({
            style: style,
            element: options.element,
            className: options.className,
            defaultTag: options.defaultTag
        });
        styleElm.apply(this.j);
    };
    Select.prototype.splitSelection = function (currentBox) {
        if (!this.isCollapsed()) {
            return null;
        }
        var leftRange = this.createRange();
        var range = this.range;
        leftRange.setStartBefore(currentBox);
        var cursorOnTheRight = this.cursorOnTheRight(currentBox);
        var cursorOnTheLeft = this.cursorOnTheLeft(currentBox);
        var br = this.j.createInside.element('br'), prevFake = this.j.createInside.text(constants_1.INVISIBLE_SPACE), nextFake = prevFake.cloneNode();
        try {
            if (cursorOnTheRight || cursorOnTheLeft) {
                range.insertNode(br);
                var clearBR = function (start, getNext) {
                    var next = getNext(start);
                    while (next) {
                        var nextSib = getNext(next);
                        if (next &&
                            (dom_1.Dom.isTag(next, 'br') || dom_1.Dom.isEmptyTextNode(next))) {
                            dom_1.Dom.safeRemove(next);
                        }
                        else {
                            break;
                        }
                        next = nextSib;
                    }
                };
                clearBR(br, function (n) { return n.nextSibling; });
                clearBR(br, function (n) { return n.previousSibling; });
                dom_1.Dom.after(br, nextFake);
                dom_1.Dom.before(br, prevFake);
                if (cursorOnTheRight) {
                    leftRange.setEndBefore(br);
                    range.setEndBefore(br);
                }
                else {
                    leftRange.setEndAfter(br);
                    range.setEndAfter(br);
                }
            }
            else {
                leftRange.setEnd(range.startContainer, range.startOffset);
            }
            var fragment = leftRange.extractContents();
            if (currentBox.parentNode) {
                try {
                    currentBox.parentNode.insertBefore(fragment, currentBox);
                    if (cursorOnTheRight && (br === null || br === void 0 ? void 0 : br.parentNode)) {
                        var range_2 = this.createRange();
                        range_2.setStartBefore(br);
                        this.selectRange(range_2);
                    }
                }
                catch (e) {
                    if (false) {}
                }
            }
            var fillFakeParent = function (fake) {
                var _a, _b, _c;
                if (((_a = fake === null || fake === void 0 ? void 0 : fake.parentNode) === null || _a === void 0 ? void 0 : _a.firstChild) === ((_b = fake === null || fake === void 0 ? void 0 : fake.parentNode) === null || _b === void 0 ? void 0 : _b.lastChild)) {
                    (_c = fake === null || fake === void 0 ? void 0 : fake.parentNode) === null || _c === void 0 ? void 0 : _c.appendChild(br.cloneNode());
                }
            };
            fillFakeParent(prevFake);
            fillFakeParent(nextFake);
        }
        finally {
            dom_1.Dom.safeRemove(prevFake);
            dom_1.Dom.safeRemove(nextFake);
        }
        return currentBox.previousElementSibling;
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Select.prototype, "createRange", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Select.prototype, "focus", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Select.prototype, "setCursorAfter", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Select.prototype, "setCursorBefore", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Select.prototype, "setCursorIn", null);
    return Select;
}());
exports.Select = Select;


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementHasSameStyleKeys = exports.elementHasSameStyle = void 0;
var helpers_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(31);
function elementHasSameStyle(elm, rules) {
    return Boolean(!dom_1.Dom.isTag(elm, 'font') &&
        dom_1.Dom.isHTMLElement(elm) &&
        Object.keys(rules).every(function (property) {
            var value = (0, helpers_1.css)(elm, property, true);
            return (!(0, helpers_1.isVoid)(value) &&
                value !== '' &&
                !(0, helpers_1.isVoid)(rules[property]) &&
                (0, helpers_1.normalizeCssValue)(property, rules[property])
                    .toString()
                    .toLowerCase() === value.toString().toLowerCase());
        }));
}
exports.elementHasSameStyle = elementHasSameStyle;
function elementHasSameStyleKeys(elm, rules) {
    return Boolean(!dom_1.Dom.isTag(elm, 'font') &&
        dom_1.Dom.isHTMLElement(elm) &&
        Object.keys(rules).every(function (property) { return !(0, helpers_1.isVoid)((0, helpers_1.css)(elm, property, true)); }));
}
exports.elementHasSameStyleKeys = elementHasSameStyleKeys;


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FiniteStateMachine = void 0;
var tslib_1 = __webpack_require__(1);
var FiniteStateMachine = (function () {
    function FiniteStateMachine(state, transitions) {
        this.state = state;
        this.transitions = transitions;
        this.subState = '';
        this.silent = true;
    }
    FiniteStateMachine.prototype.setState = function (state, subState) {
        this.state = state;
        if (subState != null) {
            this.subState = subState;
        }
    };
    FiniteStateMachine.prototype.getState = function () {
        return this.state;
    };
    FiniteStateMachine.prototype.getSubState = function () {
        return this.subState;
    };
    FiniteStateMachine.prototype.disableSilent = function () {
        this.silent = false;
    };
    FiniteStateMachine.prototype.dispatch = function (actionName) {
        var attrs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            attrs[_i - 1] = arguments[_i];
        }
        var action = this.transitions[this.state][actionName];
        if (action) {
            if (!this.silent) {
                console.log('State: ' + this.state, 'Action: ' + actionName);
            }
            var res = action.call.apply(action, (0, tslib_1.__spreadArray)([this], (0, tslib_1.__read)(attrs), false));
            if (!this.silent) {
                console.log('State: ' + this.state);
            }
            return res;
        }
        if (!this.silent) {
            throw new Error('invalid action: ' + this.state + '.' + actionName);
        }
        return;
    };
    return FiniteStateMachine;
}());
exports.FiniteStateMachine = FiniteStateMachine;


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSuitChild = void 0;
var dom_1 = __webpack_require__(31);
var is_normal_node_1 = __webpack_require__(72);
var is_suit_element_1 = __webpack_require__(73);
function getSuitChild(style, font) {
    var child = font.firstChild;
    while (child && !(0, is_normal_node_1.isNormalNode)(child)) {
        child = child.nextSibling;
        if (!child) {
            return null;
        }
    }
    if (child &&
        !dom_1.Dom.next(child, is_normal_node_1.isNormalNode, font) &&
        (0, is_suit_element_1.isSuitElement)(style, child, false)) {
        return child;
    }
    return null;
}
exports.getSuitChild = getSuitChild;


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNormalNode = void 0;
var dom_1 = __webpack_require__(31);
function isNormalNode(elm) {
    return Boolean(elm && !dom_1.Dom.isEmptyTextNode(elm) && !dom_1.Dom.isTemporary(elm));
}
exports.isNormalNode = isNormalNode;


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSameStyleChild = exports.isSuitElement = void 0;
var is_normal_node_1 = __webpack_require__(72);
var element_has_same_style_1 = __webpack_require__(69);
var dom_1 = __webpack_require__(31);
function isSuitElement(commitStyle, elm, strict) {
    if (!elm) {
        return false;
    }
    var element = commitStyle.element, elementIsDefault = commitStyle.elementIsDefault, options = commitStyle.options;
    var elmHasSameStyle = Boolean(options.style && (0, element_has_same_style_1.elementHasSameStyle)(elm, options.style));
    var elmIsSame = elm.nodeName.toLowerCase() === element ||
        (dom_1.Dom.isTag(elm, ['ul', 'ol']) && commitStyle.elementIsList);
    if (((!elementIsDefault || !strict) && elmIsSame) ||
        (elmHasSameStyle && (0, is_normal_node_1.isNormalNode)(elm))) {
        return true;
    }
    return Boolean(!elmIsSame && !strict && elementIsDefault && dom_1.Dom.isInlineBlock(elm));
}
exports.isSuitElement = isSuitElement;
function isSameStyleChild(commitStyle, elm) {
    var element = commitStyle.element, options = commitStyle.options;
    if (!elm || !(0, is_normal_node_1.isNormalNode)(elm)) {
        return false;
    }
    var elmIsSame = elm.nodeName.toLowerCase() === element;
    var elmHasSameStyle = Boolean(options.style && (0, element_has_same_style_1.elementHasSameStyleKeys)(elm, options.style));
    return elmIsSame && elmHasSameStyle;
}
exports.isSameStyleChild = isSameStyleChild;


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSuitParent = void 0;
var dom_1 = __webpack_require__(31);
var is_normal_node_1 = __webpack_require__(72);
var is_suit_element_1 = __webpack_require__(73);
function getSuitParent(style, node, root) {
    var parentNode = node.parentNode;
    if (parentNode === root ||
        !dom_1.Dom.isHTMLElement(parentNode) ||
        dom_1.Dom.next(node, is_normal_node_1.isNormalNode, parentNode) ||
        dom_1.Dom.prev(node, is_normal_node_1.isNormalNode, parentNode)) {
        return null;
    }
    if (style.isElementCommit &&
        style.elementIsBlock &&
        !dom_1.Dom.isBlock(parentNode)) {
        return getSuitParent(style, parentNode, root);
    }
    if ((0, is_suit_element_1.isSuitElement)(style, parentNode, false) &&
        (!dom_1.Dom.isBlock(parentNode) || style.elementIsBlock)) {
        return parentNode;
    }
    return null;
}
exports.getSuitParent = getSuitParent;


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isInsideInvisibleElement = void 0;
var dom_1 = __webpack_require__(31);
function isInsideInvisibleElement(font, root) {
    return Boolean(dom_1.Dom.closest(font, ['style', 'script'], root));
}
exports.isInsideInvisibleElement = isInsideInvisibleElement;


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleCommitStyles = void 0;
var dom_1 = __webpack_require__(31);
function toggleCommitStyles(commitStyle, elm) {
    if (commitStyle.elementIsBlock ||
        (dom_1.Dom.isTag(elm, commitStyle.element) && !commitStyle.elementIsDefault)) {
        dom_1.Dom.unwrap(elm);
        return true;
    }
    return false;
}
exports.toggleCommitStyles = toggleCommitStyles;


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unwrapChildren = void 0;
var dom_1 = __webpack_require__(31);
var is_suit_element_1 = __webpack_require__(73);
var helpers_1 = __webpack_require__(16);
function unwrapChildren(style, font) {
    var needUnwrap = [];
    var needChangeStyle = [];
    var firstElementSuit;
    var cssStyle = style.options.style;
    if (font.firstChild) {
        var gen = dom_1.Dom.eachGen(font);
        var item = gen.next();
        var _loop_1 = function () {
            var elm = item.value;
            if ((0, is_suit_element_1.isSuitElement)(style, elm, true)) {
                if (firstElementSuit === undefined) {
                    firstElementSuit = true;
                }
                needUnwrap.push(elm);
            }
            else if (cssStyle && (0, is_suit_element_1.isSameStyleChild)(style, elm)) {
                if (firstElementSuit === undefined) {
                    firstElementSuit = false;
                }
                needChangeStyle.push(function () {
                    (0, helpers_1.css)(elm, Object.keys(cssStyle).reduce(function (acc, key) {
                        acc[key] = null;
                        return acc;
                    }, {}));
                    if (!(0, helpers_1.attr)(elm, 'style')) {
                        (0, helpers_1.attr)(elm, 'style', null);
                    }
                    if (elm.nodeName.toLowerCase() === style.element) {
                        needUnwrap.push(elm);
                    }
                });
            }
            else if (!dom_1.Dom.isEmptyTextNode(elm)) {
                if (firstElementSuit === undefined) {
                    firstElementSuit = false;
                }
            }
            item = gen.next();
        };
        while (!item.done) {
            _loop_1();
        }
    }
    needChangeStyle.forEach(function (clb) { return clb(); });
    needUnwrap.forEach(dom_1.Dom.unwrap);
    return Boolean(firstElementSuit);
}
exports.unwrapChildren = unwrapChildren;


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapAndCommitStyle = void 0;
var dom_1 = __webpack_require__(31);
var wrap_unwrapped_text_1 = __webpack_require__(79);
var helpers_1 = __webpack_require__(16);
var wrap_ordered_list_1 = __webpack_require__(80);
function wrapAndCommitStyle(commitStyle, font, jodit) {
    var wrapper = findOrCreateWrapper(commitStyle, font, jodit);
    return commitStyle.elementIsList
        ? (0, wrap_ordered_list_1.wrapOrderedList)(commitStyle, wrapper, jodit)
        : dom_1.Dom.replace(wrapper, commitStyle.element, jodit.createInside, true);
}
exports.wrapAndCommitStyle = wrapAndCommitStyle;
function findOrCreateWrapper(commitStyle, font, jodit) {
    if (commitStyle.elementIsBlock) {
        var box = dom_1.Dom.up(font, function (node) {
            return dom_1.Dom.isBlock(node) &&
                !dom_1.Dom.isTag(node, [
                    'td',
                    'th',
                    'tr',
                    'tbody',
                    'table',
                    'li',
                    'ul',
                    'ol'
                ]);
        }, jodit.editor);
        if (box) {
            return box;
        }
    }
    if (commitStyle.elementIsBlock) {
        return (0, wrap_unwrapped_text_1.wrapUnwrappedText)(commitStyle, font, jodit, jodit.s.createRange);
    }
    (0, helpers_1.attr)(font, 'size', null);
    return font;
}


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapUnwrappedText = void 0;
var dom_1 = __webpack_require__(31);
function wrapUnwrappedText(style, elm, jodit, getRange) {
    var root = jodit.editor, ci = jodit.createInside, edge = function (n, key) {
        if (key === void 0) { key = 'previousSibling'; }
        var edgeNode = n, node = n;
        while (node) {
            if (dom_1.Dom.isTag(node, jodit.o.enter)) {
                break;
            }
            edgeNode = node;
            if (node[key]) {
                node = node[key];
            }
            else {
                node =
                    node.parentNode &&
                        !dom_1.Dom.isBlock(node.parentNode) &&
                        node.parentNode !== root
                        ? node.parentNode
                        : null;
            }
            if (dom_1.Dom.isBlock(node)) {
                break;
            }
        }
        return edgeNode;
    };
    var start = edge(elm), end = edge(elm, 'nextSibling');
    var range = getRange();
    range.setStartBefore(start);
    range.setEndAfter(end);
    var fragment = range.extractContents();
    var wrapper = ci.element(style.element);
    wrapper.appendChild(fragment);
    range.insertNode(wrapper);
    if (style.elementIsBlock) {
        if (dom_1.Dom.isEmpty(wrapper) &&
            !dom_1.Dom.isTag(wrapper.firstElementChild, 'br')) {
            wrapper.appendChild(ci.element('br'));
        }
    }
    return wrapper;
}
exports.wrapUnwrappedText = wrapUnwrappedText;


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapOrderedList = void 0;
var dom_1 = __webpack_require__(31);
function wrapOrderedList(commitStyle, wrapper, jodit) {
    var newWrapper = dom_1.Dom.replace(wrapper, 'li', jodit.createInside);
    var list = newWrapper.previousElementSibling || newWrapper.nextElementSibling;
    if (!dom_1.Dom.isTag(list, ['ul', 'ol'])) {
        list = jodit.createInside.element(commitStyle.element);
        dom_1.Dom.before(newWrapper, list);
    }
    if (newWrapper.previousElementSibling === list) {
        dom_1.Dom.append(list, newWrapper);
    }
    else {
        dom_1.Dom.prepend(list, newWrapper);
    }
    return list;
}
exports.wrapOrderedList = wrapOrderedList;


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isInt = void 0;
var is_numeric_1 = __webpack_require__(21);
var is_string_1 = __webpack_require__(10);
function isInt(value) {
    if ((0, is_string_1.isString)(value) && (0, is_numeric_1.isNumeric)(value)) {
        value = parseFloat(value);
    }
    return typeof value === 'number' && Number.isFinite(value) && !(value % 1);
}
exports.isInt = isInt;


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isViewObject = exports.isJoditObject = void 0;
var is_function_1 = __webpack_require__(7);
var global_1 = __webpack_require__(39);
function isJoditObject(jodit) {
    return Boolean(jodit &&
        jodit instanceof Object &&
        (0, is_function_1.isFunction)(jodit.constructor) &&
        ((typeof Jodit !== 'undefined' && jodit instanceof Jodit) ||
            jodit.isJodit));
}
exports.isJoditObject = isJoditObject;
function isViewObject(jodit) {
    return Boolean(jodit &&
        jodit instanceof Object &&
        (0, is_function_1.isFunction)(jodit.constructor) &&
        (jodit instanceof global_1.modules.View || jodit.isView));
}
exports.isViewObject = isViewObject;


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isLicense = void 0;
var is_string_1 = __webpack_require__(10);
var isLicense = function (license) {
    return (0, is_string_1.isString)(license) &&
        license.length === 23 &&
        /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}$/i.test(license);
};
exports.isLicense = isLicense;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
/* 85 */
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
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPlainObject = void 0;
var is_window_1 = __webpack_require__(87);
function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object' || obj.nodeType || (0, is_window_1.isWindow)(obj)) {
        return false;
    }
    return !(obj.constructor &&
        !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'));
}
exports.isPlainObject = isPlainObject;


/***/ }),
/* 87 */
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
/* 88 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isURL = void 0;
function isURL(str) {
    if (str.includes(' ')) {
        return false;
    }
    if (typeof URL !== 'undefined') {
        try {
            var url = new URL(str);
            return ['https:', 'http:', 'ftp:', 'file:', 'rtmp:'].includes(url.protocol);
        }
        catch (e) {
            return false;
        }
    }
    var a = document.createElement('a');
    a.href = str;
    return Boolean(a.hostname);
}
exports.isURL = isURL;


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isValidName = void 0;
function isValidName(name) {
    if (!name.length) {
        return false;
    }
    return !/[^0-9A-Za-zа-яА-ЯЁё\w\-_.]/.test(name);
}
exports.isValidName = isValidName;


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LimitedStack = void 0;
var LimitedStack = (function () {
    function LimitedStack(limit) {
        this.limit = limit;
        this.stack = [];
    }
    LimitedStack.prototype.push = function (item) {
        this.stack.push(item);
        if (this.stack.length > this.limit) {
            this.stack.shift();
        }
        return this;
    };
    LimitedStack.prototype.pop = function () {
        return this.stack.pop();
    };
    LimitedStack.prototype.find = function (clb) {
        return this.stack.find(clb);
    };
    return LimitedStack;
}());
exports.LimitedStack = LimitedStack;


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadNextStyle = exports.loadNext = exports.appendStyleAsync = exports.appendScriptAsync = exports.appendScript = void 0;
var tslib_1 = __webpack_require__(1);
var complete_url_1 = __webpack_require__(92);
var checker_1 = __webpack_require__(23);
var alreadyLoadedList = new Map();
var cacheLoaders = function (loader) {
    return function (jodit, url) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var promise;
        return (0, tslib_1.__generator)(this, function (_a) {
            if (alreadyLoadedList.has(url)) {
                return [2, alreadyLoadedList.get(url)];
            }
            promise = loader(jodit, url);
            alreadyLoadedList.set(url, promise);
            return [2, promise];
        });
    }); };
};
var appendScript = function (jodit, url, callback) {
    var script = jodit.c.element('script');
    script.type = 'text/javascript';
    script.async = true;
    if ((0, checker_1.isFunction)(callback) && !jodit.isInDestruct) {
        jodit.e.on(script, 'load', callback);
    }
    if (!script.src) {
        script.src = (0, complete_url_1.completeUrl)(url);
    }
    jodit.od.body.appendChild(script);
    return {
        callback: callback,
        element: script
    };
};
exports.appendScript = appendScript;
exports.appendScriptAsync = cacheLoaders(function (jodit, url) {
    return new Promise(function (resolve, reject) {
        var element = (0, exports.appendScript)(jodit, url, resolve).element;
        !jodit.isInDestruct && jodit.e.on(element, 'error', reject);
    });
});
exports.appendStyleAsync = cacheLoaders(function (jodit, url) {
    return new Promise(function (resolve, reject) {
        var link = jodit.c.element('link');
        link.rel = 'stylesheet';
        link.media = 'all';
        link.crossOrigin = 'anonymous';
        var callback = function () { return resolve(link); };
        !jodit.isInDestruct &&
            jodit.e.on(link, 'load', callback).on(link, 'error', reject);
        link.href = (0, complete_url_1.completeUrl)(url);
        if (jodit.o.shadowRoot) {
            jodit.o.shadowRoot.appendChild(link);
        }
        else {
            jodit.od.body.appendChild(link);
        }
    });
});
var loadNext = function (jodit, urls, i) {
    if (i === void 0) { i = 0; }
    if (!(0, checker_1.isString)(urls[i])) {
        return Promise.resolve();
    }
    return (0, exports.appendScriptAsync)(jodit, urls[i]).then(function () {
        return (0, exports.loadNext)(jodit, urls, i + 1);
    });
};
exports.loadNext = loadNext;
var loadNextStyle = function (jodit, urls, i) {
    if (i === void 0) { i = 0; }
    if (!(0, checker_1.isString)(urls[i])) {
        return Promise.resolve();
    }
    return (0, exports.appendStyleAsync)(jodit, urls[i]).then(function () {
        return (0, exports.loadNextStyle)(jodit, urls, i + 1);
    });
};
exports.loadNextStyle = loadNextStyle;


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.completeUrl = void 0;
var completeUrl = function (url) {
    if (window.location.protocol === 'file:' && /^\/\//.test(url)) {
        url = 'https:' + url;
    }
    return url;
};
exports.completeUrl = completeUrl;


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.browser = void 0;
var browser = function (browser) {
    var ua = navigator.userAgent.toLowerCase(), match = /(firefox)[\s/]([\w.]+)/.exec(ua) ||
        /(chrome)[\s/]([\w.]+)/.exec(ua) ||
        /(webkit)[\s/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version)[\s/]([\w.]+)/.exec(ua) ||
        /(msie)[\s]([\w.]+)/.exec(ua) ||
        /(trident)\/([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 ||
        [];
    if (browser === 'version') {
        return match[2];
    }
    if (browser === 'webkit') {
        return match[1] === 'chrome' || match[1] === 'webkit';
    }
    if (browser === 'ff') {
        return match[1] === 'firefox';
    }
    if (browser === 'msie') {
        return match[1] === 'trident' || match[1] === 'msie';
    }
    return match[1] === browser;
};
exports.browser = browser;


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildQuery = void 0;
var checker_1 = __webpack_require__(23);
var buildQuery = function (data, prefix) {
    var str = [];
    var enc = encodeURIComponent;
    for (var dataKey in data) {
        if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
            var k = prefix ? prefix + '[' + dataKey + ']' : dataKey;
            var v = data[dataKey];
            str.push((0, checker_1.isPlainObject)(v) ? (0, exports.buildQuery)(v, k) : enc(k) + '=' + enc(v));
        }
    }
    return str.join('&');
};
exports.buildQuery = buildQuery;


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigFlatten = exports.ConfigProto = void 0;
var tslib_1 = __webpack_require__(1);
var extend_1 = __webpack_require__(96);
var checker_1 = __webpack_require__(23);
var config_1 = __webpack_require__(65);
var utils_1 = __webpack_require__(6);
function ConfigProto(options, proto, deep) {
    if (deep === void 0) { deep = 0; }
    if (Object.getPrototypeOf(options) !== Object.prototype) {
        return options;
    }
    var def = config_1.Config.defaultOptions;
    if ((0, checker_1.isString)(options.preset)) {
        if (def.presets[options.preset] !== undefined) {
            var preset_1 = def.presets[options.preset];
            Object.keys(preset_1).forEach(function (subKey) {
                if ((0, checker_1.isVoid)(options[subKey])) {
                    options[subKey] = preset_1[subKey];
                }
            });
        }
        delete options.preset;
    }
    var newOpt = {};
    Object.keys(options).forEach(function (key) {
        var opt = options[key], protoKey = proto ? proto[key] : null;
        if ((0, checker_1.isPlainObject)(opt) && (0, checker_1.isPlainObject)(protoKey) && !(0, extend_1.isAtom)(opt)) {
            newOpt[key] = ConfigProto(opt, protoKey, deep + 1);
            return;
        }
        if (deep !== 0 && (0, checker_1.isArray)(opt) && !(0, extend_1.isAtom)(opt) && (0, checker_1.isArray)(protoKey)) {
            newOpt[key] = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(opt), false), (0, tslib_1.__read)(protoKey.slice(opt.length)), false);
            return;
        }
        newOpt[key] = opt;
    });
    Object.setPrototypeOf(newOpt, proto);
    return newOpt;
}
exports.ConfigProto = ConfigProto;
function ConfigFlatten(obj) {
    return (0, utils_1.keys)(obj, false).reduce(function (app, key) {
        app[key] = obj[key];
        return app;
    }, {});
}
exports.ConfigFlatten = ConfigFlatten;


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fastClone = exports.markAsAtomic = exports.isAtom = void 0;
var stringify_1 = __webpack_require__(27);
function isAtom(obj) {
    return obj && obj.isAtom;
}
exports.isAtom = isAtom;
function markAsAtomic(obj) {
    Object.defineProperty(obj, 'isAtom', {
        enumerable: false,
        value: true,
        configurable: false
    });
    return obj;
}
exports.markAsAtomic = markAsAtomic;
function fastClone(object) {
    return JSON.parse((0, stringify_1.stringify)(object));
}
exports.fastClone = fastClone;


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertMediaUrlToVideoEmbed = void 0;
var checker_1 = __webpack_require__(23);
var parse_query_1 = __webpack_require__(98);
var convertMediaUrlToVideoEmbed = function (url, width, height) {
    if (width === void 0) { width = 400; }
    if (height === void 0) { height = 345; }
    if (!(0, checker_1.isURL)(url)) {
        return url;
    }
    var parser = document.createElement('a'), pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
    parser.href = url;
    if (!width) {
        width = 400;
    }
    if (!height) {
        height = 345;
    }
    var protocol = parser.protocol || '';
    switch (parser.hostname) {
        case 'www.vimeo.com':
        case 'vimeo.com':
            return pattern1.test(url)
                ? url.replace(pattern1, '<iframe width="' +
                    width +
                    '" height="' +
                    height +
                    '" src="' +
                    protocol +
                    '//player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe>')
                : url;
        case 'youtube.com':
        case 'www.youtube.com':
        case 'youtu.be':
        case 'www.youtu.be': {
            var query = parser.search
                ? (0, parse_query_1.parseQuery)(parser.search)
                : { v: parser.pathname.substr(1) };
            return query.v
                ? '<iframe width="' +
                    width +
                    '" height="' +
                    height +
                    '" src="' +
                    protocol +
                    '//www.youtube.com/embed/' +
                    query.v +
                    '" frameborder="0" allowfullscreen></iframe>'
                : url;
        }
    }
    return url;
};
exports.convertMediaUrlToVideoEmbed = convertMediaUrlToVideoEmbed;


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseQuery = void 0;
var parseQuery = function (queryString) {
    var query = {}, a = queryString.substr(1).split('&');
    for (var i = 0; i < a.length; i += 1) {
        var keyValue = a[i].split('=');
        query[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1] || '');
    }
    return query;
};
exports.parseQuery = parseQuery;


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearCenterAlign = exports.css = void 0;
var checker_1 = __webpack_require__(23);
var normalize_1 = __webpack_require__(100);
var string_1 = __webpack_require__(59);
function css(element, key, value, onlyStyleMode) {
    if (onlyStyleMode === void 0) { onlyStyleMode = false; }
    var numberFieldsReg = /^(left|top|bottom|right|width|min|max|height|margin|padding|fontsize|font-size)/i;
    if ((0, checker_1.isBoolean)(value)) {
        onlyStyleMode = value;
        value = undefined;
    }
    if ((0, checker_1.isPlainObject)(key) || value !== undefined) {
        var setValue = function (elm, _key, _value) {
            if (!(0, checker_1.isVoid)(_value) &&
                numberFieldsReg.test(_key) &&
                (0, checker_1.isNumeric)(_value.toString())) {
                _value = parseInt(_value.toString(), 10) + 'px';
            }
            if (_value !== undefined &&
                (_value == null ||
                    css(elm, _key, true) !== (0, normalize_1.normalizeCssValue)(_key, _value))) {
                elm.style[_key] = _value;
            }
        };
        if ((0, checker_1.isPlainObject)(key)) {
            var keys = Object.keys(key);
            for (var j = 0; j < keys.length; j += 1) {
                setValue(element, (0, string_1.camelCase)(keys[j]), key[keys[j]]);
            }
        }
        else {
            setValue(element, (0, string_1.camelCase)(key), value);
        }
        return '';
    }
    var key2 = (0, string_1.kebabCase)(key), doc = element.ownerDocument || document, win = doc ? doc.defaultView || doc.parentWindow : false;
    var currentValue = element.style[key];
    var result = '';
    if (currentValue !== undefined && currentValue !== '') {
        result = currentValue;
    }
    else if (win && !onlyStyleMode) {
        result = win.getComputedStyle(element).getPropertyValue(key2);
    }
    if (numberFieldsReg.test(key) &&
        /^[-+]?[0-9.]+px$/.test(result.toString())) {
        result = parseInt(result.toString(), 10);
    }
    return (0, normalize_1.normalizeCssValue)(key, result);
}
exports.css = css;
var clearCenterAlign = function (image) {
    if (css(image, 'display') === 'block') {
        css(image, 'display', '');
    }
    var style = image.style;
    if (style.marginLeft === 'auto' && style.marginRight === 'auto') {
        style.marginLeft = '';
        style.marginRight = '';
    }
};
exports.clearCenterAlign = clearCenterAlign;


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(101), exports);
(0, tslib_1.__exportStar)(__webpack_require__(102), exports);
(0, tslib_1.__exportStar)(__webpack_require__(103), exports);
(0, tslib_1.__exportStar)(__webpack_require__(104), exports);
(0, tslib_1.__exportStar)(__webpack_require__(105), exports);
(0, tslib_1.__exportStar)(__webpack_require__(106), exports);
(0, tslib_1.__exportStar)(__webpack_require__(107), exports);
(0, tslib_1.__exportStar)(__webpack_require__(108), exports);
(0, tslib_1.__exportStar)(__webpack_require__(111), exports);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeKeyAliases = void 0;
var string_1 = __webpack_require__(59);
var constants_1 = __webpack_require__(33);
function normalizeKeyAliases(keys) {
    var memory = {};
    return keys
        .replace(/\+\+/g, '+add')
        .split(/[\s]*\+[\s]*/)
        .map(function (key) { return (0, string_1.trim)(key.toLowerCase()); })
        .map(function (key) { return constants_1.KEY_ALIASES[key] || key; })
        .sort()
        .filter(function (key) { return !memory[key] && key !== '' && (memory[key] = true); })
        .join('+');
}
exports.normalizeKeyAliases = normalizeKeyAliases;


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeLicense = void 0;
var normalizeLicense = function (license, count) {
    if (count === void 0) { count = 8; }
    var parts = [];
    while (license.length) {
        parts.push(license.substr(0, count));
        license = license.substr(count);
    }
    parts[1] = parts[1].replace(/./g, '*');
    parts[2] = parts[2].replace(/./g, '*');
    return parts.join('-');
};
exports.normalizeLicense = normalizeLicense;


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeNode = void 0;
var constants_1 = __webpack_require__(33);
var dom_1 = __webpack_require__(31);
var normalizeNode = function (node) {
    if (!node) {
        return;
    }
    if (dom_1.Dom.isText(node) && node.nodeValue != null && node.parentNode) {
        while (dom_1.Dom.isText(node.nextSibling)) {
            if (node.nextSibling.nodeValue != null) {
                node.nodeValue += node.nextSibling.nodeValue;
            }
            node.nodeValue = node.nodeValue.replace((0, constants_1.INVISIBLE_SPACE_REG_EXP)(), '');
            dom_1.Dom.safeRemove(node.nextSibling);
        }
    }
    else {
        (0, exports.normalizeNode)(node.firstChild);
    }
    (0, exports.normalizeNode)(node.nextSibling);
};
exports.normalizeNode = normalizeNode;


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizePath = void 0;
var string_1 = __webpack_require__(59);
var normalizePath = function () {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    return path
        .filter(function (part) { return (0, string_1.trim)(part).length; })
        .map(function (part, index) {
        part = part.replace(/([^:])[\\/]+/g, '$1/');
        if (index) {
            part = part.replace(/^\//, '');
        }
        if (index !== path.length - 1) {
            part = part.replace(/\/$/, '');
        }
        return part;
    })
        .join('/');
};
exports.normalizePath = normalizePath;


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeRelativePath = void 0;
var normalizeRelativePath = function (path) {
    var sections = path.split('/'), builder = sections.reduce(function (builder, section) {
        switch (section) {
            case '': {
                break;
            }
            case '.': {
                break;
            }
            case '..': {
                builder.pop();
                break;
            }
            default: {
                builder.push(section);
                break;
            }
        }
        return builder;
    }, []);
    return builder.join('/') + (path.endsWith('/') ? '/' : '');
};
exports.normalizeRelativePath = normalizeRelativePath;


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeSize = void 0;
var normalizeSize = function (value) {
    if (/^[0-9]+$/.test(value.toString())) {
        return value + 'px';
    }
    return value.toString();
};
exports.normalizeSize = normalizeSize;


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeUrl = void 0;
var normalizeUrl = function () {
    var urls = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        urls[_i] = arguments[_i];
    }
    return urls
        .filter(function (url) { return url.length; })
        .map(function (url) { return url.replace(/\/$/, ''); })
        .join('/')
        .replace(/([^:])[\\/]+/g, '$1/');
};
exports.normalizeUrl = normalizeUrl;


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeCssValue = void 0;
var checker_1 = __webpack_require__(23);
var string_1 = __webpack_require__(59);
var color_1 = __webpack_require__(109);
function normalizeCssValue(key, value) {
    switch ((0, string_1.kebabCase)(key)) {
        case 'font-weight':
            switch (value.toString().toLowerCase()) {
                case '700':
                case 'bold':
                    return 700;
                case '400':
                case 'normal':
                    return 400;
                case '900':
                case 'heavy':
                    return 900;
            }
            return (0, checker_1.isNumeric)(value) ? Number(value) : value;
    }
    if (/color/i.test(key) && /^rgb/i.test(value.toString())) {
        return (0, color_1.colorToHex)(value.toString()) || value;
    }
    return value;
}
exports.normalizeCssValue = normalizeCssValue;


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(110), exports);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.colorToHex = void 0;
var colorToHex = function (color) {
    if (color === 'rgba(0, 0, 0, 0)' || color === '') {
        return false;
    }
    if (!color) {
        return '#000000';
    }
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /([\s\n\t\r]*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color) ||
        /([\s\n\t\r]*?)rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/.exec(color);
    if (!digits) {
        return '#000000';
    }
    var red = parseInt(digits[2], 10), green = parseInt(digits[3], 10), blue = parseInt(digits[4], 10), rgb = blue | (green << 8) | (red << 16);
    var hex = rgb.toString(16).toUpperCase();
    while (hex.length < 6) {
        hex = '0' + hex;
    }
    return digits[1] + '#' + hex;
};
exports.colorToHex = colorToHex;


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeColor = void 0;
var color_1 = __webpack_require__(109);
var string_1 = __webpack_require__(59);
var normalizeColor = function (colorInput) {
    var newcolor = ['#'];
    var color = (0, color_1.colorToHex)(colorInput);
    if (!color) {
        return false;
    }
    color = (0, string_1.trim)(color.toUpperCase());
    color = color.substr(1);
    if (color.length === 3) {
        for (var i = 0; i < 3; i += 1) {
            newcolor.push(color[i]);
            newcolor.push(color[i]);
        }
        return newcolor.join('');
    }
    if (color.length > 6) {
        color = color.substr(0, 6);
    }
    return '#' + color;
};
exports.normalizeColor = normalizeColor;


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ctrlKey = void 0;
var ctrlKey = function (e) {
    if (typeof navigator !== 'undefined' &&
        navigator.userAgent.indexOf('Mac OS X') !== -1) {
        if (e.metaKey && !e.altKey) {
            return true;
        }
    }
    else if (e.ctrlKey && !e.altKey) {
        return true;
    }
    return false;
};
exports.ctrlKey = ctrlKey;


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultLanguage = void 0;
var checker_1 = __webpack_require__(23);
var defaultLanguage = function (language, defaultLanguage) {
    if (defaultLanguage === void 0) { defaultLanguage = 'en'; }
    if (language !== 'auto' && (0, checker_1.isString)(language)) {
        return language;
    }
    if (document.documentElement && document.documentElement.lang) {
        return document.documentElement.lang;
    }
    if (navigator.language) {
        return navigator.language.substr(0, 2);
    }
    return defaultLanguage;
};
exports.defaultLanguage = defaultLanguage;


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.humanSizeToBytes = void 0;
var humanSizeToBytes = function (human) {
    if (/^[0-9.]+$/.test(human.toString())) {
        return parseFloat(human);
    }
    var format = human.substr(-2, 2).toUpperCase(), formats = ['KB', 'MB', 'GB', 'TB'], number = parseFloat(human.substr(0, human.length - 2));
    return formats.indexOf(format) !== -1
        ? number * Math.pow(1024, formats.indexOf(format) + 1)
        : parseInt(human, 10);
};
exports.humanSizeToBytes = humanSizeToBytes;


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.scrollIntoViewIfNeeded = exports.inView = void 0;
var inView = function (elm, root, doc) {
    var rect = elm.getBoundingClientRect(), el = elm;
    var top = rect.top, height = rect.height;
    do {
        if (el && el.parentNode) {
            el = el.parentNode;
            rect = el.getBoundingClientRect();
            if (!(top <= rect.bottom)) {
                return false;
            }
            if (top + height <= rect.top) {
                return false;
            }
        }
    } while (el && el !== root && el.parentNode);
    return (top <= ((doc.documentElement && doc.documentElement.clientHeight) || 0));
};
exports.inView = inView;
var scrollIntoViewIfNeeded = function (elm, root, doc) {
    if (!(0, exports.inView)(elm, root, doc)) {
        if (root.clientHeight !== root.scrollHeight) {
            root.scrollTop = elm.offsetTop;
        }
        if (!(0, exports.inView)(elm, root, doc)) {
            elm.scrollIntoView();
        }
    }
};
exports.scrollIntoViewIfNeeded = scrollIntoViewIfNeeded;


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveElement = exports.cssPath = exports.refs = exports.getXPathByElement = exports.$$ = void 0;
var constants_1 = __webpack_require__(33);
var checker_1 = __webpack_require__(23);
var utils_1 = __webpack_require__(17);
var dom_1 = __webpack_require__(31);
var string_1 = __webpack_require__(59);
var array_1 = __webpack_require__(117);
var ui_1 = __webpack_require__(119);
var temp = 1;
var $$temp = function () {
    temp++;
    return temp;
};
function $$(selector, root) {
    var result;
    if ( true &&
        /:scope/.test(selector) &&
        constants_1.IS_IE &&
        !(root && root.nodeType === Node.DOCUMENT_NODE)) {
        var id = root.id, temp_id = id ||
            '_selector_id_' + String(Math.random()).slice(2) + $$temp();
        selector = selector.replace(/:scope/g, '#' + temp_id);
        !id && root.setAttribute('id', temp_id);
        result = root.parentNode.querySelectorAll(selector);
        if (!id) {
            root.removeAttribute('id');
        }
    }
    else {
        result = root.querySelectorAll(selector);
    }
    return [].slice.call(result);
}
exports.$$ = $$;
var getXPathByElement = function (element, root) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    if (!element.parentNode || root === element) {
        return '';
    }
    if (element.id) {
        return "//*[@id='" + element.id + "']";
    }
    var sames = [].filter.call(element.parentNode.childNodes, function (x) { return x.nodeName === element.nodeName; });
    return ((0, exports.getXPathByElement)(element.parentNode, root) +
        '/' +
        element.nodeName.toLowerCase() +
        (sames.length > 1
            ? '[' + ((0, array_1.toArray)(sames).indexOf(element) + 1) + ']'
            : ''));
};
exports.getXPathByElement = getXPathByElement;
var refs = function (root) {
    if (root instanceof ui_1.UIElement) {
        root = root.container;
    }
    return $$('[ref],[data-ref]', root).reduce(function (def, child) {
        var key = (0, utils_1.attr)(child, '-ref');
        if (key && (0, checker_1.isString)(key)) {
            def[(0, string_1.camelCase)(key)] = child;
            def[key] = child;
        }
        return def;
    }, {});
};
exports.refs = refs;
var cssPath = function (el) {
    if (!dom_1.Dom.isElement(el)) {
        return null;
    }
    var path = [];
    var start = el;
    while (start && start.nodeType === Node.ELEMENT_NODE) {
        var selector = start.nodeName.toLowerCase();
        if (start.id) {
            selector += '#' + start.id;
            path.unshift(selector);
            break;
        }
        else {
            var sib = start, nth = 1;
            do {
                sib = sib.previousElementSibling;
                if (sib && sib.nodeName.toLowerCase() === selector) {
                    nth++;
                }
            } while (sib);
            selector += ':nth-of-type(' + nth + ')';
        }
        path.unshift(selector);
        start = start.parentNode;
    }
    return path.join(' > ');
};
exports.cssPath = cssPath;
function resolveElement(element, od) {
    var resolved = element;
    if ((0, checker_1.isString)(element)) {
        try {
            resolved = od.querySelector(element);
        }
        catch (_a) {
            throw (0, utils_1.error)('String "' + element + '" should be valid HTML selector');
        }
    }
    if (!resolved ||
        typeof resolved !== 'object' ||
        !dom_1.Dom.isElement(resolved) ||
        !resolved.cloneNode) {
        throw (0, utils_1.error)('Element "' + element + '" should be string or HTMLElement instance');
    }
    return resolved;
}
exports.resolveElement = resolveElement;


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toArray = exports.splitArray = exports.asArray = void 0;
var as_array_1 = __webpack_require__(118);
Object.defineProperty(exports, "asArray", ({ enumerable: true, get: function () { return as_array_1.asArray; } }));
var split_array_1 = __webpack_require__(56);
Object.defineProperty(exports, "splitArray", ({ enumerable: true, get: function () { return split_array_1.splitArray; } }));
var to_array_1 = __webpack_require__(5);
Object.defineProperty(exports, "toArray", ({ enumerable: true, get: function () { return to_array_1.toArray; } }));


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asArray = void 0;
var is_array_1 = __webpack_require__(22);
var asArray = function (a) { return ((0, is_array_1.isArray)(a) ? a : [a]); };
exports.asArray = asArray;


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(120), exports);
(0, tslib_1.__exportStar)(__webpack_require__(125), exports);
(0, tslib_1.__exportStar)(__webpack_require__(140), exports);
(0, tslib_1.__exportStar)(__webpack_require__(130), exports);
(0, tslib_1.__exportStar)(__webpack_require__(143), exports);
(0, tslib_1.__exportStar)(__webpack_require__(124), exports);
(0, tslib_1.__exportStar)(__webpack_require__(161), exports);


/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIElement = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(13);
var dom_1 = __webpack_require__(31);
var traits_1 = __webpack_require__(121);
var helpers_1 = __webpack_require__(16);
var icon_1 = __webpack_require__(124);
var UIElement = (function (_super) {
    (0, tslib_1.__extends)(UIElement, _super);
    function UIElement(jodit, options) {
        var _this = _super.call(this, jodit) || this;
        _this.name = '';
        _this.__parentElement = null;
        _this.mods = {};
        _this.container = _this.createContainer(options);
        Object.defineProperty(_this.container, 'component', {
            value: _this,
            configurable: true
        });
        return _this;
    }
    Object.defineProperty(UIElement.prototype, "parentElement", {
        get: function () {
            return this.__parentElement;
        },
        set: function (parentElement) {
            var _this = this;
            this.__parentElement = parentElement;
            if (parentElement) {
                parentElement.hookStatus('beforeDestruct', function () { return _this.destruct(); });
            }
            this.updateParentElement(this);
        },
        enumerable: false,
        configurable: true
    });
    UIElement.prototype.bubble = function (callback) {
        var parent = this.parentElement;
        while (parent) {
            callback(parent);
            parent = parent.parentElement;
        }
        return this;
    };
    UIElement.prototype.updateParentElement = function (target) {
        var _a;
        (_a = this.__parentElement) === null || _a === void 0 ? void 0 : _a.updateParentElement(target);
        return this;
    };
    UIElement.prototype.get = function (chain, obj) {
        return _super.prototype.get.call(this, chain, obj) || this.getElm(chain);
    };
    UIElement.prototype.closest = function (type) {
        var c = typeof type === 'object'
            ? function (pe) { return pe === type; }
            : function (pe) { return pe instanceof type; };
        var pe = this.__parentElement;
        while (pe) {
            if (c(pe)) {
                return pe;
            }
            if (!pe.parentElement && pe.container.parentElement) {
                pe = UIElement.closestElement(pe.container.parentElement, UIElement);
            }
            else {
                pe = pe.parentElement;
            }
        }
        return null;
    };
    UIElement.closestElement = function (node, type) {
        var elm = dom_1.Dom.up(node, function (elm) {
            if (elm) {
                var component = elm.component;
                return component && component instanceof type;
            }
            return false;
        });
        return elm ? elm === null || elm === void 0 ? void 0 : elm.component : null;
    };
    UIElement.prototype.setMod = function (name, value, container) {
        if (container === void 0) { container = this.container; }
        traits_1.Mods.setMod.call(this, name, value, container);
        return this;
    };
    UIElement.prototype.getMod = function (name) {
        return traits_1.Mods.getMod.call(this, name);
    };
    UIElement.prototype.getElm = function (elementName) {
        return traits_1.Elms.getElm.call(this, elementName);
    };
    UIElement.prototype.getElms = function (elementName) {
        return traits_1.Elms.getElms.call(this, elementName);
    };
    UIElement.prototype.update = function () {
    };
    UIElement.prototype.appendTo = function (element) {
        element.appendChild(this.container);
        return this;
    };
    UIElement.prototype.clearName = function (name) {
        return name.replace(/[^a-zA-Z0-9]/g, '_');
    };
    UIElement.prototype.render = function (options) {
        return this.j.c.div(this.componentName);
    };
    UIElement.prototype.createContainer = function (options) {
        var _this = this;
        var result = this.render(options);
        if ((0, helpers_1.isString)(result)) {
            var elm = this.j.c.fromHTML(result
                .replace(/\*([^*]+?)\*/g, function (_, name) { return icon_1.Icon.get(name) || ''; })
                .replace(/&__/g, this.componentName + '__')
                .replace(/~([^~]+?)~/g, function (_, s) { return _this.i18n(s); }));
            elm.classList.add(this.componentName);
            return elm;
        }
        return result;
    };
    UIElement.prototype.destruct = function () {
        dom_1.Dom.safeRemove(this.container);
        this.parentElement = null;
        return _super.prototype.destruct.call(this);
    };
    return UIElement;
}(component_1.ViewComponent));
exports.UIElement = UIElement;


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(122), exports);
(0, tslib_1.__exportStar)(__webpack_require__(123), exports);


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Elms = void 0;
var to_array_1 = __webpack_require__(5);
var Elms = (function () {
    function Elms() {
    }
    Elms.getElm = function (elementName) {
        return this.container.querySelector(".".concat(this.getFullElName(elementName)));
    };
    Elms.getElms = function (elementName) {
        return (0, to_array_1.toArray)(this.container.querySelectorAll(".".concat(this.getFullElName(elementName))));
    };
    return Elms;
}());
exports.Elms = Elms;


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mods = void 0;
var to_array_1 = __webpack_require__(5);
var is_void_1 = __webpack_require__(11);
var Mods = (function () {
    function Mods() {
    }
    Mods.setMod = function (name, value, container) {
        name = name.toLowerCase();
        if (this.mods[name] === value) {
            return;
        }
        var mod = "".concat(this.componentName, "_").concat(name), cl = (container || this.container).classList;
        (0, to_array_1.toArray)(cl).forEach(function (className) {
            if (className.indexOf(mod) === 0) {
                cl.remove(className);
            }
        });
        !(0, is_void_1.isVoid)(value) &&
            value !== '' &&
            cl.add("".concat(mod, "_").concat(value.toString().toLowerCase()));
        this.mods[name] = value;
    };
    Mods.getMod = function (name) {
        var _a;
        return (_a = this.mods[name]) !== null && _a !== void 0 ? _a : null;
    };
    return Mods;
}());
exports.Mods = Mods;


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Icon = void 0;
var helpers_1 = __webpack_require__(16);
var Icon = (function () {
    function Icon() {
    }
    Icon.getIcon = function (name) {
        if (/<svg/i.test(name)) {
            return name;
        }
        return (Icon.icons[name] ||
            Icon.icons[name.replace(/-/g, '_')] ||
            Icon.icons[name.replace(/_/g, '-')] ||
            Icon.icons[name.toLowerCase()]);
    };
    Icon.exists = function (name) {
        return this.getIcon(name) !== undefined;
    };
    Icon.get = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = '<span></span>'; }
        return this.getIcon(name) || defaultValue;
    };
    Icon.set = function (name, value) {
        this.icons[name.replace('_', '-')] = value;
        return this;
    };
    Icon.makeIcon = function (jodit, icon) {
        var _a;
        var iconElement;
        if (icon) {
            var clearName = icon.name.replace(/[^a-zA-Z0-9]/g, '_');
            if (icon.iconURL) {
                iconElement = jodit.c.span();
                (0, helpers_1.css)(iconElement, 'backgroundImage', 'url(' +
                    icon.iconURL.replace('{basePath}', (jodit === null || jodit === void 0 ? void 0 : jodit.basePath) || '') +
                    ')');
            }
            else {
                var svg = jodit.e.fire('getIcon', icon.name, icon, clearName) ||
                    Icon.get(icon.name, '') ||
                    ((_a = jodit.o.extraIcons) === null || _a === void 0 ? void 0 : _a[icon.name]);
                if (svg) {
                    iconElement = jodit.c.fromHTML(svg.trim());
                    if (!/^<svg/i.test(icon.name)) {
                        iconElement.classList.add('jodit-icon_' + clearName);
                    }
                }
            }
        }
        if (iconElement) {
            iconElement.classList.add('jodit-icon');
            iconElement.style.fill = icon.fill;
        }
        return iconElement;
    };
    Icon.icons = {};
    return Icon;
}());
exports.Icon = Icon;


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(126), exports);
(0, tslib_1.__exportStar)(__webpack_require__(128), exports);


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = exports.UIButton = exports.UIButtonState = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(127);
var ui_1 = __webpack_require__(119);
var dom_1 = __webpack_require__(31);
var helpers_1 = __webpack_require__(16);
var ui_2 = __webpack_require__(119);
var ui_3 = __webpack_require__(119);
var decorators_1 = __webpack_require__(46);
var component_1 = __webpack_require__(13);
var UIButtonState = function () { return ({
    size: 'middle',
    type: 'button',
    name: '',
    value: '',
    variant: 'initial',
    disabled: false,
    activated: false,
    icon: {
        name: 'empty',
        fill: '',
        iconURL: ''
    },
    tooltip: '',
    text: '',
    tabIndex: undefined
}); };
exports.UIButtonState = UIButtonState;
var UIButton = (function (_super) {
    (0, tslib_1.__extends)(UIButton, _super);
    function UIButton(jodit, state) {
        var _this = _super.call(this, jodit) || this;
        _this.isButton = true;
        _this.state = (0, exports.UIButtonState)();
        _this.actionHandlers = [];
        _this.updateSize();
        _this.onChangeSize();
        _this.onChangeStatus();
        if (state) {
            _this.hookStatus(component_1.STATUSES.ready, function () {
                _this.setState(state);
            });
        }
        return _this;
    }
    UIButton.prototype.className = function () {
        return 'UIButton';
    };
    UIButton.prototype.setState = function (state) {
        Object.assign(this.state, state);
        return this;
    };
    UIButton.prototype.onChangeSize = function () {
        this.setMod('size', this.state.size);
    };
    UIButton.prototype.onChangeType = function () {
        (0, helpers_1.attr)(this.container, 'type', this.state.type);
    };
    UIButton.prototype.updateSize = function () {
        var pe = this.closest(ui_3.UIList);
        if (pe) {
            this.state.size = pe.buttonSize;
            return;
        }
    };
    UIButton.prototype.onChangeStatus = function () {
        this.setMod('variant', this.state.variant);
    };
    UIButton.prototype.onChangeText = function () {
        this.text.textContent = this.jodit.i18n(this.state.text);
    };
    UIButton.prototype.onChangeTextSetMode = function () {
        this.setMod('text-icons', Boolean(this.state.text.trim().length));
    };
    UIButton.prototype.onChangeDisabled = function () {
        (0, helpers_1.attr)(this.container, 'disabled', this.state.disabled || null);
    };
    UIButton.prototype.onChangeActivated = function () {
        (0, helpers_1.attr)(this.container, 'aria-pressed', this.state.activated);
    };
    UIButton.prototype.onChangeName = function () {
        this.container.classList.add("".concat(this.componentName, "_").concat(this.clearName(this.state.name)));
        this.name = this.state.name;
        (0, helpers_1.attr)(this.container, 'data-ref', this.state.name);
        (0, helpers_1.attr)(this.container, 'ref', this.state.name);
    };
    UIButton.prototype.onChangeTooltip = function () {
        if (this.get('j.o.useNativeTooltip')) {
            (0, helpers_1.attr)(this.container, 'title', this.state.tooltip);
        }
        (0, helpers_1.attr)(this.container, 'aria-label', this.state.tooltip);
    };
    UIButton.prototype.onChangeTabIndex = function () {
        (0, helpers_1.attr)(this.container, 'tabindex', this.state.tabIndex);
    };
    UIButton.prototype.onChangeIcon = function () {
        var textIcons = this.get('j.o.textIcons');
        if (textIcons === true ||
            ((0, helpers_1.isFunction)(textIcons) && textIcons(this.state.name))) {
            return;
        }
        dom_1.Dom.detach(this.icon);
        var iconElement = ui_2.Icon.makeIcon(this.j, this.state.icon);
        iconElement && this.icon.appendChild(iconElement);
    };
    UIButton.prototype.focus = function () {
        this.container.focus();
    };
    UIButton.prototype.isFocused = function () {
        var activeElement = this.od.activeElement;
        return Boolean(activeElement && dom_1.Dom.isOrContains(this.container, activeElement));
    };
    UIButton.prototype.createContainer = function () {
        var cn = this.componentName;
        var button = this.j.c.element('button', {
            class: cn,
            type: 'button',
            role: 'button',
            ariaPressed: false
        });
        this.icon = this.j.c.span(cn + '__icon');
        this.text = this.j.c.span(cn + '__text');
        button.appendChild(this.icon);
        button.appendChild(this.text);
        this.j.e.on(button, 'click', this.onActionFire);
        return button;
    };
    UIButton.prototype.destruct = function () {
        this.j.e.off(this.container);
        return _super.prototype.destruct.call(this);
    };
    UIButton.prototype.onAction = function (callback) {
        this.actionHandlers.push(callback);
        return this;
    };
    UIButton.prototype.onActionFire = function (e) {
        var _this = this;
        e.buffer = {
            actionTrigger: this
        };
        this.actionHandlers.forEach(function (callback) { return callback.call(_this, e); });
    };
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.size')
    ], UIButton.prototype, "onChangeSize", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.type')
    ], UIButton.prototype, "onChangeType", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('parentElement')
    ], UIButton.prototype, "updateSize", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.variant')
    ], UIButton.prototype, "onChangeStatus", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.text')
    ], UIButton.prototype, "onChangeText", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.text')
    ], UIButton.prototype, "onChangeTextSetMode", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.disabled')
    ], UIButton.prototype, "onChangeDisabled", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.activated')
    ], UIButton.prototype, "onChangeActivated", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.name')
    ], UIButton.prototype, "onChangeName", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.tooltip')
    ], UIButton.prototype, "onChangeTooltip", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.tabIndex')
    ], UIButton.prototype, "onChangeTabIndex", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.icon')
    ], UIButton.prototype, "onChangeIcon", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], UIButton.prototype, "onActionFire", null);
    UIButton = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIButton);
    return UIButton;
}(ui_1.UIElement));
exports.UIButton = UIButton;
function Button(jodit, stateOrText, text, variant) {
    var button = new UIButton(jodit);
    button.state.tabIndex = jodit.o.allowTabNavigation ? 0 : -1;
    if ((0, helpers_1.isString)(stateOrText)) {
        button.state.icon.name = stateOrText;
        button.state.name = stateOrText;
        if (variant) {
            button.state.variant = variant;
        }
        if (text) {
            button.state.text = text;
        }
    }
    else {
        button.setState(stateOrText);
    }
    return button;
}
exports.Button = Button;


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIButtonGroup = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(129);
var group_1 = __webpack_require__(130);
var decorators_1 = __webpack_require__(46);
var button_1 = __webpack_require__(126);
var helpers_1 = __webpack_require__(16);
var UIButtonGroup = (function (_super) {
    (0, tslib_1.__extends)(UIButtonGroup, _super);
    function UIButtonGroup(jodit, options) {
        if (options === void 0) { options = {
            radio: true
        }; }
        var _a, _b;
        var _this = _super.call(this, jodit, (_a = options.options) === null || _a === void 0 ? void 0 : _a.map(function (opt) {
            var btn = new button_1.UIButton(jodit, {
                text: opt.text,
                value: opt.value,
                variant: 'primary'
            });
            btn.onAction(function () {
                _this.select(opt.value);
            });
            return btn;
        }), options) || this;
        _this.options = options;
        _this.select((_b = options.value) !== null && _b !== void 0 ? _b : 0);
        return _this;
    }
    UIButtonGroup.prototype.className = function () {
        return 'UIButtonGroup';
    };
    UIButtonGroup.prototype.render = function (options) {
        return "<div>\n\t\t\t<div class=\"&__label\">~".concat(options.label, "~</div>\n\t\t\t<div class=\"&__options\"></div>\n\t\t</div>");
    };
    UIButtonGroup.prototype.appendChildToContainer = function (childContainer) {
        var options = this.getElm('options');
        (0, helpers_1.assert)(options != null, 'Options does not exist');
        options.appendChild(childContainer);
    };
    UIButtonGroup.prototype.select = function (indexOrValue) {
        var _this = this;
        var _a, _b;
        this.elements.forEach(function (elm, index) {
            if (index === indexOrValue || elm.state.value === indexOrValue) {
                elm.state.activated = true;
            }
            else if (_this.options.radio) {
                elm.state.activated = false;
            }
        });
        var result = this.elements
            .filter(function (elm) { return elm.state.activated; })
            .map(function (elm) { return ({
            text: elm.state.text,
            value: elm.state.value
        }); });
        this.jodit.e.fire(this, 'select', result);
        (_b = (_a = this.options).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, result);
    };
    UIButtonGroup = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIButtonGroup);
    return UIButtonGroup;
}(group_1.UIGroup));
exports.UIButtonGroup = UIButtonGroup;


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(131), exports);
(0, tslib_1.__exportStar)(__webpack_require__(133), exports);
(0, tslib_1.__exportStar)(__webpack_require__(137), exports);
(0, tslib_1.__exportStar)(__webpack_require__(138), exports);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIGroup = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(132);
var element_1 = __webpack_require__(120);
var decorators_1 = __webpack_require__(46);
var helpers_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(31);
var UIGroup = (function (_super) {
    (0, tslib_1.__extends)(UIGroup, _super);
    function UIGroup(jodit, elements, options) {
        var _this = _super.call(this, jodit, options) || this;
        _this.options = options;
        _this.syncMod = false;
        _this.elements = [];
        _this.buttonSize = 'middle';
        elements === null || elements === void 0 ? void 0 : elements.forEach(function (elm) { return elm && _this.append(elm); });
        if (options === null || options === void 0 ? void 0 : options.name) {
            _this.name = options.name;
        }
        return _this;
    }
    UIGroup_1 = UIGroup;
    UIGroup.prototype.className = function () {
        return 'UIGroup';
    };
    Object.defineProperty(UIGroup.prototype, "allChildren", {
        get: function () {
            var result = [];
            var stack = (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(this.elements), false);
            while (stack.length) {
                var elm = stack.shift();
                if ((0, helpers_1.isArray)(elm)) {
                    stack.push.apply(stack, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(elm), false));
                }
                else if (elm instanceof UIGroup_1) {
                    stack.push.apply(stack, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(elm.elements), false));
                }
                else {
                    elm && result.push(elm);
                }
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    UIGroup.prototype.update = function () {
        this.elements.forEach(function (elm) { return elm.update(); });
        this.setMod('size', this.buttonSize);
    };
    UIGroup.prototype.append = function (elm, distElement) {
        var _this = this;
        if ((0, helpers_1.isArray)(elm)) {
            elm.forEach(function (item) { return _this.append(item, distElement); });
            return this;
        }
        this.elements.push(elm);
        if (elm.name) {
            elm.container.classList.add(this.getFullElName(elm.name));
        }
        if (distElement) {
            var distElm = this.getElm(distElement);
            (0, helpers_1.assert)(distElm != null, 'Element does not exist');
            distElm.appendChild(elm.container);
        }
        else {
            this.appendChildToContainer(elm.container);
        }
        elm.parentElement = this;
        elm.update();
        return this;
    };
    UIGroup.prototype.setMod = function (name, value) {
        if (this.syncMod) {
            this.elements.forEach(function (elm) { return elm.setMod(name, value); });
        }
        return _super.prototype.setMod.call(this, name, value);
    };
    UIGroup.prototype.appendChildToContainer = function (childContainer) {
        this.container.appendChild(childContainer);
    };
    UIGroup.prototype.remove = function (elm) {
        var index = this.elements.indexOf(elm);
        if (index !== -1) {
            this.elements.splice(index, 1);
            dom_1.Dom.safeRemove(elm.container);
            elm.parentElement = null;
        }
        return this;
    };
    UIGroup.prototype.clear = function () {
        this.elements.forEach(function (elm) { return elm.destruct(); });
        this.elements.length = 0;
        return this;
    };
    UIGroup.prototype.destruct = function () {
        this.clear();
        return _super.prototype.destruct.call(this);
    };
    var UIGroup_1;
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('buttonSize')
    ], UIGroup.prototype, "update", null);
    UIGroup = UIGroup_1 = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIGroup);
    return UIGroup;
}(element_1.UIElement));
exports.UIGroup = UIGroup;


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIList = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(134);
var get_strong_control_types_1 = __webpack_require__(135);
var decorators_1 = __webpack_require__(46);
var group_1 = __webpack_require__(131);
var separator_1 = __webpack_require__(137);
var spacer_1 = __webpack_require__(138);
var button_1 = __webpack_require__(126);
var buttons_1 = __webpack_require__(139);
var get_control_type_1 = __webpack_require__(136);
var array_1 = __webpack_require__(117);
var UIList = (function (_super) {
    (0, tslib_1.__extends)(UIList, _super);
    function UIList(jodit) {
        var _this = _super.call(this, jodit) || this;
        _this.mode = 'horizontal';
        _this.removeButtons = [];
        _this.onChangeMode();
        return _this;
    }
    UIList.prototype.className = function () {
        return 'UIList';
    };
    UIList.prototype.onChangeMode = function () {
        this.setMod('mode', this.mode);
    };
    UIList.prototype.makeGroup = function () {
        return new group_1.UIGroup(this.jodit);
    };
    Object.defineProperty(UIList.prototype, "buttons", {
        get: function () {
            return this.allChildren.filter(function (elm) { return elm instanceof button_1.UIButton; });
        },
        enumerable: false,
        configurable: true
    });
    UIList.prototype.getButtonsNames = function () {
        return this.buttons
            .map(function (a) { return (a instanceof button_1.UIButton && a.state.name) || ''; })
            .filter(function (a) { return a !== ''; });
    };
    UIList.prototype.setRemoveButtons = function (removeButtons) {
        this.removeButtons = removeButtons || [];
        return this;
    };
    UIList.prototype.build = function (items, target) {
        var _this = this;
        if (target === void 0) { target = null; }
        items = (0, array_1.splitArray)(items);
        this.clear();
        var lastBtnSeparator = false;
        var line = this.makeGroup();
        this.append(line);
        line.setMod('line', true);
        var group;
        var addButton = function (control) {
            var elm = null;
            switch (control.name) {
                case '\n':
                    line = _this.makeGroup();
                    line.setMod('line', true);
                    group = _this.makeGroup();
                    line.append(group);
                    _this.append(line);
                    break;
                case '|':
                    if (!lastBtnSeparator) {
                        lastBtnSeparator = true;
                        elm = new separator_1.UISeparator(_this.j);
                    }
                    break;
                case '---': {
                    group.setMod('before-spacer', true);
                    var space = new spacer_1.UISpacer(_this.j);
                    line.append(space);
                    group = _this.makeGroup();
                    line.append(group);
                    lastBtnSeparator = false;
                    break;
                }
                default:
                    lastBtnSeparator = false;
                    elm = _this.makeButton(control, target);
            }
            if (elm) {
                if (!group) {
                    group = _this.makeGroup();
                    line.append(group);
                }
                group.append(elm);
            }
        };
        var isNotRemoved = function (b) {
            return !_this.removeButtons.includes(b.name);
        };
        items.forEach(function (item) {
            if ((0, buttons_1.isButtonGroup)(item)) {
                var buttons = item.buttons.filter(function (b) { return b; });
                if (buttons.length) {
                    group = _this.makeGroup();
                    group.setMod('separated', true).setMod('group', item.group);
                    line.append(group);
                    (0, get_strong_control_types_1.getStrongControlTypes)(buttons, _this.j.o.controls)
                        .filter(isNotRemoved)
                        .forEach(addButton);
                }
            }
            else {
                if (!group) {
                    group = _this.makeGroup();
                    line.append(group);
                }
                var control = (0, get_control_type_1.getControlType)(item, _this.j.o.controls);
                isNotRemoved(control) && addButton(control);
            }
        });
        this.update();
        return this;
    };
    UIList.prototype.makeButton = function (control, target) {
        return new button_1.UIButton(this.j);
    };
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('mode')
    ], UIList.prototype, "onChangeMode", null);
    UIList = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIList);
    return UIList;
}(group_1.UIGroup));
exports.UIList = UIList;


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStrongControlTypes = void 0;
var get_control_type_1 = __webpack_require__(136);
var config_1 = __webpack_require__(65);
var checker_1 = __webpack_require__(23);
var helpers_1 = __webpack_require__(16);
function getStrongControlTypes(items, controls) {
    var elements = (0, checker_1.isArray)(items)
        ? items
        : (0, helpers_1.keys)(items, false).map(function (key) {
            var value = items[key] || {};
            return (0, helpers_1.ConfigProto)({ name: key }, value);
        });
    return elements.map(function (item) {
        return (0, get_control_type_1.getControlType)(item, controls || config_1.Config.defaultOptions.controls);
    });
}
exports.getStrongControlTypes = getStrongControlTypes;


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findControlType = exports.getControlType = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(16);
var config_1 = __webpack_require__(65);
function getControlType(button, controls) {
    var buttonControl;
    if (!controls) {
        controls = config_1.Config.defaultOptions.controls;
    }
    if (!(0, helpers_1.isString)(button)) {
        buttonControl = (0, tslib_1.__assign)({ name: 'empty' }, (0, helpers_1.ConfigFlatten)(button));
        if (controls[buttonControl.name] !== undefined) {
            buttonControl = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, helpers_1.ConfigFlatten)(controls[buttonControl.name])), (0, helpers_1.ConfigFlatten)(buttonControl));
        }
    }
    else {
        buttonControl = findControlType(button, controls) || {
            name: button,
            command: button,
            tooltip: button
        };
    }
    return buttonControl;
}
exports.getControlType = getControlType;
function findControlType(path, controls) {
    var _a = (0, tslib_1.__read)(path.split(/\./), 2), namespaceOrKey = _a[0], key = _a[1];
    var store = controls;
    if (key != null) {
        if (controls[namespaceOrKey] !== undefined) {
            store = controls[namespaceOrKey];
        }
    }
    else {
        key = namespaceOrKey;
    }
    return store[key]
        ? (0, tslib_1.__assign)({ name: key }, (0, helpers_1.ConfigFlatten)(store[key])) : undefined;
}
exports.findControlType = findControlType;


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UISeparator = void 0;
var tslib_1 = __webpack_require__(1);
var element_1 = __webpack_require__(120);
var decorators_1 = __webpack_require__(46);
var UISeparator = (function (_super) {
    (0, tslib_1.__extends)(UISeparator, _super);
    function UISeparator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UISeparator.prototype.className = function () {
        return 'UISeparator';
    };
    UISeparator = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UISeparator);
    return UISeparator;
}(element_1.UIElement));
exports.UISeparator = UISeparator;


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UISpacer = void 0;
var tslib_1 = __webpack_require__(1);
var ui_1 = __webpack_require__(119);
var decorators_1 = __webpack_require__(46);
var UISpacer = (function (_super) {
    (0, tslib_1.__extends)(UISpacer, _super);
    function UISpacer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UISpacer.prototype.className = function () {
        return 'UISpacer';
    };
    UISpacer = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UISpacer);
    return UISpacer;
}(ui_1.UIElement));
exports.UISpacer = UISpacer;


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.flatButtonsSet = exports.isButtonGroup = void 0;
var tslib_1 = __webpack_require__(1);
var checker_1 = __webpack_require__(23);
var isButtonGroup = function (item) {
    return (0, checker_1.isArray)(item.buttons);
};
exports.isButtonGroup = isButtonGroup;
function flatButtonsSet(buttons, jodit) {
    var groups = jodit.getRegisteredButtonGroups();
    return new Set(buttons.reduce(function (acc, item) {
        var _a;
        if ((0, exports.isButtonGroup)(item)) {
            acc = acc.concat((0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(item.buttons), false), (0, tslib_1.__read)(((_a = groups[item.group]) !== null && _a !== void 0 ? _a : [])), false));
        }
        else {
            acc.push(item);
        }
        return acc;
    }, []));
}
exports.flatButtonsSet = flatButtonsSet;


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(141), exports);


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Popup = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(142);
var dom_1 = __webpack_require__(31);
var helpers_1 = __webpack_require__(16);
var global_1 = __webpack_require__(39);
var ui_1 = __webpack_require__(119);
var decorators_1 = __webpack_require__(46);
var Popup = (function (_super) {
    (0, tslib_1.__extends)(Popup, _super);
    function Popup(jodit, smart) {
        if (smart === void 0) { smart = true; }
        var _this = _super.call(this, jodit) || this;
        _this.smart = smart;
        _this.isOpened = false;
        _this.strategy = 'leftBottom';
        _this.viewBound = function () { return ({
            left: 0,
            top: 0,
            width: _this.ow.innerWidth,
            height: _this.ow.innerHeight
        }); };
        _this.childrenPopups = new Set();
        (0, helpers_1.attr)(_this.container, 'role', 'popup');
        return _this;
    }
    Popup.prototype.className = function () {
        return 'Popup';
    };
    Popup.prototype.updateParentElement = function (target) {
        var _this = this;
        if (target !== this && target instanceof Popup) {
            this.childrenPopups.forEach(function (popup) {
                if (!target.closest(popup) && popup.isOpened) {
                    popup.close();
                }
            });
            if (!this.childrenPopups.has(target)) {
                this.j.e.on(target, 'beforeClose', function () {
                    _this.childrenPopups.delete(target);
                });
            }
            this.childrenPopups.add(target);
        }
        return _super.prototype.updateParentElement.call(this, target);
    };
    Popup.prototype.setContent = function (content) {
        dom_1.Dom.detach(this.container);
        var box = this.j.c.div("".concat(this.componentName, "__content"));
        var elm;
        if (content instanceof ui_1.UIElement) {
            elm = content.container;
            content.parentElement = this;
        }
        else if ((0, helpers_1.isString)(content)) {
            elm = this.j.c.fromHTML(content);
        }
        else {
            elm = content;
        }
        box.appendChild(elm);
        this.container.appendChild(box);
        this.updatePosition();
        return this;
    };
    Popup.prototype.open = function (getBound, keepPosition) {
        if (keepPosition === void 0) { keepPosition = false; }
        (0, helpers_1.markOwner)(this.jodit, this.container);
        this.calculateZIndex();
        this.isOpened = true;
        this.addGlobalListeners();
        this.targetBound = !keepPosition
            ? getBound
            : this.getKeepBound(getBound);
        var parentContainer = (0, global_1.getContainer)(this.jodit, Popup);
        if (parentContainer !== this.container.parentElement) {
            parentContainer.appendChild(this.container);
        }
        this.updatePosition();
        this.j.e.fire(this, 'afterOpen');
        return this;
    };
    Popup.prototype.calculateZIndex = function () {
        var _this = this;
        if (this.container.style.zIndex) {
            return;
        }
        var checkView = function (view) {
            var zIndex = view.container.style.zIndex || view.o.zIndex;
            if (zIndex) {
                _this.setZIndex(1 + parseInt(zIndex.toString(), 10));
                return true;
            }
            return false;
        };
        if (checkView(this.j)) {
            return;
        }
        var pe = this.parentElement;
        while (pe) {
            if (checkView(pe.j)) {
                return;
            }
            if (pe.container.style.zIndex) {
                this.setZIndex(1 + parseInt(pe.container.style.zIndex.toString(), 10));
                return;
            }
            if (!pe.parentElement && pe.container.parentElement) {
                var elm = ui_1.UIElement.closestElement(pe.container.parentElement, ui_1.UIElement);
                if (elm) {
                    pe = elm;
                    continue;
                }
            }
            pe = pe.parentElement;
        }
    };
    Popup.prototype.getKeepBound = function (getBound) {
        var _this = this;
        var oldBound = getBound();
        var elmUnderCursor = this.od.elementFromPoint(oldBound.left, oldBound.top);
        if (!elmUnderCursor) {
            return getBound;
        }
        var element = dom_1.Dom.isHTMLElement(elmUnderCursor)
            ? elmUnderCursor
            : elmUnderCursor.parentElement;
        var oldPos = (0, helpers_1.position)(element, this.j);
        return function () {
            var bound = getBound();
            var newPos = (0, helpers_1.position)(element, _this.j);
            return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, bound), { top: bound.top + (newPos.top - oldPos.top), left: bound.left + (newPos.left - oldPos.left) });
        };
    };
    Popup.prototype.updatePosition = function () {
        if (!this.isOpened) {
            return this;
        }
        var _a = (0, tslib_1.__read)(this.calculatePosition(this.targetBound(), this.viewBound(), (0, helpers_1.position)(this.container, this.j)), 2), pos = _a[0], strategy = _a[1];
        this.setMod('strategy', strategy);
        (0, helpers_1.css)(this.container, {
            left: pos.left,
            top: pos.top
        });
        this.childrenPopups.forEach(function (popup) { return popup.updatePosition(); });
        return this;
    };
    Popup.prototype.throttleUpdatePosition = function () {
        this.updatePosition();
    };
    Popup.prototype.calculatePosition = function (target, view, container, defaultStrategy) {
        if (defaultStrategy === void 0) { defaultStrategy = this.strategy; }
        var x = {
            left: target.left,
            right: target.left - (container.width - target.width)
        }, y = {
            bottom: target.top + target.height,
            top: target.top - container.height
        };
        var list = Object.keys(x).reduce(function (keys, xKey) {
            return keys.concat(Object.keys(y).map(function (yKey) { return "".concat(xKey).concat((0, helpers_1.ucfirst)(yKey)); }));
        }, []);
        var getPointByStrategy = function (strategy) {
            var _a = (0, tslib_1.__read)((0, helpers_1.kebabCase)(strategy).split('-'), 2), xKey = _a[0], yKey = _a[1];
            return {
                left: x[xKey],
                top: y[yKey],
                width: container.width,
                height: container.height
            };
        };
        var getMatchStrategy = function (inBox) {
            var strategy = null;
            if (Popup.boxInView(getPointByStrategy(defaultStrategy), inBox)) {
                strategy = defaultStrategy;
            }
            else {
                strategy =
                    list.find(function (key) {
                        if (Popup.boxInView(getPointByStrategy(key), inBox)) {
                            return key;
                        }
                        return;
                    }) || null;
            }
            return strategy;
        };
        var strategy = getMatchStrategy((0, helpers_1.position)(this.j.container, this.j));
        if (!strategy || !Popup.boxInView(getPointByStrategy(strategy), view)) {
            strategy = getMatchStrategy(view) || strategy || defaultStrategy;
        }
        return [getPointByStrategy(strategy), strategy];
    };
    Popup.boxInView = function (box, view) {
        var accuracy = 2;
        return (box.top - view.top >= -accuracy &&
            box.left - view.left >= -accuracy &&
            view.top + view.height - (box.top + box.height) >= -accuracy &&
            view.left + view.width - (box.left + box.width) >= -accuracy);
    };
    Popup.prototype.close = function () {
        if (!this.isOpened) {
            return this;
        }
        this.isOpened = false;
        this.childrenPopups.forEach(function (popup) { return popup.close(); });
        this.j.e.fire(this, 'beforeClose');
        this.j.e.fire('beforePopupClose', this);
        this.removeGlobalListeners();
        dom_1.Dom.safeRemove(this.container);
        return this;
    };
    Popup.prototype.closeOnOutsideClick = function (e) {
        if (!this.isOpened) {
            return;
        }
        var target = ((0, helpers_1.isFunction)(e.composedPath) && e.composedPath()[0]) || e.target;
        if (!target) {
            this.close();
            return;
        }
        var box = ui_1.UIElement.closestElement(target, Popup);
        if (box && (this === box || box.closest(this))) {
            return;
        }
        this.close();
    };
    Popup.prototype.addGlobalListeners = function () {
        var _this = this;
        var up = this.throttleUpdatePosition, ow = this.ow;
        global_1.eventEmitter.on('closeAllPopups', this.close);
        if (this.smart) {
            this.j.e
                .on('escape', this.close)
                .on('mousedown touchstart', this.closeOnOutsideClick)
                .on(ow, 'mousedown touchstart', this.closeOnOutsideClick);
        }
        this.j.e
            .on('closeAllPopups', this.close)
            .on('resize', up)
            .on(this.container, 'scroll mousewheel', up)
            .on(ow, 'scroll', up)
            .on(ow, 'resize', up);
        dom_1.Dom.up(this.j.container, function (box) {
            box && _this.j.e.on(box, 'scroll mousewheel', up);
        });
    };
    Popup.prototype.removeGlobalListeners = function () {
        var _this = this;
        var up = this.throttleUpdatePosition, ow = this.ow;
        global_1.eventEmitter.off('closeAllPopups', this.close);
        if (this.smart) {
            this.j.e
                .off('escape', this.close)
                .off('mousedown touchstart', this.closeOnOutsideClick)
                .off(ow, 'mousedown touchstart', this.closeOnOutsideClick);
        }
        this.j.e
            .off('closeAllPopups', this.close)
            .off('resize', up)
            .off(this.container, 'scroll mousewheel', up)
            .off(ow, 'scroll', up)
            .off(ow, 'resize', up);
        dom_1.Dom.up(this.j.container, function (box) {
            box && _this.j.e.off(box, 'scroll mousewheel', up);
        });
    };
    Popup.prototype.setZIndex = function (index) {
        this.container.style.zIndex = index.toString();
    };
    Popup.prototype.destruct = function () {
        this.close();
        return _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Popup.prototype, "updatePosition", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.throttle)(10),
        decorators_1.autobind
    ], Popup.prototype, "throttleUpdatePosition", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Popup.prototype, "close", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Popup.prototype, "closeOnOutsideClick", null);
    return Popup;
}(ui_1.UIElement));
exports.Popup = Popup;


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(144), exports);
(0, tslib_1.__exportStar)(__webpack_require__(145), exports);
(0, tslib_1.__exportStar)(__webpack_require__(159), exports);


/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIForm = void 0;
var tslib_1 = __webpack_require__(1);
var ui_1 = __webpack_require__(119);
var utils_1 = __webpack_require__(17);
var decorators_1 = __webpack_require__(46);
var UIForm = (function (_super) {
    (0, tslib_1.__extends)(UIForm, _super);
    function UIForm() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a, _b;
        var _this = _super.apply(this, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false)) || this;
        if ((_a = _this.options) === null || _a === void 0 ? void 0 : _a.className) {
            _this.container.classList.add((_b = _this.options) === null || _b === void 0 ? void 0 : _b.className);
        }
        return _this;
    }
    UIForm.prototype.className = function () {
        return 'UIForm';
    };
    UIForm.prototype.submit = function () {
        this.j.e.fire(this.container, 'submit');
    };
    UIForm.prototype.validate = function () {
        var e_1, _a, e_2, _b;
        var inputs = this.allChildren.filter(function (elm) { return elm instanceof ui_1.UIInput; });
        try {
            for (var inputs_1 = (0, tslib_1.__values)(inputs), inputs_1_1 = inputs_1.next(); !inputs_1_1.done; inputs_1_1 = inputs_1.next()) {
                var input = inputs_1_1.value;
                if (!input.validate()) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1.return)) _a.call(inputs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var selects = this.allChildren.filter(function (elm) { return elm instanceof ui_1.UISelect; });
        try {
            for (var selects_1 = (0, tslib_1.__values)(selects), selects_1_1 = selects_1.next(); !selects_1_1.done; selects_1_1 = selects_1.next()) {
                var select = selects_1_1.value;
                if (!select.validate()) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (selects_1_1 && !selects_1_1.done && (_b = selects_1.return)) _b.call(selects_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    };
    UIForm.prototype.onSubmit = function (handler) {
        var _this = this;
        this.j.e.on(this.container, 'submit', function () {
            var inputs = _this.allChildren.filter(function (elm) { return elm instanceof ui_1.UIInput; });
            if (!_this.validate()) {
                return false;
            }
            handler(inputs.reduce(function (res, item) {
                res[item.state.name] = item.value;
                return res;
            }, {}));
            return false;
        });
    };
    UIForm.prototype.createContainer = function () {
        var form = this.j.c.element('form');
        form.classList.add(this.componentName);
        (0, utils_1.attr)(form, 'dir', this.j.o.direction || 'auto');
        return form;
    };
    UIForm = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIForm);
    return UIForm;
}(ui_1.UIGroup));
exports.UIForm = UIForm;


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(146), exports);
(0, tslib_1.__exportStar)(__webpack_require__(151), exports);
(0, tslib_1.__exportStar)(__webpack_require__(153), exports);
(0, tslib_1.__exportStar)(__webpack_require__(155), exports);
(0, tslib_1.__exportStar)(__webpack_require__(157), exports);


/***/ }),
/* 146 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIInput = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(147);
var element_1 = __webpack_require__(120);
var helpers_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(31);
var decorators_1 = __webpack_require__(46);
var icon_1 = __webpack_require__(124);
var validators_1 = __webpack_require__(148);
var UIInput = (function (_super) {
    (0, tslib_1.__extends)(UIInput, _super);
    function UIInput(jodit, options) {
        var _this = _super.call(this, jodit, options) || this;
        _this.label = _this.j.c.span(_this.getFullElName('label'));
        _this.icon = _this.j.c.span(_this.getFullElName('icon'));
        _this.clearButton = _this.j.c.span(_this.getFullElName('clear'), icon_1.Icon.get('cancel'));
        _this.state = (0, tslib_1.__assign)({}, UIInput_1.defaultState);
        _this.__errorBox = _this.j.c.span(_this.getFullElName('error'));
        _this.validators = new Set([]);
        if ((options === null || options === void 0 ? void 0 : options.value) !== undefined) {
            options.value = options.value.toString();
        }
        Object.assign(_this.state, options);
        if (_this.state.clearButton !== undefined) {
            _this.j.e
                .on(_this.clearButton, 'click', function (e) {
                e.preventDefault();
                _this.nativeInput.value = '';
                _this.j.e.fire(_this.nativeInput, 'input');
                _this.focus();
            })
                .on(_this.nativeInput, 'input', function () {
                _this.state.clearButton = Boolean(_this.value.length);
            });
            _this.state.clearButton = Boolean(_this.value.length);
        }
        _this.j.e
            .on(_this.nativeInput, 'focus blur', function () {
            _this.onChangeFocus();
        })
            .on(_this.nativeInput, 'input change', _this.onChangeValue);
        _this.onChangeState();
        _this.onChangeClassName();
        _this.onChangeStateValue();
        return _this;
    }
    UIInput_1 = UIInput;
    UIInput.prototype.className = function () {
        return 'UIInput';
    };
    UIInput.prototype.onChangeClear = function () {
        if (this.state.clearButton) {
            dom_1.Dom.after(this.nativeInput, this.clearButton);
        }
        else {
            dom_1.Dom.safeRemove(this.clearButton);
        }
    };
    UIInput.prototype.onChangeClassName = function (ignore, oldClassName) {
        oldClassName && this.container.classList.remove(oldClassName);
        this.state.className &&
            this.container.classList.add(this.state.className);
    };
    UIInput.prototype.onChangeState = function () {
        this.name = this.state.name;
        var input = this.nativeInput, _a = this.state, name = _a.name, icon = _a.icon, type = _a.type, ref = _a.ref, required = _a.required, placeholder = _a.placeholder, autocomplete = _a.autocomplete, label = _a.label;
        (0, helpers_1.attr)(input, 'name', name);
        (0, helpers_1.attr)(input, 'type', type);
        (0, helpers_1.attr)(input, 'data-ref', ref || name);
        (0, helpers_1.attr)(input, 'ref', ref || name);
        (0, helpers_1.attr)(input, 'required', required || null);
        (0, helpers_1.attr)(input, 'autocomplete', !autocomplete ? 'off' : null);
        (0, helpers_1.attr)(input, 'placeholder', placeholder ? this.j.i18n(placeholder) : '');
        if (icon && icon_1.Icon.exists(icon)) {
            dom_1.Dom.before(input, this.icon);
            this.icon.innerHTML = icon_1.Icon.get(icon);
        }
        else {
            dom_1.Dom.safeRemove(this.icon);
        }
        if (label) {
            dom_1.Dom.before(this.wrapper, this.label);
            this.label.innerText = this.j.i18n(label);
        }
        else {
            dom_1.Dom.safeRemove(this.label);
        }
        this.updateValidators();
    };
    UIInput.prototype.updateValidators = function () {
        var _this = this;
        var _a;
        this.validators.clear();
        if (this.state.required) {
            this.validators.add(validators_1.inputValidators.required);
        }
        (_a = this.state.validators) === null || _a === void 0 ? void 0 : _a.forEach(function (name) {
            var validator = validators_1.inputValidators[name];
            validator && _this.validators.add(validator);
        });
    };
    Object.defineProperty(UIInput.prototype, "error", {
        set: function (value) {
            this.setMod('has-error', Boolean(value));
            if (!value) {
                dom_1.Dom.safeRemove(this.__errorBox);
            }
            else {
                this.__errorBox.innerText = this.j.i18n(value, this.j.i18n(this.state.label || ''));
                this.container.appendChild(this.__errorBox);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIInput.prototype, "value", {
        get: function () {
            return this.nativeInput.value;
        },
        set: function (value) {
            if (this.value !== value) {
                this.nativeInput.value = value;
                this.onChangeValue();
            }
        },
        enumerable: false,
        configurable: true
    });
    UIInput.prototype.onChangeStateValue = function () {
        var value = this.state.value.toString();
        if (value !== this.value) {
            this.value = value;
        }
    };
    UIInput.prototype.onChangeValue = function () {
        var _a, _b;
        var value = this.value;
        if (this.state.value !== value) {
            this.state.value = value;
            this.j.e.fire(this, 'change', value);
            (_b = (_a = this.state).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        }
    };
    UIInput.prototype.validate = function () {
        var _this = this;
        this.error = '';
        return (0, helpers_1.toArray)(this.validators).every(function (validator) { return validator(_this); });
    };
    UIInput.prototype.createContainer = function (options) {
        var container = _super.prototype.createContainer.call(this);
        this.wrapper = this.j.c.div(this.getFullElName('wrapper'));
        if (!this.nativeInput) {
            this.nativeInput = this.createNativeInput();
        }
        var nativeInput = this.nativeInput;
        nativeInput.classList.add(this.getFullElName('input'));
        this.wrapper.appendChild(nativeInput);
        container.appendChild(this.wrapper);
        (0, helpers_1.attr)(nativeInput, 'dir', this.j.o.direction || 'auto');
        return container;
    };
    UIInput.prototype.createNativeInput = function (options) {
        return this.j.create.element('input');
    };
    UIInput.prototype.focus = function () {
        this.nativeInput.focus();
    };
    Object.defineProperty(UIInput.prototype, "isFocused", {
        get: function () {
            return this.nativeInput === this.j.od.activeElement;
        },
        enumerable: false,
        configurable: true
    });
    UIInput.prototype.onChangeFocus = function () {
        this.setMod('focused', this.isFocused);
    };
    var UIInput_1;
    UIInput.defaultState = {
        className: '',
        autocomplete: true,
        name: '',
        value: '',
        icon: '',
        label: '',
        ref: '',
        type: 'text',
        placeholder: '',
        required: false,
        validators: []
    };
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.clearButton')
    ], UIInput.prototype, "onChangeClear", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.className')
    ], UIInput.prototype, "onChangeClassName", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)([
            'state.name',
            'state.type',
            'state.label',
            'state.placeholder',
            'state.autocomplete',
            'state.icon'
        ]),
        (0, decorators_1.debounce)()
    ], UIInput.prototype, "onChangeState", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.value')
    ], UIInput.prototype, "onChangeStateValue", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], UIInput.prototype, "onChangeValue", null);
    UIInput = UIInput_1 = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIInput);
    return UIInput;
}(element_1.UIElement));
exports.UIInput = UIInput;


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.selectValidators = exports.inputValidators = void 0;
exports.inputValidators = __webpack_require__(149);
exports.selectValidators = __webpack_require__(150);


/***/ }),
/* 149 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.url = exports.required = void 0;
var helpers_1 = __webpack_require__(16);
exports.required = function (input) {
    if (!(0, helpers_1.trim)(input.value).length) {
        input.error = 'Please fill out this field';
        return false;
    }
    return true;
};
exports.url = function (input) {
    if (!(0, helpers_1.isURL)((0, helpers_1.trim)(input.value))) {
        input.error = 'Please enter a web address';
        return false;
    }
    return true;
};


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.required = void 0;
var helpers_1 = __webpack_require__(16);
exports.required = function (select) {
    if (!(0, helpers_1.trim)(select.value).length) {
        select.error = 'Please fill out this field';
        return false;
    }
    return true;
};


/***/ }),
/* 151 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UITextArea = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(152);
var input_1 = __webpack_require__(146);
var decorators_1 = __webpack_require__(46);
var UITextArea = (function (_super) {
    (0, tslib_1.__extends)(UITextArea, _super);
    function UITextArea(jodit, state) {
        var _this = _super.call(this, jodit, state) || this;
        _this.state = (0, tslib_1.__assign)({}, UITextArea_1.defaultState);
        Object.assign(_this.state, state);
        if (_this.state.resizable === false) {
            _this.nativeInput.style.resize = 'none';
        }
        return _this;
    }
    UITextArea_1 = UITextArea;
    UITextArea.prototype.className = function () {
        return 'UITextArea';
    };
    UITextArea.prototype.createContainer = function (options) {
        this.nativeInput = this.j.create.element('textarea');
        return _super.prototype.createContainer.call(this, options);
    };
    var UITextArea_1;
    UITextArea.defaultState = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, input_1.UIInput.defaultState), { size: 5, resizable: true });
    UITextArea = UITextArea_1 = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UITextArea);
    return UITextArea;
}(input_1.UIInput));
exports.UITextArea = UITextArea;


/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 153 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UICheckbox = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(154);
var input_1 = __webpack_require__(146);
var decorators_1 = __webpack_require__(46);
var dom_1 = __webpack_require__(31);
var UICheckbox = (function (_super) {
    (0, tslib_1.__extends)(UICheckbox, _super);
    function UICheckbox(jodit, options) {
        var _this = _super.call(this, jodit, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { type: 'checkbox' })) || this;
        _this.state = (0, tslib_1.__assign)({}, UICheckbox_1.defaultState);
        Object.assign(_this.state, options);
        return _this;
    }
    UICheckbox_1 = UICheckbox;
    UICheckbox.prototype.className = function () {
        return 'UICheckbox';
    };
    UICheckbox.prototype.render = function () {
        return this.j.c.element('label', {
            className: this.componentName
        });
    };
    UICheckbox.prototype.onChangeChecked = function () {
        this.value = this.state.checked.toString();
        this.nativeInput.checked = this.state.checked;
        this.setMod('checked', this.state.checked);
    };
    UICheckbox.prototype.onChangeNativeCheckBox = function () {
        this.state.checked = this.nativeInput.checked;
    };
    UICheckbox.prototype.onChangeSwitch = function () {
        this.setMod('switch', this.state.switch);
        var slider = this.getElm('switch-slider');
        if (this.state.switch) {
            if (!slider) {
                slider = this.j.c.div(this.getFullElName('switch-slider'));
            }
            dom_1.Dom.after(this.nativeInput, slider);
        }
        else {
            dom_1.Dom.safeRemove(slider);
        }
    };
    var UICheckbox_1;
    UICheckbox.defaultState = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, input_1.UIInput.defaultState), { checked: false, switch: false });
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.checked'),
        (0, decorators_1.hook)('ready')
    ], UICheckbox.prototype, "onChangeChecked", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('nativeInput:change')
    ], UICheckbox.prototype, "onChangeNativeCheckBox", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.switch'),
        (0, decorators_1.hook)('ready')
    ], UICheckbox.prototype, "onChangeSwitch", null);
    UICheckbox = UICheckbox_1 = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UICheckbox);
    return UICheckbox;
}(input_1.UIInput));
exports.UICheckbox = UICheckbox;


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UISelect = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(156);
var helpers_1 = __webpack_require__(16);
var decorators_1 = __webpack_require__(46);
var input_1 = __webpack_require__(146);
var validators_1 = __webpack_require__(148);
var UISelect = (function (_super) {
    (0, tslib_1.__extends)(UISelect, _super);
    function UISelect(jodit, state) {
        var _this = _super.call(this, jodit, state) || this;
        _this.state = (0, tslib_1.__assign)({}, UISelect_1.defaultState);
        Object.assign(_this.state, state);
        return _this;
    }
    UISelect_1 = UISelect;
    UISelect.prototype.className = function () {
        return 'UISelect';
    };
    UISelect.prototype.createContainer = function (state) {
        var _a;
        var container = _super.prototype.createContainer.call(this, state);
        var j = this.j, nativeInput = this.nativeInput;
        var opt = function () { return j.create.element('option'); };
        if (state.placeholder !== undefined) {
            var option = opt();
            option.value = '';
            option.text = j.i18n(state.placeholder);
            nativeInput.add(option);
        }
        (_a = state.options) === null || _a === void 0 ? void 0 : _a.forEach(function (element) {
            var option = opt();
            option.value = element.value.toString();
            option.text = j.i18n(element.text);
            nativeInput.add(option);
        });
        if (state.size && state.size > 0) {
            (0, helpers_1.attr)(nativeInput, 'size', state.size);
        }
        if (state.multiple) {
            (0, helpers_1.attr)(nativeInput, 'multiple', '');
        }
        return container;
    };
    UISelect.prototype.createNativeInput = function () {
        return this.j.create.element('select');
    };
    UISelect.prototype.updateValidators = function () {
        _super.prototype.updateValidators.call(this);
        if (this.state.required) {
            this.validators.delete(validators_1.inputValidators.required);
            this.validators.add(validators_1.selectValidators.required);
        }
    };
    var UISelect_1;
    UISelect.defaultState = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, input_1.UIInput.defaultState), { options: [], size: 1, multiple: false });
    UISelect = UISelect_1 = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UISelect);
    return UISelect;
}(input_1.UIInput));
exports.UISelect = UISelect;


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIFileInput = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(158);
var input_1 = __webpack_require__(146);
var decorators_1 = __webpack_require__(46);
var button_1 = __webpack_require__(125);
var UIFileInput = (function (_super) {
    (0, tslib_1.__extends)(UIFileInput, _super);
    function UIFileInput(jodit, options) {
        var _this = _super.call(this, jodit, (0, tslib_1.__assign)({ type: 'file' }, options)) || this;
        _this.state = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, input_1.UIInput.defaultState), { type: 'file', onlyImages: true });
        return _this;
    }
    UIFileInput.prototype.className = function () {
        return 'UIFileInput';
    };
    UIFileInput.prototype.createContainer = function (options) {
        this.button = new button_1.UIButton(this.j, {
            icon: {
                name: 'plus'
            }
        });
        var container = this.button.container;
        if (!this.nativeInput) {
            this.nativeInput = this.createNativeInput(options);
        }
        var nativeInput = this.nativeInput;
        nativeInput.classList.add(this.getFullElName('input'));
        container.classList.add(this.componentName);
        container.appendChild(nativeInput);
        return container;
    };
    UIFileInput.prototype.createNativeInput = function (options) {
        return this.j.create.fromHTML("<input\n\t\t\ttype=\"file\"\n\t\t\taccept=\"".concat(options.onlyImages ? 'image/*' : '*', "\"\n\t\t\ttabindex=\"-1\"\n\t\t\tdir=\"auto\"\n\t\t\tmultiple=\"\"\n\t\t/>"));
    };
    UIFileInput = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIFileInput);
    return UIFileInput;
}(input_1.UIInput));
exports.UIFileInput = UIFileInput;


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 159 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIBlock = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(160);
var group_1 = __webpack_require__(130);
var utils_1 = __webpack_require__(17);
var decorators_1 = __webpack_require__(46);
var UIBlock = (function (_super) {
    (0, tslib_1.__extends)(UIBlock, _super);
    function UIBlock(jodit, elements, options) {
        if (options === void 0) { options = {
            align: 'left'
        }; }
        var _this = _super.call(this, jodit, elements) || this;
        _this.options = options;
        _this.setMod('align', _this.options.align || 'left');
        _this.setMod('width', _this.options.width || '');
        _this.options.mod && _this.setMod(_this.options.mod, true);
        _this.options.className &&
            _this.container.classList.add(_this.options.className);
        (0, utils_1.attr)(_this.container, 'data-ref', options.ref);
        (0, utils_1.attr)(_this.container, 'ref', options.ref);
        return _this;
    }
    UIBlock.prototype.className = function () {
        return 'UIBlock';
    };
    UIBlock = (0, tslib_1.__decorate)([
        decorators_1.component
    ], UIBlock);
    return UIBlock;
}(group_1.UIGroup));
exports.UIBlock = UIBlock;


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 161 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressBar = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(162);
var dom_1 = __webpack_require__(31);
var element_1 = __webpack_require__(120);
var ProgressBar = (function (_super) {
    (0, tslib_1.__extends)(ProgressBar, _super);
    function ProgressBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgressBar.prototype.className = function () {
        return 'ProgressBar';
    };
    ProgressBar.prototype.render = function () {
        return '<div><div></div></div>';
    };
    ProgressBar.prototype.show = function () {
        var container = this.j.workplace || this.j.container;
        container.appendChild(this.container);
        return this;
    };
    ProgressBar.prototype.hide = function () {
        dom_1.Dom.safeRemove(this.container);
        return this;
    };
    ProgressBar.prototype.progress = function (percentage) {
        this.container.style.width = percentage.toFixed(2) + '%';
        return this;
    };
    ProgressBar.prototype.destruct = function () {
        this.hide();
        return _super.prototype.destruct.call(this);
    };
    return ProgressBar;
}(element_1.UIElement));
exports.ProgressBar = ProgressBar;


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 163 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.val = void 0;
var val = function (elm, selector, value) {
    var child = elm.querySelector(selector);
    if (!child) {
        return '';
    }
    if (value) {
        child.value = value;
    }
    return child.value;
};
exports.val = val;


/***/ }),
/* 164 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(165), exports);


/***/ }),
/* 165 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearTimeout = exports.setTimeout = void 0;
var tslib_1 = __webpack_require__(1);
function setTimeout(callback, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!timeout) {
        callback.call.apply(callback, (0, tslib_1.__spreadArray)([null], (0, tslib_1.__read)(args), false));
    }
    else {
        return window.setTimeout.apply(window, (0, tslib_1.__spreadArray)([callback, timeout], (0, tslib_1.__read)(args), false));
    }
    return 0;
}
exports.setTimeout = setTimeout;
function clearTimeout(timer) {
    window.clearTimeout(timer);
}
exports.clearTimeout = clearTimeout;


/***/ }),
/* 166 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(167), exports);
(0, tslib_1.__exportStar)(__webpack_require__(168), exports);
(0, tslib_1.__exportStar)(__webpack_require__(169), exports);
(0, tslib_1.__exportStar)(__webpack_require__(170), exports);
(0, tslib_1.__exportStar)(__webpack_require__(171), exports);


/***/ }),
/* 167 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.applyStyles = void 0;
var dom_1 = __webpack_require__(31);
var utils_1 = __webpack_require__(17);
var string_1 = __webpack_require__(59);
function normalizeCSS(s) {
    return s
        .replace(/mso-[a-z-]+:[\s]*[^;]+;/gi, '')
        .replace(/mso-[a-z-]+:[\s]*[^";]+$/gi, '')
        .replace(/border[a-z-]*:[\s]*[^;]+;/gi, '')
        .replace(/([0-9.]+)(pt|cm)/gi, function (match, units, metrics) {
        switch (metrics.toLowerCase()) {
            case 'pt':
                return (parseFloat(units) * 1.328).toFixed(0) + 'px';
            case 'cm':
                return (parseFloat(units) * 0.02645833).toFixed(0) + 'px';
        }
        return match;
    });
}
function applyStyles(html) {
    if (html.indexOf('<html ') === -1) {
        return html;
    }
    html = html.substring(html.indexOf('<html '), html.length);
    html = html.substring(0, html.lastIndexOf('</html>') + '</html>'.length);
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    var convertedString = '', collection = [], rules = [];
    try {
        var iframeDoc = iframe.contentDocument ||
            (iframe.contentWindow ? iframe.contentWindow.document : null);
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
            if (iframeDoc.styleSheets.length) {
                rules = iframeDoc.styleSheets[iframeDoc.styleSheets.length - 1].cssRules;
            }
            var _loop_1 = function (idx) {
                if (rules[idx].selectorText === '') {
                    return "continue";
                }
                collection = (0, utils_1.$$)(rules[idx].selectorText, iframeDoc.body);
                collection.forEach(function (elm) {
                    elm.style.cssText = normalizeCSS(rules[idx].style.cssText + ';' + elm.style.cssText);
                });
            };
            for (var idx = 0; idx < rules.length; idx += 1) {
                _loop_1(idx);
            }
            dom_1.Dom.each(iframeDoc.body, function (node) {
                if (dom_1.Dom.isElement(node)) {
                    var elm = node;
                    var css = elm.style.cssText;
                    if (css) {
                        elm.style.cssText = normalizeCSS(css);
                    }
                    if (elm.hasAttribute('lang')) {
                        elm.removeAttribute('lang');
                    }
                }
            });
            convertedString = iframeDoc.firstChild
                ? (0, string_1.trim)(iframeDoc.body.innerHTML)
                : '';
        }
    }
    catch (_a) {
    }
    finally {
        dom_1.Dom.safeRemove(iframe);
    }
    if (convertedString) {
        html = convertedString;
    }
    return (0, string_1.trim)(html
        .replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '')
        .replace(/<!--[^>]*>/g, ''));
}
exports.applyStyles = applyStyles;


/***/ }),
/* 168 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanFromWord = void 0;
var dom_1 = __webpack_require__(31);
var trim_1 = __webpack_require__(62);
var to_array_1 = __webpack_require__(5);
function cleanFromWord(html) {
    if (html.indexOf('<html ') !== -1) {
        html = html.substring(html.indexOf('<html '), html.length);
        html = html.substring(0, html.lastIndexOf('</html>') + '</html>'.length);
    }
    var convertedString = '';
    try {
        var div = document.createElement('div');
        div.innerHTML = html;
        var marks_1 = [];
        if (div.firstChild) {
            dom_1.Dom.all(div, function (node) {
                if (!node) {
                    return;
                }
                switch (node.nodeType) {
                    case Node.ELEMENT_NODE:
                        switch (node.nodeName) {
                            case 'STYLE':
                            case 'LINK':
                            case 'META':
                                marks_1.push(node);
                                break;
                            case 'W:SDT':
                            case 'W:SDTPR':
                            case 'FONT':
                                dom_1.Dom.unwrap(node);
                                break;
                            default:
                                (0, to_array_1.toArray)(node.attributes).forEach(function (attr) {
                                    if ([
                                        'src',
                                        'href',
                                        'rel',
                                        'content'
                                    ].indexOf(attr.name.toLowerCase()) === -1) {
                                        node.removeAttribute(attr.name);
                                    }
                                });
                        }
                        break;
                    case Node.TEXT_NODE:
                        break;
                    default:
                        marks_1.push(node);
                }
            });
        }
        marks_1.forEach(dom_1.Dom.safeRemove);
        convertedString = div.innerHTML;
    }
    catch (e) { }
    if (convertedString) {
        html = convertedString;
    }
    html = html.split(/(\n)/).filter(trim_1.trim).join('\n');
    return html
        .replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '')
        .replace(/<!--[^>]*>/g, '');
}
exports.cleanFromWord = cleanFromWord;


/***/ }),
/* 169 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.htmlspecialchars = void 0;
function htmlspecialchars(html) {
    var tmp = document.createElement('div');
    tmp.textContent = html;
    return tmp.innerHTML;
}
exports.htmlspecialchars = htmlspecialchars;


/***/ }),
/* 170 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.safeHTML = exports.stripTags = void 0;
var is_string_1 = __webpack_require__(10);
var utils_1 = __webpack_require__(17);
var trim_1 = __webpack_require__(62);
var dom_1 = __webpack_require__(31);
var utils_2 = __webpack_require__(17);
function stripTags(html, doc) {
    if (doc === void 0) { doc = document; }
    var tmp = doc.createElement('div');
    if ((0, is_string_1.isString)(html)) {
        tmp.innerHTML = html;
    }
    else {
        tmp.appendChild(html);
    }
    (0, utils_1.$$)('DIV, P, BR, H1, H2, H3, H4, H5, H6, HR', tmp).forEach(function (p) {
        var pr = p.parentNode;
        if (!pr) {
            return;
        }
        var nx = p.nextSibling;
        if (dom_1.Dom.isText(nx) && /^\s/.test(nx.nodeValue || '')) {
            return;
        }
        if (nx) {
            pr.insertBefore(doc.createTextNode(' '), nx);
        }
    });
    return (0, trim_1.trim)(tmp.innerText) || '';
}
exports.stripTags = stripTags;
function safeHTML(box, options) {
    if (!dom_1.Dom.isElement(box)) {
        return;
    }
    var removeOnError = function (elm) { return (0, utils_2.attr)(elm, 'onerror', null); }, safeLink = function (elm) {
        var href = elm.getAttribute('href');
        if (href && href.trim().indexOf('javascript') === 0) {
            (0, utils_2.attr)(elm, 'href', location.protocol + '//' + href);
        }
    };
    if (options.removeOnError) {
        removeOnError(box);
        (0, utils_1.$$)('[onerror]', box).forEach(removeOnError);
    }
    if (options.safeJavaScriptLink) {
        safeLink(box);
        (0, utils_1.$$)('a[href^="javascript"]', box).forEach(safeLink);
    }
}
exports.safeHTML = safeHTML;


/***/ }),
/* 171 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nl2br = void 0;
function nl2br(html) {
    return html.replace(/\r\n|\r|\n/g, '<br/>');
}
exports.nl2br = nl2br;


/***/ }),
/* 172 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(173), exports);
(0, tslib_1.__exportStar)(__webpack_require__(174), exports);
(0, tslib_1.__exportStar)(__webpack_require__(175), exports);
(0, tslib_1.__exportStar)(__webpack_require__(176), exports);
(0, tslib_1.__exportStar)(__webpack_require__(177), exports);
(0, tslib_1.__exportStar)(__webpack_require__(178), exports);


/***/ }),
/* 173 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContentWidth = void 0;
var getContentWidth = function (element, win) {
    var pi = function (value) { return parseInt(value, 10); }, style = win.getComputedStyle(element), width = element.offsetWidth, paddingLeft = pi(style.getPropertyValue('padding-left') || '0'), paddingRight = pi(style.getPropertyValue('padding-right') || '0');
    return width - paddingLeft - paddingRight;
};
exports.getContentWidth = getContentWidth;


/***/ }),
/* 174 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getScrollParent = void 0;
var utils_1 = __webpack_require__(17);
var dom_1 = __webpack_require__(31);
function getScrollParent(node) {
    if (!node) {
        return null;
    }
    var isElement = dom_1.Dom.isHTMLElement(node);
    var overflowY = isElement && (0, utils_1.css)(node, 'overflowY');
    var isScrollable = isElement && overflowY !== 'visible' && overflowY !== 'hidden';
    if (isScrollable && node.scrollHeight >= node.clientHeight) {
        return node;
    }
    return (getScrollParent(node.parentNode) ||
        document.scrollingElement ||
        document.body);
}
exports.getScrollParent = getScrollParent;


/***/ }),
/* 175 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.innerWidth = void 0;
var innerWidth = function (element, win) {
    var computedStyle = win.getComputedStyle(element);
    var elementWidth = element.clientWidth;
    elementWidth -=
        parseFloat(computedStyle.paddingLeft || '0') +
            parseFloat(computedStyle.paddingRight || '0');
    return elementWidth;
};
exports.innerWidth = innerWidth;


/***/ }),
/* 176 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.offset = void 0;
var offset = function (elm, jodit, doc, recurse) {
    if (recurse === void 0) { recurse = false; }
    var rect;
    try {
        rect = elm.getBoundingClientRect();
    }
    catch (e) {
        rect = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        };
    }
    var body = doc.body, docElem = doc.documentElement || {
        clientTop: 0,
        clientLeft: 0,
        scrollTop: 0,
        scrollLeft: 0
    }, win = doc.defaultView || doc.parentWindow, scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop, scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft, clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var topValue, leftValue;
    var iframe = jodit.iframe;
    if (!recurse && jodit && jodit.options && jodit.o.iframe && iframe) {
        var _a = (0, exports.offset)(iframe, jodit, jodit.od, true), top_1 = _a.top, left = _a.left;
        topValue = rect.top + top_1;
        leftValue = rect.left + left;
    }
    else {
        topValue = rect.top + scrollTop - clientTop;
        leftValue = rect.left + scrollLeft - clientLeft;
    }
    return {
        top: Math.round(topValue),
        left: Math.round(leftValue),
        width: rect.width,
        height: rect.height
    };
};
exports.offset = offset;


/***/ }),
/* 177 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.position = void 0;
var checker_1 = __webpack_require__(23);
function position(elm, jodit, recurse) {
    if (recurse === void 0) { recurse = false; }
    var rect = elm.getBoundingClientRect();
    var xPos = rect.left, yPos = rect.top;
    if ((0, checker_1.isJoditObject)(jodit) && jodit.iframe && !recurse) {
        var _a = position(jodit.iframe, jodit, true), left = _a.left, top_1 = _a.top;
        xPos += left;
        yPos += top_1;
    }
    return {
        left: Math.round(xPos),
        top: Math.round(yPos),
        width: Math.round(elm.offsetWidth),
        height: Math.round(elm.offsetHeight)
    };
}
exports.position = position;


/***/ }),
/* 178 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.size = void 0;
var checker_1 = __webpack_require__(23);
function size(subject) {
    if ((0, checker_1.isString)(subject) || (0, checker_1.isArray)(subject)) {
        return subject.length;
    }
    if ((0, checker_1.isPlainObject)(subject)) {
        return Object.keys(subject).length;
    }
    return 0;
}
exports.size = size;


/***/ }),
/* 179 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewComponent = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(15);
var ViewComponent = (function (_super) {
    (0, tslib_1.__extends)(ViewComponent, _super);
    function ViewComponent(jodit) {
        var _this = _super.call(this) || this;
        _this.setParentView(jodit);
        return _this;
    }
    Object.defineProperty(ViewComponent.prototype, "defaultTimeout", {
        get: function () {
            return this.j.defaultTimeout;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewComponent.prototype, "j", {
        get: function () {
            return this.jodit;
        },
        enumerable: false,
        configurable: true
    });
    ViewComponent.prototype.i18n = function (text) {
        var _a;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return (_a = this.j).i18n.apply(_a, (0, tslib_1.__spreadArray)([text], (0, tslib_1.__read)(params), false));
    };
    ViewComponent.prototype.setParentView = function (jodit) {
        this.jodit = jodit;
        jodit.components.add(this);
        return this;
    };
    ViewComponent.prototype.destruct = function () {
        this.j.components.delete(this);
        return _super.prototype.destruct.call(this);
    };
    return ViewComponent;
}(component_1.Component));
exports.ViewComponent = ViewComponent;


/***/ }),
/* 180 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(181), exports);


/***/ }),
/* 181 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Async = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(16);
var Async = (function () {
    function Async() {
        var _this = this;
        var _a, _b, _c, _d;
        this.timers = new Map();
        this.promisesRejections = new Set();
        this.requestsIdle = new Set();
        this.requestIdleCallbackNative = (_b = (_a = window['requestIdleCallback']) === null || _a === void 0 ? void 0 : _a.bind(window)) !== null && _b !== void 0 ? _b : (function (callback) {
            var start = Date.now();
            return _this.setTimeout(function () {
                callback({
                    didTimeout: false,
                    timeRemaining: function () { return Math.max(0, 50 - (Date.now() - start)); }
                });
            }, 1);
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
        if (!(0, helpers_1.isNumber)(timeout)) {
            options = timeout;
            timeout = options.timeout || 0;
        }
        if (options.label) {
            this.clearLabel(options.label);
        }
        var timer = helpers_1.setTimeout.apply(void 0, (0, tslib_1.__spreadArray)([callback, timeout], (0, tslib_1.__read)(args), false)), key = options.label || timer;
        this.timers.set(key, timer);
        return timer;
    };
    Async.prototype.clearLabel = function (label) {
        if (label && this.timers.has(label)) {
            (0, helpers_1.clearTimeout)(this.timers.get(label));
            this.timers.delete(label);
        }
    };
    Async.prototype.clearTimeout = function (timerOrLabel) {
        if ((0, helpers_1.isString)(timerOrLabel)) {
            return this.clearLabel(timerOrLabel);
        }
        (0, helpers_1.clearTimeout)(timerOrLabel);
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
                var res = fn.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false));
                fired = true;
                if (promises.length) {
                    var runPromises = function () {
                        promises.forEach(function (res) { return res(); });
                        promises.length = 0;
                    };
                    (0, helpers_1.isPromise)(res) ? res.finally(runPromises) : runPromises();
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
                callFn.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false));
            }
            else {
                if (!timer && firstCallImmediately) {
                    callFn.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false));
                }
                (0, helpers_1.clearTimeout)(timer);
                timer = _this.setTimeout(function () { return callFn.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false)); }, (0, helpers_1.isFunction)(timeout) ? timeout() : timeout);
                _this.timers.set(fn, timer);
            }
        };
        return (0, helpers_1.isPlainObject)(timeout) && timeout.promisify
            ? function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var promise = _this.promise(function (res) {
                    promises.push(res);
                });
                onFire.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(args), false));
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
                fn.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(lastArgs), false));
                return;
            }
            if (!timer) {
                callee = function () {
                    if (needInvoke) {
                        fn.apply(void 0, (0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(lastArgs), false));
                        needInvoke = false;
                        timer = _this.setTimeout(callee, (0, helpers_1.isFunction)(timeout) ? timeout() : timeout);
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
        promise.finally(function () {
            _this.promisesRejections.delete(rejectCallback);
        });
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
    Async.prototype.requestIdleCallback = function (callback) {
        var request = this.requestIdleCallbackNative(callback);
        this.requestsIdle.add(request);
        return request;
    };
    Async.prototype.requestIdlePromise = function () {
        var _this = this;
        return this.promise(function (res) {
            var request = _this.requestIdleCallback(function () { return res(request); });
        });
    };
    Async.prototype.cancelIdleCallback = function (request) {
        this.requestsIdle.delete(request);
        return this.cancelIdleCallbackNative(request);
    };
    Async.prototype.clear = function () {
        var _this = this;
        this.requestsIdle.forEach(function (key) {
            _this.cancelIdleCallback(key);
        });
        this.timers.forEach(function (key) {
            (0, helpers_1.clearTimeout)(_this.timers.get(key));
        });
        this.timers.clear();
        this.promisesRejections.forEach(function (reject) {
            reject();
        });
        this.promisesRejections.clear();
    };
    Async.prototype.destruct = function () {
        this.clear();
        this.isDestructed = true;
    };
    return Async;
}());
exports.Async = Async;


/***/ })
/******/ 	]);
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
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});