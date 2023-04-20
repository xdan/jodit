/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { type Variables } from '../variables';

export const fileName = ({
	argv,
	ES,
	isTest,
	excludeLangs,
	uglify
}: Variables): ((name: string) => string) => {
	if (typeof argv.filename === 'function') {
		return argv.filename;
	}

	return (name: string): string =>
		name +
		(ES === 'es5' || isTest ? '' : '.' + ES) +
		(excludeLangs ? '.en' : '') +
		(uglify ? '.min' : '');
};
