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

/***/ 209:
/***/ (function(module) {

module.exports = "<svg viewBox=\"0 0 16 16\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M8,11c1.657,0,3-1.343,3-3V3c0-1.657-1.343-3-3-3S5,1.343,5,3v5C5,9.657,6.343,11,8,11z\"/> <path d=\"M13,8V6h-1l0,1.844c0,1.92-1.282,3.688-3.164,4.071C6.266,12.438,4,10.479,4,8V6H3v2c0,2.414,1.721,4.434,4,4.899V15H5v1h6 v-1H9v-2.101C11.279,12.434,13,10.414,13,8z\"/> </svg>"

/***/ }),

/***/ 210:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ar": function() { return /* binding */ ar; },
/* harmony export */   "cs_cz": function() { return /* binding */ cs_cz; },
/* harmony export */   "de": function() { return /* binding */ de; },
/* harmony export */   "es": function() { return /* binding */ es; },
/* harmony export */   "fa": function() { return /* binding */ fa; },
/* harmony export */   "fr": function() { return /* binding */ fr; },
/* harmony export */   "he": function() { return /* binding */ he; },
/* harmony export */   "hu": function() { return /* binding */ hu; },
/* harmony export */   "id": function() { return /* binding */ id; },
/* harmony export */   "it": function() { return /* binding */ it; },
/* harmony export */   "ja": function() { return /* binding */ ja; },
/* harmony export */   "ko": function() { return /* binding */ ko; },
/* harmony export */   "nl": function() { return /* binding */ nl; },
/* harmony export */   "pl": function() { return /* binding */ pl; },
/* harmony export */   "pt_br": function() { return /* binding */ pt_br; },
/* harmony export */   "ru": function() { return /* binding */ ru; },
/* harmony export */   "tr": function() { return /* binding */ tr; },
/* harmony export */   "zh_cn": function() { return /* binding */ zh_cn; },
/* harmony export */   "zh_tw": function() { return /* binding */ zh_tw; }
/* harmony export */ });
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const ar = __webpack_require__(211);
const cs_cz = __webpack_require__(212);
const de = __webpack_require__(213);
const es = __webpack_require__(214);
const fa = __webpack_require__(215);
const fr = __webpack_require__(216);
const he = __webpack_require__(217);
const hu = __webpack_require__(218);
const id = __webpack_require__(219);
const it = __webpack_require__(220);
const ja = __webpack_require__(221);
const ko = __webpack_require__(222);
const nl = __webpack_require__(223);
const pl = __webpack_require__(224);
const pt_br = __webpack_require__(225);
const ru = __webpack_require__(226);
const tr = __webpack_require__(227);
const zh_cn = __webpack_require__(228);
const zh_tw = __webpack_require__(229);



/***/ }),

