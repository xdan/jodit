/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../core/dom';
import { IControlType, IJodit, markerInfo } from '../types';
import { dataBind } from '../core/helpers';

const exec: IControlType<IJodit>['exec'] = (jodit, _, { control }): void => {
	const key = `button${control.command}`;

	const value = (control.args && control.args[0]) || dataBind(jodit, key);

	dataBind(jodit, key, value);

	jodit.execCommand(control.command as string, false, value);
};

Config.prototype.controls.ul = {
	command: 'insertUnorderedList',
	tags: ['ul'],
	tooltip: 'Insert Unordered List',

	list: {
		default: 'Default',
		circle: 'Circle',
		disc: 'Disc',
		square: 'Square'
	},
	exec
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
	},
	exec
} as IControlType;

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export function orderedList(editor: IJodit) {
	const isOurCommand = (command: string) =>
			/insert(un)?orderedlist/i.test(command),
		getListWrapper = () =>
			Dom.up(
				editor.s.current() as Node,
				(tag: Node | null) => tag && /^UL|OL$/i.test(tag.nodeName),
				editor.editor
			),
		listStyleTypeEqual = (el: HTMLElement, listStyleType: string) => {
			const value = el.style.listStyleType;

			return (
				value === listStyleType ||
				(!value && listStyleType === 'default')
			);
		},
		setListStyleType = (el: HTMLElement, value: string) => {
			if (value === 'default' || !value) {
				el.style.removeProperty('list-style-type');
			} else {
				el.style.setProperty('list-style-type', value);
			}
		};

	editor.e
		.on('beforeCommand', (command: string, _, listStyleType: string):
			| false
			| void => {
			if (isOurCommand(command) && listStyleType) {
				const ul = getListWrapper();

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
		.on('afterCommand', (command: string, _, listStyleType: string):
			| false
			| void => {
			if (isOurCommand(command)) {
				const ul = getListWrapper();

				if (ul) {
					setListStyleType(ul, listStyleType);
				}

				if (ul && Dom.isTag(ul.parentNode, 'p')) {
					const selection: markerInfo[] = editor.s.save();

					Dom.unwrap(ul.parentNode);

					Array.from(ul.childNodes).forEach((li: Node) => {
						if (Dom.isTag(li.lastChild, 'br')) {
							Dom.safeRemove(li.lastChild);
						}
					});

					editor.s.restore(selection);
				}

				editor.setEditorValue();
			}
		});
}
