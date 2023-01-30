/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/resize-handler/README.md]]
 * @packageDocumentation
 * @module plugins/resize-handler
 */

import type { IJodit, IPointBound } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';
import { autobind } from 'jodit/core/decorators';
import { Icon } from 'jodit/core/ui';
import { pluginSystem } from 'jodit/core/global';

import './config';

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
					this.__handle.style.display = editor.isFullSize
						? 'none'
						: 'block';
				})
				.on(
					this.__handle,
					'mousedown touchstart',
					this.__onHandleResizeStart
				)
				.on(editor.ow, 'mouseup touchend', this.__onHandleResizeEnd);

			editor.container.appendChild(this.__handle);
		}
	}

	/**
	 * Plugin in resize process
	 */
	private __isResized: boolean = false;

	/**
	 * Start point
	 */
	private __start: IPointBound = {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};

	/**
	 * Handler: Click on handle - start resizing
	 */
	private __onHandleResizeStart(e: MouseEvent): void {
		this.__isResized = true;

		this.__start.x = e.clientX;
		this.__start.y = e.clientY;
		this.__start.w = this.j.container.offsetWidth;
		this.__start.h = this.j.container.offsetHeight;

		this.j.lock();

		this.j.e.on(this.j.ow, 'mousemove touchmove', this.__onHandleResize);

		e.preventDefault();
	}

	/**
	 * Handler: Mouse move after start resizing
	 */
	private __onHandleResize(e: MouseEvent): void {
		if (!this.__isResized) {
			return;
		}

		if (this.j.o.allowResizeY) {
			this.j.e.fire(
				'setHeight',
				this.__start.h + e.clientY - this.__start.y
			);
		}

		if (this.j.o.allowResizeX) {
			this.j.e.fire(
				'setWidth',
				this.__start.w + e.clientX - this.__start.x
			);
		}

		this.j.e.fire('resize');
	}

	/**
	 * End of resizing
	 */
	private __onHandleResizeEnd(): void {
		if (this.__isResized) {
			this.__isResized = false;

			this.j.e.off(
				this.j.ow,
				'mousemove touchmove',
				this.__onHandleResize
			);

			this.j.unlock();
		}
	}

	/**
	 * Resize handle
	 */
	private __handle = this.j.c.div(
		'jodit-editor__resize',
		Icon.get('resize_handler')
	);

	/** @override **/
	protected beforeDestruct(): void {
		Dom.safeRemove(this.__handle);

		this.j.e.off(this.j.ow, 'mouseup touchsend', this.__onHandleResizeEnd);
	}
}

pluginSystem.add('resizeHandler', resizeHandler);
