/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, ICommitStyle } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { wrapUnwrappedText } from './wrap-unwrapped-text';
import { attr } from 'jodit/core/helpers/utils/utils';
import { wrapList } from './list/wrap-list';

/**
 * Replaces the parent tag with the applicable one, or wraps the text and also replaces the tag
 * @private
 */
export function wrap(
	commitStyle: ICommitStyle,
	font: HTMLElement,
	jodit: IJodit
): HTMLElement {
	const wrapper = findOrCreateWrapper(commitStyle, font, jodit);

	return commitStyle.elementIsList
		? wrapList(commitStyle, wrapper, jodit)
		: Dom.replace(wrapper, commitStyle.element, jodit.createInside, true);
}

/**
 * If we apply a block element, then it finds the closest block parent (exclude table cell etc.),
 * otherwise it wraps free text in an element.
 */
function findOrCreateWrapper(
	commitStyle: ICommitStyle,
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

		return wrapUnwrappedText(commitStyle, font, jodit);
	}

	attr(font, 'size', null);

	return font;
}
