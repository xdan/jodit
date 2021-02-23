/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const completeUrl = (url: string): string => {
	if (window.location.protocol === 'file:' && /^\/\//.test(url)) {
		url = 'https:' + url;
	}

	return url;
};
