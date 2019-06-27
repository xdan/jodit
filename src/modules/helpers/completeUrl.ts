/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license;
 * For GPL see LICENSE.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const completeUrl = (url: string): string => {
	if (window.location.protocol === 'file:' && /^\/\//.test(url)) {
		url = 'https:' + url;
	}

	return url;
};
