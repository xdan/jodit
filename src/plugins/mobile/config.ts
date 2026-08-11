/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
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
import { css } from 'jodit/core/helpers/utils/css';
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
		 *
		 * The set is constrained to `buttons`: resizing may only drop buttons on
		 * smaller widths, never surface a button that is not in `buttons`. So if
		 * you customise only `buttons` and leave this at its default, a narrow
		 * editor still shows just your `buttons`. Set this explicitly (as a subset
		 * of `buttons`) to get a different medium-width set.
		 */
		buttonsMD: ButtonsOption;

		/**
		 * The list of buttons that appear in the editor's toolbar for small-sized spaces (≥ options.sizeSM).
		 *
		 * Constrained to `buttons` — see {@link buttonsMD}.
		 */
		buttonsSM: ButtonsOption;

		/**
		 * The list of buttons that appear in the editor's toolbar for extra-small spaces (less than options.sizeSM).
		 *
		 * Constrained to `buttons` — see {@link buttonsMD}.
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

							css(store.toolbar.container, 'width', (w + 4) * 3);
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
