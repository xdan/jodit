/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IJodit, Nullable } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { Dom } from 'jodit/core/dom/dom';

import { css } from './css';
import { attr } from './utils';
import { $$ } from './selector';

/**
 * Fixes image sizes and sets absolute paths to images
 */
function fixedAssetsSizeAndAbsoluteLinks(
	editor: IJodit,
	points: 'pt' | 'px' | ''
): Function[] {
	const restoreAttributes: Function[] = [];

	try {
		$$('img', editor.editor).forEach(item => {
			const previousAttrs = [
				attr(item, 'width'),
				attr(item, 'height'),
				item.src
			];

			attr(item, {
				width: item.offsetWidth + points,
				height: item.offsetHeight + points
			});

			const a = editor.createInside.a();
			editor.ed.body.appendChild(a);
			a.href = item.src;
			item.src = a.href;
			Dom.safeRemove(a);

			restoreAttributes.push(() => {
				item.src = previousAttrs[2] ?? '';

				attr(item, {
					width: previousAttrs[0] || null,
					height: previousAttrs[1] || null
				});
			});
		});
	} catch (e) {
		restoreAttributes.forEach(c => c());
		restoreAttributes.length = 0;
		throw e;
	}

	return restoreAttributes;
}

/**
 * Generates a copy of an HTML document, resizes images, executes JS
 *
 * @event beforePreviewBox(string | undefined, 'pt' | 'px' | '')
 * @event afterPreviewBox(HTMLElement)
 */
export function previewBox(
	editor: IJodit,
	defaultValue?: string,
	points: 'pt' | 'px' | '' = 'px',
	container: Nullable<HTMLElement> = null
): HTMLElement {
	const restoreAttributes = fixedAssetsSizeAndAbsoluteLinks(editor, points);

	try {
		const res = editor.e.fire('beforePreviewBox', defaultValue, points);
		if (res != null) {
			return res;
		}

		let div: HTMLElement = editor.c.div('jodit__preview-box jodit-context');
		if (container) {
			container.appendChild(div);
		}

		css(div, {
			position: 'relative',
			padding: 16
		});

		const value =
			editor.value ||
			`<div style='position: absolute;left:50%;top:50%;transform: translateX(-50%) translateY(-50%);color:#ccc;'>${editor.i18n(
				'Empty'
			)}</div>`;

		if (editor.iframe) {
			const iframe = editor.create.element('iframe');

			css(iframe, {
				minWidth: 800,
				minHeight: 600,
				border: 0
			});

			div.appendChild(iframe);

			const myWindow = iframe.contentWindow;

			if (myWindow) {
				editor.e.fire(
					'generateDocumentStructure.iframe',
					myWindow.document,
					editor
				);

				div = myWindow.document.body;

				if (typeof ResizeObserver === 'function') {
					const resizeObserver = new ResizeObserver(entries => {
						iframe.style.height =
							myWindow.document.body.offsetHeight + 20 + 'px';
					});

					resizeObserver.observe(myWindow.document.body);

					editor.e.on('beforeDestruct', () => {
						resizeObserver.unobserve(myWindow.document.body);
					});
				}
			}
		} else {
			css(div, {
				minWidth: 1024,
				minHeight: 600,
				border: 0
			});
		}

		const setHTML = (box: HTMLElement, value: string | Element): void => {
			const dv = isString(value) ? editor.c.div() : value;

			if (isString(value)) {
				dv.innerHTML = value;
			}

			for (let i = 0; i < dv.childNodes.length; i += 1) {
				const c = dv.childNodes[i];

				if (Dom.isElement(c)) {
					const newNode = box.ownerDocument.createElement(c.nodeName);

					for (let j = 0; j < c.attributes.length; j += 1) {
						attr(
							newNode,
							c.attributes[j].nodeName,
							c.attributes[j].nodeValue
						);
					}

					if (c.childNodes.length === 0 || Dom.isTag(c, ['table'])) {
						switch (c.nodeName) {
							case 'SCRIPT':
								if (c.textContent) {
									newNode.textContent = c.textContent;
								}
								break;

							default:
								if (c.innerHTML) {
									newNode.innerHTML = c.innerHTML;
								}
								break;
						}
					} else {
						setHTML(newNode, c);
					}

					try {
						box.appendChild(newNode);
					} catch {}
				} else {
					try {
						box.appendChild(c.cloneNode(true));
					} catch {}
				}
			}
		};

		setHTML(div, value);

		editor.e.fire('afterPreviewBox', div);

		return div;
	} finally {
		restoreAttributes.forEach(clb => clb());
	}
}
