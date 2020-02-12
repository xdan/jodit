/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { defaultLanguage } from '../modules/helpers/defaultLanguage';
import { css } from '../modules/helpers/css';
import { IJodit } from '../types';
import { isPromise } from '../modules/helpers/checker';
import { Dom } from '../modules';
import { error } from '../modules/helpers';
import { MODE_SOURCE } from '../constants';

declare module '../Config' {
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
	'td[data-jodit-selected-cell],' +
	'th[data-jodit-selected-cell]{' +
	'border: 1px double #1e88e5' +
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
export function iframe(editor: IJodit) {
	const opt = editor.options;

	editor.events
		.on('afterSetMode', () => {
			if (editor.isEditorMode()) {
				editor.selection.focus();
			}
		})
		.on(
			'generateDocumentStructure.iframe',
			(__doc: Document | undefined, jodit: IJodit) => {
				const doc =
					__doc ||
					((jodit.iframe as HTMLIFrameElement)
						.contentWindow as Window).document;

				doc.open();
				doc.write(
					`${opt.iframeDoctype}` +
						`<html dir="${
							opt.direction
						}" class="jodit" lang="${defaultLanguage(
							opt.language
						)}">
						<head>
							<title>${opt.iframeTitle}</title>
							${
							opt.iframeBaseUrl
									? `<base href="${opt.iframeBaseUrl}"/>`
									: ''
							}
						</head>
						<body class="jodit_wysiwyg" style="outline:none"></body>
					</html>`
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

			const iframe = editor.create.element('iframe');

			iframe.style.display = 'block';
			iframe.src = 'about:blank';
			iframe.className = 'jodit_wysiwyg_iframe';
			iframe.setAttribute('allowtransparency', 'true');
			iframe.setAttribute('tabindex', opt.tabIndex.toString());
			iframe.setAttribute('frameborder', '0');

			editor.workplace.appendChild(iframe);
			editor.iframe = iframe;

			const result = editor.events.fire(
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
					Dom.toggleAttribute(
						doc.body,
						'contenteditable',
						editor.getMode() !== MODE_SOURCE && !editor.getReadOnly()
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
								body[0].replace(
									/(<body[^>]+?)([\s]*["'])?contenteditable["'\s]*=[\s"']*true["']?/im,
									'$1'
								)
							);
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

					editor.editor = doc.documentElement;

					editor.events
						.on('beforeGetNativeEditorValue', (): string =>
							clearMarkers(doc.documentElement.outerHTML)
						)
						.on(
							'beforeSetNativeEditorValue',
							(value: string): boolean => {
								if (/<(html|body)/i.test(value)) {
									const old = doc.documentElement.outerHTML;

									if (old !== value) {
										doc.open('text/html', 'replace');
										doc.write(clearMarkers(value));
										doc.close();
										editor.editor = doc.documentElement;

										toggleEditable();
									}
								} else {
									doc.body.innerHTML = value;
								}

								return true;
							}
						);
				} else {
					editor.editor = doc.body as HTMLBodyElement;
				}

				editor.events.on(
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

					editor.events
						.on(
							'change afterInit afterSetMode resize',
							resizeIframe
						)
						.on(
							[
								editor.iframe,
								editor.editorWindow,
								doc.documentElement
							],
							'load',
							resizeIframe
						)
						.on(
							doc,
							'readystatechange DOMContentLoaded',
							resizeIframe
						);
				}

				(e => {
					e.matches || (e.matches = Element.prototype.matches); // fix inside iframe polifill
				})((editor.editorWindow as any).Element.prototype);

				// throw events in our world
				if (doc.documentElement) {
					editor.events
						.on(doc.documentElement, 'mousedown touchend', () => {
							if (!editor.selection.isFocused()) {
								editor.selection.focus();

								if (editor.editor === doc.body) {
									editor.selection.setCursorIn(doc.body);
								}
							}
						})
						.on(
							editor.editorWindow,
							'mousedown touchstart keydown keyup touchend click mouseup mousemove scroll',
							(e: Event) => {
									editor.events?.fire(editor.ownerWindow, e);
							}
						);
				}
			};

			if (isPromise(result)) {
				return result.then(init);
			}

			init();

			return false;
		});
}
