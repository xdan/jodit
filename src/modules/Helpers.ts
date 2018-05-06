/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import * as consts from '../constants';
import {Jodit} from "../Jodit";
import {Dom} from "./Dom";
const class2type: {[key: string]: string} = {};
const toString = class2type.toString;
const hasOwn = class2type.hasOwnProperty;

export const isIE = () => {
    return navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent);
};

let $$temp:number = 1;

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
export const $$ = (selector: string, root: HTMLElement | HTMLDocument): HTMLElement[] => {
    let result: NodeList;

    if (/:scope/.test(selector) && isIE() && !(typeof HTMLDocument !== 'undefined' && root instanceof HTMLDocument)) {
        const id: string = (<HTMLElement>root).id,
            temp_id: string = id || '_selector_id_' + ("" + Math.random()).slice(2) + $$temp++;

        selector = selector.replace(/:scope/g, '#' + temp_id);

        !id && (<HTMLElement>root).setAttribute('id', temp_id);

        result = (<HTMLElement>root.parentNode).querySelectorAll(selector);

        if (!id) {
            (<HTMLElement>root).removeAttribute('id');
        }
    } else {
        result = root.querySelectorAll(selector)
    }

    return [].slice.call(result);
};

export const isWindow = (obj: any): boolean => {
    return obj !== null && obj === obj.window;
};

export const type = (obj: any): string => {
    if (obj === null) {
        return 'null';
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
};

type eachCallback = (key: number|string, value: any|any[]) => boolean|void;


export const each = (obj: Array<any>|any, callback: eachCallback|Function) => {
    let length: number,
        keys: string[],
        i: number;

    if (Array.isArray(obj)) {
        length = obj.length;
        for (i = 0; i < length; i += 1) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                return false;
            }
        }
    } else {
        keys = Object.keys(obj);
        for (i = 0; i < keys.length; i += 1) {
            if (callback.call(obj[keys[i]], keys[i], obj[keys[i]]) === false) {
                return false;
            }
        }
    }
    return obj;
};

each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol', 'HTMLDocument', 'Window', 'HTMLElement', 'HTMLBodyElement', 'Text', 'DocumentFragment', 'DOMStringList'],
    (i, name) => {
        class2type["[object " + name + "]"] = name.toLowerCase();
    }
);

export const inArray = (needle: string|number, haystack: Array<number|string>): boolean => (haystack.indexOf(needle) !== -1);