/***/ 208:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "SpeechRecognizeNative": function() { return /* binding */ SpeechRecognizeNative; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(58);
// EXTERNAL MODULE: ./src/core/plugin/index.ts
var core_plugin = __webpack_require__(93);
// EXTERNAL MODULE: ./src/core/decorators/watch/watch.ts
var watch = __webpack_require__(18);
// EXTERNAL MODULE: ./src/core/helpers/utils/utils.ts
var utils = __webpack_require__(32);
// EXTERNAL MODULE: ./src/core/global.ts
var global = __webpack_require__(56);
;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/helpers/exec-spell-command.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
function execSpellCommand(jodit, commandSentence) {
    const [command, value] = commandSentence.split('::');
    jodit.execCommand(command, null, value);
}

// EXTERNAL MODULE: ./src/config.ts
var config = __webpack_require__(1);
// EXTERNAL MODULE: ./src/core/helpers/utils/data-bind.ts
var data_bind = __webpack_require__(33);
// EXTERNAL MODULE: ./src/core/helpers/checker/is-boolean.ts
var is_boolean = __webpack_require__(35);
// EXTERNAL MODULE: ./src/modules/dialog/alert.ts
var dialog_alert = __webpack_require__(92);
// EXTERNAL MODULE: ./src/core/event-emitter/eventify.ts
var eventify = __webpack_require__(16);
// EXTERNAL MODULE: ./src/core/helpers/checker/index.ts + 7 modules
var checker = __webpack_require__(47);
// EXTERNAL MODULE: ./src/core/helpers/utils/index.ts + 15 modules
var helpers_utils = __webpack_require__(31);
;// CONCATENATED MODULE: ./src/core/decorators/spy/spy.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */


function spy(target) {
    const methods = Reflect.ownKeys(target.prototype);
    methods.forEach(key => {
        if (key === 'constructor') {
            return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (descriptor && (0,checker/* isFunction */.mf)(descriptor.value)) {
            target.prototype[key] = function (...args) {
                console.log(`Class: ${(0,helpers_utils/* getClassName */.gj)(target.prototype)} call: ${String(key)}(${args.map(a => (0,checker/* isPlainObject */.PO)(a) ||
                    (0,checker/* isString */.HD)(a) ||
                    (0,checker/* isBoolean */.jn)(a) ||
                    (0,checker/* isNumber */.hj)(a)
                    ? JSON.stringify(a)
                    : {}.toString.call(a))})`);
                return descriptor.value.apply(this, args);
            };
        }
    });
}

// EXTERNAL MODULE: ./src/core/decorators/index.ts + 7 modules
var decorators = __webpack_require__(51);
;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/constants.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const PII = 440;
const WARN = 940;

;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/helpers/sound.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

function sound({ sec = 0.1, frequency = PII, gain = 0.1, type = 'sine' } = {}) {
    if (typeof window.AudioContext === 'undefined' &&
        typeof window.webkitAudioContext === 'undefined') {
        return;
    }
    const context = new (window.AudioContext ||
        window.webkitAudioContext)();
    const vol = context.createGain();
    const osc = context.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.connect(vol);
    vol.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + sec);
    vol.gain.value = gain;
}

;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/helpers/recognize-manager.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
var RecognizeManager_1;






let RecognizeManager = RecognizeManager_1 = class RecognizeManager extends eventify/* Eventify */.a {
    constructor(async, api) {
        super();
        this.async = async;
        this._continuous = false;
        this._interimResults = false;
        this.sound = true;
        this._isEnabled = false;
        this._restartTimeout = 0;
        this._onSpeechStart = (e) => {
            if (!this._isEnabled) {
                return;
            }
            this.async.clearTimeout(this._restartTimeout);
            this._restartTimeout = this.async.setTimeout(() => {
                this.restart();
                this.emit('pulse', false);
                this._makeSound(WARN);
            }, 5000);
            this.emit('pulse', true);
        };
        this._progressTimeout = 0;
        this._api = api;
        RecognizeManager_1._instances.add(this);
    }
    set lang(v) {
        this._lang = v;
        this._api.lang = v;
    }
    get lang() {
        return this._lang;
    }
    set continuous(v) {
        this._continuous = v;
        this._api.continuous = v;
    }
    get continuous() {
        return this._continuous;
    }
    set interimResults(v) {
        this._interimResults = v;
        this._api.interimResults = v;
    }
    get interimResults() {
        return this._interimResults;
    }
    destruct() {
        this.stop();
        RecognizeManager_1._instances.delete(this);
        super.destruct();
    }
    get isEnabled() {
        return this._isEnabled;
    }
    start() {
        if (this._isEnabled) {
            return;
        }
        this._isEnabled = true;
        RecognizeManager_1._instances.forEach(instance => {
            if (instance !== this) {
                instance.stop();
            }
        });
        this._api.start();
        this.__on('speechstart', this._onSpeechStart)
            .__on('error', this._onError)
            .__on('result', this._onResult);
    }
    stop() {
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
    }
    toggle() {
        if (!this._isEnabled) {
            this.start();
        }
        else {
            this.stop();
        }
    }
    restart() {
        this.stop();
        this.start();
    }
    __on(event, callback) {
        this._api.addEventListener(event, callback);
        return this;
    }
    __off(event, callback) {
        this._api.removeEventListener(event, callback);
        return this;
    }
    _onResult(e) {
        if (!this._isEnabled) {
            return;
        }
        this.async.clearTimeout(this._progressTimeout);
        const resultItem = e.results.item(e.resultIndex);
        const { transcript } = resultItem.item(0);
        const resultHandler = () => {
            try {
                this.async.clearTimeout(this._restartTimeout);
                this.emit('result', transcript);
            }
            catch (_a) { }
            this.restart();
            this.emit('pulse', false);
            this._makeSound(PII);
        };
        if (resultItem.isFinal === false) {
            this.emit('progress', transcript);
            this._progressTimeout = this.async.setTimeout(resultHandler, 500);
            return;
        }
        resultHandler();
    }
    _onError() {
        if (!this._isEnabled) {
            return;
        }
        this._makeSound(WARN);
        this.emit('pulse', false);
        this.restart();
    }
    _makeSound(frequency) {
        if (this.sound) {
            sound({ frequency });
        }
    }
};
RecognizeManager._instances = new Set();
RecognizeManager = RecognizeManager_1 = (0,tslib_es6/* __decorate */.gn)([
    decorators.autobind,
    spy
], RecognizeManager);


;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/helpers/api.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition;

;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/config.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */






config/* Config.prototype.speechRecognize */.D.prototype.speechRecognize = {
    api: SpeechRecognition,
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
config/* Config.prototype.controls.speechRecognize */.D.prototype.controls.speechRecognize = {
    isActive(jodit, _) {
        const api = (0,data_bind/* dataBind */.q)(jodit, 'speech');
        return Boolean(api === null || api === void 0 ? void 0 : api.isEnabled);
    },
    isDisabled(jodit) {
        return !jodit.o.speechRecognize.api;
    },
    exec(jodit, current, { button, control }) {
        const { api: Api, lang, continuous, interimResults, sound } = jodit.o.speechRecognize;
        if (!Api) {
            (0,dialog_alert/* Alert */.b)('Speech recognize API unsupported in your browser');
            return;
        }
        let api = (0,data_bind/* dataBind */.q)(jodit, 'speech');
        if (!api) {
            const nativeApi = new Api();
            api = new RecognizeManager(jodit.async, nativeApi);
            api.lang = lang;
            api.continuous = continuous;
            api.interimResults = interimResults;
            api.sound = sound;
            (0,data_bind/* dataBind */.q)(jodit, 'speech', api);
            api.on('pulse', (enable) => {
                button.setMod('pulse', enable);
            });
            api.on('result', (text) => jodit.e.fire('speechRecognizeResult', text));
            api.on('progress', (text) => jodit.e.fire('speechRecognizeProgressResult', text));
            button.hookStatus('beforeDestruct', () => {
                api.destruct();
            });
        }
        if (control.args) {
            const key = control.args[0];
            if ((0,is_boolean/* isBoolean */.j)(api[key])) {
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
    icon: __webpack_require__(209),
    name: 'speechRecognize',
    command: 'toggleSpeechRecognize',
    tooltip: 'Speech Recognize',
    list: {
        sound: 'Sound',
        interimResults: 'Interim Results'
    },
    childTemplate(jodit, key, value) {
        var _a;
        const api = (0,data_bind/* dataBind */.q)(jodit, 'speech');
        return `<span class='jodit-speech-recognize__list-item'><input ${((_a = api === null || api === void 0 ? void 0 : api[key]) !== null && _a !== void 0 ? _a : jodit.o.speechRecognize[key]) ? 'checked' : ''} class='jodit-checkbox' type='checkbox'>${value}</span>`;
    },
    mods: {
        stroke: false
    }
};

// EXTERNAL MODULE: ./src/core/dom/dom.ts
var dom = __webpack_require__(44);
// EXTERNAL MODULE: ./src/core/decorators/debounce/debounce.ts
var debounce = __webpack_require__(53);
;// CONCATENATED MODULE: ./src/plugins/speech/speech-recognize/speech-recognize.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */










class SpeechRecognizeNative extends core_plugin/* Plugin */.S {
    constructor(j) {
        super(j);
        this._commandToWord = {};
        if (j.o.speechRecognize.api) {
            j.registerButton({
                group: 'state',
                name: 'speechRecognize'
            });
        }
    }
    afterInit(jodit) {
        const { commands } = jodit.o.speechRecognize;
        if (commands) {
            (0,global/* extendLang */.xl)(__webpack_require__(210));
            (0,utils/* keys */.XP)(commands, false).forEach(words => {
                const keys = words.split('|');
                keys.forEach(key => {
                    key = key.trim().toLowerCase();
                    this._commandToWord[key] = commands[words];
                    const translatedKeys = jodit.i18n(key);
                    if (translatedKeys !== key) {
                        translatedKeys.split('|').forEach(translatedKey => {
                            this._commandToWord[translatedKey.trim().toLowerCase()] = commands[words].trim();
                        });
                    }
                });
            });
        }
    }
    beforeDestruct(jodit) { }
    onSpeechRecognizeProgressResult(text) {
        if (!this.messagePopup) {
            this.messagePopup = this.j.create.div('jodit-speech-recognize__popup');
        }
        this.j.container.appendChild(this.messagePopup);
        this.j.async.setTimeout(() => {
            dom/* Dom.safeRemove */.i.safeRemove(this.messagePopup);
        }, {
            label: 'onSpeechRecognizeProgressResult',
            timeout: 1000
        });
        this.messagePopup.innerText = text + '|';
    }
    onSpeechRecognizeResult(text) {
        const { j } = this, { s } = j;
        dom/* Dom.safeRemove */.i.safeRemove(this.messagePopup);
        if (!this._checkCommand(text)) {
            const { range } = s, node = s.current();
            if (s.isCollapsed() &&
                dom/* Dom.isText */.i.isText(node) &&
                dom/* Dom.isOrContains */.i.isOrContains(j.editor, node) &&
                node.nodeValue) {
                const sentence = node.nodeValue;
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
    }
    _checkCommand(command) {
        command = command.toLowerCase().replace(/\./g, '');
        if (this._commandToWord[command]) {
            execSpellCommand(this.j, this._commandToWord[command]);
            return true;
        }
        return false;
    }
}
(0,tslib_es6/* __decorate */.gn)([
    (0,watch/* watch */.YP)(':speechRecognizeProgressResult'),
    (0,debounce/* debounce */.D)()
], SpeechRecognizeNative.prototype, "onSpeechRecognizeProgressResult", null);
(0,tslib_es6/* __decorate */.gn)([
    (0,watch/* watch */.YP)(':speechRecognizeResult')
], SpeechRecognizeNative.prototype, "onSpeechRecognizeResult", null);
if (typeof Jodit !== 'undefined') {
    Jodit.plugins.add('speech-recognize', SpeechRecognizeNative);
}


/***/ }),

/***/ 211:
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

/***/ 212:
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

/***/ 213:
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

/***/ 214:
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

/***/ 215:
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

/***/ 216:
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

/***/ 217:
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

/***/ 218:
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

/***/ 219:
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

/***/ 220:
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

/***/ 221:
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

/***/ 222:
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

/***/ 223:
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

/***/ 224:
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

/***/ 225:
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

/***/ 226:
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

/***/ 227:
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

/***/ 228:
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

/***/ 229:
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
/******/ var __webpack_exports__ = (__webpack_exec__(208));
/******/ return __webpack_exports__;
/******/ }
]);
});