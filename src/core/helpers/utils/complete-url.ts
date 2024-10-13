/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { globalWindow } from 'jodit/core/constants';

/**
 * @module helpers/utils
 */

export const completeUrl = (url: string): string => {
	if (globalWindow.location.protocol === 'file:' && /^\/\//.test(url)) {
		url = 'https:' + url;
	}

	return url;
};
