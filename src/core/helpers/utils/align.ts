/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { ImageHAlign } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { attr } from 'jodit/core/helpers/utils/attr';
import { clearCenterAlign, css } from 'jodit/core/helpers/utils/css';

/**
 * Align image
 */
export function hAlignElement(image: HTMLElement, align: ImageHAlign): void {
	if (align && align !== 'normal') {
		if (align !== 'center') {
			css(image, 'float', align);
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
}

/**
 * Remove text-align style for all selected children
 */
export function clearAlign(node: Node): void {
	Dom.each(node, elm => {
		if (Dom.isHTMLElement(elm)) {
			if (css(elm, 'textAlign', true)) {
				css(elm, 'textAlign', '');

				if (!(attr(elm, 'style') || '').trim().length) {
					attr(elm, 'style', null);
				}
			}
		}
	});
}

/**
 * Apply align for element
 */
export function alignElement(command: string, box: HTMLElement): void {
	if (Dom.isNode(box) && Dom.isElement(box)) {
		clearAlign(box);

		const align = {
			justifyfull: 'justify',
			justifyright: 'right',
			justifyleft: 'left',
			justifycenter: 'center'
		}[command.toLowerCase()];

		if (align) {
			css(box, 'textAlign', align);
		}
	}
}
