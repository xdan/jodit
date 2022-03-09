/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/search
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Enable custom search plugin
		 * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
		 */
		useSearch: boolean;
		// searchByInput: boolean,
	}
}

Config.prototype.useSearch = true;

Config.prototype.controls.find = {
	tooltip: 'Find',
	icon: 'search',
	exec(jodit: IJodit, _, { control }) {
		const value = control.args && control.args[0];

		switch (value) {
			case 'findPrevious':
				jodit.e.fire('searchPrevious');
				break;

			case 'findNext':
				jodit.e.fire('searchNext');
				break;

			case 'replace':
				jodit.execCommand('openReplaceDialog');
				break;

			default:
				jodit.execCommand('openSearchDialog');
		}
	},

	list: {
		search: 'Find',
		findNext: 'Find Next',
		findPrevious: 'Find Previous',
		replace: 'Replace'
	},

	childTemplate: (_, k, v) => v
} as IControlType;
