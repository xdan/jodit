/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../../Config';
import * as consts from '../../constants';
import { IControlType, IJodit } from '../../types';

declare module '../../Config' {
	interface Config {
		sourceEditor: 'area' | 'ace';
		/**
		 * Use ACE editor instead of usual textarea
		 */
		useAceEditor: boolean;

		/**
		 * Options for [ace](https://ace.c9.io/#config) editor
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

Config.prototype.beautifyHTML = true;
Config.prototype.useAceEditor = true;
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
	'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ace.js'
];

Config.prototype.beautifyHTMLCDNUrlsJS = [
	'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.2/beautify.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.2/beautify-html.min.js',
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
