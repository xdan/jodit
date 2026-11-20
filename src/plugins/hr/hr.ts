/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/hr/README.md]]
 * @packageDocumentation
 * @module plugins/hr
 */

import type { IControlType, IJodit, Nullable } from 'jodit/types';
import {
	BR,
	KEY_BACKSPACE,
	KEY_DELETE,
	KEY_DOWN,
	KEY_ENTER,
	KEY_LEFT,
	KEY_RIGHT,
	KEY_UP
} from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import { getContainer, pluginSystem } from 'jodit/core/global';
import { cssPath, position, toArray } from 'jodit/core/helpers';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import hrIcon from './hr.svg';

Icon.set('hr', hrIcon);

Config.prototype.controls.hr = {
	command: 'insertHorizontalRule',
	tooltip: 'Insert Horizontal Line'
} as IControlType;

export function hr(editor: IJodit): void {
	editor.registerButton({
		name: 'hr',
		group: 'insert'
	});

	editor.registerCommand('insertHorizontalRule', () => {
		const elm = editor.createInside.element('hr');
		editor.s.insertNode(elm, false, false);

		const block = Dom.closest(
			elm.parentElement,
			Dom.isBlock,
			editor.editor
		);

		// A block that holds other blocks, such as a list item or a table
		// cell, keeps the line
		if (
			block &&
			Dom.isEmpty(block) &&
			block !== editor.editor &&
			!editor.o.dtd?.blockLimits[block.nodeName.toLowerCase()]
		) {
			Dom.after(block, elm);
			Dom.safeRemove(block);
		}

		const next = Dom.findNotEmptySibling(elm, false);

		if (Dom.isBlock(next)) {
			editor.s.setCursorIn(next, true);
			return false;
		}

		// In a list item or a table cell the text goes on after the line, as
		// it does with the browsers' own command
		if (
			next ||
			(elm.parentNode !== editor.editor &&
				!Dom.isBlock(Dom.findNotEmptySibling(elm, true)))
		) {
			editor.s.setCursorAfter(elm);
			return false;
		}

		const p = editor.createInside.element(editor.o.enter);

		// As Enter's new line has, so it keeps its height without clean-html's
		// fillEmptyParagraph (#1807)
		if (!Dom.isTag(p, 'br')) {
			Dom.append(p, editor.createInside.element('br'));
		}

		Dom.after(elm, p);
		editor.s.setCursorIn(p);

		return false;
	});

	// A horizontal line is selected whole, as an image is: by a click on it,
	// or by an arrow key that comes to it (#1802)

	const nearest = (
		node: Nullable<Node>,
		forward: boolean
	): Nullable<Node> => {
		while (node && Dom.isEmptyTextNode(node)) {
			node = forward ? node.nextSibling : node.previousSibling;
		}

		return node;
	};

	const beside = (node: Node, forward: boolean): Nullable<Node> =>
		nearest(forward ? node.nextSibling : node.previousSibling, forward);

	// A line between blocks, where the caret beside it isn't in a line of
	// text, as it is in a list item or a table cell (#1606)
	const isLoose = (node: Nullable<Node>): node is HTMLHRElement =>
		Dom.isTag(node, 'hr') &&
		node.parentNode === editor.editor &&
		editor.o.enter.toLowerCase() !== BR;

	// The line a range holds, and nothing else
	const lineIn = (range: Range): Nullable<HTMLHRElement> => {
		const { startContainer: box, startOffset } = range;
		const node = box.childNodes[startOffset];

		return box === range.endContainer &&
			range.endOffset === startOffset + 1 &&
			Dom.isTag(node, 'hr') &&
			editor.editor.contains(node)
			? node
			: null;
	};

	// The browsers don't draw a selection round a line, so a rule in the
	// editor's document frames it, as the table module marks cells
	let framed: Nullable<HTMLHRElement> = null;

	const frame = (line: Nullable<HTMLHRElement>): void => {
		if (line === framed) {
			return;
		}

		framed = line;

		const path = line && cssPath(line);

		getContainer(editor, 'hr', 'style', true).innerHTML = path
			? `${path}{outline:3px solid var(--jd-resizer-border-color,#98c1f1);outline-offset:3px}`
			: '';
	};

	const editable = (): boolean => !editor.o.readonly && !editor.isLocked;

	const plain = (e: KeyboardEvent): boolean =>
		!e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey;

	const newLine = (node: Node, after: boolean): void => {
		const p = editor.createInside.element(editor.o.enter);
		const br = editor.createInside.element('br');

		p.appendChild(br);
		after ? Dom.after(node, p) : Dom.before(node, p);
		editor.s.setCursorBefore(br);
	};

	// On from a line the way an arrow key goes: to the next line in a row,
	// which is selected in turn, or into the text beyond, or into a new
	// paragraph at the start or end of the content
	const pass = (line: HTMLHRElement, forward: boolean): void => {
		const next = beside(line, forward);

		if (Dom.isTag(next, 'hr')) {
			editor.s.select(next);
		} else if (next) {
			editor.s.setCursorIn(next, forward);
		} else {
			newLine(line, forward);
		}
	};

	// Only the line goes, without joining the lines either side. Backspace
	// leaves the caret at the end of the line before, Delete at the start of
	// the line after, or the other side at the start or end of the content
	const remove = (line: HTMLHRElement, forward: boolean): void => {
		const before = beside(line, false);
		const after = beside(line, true);
		const next = forward ? (after ?? before) : (before ?? after);

		if (!next) {
			newLine(line, true);
		}

		editor.s.removeNode(line);

		if (Dom.isTag(next, 'hr')) {
			editor.s.select(next);
		} else if (next) {
			editor.s.setCursorIn(next, next === after);
		}
	};

	// The nodes either side of a caret left beside a line in the editor
	// itself, outside any line of text, as a click beside the line, Jodit's
	// own delete or a paste leaves it
	const around = (
		range: Range
	): Nullable<[Nullable<Node>, Nullable<Node>]> => {
		const { startContainer: box, startOffset } = range;

		if (!range.collapsed || box !== editor.editor) {
			return null;
		}

		const before = nearest(box.childNodes[startOffset - 1] ?? null, false);
		const after = nearest(box.childNodes[startOffset] ?? null, true);

		return isLoose(before) || isLoose(after) ? [before, after] : null;
	};

	// After a click beside a line, off it, the caret goes to the nearest line
	// of text: the one above for a click above the line, the one below for a
	// click below
	const leave = (): void => {
		const sides = around(editor.s.range);

		if (!sides || !editable()) {
			return;
		}

		const [before, after] = sides;
		const forward = !isLoose(after);
		let edge = forward ? before : after;
		let next = forward ? after : before;

		while (isLoose(next)) {
			edge = next;
			next = beside(next, forward);
		}

		if (next) {
			editor.s.setCursorIn(next, forward);
		} else if (edge) {
			newLine(edge, forward);
			editor.synchronizeValues();
		}
	};

	// The browsers stop the caret beside a line, so an arrow key that takes
	// the caret out of a block towards a line selects the line instead
	const arriveAt = (from: Range, forward: boolean): void => {
		const top = Dom.up(
			from.startContainer,
			node => node?.parentNode === editor.editor,
			editor.editor
		);
		const next = top && beside(top, forward);

		if (!top || !isLoose(next)) {
			return;
		}

		// Once the browser has moved the caret
		editor.async.setTimeout(() => {
			const { range } = editor.s;

			if (
				range.collapsed &&
				!top.contains(range.startContainer) &&
				editor.editor.contains(next)
			) {
				editor.s.select(next);
			}
		}, 1);
	};

	// Delete or Backspace in an empty block next to a line removes the block
	// and selects the line, as it was before Enter on it. Jodit's own delete
	// would leave the caret beside the line
	const deleteEmpty = (range: Range, forward: boolean): boolean => {
		const block = Dom.closest(
			range.startContainer,
			Dom.isBlock,
			editor.editor
		);
		const next = block && beside(block, forward);

		if (
			!block ||
			block.parentNode !== editor.editor ||
			!isLoose(next) ||
			!Dom.isEmpty(block)
		) {
			return false;
		}

		Dom.safeRemove(block);
		editor.s.select(next);
		return true;
	};

	// A key with the caret in a line of text, or beside a line: an arrow
	// key, Delete or Backspace that goes to a line selects it
	const atCaret = (e: KeyboardEvent, range: Range): boolean => {
		const deleting = e.key === KEY_BACKSPACE || e.key === KEY_DELETE;
		const forward =
			e.key === KEY_DOWN || e.key === KEY_RIGHT || e.key === KEY_DELETE;
		const arrow = forward
			? e.key !== KEY_DELETE
			: e.key === KEY_UP || e.key === KEY_LEFT;

		if (!range.collapsed || !plain(e) || !(arrow || deleting)) {
			return false;
		}

		const sides = around(range);

		if (!sides) {
			if (arrow) {
				arriveAt(range, forward);
				return false;
			}

			return deleteEmpty(range, forward);
		}

		const [before, after] = sides;
		const next = forward ? after : before;

		if (isLoose(next)) {
			editor.s.select(next);
		} else if (deleting) {
			return false;
		} else if (next) {
			editor.s.setCursorIn(next, forward);
		} else {
			newLine((forward ? before : after) as Node, forward);
		}

		return true;
	};

	// A key with a line selected
	const onLine = (e: KeyboardEvent, line: HTMLHRElement): boolean => {
		const back = e.key === KEY_UP || e.key === KEY_LEFT;

		if (plain(e) && (back || e.key === KEY_DOWN || e.key === KEY_RIGHT)) {
			pass(line, !back);
		} else if (e.key === KEY_BACKSPACE || e.key === KEY_DELETE) {
			remove(line, e.key === KEY_DELETE);
		} else {
			// Typing starts a new paragraph after the line, and the browser
			// types the letter into it
			if (e.key?.length === 1 && !e.ctrlKey && !e.metaKey) {
				newLine(line, true);
			}

			return false;
		}

		return true;
	};

	// Enter with a line selected adds a paragraph after the line, and
	// Shift+Enter one before it, between the Enter plugin's own events. The
	// plugin itself would delete the line
	const enter = (e: KeyboardEvent, line: HTMLHRElement): void | false => {
		const result = editor.e.fire('beforeEnter', e);

		if (result !== undefined) {
			return result;
		}

		editor.history.snapshot.transaction(() => {
			newLine(line, !e.shiftKey);
			editor.e.fire('afterEnter', e);
		});

		editor.synchronizeValues();
		return false;
	};

	// How far above or below a line a click still selects it
	const slack = 6;

	// The press that selected a line, for its click to open the popup
	let pressed: Nullable<HTMLHRElement> = null;

	editor.e
		.on('afterInit', (): void => {
			editor.e.on(editor.ed, 'selectionchange', (): void => {
				const { sel } = editor.s;
				frame(sel?.rangeCount ? lineIn(sel.getRangeAt(0)) : null);
			});
		})
		.on(
			'keydown',
			(e: KeyboardEvent): void | false => {
				if (!editable() || e.isComposing) {
					return;
				}

				const { range } = editor.s;
				const line = lineIn(range);

				if (line && e.key === KEY_ENTER) {
					editor.e.stopPropagation('keydown');
					return enter(e, line);
				}

				if (line ? !onLine(e, line) : !atCaret(e, range)) {
					return;
				}

				editor.e.stopPropagation('keydown');
				editor.synchronizeValues();
				return false;
			},
			{ top: true }
		)
		.on('mousedown', (e: MouseEvent): void => {
			pressed = null;

			if (!editable() || e.button !== 0 || e.shiftKey) {
				return;
			}

			const line = toArray(editor.editor.getElementsByTagName('hr')).find(
				line => {
					if (e.target !== line && e.target !== line.parentNode) {
						return false;
					}

					const box = line.getBoundingClientRect();

					return (
						e.clientX >= box.left &&
						e.clientX <= box.right &&
						e.clientY >= box.top - slack &&
						e.clientY <= box.bottom + slack
					);
				}
			);

			if (line) {
				// The browser's own press would put the caret beside the line
				e.preventDefault();
				pressed = line;
				editor.s.select(line);
			}
		})
		.on('click', (): void => {
			const line = pressed;
			pressed = null;

			// After the click's own handlers, which close the popups
			line &&
				editor.async.setTimeout(
					() =>
						editor.e.fire(
							'showPopup',
							line,
							() => position(line, editor),
							'hr'
						),
					1
				);
		})
		.on('mouseup', (): void => {
			editor.async.setTimeout(leave, 1);
		})
		.on('deleteHorizontalRule', (line: HTMLHRElement): void => {
			if (editable()) {
				remove(line, true);
				editor.synchronizeValues();
			}
		});
}

pluginSystem.add('hr', hr);
