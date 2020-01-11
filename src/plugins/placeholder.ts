/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { css } from '../modules/helpers/css';
import { debounce } from '../modules/helpers/async';
import { Dom } from '../modules/Dom';
import { IJodit } from '../types';

/**
 * Show placeholder
 *
 */

/**
 * @property {boolean} showPlaceholder=true Show placeholder
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *    showPlaceholder: false
 * });
 * ```
 */
declare module '../Config' {
	interface Config {
		showPlaceholder: boolean;
		useInputsPlaceholder: boolean;
		placeholder: string;
	}
}
Config.prototype.showPlaceholder = true;

/**
 * @property {boolean} useInputsPlaceholder=true use a placeholder from original input field, if it was set
 * @example
 * ```javascript
 * //<textarea id="editor" placeholder="start typing text ..." cols="30" rows="10"></textarea>
 * var editor = new Jodit('#editor', {
 *    useInputsPlaceholder: true
 * });
 * ```
 */
Config.prototype.useInputsPlaceholder = true;

/**
 * @property {string} placeholder='Type something' Default placeholder
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *    placeholder: 'start typing text ...'
 * });
 * ```
 */
Config.prototype.placeholder = 'Type something';

/**
 * Show placeholder inside empty editor
 *
 * @param {Jodit} editor
 */
export function placeholder(this: any, editor: IJodit) {
	if (!editor.options.showPlaceholder) {
		return;
	}

	const show = () => {
			if (editor.options.readonly) {
				return;
			}

			let marginTop: number = 0,
				marginLeft: number = 0;

			const style = editor.editorWindow.getComputedStyle(
				editor.editor
			);

			editor.workplace.appendChild(placeholderElm);

			if (
				editor.editor.firstChild &&
				editor.editor.firstChild.nodeType === Node.ELEMENT_NODE
			) {
				const style2 = editor.editorWindow.getComputedStyle(
					editor.editor.firstChild as Element
				);

				marginTop = parseInt(style2.getPropertyValue('margin-top'), 10);

				marginLeft = parseInt(
					style2.getPropertyValue('margin-left'),
					10
				);

				placeholderElm.style.fontSize =
					parseInt(style2.getPropertyValue('font-size'), 10) + 'px';

				placeholderElm.style.lineHeight = style2.getPropertyValue(
					'line-height'
				);
			} else {
				placeholderElm.style.fontSize =
					parseInt(style.getPropertyValue('font-size'), 10) + 'px';

				placeholderElm.style.lineHeight = style.getPropertyValue(
					'line-height'
				);
			}

			css(placeholderElm, {
				display: 'block',
				marginTop: Math.max(
					parseInt(style.getPropertyValue('margin-top'), 10),
					marginTop
				),
				marginLeft: Math.max(
					parseInt(style.getPropertyValue('margin-left'), 10),
					marginLeft
				)
			});
		},
		hide = (): void => {
			Dom.safeRemove(placeholderElm);
		},
		toggle = debounce(() => {
			if (!editor.editor || editor.isInDestruct) {
				return;
			}

			if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
				hide();
				return;
			}

			const value = editor.value;

			if (
				value.trim().length &&
				!/^<(p|div|h[1-6])><\/\1>$/.test(value)
			) {
				hide();
			} else {
				show();
			}
		}, editor.defaultTimeout / 10);

	const placeholderElm = editor.create.fromHTML(
		'<span style="display: none;" class="jodit_placeholder">' +
			editor.i18n(editor.options.placeholder) +
			'</span>'
	);

	if (editor.options.direction === 'rtl') {
		placeholderElm.style.right = '0px';
		placeholderElm.style.direction = 'rtl';
	}

	editor.events
		.on('readonly', (isReadOnly: boolean) => {
			if (isReadOnly) {
				hide();
			} else {
				toggle();
			}
		})
		.on('beforeDestruct', () => {
			Dom.safeRemove(placeholderElm);
			editor.events.off('.placeholder').off(window, 'load', toggle);
		})
		.on('afterInit changePlace', () => {
			if (
				editor.options.useInputsPlaceholder &&
				editor.element.hasAttribute('placeholder')
			) {
				placeholderElm.innerHTML =
					editor.element.getAttribute('placeholder') || '';
			}

			toggle();

			editor.events.fire('placeholder', placeholderElm.innerHTML);
			editor.events
				.off('.placeholder')
				.on(
					'change.placeholder keyup.placeholder mouseup.placeholder keydown.placeholder ' +
						'mousedown.placeholder afterSetMode.placeholder',
					toggle
				)
				.on(window, 'load', toggle);
		});
}
