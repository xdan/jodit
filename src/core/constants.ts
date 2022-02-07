/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module constants
 */

import type { IDictionary } from 'jodit/types';

export const INVISIBLE_SPACE = '\uFEFF';
export const NBSP_SPACE = '\u00A0';
export const INVISIBLE_SPACE_REG_EXP = (): RegExp => /[\uFEFF]/g;
export const INVISIBLE_SPACE_REG_EXP_END = (): RegExp => /[\uFEFF]+$/g;
export const INVISIBLE_SPACE_REG_EXP_START = (): RegExp => /^[\uFEFF]+/g;

export const SPACE_REG_EXP = (): RegExp => /[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_START = (): RegExp => /^[\s\n\t\r\uFEFF\u200b]+/g;
export const SPACE_REG_EXP_END = (): RegExp => /[\s\n\t\r\uFEFF\u200b]+$/g;

export const IS_BLOCK =
	/^(ARTICLE|SCRIPT|STYLE|OBJECT|FOOTER|HEADER|NAV|SECTION|IFRAME|JODIT|JODIT-MEDIA|PRE|DIV|P|LI|UL|OL|H[1-6]|BLOCKQUOTE|TR|TD|TH|TBODY|THEAD|TABLE|BODY|HTML|FIGCAPTION|FIGURE|DT|DD|DL|DFN|FORM)$/i;
export const IS_INLINE = /^(STRONG|SPAN|I|EM|B|SUP|SUB|A|U)$/i;

export const INSEPARABLE_TAGS: Array<keyof HTMLElementTagNameMap> = [
	'img',
	'br',
	'video',
	'iframe',
	'script',
	'input',
	'textarea',
	'hr',
	'link',
	'jodit',
	'jodit-media'
];

export const MAY_BE_REMOVED_WITH_KEY = RegExp(
	`^${INSEPARABLE_TAGS.join('|')}$`,
	'i'
);

export const KEY_BACKSPACE = 'Backspace';
export const KEY_TAB = 'Tab';
export const KEY_ENTER = 'Enter';
export const KEY_ESC = 'Escape';

export const KEY_LEFT = 'ArrowLeft';
export const KEY_UP = 'ArrowUp';
export const KEY_RIGHT = 'ArrowRight';
export const KEY_DOWN = 'ArrowDown';
export const KEY_SPACE = 'Space';

export const KEY_DELETE = 'Delete';

export const KEY_F3 = 'F3';

export const NEARBY = 5;
export const ACCURACY = 10;

export const COMMAND_KEYS = [
	KEY_BACKSPACE,
	KEY_DELETE,
	KEY_UP,
	KEY_DOWN,
	KEY_RIGHT,
	KEY_LEFT,
	KEY_ENTER,
	KEY_ESC,
	KEY_F3,
	KEY_TAB
];

export const BR = 'br';
export const PARAGRAPH = 'p';

/**
 * WYSIWYG editor mode
 */
export const MODE_WYSIWYG = 1;

/**
 * html editor mode
 */
export const MODE_SOURCE = 2;

/**
 * Source code editor and HTML editor both like
 * {@link http://getuikit.com/docs/htmleditor.html|this}
 */
export const MODE_SPLIT = 3;

/**
 * Is Internet Explorer
 */
export const IS_IE =
	typeof navigator !== 'undefined' &&
	(navigator.userAgent.indexOf('MSIE') !== -1 ||
		/rv:11.0/i.test(navigator.userAgent));

/**
 * For IE11 it will be 'text'. Need for dataTransfer.setData
 */
export const TEXT_PLAIN = IS_IE ? 'text' : 'text/plain';
export const TEXT_HTML = IS_IE ? 'html' : 'text/html';

export const MARKER_CLASS = 'jodit-selection_marker';

export const EMULATE_DBLCLICK_TIMEOUT = 300;

/**
 * Paste the copied text as HTML, all content will be pasted exactly as it was on the clipboard.
 * So how would you copy its code directly into the source document.
 * ```
 * <h1 style="color:red">test</h1>
 * ```
 * Will be inserted into the document as
 * ```
 * <h1 style="color:red">test</h1>
 * ```
 */
export const INSERT_AS_HTML = 'insert_as_html';

/**
 * Same as [[INSERT_AS_HTML]], but content will be stripped of extra styles and empty tags
 * ```
 * <h1 style="color:red">test</h1>
 * ```
 * Will be inserted into the document as
 * ```
 * <h1>test</h1>
 * ```
 */
export const INSERT_CLEAR_HTML = 'insert_clear_html';

/**
 * The contents of the clipboard will be pasted into the document as plain text, i.e. all tags will be displayed as text.
 * ```
 * <h1>test</h1>
 * ```
 * Will be inserted into the document as
 * ```
 * &gt;&lt;h1&gt;test&lt;/h1&gt;
 * ```
 */
export const INSERT_AS_TEXT = 'insert_as_text';

/**
 * All tags will be stripped:
 * ```
 * <h1>test</h1>
 * ```
 * Will be inserted into the document as
 * ```
 * test
 * ```
 */
export const INSERT_ONLY_TEXT = 'insert_only_text';

export const SAFE_COUNT_CHANGE_CALL = 10;

export const IS_MAC =
	typeof window !== 'undefined' &&
	/Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export const KEY_ALIASES: IDictionary<string> = {
	add: '+',
	break: 'pause',
	cmd: 'meta',
	command: 'meta',
	ctl: 'control',
	ctrl: 'control',
	del: 'delete',
	down: 'arrowdown',
	esc: 'escape',
	ins: 'insert',
	left: 'arrowleft',
	mod: IS_MAC ? 'meta' : 'control',
	opt: 'alt',
	option: 'alt',
	return: 'enter',
	right: 'arrowright',
	space: ' ',
	spacebar: ' ',
	up: 'arrowup',
	win: 'meta',
	windows: 'meta'
};

export const BASE_PATH: string = ((): string => {
	if (typeof document === 'undefined') {
		return '';
	}

	const script = document.currentScript as HTMLScriptElement,
		removeScriptName = (s: string) => s.replace(/\/[^/]+.js$/, '/');

	if (script) {
		return removeScriptName(script.src);
	}

	const scripts = document.querySelectorAll<HTMLScriptElement>('script[src]');

	if (scripts && scripts.length) {
		return removeScriptName(scripts[scripts.length - 1].src);
	}

	return window.location.href;
})();

export const TEMP_ATTR = 'data-jodit-temp';
