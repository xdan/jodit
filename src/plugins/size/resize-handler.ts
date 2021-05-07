/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IPointBound } from '../../types';
import { Plugin } from '../../core/plugin';
import { Dom } from '../../core/dom';
import { autobind } from '../../core/decorators';

@autobind
export class resizeHandler extends Plugin {
	/** @override **/
	static requires: string[] = ['size'];

	/** @override **/
	protected afterInit(editor: IJodit) {
		const { height, width, allowResizeX } = editor.o;
		let { allowResizeY } = editor.o;

		if (height === 'auto' && width !== 'auto') {
			allowResizeY = false;
		}

		if (
			(height !== 'auto' || width !== 'auto') &&
			(allowResizeX || allowResizeY)
		) {
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
	 * @private
	 */
	private start: IPointBound = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};

	/**
	 * Handler: Click on handle - start resizing
	 * @param e
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
	 * @param e
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
		'<a tabindex="-1" href="javascript:void(0)"></a>'
	);

	/** @override **/
	protected beforeDestruct(editor: IJodit) {
		Dom.safeRemove(this.handle);

		this.j.e.off(this.j.ow, 'mouseup touchsend', this.onHandleResizeEnd);
	}
}
