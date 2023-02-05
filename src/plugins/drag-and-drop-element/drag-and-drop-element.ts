/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/drag-and-drop-element/README.md]]
 * @packageDocumentation
 * @module plugins/drag-and-drop-element
 */

import type { IViewComponent, Nullable } from 'jodit/types';
import { css, ctrlKey, dataBind, splitArray } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';
import { getContainer, pluginSystem } from 'jodit/core/global';
import { autobind, throttle } from 'jodit/core/decorators';

import './config';

enum DragState {
	IDLE = 0,
	WAIT_DRAGGING = 1,
	DRAGGING = 2
}

/**
 * Process drag and drop image or another element inside the editor
 */
export class dragAndDropElement extends Plugin {
	private dragList: string[] = [];

	private draggable: Nullable<HTMLElement> = null;
	private isCopyMode: boolean = false;

	/**
	 * Shift in pixels after which we consider that the transfer of the element has begun
	 */
	private diffStep = 10;

	private startX = 0;
	private startY = 0;

	private state: DragState = DragState.IDLE;

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

		this.j.e.on('mousedown dragstart', this.onDragStart);
	}

	/**
	 * Drag start handler
	 */
	@autobind
	private onDragStart(event: DragEvent): void | false {
		if (event.type === 'dragstart' && this.draggable) {
			return false;
		}

		if (this.state > DragState.IDLE) {
			return;
		}

		const target: Nullable<Node> = event.target as Nullable<Node>;

		if (!this.dragList.length || !target) {
			return;
		}

		const matched = (node: Nullable<Node>): boolean =>
			Boolean(
				node && this.dragList.includes(node.nodeName.toLowerCase())
			);

		let lastTarget: Nullable<HTMLElement> =
			(Dom.furthest(target, matched, this.j.editor) as HTMLElement) ||
			(matched(target) ? target : null);

		if (!lastTarget) {
			return;
		}

		if (
			Dom.isTag(lastTarget.parentElement, 'a') &&
			lastTarget.parentElement.firstChild === lastTarget &&
			lastTarget.parentElement.lastChild === lastTarget
		) {
			lastTarget = lastTarget.parentElement;
		}

		this.startX = event.clientX;
		this.startY = event.clientY;

		this.isCopyMode = ctrlKey(event); // we can move only element from editor
		this.draggable = lastTarget.cloneNode(true) as HTMLElement;
		dataBind(this.draggable, 'target', lastTarget);

		this.state = DragState.WAIT_DRAGGING;

		this.addDragListeners();
	}

	/**
	 * Mouse move handler handler
	 */
	@throttle<IViewComponent>(ctx => ctx.defaultTimeout / 10)
	private onDrag(event: DragEvent): void {
		if (!this.draggable || this.state === DragState.IDLE) {
			return;
		}

		const x = event.clientX,
			y = event.clientY;

		if (
			this.state === DragState.WAIT_DRAGGING &&
			Math.sqrt(
				Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
			) < this.diffStep
		) {
			return;
		}

		if (this.state === DragState.WAIT_DRAGGING) {
			this.j.lock('drag-and-drop-element');
			this.state = DragState.DRAGGING;
		}

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

			getContainer(this.j, dragAndDropElement).appendChild(
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

		this.removeDragListeners();
		this.j.unlock();
		this.state = DragState.IDLE;

		if (this.draggable) {
			Dom.safeRemove(this.draggable);
			this.draggable = null;
		}
	}

	/**
	 * Mouseup handler inside editor
	 */
	@autobind
	private onDrop(): void {
		if (!this.draggable || this.state < DragState.DRAGGING) {
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

		if (
			parentElement &&
			Dom.isEmpty(parentElement) &&
			!Dom.isTag(parentElement, ['td', 'th'])
		) {
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
			.on(this.j.editor, 'mousemove', this.onDrag)
			.on('mouseup', this.onDrop)
			.on([this.j.ew, this.ow], 'mouseup', this.onDragEnd);
	}

	/**
	 * Remove global event listener after drag start
	 */
	private removeDragListeners(): void {
		this.j.e
			.off(this.j.editor, 'mousemove', this.onDrag)
			.off('mouseup', this.onDrop)
			.off([this.j.ew, this.ow], 'mouseup', this.onDragEnd);
	}

	/** @override */
	protected beforeDestruct(): void {
		this.onDragEnd();

		this.j.e.off('mousedown dragstart', this.onDragStart);

		this.removeDragListeners();
	}
}

pluginSystem.add('dragAndDropElement', dragAndDropElement);
