/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import type { ICreate } from '../../../../types';
import { Dom } from '../../../dom';

/**
 * Post process UL or OL element
 */
export function postProcessListElement(
	style: CommitStyle,
	wrapper: HTMLElement,
	ci: ICreate
): HTMLElement {
	// Add extra LI inside UL/OL
	if (
		/^(OL|UL)$/i.test(style.element) &&
		!Dom.isTag(wrapper.firstElementChild, 'li')
	) {
		const li = Dom.replace(wrapper, 'li', ci),
			ul = Dom.wrap(li, style.element, ci);

		if (ul) {
			return ul;
		}
	}

	return wrapper;
}
