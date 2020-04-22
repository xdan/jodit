/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import autobind from 'autobind-decorator';

import { Dom, Plugin, Popup, ToolbarCollection } from '../../modules';

import {
	isString,
	splitArray
} from '../../core/helpers';

import {
	Buttons,
	IJodit,
	IPopup,
	IToolbarCollection,
	IBound
} from '../../types';

import { makeCollection } from '../../modules/toolbar/factory';

/**
 * Support inline toolbar
 *
 * @param {Jodit} editor
 */
export class inlinePopup2 extends Plugin {
	private toolbar: IToolbarCollection = makeCollection(this.jodit);
	private popup: IPopup = new Popup(this.jodit);

	private isSelectionStarted = false;
	private isSelectionPopup: boolean = false;
	private isTargetAction: boolean = false;

	/**
	 * For some elements do not show popup
	 * @param type
	 */
	private isExcludedTarget(type: string): boolean {
		return (
			splitArray(this.j.o.toolbarInlineDisableFor)
				.map(a => a.toLowerCase())
				.indexOf(type.toLowerCase()) !== -1
		);
	}

	/**
	 * Can show popup for this type
	 * @param type
	 */
	private canShowPopupForType(type: string): boolean {
		const data = this.j.o.popup[type.toLowerCase()];

		if (!this.j.o.toolbarInline || !data) {
			return false;
		}

		if (this.isExcludedTarget(type)) {
			return false;
		}

		return true;
	}

	/**
	 * Show inline popup with some toolbar
	 *
	 * @param rect
	 * @param type - selection, img, a etc.
	 * @param elm
	 */
	@autobind
	private showPopupWithToolbar(
		rect: () => IBound,
		type: string,
		elm?: HTMLElement
	): boolean {
		if (!this.canShowPopupForType(type)) {
			return false;
		}

		const data = this.j.o.popup[type.toLowerCase()];

		this.isTargetAction = true;

		this.toolbar.buttonSize = this.j.o.toolbarInlineButtonSize;
		this.toolbar.build(data, elm);
		this.popup.setContent(this.toolbar.container).open(rect);

		return true;
	}

	@autobind
	private onSelectionStart(event: MouseEvent): void {
		if (this.isDestructed || !this.j.isEditorMode()) {
			return;
		}

		this.isTargetAction = false;
		this.isSelectionPopup = false;

		if (!this.isSelectionStarted) {
			const elements: string = Object.keys(this.j.o.popup).join('|'),
				target: HTMLElement | false = Dom.isTag(
					event.target as Node,
					'img'
				)
					? (event.target as HTMLImageElement)
					: (Dom.closest(
							event.target as Node,
							elements,
							this.j.editor
					  ) as HTMLTableElement);

			if (!target || !this.canShowPopupForType(target.nodeName)) {
				this.isSelectionStarted = true;
			}
		}
	}

	private onSelectionEnd = this.j.async.debounce(() => {
		if (this.isDestructed || !this.j.isEditorMode()) {
			return;
		}

		if (this.isSelectionStarted) {
			if (!this.isTargetAction) {
				this.onChangeSelection();
			}
		}

		this.isSelectionStarted = false;
		this.isTargetAction = false;
	}, this.j.defaultTimeout);

	private onChangeSelection = () => {
		if (!this.j.o.toolbarInline || !this.j.isEditorMode()) {
			return;
		}

		const sel = this.j.selection.sel;

		if (!sel || !sel.rangeCount) {
			return;
		}

		const range = sel.getRangeAt(0),
			calcRect = () => range.getBoundingClientRect();

		if (sel.isCollapsed) {
			const complete = this.j.e.fire('getPopup') as HTMLElement;
			if (complete !== undefined) {
				this.popup.setContent(complete).open(calcRect);
			}

			return;
		}

		if (this.j.o.popup.selection !== undefined) {
			this.isSelectionPopup = true;
			this.showPopupWithToolbar(calcRect, 'selection');
		}
	};

	afterInit(editor: IJodit) {
		editor.e
			.on(
				'getDiffButtons.mobile',
				(_toolbar: ToolbarCollection): void | Buttons => {
					if (this.toolbar === _toolbar) {
						return splitArray(editor.o.buttons).filter(item => {
							const name = isString(item) ? item : item.name;

							return (
								name &&
								name !== '|' &&
								name !== '\n' &&
								this.toolbar.getButtonsList().indexOf(name) < 0
							);
						});
					}
				}
			)
			.on('selectionchange', this.onChangeSelection)
			.on('afterCommand afterExec', () => {
				if (this.popup.isOpened && this.isSelectionPopup) {
					this.onChangeSelection();
				}
			})
			.on(
				'showPopup',
				(elm: HTMLElement | string, rect: () => IBound) => {
					const elementName: string = (isString(elm)
						? elm
						: elm.nodeName
					).toLowerCase();

					this.isSelectionPopup = false;

					this.showPopupWithToolbar(
						rect,
						elementName,
						isString(elm) ? undefined : elm
					);
				}
			);

		editor.e.on('afterInit changePlace', this.addGlobalListeners);

		this.addGlobalListeners();
	}

	@autobind
	private addGlobalListeners(): void {
		this.j.e
			.off('.inlinePopup')
			.on(
				'mousedown.inlinePopup keydown.inlinePopup touchstart.inlinePopup',
				this.onSelectionStart
			)
			.on(
				[this.j.ow],
				'mouseup.inlinePopup keyup.inlinePopup touchend.inlinePopup',
				this.onSelectionEnd
			);
	}

	beforeDestruct(editor: IJodit) {
		this.popup && this.popup.destruct();
		delete this.popup;
		this.toolbar && this.toolbar.destruct();
		delete this.toolbar;

		editor.events &&
			editor.e
				.off('.inlinePopup')
				.off(
					[editor.ow],
					'mouseup.inlinePopup keyup.inlinePopup touchend.inlinePopup',
					this.onSelectionEnd
				);
	}
}
