import Component from './modules/Component';
import Events from './modules/Events';
import Selection from './modules/Selection';
import Toolbar from './modules/Toolbar';
import Cookie from './modules/Cookie';
import * as consts from './constants';
import {extend, inArray, dom, each, sprintf, css, defaultLanguage} from './modules/Helpers';
import * as helper from './modules/Helpers';
import FileBrowser from "./modules/FileBrowser";
import Uploader from "./modules/Uploader";
import {Config} from "./Config";

declare let appVersion: string;

interface JoditPlugin{
    destruct?: Function;
    open?: Function;
}

/** Class Jodit. Main class*/
export default class Jodit extends Component{
    version: string = appVersion;


    static defaultOptions: Config;
    static plugins: any =  {};
    static modules: any =  {};
    static instances = {};
    static lang: any = {};

    /**
     * @prop {HTMLDocument} win
     */
    doc: HTMLDocument;
    /**
     * @prop {Window} win
     */
    win: Window;

    components: any = [];

    /**
     * @prop {string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    id: string;

    /**
     * @prop {HTMLDivElement} progress_bar Progress bar
     */
    progress_bar: HTMLDivElement;

    /**
     * @prop {HTMLDivElement} workplace It contains source and wysiwyg editors
     */
    workplace: HTMLDivElement;

    /**
     * @prop {HTMLDivElement} container main editor's box
     */
    container: HTMLDivElement;

    /**
     * @prop {HTMLElement} element It contains source element
     */
    element: HTMLInputElement;

    /**
     * @prop {HTMLDivElement|HTMLBodyElement} editor It contains the root element editor
     */
    editor: HTMLDivElement|HTMLBodyElement;


    /**
     * @prop {HTMLIFrameElement} iframe Iframe for iframe mode
     */
    iframe: HTMLIFrameElement;


    /**
     * @prop {Config} options All Jodit settings default + second arguments of constructor
     */
    options: Config;

    events: Events;
    /**
     * @property {Selection} selection
     */
    selection: Selection;

    /**
     * @property {Uploader} uploader
     */
    uploader: Uploader;

    /**
     * @property {FileBrowser} filebrowser
     */
    filebrowser: FileBrowser;

    helper: any;

    toolbar: Toolbar;

    private __modulesInstances = {};

    getInstance(moduleName, options?: object) {
        if (Jodit.modules[moduleName] === undefined) {
            throw new Error('Need real module name')
        }

        if (this.__modulesInstances[moduleName] === undefined) {
            this.__modulesInstances[moduleName] = new Jodit.modules[moduleName](this, options);
        }

        return this.__modulesInstances[moduleName];
    }

    /**
     * Create instance of Jodit
     * @constructor
     * @param {string|HTMLElement} element Selector or HTMLElement
     * @param {object} options Editor's options
     */
    constructor(element: HTMLInputElement|string, options?: object) {
        super();

        this.doc = document;
        this.win = window;

        const OptionsDefault = function () {};
        OptionsDefault.prototype = Jodit.defaultOptions;

        this.options = <Config>(new OptionsDefault());

        if (options !== undefined && typeof options === 'object') {
            Object.keys(options).forEach((key) => {
                if (typeof Jodit.defaultOptions[key] === 'object' && !Array.isArray(Jodit.defaultOptions[key])) {
                    this.options[key] = extend(true, {}, Jodit.defaultOptions[key], options[key]);
                } else {
                    this.options[key] = options[key];
                }
            })
        }


        if (typeof element === 'string') {
            this.element = <HTMLInputElement>document.querySelector(element);
        } else {
            this.element = element;
        }

        if (this.element === undefined || !(this.element instanceof HTMLElement)) {
            throw new Error('Element "' + element + '" should be string or HTMLElement');
        }

        this.selection = this.getInstance('Selection');
        this.uploader = this.getInstance('Uploader');
        this.events = this.getInstance('Events');

        this.container = <HTMLDivElement>dom('<div class="jodit_container" />');
        this.container.classList.add('jodit_' + (this.options.theme || 'default') + '_theme');

        if (this.options.zIndex) {
            this.container.style.zIndex = parseInt(this.options.zIndex.toString(), 10).toString();
        }

        this.workplace = <HTMLDivElement>dom('<div class="jodit_workplace" />');
        this.progress_bar = <HTMLDivElement>dom('<div class="jodit_progress_bar"><div></div></div>');


        this.toolbar = new Toolbar(this);
        this.toolbar.build(this.options.buttons, this.container);
        this.container.appendChild(this.workplace);

        this.workplace.appendChild(this.progress_bar);

        this.element.parentNode.insertBefore(this.container, this.element);

        this.__createEditor();

        this.helper = helper;

        this.setElementValue(); // syncro


        this.initPlugines();

        if (this.options.events) {
            each(this.options.events, (key, callback) => {
                this.events.on(key, callback);
            });
        }

        this.id = this.element.getAttribute('id') || (new Date()).getTime().toString();

        Jodit.instances[this.id] = this;

        // fix for native resizing
        try {
            this.doc.execCommand('enableObjectResizing', false, false);
            this.doc.execCommand('enableInlineTableEditing', false, false);
        } catch (ignore) {
            // continue regardless of error
        }


        this.setMode(this.options.defaultMode);
        this.events.fire('afterInit');
    }

