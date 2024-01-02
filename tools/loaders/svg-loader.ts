/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { LoaderContext } from 'webpack';

export default function (
	this: LoaderContext<{}> & { value: string },
	content: string
): string {
	this.cacheable && this.cacheable();

	return (
		'module.exports = ' +
		JSON.stringify(
			content
				.replace(/[\n\t]+/g, ' ')
				.replace(/[\s]+/g, ' ')
				.trim()
		)
	);
}

export const seperable = true;
