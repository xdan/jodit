/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { css, ctrlKey, dataBind, splitArray } from '../modules/helpers/';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';

declare module '../Config' {
	interface Config {
		draggableTags: string | string[];
	}
}

/**
 * Draggable elements
 */
Config.prototype.draggableTags = ['img', 'a', 'jodit-media', 'jodit'];

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
		} while (target && target !== this.jodit.editor);

		if (!last) {
			return;
		}

		this.startX = event.clientX;
		this.startY = event.clientY;

		this.isCopyMode = ctrlKey(event); // we can move only element from editor
		this.onDragEnd();

		this.draggable = last.cloneNode(true) as HTMLElement;
		dataBind(this.draggable, 'target', last);

		this.jodit.events.on(
			this.jodit.editor,
			'mousemove touchmove',
			this.onDrag
		);
	};

	private onDrag = this.jodit.async.throttle((event: DragEvent) => {
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
		this.jodit.events.fire('hidePopup hideResizer');

		if (!this.draggable.parentNode) {
			css(this.draggable, {
				'z-index': 100000000000000,
				'pointer-events': 'none',
				position: 'fixed',
				display: 'inline-block',
				left: event.clientX,
				top: event.clientY,
				width: this.draggable.offsetWidth,
				height: this.draggable.offsetHeight
			});

			this.jodit.ownerDocument.body.appendChild(this.draggable);
		}

		css(this.draggable, {
			left: event.clientX,
			top: event.clientY
		});

		this.jodit.selection.insertCursorAtPoint(event.clientX, event.clientY);
	}, this.jodit.defaultTimeout);

	private onDragEnd = () => {
		if (this.isInDestruct) {
			return;
		}

		if (this.draggable) {
			Dom.safeRemove(this.draggable);
			this.draggable = null;
			this.wasMoved = false;

			this.jodit.events.off(
				this.jodit.editor,
				'mousemove touchmove',
				this.onDrag
			);
		}
	};

	private onDrop = () => {
		if (!this.draggable || !this.wasMoved) {
			this.onDragEnd();
			return;
		}

		let fragment: HTMLElement = dataBind(this.draggable, 'target');

		this.onDragEnd();

		if (this.isCopyMode) {
			fragment = fragment.cloneNode(true) as HTMLElement;
		}

		this.jodit.selection.insertNode(fragment, true, false);

		if (Dom.isTag(fragment, 'img') && this.jodit.events) {
			this.jodit.events.fire('afterInsertImage', fragment);
		}

		this.jodit.events.fire('synchro');
	};

	protected afterInit() {
		this.dragList = this.jodit.options.draggableTags
			? splitArray(this.jodit.options.draggableTags)
					.filter(item => item)
					.map((item: string) => item.toLowerCase())
			: [];

		if (!this.dragList.length) {
			return;
		}

		this.jodit.events
			.on(
				this.jodit.editor,
				'mousedown touchstart dragstart',
				this.onDragStart
			)
			.on('mouseup touchend', this.onDrop)
			.on(
				[this.jodit.editorWindow, this.jodit.ownerWindow],
				'mouseup touchend',
				this.onDragEnd
			);
	}

	protected beforeDestruct() {
		this.onDragEnd();

		this.jodit.events
			.off(this.jodit.editor, 'mousemove touchmove', this.onDrag)
			.off(
				this.jodit.editor,
				'mousedown touchstart dragstart',
				this.onDragStart
			)
			.off('mouseup touchend', this.onDrop)
			.off(window, 'mouseup touchend', this.onDragEnd);
	}
}
