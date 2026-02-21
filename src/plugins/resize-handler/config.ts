/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/resize-handler
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Allow the user to resize the editor horizontally by dragging the resize handle
		 */
		allowResizeX: boolean;

		/**
		 * Allow the user to resize the editor vertically by dragging the resize handle
		 */
		allowResizeY: boolean;
	}
}

Config.prototype.allowResizeX = false;
Config.prototype.allowResizeY = true;
