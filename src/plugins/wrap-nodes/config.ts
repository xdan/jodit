/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/wrap-nodes
 */

import type { HTMLTagNames } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		wrapNodes: {
			exclude: HTMLTagNames[];
		};
	}
}

Config.prototype.wrapNodes = {
	exclude: ['hr', 'style', 'br']
};
