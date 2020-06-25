/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import * as consts from '../core/constants';
import {
	Buttons,
	IControlType,
	IToolbarCollection,
	IJodit,
	CanUndef
} from '../types/';
import { splitArray } from '../core/helpers/';
import { makeCollection } from '../modules/toolbar/factory';
import { UIList } from '../core/ui';

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
		editor: IJodit,
		current: false | Node,
		control: IControlType,
		close,
		button
	) => {
		let store:
			| {
					toolbar: IToolbarCollection;
					rebuild: () => void;
			  }
			| undefined = control.data as any;

		if (store === undefined) {
			store = {
				toolbar: makeCollection(editor),
				rebuild: () => {
					if (button) {
						const buttons: CanUndef<Array<
							string | IControlType
						>> = editor.e.fire(
							'getDiffButtons.mobile',
							button.closest(UIList)
						);

						if (buttons && store) {
							store.toolbar.build(splitArray(buttons));

							const w =
								editor.toolbar.firstButton?.container
									.offsetWidth || 36;

							store.toolbar.container.style.width =
								(w + 4) * 3 + 'px';
						}
					}
				}
			};

			control.data = store;
		}

		store.rebuild();

		return store.toolbar;
	},
	tooltip: 'Show all'
} as IControlType;

/**
 * Rebuild toolbar in depends of editor's width
 */
export function mobile(editor: IJodit): void {
	let timeout: number = 0,
		store: Array<string | IControlType> = splitArray(editor.o.buttons);

	editor.e
		.on('touchend', (e: TouchEvent) => {
			if (e.changedTouches && e.changedTouches.length) {
				const now = new Date().getTime();

				if (now - timeout > editor.o.mobileTapTimeout) {
					timeout = now;
					editor.s.insertCursorAtPoint(
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
					return splitArray(editor.o.buttons).filter(
						i => !store.includes(i)
					);
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

					const width = editor.container.offsetWidth;

					const newStore = (() => {
						if (width >= editor.o.sizeLG) {
							return splitArray(editor.o.buttons);
						}

						if (width >= editor.o.sizeMD) {
							return splitArray(editor.o.buttonsMD);
						}

						if (width >= editor.o.sizeSM) {
							return splitArray(editor.o.buttonsSM);
						}

						return splitArray(editor.o.buttonsXS);
					})();

					if (newStore.toString() !== store.toString()) {
						store = newStore;

						editor.e.fire('closeAllPopups');

						editor.toolbar
							.setRemoveButtons(editor.o.removeButtons)
							.build(store.concat(editor.o.extraButtons));
					}
				}
			)
			.on(editor.ow, 'load', () => editor.e.fire('recalcAdaptive'));
	}
}
