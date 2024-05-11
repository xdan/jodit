/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/mobile
 */

import type {
	ButtonsOption,
	CanUndef,
	IControlType,
	IJodit,
	IToolbarCollection
} from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { splitArray } from 'jodit/core/helpers';
import { Config } from 'jodit/config';
import { ToolbarCollection } from 'jodit/modules/toolbar/collection/collection';
import { makeCollection } from 'jodit/modules/toolbar/factory';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Mobile timeout for CLICK emulation
		 */
		mobileTapTimeout: number;

		/**
		 * After resizing, the set of buttons will change to accommodate different sizes.
		 */
		toolbarAdaptive: boolean;

		/**
		 * The list of buttons that appear in the editor's toolbar for medium-sized spaces (≥ options.sizeMD).
		 */
		buttonsMD: ButtonsOption;

		/**
		 * The list of buttons that appear in the editor's toolbar for small-sized spaces (≥ options.sizeSM).
		 */
		buttonsSM: ButtonsOption;

		/**
		 * The list of buttons that appear in the editor's toolbar for extra-small spaces (less than options.sizeSM).
		 */
		buttonsXS: ButtonsOption;
	}
}

Config.prototype.mobileTapTimeout = 300;
Config.prototype.toolbarAdaptive = true;

Config.prototype.buttonsMD = [
	{
		group: 'font-style',
		buttons: []
	},
	{
		group: 'list',
		buttons: []
	},
	{
		group: 'font',
		buttons: []
	},
	'---',
	{
		group: 'media',
		buttons: []
	},
	'\n',
	{
		group: 'state',
		buttons: []
	},
	{
		group: 'insert',
		buttons: []
	},
	{
		group: 'indent',
		buttons: []
	},
	{
		group: 'color',
		buttons: []
	},
	'---',
	{
		group: 'history',
		buttons: []
	},
	{
		group: 'other',
		buttons: []
	},
	'|',
	'dots'
];

Config.prototype.buttonsSM = [
	{
		group: 'font-style',
		buttons: []
	},
	{
		group: 'list',
		buttons: []
	},
	'---',
	{
		group: 'font',
		buttons: []
	},
	'\n',
	{
		group: 'state',
		buttons: []
	},
	{
		group: 'indent',
		buttons: []
	},
	{
		group: 'color',
		buttons: []
	},
	'---',
	{
		group: 'history',
		buttons: []
	},
	'|',
	'dots'
];

Config.prototype.buttonsXS = [
	{
		group: 'font-style',
		buttons: []
	},
	{
		group: 'list',
		buttons: []
	},
	'---',
	{
		group: 'font',
		buttons: []
	},
	{
		group: 'color',
		buttons: []
	},
	'---',
	'dots'
];

Config.prototype.controls.dots = {
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
	popup: (editor: IJodit, current: false | Node, close, button) => {
		let store:
			| {
					toolbar: IToolbarCollection;
					rebuild: () => void;
			  }
			| undefined = button.control.data as any;

		if (store === undefined) {
			store = {
				toolbar: makeCollection(editor),
				rebuild: (): void => {
					if (button) {
						const buttons: CanUndef<Array<string | IControlType>> =
							editor.e.fire(
								'getDiffButtons.mobile',
								button.closest(ToolbarCollection)
							);

						if (buttons && store) {
							store.toolbar.build(splitArray(buttons));

							const w =
								editor.toolbar?.firstButton?.container
									.offsetWidth || 36;

							store.toolbar.container.style.width =
								(w + 4) * 3 + 'px';
						}
					}
				}
			};

			button.control.data = store;
		}

		store.rebuild();

		return store.toolbar;
	},
	tooltip: 'Show all'
} as IControlType;
