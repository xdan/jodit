/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/inline-popup/README.md]]
 * @packageDocumentation
 * @module plugins/inline-popup
 */

import './inline-popup.less';

import type {
	Buttons,
	HTMLTagNames,
	IBound,
	IJodit,
	IPopup,
	IToolbarCollection,
	IViewComponent,
	Nullable
} from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { makeCollection } from 'jodit/modules/toolbar/factory';
import { Popup } from 'jodit/core/ui/popup';
import {
	splitArray,
	isString,
	position,
	isArray,
	isFunction,
	toArray,
	keys,
	camelCase
} from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { UIElement } from 'jodit/core/ui';
import type { Table } from 'jodit/modules/table/table';
import { debounce, wait, autobind, watch } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';

import './config/config';

/**
 * Plugin for show inline popup dialog
 */
export class inlinePopup extends Plugin {
	override requires = ['select'];

	private __type: Nullable<string> = null;

	private __popup: IPopup = new Popup(this.jodit, false);

	private __toolbar: IToolbarCollection = makeCollection(
		this.jodit,
		this.__popup
	);

	@autobind
	private __onClick(node: Node): void | false {
		const elements = this.__elmsList as HTMLTagNames[],
			target = Dom.isTag(node, 'img')
				? node
				: Dom.closest(node, elements, this.j.editor);

		if (
			target &&
			this.__canShowPopupForType(target.nodeName.toLowerCase())
		) {
			this.__showPopup(
				() => position(target, this.j),
				target.nodeName.toLowerCase(),
				target
			);

			return false;
		}
	}

	/**
	 * Show inline popup with some toolbar
	 *
	 * @param type - selection, img, a etc.
	 */
	@wait((ctx: IViewComponent) => !ctx.j.isLocked)
	private __showPopup(
		rect: () => IBound,
		type: string,
		target?: HTMLElement
	): boolean {
		type = type.toLowerCase();

		if (!this.__canShowPopupForType(type)) {
			return false;
		}

		if (this.__type !== type || target !== this.__previousTarget) {
			this.__previousTarget = target;

			const data = this.j.o.popup[type];

			let content;

			if (isFunction(data)) {
				content = data(this.j, target, this.__popup.close);
			} else {
				content = data;
			}

			if (isArray(content)) {
				this.__toolbar.build(content, target);
				this.__toolbar.buttonSize = this.j.o.toolbarButtonSize;
				content = this.__toolbar.container;
			}
			this.__popup.setContent(content);

			this.__type = type;
		}

		this.__popup.open(rect);

		return true;
	}

	private __previousTarget?: HTMLElement;

	/**
	 * Hide opened popup
	 */
	@watch(':clickEditor')
	@autobind
	private __hidePopup(type?: string): void {
		if (!isString(type) || type === this.__type) {
			this.__popup.close();
		}
	}

	@watch(':outsideClick')
	protected onOutsideClick(): void {
		this.__popup.close();
	}

	/**
	 * Can show popup for this type
	 */
	private __canShowPopupForType(type: string): boolean {
		const data = this.j.o.popup[type.toLowerCase()];

		if (this.j.o.readonly || !this.j.o.toolbarInline || !data) {
			return false;
		}

		return !this.__isExcludedTarget(type);
	}

	/**
	 * For some elements do not show popup
	 */
	private __isExcludedTarget(type: string): boolean {
		return splitArray(this.j.o.toolbarInlineDisableFor)
			.map(a => a.toLowerCase())
			.includes(type.toLowerCase());
	}