    __plugins: {[key: string]: JoditPlugin} = {};

    initPlugines() {
        let keys = Object.keys(Jodit.plugins), i;
        for (i = 0; i < keys.length; i += 1) {
            this.__plugins[keys[i]] = new Jodit.plugins[keys[i]](this);
        }
    }


    private __defaultStyleDisplayKey = 'data-jodit-default-style-display';
    /**
     * Create main DIV element and replace source textarea
     *
     * @private
     */
    private __createEditor() {
        if (!this.options.iframe) {
            this.editor = <HTMLDivElement>dom(`<div class="jodit_wysiwyg" contenteditable aria-disabled="false" tabindex="${this.options.tabIndex}"></div>`);
            css(this.editor, {
                width: this.options.width,
                height: this.options.height,
                minHeight: this.options.minHeight
            });
            // fix fo ie
            this.workplace.appendChild(document.createTextNode("\n"));
            this.workplace.appendChild(this.editor);
            this.workplace.appendChild(document.createTextNode("\n"));
        } else {
            this.iframe = <HTMLIFrameElement>document.createElement("iframe");
            this.iframe.style.display = 'block';
            this.iframe.src = 'about:blank';
            this.iframe.className = 'jodit_wysiwyg_iframe';
            this.iframe.frameBorder = '0';

            this.workplace.appendChild(this.iframe);

            const doc = this.iframe.contentWindow.document;
            this.doc = doc;
            this.win = this.iframe.contentWindow;

            doc.open();
            doc.write(`<!DOCTYPE html>
                <html class="jodit">
                    <head>
                        ${this.options.iframeBaseUrl ? `<base href="${this.options.iframeBaseUrl}"/>` : ''}
                    </head>
                    <body class="jodit_wysiwyg" style="outline:none" contenteditable="true"></body>
                </html>`);

            doc.close();
            this.editor = <HTMLBodyElement>doc.body;

            if (this.options.iframeCSSLinks) {
                this.options.iframeCSSLinks.forEach((href) => {
                    const link: HTMLLinkElement = <HTMLLinkElement>dom('<link rel="stylesheet" href="' + href + '">', doc);
                    doc.head.appendChild(link);
                });
            }

            if (this.options.iframeStyle) {
                const style: HTMLStyleElement = doc.createElement('style');
                style.innerHTML = this.options.iframeStyle;
                doc.head.appendChild(style);
            }

            css(this.iframe, {
                width: this.options.width === 'auto' ? '100%' : this.options.width,
                height: this.options.height,
                minHeight: this.options.minHeight
            });

            if (this.options.height === 'auto') {
                doc.documentElement.style.overflowY = 'hidden';
                const resizeIframe = (e) => {
                    css(this.iframe, 'height', this.editor.offsetHeight);
                };
                this.events.on('change afterInit afterSetMode resize', resizeIframe);
                this.__on([this.iframe, this.win, doc.documentElement], 'load', alert);
                this.__on(doc, 'readystatechange DOMContentLoaded', resizeIframe);
                // setTimeout(resizeIframe, 100);
            }

            css(this.editor, 'minHeight', this.options.minHeight);


            (function(e){
                e.matches || (e.matches = Element.prototype.matches); // fix inside iframe polifill
            })(this.win['Element'].prototype);

            //proxy events
            this.__on(this.win, 'mousedown click mouseup mousemove scroll', (e: Event) => {
                this.__fire && this.__fire(window, e, document);
            });
        }

        // proxy events
        ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'mousepress', 'paste', 'resize'].forEach((event_type) => {
            this.editor.addEventListener(event_type, (e) => {
                if (this.events.fire(event_type, [e]) === false) {
                    e.preventDefault();
                    return false;
                }
                this.setEditorValue(); // sync all events in element
            });
        });

