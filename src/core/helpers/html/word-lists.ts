/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

import { Dom } from 'jodit/core/dom/dom';
import { toArray } from 'jodit/core/helpers/array/to-array';
import { attr } from 'jodit/core/helpers/utils/attr';

/**
 * A Word list paragraph, read before its `mso-list` style is lost
 */
export interface WordListItem {
	paragraph: HTMLElement;
	list: string;
	level: number;
	tag: 'ul' | 'ol';
	listStyleType: string | null;
	start: number;
}

const ROMAN: Record<string, number> = {
	i: 1,
	v: 5,
	x: 10,
	l: 50,
	c: 100,
	d: 500,
	m: 1000
};

function romanValue(roman: string): number {
	let value = 0;

	for (let i = 0; i < roman.length; i += 1) {
		const current = ROMAN[roman[i]],
			next = ROMAN[roman[i + 1]] || 0;

		value += current < next ? -current : current;
	}

	return value;
}

/**
 * Word's marker text (`1.`, `b)`, `iv.`, `·`, `o`, `§`) decides the list type
 */
function parseMarker(
	marker: string
): Pick<WordListItem, 'tag' | 'listStyleType' | 'start'> {
	const text = marker.replace(/\s+/g, '');

	const decimal = /^\(?(?:\d+\.)*(\d+)[.)]?$/.exec(text);

	if (decimal) {
		return { tag: 'ol', listStyleType: null, start: Number(decimal[1]) };
	}

	const letters = /^\(?([a-z]+|[A-Z]+)[.)]$/.exec(text);

	if (letters) {
		const value = letters[1],
			lower = value.toLowerCase(),
			upper = value !== lower;

		if (/^[ivxlcdm]+$/.test(lower) && (lower.length > 1 || lower === 'i')) {
			return {
				tag: 'ol',
				listStyleType: upper ? 'upper-roman' : 'lower-roman',
				start: romanValue(lower)
			};
		}

		// Word continues a lettered list with aa, bb, ...
		if (/^([a-z])\1*$/.test(lower)) {
			return {
				tag: 'ol',
				listStyleType: upper ? 'upper-alpha' : 'lower-alpha',
				start: (lower.length - 1) * 26 + lower.charCodeAt(0) - 96
			};
		}
	}

	return { tag: 'ul', listStyleType: null, start: 1 };
}

/**
 * Removes the marker and the wrappers it leaves empty
 */
function removeMarker(marker: Node, paragraph: HTMLElement): void {
	let parent: Node | null = marker.parentNode;
	Dom.safeRemove(marker);

	while (
		parent &&
		parent !== paragraph &&
		Dom.isElement(parent) &&
		Dom.isEmpty(parent)
	) {
		const next: Node | null = parent.parentNode;
		Dom.safeRemove(parent);
		parent = next;
	}
}

/**
 * Finds Word's list paragraphs (`<p style="mso-list:l0 level1 lfo1">`), reads
 * their list, level and type from the `mso-list:Ignore` marker, and removes the
 * marker. Call it before anything strips the `mso-list` styles, then pass the
 * result to {@link wrapWordListItems}
 */
export function readWordListItems(root: HTMLElement): WordListItem[] {
	const items: WordListItem[] = [];

	toArray(root.querySelectorAll<HTMLElement>('p')).forEach(paragraph => {
		const match = /mso-list:\s*l(\d+)\s+level(\d+)(?:\s+lfo(\d+))?/i.exec(
			attr(paragraph, 'style') || ''
		);

		if (!match) {
			return;
		}

		const marker = toArray(
			paragraph.querySelectorAll<HTMLElement>('[style]')
		).find(elm => /mso-list:\s*ignore/i.test(attr(elm, 'style') || ''));

		items.push({
			paragraph,
			list: `${match[1]}:${match[3] || ''}`,
			level: Number(match[2]),
			...parseMarker(marker?.textContent || '')
		});

		if (marker) {
			removeMarker(marker, paragraph);
		}
	});

	return items;
}

function isAdjacent(prev: WordListItem, item: WordListItem): boolean {
	return (
		Dom.findSibling(
			item.paragraph,
			true,
			n => !Dom.isEmptyTextNode(n) && !Dom.isComment(n)
		) === prev.paragraph
	);
}

/**
 * Turns the paragraphs found by {@link readWordListItems} into `<ul>`/`<ol>`
 * lists, nesting them by level. Each paragraph becomes an `<li>` without Word's
 * hanging indent
 */
export function wrapWordListItems(items: WordListItem[]): void {
	let stack: Array<{
		level: number;
		list: string;
		element: HTMLElement;
		li?: HTMLElement;
	}> = [];

	const continues = items.map(
		(item, index) => index > 0 && isAdjacent(items[index - 1], item)
	);

	items.forEach((item, index) => {
		const { paragraph } = item;

		if (!continues[index]) {
			stack = [];
		}

		while (stack.length && stack[stack.length - 1].level > item.level) {
			stack.pop();
		}

		let top = stack[stack.length - 1];

		if (top && top.level === item.level && top.list !== item.list) {
			stack.pop();
			top = stack[stack.length - 1];
		}

		const doc = paragraph.ownerDocument;

		if (!top || top.level < item.level) {
			const element = doc.createElement(item.tag);

			if (item.listStyleType) {
				element.style.listStyleType = item.listStyleType;
			}

			if (item.tag === 'ol' && item.start !== 1) {
				attr(element, 'start', item.start);
			}

			if (top && top.li) {
				top.li.appendChild(element);
			} else {
				Dom.before(paragraph, element);
			}

			top = { level: item.level, list: item.list, element };
			stack.push(top);
		}

		const li = doc.createElement('li');

		toArray(paragraph.attributes).forEach(attribute => {
			if (attribute.name !== 'class') {
				li.setAttribute(attribute.name, attribute.value);
			}
		});

		li.style.removeProperty('margin-left');
		li.style.removeProperty('text-indent');

		if (!attr(li, 'style')) {
			attr(li, 'style', null);
		}

		Dom.moveContent(paragraph, li);
		Dom.safeRemove(paragraph);
		top.element.appendChild(li);
		top.li = li;
	});
}
