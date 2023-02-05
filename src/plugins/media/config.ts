/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/media
 */

import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Decorate media elements
		 */
		mediaInFakeBlock: boolean;

		/**
		 * Decorate media element with tag
		 */
		mediaFakeTag: string;

		/**
		 * Media tags
		 */
		mediaBlocks: string[];
	}
}

Config.prototype.mediaFakeTag = 'jodit-media';
Config.prototype.mediaInFakeBlock = true;
Config.prototype.mediaBlocks = ['video', 'audio'];
