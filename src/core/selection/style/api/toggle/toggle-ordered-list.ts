/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, CommitMode, Nullable } from '../../../../../types';
import type { CommitStyle } from '../../commit-style';
import { Dom } from '../../../../dom';
import { CHANGE, UNWRAP } from '../../commit-style';
import { toggleCSS } from './toggle-css';
import { extractSelectedPart } from '../extract';

export function checkAndToggleOrderedList(
	style: CommitStyle,
	font: HTMLElement,
	jodit: IJodit,
	mode: Nullable<CommitMode>
): Nullable<CommitMode> {
	const li = Dom.closest(font, 'li', jodit.editor);
	if (!li) {
		return mode;
	}

	const list = li.parentElement;
	if (!list) {
		return mode;
	}

	// ul => ol, ol => ul
	if (mode !== UNWRAP && list.tagName.toLowerCase() !== style.element) {
		Dom.replace(list, style.element, jodit.createInside);
		return CHANGE;
	}

	if (mode !== UNWRAP || mode == null) {
		mode = toggleCSS(style, list, jodit, mode);
	}

	if (mode === UNWRAP || mode == null) {
		extractSelectedPart(list, li, jodit.s.createRange);
		Dom.unwrap(li.parentElement);
		Dom.replace(li, jodit.o.enter, jodit.createInside);

		return UNWRAP;
	}

	return mode;
}
