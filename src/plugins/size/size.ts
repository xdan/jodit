/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/size
 */

import './size.less';

import type { IJodit } from 'jodit/types';
import { css, isNumber } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { autobind } from 'jodit/core/decorators';

/**
 * Calculate sizes for editor workspace and handle setHeight and setWidth events
 */
@autobind
export class size extends Plugin {
	protected afterInit(editor: IJodit): void {
		editor.e
			.on('setHeight.size', this.setHeight)
			.on('setWidth.size', this.setWidth)
			.on(
				'afterInit.size changePlace.size',
				this.initialize,
				undefined,
				true
			)
			.on(editor.ow, 'load.size', this.resizeWorkspaces)
			.on(
				'afterInit.size resize.size afterUpdateToolbar.size ' +
					'scroll.size afterResize.size',
				this.resizeWorkspaces
			)
			.on(
				'toggleFullSize.size toggleToolbar.size',
				this.resizeWorkspaceImd
			);

		this.initialize();
	}

	/**
	 * Set editor size by options
	 */
	private initialize() {
		const { j } = this;

		if (j.o.inline) {
			return;
		}

		let { height } = j.o;

		if (j.o.saveHeightInStorage && height !== 'auto') {
			const localHeight = j.storage.get<string>('height');

			if (localHeight) {
				height = localHeight;
			}
		}

		css(j.editor, {
			minHeight: '100%'
		});

		css(j.container, {
			minHeight: j.o.minHeight,
			maxHeight: j.o.maxHeight,
			minWidth: j.o.minWidth,
			maxWidth: j.o.maxWidth
		});

		this.setHeight(height);
		this.setWidth(j.o.width);
	}

	/**
	 * Manually change height
	 */
	private setHeight(height: number | string) {
		if (isNumber(height)) {
			const { minHeight, maxHeight } = this.j.o;

			if (isNumber(minHeight) && minHeight > height) {
				height = minHeight;
			}

			if (isNumber(maxHeight) && maxHeight < height) {
				height = maxHeight;
			}
		}

		css(this.j.container, 'height', height);

		if (this.j.o.saveHeightInStorage) {
			this.j.storage.set('height', height);
		}

		this.resizeWorkspaceImd();
	}

	/**
	 * Manually change width
	 */
	private setWidth(width: number | string) {
		if (isNumber(width)) {
			const { minWidth, maxWidth } = this.j.o;

			if (isNumber(minWidth) && minWidth > width) {
				width = minWidth;
			}

			if (isNumber(maxWidth) && maxWidth < width) {
				width = maxWidth;
			}
		}

		css(this.j.container, 'width', width);

		this.resizeWorkspaceImd();
	}

	/**
	 * Returns service spaces: toolbar + statusbar
	 */
	private getNotWorkHeight(): number {
		return (
			(this.j.toolbarContainer?.offsetHeight || 0) +
			(this.j.statusbar?.getHeight() || 0) +
			2
		);
	}

	/**
	 * Calculate workspace height
	 */
	@autobind
	private resizeWorkspaceImd() {
		if (!this.j || this.j.isDestructed || !this.j.o || this.j.o.inline) {
			return;
		}

		if (!this.j.container || !this.j.container.parentNode) {
			return;
		}

		const minHeight =
			((css(this.j.container, 'minHeight') as number) || 0) -
			this.getNotWorkHeight();

		if (isNumber(minHeight) && minHeight > 0) {
			[this.j.workplace, this.j.iframe, this.j.editor].map(elm => {
				elm && css(elm, 'minHeight', minHeight);
			});

			this.j.e.fire('setMinHeight', minHeight);
		}

		if (isNumber(this.j.o.maxHeight)) {
			const maxHeight = this.j.o.maxHeight - this.getNotWorkHeight();

			[this.j.workplace, this.j.iframe, this.j.editor].map(elm => {
				elm && css(elm, 'maxHeight', maxHeight);
			});

			this.j.e.fire('setMaxHeight', maxHeight);
		}

		if (this.j.container) {
			css(
				this.j.workplace,
				'height',
				this.j.o.height !== 'auto' || this.j.isFullSize
					? this.j.container.offsetHeight - this.getNotWorkHeight()
					: 'auto'
			);
		}
	}

	/**
	 * Debounced wrapper for resizeWorkspaceImd
	 */
	private resizeWorkspaces = this.j.async.debounce(
		this.resizeWorkspaceImd,
		this.j.defaultTimeout,
		true
	);

	/** @override **/
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off(jodit.ow, 'load.size', this.resizeWorkspaces).off('.size');
	}
}
