/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { HTMLTagNames, IDictionary, Nullable } from 'jodit/types';
import { Config } from 'jodit/config';
import { Icon } from 'jodit/core/ui/icon';

declare module 'jodit/config' {
	interface Config {
		cleanHTML: {
			timeout: number;

			/**
			 * Replace &amp;nbsp; to plain space
			 */
			replaceNBSP: boolean;
			fillEmptyParagraph: boolean;
			removeEmptyElements: boolean;
			replaceOldTags: IDictionary<HTMLTagNames> | false;

			/**
			 * Use iframe[sandbox] to paste HTML code into the editor to check it for safety
			 * Allows you not to run scripts and handlers, but it works much slower
			 * @example
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 	 cleanHTML: {
			 * 	 	 useIframeSandbox: true
			 * 	 }
			 * 	});
			 * ```
			 */
			useIframeSandbox: boolean;

			/**
			 * Remove onError attributes
			 */
			removeOnError: boolean;

			/**
			 * Safe href="javascript:" links
			 */
			safeJavaScriptLink: boolean;

			/**
			 * The allowTags option defines which elements will remain in the
			 * edited text when the editor saves. You can use this limit the returned HTML.
			 * @example
			 * ```javascript
			 * const jodit = new Jodit.make('#editor', {
			 *    cleanHTML: {
			 *       cleanOnPaste: false
			 *    }
			 * });
			 * ```
			 * @example
			 * ```javascript
			 * const editor = Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and
			 *         for <a> allow only `href` attribute and <img> allow only `src` attribute == '1.png'
			 *     }
			 * });
			 * editor.value = 'Sorry! <strong>Goodby</strong>\
			 * <span>mr.</span> <a style="color:red" href="http://xdsoft.net">Freeman</a>';
			 * console.log(editor.value); //Sorry! <a href="http://xdsoft.net">Freeman</a>
			 * ```
			 *
			 * @example
			 * ```javascript
			 * const editor = Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         allowTags: {
			 *             p: true,
			 *             a: {
			 *                 href: true
			 *             },
			 *             table: true,
			 *             tr: true,
			 *             td: true,
			 *             img: {
			 *                 src: '1.png'
			 *             }
			 *         }
			 *     }
			 * });
			 * ```
			 */
			allowTags: false | string | IDictionary<string>;
			denyTags: false | string | IDictionary<string>;

			/**
			 * Node filtering rules that do not need to be applied to content
			 * The full list of rules is generated dynamically from the folder
			 * https://github.com/xdan/jodit/tree/master/src/plugins/clean-html/helpers/visitor/filters
			 */
			disableCleanFilter: Nullable<Set<string>>;
		};
	}
}

Config.prototype.cleanHTML = {
	timeout: 300,
	removeEmptyElements: true,
	fillEmptyParagraph: true,
	replaceNBSP: true,
	replaceOldTags: {
		i: 'em',
		b: 'strong'
	},
	allowTags: false,
	denyTags: 'script',

	useIframeSandbox: false,
	removeOnError: true,
	safeJavaScriptLink: true,
	disableCleanFilter: null
};

Config.prototype.controls.eraser = {
	command: 'removeFormat',
	tooltip: 'Clear Formatting'
};

Icon.set('eraser', require('./eraser.svg'));