        if (this.options.spellcheck) {
            this.editor.setAttribute('spellcheck', "true");
        }

        // direction
        if (this.options.direction) {
            this.editor.style.direction = this.options.direction.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
        }


        // hide source element
        if (this.element.style.display) {
            this.element.setAttribute(this.__defaultStyleDisplayKey, this.element.style.display)
        }

        this.element.style.display = 'none';
    }

    /**
     * Jodit's Destructor. Remove editor, and return source input
     */
    destruct() {
        /**
         * Triggered before {@link events:beforeDestruct|beforeDestruct} executed. If returned false method stopped
         *
         * @event beforeDestruct
         * @example
         * var editor = new Jodit("#redactor");
         * editor.events.on('beforeDestruct', function (data) {
         *     return false;
         * });
         */
        if (this.events.fire('beforeDestruct') === false) {
            return;
        }


        if (!this.editor) {
            return;
        }

        if (this.element.hasAttribute(this.__defaultStyleDisplayKey)) {
            this.element.style.display = this.element.getAttribute(this.__defaultStyleDisplayKey);
            this.element.removeAttribute(this.__defaultStyleDisplayKey);
        } else {
            this.element.style.display = '';
        }

        if (this.element.hasAttribute('style') && !this.element.getAttribute('style')) {
            this.element.removeAttribute('style');
        }

        delete this['selection'];

        this.events.off();
        delete this['events'];

        Object.keys(this.__plugins).forEach((pluginName) => {
            if (this.__plugins[pluginName].destruct !== undefined && typeof this.__plugins[pluginName].destruct === 'function') {
                this.__plugins[pluginName].destruct();
            }
            delete this.__plugins[pluginName];
        });

        this.components.forEach((component) => {
            if (component.destruct !== undefined && typeof component.destruct === 'function') {
                component.destruct();
            }
        });

        this.container.parentNode.removeChild(this.container);
        delete this['container'];
        delete this['editor'];
        delete this['workplace'];

        delete Jodit.instances[this.id];
    }

    /**
     * Return source element value
     */
    getElementValue() {
        return this.element.value;
    }

    /**
     * Return editor value
     */
    getEditorValue(): string {
        /**
         * Triggered before {@link Jodit~getEditorValue|getEditorValue} executed. If returned not undefined getEditorValue will return this value
         *
         * @event beforeGetValueFromEditor
         * @example
         * var editor = new Jodit("#redactor");
         * editor.events.on('beforeGetValueFromEditor', function () {
         *     return editor.editor.innerHTML.replace(/a/g, 'b');
         * });
         */
        let value: string;

        value = this.events.fire('beforeGetValueFromEditor');
        if (value !== undefined) {
            return value;
        }


        value = this.editor.innerHTML
            .replace(consts.INVISIBLE_SPACE_REG_EXP, '');


        if (value === '<br>') {
            value = '';
        }

        /**
         * Triggered after  {@link Jodit~getEditorValue|getEditorValue} got value from wysiwyg. It can change new_value.value
         *
         * @event afterGetValueFromEditor
         * @param string new_value
         * @example
         * var editor = new Jodit("#redactor");
         * editor.events.on('afterGetValueFromEditor', function (new_value) {
         *     new_value.value = new_value.value.replace('a', 'b');
         * });
         */
        let new_value = {value};

        this.events.fire('afterGetValueFromEditor', [new_value]);

        return new_value.value;
    }

    /**
     * Set source element value and if set sync fill editor value
     * When method was called without arguments - it is simple way to synchronize element to editor
     *
     * @param {string} [value]
     */
    setElementValue(value?: string) {
        if (typeof value !== 'string' && value !== undefined) {
            throw new Error('value must be string');
        }

        if (value !== undefined) {
            this.element.value = value;
        }
        if (this.getElementValue() !== this.getEditorValue()) {
            this.setEditorValue(this.getElementValue());
        }
    }

    /**
     * Set editor html value and if set sync fill source element value
     * When method was called without arguments - it is simple way to synchronize editor to element
     *
     * @param {string} [value]
     */
    setEditorValue(value ?: string) {
        if (typeof value !== 'string' && value !== undefined) {
            throw new Error('value must be string');
        }

        if (value !== undefined) {
            this.editor.innerHTML = value;
        }

        let old_value = this.getElementValue();
        if (old_value !== this.getEditorValue()) {
            this.setElementValue(this.getEditorValue());
            this.events.fire('change', [old_value, this.getEditorValue()]);
        }
    }

    /**
     * Execute command editor
     *
     * @method execCommand
     * @param  {string} command command. It supports all the {@link https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands} and a number of its own
     * for example applyCSSProperty. Comand fontSize receives the second parameter px, formatBlock and can take several options
     * @param  {boolean|string|int} second
     * @param  {boolean|string|int} third
     * @fires beforeCommand
     * @fires afterCommand
     * @example
     * this.execCommand('applyCSSProperty', 'color', '#fff'); // sets the color of the text for the current selection in white
     * this.execCommand('fontSize', 12); // sets the size of 12 px
     * this.execCommand('underline');
     * this.execCommand('formatBlock', 'p'); // will be inserted paragraph
     */
    execCommand(command, second = false, third = null) {
        let result;
        command = command.toLowerCase();
        /**
         * Called before any command
         * @event beforeCommand
         * @param {string} command Command name in lowercase
         * @param {string} second The second parameter for the command
         * @param {string} third The third option is for the team
         * @example
         * parent.events.on('beforeCommand', function (command) {
         *  if (command === 'justifyCenter') {
         *      var p = parent.getDocument().createElement('p')
         *      parent.selection.insertNode(p)
         *      parent.selection.moveCursorTo(p);
         *      p.style.textAlign = 'justyfy';
         *      return false; // break execute native command
         *  }
         * })
         */
        if (this.events.fire('beforeCommand', [command, second, third]) !== false) {
            this.selection.focus();
            switch (command) {
                case 'selectall':
                    this.selection.select(this.editor, true);
                    break;
                default:
                    try {
                        result = this.doc.execCommand(command, second, third);
                    } catch (e) {

                    }
            }
        }

        /**
         * It called after any command
         * @event afterCommand
         * @param {string} command name command
         * @param {*} second The second parameter for the command
         * @param {*} third The third option is for the team
         */
        this.events.fire('afterCommand', [command, second, third]);

        this.setEditorValue();// synchrony

        return result;
    }

    /**
     * Disable selecting
     */
    startDrag() {
        this.editor.classList.add('jodit_disabled');
    }

    /**
     * Enable selecting
     */
    endDrag() {
        this.editor.classList.remove('jodit_disabled');
    }

    mode = consts.MODE_WYSIWYG;
    getMode() {
        return this.mode;
    }

    /**
     * Return current real work mode. When editor in MODE_SOURCE or MODE_WYSIWYG it will return them, but then editor in MODE_SPLIT it will return MODE_SOURCE if Textarea(CodeMirror) focused or MODE_WYSIWYG otherwise
     *
     * @example
     * var editor = new Jodit('#editor');
     * console.log(editor.getRealMode());
     * @method getRealMode
     */
    getRealMode() {
        return this.mode !== consts.MODE_SPLIT ? this.mode : ((document.activeElement && document.activeElement.tagName === 'TEXTAREA') ? consts.MODE_SOURCE : consts.MODE_WYSIWYG);
    }

    /**
     * Set current mode
     *
     * @method setMode
     * @fired beforeSetMode
     * @fired afterSetMode
     */
    setMode(mode) {
        let data = {
                mode
            },
            modeClasses = ['jodit_wysiwyg_mode', 'jodit_source_mode', 'jodit_split_mode'];

        /**
         * Triggered before {@link Jodit~setMode|setMode} executed. If returned false method stopped
         * @event beforeSetMode
         * @param {Object} data PlainObject {mode: {string}} In handler you can change data.mode
         * @example
         * var editor = new Jodit("#redactor");
         * editor.events.on('beforeSetMode', function (data) {
             *     data.mode = Jodit.MODE_SOURCE; // not respond to the mode change. Always make the source code mode
             * });
         */
        if (this.events.fire('beforeSetMode', [data]) === false) {
            return;
        }

        this.mode = inArray(data.mode, [consts.MODE_SOURCE, consts.MODE_WYSIWYG, consts.MODE_SPLIT]) ? data.mode : consts.MODE_WYSIWYG;

        if (this.options.saveModeInCookie) {
            Cookie.set('jodit_default_mode', this.mode, 31);
        }

        modeClasses.forEach((className) => {
            this.container.classList.remove(className);
        });
        this.container.classList.add(modeClasses[this.mode - 1]);

        /**
         * Triggered after {@link Jodit~setMode|setMode} executed
         * @event afterSetMode
         * @example
         * var editor = new Jodit("#redactor");
         * editor.events.on('afterSetMode', function () {
             *     editor.val(''); // clear editor's value after change mode
             * });
         */
        this.events.fire('afterSetMode');
    }

    /**
     * Toggle editor mode WYSIWYG to TEXTAREA(CodeMirror) to SPLIT(WYSIWYG and TEXTAREA) to again WYSIWYG
     *
     * @example
     * var editor = new Jodit('#editor');
     * editor.toggleMode();
     * @method toggleMode
     */
    toggleMode () {
        let mode = this.getMode();
        if (inArray(mode + 1, [consts.MODE_SOURCE, consts.MODE_WYSIWYG, this.options.useSplitMode ? consts.MODE_SPLIT : 9])) {
            mode += 1;
        } else {
            mode = consts.MODE_WYSIWYG;
        }
        this.setMode(mode);
    }

    /**
     * Internationalization method. Uses Jodit.lang object
     *
     * @method i18n
     * @memberof module:Jodit
     * @param {string} key Some text
     * @param {string[]} params Some text
     * @return {string}
     * @example
     * var editor = new Jodit("#redactor", {
     *      langusage: 'ru'
     * });
     * console.log(editor.i18n('Cancel')) //Отмена;
     *
     * Jodit.defaultOptions.language = 'ru';
     * console.log(Jodit.prototype.i18n('Cancel')) //Отмена
     *
     * Jodit.lang.cs = {
     *    Cancel: 'Zrušit'
     * };
     * Jodit.defaultOptions.language = 'cs';
     * console.log(Jodit.prototype.i18n('Cancel')) //Zrušit
     *
     * Jodit.lang.cs = {
     *    'Hello world': 'Hello \s Good \s'
     * };
     * Jodit.defaultOptions.language = 'cs';
     * console.log(Jodit.prototype.i18n('Hello world', 'mr.Perkins', 'day')) //Hello mr.Perkins Good day
     */
    i18n (key: string, ...params: Array<string|number>) {
        if (this.options.debugLanguage) {
            return '{' + key + '}';
        }

        let store,
            parse = value => sprintf.apply(this, [value].concat(params));

        if (this.options !== undefined && Jodit.lang[defaultLanguage(this.options.language)] !== undefined) {
            store = Jodit.lang[defaultLanguage(this.options.language)];
        } else {
            if (Jodit.lang[defaultLanguage(Jodit.defaultOptions.language)] !== undefined) {
                store = Jodit.lang[defaultLanguage(Jodit.defaultOptions.language)];
            } else {
                store = Jodit.lang.en;
            }
        }

        if (this.options !== undefined && this.options.i18n[defaultLanguage(this.options.language)] !== undefined && this.options.i18n[defaultLanguage(this.options.language)][key]) {
            return parse(this.options.i18n[defaultLanguage(this.options.language)][key]);
        }

        if (typeof store[key] === 'string' && store[key]) {
            return parse(store[key]);
        }

        if (typeof Jodit.lang.en[key] === 'string' && Jodit.lang.en[key]) {
            return parse(Jodit.lang.en[key]);
        }

        return parse(key);
    }

    /**
     * Return current version
     *
     * @method getVersion
     * @return {string}
     */
    getVersion = () => {
        return this.version;
    }
}

Jodit.defaultOptions = new Config();


