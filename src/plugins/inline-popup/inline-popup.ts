/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './inline-popup.less';
import './config/config';

import type {
	Buttons,
	HTMLTagNames,
	IBound,
	IJodit,
	IPopup,
	IToolbarCollection,
	IViewComponent,
	Nullable
} from '../../types';
import { Plugin } from '../../core/plugin';
import { makeCollection } from '../../modules/toolbar/factory';
import { Popup } from '../../core/ui/popup';
import {
	splitArray,
	isString,
	position,
	isArray,
	isFunction,
	toArray,
	keys,
	camelCase
} from '../../core/helpers';
import { Dom, Table, ToolbarCollection, UIElement } from '../../modules';
import { debounce, wait, autobind, watch } from '../../core/decorators';

/**
 * Plugin for show inline popup dialog
 */
export class inlinePopup extends Plugin {
	requires = ['select'];

	private type: Nullable<string> = null;

	private popup: IPopup = new Popup(this.jodit, false);

	private toolbar: IToolbarCollection = makeCollection(
		this.jodit,
		this.popup
	);

	@autobind
	private onClick(node: Node): void | false {
		const elements = this.elmsList as HTMLTagNames[],
			target = Dom.isTag(node, 'img')
				? node
				: Dom.closest(node, elements, this.j.editor);

		if (target && this.canShowPopupForType(target.nodeName.toLowerCase())) {
			this.showPopup(
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
	 * @param rect
	 * @param type - selection, img, a etc.
	 * @param target
	 */
	@wait((ctx: IViewComponent) => !ctx.j.isLocked)
	private showPopup(
		rect: () => IBound,
		type: string,
		target?: HTMLElement
	): boolean {
		type = type.toLowerCase();

		if (!this.canShowPopupForType(type)) {
			return false;
		}

		if (this.type !== type || target !== this.previousTarget) {
			this.previousTarget = target;

			const data = this.j.o.popup[type];

			let content;

			if (isFunction(data)) {
				content = data(this.j, target, this.popup.close);
			} else {
				content = data;
			}

			if (isArray(content)) {
				this.toolbar.build(content, target);
				this.toolbar.buttonSize = this.j.o.toolbarButtonSize;
				content = this.toolbar.container;
			}
			this.popup.setContent(content);

			this.type = type;
		}

		this.popup.open(rect);

		return true;
	}

	private previousTarget?: HTMLElement;

	/**
	 * Hide opened popup
	 */
	@watch(':clickEditor')
	@autobind
	private hidePopup(type?: string): void {
		if (!isString(type) || type === this.type) {
			this.popup.close();
		}
	}

	@watch(':outsideClick')
	protected onOutsideClick(e: MouseEvent): void {
		this.popup.close();
	}

	/**
	 * Can show popup for this type
	 * @param type
	 */
	private canShowPopupForType(type: string): boolean {
		const data = this.j.o.popup[type.toLowerCase()];

		if (this.j.o.readonly || !this.j.o.toolbarInline || !data) {
			return false;
		}

		return !this.isExcludedTarget(type);
	}

	/**
	 * For some elements do not show popup
	 * @param type
	 */
	private isExcludedTarget(type: string): boolean {
		return splitArray(this.j.o.toolbarInlineDisableFor)
			.map(a => a.toLowerCase())
			.includes(type.toLowerCase());
	}

	/** @override **/
	protected afterInit(jodit: IJodit): void {
		this.j.e
			.on(
				'getDiffButtons.mobile',
				(toolbar: ToolbarCollection): void | Buttons => {
					if (this.toolbar === toolbar) {
						const names = this.toolbar.getButtonsNames();

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
			.on('hidePopup', this.hidePopup)
			.on(
				'showPopup',
				(
					elm: HTMLElement | string,
					rect: () => IBound,
					type?: string
				) => {
					this.showPopup(
						rect,
						type || (isString(elm) ? elm : elm.nodeName),
						isString(elm) ? undefined : elm
					);
				}
			)
			.on('mousedown keydown', this.onSelectionStart)
			.on('change', () => {
				if (
					this.popup.isOpened &&
					this.previousTarget &&
					!this.previousTarget.parentNode
				) {
					this.hidePopup();
					this.previousTarget = undefined;
				}
			})
			.on([this.j.ew, this.j.ow], 'mouseup keyup', this.onSelectionEnd);

		this.addListenersForElements();
	}

	private snapRange: Nullable<Range> = null;

	@autobind
	private onSelectionStart() {
		this.snapRange = this.j.s.range.cloneRange();
	}

	@autobind
	private onSelectionEnd(e: MouseEvent) {
		if (
			e &&
			e.target &&
			UIElement.closestElement(e.target as Node, Popup)
		) {
			return;
		}

		const { snapRange } = this,
			{ range } = this.j.s;

		if (
			!snapRange ||
			range.collapsed ||
			range.startContainer !== snapRange.startContainer ||
			range.startOffset !== snapRange.startOffset ||
			range.endContainer !== snapRange.endContainer ||
			range.endOffset !== snapRange.endOffset
		) {
			this.onSelectionChange();
		}
	}

	/**
	 * Selection change handler
	 */
	@debounce(ctx => ctx.defaultTimeout)
	private onSelectionChange(): void {
		if (!this.j.o.toolbarInlineForSelection) {
			return;
		}

		const type = 'selection',
			sel = this.j.s.sel,
			range = this.j.s.range;

		if (
			sel?.isCollapsed ||
			this.isSelectedTarget(range) ||
			this.tableModule.getAllSelectedCells().length
		) {
			if (this.type === type && this.popup.isOpened) {
				this.hidePopup();
			}

			return;
		}

		const node = this.j.s.current();

		if (!node) {
			return;
		}

		this.showPopup(() => range.getBoundingClientRect(), type);
	}

	/**
	 * In not collapsed selection - only one image
	 * @param r
	 */
	private isSelectedTarget(r: Range): boolean {
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
	private get tableModule(): Table {
		return this.j.getInstance<Table>('Table', this.j.o);
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e
			.off('showPopup')
			.off([this.j.ew, this.j.ow], 'mouseup keyup', this.onSelectionEnd);

		this.removeListenersForElements();
	}

	private elmsList: string[] = keys(this.j.o.popup, false).filter(
		s => !this.isExcludedTarget(s)
	);

	private addListenersForElements() {
		this.j.e.on(
			this.elmsList.map(e => camelCase(`click_${e}`)).join(' '),
			this.onClick
		);
	}

	private removeListenersForElements() {
		this.j.e.off(
			this.elmsList.map(e => camelCase(`click_${e}`)).join(' '),
			this.onClick
		);
	}
}
