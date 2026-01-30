/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import { globalDocument } from 'jodit/core/constants';

/**
 * Check if a string is an url
 */
export function isURL(str: string): boolean {
	if (str.includes(' ')) {
		return false;
	}

	if (typeof URL !== 'undefined') {
		try {
			const url = new URL(str);

			return ['https:', 'http:', 'ftp:', 'file:', 'rtmp:'].includes(
				url.protocol
			);
		} catch (e) {
			return false;
		}
	}

	const a = globalDocument.createElement('a');
	a.href = str;

	return Boolean(a.hostname);
}
