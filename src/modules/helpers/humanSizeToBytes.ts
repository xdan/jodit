/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Converts from human readable file size (kb,mb,gb,tb) to bytes
 *
 * @method humanSizeToBytes
 * @param {string|int} human readable file size. Example 1gb or 11.2mb
 * @return {int}
 */
export const humanSizeToBytes = (human: string): number => {
	if (/^[0-9.]+$/.test(human.toString())) {
		return parseFloat(human);
	}

	const format: string = human.substr(-2, 2).toUpperCase(),
		formats: string[] = ['KB', 'MB', 'GB', 'TB'],
		number: number = parseFloat(human.substr(0, human.length - 2));

	return formats.indexOf(format) !== -1
		? number * Math.pow(1024, formats.indexOf(format) + 1)
		: parseInt(human, 10);
};
