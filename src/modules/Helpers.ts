import * as consts from '../constants';
let class2type = {};
let toString = class2type.toString;
let hasOwn = class2type.hasOwnProperty;

export const isIE = () => {
    return navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent);
};

let $$temp:number = 1;
/**
 *
 * @param {string} CSS like selector
 * @param {HTMLElement} root
 *
 * @return {Array.<HTMLElement>}
 */
export const $$ = (selector, root) => {
    let result = [];

    if (/:scope/.test(selector) && isIE()) {
        let id = root.id,
            temp_id = id || '_selector_id_' + ("" + Math.random()).slice(2) + $$temp++;

        selector = selector.replace(/:scope/g, '#' + temp_id);

        !id && root.setAttribute('id', temp_id);

        result = root.parentNode.querySelectorAll(selector);

        if (!id) {
            root.removeAttribute('id');
        }
    } else {
        result = root.querySelectorAll(selector)
    }

    return [].slice.call(result);
}

export const isWindow = (obj) => {
    return obj !== null && obj === obj.window;
}
export const type = (obj) => {
    if (obj === null) {
        return 'null';
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
}

/**
 * @callback eachCallback
 * @param  {Number|String} key
 * @param  {Number|String|Object} value
 */

/**
 *
 * @param {array|object} obj
 * @param {eachCallback} callback
 * @return {*}
 */
export const each = (obj, callback) => {
    let length,
        keys,
        i;
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

each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol', 'HTMLDocument', 'Window', 'HTMLElement', 'HTMLBodyElement', 'Text', 'DocumentFragment'],
    (i, name) => {
        class2type["[object " + name + "]"] = name.toLowerCase();
    }
)

/**
 *
 * @param {String|Int} needle
 * @param {Array} haystack
 * @return {Boolean}
 */
export const inArray = (needle, haystack) => (haystack.indexOf(needle) !== -1);

export const isPlainObject = (obj) => {
    if (typeof obj !== "object" || obj.nodeType || isWindow(obj)) {
        return false;
    }
    if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }
    return true;
}

export const gebi = (id, doc) => {
    return id && doc.getElementById(id);
}

