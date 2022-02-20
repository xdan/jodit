/*!
 * jodit - Jodit is awesome and usefully wysiwyg editor with filebrowser
 * Author: Chupurnov <chupurnov@gmail.com> (https://xdsoft.net/)
 * Version: v3.14.2
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
var decorators_1 = __webpack_require__(32);
var async_1 = __webpack_require__(181);
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
        decorators_1.autobind
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
var helpers_1 = __webpack_require__(5);
var modules_1 = __webpack_require__(180);
function attrsToDict(elm) {
    var _a, _b;
    var result = {};
    if (elm.nodeName === 'SCRIPT') {
        result.textContent = (_a = elm.textContent) !== null && _a !== void 0 ? _a : '';
    }
    if (elm.nodeType === Node.TEXT_NODE) {
        result.nodeValue = (_b = elm.nodeValue) !== null && _b !== void 0 ? _b : '';
    }
    if (modules_1.Dom.isElement(elm)) {
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
        props: (0, tslib_1.__assign)({ children: (0, helpers_1.toArray)(elm.childNodes).map(function (n) { return domToVDom(n, noNode); }) }, attrsToDict(elm))
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
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(6), exports);
(0, tslib_1.__exportStar)(__webpack_require__(117), exports);
(0, tslib_1.__exportStar)(__webpack_require__(165), exports);
(0, tslib_1.__exportStar)(__webpack_require__(36), exports);
(0, tslib_1.__exportStar)(__webpack_require__(99), exports);
(0, tslib_1.__exportStar)(__webpack_require__(167), exports);
(0, tslib_1.__exportStar)(__webpack_require__(90), exports);
(0, tslib_1.__exportStar)(__webpack_require__(173), exports);
(0, tslib_1.__exportStar)(__webpack_require__(81), exports);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(7), exports);
(0, tslib_1.__exportStar)(__webpack_require__(8), exports);
(0, tslib_1.__exportStar)(__webpack_require__(9), exports);
(0, tslib_1.__exportStar)(__webpack_require__(12), exports);
(0, tslib_1.__exportStar)(__webpack_require__(102), exports);
(0, tslib_1.__exportStar)(__webpack_require__(80), exports);
(0, tslib_1.__exportStar)(__webpack_require__(103), exports);
(0, tslib_1.__exportStar)(__webpack_require__(104), exports);
(0, tslib_1.__exportStar)(__webpack_require__(106), exports);
(0, tslib_1.__exportStar)(__webpack_require__(107), exports);
(0, tslib_1.__exportStar)(__webpack_require__(105), exports);
(0, tslib_1.__exportStar)(__webpack_require__(108), exports);
(0, tslib_1.__exportStar)(__webpack_require__(110), exports);
(0, tslib_1.__exportStar)(__webpack_require__(89), exports);
(0, tslib_1.__exportStar)(__webpack_require__(112), exports);
(0, tslib_1.__exportStar)(__webpack_require__(15), exports);
(0, tslib_1.__exportStar)(__webpack_require__(113), exports);
(0, tslib_1.__exportStar)(__webpack_require__(109), exports);
(0, tslib_1.__exportStar)(__webpack_require__(114), exports);
(0, tslib_1.__exportStar)(__webpack_require__(111), exports);
(0, tslib_1.__exportStar)(__webpack_require__(115), exports);
(0, tslib_1.__exportStar)(__webpack_require__(116), exports);
(0, tslib_1.__exportStar)(__webpack_require__(55), exports);
(0, tslib_1.__exportStar)(__webpack_require__(164), exports);


/***/ }),
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.memorizeExec = exports.keys = exports.loadImage = exports.reset = exports.callPromise = exports.markOwner = exports.attr = exports.call = void 0;
var tslib_1 = __webpack_require__(1);
var is_function_1 = __webpack_require__(10);
var is_promise_1 = __webpack_require__(11);
var get_1 = __webpack_require__(12);
var data_bind_1 = __webpack_require__(15);
var is_void_1 = __webpack_require__(14);
var checker_1 = __webpack_require__(36);
var css_1 = __webpack_require__(89);
var string_1 = __webpack_require__(81);
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
/* 10 */
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
/* 11 */
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
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.get = void 0;
var tslib_1 = __webpack_require__(1);
var is_string_1 = __webpack_require__(13);
var is_void_1 = __webpack_require__(14);
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
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dataBind = void 0;
var component_1 = __webpack_require__(16);
var checker_1 = __webpack_require__(36);
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
(0, tslib_1.__exportStar)(__webpack_require__(18), exports);
(0, tslib_1.__exportStar)(__webpack_require__(88), exports);


/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Component = void 0;
var helpers_1 = __webpack_require__(5);
var global_1 = __webpack_require__(19);
var statuses_1 = __webpack_require__(17);
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
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.eventEmitter = exports.getContainer = exports.extendLang = exports.lang = exports.modules = exports.pluginSystem = exports.uniqueUid = exports.instances = void 0;
var plugin_system_1 = __webpack_require__(20);
var dom_1 = __webpack_require__(21);
var event_emitter_1 = __webpack_require__(62);
var checker_1 = __webpack_require__(36);
var get_class_name_1 = __webpack_require__(80);
var string_1 = __webpack_require__(81);
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
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginSystem = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
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
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(22), exports);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dom = void 0;
var tslib_1 = __webpack_require__(1);
var consts = __webpack_require__(23);
var helpers_1 = __webpack_require__(5);
var selection_1 = __webpack_require__(24);
var constants_1 = __webpack_require__(23);
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
/* 23 */
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
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(25), exports);
(0, tslib_1.__exportStar)(__webpack_require__(31), exports);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommitStyle = exports.REPLACE = exports.INITIAL = exports.UNSET = exports.CHANGE = exports.UNWRAP = exports.WRAP = void 0;
var constants_1 = __webpack_require__(23);
var apply_style_1 = __webpack_require__(26);
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
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplyStyle = void 0;
var helpers_1 = __webpack_require__(5);
var api_1 = __webpack_require__(27);
var commit_style_1 = __webpack_require__(25);
var dom_1 = __webpack_require__(21);
var api_2 = __webpack_require__(27);
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
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(28), exports);
(0, tslib_1.__exportStar)(__webpack_require__(29), exports);
(0, tslib_1.__exportStar)(__webpack_require__(68), exports);
(0, tslib_1.__exportStar)(__webpack_require__(30), exports);
(0, tslib_1.__exportStar)(__webpack_require__(69), exports);
(0, tslib_1.__exportStar)(__webpack_require__(70), exports);
(0, tslib_1.__exportStar)(__webpack_require__(73), exports);
(0, tslib_1.__exportStar)(__webpack_require__(74), exports);
(0, tslib_1.__exportStar)(__webpack_require__(71), exports);
(0, tslib_1.__exportStar)(__webpack_require__(72), exports);
(0, tslib_1.__exportStar)(__webpack_require__(75), exports);
(0, tslib_1.__exportStar)(__webpack_require__(76), exports);
(0, tslib_1.__exportStar)(__webpack_require__(77), exports);
(0, tslib_1.__exportStar)(__webpack_require__(79), exports);
(0, tslib_1.__exportStar)(__webpack_require__(78), exports);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleCSS = void 0;
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var commit_style_1 = __webpack_require__(25);
var global_1 = __webpack_require__(19);
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
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleOrderedList = void 0;
var dom_1 = __webpack_require__(21);
var extract_1 = __webpack_require__(30);
var commit_style_1 = __webpack_require__(25);
var toggle_css_1 = __webpack_require__(28);
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
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractSelectedPart = void 0;
var select_1 = __webpack_require__(31);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
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
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Select = void 0;
var tslib_1 = __webpack_require__(1);
var consts = __webpack_require__(23);
var constants_1 = __webpack_require__(23);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var commit_style_1 = __webpack_require__(25);
var decorators_1 = __webpack_require__(32);
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
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autobind = void 0;
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(33), exports);
(0, tslib_1.__exportStar)(__webpack_require__(34), exports);
(0, tslib_1.__exportStar)(__webpack_require__(35), exports);
(0, tslib_1.__exportStar)(__webpack_require__(56), exports);
(0, tslib_1.__exportStar)(__webpack_require__(57), exports);
(0, tslib_1.__exportStar)(__webpack_require__(58), exports);
(0, tslib_1.__exportStar)(__webpack_require__(59), exports);
(0, tslib_1.__exportStar)(__webpack_require__(60), exports);
(0, tslib_1.__exportStar)(__webpack_require__(61), exports);
var autobind_decorator_1 = __webpack_require__(67);
Object.defineProperty(exports, "autobind", ({ enumerable: true, get: function () { return autobind_decorator_1.default; } }));


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cache = void 0;
var helpers_1 = __webpack_require__(5);
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
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.component = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
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
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throttle = exports.debounce = void 0;
var checker_1 = __webpack_require__(36);
var component_1 = __webpack_require__(16);
var error_1 = __webpack_require__(55);
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
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(37), exports);
(0, tslib_1.__exportStar)(__webpack_require__(38), exports);
(0, tslib_1.__exportStar)(__webpack_require__(39), exports);
(0, tslib_1.__exportStar)(__webpack_require__(40), exports);
(0, tslib_1.__exportStar)(__webpack_require__(10), exports);
(0, tslib_1.__exportStar)(__webpack_require__(42), exports);
(0, tslib_1.__exportStar)(__webpack_require__(43), exports);
(0, tslib_1.__exportStar)(__webpack_require__(44), exports);
(0, tslib_1.__exportStar)(__webpack_require__(45), exports);
(0, tslib_1.__exportStar)(__webpack_require__(47), exports);
(0, tslib_1.__exportStar)(__webpack_require__(48), exports);
(0, tslib_1.__exportStar)(__webpack_require__(49), exports);
(0, tslib_1.__exportStar)(__webpack_require__(50), exports);
(0, tslib_1.__exportStar)(__webpack_require__(46), exports);
(0, tslib_1.__exportStar)(__webpack_require__(51), exports);
(0, tslib_1.__exportStar)(__webpack_require__(11), exports);
(0, tslib_1.__exportStar)(__webpack_require__(13), exports);
(0, tslib_1.__exportStar)(__webpack_require__(53), exports);
(0, tslib_1.__exportStar)(__webpack_require__(54), exports);
(0, tslib_1.__exportStar)(__webpack_require__(14), exports);
(0, tslib_1.__exportStar)(__webpack_require__(52), exports);


/***/ }),
/* 37 */
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
/* 38 */
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
/* 39 */
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
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFastEqual = exports.isEqual = void 0;
var stringify_1 = __webpack_require__(41);
function isEqual(a, b) {
    return a === b || (0, stringify_1.stringify)(a) === (0, stringify_1.stringify)(b);
}
exports.isEqual = isEqual;
function isFastEqual(a, b) {
    return a === b;
}
exports.isFastEqual = isFastEqual;


/***/ }),
/* 41 */
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
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isHTML = void 0;
var is_string_1 = __webpack_require__(13);
var isHTML = function (str) {
    return (0, is_string_1.isString)(str) &&
        /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/m.test(str.replace(/[\r\n]/g, ''));
};
exports.isHTML = isHTML;


/***/ }),
/* 43 */
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
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasContainer = exports.isDestructable = exports.isInitable = void 0;
var is_function_1 = __webpack_require__(10);
var dom_1 = __webpack_require__(21);
var is_void_1 = __webpack_require__(14);
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
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isInt = void 0;
var is_numeric_1 = __webpack_require__(46);
var is_string_1 = __webpack_require__(13);
function isInt(value) {
    if ((0, is_string_1.isString)(value) && (0, is_numeric_1.isNumeric)(value)) {
        value = parseFloat(value);
    }
    return typeof value === 'number' && Number.isFinite(value) && !(value % 1);
}
exports.isInt = isInt;


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNumeric = void 0;
var is_string_1 = __webpack_require__(13);
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
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isViewObject = exports.isJoditObject = void 0;
var is_function_1 = __webpack_require__(10);
var global_1 = __webpack_require__(19);
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
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isLicense = void 0;
var is_string_1 = __webpack_require__(13);
var isLicense = function (license) {
    return (0, is_string_1.isString)(license) &&
        license.length === 23 &&
        /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}$/i.test(license);
};
exports.isLicense = isLicense;


/***/ }),
/* 49 */
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
/* 50 */
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
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPlainObject = void 0;
var is_window_1 = __webpack_require__(52);
function isPlainObject(obj) {
    if (!obj || typeof obj !== 'object' || obj.nodeType || (0, is_window_1.isWindow)(obj)) {
        return false;
    }
    return !(obj.constructor &&
        !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf'));
}
exports.isPlainObject = isPlainObject;


/***/ }),
/* 52 */
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
/* 53 */
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
/* 54 */
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
/* 55 */
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
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.idle = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(16);
var helpers_1 = __webpack_require__(5);
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
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hook = void 0;
var checker_1 = __webpack_require__(36);
var error_1 = __webpack_require__(55);
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
/* 58 */
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
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.persistent = void 0;
var component_1 = __webpack_require__(16);
var helpers_1 = __webpack_require__(5);
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
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wait = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
var component_1 = __webpack_require__(16);
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
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.watch = exports.getPropertyDescriptor = void 0;
var tslib_1 = __webpack_require__(1);
var checker_1 = __webpack_require__(36);
var event_emitter_1 = __webpack_require__(62);
var component_1 = __webpack_require__(16);
var split_array_1 = __webpack_require__(66);
var error_1 = __webpack_require__(55);
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
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(63), exports);
(0, tslib_1.__exportStar)(__webpack_require__(65), exports);
(0, tslib_1.__exportStar)(__webpack_require__(64), exports);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEmitter = void 0;
var tslib_1 = __webpack_require__(1);
var store_1 = __webpack_require__(64);
var is_string_1 = __webpack_require__(13);
var is_function_1 = __webpack_require__(10);
var is_array_1 = __webpack_require__(38);
var error_1 = __webpack_require__(55);
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
/* 64 */
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
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observable = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
var decorators_1 = __webpack_require__(32);
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
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitArray = void 0;
var is_string_1 = __webpack_require__(13);
function splitArray(a) {
    return (0, is_string_1.isString)(a) ? a.split(/[,\s]+/) : a;
}
exports.splitArray = splitArray;


/***/ }),
/* 67 */
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
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementHasSameStyleKeys = exports.elementHasSameStyle = void 0;
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
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
/* 69 */
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
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSuitChild = void 0;
var dom_1 = __webpack_require__(21);
var is_normal_node_1 = __webpack_require__(71);
var is_suit_element_1 = __webpack_require__(72);
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
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNormalNode = void 0;
var dom_1 = __webpack_require__(21);
function isNormalNode(elm) {
    return Boolean(elm && !dom_1.Dom.isEmptyTextNode(elm) && !dom_1.Dom.isTemporary(elm));
}
exports.isNormalNode = isNormalNode;


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSameStyleChild = exports.isSuitElement = void 0;
var is_normal_node_1 = __webpack_require__(71);
var element_has_same_style_1 = __webpack_require__(68);
var dom_1 = __webpack_require__(21);
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
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSuitParent = void 0;
var dom_1 = __webpack_require__(21);
var is_normal_node_1 = __webpack_require__(71);
var is_suit_element_1 = __webpack_require__(72);
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
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isInsideInvisibleElement = void 0;
var dom_1 = __webpack_require__(21);
function isInsideInvisibleElement(font, root) {
    return Boolean(dom_1.Dom.closest(font, ['style', 'script'], root));
}
exports.isInsideInvisibleElement = isInsideInvisibleElement;


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleCommitStyles = void 0;
var dom_1 = __webpack_require__(21);
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
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unwrapChildren = void 0;
var dom_1 = __webpack_require__(21);
var is_suit_element_1 = __webpack_require__(72);
var helpers_1 = __webpack_require__(5);
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
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapAndCommitStyle = void 0;
var dom_1 = __webpack_require__(21);
var wrap_unwrapped_text_1 = __webpack_require__(78);
var helpers_1 = __webpack_require__(5);
var wrap_ordered_list_1 = __webpack_require__(79);
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
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapUnwrappedText = void 0;
var dom_1 = __webpack_require__(21);
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
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrapOrderedList = void 0;
var dom_1 = __webpack_require__(21);
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
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getClassName = exports.keepNames = void 0;
var is_function_1 = __webpack_require__(10);
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
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(82), exports);
(0, tslib_1.__exportStar)(__webpack_require__(41), exports);
(0, tslib_1.__exportStar)(__webpack_require__(83), exports);
(0, tslib_1.__exportStar)(__webpack_require__(84), exports);
(0, tslib_1.__exportStar)(__webpack_require__(85), exports);
(0, tslib_1.__exportStar)(__webpack_require__(86), exports);


/***/ }),
/* 82 */
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
/* 83 */
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
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trimInv = exports.trim = void 0;
var constants_1 = __webpack_require__(23);
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
/* 85 */
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
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.i18n = exports.sprintf = void 0;
var config_1 = __webpack_require__(87);
var utils_1 = __webpack_require__(6);
var checker_1 = __webpack_require__(36);
var string_1 = __webpack_require__(81);
var global_1 = __webpack_require__(19);
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
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
var consts = __webpack_require__(23);
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
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewComponent = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(18);
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
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearCenterAlign = exports.css = void 0;
var checker_1 = __webpack_require__(36);
var normalize_1 = __webpack_require__(90);
var string_1 = __webpack_require__(81);
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
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(91), exports);
(0, tslib_1.__exportStar)(__webpack_require__(92), exports);
(0, tslib_1.__exportStar)(__webpack_require__(93), exports);
(0, tslib_1.__exportStar)(__webpack_require__(94), exports);
(0, tslib_1.__exportStar)(__webpack_require__(95), exports);
(0, tslib_1.__exportStar)(__webpack_require__(96), exports);
(0, tslib_1.__exportStar)(__webpack_require__(97), exports);
(0, tslib_1.__exportStar)(__webpack_require__(98), exports);
(0, tslib_1.__exportStar)(__webpack_require__(101), exports);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeKeyAliases = void 0;
var string_1 = __webpack_require__(81);
var constants_1 = __webpack_require__(23);
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
/* 92 */
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
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeNode = void 0;
var constants_1 = __webpack_require__(23);
var dom_1 = __webpack_require__(21);
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
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizePath = void 0;
var string_1 = __webpack_require__(81);
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
/* 95 */
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
/* 96 */
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
/* 97 */
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
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeCssValue = void 0;
var checker_1 = __webpack_require__(36);
var string_1 = __webpack_require__(81);
var color_1 = __webpack_require__(99);
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
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(100), exports);


