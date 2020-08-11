/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { css, ctrlKey, dataBind, splitArray } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { Dom } from '../../core/dom';
import { getContainer } from '../../core/global';

/**
 * Process drag and drop image or another element inside the editor
 */
export class DragAndDropElement extends Plugin {
	private dragList: string[] = [];
	private isCopyMode: boolean = false;
	private draggable: HTMLElement | null = null;
	private wasMoved: boolean = false;

	private diffStep = 10;
	private startX = 0;
	private startY = 0;

	private onDragStart = (event: DragEvent) => {
		let target: Node | null = event.target as Node,
			last: HTMLElement | null = null;

		if (!this.dragList.length) {
			return;
		}

		do {
			if (this.dragList.includes(target.nodeName.toLowerCase())) {
				if (
					!last ||
					(target.firstChild === last && target.lastChild === last)
				) {
					last = target as HTMLElement;
				}
			}

			target = target.parentNode;
		} while (target && target !== this.j.editor);

		if (!last) {
			return;
		}

		this.startX = event.clientX;
		this.startY = event.clientY;

		this.isCopyMode = ctrlKey(event); // we can move only element from editor
		this.onDragEnd();

		this.draggable = last.cloneNode(true) as HTMLElement;
		dataBind(this.draggable, 'target', last);

		this.j.e.on(this.j.editor, 'mousemove touchmove', this.onDrag);
	};

	private onDrag = this.j.async.throttle((event: DragEvent) => {
		if (!this.draggable) {
			return;
		}

		const x = event.clientX,
			y = event.clientY;

		if (
			Math.sqrt(
				Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
			) < this.diffStep
		) {
			return;
		}

		this.wasMoved = true;
		this.j.e.fire('hidePopup hideResizer');

		if (!this.draggable.parentNode) {
			css(this.draggable, {
				zIndex: 10000000000000,
				pointerEvents: 'none',
				position: 'fixed',
				display: 'inline-block',
				left: event.clientX,
				top: event.clientY,
				width: this.draggable.offsetWidth,
				height: this.draggable.offsetHeight
			});

			getContainer(this.j, DragAndDropElement).appendChild(
				this.draggable
			);
		}

		css(this.draggable, {
			left: event.clientX,
			top: event.clientY
		});

		this.j.s.insertCursorAtPoint(event.clientX, event.clientY);
	}, this.j.defaultTimeout);

	private onDragEnd = () => {
		if (this.isInDestruct) {
			return;
		}

		if (this.draggable) {
			Dom.safeRemove(this.draggable);
			this.draggable = null;
			this.wasMoved = false;

			this.j.e.off(this.j.editor, 'mousemove touchmove', this.onDrag);
		}
	};

	private onDrop = () => {
		if (!this.draggable || !this.wasMoved) {
			this.onDragEnd();
			return;
		}

		let fragment = dataBind<HTMLElement>(this.draggable, 'target');

		this.onDragEnd();

		if (this.isCopyMode) {
			fragment = fragment.cloneNode(true) as HTMLElement;
		}

		const { parentElement } = fragment;

		this.j.s.insertNode(fragment, true, false);

		if (parentElement && Dom.isEmpty(parentElement)) {
			Dom.safeRemove(parentElement);
		}

		if (Dom.isTag(fragment, 'img') && this.j.e) {
			this.j.e.fire('afterInsertImage', fragment);
		}

		this.j.e.fire('synchro');
	};

	/** @override */
	protected afterInit(): void {
		this.dragList = this.j.o.draggableTags
			? splitArray(this.j.o.draggableTags)
					.filter(item => item)
					.map((item: string) => item.toLowerCase())
			: [];

		if (!this.dragList.length) {
			return;
		}

		this.j.e
			.on(
				this.j.editor,
				'mousedown touchstart dragstart',
				this.onDragStart
			)
			.on('mouseup touchend', this.onDrop)
			.on([this.j.ew, this.ow], 'mouseup touchend', this.onDragEnd);
	}

	/** @override */
	protected beforeDestruct(): void {
		this.onDragEnd();

		this.j.e
			.off(this.j.editor, 'mousemove touchmove', this.onDrag)
			.off(
				this.j.editor,
				'mousedown touchstart dragstart',
				this.onDragStart
			)
			.off('mouseup touchend', this.onDrop)
			.off(window, 'mouseup touchend', this.onDragEnd);
	}
}
