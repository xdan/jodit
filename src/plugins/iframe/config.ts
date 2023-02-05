/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/iframe
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * You can redefine default page
		 *
		 * @example
		 * ```javascript
		 * Jodit.make('#editor', {
		 *    iframe: true,
		 *    iframeDefaultSrc: 'http://xdsoft.net/jodit/docs/',
		 * });
		 * ```
		 */
		iframeDefaultSrc: string;

		/**
		 * Base URL where the root directory for [[Config.iframe]] mode
		 *
		 * @example
		 * ```javascript
		 * new Jodit('#editor', {
		 *    iframe: true,
		 *    iframeBaseUrl: 'http://xdsoft.net/jodit/docs/',
		 * });
		 * ```
		 */
		iframeBaseUrl: string;

		/**
		 * Iframe title's content
		 */
		iframeTitle: string;

		/**
		 * Iframe's DOCTYPE
		 */
		iframeDoctype: string;

		/**
		 * Custom style to be used inside the iframe to display content.
		 * @example
		 * ```javascript
		 * new Jodit('#editor', {
		 *    iframe: true,
		 *    iframeStyle: 'html{margin: 0px;}',
		 * })
		 * ```
		 */
		iframeStyle: string;

		/**
		 * Custom stylesheet files to be used inside the iframe to display content.
		 *
		 * @example
		 * ```javascript
		 * new Jodit('#editor', {
		 *    iframe: true,
		 *    iframeCSSLinks: ['styles/default.css'],
		 * })
		 * ```
		 */
		iframeCSSLinks: string[];
	}
}

Config.prototype.iframeBaseUrl = '';
Config.prototype.iframeTitle = 'Jodit Editor';
Config.prototype.iframeDoctype = '<!DOCTYPE html>';
Config.prototype.iframeDefaultSrc = 'about:blank';
Config.prototype.iframeStyle =
	'html{' +
	'margin:0;' +
	'padding:0;' +
	'min-height: 100%;' +
	'}' +
	'body{' +
	'box-sizing:border-box;' +
	'font-size:13px;' +
	'line-height:1.6;' +
	'padding:10px;' +
	'margin:0;' +
	'background:transparent;' +
	'color:#000;' +
	'position:' +
	'relative;' +
	'z-index:2;' +
	'user-select:auto;' +
	'margin:0px;' +
	'overflow:auto;' +
	'outline:none;' +
	'}' +
	'table{' +
	'width:100%;' +
	'border:none;' +
	'border-collapse:collapse;' +
	'empty-cells: show;' +
	'max-width: 100%;' +
	'}' +
	'th,td{' +
	'padding: 2px 5px;' +
	'border:1px solid #ccc;' +
	'-webkit-user-select:text;' +
	'-moz-user-select:text;' +
	'-ms-user-select:text;' +
	'user-select:text' +
	'}' +
	'p{' +
	'margin-top:0;' +
	'}' +
	'.jodit_editor .jodit_iframe_wrapper{' +
	'display: block;' +
	'clear: both;' +
	'user-select: none;' +
	'position: relative;' +
	'}' +
	'.jodit_editor .jodit_iframe_wrapper:after {' +
	'position:absolute;' +
	'content:"";' +
	'z-index:1;' +
	'top:0;' +
	'left:0;' +
	'right: 0;' +
	'bottom: 0;' +
	'cursor: pointer;' +
	'display: block;' +
	'background: rgba(0, 0, 0, 0);' +
	'} ' +
	'.jodit_disabled{' +
	'user-select: none;' +
	'-o-user-select: none;' +
	'-moz-user-select: none;' +
	'-khtml-user-select: none;' +
	'-webkit-user-select: none;' +
	'-ms-user-select: none' +
	'}';
Config.prototype.iframeCSSLinks = [];
