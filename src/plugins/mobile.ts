/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IControlType,
	IToolbarCollection,
	IJodit,
	CanUndef,
	ButtonsGroups
} from '../types/';
import { Config } from '../config';
import * as consts from '../core/constants';
import { splitArray } from '../core/helpers/';
import { makeCollection } from '../modules/toolbar/factory';
import { UIList } from '../core/ui';
import { flatButtonsSet, isButtonGroup } from '../core/ui/helpers/buttons';

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
						const buttons: CanUndef<Array<string | IControlType>> =
							editor.e.fire(
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
		store: ButtonsGroups = splitArray(editor.o.buttons);

	if (editor.o.mobileTapTimeout) {
		editor.e.on('touchend', (e: TouchEvent) => {
			if (e.changedTouches && e.changedTouches.length) {
				const now = new Date().getTime(),
					diff = now - timeout;

				if (diff > editor.o.mobileTapTimeout) {
					timeout = now;

					if (diff < editor.o.mobileTapTimeout * 1.5) {
						editor.s.insertCursorAtPoint(
							e.changedTouches[0].clientX,
							e.changedTouches[0].clientY
						);
					}
				}
			}
		});
	}

	editor.e.on(
		'getDiffButtons.mobile',
		(toolbar: IToolbarCollection): void | ButtonsGroups => {
			if (toolbar === editor.toolbar) {
				const buttons: ButtonsGroups = splitArray(editor.o.buttons),
					flatStore = flatButtonsSet(store);

				return buttons.reduce((acc, item) => {
					if (isButtonGroup(item)) {
						acc.push({
							...item,
							buttons: item.buttons.filter(
								btn => !flatStore.has(btn)
							)
						});
					} else if (!flatStore.has(item)) {
						acc.push(item);
					}

					return acc;
				}, [] as ButtonsGroups);
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
