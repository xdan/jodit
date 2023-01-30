/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/drag-and-drop/README.md]]
 * @packageDocumentation
 * @module plugins/drag-and-drop
 */

/**
 * TODO: need remove `drag-and-drop-element` plugin and use full custom moving inside this plugin.
 */

import type { IPoint, IViewComponent } from 'jodit/types';
import { TEXT_HTML, TEXT_PLAIN } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { attr, ctrlKey, dataBind, getDataTransfer } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { autobind, throttle } from 'jodit/core/decorators';
import { isFileBrowserFilesItem } from 'jodit/modules/file-browser';
import { pluginSystem } from 'jodit/core/global';

/**
 * Process drag and drop image from FileBrowser and movev image inside the editor
 */
export class dragAndDrop extends Plugin {
	private __isFragmentFromEditor: boolean = false;
	private __isCopyMode: boolean = false;

	private __startDragPoint: IPoint = { x: 0, y: 0 };
	private __draggable: HTMLElement | null = null;

	private __bufferRange: Range | null = null;

	/** @override */
	afterInit(): void {
		this.j.e.on(
			[window, this.j.ed, this.j.editor],
			'dragstart.DragAndDrop',
			this.__onDragStart
		);
	}

	@autobind
	private __onDragStart(event: DragEvent): void {
		let target: HTMLElement = event.target as HTMLElement;

		this.__onDragEnd(); // remove old draggable

		this.__isFragmentFromEditor = Dom.isOrContains(
			this.j.editor,
			target,
			true
		);

		this.__isCopyMode = this.__isFragmentFromEditor ? ctrlKey(event) : true; // we can move only element from editor

		if (this.__isFragmentFromEditor) {
			const sel = this.j.s.sel;
			const range: Range | null =
				sel && sel.rangeCount ? sel.getRangeAt(0) : null;

			if (range) {
				this.__bufferRange = range.cloneRange();
			}
		} else {
			this.__bufferRange = null;
		}

		this.__startDragPoint.x = event.clientX;
		this.__startDragPoint.y = event.clientY;

		if (isFileBrowserFilesItem(target)) {
			target = target.querySelector('img') as HTMLElement;
		}

		if (Dom.isTag(target, 'img')) {
			this.__draggable = target.cloneNode(true) as HTMLElement;
			dataBind(this.__draggable, 'target', target);
		}

		this.__addDragListeners();
	}

	private __addDragListeners(): void {
		this.j.e
			.on('dragover', this.__onDrag)
			.on('drop.DragAndDrop', this.__onDrop)
			.on(
				window,
				'dragend.DragAndDrop drop.DragAndDrop mouseup.DragAndDrop',
				this.__onDragEnd
			);
	}

	private __removeDragListeners(): void {
		this.j.e
			.off('dragover', this.__onDrag)
			.off('drop.DragAndDrop', this.__onDrop)
			.off(
				window,
				'dragend.DragAndDrop drop.DragAndDrop mouseup.DragAndDrop',
				this.__onDragEnd
			);
	}

	@throttle<IViewComponent>(ctx => ctx.defaultTimeout / 10)
	private __onDrag(event: DragEvent): void {
		if (this.__draggable) {
			this.j.e.fire('hidePopup');

			this.j.s.insertCursorAtPoint(event.clientX, event.clientY);

			event.preventDefault();
			event.stopPropagation();
		}
	}

	@autobind
	private __onDragEnd(): void {
		if (this.__draggable) {
			Dom.safeRemove(this.__draggable);
			this.__draggable = null;
		}

		this.__isCopyMode = false;
		this.__removeDragListeners();
	}

	@autobind
	private __onDrop(event: DragEvent): false | void {
		if (
			!event.dataTransfer ||
			!event.dataTransfer.files ||
			!event.dataTransfer.files.length
		) {
			if (!this.__isFragmentFromEditor && !this.__draggable) {
				this.j.e.fire('paste', event);
				event.preventDefault();
				event.stopPropagation();
				return false;
			}

			const sel = this.j.s.sel;
			const range: Range | null =
				this.__bufferRange ||
				(sel && sel.rangeCount ? sel.getRangeAt(0) : null);

			let fragment: DocumentFragment | HTMLElement | null = null;

			if (!this.__draggable && range) {
				fragment = this.__isCopyMode
					? range.cloneContents()
					: range.extractContents();
			} else if (this.__draggable) {
				if (this.__isCopyMode) {
					const [tagName, field] =
						attr(this.__draggable, '-is-file') === '1'
							? ['a', 'href']
							: ['img', 'src'];

					fragment = this.j.createInside.element(tagName);

					fragment.setAttribute(
						field,
						attr(this.__draggable, 'data-src') ||
							attr(this.__draggable, 'src') ||
							''
					);
					if (tagName === 'a') {
						fragment.textContent = attr(fragment, field) || '';
					}
				} else {
					fragment = dataBind(this.__draggable, 'target');
				}
			} else if (this.__getText(event)) {
				fragment = this.j.createInside.fromHTML(
					this.__getText(event) as string
				);
			}

			sel && sel.removeAllRanges();
			this.j.s.insertCursorAtPoint(event.clientX, event.clientY);

			if (fragment) {
				this.j.s.insertNode(fragment, false, false);

				if (range && fragment.firstChild && fragment.lastChild) {
					range.setStartBefore(fragment.firstChild);
					range.setEndAfter(fragment.lastChild);
					this.j.s.selectRange(range);
					this.j.e.fire('synchro');
				}

				if (Dom.isTag(fragment, 'img') && this.j.events) {
					this.j.e.fire('afterInsertImage', fragment);
				}
			}

			event.preventDefault();
			event.stopPropagation();
		}

		this.__isFragmentFromEditor = false;
		this.__removeDragListeners();
	}

	@autobind
	private __getText(event: DragEvent): string | null {
		const dt = getDataTransfer(event);
		return dt ? dt.getData(TEXT_HTML) || dt.getData(TEXT_PLAIN) : null;
	}

	/** @override */
	beforeDestruct(): void {
		this.__onDragEnd();

		this.j.e
			.off(window, '.DragAndDrop')
			.off('.DragAndDrop')
			.off(
				[window, this.j.ed, this.j.editor],
				'dragstart.DragAndDrop',
				this.__onDragStart
			);
	}
}

pluginSystem.add('dragAndDrop', dragAndDrop);
