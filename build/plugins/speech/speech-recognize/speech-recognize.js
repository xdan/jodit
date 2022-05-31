/*!
 * jodit - Jodit is awesome and usefully wysiwyg editor with filebrowser
 * Author: Chupurnov <chupurnov@gmail.com> (https://xdsoft.net/)
 * Version: v3.18.6
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
return (self["webpackChunkjodit"] = self["webpackChunkjodit"] || []).push([[373],{

/***/ 712:
/***/ (function(module) {

module.exports = "<svg viewBox=\"0 0 16 16\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M8,11c1.657,0,3-1.343,3-3V3c0-1.657-1.343-3-3-3S5,1.343,5,3v5C5,9.657,6.343,11,8,11z\"/> <path d=\"M13,8V6h-1l0,1.844c0,1.92-1.282,3.688-3.164,4.071C6.266,12.438,4,10.479,4,8V6H3v2c0,2.414,1.721,4.434,4,4.899V15H5v1h6 v-1H9v-2.101C11.279,12.434,13,10.414,13,8z\"/> </svg>"

/***/ }),

/***/ 704:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 708:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.spy = void 0;
var checker_1 = __webpack_require__(228);
var utils_1 = __webpack_require__(194);
function spy(target) {
    var methods = Reflect.ownKeys(target.prototype);
    methods.forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (descriptor && (0, checker_1.isFunction)(descriptor.value)) {
            target.prototype[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log("Class: ".concat((0, utils_1.getClassName)(target.prototype), " call: ").concat(String(key), "(").concat(args.map(function (a) {
                    return (0, checker_1.isPlainObject)(a) ||
                        (0, checker_1.isString)(a) ||
                        (0, checker_1.isBoolean)(a) ||
                        (0, checker_1.isNumber)(a)
                        ? JSON.stringify(a)
                        : {}.toString.call(a);
                }), ")"));
                return descriptor.value.apply(this, args);
            };
        }
    });
}
exports.spy = spy;


/***/ }),

/***/ 706:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var config_1 = __webpack_require__(165);
var data_bind_1 = __webpack_require__(197);
var is_boolean_1 = __webpack_require__(200);
var alert_1 = __webpack_require__(369);
var recognize_manager_1 = __webpack_require__(707);
var api_1 = __webpack_require__(711);
config_1.Config.prototype.speechRecognize = {
    api: api_1.SpeechRecognition,
    sound: true,
    continuous: true,
    interimResults: true,
    commands: {
        'newline|enter': 'enter',
        'delete|remove word|delete word': 'backspaceWordButton',
        comma: 'inserthtml::,',
        underline: 'inserthtml::_',
        hyphen: 'inserthtml::-',
        space: 'inserthtml:: ',
        question: 'inserthtml::?',
        dot: 'inserthtml::.',
        'quote|quotes|open quote': "inserthtml::'",
        'header|header h1': 'formatblock::h1',
        'select all': 'selectall'
    }
};
config_1.Config.prototype.controls.speechRecognize = {
    isActive: function (jodit, _) {
        var api = (0, data_bind_1.dataBind)(jodit, 'speech');
        return Boolean(api === null || api === void 0 ? void 0 : api.isEnabled);
    },
    isDisabled: function (jodit) {
        return !jodit.o.speechRecognize.api;
    },
    exec: function (jodit, current, _a) {
        var button = _a.button, control = _a.control;
        var _b = jodit.o.speechRecognize, Api = _b.api, lang = _b.lang, continuous = _b.continuous, interimResults = _b.interimResults, sound = _b.sound;
        if (!Api) {
            (0, alert_1.Alert)('Speech recognize API unsupported in your browser');
            return;
        }
        var api = (0, data_bind_1.dataBind)(jodit, 'speech');
        if (!api) {
            var nativeApi = new Api();
            api = new recognize_manager_1.RecognizeManager(jodit.async, nativeApi);
            api.lang = lang;
            api.continuous = continuous;
            api.interimResults = interimResults;
            api.sound = sound;
            (0, data_bind_1.dataBind)(jodit, 'speech', api);
            api.on('pulse', function (enable) {
                button.setMod('pulse', enable);
            });
            api.on('result', function (text) {
                return jodit.e.fire('speechRecognizeResult', text);
            });
            api.on('progress', function (text) {
                return jodit.e.fire('speechRecognizeProgressResult', text);
            });
            button.hookStatus('beforeDestruct', function () {
                api.destruct();
            });
        }
        if (control.args) {
            var key = control.args[0];
            if ((0, is_boolean_1.isBoolean)(api[key])) {
                api[key] = !api[key];
                if (api.isEnabled) {
                    api.restart();
                }
                return;
            }
        }
        api.toggle();
        button.state.activated = api.isEnabled;
    },
    icon: __webpack_require__(712),
    name: 'speechRecognize',
    command: 'toggleSpeechRecognize',
    tooltip: 'Speech Recognize',
    list: {
        sound: 'Sound',
        interimResults: 'Interim Results'
    },
    childTemplate: function (jodit, key, value) {
        var _a;
        var api = (0, data_bind_1.dataBind)(jodit, 'speech');
        return "<span class='jodit-speech-recognize__list-item'><input ".concat(((_a = api === null || api === void 0 ? void 0 : api[key]) !== null && _a !== void 0 ? _a : jodit.o.speechRecognize[key]) ? 'checked' : '', " class='jodit-checkbox' type='checkbox'>").concat(value, "</span>");
    },
    mods: {
        stroke: false
    }
};


