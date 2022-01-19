/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/source
 */

import type { IControlType, IJodit, ISourceEditor } from 'jodit/types';
import { Config } from 'jodit/config';
import * as consts from 'jodit/core/constants';
import { IS_IE } from 'jodit/core/constants';

declare module 'jodit/config' {
	interface Config {
		sourceEditor: 'area' | 'ace' | ((jodit: IJodit) => ISourceEditor);

		/**
		 * Options for [ace](https://ace.c9.io/#config) editor
		 * @example
		 * ```js
		 * Jodit.make('#editor', {
		 * 	showGutter: true,
		 * 	theme: 'ace/theme/idle_fingers',
		 * 	mode: 'ace/mode/html',
		 * 	wrap: true,
§		 * 	highlightActiveLine: true
		 * })
		 * ```
		 */
		sourceEditorNativeOptions: {
			showGutter: boolean;
			theme: string;
			mode: string;
			wrap: string | boolean | number;
			highlightActiveLine: boolean;
		};

		/**
		 * Beautify HTML then it possible
		 */
		beautifyHTML: boolean;

		/**
		 * CDN URLs for HTML Beautifier
		 */
		beautifyHTMLCDNUrlsJS: string[];

		/**
		 * CDN URLs for ACE editor
		 */
		sourceEditorCDNUrlsJS: string[];
	}
}

Config.prototype.beautifyHTML = !IS_IE;
Config.prototype.sourceEditor = 'ace';

Config.prototype.sourceEditorNativeOptions = {
	/**
	 * Show gutter
	 */
	showGutter: true,

	/**
	 * Default theme
	 */
	theme: 'ace/theme/idle_fingers',

	/**
	 * Default mode
	 */
	mode: 'ace/mode/html',

	/**
	 * Wrap lines. Possible values - "off", 80-100..., true, "free"
	 */
	wrap: true,

	/**
	 * Highlight active line
	 */
	highlightActiveLine: true
};

Config.prototype.sourceEditorCDNUrlsJS = [
	'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js'
];

Config.prototype.beautifyHTMLCDNUrlsJS = [
	'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.13.0/beautify-html.min.js'
];

Config.prototype.controls.source = {
	mode: consts.MODE_SPLIT,

	exec: (editor: IJodit) => {
		editor.toggleMode();
	},

	isActive: (editor: IJodit) => {
		return editor.getRealMode() === consts.MODE_SOURCE;
	},

	tooltip: 'Change mode'
} as IControlType;
