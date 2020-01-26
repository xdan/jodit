/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { css } from '../modules/helpers/';
import { ToolbarIcon } from '../modules/toolbar/icon';
import { IControlType } from '../types/toolbar';
import { IJodit, IViewWithToolbar } from '../types';

/**
 * Fullsize plugin
 *
 * @module Fullsize
 */

/**
 * @property{boolean} fullsize=false true Editor toWYSIWYG open toWYSIWYG full screen
 * @property{boolean} globalFullsize=true if true, after `fullsize` -  all editors element
 * get jodit_fullsize_box class (z-index: 100000 !important;)
 * @example
 * ```javascript
 * var editor = new jodit({
 *     fullsize: true // fullsize editor
 * });
 * ```
 * @example
 * ```javascript
 * var editor = new Jodit();
 * editor.events.fire('toggleFullSize');
 * editor.events.fire('toggleFullSize', true); // fullsize
 * editor.events.fire('toggleFullSize', false); // usual mode
 * ```
 */

declare module '../Config' {
	interface Config {
		fullsize: boolean;
		globalFullsize: boolean;
	}
}

Config.prototype.fullsize = false;
Config.prototype.globalFullsize = true;
Config.prototype.controls.fullsize = {
	exec: (editor: IJodit) => {
		editor.toggleFullSize();
	},
	isActive: (editor: IJodit) => editor.isFullSize(),
	getLabel: (editor: IJodit, btn, button) => {
		const mode: string = editor.isFullSize() ? 'shrink' : 'fullsize';

		if (button) {
			button.textBox.innerHTML = !editor.options.textIcons
				? ToolbarIcon.getIcon(mode)
				: `<span>${editor.i18n(mode)}</span>`;
			(button.textBox.firstChild as HTMLElement).classList.add(
				'jodit_icon'
			);
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
export function fullsize(editor: IViewWithToolbar) {
	let shown: boolean = false,
		oldHeight: number = 0,
		oldWidth: number = 0,
		wasToggled = false;

	const resize = () => {
			if (editor.events) {
				if (shown) {
					oldHeight = css(editor.container, 'height') as number;
					oldWidth = css(editor.container, 'width') as number;
					css(editor.container, {
						height: editor.ownerWindow.innerHeight,
						width: editor.ownerWindow.innerWidth
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
				enable = !editor.container.classList.contains(
					'jodit_fullsize'
				);
			}

			editor.options.fullsize = enable;

			shown = enable;

			editor.container.classList.toggle('jodit_fullsize', enable);

			if (editor.toolbar) {
				if (!enable) {
					editor.toolbar.getParentContainer()?.appendChild(editor.toolbar.container);
				} else {
					editor.container.querySelector('.jodit_toolbar_container')
						?.appendChild(editor.toolbar.container);
				}

				css(editor.toolbar.container, 'width', 'auto');
			}

			if (editor.options.globalFullsize) {
				let node = editor.container.parentNode as HTMLElement;

				while (node && node.nodeType !== Node.DOCUMENT_NODE) {
					node.classList.toggle('jodit_fullsize_box', enable);
					node = node.parentNode as HTMLElement;
				}

				resize();
			}

			editor.events?.fire('afterResize');
		};

	if (editor.options.globalFullsize) {
		editor.events.on(editor.ownerWindow, 'resize', resize);
	}

	editor.events
		.on('afterInit afterOpen', () => {
			editor.toggleFullSize(editor?.options?.fullsize);
		})
		.on('toggleFullSize', toggle)
		.on('beforeDestruct beforeClose', () => {
			toggle(false);
		})
		.on('beforeDestruct', () => {
			editor.events &&
				editor.events.off(editor.ownerWindow, 'resize', resize);
		});
}
