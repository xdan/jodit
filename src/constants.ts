/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

export const INVISIBLE_SPACE = "\uFEFF";
export const INVISIBLE_SPACE_REG_EXP = /[\uFEFF]/g;

export const SPACE_REG_EXP = /[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_START = /^[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_END = /[\s\n\t\r\uFEFF\u200b]+$/g;

export const IS_BLOCK = /^(PRE|DIV|P|LI|H[1-6]|BLOCKQUOTE|TD|TH|TABLE|BODY|HTML)$/i;

export const KEY_ENTER      = 13;
export const KEY_BACKSPACE  = 8;
export const KEY_DELETE     = 46;
export const KEY_TAB        = 9;
export const KEY_LEFT       = 37;
export const KEY_TOP        = 38;
export const KEY_RIGHT      = 39;
export const KEY_BOTTOM     = 40;
export const KEY_Z          = 90;
export const KEY_Y          = 89;
export const KEY_F          = 70;
export const KEY_ESC        = 27;
// export const KEY_CTRL       = 17;

export const NEARBY = 5;
export const ACCURACY = 10;

// Jodit.keys = {
//     CTRL:       17,
//     TAB:        9,
//     ENTER:      13,
//     BACKSPACE:  8,
//     LEFT:       37,
//     TOP:        38,
//     RIGHT:      39,
//     BOTTOM:     40,
//     Z:          90,
//     Y:          89
// };

export const BR = 'br';
export const PARAGRAPH = 'P';


/**
 * @property {int} MODE_WYSIWYG=1 WYSIWYG editor mode
 */
export const  MODE_WYSIWYG  = 1;

/**
 * @property {int} MODE_SOURCE=2 html editor mode
 */
export const  MODE_SOURCE = 2;

/**
 * @property {int} MODE_SPLIT=3  Source code editor and HTML editor both like {@link http://getuikit.com/docs/htmleditor.html|this}
 */
export const  MODE_SPLIT = 3;

/**
 * @property {string} TEXT_PLAIN='text/plain'  For IE11 it will be 'text'. Need for dataTransfer.setData
 */
export const TEXT_PLAIN = navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent) ? 'text' : 'text/plain';


export const MARKER_CLASS = 'jodit_selection_marker';

export const EMULATE_DBLCLICK_TIMEOUT = 300;