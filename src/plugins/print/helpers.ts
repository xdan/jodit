/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/print
 */

import type { IJodit } from 'jodit/types';
import { $$, attr, css, isString } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';

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
	points: 'pt' | 'px' | '' = 'px'
): HTMLElement {
	const restoreAttributes = fixedAssetsSizeAndAbsoluteLinks(editor, points);

	try {
		const res = editor.e.fire('beforePreviewBox', defaultValue, points);
		if (res != null) {
			return res;
		}

		const div = editor.c.div('jodit__preview-box');
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

			const mywindow = iframe.contentWindow;

			if (mywindow) {
				editor.e.fire(
					'generateDocumentStructure.iframe',
					mywindow.document,
					editor
				);
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

			for (let i = 0; i < dv.children.length; i += 1) {
				const c = dv.children[i];

				const newNode = document.createElement(c.nodeName);

				for (let j = 0; j < c.attributes.length; j += 1) {
					attr(
						newNode,
						c.attributes[j].nodeName,
						c.attributes[j].nodeValue
					);
				}

				if (c.children.length === 0 || Dom.isTag(c, ['table'])) {
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
			}
		};

		setHTML(div, value);

		editor.e.fire('afterPreviewBox', div);

		return div;
	} finally {
		restoreAttributes.forEach(clb => clb());
	}
}
