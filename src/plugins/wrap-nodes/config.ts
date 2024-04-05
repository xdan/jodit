/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/wrap-nodes
 */

import type { HTMLTagNames } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		wrapNodes: {
			exclude: Set<HTMLTagNames>;

			/**
			 * If the editor is empty, then insert an empty paragraph into it
			 * @example
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 	wrapNodes: {
			 * 		emptyBlockAfterInit: true
			 * 	}
			 * });
			 * ```
			 */
			emptyBlockAfterInit: boolean;
		};
	}
}

Config.prototype.wrapNodes = {
	exclude: new Set(['hr', 'style', 'br']),
	emptyBlockAfterInit: true
};
