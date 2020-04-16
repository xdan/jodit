/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import * as consts from '../core/constants';
import { Buttons, IControlType, IToolbarCollection, IJodit } from '../types/';
import { camelCase, splitArray } from '../core/helpers/';
import { makeCollection } from '../modules/toolbar/factory';

declare module '../config' {
	interface Config {
		/**
		 * Mobile timeout for CLICK emulation
		 */
		mobileTapTimeout: number;
		toolbarAdaptive: boolean;
	}
}

Config.prototype.mobileTapTimeout = 300;

/**
 * After resize it will change buttons set for different sizes
 *
 * @type {boolean}
 */
Config.prototype.toolbarAdaptive = true;

Config.prototype.controls.dots = {
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
	popup: (
		editor,
		current: false | Node,
		control: IControlType,
		close,
		button
	) => {
		let store:
			| {
					container: HTMLDivElement;
					toolbar: IToolbarCollection;
					rebuild: () => void;
			  }
			| undefined = control.data as any;

		if (store === undefined) {
			store = {
				container: editor.c.div(),
				toolbar: makeCollection(editor),
				rebuild: () => {
					if (button) {
						const buttons:
							| Array<string | IControlType>
							| undefined = editor.e.fire(
							'getDiffButtons.mobile',
							button.parentElement
						);

						if (buttons && store) {
							store.toolbar
								.build(splitArray(buttons))
								.appendTo(store.container);
						}
					}
				}
			};

			let w = 32;

			const size = editor.o.toolbarButtonSize;

			if (size === 'large') {
				w = 36;
			} else if (size === 'small') {
				w = 24;
			}

			store.container.style.width = w * 3 + 'px';

			control.data = store;
		}

		store.rebuild();

		return store.container;
	},
	tooltip: 'Show all'
} as IControlType;

/**
 * Rebuild toolbar in depends of editor's width
 */
export function mobile(editor: IJodit) {
	let timeout: number = 0,
		now: number,
		store: Array<string | IControlType> = splitArray(editor.o.buttons);

	editor.e
		.on('touchend', (e: TouchEvent) => {
			if (e.changedTouches && e.changedTouches.length) {
				now = new Date().getTime();
				if (now - timeout > editor.o.mobileTapTimeout) {
					timeout = now;
					editor.selection.insertCursorAtPoint(
						e.changedTouches[0].clientX,
						e.changedTouches[0].clientY
					);
				}
			}
		})
		.on(
			'getDiffButtons.mobile',
			(toolbar: IToolbarCollection): void | Buttons => {
				if (toolbar === editor.toolbar) {
					return splitArray(editor.o.buttons).filter(i => {
						return store.indexOf(i) < 0;
					});
				}
			}
		);

	if (editor.o.toolbarAdaptive) {
		editor.e
			.on(
				'resize afterInit recalcAdaptive changePlace afterAddPlace',
				() => {
					if (!editor.o.toolbar) {
						return;
					}

					const width: number = editor.container.offsetWidth;

					let newStore: Array<string | IControlType> = [];

					if (width >= editor.o.sizeLG) {
						newStore = splitArray(editor.o.buttons);
					} else if (width >= editor.o.sizeMD) {
						newStore = splitArray(editor.o.buttonsMD);
					} else if (width >= editor.o.sizeSM) {
						newStore = splitArray(editor.o.buttonsSM);
					} else {
						newStore = splitArray(editor.o.buttonsXS);
					}

					if (newStore.toString() !== store.toString()) {
						store = newStore;
						const container =
							editor.toolbar.container.parentElement ||
							editor.toolbar.getParentContainer();

						if (container) {
							editor.e.fire(camelCase('close-all-popups'));

							editor.toolbar
								.build(store.concat(editor.o.extraButtons))
								.appendTo(container);
						}
					}
				}
			)
			.on(editor.ow, 'load', () => editor.e.fire('recalcAdaptive'));
	}
}
