/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/placeholder/README.md]]
 * @packageDocumentation
 * @module plugins/placeholder
 */

import './placeholder.less';

import type { IJodit, HTMLTagNames } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { attr } from 'jodit/core/helpers/utils/utils';
import { css } from 'jodit/core/helpers/utils/css';
import { isMarker } from 'jodit/core/helpers/checker/is-marker';
import { Dom } from 'jodit/core/dom/dom';
import { Plugin } from 'jodit/core/plugin/plugin';
import { INSEPARABLE_TAGS } from 'jodit/core/constants';
import { debounce } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Check if root node is empty
 * @private
 */
export function isEditorEmpty(root: HTMLElement): boolean {
	if (!root.firstChild) {
		return true;
	}

	const first = root.firstChild;

	if (
		INSEPARABLE_TAGS.has(first.nodeName?.toLowerCase() as HTMLTagNames) ||
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

	return (
		!next &&
		Dom.each(
			first,
			elm =>
				!Dom.isTag(elm, ['ul', 'li', 'ol']) &&
				(Dom.isEmpty(elm) || Dom.isTag(elm, 'br'))
		)
	);
}

/**
 * Show placeholder inside empty editor
 */
export class placeholder extends Plugin {
	private placeholderElm!: HTMLElement;

	protected afterInit(editor: IJodit): void {
		if (!editor.o.showPlaceholder) {
			return;
		}

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
			.on('changePlace', this.addEvents);

		this.addEvents();
	}

	private addNativeListeners = (): void => {
		this.j.e
			.off(this.j.editor, 'input.placeholder keydown.placeholder')
			.on(
				this.j.editor,
				'input.placeholder keydown.placeholder',
				this.toggle
			);
	};

	private addEvents = (): void => {
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
			.on('changePlace.placeholder', this.addNativeListeners)
			.on(
				'change.placeholder focus.placeholder keyup.placeholder mouseup.placeholder keydown.placeholder ' +
					'mousedown.placeholder afterSetMode.placeholder changePlace.placeholder',
				this.toggle
			)
			.on(window, 'load', this.toggle);

		this.addNativeListeners();

		this.toggle();
	};

	private show(): void {
		const editor = this.j;

		if (editor.o.readonly) {
			return;
		}

		let marginTop: number = 0,
			marginLeft: number = 0;

		const current = editor.s.current(),
			wrapper =
				(current && Dom.closest(current, Dom.isBlock, editor.editor)) ||
				editor.editor;

		const style = editor.ew.getComputedStyle(wrapper);
		const styleEditor = editor.ew.getComputedStyle(editor.editor);

		editor.workplace.appendChild(this.placeholderElm);

		const { firstChild } = editor.editor;

		if (Dom.isElement(firstChild) && !isMarker(firstChild)) {
			const style2 = editor.ew.getComputedStyle(firstChild);

			marginTop = parseInt(style2.getPropertyValue('margin-top'), 10);
			marginLeft = parseInt(style2.getPropertyValue('margin-left'), 10);

			this.placeholderElm.style.fontSize =
				parseInt(style2.getPropertyValue('font-size'), 10) + 'px';

			this.placeholderElm.style.lineHeight =
				style2.getPropertyValue('line-height');
		} else {
			this.placeholderElm.style.fontSize =
				parseInt(style.getPropertyValue('font-size'), 10) + 'px';

			this.placeholderElm.style.lineHeight =
				style.getPropertyValue('line-height');
		}

		css(this.placeholderElm, {
			display: 'block',
			textAlign: style.getPropertyValue('text-align'),
			paddingTop: parseInt(styleEditor.paddingTop, 10) + 'px',
			paddingLeft: parseInt(styleEditor.paddingLeft, 10) + 'px',
			paddingRight: parseInt(styleEditor.paddingRight, 10) + 'px',
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

	@debounce(ctx => ctx.defaultTimeout / 10, true)
	private toggle(): void {
		const editor = this.j;

		if (!editor.editor || editor.isInDestruct) {
			return;
		}

		if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
			this.hide();
			return;
		}

		if (!isEditorEmpty(editor.editor)) {
			this.hide();
		} else {
			this.show();
		}
	}

	protected beforeDestruct(jodit: IJodit): void {
		this.hide();

		jodit.e.off('.placeholder').off(window, 'load', this.toggle);
	}
}

pluginSystem.add('placeholder', placeholder);
