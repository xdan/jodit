/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { clearCenterAlign, css } from '../../core/helpers';

/**
 * Align image
 *
 * @param image
 * @param value
 */
export const hAlignElement = (image: HTMLElement, value: string) => {
	if (value) {
		if (['right', 'left'].includes(value.toLowerCase())) {
			css(image, 'float', value);
			clearCenterAlign(image);
		} else {
			css(image, {
				float: '',
				display: 'block',
				marginLeft: 'auto',
				marginRight: 'auto'
			});
		}
	} else {
		if (
			css(image, 'float') &&
			['right', 'left'].indexOf(
				css(image, 'float').toString().toLowerCase()
			) !== -1
		) {
			css(image, 'float', '');
		}

		clearCenterAlign(image);
	}
};
