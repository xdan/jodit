/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../core/dom';
import { IControlType, IJodit, markerInfo } from '../types';

Config.prototype.controls.ul = {
	command: 'insertUnorderedList',
	tags: ['ul'],
	tooltip: 'Insert Unordered List',

	list: {
		default: 'Default',
		circle: 'Circle',
		disc: 'Disc',
		square: 'Square'
	}
} as IControlType;

Config.prototype.controls.ol = {
	command: 'insertOrderedList',
	tags: ['ol'],
	tooltip: 'Insert Ordered List',

	list: {
		default: 'Default',
		'lower-alpha': 'Lower Alpha',
		'lower-greek': 'Lower Greek',
		'lower-roman': 'Lower Roman',
		'upper-alpha': 'Upper Alpha',
		'upper-roman': 'Upper Roman'
	}
} as IControlType;

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export function orderedList(editor: IJodit) {
	const isOurCommand = (command: string) =>
			/insert(un)?orderedlist/i.test(command),
		getWrapper = (): HTMLElement | false => {
			return Dom.up(
				editor.selection.current() as Node,
				(tag: Node | null) => tag && /^UL|OL$/i.test(tag.nodeName),
				editor.editor
			);
		},
		listStyleTypeEqual = (el: HTMLElement, listStyleType: string) => {
			const value = el.style.listStyleType;

			return (
				value === listStyleType ||
				(!value && listStyleType === 'default')
			);
		},
		setListStyleType = (el: HTMLElement, value: string) => {
			if (value === 'default') {
				el.style.removeProperty('list-style-type');
			} else {
				el.style.setProperty('list-style-type', value);
			}
		};

	editor.e
		.on('beforeCommand', (command: string, listStyleType: string):
			| false
			| void => {
			if (isOurCommand(command) && listStyleType) {
				const ul = getWrapper();

				if (ul && !listStyleTypeEqual(ul, listStyleType)) {
					if (
						(Dom.isTag(ul, 'ul') && /unordered/i.test(command)) ||
						(Dom.isTag(ul, 'ol') && !/unordered/i.test(command))
					) {
						setListStyleType(ul, listStyleType);
						return false;
					}
				}
			}
		})
		.on('afterCommand', (command: string, listStyleType: string):
			| false
			| void => {
			if (isOurCommand(command)) {
				const ul = getWrapper();

				if (ul) {
					setListStyleType(ul, listStyleType);
				}

				if (ul && Dom.isTag(ul.parentNode, 'p')) {
					const selection: markerInfo[] = editor.selection.save();

					Dom.unwrap(ul.parentNode);

					Array.from(ul.childNodes).forEach((li: Node) => {
						if (Dom.isTag(li.lastChild, 'br')) {
							Dom.safeRemove(li.lastChild);
						}
					});

					editor.selection.restore(selection);
				}
				editor.setEditorValue();
			}
		});
}
