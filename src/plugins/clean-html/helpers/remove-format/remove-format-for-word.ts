/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit, Nullable } from 'jodit/types';
import { INSEPARABLE_TAGS, INVISIBLE_SPACE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

import { removeFormatForSelection } from './remove-format-for-selection';

/**
 * With just a caret, Word clears the formatting of the word the caret is
 * inside, and does nothing at a word's start or end. This selects the word,
 * clears it as a selection, and puts the caret back where it was.
 * @private
 */
export function removeFormatForWord(jodit: IJodit): void {
	const { range } = jodit.s;
	const block = Dom.closest(range.startContainer, Dom.isBlock, jodit.editor);

	if (!block) {
		return;
	}

	const texts = textsOf(block);
	const text = texts
		.map(node => (Dom.isText(node) ? node.nodeValue : ' '))
		.join('');
	const at = textOffset(texts, range);

	if (!isWordChar(text[at - 1]) || !isWordChar(text[at])) {
		return;
	}

	let start = at,
		end = at;

	while (isWordChar(text[start - 1])) {
		start -= 1;
	}

	while (isWordChar(text[end])) {
		end += 1;
	}

	const word = jodit.s.createRange();
	word.setStart(...positionAt(texts, start, true));
	word.setEnd(...positionAt(texts, end, false));
	jodit.s.selectRange(word);

	removeFormatForSelection(jodit);

	// The text is the same, so the caret goes back to the same character
	const caret = jodit.s.createRange();
	caret.setStart(...positionAt(textsOf(block), at, false));
	jodit.s.selectRange(caret);
}

function isWordChar(char: string | undefined): boolean {
	return Boolean(char && char !== INVISIBLE_SPACE && /\S/.test(char));
}

type Piece = Text | Element;

/**
 * The block's own text nodes, in order, leaving out those of blocks inside
 * it. A line break, an image or another inseparable element ends a word, so
 * it is kept as a one-character piece
 */
function textsOf(block: HTMLElement): Piece[] {
	const texts: Piece[] = [];

	Dom.each(block, node => {
		if (Dom.closest(node, Dom.isBlock, block)) {
			return;
		}

		if (Dom.isText(node) || Dom.isTag(node, INSEPARABLE_TAGS)) {
			texts.push(node);
		}
	});

	return texts;
}

function lengthOf(piece: Piece): number {
	return Dom.isText(piece) ? (piece.nodeValue?.length ?? 0) : 1;
}

/**
 * How many characters of `texts` come before the caret, which can be in a
 * text node or between nodes
 */
function textOffset(texts: Piece[], caret: Range): number {
	let at = 0;

	for (const piece of texts) {
		if (piece === caret.startContainer) {
			return at + caret.startOffset;
		}

		const length = lengthOf(piece);

		// This piece ends after the caret, so the caret is before it
		if (caret.comparePoint(piece, Dom.isText(piece) ? length : 0) > 0) {
			return at;
		}

		at += length;
	}

	return at;
}

/**
 * The text node and offset of the `at`th character. Where two text nodes
 * meet, `later` picks the start of the second over the end of the first
 */
function positionAt(
	texts: Piece[],
	at: number,
	later: boolean
): [Text, number] {
	let before = 0;
	let last: Nullable<Text> = null;

	for (const piece of texts) {
		const length = lengthOf(piece);

		if (
			Dom.isText(piece) &&
			(at < before + length || (!later && at === before + length))
		) {
			return [piece, at - before];
		}

		if (Dom.isText(piece)) {
			last = piece;
		}

		before += length;
	}

	return [last as Text, last?.nodeValue?.length ?? 0];
}
