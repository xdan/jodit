/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IViewComponent, Nullable } from '../../types';
import { css, ctrlKey, dataBind, splitArray } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { Dom } from '../../core/dom';
import { getContainer } from '../../core/global';
import { autobind, throttle } from '../../core/decorators';

/**
 * Process drag and drop image or another element inside the editor
 */
export class DragAndDropElement extends Plugin {
	private dragList: string[] = [];

	private draggable: Nullable<HTMLElement> = null;
	private wasMoved: boolean = false;
	private isCopyMode: boolean = false;

	/**
	 * Shift in pixels after which we consider that the transfer of the element has begun
	 */
	private diffStep = 10;

	private startX = 0;
	private startY = 0;

	/** @override */
	protected afterInit(): void {
		this.dragList = this.j.o.draggableTags
			? splitArray(this.j.o.draggableTags)
					.filter(Boolean)
					.map(item => item.toLowerCase())
			: [];

		if (!this.dragList.length) {
			return;
		}

		this.j.e.on('mousedown touchstart dragstart', this.onDragStart);
	}

	/**
	 * Drag start handler
	 * @param event
	 */
	@autobind
	private onDragStart(event: DragEvent): void | false {
		if (event.type === 'dragstart' && this.draggable) {
			return false;
		}

		const target: Nullable<Node> = event.target as Nullable<Node>;

		if (!this.dragList.length || !target) {
			return;
		}

		const matched = (node: Nullable<Node>) =>
			node && this.dragList.includes(node.nodeName.toLowerCase());

		const lastTarget: Nullable<HTMLElement> =
			(Dom.furthest(target, matched, this.j.editor) as HTMLElement) ||
			(matched(target) ? target : null);

		if (!lastTarget) {
			return;
		}

		this.startX = event.clientX;
		this.startY = event.clientY;

		this.isCopyMode = ctrlKey(event); // we can move only element from editor
		this.onDragEnd();

		this.draggable = lastTarget.cloneNode(true) as HTMLElement;
		dataBind(this.draggable, 'target', lastTarget);

		this.addDragListeners();
	}

	/**
	 * Mouse move handler handler
	 * @param event
	 */
	@throttle<IViewComponent>(ctx => ctx.j.defaultTimeout / 10)
	private onDrag(event: DragEvent): void {
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
			const target = dataBind(this.draggable, 'target');

			css(this.draggable, {
				zIndex: 10000000000000,
				pointerEvents: 'none',
				pointer: 'drag',
				position: 'fixed',
				opacity: 0.7,
				display: 'inline-block',
				left: event.clientX,
				top: event.clientY,
				width: target?.offsetWidth ?? 100,
				height: target?.offsetHeight ?? 100
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
	}

	/**
	 * Mouseup handler in any place
	 */
	@autobind
	private onDragEnd(): void {
		if (this.isInDestruct) {
			return;
		}

		if (this.draggable) {
			Dom.safeRemove(this.draggable);

			this.draggable = null;
			this.wasMoved = false;

			this.removeDragListeners();
		}
	}

	/**
	 * Mouseup handler inside editor
	 */
	@autobind
	private onDrop(): void {
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
	}

	/**
	 * Add global event listener after drag start
	 */
	private addDragListeners(): void {
		this.j.e
			.on(this.j.editor, 'mousemove touchmove', this.onDrag)
			.on('mouseup touchend', this.onDrop)
			.on([this.j.ew, this.ow], 'mouseup touchend', this.onDragEnd);
	}

	/**
	 * Remove global event listener after drag start
	 */
	private removeDragListeners(): void {
		this.j.e
			.off(this.j.editor, 'mousemove touchmove', this.onDrag)
			.off('mouseup touchend', this.onDrop)
			.off([this.j.ew, this.ow], 'mouseup touchend', this.onDragEnd);
	}

	/** @override */
	protected beforeDestruct(): void {
		this.onDragEnd();

		this.j.e.off('mousedown touchstart dragstart', this.onDragStart);

		this.removeDragListeners();
	}
}
