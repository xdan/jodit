/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	private __dragList: string[] = [];

	private __draggable: Nullable<HTMLElement> = null;
	private __isCopyMode: boolean = false;

	/**
	 * Shift in pixels after which we consider that the transfer of the element has begun
	 */
	private __diffStep = 10;

	private __startX = 0;
	private __startY = 0;

	private __state: DragState = DragState.IDLE;

	/** @override */
	protected afterInit(): void {
		this.__dragList = this.j.o.draggableTags
			? splitArray(this.j.o.draggableTags)
					.filter(Boolean)
					.map(item => item.toLowerCase())
			: [];

		if (!this.__dragList.length) {
			return;
		}

		this.j.e.on('mousedown dragstart', this.__onDragStart);
	}

	/**
	 * Drag start handler
	 */
	@autobind
	private __onDragStart(event: DragEvent): void | false {
		if (event.type === 'dragstart' && this.__draggable) {
			return false;
		}

		if (this.__state > DragState.IDLE) {
			return;
		}

		const target: Nullable<Node> = event.target as Nullable<Node>;

		if (!this.__dragList.length || !target) {
			return;
		}

		const matched = (node: Nullable<Node>): boolean =>
			Boolean(
				node && this.__dragList.includes(node.nodeName.toLowerCase())
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

		this.__startX = event.clientX;
		this.__startY = event.clientY;

		this.__isCopyMode = ctrlKey(event); // we can move only element from editor
		this.__draggable = lastTarget.cloneNode(true) as HTMLElement;
		dataBind(this.__draggable, 'target', lastTarget);

		this.__state = DragState.WAIT_DRAGGING;

		this.__addDragListeners();
	}

	/**
	 * Mouse move handler handler
	 */
	@throttle<IViewComponent>(ctx => ctx.defaultTimeout / 10)
	private __onDrag(event: DragEvent): void {
		if (!this.__draggable || this.__state === DragState.IDLE) {
			return;
		}

		const x = event.clientX,
			y = event.clientY;

		if (
			this.__state === DragState.WAIT_DRAGGING &&
			Math.sqrt(
				Math.pow(x - this.__startX, 2) + Math.pow(y - this.__startY, 2)
			) < this.__diffStep
		) {
			return;
		}

		if (this.__state === DragState.WAIT_DRAGGING) {
			this.j.lock('drag-and-drop-element');
			this.__state = DragState.DRAGGING;
		}

		this.j.e.fire('hidePopup hideResizer');

		if (!this.__draggable.parentNode) {
			const target = dataBind(this.__draggable, 'target');

			css(this.__draggable, {
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
				this.__draggable
			);
		}

		css(this.__draggable, {
			left: event.clientX,
			top: event.clientY
		});

		this.j.s.insertCursorAtPoint(event.clientX, event.clientY);
	}

	/**
	 * Mouseup handler in any place
	 */
	@autobind
	private __onDragEnd(): void {
		if (this.isInDestruct) {
			return;
		}

		this.__removeDragListeners();
		this.j.unlock();
		this.__state = DragState.IDLE;

		if (this.__draggable) {
			Dom.safeRemove(this.__draggable);
			this.__draggable = null;
		}
	}

	/**
	 * Mouseup handler inside editor
	 */
	@autobind
	private __onDrop(): void {
		if (!this.__draggable || this.__state < DragState.DRAGGING) {
			this.__onDragEnd();
			return;
		}

		let fragment = dataBind<HTMLElement>(this.__draggable, 'target');

		this.__onDragEnd();

		if (this.__isCopyMode) {
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
	private __addDragListeners(): void {
		this.j.e
			.on(this.j.editor, 'mousemove', this.__onDrag)
			.on('mouseup', this.__onDrop)
			.on([this.j.ew, this.ow], 'mouseup', this.__onDragEnd);
	}

	/**
	 * Remove global event listener after drag start
	 */
	private __removeDragListeners(): void {
		this.j.e
			.off(this.j.editor, 'mousemove', this.__onDrag)
			.off('mouseup', this.__onDrop)
			.off([this.j.ew, this.ow], 'mouseup', this.__onDragEnd);
	}

	/** @override */
	protected beforeDestruct(): void {
		this.__onDragEnd();

		this.j.e.off('mousedown dragstart', this.__onDragStart);

		this.__removeDragListeners();
	}
}

pluginSystem.add('dragAndDropElement', dragAndDropElement);
