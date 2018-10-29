/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
export declare const isIE: () => boolean;
/**
 * Find all elements by selector and return Array. If it did not find any element it return empty array
 *
 * @example
 * ```javascript
 * Jodit.modules.Helpres.$$('.someselector').forEach(function (elm) {
 *      elm.addEventListener('click', function () {
 *          alert(''Clicked');
 *      });
 * })
 * ```
 * @param selector CSS like selector
 * @param root
 *
 * @return {HTMLElement[]}
 */
export declare const $$: (selector: string, root: HTMLElement | HTMLDocument) => HTMLElement[];
export declare const isWindow: (obj: any) => boolean;
export declare const type: (obj: any) => string;
declare type eachCallback = (key: number | string, value: any | any[]) => boolean | void;
export declare const each: (obj: any, callback: Function | eachCallback) => any;
export declare const inArray: (needle: string | number, haystack: (string | number)[]) => boolean;
export declare const isPlainObject: (obj: any) => boolean;
export declare const extend: (this: any, ...args: any[]) => any;
/**
 * It clears the line of all auxiliary invisible characters , from the spaces and line breaks , tabs from the beginning and end of the line
 *
 * @param {string} value input string
 * @return {string}
 */
export declare const trim: (value: string) => string;
/**
 * Converts rgba text representation of color in hex
 * @param {string} color - string like rgba(red, green, blue, alpha) or rgb(red, green, blue)
 * @return {string | NaN} hex color view, NaN - for transparent color
 * @example
 * ```javascript
 * var p = document.createElement('p');
 * p.style.color = '#ffffff';
 * console.log(p.getAttribute('style')); // color: rgb(255, 255, 255);
 * console.log(colorTohex(p.style.color)); // #ffffff
 * ```
 */
export declare const colorToHex: (color: string) => string | false;
/**
 * Convert rgba and short HEX color to Full text color. #fff to #FFFFFF
 *
 * @method normalizeColor
 * @param {string} colorInput - string like rgba(red, green, blue, alpha) or rgb(red, green, blue) or #fff or #ffffff
 * @return {string|boolean} HEX color, false - for transparent color
 */
export declare const normalizeColor: (colorInput: string) => string | false;
/**
 * Normalize value to CSS meters
 * @method normalizeSize
 * @param {string|int} value Input string
 * @return {string}
 */
export declare const normalizeSize: (value: string | number) => string;
export declare const getContentWidth: (element: HTMLElement, win: Window) => number;
/**
 * CTRL pressed
 *
 * @param  {KeyboardEvent} e Event
 * @return {boolean} true ctrl key was pressed
 */
export declare const ctrlKey: (e: MouseEvent | KeyboardEvent) => boolean;
export declare const appendScript: (url: string, callback: (this: HTMLElement, e: Event) => any, className: string | undefined, doc: Document) => void;
/**
 * Create DOM element from HTML text
 *
 * @param {string|HTMLElement} html
 * @param {HTMLDocument} [doc=document]
 *
 * @return HTMLElement
 */
export declare const dom: (html: string | HTMLElement, doc: Document) => HTMLElement;
/**
 * @param {string} hex
 * @method hexToRgb
 */
export declare const hexToRgb: (hex: string) => RGB | null;
/**
 * Clear HTML
 *
 * @method clear
 * @param {string} value input string
 * @param {boolean} [removeEmptyBlocks] if true remove empty blocks
 * @return {string}
 */
export declare const clear: (value: string, removeEmptyBlocks?: boolean) => string;
/**
 * Check if a string is a url
 *
 * @method isURL
 * @param {string} str
 * @return {boolean}
 */
export declare const isURL: (str: string) => boolean;
export declare const pathNormalize: (path: string) => string;
export declare const urlNormalize: (url: string) => string;
/**
 * Check if a string is html or not
 *
 * @method isHTML
 * @param {string} str
 * @return {boolean}
 */
export declare const isHTML: (str: string) => boolean;
/**
 * Detect if string is HTML from MS Word or Excel
 *
 * @param {string} data
 * @return {boolean}
 */
export declare const isHTMLFromWord: (data: string) => boolean;
/**
 * Converts from human readable file size (kb,mb,gb,tb) to bytes
 *
 * @method humanSizeToBytes
 * @param {string|int} human readable file size. Example 1gb or 11.2mb
 * @return {int}
 */
export declare const humanSizeToBytes: (human: string) => number;
/**
 * Parse query string
 *
 */
export declare const parseQuery: (queryString: string) => {
    [key: string]: string;
};
/**
 *  Javascript url pattern converter replace youtube/vimeo url in embed code.
 *
 * @param {string} url
 * @param {int} [width=400]
 * @param {int} [height=345]
 * return {string} embed code
 */
