/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { css } from '../modules/helpers/css';
import { Dom } from '../modules/Dom';
import { IJodit } from '../types';
import { Plugin } from '../modules/Plugin';
import { MAY_BE_REMOVED_WITH_KEY } from '../constants';

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
export class placeholder extends Plugin {
	private placeholderElm!: HTMLElement;

	protected afterInit(editor: IJodit): void {
		if (!editor.options.showPlaceholder) {
			return;
		}

		this.toggle = editor.async.debounce(
			this.toggle.bind(this),
			this.jodit.defaultTimeout / 10
		);

		this.placeholderElm = editor.create.fromHTML(
			`<span style="display: none;" class="jodit_placeholder">${editor.i18n(
				editor.options.placeholder
			)}</span>`
		);

		if (editor.options.direction === 'rtl') {
			this.placeholderElm.style.right = '0px';
			this.placeholderElm.style.direction = 'rtl';
		}

		editor.events
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
		const editor = this.jodit;

		if (
			editor.options.useInputsPlaceholder &&
			editor.element.hasAttribute('placeholder')
		) {
			this.placeholderElm.innerHTML =
				editor.element.getAttribute('placeholder') || '';
		}

		editor.events.fire('placeholder', this.placeholderElm.innerHTML);

		editor.events
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
		const editor = this.jodit;

		if (editor.options.readonly) {
			return;
		}

		let marginTop: number = 0,
			marginLeft: number = 0;

		const style = editor.editorWindow.getComputedStyle(editor.editor);

		editor.workplace.appendChild(this.placeholderElm);

		if (Dom.isElement(editor.editor.firstChild)) {
			const style2 = editor.editorWindow.getComputedStyle(
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
		const editor = this.jodit;

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
			Dom.each(first, elm => Dom.isEmpty(elm) || Dom.isTag(elm, 'br'))
		) {
			return true;
		}

		return false;
	}

	protected beforeDestruct(jodit: IJodit): void {
		this.hide();

		this.jodit.events.off('.placeholder').off(window, 'load', this.toggle);
	}
}
