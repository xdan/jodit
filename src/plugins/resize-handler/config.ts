/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/resize-handler
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		allowResizeX: boolean;
		allowResizeY: boolean;
	}
}

Config.prototype.allowResizeX = false;
Config.prototype.allowResizeY = true;
