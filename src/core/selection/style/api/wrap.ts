/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { HTMLTagNames, ICommitStyle, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';

import { wrapList } from './list/wrap-list';
import { wrapUnwrappedText } from './wrap-unwrapped-text';

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

	if (commitStyle.elementIsList) {
		return wrapList(commitStyle, wrapper, jodit);
	}

	const newWrapper = Dom.replace(
		wrapper,
		commitStyle.element,
		jodit.createInside,
		true
	);

	if (commitStyle.elementIsBlock) {
		// Inline font styles left over from pasted content visually override
		// the new block format — e.g. an h2 with `font-weight: normal;
		// font-size: 24px` does not look like a heading at all, so the
		// command seems to do nothing. See
		// https://github.com/xdan/jodit/issues/1063
		css(newWrapper, 'fontSize', null);
		css(newWrapper, 'fontWeight', null);

		if (!attr(newWrapper, 'style')) {
			attr(newWrapper, 'style', null);
		}
	}

	return newWrapper;
}

const WRAP_NODES = new Set([
	'td',
	'th',
	'tr',
	'tbody',
	'table',
	'li',
	'ul',
	'ol'
] as HTMLTagNames[]);

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
			node => Dom.isBlock(node) && !Dom.isTag(node, WRAP_NODES),
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
