/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { HTMLTagNames, IDictionary, Nullable } from 'jodit/types';
import { Config } from 'jodit/config';

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
			 * Remove empty inline elements. Elements that in-page links can point
			 * at (anything with an `id`, and `<a>` with a `name`) are kept.
			 */
			removeEmptyElements: boolean;

			/**
			 * Return an empty string from `editor.value` (and the synced source
			 * element) when the editor holds only a single empty block — e.g.
			 * `<p><br></p>` left after the user deletes all the content.
			 * `contenteditable` keeps that caret container in the DOM, so by
			 * default the value getter returns it as-is; enable this to collapse
			 * it to `''` for form submission.
			 */
			collapseEmptyValueToEmptyString: boolean;
			/**
			 * Browsers serialise quoted font names in a `style` attribute with
			 * double quotes, which end up as `&quot;` in the editor value
			 * (`font-family: &quot;Open Sans&quot;, sans-serif`). Some back ends
			 * HTML-decode the value before storing it and turn that into invalid
			 * markup. With this option (default) the value getter rewrites such
			 * names with single quotes: `font-family: 'Open Sans', sans-serif`.
			 */
			singleQuotesInFontFamily: boolean;
			/**
			 * Browsers keep a trailing `<br>` inside a block after you type into an
			 * empty one (`<p>test<br></p>`), and the same `<br>` ends up in the
			 * editor value. It renders nothing, but confuses consumers that compare
			 * or post-process the HTML. With this option the value getter drops a
			 * `<br>` that is the last node of a block (or of the whole value)
			 * and follows other content. `<p><br></p>` and `text<br><br>` — an empty
			 * line — are kept.
			 */
			removeTrailingBr: boolean;
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
	collapseEmptyValueToEmptyString: false,
	singleQuotesInFontFamily: true,
	removeTrailingBr: false,
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
