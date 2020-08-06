/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { TEXT_HTML, TEXT_PLAIN } from '../../core/constants';
import { Dom } from '../../core/dom';
import { attr, css, ctrlKey, dataBind } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { IPoint } from '../../types';
import { getDataTransfer } from './paste/helpers';
import { getContainer } from '../../core/global';

/**
 * Process drag and drop image from FileBrowser and movev image inside the editor
 */
export class DragAndDrop extends Plugin {
	private isFragmentFromEditor: boolean = false;
	private isCopyMode: boolean = false;

	private startDragPoint: IPoint = { x: 0, y: 0 };
	private draggable: HTMLElement | null = null;

	private bufferRange: Range | null = null;

	private onDragEnd = () => {
		if (this.draggable) {
			Dom.safeRemove(this.draggable);
			this.draggable = null;
		}

		this.isCopyMode = false;
	};

	private onDrag = (event: DragEvent) => {
		if (this.draggable) {
			if (!this.draggable.parentNode) {
				getContainer(this.j, DragAndDrop).appendChild(this.draggable);
			}

			this.j.e.fire('hidePopup');

			css(this.draggable, {
				left: event.clientX + 20,
				top: event.clientY + 20
			});

			this.j.s.insertCursorAtPoint(event.clientX, event.clientY);

			event.preventDefault();
			event.stopPropagation();
		}
	};

	private onDrop = (event: DragEvent): false | void => {
		if (
			!event.dataTransfer ||
			!event.dataTransfer.files ||
			!event.dataTransfer.files.length
		) {
			if (!this.isFragmentFromEditor && !this.draggable) {
				this.j.e.fire('paste', event);
				event.preventDefault();
				event.stopPropagation();
				return false;
			}

			const sel = this.j.s.sel;
			const range: Range | null =
				this.bufferRange ||
				(sel && sel.rangeCount ? sel.getRangeAt(0) : null);

			let fragment: DocumentFragment | HTMLElement | null = null;

			if (!this.draggable && range) {
				fragment = this.isCopyMode
					? range.cloneContents()
					: range.extractContents();
			} else if (this.draggable) {
				if (this.isCopyMode) {
					const [tagName, field] =
						attr(this.draggable, '-is-file') === '1'
							? ['a', 'href']
							: ['img', 'src'];

					fragment = this.j.createInside.element(tagName);

					fragment.setAttribute(
						field,
						attr(this.draggable, 'data-src') ||
							attr(this.draggable, 'src') ||
							''
					);
					if (tagName === 'a') {
						fragment.textContent = attr(fragment, field) || '';
					}
				} else {
					fragment = dataBind(this.draggable, 'target');
				}
			} else if (this.getText(event)) {
				fragment = this.j.createInside.fromHTML(
					this.getText(event) as string
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

		this.isFragmentFromEditor = false;
	};

	private onDragStart = (event: DragEvent) => {
		let target: HTMLElement = event.target as HTMLElement;
		this.onDragEnd(); // remove olddraggable

		this.isFragmentFromEditor = Dom.isOrContains(
			this.j.editor,
			target,
			true
		);
		this.isCopyMode = this.isFragmentFromEditor ? ctrlKey(event) : true; // we can move only element from editor

		if (this.isFragmentFromEditor) {
			const sel = this.j.s.sel;
			const range: Range | null =
				sel && sel.rangeCount ? sel.getRangeAt(0) : null;
			if (range) {
				this.bufferRange = range.cloneRange();
			}
		} else {
			this.bufferRange = null;
		}

		this.startDragPoint.x = event.clientX;
		this.startDragPoint.y = event.clientY;

		if (
			Dom.isElement(target) &&
			target.classList.contains('jodit-filebrowser__files-item')
		) {
			target = target.querySelector('img') as HTMLElement;
		}

		if (Dom.isTag(target, 'img')) {
			this.draggable = target.cloneNode(true) as HTMLElement;

			dataBind(this.draggable, 'target', target);

			css(this.draggable, {
				'z-index': 100000000000000,
				'pointer-events': 'none',
				position: 'fixed',
				display: 'inlin-block',
				left: this.startDragPoint.x,
				top: this.startDragPoint.y,
				width: target.offsetWidth,
				height: target.offsetHeight
			});
		}
	};

	private getText = (event: DragEvent): string | null => {
		const dt = getDataTransfer(event);
		return dt ? dt.getData(TEXT_HTML) || dt.getData(TEXT_PLAIN) : null;
	};

	afterInit(): void {
		this.j.e
			.off(window, '.DragAndDrop')
			.off('.DragAndDrop')
			.off(
				[window, this.j.ed, this.j.editor],
				'dragstart.DragAndDrop',
				this.onDragStart
			)
			.on(window, 'dragover.DragAndDrop', this.onDrag)
			.on(
				[window, this.j.ed, this.j.editor],
				'dragstart.DragAndDrop',
				this.onDragStart
			)
			.on('drop.DragAndDrop', this.onDrop)
			.on(
				window,
				'dragend.DragAndDrop drop.DragAndDrop mouseup.DragAndDrop',
				this.onDragEnd
			);
	}

	beforeDestruct(): void {
		this.onDragEnd();

		this.j.e
			.off(window, '.DragAndDrop')
			.off('.DragAndDrop')
			.off(
				[window, this.j.ed, this.j.editor],
				'dragstart.DragAndDrop',
				this.onDragStart
			);
	}
}