/***/ }),
/* 100 */
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
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeColor = void 0;
var color_1 = __webpack_require__(99);
var string_1 = __webpack_require__(81);
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
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.set = void 0;
var is_string_1 = __webpack_require__(13);
var is_numeric_1 = __webpack_require__(46);
var is_array_1 = __webpack_require__(38);
var checker_1 = __webpack_require__(36);
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
/* 103 */
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
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadNextStyle = exports.loadNext = exports.appendStyleAsync = exports.appendScriptAsync = exports.appendScript = void 0;
var tslib_1 = __webpack_require__(1);
var complete_url_1 = __webpack_require__(105);
var checker_1 = __webpack_require__(36);
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
/* 105 */
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
/* 106 */
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
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildQuery = void 0;
var checker_1 = __webpack_require__(36);
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
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigFlatten = exports.ConfigProto = void 0;
var tslib_1 = __webpack_require__(1);
var extend_1 = __webpack_require__(109);
var checker_1 = __webpack_require__(36);
var config_1 = __webpack_require__(87);
var utils_1 = __webpack_require__(9);
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
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fastClone = exports.markAsAtomic = exports.isAtom = void 0;
var stringify_1 = __webpack_require__(41);
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
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertMediaUrlToVideoEmbed = void 0;
var checker_1 = __webpack_require__(36);
var parse_query_1 = __webpack_require__(111);
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
/* 111 */
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
var checker_1 = __webpack_require__(36);
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
var constants_1 = __webpack_require__(23);
var checker_1 = __webpack_require__(36);
var utils_1 = __webpack_require__(6);
var dom_1 = __webpack_require__(21);
var string_1 = __webpack_require__(81);
var array_1 = __webpack_require__(117);
var ui_1 = __webpack_require__(120);
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
var split_array_1 = __webpack_require__(66);
Object.defineProperty(exports, "splitArray", ({ enumerable: true, get: function () { return split_array_1.splitArray; } }));
var to_array_1 = __webpack_require__(119);
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
var is_array_1 = __webpack_require__(38);
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
exports.toArray = void 0;
var utils_1 = __webpack_require__(9);
var is_native_function_1 = __webpack_require__(49);
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
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(121), exports);
(0, tslib_1.__exportStar)(__webpack_require__(126), exports);
(0, tslib_1.__exportStar)(__webpack_require__(141), exports);
(0, tslib_1.__exportStar)(__webpack_require__(131), exports);
(0, tslib_1.__exportStar)(__webpack_require__(144), exports);
(0, tslib_1.__exportStar)(__webpack_require__(125), exports);
(0, tslib_1.__exportStar)(__webpack_require__(162), exports);


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIElement = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(21);
var traits_1 = __webpack_require__(122);
var helpers_1 = __webpack_require__(5);
var icon_1 = __webpack_require__(125);
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
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(123), exports);
(0, tslib_1.__exportStar)(__webpack_require__(124), exports);


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Elms = void 0;
var to_array_1 = __webpack_require__(119);
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
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mods = void 0;
var to_array_1 = __webpack_require__(119);
var is_void_1 = __webpack_require__(14);
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
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Icon = void 0;
var helpers_1 = __webpack_require__(5);
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
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(127), exports);
(0, tslib_1.__exportStar)(__webpack_require__(129), exports);


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = exports.UIButton = exports.UIButtonState = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(128);
var ui_1 = __webpack_require__(120);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var ui_2 = __webpack_require__(120);
var ui_3 = __webpack_require__(120);
var decorators_1 = __webpack_require__(32);
var component_1 = __webpack_require__(16);
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
/* 128 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIButtonGroup = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(130);
var group_1 = __webpack_require__(131);
var decorators_1 = __webpack_require__(32);
var button_1 = __webpack_require__(127);
var helpers_1 = __webpack_require__(5);
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
/* 130 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(132), exports);
(0, tslib_1.__exportStar)(__webpack_require__(134), exports);
(0, tslib_1.__exportStar)(__webpack_require__(138), exports);
(0, tslib_1.__exportStar)(__webpack_require__(139), exports);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIGroup = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(133);
var element_1 = __webpack_require__(121);
var decorators_1 = __webpack_require__(32);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
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
/* 133 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIList = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(135);
var get_strong_control_types_1 = __webpack_require__(136);
var decorators_1 = __webpack_require__(32);
var group_1 = __webpack_require__(132);
var separator_1 = __webpack_require__(138);
var spacer_1 = __webpack_require__(139);
var button_1 = __webpack_require__(127);
var buttons_1 = __webpack_require__(140);
var get_control_type_1 = __webpack_require__(137);
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
/* 135 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStrongControlTypes = void 0;
var get_control_type_1 = __webpack_require__(137);
var config_1 = __webpack_require__(87);
var checker_1 = __webpack_require__(36);
var helpers_1 = __webpack_require__(5);
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
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findControlType = exports.getControlType = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
var config_1 = __webpack_require__(87);
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
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UISeparator = void 0;
var tslib_1 = __webpack_require__(1);
var element_1 = __webpack_require__(121);
var decorators_1 = __webpack_require__(32);
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
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UISpacer = void 0;
var tslib_1 = __webpack_require__(1);
var ui_1 = __webpack_require__(120);
var decorators_1 = __webpack_require__(32);
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
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.flatButtonsSet = exports.isButtonGroup = void 0;
var tslib_1 = __webpack_require__(1);
var checker_1 = __webpack_require__(36);
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
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(142), exports);


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Popup = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(143);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var global_1 = __webpack_require__(19);
var ui_1 = __webpack_require__(120);
var decorators_1 = __webpack_require__(32);
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
/* 143 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(145), exports);
(0, tslib_1.__exportStar)(__webpack_require__(146), exports);
(0, tslib_1.__exportStar)(__webpack_require__(160), exports);


/***/ }),
/* 145 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIForm = void 0;
var tslib_1 = __webpack_require__(1);
var ui_1 = __webpack_require__(120);
var utils_1 = __webpack_require__(6);
var decorators_1 = __webpack_require__(32);
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
/* 146 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(147), exports);
(0, tslib_1.__exportStar)(__webpack_require__(152), exports);
(0, tslib_1.__exportStar)(__webpack_require__(154), exports);
(0, tslib_1.__exportStar)(__webpack_require__(156), exports);
(0, tslib_1.__exportStar)(__webpack_require__(158), exports);


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIInput = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(148);
var element_1 = __webpack_require__(121);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var decorators_1 = __webpack_require__(32);
var icon_1 = __webpack_require__(125);
var validators_1 = __webpack_require__(149);
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
/* 148 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 149 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.selectValidators = exports.inputValidators = void 0;
exports.inputValidators = __webpack_require__(150);
exports.selectValidators = __webpack_require__(151);


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.url = exports.required = void 0;
var helpers_1 = __webpack_require__(5);
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
/* 151 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.required = void 0;
var helpers_1 = __webpack_require__(5);
exports.required = function (select) {
    if (!(0, helpers_1.trim)(select.value).length) {
        select.error = 'Please fill out this field';
        return false;
    }
    return true;
};


/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UITextArea = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(153);
var input_1 = __webpack_require__(147);
var decorators_1 = __webpack_require__(32);
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
/* 153 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UICheckbox = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(155);
var input_1 = __webpack_require__(147);
var decorators_1 = __webpack_require__(32);
var dom_1 = __webpack_require__(21);
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
/* 155 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UISelect = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(157);
var helpers_1 = __webpack_require__(5);
var decorators_1 = __webpack_require__(32);
var input_1 = __webpack_require__(147);
var validators_1 = __webpack_require__(149);
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
/* 157 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIFileInput = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(159);
var input_1 = __webpack_require__(147);
var decorators_1 = __webpack_require__(32);
var button_1 = __webpack_require__(126);
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
/* 159 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UIBlock = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(161);
var group_1 = __webpack_require__(131);
var utils_1 = __webpack_require__(6);
var decorators_1 = __webpack_require__(32);
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
/* 161 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressBar = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(163);
var dom_1 = __webpack_require__(21);
var element_1 = __webpack_require__(121);
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
/* 163 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 164 */
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
/* 165 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(166), exports);


/***/ }),
/* 166 */
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
/* 167 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(168), exports);
(0, tslib_1.__exportStar)(__webpack_require__(169), exports);
(0, tslib_1.__exportStar)(__webpack_require__(170), exports);
(0, tslib_1.__exportStar)(__webpack_require__(171), exports);
(0, tslib_1.__exportStar)(__webpack_require__(172), exports);


/***/ }),
/* 168 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.applyStyles = void 0;
var dom_1 = __webpack_require__(21);
var utils_1 = __webpack_require__(6);
var string_1 = __webpack_require__(81);
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
/* 169 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanFromWord = void 0;
var dom_1 = __webpack_require__(21);
var trim_1 = __webpack_require__(84);
var to_array_1 = __webpack_require__(119);
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
/* 170 */
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
/* 171 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.safeHTML = exports.stripTags = void 0;
var is_string_1 = __webpack_require__(13);
var utils_1 = __webpack_require__(6);
var trim_1 = __webpack_require__(84);
var dom_1 = __webpack_require__(21);
var utils_2 = __webpack_require__(6);
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
/* 172 */
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
/* 173 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(174), exports);
(0, tslib_1.__exportStar)(__webpack_require__(175), exports);
(0, tslib_1.__exportStar)(__webpack_require__(176), exports);
(0, tslib_1.__exportStar)(__webpack_require__(177), exports);
(0, tslib_1.__exportStar)(__webpack_require__(178), exports);
(0, tslib_1.__exportStar)(__webpack_require__(179), exports);


/***/ }),
/* 174 */
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
/* 175 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getScrollParent = void 0;
var utils_1 = __webpack_require__(6);
var dom_1 = __webpack_require__(21);
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
/* 176 */
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
/* 177 */
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
/* 178 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.position = void 0;
var checker_1 = __webpack_require__(36);
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
/* 179 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.size = void 0;
var checker_1 = __webpack_require__(36);
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
/* 180 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PluginSystem = exports.Uploader = exports.ToolbarCollection = exports.ToolbarEditorCollection = exports.Table = exports.StatusBar = exports.Snapshot = exports.CommitStyle = exports.Select = exports.Observer = exports.ImageEditor = exports.Helpers = exports.ViewWithToolbar = exports.View = exports.Icon = exports.ProgressBar = exports.UIBlock = exports.UICheckbox = exports.UITextArea = exports.UIInput = exports.UIForm = exports.UIList = exports.UIGroup = exports.UISeparator = exports.Popup = exports.UIButton = exports.UIElement = exports.Create = exports.Plugin = exports.Dom = exports.ContextMenu = exports.STATUSES = exports.ViewComponent = exports.Component = exports.Async = void 0;
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(62), exports);
var async_1 = __webpack_require__(181);
Object.defineProperty(exports, "Async", ({ enumerable: true, get: function () { return async_1.Async; } }));
(0, tslib_1.__exportStar)(__webpack_require__(183), exports);
var component_1 = __webpack_require__(16);
Object.defineProperty(exports, "Component", ({ enumerable: true, get: function () { return component_1.Component; } }));
Object.defineProperty(exports, "ViewComponent", ({ enumerable: true, get: function () { return component_1.ViewComponent; } }));
Object.defineProperty(exports, "STATUSES", ({ enumerable: true, get: function () { return component_1.STATUSES; } }));
var context_menu_1 = __webpack_require__(187);
Object.defineProperty(exports, "ContextMenu", ({ enumerable: true, get: function () { return context_menu_1.ContextMenu; } }));
(0, tslib_1.__exportStar)(__webpack_require__(189), exports);
var dom_1 = __webpack_require__(21);
Object.defineProperty(exports, "Dom", ({ enumerable: true, get: function () { return dom_1.Dom; } }));
var plugin_1 = __webpack_require__(210);
Object.defineProperty(exports, "Plugin", ({ enumerable: true, get: function () { return plugin_1.Plugin; } }));
var create_1 = __webpack_require__(212);
Object.defineProperty(exports, "Create", ({ enumerable: true, get: function () { return create_1.Create; } }));
var ui_1 = __webpack_require__(120);
Object.defineProperty(exports, "UIElement", ({ enumerable: true, get: function () { return ui_1.UIElement; } }));
Object.defineProperty(exports, "UIButton", ({ enumerable: true, get: function () { return ui_1.UIButton; } }));
Object.defineProperty(exports, "Popup", ({ enumerable: true, get: function () { return ui_1.Popup; } }));
Object.defineProperty(exports, "UISeparator", ({ enumerable: true, get: function () { return ui_1.UISeparator; } }));
Object.defineProperty(exports, "UIGroup", ({ enumerable: true, get: function () { return ui_1.UIGroup; } }));
Object.defineProperty(exports, "UIList", ({ enumerable: true, get: function () { return ui_1.UIList; } }));
Object.defineProperty(exports, "UIForm", ({ enumerable: true, get: function () { return ui_1.UIForm; } }));
Object.defineProperty(exports, "UIInput", ({ enumerable: true, get: function () { return ui_1.UIInput; } }));
Object.defineProperty(exports, "UITextArea", ({ enumerable: true, get: function () { return ui_1.UITextArea; } }));
Object.defineProperty(exports, "UICheckbox", ({ enumerable: true, get: function () { return ui_1.UICheckbox; } }));
Object.defineProperty(exports, "UIBlock", ({ enumerable: true, get: function () { return ui_1.UIBlock; } }));
Object.defineProperty(exports, "ProgressBar", ({ enumerable: true, get: function () { return ui_1.ProgressBar; } }));
Object.defineProperty(exports, "Icon", ({ enumerable: true, get: function () { return ui_1.Icon; } }));
var view_1 = __webpack_require__(194);
Object.defineProperty(exports, "View", ({ enumerable: true, get: function () { return view_1.View; } }));
var view_with_toolbar_1 = __webpack_require__(192);
Object.defineProperty(exports, "ViewWithToolbar", ({ enumerable: true, get: function () { return view_with_toolbar_1.ViewWithToolbar; } }));
(0, tslib_1.__exportStar)(__webpack_require__(214), exports);
var Helpers = __webpack_require__(5);
exports.Helpers = Helpers;
var image_editor_1 = __webpack_require__(227);
Object.defineProperty(exports, "ImageEditor", ({ enumerable: true, get: function () { return image_editor_1.ImageEditor; } }));
var observer_1 = __webpack_require__(238);
Object.defineProperty(exports, "Observer", ({ enumerable: true, get: function () { return observer_1.Observer; } }));
var selection_1 = __webpack_require__(24);
Object.defineProperty(exports, "Select", ({ enumerable: true, get: function () { return selection_1.Select; } }));
Object.defineProperty(exports, "CommitStyle", ({ enumerable: true, get: function () { return selection_1.CommitStyle; } }));
var snapshot_1 = __webpack_require__(239);
Object.defineProperty(exports, "Snapshot", ({ enumerable: true, get: function () { return snapshot_1.Snapshot; } }));
var status_bar_1 = __webpack_require__(242);
Object.defineProperty(exports, "StatusBar", ({ enumerable: true, get: function () { return status_bar_1.StatusBar; } }));
var table_1 = __webpack_require__(244);
Object.defineProperty(exports, "Table", ({ enumerable: true, get: function () { return table_1.Table; } }));
var editor_collection_1 = __webpack_require__(202);
Object.defineProperty(exports, "ToolbarEditorCollection", ({ enumerable: true, get: function () { return editor_collection_1.ToolbarEditorCollection; } }));
var collection_1 = __webpack_require__(200);
Object.defineProperty(exports, "ToolbarCollection", ({ enumerable: true, get: function () { return collection_1.ToolbarCollection; } }));
(0, tslib_1.__exportStar)(__webpack_require__(245), exports);
var uploader_1 = __webpack_require__(246);
Object.defineProperty(exports, "Uploader", ({ enumerable: true, get: function () { return uploader_1.Uploader; } }));
var plugin_system_1 = __webpack_require__(20);
Object.defineProperty(exports, "PluginSystem", ({ enumerable: true, get: function () { return plugin_system_1.PluginSystem; } }));


/***/ }),
/* 181 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(182), exports);


/***/ }),
/* 182 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Async = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
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


/***/ }),
/* 183 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(184), exports);
(0, tslib_1.__exportStar)(__webpack_require__(185), exports);


/***/ }),
/* 184 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ajax = void 0;
var tslib_1 = __webpack_require__(1);
var config_1 = __webpack_require__(87);
var helpers_1 = __webpack_require__(5);
var response_1 = __webpack_require__(185);
__webpack_require__(186);
var Ajax = (function () {
    function Ajax(jodit, options) {
        var _this = this;
        this.jodit = jodit;
        this.resolved = false;
        this.activated = false;
        this.options = (0, helpers_1.ConfigProto)(options || {}, config_1.Config.prototype.defaultAjaxOptions);
        this.xhr = this.o.xhr ? this.o.xhr() : new XMLHttpRequest();
        jodit && jodit.e && jodit.e.on('beforeDestruct', function () { return _this.destruct(); });
    }
    Ajax.prototype.__buildParams = function (obj, prefix) {
        if ((0, helpers_1.isFunction)(this.o.queryBuild)) {
            return this.o.queryBuild.call(this, obj, prefix);
        }
        if ((0, helpers_1.isString)(obj) ||
            (this.j.ow.FormData &&
                obj instanceof this.j.ow.FormData)) {
            return obj;
        }
        return (0, helpers_1.buildQuery)(obj);
    };
    Object.defineProperty(Ajax.prototype, "o", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ajax.prototype, "j", {
        get: function () {
            return this.jodit;
        },
        enumerable: false,
        configurable: true
    });
    Ajax.prototype.abort = function () {
        try {
            this.xhr.abort();
        }
        catch (_a) { }
        return this;
    };
    Ajax.prototype.send = function () {
        var _this = this;
        this.activated = true;
        var _a = this, xhr = _a.xhr, o = _a.o;
        var request = this.prepareRequest();
        return this.j.async.promise(function (resolve, reject) {
            var _a;
            var onReject = function () {
                reject((0, helpers_1.error)('Connection error'));
            };
            var onResolve = function () {
                _this.resolved = true;
                resolve(new response_1.Response(request, xhr.status, xhr.statusText, !xhr.responseType ? xhr.responseText : xhr.response));
            };
            xhr.onload = onResolve;
            xhr.onabort = onReject;
            xhr.onerror = onReject;
            xhr.ontimeout = onReject;
            if (o.responseType) {
                xhr.responseType = o.responseType;
            }
            xhr.onprogress = function (e) {
                var _a, _b;
                var percentComplete = 0;
                if (e.lengthComputable) {
                    percentComplete = (e.loaded / e.total) * 100;
                }
                (_b = (_a = _this.options).onProgress) === null || _b === void 0 ? void 0 : _b.call(_a, percentComplete);
            };
            xhr.onreadystatechange = function () {
                var _a, _b;
                (_b = (_a = _this.options).onProgress) === null || _b === void 0 ? void 0 : _b.call(_a, 10);
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (o.successStatuses.includes(xhr.status)) {
                        onResolve();
                    }
                    else {
                        reject((0, helpers_1.error)(xhr.statusText || 'Connection error'));
                    }
                }
            };
            xhr.withCredentials = (_a = o.withCredentials) !== null && _a !== void 0 ? _a : false;
            var url = request.url, data = request.data, method = request.method;
            xhr.open(method, url, true);
            if (o.contentType && xhr.setRequestHeader) {
                xhr.setRequestHeader('Content-type', o.contentType);
            }
            var headers = o.headers;
            if (headers && xhr.setRequestHeader) {
                Object.keys(headers).forEach(function (key) {
                    xhr.setRequestHeader(key, headers[key]);
                });
            }
            _this.j.async.setTimeout(function () {
                xhr.send(data ? _this.__buildParams(data) : undefined);
            }, 0);
        });
    };
    Ajax.prototype.prepareRequest = function () {
        if (!this.o.url) {
            throw (0, helpers_1.error)('Need URL for AJAX request');
        }
        var url = this.o.url;
        var data = this.o.data;
        var method = (this.o.method || 'get').toLowerCase();
        if (method === 'get' && data && (0, helpers_1.isPlainObject)(data)) {
            var qIndex = url.indexOf('?');
            if (qIndex !== -1) {
                var urlData = (0, helpers_1.parseQuery)(url);
                url =
                    url.substr(0, qIndex) +
                        '?' +
                        (0, helpers_1.buildQuery)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, urlData), data));
            }
            else {
                url += '?' + (0, helpers_1.buildQuery)(this.o.data);
            }
        }
        var request = {
            url: url,
            method: method,
            data: data
        };
        Ajax.log.splice(100);
        Ajax.log.push(request);
        return request;
    };
    Ajax.prototype.destruct = function () {
        if (this.activated && !this.resolved) {
            this.abort();
            this.resolved = true;
        }
    };
    Ajax.log = [];
    return Ajax;
}());
exports.Ajax = Ajax;


/***/ }),
/* 185 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Response = void 0;
var tslib_1 = __webpack_require__(1);
var Response = (function () {
    function Response(request, status, statusText, body) {
        this.request = request;
        this.status = status;
        this.statusText = statusText;
        this.body = body;
    }
    Object.defineProperty(Response.prototype, "url", {
        get: function () {
            return this.request.url;
        },
        enumerable: false,
        configurable: true
    });
    Response.prototype.json = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2, JSON.parse(this.body)];
            });
        });
    };
    Response.prototype.text = function () {
        return Promise.resolve(this.body);
    };
    Response.prototype.blob = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2, this.body];
            });
        });
    };
    return Response;
}());
exports.Response = Response;


/***/ }),
/* 186 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __webpack_require__(87);
config_1.Config.prototype.defaultAjaxOptions = {
    successStatuses: [200, 201, 202],
    dataType: 'json',
    method: 'GET',
    url: '',
    data: null,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest'
    },
    withCredentials: false,
    xhr: function () {
        return new XMLHttpRequest();
    }
};


/***/ }),
/* 187 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContextMenu = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(188);
var popup_1 = __webpack_require__(141);
var button_1 = __webpack_require__(126);
var checker_1 = __webpack_require__(36);
var ContextMenu = (function (_super) {
    (0, tslib_1.__extends)(ContextMenu, _super);
    function ContextMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContextMenu.prototype.className = function () {
        return 'ContextMenu';
    };
    ContextMenu.prototype.show = function (x, y, actions) {
        var _this = this;
        var self = this, content = this.j.c.div(this.getFullElName('actions'));
        if (!(0, checker_1.isArray)(actions)) {
            return;
        }
        actions.forEach(function (item) {
            if (!item) {
                return;
            }
            var action = (0, button_1.Button)(_this.jodit, item.icon || 'empty', item.title);
            _this.jodit && action.setParentView(_this.jodit);
            action.setMod('context', 'menu');
            action.onAction(function (e) {
                var _a;
                (_a = item.exec) === null || _a === void 0 ? void 0 : _a.call(self, e);
                self.close();
                return false;
            });
            content.appendChild(action.container);
        });
        _super.prototype.setContent.call(this, content)
            .open(function () { return ({ left: x, top: y, width: 0, height: 0 }); }, true);
    };
    return ContextMenu;
}(popup_1.Popup));
exports.ContextMenu = ContextMenu;


/***/ }),
/* 188 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 189 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Confirm = exports.Prompt = exports.Alert = exports.Dialog = void 0;
var dialog_1 = __webpack_require__(190);
Object.defineProperty(exports, "Dialog", ({ enumerable: true, get: function () { return dialog_1.Dialog; } }));
var alert_1 = __webpack_require__(207);
Object.defineProperty(exports, "Alert", ({ enumerable: true, get: function () { return alert_1.Alert; } }));
var prompt_1 = __webpack_require__(208);
Object.defineProperty(exports, "Prompt", ({ enumerable: true, get: function () { return prompt_1.Prompt; } }));
var confirm_1 = __webpack_require__(209);
Object.defineProperty(exports, "Confirm", ({ enumerable: true, get: function () { return confirm_1.Confirm; } }));


/***/ }),
/* 190 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dialog = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(191);
var config_1 = __webpack_require__(87);
var constants_1 = __webpack_require__(23);
var helpers_1 = __webpack_require__(5);
var view_with_toolbar_1 = __webpack_require__(192);
var dom_1 = __webpack_require__(21);
var component_1 = __webpack_require__(16);
var global_1 = __webpack_require__(19);
var decorators_1 = __webpack_require__(32);
var view_1 = __webpack_require__(194);
var ui_1 = __webpack_require__(120);
config_1.Config.prototype.dialog = {
    namespace: '',
    extraButtons: [],
    resizable: true,
    draggable: true,
    buttons: ['dialog.close'],
    removeButtons: []
};
config_1.Config.prototype.controls.dialog = {
    close: {
        icon: 'cancel',
        exec: function (dialog) {
            dialog.close();
            dialog.toggleFullSizeBox(false);
        }
    }
};
var Dialog = (function (_super) {
    (0, tslib_1.__extends)(Dialog, _super);
    function Dialog(options) {
        var _this = _super.call(this, options) || this;
        _this.destroyAfterClose = false;
        _this.moved = false;
        _this.iSetMaximization = false;
        _this.resizable = false;
        _this.draggable = false;
        _this.startX = 0;
        _this.startY = 0;
        _this.startPoint = { x: 0, y: 0, w: 0, h: 0 };
        _this.lockSelect = function () {
            _this.setMod('moved', true);
        };
        _this.unlockSelect = function () {
            _this.setMod('moved', false);
        };
        _this.onResize = function () {
            if (_this.options &&
                _this.o.resizable &&
                !_this.moved &&
                _this.isOpened &&
                !_this.offsetX &&
                !_this.offsetY) {
                _this.setPosition();
            }
        };
        _this.isModal = false;
        _this.isOpened = false;
        var self = _this;
        self.options = (0, helpers_1.ConfigProto)(options !== null && options !== void 0 ? options : {}, (0, helpers_1.ConfigProto)({
            toolbarButtonSize: 'middle'
        }, (0, helpers_1.ConfigProto)(config_1.Config.prototype.dialog, view_1.View.defaultOptions)));
        dom_1.Dom.safeRemove(self.container);
        var n = _this.getFullElName.bind(_this);
        self.container = _this.c.fromHTML("<div style=\"z-index:".concat(self.o.zIndex, "\" class=\"jodit jodit-dialog ").concat(_this.componentName, "\">\n\t\t\t\t<div class=\"").concat(n('overlay'), "\"></div>\n\t\t\t\t<div class=\"").concat(_this.getFullElName('panel'), "\">\n\t\t\t\t\t<div class=\"").concat(n('header'), "\">\n\t\t\t\t\t\t<div class=\"").concat(n('header-title'), "\"></div>\n\t\t\t\t\t\t<div class=\"").concat(n('header-toolbar'), "\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"").concat(n('content'), "\"></div>\n\t\t\t\t\t<div class=\"").concat(n('footer'), "\"></div>\n\t\t\t\t\t<div class=\"").concat(n('resizer'), "\">").concat(ui_1.Icon.get('resize_handler'), "</div>\n\t\t\t\t</div>\n\t\t\t</div>"));
        (0, helpers_1.attr)(self.container, 'role', 'dialog');
        Object.defineProperty(self.container, 'component', {
            value: _this
        });
        self.setMod('theme', self.o.theme || 'default').setMod('resizable', Boolean(self.o.resizable));
        var dialog = self.getElm('panel');
        (0, helpers_1.assert)(dialog != null, 'Panel element does not exist');
        var resizer = self.getElm('resizer');
        (0, helpers_1.assert)(resizer != null, 'Resizer element does not exist');
        var dialogbox_header = self.getElm('header-title');
        (0, helpers_1.assert)(dialogbox_header != null, 'header-title element does not exist');
        var dialogbox_content = self.getElm('content');
        (0, helpers_1.assert)(dialogbox_content != null, 'Content element does not exist');
        var dialogbox_footer = self.getElm('footer');
        (0, helpers_1.assert)(dialogbox_footer != null, 'Footer element does not exist');
        var dialogbox_toolbar = self.getElm('header-toolbar');
        (0, helpers_1.assert)(dialogbox_toolbar != null, 'header-toolbar element does not exist');
        self.dialog = dialog;
        self.resizer = resizer;
        self.dialogbox_header = dialogbox_header;
        self.dialogbox_content = dialogbox_content;
        self.dialogbox_footer = dialogbox_footer;
        self.dialogbox_toolbar = dialogbox_toolbar;
        (0, helpers_1.css)(self.dialog, {
            maxWidth: self.options.maxWidth,
            minHeight: self.options.minHeight,
            minWidth: self.options.minWidth
        });
        var headerBox = self.getElm('header');
        headerBox &&
            self.e.on(headerBox, 'pointerdown touchstart', self.onHeaderMouseDown);
        self.e.on(self.resizer, 'mousedown touchstart', self.onResizerMouseDown);
        var fullSize = global_1.pluginSystem.get('fullsize');
        (0, helpers_1.isFunction)(fullSize) && fullSize(self);
        _this.e
            .on(self.container, 'close_dialog', self.close)
            .on(_this.ow, 'keydown', _this.onEsc)
            .on(_this.ow, 'resize', _this.onResize);
        return _this;
    }
    Dialog.prototype.className = function () {
        return 'Dialog';
    };
    Object.defineProperty(Dialog.prototype, "destination", {
        get: function () {
            return this.od.body;
        },
        enumerable: false,
        configurable: true
    });
    Dialog.prototype.setElements = function (root, elements) {
        var _this = this;
        var elements_list = [];
        (0, helpers_1.asArray)(elements).forEach(function (elm) {
            if ((0, helpers_1.isArray)(elm)) {
                var div = _this.c.div(_this.getFullElName('column'));
                elements_list.push(div);
                root.appendChild(div);
                return _this.setElements(div, elm);
            }
            var element;
            if ((0, helpers_1.isString)(elm)) {
                element = _this.c.fromHTML(elm);
            }
            else {
                element = (0, helpers_1.hasContainer)(elm) ? elm.container : elm;
            }
            elements_list.push(element);
            if (element.parentNode !== root) {
                root.appendChild(element);
            }
        });
        (0, helpers_1.toArray)(root.childNodes).forEach(function (elm) {
            if (elements_list.indexOf(elm) === -1) {
                root.removeChild(elm);
            }
        });
    };
    Dialog.prototype.onMouseUp = function () {
        if (this.draggable || this.resizable) {
            this.removeGlobalResizeListeners();
            this.draggable = false;
            this.resizable = false;
            this.unlockSelect();
            if (this.e) {
                this.removeGlobalResizeListeners();
                this.e.fire(this, 'endResize endMove');
            }
        }
    };
    Dialog.prototype.onHeaderMouseDown = function (e) {
        var target = e.target;
        if (!this.o.draggable ||
            (target && target.nodeName.match(/^(INPUT|SELECT)$/))) {
            return;
        }
        this.draggable = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPoint.x = (0, helpers_1.css)(this.dialog, 'left');
        this.startPoint.y = (0, helpers_1.css)(this.dialog, 'top');
        this.setMaxZIndex();
        if (e.cancelable) {
            e.preventDefault();
        }
        this.lockSelect();
        this.addGlobalResizeListeners();
        if (this.e) {
            this.e.fire(this, 'startMove');
        }
    };
    Dialog.prototype.onMouseMove = function (e) {
        if (this.draggable && this.o.draggable) {
            this.setPosition(this.startPoint.x + e.clientX - this.startX, this.startPoint.y + e.clientY - this.startY);
            if (this.e) {
                this.e.fire(this, 'move', e.clientX - this.startX, e.clientY - this.startY);
            }
            e.stopImmediatePropagation();
        }
        if (this.resizable && this.o.resizable) {
            this.setSize(this.startPoint.w + e.clientX - this.startX, this.startPoint.h + e.clientY - this.startY);
            if (this.e) {
                this.e.fire(this, 'resizeDialog', e.clientX - this.startX, e.clientY - this.startY);
            }
        }
    };
    Dialog.prototype.onEsc = function (e) {
        if (this.isOpened &&
            e.key === constants_1.KEY_ESC &&
            this.getMod('static') !== true) {
            var me = this.getMaxZIndexDialog();
            if (me) {
                me.close();
            }
            else {
                this.close();
            }
            e.stopImmediatePropagation();
        }
    };
    Dialog.prototype.onResizerMouseDown = function (e) {
        this.resizable = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startPoint.w = this.dialog.offsetWidth;
        this.startPoint.h = this.dialog.offsetHeight;
        this.lockSelect();
        this.addGlobalResizeListeners();
        if (this.e) {
            this.e.fire(this, 'startResize');
        }
    };
    Dialog.prototype.addGlobalResizeListeners = function () {
        var self = this;
        self.e
            .on(self.ow, 'pointermove touchmove', self.onMouseMove)
            .on(self.ow, 'pointerup touchend', self.onMouseUp);
    };
    Dialog.prototype.removeGlobalResizeListeners = function () {
        var self = this;
        self.e
            .off(self.ow, 'mousemove pointermove', self.onMouseMove)
            .off(self.ow, 'mouseup pointerup', self.onMouseUp);
    };
    Dialog.prototype.setSize = function (w, h) {
        if (w == null) {
            w = this.dialog.offsetWidth;
        }
        if (h == null) {
            h = this.dialog.offsetHeight;
        }
        (0, helpers_1.css)(this.dialog, {
            width: w,
            height: h
        });
        return this;
    };
    Dialog.prototype.calcAutoSize = function () {
        this.setSize('auto', 'auto');
        this.setSize();
        return this;
    };
    Dialog.prototype.setPosition = function (x, y) {
        var w = this.ow.innerWidth, h = this.ow.innerHeight;
        var left = w / 2 - this.dialog.offsetWidth / 2, top = h / 2 - this.dialog.offsetHeight / 2;
        if (left < 0) {
            left = 0;
        }
        if (top < 0) {
            top = 0;
        }
        if (x !== undefined && y !== undefined) {
            this.offsetX = x;
            this.offsetY = y;
            this.moved = Math.abs(x - left) > 100 || Math.abs(y - top) > 100;
        }
        this.dialog.style.left = (x || left) + 'px';
        this.dialog.style.top = (y || top) + 'px';
        return this;
    };
    Dialog.prototype.setHeader = function (content) {
        this.setElements(this.dialogbox_header, content);
        return this;
    };
    Dialog.prototype.setContent = function (content) {
        this.setElements(this.dialogbox_content, content);
        return this;
    };
    Dialog.prototype.setFooter = function (content) {
        this.setElements(this.dialogbox_footer, content);
        this.setMod('footer', Boolean(content));
        return this;
    };
    Dialog.prototype.getZIndex = function () {
        return parseInt((0, helpers_1.css)(this.container, 'zIndex'), 10) || 0;
    };
    Dialog.prototype.getMaxZIndexDialog = function () {
        var maxZi = 0, dlg, zIndex, res = this;
        (0, helpers_1.$$)('.jodit-dialog', this.destination).forEach(function (dialog) {
            dlg = dialog.component;
            zIndex = parseInt((0, helpers_1.css)(dialog, 'zIndex'), 10);
            if (dlg.isOpened && !isNaN(zIndex) && zIndex > maxZi) {
                res = dlg;
                maxZi = zIndex;
            }
        });
        return res;
    };
    Dialog.prototype.setMaxZIndex = function () {
        var maxZIndex = 20000004, zIndex = 0;
        (0, helpers_1.$$)('.jodit-dialog', this.destination).forEach(function (dialog) {
            zIndex = parseInt((0, helpers_1.css)(dialog, 'zIndex'), 10);
            maxZIndex = Math.max(isNaN(zIndex) ? 0 : zIndex, maxZIndex);
        });
        this.container.style.zIndex = (maxZIndex + 1).toString();
    };
    Dialog.prototype.maximization = function (condition) {
        if ((0, helpers_1.isVoid)(condition)) {
            condition = !this.getMod('fullsize');
        }
        this.setMod('fullsize', condition);
        this.toggleFullSizeBox(condition);
        this.iSetMaximization = condition;
        return condition;
    };
    Dialog.prototype.toggleFullSizeBox = function (condition) {
        [this.destination, this.destination.parentNode].forEach(function (box) {
            box &&
                box.classList &&
                box.classList.toggle('jodit_fullsize-box_true', condition);
        });
    };
    Dialog.prototype.open = function (contentOrClose, titleOrModal, destroyAfterClose, modal) {
        global_1.eventEmitter.fire('closeAllPopups hideHelpers');
        if (this.e.fire(this, 'beforeOpen') === false) {
            return this;
        }
        if ((0, helpers_1.isBoolean)(contentOrClose)) {
            destroyAfterClose = contentOrClose;
        }
        if ((0, helpers_1.isBoolean)(titleOrModal)) {
            modal = titleOrModal;
        }
        this.destroyAfterClose = destroyAfterClose === true;
        var content = (0, helpers_1.isBoolean)(contentOrClose) ? undefined : contentOrClose;
        var title = (0, helpers_1.isBoolean)(titleOrModal) ? undefined : titleOrModal;
        if (title !== undefined) {
            this.setHeader(title);
        }
        if (content) {
            this.setContent(content);
        }
        this.setMod('active', true);
        this.isOpened = true;
        this.setModal(modal);
        this.destination.appendChild(this.container);
        this.setPosition(this.offsetX, this.offsetY);
        this.setMaxZIndex();
        if (this.o.fullsize) {
            this.maximization(true);
        }
        this.e.fire('afterOpen', this);
        return this;
    };
    Dialog.prototype.setModal = function (modal) {
        this.isModal = Boolean(modal);
        this.setMod('modal', this.isModal);
        return this;
    };
    Dialog.prototype.close = function (e) {
        var _a, _b;
        if (this.isDestructed ||
            !this.isOpened ||
            this.getMod('static') === true) {
            return this;
        }
        if (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (this.e && this.e.fire('beforeClose', this) === false) {
            return this;
        }
        this.setMod('active', false);
        this.isOpened = false;
        this.e.fire('toggleFullSize', false);
        if (this.iSetMaximization) {
            this.maximization(false);
        }
        dom_1.Dom.safeRemove(this.container);
        this.removeGlobalResizeListeners();
        if (this.destroyAfterClose) {
            this.destruct();
        }
        (_a = this.e) === null || _a === void 0 ? void 0 : _a.fire(this, 'afterClose');
        (_b = this.e) === null || _b === void 0 ? void 0 : _b.fire(this.ow, 'joditCloseDialog');
        return this;
    };
    Dialog.prototype.buildToolbar = function () {
        this.o.buttons &&
            this.toolbar
                .build((0, helpers_1.splitArray)(this.o.buttons))
                .setMod('mode', 'header')
                .appendTo(this.dialogbox_toolbar);
    };
    Dialog.prototype.destruct = function () {
        if (this.isInDestruct) {
            return;
        }
        this.setStatus(component_1.STATUSES.beforeDestruct);
        if (this.isOpened) {
            this.close();
        }
        if (this.events) {
            this.removeGlobalResizeListeners();
            this.events
                .off(this.container, 'close_dialog', self.close)
                .off(this.ow, 'keydown', this.onEsc)
                .off(this.ow, 'resize', this.onResize);
        }
        _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Dialog.prototype, "onMouseUp", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Dialog.prototype, "onHeaderMouseDown", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Dialog.prototype, "onMouseMove", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Dialog.prototype, "onEsc", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Dialog.prototype, "onResizerMouseDown", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Dialog.prototype, "close", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.hook)('ready')
    ], Dialog.prototype, "buildToolbar", null);
    Dialog = (0, tslib_1.__decorate)([
        decorators_1.component
    ], Dialog);
    return Dialog;
}(view_with_toolbar_1.ViewWithToolbar));
exports.Dialog = Dialog;


/***/ }),
/* 191 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 192 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewWithToolbar = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(193);
var view_1 = __webpack_require__(194);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var factory_1 = __webpack_require__(199);
var component_1 = __webpack_require__(16);
var buttons_1 = __webpack_require__(140);
var decorators_1 = __webpack_require__(32);
var ViewWithToolbar = (function (_super) {
    (0, tslib_1.__extends)(ViewWithToolbar, _super);
    function ViewWithToolbar(options, isJodit) {
        if (isJodit === void 0) { isJodit = false; }
        var _this = _super.call(this, options, isJodit) || this;
        _this.toolbar = (0, factory_1.makeCollection)(_this);
        _this.defaultToolbarContainer = _this.c.div('jodit-toolbar__box');
        _this.registeredButtons = new Set();
        _this.groupToButtons = {};
        _this.isJodit = false;
        _this.isJodit = isJodit;
        _this.e.on('beforeToolbarBuild', _this.beforeToolbarBuild);
        return _this;
    }
    Object.defineProperty(ViewWithToolbar.prototype, "toolbarContainer", {
        get: function () {
            if (!this.o.fullsize &&
                ((0, helpers_1.isString)(this.o.toolbar) || dom_1.Dom.isHTMLElement(this.o.toolbar))) {
                return (0, helpers_1.resolveElement)(this.o.toolbar, this.o.shadowRoot || this.od);
            }
            this.o.toolbar &&
                dom_1.Dom.appendChildFirst(this.container, this.defaultToolbarContainer);
            return this.defaultToolbarContainer;
        },
        enumerable: false,
        configurable: true
    });
    ViewWithToolbar.prototype.setPanel = function (element) {
        this.o.toolbar = element;
        this.buildToolbar();
    };
    ViewWithToolbar.prototype.buildToolbar = function () {
        if (!this.o.toolbar) {
            return;
        }
        var buttons = this.o.buttons
            ? (0, helpers_1.splitArray)(this.o.buttons)
            : [];
        this.toolbar
            .setRemoveButtons(this.o.removeButtons)
            .build(buttons.concat(this.o.extraButtons || []))
            .appendTo(this.toolbarContainer);
    };
    ViewWithToolbar.prototype.getRegisteredButtonGroups = function () {
        return this.groupToButtons;
    };
    ViewWithToolbar.prototype.registerButton = function (btn) {
        var _a;
        this.registeredButtons.add(btn);
        var group = (_a = btn.group) !== null && _a !== void 0 ? _a : 'other';
        if (!this.groupToButtons[group]) {
            this.groupToButtons[group] = [];
        }
        if (btn.position != null) {
            this.groupToButtons[group][btn.position] = btn.name;
        }
        else {
            this.groupToButtons[group].push(btn.name);
        }
        return this;
    };
    ViewWithToolbar.prototype.unregisterButton = function (btn) {
        var _a;
        this.registeredButtons.delete(btn);
        var groupName = (_a = btn.group) !== null && _a !== void 0 ? _a : 'other', group = this.groupToButtons[groupName];
        if (group) {
            var index = group.indexOf(btn.name);
            if (index !== -1) {
                group.splice(index, 1);
            }
            if (group.length === 0) {
                delete this.groupToButtons[groupName];
            }
        }
        return this;
    };
    ViewWithToolbar.prototype.beforeToolbarBuild = function (items) {
        var _this = this;
        if (Object.keys(this.groupToButtons).length) {
            return items.map(function (item) {
                if ((0, buttons_1.isButtonGroup)(item) &&
                    item.group &&
                    _this.groupToButtons[item.group]) {
                    return {
                        group: item.group,
                        buttons: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(item.buttons), false), (0, tslib_1.__read)(_this.groupToButtons[item.group]), false)
                    };
                }
                return item;
            });
        }
    };
    ViewWithToolbar.prototype.destruct = function () {
        if (this.isDestructed) {
            return;
        }
        this.setStatus(component_1.STATUSES.beforeDestruct);
        this.e.off('beforeToolbarBuild', this.beforeToolbarBuild);
        this.toolbar.destruct();
        _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ViewWithToolbar.prototype, "beforeToolbarBuild", null);
    return ViewWithToolbar;
}(view_1.View));
exports.ViewWithToolbar = ViewWithToolbar;


/***/ }),
/* 193 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 194 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.View = void 0;
var tslib_1 = __webpack_require__(1);
var storage_1 = __webpack_require__(195);
var helpers_1 = __webpack_require__(5);
var constants_1 = __webpack_require__(23);
var modules_1 = __webpack_require__(180);
var async_1 = __webpack_require__(181);
var global_1 = __webpack_require__(19);
var decorators_1 = __webpack_require__(32);
var traits_1 = __webpack_require__(122);
var event_emitter_1 = __webpack_require__(62);
var View = (function (_super) {
    (0, tslib_1.__extends)(View, _super);
    function View(options, isJodit) {
        if (isJodit === void 0) { isJodit = false; }
        var _this = _super.call(this) || this;
        _this.isJodit = isJodit;
        _this.isView = true;
        _this.mods = {};
        _this.components = new Set();
        _this.version = "3.14.2";
        _this.async = new async_1.Async();
        _this.buffer = storage_1.Storage.makeStorage();
        _this.storage = storage_1.Storage.makeStorage(true, _this.componentName);
        _this.OPTIONS = View.defaultOptions;
        _this.__isFullSize = false;
        _this.__whoLocked = '';
        _this.isLockedNotBy = function (name) {
            return _this.isLocked && _this.__whoLocked !== name;
        };
        _this.__modulesInstances = new Map();
        _this.id = new Date().getTime().toString();
        _this.buffer = storage_1.Storage.makeStorage();
        _this.initOptions(options);
        _this.initOwners();
        _this.events = new event_emitter_1.EventEmitter(_this.od);
        _this.create = new modules_1.Create(_this.od);
        _this.container = _this.c.div();
        _this.container.classList.add('jodit');
        _this.progressbar = new modules_1.ProgressBar(_this);
        return _this;
    }
    View.prototype.setMod = function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var _b = (0, tslib_1.__read)(_a, 2), name = _b[0], value = _b[1];
        traits_1.Mods.setMod.call(this, name, value);
        return this;
    };
    View.prototype.getMod = function (name) {
        return traits_1.Mods.getMod.call(this, name);
    };
    View.prototype.getElm = function (elementName) {
        return traits_1.Elms.getElm.call(this, elementName);
    };
    View.prototype.getElms = function (elementName) {
        return traits_1.Elms.getElms.call(this, elementName);
    };
    Object.defineProperty(View.prototype, "basePath", {
        get: function () {
            if (this.o.basePath) {
                return this.o.basePath;
            }
            return constants_1.BASE_PATH;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "defaultTimeout", {
        get: function () {
            return (0, helpers_1.isVoid)(this.o.defaultTimeout) ? 100 : this.o.defaultTimeout;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "c", {
        get: function () {
            return this.create;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "container", {
        get: function () {
            return this.__container;
        },
        set: function (container) {
            this.__container = container;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "e", {
        get: function () {
            return this.events;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "options", {
        get: function () {
            return this.__options;
        },
        set: function (options) {
            this.__options = options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "o", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.i18n = function (text) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return (0, helpers_1.i18n)(text, params, this.options);
    };
    View.prototype.toggleFullSize = function (isFullSize) {
        if (isFullSize === undefined) {
            isFullSize = !this.__isFullSize;
        }
        if (isFullSize === this.__isFullSize) {
            return;
        }
        this.__isFullSize = isFullSize;
        if (this.events) {
            this.e.fire('toggleFullSize', isFullSize);
        }
    };
    Object.defineProperty(View.prototype, "isLocked", {
        get: function () {
            return this.__whoLocked !== '';
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.lock = function (name) {
        if (name === void 0) { name = 'any'; }
        if (!this.isLocked) {
            this.__whoLocked = name;
            return true;
        }
        return false;
    };
    View.prototype.unlock = function () {
        if (this.isLocked) {
            this.__whoLocked = '';
            return true;
        }
        return false;
    };
    Object.defineProperty(View.prototype, "isFullSize", {
        get: function () {
            return this.__isFullSize;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.getVersion = function () {
        return "3.14.2";
    };
    View.getVersion = function () {
        return "3.14.2";
    };
    View.prototype.initOptions = function (options) {
        this.options = (0, helpers_1.ConfigProto)(options || {}, (0, helpers_1.ConfigProto)(this.options || {}, View.defaultOptions));
    };
    View.prototype.initOwners = function () {
        var _a;
        this.ownerWindow = (_a = this.o.ownerWindow) !== null && _a !== void 0 ? _a : window;
    };
    View.prototype.attachEvents = function (options) {
        var _this = this;
        if (!options) {
            return;
        }
        var e = options === null || options === void 0 ? void 0 : options.events;
        e && Object.keys(e).forEach(function (key) { return _this.e.on(key, e[key]); });
    };
    View.prototype.getInstance = function (moduleName, options) {
        var instance = this.e.fire((0, helpers_1.camelCase)('getInstance_' + moduleName), options);
        if (instance) {
            return instance;
        }
        var module = global_1.modules[moduleName], mi = this.__modulesInstances;
        if (!(0, helpers_1.isFunction)(module)) {
            throw (0, helpers_1.error)('Need real module name');
        }
        if (!mi.has(moduleName)) {
            var instance_1 = module.prototype instanceof modules_1.ViewComponent
                ? new module(this, options)
                : new module(options);
            this.components.add(instance_1);
            mi.set(moduleName, instance_1);
        }
        return mi.get(moduleName);
    };
    View.prototype.addDisclaimer = function (elm) {
        this.container.appendChild(elm);
    };
    View.prototype.beforeDestruct = function () {
        this.e.fire(modules_1.STATUSES.beforeDestruct, this);
        this.components.forEach(function (component) {
            if ((0, helpers_1.isDestructable)(component) && !component.isInDestruct) {
                component.destruct();
            }
        });
        this.components.clear();
    };
    View.prototype.destruct = function () {
        if (this.isDestructed) {
            return;
        }
        if (this.async) {
            this.async.destruct();
        }
        if (this.events) {
            this.e.destruct();
        }
        if (this.buffer) {
            this.buffer.clear();
        }
        modules_1.Dom.safeRemove(this.container);
        _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        (0, decorators_1.hook)(modules_1.STATUSES.beforeDestruct)
    ], View.prototype, "beforeDestruct", null);
    return View;
}(modules_1.Component));
exports.View = View;
View.defaultOptions = {
    extraButtons: [],
    textIcons: false,
    namespace: '',
    removeButtons: [],
    zIndex: 100002,
    defaultTimeout: 100,
    fullsize: false,
    showTooltip: true,
    useNativeTooltip: false,
    buttons: [],
    globalFullSize: true
};


/***/ }),
/* 195 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(196), exports);
(0, tslib_1.__exportStar)(__webpack_require__(197), exports);
(0, tslib_1.__exportStar)(__webpack_require__(198), exports);


/***/ }),
/* 196 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryStorageProvider = void 0;
var MemoryStorageProvider = (function () {
    function MemoryStorageProvider() {
        this.data = new Map();
    }
    MemoryStorageProvider.prototype.set = function (key, value) {
        this.data.set(key, value);
        return this;
    };
    MemoryStorageProvider.prototype.delete = function (key) {
        this.data.delete(key);
        return this;
    };
    MemoryStorageProvider.prototype.get = function (key) {
        return this.data.get(key);
    };
    MemoryStorageProvider.prototype.exists = function (key) {
        return this.data.has(key);
    };
    MemoryStorageProvider.prototype.clear = function () {
        this.data.clear();
        return this;
    };
    return MemoryStorageProvider;
}());
exports.MemoryStorageProvider = MemoryStorageProvider;


/***/ }),
/* 197 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStorageProvider = exports.canUsePersistentStorage = void 0;
exports.canUsePersistentStorage = (function () {
    var canUse = function () {
        var tmpKey = '___Jodit___' + Math.random().toString();
        try {
            localStorage.setItem(tmpKey, '1');
            var result_1 = localStorage.getItem(tmpKey) === '1';
            localStorage.removeItem(tmpKey);
            return result_1;
        }
        catch (_a) { }
        return false;
    };
    var result;
    return function () {
        if (result === undefined) {
            result = canUse();
        }
        return result;
    };
})();
var LocalStorageProvider = (function () {
    function LocalStorageProvider(rootKey) {
        this.rootKey = rootKey;
    }
    LocalStorageProvider.prototype.set = function (key, value) {
        try {
            var buffer = localStorage.getItem(this.rootKey);
            var json = buffer ? JSON.parse(buffer) : {};
            json[key] = value;
            localStorage.setItem(this.rootKey, JSON.stringify(json));
        }
        catch (_a) { }
        return this;
    };
    LocalStorageProvider.prototype.delete = function (key) {
        try {
            localStorage.removeItem(this.rootKey);
        }
        catch (_a) { }
        return this;
    };
    LocalStorageProvider.prototype.get = function (key) {
        try {
            var buffer = localStorage.getItem(this.rootKey);
            var json = buffer ? JSON.parse(buffer) : {};
            return json[key] !== undefined ? json[key] : null;
        }
        catch (_a) { }
    };
    LocalStorageProvider.prototype.exists = function (key) {
        return this.get(key) != null;
    };
    LocalStorageProvider.prototype.clear = function () {
        try {
            localStorage.removeItem(this.rootKey);
        }
        catch (_a) { }
        return this;
    };
    return LocalStorageProvider;
}());
exports.LocalStorageProvider = LocalStorageProvider;


/***/ }),
/* 198 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Storage = exports.StorageKey = void 0;
var helpers_1 = __webpack_require__(5);
var local_storage_provider_1 = __webpack_require__(197);
var memory_storage_provider_1 = __webpack_require__(196);
exports.StorageKey = 'Jodit_';
var Storage = (function () {
    function Storage(provider, suffix) {
        this.provider = provider;
        this.prefix = exports.StorageKey;
        if (suffix) {
            this.prefix += suffix;
        }
    }
    Storage.prototype.set = function (key, value) {
        this.provider.set((0, helpers_1.camelCase)(this.prefix + key), value);
        return this;
    };
    Storage.prototype.delete = function (key) {
        this.provider.delete((0, helpers_1.camelCase)(this.prefix + key));
        return this;
    };
    Storage.prototype.get = function (key) {
        return this.provider.get((0, helpers_1.camelCase)(this.prefix + key));
    };
    Storage.prototype.exists = function (key) {
        return this.provider.exists((0, helpers_1.camelCase)(this.prefix + key));
    };
    Storage.prototype.clear = function () {
        this.provider.clear();
        return this;
    };
    Storage.makeStorage = function (persistent, suffix) {
        if (persistent === void 0) { persistent = false; }
        var provider;
        if (persistent && (0, local_storage_provider_1.canUsePersistentStorage)()) {
            provider = new local_storage_provider_1.LocalStorageProvider(exports.StorageKey + suffix);
        }
        if (!provider) {
            provider = new memory_storage_provider_1.MemoryStorageProvider();
        }
        return new Storage(provider, suffix);
    };
    return Storage;
}());
exports.Storage = Storage;


/***/ }),
/* 199 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeButton = exports.makeCollection = void 0;
var helpers_1 = __webpack_require__(5);
var collection_1 = __webpack_require__(200);
var editor_collection_1 = __webpack_require__(202);
var button_1 = __webpack_require__(203);
var content_1 = __webpack_require__(205);
function makeCollection(jodit, parentElement) {
    var collection = (0, helpers_1.isJoditObject)(jodit)
        ? new editor_collection_1.ToolbarEditorCollection(jodit)
        : new collection_1.ToolbarCollection(jodit);
    if (jodit.o.textIcons) {
        collection.container.classList.add('jodit_text_icons');
    }
    if (parentElement) {
        collection.parentElement = parentElement;
    }
    if (jodit.o.toolbarButtonSize) {
        collection.buttonSize = jodit.o.toolbarButtonSize;
    }
    return collection;
}
exports.makeCollection = makeCollection;
function makeButton(jodit, control, target) {
    if (target === void 0) { target = null; }
    if ((0, helpers_1.isFunction)(control.getContent)) {
        return new content_1.ToolbarContent(jodit, control, target);
    }
    var button = new button_1.ToolbarButton(jodit, control, target);
    button.state.tabIndex = jodit.o.allowTabNavigation ? 0 : -1;
    return button;
}
exports.makeButton = makeButton;


/***/ }),
/* 200 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarCollection = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(201);
var helpers_1 = __webpack_require__(5);
var ui_1 = __webpack_require__(120);
var factory_1 = __webpack_require__(199);
var decorators_1 = __webpack_require__(32);
var ToolbarCollection = (function (_super) {
    (0, tslib_1.__extends)(ToolbarCollection, _super);
    function ToolbarCollection(jodit) {
        var _this = _super.call(this, jodit) || this;
        _this.listenEvents = 'updateToolbar changeStack mousedown mouseup keydown change afterInit readonly afterResize ' +
            'selectionchange changeSelection focus afterSetMode touchstart focus blur';
        _this.update = _this.j.async.debounce(_this.immediateUpdate, function () { return _this.j.defaultTimeout; });
        _this.initEvents();
        return _this;
    }
    ToolbarCollection.prototype.className = function () {
        return 'ToolbarCollection';
    };
    Object.defineProperty(ToolbarCollection.prototype, "firstButton", {
        get: function () {
            var _a = (0, tslib_1.__read)(this.buttons, 1), button = _a[0];
            return button || null;
        },
        enumerable: false,
        configurable: true
    });
    ToolbarCollection.prototype.makeButton = function (control, target) {
        if (target === void 0) { target = null; }
        return (0, factory_1.makeButton)(this.j, control, target);
    };
    ToolbarCollection.prototype.shouldBeActive = function (button) {
        return undefined;
    };
    ToolbarCollection.prototype.shouldBeDisabled = function (button) {
        return undefined;
    };
    ToolbarCollection.prototype.getTarget = function (button) {
        return button.target || null;
    };
    ToolbarCollection.prototype.immediateUpdate = function () {
        if (this.isDestructed || this.j.isLocked) {
            return;
        }
        _super.prototype.update.call(this);
        this.j.e.fire('afterUpdateToolbar');
    };
    ToolbarCollection.prototype.setDirection = function (direction) {
        this.container.style.direction = direction;
        this.container.setAttribute('dir', direction);
    };
    ToolbarCollection.prototype.initEvents = function () {
        this.j.e
            .on(this.listenEvents, this.update)
            .on('afterSetMode focus', this.immediateUpdate);
    };
    ToolbarCollection.prototype.hide = function () {
        this.container.remove();
    };
    ToolbarCollection.prototype.show = function () {
        this.appendTo(this.j.toolbarContainer);
    };
    ToolbarCollection.prototype.showInline = function (bound) {
        throw (0, helpers_1.error)('The method is not implemented for this class.');
    };
    ToolbarCollection.prototype.build = function (items, target) {
        if (target === void 0) { target = null; }
        var itemsWithGroupps = this.j.e.fire('beforeToolbarBuild', items);
        if (itemsWithGroupps) {
            items = itemsWithGroupps;
        }
        _super.prototype.build.call(this, items, target);
        return this;
    };
    ToolbarCollection.prototype.destruct = function () {
        if (this.isDestructed) {
            return;
        }
        this.j.e
            .off(this.listenEvents, this.update)
            .off('afterSetMode focus', this.immediateUpdate);
        _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ToolbarCollection.prototype, "immediateUpdate", null);
    ToolbarCollection = (0, tslib_1.__decorate)([
        decorators_1.component
    ], ToolbarCollection);
    return ToolbarCollection;
}(ui_1.UIList));
exports.ToolbarCollection = ToolbarCollection;


/***/ }),
/* 201 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 202 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarEditorCollection = void 0;
var tslib_1 = __webpack_require__(1);
var collection_1 = __webpack_require__(200);
var consts = __webpack_require__(23);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var decorators_1 = __webpack_require__(32);
var ToolbarEditorCollection = (function (_super) {
    (0, tslib_1.__extends)(ToolbarEditorCollection, _super);
    function ToolbarEditorCollection(jodit) {
        var _this = _super.call(this, jodit) || this;
        _this.checkActiveStatus = function (cssObject, node) {
            var matches = 0, total = 0;
            Object.keys(cssObject).forEach(function (cssProperty) {
                var cssValue = cssObject[cssProperty];
                if ((0, helpers_1.isFunction)(cssValue)) {
                    if (cssValue(_this.j, (0, helpers_1.css)(node, cssProperty).toString())) {
                        matches += 1;
                    }
                }
                else {
                    if (cssValue.indexOf((0, helpers_1.css)(node, cssProperty).toString()) !== -1) {
                        matches += 1;
                    }
                }
                total += 1;
            });
            return total === matches;
        };
        _this.prependInvisibleInput(_this.container);
        return _this;
    }
    ToolbarEditorCollection.prototype.className = function () {
        return 'ToolbarEditorCollection';
    };
    ToolbarEditorCollection.prototype.shouldBeDisabled = function (button) {
        var disabled = _super.prototype.shouldBeDisabled.call(this, button);
        if (disabled !== undefined) {
            return disabled;
        }
        var mode = button.control.mode === undefined
            ? consts.MODE_WYSIWYG
            : button.control.mode;
        return !(mode === consts.MODE_SPLIT || mode === this.j.getRealMode());
    };
    ToolbarEditorCollection.prototype.shouldBeActive = function (button) {
        var _this = this;
        var active = _super.prototype.shouldBeActive.call(this, button);
        if (active !== undefined) {
            return active;
        }
        var element = this.j.selection ? this.j.s.current() : null;
        if (!element) {
            return false;
        }
        var elm;
        if (button.control.tags) {
            var tags_1 = button.control.tags;
            elm = element;
            if (dom_1.Dom.up(elm, function (node) {
                if (node &&
                    tags_1.indexOf(node.nodeName.toLowerCase()) !== -1) {
                    return true;
                }
            }, this.j.editor)) {
                return true;
            }
        }
        if (button.control.css) {
            var css_1 = button.control.css;
            elm = element;
            if (dom_1.Dom.up(elm, function (node) {
                if (node && !dom_1.Dom.isText(node)) {
                    return _this.checkActiveStatus(css_1, node);
                }
            }, this.j.editor)) {
                return true;
            }
        }
        return false;
    };
    ToolbarEditorCollection.prototype.getTarget = function (button) {
        return button.target || this.j.s.current() || null;
    };
    ToolbarEditorCollection.prototype.prependInvisibleInput = function (container) {
        var input = this.j.create.element('input', {
            tabIndex: -1,
            disabled: true,
            style: 'width: 0; height:0; position: absolute; visibility: hidden;'
        });
        dom_1.Dom.appendChildFirst(container, input);
    };
    ToolbarEditorCollection.prototype.showInline = function (bound) {
        this.jodit.e.fire('showInlineToolbar', bound);
    };
    ToolbarEditorCollection.prototype.hide = function () {
        this.jodit.e.fire('hidePopup');
        _super.prototype.hide.call(this);
        this.jodit.e.fire('toggleToolbar');
    };
    ToolbarEditorCollection.prototype.show = function () {
        _super.prototype.show.call(this);
        this.jodit.e.fire('toggleToolbar');
    };
    ToolbarEditorCollection = (0, tslib_1.__decorate)([
        decorators_1.component
    ], ToolbarEditorCollection);
    return ToolbarEditorCollection;
}(collection_1.ToolbarCollection));
exports.ToolbarEditorCollection = ToolbarEditorCollection;


/***/ }),
/* 203 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarButton = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(204);
var button_1 = __webpack_require__(126);
var decorators_1 = __webpack_require__(32);
var dom_1 = __webpack_require__(21);
var popup_1 = __webpack_require__(141);
var factory_1 = __webpack_require__(199);
var helpers_1 = __webpack_require__(5);
var ui_1 = __webpack_require__(120);
var collection_1 = __webpack_require__(200);
var component_1 = __webpack_require__(16);
var get_control_type_1 = __webpack_require__(137);
var ToolbarButton = (function (_super) {
    (0, tslib_1.__extends)(ToolbarButton, _super);
    function ToolbarButton(jodit, control, target) {
        if (target === void 0) { target = null; }
        var _this = _super.call(this, jodit) || this;
        _this.control = control;
        _this.target = target;
        _this.state = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, button_1.UIButtonState)()), { theme: 'toolbar', currentValue: '', hasTrigger: false });
        jodit.e.on([_this.button, _this.trigger], 'mousedown', function (e) {
            return e.preventDefault();
        });
        _this.onAction(_this.onClick);
        _this.hookStatus(component_1.STATUSES.ready, function () {
            _this.initFromControl();
            _this.initTooltip();
            _this.update();
        });
        return _this;
    }
    ToolbarButton.prototype.className = function () {
        return 'ToolbarButton';
    };
    Object.defineProperty(ToolbarButton.prototype, "toolbar", {
        get: function () {
            return this.closest(collection_1.ToolbarCollection);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolbarButton.prototype, "button", {
        get: function () {
            return this.container.querySelector("button.".concat(this.componentName, "__button"));
        },
        enumerable: false,
        configurable: true
    });
    ToolbarButton.prototype.update = function () {
        var _a = this, control = _a.control, state = _a.state, tc = this.closest(collection_1.ToolbarCollection);
        state.disabled = this.calculateDisabledStatus(tc);
        state.activated = this.calculateActivatedStatus(tc);
        if ((0, helpers_1.isFunction)(control.update)) {
            control.update(this);
        }
        _super.prototype.update.call(this);
    };
    ToolbarButton.prototype.calculateActivatedStatus = function (tc) {
        if ((0, helpers_1.isJoditObject)(this.j) && !this.j.editorIsActive) {
            return false;
        }
        if ((0, helpers_1.isFunction)(this.control.isActive) &&
            this.control.isActive(this.j, this.control, this)) {
            return true;
        }
        return Boolean(tc && tc.shouldBeActive(this));
    };
    ToolbarButton.prototype.calculateDisabledStatus = function (tc) {
        if (this.j.o.disabled) {
            return true;
        }
        if (this.j.o.readonly &&
            (!this.j.o.activeButtonsInReadOnly ||
                !this.j.o.activeButtonsInReadOnly.includes(this.control.name))) {
            return true;
        }
        if ((0, helpers_1.isFunction)(this.control.isDisabled) &&
            this.control.isDisabled(this.j, this.control, this)) {
            return true;
        }
        return Boolean(tc && tc.shouldBeDisabled(this));
    };
    ToolbarButton.prototype.onChangeActivated = function () {
        (0, helpers_1.attr)(this.button, 'aria-pressed', this.state.activated);
        _super.prototype.onChangeActivated.call(this);
    };
    ToolbarButton.prototype.onChangeText = function () {
        if ((0, helpers_1.isFunction)(this.control.template)) {
            this.text.innerHTML = this.control.template(this.j, this.control.name, this.j.i18n(this.state.text));
        }
        else {
            _super.prototype.onChangeText.call(this);
        }
        this.setMod('text-icons', Boolean(this.text.innerText.trim().length));
    };
    ToolbarButton.prototype.onChangeTabIndex = function () {
        (0, helpers_1.attr)(this.button, 'tabindex', this.state.tabIndex);
    };
    ToolbarButton.prototype.onChangeTooltip = function () {
        (0, helpers_1.attr)(this.button, 'aria-label', this.state.tooltip);
        _super.prototype.onChangeTooltip.call(this);
    };
    ToolbarButton.prototype.createContainer = function () {
        var cn = this.componentName;
        var container = this.j.c.span(cn), button = _super.prototype.createContainer.call(this);
        (0, helpers_1.attr)(container, 'role', 'listitem');
        button.classList.remove(cn);
        button.classList.add(cn + '__button');
        Object.defineProperty(button, 'component', {
            value: this
        });
        container.appendChild(button);
        this.trigger = this.j.c.fromHTML("<span role=\"trigger\" class=\"".concat(cn, "__trigger\">").concat(ui_1.Icon.get('chevron'), "</span>"));
        this.j.e.on(this.trigger, 'click', this.onTriggerClick.bind(this));
        return container;
    };
    ToolbarButton.prototype.focus = function () {
        var _a;
        (_a = this.container.querySelector('button')) === null || _a === void 0 ? void 0 : _a.focus();
    };
    ToolbarButton.prototype.onChangeHasTrigger = function () {
        if (this.state.hasTrigger) {
            this.container.appendChild(this.trigger);
        }
        else {
            dom_1.Dom.safeRemove(this.trigger);
        }
        this.setMod('with-trigger', this.state.hasTrigger || null);
    };
    ToolbarButton.prototype.onChangeDisabled = function () {
        var dsb = this.state.disabled ? 'disabled' : null;
        (0, helpers_1.attr)(this.trigger, 'disabled', dsb);
        (0, helpers_1.attr)(this.button, 'disabled', dsb);
        (0, helpers_1.attr)(this.container, 'disabled', dsb);
    };
    ToolbarButton.prototype.initTooltip = function () {
        var _this = this;
        if (!this.j.o.textIcons &&
            this.j.o.showTooltip &&
            !this.j.o.useNativeTooltip) {
            this.j.e
                .off(this.container, 'mouseenter mouseleave')
                .on(this.container, 'mousemove', function (e) {
                if (!_this.state.tooltip) {
                    return;
                }
                !_this.state.disabled &&
                    _this.j.e.fire('delayShowTooltip', function () { return ({
                        x: e.clientX + 10,
                        y: e.clientY + 10
                    }); }, _this.state.tooltip);
            })
                .on(this.container, 'mouseleave', function () {
                _this.j.e.fire('hideTooltip');
            });
        }
    };
    ToolbarButton.prototype.initFromControl = function () {
        var _a;
        var _b = this, ctr = _b.control, state = _b.state;
        this.updateSize();
        state.name = ctr.name;
        var textIcons = this.j.o.textIcons;
        if (textIcons === true ||
            ((0, helpers_1.isFunction)(textIcons) && textIcons(ctr.name)) ||
            ctr.template) {
            state.icon = (0, button_1.UIButtonState)().icon;
            state.text = ctr.text || ctr.name;
        }
        else {
            if (ctr.iconURL) {
                state.icon.iconURL = ctr.iconURL;
            }
            else {
                var name_1 = ctr.icon || ctr.name;
                state.icon.name =
                    ui_1.Icon.exists(name_1) || ((_a = this.j.o.extraIcons) === null || _a === void 0 ? void 0 : _a[name_1])
                        ? name_1
                        : '';
            }
            if (!ctr.iconURL && !state.icon.name) {
                state.text = ctr.text || ctr.name;
            }
        }
        if (ctr.tooltip) {
            state.tooltip = this.j.i18n((0, helpers_1.isFunction)(ctr.tooltip)
                ? ctr.tooltip(this.j, ctr, this)
                : ctr.tooltip);
        }
        state.hasTrigger = Boolean(ctr.list || (ctr.popup && ctr.exec));
    };
    ToolbarButton.prototype.onTriggerClick = function (e) {
        var _this = this;
        var _a, _b, _c;
        var ctr = this.control;
        e.buffer = {
            actionTrigger: this
        };
        if (ctr.list) {
            return this.openControlList(ctr);
        }
        if ((0, helpers_1.isFunction)(ctr.popup)) {
            var popup = new popup_1.Popup(this.j);
            popup.parentElement = this;
            if (this.j.e.fire((0, helpers_1.camelCase)("before-".concat(ctr.name, "-open-popup")), this.target, ctr, popup) !== false) {
                var target = (_c = (_b = (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.getTarget(this)) !== null && _b !== void 0 ? _b : this.target) !== null && _c !== void 0 ? _c : null;
                var elm = ctr.popup(this.j, target, ctr, popup.close, this);
                if (elm) {
                    popup
                        .setContent((0, helpers_1.isString)(elm) ? this.j.c.fromHTML(elm) : elm)
                        .open(function () { return (0, helpers_1.position)(_this.container); });
                }
            }
            this.j.e.fire((0, helpers_1.camelCase)("after-".concat(ctr.name, "-open-popup")), popup.container);
        }
    };
    ToolbarButton.prototype.openControlList = function (control) {
        var _this = this;
        var _a;
        var controls = (_a = this.jodit.options.controls) !== null && _a !== void 0 ? _a : {}, getControl = function (key) {
            return (0, get_control_type_1.findControlType)(key, controls);
        };
        var list = control.list, menu = new popup_1.Popup(this.j), toolbar = (0, factory_1.makeCollection)(this.j);
        menu.parentElement = this;
        toolbar.parentElement = menu;
        toolbar.mode = 'vertical';
        var getButton = function (key, value) {
            if ((0, helpers_1.isString)(value) && getControl(value)) {
                return (0, tslib_1.__assign)({ name: value.toString() }, getControl(value));
            }
            if ((0, helpers_1.isString)(key) && getControl(key)) {
                return (0, tslib_1.__assign)((0, tslib_1.__assign)({ name: key.toString() }, getControl(key)), (typeof value === 'object' ? value : {}));
            }
            var childControl = {
                name: key.toString(),
                template: control.childTemplate,
                exec: control.exec,
                data: control.data,
                command: control.command,
                isActive: control.isChildActive,
                isDisabled: control.isChildDisabled,
                mode: control.mode,
                args: (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)((control.args ? control.args : [])), false), [key, value], false)
            };
            if ((0, helpers_1.isString)(value)) {
                childControl.text = value;
            }
            return childControl;
        };
        toolbar.build((0, helpers_1.isArray)(list)
            ? list.map(getButton)
            : (0, helpers_1.keys)(list, false).map(function (key) { return getButton(key, list[key]); }), this.target);
        menu.setContent(toolbar.container).open(function () { return (0, helpers_1.position)(_this.container); });
        this.state.activated = true;
        this.j.e.on(menu, 'afterClose', function () {
            _this.state.activated = false;
        });
    };
    ToolbarButton.prototype.onClick = function (originalEvent) {
        var _a, _b, _c, _d, _e, _f, _g;
        var ctr = this.control;
        if ((0, helpers_1.isFunction)(ctr.exec)) {
            var target = (_c = (_b = (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.getTarget(this)) !== null && _b !== void 0 ? _b : this.target) !== null && _c !== void 0 ? _c : null;
            var result = ctr.exec(this.j, target, {
                control: ctr,
                originalEvent: originalEvent,
                button: this
            });
            if (result !== false && result !== true) {
                (_e = (_d = this.j) === null || _d === void 0 ? void 0 : _d.e) === null || _e === void 0 ? void 0 : _e.fire('synchro');
                if (this.parentElement) {
                    this.parentElement.update();
                }
                (_g = (_f = this.j) === null || _f === void 0 ? void 0 : _f.e) === null || _g === void 0 ? void 0 : _g.fire('closeAllPopups afterExec');
            }
            if (result !== false) {
                return;
            }
        }
        if (ctr.list) {
            return this.openControlList(ctr);
        }
        if ((0, helpers_1.isFunction)(ctr.popup)) {
            return this.onTriggerClick(originalEvent);
        }
        if (ctr.command || ctr.name) {
            (0, helpers_1.call)((0, helpers_1.isJoditObject)(this.j)
                ? this.j.execCommand.bind(this.j)
                : this.j.od.execCommand.bind(this.j.od), ctr.command || ctr.name, false, ctr.args && ctr.args[0]);
            this.j.e.fire('closeAllPopups');
        }
    };
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.tooltip')
    ], ToolbarButton.prototype, "onChangeTooltip", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.watch)('state.hasTrigger')
    ], ToolbarButton.prototype, "onChangeHasTrigger", null);
    ToolbarButton = (0, tslib_1.__decorate)([
        decorators_1.component
    ], ToolbarButton);
    return ToolbarButton;
}(button_1.UIButton));
exports.ToolbarButton = ToolbarButton;


/***/ }),
/* 204 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 205 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarContent = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(206);
var button_1 = __webpack_require__(126);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var decorators_1 = __webpack_require__(32);
var ToolbarContent = (function (_super) {
    (0, tslib_1.__extends)(ToolbarContent, _super);
    function ToolbarContent(jodit, control, target) {
        if (target === void 0) { target = null; }
        var _this = _super.call(this, jodit) || this;
        _this.control = control;
        _this.target = target;
        _this.container.classList.add("".concat(_this.componentName, "_").concat(_this.clearName(control.name)));
        (0, helpers_1.attr)(_this.container, 'role', 'content');
        return _this;
    }
    ToolbarContent.prototype.className = function () {
        return 'ToolbarContent';
    };
    ToolbarContent.prototype.update = function () {
        var content = this.control.getContent(this.j, this.control, this);
        if ((0, helpers_1.isString)(content) || content.parentNode !== this.container) {
            dom_1.Dom.detach(this.container);
            this.container.appendChild((0, helpers_1.isString)(content) ? this.j.create.fromHTML(content) : content);
        }
        _super.prototype.update.call(this);
    };
    ToolbarContent.prototype.createContainer = function () {
        return this.j.c.span(this.componentName);
    };
    ToolbarContent = (0, tslib_1.__decorate)([
        decorators_1.component
    ], ToolbarContent);
    return ToolbarContent;
}(button_1.UIButton));
exports.ToolbarContent = ToolbarContent;


/***/ }),
/* 206 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 207 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Alert = void 0;
var dialog_1 = __webpack_require__(190);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var ui_1 = __webpack_require__(120);
var Alert = function (msg, title, callback, className) {
    if (className === void 0) { className = 'jodit-dialog_alert'; }
    if ((0, helpers_1.isFunction)(title)) {
        callback = title;
        title = undefined;
    }
    var dialog = new dialog_1.Dialog(), container = dialog.c.div(className), okButton = (0, ui_1.Button)(dialog, 'ok', 'Ok');
    (0, helpers_1.asArray)(msg).forEach(function (oneMessage) {
        container.appendChild(dom_1.Dom.isNode(oneMessage) ? oneMessage : dialog.c.fromHTML(oneMessage));
    });
    okButton.onAction(function () {
        if (!callback || !(0, helpers_1.isFunction)(callback) || callback(dialog) !== false) {
            dialog.close();
        }
    });
    dialog.setFooter([okButton]);
    dialog.open(container, title || '&nbsp;', true, true);
    okButton.focus();
    return dialog;
};
exports.Alert = Alert;


/***/ }),
/* 208 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Prompt = void 0;
var dialog_1 = __webpack_require__(189);
var ui_1 = __webpack_require__(120);
var helpers_1 = __webpack_require__(5);
var Prompt = function (msg, title, callback, placeholder, defaultValue) {
    var dialog = new dialog_1.Dialog(), cancelButton = (0, ui_1.Button)(dialog, 'cancel', 'Cancel'), okButton = (0, ui_1.Button)(dialog, 'ok', 'Ok'), form = dialog.c.element('form', {
        class: 'jodit-dialog_prompt'
    }), inputElement = dialog.c.element('input', {
        autofocus: true,
        class: 'jodit-input'
    }), labelElement = dialog.c.element('label');
    if ((0, helpers_1.isFunction)(title)) {
        callback = title;
        title = undefined;
    }
    if (placeholder) {
        (0, helpers_1.attr)(inputElement, 'placeholder', placeholder);
    }
    labelElement.appendChild(dialog.c.text(msg));
    form.appendChild(labelElement);
    form.appendChild(inputElement);
    cancelButton.onAction(dialog.close);
    var onclick = function () {
        if (!callback ||
            !(0, helpers_1.isFunction)(callback) ||
            callback(inputElement.value) !== false) {
            dialog.close();
        }
    };
    okButton.onAction(onclick);
    dialog.e.on(form, 'submit', function () {
        onclick();
        return false;
    });
    dialog.setFooter([okButton, cancelButton]);
    dialog.open(form, title || '&nbsp;', true, true);
    inputElement.focus();
    if (defaultValue !== undefined && defaultValue.length) {
        inputElement.value = defaultValue;
        inputElement.select();
    }
    return dialog;
};
exports.Prompt = Prompt;


/***/ }),
/* 209 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Confirm = void 0;
var dialog_1 = __webpack_require__(189);
var helpers_1 = __webpack_require__(5);
var ui_1 = __webpack_require__(120);
var Confirm = function (msg, title, callback) {
    var dialog = new dialog_1.Dialog(), $div = dialog.c.fromHTML('<form class="jodit-dialog_prompt"></form>'), $label = dialog.c.element('label');
    if ((0, helpers_1.isFunction)(title)) {
        callback = title;
        title = undefined;
    }
    $label.appendChild(dialog.c.fromHTML(msg));
    $div.appendChild($label);
    var action = function (yes) { return function () {
        if (!callback || callback(yes) !== false) {
            dialog.close();
        }
    }; };
    var $cancel = (0, ui_1.Button)(dialog, 'cancel', 'Cancel');
    var $ok = (0, ui_1.Button)(dialog, 'ok', 'Yes');
    $cancel.onAction(action(false));
    $ok.onAction(action(true));
    dialog.e.on($div, 'submit', function () {
        action(true)();
        return false;
    });
    dialog.setFooter([$ok, $cancel]);
    dialog.open($div, title || '&nbsp;', true, true);
    $ok.focus();
    return dialog;
};
exports.Confirm = Confirm;


/***/ }),
/* 210 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(20), exports);
(0, tslib_1.__exportStar)(__webpack_require__(211), exports);


/***/ }),
/* 211 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Plugin = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(16);
var decorators_1 = __webpack_require__(32);
var helpers_1 = __webpack_require__(5);
var Plugin = (function (_super) {
    (0, tslib_1.__extends)(Plugin, _super);
    function Plugin(jodit) {
        var _this = _super.call(this, jodit) || this;
        _this.requires = [];
        _this.buttons = [];
        _this.hasStyle = false;
        jodit.e
            .on('afterPluginSystemInit', function () {
            var _a;
            if ((0, helpers_1.isJoditObject)(jodit)) {
                (_a = _this.buttons) === null || _a === void 0 ? void 0 : _a.forEach(function (btn) {
                    jodit.registerButton(btn);
                });
            }
        })
            .on('afterInit', function () {
            _this.setStatus(component_1.STATUSES.ready);
            _this.afterInit(jodit);
        })
            .on('beforeDestruct', _this.destruct);
        return _this;
    }
    Plugin.prototype.className = function () {
        return '';
    };
    Plugin.prototype.init = function (jodit) {
    };
    Plugin.prototype.destruct = function () {
        var _a, _b, _c;
        if (!this.isInDestruct) {
            this.setStatus(component_1.STATUSES.beforeDestruct);
            var j_1 = this.j;
            if ((0, helpers_1.isJoditObject)(j_1)) {
                (_a = this.buttons) === null || _a === void 0 ? void 0 : _a.forEach(function (btn) {
                    j_1 === null || j_1 === void 0 ? void 0 : j_1.unregisterButton(btn);
                });
            }
            (_c = (_b = this.j) === null || _b === void 0 ? void 0 : _b.events) === null || _c === void 0 ? void 0 : _c.off('beforeDestruct', this.destruct);
            this.beforeDestruct(this.j);
            _super.prototype.destruct.call(this);
        }
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], Plugin.prototype, "destruct", null);
    return Plugin;
}(component_1.ViewComponent));
exports.Plugin = Plugin;


/***/ }),
/* 212 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(213), exports);


/***/ }),
/* 213 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Create = void 0;
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var constants_1 = __webpack_require__(23);
var Create = (function () {
    function Create(document, createAttributes) {
        this.document = document;
        this.createAttributes = createAttributes;
    }
    Object.defineProperty(Create.prototype, "doc", {
        get: function () {
            return (0, helpers_1.isFunction)(this.document) ? this.document() : this.document;
        },
        enumerable: false,
        configurable: true
    });
    Create.prototype.element = function (tagName, childrenOrAttributes, children) {
        var _this = this;
        var elm = this.doc.createElement(tagName.toLowerCase());
        this.applyCreateAttributes(elm);
        if (childrenOrAttributes) {
            if ((0, helpers_1.isPlainObject)(childrenOrAttributes)) {
                (0, helpers_1.attr)(elm, childrenOrAttributes);
            }
            else {
                children = childrenOrAttributes;
            }
        }
        if (children) {
            (0, helpers_1.asArray)(children).forEach(function (child) {
                return elm.appendChild((0, helpers_1.isString)(child) ? _this.fromHTML(child) : child);
            });
        }
        return elm;
    };
    Create.prototype.div = function (className, childrenOrAttributes, children) {
        var div = this.element('div', childrenOrAttributes, children);
        if (className) {
            div.className = className;
        }
        return div;
    };
    Create.prototype.span = function (className, childrenOrAttributes, children) {
        var span = this.element('span', childrenOrAttributes, children);
        if (className) {
            span.className = className;
        }
        return span;
    };
    Create.prototype.a = function (className, childrenOrAttributes, children) {
        var a = this.element('a', childrenOrAttributes, children);
        if (className) {
            a.className = className;
        }
        return a;
    };
    Create.prototype.text = function (value) {
        return this.doc.createTextNode(value);
    };
    Create.prototype.fake = function () {
        return this.text(constants_1.INVISIBLE_SPACE);
    };
    Create.prototype.fragment = function () {
        return this.doc.createDocumentFragment();
    };
    Create.prototype.fromHTML = function (html, refsToggleElement) {
        var div = this.div();
        div.innerHTML = html.toString();
        var child = div.firstChild !== div.lastChild || !div.firstChild
            ? div
            : div.firstChild;
        dom_1.Dom.safeRemove(child);
        if (refsToggleElement) {
            var refElements_1 = (0, helpers_1.refs)(child);
            Object.keys(refsToggleElement).forEach(function (key) {
                var elm = refElements_1[key];
                if (elm && refsToggleElement[key] === false) {
                    dom_1.Dom.hide(elm);
                }
            });
        }
        return child;
    };
    Create.prototype.applyCreateAttributes = function (elm) {
        if (this.createAttributes) {
            var ca = this.createAttributes;
            if (ca && ca[elm.tagName.toLowerCase()]) {
                var attrsOpt = ca[elm.tagName.toLowerCase()];
                if ((0, helpers_1.isFunction)(attrsOpt)) {
                    attrsOpt(elm);
                }
                else if ((0, helpers_1.isPlainObject)(attrsOpt)) {
                    (0, helpers_1.attr)(elm, attrsOpt);
                }
            }
        }
    };
    return Create;
}());
exports.Create = Create;


/***/ }),
/* 214 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(215), exports);


/***/ }),
/* 215 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFileBrowserFilesItem = exports.FileBrowser = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(216);
var config_1 = __webpack_require__(87);
var consts = __webpack_require__(23);
var dialog_1 = __webpack_require__(189);
var storage_1 = __webpack_require__(195);
var helpers_1 = __webpack_require__(5);
var view_with_toolbar_1 = __webpack_require__(192);
__webpack_require__(217);
var dom_1 = __webpack_require__(21);
var factories_1 = __webpack_require__(218);
var state_listeners_1 = __webpack_require__(221);
var native_listeners_1 = __webpack_require__(225);
var self_listeners_1 = __webpack_require__(232);
var data_provider_1 = __webpack_require__(219);
var decorators_1 = __webpack_require__(32);
var ui_1 = __webpack_require__(233);
var event_emitter_1 = __webpack_require__(62);
var load_tree_1 = __webpack_require__(223);
var load_items_1 = __webpack_require__(224);
var component_1 = __webpack_require__(16);
var FileBrowser = (function (_super) {
    (0, tslib_1.__extends)(FileBrowser, _super);
    function FileBrowser(options) {
        var _a;
        var _this = _super.call(this, options) || this;
        _this.browser = _this.c.div(_this.componentName);
        _this.status_line = _this.c.div(_this.getFullElName('status'));
        _this.tree = new ui_1.FileBrowserTree(_this);
        _this.files = new ui_1.FileBrowserFiles(_this);
        _this.state = (0, event_emitter_1.observable)({
            currentPath: '',
            currentSource: data_provider_1.DEFAULT_SOURCE_NAME,
            currentBaseUrl: '',
            activeElements: [],
            elements: [],
            messages: [],
            sources: [],
            view: 'tiles',
            sortBy: 'changed-desc',
            filterWord: '',
            onlyImages: false
        });
        _this.errorHandler = function (resp) {
            if (resp instanceof Error) {
                _this.status(_this.i18n(resp.message));
            }
            else {
                _this.status(_this.dataProvider.getMessage(resp));
            }
        };
        _this.close = function () {
            _this.dialog.close();
        };
        _this.attachEvents(options);
        var self = _this;
        self.options = (0, helpers_1.ConfigProto)(options || {}, config_1.Config.defaultOptions.filebrowser);
        self.storage = storage_1.Storage.makeStorage(Boolean(_this.o.saveStateInStorage), _this.componentName);
        self.dataProvider = (0, factories_1.makeDataProvider)(self, self.options);
        self.dialog = new dialog_1.Dialog({
            fullsize: self.o.fullsize,
            ownerWindow: self.ownerWindow,
            theme: self.o.theme,
            globalFullSize: self.o.globalFullSize,
            language: _this.o.language,
            minWidth: Math.min(700, screen.width),
            minHeight: 300,
            buttons: (_a = _this.o.headerButtons) !== null && _a !== void 0 ? _a : ['fullsize', 'dialog.close']
        });
        _this.proxyDialogEvents(self);
        self.browser.component = _this;
        self.container = self.browser;
        if (self.o.showFoldersPanel) {
            self.browser.appendChild(self.tree.container);
        }
        self.browser.appendChild(self.files.container);
        self.browser.appendChild(self.status_line);
        self_listeners_1.selfListeners.call(self);
        native_listeners_1.nativeListeners.call(self);
        state_listeners_1.stateListeners.call(self);
        self.dialog.setSize(self.o.width, self.o.height);
        var keys = [
            'getLocalFileByUrl',
            'crop',
            'resize',
            'create',
            'fileMove',
            'folderMove',
            'fileRename',
            'folderRename',
            'fileRemove',
            'folderRemove',
            'folder',
            'items',
            'permissions'
        ];
        keys.forEach(function (key) {
            if (_this.options[key] != null) {
                _this.options[key] = (0, helpers_1.ConfigProto)(_this.options[key], _this.o.ajax);
            }
        });
        var _b = _this.o
            .saveStateInStorage || {
            storeLastOpenedFolder: false,
            storeView: false,
            storeSortBy: false
        }, storeView = _b.storeView, storeSortBy = _b.storeSortBy, storeLastOpenedFolder = _b.storeLastOpenedFolder;
        var view = storeView && _this.storage.get('view');
        if (view && _this.o.view == null) {
            self.state.view = view === 'list' ? 'list' : 'tiles';
        }
        else {
            self.state.view = self.o.view === 'list' ? 'list' : 'tiles';
        }
        self.files.setMod('view', self.state.view);
        var sortBy = storeSortBy && self.storage.get('sortBy');
        if (sortBy) {
            var parts = sortBy.split('-');
            self.state.sortBy = ['changed', 'name', 'size'].includes(parts[0])
                ? sortBy
                : 'changed-desc';
        }
        else {
            self.state.sortBy = self.o.sortBy || 'changed-desc';
        }
        if (storeLastOpenedFolder) {
            var currentPath = self.storage.get('currentPath'), currentSource = self.storage.get('currentSource');
            self.state.currentPath = currentPath !== null && currentPath !== void 0 ? currentPath : '';
            self.state.currentSource = currentSource !== null && currentSource !== void 0 ? currentSource : '';
        }
        self.initUploader(self);
        self.setStatus(component_1.STATUSES.ready);
        return _this;
    }
    FileBrowser.prototype.className = function () {
        return 'Filebrowser';
    };
    FileBrowser.prototype.onSelect = function (callback) {
        var _this = this;
        return function () {
            if (_this.state.activeElements.length) {
                var files_1 = [];
                var isImages_1 = [];
                _this.state.activeElements.forEach(function (elm) {
                    var url = elm.fileURL;
                    if (url) {
                        files_1.push(url);
                        isImages_1.push(elm.isImage || false);
                    }
                });
                _this.close();
                var data = {
                    baseurl: '',
                    files: files_1,
                    isImages: isImages_1
                };
                if ((0, helpers_1.isFunction)(callback)) {
                    callback(data);
                }
                _this.close();
            }
            return false;
        };
    };
    Object.defineProperty(FileBrowser.prototype, "isOpened", {
        get: function () {
            return this.dialog.isOpened && this.browser.style.display !== 'none';
        },
        enumerable: false,
        configurable: true
    });
    FileBrowser.prototype.status = function (message, success) {
        var _this = this;
        if (!(0, helpers_1.isString)(message)) {
            message = message.message;
        }
        if (!(0, helpers_1.isString)(message) || !(0, helpers_1.trim)(message).length) {
            return;
        }
        var successClass = this.getFullElName('status', 'success', true), activeClass = this.getFullElName('status', 'active', true);
        this.status_line.classList.remove(successClass);
        this.status_line.classList.add(activeClass);
        var messageBox = this.c.div();
        messageBox.textContent = message;
        this.status_line.appendChild(messageBox);
        if (success) {
            this.status_line.classList.add(successClass);
        }
        this.async.setTimeout(function () {
            _this.status_line.classList.remove(activeClass);
            dom_1.Dom.detach(_this.status_line);
        }, {
            timeout: this.o.howLongShowMsg,
            label: 'fileBrowser.status'
        });
    };
    FileBrowser.prototype.open = function (callback, onlyImages) {
        var _this = this;
        if (callback === void 0) { callback = this.o
            .defaultCallback; }
        if (onlyImages === void 0) { onlyImages = false; }
        this.state.onlyImages = onlyImages;
        return this.async.promise(function (resolve, reject) {
            var _a;
            if (!_this.o.items || !_this.o.items.url) {
                throw (0, helpers_1.error)('Need set options.filebrowser.ajax.url');
            }
            var localTimeout = 0;
            _this.e
                .off(_this.files.container, 'dblclick')
                .on(_this.files.container, 'dblclick', _this.onSelect(callback))
                .on(_this.files.container, 'touchstart', function () {
                var now = new Date().getTime();
                if (now - localTimeout < consts.EMULATE_DBLCLICK_TIMEOUT) {
                    _this.onSelect(callback)();
                }
                localTimeout = now;
            })
                .off('select.filebrowser')
                .on('select.filebrowser', _this.onSelect(callback));
            var header = _this.c.div();
            _this.toolbar.build((_a = _this.o.buttons) !== null && _a !== void 0 ? _a : []).appendTo(header);
            _this.dialog.open(_this.browser, header);
            _this.e.fire('sort.filebrowser', _this.state.sortBy);
            (0, load_tree_1.loadTree)(_this).then(resolve, reject);
        });
    };
    FileBrowser.prototype.initUploader = function (editor) {
        var _this = this;
        var _a;
        var self = this, options = (_a = editor === null || editor === void 0 ? void 0 : editor.options) === null || _a === void 0 ? void 0 : _a.uploader, uploaderOptions = (0, helpers_1.ConfigProto)(options || {}, config_1.Config.defaultOptions.uploader);
        var uploadHandler = function () { return (0, load_items_1.loadItems)(_this); };
        self.uploader = self.getInstance('Uploader', uploaderOptions);
        self.uploader
            .setPath(self.state.currentPath)
            .setSource(self.state.currentSource)
            .bind(self.browser, uploadHandler, self.errorHandler);
        this.state.on(['change.currentPath', 'change.currentSource'], function () {
            _this.uploader
                .setPath(_this.state.currentPath)
                .setSource(_this.state.currentSource);
        });
        self.e.on('bindUploader.filebrowser', function (button) {
            self.uploader.bind(button, uploadHandler, self.errorHandler);
        });
    };
    FileBrowser.prototype.proxyDialogEvents = function (self) {
        var _this = this;
        ['afterClose', 'beforeOpen'].forEach(function (proxyEvent) {
            self.dialog.events.on(self.dialog, proxyEvent, function () {
                _this.e.fire(proxyEvent);
            });
        });
    };
    FileBrowser.prototype.destruct = function () {
        if (this.isInDestruct) {
            return;
        }
        this.dialog.destruct();
        this.events && this.e.off('.filebrowser');
        this.uploader && this.uploader.destruct();
        _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], FileBrowser.prototype, "status", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], FileBrowser.prototype, "open", null);
    return FileBrowser;
}(view_with_toolbar_1.ViewWithToolbar));
exports.FileBrowser = FileBrowser;
function isFileBrowserFilesItem(target) {
    return (dom_1.Dom.isElement(target) &&
        target.classList.contains(ui_1.FileBrowserFiles.prototype.getFullElName('item')));
}
exports.isFileBrowserFilesItem = isFileBrowserFilesItem;


/***/ }),
/* 216 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 217 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
var config_1 = __webpack_require__(87);
var helpers_1 = __webpack_require__(5);
var ui_1 = __webpack_require__(120);
config_1.Config.prototype.filebrowser = {
    namespace: '',
    extraButtons: [],
    filter: function (item, search) {
        search = search.toLowerCase();
        if ((0, helpers_1.isString)(item)) {
            return item.toLowerCase().indexOf(search) !== -1;
        }
        if ((0, helpers_1.isString)(item.name)) {
            return item.name.toLowerCase().indexOf(search) !== -1;
        }
        if ((0, helpers_1.isString)(item.file)) {
            return item.file.toLowerCase().indexOf(search) !== -1;
        }
        return true;
    },
    sortBy: 'changed-desc',
    sort: function (a, b, sortBy) {
        var _a = (0, tslib_1.__read)(sortBy.toLowerCase().split('-'), 2), sortAttr = _a[0], arrow = _a[1], asc = arrow === 'asc';
        var compareStr = function (f, s) {
            if (f < s) {
                return asc ? -1 : 1;
            }
            if (f > s) {
                return asc ? 1 : -1;
            }
            return 0;
        };
        if ((0, helpers_1.isString)(a)) {
            return compareStr(a.toLowerCase(), b.toLowerCase());
        }
        if (a[sortAttr] === undefined || sortAttr === 'name') {
            if ((0, helpers_1.isString)(a.name)) {
                return compareStr(a.name.toLowerCase(), b.name.toLowerCase());
            }
            if ((0, helpers_1.isString)(a.file)) {
                return compareStr(a.file.toLowerCase(), b.file.toLowerCase());
            }
            return 0;
        }
        switch (sortAttr) {
            case 'changed': {
                var f = new Date(a.changed).getTime(), s = new Date(b.changed).getTime();
                return asc ? f - s : s - f;
            }
            case 'size': {
                var f = (0, helpers_1.humanSizeToBytes)(a.size), s = (0, helpers_1.humanSizeToBytes)(b.size);
                return asc ? f - s : s - f;
            }
        }
        return 0;
    },
    editImage: true,
    preview: true,
    showPreviewNavigation: true,
    showSelectButtonInPreview: true,
    contextMenu: true,
    howLongShowMsg: 3000,
    createNewFolder: true,
    deleteFolder: true,
    renameFolder: true,
    moveFolder: true,
    moveFile: true,
    showFoldersPanel: true,
    storeLastOpenedFolder: true,
    width: 859,
    height: 400,
    buttons: [
        'filebrowser.upload',
        'filebrowser.remove',
        'filebrowser.update',
        'filebrowser.select',
        'filebrowser.edit',
        '|',
        'filebrowser.tiles',
        'filebrowser.list',
        '|',
        'filebrowser.filter',
        '|',
        'filebrowser.sort'
    ],
    removeButtons: [],
    fullsize: false,
    showTooltip: true,
    view: null,
    isSuccess: function (resp) {
        return resp.success;
    },
    getMessage: function (resp) {
        return resp.data.messages !== undefined && (0, helpers_1.isArray)(resp.data.messages)
            ? resp.data.messages.join(' ')
            : '';
    },
    showFileName: true,
    showFileSize: true,
    showFileChangeTime: true,
    saveStateInStorage: {
        storeLastOpenedFolder: true,
        storeView: true,
        storeSortBy: true
    },
    pixelOffsetLoadNewChunk: 200,
    getThumbTemplate: function (item, source, source_name) {
        var opt = this.options, IC = this.files.getFullElName('item'), showName = opt.showFileName, showSize = opt.showFileSize && item.size, showTime = opt.showFileChangeTime && item.time;
        var name = '';
        if (item.file !== undefined) {
            name = item.file;
        }
        var info = "<div class=\"".concat(IC, "-info\">").concat(showName ? "<span class=\"".concat(IC, "-info-filename\">").concat(name, "</span>") : '').concat(showSize
            ? "<span class=\"".concat(IC, "-info-filesize\">").concat(item.size, "</span>")
            : '').concat(showTime
            ? "<span class=\"".concat(IC, "-info-filechanged\">").concat(showTime, "</span>")
            : '', "</div>");
        return "<a\n\t\t\tdata-jodit-filebrowser-item=\"true\"\n\t\t\tdata-is-file=\"".concat(item.isImage ? 0 : 1, "\"\n\t\t\tdraggable=\"true\"\n\t\t\tclass=\"").concat(IC, "\"\n\t\t\thref=\"").concat(item.fileURL, "\"\n\t\t\tdata-source=\"").concat(source_name, "\"\n\t\t\tdata-path=\"").concat(item.path, "\"\n\t\t\tdata-name=\"").concat(name, "\"\n\t\t\ttitle=\"").concat(name, "\"\n\t\t\tdata-url=\"").concat(item.fileURL, "\">\n\t\t\t\t<img\n\t\t\t\t\tdata-is-file=\"").concat(item.isImage ? 0 : 1, "\"\n\t\t\t\t\tdata-src=\"").concat(item.fileURL, "\"\n\t\t\t\t\tsrc=\"").concat(item.imageURL, "\"\n\t\t\t\t\talt=\"").concat(name, "\"\n\t\t\t\t\tloading=\"lazy\"\n\t\t\t\t/>\n\t\t\t\t").concat(showName || showSize || showTime ? info : '', "\n\t\t\t</a>");
    },
    ajax: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, config_1.Config.prototype.defaultAjaxOptions), { url: '', async: true, data: {}, cache: true, contentType: 'application/x-www-form-urlencoded; charset=UTF-8', method: 'POST', processData: true, dataType: 'json', headers: {}, prepareData: function (data) {
            return data;
        }, process: function (resp) {
            return resp;
        } }),
    create: {
        data: { action: 'folderCreate' }
    },
    getLocalFileByUrl: {
        data: { action: 'getLocalFileByUrl' }
    },
    resize: {
        data: { action: 'imageResize' }
    },
    crop: {
        data: { action: 'imageCrop' }
    },
    fileMove: {
        data: { action: 'fileMove' }
    },
    folderMove: {
        data: { action: 'folderMove' }
    },
    fileRename: {
        data: { action: 'fileRename' }
    },
    folderRename: {
        data: { action: 'folderRename' }
    },
    fileRemove: {
        data: { action: 'fileRemove' }
    },
    folderRemove: {
        data: { action: 'folderRemove' }
    },
    items: {
        data: { action: 'files' }
    },
    folder: {
        data: { action: 'folders' }
    },
    permissions: {
        data: { action: 'permissions' }
    }
};
config_1.Config.prototype.controls.filebrowser = {
    upload: {
        icon: 'plus',
        isInput: true,
        isDisabled: function (browser) {
            return !browser.dataProvider.canI('FileUpload');
        },
        getContent: function (filebrowser) {
            var btn = new ui_1.UIFileInput(filebrowser, {
                onlyImages: filebrowser.state.onlyImages
            });
            filebrowser.e.fire('bindUploader.filebrowser', btn.container);
            return btn.container;
        }
    },
    remove: {
        icon: 'bin',
        isDisabled: function (browser) {
            return (!browser.state.activeElements.length ||
                !browser.dataProvider.canI('FileRemove'));
        },
        exec: function (editor) {
            editor.e.fire('fileRemove.filebrowser');
        }
    },
    update: {
        exec: function (editor) {
            editor.e.fire('update.filebrowser');
        }
    },
    select: {
        icon: 'check',
        isDisabled: function (browser) {
            return !browser.state.activeElements.length;
        },
        exec: function (editor) {
            editor.e.fire('select.filebrowser');
        }
    },
    edit: {
        icon: 'pencil',
        isDisabled: function (browser) {
            var selected = browser.state.activeElements;
            return (selected.length !== 1 ||
                !selected[0].isImage ||
                !(browser.dataProvider.canI('ImageCrop') ||
                    browser.dataProvider.canI('ImageResize')));
        },
        exec: function (editor) {
            editor.e.fire('edit.filebrowser');
        }
    },
    tiles: {
        icon: 'th',
        isActive: function (filebrowser) {
            return filebrowser.state.view === 'tiles';
        },
        exec: function (filebrowser) {
            filebrowser.e.fire('view.filebrowser', 'tiles');
        }
    },
    list: {
        icon: 'th-list',
        isActive: function (filebrowser) {
            return filebrowser.state.view === 'list';
        },
        exec: function (filebrowser) {
            filebrowser.e.fire('view.filebrowser', 'list');
        }
    },
    filter: {
        isInput: true,
        getContent: function (filebrowser, _, b) {
            var oldInput = b.container.querySelector('.jodit-input');
            if (oldInput) {
                return oldInput;
            }
            var input = filebrowser.c.element('input', {
                class: 'jodit-input',
                placeholder: filebrowser.i18n('Filter')
            });
            input.value = filebrowser.state.filterWord;
            filebrowser.e.on(input, 'keydown mousedown', filebrowser.async.debounce(function () {
                filebrowser.e.fire('filter.filebrowser', input.value);
            }, filebrowser.defaultTimeout));
            return input;
        }
    },
    sort: {
        isInput: true,
        getContent: function (fb) {
            var select = fb.c.fromHTML('<select class="jodit-input jodit-select">' +
                "<option value=\"changed-asc\">".concat(fb.i18n('Sort by changed'), " (\u2B06)</option>") +
                "<option value=\"changed-desc\">".concat(fb.i18n('Sort by changed'), " (\u2B07)</option>") +
                "<option value=\"name-asc\">".concat(fb.i18n('Sort by name'), " (\u2B06)</option>") +
                "<option value=\"name-desc\">".concat(fb.i18n('Sort by name'), " (\u2B07)</option>") +
                "<option value=\"size-asc\">".concat(fb.i18n('Sort by size'), " (\u2B06)</option>") +
                "<option value=\"size-desc\">".concat(fb.i18n('Sort by size'), " (\u2B07)</option>") +
                '</select>');
            select.value = fb.state.sortBy;
            fb.e
                .on('sort.filebrowser', function (value) {
                if (select.value !== value) {
                    select.value = value;
                }
            })
                .on(select, 'change', function () {
                fb.e.fire('sort.filebrowser', select.value);
            });
            return select;
        }
    }
};


/***/ }),
/* 218 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeContextMenu = exports.makeDataProvider = void 0;
var data_provider_1 = __webpack_require__(219);
var context_menu_1 = __webpack_require__(187);
function makeDataProvider(parent, options) {
    return new data_provider_1.default(parent, options);
}
exports.makeDataProvider = makeDataProvider;
function makeContextMenu(parent) {
    return new context_menu_1.ContextMenu(parent);
}
exports.makeContextMenu = makeContextMenu;


/***/ }),
/* 219 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_SOURCE_NAME = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
var request_1 = __webpack_require__(183);
var decorators_1 = __webpack_require__(32);
var item_1 = __webpack_require__(220);
exports.DEFAULT_SOURCE_NAME = 'default';
var possibleRules = (/* unused pure expression or super */ null && ([
    'allowFiles',
    'allowFileMove',
    'allowFileUpload',
    'allowFileUploadRemote',
    'allowFileRemove',
    'allowFileRename',
    'allowFolders',
    'allowFolderMove',
    'allowFolderCreate',
    'allowFolderRemove',
    'allowFolderRename',
    'allowImageResize',
    'allowImageCrop'
]));
var DataProvider = (function () {
    function DataProvider(parent, options) {
        this.parent = parent;
        this.options = options;
        this.__currentPermissions = null;
        this.ajaxInstances = new Map();
        this.progressHandler = function (ignore) { };
    }
    Object.defineProperty(DataProvider.prototype, "o", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    DataProvider.prototype.get = function (name) {
        var _this = this;
        var ai = this.ajaxInstances;
        if (ai.has(name)) {
            var ajax_1 = ai.get(name);
            ajax_1 === null || ajax_1 === void 0 ? void 0 : ajax_1.abort();
            ai.delete(name);
        }
        var opts = (0, helpers_1.ConfigProto)(this.options[name] !== undefined
            ? this.options[name]
            : {}, (0, helpers_1.ConfigProto)({
            onProgress: this.progressHandler
        }, this.o.ajax));
        if (opts.prepareData) {
            opts.data = opts.prepareData.call(this, opts.data);
        }
        var ajax = new request_1.Ajax(this.parent, opts);
        ai.set(name, ajax);
        var promise = ajax.send();
        promise.finally(function () {
            ajax.destruct();
            ai.delete(name);
            _this.progressHandler(100);
        });
        return promise
            .then(function (resp) { return resp.json(); })
            .then(function (resp) {
            if (resp && !_this.isSuccess(resp)) {
                throw new Error(_this.getMessage(resp));
            }
            return resp;
        });
    };
    DataProvider.prototype.onProgress = function (callback) {
        this.progressHandler = callback;
    };
    DataProvider.prototype.permissions = function (path, source) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                if (!this.o.permissions) {
                    return [2, null];
                }
                this.o.permissions.data.path = path;
                this.o.permissions.data.source = source;
                if (this.o.permissions.url) {
                    return [2, this.get('permissions').then(function (resp) {
                            var process = _this.o.permissions.process;
                            if (!process) {
                                process = _this.o.ajax.process;
                            }
                            if (process) {
                                var respData = process.call(self, resp);
                                if (respData.data.permissions) {
                                    _this.__currentPermissions = respData.data.permissions;
                                }
                            }
                            return _this.__currentPermissions;
                        })];
                }
                return [2, null];
            });
        });
    };
    DataProvider.prototype.canI = function (action) {
        var rule = 'allow' + action;
        if (false) {}
        return (this.__currentPermissions == null ||
            this.__currentPermissions[rule] === undefined ||
            this.__currentPermissions[rule]);
    };
    DataProvider.prototype.items = function (path, source, mods) {
        if (mods === void 0) { mods = {}; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var opt;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                opt = this.options;
                if (!opt.items) {
                    return [2, Promise.reject('Set Items api options')];
                }
                opt.items.data.path = path;
                opt.items.data.source = source;
                opt.items.data.mods = mods;
                return [2, this.get('items').then(function (resp) {
                        var process = _this.o.items.process;
                        if (!process) {
                            process = _this.o.ajax.process;
                        }
                        if (process) {
                            resp = process.call(self, resp);
                        }
                        return _this.generateItemsList(resp.data.sources, mods);
                    })];
            });
        });
    };
    DataProvider.prototype.generateItemsList = function (sources, mods) {
        var _this = this;
        if (mods === void 0) { mods = {}; }
        var elements = [];
        var canBeFile = function (item) {
            return !mods.onlyImages || item.isImage === undefined || item.isImage;
        }, inFilter = function (item) {
            var _a;
            return !((_a = mods.filterWord) === null || _a === void 0 ? void 0 : _a.length) ||
                _this.o.filter === undefined ||
                _this.o.filter(item, mods.filterWord);
        };
        sources.forEach(function (source) {
            if (source.files && source.files.length) {
                var sort_1 = _this.o.sort;
                if ((0, helpers_1.isFunction)(sort_1) && mods.sortBy) {
                    source.files.sort(function (a, b) { return sort_1(a, b, mods.sortBy); });
                }
                source.files.forEach(function (item) {
                    if (inFilter(item) && canBeFile(item)) {
                        elements.push(item_1.FileBrowserItem.create((0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { sourceName: source.name, source: source })));
                    }
                });
            }
        });
        return elements;
    };
    DataProvider.prototype.tree = function (path, source) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = (0, helpers_1.normalizeRelativePath)(path);
                        return [4, this.permissions(path, source)];
                    case 1:
                        _a.sent();
                        if (!this.o.folder) {
                            return [2, Promise.reject('Set Folder Api options')];
                        }
                        this.o.folder.data.path = path;
                        this.o.folder.data.source = source;
                        return [2, this.get('folder').then(function (resp) {
                                var process = _this.o.folder.process;
                                if (!process) {
                                    process = _this.o.ajax.process;
                                }
                                if (process) {
                                    resp = process.call(self, resp);
                                }
                                return resp.data.sources;
                            })];
                }
            });
        });
    };
    DataProvider.prototype.getPathByUrl = function (url) {
        var _this = this;
        (0, helpers_1.set)('options.getLocalFileByUrl.data.url', url, this);
        return this.get('getLocalFileByUrl').then(function (resp) {
            if (_this.isSuccess(resp)) {
                return resp.data;
            }
            throw (0, helpers_1.error)(_this.getMessage(resp));
        });
    };
    DataProvider.prototype.createFolder = function (name, path, source) {
        var _this = this;
        var create = this.o.create;
        if (!create) {
            throw (0, helpers_1.error)('Set Create api options');
        }
        create.data.source = source;
        create.data.path = path;
        create.data.name = name;
        return this.get('create').then(function (resp) {
            if (_this.isSuccess(resp)) {
                return true;
            }
            throw (0, helpers_1.error)(_this.getMessage(resp));
        });
    };
    DataProvider.prototype.move = function (filepath, path, source, isFile) {
        var _this = this;
        var mode = isFile
            ? 'fileMove'
            : 'folderMove';
        var option = this.options[mode];
        if (!option) {
            throw (0, helpers_1.error)('Set Move api options');
        }
        option.data.from = filepath;
        option.data.path = path;
        option.data.source = source;
        return this.get(mode).then(function (resp) {
            if (_this.isSuccess(resp)) {
                return true;
            }
            throw (0, helpers_1.error)(_this.getMessage(resp));
        });
    };
    DataProvider.prototype.remove = function (action, path, file, source) {
        var _this = this;
        var fr = this.o[action];
        if (!fr) {
            throw (0, helpers_1.error)("Set \"".concat(action, "\" api options"));
        }
        fr.data.path = path;
        fr.data.name = file;
        fr.data.source = source;
        return this.get(action).then(function (resp) {
            if (fr.process) {
                resp = fr.process.call(_this, resp);
            }
            return _this.getMessage(resp);
        });
    };
    DataProvider.prototype.fileRemove = function (path, file, source) {
        return this.remove('fileRemove', path, file, source);
    };
    DataProvider.prototype.folderRemove = function (path, file, source) {
        return this.remove('folderRemove', path, file, source);
    };
    DataProvider.prototype.rename = function (action, path, name, newname, source) {
        var _this = this;
        var fr = this.o[action];
        if (!fr) {
            throw (0, helpers_1.error)("Set \"".concat(action, "\" api options"));
        }
        fr.data.path = path;
        fr.data.name = name;
        fr.data.newname = newname;
        fr.data.source = source;
        return this.get(action).then(function (resp) {
            if (fr.process) {
                resp = fr.process.call(self, resp);
            }
            return _this.getMessage(resp);
        });
    };
    DataProvider.prototype.folderRename = function (path, name, newname, source) {
        return this.rename('folderRename', path, name, newname, source);
    };
    DataProvider.prototype.fileRename = function (path, name, newname, source) {
        return this.rename('fileRename', path, name, newname, source);
    };
    DataProvider.prototype.changeImage = function (type, path, source, name, newname, box) {
        if (!this.o[type]) {
            this.o[type] = {
                data: {}
            };
        }
        var query = this.o[type];
        if (query.data === undefined) {
            query.data = {
                action: type
            };
        }
        query.data.newname = newname || name;
        if (box) {
            query.data.box = box;
        }
        query.data.path = path;
        query.data.name = name;
        query.data.source = source;
        return this.get(type).then(function () {
            return true;
        });
    };
    DataProvider.prototype.crop = function (path, source, name, newname, box) {
        return this.changeImage('crop', path, source, name, newname, box);
    };
    DataProvider.prototype.resize = function (path, source, name, newname, box) {
        return this.changeImage('resize', path, source, name, newname, box);
    };
    DataProvider.prototype.getMessage = function (resp) {
        return this.options.getMessage(resp);
    };
    DataProvider.prototype.isSuccess = function (resp) {
        return this.options.isSuccess(resp);
    };
    DataProvider.prototype.destruct = function () {
        this.ajaxInstances.forEach(function (a) { return a.destruct(); });
        this.ajaxInstances.clear();
    };
    DataProvider = (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], DataProvider);
    return DataProvider;
}());
exports["default"] = DataProvider;


