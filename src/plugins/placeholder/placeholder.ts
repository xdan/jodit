/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './placeholder.less';

import { Config } from '../../config';
import * as consts from '../../core/constants';
import { css, attr } from '../../core/helpers';
import { Dom } from '../../core/dom';
import { IJodit } from '../../types';
import { Plugin } from '../../core/plugin';
import { MAY_BE_REMOVED_WITH_KEY } from '../../core/constants';

/**
 * Show placeholder
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
declare module '../../config' {
	interface Config {
		showPlaceholder: boolean;
		useInputsPlaceholder: boolean;
		placeholder: string;
	}
}
Config.prototype.showPlaceholder = true;

/**
 * @property useInputsPlaceholder=true use a placeholder from original input field, if it was set
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
 * @property placeholder='Type something' Default placeholder
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
export class placeholder extends Plugin {
	private placeholderElm!: HTMLElement;

	protected afterInit(editor: IJodit): void {
		if (!editor.o.showPlaceholder) {
			return;
		}

		this.toggle = editor.async.debounce(
			this.toggle.bind(this),
			this.j.defaultTimeout / 10
		);

		this.placeholderElm = editor.c.fromHTML(
			`<span data-ref="placeholder" style="display: none;" class="jodit-placeholder">${editor.i18n(
				editor.o.placeholder
			)}</span>`
		);

		if (editor.o.direction === 'rtl') {
			this.placeholderElm.style.right = '0px';
			this.placeholderElm.style.direction = 'rtl';
		}

		editor.e
			.on('readonly', (isReadOnly: boolean) => {
				if (isReadOnly) {
					this.hide();
				} else {
					this.toggle();
				}
			})
			.on('changePlace', this.init);

		this.addEvents();
	}

	private addEvents = () => {
		const editor = this.j;

		if (
			editor.o.useInputsPlaceholder &&
			editor.element.hasAttribute('placeholder')
		) {
			this.placeholderElm.innerHTML =
				attr(editor.element, 'placeholder') || '';
		}

		editor.e.fire('placeholder', this.placeholderElm.innerHTML);

		editor.e
			.off('.placeholder')
			.on(
				'change.placeholder focus.placeholder keyup.placeholder mouseup.placeholder keydown.placeholder ' +
					'mousedown.placeholder afterSetMode.placeholder changePlace.placeholder',
				this.toggle
			)
			.on(window, 'load', this.toggle);

		this.toggle();
	};

	private show() {
		const editor = this.j;

		if (editor.o.readonly) {
			return;
		}

		let marginTop: number = 0,
			marginLeft: number = 0;

		const current = editor.s.current(),
			wrapper =
				(current &&
					Dom.closest(
						current,
						n => Dom.isBlock(n, editor.ew),
						editor.editor
					)) ||
				editor.editor;

		const style = editor.ew.getComputedStyle(wrapper);

		editor.workplace.appendChild(this.placeholderElm);

		if (Dom.isElement(editor.editor.firstChild)) {
			const style2 = editor.ew.getComputedStyle(
				editor.editor.firstChild as Element
			);

			marginTop = parseInt(style2.getPropertyValue('margin-top'), 10);

			marginLeft = parseInt(style2.getPropertyValue('margin-left'), 10);

			this.placeholderElm.style.fontSize =
				parseInt(style2.getPropertyValue('font-size'), 10) + 'px';

			this.placeholderElm.style.lineHeight = style2.getPropertyValue(
				'line-height'
			);
		} else {
			this.placeholderElm.style.fontSize =
				parseInt(style.getPropertyValue('font-size'), 10) + 'px';

			this.placeholderElm.style.lineHeight = style.getPropertyValue(
				'line-height'
			);
		}

		css(this.placeholderElm, {
			display: 'block',
			textAlign: style.getPropertyValue('text-align'),
			marginTop: Math.max(
				parseInt(style.getPropertyValue('margin-top'), 10),
				marginTop
			),
			marginLeft: Math.max(
				parseInt(style.getPropertyValue('margin-left'), 10),
				marginLeft
			)
		});
	}

	private hide(): void {
		Dom.safeRemove(this.placeholderElm);
	}

	private toggle() {
		const editor = this.j;

		if (!editor.editor || editor.isInDestruct) {
			return;
		}

		if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
			this.hide();
			return;
		}

		if (!this.isEmpty(editor.editor)) {
			this.hide();
		} else {
			this.show();
		}
	}

	private isEmpty(root: HTMLElement): boolean {
		if (!root.firstChild) {
			return true;
		}

		const first = root.firstChild;

		if (
			MAY_BE_REMOVED_WITH_KEY.test(first.nodeName) ||
			/^(TABLE)$/i.test(first.nodeName)
		) {
			return false;
		}

		const next = Dom.next(
			first,
			node => node && !Dom.isEmptyTextNode(node),
			root
		);

		if (Dom.isText(first) && !next) {
			return Dom.isEmptyTextNode(first);
		}

		if (
			!next &&
			Dom.each(
				first,
				elm =>
					!Dom.isTag(elm, ['ul', 'li', 'ol']) &&
					(Dom.isEmpty(elm) || Dom.isTag(elm, 'br'))
			)
		) {
			return true;
		}

		return false;
	}

	protected beforeDestruct(jodit: IJodit): void {
		this.hide();

		this.j.e.off('.placeholder').off(window, 'load', this.toggle);
	}
}
