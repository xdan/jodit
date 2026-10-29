/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/tab
 */

import type { IJodit, Nullable } from 'jodit/types';
import { INVISIBLE_SPACE, NBSP_SPACE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { cssInline } from 'jodit/core/helpers/utils/css';

import { addBRInsideEmptyBlock } from 'jodit/plugins/backspace/helpers';
import { applyIndentToBox, getKey } from 'jodit/plugins/indent/helpers';

const KEEPS_TABS = new Set(['pre', 'pre-wrap', 'break-spaces']);
const KEEPS_TABS_TAGS = new Set([
	'pre',
	'textarea',
	'style',
	'script'
] as const);

/**
 * With `tab.spaces`, outside table cells: Tab at a caret inserts the spaces,
 * or a tab where white space is kept, as in `pre`, and in a list's first item
 * it indents the list, as Word does. Shift+Tab takes them out again. Tab or
 * Shift+Tab with a selection indents or outdents it. Neither moves the focus
 * on: Escape and then Tab does that
 * @private
 */
export function onTabSpaces(jodit: IJodit, shift: boolean): boolean {
	const { spaces } = jodit.o.tab;
	const current = jodit.s.current();

	if (!spaces || jodit.o.readonly || jodit.isLocked) {
		return false;
	}

	// The editor has the focus but no caret, so there's nowhere to put
	// anything, but the focus stays
	if (!current) {
		return true;
	}

	if (Dom.closest(current, Dom.isCell, jodit.editor)) {
		return false;
	}

	if (!jodit.s.isCollapsed()) {
		jodit.execCommand(shift ? 'outdent' : 'indent');
		return true;
	}

	const li = Dom.closest(current, 'li', jodit.editor);
	const list =
		li && !li.previousElementSibling && Dom.isList(li.parentElement)
			? li.parentElement
			: null;

	if (list && (!shift || isIndented(jodit, list))) {
		applyIndentToBox(new Set(), list, jodit, shift ? 'outdent' : 'indent');
		jodit.synchronizeValues();
		return true;
	}

	if (shift) {
		unindent(jodit, current, spaces);
		return true;
	}

	const element = Dom.isElement(current) ? current : current.parentElement;
	const keepsTabs =
		element &&
		KEEPS_TABS.has(jodit.ew.getComputedStyle(element).whiteSpace);

	jodit.s.insertNode(
		jodit.createInside.text(keepsTabs ? '\t' : NBSP_SPACE.repeat(spaces))
	);

	return true;
}

/**
 * Shift+Tab at a caret takes out a tab or up to `spaces` spaces just before
 * it, then a tab or up to `spaces` spaces at the start of its line, then the
 * indent of its block
 */
function unindent(jodit: IJodit, current: Node, spaces: number): void {
	const block = Dom.closest(current, Dom.isBlock, jodit.editor);
	const caret = jodit.createInside.fake();
	Dom.safeInsertNode(jodit.s.range, caret);

	let removed: boolean;

	try {
		removed =
			removeTabBefore(caret) ||
			removeTabSpaces(jodit, caret, true) ||
			removeLineIndent(jodit, block ?? jodit.editor, caret, spaces);

		if (removed) {
			addBRInsideEmptyBlock(jodit, caret);
		}
	} finally {
		jodit.s.setCursorBefore(caret);
		Dom.safeRemove(caret);
	}

	if (removed) {
		jodit.synchronizeValues();
	} else if (block && isIndented(jodit, block)) {
		jodit.execCommand('outdent');
	}
}

function removeTabBefore(caret: Node): boolean {
	const before = caret.previousSibling;

	if (Dom.isText(before) && before.data.endsWith('\t')) {
		before.deleteData(before.length - 1, 1);
		return true;
	}

	return false;
}

function removeLineIndent(
	jodit: IJodit,
	block: HTMLElement,
	caret: Node,
	spaces: number
): boolean {
	const { whiteSpace } = jodit.ew.getComputedStyle(block);
	const walker = jodit.ed.createTreeWalker(
		block,
		NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
		{
			acceptNode: node =>
				Dom.isBlock(node)
					? NodeFilter.FILTER_REJECT
					: NodeFilter.FILTER_ACCEPT
		}
	);

	const [start, offset] = lineStart(
		walker,
		caret,
		KEEPS_TABS.has(whiteSpace) || whiteSpace === 'pre-line'
	);

	return removeIndentAt(walker, start, offset, caret, spaces);
}

/**
 * Where the caret's line starts: after a `<br>`, after a newline where white
 * space keeps it, or at the caret
 */
function lineStart(
	walker: TreeWalker,
	caret: Node,
	keepsBreaks: boolean
): [Node, number] {
	let start: Nullable<Node> = null;
	let offset = 0;

	for (
		let node = walker.nextNode();
		node && node !== caret;
		node = walker.nextNode()
	) {
		const lineBreak =
			keepsBreaks && Dom.isText(node) ? node.data.lastIndexOf('\n') : -1;

		if (Dom.isTag(node, 'br')) {
			start = null;
		} else if (lineBreak >= 0) {
			start = node;
			offset = lineBreak + 1;
		} else if (Dom.isText(node) && !start) {
			start = node;
			offset = 0;
		}
	}

	return start ? [start, offset] : [caret, 0];
}

function removeIndentAt(
	walker: TreeWalker,
	start: Node,
	startOffset: number,
	caret: Node,
	spaces: number
): boolean {
	let removed = 0;
	let offset = startOffset;
	walker.currentNode = start;

	for (
		let node: Nullable<Node> = start;
		node && removed < spaces && !Dom.isTag(node, 'br');
		node = walker.nextNode()
	) {
		if (Dom.isText(node) && node !== caret) {
			const [end, count] = scanIndent(
				node.data,
				offset,
				spaces - removed,
				!removed
			);

			node.deleteData(offset, end - offset);
			removed += count;

			if (offset < node.length) {
				break;
			}
		}

		offset = 0;
	}

	return removed > 0;
}

/**
 * Where up to `count` spaces from `offset` end, and how many there were. A
 * tab at the start of a line is a whole indent
 */
function scanIndent(
	text: string,
	offset: number,
	count: number,
	atLineStart: boolean
): [number, number] {
	if (atLineStart && text[offset] === '\t') {
		return [offset + 1, count];
	}

	let end = offset;
	let found = 0;

	for (; end < text.length && found < count; end += 1) {
		const char = text[end];

		if (char !== ' ' && char !== NBSP_SPACE && char !== INVISIBLE_SPACE) {
			break;
		}

		if (char !== INVISIBLE_SPACE) {
			found += 1;
		}
	}

	return [end, found];
}

function isIndented(jodit: IJodit, box: HTMLElement): boolean {
	return (
		parseInt(cssInline(box, getKey(jodit.o.direction, box)) || '0', 10) > 0
	);
}

/**
 * With `tab.spaces`, Backspace just after that many spaces removes them
 * together, as it would a tab. With `upTo`, as for Shift+Tab, fewer will do,
 * if one of them is non-breaking, so a space between words stays
 * @private
 */
export function removeTabSpaces(
	jodit: IJodit,
	caret: Node,
	upTo: boolean = false
): boolean {
	const { spaces } = jodit.o.tab;

	if (!spaces) {
		return false;
	}

	const range = jodit.s.createRange();
	range.setEndBefore(caret);

	let count = 0;
	let nonBreaking = false;

	for (
		let node = caret.previousSibling;
		Dom.isText(node) && count < spaces;
		node = node.previousSibling
	) {
		let offset = node.length;

		for (; offset > 0 && count < spaces; offset -= 1) {
			const char = node.data[offset - 1];

			if (char === NBSP_SPACE) {
				nonBreaking = true;
			} else if (char !== ' ' && char !== INVISIBLE_SPACE) {
				break;
			}

			if (char !== INVISIBLE_SPACE) {
				count += 1;
			}
		}

		range.setStart(node, offset);

		if (offset && count < spaces) {
			break;
		}
	}

	if (upTo ? !nonBreaking : count < spaces) {
		return false;
	}

	range.deleteContents();

	// An emptied line keeps a <br>, as after any Backspace, or it has no
	// height to hold the caret
	addBRInsideEmptyBlock(jodit, caret);

	return true;
}

/**
 * With `tab.spaces`, a tab in pasted text becomes the spaces, as HTML would
 * show it as one space. Tabs in white space that's kept, and those that only
 * lay out the HTML, stay as they are
 * @private
 */
export function tabsToSpaces(jodit: IJodit, html: string): string | void {
	const { spaces } = jodit.o.tab;
	const current = jodit.s.current();
	const target = Dom.isElement(current) ? current : current?.parentElement;

	if (
		!spaces ||
		!html.includes('\t') ||
		(target && KEEPS_TABS.has(jodit.ew.getComputedStyle(target).whiteSpace))
	) {
		return;
	}

	// A template parses without loading images or running scripts
	const template = jodit.ed.createElement('template');
	template.innerHTML = html;

	const walker = jodit.ed.createTreeWalker(
		template.content,
		NodeFilter.SHOW_TEXT
	);

	let changed = false;

	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		const text = node.nodeValue ?? '';

		if (text.includes('\t') && text.trim() && !keepsTabs(node)) {
			node.nodeValue = text.replace(/\t/g, NBSP_SPACE.repeat(spaces));
			changed = true;
		}
	}

	return changed ? template.innerHTML : undefined;
}

/**
 * The fragment isn't rendered, so this reads the white space its own styles
 * and tags set. The text of `<style>` and `<script>` isn't shown at all
 */
function keepsTabs(node: Node): boolean {
	for (let el = node.parentElement; el; el = el.parentElement) {
		const { whiteSpace } = el.style;

		if (whiteSpace) {
			return KEEPS_TABS.has(whiteSpace);
		}

		if (Dom.isTag(el, KEEPS_TABS_TAGS)) {
			return true;
		}
	}

	return false;
}
