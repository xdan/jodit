/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { HTMLTagNames, IDictionary, Nullable } from 'jodit/types';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import eraserIcon from './eraser.svg';

declare module 'jodit/config' {
	interface Config {
		cleanHTML: {
			timeout: number;

			/**
			 * Replace &amp;nbsp; to plain space
			 */
			replaceNBSP: boolean;
			/**
			 * Remove empty P tags, if they are not in the beginning of the text
			 */
			fillEmptyParagraph: boolean;
			/**
			 * Remove empty elements
			 */
			removeEmptyElements: boolean;
			/**
			 * Replace old tags to new eg. <i> to <em>, <b> to <strong>
			 */
			replaceOldTags: IDictionary<HTMLTagNames> | false;

			/**
			 * You can use an iframe with the sandbox attribute to safely paste and test HTML code.
			 * It prevents scripts and handlers from running, but it does slow things down.
			 *
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
			 * @deprecated Use `removeEventAttributes` instead
			 * Remove onError attributes
			 */
			removeOnError: boolean;

			/**
			 * Remove all `on*` event handler attributes (onerror, onclick, onload, onmouseover, etc.)
			 * When enabled, this replaces the legacy `removeOnError` behavior with comprehensive protection.
			 *
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 	 cleanHTML: {
			 * 	 	 removeEventAttributes: true
			 * 	 }
			 * });
			 * ```
			 */
			removeEventAttributes: boolean;

			/**
			 * Safe href="javascript:" links
			 */
			safeJavaScriptLink: boolean;

			/**
			 * Automatically add `rel="noopener noreferrer"` to links with `target="_blank"`
			 *
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 	 cleanHTML: {
			 * 	 	 safeLinksTarget: true
			 * 	 }
			 * });
			 * ```
			 */
			safeLinksTarget: boolean;

			/**
			 * Whitelist of allowed CSS properties inside `style` attributes.
			 * If set, all CSS properties not in the list will be removed.
			 *
			 * ```javascript
			 * Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         allowedStyles: {
			 *             '*': ['color', 'background-color', 'font-size', 'text-align'],
			 *             img: ['width', 'height']
			 *         }
			 *     }
			 * });
			 * ```
			 */
			allowedStyles: false | IDictionary<string[]>;

			/**
			 * Custom sanitizer function. Called after Jodit's built-in sanitization.
			 * Use this to integrate DOMPurify or other external sanitizers.
			 *
			 * ```javascript
			 * import DOMPurify from 'dompurify';
			 *
			 * Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         sanitizer: (html) => DOMPurify.sanitize(html)
			 *     }
			 * });
			 * ```
			 */
			sanitizer: false | ((value: string) => string);

			/**
			 * Automatically add `sandbox=""` attribute to all `<iframe>` elements in editor content.
			 * Prevents embedded content from running scripts or accessing the parent page.
			 *
			 * ```javascript
			 * Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         sandboxIframesInContent: true
			 *     }
			 * });
			 * ```
			 */
			sandboxIframesInContent: boolean;

			/**
			 * Convert unsafe embed elements to sandboxed `<iframe>`.
			 * - `['object', 'embed']` — default
			 * - `false` — disabled
			 * - `string[]` — custom list of tag names to convert
			 *
			 * ```javascript
			 * Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         convertUnsafeEmbeds: Jodit.atom(['object', 'embed', 'applet'])
			 *     }
			 * });
			 * ```
			 */
			convertUnsafeEmbeds: false | string[];

			/**
			 * The allowTags option defines which elements will remain in the
			 * edited text when the editor saves. You can use this limit the returned HTML.
			 *
			 * ```javascript
			 * const jodit = new Jodit.make('#editor', {
			 *    cleanHTML: {
			 *       cleanOnPaste: false
			 *    }
			 * });
			 * ```
			 *
			 * ```javascript
			 * const editor = Jodit.make('#editor', {
			 *     cleanHTML: {
			 *         allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and
			 *         for <a> allow only `href` attribute and <img> allow only `src` attribute == '1.png'
			 *     }
			 * });
			 * editor.value = 'Sorry! <strong>Goodby</strong>\
			 * <span>mr.</span> <a style="color:red" href="https://xdsoft.net">Freeman</a>';
			 * console.log(editor.value); //Sorry! <a href="https://xdsoft.net">Freeman</a>
			 * ```
			 *
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
			 * https://github.com/xdan/jodit/tree/main/src/plugins/clean-html/helpers/visitor/filters
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
	denyTags: 'script,iframe,object,embed',

	useIframeSandbox: false,
	removeOnError: true,
	removeEventAttributes: true,
	safeJavaScriptLink: true,
	safeLinksTarget: true,
	allowedStyles: false,
	sanitizer: false,
	sandboxIframesInContent: true,
	convertUnsafeEmbeds: ['object', 'embed'],
	disableCleanFilter: null
};

Config.prototype.controls.eraser = {
	command: 'removeFormat',
	tooltip: 'Clear Formatting'
};

Icon.set('eraser', eraserIcon);
