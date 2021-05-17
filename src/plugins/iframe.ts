/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../types';
import { Config } from '../config';
import { css, defaultLanguage, attr, callPromise } from '../core/helpers/';
import { error } from '../core/helpers';
import { MODE_SOURCE } from '../core/constants';

declare module '../config' {
	interface Config {
		editHTMLDocumentMode: boolean;
		iframeDefaultSrc: string;
		iframeBaseUrl: string;
		iframeTitle: string;
		iframeDoctype: string;
		iframeStyle: string;
		iframeCSSLinks: string[];
	}
}

/**
 * Base URL where the root directory for {@link Jodit.defaultOptions.iframe|iframe} mode
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeBaseUrl: 'http://xdsoft.net/jodit/docs/',
 * });
 * ```
 */
Config.prototype.iframeBaseUrl = '';

/**
 * Iframe title's content
 */
Config.prototype.iframeTitle = 'Jodit Editor';

/**
 * Iframe's DOCTYPE
 */
Config.prototype.iframeDoctype = '<!DOCTYPE html>';

/**
 * You can redefine default page
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeDefaultSrc: 'http://xdsoft.net/jodit/docs/',
 * });
 * ```
 */
Config.prototype.iframeDefaultSrc = 'about:blank';

/**
 * Custom style toWYSIWYG be used inside the iframe toWYSIWYG display content.
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeStyle: 'html{margin: 0px;}',
 * })
 * ```
 */

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

/**
 * Custom stylesheet files toWYSIWYG be used inside the iframe toWYSIWYG display content.
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeCSSLinks: ['styles/default.css'],
 * })
 * ```
 */

Config.prototype.iframeCSSLinks = [];

/**
 * Allow editing the entire HTML document(html, head)
 */
Config.prototype.editHTMLDocumentMode = false;

/**
 * Iframe plugin - use `iframe` instead of DIV in editor. It can be need when you want attach custom styles in editor
 * in backend of you system
 */
