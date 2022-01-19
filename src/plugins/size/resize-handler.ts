/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/size
 */

import type { IJodit, IPointBound } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';
import { autobind } from 'jodit/core/decorators';
import { Icon } from 'jodit/core/ui';

@autobind
export class resizeHandler extends Plugin {
	/** @override **/
	static requires: string[] = ['size'];

	/** @override **/
	protected afterInit(editor: IJodit): void {
		const { height, width, allowResizeX } = editor.o;
		let { allowResizeY } = editor.o;

		if (height === 'auto' && width !== 'auto') {
			allowResizeY = false;
		}

		if (
			(height !== 'auto' || width !== 'auto') &&
			(allowResizeX || allowResizeY)
		) {
			editor.statusbar.setMod('resize-handle', true);

			editor.e
				.on('toggleFullSize.resizeHandler', () => {
					this.handle.style.display = editor.isFullSize
						? 'none'
						: 'block';
				})
				.on(
					this.handle,
					'mousedown touchstart',
					this.onHandleResizeStart
				)
				.on(editor.ow, 'mouseup touchend', this.onHandleResizeEnd);

			editor.container.appendChild(this.handle);
		}
	}

	/**
	 * Plugin in resize process
	 */
	private isResized: boolean = false;

	/**
	 * Start point
	 */
	private start: IPointBound = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};

	/**
	 * Handler: Click on handle - start resizing
	 */
	private onHandleResizeStart(e: MouseEvent) {
		this.isResized = true;

		this.start.x = e.clientX;
		this.start.y = e.clientY;
		this.start.w = this.j.container.offsetWidth;
		this.start.h = this.j.container.offsetHeight;

		this.j.lock();

		this.j.e.on(this.j.ow, 'mousemove touchmove', this.onHandleResize);

		e.preventDefault();
	}

	/**
	 * Handler: Mouse move after start resizing
	 */
	private onHandleResize(e: MouseEvent) {
		if (!this.isResized) {
			return;
		}

		if (this.j.o.allowResizeY) {
			this.j.e.fire('setHeight', this.start.h + e.clientY - this.start.y);
		}

		if (this.j.o.allowResizeX) {
			this.j.e.fire('setWidth', this.start.w + e.clientX - this.start.x);
		}

		this.j.e.fire('resize');
	}

	/**
	 * End of resizing
	 */
	private onHandleResizeEnd() {
		if (this.isResized) {
			this.isResized = false;

			this.j.e.off(this.j.ow, 'mousemove touchmove', this.onHandleResize);

			this.j.unlock();
		}
	}

	/**
	 * Resize handle
	 */
	private handle = this.j.c.div(
		'jodit-editor__resize',
		Icon.get('resize_handler')
	);

	/** @override **/
	protected beforeDestruct(): void {
		Dom.safeRemove(this.handle);

		this.j.e.off(this.j.ow, 'mouseup touchsend', this.onHandleResizeEnd);
	}
}
