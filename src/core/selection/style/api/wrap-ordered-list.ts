/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from '../../../../types';
import { Dom } from '../../../dom';
import type { CommitStyle } from '../commit-style';

/**
 * Replaces non-leaf items with leaf items and either creates a new list or
 * adds a new item to the nearest old list
 */
export function wrapOrderedList(
	commitStyle: CommitStyle,
	wrapper: HTMLElement,
	jodit: IJodit
): HTMLElement {
	const newWrapper = Dom.replace(wrapper, 'li', jodit.createInside);

	let list =
		newWrapper.previousElementSibling || newWrapper.nextElementSibling;

	if (!Dom.isTag(list, ['ul', 'ol'])) {
		list = jodit.createInside.element(commitStyle.element);
		Dom.before(newWrapper, list);
	}

	if (newWrapper.previousElementSibling === list) {
		Dom.append(list, newWrapper);
	} else {
		Dom.prepend(list, newWrapper);
	}

	return <HTMLElement>list;
}