export function iframe(editor: IJodit): void {
	const opt = editor.options;

	editor.e
		.on('afterSetMode', () => {
			if (editor.isEditorMode()) {
				editor.s.focus();
			}
		})
		.on(
			'generateDocumentStructure.iframe',
			(__doc: Document | undefined, jodit: IJodit) => {
				const doc =
					__doc ||
					(
						(jodit.iframe as HTMLIFrameElement)
							.contentWindow as Window
					).document;

				doc.open();

				doc.write(
					opt.iframeDoctype +
						`<html dir="${
							opt.direction
						}" class="jodit" lang="${defaultLanguage(
							opt.language
						)}">` +
						'<head>' +
						`<title>${opt.iframeTitle}</title>` +
						(opt.iframeBaseUrl
							? `<base href="${opt.iframeBaseUrl}"/>`
							: '') +
						'</head>' +
						'<body class="jodit-wysiwyg"></body>' +
						'</html>'
				);

				doc.close();

				if (opt.iframeCSSLinks) {
					opt.iframeCSSLinks.forEach(href => {
						const link = doc.createElement('link');

						link.setAttribute('rel', 'stylesheet');
						link.setAttribute('href', href);

						doc.head && doc.head.appendChild(link);
					});
				}

				if (opt.iframeStyle) {
					const style = doc.createElement('style');
					style.innerHTML = opt.iframeStyle;
					doc.head && doc.head.appendChild(style);
				}
			}
		)
		.on('createEditor', (): void | Promise<void> | false => {
			if (!opt.iframe) {
				return;
			}

			const iframe = editor.c.element('iframe');

			iframe.style.display = 'block';
			iframe.src = 'about:blank';
			iframe.className = 'jodit-wysiwyg_iframe';
			iframe.setAttribute('allowtransparency', 'true');
			iframe.setAttribute('tabindex', opt.tabIndex.toString());
			iframe.setAttribute('frameborder', '0');

			editor.workplace.appendChild(iframe);
			editor.iframe = iframe;

			const result = editor.e.fire(
				'generateDocumentStructure.iframe',
				null,
				editor
			);

			const init = () => {
				if (!editor.iframe) {
					return;
				}

				const doc = (editor.iframe.contentWindow as Window).document;
				editor.editorWindow = editor.iframe.contentWindow as Window;

				const docMode = opt.editHTMLDocumentMode;

				const toggleEditable = () => {
					attr(
						doc.body,
						'contenteditable',
						(editor.getMode() !== MODE_SOURCE &&
							!editor.getReadOnly()) ||
							null
					);
				};

				const clearMarkers = (html: string): string => {
					const bodyReg = /<body.*<\/body>/im,
						bodyMarker = '{%%BODY%%}',
						body = bodyReg.exec(html);

					if (body) {
						// remove markers
						html = html
							.replace(bodyReg, bodyMarker)
							.replace(/<span([^>]*?)>(.*?)<\/span>/gim, '')
							.replace(
								/&lt;span([^&]*?)&gt;(.*?)&lt;\/span&gt;/gim,
								''
							)
							.replace(
								bodyMarker,

								body[0]
									.replace(
										/(<body[^>]+?)min-height["'\s]*:[\s"']*[0-9]+(px|%)/im,
										'$1'
									)
									.replace(
										/(<body[^>]+?)([\s]*["'])?contenteditable["'\s]*=[\s"']*true["']?/im,
										'$1'
									)
									.replace(
										/<(style|script|span)[^>]+jodit[^>]+>.*?<\/\1>/g,
										''
									)
							)
							.replace(
								/(class\s*=\s*)(['"])([^"']*)(jodit-wysiwyg|jodit)([^"']*\2)/g,
								'$1$2$3$5'
							)
							.replace(/(<[^<]+?)\sclass="[\s]*"/gim, '$1')
							.replace(/(<[^<]+?)\sstyle="[\s;]*"/gim, '$1')
							.replace(/(<[^<]+?)\sdir="[\s]*"/gim, '$1');
					}

					return html;
				};

				if (docMode) {
					const tag = editor.element.tagName;

					if (tag !== 'TEXTAREA' && tag !== 'INPUT') {
						throw error(
							'If enable `editHTMLDocumentMode` - source element should be INPUT or TEXTAREA'
						);
					}

					editor.e
						.on('beforeGetNativeEditorValue', (): string =>
							clearMarkers(
								editor.o.iframeDoctype +
									doc.documentElement.outerHTML
							)
						)
						.on(
							'beforeSetNativeEditorValue',
							(value: string): boolean => {
								if (editor.isLocked) {
									return false;
								}

								if (/<(html|body)/i.test(value)) {
									const old = doc.documentElement.outerHTML;

									if (
										clearMarkers(old) !==
										clearMarkers(value)
									) {
										doc.open();
										doc.write(
											editor.o.iframeDoctype +
												clearMarkers(value)
										);
										doc.close();
										editor.editor = doc.body;

										toggleEditable();
										editor.e.fire('prepareWYSIWYGEditor');
									}
								} else {
									doc.body.innerHTML = value;
								}

								return true;
							}
						);
				}

				editor.editor = doc.body;

				editor.e.on(
					'afterSetMode afterInit afterAddPlace',
					toggleEditable
				);

				if (opt.height === 'auto') {
					doc.documentElement &&
						(doc.documentElement.style.overflowY = 'hidden');

					const resizeIframe = editor.async.throttle(() => {
						if (
							editor.editor &&
							editor.iframe &&
							opt.height === 'auto'
						) {
							css(
								editor.iframe,
								'height',
								editor.editor.offsetHeight
							);
						}
					}, editor.defaultTimeout / 2);

					editor.e
						.on(
							'change afterInit afterSetMode resize',
							resizeIframe
						)
						.on(
							[editor.iframe, editor.ew, doc.documentElement],
							'load',
							resizeIframe
						)
						.on(
							doc,
							'readystatechange DOMContentLoaded',
							resizeIframe
						);
				}

				// throw events in our world
				if (doc.documentElement) {
					editor.e
						.on(doc.documentElement, 'mousedown touchend', () => {
							if (!editor.s.isFocused()) {
								editor.s.focus();

								if (editor.editor === doc.body) {
									editor.s.setCursorIn(doc.body);
								}
							}
						})
						.on(
							editor.ew,
							'mousedown touchstart keydown keyup touchend click mouseup mousemove scroll',
							(e: Event) => {
								editor.events?.fire(editor.ow, e);
							}
						);
				}

				return false;
			};

			return callPromise(result, init);
		});
}