/***/ }),

/***/ 710:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WARN = exports.PII = void 0;
exports.PII = 440;
exports.WARN = 940;


/***/ }),

/***/ 711:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpeechRecognition = void 0;
exports.SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition;


/***/ }),

/***/ 705:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.execSpellCommand = void 0;
var tslib_1 = __webpack_require__(1);
function execSpellCommand(jodit, commandSentence) {
    var _a = tslib_1.__read(commandSentence.split('::'), 2), command = _a[0], value = _a[1];
    jodit.execCommand(command, null, value);
}
exports.execSpellCommand = execSpellCommand;


/***/ }),

/***/ 707:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecognizeManager = void 0;
var tslib_1 = __webpack_require__(1);
var eventify_1 = __webpack_require__(184);
var spy_1 = __webpack_require__(708);
var decorators_1 = __webpack_require__(239);
var sound_1 = __webpack_require__(709);
var constants_1 = __webpack_require__(710);
var RecognizeManager = (function (_super) {
    tslib_1.__extends(RecognizeManager, _super);
    function RecognizeManager(async, api) {
        var _this = _super.call(this) || this;
        _this.async = async;
        _this._continuous = false;
        _this._interimResults = false;
        _this.sound = true;
        _this._isEnabled = false;
        _this._restartTimeout = 0;
        _this._onSpeechStart = function (e) {
            if (!_this._isEnabled) {
                return;
            }
            _this.async.clearTimeout(_this._restartTimeout);
            _this._restartTimeout = _this.async.setTimeout(function () {
                _this.restart();
                _this.emit('pulse', false);
                _this._makeSound(constants_1.WARN);
            }, 5000);
            _this.emit('pulse', true);
        };
        _this._progressTimeout = 0;
        _this._api = api;
        RecognizeManager_1._instances.add(_this);
        return _this;
    }
    RecognizeManager_1 = RecognizeManager;
    Object.defineProperty(RecognizeManager.prototype, "lang", {
        get: function () {
            return this._lang;
        },
        set: function (v) {
            this._lang = v;
            this._api.lang = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecognizeManager.prototype, "continuous", {
        get: function () {
            return this._continuous;
        },
        set: function (v) {
            this._continuous = v;
            this._api.continuous = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecognizeManager.prototype, "interimResults", {
        get: function () {
            return this._interimResults;
        },
        set: function (v) {
            this._interimResults = v;
            this._api.interimResults = v;
        },
        enumerable: false,
        configurable: true
    });
    RecognizeManager.prototype.destruct = function () {
        this.stop();
        RecognizeManager_1._instances.delete(this);
        _super.prototype.destruct.call(this);
    };
    Object.defineProperty(RecognizeManager.prototype, "isEnabled", {
        get: function () {
            return this._isEnabled;
        },
        enumerable: false,
        configurable: true
    });
    RecognizeManager.prototype.start = function () {
        var _this = this;
        if (this._isEnabled) {
            return;
        }
        this._isEnabled = true;
        RecognizeManager_1._instances.forEach(function (instance) {
            if (instance !== _this) {
                instance.stop();
            }
        });
        this._api.start();
        this.__on('speechstart', this._onSpeechStart)
            .__on('error', this._onError)
            .__on('result', this._onResult);
    };
    RecognizeManager.prototype.stop = function () {
        if (!this._isEnabled) {
            return;
        }
        try {
            this._api.abort();
            this._api.stop();
        }
        catch (_a) { }
        this.__off('speechstart', this._onSpeechStart)
            .__off('error', this._onError)
            .__off('result', this._onResult);
        this.async.clearTimeout(this._restartTimeout);
        this._isEnabled = false;
        this.emit('pulse', false);
    };
    RecognizeManager.prototype.toggle = function () {
        if (!this._isEnabled) {
            this.start();
        }
        else {
            this.stop();
        }
    };
    RecognizeManager.prototype.restart = function () {
        this.stop();
        this.start();
    };
    RecognizeManager.prototype.__on = function (event, callback) {
        this._api.addEventListener(event, callback);
        return this;
    };
    RecognizeManager.prototype.__off = function (event, callback) {
        this._api.removeEventListener(event, callback);
        return this;
    };
    RecognizeManager.prototype._onResult = function (e) {
        var _this = this;
        if (!this._isEnabled) {
            return;
        }
        this.async.clearTimeout(this._progressTimeout);
        var resultItem = e.results.item(e.resultIndex);
        var transcript = resultItem.item(0).transcript;
        var resultHandler = function () {
            try {
                _this.async.clearTimeout(_this._restartTimeout);
                _this.emit('result', transcript);
            }
            catch (_a) { }
            _this.restart();
            _this.emit('pulse', false);
            _this._makeSound(constants_1.PII);
        };
        if (resultItem.isFinal === false) {
            this.emit('progress', transcript);
            this._progressTimeout = this.async.setTimeout(resultHandler, 500);
            return;
        }
        resultHandler();
    };
    RecognizeManager.prototype._onError = function () {
        if (!this._isEnabled) {
            return;
        }
        this._makeSound(constants_1.WARN);
        this.emit('pulse', false);
        this.restart();
    };
    RecognizeManager.prototype._makeSound = function (frequency) {
        if (this.sound) {
            (0, sound_1.sound)({ frequency: frequency });
        }
    };
    var RecognizeManager_1;
    RecognizeManager._instances = new Set();
    RecognizeManager = RecognizeManager_1 = tslib_1.__decorate([
        decorators_1.autobind,
        spy_1.spy
    ], RecognizeManager);
    return RecognizeManager;
}(eventify_1.Eventify));
exports.RecognizeManager = RecognizeManager;


/***/ }),

/***/ 709:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sound = void 0;
var constants_1 = __webpack_require__(710);
function sound(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.sec, sec = _c === void 0 ? 0.1 : _c, _d = _b.frequency, frequency = _d === void 0 ? constants_1.PII : _d, _e = _b.gain, gain = _e === void 0 ? 0.1 : _e, _f = _b.type, type = _f === void 0 ? 'sine' : _f;
    if (typeof window.AudioContext === 'undefined' &&
        typeof window.webkitAudioContext === 'undefined') {
        return;
    }
    var context = new (window.AudioContext ||
        window.webkitAudioContext)();
    var vol = context.createGain();
    var osc = context.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.connect(vol);
    vol.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + sec);
    vol.gain.value = gain;
}
exports.sound = sound;


/***/ }),