export declare const convertMediaURLToVideoEmbed: (url: string, width?: number, height?: number) => string;
/**
 * Module returns method that is used to determine the browser
 * @params {Object} parent main Jodit object
 * @example
 * ```javascript
 * console.log(editor.helper.browser('mse'));
 * console.log(editor.helper.browser('chrome'));
 * console.log($editor.helper.browser('opera'));
 * console.log(editor.helper.browser('firefox'));
 * console.log(editor.helper.browser('mse') && editor.helper.browser('version') > 10);
 * ```
 */
export declare const browser: (browser: string) => string | boolean;
/**
 * Calc relative offset by start editor field
 *
 * @method offset
 * @param {HTMLElement} elm
 * @param {Jodit} jodit
 * @param {Document} doc
 * @param {boolean} recurse
 * @return {{top: number, left: number}} returns an object containing the properties top and left.
 */
export declare const offset: (elm: HTMLElement | Range, jodit: Jodit, doc: Document, recurse?: boolean) => Bound;
/**
 *
 * @param key
 * @return {string}
 */
export declare const camelCase: (key: string) => string;
/**
 *
 * @param key
 * @return {string}
 */
export declare const fromCamelCase: (key: string) => string;
/**
 * Convert special characters to HTML entities
 *
 * @method htmlspecialchars
 * @param {string} html
 * @return {string}
 */
export declare const htmlspecialchars: (html: string) => string;
/**
 * Extract plain text from HTML text
 *
 * @param html
 */
export declare const extractText: (html: string) => string;
/**
 * Debouncing enforces that a function not be called again until a certain amount of time has passed without it being called. As in "execute this function only if 100 milliseconds have passed without it being called."
 *
 * @method debounce
 * @param {function} fn
 * @param {int} timeout
 * @param {boolean} [invokeAsap] - execute fn on first call without timeout
 * @param {context} [ctx] Context
 * @return {function}
 * @example
 * ```javascript
 * var jodit = new Jodit('.editor');
 * Jodit.modules.Dom("input").on('keydown', jodit.helper.debounce(function() {
 *     // Do expensive things
 * }, 100));
 * ```
 */
export declare const debounce: (this: any, fn: Function, timeout?: number | undefined, invokeAsap?: boolean | undefined, ctx?: any) => (this: any) => void;
/**
 * Throttling enforces a maximum number of times a function can be called over time. As in "execute this function at most once every 100 milliseconds."
 *
 * @method throttle
 * @param {function} fn
 * @param {int} timeout
 * @param {context} [ctx] Context
 * @return {function}
 * @example
 * ```javascript
 * var jodit = new Jodit('.editor');
 * jodit.events.on(document.body, 'scroll', jodit.helper.throttle(function() {
 *     // Do expensive things
 * }, 100));
 * ```
 */
export declare const throttle: (fn: Function, timeout: number, ctx?: any) => (this: any) => void;
export declare const normilizeCSSValue: (key: string, value: string | number) => string | number;
/**
 * Get the value of a computed style property for the first element in the set of matched elements or set one or more CSS properties for every matched element
 * @param {HTMLElement} element
 * @param {string|object} key An object of property-value pairs to set. A CSS property name.
 * @param {string|int} value A value to set for the property.
 * @param {boolean} onlyStyleMode Get value from style attribute, without calculating
 */
export declare const css: (element: HTMLElement, key: string | {
    [key: string]: string | number | null | undefined;
}, value?: string | number | undefined, onlyStyleMode?: boolean) => string | number;
/**
 * Always return Array
 * @param a
 * @return {Array<any>}
 */
export declare const asArray: (a: any) => any[];
export declare const splitArray: (a: string | any[]) => any[];
export declare const sprintf: (...args: (string | number)[]) => string;
export declare const val: (elm: HTMLElement | HTMLInputElement, selector: string, value?: string | undefined) => string;
export declare const defaultLanguage: (language?: string | undefined) => string;
export declare const normalizeNode: (node: Node | null) => void;
/**
 * The method automatically cleans up content from Microsoft Word and other HTML sources to ensure clean, compliant content that matches the look and feel of the site.
 */
export declare const cleanFromWord: (html: string) => string;
export declare const applyStyles: (html: string) => string;
export declare const inView: (elm: HTMLElement, root: HTMLElement, doc: Document) => boolean;
export declare const scrollIntoView: (elm: HTMLElement, root: HTMLElement, doc: Document) => void;
export declare const getXPathByElement: (element: HTMLElement, root: HTMLElement) => string;
export declare const dataBind: (elm: any, key: string, value?: any) => any;
export declare const isLicense: (license: any) => boolean;
export declare const normalizeLicense: (license: string, count?: number) => string;
export declare class JoditArray {
    length: number;
    constructor(data: Array<any>);
    toString(): string;
}
export declare class JoditObject {
    constructor(data: any);
}
export declare const getRange: () => (number | Node)[];
export declare const innerWidth: (element: HTMLElement, win: Window) => number;
/**
 * Normalize keys to some standart name
 *
 * @param keys
 */
export declare const normalizeKeyAliases: (keys: string) => string;
export {};
