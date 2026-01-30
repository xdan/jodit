/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { LoaderContext } from 'webpack';

export default function (this: LoaderContext<unknown>, source: string): string {
	this.cacheable && this.cacheable(true);
	return source.replace(/--([a-z0-9_-]+)/g, (match, name) =>
		/^jd-/.test(name) ? match : `--jd-${name}`
	);
}

export const seperable = true;