/***/ 713:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.zh_tw = exports.zh_cn = exports.tr = exports.ru = exports.pt_br = exports.pl = exports.nl = exports.ko = exports.ja = exports.it = exports.id = exports.hu = exports.he = exports.fr = exports.fa = exports.es = exports.de = exports.cs_cz = exports.ar = void 0;
var ar = __webpack_require__(714);
exports.ar = ar;
var cs_cz = __webpack_require__(715);
exports.cs_cz = cs_cz;
var de = __webpack_require__(716);
exports.de = de;
var es = __webpack_require__(717);
exports.es = es;
var fa = __webpack_require__(718);
exports.fa = fa;
var fr = __webpack_require__(719);
exports.fr = fr;
var he = __webpack_require__(720);
exports.he = he;
var hu = __webpack_require__(721);
exports.hu = hu;
var id = __webpack_require__(722);
exports.id = id;
var it = __webpack_require__(723);
exports.it = it;
var ja = __webpack_require__(724);
exports.ja = ja;
var ko = __webpack_require__(725);
exports.ko = ko;
var nl = __webpack_require__(726);
exports.nl = nl;
var pl = __webpack_require__(727);
exports.pl = pl;
var pt_br = __webpack_require__(728);
exports.pt_br = pt_br;
var ru = __webpack_require__(729);
exports.ru = ru;
var tr = __webpack_require__(730);
exports.tr = tr;
var zh_cn = __webpack_require__(731);
exports.zh_cn = zh_cn;
var zh_tw = __webpack_require__(732);
exports.zh_tw = zh_tw;


