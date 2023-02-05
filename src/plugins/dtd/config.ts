/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/dtd
 */

import type { IDictionary } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		dtd: {
			/**
			 * Remove extra br element inside block element after pasting
			 */
			removeExtraBr: boolean;

			/**
			 * Check when inserting a block element if it can be inside another block element (according `blockLimits`)
			 */
			checkBlockNesting: boolean;

			/**
			 * List of elements that contain other blocks
			 */
			blockLimits: IDictionary<1>;
		};
	}
}

Config.prototype.dtd = {
	removeExtraBr: true,
	checkBlockNesting: true,
	blockLimits: {
		article: 1,
		aside: 1,
		audio: 1,
		body: 1,
		caption: 1,
		details: 1,
		dir: 1,
		div: 1,
		dl: 1,
		fieldset: 1,
		figcaption: 1,
		figure: 1,
		footer: 1,
		form: 1,
		header: 1,
		hgroup: 1,
		main: 1,
		menu: 1,
		nav: 1,
		ol: 1,
		section: 1,
		table: 1,
		td: 1,
		th: 1,
		tr: 1,
		ul: 1,
		video: 1
	}
};
