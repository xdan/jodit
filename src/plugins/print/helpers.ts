/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/print
 */

import type { IJodit } from 'jodit/types';
import { attr, css, isString } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';

export function previewBox(
	editor: IJodit,
	defaultValue?: string,
	points: 'pt' | 'px' | '' = 'px'
): HTMLElement {
	const div = editor.c.div('jodit__preview-box');
	css(div, {
		position: 'relative',
		padding: 16
	});

	const value =
		defaultValue ||
		editor.editor ||
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
					case 'IMG': {
						if (
							!Dom.isTag(c, 'img') ||
							!Dom.isTag(newNode, 'img')
						) {
							break;
						}

						const a = editor.createInside.a();
						a.href = c.src;
						newNode.src = a.href;

						attr(newNode, {
							width: c.offsetWidth + points,
							height: c.offsetHeight + points
						});
						break;
					}

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

	return div;
}