/***/ }),

/***/ 703:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpeechRecognizeNative = void 0;
var tslib_1 = __webpack_require__(1);
__webpack_require__(704);
var plugin_1 = __webpack_require__(372);
var watch_1 = __webpack_require__(188);
var utils_1 = __webpack_require__(196);
var global_1 = __webpack_require__(245);
var exec_spell_command_1 = __webpack_require__(705);
__webpack_require__(706);
var dom_1 = __webpack_require__(221);
var debounce_1 = __webpack_require__(242);
var SpeechRecognizeNative = (function (_super) {
    tslib_1.__extends(SpeechRecognizeNative, _super);
    function SpeechRecognizeNative(j) {
        var _this = _super.call(this, j) || this;
        _this._commandToWord = {};
        if (j.o.speechRecognize.api) {
            j.registerButton({
                group: 'state',
                name: 'speechRecognize'
            });
        }
        return _this;
    }
    SpeechRecognizeNative.prototype.afterInit = function (jodit) {
        var _this = this;
        var commands = jodit.o.speechRecognize.commands;
        if (commands) {
            (0, global_1.extendLang)(__webpack_require__(713));
            (0, utils_1.keys)(commands, false).forEach(function (words) {
                var keys = words.split('|');
                keys.forEach(function (key) {
                    key = key.trim().toLowerCase();
                    _this._commandToWord[key] = commands[words];
                    var translatedKeys = jodit.i18n(key);
                    if (translatedKeys !== key) {
                        translatedKeys.split('|').forEach(function (translatedKey) {
                            _this._commandToWord[translatedKey.trim().toLowerCase()] = commands[words].trim();
                        });
                    }
                });
            });
        }
    };
    SpeechRecognizeNative.prototype.beforeDestruct = function (jodit) { };
    SpeechRecognizeNative.prototype.onSpeechRecognizeProgressResult = function (text) {
        var _this = this;
        if (!this.messagePopup) {
            this.messagePopup = this.j.create.div('jodit-speech-recognize__popup');
        }
        this.j.container.appendChild(this.messagePopup);
        this.j.async.setTimeout(function () {
            dom_1.Dom.safeRemove(_this.messagePopup);
        }, {
            label: 'onSpeechRecognizeProgressResult',
            timeout: 1000
        });
        this.messagePopup.innerText = text + '|';
    };
    SpeechRecognizeNative.prototype.onSpeechRecognizeResult = function (text) {
        var j = this.j, s = j.s;
        dom_1.Dom.safeRemove(this.messagePopup);
        if (!this._checkCommand(text)) {
            var range = s.range, node = s.current();
            if (s.isCollapsed() &&
                dom_1.Dom.isText(node) &&
                dom_1.Dom.isOrContains(j.editor, node) &&
                node.nodeValue) {
                var sentence = node.nodeValue;
                node.nodeValue =
                    sentence +
                        (/[\u00A0 ]\uFEFF*$/.test(sentence) ? '' : ' ') +
                        text;
                range.setStartAfter(node);
                s.selectRange(range);
                j.synchronizeValues();
            }
            else {
                s.insertHTML(text);
            }
        }
    };
    SpeechRecognizeNative.prototype._checkCommand = function (command) {
        command = command.toLowerCase().replace(/\./g, '');
        if (this._commandToWord[command]) {
            (0, exec_spell_command_1.execSpellCommand)(this.j, this._commandToWord[command]);
            return true;
        }
        return false;
    };
    tslib_1.__decorate([
        (0, watch_1.watch)(':speechRecognizeProgressResult'),
        (0, debounce_1.debounce)()
    ], SpeechRecognizeNative.prototype, "onSpeechRecognizeProgressResult", null);
    tslib_1.__decorate([
        (0, watch_1.watch)(':speechRecognizeResult')
    ], SpeechRecognizeNative.prototype, "onSpeechRecognizeResult", null);
    return SpeechRecognizeNative;
}(plugin_1.Plugin));
exports.SpeechRecognizeNative = SpeechRecognizeNative;
if (typeof Jodit !== 'undefined') {
    Jodit.plugins.add('speech-recognize', SpeechRecognizeNative);
}