export const isPlainObject = (obj: any): boolean => {
    if (typeof obj !== "object" || obj.nodeType || isWindow(obj)) {
        return false;
    }

    return !(obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"));
};

export const extend = function (this: any, ...args: any[]) {
    let options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = args[0] || {},
        i = 1,
        j,
        length = args.length,
        keys,
        deep = false;

    if (typeof target === "boolean") {
        deep = target;
        target = args[i] || {};
        i += 1;
    }

    if (typeof target !== "object" && type(target) === 'function') {
        target = {};
    }

    if (i === length) {
        target = this;
        i += 1;
    }

    for (i; i < length; i += 1) {
        options = args[i];
        if (options !== null && options !== undefined) {
            keys = Object.keys(options);
            for (j = 0; j < keys.length; j += 1) {
                name = keys[j];
                src = target[name];
                copy = options[name];

                if (target === copy) {
                    continue;
                }

                if (deep &&
                    copy && (
                        (isPlainObject(copy) && !(copy instanceof JoditObject)) ||
                        (Array.isArray(copy) && !(copy instanceof JoditArray))
                    )
                ) {
                    copyIsArray = Array.isArray(copy);

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};

                    }
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};

/**
 * It clears the line of all auxiliary invisible characters , from the spaces and line breaks , tabs from the beginning and end of the line
 *
 * @param {string} value input string
 * @return {string}
 */
export const trim = (value: string): string => {
    return value
        .replace(consts.SPACE_REG_EXP_START, '')
        .replace(consts.SPACE_REG_EXP_END, '')
};


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

export const colorToHex = (color: string): string | false => {
    if (color === 'rgba(0, 0, 0, 0)' || color === '') {
        return false;
    }

    if (!color) {
        return '#000000';
    }

    if (color.substr(0, 1) === '#') {
        return color;
    }

    let digits = /([\s\n\t\r]*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color) || /([\s\n\t\r]*?)rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/.exec(color),
        hex,
        red,
        green,
        blue,
        rgb;

    if (!digits) {
        return '#000000';
    }

    red = parseInt(digits[2], 10);
    green = parseInt(digits[3], 10);
    blue = parseInt(digits[4], 10);
    rgb = blue | (green << 8) | (red << 16);

    hex = rgb.toString(16).toUpperCase();

    while (hex.length < 6) {
        hex = '0' + hex;
    }

    return digits[1] + '#' + hex;
};

/**
 * Convert rgba and short HEX color to Full text color. #fff to #FFFFFF
 *
 * @method normalizeColor
 * @param {string} colorInput - string like rgba(red, green, blue, alpha) or rgb(red, green, blue) or #fff or #ffffff
 * @return {string|boolean} HEX color, false - for transparent color
 */
export const normalizeColor = (colorInput: string): string|false => {
    let newcolor = ['#'], i;

    let color: string = <string>colorToHex(colorInput);

    if (!color) {
        return false;
    }

    color = trim(color.toUpperCase());
    color = color.substr(1);

    if (color.length === 3) {
        for (i = 0; i < 3; i += 1) {
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

/**
 * Normalize value to CSS meters
 * @method normalizeSize
 * @param {string|int} value Input string
 * @return {string}
 */
export const normalizeSize = (value: string|number): string => {
    if ((/^[0-9]+$/).test(value.toString())) {
        return value + 'px';
    }
    return value.toString();
};

export const getContentWidth = (element: HTMLElement, win: Window) => {
    let pi = (value: string): number => (parseInt(value, 10)),
        style: CSSStyleDeclaration = win.getComputedStyle(element),
        width: number = element.offsetWidth,
        paddingLeft: number = pi(style.getPropertyValue('padding-left') || '0'),
        paddingRight: number = pi(style.getPropertyValue('padding-right') || '0');

    return width - paddingLeft - paddingRight;
};

/**
 * CTRL pressed
 *
 * @param  {KeyboardEvent} e Event
 * @return {boolean} true ctrl key was pressed
 */
export const ctrlKey = (e: MouseEvent|KeyboardEvent): boolean => {
    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
        if (e.metaKey && !e.altKey) {
            return true;
        }
    } else if (e.ctrlKey && !e.altKey) {
        return true;
    }
    return false;
};

const formatUrl = (url: string): string => {
    if (window.location.protocol === 'file:' && /^\/\//.test(url)) {
        url = 'https:' + url;
    }
    return url;
};

export const appendScript = (url: string, callback: (this: HTMLElement, e: Event) => any, className: string = '', doc: Document) => {
    const script: HTMLScriptElement = doc.createElement('script');
    script.className = className;
    script.type = 'text/javascript';
    script.charset = 'utf-8';

    if (callback !== undefined) {
        script.addEventListener ("load", callback, false);
    }

    script.src = formatUrl(url);

    doc.body.appendChild(script);
};

/**
 * Create DOM element from HTML text
 *
 * @param {string|HTMLElement} html
 * @param {HTMLDocument} [doc=document]
 *
 * @return HTMLElement
 */
export const dom = (html: string | HTMLElement, doc: Document): HTMLElement => {
    if (html instanceof (<any>doc.defaultView).HTMLElement) {
        return <HTMLElement>html;
    }

    const div: HTMLDivElement = doc.createElement('div');

    div.innerHTML = <string>html;

    const child: HTMLElement = (div.firstChild !== div.lastChild || !div.firstChild) ? div : <HTMLElement>div.firstChild;

    child.parentNode && child.parentNode.removeChild(child);

    return child;
};

/**
 * @param {string} hex
 * @method hexToRgb
 */
export const hexToRgb = (hex: string): RGB | null => {
    const shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Clear HTML
 *
 * @method clear
 * @param {string} value input string
 * @param {boolean} [removeEmptyBlocks] if true remove empty blocks
 * @return {string}
 */
export const clear = (value: string, removeEmptyBlocks = false): string => {
    value = trim(value)
        .replace(consts.INVISIBLE_SPACE_REG_EXP, '')
        .replace(/[\s]*class=""/g, '');

    if (removeEmptyBlocks) {
        value = value.replace(/<p[^>]*>[\s\n\r\t]*(&nbsp;|<br>|<br\/>)?[\s\n\r\t]*<\/p>[\n\r]*/g, '');
    }

    return value;
};

// /**
//  * Convert all `<,>,",'` characters to HTML entities
//  *
//  * @method htmlentities
//  * @param {string} text
//  * @return {string}
//  */
// export const htmlentities = (text: string): string => {
//     return text.replace(/</gi, "&lt;")
//         .replace(/>/gi, "&gt;")
//         .replace(/"/gi, "&quot;")
//         .replace(/'/gi, "&apos;");
// };

/**
 * Check if a string is a url
 *
 * @method isURL
 * @param {string} str
 * @return {boolean}
 */
export const isURL = function (str: string) {
    const pattern = new RegExp('^(https?:\\/\\/)' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return pattern.test(str);
};

export const pathNormalize = (path: string) => (path.replace(/([^:])[\\\/]+/g, '$1/'));

export const urlNormalize = (url: string) => (url.replace(/([^:])[\\\/]+/g, '$1/'));

/**
 * Check if a string is html or not
 *
 * @method isHTML
 * @param {string} str
 * @return {boolean}
 */
export const isHTML = (str: string): boolean => ((/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/m).test(str));

/**
 * Detect if string is HTML from MS Word or Excel
 *
 * @param {string} data
 * @return {boolean}
 */
export const isHTMLFromWord = (data: string): boolean => {
    return  data.search( /<meta.*?Microsoft Excel\s[\d].*?>/ ) !== -1 ||
        data.search( /<meta.*?Microsoft Word\s[\d].*?>/ ) !== -1 ||
    (data.search( /style="[^"]*mso-/ ) !== -1 && data.search( /<font/ ) !== -1);
};

/**
 * Converts from human readable file size (kb,mb,gb,tb) to bytes
 *
 * @method humanSizeToBytes
 * @param {string|int} human readable file size. Example 1gb or 11.2mb
 * @return {int}
 */
export const humanSizeToBytes = (human: string): number => {
    if (/^[0-9.]+$/.test(human.toString())) {
        return parseFloat(human);
    }

    const format: string = human.substr(-2, 2).toUpperCase(),
        formats: string[] = ["KB", "MB", "GB", "TB"],
        number: number = parseFloat(human.substr(0, human.length - 2));

    return formats.indexOf(format) !== -1 ? number * Math.pow(1024, formats.indexOf(format) + 1) : parseInt(human, 10);
};

/**
 * Parse query string
 *
 */
export const parseQuery = (queryString: string): {[key: string]: string} => {
    let query: {[key: string]: string} = {},
        a: string[] = queryString.substr(1).split('&'),
        i: number,
        keyvalue: string[];

    for (i = 0; i < a.length; i += 1) {
        keyvalue = a[i].split('=');
        query[decodeURIComponent(keyvalue[0])] = decodeURIComponent(keyvalue[1] || '');
    }

    return query;
};

/**
 *  Javascript url pattern converter replace youtube/vimeo url in embed code.
 *
 * @param {string} url
 * @param {int} [width=400]
 * @param {int} [height=345]
 * return {string} embed code
 */
export const convertMediaURLToVideoEmbed = (url: string, width:number = 400, height: number = 345): string => {
    if (!isURL(url)) {
        return url;
    }

    const parser: HTMLAnchorElement = document.createElement('a'),
        pattern1: RegExp = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;

    parser.href = url;

    if (!width) {
        width = 400;
    }
    if (!height) {
        height = 345;
    }

    switch (parser.hostname) {
        case 'www.vimeo.com':
        case 'vimeo.com':
            return pattern1.test(url) ? url.replace(pattern1, '<iframe width="' + width + '" height="' + height + '" src="//player.vimeo.com/video/$1" frameborder="0" allowfullscreen></iframe>') : url;
        case 'youtube.com':
        case 'www.youtube.com':
        case 'youtu.be':
        case 'www.youtu.be':
            const query: any = parser.search ? parseQuery(parser.search) : {v: parser.pathname.substr(1)};
            return query.v ? '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + query.v + '" frameborder="0" allowfullscreen></iframe>' : url;
    }

    return url;
};


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
export const browser = (browser: string): boolean|string => {
    let ua: string = navigator.userAgent.toLowerCase(),
        match: any = ((/(firefox)[\s\/]([\w.]+)/.exec(ua) || /(chrome)[\s\/]([\w.]+)/.exec(ua) || /(webkit)[\s\/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)[\s\/]([\w.]+)/.exec(ua) || /(msie)[\s]([\w.]+)/.exec(ua) || /(trident)\/([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0)) || [];

    if (browser === 'version') {
        return match[2];
    }

    if (browser === 'webkit') {
        return (match[1] === 'chrome' || match[1] === 'webkit');
    }

    if (browser === 'ff') {
        return (match[1] === 'firefox');
    }

    if (browser === 'msie') {
        return (match[1] === 'trident' || match[1] === 'msie');
    }

    return match[1] === browser;
};


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
export const offset =  (elm: HTMLElement | Range, jodit: Jodit, doc: Document, recurse: boolean = false): Bound => {
    const rect: ClientRect = elm.getBoundingClientRect(),
        body: HTMLElement = doc.body,
        docElem: HTMLElement = doc.documentElement,
        win: Window = doc.defaultView || (<any>doc).parentWindow,
        scrollTop: number = win.pageYOffset || docElem.scrollTop || body.scrollTop,
        scrollLeft: number = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        clientTop: number = docElem.clientTop || body.clientTop || 0,
        clientLeft: number = docElem.clientLeft || body.clientLeft || 0;
    let
        topValue: number,
        leftValue: number;

    if (!recurse && jodit && jodit.options && jodit.options.iframe && jodit.iframe) {
        const {top, left} = offset(jodit.iframe, jodit, jodit.ownerDocument, true);
        topValue = rect.top +  top;
        leftValue = rect.left + left;
    } else {
        topValue = rect.top +  scrollTop - clientTop;
        leftValue = rect.left + scrollLeft - clientLeft;
    }


    return {
        top: Math.round(<number>topValue),
        left: Math.round(leftValue),
        width: rect.width,
        height: rect.height
    };
};

/**
 *
 * @param key
 * @return {string}
 */
export const camelCase = (key: string): string => {
    return key.replace(/([-_])(.)/g, (m, code, letter) => {
        return letter.toUpperCase();
    });
};
/**
 *
 * @param key
 * @return {string}
 */
export const fromCamelCase = (key: string): string => {
    return key.replace(/([A-Z]+)/g, function (m, letter) {
        return '-' + letter.toLowerCase();
    });
};


/**
 * Convert special characters to HTML entities
 *
 * @method htmlspecialchars
 * @param {string} html
 * @return {string}
 */
export const htmlspecialchars = (html: string) => {
    let tmp = document.createElement('div');
    tmp.innerText = html;
    return tmp.innerHTML;
};

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
export const  debounce = function (this: any, fn: Function, timeout ?: number, invokeAsap?: boolean, ctx?: any) {
    if (arguments.length === 3 && typeof invokeAsap !== 'boolean') {
        ctx = invokeAsap;
        invokeAsap = false;
    }

    let timer: number = 0;

    return function (this: any) {

        let args = arguments;
        ctx = ctx || this;

        if ((invokeAsap && !timer) || !timeout) {
            fn.apply(ctx, args);
        }

        if (timeout) {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                if (!invokeAsap) {
                    fn.apply(ctx, args);
                }
                timer = 0;
            }, timeout);
        }
    };
};
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
export const throttle = function (fn: Function, timeout: number, ctx?: any) {
    let timer: number|null = null,
        args: IArguments,
        needInvoke: boolean,
        callee: Function;

    return function (this: any) {
        args = arguments;
        needInvoke = true;
        ctx = ctx || this;

        if (!timeout) {
            fn.apply(ctx, args);
            return;
        }

        if (!timer) {
            callee = function () {
                if (needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(callee, timeout);
                } else {
                    timer = null;
                }
            };
            callee();
        }

    };

};

export const normilizeCSSValue = (key: string, value: string|number): string|number => {
    switch (key) {
        case "font-weight":
            return value === 'bold' ? 700 : value;
    }
    return value;
};

/**
 * Get the value of a computed style property for the first element in the set of matched elements or set one or more CSS properties for every matched element
 * @param {HTMLElement} element
 * @param {string|object} key An object of property-value pairs to set. A CSS property name.
 * @param {string|int} value A value to set for the property.
 * @param {boolean} onlyStyleMode Get value from style attribute, without calculating
 */
export const css = (element: HTMLElement, key: string|{[key: string]: number | string | null | undefined}, value?: string|number, onlyStyleMode: boolean = false): string|number => {
    const numberFieldsReg = /^left|top|bottom|right|width|min|max|height|margin|padding|font-size/i;

    if (isPlainObject(key) || value !== undefined) {
        const setValue = (elm: HTMLElement, _key: string, _value: string | number | undefined) => {
            if (_value !== undefined && _value !== null && numberFieldsReg.test(_key) && /^[\-+]?[0-9.]+$/.test(_value.toString())) {
                _value = parseInt(_value.toString(), 10) + 'px';
            }
            if (_value !== undefined && css(elm, _key, void(0), true) !== normilizeCSSValue(_key, _value)) {
                (<any>elm.style)[_key] = _value;
            }
        };

        if (isPlainObject(key)) {
            let keys: string[] = Object.keys(key), j;
            for (j = 0; j < keys.length; j += 1) {
                setValue(element, camelCase(keys[j]), (<any>key)[keys[j]]);
            }
        } else {
            setValue(element, camelCase(<string>key), value);
        }

        return '';
    }

    const key2: string = <string>fromCamelCase(<string>key),
        doc: Document  = element.ownerDocument,
        win = doc ? doc.defaultView || (<any>doc).parentWindow : false;

    const currentValue: string | undefined = (<any>element.style)[<string>key];

    let result: string | number = (currentValue !== undefined && currentValue !== '') ? currentValue : ((win && !onlyStyleMode) ? win.getComputedStyle(element).getPropertyValue(key2) : '');

    if (numberFieldsReg.test(<string>key) && /^[\-+]?[0-9.]+px$/.test(result.toString())) {
        result = parseInt(result, 10);
    }

    return normilizeCSSValue(<string>key, result);
};

/**
 * Always return Array
 * @param a
 * @return {Array<any>}
 */
export const asArray = (a: any): Array<any> => (
    Array.isArray(a) ? a : [a]
);

export const splitArray = (a: Array<any> | string): Array<any> => (
    typeof a === 'string' ? a.split(/[,\s]+/) : a
);

export const sprintf = (...args: Array<string|number>): string => {
    const regex: RegExp = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    let a: Array<string | number> = args,
        i: number = 0,
        format: string = <string>a[i++];


    const pad = function(str: string, len: number, chr: string, leftJustify: boolean): string {
        const padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    // justify()
    const justify = function(value: string, prefix: string, leftJustify: boolean, minWidth: number, zeroPad: boolean): string {
        const diff: number = minWidth - value.length;

        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, ' ', leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }

        return value;
    };

    const formatBaseX = function(value: any, base: any, prefix: any, leftJustify: any, minWidth: number, precision: number, zeroPad: boolean) {
        const number = value >>> 0;
        prefix = prefix && number &&(<any>{'2': '0b', '8': '0', '16': '0x'})[base] || '';
        const newValue: string = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(newValue, prefix, leftJustify, minWidth, zeroPad);
    };

    const formatString = function(value: string, leftJustify: boolean, minWidth: number, precision: number, zeroPad: any) {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad);
    };

    const doFormat = function(substring: string, valueIndex: number, flags: string, minWidth: number | string, _: any, precision: any | undefined | string | string[], type: string) {
        if (substring == '%%') return '%';

        let leftJustify: boolean = false,
            positivePrefix: string = '',
            zeroPad: boolean = false,
            prefixBaseX: boolean = false;

        for (let j = 0; flags && j < flags.length; j++) switch (flags.charAt(j)) {
            case ' ': positivePrefix = ' '; break;
            case '+': positivePrefix = '+'; break;
            case '-': leftJustify = true; break;
            case '0': zeroPad = true; break;
            case '#': prefixBaseX = true; break;
        }

        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth === '*') {
            minWidth = +a[i++];
        } else if (minWidth.toString().charAt(0) === '*') {
            minWidth = +(<any>a)[minWidth.toString().slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0);
        } else if (precision === '*') {
            precision = +a[i++];
        } else if ((<any>precision)[0] === '*') {
            precision = +a[(<any>precision).slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        let value: string | number = valueIndex ? a[(<any>valueIndex).slice(0, -1)] : a[i++];

        switch (type) {
            case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad);
            case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd': {
                let number = parseInt(value.toString(), 10);
                let prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            }
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':  {
                let number = +value;
                let prefix = number < 0 ? '-' : positivePrefix;
                let method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                let textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + (<any>Math.abs(number))[method](precision);
                return (<any>justify(value, prefix, leftJustify, minWidth, zeroPad))[textTransform]();
            }
            default: return substring;
        }
    };

    return format.replace(regex, doFormat);
};


export const val = (elm: HTMLInputElement|HTMLElement, selector: string, value ?: string): string => {
    const child = <HTMLInputElement>elm.querySelector(selector);

    if (!child) {
        return '';
    }

    if (value) {
        child.value = value;
    }

    return child.value;
};


export  const defaultLanguage = (language?: string): string => (
    (language === 'auto' || language === undefined) ?
            document.documentElement.lang ||
            (navigator.language && navigator.language.substr(0, 2)) ||
            ((<any>navigator).browserLanguage ? (<any>navigator).browserLanguage.substr(0, 2) : false) ||
            'en' :
        language
);

export  const normalizeNode = (node: Node | null) => {
    if (!node) {
        return;
    }

    if (node.nodeType === Node.TEXT_NODE && node.nodeValue !== null && node.parentNode) {
        while (node.nextSibling && node.nextSibling.nodeType === Node.TEXT_NODE) {
            if (node.nextSibling.nodeValue !== null) {
                node.nodeValue += node.nextSibling.nodeValue;
            }
            node.nodeValue = node.nodeValue.replace(consts.INVISIBLE_SPACE_REG_EXP, '');
            node.parentNode.removeChild(node.nextSibling);
        }
    } else {
        normalizeNode(node.firstChild);
    }

    normalizeNode(node.nextSibling);
};


/**
 * The method automatically cleans up content from Microsoft Word and other HTML sources to ensure clean, compliant content that matches the look and feel of the site.
 */
export const cleanFromWord = (html: string): string => {
    if (html.indexOf( '<html ' ) !== -1) {
        html = html.substring( html.indexOf( '<html ' ), html.length );
        html = html.substring( 0, html.lastIndexOf( '</html>' ) + '</html>'.length );
    }


    let convertedString: string = '';

    try {
        const div: HTMLDivElement = document.createElement('div');
        div.innerHTML = html;

        const marks: Node[] = [];

        if (div.firstChild) {
            Dom.all(div, (node: Node) => {
                switch (node.nodeType) {
                    case Node.ELEMENT_NODE:
                        if (node.nodeName === 'FONT') {
                            Dom.unwrap(node);
                        } else {
                            [].slice.call((<Element>node).attributes).forEach((attr: Attr) => {
                                if (['src', 'href', 'rel', 'content'].indexOf(attr.name.toLowerCase()) === -1) {
                                    (<Element>node).removeAttribute(attr.name);
                                }
                            });
                        }
                        break;
                    case Node.TEXT_NODE:
                        break;
                    default:
                        marks.push(node);
                }
            });
        }

        marks.forEach((node: Node) => node.parentNode && node.parentNode.removeChild(node));

        convertedString = div.innerHTML;
    } catch (e) {

    }

    if (convertedString) {
        html = convertedString;
    }

    return html.replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '').replace(/<!--[^>]*>/g, '');
};

export  const applyStyles = (html: string): string => {
    if (html.indexOf( '<html ' ) === -1) {
        return html;
    }

    html = html.substring( html.indexOf( '<html ' ), html.length );
    html = html.substring( 0, html.lastIndexOf( '</html>' ) + '</html>'.length );

    const iframe: HTMLIFrameElement = document.createElement( 'iframe' );
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let convertedString: string = '',
        collection: HTMLElement[] = [],
        rules: CSSStyleRule[] = [];

    try {
        const iframeDoc: Document | null= iframe.contentDocument ||  (iframe.contentWindow ? iframe.contentWindow.document : null);

        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();



            if (iframeDoc.styleSheets.length) {
                rules = (<any>iframeDoc.styleSheets[iframeDoc.styleSheets.length - 1]).cssRules;
            }

            for (let idx = 0; idx < rules.length; idx += 1) {
                if (rules[idx].selectorText === '') {
                    continue;
                }

                collection = $$(rules[idx].selectorText, iframeDoc.body);

                collection.forEach((elm: HTMLElement) => {
                    elm.style.cssText += rules[idx].style.cssText
                        .replace(/mso-[a-z\-]+:[\s]*[^;]+;/g, '')
                        .replace(/border[a-z\-]*:[\s]*[^;]+;/g, '')
                });
            }

            convertedString = iframeDoc.firstChild ? iframeDoc.body.innerHTML : '';
        }

    } catch (e) {

    } finally {
        iframe.parentNode && iframe.parentNode.removeChild( iframe );
    }

    if (convertedString) {
       html = convertedString;
    }

    return html.replace(/<(\/)?(html|colgroup|col|o:p)[^>]*>/g, '').replace(/<!--[^>]*>/g, '');
};

export  const inView = (elm: HTMLElement, root: HTMLElement, doc: Document) => {
    let rect: ClientRect = elm.getBoundingClientRect(),
        top: number = rect.top,
        height: number = rect.height,
        el: HTMLElement | null = <HTMLElement | null>elm;

    do {
        if (el && el.parentNode) {
            el = <HTMLElement>el.parentNode;
            rect = el.getBoundingClientRect();
            if ((top <= rect.bottom) === false) {
                return false;
            }
            // Check if the element is out of view due to a container scrolling
            if ((top + height) <= rect.top) {
                return false
            }
        }
    } while (el && el != root && el.parentNode);

    // Check its within the document viewport
    return top <= doc.documentElement.clientHeight;
};

export const scrollIntoView = (elm: HTMLElement, root: HTMLElement, doc: Document) => {
    if (!inView(elm, root, doc)) {
        if (root.clientHeight !== root.scrollHeight) {
            root.scrollTop = elm.offsetTop;
        }
        if (!inView(elm, root, doc)) {
            elm.scrollIntoView()
        }
    }
};


export const getXPathByElement = (element: HTMLElement, root: HTMLElement): string => {
    if (!element || element.nodeType != 1) {
        return ''
    }

    if (!element.parentNode || root === element) {
        return '';
    }

    if (element.id) {
        return "//*[@id='" + element.id + "']"
    }

    const sames: Node[] = [].filter.call(element.parentNode.childNodes, (x: Node) => x.nodeName === element.nodeName);

    return getXPathByElement(<HTMLElement>element.parentNode, root) + '/' + element.nodeName.toLowerCase() + (sames.length > 1 ? '['+([].indexOf.call(sames, element)+1)+']' : '')
};

const dataBindKey = 'JoditDataBindkey';
export const dataBind = (elm: any, key: string, value?: any) => {
    let store = elm[dataBindKey];
    if (!store) {
        store = {};
        Object.defineProperty(elm, dataBindKey, {
            enumerable: false,
            configurable: true,
            value: store
        });
    }

    if (value === undefined) {
        return store[key];
    }

    store[key] = value;
};

export const isLicense = (license: any): boolean => typeof license === 'string' && license.length === 32 && /^[a-z0-9]+$/.test(license);
export const normalizeLicense = (license: string, count: number = 8): string => {
    let parts: string[] = [];

    while (license.length) {
        parts.push(license.substr(0, count));
        license = license.substr(count);
    }

    parts[1] = parts[1].replace(/./g, '*');
    parts[2] = parts[2].replace(/./g, '*');

    return parts.join('-');
};

export class JoditArray {
    length: number = 0;
    constructor(data: Array<any>) {
        extend(true, this, data);
        this.length = data.length;
        const proto: any = (<any>Array.prototype);
        ['map', 'forEach', 'reduce', 'push', 'pop', 'shift', 'unshift', 'slice', 'splice'].forEach((method: string) => {
            (<any>this)[method] = proto[method];
        })
    }
    toString() {
        const out = [];
        for (let i = 0; i < this.length; i += 1) {
            out[i] = (<any>this)[i];
        }
        return out.toString();
    }
}

export class JoditObject {
    constructor(data: any) {
        extend(true, this, data);
    }
}

export const getRange = () => {
    var range = window.getSelection().getRangeAt(0);
    return [range.startContainer, range.startOffset, range.endContainer, range.endOffset];
};

export const innerWidth = (element: HTMLElement, win: Window): number => {
    const computedStyle: CSSStyleDeclaration = win.getComputedStyle(element);

    let elementWidth: number = element.clientWidth;   // width with padding

    elementWidth -= parseFloat(computedStyle.paddingLeft || '0') + parseFloat(computedStyle.paddingRight || '0');

    return elementWidth;
};