export const extend = (...args) => {
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
                if (deep && copy && (isPlainObject(copy) || Array.isArray(copy))) {
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
}

/**
 * It clears the line of all auxiliary invisible characters , from the spaces and line breaks , tabs from the beginning and end of the line
 * @method trim
 * @param {string} value input string
 * @return {string}
 */
export const trim = (value) => {
    return value
        .replace(consts.SPACE_REG_EXP_START, '')
        .replace(consts.SPACE_REG_EXP_END, '')
}


/**
 * Converts rgba text representation of color in hex
 * @param {string} color - string like rgba(red, green, blue, alpha) or rgb(red, green, blue)
 * @return {string|NaN} hex color view, NaN - for transparent color
 * @example
 * var p = document.createElement('p');
 * p.style.color = '#ffffff';
 * console.log(p.getAttribute('style')); // color: rgb(255, 255, 255);
 * console.log(colorTohex(p.style.color)); // #ffffff
 */

export const colorToHex = (color) => {
    if (color === 'rgba(0, 0, 0, 0)' || color === '') {
        return NaN;
    }

    if (!color) {
        return '#000000';
    }

    if (color.substr(0, 1) === '#') {
        return color;
    }

    let digits = /([\s\n\t\r]*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color) || /([\s\n\t\r]*?)rgba\((\d+), (\d+), (\d+), ([\d\.]+)\)/.exec(color),
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
}

/**
 * Convert rgba and short HEX color to Full text color. #fff to #FFFFFF
 *
 * @method normalizeColor
 * @param {string} color - string like rgba(red, green, blue, alpha) or rgb(red, green, blue) or #fff or #ffffff
 * @return {string|NaN} HEX color, NaN - for transparent color
 */
export const normalizeColor = (color: string): string|number => {
    let newcolor = ['#'], i;

    color = colorToHex(color);

    if (!color) {
        return NaN;
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
}

/**
 * Normalize value to CSS meters
 * @method normalizeSize
 * @param {string|int} value Input string
 * @return {string}
 */
export const normalizeSize = (value) => {
    if ((/^[0-9]+$/).test(value.toString())) {
        return value + 'px';
    }
    return value;
}

export const getContentWidth = (element, win) => {
    let pi = (value) => (parseInt(value, 10)),
        style = win.getComputedStyle(element),
        width = pi(style.getPropertyValue('width')),
        paddingLeft = pi(style.getPropertyValue('padding-left') || 0),
        paddingRight = pi(style.getPropertyValue('padding-right') || 0);

    return width - paddingLeft - paddingRight;
}

/**
 * CTRL pressed
 *
 * @param  {KeyboardEvent} e Event
 * @return {boolean} true ctrl key was pressed
 */
export const ctrlKey = (e) => {
    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
        if (e.metaKey && !e.altKey) {
            return true;
        }
    } else if (e.ctrlKey && !e.altKey) {
        return true;
    }
    return false;
}

let formatUrl = (url) => {
    if (window.location.protocol === 'file:' && /^\/\//.test(url)) {
        url = 'https:' + url;
    }
    return url;
}

/**
 *
 * @param {string} url
 * @param {function} callback
 */
export const appendScript = (url, callback, className = '') => {
    let script = document.createElement('script');
    script.className = className;
    script.type = 'text/javascript';
    script.charset = 'utf-8';

    script.src = formatUrl(url);

    if (callback !== undefined) {
        script.onload = callback;
    }

    document.body.appendChild(script);
}

/**
 * Create DOM element from HTML text
 *
 * @param {string|HTMLElement} html
 * @param {HTMLDocument} [doc=document]
 *
 * @return HTMLElement
 */
export const dom = (html: string|HTMLElement, doc = document): any => {
    if (html instanceof HTMLElement) {
        return html;
    }

    let div = doc.createElement('div');
    div.innerHTML = html;

    return div.firstChild;
}

/**
 * @param {string} hex
 * @method hexToRgb
 */
export const hexToRgb = (hex: string) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Clear HTML
 *
 * @method clear
 * @param {string} value input string
 * @param {boolean} [removeEmptyBlocks] if true remove empty blocks
 * @return {string}
 */
export const clear = (value, removeEmptyBlocks = false) => {
    value = trim(value)
        .replace(consts.INVISIBLE_SPACE_REG_EXP, '')
        .replace(/[\s]*class=""/g, '');

    if (removeEmptyBlocks) {
        value = value.replace(/<p[^>]*>[\s\n\r\t]*(&nbsp;|<br>|<br\/>)?[\s\n\r\t]*<\/p>[\n\r]*/g, '');
    }

    return value;
}

/**
 * Convert all `<,>,",'` characters to HTML entities
 *
 * @method htmlentities
 * @param {string} text
 * @return {string}
 */
export const htmlentities = (text: string) => {
    return text.replace(/</gi, "&lt;")
        .replace(/>/gi, "&gt;")
        .replace(/"/gi, "&quot;")
        .replace(/'/gi, "&apos;");
}

/**
 * The method automatically cleans up content from Microsoft Word and other HTML sources to ensure clean, compliant content that matches the look and feel of the site.
 *
 * @method cleanFromWord
 * @param {string} text input html
 * @return {string}
 */
export const cleanFromWord = (text) => {
    let attributes = ["style", "script", "applet", "embed", "noframes", "noscript"], i, reg, newtext;

    text = text.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g, "$1")
        .replace(/<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li>$3</li></ul>")
        .replace(/<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li>$3</li></ol>")
        .replace(/<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li$3>$5</li>")
        .replace(/<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li$3>$5</li>")
        .replace(/<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>")
        .replace(/<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>")
        .replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ul>")
        .replace(/<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ol>")
        .replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi, "<span><span")
        .replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, "")
        .replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi, "")
        .replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi, " ")
        .replace(/<!--[\s\S]*?-->/gi, "")
        .replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi, "");

    for (i = 0; i < attributes.length; i += 1) {
        reg = new RegExp("<" + attributes[i] + ".*?" + attributes[i] + "(.*?)>", "gi");
        text = text.replace(reg, "");
    }

    text = text.replace(/([\w\-]*)=("[^<>"]*"|'[^<>']*'|\w+)/gi, "")
        .replace(/&nbsp;/gi, " ");

    do {
        newtext = text;
        text = text.replace(/<[^\/>][^>]*><\/[^>]+>/gi, '');
    } while (text !== newtext);

    text = clear(text, true)
        .replace(/<a>(.[^<]+)<\/a>/gi, "$1");

    return text.replace(/<lilevel([^1])([^>]*)>/gi, '<li data-indent="true"$2>')
        .replace(/<lilevel1([^>]*)>/gi, "<li$1>");
}



/**
 * Check if a string is a url
 *
 * @method isURL
 * @param {string} str
 * @return {boolean}
 */
export const isURL = function (str) {
    var pattern = new RegExp('^(https?:\\/\\/)' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return pattern.test(str);
}

export const pathNormalize = (path) => (path.replace(/([^:])[\\\/]+/g, '$1/'))

export const urlNormalize = (url) => (url.replace(/([^:])[\\\/]+/g, '$1/'))

/**
 * Check if a string is html or not
 *
 * @method isHTML
 * @param {string} str
 * @return {boolean}
 */
export const isHTML = (str) => ((/<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/m).test(str))

/**
 * Converts from human readable file size (kb,mb,gb,tb) to bytes
 *
 * @method humanSizeToBytes
 * @param {string|int} human readable file size. Example 1gb or 11.2mb
 * @return {int}
 */
export const humanSizeToBytes = (human) => {
    if (/^[0-9\.]+$/.test(human.toString())) {
        return human;
    }

    var format = human.substr(-2, 2).toUpperCase(),
        formats = ["KB", "MB", "GB", "TB"],
        number = human.substr(0, human.length - 2);

    return formats.indexOf(format) !== -1 ? number * Math.pow(1024, formats.indexOf(format) + 1) : parseInt(human, 10);
}

/**
 * Parse query string
 *
 * @method parseQuery
 * @param {string} qstr
 * @return {plainobject}
 */
export const parseQuery = (qstr) => {
    let query = {},
        a = qstr.substr(1).split('&'),
        i,
        keyvalue;

    for (i = 0; i < a.length; i += 1) {
        keyvalue = a[i].split('=');
        query[decodeURIComponent(keyvalue[0])] = decodeURIComponent(keyvalue[1] || '');
    }

    return query;
}

/**
 *  Javascript url pattern converter replace youtube/vimeo url in embed code.
 *
 * @param {string} url
 * @param {int} [width=400]
 * @param {int} [height=345]
 * return {string} embed code
 */
export const convertMediaURLToVideoEmbed = (url, width:number = 400, height: number = 345) => {
    if (!isURL(url)) {
        return url;
    }

    let parser = document.createElement('a'),
        pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g,
        query;

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
            return pattern1.test(url) ? url.replace(pattern1, '<iframe width="' + width + '" height="' + height + '" src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>') : url;
        case 'youtube.com':
        case 'www.youtube.com':
        case 'youtu.be':
        case 'www.youtu.be':
            query = parser.search ? parseQuery(parser.search) : {v: parser.pathname.substr(1)};
            return query.v ? '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + query.v + '" frameborder="0" allowfullscreen></iframe>' : url;
    }

    return url;
}


/**
 * Module returns method that is used to determine the browser
 * @params {Object} parent main Jodit object
 * @example
 $browser = new Jodit.modules.Browser();
 console.log($browser('mse'));
 console.log($browser('chrome'));
 console.log($browser('opera'));
 console.log($browser('firefox'));
 console.log($browser('mse') && $browser('version') > 10);
 */
export const browser = (browser: string): boolean => {
    let ua = navigator.userAgent.toLowerCase(),
        match = ((/(firefox)[\s\/]([\w.]+)/.exec(ua) || /(chrome)[\s\/]([\w.]+)/.exec(ua) || /(webkit)[\s\/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)[\s\/]([\w.]+)/.exec(ua) || /(msie)[\s]([\w.]+)/.exec(ua) || /(trident)\/([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0)) || [];

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
 * @return {{top: number, left: number}} returns an object containing the properties top and left.
 */
export const offset =  (elm: HTMLElement) => {
    let rect = elm.getBoundingClientRect(),
        doc = elm.ownerDocument,
        body = doc.body,
        docElem = doc.documentElement,
        win = doc.defaultView || doc['parentWindow'],
        scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop,
        scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        clientTop = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        top  = rect.top +  scrollTop - clientTop,
        left = rect.left + scrollLeft - clientLeft;

    return {
        top: Math.round(top),
        left: Math.round(left)
    };
}

/**
 *
 * @param key
 * @return {string}
 */
export const camelCase = (key: string): string => {
    return key.replace(/-(.{1})/g, (m, letter) => {
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