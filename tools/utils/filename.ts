/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { type Variables } from '../variables';

export const fileName = ({
	argv,
	uglify,
	fat,
	serve
}: Variables): ((name: string) => string) => {
	if (typeof argv.filename === 'function') {
		return argv.filename;
	}

	return (name: string): string =>
		name + (fat && !serve ? '.fat' : '') + (uglify && !serve ? '.min' : '');
};
