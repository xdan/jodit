/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './fullsize.less';

import { Config } from '../../config';
import * as consts from '../../core/constants';
import { css, isJoditObject } from '../../core/helpers';
import { IViewWithToolbar, IControlType, IViewBased } from '../../types';

/**
 * Fullsize plugin
 *
 * @module Fullsize
 */

/**
 * @property{boolean} fullsize=false true Editor toWYSIWYG open toWYSIWYG full screen
 * @property{boolean} globalFullSize=true if true, after `fullsize` -  all editors element
 * get jodit_fullsize-box_true class (z-index: 100000 !important;)
 * @example
 * ```javascript
 * var editor = new jodit({
 *     fullsize: true // fullsize editor
 * });
 * ```
 * @example
 * ```javascript
 * var editor = new Jodit();
 * editor.e.fire('toggleFullSize');
 * editor.e.fire('toggleFullSize', true); // fullsize
 * editor.e.fire('toggleFullSize', false); // usual mode
 * ```
 */

declare module '../../config' {
	interface Config {
		fullsize: boolean;
		globalFullSize: boolean;
	}
}

Config.prototype.fullsize = false;
Config.prototype.globalFullSize = true;

Config.prototype.controls.fullsize = {
	exec: (editor: IViewBased) => {
		editor.toggleFullSize();
	},

	update(button) {
		const editor = button.j,
			mode = editor.isFullSize ? 'shrink' : 'fullsize';

		button.state.activated = editor.isFullSize;

		if (editor.o.textIcons) {
			button.state.text = mode;
		} else {
			button.state.icon.name = mode;
		}
	},

	tooltip: 'Open editor in fullsize',

	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
} as IControlType;

/**
 * Process `toggleFullSize` event, and behavior - set/unset fullsize mode
 *
 * @param {Jodit} editor
 */
export function fullsize(editor: IViewWithToolbar): void {
	let isEnabled: boolean = false,
		oldHeight: number = 0,
		oldWidth: number = 0,
		wasToggled = false;

	const resize = () => {
			if (editor.events) {
				if (isEnabled) {
					oldHeight = css(
						editor.container,
						'height',
						undefined,
						true
					) as number;
					oldWidth = css(
						editor.container,
						'width',
						undefined,
						true
					) as number;
					css(editor.container, {
						height: editor.ow.innerHeight,
						width: editor.ow.innerWidth
					});

					wasToggled = true;
				} else if (wasToggled) {
					css(editor.container, {
						height: oldHeight || 'auto',
						width: oldWidth || 'auto'
					});
				}
			}
		},
		/**
		 * Change editor's state between FullSize and normal
		 * @param enable
		 */
		toggle = (enable?: boolean) => {
			if (!editor.container) {
				return;
			}

			if (enable === undefined) {
				enable = !editor.container.classList.contains('jodit_fullsize');
			}

			editor.o.fullsize = enable;

			isEnabled = enable;

			editor.container.classList.toggle('jodit_fullsize', enable);

			if (editor.toolbar) {
				isJoditObject(editor) &&
					editor.toolbarContainer.appendChild(
						editor.toolbar.container
					);
				css(editor.toolbar.container, 'width', 'auto');
			}

			if (editor.o.globalFullSize) {
				let node = editor.container.parentNode as HTMLElement;

				while (node && node.nodeType !== Node.DOCUMENT_NODE) {
					node.classList.toggle('jodit_fullsize-box_true', enable);
					node = node.parentNode as HTMLElement;
				}

				resize();
			}

			editor.events?.fire('afterResize');
		};

	if (editor.o.globalFullSize) {
		editor.e.on(editor.ow, 'resize', resize);
	}

	editor.e
		.on('afterInit afterOpen', () => {
			editor.toggleFullSize(editor?.options?.fullsize);
		})
		.on('toggleFullSize', toggle)
		.on('beforeDestruct', () => {
			toggle(false);
		})
		.on('beforeDestruct', () => {
			editor.events && editor.e.off(editor.ow, 'resize', resize);
		});
}