/***/ }),

/***/ 714:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'الخط الجديد',
	delete: 'حذف'
};


/***/ }),

/***/ 715:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'řádek',
	delete: 'odstranit'
};


/***/ }),

/***/ 716:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'Zeilenumbruch',
	delete: 'löschen'
};


/***/ }),

/***/ 717:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'nueva línea',
	delete: 'eliminar'
};


/***/ }),

/***/ 718:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'خط جدید',
	delete: 'حذف'
};


/***/ }),

/***/ 719:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'nouvelle ligne',
	delete: 'supprimer'
};


/***/ }),

/***/ 720:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'חדשות',
	delete: 'מחק'
};


/***/ }),

/***/ 721:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'újsor',
	delete: 'törlés'
};


/***/ }),

/***/ 722:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'newline',
	delete: 'Hapus'
};


/***/ }),

/***/ 723:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'nuova riga',
	delete: 'eliminare'
};


/***/ }),

/***/ 724:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: '改行',
	delete: '削除'
};


/***/ }),

/***/ 725:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: '줄 바꿈',
	delete: '삭제'
};


/***/ }),

/***/ 726:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'regel',
	delete: 'verwijderen'
};


/***/ }),

/***/ 727:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'newline',
	delete: 'usunąć'
};


/***/ }),

/***/ 728:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'linha',
	delete: 'excluir'
};


/***/ }),

/***/ 729:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'новая строка|перенос|энтер',
	delete: 'удалить'
};


/***/ }),

/***/ 730:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'yeni satır',
	delete: 'silmek'
};


/***/ }),

/***/ 731:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: '新行',
	delete: '删除'
};


/***/ }),

/***/ 732:
/***/ (function(module) {

/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = {
	newline: 'นิวไลน์',
	delete: 'ลบ'
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(703));
/******/ return __webpack_exports__;
/******/ }
]);
});