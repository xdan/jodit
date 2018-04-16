/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

export const INVISIBLE_SPACE = "\uFEFF";
export const INVISIBLE_SPACE_REG_EXP = /[\uFEFF]/g;
export const INVISIBLE_SPACE_REG_EXP_END = /[\uFEFF]+$/g;
export const INVISIBLE_SPACE_REG_EXP_START = /^[\uFEFF]+/g;

export const SPACE_REG_EXP = /[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_START = /^[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_END = /[\s\n\t\r\uFEFF\u200b]+$/g;

export const IS_BLOCK = /^(PRE|DIV|P|LI|H[1-6]|BLOCKQUOTE|TD|TH|TABLE|BODY|HTML|FIGCAPTION|FIGURE)$/i;
export const IS_INLINE = /^(STRONG|SPAN|I|EM|B|SUP|SUB)$/;

export const KEY_BACKSPACE  = 8;
export const KEY_TAB        = 9;
export const KEY_ENTER      = 13;
export const KEY_ESC        = 27;

export const KEY_LEFT       = 37;
export const KEY_UP        = 38;
export const KEY_RIGHT      = 39;
export const KEY_DOWN     = 40;

export const KEY_DELETE     = 46;

export const KEY_F          = 70;
export const KEY_R          = 82;
export const KEY_H          = 72;
export const KEY_Y          = 89;
export const KEY_V          = 86;
export const KEY_Z          = 90;

export const KEY_F3         = 114;
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
export const URL_LIST = navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent) ? 'url' : 'text/uri-list';
export const TEXT_PLAIN = navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent) ? 'text' : 'text/plain';
export const TEXT_HTML = navigator.userAgent.indexOf("MSIE") != -1 || /rv:11.0/i.test(navigator.userAgent) ? 'text' : 'text/html';


export const MARKER_CLASS = 'jodit_selection_marker';

export const EMULATE_DBLCLICK_TIMEOUT = 300;

export const JODIT_SELECTED_CELL_MARKER = 'data-jodit-selected-cell';

export const INSERT_AS_HTML = 'insert_as_html';
export const INSERT_CLEAR_HTML = 'insert_clear_html';
export const INSERT_AS_TEXT = 'insert_as_text';
export const INSERT_ONLY_TEXT = 'insert_only_text';