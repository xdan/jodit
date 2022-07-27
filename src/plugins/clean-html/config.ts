/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { HTMLTagNames, IDictionary } from 'jodit/types';
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
	denyTags: false,

	removeOnError: true,
	safeJavaScriptLink: true
};

Config.prototype.controls.eraser = {
	command: 'removeFormat',
	tooltip: 'Clear Formatting'
};

Icon.set('eraser', require('./eraser.svg'));
