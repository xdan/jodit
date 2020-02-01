/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { IControlType, IToolbarCollection } from '../types/toolbar';
import { splitArray } from '../modules/helpers/array';
import { JoditToolbarCollection } from '../modules/toolbar/joditToolbarCollection';
import { IJodit } from '../types';

declare module '../Config' {
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
				container: editor.create.div(),
				toolbar: JoditToolbarCollection.makeCollection(editor),
				rebuild: () => {
					if (button) {
						const buttons:
							| Array<string | IControlType>
							| undefined = editor.events.fire(
							'getDiffButtons.mobile',
							button.parentToolbar
						);

						if (buttons && store) {
							store.toolbar.build(
								splitArray(buttons),
								store.container
							);
						}
					}
				}
			};

			let w = 32;

			const size = editor.options.toolbarButtonSize;

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
		store: Array<string | IControlType> = splitArray(
			editor.options.buttons
		);

	editor.events
		.on('touchend', (e: TouchEvent) => {
			if (e.changedTouches && e.changedTouches.length) {
				now = new Date().getTime();
				if (now - timeout > editor.options.mobileTapTimeout) {
					timeout = now;
					editor.selection.insertCursorAtPoint(
						e.changedTouches[0].clientX,
						e.changedTouches[0].clientY
					);
				}
			}
		})
		.on('getDiffButtons.mobile', (toolbar: IToolbarCollection):
			| void
			| string[] => {
			if (toolbar === editor.toolbar) {
				return splitArray(editor.options.buttons).filter(
					(i: string | IControlType) => {
						return store.indexOf(i) < 0;
					}
				);
			}
		});

	if (editor.options.toolbarAdaptive) {
		editor.events
			.on(
				'resize afterInit recalcAdaptive changePlace afterAddPlace',
				() => {
					if (!editor.options.toolbar) {
						return;
					}

					const width: number = editor.container.offsetWidth;

					let newStore: Array<string | IControlType> = [];

					if (width >= editor.options.sizeLG) {
						newStore = splitArray(editor.options.buttons);
					} else if (width >= editor.options.sizeMD) {
						newStore = splitArray(editor.options.buttonsMD);
					} else if (width >= editor.options.sizeSM) {
						newStore = splitArray(editor.options.buttonsSM);
					} else {
						newStore = splitArray(editor.options.buttonsXS);
					}

					if (newStore.toString() !== store.toString()) {
						store = newStore;

						editor.toolbar.build(
							store.concat(editor.options.extraButtons),
							editor.toolbar.container.parentElement ||
								editor.toolbar.getParentContainer()
						);
					}
				}
			)
			.on(editor.ownerWindow, 'load', () =>
				editor.events.fire('recalcAdaptive')
			);
	}
}