	/** @override **/
	protected afterInit(jodit: IJodit): void {
		this.j.e
			.on(
				'getDiffButtons.mobile',
				(toolbar: IToolbarCollection): void | Buttons => {
					if (this.__toolbar === toolbar) {
						const names = this.__toolbar.getButtonsNames();

						return toArray(jodit.registeredButtons)
							.filter(
								btn =>
									!this.j.o.toolbarInlineDisabledButtons.includes(
										btn.name
									)
							)
							.filter(item => {
								const name = isString(item) ? item : item.name;

								return (
									name &&
									name !== '|' &&
									name !== '\n' &&
									!names.includes(name)
								);
							});
					}
				}
			)
			.on('hidePopup', this.__hidePopup)
			.on('showInlineToolbar', this.__showInlineToolbar)
			.on(
				'showPopup',
				(
					elm: HTMLElement | string,
					rect: () => IBound,
					type?: string
				) => {
					this.__showPopup(
						rect,
						type || (isString(elm) ? elm : elm.nodeName),
						isString(elm) ? undefined : elm
					);
				}
			)
			.on('mousedown keydown', this.__onSelectionStart)
			.on('change', () => {
				if (
					this.__popup.isOpened &&
					this.__previousTarget &&
					!this.__previousTarget.parentNode
				) {
					this.__hidePopup();
					this.__previousTarget = undefined;
				}
			})
			.on([this.j.ew, this.j.ow], 'mouseup keyup', this.__onSelectionEnd);

		this.__addListenersForElements();
	}

	private __snapRange: Nullable<Range> = null;

	@autobind
	private __onSelectionStart(): void {
		this.__snapRange = this.j.s.range.cloneRange();
	}

	@autobind
	private __onSelectionEnd(e: MouseEvent): void {
		if (
			e &&
			e.target &&
			UIElement.closestElement(e.target as Node, Popup)
		) {
			return;
		}

		const { __snapRange } = this,
			{ range } = this.j.s;

		if (
			!__snapRange ||
			range.collapsed ||
			range.startContainer !== __snapRange.startContainer ||
			range.startOffset !== __snapRange.startOffset ||
			range.endContainer !== __snapRange.endContainer ||
			range.endOffset !== __snapRange.endOffset
		) {
			this.__onSelectionChange();
		}
	}

	/**
	 * Selection change handler
	 */
	@debounce(ctx => ctx.defaultTimeout)
	private __onSelectionChange(): void {
		if (!this.j.o.toolbarInlineForSelection) {
			return;
		}

		const type = 'selection',
			sel = this.j.s.sel,
			range = this.j.s.range;

		if (
			sel?.isCollapsed ||
			this.__isSelectedTarget(range) ||
			this.__tableModule.getAllSelectedCells().length
		) {
			if (this.__type === type && this.__popup.isOpened) {
				this.__hidePopup();
			}

			return;
		}

		const node = this.j.s.current();

		if (!node) {
			return;
		}

		this.__showPopup(() => range.getBoundingClientRect(), type);
	}

	/**
	 * In not collapsed selection - only one image
	 */
	private __isSelectedTarget(r: Range): boolean {
		const sc = r.startContainer;

		return (
			Dom.isElement(sc) &&
			sc === r.endContainer &&
			Dom.isTag(
				sc.childNodes[r.startOffset],
				keys(this.j.o.popup, false) as any
			) &&
			r.startOffset === r.endOffset - 1
		);
	}

	/**
	 * Shortcut for Table module
	 */
	private get __tableModule(): Table {
		return this.j.getInstance<Table>('Table', this.j.o);
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e
			.off('showPopup')
			.off(
				[this.j.ew, this.j.ow],
				'mouseup keyup',
				this.__onSelectionEnd
			);

		this.__removeListenersForElements();
	}

	private __elmsList: string[] = keys(this.j.o.popup, false).filter(
		s => !this.__isExcludedTarget(s)
	);

	private __eventsList(): string {
		const el = this.__elmsList;
		return el
			.map(e => camelCase(`click_${e}`))
			.concat(el.map(e => camelCase(`touchstart_${e}`)))
			.join(' ');
	}

	private __addListenersForElements(): void {
		this.j.e.on(this.__eventsList(), this.__onClick);
	}

	private __removeListenersForElements(): void {
		this.j.e.off(this.__eventsList(), this.__onClick);
	}

	/**
	 * Show the inline WYSIWYG toolbar editor.
	 */
	@autobind
	private __showInlineToolbar(bound?: IBound): void {
		this.__showPopup(() => {
			if (bound) {
				return bound;
			}

			const { range } = this.j.s;

			return range.getBoundingClientRect();
		}, 'toolbar');
	}
}

pluginSystem.add('inlinePopup', inlinePopup);
