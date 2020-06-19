/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './inline-popup.less';
import './config/config';

import autobind from 'autobind-decorator';
import { Plugin } from '../../core/plugin';
import {
	Buttons,
	HTMLTagNames,
	IBound,
	IJodit,
	IPopup,
	IToolbarCollection,
	IViewComponent,
	Nullable
} from '../../types';
import { makeCollection } from '../../modules/toolbar/factory';
import { Popup } from '../../core/ui/popup';
import { splitArray, isString, position } from '../../core/helpers';
import { Dom, ToolbarCollection } from '../../modules';
import { debounce, wait } from '../../core/decorators';

/**
 * Plugin for show inline popup dialog
 */
export class inlinePopup extends Plugin {
	private type: Nullable<string> = null;

	private popup: IPopup = new Popup(this.jodit);
	private toolbar: IToolbarCollection = makeCollection(
		this.jodit,
		this.popup
	);

	@autobind
	private onClick(e: MouseEvent): void {
		const node = e.target as Node,
			elements = Object.keys(this.j.o.popup) as HTMLTagNames[],
			target = Dom.isTag(node, 'img')
				? node
				: Dom.closest(node, elements, this.j.editor);

		if (target && this.canShowPopupForType(target.nodeName.toLowerCase())) {
			this.showPopup(
				() => position(target, this.j),
				target.nodeName.toLowerCase(),
				target
			);
		}
	}

	@debounce(ctx => ctx.defaultTimeout * 5)
	private onSelectionChange(): void {
		if (!this.j.o.toolbarInlineForSelection) {
			return;
		}

		const type = 'selection',
			sel = this.j.s.sel,
			range = this.j.s.range;

		if (sel?.isCollapsed) {
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

		if (this.type !== type) {
			const data = this.j.o.popup[type];

			this.toolbar.buttonSize = this.j.o.toolbarButtonSize;
			this.toolbar.build(data, target);
			this.popup.setContent(this.toolbar.container);

			this.type = type;
		}

		this.popup.open(rect);

		return true;
	}

	/**
	 * Hide opened popup
	 */
	@autobind
	private hidePopup(): void {
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

	protected afterInit(jodit: IJodit): void {
		this.j.e
			.on(
				'getDiffButtons.mobile',
				(toolbar: ToolbarCollection): void | Buttons => {
					if (this.toolbar === toolbar) {
						return splitArray(jodit.o.buttons).filter(item => {
							const name = isString(item) ? item : item.name;

							return (
								name &&
								name !== '|' &&
								name !== '\n' &&
								!this.toolbar.getButtonsNames().includes(name)
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
			.on('click', this.onClick)
			.on(this.j.ed, 'selectionchange', this.onSelectionChange);
	}

	protected beforeDestruct(jodit: IJodit): void {
		this.j.e
			.off('showPopup')
			.off('click', this.onClick)
			.off(this.j.ed, 'selectionchange', this.onSelectionChange);
	}
}