/***/ }),
/* 220 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileBrowserItem = void 0;
var helpers_1 = __webpack_require__(5);
var FileBrowserItem = (function () {
    function FileBrowserItem(data) {
        var _this = this;
        this.data = data;
        Object.keys(data).forEach(function (key) {
            _this[key] = data[key];
        });
    }
    FileBrowserItem.create = function (data) {
        if (data instanceof FileBrowserItem) {
            return data;
        }
        return new FileBrowserItem(data);
    };
    Object.defineProperty(FileBrowserItem.prototype, "path", {
        get: function () {
            return (0, helpers_1.normalizePath)(this.data.source.path ? this.data.source.path + '/' : '/');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileBrowserItem.prototype, "imageURL", {
        get: function () {
            var timestamp = new Date().getTime().toString(), _a = this.data, thumbIsAbsolute = _a.thumbIsAbsolute, source = _a.source, thumb = _a.thumb, file = _a.file, path = thumb || file;
            return thumbIsAbsolute && path
                ? path
                : (0, helpers_1.normalizeUrl)(source.baseurl, source.path, path || '') +
                    '?_tmst=' +
                    timestamp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileBrowserItem.prototype, "fileURL", {
        get: function () {
            var name = this.data.name;
            var _a = this.data, file = _a.file, fileIsAbsolute = _a.fileIsAbsolute, source = _a.source;
            if (file !== undefined) {
                name = file;
            }
            return fileIsAbsolute && name
                ? name
                : (0, helpers_1.normalizeUrl)(source.baseurl, source.path, name || '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileBrowserItem.prototype, "time", {
        get: function () {
            var changed = this.data.changed;
            return ((changed &&
                (typeof changed === 'number'
                    ? new Date(changed).toLocaleString()
                    : changed)) ||
                '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileBrowserItem.prototype, "uniqueHashKey", {
        get: function () {
            var data = this.data;
            var key = [
                data.sourceName,
                data.name,
                data.file,
                this.time,
                data.thumb
            ].join('_');
            key = key.toLowerCase().replace(/[^0-9a-z\-.]/g, '-');
            return key;
        },
        enumerable: false,
        configurable: true
    });
    FileBrowserItem.prototype.toJSON = function () {
        return this.data;
    };
    return FileBrowserItem;
}());
exports.FileBrowserItem = FileBrowserItem;


/***/ }),
/* 221 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stateListeners = void 0;
var dom_1 = __webpack_require__(21);
var normalize_1 = __webpack_require__(90);
var ui_1 = __webpack_require__(120);
var elements_map_1 = __webpack_require__(222);
var load_tree_1 = __webpack_require__(223);
var DEFAULT_SOURCE_NAME = 'default';
function stateListeners() {
    var _this = this;
    var elmMap = (0, elements_map_1.elementsMap)(this);
    var _a = this, state = _a.state, files = _a.files, create = _a.create, options = _a.options, getDomElement = function (item) {
        var key = item.uniqueHashKey;
        if (elmMap[key]) {
            return elmMap[key].elm;
        }
        var elm = create.fromHTML(options.getThumbTemplate.call(_this, item, item.source, item.sourceName.toString()));
        elm.dataset.key = key;
        elmMap[key] = {
            item: item,
            elm: elm
        };
        return elmMap[key].elm;
    };
    state
        .on(['change.currentPath', 'change.currentSource'], this.async.debounce(function () {
        if (_this.o.saveStateInStorage &&
            _this.o.saveStateInStorage.storeLastOpenedFolder) {
            _this.storage
                .set('currentPath', _this.state.currentPath)
                .set('currentSource', _this.state.currentSource);
        }
        (0, load_tree_1.loadTree)(_this).catch(_this.status);
    }, this.defaultTimeout))
        .on('beforeChange.activeElements', function () {
        state.activeElements.forEach(function (item) {
            var key = item.uniqueHashKey, elm = elmMap[key].elm;
            elm &&
                elm.classList.remove(files.getFullElName('item', 'active', true));
        });
    })
        .on('change.activeElements', function () {
        _this.e.fire('changeSelection');
        state.activeElements.forEach(function (item) {
            var key = item.uniqueHashKey, elm = elmMap[key].elm;
            elm &&
                elm.classList.add(files.getFullElName('item', 'active', true));
        });
    })
        .on('change.view', function () {
        files.setMod('view', state.view);
        if (_this.o.saveStateInStorage &&
            _this.o.saveStateInStorage.storeView) {
            _this.storage.set('view', state.view);
        }
    })
        .on('change.sortBy', function () {
        if (_this.o.saveStateInStorage &&
            _this.o.saveStateInStorage.storeSortBy) {
            _this.storage.set('sortBy', state.sortBy);
        }
    })
        .on('change.elements', this.async.debounce(function () {
        dom_1.Dom.detach(files.container);
        if (state.elements.length) {
            state.elements.forEach(function (item) {
                _this.files.container.appendChild(getDomElement(item));
            });
        }
        else {
            files.container.appendChild(create.div(_this.componentName + '_no-files_true', _this.i18n('There are no files')));
        }
    }, this.defaultTimeout))
        .on('change.sources', this.async.debounce(function () {
        dom_1.Dom.detach(_this.tree.container);
        state.sources.forEach(function (source) {
            var sourceName = source.name;
            if (sourceName && sourceName !== DEFAULT_SOURCE_NAME) {
                _this.tree.container.appendChild(create.div(_this.tree.getFullElName('source-title'), sourceName));
            }
            source.folders.forEach(function (name) {
                var folderElm = create.a(_this.tree.getFullElName('item'), {
                    draggable: 'draggable',
                    href: '#',
                    'data-path': (0, normalize_1.normalizePath)(source.path, name + '/'),
                    'data-name': name,
                    'data-source': sourceName,
                    'data-source-path': source.path
                }, create.span(_this.tree.getFullElName('item-title'), name));
                var action = function (actionName) { return function (e) {
                    _this.e.fire("".concat(actionName, ".filebrowser"), {
                        name: name,
                        path: (0, normalize_1.normalizePath)(source.path + '/'),
                        source: sourceName
                    });
                    e.stopPropagation();
                    e.preventDefault();
                }; };
                _this.e.on(folderElm, 'click', action('openFolder'));
                _this.tree.container.appendChild(folderElm);
                if (name === '..' || name === '.') {
                    return;
                }
                if (options.renameFolder &&
                    _this.dataProvider.canI('FolderRename')) {
                    var btn = (0, ui_1.Button)(_this, {
                        icon: { name: 'pencil' },
                        name: 'rename',
                        tooltip: 'Rename',
                        size: 'tiny'
                    });
                    btn.onAction(action('renameFolder'));
                    folderElm.appendChild(btn.container);
                }
                if (options.deleteFolder &&
                    _this.dataProvider.canI('FolderRemove')) {
                    var btn = (0, ui_1.Button)(_this, {
                        icon: { name: 'cancel' },
                        name: 'remove',
                        tooltip: 'Delete',
                        size: 'tiny'
                    });
                    btn.onAction(action('removeFolder'));
                    folderElm.appendChild(btn.container);
                }
            });
            if (options.createNewFolder &&
                _this.dataProvider.canI('FolderCreate')) {
                var button = (0, ui_1.Button)(_this, 'plus', 'Add folder', 'secondary');
                button.onAction(function () {
                    _this.e.fire('addFolder', {
                        path: (0, normalize_1.normalizePath)(source.path + '/'),
                        source: sourceName
                    });
                });
                _this.tree.append(button);
            }
        });
    }, this.defaultTimeout));
}
exports.stateListeners = stateListeners;


/***/ }),
/* 222 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementsMap = void 0;
var map = new WeakMap();
var elementsMap = function (view) {
    var result = map.get(view);
    if (!result) {
        result = {};
        map.set(view, result);
    }
    return result;
};
exports.elementsMap = elementsMap;


/***/ }),
/* 223 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadTree = void 0;
var tslib_1 = __webpack_require__(1);
var error_1 = __webpack_require__(55);
var dom_1 = __webpack_require__(21);
var load_items_1 = __webpack_require__(224);
function loadTree(fb) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var errorUni, items, tree;
        return (0, tslib_1.__generator)(this, function (_a) {
            errorUni = function (e) {
                throw e instanceof Error ? e : (0, error_1.error)(e);
            };
            fb.tree.setMod('active', true);
            dom_1.Dom.detach(fb.tree.container);
            items = (0, load_items_1.loadItems)(fb);
            if (fb.o.showFoldersPanel) {
                fb.tree.setMod('loading', true);
                tree = fb.dataProvider
                    .tree(fb.state.currentPath, fb.state.currentSource)
                    .then(function (resp) {
                    fb.state.sources = resp;
                })
                    .catch(function (e) {
                    errorUni(e);
                })
                    .finally(function () { return fb.tree.setMod('loading', false); });
                return [2, Promise.all([tree, items]).catch(error_1.error)];
            }
            fb.tree.setMod('active', false);
            return [2, items.catch(error_1.error)];
        });
    });
}
exports.loadTree = loadTree;


/***/ }),
/* 224 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadItems = void 0;
var tslib_1 = __webpack_require__(1);
function loadItems(fb) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
            fb.files.setMod('active', true);
            fb.files.setMod('loading', true);
            return [2, fb.dataProvider
                    .items(fb.state.currentPath, fb.state.currentSource, {
                    sortBy: fb.state.sortBy,
                    onlyImages: fb.state.onlyImages,
                    filterWord: fb.state.filterWord
                })
                    .then(function (resp) {
                    fb.state.elements = resp;
                    fb.state.activeElements = [];
                })
                    .catch(fb.status)
                    .finally(function () { return fb.files.setMod('loading', false); })];
        });
    });
}
exports.loadItems = loadItems;


/***/ }),
/* 225 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nativeListeners = exports.elementToItem = exports.getItem = void 0;
var tslib_1 = __webpack_require__(1);
var helpers_1 = __webpack_require__(5);
var context_menu_1 = __webpack_require__(226);
var dom_1 = __webpack_require__(21);
var elements_map_1 = __webpack_require__(222);
var load_tree_1 = __webpack_require__(223);
var getItem = function (node, root, tag) {
    if (tag === void 0) { tag = 'a'; }
    return dom_1.Dom.closest(node, function (elm) { return dom_1.Dom.isTag(elm, tag); }, root);
};
exports.getItem = getItem;
var elementToItem = function (elm, elementsMap) {
    var key = elm.dataset.key, item = elementsMap[key || ''].item;
    return item;
};
exports.elementToItem = elementToItem;
function nativeListeners() {
    var _this = this;
    var dragElement = false;
    var elmMap = (0, elements_map_1.elementsMap)(this);
    var self = this;
    self.e
        .on(self.tree.container, 'dragstart', function (e) {
        var a = (0, exports.getItem)(e.target, self.container);
        if (!a) {
            return;
        }
        if (self.o.moveFolder) {
            dragElement = a;
        }
    })
        .on(self.tree.container, 'drop', function (e) {
        if ((self.o.moveFile || self.o.moveFolder) && dragElement) {
            var path = (0, helpers_1.attr)(dragElement, '-path') || '';
            if (!self.o.moveFolder &&
                dragElement.classList.contains(_this.tree.getFullElName('item'))) {
                return false;
            }
            if (dragElement.classList.contains(_this.files.getFullElName('item'))) {
                path += (0, helpers_1.attr)(dragElement, '-name');
                if (!self.o.moveFile) {
                    return false;
                }
            }
            var a = (0, exports.getItem)(e.target, self.container);
            if (!a) {
                return;
            }
            self.dataProvider
                .move(path, (0, helpers_1.attr)(a, '-path') || '', (0, helpers_1.attr)(a, '-source') || '', dragElement.classList.contains(_this.files.getFullElName('item')))
                .then(function () { return (0, load_tree_1.loadTree)(_this); })
                .catch(self.status);
            dragElement = false;
        }
    })
        .on(self.files.container, 'contextmenu', (0, context_menu_1.default)(self))
        .on(self.files.container, 'click', function (e) {
        if (!(0, helpers_1.ctrlKey)(e)) {
            _this.state.activeElements = [];
        }
    })
        .on(self.files.container, 'click', function (e) {
        var a = (0, exports.getItem)(e.target, self.container);
        if (!a) {
            return;
        }
        var item = (0, exports.elementToItem)(a, elmMap);
        if (!item) {
            return;
        }
        if (!(0, helpers_1.ctrlKey)(e)) {
            self.state.activeElements = [item];
        }
        else {
            self.state.activeElements = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], (0, tslib_1.__read)(self.state.activeElements), false), [
                item
            ], false);
        }
        e.stopPropagation();
        return false;
    })
        .on(self.files.container, 'dragstart', function (e) {
        if (self.o.moveFile) {
            var a = (0, exports.getItem)(e.target, self.container);
            if (!a) {
                return;
            }
            dragElement = a;
        }
    })
        .on(self.container, 'drop', function (e) { return e.preventDefault(); });
}
exports.nativeListeners = nativeListeners;


/***/ }),
/* 226 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
var dialog_1 = __webpack_require__(189);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var factories_1 = __webpack_require__(218);
var ui_1 = __webpack_require__(120);
var native_listeners_1 = __webpack_require__(225);
var image_editor_1 = __webpack_require__(227);
var elements_map_1 = __webpack_require__(222);
var load_tree_1 = __webpack_require__(223);
var delete_file_1 = __webpack_require__(231);
var CLASS_PREVIEW = 'jodit-filebrowser-preview', preview_tpl_next = function (next, right) {
    if (next === void 0) { next = 'next'; }
    if (right === void 0) { right = 'right'; }
    return "<div class=\"".concat(CLASS_PREVIEW, "__navigation ").concat(CLASS_PREVIEW, "__navigation_arrow_").concat(next, "\">") +
        '' +
        ui_1.Icon.get('angle-' + right) +
        '</a>';
};
exports["default"] = (function (self) {
    if (!self.o.contextMenu) {
        return function () { };
    }
    var contextmenu = (0, factories_1.makeContextMenu)(self);
    return function (e) {
        var a = (0, native_listeners_1.getItem)(e.target, self.container);
        if (!a) {
            return;
        }
        var item = a;
        var opt = self.options, ga = function (key) { return (0, helpers_1.attr)(item, key) || ''; };
        self.async.setTimeout(function () {
            var selectedItem = (0, native_listeners_1.elementToItem)(a, (0, elements_map_1.elementsMap)(self));
            if (!selectedItem) {
                return;
            }
            self.state.activeElements = [selectedItem];
            contextmenu.show(e.clientX, e.clientY, [
                ga('data-is-file') !== '1' &&
                    opt.editImage &&
                    (self.dataProvider.canI('ImageResize') ||
                        self.dataProvider.canI('ImageCrop'))
                    ? {
                        icon: 'pencil',
                        title: 'Edit',
                        exec: function () {
                            return image_editor_1.openImageEditor.call(self, ga('href'), ga('data-name'), ga('data-path'), ga('data-source'));
                        }
                    }
                    : false,
                self.dataProvider.canI('FileRename')
                    ? {
                        icon: 'italic',
                        title: 'Rename',
                        exec: function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
                            return (0, tslib_1.__generator)(this, function (_a) {
                                self.e.fire('fileRename.filebrowser', ga('data-name'), ga('data-path'), ga('data-source'));
                                return [2];
                            });
                        }); }
                    }
                    : false,
                self.dataProvider.canI('FileRemove')
                    ? {
                        icon: 'bin',
                        title: 'Delete',
                        exec: function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
                            var e_1;
                            return (0, tslib_1.__generator)(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4, (0, delete_file_1.deleteFile)(self, ga('data-name'), ga('data-source'))];
                                    case 1:
                                        _a.sent();
                                        return [3, 3];
                                    case 2:
                                        e_1 = _a.sent();
                                        return [2, self.status(e_1)];
                                    case 3:
                                        self.state.activeElements = [];
                                        return [2, (0, load_tree_1.loadTree)(self).catch(self.status)];
                                }
                            });
                        }); }
                    }
                    : false,
                opt.preview
                    ? {
                        icon: 'eye',
                        title: 'Preview',
                        exec: function () {
                            var preview = new dialog_1.Dialog({
                                fullsize: self.o.fullsize,
                                language: self.o.language,
                                buttons: ['fullsize', 'dialog.close']
                            }), temp_content = self.c.div(CLASS_PREVIEW, '<div class="jodit-icon_loader"></div>'), preview_box = self.c.div(CLASS_PREVIEW + '__box'), next = self.c.fromHTML(preview_tpl_next()), prev = self.c.fromHTML(preview_tpl_next('prev', 'left')), addLoadHandler = function (src) {
                                var image = self.c.element('img');
                                image.setAttribute('src', src);
                                var onload = function () {
                                    var _a;
                                    if (self.isInDestruct) {
                                        return;
                                    }
                                    self.e.off(image, 'load');
                                    dom_1.Dom.detach(temp_content);
                                    if (opt.showPreviewNavigation) {
                                        if (dom_1.Dom.prevWithClass(item, self.files.getFullElName('item'))) {
                                            temp_content.appendChild(prev);
                                        }
                                        if (dom_1.Dom.nextWithClass(item, self.files.getFullElName('item'))) {
                                            temp_content.appendChild(next);
                                        }
                                    }
                                    temp_content.appendChild(preview_box);
                                    preview_box.appendChild(image);
                                    preview.setPosition();
                                    (_a = self === null || self === void 0 ? void 0 : self.events) === null || _a === void 0 ? void 0 : _a.fire('previewOpenedAndLoaded');
                                };
                                self.e.on(image, 'load', onload);
                                if (image.complete) {
                                    onload();
                                }
                            };
                            self.e.on([next, prev], 'click', function () {
                                if (this === next) {
                                    item = dom_1.Dom.nextWithClass(item, self.files.getFullElName('item'));
                                }
                                else {
                                    item = dom_1.Dom.prevWithClass(item, self.files.getFullElName('item'));
                                }
                                if (!item) {
                                    throw (0, helpers_1.error)('Need element');
                                }
                                dom_1.Dom.detach(temp_content);
                                dom_1.Dom.detach(preview_box);
                                temp_content.innerHTML =
                                    '<div class="jodit-icon_loader"></div>';
                                addLoadHandler(ga('href'));
                            });
                            self.e.on('beforeDestruct', function () {
                                preview.destruct();
                            });
                            preview.container.classList.add(CLASS_PREVIEW + '__dialog');
                            preview.setContent(temp_content);
                            preview.setPosition();
                            preview.open();
                            addLoadHandler(ga('href'));
                            self.events
                                .on('beforeDestruct', function () {
                                preview.destruct();
                            })
                                .fire('previewOpened');
                        }
                    }
                    : false,
                {
                    icon: 'upload',
                    title: 'Download',
                    exec: function () {
                        var url = ga('href');
                        if (url) {
                            self.ow.open(url);
                        }
                    }
                }
            ]);
        }, self.defaultTimeout);
        self.e
            .on('beforeClose', function () { return contextmenu.close(); })
            .on('beforeDestruct', function () { return contextmenu.destruct(); });
        e.stopPropagation();
        e.preventDefault();
        return false;
    };
});


/***/ }),
/* 227 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.openImageEditor = exports.ImageEditor = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(228);
var config_1 = __webpack_require__(87);
var component_1 = __webpack_require__(16);
var dialog_1 = __webpack_require__(189);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var button_1 = __webpack_require__(126);
var form_1 = __webpack_require__(229);
var decorators_1 = __webpack_require__(32);
__webpack_require__(230);
var jie = 'jodit-image-editor';
var TABS = {
    resize: 'resize',
    crop: 'crop'
};
var ImageEditor = (function (_super) {
    (0, tslib_1.__extends)(ImageEditor, _super);
    function ImageEditor(editor) {
        var _this = _super.call(this, editor) || this;
        _this.resizeUseRatio = true;
        _this.cropUseRatio = true;
        _this.clicked = false;
        _this.start_x = 0;
        _this.start_y = 0;
        _this.top_x = 0;
        _this.top_y = 0;
        _this.width = 0;
        _this.height = 0;
        _this.activeTab = TABS.resize;
        _this.naturalWidth = 0;
        _this.naturalHeight = 0;
        _this.ratio = 0;
        _this.new_h = 0;
        _this.new_w = 0;
        _this.diff_x = 0;
        _this.diff_y = 0;
        _this.cropBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        _this.resizeBox = {
            w: 0,
            h: 0
        };
        _this.calcCropBox = function () {
            var node = _this.crop_box.parentNode, w = node.offsetWidth * 0.8, h = node.offsetHeight * 0.8;
            var wn = w, hn = h;
            var _a = _this, nw = _a.naturalWidth, nh = _a.naturalHeight;
            if (w > nw && h > nh) {
                wn = nw;
                hn = nh;
            }
            else if (_this.ratio > w / h) {
                wn = w;
                hn = nh * (w / nw);
            }
            else {
                wn = nw * (h / nh);
                hn = h;
            }
            (0, helpers_1.css)(_this.crop_box, {
                width: wn,
                height: hn
            });
        };
        _this.showCrop = function () {
            if (!_this.cropImage) {
                return;
            }
            _this.calcCropBox();
            var w = _this.cropImage.offsetWidth ||
                _this.image.offsetWidth ||
                _this.image.naturalWidth;
            _this.new_w = ImageEditor_1.calcValueByPercent(w, _this.o.cropDefaultWidth);
            var h = _this.cropImage.offsetHeight ||
                _this.image.offsetHeight ||
                _this.image.naturalHeight;
            if (_this.cropUseRatio) {
                _this.new_h = _this.new_w / _this.ratio;
            }
            else {
                _this.new_h = ImageEditor_1.calcValueByPercent(h, _this.o.cropDefaultHeight);
            }
            (0, helpers_1.css)(_this.cropHandler, {
                backgroundImage: 'url(' + (0, helpers_1.attr)(_this.cropImage, 'src') + ')',
                width: _this.new_w,
                height: _this.new_h,
                left: w / 2 - _this.new_w / 2,
                top: h / 2 - _this.new_h / 2
            });
            _this.j.e.fire(_this.cropHandler, 'updatesize');
        };
        _this.updateCropBox = function () {
            if (!_this.cropImage) {
                return;
            }
            var ratioX = _this.cropImage.offsetWidth / _this.naturalWidth, ratioY = _this.cropImage.offsetHeight / _this.naturalHeight;
            _this.cropBox.x = (0, helpers_1.css)(_this.cropHandler, 'left') / ratioX;
            _this.cropBox.y = (0, helpers_1.css)(_this.cropHandler, 'top') / ratioY;
            _this.cropBox.w = _this.cropHandler.offsetWidth / ratioX;
            _this.cropBox.h = _this.cropHandler.offsetHeight / ratioY;
            _this.sizes.textContent =
                _this.cropBox.w.toFixed(0) + 'x' + _this.cropBox.h.toFixed(0);
        };
        _this.updateResizeBox = function () {
            _this.resizeBox.w = _this.image.offsetWidth || _this.naturalWidth;
            _this.resizeBox.h = _this.image.offsetHeight || _this.naturalHeight;
        };
        _this.setHandlers = function () {
            var self = _this;
            var _a = (0, helpers_1.refs)(_this.editor), widthInput = _a.widthInput, heightInput = _a.heightInput;
            self.j.e
                .on([
                self.editor.querySelector('.jodit_bottomright'),
                self.cropHandler
            ], "mousedown.".concat(jie), _this.onResizeHandleMouseDown)
                .on(_this.j.ow, "resize.".concat(jie), function () {
                _this.j.e.fire(self.resizeHandler, 'updatesize');
                self.showCrop();
                _this.j.e.fire(self.cropHandler, 'updatesize');
            });
            self.j.e
                .on((0, helpers_1.toArray)(_this.editor.querySelectorAll(".".concat(jie, "__slider-title"))), 'click', _this.onTitleModeClick)
                .on([widthInput, heightInput], 'input', _this.onChangeSizeInput);
            var _b = (0, helpers_1.refs)(_this.editor), keepAspectRatioResize = _b.keepAspectRatioResize, keepAspectRatioCrop = _b.keepAspectRatioCrop;
            if (keepAspectRatioResize) {
                keepAspectRatioResize.addEventListener('change', function () {
                    _this.resizeUseRatio = keepAspectRatioResize.checked;
                });
            }
            if (keepAspectRatioCrop) {
                keepAspectRatioCrop.addEventListener('change', function () {
                    _this.cropUseRatio = keepAspectRatioCrop.checked;
                });
            }
            self.j.e
                .on(self.resizeHandler, 'updatesize', function () {
                (0, helpers_1.css)(self.resizeHandler, {
                    top: 0,
                    left: 0,
                    width: self.image.offsetWidth || self.naturalWidth,
                    height: self.image.offsetHeight || self.naturalHeight
                });
                _this.updateResizeBox();
            })
                .on(self.cropHandler, 'updatesize', function () {
                if (!self.cropImage) {
                    return;
                }
                var new_x = (0, helpers_1.css)(self.cropHandler, 'left'), new_y = (0, helpers_1.css)(self.cropHandler, 'top'), new_width = self.cropHandler.offsetWidth, new_height = self.cropHandler.offsetHeight;
                if (new_x < 0) {
                    new_x = 0;
                }
                if (new_y < 0) {
                    new_y = 0;
                }
                if (new_x + new_width > self.cropImage.offsetWidth) {
                    new_width = self.cropImage.offsetWidth - new_x;
                    if (self.cropUseRatio) {
                        new_height = new_width / self.ratio;
                    }
                }
                if (new_y + new_height > self.cropImage.offsetHeight) {
                    new_height = self.cropImage.offsetHeight - new_y;
                    if (self.cropUseRatio) {
                        new_width = new_height * self.ratio;
                    }
                }
                (0, helpers_1.css)(self.cropHandler, {
                    width: new_width,
                    height: new_height,
                    left: new_x,
                    top: new_y,
                    backgroundPosition: -new_x - 1 + 'px ' + (-new_y - 1) + 'px',
                    backgroundSize: self.cropImage.offsetWidth +
                        'px ' +
                        self.cropImage.offsetHeight +
                        'px'
                });
                self.updateCropBox();
            });
            Object.values(self.buttons).forEach(function (button) {
                button.onAction(function () {
                    var data = {
                        action: self.activeTab,
                        box: self.activeTab === TABS.resize
                            ? self.resizeBox
                            : self.cropBox
                    };
                    switch (button) {
                        case self.buttons.saveas:
                            (0, dialog_1.Prompt)(self.j.i18n('Enter new name'), self.j.i18n('Save in new file'), function (name) {
                                if (!(0, helpers_1.trim)(name)) {
                                    (0, dialog_1.Alert)(self.j.i18n('The name should not be empty')).bindDestruct(_this.j);
                                    return false;
                                }
                                self.onSave(name, data, self.hide, function (e) {
                                    (0, dialog_1.Alert)(e.message).bindDestruct(self.j);
                                });
                            }).bindDestruct(_this.j);
                            break;
                        case self.buttons.save:
                            self.onSave(undefined, data, self.hide, function (e) {
                                (0, dialog_1.Alert)(e.message).bindDestruct(self.j);
                            });
                            break;
                        case self.buttons.reset:
                            if (self.activeTab === TABS.resize) {
                                (0, helpers_1.css)(self.image, {
                                    width: null,
                                    height: null
                                });
                                widthInput.value = self.naturalWidth.toString();
                                heightInput.value = self.naturalHeight.toString();
                                self.j.e.fire(self.resizeHandler, 'updatesize');
                            }
                            else {
                                self.showCrop();
                            }
                            break;
                    }
                });
            });
        };
        _this.options =
            editor && editor.o && editor.o.imageeditor
                ? editor.o.imageeditor
                : config_1.Config.defaultOptions.imageeditor;
        var o = _this.options;
        _this.resizeUseRatio = o.resizeUseRatio;
        _this.cropUseRatio = o.cropUseRatio;
        _this.buttons = {
            reset: (0, button_1.Button)(_this.j, 'update', 'Reset'),
            save: (0, button_1.Button)(_this.j, 'save', 'Save'),
            saveas: (0, button_1.Button)(_this.j, 'save', 'Save as ...')
        };
        _this.activeTab = o.resize ? TABS.resize : TABS.crop;
        _this.editor = (0, form_1.form)(_this.j, _this.options);
        var _a = (0, helpers_1.refs)(_this.editor), resizeBox = _a.resizeBox, cropBox = _a.cropBox;
        _this.resize_box = resizeBox;
        _this.crop_box = cropBox;
        _this.sizes = _this.editor.querySelector(".".concat(jie, "__area.").concat(jie, "__area_crop .jodit-image-editor__sizes"));
        _this.resizeHandler = _this.editor.querySelector(".".concat(jie, "__resizer"));
        _this.cropHandler = _this.editor.querySelector(".".concat(jie, "__croper"));
        _this.dialog = new dialog_1.Dialog({
            fullsize: _this.j.o.fullsize,
            globalFullSize: _this.j.o.globalFullSize,
            language: _this.j.o.language,
            buttons: ['fullsize', 'dialog.close']
        });
        _this.dialog.setContent(_this.editor);
        _this.dialog.setSize(_this.o.width, _this.o.height);
        _this.dialog.setHeader([
            _this.buttons.reset,
            _this.buttons.save,
            _this.buttons.saveas
        ]);
        _this.setHandlers();
        return _this;
    }
    ImageEditor_1 = ImageEditor;
    ImageEditor.prototype.className = function () {
        return 'ImageEditor';
    };
    ImageEditor.prototype.onTitleModeClick = function (e) {
        var self = this, title = e.target;
        var slide = title === null || title === void 0 ? void 0 : title.parentElement;
        if (!slide) {
            return;
        }
        (0, helpers_1.$$)(".".concat(jie, "__slider,.").concat(jie, "__area"), self.editor).forEach(function (elm) {
            return elm.classList.remove("".concat(jie, "_active"));
        });
        slide.classList.add("".concat(jie, "_active"));
        this.activeTab = (0, helpers_1.attr)(slide, '-area') || TABS.resize;
        var tab = self.editor.querySelector(".".concat(jie, "__area.").concat(jie, "__area_") + self.activeTab);
        if (tab) {
            tab.classList.add("".concat(jie, "_active"));
        }
        if (self.activeTab === TABS.crop) {
            self.showCrop();
        }
    };
    ImageEditor.prototype.onChangeSizeInput = function (e) {
        var self = this, input = e.target, _a = (0, helpers_1.refs)(this.editor), widthInput = _a.widthInput, heightInput = _a.heightInput, isWidth = (0, helpers_1.attr)(input, 'data-ref') === 'widthInput', x = parseInt(input.value, 10), minX = isWidth ? self.o.min_width : self.o.min_height, minY = !isWidth ? self.o.min_width : self.o.min_height;
        var y;
        if (x > minX) {
            (0, helpers_1.css)(self.image, isWidth ? 'width' : 'height', x);
            if (self.resizeUseRatio) {
                y = isWidth
                    ? Math.round(x / self.ratio)
                    : Math.round(x * self.ratio);
                if (y > minY) {
                    (0, helpers_1.css)(self.image, !isWidth ? 'width' : 'height', y);
                    if (isWidth) {
                        heightInput.value = y.toString();
                    }
                    else {
                        widthInput.value = y.toString();
                    }
                }
            }
        }
        this.j.e.fire(self.resizeHandler, 'updatesize');
    };
    ImageEditor.prototype.onResizeHandleMouseDown = function (e) {
        var self = this;
        self.target = e.target;
        e.preventDefault();
        e.stopImmediatePropagation();
        self.clicked = true;
        self.start_x = e.clientX;
        self.start_y = e.clientY;
        if (self.activeTab === TABS.crop) {
            self.top_x = (0, helpers_1.css)(self.cropHandler, 'left');
            self.top_y = (0, helpers_1.css)(self.cropHandler, 'top');
            self.width = self.cropHandler.offsetWidth;
            self.height = self.cropHandler.offsetHeight;
        }
        else {
            self.width = self.image.offsetWidth;
            self.height = self.image.offsetHeight;
        }
        self.j.e
            .on(this.j.ow, 'mousemove', this.onGlobalMouseMove)
            .one(this.j.ow, 'mouseup', this.onGlobalMouseUp);
    };
    ImageEditor.prototype.onGlobalMouseUp = function (e) {
        if (this.clicked) {
            this.clicked = false;
            e.stopImmediatePropagation();
            this.j.e.off(this.j.ow, 'mousemove', this.onGlobalMouseMove);
        }
    };
    ImageEditor.prototype.onGlobalMouseMove = function (e) {
        var self = this;
        if (!self.clicked) {
            return;
        }
        var _a = (0, helpers_1.refs)(this.editor), widthInput = _a.widthInput, heightInput = _a.heightInput;
        self.diff_x = e.clientX - self.start_x;
        self.diff_y = e.clientY - self.start_y;
        if ((self.activeTab === TABS.resize && self.resizeUseRatio) ||
            (self.activeTab === TABS.crop && self.cropUseRatio)) {
            if (self.diff_x) {
                self.new_w = self.width + self.diff_x;
                self.new_h = Math.round(self.new_w / self.ratio);
            }
            else {
                self.new_h = self.height + self.diff_y;
                self.new_w = Math.round(self.new_h * self.ratio);
            }
        }
        else {
            self.new_w = self.width + self.diff_x;
            self.new_h = self.height + self.diff_y;
        }
        if (self.activeTab === TABS.resize) {
            if (self.new_w > self.o.resizeMinWidth) {
                (0, helpers_1.css)(self.image, 'width', self.new_w + 'px');
                widthInput.value = self.new_w.toString();
            }
            if (self.new_h > self.o.resizeMinHeight) {
                (0, helpers_1.css)(self.image, 'height', self.new_h + 'px');
                heightInput.value = self.new_h.toString();
            }
            this.j.e.fire(self.resizeHandler, 'updatesize');
        }
        else {
            if (self.target !== self.cropHandler) {
                if (self.top_x + self.new_w > self.cropImage.offsetWidth) {
                    self.new_w = self.cropImage.offsetWidth - self.top_x;
                }
                if (self.top_y + self.new_h > self.cropImage.offsetHeight) {
                    self.new_h = self.cropImage.offsetHeight - self.top_y;
                }
                (0, helpers_1.css)(self.cropHandler, {
                    width: self.new_w,
                    height: self.new_h
                });
            }
            else {
                if (self.top_x + self.diff_x + self.cropHandler.offsetWidth >
                    self.cropImage.offsetWidth) {
                    self.diff_x =
                        self.cropImage.offsetWidth -
                            self.top_x -
                            self.cropHandler.offsetWidth;
                }
                (0, helpers_1.css)(self.cropHandler, 'left', self.top_x + self.diff_x);
                if (self.top_y + self.diff_y + self.cropHandler.offsetHeight >
                    self.cropImage.offsetHeight) {
                    self.diff_y =
                        self.cropImage.offsetHeight -
                            self.top_y -
                            self.cropHandler.offsetHeight;
                }
                (0, helpers_1.css)(self.cropHandler, 'top', self.top_y + self.diff_y);
            }
            this.j.e.fire(self.cropHandler, 'updatesize');
        }
    };
    Object.defineProperty(ImageEditor.prototype, "o", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    ImageEditor.prototype.hide = function () {
        this.dialog.close();
    };
    ImageEditor.prototype.open = function (url, save) {
        var _this = this;
        return this.j.async.promise(function (resolve) {
            var timestamp = new Date().getTime();
            _this.image = _this.j.c.element('img');
            (0, helpers_1.$$)('img,.jodit-icon_loader', _this.resize_box).forEach(dom_1.Dom.safeRemove);
            (0, helpers_1.$$)('img,.jodit-icon_loader', _this.crop_box).forEach(dom_1.Dom.safeRemove);
            (0, helpers_1.css)(_this.cropHandler, 'background', 'transparent');
            _this.onSave = save;
            _this.resize_box.appendChild(_this.j.c.element('i', { class: 'jodit-icon_loader' }));
            _this.crop_box.appendChild(_this.j.c.element('i', { class: 'jodit-icon_loader' }));
            if (/\?/.test(url)) {
                url += '&_tst=' + timestamp;
            }
            else {
                url += '?_tst=' + timestamp;
            }
            _this.image.setAttribute('src', url);
            _this.dialog.open();
            var _a = (0, helpers_1.refs)(_this.editor), widthInput = _a.widthInput, heightInput = _a.heightInput;
            var onload = function () {
                if (_this.isDestructed) {
                    return;
                }
                _this.image.removeEventListener('load', onload);
                _this.naturalWidth = _this.image.naturalWidth;
                _this.naturalHeight = _this.image.naturalHeight;
                widthInput.value = _this.naturalWidth.toString();
                heightInput.value = _this.naturalHeight.toString();
                _this.ratio = _this.naturalWidth / _this.naturalHeight;
                _this.resize_box.appendChild(_this.image);
                _this.cropImage = _this.image.cloneNode(true);
                _this.crop_box.appendChild(_this.cropImage);
                (0, helpers_1.$$)('.jodit-icon_loader', _this.editor).forEach(dom_1.Dom.safeRemove);
                if (_this.activeTab === TABS.crop) {
                    _this.showCrop();
                }
                _this.j.e.fire(_this.resizeHandler, 'updatesize');
                _this.j.e.fire(_this.cropHandler, 'updatesize');
                _this.dialog.setPosition();
                _this.j.e.fire('afterImageEditor');
                resolve(_this.dialog);
            };
            _this.image.addEventListener('load', onload);
            if (_this.image.complete) {
                onload();
            }
        });
    };
    ImageEditor.prototype.destruct = function () {
        if (this.isDestructed) {
            return;
        }
        if (this.dialog && !this.dialog.isInDestruct) {
            this.dialog.destruct();
        }
        dom_1.Dom.safeRemove(this.editor);
        if (this.j.e) {
            this.j.e
                .off(this.j.ow, 'mousemove', this.onGlobalMouseMove)
                .off(this.j.ow, 'mouseup', this.onGlobalMouseUp)
                .off(this.ow, ".".concat(jie))
                .off(".".concat(jie));
        }
        _super.prototype.destruct.call(this);
    };
    var ImageEditor_1;
    ImageEditor.calcValueByPercent = function (value, percent) {
        var percentStr = percent.toString();
        var valueNbr = parseFloat(value.toString());
        var match;
        match = /^[-+]?[0-9]+(px)?$/.exec(percentStr);
        if (match) {
            return parseInt(percentStr, 10);
        }
        match = /^([-+]?[0-9.]+)%$/.exec(percentStr);
        if (match) {
            return Math.round(valueNbr * (parseFloat(match[1]) / 100));
        }
        return valueNbr || 0;
    };
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ImageEditor.prototype, "onTitleModeClick", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.debounce)(),
        decorators_1.autobind
    ], ImageEditor.prototype, "onChangeSizeInput", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ImageEditor.prototype, "onResizeHandleMouseDown", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ImageEditor.prototype, "onGlobalMouseUp", null);
    (0, tslib_1.__decorate)([
        (0, decorators_1.throttle)(10)
    ], ImageEditor.prototype, "onGlobalMouseMove", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ImageEditor.prototype, "hide", null);
    (0, tslib_1.__decorate)([
        decorators_1.autobind
    ], ImageEditor.prototype, "open", null);
    ImageEditor = ImageEditor_1 = (0, tslib_1.__decorate)([
        decorators_1.component
    ], ImageEditor);
    return ImageEditor;
}(component_1.ViewComponent));
exports.ImageEditor = ImageEditor;
function openImageEditor(href, name, path, source, onSuccess, onFailed) {
    var _this = this;
    return this.getInstance('ImageEditor', this.o).open(href, function (newname, box, success, failed) {
        return (0, helpers_1.call)(box.action === 'resize'
            ? _this.dataProvider.resize
            : _this.dataProvider.crop, path, source, name, newname, box.box)
            .then(function (ok) {
            if (ok) {
                success();
                if (onSuccess) {
                    onSuccess();
                }
            }
        })
            .catch(function (error) {
            failed(error);
            if (onFailed) {
                onFailed(error);
            }
        });
    });
}
exports.openImageEditor = openImageEditor;


/***/ }),
/* 228 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 229 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.form = void 0;
var ui_1 = __webpack_require__(120);
var jie = 'jodit-image-editor';
var gi = ui_1.Icon.get.bind(ui_1.Icon);
var act = function (el, className) {
    if (className === void 0) { className = 'jodti-image-editor_active'; }
    return el ? className : '';
};
var form = function (editor, o) {
    var i = editor.i18n.bind(editor);
    var switcher = function (label, ref, active) {
        if (active === void 0) { active = true; }
        return "<div class=\"jodit-form__group\">\n\t\t\t<label>".concat(i(label), "</label>\n\n\t\t\t<label class='jodit-switcher'>\n\t\t\t\t<input ").concat(act(active, 'checked'), " data-ref=\"").concat(ref, "\" type=\"checkbox\"/>\n\t\t\t\t<span class=\"jodit-switcher__slider\"></span>\n\t\t\t</label>\n\t</div>");
    };
    return editor.create.fromHTML("<form class=\"".concat(jie, " jodit-properties\">\n\t\t<div class=\"jodit-grid jodit-grid_xs-column\">\n\t\t\t<div class=\"jodit_col-lg-3-4 jodit_col-sm-5-5\">\n\t\t\t").concat(o.resize
        ? "<div class=\"".concat(jie, "__area ").concat(jie, "__area_resize ").concat(jie, "_active\">\n\t\t\t\t\t\t\t<div data-ref=\"resizeBox\" class=\"").concat(jie, "__box\"></div>\n\t\t\t\t\t\t\t<div class=\"").concat(jie, "__resizer\">\n\t\t\t\t\t\t\t\t<i class=\"jodit_bottomright\"></i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>")
        : '', "\n\t\t\t").concat(o.crop
        ? "<div class=\"".concat(jie, "__area ").concat(jie, "__area_crop ").concat(act(!o.resize), "\">\n\t\t\t\t\t\t\t<div data-ref=\"cropBox\" class=\"").concat(jie, "__box\">\n\t\t\t\t\t\t\t\t<div class=\"").concat(jie, "__croper\">\n\t\t\t\t\t\t\t\t\t<i class=\"jodit_bottomright\"></i>\n\t\t\t\t\t\t\t\t\t<i class=\"").concat(jie, "__sizes\"></i>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>")
        : '', "\n\t\t\t</div>\n\t\t\t<div class=\"jodit_col-lg-1-4 jodit_col-sm-5-5\">\n\t\t\t").concat(o.resize
        ? "<div data-area=\"resize\" class=\"".concat(jie, "__slider ").concat(jie, "_active\">\n\t\t\t\t\t\t\t<div class=\"").concat(jie, "__slider-title\">\n\t\t\t\t\t\t\t\t").concat(gi('resize'), "\n\t\t\t\t\t\t\t\t").concat(i('Resize'), "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"").concat(jie, "__slider-content\">\n\t\t\t\t\t\t\t\t<div class=\"jodit-form__group\">\n\t\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t\t").concat(i('Width'), "\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t<input type=\"number\" data-ref=\"widthInput\" class=\"jodit-input\"/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"jodit-form__group\">\n\t\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t\t").concat(i('Height'), "\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t<input type=\"number\" data-ref=\"heightInput\" class=\"jodit-input\"/>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t").concat(switcher('Keep Aspect Ratio', 'keepAspectRatioResize'), "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>")
        : '', "\n\t\t\t").concat(o.crop
        ? "<div data-area=\"crop\" class=\"".concat(jie, "__slider ").concat(act(!o.resize), "'\">\n\t\t\t\t\t\t\t<div class=\"").concat(jie, "__slider-title\">\n\t\t\t\t\t\t\t\t").concat(gi('crop'), "\n\t\t\t\t\t\t\t\t").concat(i('Crop'), "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"").concat(jie, "__slider-content\">\n\t\t\t\t\t\t\t\t").concat(switcher('Keep Aspect Ratio', 'keepAspectRatioCrop'), "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>")
        : '', "\n\t\t\t</div>\n\t\t</div>\n\t</form>"));
};
exports.form = form;


/***/ }),
/* 230 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __webpack_require__(87);
config_1.Config.prototype.imageeditor = {
    min_width: 20,
    min_height: 20,
    closeAfterSave: false,
    width: '85%',
    height: '85%',
    crop: true,
    resize: true,
    resizeUseRatio: true,
    resizeMinWidth: 20,
    resizeMinHeight: 20,
    cropUseRatio: true,
    cropDefaultWidth: '70%',
    cropDefaultHeight: '70%'
};


/***/ }),
/* 231 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteFile = void 0;
function deleteFile(fb, name, source) {
    return fb.dataProvider
        .fileRemove(fb.state.currentPath, name, source)
        .then(function (message) {
        fb.status(message || fb.i18n('File "%s" was deleted', name), true);
    })
        .catch(fb.status);
}
exports.deleteFile = deleteFile;


/***/ }),
/* 232 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.selfListeners = void 0;
var tslib_1 = __webpack_require__(1);
var dialog_1 = __webpack_require__(189);
var checker_1 = __webpack_require__(36);
var helpers_1 = __webpack_require__(5);
var data_provider_1 = __webpack_require__(219);
var image_editor_1 = __webpack_require__(227);
var load_tree_1 = __webpack_require__(223);
var load_items_1 = __webpack_require__(224);
var delete_file_1 = __webpack_require__(231);
function selfListeners() {
    var _this = this;
    var state = this.state, dp = this.dataProvider, self = this;
    self.e
        .on('view.filebrowser', function (view) {
        if (view !== state.view) {
            state.view = view;
        }
    })
        .on('sort.filebrowser', function (value) {
        if (value !== state.sortBy) {
            state.sortBy = value;
            (0, load_items_1.loadItems)(self).catch(self.status);
        }
    })
        .on('filter.filebrowser', function (value) {
        if (value !== state.filterWord) {
            state.filterWord = value;
            (0, load_items_1.loadItems)(self).catch(self.status);
        }
    })
        .on('openFolder.filebrowser', function (data) {
        var path;
        if (data.name === '..') {
            path = data.path
                .split('/')
                .filter(function (p) { return p.length; })
                .slice(0, -1)
                .join('/');
        }
        else {
            path = (0, helpers_1.normalizePath)(data.path, data.name);
        }
        self.state.currentPath = path;
        self.state.currentSource =
            data.name === '.' ? data_provider_1.DEFAULT_SOURCE_NAME : data.source;
    })
        .on('removeFolder.filebrowser', function (data) {
        (0, dialog_1.Confirm)(self.i18n('Are you sure?'), self.i18n('Delete'), function (yes) {
            if (yes) {
                dp.folderRemove(data.path, data.name, data.source)
                    .then(function (message) {
                    self.status(message, true);
                    return (0, load_tree_1.loadTree)(self);
                })
                    .catch(self.status);
            }
        }).bindDestruct(self);
    })
        .on('renameFolder.filebrowser', function (data) {
        (0, dialog_1.Prompt)(self.i18n('Enter new name'), self.i18n('Rename'), function (newName) {
            if (!(0, checker_1.isValidName)(newName)) {
                self.status(self.i18n('Enter new name'));
                return false;
            }
            dp.folderRename(data.path, data.name, newName, data.source)
                .then(function (message) {
                self.state.activeElements = [];
                self.status(message, true);
                return (0, load_tree_1.loadTree)(self);
            })
                .catch(self.status);
            return;
        }, self.i18n('type name'), data.name).bindDestruct(self);
    })
        .on('addFolder.filebrowser', function (data) {
        (0, dialog_1.Prompt)(self.i18n('Enter Directory name'), self.i18n('Create directory'), function (name) {
            dp.createFolder(name, data.path, data.source)
                .then(function () { return (0, load_tree_1.loadTree)(self); })
                .catch(self.status);
        }, self.i18n('type name')).bindDestruct(self);
    })
        .on('fileRemove.filebrowser', function () {
        if (self.state.activeElements.length) {
            (0, dialog_1.Confirm)(self.i18n('Are you sure?'), '', function (yes) {
                if (yes) {
                    var promises_1 = [];
                    self.state.activeElements.forEach(function (item) {
                        promises_1.push((0, delete_file_1.deleteFile)(self, item.file || item.name || '', item.sourceName));
                    });
                    self.state.activeElements = [];
                    Promise.all(promises_1).then(function () { return (0, load_tree_1.loadTree)(self).catch(self.status); }, self.status);
                }
            }).bindDestruct(self);
        }
    })
        .on('edit.filebrowser', function () {
        if (self.state.activeElements.length === 1) {
            var _a = (0, tslib_1.__read)(_this.state.activeElements, 1), file = _a[0];
            image_editor_1.openImageEditor.call(self, file.fileURL, file.file || '', file.path, file.sourceName);
        }
    })
        .on('fileRename.filebrowser', function (name, path, source) {
        if (self.state.activeElements.length === 1) {
            (0, dialog_1.Prompt)(self.i18n('Enter new name'), self.i18n('Rename'), function (newName) {
                if (!(0, checker_1.isValidName)(newName)) {
                    self.status(self.i18n('Enter new name'));
                    return false;
                }
                dp.fileRename(path, name, newName, source)
                    .then(function (message) {
                    self.state.activeElements = [];
                    self.status(message, true);
                    (0, load_items_1.loadItems)(self).catch(self.status);
                })
                    .catch(self.status);
                return;
            }, self.i18n('type name'), name).bindDestruct(_this);
        }
    })
        .on('update.filebrowser', function () {
        (0, load_tree_1.loadTree)(_this).then(_this.status);
    });
}
exports.selfListeners = selfListeners;


/***/ }),
/* 233 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(234), exports);
(0, tslib_1.__exportStar)(__webpack_require__(236), exports);


/***/ }),
/* 234 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileBrowserFiles = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(235);
var ui_1 = __webpack_require__(120);
var FileBrowserFiles = (function (_super) {
    (0, tslib_1.__extends)(FileBrowserFiles, _super);
    function FileBrowserFiles() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileBrowserFiles.prototype.className = function () {
        return 'FilebrowserFiles';
    };
    return FileBrowserFiles;
}(ui_1.UIGroup));
exports.FileBrowserFiles = FileBrowserFiles;


/***/ }),
/* 235 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 236 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileBrowserTree = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(237);
var ui_1 = __webpack_require__(120);
var FileBrowserTree = (function (_super) {
    (0, tslib_1.__extends)(FileBrowserTree, _super);
    function FileBrowserTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileBrowserTree.prototype.className = function () {
        return 'FilebrowserTree';
    };
    return FileBrowserTree;
}(ui_1.UIGroup));
exports.FileBrowserTree = FileBrowserTree;


/***/ }),
/* 237 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 238 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Observer = void 0;
var tslib_1 = __webpack_require__(1);
var config_1 = __webpack_require__(87);
var component_1 = __webpack_require__(16);
var snapshot_1 = __webpack_require__(239);
var stack_1 = __webpack_require__(240);
var command_1 = __webpack_require__(241);
var decorators_1 = __webpack_require__(32);
config_1.Config.prototype.observer = {
    maxHistoryLength: Infinity,
    timeout: 100
};
var Observer = (function (_super) {
    (0, tslib_1.__extends)(Observer, _super);
    function Observer(editor) {
        var _this = _super.call(this, editor) || this;
        _this.stack = new stack_1.Stack(_this.j.o.observer.maxHistoryLength);
        _this.snapshot = new snapshot_1.Snapshot(_this.j);
        _this.updateTick = 0;
        editor.e.on('afterAddPlace.observer', function () {
            if (_this.isInDestruct) {
                return;
            }
            _this.startValue = _this.snapshot.make();
            editor.events
                .on('internalChange', function () {
                _this.startValue = _this.snapshot.make();
            })
                .on(editor.editor, [
                'changeSelection',
                'selectionstart',
                'selectionchange',
                'mousedown',
                'mouseup',
                'keydown',
                'keyup'
            ]
                .map(function (f) { return f + '.observer'; })
                .join(' '), function () {
                if (_this.startValue.html ===
                    _this.j.getNativeEditorValue()) {
                    _this.startValue = _this.snapshot.make();
                }
            })
                .on(_this, 'change.observer', _this.onChange);
        });
        return _this;
    }
    Observer.prototype.className = function () {
        return 'Observer';
    };
    Object.defineProperty(Observer.prototype, "startValue", {
        get: function () {
            return this.__startValue;
        },
        set: function (value) {
            this.__startValue = value;
        },
        enumerable: false,
        configurable: true
    });
    Observer.prototype.upTick = function () {
        this.updateTick += 1;
    };
    Observer.prototype.onChange = function () {
        if (this.snapshot.isBlocked) {
            return;
        }
        this.updateStack();
    };
    Observer.prototype.updateStack = function (replace) {
        if (replace === void 0) { replace = false; }
        var newValue = this.snapshot.make();
        if (!snapshot_1.Snapshot.equal(newValue, this.startValue)) {
            var newCommand = new command_1.Command(this.startValue, newValue, this, this.updateTick);
            if (replace) {
                var command = this.stack.current();
                if (command && this.updateTick === command.tick) {
                    this.stack.replace(newCommand);
                }
            }
            else {
                this.stack.push(newCommand);
            }
            this.startValue = newValue;
            this.fireChangeStack();
        }
    };
    Observer.prototype.redo = function () {
        if (this.stack.redo()) {
            this.startValue = this.snapshot.make();
            this.fireChangeStack();
        }
    };
    Observer.prototype.undo = function () {
        if (this.stack.undo()) {
            this.startValue = this.snapshot.make();
            this.fireChangeStack();
        }
    };
    Observer.prototype.clear = function () {
        this.startValue = this.snapshot.make();
        this.stack.clear();
        this.fireChangeStack();
    };
    Observer.prototype.replaceSnapshot = function () {
        this.updateStack(true);
    };
    Observer.prototype.fireChangeStack = function () {
        var _a;
        this.j && !this.j.isInDestruct && ((_a = this.j.events) === null || _a === void 0 ? void 0 : _a.fire('changeStack'));
    };
    Observer.prototype.destruct = function () {
        if (this.j.events) {
            this.j.e.off('.observer');
        }
        this.snapshot.destruct();
        _super.prototype.destruct.call(this);
    };
    (0, tslib_1.__decorate)([
        (0, decorators_1.debounce)()
    ], Observer.prototype, "onChange", null);
    return Observer;
}(component_1.ViewComponent));
exports.Observer = Observer;


/***/ }),
/* 239 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snapshot = void 0;
var tslib_1 = __webpack_require__(1);
var component_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(21);
var Snapshot = (function (_super) {
    (0, tslib_1.__extends)(Snapshot, _super);
    function Snapshot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isBlocked = false;
        return _this;
    }
    Snapshot.prototype.className = function () {
        return 'Snapshot';
    };
    Snapshot.equal = function (first, second) {
        return (first.html === second.html &&
            JSON.stringify(first.range) === JSON.stringify(second.range));
    };
    Snapshot.countNodesBeforeInParent = function (elm) {
        if (!elm.parentNode) {
            return 0;
        }
        var elms = elm.parentNode.childNodes;
        var count = 0, last = null, j;
        for (j = 0; j < elms.length; j += 1) {
            if (last &&
                !(dom_1.Dom.isText(elms[j]) && elms[j].textContent === '') &&
                !(dom_1.Dom.isText(last) && dom_1.Dom.isText(elms[j]))) {
                count += 1;
            }
            if (elms[j] === elm) {
                return count;
            }
            last = elms[j];
        }
        return 0;
    };
    Snapshot.strokeOffset = function (elm, offset) {
        while (dom_1.Dom.isText(elm)) {
            elm = elm.previousSibling;
            if (dom_1.Dom.isText(elm) && elm.textContent != null) {
                offset += elm.textContent.length;
            }
        }
        return offset;
    };
    Snapshot.prototype.calcHierarchyLadder = function (elm) {
        var counts = [];
        if (!elm || !elm.parentNode || !dom_1.Dom.isOrContains(this.j.editor, elm)) {
            return [];
        }
        while (elm && elm !== this.j.editor) {
            if (elm) {
                counts.push(Snapshot.countNodesBeforeInParent(elm));
            }
            elm = elm.parentNode;
        }
        return counts.reverse();
    };
    Snapshot.prototype.getElementByLadder = function (ladder) {
        var n = this.j.editor, i;
        for (i = 0; n && i < ladder.length; i += 1) {
            n = n.childNodes[ladder[i]];
        }
        return n;
    };
    Snapshot.prototype.make = function () {
        var snapshot = {
            html: '',
            range: {
                startContainer: [],
                startOffset: 0,
                endContainer: [],
                endOffset: 0
            }
        };
        snapshot.html = this.j.getNativeEditorValue();
        var sel = this.j.s.sel;
        if (sel && sel.rangeCount) {
            var range = sel.getRangeAt(0), startContainer = this.calcHierarchyLadder(range.startContainer), endContainer = this.calcHierarchyLadder(range.endContainer);
            var startOffset = Snapshot.strokeOffset(range.startContainer, range.startOffset), endOffset = Snapshot.strokeOffset(range.endContainer, range.endOffset);
            if (!startContainer.length &&
                range.startContainer !== this.j.editor) {
                startOffset = 0;
            }
            if (!endContainer.length && range.endContainer !== this.j.editor) {
                endOffset = 0;
            }
            snapshot.range = {
                startContainer: startContainer,
                startOffset: startOffset,
                endContainer: endContainer,
                endOffset: endOffset
            };
        }
        return snapshot;
    };
    Snapshot.prototype.restore = function (snapshot) {
        this.isBlocked = true;
        var scroll = this.storeScrollState();
        var value = this.j.getNativeEditorValue();
        if (value !== snapshot.html) {
            this.j.setEditorValue(snapshot.html);
        }
        this.restoreOnlySelection(snapshot);
        this.restoreScrollState(scroll);
        this.isBlocked = false;
    };
    Snapshot.prototype.storeScrollState = function () {
        return [this.j.ow.scrollY, this.j.editor.scrollTop];
    };
    Snapshot.prototype.restoreScrollState = function (scrolls) {
        var j = this.j, ow = j.ow;
        ow.scrollTo(ow.scrollX, scrolls[0]);
        j.editor.scrollTop = scrolls[1];
    };
    Snapshot.prototype.restoreOnlySelection = function (snapshot) {
        try {
            if (snapshot.range) {
                var range = this.j.ed.createRange();
                range.setStart(this.getElementByLadder(snapshot.range.startContainer), snapshot.range.startOffset);
                range.setEnd(this.getElementByLadder(snapshot.range.endContainer), snapshot.range.endOffset);
                this.j.s.selectRange(range);
            }
        }
        catch (__ignore) {
            this.j.editor.lastChild &&
                this.j.s.setCursorAfter(this.j.editor.lastChild);
            if (false) {}
        }
    };
    Snapshot.prototype.destruct = function () {
        this.isBlocked = false;
        _super.prototype.destruct.call(this);
    };
    return Snapshot;
}(component_1.ViewComponent));
exports.Snapshot = Snapshot;


/***/ }),
/* 240 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Stack = void 0;
var Stack = (function () {
    function Stack(size) {
        this.size = size;
        this.commands = [];
        this.stackPosition = -1;
    }
    Object.defineProperty(Stack.prototype, "length", {
        get: function () {
            return this.commands.length;
        },
        enumerable: false,
        configurable: true
    });
    Stack.prototype.clearRedo = function () {
        this.commands.length = this.stackPosition + 1;
    };
    Stack.prototype.clear = function () {
        this.commands.length = 0;
        this.stackPosition = -1;
    };
    Stack.prototype.push = function (command) {
        this.clearRedo();
        this.commands.push(command);
        this.stackPosition += 1;
        if (this.commands.length > this.size) {
            this.commands.shift();
            this.stackPosition -= 1;
        }
    };
    Stack.prototype.replace = function (command) {
        this.commands[this.stackPosition] = command;
    };
    Stack.prototype.current = function () {
        return this.commands[this.stackPosition];
    };
    Stack.prototype.undo = function () {
        if (this.canUndo()) {
            if (this.commands[this.stackPosition]) {
                this.commands[this.stackPosition].undo();
            }
            this.stackPosition -= 1;
            return true;
        }
        return false;
    };
    Stack.prototype.redo = function () {
        if (this.canRedo()) {
            this.stackPosition += 1;
            if (this.commands[this.stackPosition]) {
                this.commands[this.stackPosition].redo();
            }
            return true;
        }
        return false;
    };
    Stack.prototype.canUndo = function () {
        return this.stackPosition >= 0;
    };
    Stack.prototype.canRedo = function () {
        return this.stackPosition < this.commands.length - 1;
    };
    return Stack;
}());
exports.Stack = Stack;


/***/ }),
/* 241 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Command = void 0;
var Command = (function () {
    function Command(oldValue, newValue, observer, tick) {
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.observer = observer;
        this.tick = tick;
    }
    Command.prototype.undo = function () {
        this.observer.snapshot.restore(this.oldValue);
    };
    Command.prototype.redo = function () {
        this.observer.snapshot.restore(this.newValue);
    };
    return Command;
}());
exports.Command = Command;


/***/ }),
/* 242 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatusBar = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(243);
var component_1 = __webpack_require__(16);
var dom_1 = __webpack_require__(21);
var traits_1 = __webpack_require__(122);
var decorators_1 = __webpack_require__(32);
var StatusBar = (function (_super) {
    (0, tslib_1.__extends)(StatusBar, _super);
    function StatusBar(jodit, target) {
        var _this = _super.call(this, jodit) || this;
        _this.target = target;
        _this.mods = {};
        _this.container = jodit.c.div('jodit-status-bar');
        target.appendChild(_this.container);
        _this.hide();
        return _this;
    }
    StatusBar.prototype.className = function () {
        return 'StatusBar';
    };
    StatusBar.prototype.hide = function () {
        this.container.classList.add('jodit_hidden');
    };
    StatusBar.prototype.show = function () {
        this.container.classList.remove('jodit_hidden');
    };
    Object.defineProperty(StatusBar.prototype, "isShown", {
        get: function () {
            return !this.container.classList.contains('jodit_hidden');
        },
        enumerable: false,
        configurable: true
    });
    StatusBar.prototype.setMod = function (name, value) {
        traits_1.Mods.setMod.call(this, name, value);
        return this;
    };
    StatusBar.prototype.getMod = function (name) {
        return traits_1.Mods.getMod.call(this, name);
    };
    StatusBar.prototype.getHeight = function () {
        var _a, _b;
        return (_b = (_a = this.container) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0;
    };
    StatusBar.prototype.findEmpty = function (inTheRight) {
        if (inTheRight === void 0) { inTheRight = false; }
        var items = traits_1.Elms.getElms.call(this, inTheRight ? 'item-right' : 'item');
        for (var i = 0; i < items.length; i += 1) {
            if (!items[i].innerHTML.trim().length) {
                return items[i];
            }
        }
        return;
    };
    StatusBar.prototype.append = function (child, inTheRight) {
        var _a;
        if (inTheRight === void 0) { inTheRight = false; }
        var wrapper = this.findEmpty(inTheRight) ||
            this.j.c.div(this.getFullElName('item'));
        if (inTheRight) {
            wrapper.classList.add(this.getFullElName('item-right'));
        }
        wrapper.appendChild(child);
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(wrapper);
        if (this.j.o.statusbar) {
            this.show();
        }
        this.j.e.fire('resize');
    };
    StatusBar.prototype.destruct = function () {
        this.setStatus(component_1.STATUSES.beforeDestruct);
        dom_1.Dom.safeRemove(this.container);
        _super.prototype.destruct.call(this);
    };
    StatusBar = (0, tslib_1.__decorate)([
        decorators_1.component
    ], StatusBar);
    return StatusBar;
}(component_1.ViewComponent));
exports.StatusBar = StatusBar;


/***/ }),
/* 243 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 244 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Table = void 0;
var tslib_1 = __webpack_require__(1);
var consts = __webpack_require__(23);
var dom_1 = __webpack_require__(21);
var helpers_1 = __webpack_require__(5);
var component_1 = __webpack_require__(16);
var global_1 = __webpack_require__(19);
var decorators_1 = __webpack_require__(32);
var markedValue = new WeakMap();
var Table = (function (_super) {
    (0, tslib_1.__extends)(Table, _super);
    function Table() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selected = new Set();
        return _this;
    }
    Table.prototype.className = function () {
        return 'Table';
    };
    Table.prototype.recalculateStyles = function () {
        var style = (0, global_1.getContainer)(this.j, Table, 'style', true);
        var selectors = [];
        this.selected.forEach(function (td) {
            var selector = (0, helpers_1.cssPath)(td);
            selector && selectors.push(selector);
        });
        style.innerHTML = selectors.length
            ? selectors.join(',') +
                "{".concat(this.jodit.options.table.selectionCellStyle, "}")
            : '';
    };
    Table.prototype.addSelection = function (td) {
        this.selected.add(td);
        this.recalculateStyles();
        var table = dom_1.Dom.closest(td, 'table', this.j.editor);
        if (table) {
            var cells = Table.selectedByTable.get(table) || new Set();
            cells.add(td);
            Table.selectedByTable.set(table, cells);
        }
    };
    Table.prototype.removeSelection = function (td) {
        this.selected.delete(td);
        this.recalculateStyles();
        var table = dom_1.Dom.closest(td, 'table', this.j.editor);
        if (table) {
            var cells = Table.selectedByTable.get(table);
            if (cells) {
                cells.delete(td);
                if (!cells.size) {
                    Table.selectedByTable.delete(table);
                }
            }
        }
    };
    Table.prototype.getAllSelectedCells = function () {
        return (0, helpers_1.toArray)(this.selected);
    };
    Table.getSelectedCellsByTable = function (table) {
        var cells = Table.selectedByTable.get(table);
        return cells ? (0, helpers_1.toArray)(cells) : [];
    };
    Table.prototype.destruct = function () {
        this.selected.clear();
        return _super.prototype.destruct.call(this);
    };
    Table.getRowsCount = function (table) {
        return table.rows.length;
    };
    Table.getColumnsCount = function (table) {
        var matrix = Table.formalMatrix(table);
        return matrix.reduce(function (max_count, cells) { return Math.max(max_count, cells.length); }, 0);
    };
    Table.formalMatrix = function (table, callback) {
        var matrix = [[]];
        var rows = (0, helpers_1.toArray)(table.rows);
        var setCell = function (cell, i) {
            if (matrix[i] === undefined) {
                matrix[i] = [];
            }
            var colSpan = cell.colSpan, rowSpan = cell.rowSpan;
            var column, row, currentColumn = 0;
            while (matrix[i][currentColumn]) {
                currentColumn += 1;
            }
            for (row = 0; row < rowSpan; row += 1) {
                for (column = 0; column < colSpan; column += 1) {
                    if (matrix[i + row] === undefined) {
                        matrix[i + row] = [];
                    }
                    if (callback &&
                        callback(cell, i + row, currentColumn + column, colSpan, rowSpan) === false) {
                        return false;
                    }
                    matrix[i + row][currentColumn + column] = cell;
                }
            }
        };
        for (var i = 0; i < rows.length; i += 1) {
            var cells = (0, helpers_1.toArray)(rows[i].cells);
            for (var j = 0; j < cells.length; j += 1) {
                if (setCell(cells[j], i) === false) {
                    return matrix;
                }
            }
        }
        return matrix;
    };
    Table.formalCoordinate = function (table, cell, max) {
        if (max === void 0) { max = false; }
        var i = 0, j = 0, width = 1, height = 1;
        Table.formalMatrix(table, function (td, ii, jj, colSpan, rowSpan) {
            if (cell === td) {
                i = ii;
                j = jj;
                width = colSpan || 1;
                height = rowSpan || 1;
                if (max) {
                    j += (colSpan || 1) - 1;
                    i += (rowSpan || 1) - 1;
                }
                return false;
            }
        });
        return [i, j, width, height];
    };
    Table.appendRow = function (table, line, after, create) {
        var _a;
        var row;
        if (!line) {
            var columnsCount = Table.getColumnsCount(table);
            row = create.element('tr');
            for (var j = 0; j < columnsCount; j += 1) {
                row.appendChild(create.element('td'));
            }
        }
        else {
            row = line.cloneNode(true);
            (0, helpers_1.$$)('td,th', line).forEach(function (cell) {
                var rowspan = (0, helpers_1.attr)(cell, 'rowspan');
                if (rowspan && parseInt(rowspan, 10) > 1) {
                    var newRowSpan = parseInt(rowspan, 10) - 1;
                    (0, helpers_1.attr)(cell, 'rowspan', newRowSpan > 1 ? newRowSpan : null);
                }
            });
            (0, helpers_1.$$)('td,th', row).forEach(function (cell) {
                cell.innerHTML = '';
            });
        }
        if (after && line && line.nextSibling) {
            line.parentNode &&
                line.parentNode.insertBefore(row, line.nextSibling);
        }
        else if (!after && line) {
            line.parentNode && line.parentNode.insertBefore(row, line);
        }
        else {
            (((_a = table.getElementsByTagName('tbody')) === null || _a === void 0 ? void 0 : _a[0]) || table).appendChild(row);
        }
    };
    Table.removeRow = function (table, rowIndex) {
        var box = Table.formalMatrix(table);
        var dec;
        var row = table.rows[rowIndex];
        box[rowIndex].forEach(function (cell, j) {
            dec = false;
            if (rowIndex - 1 >= 0 && box[rowIndex - 1][j] === cell) {
                dec = true;
            }
            else if (box[rowIndex + 1] && box[rowIndex + 1][j] === cell) {
                if (cell.parentNode === row && cell.parentNode.nextSibling) {
                    dec = true;
                    var nextCell = j + 1;
                    while (box[rowIndex + 1][nextCell] === cell) {
                        nextCell += 1;
                    }
                    var nextRow = dom_1.Dom.next(cell.parentNode, function (elm) { return dom_1.Dom.isTag(elm, 'tr'); }, table);
                    if (nextRow) {
                        if (box[rowIndex + 1][nextCell]) {
                            nextRow.insertBefore(cell, box[rowIndex + 1][nextCell]);
                        }
                        else {
                            nextRow.appendChild(cell);
                        }
                    }
                }
            }
            else {
                dom_1.Dom.safeRemove(cell);
            }
            if (dec &&
                (cell.parentNode === row || cell !== box[rowIndex][j - 1])) {
                var rowSpan = cell.rowSpan;
                (0, helpers_1.attr)(cell, 'rowspan', rowSpan - 1 > 1 ? rowSpan - 1 : null);
            }
        });
        dom_1.Dom.safeRemove(row);
    };
    Table.appendColumn = function (table, j, after, create) {
        var box = Table.formalMatrix(table);
        var i;
        if (j === undefined || j < 0) {
            j = Table.getColumnsCount(table) - 1;
        }
        for (i = 0; i < box.length; i += 1) {
            var cell = create.element('td');
            var td = box[i][j];
            var added = false;
            if (after) {
                if ((box[i] && td && j + 1 >= box[i].length) ||
                    td !== box[i][j + 1]) {
                    if (td.nextSibling) {
                        dom_1.Dom.before(td.nextSibling, cell);
                    }
                    else {
                        td.parentNode && td.parentNode.appendChild(cell);
                    }
                    added = true;
                }
            }
            else {
                if (j - 1 < 0 ||
                    (box[i][j] !== box[i][j - 1] && box[i][j].parentNode)) {
                    dom_1.Dom.before(box[i][j], cell);
                    added = true;
                }
            }
            if (!added) {
                (0, helpers_1.attr)(box[i][j], 'colspan', parseInt((0, helpers_1.attr)(box[i][j], 'colspan') || '1', 10) + 1);
            }
        }
    };
    Table.removeColumn = function (table, j) {
        var box = Table.formalMatrix(table);
        var dec;
        box.forEach(function (cells, i) {
            var td = cells[j];
            dec = false;
            if (j - 1 >= 0 && box[i][j - 1] === td) {
                dec = true;
            }
            else if (j + 1 < cells.length && box[i][j + 1] === td) {
                dec = true;
            }
            else {
                dom_1.Dom.safeRemove(td);
            }
            if (dec && (i - 1 < 0 || td !== box[i - 1][j])) {
                var colSpan = td.colSpan;
                (0, helpers_1.attr)(td, 'colspan', colSpan - 1 > 1 ? (colSpan - 1).toString() : null);
            }
        });
    };
    Table.getSelectedBound = function (table, selectedCells) {
        var bound = [
            [Infinity, Infinity],
            [0, 0]
        ];
        var box = Table.formalMatrix(table);
        var i, j, k;
        for (i = 0; i < box.length; i += 1) {
            for (j = 0; box[i] && j < box[i].length; j += 1) {
                if (selectedCells.includes(box[i][j])) {
                    bound[0][0] = Math.min(i, bound[0][0]);
                    bound[0][1] = Math.min(j, bound[0][1]);
                    bound[1][0] = Math.max(i, bound[1][0]);
                    bound[1][1] = Math.max(j, bound[1][1]);
                }
            }
        }
        for (i = bound[0][0]; i <= bound[1][0]; i += 1) {
            for (k = 1, j = bound[0][1]; j <= bound[1][1]; j += 1) {
                while (box[i] && box[i][j - k] && box[i][j] === box[i][j - k]) {
                    bound[0][1] = Math.min(j - k, bound[0][1]);
                    bound[1][1] = Math.max(j - k, bound[1][1]);
                    k += 1;
                }
                k = 1;
                while (box[i] && box[i][j + k] && box[i][j] === box[i][j + k]) {
                    bound[0][1] = Math.min(j + k, bound[0][1]);
                    bound[1][1] = Math.max(j + k, bound[1][1]);
                    k += 1;
                }
                k = 1;
                while (box[i - k] && box[i][j] === box[i - k][j]) {
                    bound[0][0] = Math.min(i - k, bound[0][0]);
                    bound[1][0] = Math.max(i - k, bound[1][0]);
                    k += 1;
                }
                k = 1;
                while (box[i + k] && box[i][j] === box[i + k][j]) {
                    bound[0][0] = Math.min(i + k, bound[0][0]);
                    bound[1][0] = Math.max(i + k, bound[1][0]);
                    k += 1;
                }
            }
        }
        return bound;
    };
    Table.normalizeTable = function (table) {
        var i, j, min, not;
        var __marked = [], box = Table.formalMatrix(table);
        for (j = 0; j < box[0].length; j += 1) {
            min = 1000000;
            not = false;
            for (i = 0; i < box.length; i += 1) {
                if (box[i][j] === undefined) {
                    continue;
                }
                if (box[i][j].colSpan < 2) {
                    not = true;
                    break;
                }
                min = Math.min(min, box[i][j].colSpan);
            }
            if (!not) {
                for (i = 0; i < box.length; i += 1) {
                    if (box[i][j] === undefined) {
                        continue;
                    }
                    Table.mark(box[i][j], 'colspan', box[i][j].colSpan - min + 1, __marked);
                }
            }
        }
        for (i = 0; i < box.length; i += 1) {
            min = 1000000;
            not = false;
            for (j = 0; j < box[i].length; j += 1) {
                if (box[i][j] === undefined) {
                    continue;
                }
                if (box[i][j].rowSpan < 2) {
                    not = true;
                    break;
                }
                min = Math.min(min, box[i][j].rowSpan);
            }
            if (!not) {
                for (j = 0; j < box[i].length; j += 1) {
                    if (box[i][j] === undefined) {
                        continue;
                    }
                    Table.mark(box[i][j], 'rowspan', box[i][j].rowSpan - min + 1, __marked);
                }
            }
        }
        for (i = 0; i < box.length; i += 1) {
            for (j = 0; j < box[i].length; j += 1) {
                if (box[i][j] === undefined) {
                    continue;
                }
                if (box[i][j].hasAttribute('rowspan') &&
                    box[i][j].rowSpan === 1) {
                    (0, helpers_1.attr)(box[i][j], 'rowspan', null);
                }
                if (box[i][j].hasAttribute('colspan') &&
                    box[i][j].colSpan === 1) {
                    (0, helpers_1.attr)(box[i][j], 'colspan', null);
                }
                if (box[i][j].hasAttribute('class') &&
                    !(0, helpers_1.attr)(box[i][j], 'class')) {
                    (0, helpers_1.attr)(box[i][j], 'class', null);
                }
            }
        }
        Table.unmark(__marked);
    };
    Table.mergeSelected = function (table, jodit) {
        var html = [], bound = Table.getSelectedBound(table, Table.getSelectedCellsByTable(table));
        var w = 0, first = null, first_j = 0, td, cols = 0, rows = 0;
        var alreadyMerged = new Set(), __marked = [];
        if (bound && (bound[0][0] - bound[1][0] || bound[0][1] - bound[1][1])) {
            Table.formalMatrix(table, function (cell, i, j, cs, rs) {
                if (i >= bound[0][0] && i <= bound[1][0]) {
                    if (j >= bound[0][1] && j <= bound[1][1]) {
                        td = cell;
                        if (alreadyMerged.has(td)) {
                            return;
                        }
                        alreadyMerged.add(td);
                        if (i === bound[0][0] && td.style.width) {
                            w += td.offsetWidth;
                        }
                        if ((0, helpers_1.trim)(cell.innerHTML.replace(/<br(\/)?>/g, '')) !== '') {
                            html.push(cell.innerHTML);
                        }
                        if (cs > 1) {
                            cols += cs - 1;
                        }
                        if (rs > 1) {
                            rows += rs - 1;
                        }
                        if (!first) {
                            first = cell;
                            first_j = j;
                        }
                        else {
                            Table.mark(td, 'remove', 1, __marked);
                            instance(jodit).removeSelection(td);
                        }
                    }
                }
            });
            cols = bound[1][1] - bound[0][1] + 1;
            rows = bound[1][0] - bound[0][0] + 1;
            if (first) {
                if (cols > 1) {
                    Table.mark(first, 'colspan', cols, __marked);
                }
                if (rows > 1) {
                    Table.mark(first, 'rowspan', rows, __marked);
                }
                if (w) {
                    Table.mark(first, 'width', ((w / table.offsetWidth) * 100).toFixed(consts.ACCURACY) + '%', __marked);
                    if (first_j) {
                        Table.setColumnWidthByDelta(table, first_j, 0, true, __marked);
                    }
                }
                first.innerHTML = html.join('<br/>');
                instance(jodit).addSelection(first);
                alreadyMerged.delete(first);
                Table.unmark(__marked);
                Table.normalizeTable(table);
                (0, helpers_1.toArray)(table.rows).forEach(function (tr, index) {
                    if (!tr.cells.length) {
                        dom_1.Dom.safeRemove(tr);
                    }
                });
            }
        }
    };
    Table.splitHorizontal = function (table, jodit) {
        var coord, td, tr, parent, after;
        var __marked = [];
        Table.getSelectedCellsByTable(table).forEach(function (cell) {
            td = jodit.createInside.element('td');
            td.appendChild(jodit.createInside.element('br'));
            tr = jodit.createInside.element('tr');
            coord = Table.formalCoordinate(table, cell);
            if (cell.rowSpan < 2) {
                Table.formalMatrix(table, function (tdElm, i, j) {
                    if (coord[0] === i &&
                        coord[1] !== j &&
                        tdElm !== cell) {
                        Table.mark(tdElm, 'rowspan', tdElm.rowSpan + 1, __marked);
                    }
                });
                dom_1.Dom.after(dom_1.Dom.closest(cell, 'tr', table), tr);
                tr.appendChild(td);
            }
            else {
                Table.mark(cell, 'rowspan', cell.rowSpan - 1, __marked);
                Table.formalMatrix(table, function (tdElm, i, j) {
                    if (i > coord[0] &&
                        i < coord[0] + cell.rowSpan &&
                        coord[1] > j &&
                        tdElm.parentNode
                            .rowIndex === i) {
                        after = tdElm;
                    }
                    if (coord[0] < i && tdElm === cell) {
                        parent = table.rows[i];
                    }
                });
                if (after) {
                    dom_1.Dom.after(after, td);
                }
                else {
                    parent.insertBefore(td, parent.firstChild);
                }
            }
            if (cell.colSpan > 1) {
                Table.mark(td, 'colspan', cell.colSpan, __marked);
            }
            Table.unmark(__marked);
            instance(jodit).removeSelection(cell);
        });
        this.normalizeTable(table);
    };
    Table.splitVertical = function (table, jodit) {
        var coord, td, percentage;
        var __marked = [];
        Table.getSelectedCellsByTable(table).forEach(function (cell) {
            coord = Table.formalCoordinate(table, cell);
            if (cell.colSpan < 2) {
                Table.formalMatrix(table, function (tdElm, i, j) {
                    if (coord[1] === j && coord[0] !== i && tdElm !== cell) {
                        Table.mark(tdElm, 'colspan', tdElm.colSpan + 1, __marked);
                    }
                });
            }
            else {
                Table.mark(cell, 'colspan', cell.colSpan - 1, __marked);
            }
            td = jodit.createInside.element('td');
            td.appendChild(jodit.createInside.element('br'));
            if (cell.rowSpan > 1) {
                Table.mark(td, 'rowspan', cell.rowSpan, __marked);
            }
            var oldWidth = cell.offsetWidth;
            dom_1.Dom.after(cell, td);
            percentage = oldWidth / table.offsetWidth / 2;
            Table.mark(cell, 'width', (percentage * 100).toFixed(consts.ACCURACY) + '%', __marked);
            Table.mark(td, 'width', (percentage * 100).toFixed(consts.ACCURACY) + '%', __marked);
            Table.unmark(__marked);
            instance(jodit).removeSelection(cell);
        });
        Table.normalizeTable(table);
    };
    Table.setColumnWidthByDelta = function (table, column, delta, noUnmark, marked) {
        var box = Table.formalMatrix(table);
        var clearWidthIndex = 0;
        for (var i = 0; i < box.length; i += 1) {
            var cell = box[i][column];
            if (cell.colSpan > 1 && box.length > 1) {
                continue;
            }
            var w = cell.offsetWidth;
            var percent = ((w + delta) / table.offsetWidth) * 100;
            Table.mark(cell, 'width', percent.toFixed(consts.ACCURACY) + '%', marked);
            clearWidthIndex = i;
            break;
        }
        for (var i = clearWidthIndex + 1; i < box.length; i += 1) {
            var cell = box[i][column];
            Table.mark(cell, 'width', null, marked);
        }
        if (!noUnmark) {
            Table.unmark(marked);
        }
    };
    Table.mark = function (cell, key, value, marked) {
        var _a;
        marked.push(cell);
        var dict = (_a = markedValue.get(cell)) !== null && _a !== void 0 ? _a : {};
        dict[key] = value === undefined ? 1 : value;
        markedValue.set(cell, dict);
    };
    Table.unmark = function (marked) {
        marked.forEach(function (cell) {
            var dict = markedValue.get(cell);
            if (dict) {
                Object.keys(dict).forEach(function (key) {
                    var value = dict[key];
                    switch (key) {
                        case 'remove':
                            dom_1.Dom.safeRemove(cell);
                            break;
                        case 'rowspan':
                            (0, helpers_1.attr)(cell, 'rowspan', (0, helpers_1.isNumber)(value) && value > 1 ? value : null);
                            break;
                        case 'colspan':
                            (0, helpers_1.attr)(cell, 'colspan', (0, helpers_1.isNumber)(value) && value > 1 ? value : null);
                            break;
                        case 'width':
                            if (value == null) {
                                cell.style.removeProperty('width');
                                if (!(0, helpers_1.attr)(cell, 'style')) {
                                    (0, helpers_1.attr)(cell, 'style', null);
                                }
                            }
                            else {
                                cell.style.width = value.toString();
                            }
                            break;
                    }
                    delete dict[key];
                });
                markedValue.delete(cell);
            }
        });
    };
    Table.selectedByTable = new WeakMap();
    (0, tslib_1.__decorate)([
        (0, decorators_1.debounce)()
    ], Table.prototype, "recalculateStyles", null);
    return Table;
}(component_1.ViewComponent));
exports.Table = Table;
var instance = function (j) { return j.getInstance('Table', j.o); };


/***/ }),
/* 245 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(203), exports);
(0, tslib_1.__exportStar)(__webpack_require__(205), exports);


/***/ }),
/* 246 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Uploader = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(247);
var config_1 = __webpack_require__(87);
var constants_1 = __webpack_require__(23);
var helpers_1 = __webpack_require__(5);
var component_1 = __webpack_require__(16);
var helpers_2 = __webpack_require__(248);
__webpack_require__(254);
var Uploader = (function (_super) {
    (0, tslib_1.__extends)(Uploader, _super);
    function Uploader(editor, options) {
        var _this = _super.call(this, editor) || this;
        _this.path = '';
        _this.source = 'default';
        _this.options = (0, helpers_1.ConfigProto)(options || {}, (0, helpers_1.ConfigProto)(config_1.Config.defaultOptions.uploader, (0, helpers_1.isJoditObject)(editor) ? editor.o.uploader : {}));
        return _this;
    }
    Uploader.prototype.className = function () {
        return 'Uploader';
    };
    Object.defineProperty(Uploader.prototype, "o", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    Uploader.prototype.setPath = function (path) {
        this.path = path;
        return this;
    };
    Uploader.prototype.setSource = function (source) {
        this.source = source;
        return this;
    };
    Uploader.prototype.bind = function (form, handlerSuccess, handlerError) {
        var onFinally = function () {
            form.classList.remove('jodit_drag_hover');
        };
        var self = this, onPaste = function (e) {
            var i, file, extension;
            var cData = e.clipboardData;
            var process = function (formdata) {
                if (file) {
                    formdata.append('extension', extension);
                    formdata.append('mimetype', file.type);
                }
            };
            if (!constants_1.IS_IE && (0, helpers_2.hasFiles)(cData)) {
                (0, helpers_2.sendFiles)(self, cData.files, handlerSuccess, handlerError).finally(onFinally);
                return false;
            }
            if (constants_1.IS_IE && !false) {
                return (0, helpers_2.processOldBrowserDrag)(self, cData, handlerSuccess, handlerError, onFinally);
            }
            if ((0, helpers_2.hasItems)(cData)) {
                var items = cData.items;
                for (i = 0; i < items.length; i += 1) {
                    if (items[i].kind === 'file' &&
                        items[i].type === 'image/png') {
                        file = items[i].getAsFile();
                        if (file) {
                            var mime_1 = file.type.match(/\/([a-z0-9]+)/i);
                            extension = mime_1[1]
                                ? mime_1[1].toLowerCase()
                                : '';
                            (0, helpers_2.sendFiles)(self, [file], handlerSuccess, handlerError, process).finally(onFinally);
                        }
                        e.preventDefault();
                        break;
                    }
                }
            }
        };
        if (self.j && self.j.editor !== form) {
            self.j.e.on(form, 'paste', onPaste);
        }
        else {
            self.j.e.on('beforePaste', onPaste);
        }
        this.attachEvents(form, handlerSuccess, handlerError, onFinally);
    };
    Uploader.prototype.attachEvents = function (form, handlerSuccess, handlerError, onFinally) {
        var self = this;
        self.j.e
            .on(form, 'dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
        })
            .on(form, 'dragover', function (event) {
            if ((0, helpers_2.hasFiles)(event.dataTransfer) ||
                (0, helpers_2.hasItems)(event.dataTransfer)) {
                form.classList.add('jodit_drag_hover');
                event.preventDefault();
            }
        })
            .on(form, 'dragend dragleave', function (event) {
            form.classList.remove('jodit_drag_hover');
            if ((0, helpers_2.hasFiles)(event.dataTransfer)) {
                event.preventDefault();
            }
        })
            .on(form, 'drop', function (event) {
            form.classList.remove('jodit_drag_hover');
            if ((0, helpers_2.hasFiles)(event.dataTransfer)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                (0, helpers_2.sendFiles)(self, event.dataTransfer.files, handlerSuccess, handlerError).finally(onFinally);
            }
        });
        var inputFile = form.querySelector('input[type=file]');
        if (inputFile) {
            self.j.e.on(inputFile, 'change', function () {
                (0, helpers_2.sendFiles)(self, inputFile.files, handlerSuccess, handlerError)
                    .then(function () {
                    inputFile.value = '';
                    if (!/safari/i.test(navigator.userAgent)) {
                        inputFile.type = '';
                        inputFile.type = 'file';
                    }
                })
                    .finally(onFinally);
            });
        }
    };
    Uploader.prototype.uploadRemoteImage = function (url, handlerSuccess, handlerError) {
        var uploader = this, o = uploader.o;
        var handlerE = (0, helpers_1.isFunction)(handlerError)
            ? handlerError
            : o.defaultHandlerError;
        (0, helpers_2.send)(uploader, {
            action: 'fileUploadRemote',
            url: url
        })
            .then(function (resp) {
            if (o.isSuccess.call(uploader, resp)) {
                var handler = (0, helpers_1.isFunction)(handlerSuccess)
                    ? handlerSuccess
                    : o.defaultHandlerSuccess;
                handler.call(uploader, o.process.call(uploader, resp));
                return;
            }
            handlerE.call(uploader, (0, helpers_1.error)(o.getMessage.call(uploader, resp)));
        })
            .catch(function (e) { return handlerE.call(uploader, e); });
    };
    Uploader.prototype.destruct = function () {
        this.setStatus(component_1.STATUSES.beforeDestruct);
        var instances = helpers_2.ajaxInstances.get(this);
        if (instances) {
            instances.forEach(function (ajax) {
                try {
                    ajax.destruct();
                }
                catch (_a) { }
            });
            instances.clear();
        }
        _super.prototype.destruct.call(this);
    };
    return Uploader;
}(component_1.ViewComponent));
exports.Uploader = Uploader;


/***/ }),
/* 247 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 248 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasItems = exports.hasFiles = void 0;
var tslib_1 = __webpack_require__(1);
(0, tslib_1.__exportStar)(__webpack_require__(249), exports);
(0, tslib_1.__exportStar)(__webpack_require__(250), exports);
(0, tslib_1.__exportStar)(__webpack_require__(251), exports);
(0, tslib_1.__exportStar)(__webpack_require__(252), exports);
(0, tslib_1.__exportStar)(__webpack_require__(253), exports);
function hasFiles(data) {
    return Boolean(data && data.files && data.files.length > 0);
}
exports.hasFiles = hasFiles;
function hasItems(data) {
    return Boolean(data && data.items && data.items.length > 0);
}
exports.hasItems = hasItems;


/***/ }),
/* 249 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.processOldBrowserDrag = void 0;
var constants_1 = __webpack_require__(23);
var global_1 = __webpack_require__(19);
var helpers_1 = __webpack_require__(5);
var dom_1 = __webpack_require__(21);
var index_1 = __webpack_require__(248);
function processOldBrowserDrag(self, cData, handlerSuccess, handlerError, onFinally) {
    if (cData && (!cData.types.length || cData.types[0] !== constants_1.TEXT_PLAIN)) {
        var div_1 = self.j.c.div('', {
            tabindex: -1,
            style: 'left: -9999px; top: 0; width: 0; height: 100%;line-height: 140%; ' +
                'overflow: hidden; position: fixed; z-index: 2147483647; word-break: break-all;',
            contenteditable: true
        });
        (0, global_1.getContainer)(self.j, self.constructor).appendChild(div_1);
        var selection_1 = (0, helpers_1.isJoditObject)(self.j) ? self.j.s.save() : null, restore_1 = function () {
            return selection_1 && (0, helpers_1.isJoditObject)(self.j) && self.j.s.restore();
        };
        div_1.focus();
        self.j.async.setTimeout(function () {
            var child = div_1.firstChild;
            dom_1.Dom.safeRemove(div_1);
            if (child && child.hasAttribute('src')) {
                var src = (0, helpers_1.attr)(child, 'src') || '';
                restore_1();
                (0, index_1.sendFiles)(self, [(0, index_1.dataURItoBlob)(src)], handlerSuccess, handlerError).finally(onFinally);
            }
        }, self.j.defaultTimeout);
    }
}
exports.processOldBrowserDrag = processOldBrowserDrag;


/***/ }),
/* 250 */
/***/ (function(__unused_webpack_module, exports) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dataURItoBlob = void 0;
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]), mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0], ab = new ArrayBuffer(byteString.length), ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}
exports.dataURItoBlob = dataURItoBlob;


