/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/print
 */

import type { IControlType, IDialog, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { attr, css } from 'jodit/core/helpers';
import * as consts from 'jodit/core/constants';

Config.prototype.controls.preview = {
	icon: 'eye',
	command: 'preview',
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
	tooltip: 'Preview'
} as IControlType;

export function preview(editor: IJodit): void {
	editor.registerButton({
		name: 'preview'
	});

	editor.registerCommand(
		'preview',
		(_: any, _1: any, defaultValue: string) => {
			const dialog = <IDialog>editor.getInstance('Dialog', {
				language: editor.o.language,
				theme: editor.o.theme
			});

			const div = editor.c.div();
			css(div, {
				position: 'relative',
				padding: 16
			});

			const value =
				defaultValue ||
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
				dialog.open(div, editor.i18n('Preview'));

				const mywindow = iframe.contentWindow;

				if (mywindow) {
					editor.e.fire(
						'generateDocumentStructure.iframe',
						mywindow.document,
						editor
					);

					mywindow.document.body.innerHTML = value;
				}
			} else {
				css(div, {
					minWidth: 1024,
					minHeight: 600,
					border: 0
				});

				dialog.setSize(1024, 600).open(div, editor.i18n('Preview'));

				const setHTML = (box: HTMLElement, value: string): void => {
					const dv = editor.c.div();
					dv.innerHTML = value;

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

						if (c.children.length === 0) {
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
							setHTML(newNode, c.innerHTML);
						}

						try {
							box.appendChild(newNode);
						} catch {}
					}
				};

				setHTML(div, value);
			}

			dialog.setModal(true);
		}
	);
}
