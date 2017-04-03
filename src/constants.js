/*eslint no-unused-vars: 0*/
export const INVISIBLE_SPACE = "\uFEFF";
export const INVISIBLE_SPACE_REG_EXP = /[\uFEFF]/g;
export const SPACE_REG_EXP_START = /^[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_END = /[\s\n\t\r\uFEFF\u200b]+$/g;

export const IS_BLOCK = /^(PRE|DIV|P|TD|TH|LI|H[1-6]|TABLE)$/i;

export const KEY_ENTER      = 13;
export const KEY_BACKSPACE  = 8;
export const KEY_DELETE     = 46;
export const KEY_TAB        = 9;
export const KEY_LEFT       = 37;
export const KEY_TOP        = 38;
export const KEY_RIGHT      = 39;
export const KEY_BOTTOM     = 40;

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

export const PARAGRAPH = 'P';

/**
 * @property {object} OUTDATED_TAGS List of old tags that are to be replaced by new ones such as I in EM
 */
export const OUTDATED_TAGS    =  {
    I       : 'EM',
    B       : 'STRONG',
    STRIKE  : 'S'
};

/**
 * @property {int} MODE_WYSIWYG=1 WYSIWYG editor mode
 */
export const  MODE_WYSIWYG  = 1;

/**
 * @property {int} MODE_TEXTAREA=2 html editor mode
 */
export const  MODE_TEXTAREA = 2;

/**
 * @property {int} MODE_SPLIT=3  Source code editor and HTML editor both like {@link http://getuikit.com/docs/htmleditor.html|this}
 */
export const  MODE_SPLIT = 3;