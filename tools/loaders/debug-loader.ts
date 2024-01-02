/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { LoaderContext } from 'webpack';

/**
 * ```ts
 * {
 * 		loader: path.resolve(
 * 			superDirname,
 * 					'./tools/loaders/debug-loader.ts'
 * 			),
 * 			options: {
 * 					group: 'extra'
 * 			}
 * 	}
 * ```
 */
export default function (
	this: LoaderContext<{ group: string }>,
	source: string
): string {
	const { group } = this.getOptions();
	console.warn('Debug:', group, this.resourcePath);
	return source;
}