/***/ }),
/* 251 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildData = void 0;
var helpers_1 = __webpack_require__(5);
function buildData(uploader, data) {
    if ((0, helpers_1.isFunction)(uploader.o.buildData)) {
        return uploader.o.buildData.call(uploader, data);
    }
    var FD = uploader.j.ow.FormData;
    if (FD !== undefined) {
        if (data instanceof FD) {
            return data;
        }
        if ((0, helpers_1.isString)(data)) {
            return data;
        }
        var newData_1 = new FD();
        Object.keys(data).forEach(function (key) {
            newData_1.append(key, data[key]);
        });
        return newData_1;
    }
    return data;
}
exports.buildData = buildData;


/***/ }),
/* 252 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.send = exports.ajaxInstances = void 0;
var request_1 = __webpack_require__(183);
var helpers_1 = __webpack_require__(5);
var build_data_1 = __webpack_require__(251);
exports.ajaxInstances = new WeakMap();
function send(uploader, data) {
    var requestData = (0, build_data_1.buildData)(uploader, data);
    var sendData = function (request) {
        var ajax = new request_1.Ajax(uploader.j, {
            xhr: function () {
                var xhr = new XMLHttpRequest();
                if (uploader.j.ow.FormData !== undefined &&
                    xhr.upload) {
                    uploader.j.progressbar.show().progress(10);
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete *= 100;
                            console.log('progress', percentComplete);
                            uploader.j.progressbar
                                .show()
                                .progress(percentComplete);
                            if (percentComplete >= 100) {
                                uploader.j.progressbar.hide();
                            }
                        }
                    }, false);
                }
                else {
                    uploader.j.progressbar.hide();
                }
                return xhr;
            },
            method: uploader.o.method || 'POST',
            data: request,
            url: (0, helpers_1.isFunction)(uploader.o.url)
                ? uploader.o.url(request)
                : uploader.o.url,
            headers: uploader.o.headers,
            queryBuild: uploader.o.queryBuild,
            contentType: uploader.o.contentType.call(uploader, request),
            dataType: uploader.o.format || 'json',
            withCredentials: uploader.o.withCredentials || false
        });
        var instances = exports.ajaxInstances.get(uploader);
        if (!instances) {
            instances = new Set();
            exports.ajaxInstances.set(uploader, instances);
        }
        instances.add(ajax);
        return ajax
            .send()
            .then(function (resp) { return resp.json(); })
            .catch(function (error) {
            uploader.o.error.call(uploader, error);
        })
            .finally(function () {
            instances === null || instances === void 0 ? void 0 : instances.delete(ajax);
        });
    };
    if ((0, helpers_1.isPromise)(requestData)) {
        return requestData.then(sendData).catch(function (error) {
            uploader.o.error.call(uploader, error);
        });
    }
    return sendData(requestData);
}
exports.send = send;


/***/ }),
/* 253 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendFiles = void 0;
var helpers_1 = __webpack_require__(5);
var send_1 = __webpack_require__(252);
function sendFiles(uploader, files, handlerSuccess, handlerError, process) {
    if (!files) {
        return Promise.reject((0, helpers_1.error)('Need files'));
    }
    var o = uploader.o;
    var fileList = (0, helpers_1.toArray)(files);
    if (!fileList.length) {
        return Promise.reject((0, helpers_1.error)('Need files'));
    }
    var promises = [];
    if (o.insertImageAsBase64URI) {
        var file_1, i = void 0;
        var _loop_1 = function () {
            file_1 = fileList[i];
            if (file_1 && file_1.type) {
                var mime_1 = file_1.type.match(/\/([a-z0-9]+)/i);
                var extension = mime_1[1] ? mime_1[1].toLowerCase() : '';
                if (o.imagesExtensions.includes(extension)) {
                    var reader_1 = new FileReader();
                    promises.push(uploader.j.async.promise(function (resolve, reject) {
                        reader_1.onerror = reject;
                        reader_1.onloadend = function () {
                            var resp = {
                                baseurl: '',
                                files: [reader_1.result],
                                isImages: [true]
                            };
                            var handler = (0, helpers_1.isFunction)(handlerSuccess)
                                ? handlerSuccess
                                : o.defaultHandlerSuccess;
                            handler.call(uploader, resp);
                            resolve(resp);
                        };
                        reader_1.readAsDataURL(file_1);
                    }));
                    fileList[i] = null;
                }
            }
        };
        for (i = 0; i < fileList.length; i += 1) {
            _loop_1();
        }
    }
    fileList = fileList.filter(function (a) { return a; });
    if (fileList.length) {
        var form_1 = new FormData();
        form_1.append(o.pathVariableName, uploader.path);
        form_1.append('source', uploader.source);
        var file = void 0;
        for (var i = 0; i < fileList.length; i += 1) {
            file = fileList[i];
            if (file) {
                var mime_2 = file.type.match(/\/([a-z0-9]+)/i);
                var extension = mime_2 && mime_2[1] ? mime_2[1].toLowerCase() : '';
                var newName = fileList[i].name ||
                    Math.random().toString().replace('.', '');
                if (extension) {
                    var extForReg = extension;
                    if (['jpeg', 'jpg'].includes(extForReg)) {
                        extForReg = 'jpeg|jpg';
                    }
                    var reEnd = new RegExp('.(' + extForReg + ')$', 'i');
                    if (!reEnd.test(newName)) {
                        newName += '.' + extension;
                    }
                }
                form_1.append(o.filesVariableName(i), fileList[i], newName);
            }
        }
        if (process) {
            process(form_1);
        }
        if (o.data && (0, helpers_1.isPlainObject)(o.data)) {
            Object.keys(o.data).forEach(function (key) {
                form_1.append(key, o.data[key]);
            });
        }
        o.prepareData.call(uploader, form_1);
        promises.push((0, send_1.send)(uploader, form_1)
            .then(function (resp) {
            if (o.isSuccess.call(uploader, resp)) {
                var handler_1 = (0, helpers_1.isFunction)(handlerSuccess)
                    ? handlerSuccess
                    : o.defaultHandlerSuccess;
                handler_1.call(uploader, o.process.call(uploader, resp));
                return resp;
            }
            var handler = (0, helpers_1.isFunction)(handlerError)
                ? handlerError
                : o.defaultHandlerError;
            handler.call(uploader, (0, helpers_1.error)(o.getMessage.call(uploader, resp)));
            return resp;
        })
            .then(function () {
            uploader.j.events && uploader.j.e.fire('filesWereUploaded');
        }));
    }
    return Promise.all(promises);
}
exports.sendFiles = sendFiles;


/***/ }),
/* 254 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(1);
var config_1 = __webpack_require__(87);
var helpers_1 = __webpack_require__(5);
config_1.Config.prototype.enableDragAndDropFileToEditor = true;
config_1.Config.prototype.uploader = {
    url: '',
    insertImageAsBase64URI: false,
    imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
    headers: null,
    data: null,
    filesVariableName: function (i) {
        return "files[".concat(i, "]");
    },
    withCredentials: false,
    pathVariableName: 'path',
    format: 'json',
    method: 'POST',
    prepareData: function (formData) {
        return formData;
    },
    isSuccess: function (resp) {
        return resp.success;
    },
    getMessage: function (resp) {
        return resp.data.messages !== undefined && (0, helpers_1.isArray)(resp.data.messages)
            ? resp.data.messages.join(' ')
            : '';
    },
    process: function (resp) {
        return resp.data;
    },
    error: function (e) {
        this.j.e.fire('errorMessage', e.message, 'error', 4000);
    },
    defaultHandlerSuccess: function (resp) {
        var j = this.j || this;
        if (!(0, helpers_1.isJoditObject)(j)) {
            return;
        }
        if (resp.files && resp.files.length) {
            resp.files.forEach(function (filename, index) {
                var _a = (0, tslib_1.__read)(resp.isImages && resp.isImages[index]
                    ? ['img', 'src']
                    : ['a', 'href'], 2), tagName = _a[0], attr = _a[1];
                var elm = j.createInside.element(tagName);
                elm.setAttribute(attr, resp.baseurl + filename);
                if (tagName === 'a') {
                    elm.textContent = resp.baseurl + filename;
                }
                if (tagName === 'img') {
                    j.s.insertImage(elm, null, j.o.imageDefaultWidth);
                }
                else {
                    j.s.insertNode(elm);
                }
            });
        }
    },
    defaultHandlerError: function (e) {
        this.j.e.fire('errorMessage', e.message);
    },
    contentType: function (requestData) {
        return this.j.ow.FormData !== undefined &&
            typeof requestData !== 'string'
            ? false
            : 'application/x-www-form-urlencoded; charset=UTF-8';
    }
};


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