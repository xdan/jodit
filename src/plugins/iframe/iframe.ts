/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/iframe/README.md]]
 * @packageDocumentation
 * @module plugins/iframe
 */

import type { IJodit } from 'jodit/types';
import { MODE_SOURCE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { error } from 'jodit/core/helpers';
import {
	$$,
	attr,
	callPromise,
	css,
	defaultLanguage
} from 'jodit/core/helpers/';
import {
	indexOfClosingTag,
	indexOfOpenTag,
	removeBetween
} from 'jodit/core/helpers/html/tag-scan';

import './config';

/**
 * Iframe plugin - use `iframe` instead of DIV in editor. It can be need when you want to attach custom styles in editor
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

						attr(link, 'rel', 'stylesheet');
						attr(link, 'href', href);

						doc.head && Dom.append(doc.head, link);

						// What plugins measured in the editing document changes once it's styled
						jodit.e.on(link, 'load', () => jodit.e.fire('resize'));
					});
				}

				if (opt.iframeStyle) {
					const style = doc.createElement('style');
					style.innerHTML = opt.iframeStyle;
					doc.head && Dom.append(doc.head, style);
				}
			}
		)
		.on('createEditor', (): void | Promise<void> | false => {
			if (!opt.iframe) {
				return;
			}

			const iframe = editor.c.element('iframe');

			css(iframe, 'display', 'block');
			iframe.src = 'about:blank';
			iframe.className = 'jodit-wysiwyg_iframe';
			attr(iframe, {
				allowtransparency: 'true',
				tabindex: opt.tabIndex.toString(),
				frameborder: '0'
			});

			if (opt.iframeSandbox != null) {
				attr(iframe, 'sandbox', opt.iframeSandbox);
			}

			Dom.append(editor.workplace, iframe);
			editor.iframe = iframe;

			const result = editor.e.fire(
				'generateDocumentStructure.iframe',
				null,
				editor
			);

			const init = (): boolean => {
				if (!editor.iframe) {
					return false;
				}

				const doc = (editor.iframe.contentWindow as Window).document;
				editor.editorWindow = editor.iframe.contentWindow as Window;

				const docMode = opt.editHTMLDocumentMode;

				const toggleEditable = (): void => {
					attr(
						doc.body,
						'contenteditable',
						(editor.getMode() !== MODE_SOURCE &&
							!editor.getReadOnly()) ||
							null
					);
				};

				// The start of the whitespace run that ends at `to`
				const skipBack = (text: string, to: number): number => {
					while (to > 0 && /\s/.test(text.charAt(to - 1))) {
						to -= 1;
					}

					return to;
				};

				// The editor's own attributes on `<body>`: `min-height` and `contenteditable=true`
				const cleanBodyTag = (tag: string): string => {
					tag = tag.replace(
						/min-height["'\s]*:[\s"']*[0-9]+(px|%)/i,
						''
					);

					const skip = (from: number, chars: RegExp): number => {
						while (chars.test(tag.charAt(from))) {
							from += 1;
						}

						return from;
					};

					let index = tag.indexOf('contenteditable');

					while (index !== -1) {
						let to = skip(
							index + 'contenteditable'.length,
							/["'\s]/
						);

						if (tag.charAt(to) === '=') {
							to = skip(to + 1, /[\s"']/);

							if (tag.startsWith('true', to)) {
								to = skip(to + 4, /["']/);

								let from = index;

								if (/["']/.test(tag.charAt(from - 1))) {
									from -= 1;
								}

								from = skipBack(tag, from);

								return tag.slice(0, from) + tag.slice(to);
							}
						}

						index = tag.indexOf('contenteditable', index + 1);
					}

					return tag;
				};

				const clearMarkers = (html: string): string => {
					// The plugins' own styles, from `getContainer`, aren't part of the value
					html = removeBetween(
						html,
						'<style',
						'>',
						'</style>',
						'jodit-box'
					);

					const bodyStart = indexOfOpenTag(html, 'body');
					let bodyEnd = -1;

					for (
						let index = indexOfClosingTag(
							html,
							'body',
							bodyStart + 1
						);
						index !== -1;
						index = indexOfClosingTag(html, 'body', index + 1)
					) {
						bodyEnd = index;
					}

					if (bodyStart !== -1 && bodyEnd !== -1) {
						const afterBody = bodyEnd + '</body>'.length;
						const gt = html.indexOf('>', bodyStart);
						let body = html.slice(bodyStart, afterBody);

						if (gt !== -1 && gt < bodyEnd) {
							body =
								cleanBodyTag(html.slice(bodyStart, gt)) +
								html.slice(gt, afterBody);
						}

						for (const tag of ['style', 'script', 'span']) {
							body = removeBetween(
								body,
								'<' + tag,
								'>',
								'</' + tag + '>',
								'jodit'
							);
						}

						// remove markers: the spans outside the body are the editor's own
						const stripSpans = (part: string): string =>
							removeBetween(
								removeBetween(part, '<span', '>', '</span>'),
								'&lt;span',
								'&gt;',
								'&lt;/span&gt;'
							);

						html = (
							stripSpans(html.slice(0, bodyStart)) +
							body +
							stripSpans(html.slice(afterBody))
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

				/**
				 * Replace the whole iframe document with the given HTML.
				 *
				 * The markup is parsed in an inert document first (no browsing
				 * context: scripts do not run, sub-resources are not fetched),
				 * sanitized there via `safeHTML`, and only then moved into the
				 * live document. `document.write` on the live document would
				 * execute inline scripts and event handlers while parsing,
				 * before the sanitizer had a chance to strip them, and the
				 * iframe is same-origin with the host page by default.
				 * A `<script>` the cleaner is configured to keep still never
				 * executes: nodes coming from an inert parser are flagged
				 * "already started", exactly like `innerHTML`.
				 * See GHSA-w3xv-x3fm-59ph.
				 */
				const replaceDocument = (html: string): void => {
					const inert = new DOMParser().parseFromString(
						html,
						'text/html'
					);

					editor.e.fire('safeHTML', inert.documentElement);

					// The plugins' own styles stay, as the value leaves them out
					const styles = $$('style.jodit-box', doc.head);

					doc.replaceChild(
						doc.adoptNode(inert.documentElement),
						doc.documentElement
					);

					styles.forEach(style => Dom.append(doc.head, style));
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
							({ value }: { value: string }): boolean => {
								if (editor.isLocked) {
									return false;
								}

								if (/<(html|body)/i.test(value)) {
									const old = doc.documentElement.outerHTML;

									if (
										clearMarkers(old) !==
										clearMarkers(value)
									) {
										replaceDocument(clearMarkers(value));
										editor.editor = doc.body;

										toggleEditable();
										editor.e.fire('prepareWYSIWYGEditor');

										editor.e.stopPropagation(
											'beforeSetNativeEditorValue'
										);
									}

									return true;
								}

								// A partial value goes through the regular
								// path: `clean-html` sanitizes it and the
								// editor assigns it to `doc.body` via
								// `innerHTML`. Writing the raw value here
								// would fire its event handlers first.
								return false;
							},
							{ top: true }
						);
				}

				editor.editor = doc.body;

				editor.e.on(
					'afterSetMode afterInit afterAddPlace',
					toggleEditable
				);

				if (opt.height === 'auto') {
					doc.documentElement &&
						css(doc.documentElement, 'overflowY', 'hidden');

					const resizeIframe = editor.async.throttle((...args) => {
						editor.async.requestAnimationFrame(() => {
							if (
								editor.editor &&
								editor.iframe &&
								opt.height === 'auto'
							) {
								const style = editor.ew.getComputedStyle(
										editor.editor
									),
									marginOffset =
										parseInt(style.marginTop || '0', 10) +
										parseInt(style.marginBottom || '0', 10);

								css(
									editor.iframe,
									'height',
									editor.editor.offsetHeight + marginOffset
								);
							}
						});
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

					if (typeof ResizeObserver === 'function') {
						const resizeObserver = new ResizeObserver(resizeIframe);
						resizeObserver.observe(doc.body);
						editor.e.on('beforeDestruct', () => {
							resizeObserver.disconnect();
						});
					}
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

pluginSystem.add('iframe', iframe);
