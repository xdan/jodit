/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, CommitMode, Nullable } from '../../../../types';
import type { CommitStyle } from '../commit-style';
import { Dom } from '../../../dom';
import { wrapUnwrappedText } from './wrap-unwrapped-text';
import { attr } from '../../../helpers';
import { toggleCSS } from './toggle/toggle-css';
import { wrapOrderedList } from './wrap-ordered-list';

export function wrapAndCommitStyle(
	commitStyle: CommitStyle,
	font: HTMLElement,
	jodit: IJodit,
	mode: Nullable<CommitMode>
): Nullable<CommitMode> {
	const wrapper = findOrCreateWrapper(commitStyle, font, jodit);

	const newWrapper = commitStyle.elementIsList
		? wrapOrderedList(commitStyle, wrapper, jodit)
		: Dom.replace(wrapper, commitStyle.element, jodit.createInside, true);

	return toggleCSS(commitStyle, newWrapper, jodit, mode);
}

function findOrCreateWrapper(
	commitStyle: CommitStyle,
	font: HTMLElement,
	jodit: IJodit
): HTMLElement {
	if (commitStyle.elementIsBlock) {
		const box = Dom.up(
			font,
			node =>
				Dom.isBlock(node) &&
				!Dom.isTag(node, [
					'td',
					'th',
					'tr',
					'tbody',
					'table',
					'li',
					'ul',
					'ol'
				]),
			jodit.editor
		);

		if (box) {
			return box;
		}
	}

	if (commitStyle.elementIsBlock) {
		return wrapUnwrappedText(commitStyle, font, jodit, jodit.s.createRange);
	}

	attr(font, 'size', null);

	return font;
}
