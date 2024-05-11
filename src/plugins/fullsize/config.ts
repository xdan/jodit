/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/fullsize
 */

import type { IControlType, IViewBased } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import fullsizeIcon from './icons/fullsize.svg';
import shrinkIcon from './icons/shrink.svg';

import './fullsize.less';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Open WYSIWYG in full screen
		 * @example
		 * ```javascript
		 * var editor = Jodit.make({
		 *     fullsize: true // fullsize editor
		 * });
		 * ```
		 * @example
		 * ```javascript
		 * var editor = Jodit.make();
		 * editor.e.fire('toggleFullSize');
		 * editor.e.fire('toggleFullSize', true); // fullsize
		 * editor.e.fire('toggleFullSize', false); // usual mode
		 * ```
		 */
		fullsize: boolean;

		/**
		 * True, after `fullsize` -  all editors elements above jodit will get `jodit_fullsize-box_true` class (z-index: 100000 !important;)
		 */
		globalFullSize: boolean;
	}
}

Config.prototype.fullsize = false;
Config.prototype.globalFullSize = true;

Icon.set('fullsize', fullsizeIcon).set('shrink', shrinkIcon);

Config.prototype.controls.fullsize = {
	exec: (editor: IViewBased) => {
		editor.toggleFullSize();
	},

	update(editor, button) {
		const mode = editor.isFullSize ? 'shrink' : 'fullsize';

		button.state.activated = editor.isFullSize;

		if (editor.o.textIcons) {
			button.state.text = mode;
		} else {
			button.state.icon.name = mode;
		}
	},

	tooltip: 'Open in fullsize',

	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
} as IControlType;
