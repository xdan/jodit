/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'jodit/core/dom';
import { wrapUnwrappedText } from './wrap-unwrapped-text';
import { attr } from 'jodit/core/helpers';
import { wrapOrderedList } from './wrap-ordered-list';

/**
 * Replaces the parent tag with the applicable one, or wraps the text and also replaces the tag
 * @private
 */
export function wrapAndCommitStyle(
	commitStyle: CommitStyle,
	font: HTMLElement,
	jodit: IJodit
): HTMLElement {
	const wrapper = findOrCreateWrapper(commitStyle, font, jodit);

	return commitStyle.elementIsList
		? wrapOrderedList(commitStyle, wrapper, jodit)
		: Dom.replace(wrapper, commitStyle.element, jodit.createInside, true);
}

/**
 * If we apply a block element, then it finds the closest block parent (exclude table cell etc.),
 * otherwise it wraps free text in an element.
 */
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
