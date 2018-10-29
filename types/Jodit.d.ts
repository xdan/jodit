/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Select } from './modules/Selection';
import { FileBrowser } from './modules/filebrowser/filebrowser';
import { Uploader } from './modules/Uploader';
import { EventsNative } from './modules/EventsNative';
import { JoditArray, JoditObject } from './modules/Helpers';
import { Config } from "./Config";
import { StatusBar } from "./modules/StatusBar";
import { Storage } from "./modules/Storage";
import { Observer } from "./modules/Observer";
import { View } from "./modules/view/view";
interface JoditPlugin {
    destruct?: Function;
    open?: Function;
}
/** Class Jodit. Main class*/
export declare class Jodit extends View {
    version: string;
    /**
     * Some extra data inside editor
     *
     * @type {{}}
     * @see copyformat plugin
     */
    buffer: {
        [key: string]: any;
    };
    static defaultOptions: Config;
    static plugins: any;
    static modules: any;
    static instances: {
        [key: string]: Jodit;
    };
    static lang: any;
    /**
     * @property {HTMLDocument} editorDocument
     */
    editorDocument: HTMLDocument;
    /**
     * @property {Window} editorWindow
     */
    editorWindow: Window;
    components: any;
    /**
     * @property {HTMLDocument} ownerDocument
     */
    ownerDocument: HTMLDocument;
    /**
     * ownerWindow
     */
    ownerWindow: Window;
    /**
     * Container for set/get value
     * @type {Storage}
     */
    storage: Storage;
    /**
     * progress_bar Progress bar
     */
    progress_bar: HTMLDivElement;
    /**
     * workplace It contains source and wysiwyg editors
     */
    workplace: HTMLDivElement;
    statusbar: StatusBar;
    observer: Observer;
    events: EventsNative;
    /**
     * element It contains source element
     */
    element: HTMLElement;
    /**
     * editor It contains the root element editor
     */
    editor: HTMLDivElement | HTMLBodyElement;
    /**
     * iframe Iframe for iframe mode
     */
    iframe: HTMLIFrameElement | null;
    /**
     * options All Jodit settings default + second arguments of constructor
     */
    options: Config;
    /**
     * @property {Select} selection
     */
    selection: Select;
    /**
     * @property {Uploader} uploader
     */
    uploader: Uploader;
    /**
     * @property {FileBrowser} filebrowser
     */
    filebrowser: FileBrowser;
    helper: any;
    /**
     * Create instance of Jodit
     * @constructor
     *
     * @param {HTMLInputElement | string} element Selector or HTMLElement
     * @param {object} options Editor's options
     */
    constructor(element: HTMLInputElement | string, options?: object);
    private __initEditor;
    __plugins: {
        [key: string]: JoditPlugin;
    };
    private __initPlugines;
    private __defaultStyleDisplayKey;
    private __defaultClassesKey;
    /**
     * Create main DIV element and replace source textarea
     *
     * @private
     */
    private __createEditor;
    /**
     * Jodit's Destructor. Remove editor, and return source input
     */
    destruct(): void;
    /**
     * Return source element value
     */
    getElementValue(): string;
    /**
     * Return real HTML value from WYSIWYG editor.
     *
     * @return {string}
     */
    getNativeEditorValue(): string;
    /**
     * Return editor value
     */
    getEditorValue(removeSelectionMarkers?: boolean): string;
    getEditorText(): string;
    /**
     * Set source element value and if set sync fill editor value
     * When method was called without arguments - it is simple way to synchronize element to editor
     *
     * @param {string} [value]
     */
    setElementValue(value?: string): void;
    /**
     * Set editor html value and if set sync fill source element value
     * When method was called without arguments - it is simple way to synchronize editor to element
     * @event beforeSetValueToEditor
     * @param {string} [value]
     */
    setEditorValue(value?: string): void;
    value: string;
    private commands;
    private execCustomCommands;
    /**
     * Register custom handler for command
     *
     * @example
     * ```javascript
     * var jodit = new Jodit('#editor);
     *
     * jodit.setEditorValue('test test test');
     *
     * jodit.registerCommand('replaceString', function (command, needle, replace) {
     *      var value = this.getEditorValue();
     *      this.setEditorValue(value.replace(needle, replace));
     *      return false; // stop execute native command
     * });
     *
     * jodit.execCommand('replaceString', 'test', 'stop');
     *
     * console.log(jodit.getEditorValue()); // stop test test
     *
     * // and you can add hotkeys for command
     * jodit.registerCommand('replaceString', {
     *    hotkeys: 'ctrl+r',
     *    exec: function (command, needle, replace) {
     *     var value = this.getEditorValue();
     *     this.setEditorValue(value.replace(needle, replace));
     *    }
     * });
     *
     * ```
     *
     * @param {string} commandNameOriginal
     * @param {CommandType | Function} command
     */
    registerCommand(commandNameOriginal: string, command: CommandType | Function): void;
    /**
     * Register hotkey for command
     *
     * @param hotkeys
     * @param commandName
     */
    registerHotkeyToCommand(hotkeys: string | string[], commandName: string): void;
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
     * ```javascript
     * this.execCommand('fontSize', 12); // sets the size of 12 px
     * this.execCommand('underline');
     * this.execCommand('formatBlock', 'p'); // will be inserted paragraph
     * ```
     */
    execCommand(command: string, second?: any, third?: null | any): any;
    private __selectionLocked;
    /**
     * Disable selecting
     */
    lock(name?: string): void;
    /**
     * Enable selecting
     */
    unlock(): void;
    isLockedNotBy: (name: string) => boolean;
    mode: number;
    /**
     * Return current editor mode: Jodit.MODE_WYSIWYG, Jodit.MODE_SOURCE or Jodit.MODE_SPLIT
     * @return {number}
     */
    getMode(): number;
    isEditorMode(): boolean;
    /**
     * Return current real work mode. When editor in MODE_SOURCE or MODE_WYSIWYG it will return them, but then editor in MODE_SPLIT it will return MODE_SOURCE if Textarea(CodeMirror) focused or MODE_WYSIWYG otherwise
     *
     * @example
     * ```javascript
     * var editor = new Jodit('#editor');
     * console.log(editor.getRealMode());
     * ```
     */
    getRealMode(): number;
    /**
     * Set current mode
     *
     * @fired beforeSetMode
     * @fired afterSetMode
     */
    setMode(mode: number | string): void;
    /**
     * Toggle editor mode WYSIWYG to TEXTAREA(CodeMirror) to SPLIT(WYSIWYG and TEXTAREA) to again WYSIWYG
     *
     * @example
     * ```javascript
     * var editor = new Jodit('#editor');
     * editor.toggleMode();
     * ```
     */
    toggleMode(): void;
    /**
     * Internationalization method. Uses Jodit.lang object
     *
     * @param {string} key Some text
     * @param {string[]} params Some text
     * @return {string}
     * @example
     * ```javascript
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
     * ```
     */
    i18n(key: string, ...params: Array<string | number>): string;
    /**
     * Return current version
     *
     * @method getVersion
     * @return {string}
     */
    getVersion: () => string;
    /**
     * Switch on/off the editor into the read-only state.
     * When in readonly, the user is not able to change the editor content, but can still use some editor functions (show source code, print content, or seach).
     * This function firing the `readonly` event.
     *
     * @param {boolean} isReadOnly
     */
    setReadOnly(isReadOnly: boolean): void;
    /**
     * Return true if editor in read-only mode
     */
    getReadOnly(): boolean;
    /**
     * Return default timeout period in milliseconds for some debounce or throttle functions. By default return {observer.timeout} options
     *
     * @return {number}
     */
    readonly defaultTimeout: number;
    static Array(array: Array<any>): JoditArray;
    static Object(object: any): JoditObject;
    static fireEach(events: string, ...args: any[]): void;
}
export {};
