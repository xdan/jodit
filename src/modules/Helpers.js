import * as consts from '../constants';
let class2type = {};
let toString = class2type.toString;
let hasOwn = class2type.hasOwnProperty;

export const isIE = () => {
    return navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent);
};
export const $$ = (selector, root) => {
    let result = [];

    if (/:scope/.test(selector) && isIE()) {
        let id = root.id,
            temp_id = id || '_selector_id_' + ("" + Math.random()).slice(2) + $$.temp++;

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
};
$$.temp = 1;

export const isWindow = (obj) => {
    return obj !== null && obj === obj.window;
}
export const type = (obj) => {
    if (obj === null) {
        return 'null';
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
}
export const isArrayLike = (obj) => {
    let length = !!obj && obj.length !== undefined && obj.length,
        definedType = type(obj);

    if (definedType === "function" || isWindow(obj)) {
        return false;
    }

    return type === "array" || length === 0 || (typeof length === "number" && length > 0 &&  obj[length - 1] !== undefined);
}

/**
 *
 * @param {array|object} obj
 * @param {function(number=, T=):boolean} callback
 * @return {*}
 */
export const each = (obj, callback) => {
    let length,
        keys,
        i;
    if (isArrayLike(obj)) {
        length = obj.length;
        for (i = 0; i < length; i += 1) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    } else {
        keys = Object.keys(obj);
        for (i = 0; i < keys.length; i += 1) {
            if (callback.call(obj[keys[i]], keys[i], obj[keys[i]]) === false) {
                break;
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

export const extend = function (first) {
    let options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = first || {},
        i = 1,
        j,
        length = arguments.length,
        keys,
        deep = false;

    if (typeof target === "boolean") {
        deep = target;
        target = arguments[i] || {};
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
        options = arguments[i];
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
        .replace(consts.SPACE_REG_EXP_END, '');
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
export const normalizeColor = (color) => {
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
